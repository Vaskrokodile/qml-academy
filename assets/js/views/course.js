/* ============================================================
   QML.views.course — lesson player.
   Route: #/course/<id>[/<lessonIndex>|done]

   Two-pane layout: lesson sidebar + rendered sections.
   Sections: text | points | symbols | flip | equation | quiz.
   Completing the last lesson -> completion screen.
   ============================================================ */
(function () {
  const XP_LESSON = 50;
  const LETTERS = 'ABCDEF';

  const esc = s => QML.ui.esc(s);
  const md  = s => QML.ui.md(s);
  const ytUrl = id => 'https://www.youtube.com/watch?v=' + encodeURIComponent(id);

  function findCourse(id) {
    return (window.QML_COURSES || []).find(c => c.id === id);
  }
  function evalLink(course) {
    try {
      const ev = (window.QML_EVALS || []).find(e => e.courseId === course.id)
        || (window.QML_EVALS || []).find(e => (e.themes || []).includes(course.theme));
      return ev ? '#/eval/' + encodeURIComponent(ev.id) : '#/evals';
    } catch (e) { return '#/evals'; }
  }

  /* ---------- section renderers ---------- */
  const DELAY = i => `style="--d:${Math.min(i * 70, 560)}ms"`;

  function secText(s, i) {
    return `<div class="crs-sec crs-text" ${DELAY(i)}><p>${md(s.body || '')}</p></div>`;
  }
  function secPoints(s, i) {
    return `<ul class="crs-sec crs-points" ${DELAY(i)}>
      ${(s.items || []).map(it => `<li>${md(it)}</li>`).join('')}
    </ul>`;
  }
  function secSymbols(s, i) {
    return `<div class="crs-sec crs-symbols" ${DELAY(i)}>
      ${(s.items || []).map(it => `<div class="crs-sym-row">
        <span class="crs-sym">${md(it.sym)}</span>
        <span class="crs-sym-name">${esc(it.name)}</span>
        <span class="crs-sym-desc">${md(it.desc)}</span>
      </div>`).join('')}
    </div>`;
  }
  function secFlip(s, i) {
    return `<div class="crs-sec" ${DELAY(i)}>
      <button class="crs-flip" type="button" aria-label="Flashcard — click to flip">
        <span class="crs-flip-inner">
          <span class="crs-flip-face crs-flip-front">
            <span class="crs-flip-sym">${md(s.front)}</span>
            <span class="crs-flip-hint">${QML.icon('refresh', 12)} tap to flip</span>
          </span>
          <span class="crs-flip-face crs-flip-back">
            <span class="crs-flip-label">means</span>
            <span class="crs-flip-mean">${md(s.back)}</span>
          </span>
        </span>
      </button>
    </div>`;
  }
  function secEquation(s, i) {
    return `<div class="crs-sec crs-eq" ${DELAY(i)}>
      <div class="crs-eq-body">${QML.ui.tex(s.body, true)}</div>
      ${s.desc ? `<div class="crs-eq-desc">${md(s.desc)}</div>` : ''}
    </div>`;
  }
  /* eqx — annotated equation (Applied Mechanics). spec is queued for
     wiring after innerHTML; index matches DOM order. */
  let eqxSpecs = [];
  function secEqx(s, i) {
    eqxSpecs.push(s);
    return `<div class="crs-sec" ${DELAY(i)}>${QML.eq.block(s)}</div>`;
  }
  function secQuiz(s, i) {
    const q = s.question || {};
    return `<div class="crs-sec crs-quiz" data-answer="${(q.answer | 0)}" ${DELAY(i)}>
      <div class="crs-quiz-tag">${QML.icon('target', 13)} Check yourself</div>
      <div class="crs-quiz-q">${md(q.prompt || '')}</div>
      <div class="crs-quiz-opts">
        ${(q.options || []).map((o, k) => `
          <button class="crs-opt" data-i="${k}">
            <span class="crs-opt-key">${LETTERS[k] || k + 1}</span>
            <span class="crs-opt-txt">${md(o)}</span>
          </button>`).join('')}
      </div>
      <div class="crs-conf">
        <span class="crs-conf-l">Before you answer — how sure?</span>
        ${['Guessing', '50/50', 'Sure'].map((c, k) =>
          `<button class="crs-conf-btn" data-c="${k}">${c}</button>`).join('')}
      </div>
      <div class="crs-explain">${md(q.explain || '')}</div>
      <button class="btn btn-ghost btn-sm crs-retry" hidden>${QML.icon('refresh', 13)} Try again</button>
    </div>`;
  }

  /* ---------- interactive + metacognition sections ---------- */

  /* predict: commit to an answer BEFORE the reveal (generation effect) */
  function secPredict(s, i) {
    const hasOpts = Array.isArray(s.options) && s.options.length;
    return `<div class="crs-sec crs-predict" ${DELAY(i)}>
      <div class="crs-quiz-tag crs-tag-pred">${QML.icon('zap', 13)} Predict first</div>
      <div class="crs-quiz-q">${md(s.prompt || '')}</div>
      ${hasOpts ? `<div class="crs-quiz-opts">
        ${s.options.map((o, k) => `
          <button class="crs-opt crs-pred-opt" data-i="${k}">
            <span class="crs-opt-key">${LETTERS[k] || k + 1}</span>
            <span class="crs-opt-txt">${md(o)}</span>
          </button>`).join('')}
      </div>` : `<div class="crs-pred-think muted">Decide on an answer in your head — commit to it before revealing.</div>`}
      <button class="btn btn-ghost btn-sm crs-pred-reveal">${QML.icon('check', 13)} Reveal answer</button>
      <div class="crs-pred-verdict" hidden>
        <span>How did you do?</span>
        <button class="crs-verdict-btn" data-v="1">I had it right</button>
        <button class="crs-verdict-btn" data-v="0">I missed it</button>
      </div>
      <div class="crs-explain">${md(s.reveal || '')}</div>
    </div>`;
  }

  /* steps: worked example, revealed line by line — pace the thinking */
  function secSteps(s, i) {
    return `<div class="crs-sec crs-steps" ${DELAY(i)}>
      <div class="crs-quiz-tag crs-tag-steps">${QML.icon('layers', 13)} ${esc(s.title || 'Worked example')}</div>
      ${s.hint ? `<div class="crs-steps-hint muted">${md(s.hint)}</div>` : ''}
      <ol class="crs-step-list">
        ${(s.steps || []).map((st, k) => `
          <li class="crs-step" data-k="${k}">
            <span class="crs-step-n">${k + 1}</span>
            <span class="crs-step-body">${md(st)}</span>
          </li>`).join('')}
      </ol>
      <button class="btn btn-ghost btn-sm crs-step-btn">${QML.icon('right', 13)} Next step</button>
    </div>`;
  }

  /* reflect: self-explanation — type it out loud, then compare to a model answer */
  function secReflect(s, i) {
    return `<div class="crs-sec crs-reflect" ${DELAY(i)}>
      <div class="crs-quiz-tag crs-tag-ref">${QML.icon('spark', 13)} Explain it back</div>
      <div class="crs-quiz-q">${md(s.prompt || '')}</div>
      <textarea class="crs-refl-ta" rows="2" placeholder="Type it in your own words — or just say it out loud, then compare."></textarea>
      <div class="crs-refl-btns">
        <button class="btn btn-ghost btn-sm crs-refl-btn">${QML.icon('check', 13)} Show a model answer</button>
        <button class="btn btn-ghost btn-sm crs-refl-pin" data-pin="${esc((s.model || s.prompt || '').replace(/\$|\\[a-zA-Z]+|[{}_^]/g, '').slice(0, 90))}" hidden>${QML.icon('layers', 13)} Pin to palace</button>
      </div>
      <div class="crs-refl-model">${md(s.model || '')}</div>
    </div>`;
  }

  /* explore: touchable widget.
     'amplitudes' — drag θ, watch |ψ⟩ = cos(θ/2)|0⟩ + sin(θ/2)|1⟩.
     'bloch'      — live 3D Bloch sphere; gate buttons rotate the state. */
  function secExplore(s, i) {
    if (s.widget === 'bloch') return secBloch(s, i);
    if (s.widget !== 'amplitudes') return '';
    return `<div class="crs-sec crs-explore" ${DELAY(i)}>
      <div class="crs-quiz-tag crs-tag-xp">${QML.icon('atom', 13)} ${esc(s.title || 'Play with it')}</div>
      ${s.note ? `<div class="crs-steps-hint muted">${md(s.note)}</div>` : ''}
      <div class="crs-xp">
        <label class="crs-xp-lab">θ = <b class="mono" id="xp-deg">0°</b></label>
        <input class="crs-xp-slider" type="range" min="0" max="180" step="1" value="0">
        <div class="crs-xp-state" id="xp-state"></div>
        <div class="crs-xp-bars">
          <div class="crs-xp-bar">
            <span class="crs-xp-bl">P(0)</span>
            <div class="crs-xp-track"><i id="xp-b0"></i></div>
            <b class="mono" id="xp-p0">100%</b>
          </div>
          <div class="crs-xp-bar">
            <span class="crs-xp-bl">P(1)</span>
            <div class="crs-xp-track"><i id="xp-b1"></i></div>
            <b class="mono" id="xp-p1">0%</b>
          </div>
        </div>
        <div class="crs-xp-foot">
          <button class="btn btn-primary btn-sm" id="xp-measure">${QML.icon('atom', 14)} Measure</button>
          <span class="crs-xp-out mono" id="xp-out"></span>
          <span class="crs-xp-tally muted mono" id="xp-tally"></span>
        </div>
      </div>
    </div>`;
  }

  /* bloch widget — drives the viz3d 'lab' scene: Pauli/H/phase buttons,
     parametric R-gates with an angle slider, live state readout, and a
     Measure that samples the computational-basis outcome. */
  function secBloch(s, i) {
    const gates = s.gates || ['X', 'Y', 'Z', 'H', 'S', 'T'];
    return `<div class="crs-sec crs-explore" ${DELAY(i)}>
      <div class="crs-quiz-tag crs-tag-xp">${QML.icon('orbit3d', 13)} ${esc(s.title || 'Bloch sphere lab — apply gates, watch the state move')}</div>
      ${s.note ? `<div class="crs-steps-hint muted">${md(s.note)}</div>` : ''}
      <div class="crs-bloch" data-bloch
        data-gates="${esc(gates.join(','))}"
        data-start="${esc(s.start || '')}">
        <div class="crs-bloch-mount"></div>
        <div class="crs-bloch-side">
          <div class="crs-bloch-read">
            <div class="crs-bloch-ket mono" data-bloch-ket>|ψ⟩ = |0⟩</div>
            <div class="crs-bloch-coord mono muted" data-bloch-coord>r = (0, 0, 1)</div>
            <div class="crs-bloch-p mono muted" data-bloch-p>P(0) 100% · P(1) 0%</div>
          </div>
          <div class="crs-bloch-gates" data-bloch-gates></div>
          <div class="crs-bloch-rot">
            <label class="muted">Rotation <b class="mono" data-bloch-anglab>90°</b>
              <input type="range" min="15" max="180" step="15" value="90" data-bloch-angle>
            </label>
            <div class="crs-bloch-gates">
              <button class="btn btn-ghost btn-sm" data-gate="Rx">Rx</button>
              <button class="btn btn-ghost btn-sm" data-gate="Ry">Ry</button>
              <button class="btn btn-ghost btn-sm" data-gate="Rz">Rz</button>
            </div>
          </div>
          <div class="crs-bloch-foot">
            <button class="btn btn-primary btn-sm" data-bloch-measure>${QML.icon('atom', 13)} Measure</button>
            <span class="crs-bloch-out mono" data-bloch-out></span>
            <button class="btn btn-ghost btn-sm" data-bloch-reset>${QML.icon('refresh', 13)} Reset |0⟩</button>
          </div>
        </div>
      </div>
    </div>`;
  }
  function renderSection(s, i) {
    switch (s && s.type) {
      case 'text':     return secText(s, i);
      case 'points':   return secPoints(s, i);
      case 'symbols':  return secSymbols(s, i);
      case 'flip':     return secFlip(s, i);
      case 'equation': return secEquation(s, i);
      case 'eqx':      return secEqx(s, i);
      case 'quiz':     return secQuiz(s, i);
      case 'predict':  return secPredict(s, i);
      case 'steps':    return secSteps(s, i);
      case 'reflect':  return secReflect(s, i);
      case 'explore':  return secExplore(s, i);
      default:         return '';
    }
  }

  /* ---------- completion screen ---------- */
  function renderDone(el, course) {
    const ui = QML.ui;
    const total = (course.lessons || []).length;
    const xp = total * XP_LESSON + 150;
    el.innerHTML = `
      <div class="crs-done">
        <div class="crs-done-ring">${ui.ring(100, 132)}</div>
        <div class="crs-done-check">${QML.icon('trophy', 30)}</div>
        <div class="crs-done-title">${esc(course.title)} — complete</div>
        <div class="crs-done-sub">You finished all ${total} lessons. Roughly ${esc(String(course.estMin || 0))} minutes of quantum in the bank.</div>
        <div class="crs-done-stats">
          <span class="tag success">${QML.icon('check', 12)} ${total}/${total} lessons</span>
          <span class="tag warn">+${xp} XP earned</span>
        </div>
        <div class="crs-done-actions">
          <a class="btn btn-ghost" href="#/courses">${QML.icon('left', 15)} Back to courses</a>
          <a class="btn btn-primary" href="${evalLink(course)}">Take the eval ${QML.icon('right', 15)}</a>
        </div>
      </div>`;
  }

  /* ---------- main view ---------- */
  QML.views = QML.views || {};
  QML.views.course = function (el, params) {
    const ui = QML.ui, DB = QML.DB;
    params = params || [];
    const course = findCourse(params[0]);

    if (!course) {
      el.innerHTML = ui.empty('courses', 'Course not found', 'It may have been renamed or removed.')
        + `<div style="text-align:center"><a class="btn btn-ghost btn-sm" href="#/courses">${QML.icon('left', 14)} All courses</a></div>`;
      return;
    }

    const lessons = course.lessons || [];
    const total = lessons.length;
    if (!total) {
      el.innerHTML = ui.empty('book', 'No lessons in this course yet');
      return;
    }

    const prog = DB.courseProgress(course.id, total);

    /* #/course/<id>/done — completion screen if actually finished */
    if (params[1] === 'done') {
      if (prog.pct === 100) { renderDone(el, course); return; }
      params[1] = '0';
    }

    let idx = parseInt(params[1], 10);
    if (isNaN(idx)) idx = 0;
    idx = Math.min(Math.max(idx, 0), total - 1);

    const lesson = lessons[idx];
    const isDone = DB.isLessonDone(course.id, lesson.id);
    const isLast = idx === total - 1;

    /* ---- sidebar ---- */
    const side = `
      <aside class="crs-side">
        <a class="crs-back" href="#/courses">${QML.icon('left', 14)} All courses</a>
        <div class="crs-side-head">
          <span class="crs-icon crs-icon-sm">${QML.icon(course.icon || 'book', 20)}</span>
          <div class="crs-side-head-txt">
            <div class="crs-side-title">${esc(course.title)}</div>
            <div class="crs-side-sub">${total} lesson${total === 1 ? '' : 's'} · ${esc(String(course.estMin || 0))} min</div>
          </div>
        </div>
        <div class="pbar"><i style="width:${prog.pct}%"></i></div>
        <div class="crs-side-pct">${prog.done}/${total} complete${prog.pct === 100 ? ' · done' : ''}</div>
        <nav class="crs-lessons">
          ${(() => {
            const partEvals = (window.QML_EVALS || []).filter(e => e.courseId === course.id);
            let prevPart = null;
            return lessons.map((l, k) => {
              const d = DB.isLessonDone(course.id, l.id);
              let head = '', gate = '';
              if (l.part && l.part !== prevPart) {
                prevPart = l.part;
                head = `<div class="crs-part">${esc(l.part)}</div>`;
              }
              const lastOfPart = k === total - 1 || lessons[k + 1].part !== l.part;
              if (lastOfPart) {
                const ev = partEvals.find(e => e.part === l.part);
                if (ev) {
                  const best = DB.evalBest(ev.id);
                  gate = `<a class="crs-gate" href="#/eval/${encodeURIComponent(ev.id)}">
                    ${QML.icon('target', 12)} ${esc(ev.title)}${best != null ? ` <span class="crs-gate-best">${best}%</span>` : ''}
                  </a>`;
                }
              }
              return head + `<a class="crs-li ${k === idx ? 'active' : ''} ${d ? 'done' : ''}" href="#/course/${esc(course.id)}/${k}">
                <span class="crs-li-num">${d ? QML.icon('check', 11) : k + 1}</span>
                <span class="crs-li-title">${esc(l.title)}</span>
              </a>` + gate;
            }).join('');
          })()}
        </nav>
      </aside>`;

    /* ---- bottom nav ---- */
    const prevBtn = idx > 0
      ? `<a class="btn btn-ghost" href="#/course/${esc(course.id)}/${idx - 1}">${QML.icon('left', 15)} Previous</a>`
      : `<span class="btn btn-ghost" disabled>${QML.icon('left', 15)} Previous</span>`;

    let nextBtn;
    if (isDone) {
      nextBtn = isLast
        ? `<a class="btn btn-primary" href="#/course/${esc(course.id)}/done">Finish course ${QML.icon('right', 15)}</a>`
        : `<a class="btn btn-primary" href="#/course/${esc(course.id)}/${idx + 1}">Next lesson ${QML.icon('right', 15)}</a>`;
    } else {
      nextBtn = `<button class="btn btn-primary crs-complete">${QML.icon('check', 15)} Mark complete · +${XP_LESSON} XP</button>`;
    }

    /* ---- assemble ---- */
    eqxSpecs = [];
    el.innerHTML = `
      <div class="crs-player">
        ${side}
        <section class="crs-main">
          <div class="crs-lesson-head">
            <div class="crs-kicker">Lesson ${idx + 1} of ${total}${isDone ? ' · completed' : ''}</div>
            <h1 class="crs-lesson-title">${esc(lesson.title)}</h1>
            ${lesson.videoId ? `
              <a class="crs-video" href="${ytUrl(lesson.videoId)}" target="_blank" rel="noopener noreferrer">
                ${QML.icon('play', 13)} Watch lecture${lesson.videoTitle ? ` — ${esc(lesson.videoTitle)}` : ''}
              </a>` : ''}
          </div>
          <div class="crs-body">
            ${(lesson.sections || []).map(renderSection).join('')}
          </div>
          <div class="crs-nav">
            ${prevBtn}
            <div class="crs-nav-mid">${prog.done}/${total} lessons done</div>
            ${nextBtn}
          </div>
        </section>
      </div>`;

    /* ---- wire: flashcards ---- */
    el.querySelectorAll('.crs-flip').forEach(f => {
      f.onclick = () => f.classList.toggle('flipped');
    });

    /* ---- wire: eqx drag-cards (Applied Mechanics) ---- */
    el.querySelectorAll('.eqx').forEach((node, i) => {
      if (QML.eq && eqxSpecs[i]) QML.eq.bind(node, eqxSpecs[i]);
    });

    /* ---- wire: quizzes (with confidence → calibration feedback) ---- */
    el.querySelectorAll('.crs-quiz').forEach(qz => {
      const answer = +qz.dataset.answer;
      const opts = qz.querySelectorAll('.crs-opt');
      const explain = qz.querySelector('.crs-explain');
      const retry = qz.querySelector('.crs-retry');
      const confBtns = qz.querySelectorAll('.crs-conf-btn');
      let conf = -1;
      confBtns.forEach(b => b.onclick = () => {
        conf = +b.dataset.c;
        confBtns.forEach(x => x.classList.toggle('picked', x === b));
      });
      const CALIB = [
        ['Lucky guess — read the why below so it sticks.', 'As you suspected — now learn the reason.'],
        ['50/50 and right — honest assessment.', '50/50 and missed — now you know.'],
        ['You called it — confident and correct.', 'You were sure but missed it — flag this one, it\'s the gap to hunt.'],
      ];
      opts.forEach(btn => {
        btn.onclick = () => {
          if (qz.classList.contains('answered')) return;
          qz.classList.add('answered');
          const k = +btn.dataset.i;
          const ok = k === answer;
          if (ok) btn.classList.add('correct');
          else {
            btn.classList.add('wrong');
            if (opts[answer]) opts[answer].classList.add('correct');
          }
          if (explain) {
            explain.classList.add('show');
            if (conf >= 0) {
              const note = document.createElement('div');
              note.className = 'crs-calib ' + (ok ? 'ok' : 'bad');
              note.textContent = CALIB[conf][ok ? 0 : 1];
              explain.prepend(note);
            }
          }
          if (retry) retry.hidden = false;
          const cta = el.querySelector('.crs-complete');
          if (cta) cta.classList.add('ready');
        };
      });
      if (retry) retry.onclick = () => {
        qz.classList.remove('answered');
        opts.forEach(b => b.classList.remove('correct', 'wrong'));
        if (explain) {
          explain.classList.remove('show');
          const n = explain.querySelector('.crs-calib'); if (n) n.remove();
        }
        retry.hidden = true;
      };
    });

    /* ---- wire: predict (commit → reveal → self-report) ---- */
    el.querySelectorAll('.crs-predict').forEach(pd => {
      const opts = pd.querySelectorAll('.crs-pred-opt');
      const reveal = pd.querySelector('.crs-pred-reveal');
      const verdict = pd.querySelector('.crs-pred-verdict');
      const explain = pd.querySelector('.crs-explain');
      let picked = -1;
      opts.forEach(b => b.onclick = () => {
        picked = +b.dataset.i;
        opts.forEach(x => x.classList.toggle('picked', x === b));
      });
      reveal.onclick = () => {
        reveal.hidden = true;
        explain.classList.add('show');
        verdict.hidden = false;
        opts.forEach((b, k) => b.classList.add(k === picked ? 'picked lock' : 'lock'));
        const cta = el.querySelector('.crs-complete');
        if (cta) cta.classList.add('ready');
      };
      verdict.querySelectorAll('.crs-verdict-btn').forEach(b => b.onclick = () => {
        verdict.hidden = true;
        const tag = document.createElement('div');
        tag.className = 'crs-calib ' + (b.dataset.v === '1' ? 'ok' : 'bad');
        tag.textContent = b.dataset.v === '1'
          ? 'Self-check passed — predicting first makes it stick.'
          : 'Honest miss — those are the ones your memory keeps.';
        explain.prepend(tag);
      });
    });

    /* ---- wire: steps ---- */
    el.querySelectorAll('.crs-steps').forEach(st => {
      const items = [...st.querySelectorAll('.crs-step')];
      const btn = st.querySelector('.crs-step-btn');
      let shown = 0;
      const paint = () => {
        items.forEach((li, k) => li.classList.toggle('shown', k < shown));
        btn.hidden = shown >= items.length;
        if (shown === items.length) {
          const cta = el.querySelector('.crs-complete');
          if (cta) cta.classList.add('ready');
        }
      };
      btn.onclick = () => { shown = Math.min(shown + 1, items.length); paint(); };
      paint();
    });

    /* ---- wire: reflect ---- */
    el.querySelectorAll('.crs-reflect').forEach(rf => {
      const btn = rf.querySelector('.crs-refl-btn');
      const pin = rf.querySelector('.crs-refl-pin');
      const model = rf.querySelector('.crs-refl-model');
      btn.onclick = () => {
        model.classList.add('show');
        btn.hidden = true;
        if (pin) pin.hidden = false;
        const cta = el.querySelector('.crs-complete');
        if (cta) cta.classList.add('ready');
      };
      if (pin) pin.onclick = () => QML.ui.pinModal(pin.dataset.pin);
    });

    /* ---- wire: explore / amplitudes widget ---- */
    el.querySelectorAll('.crs-explore').forEach(xp => {
      const slider = xp.querySelector('.crs-xp-slider');
      const deg = xp.querySelector('#xp-deg');
      const state = xp.querySelector('#xp-state');
      const b0 = xp.querySelector('#xp-b0'), b1 = xp.querySelector('#xp-b1');
      const p0 = xp.querySelector('#xp-p0'), p1 = xp.querySelector('#xp-p1');
      const out = xp.querySelector('#xp-out');
      const tally = xp.querySelector('#xp-tally');
      const meas = xp.querySelector('#xp-measure');
      let n0 = 0, n1 = 0;
      const paintXp = () => {
        const th = +slider.value * Math.PI / 180;
        const c = Math.cos(th / 2), s = Math.sin(th / 2);
        const q0 = c * c, q1 = s * s;
        deg.textContent = slider.value + '°';
        b0.style.width = (q0 * 100).toFixed(1) + '%';
        b1.style.width = (q1 * 100).toFixed(1) + '%';
        p0.textContent = (q0 * 100).toFixed(1) + '%';
        p1.textContent = (q1 * 100).toFixed(1) + '%';
        state.innerHTML = QML.ui.tex(
          `|\\psi\\rangle = ${c.toFixed(2)}|0\\rangle + ${s.toFixed(2)}|1\\rangle`, false);
      };
      slider.oninput = () => { paintXp(); out.textContent = ''; };
      meas.onclick = () => {
        const th = +slider.value * Math.PI / 180;
        const q1 = Math.sin(th / 2) ** 2;
        const hit = Math.random() < q1;
        if (hit) n1++; else n0++;
        out.innerHTML = `collapses to ${QML.ui.tex('|' + (hit ? 1 : 0) + '\\rangle', false)}`;
        tally.textContent = `0:${n0} · 1:${n1}`;
        xp.classList.remove('xp-flash'); void xp.offsetWidth; xp.classList.add('xp-flash');
      };
      paintXp();
    });

    /* ---- wire: bloch lab widgets ---- */
    const blochCleanups = [];
    el.querySelectorAll('.crs-bloch').forEach(bl => {
      const mount = bl.querySelector('.crs-bloch-mount');
      if (!window.QML.viz3d) { mount.innerHTML = '<div class="muted" style="padding:18px">3D unavailable</div>'; return; }
      let h;
      try { h = QML.viz3d.create(mount, 'bloch', { mode: 'lab' }); }
      catch (e) { mount.innerHTML = '<div class="muted" style="padding:18px">3D unavailable — ' + esc(String(e.message || e)) + '</div>'; return; }
      if (!h.api) return;
      const api = h.api;
      const ketEl = bl.querySelector('[data-bloch-ket]');
      const coordEl = bl.querySelector('[data-bloch-coord]');
      const pEl = bl.querySelector('[data-bloch-p]');
      const outEl = bl.querySelector('[data-bloch-out]');
      const gateRow = bl.querySelector('[data-bloch-gates]');
      const angle = bl.querySelector('[data-bloch-angle]');
      const angLab = bl.querySelector('[data-bloch-anglab]');

      /* gate buttons from data-gates */
      (bl.dataset.gates || '').split(',').filter(Boolean).forEach(g => {
        const b = document.createElement('button');
        b.className = 'btn btn-ghost btn-sm crs-bloch-gate';
        b.textContent = g;
        b.onclick = () => { api.gate(g); outEl.textContent = ''; };
        gateRow.appendChild(b);
      });

      /* parametric rotations */
      angle.oninput = () => { angLab.textContent = angle.value + '°'; };
      bl.querySelectorAll('[data-gate]').forEach(b => b.onclick = () => {
        api.gate(b.dataset.gate + '(' + angle.value + ')');
        outEl.textContent = '';
      });

      /* optional starting state: e.g. data-start="+" / "-i" */
      const STARTS = { '0': { x: 0, y: 0, z: 1 }, '1': { x: 0, y: 0, z: -1 },
        '+': { x: 1, y: 0, z: 0 }, '-': { x: -1, y: 0, z: 0 },
        '+i': { x: 0, y: 1, z: 0 }, '-i': { x: 0, y: -1, z: 0 } };
      const st0 = (bl.dataset.start || '').replace(/[|⟩\s]/g, '');
      if (STARTS[st0]) api.set(STARTS[st0]);

      /* nearest basis label + ket amplitude readout */
      const nearState = b => [['|0⟩', b.z], ['|1⟩', -b.z], ['|+⟩', b.x], ['|−⟩', -b.x], ['|+i⟩', b.y], ['|−i⟩', -b.y]]
        .sort((a, c) => c[1] - a[1])[0][0];
      const fmt = v => (Math.abs(v) < 0.005 ? '0' : v.toFixed(2));
      const readout = () => {
        const b = api.get();
        const p0 = (1 + b.z) / 2, p1 = 1 - p0;
        const a = Math.sqrt(Math.max(0, p0));
        const phase = Math.atan2(b.y, b.x);
        ketEl.innerHTML = QML.ui.tex(
          `|\\psi\\rangle \\approx ${fmt(a)}|0\\rangle + e^{i ${fmt(phase)}} ${fmt(Math.sqrt(Math.max(0, p1)))}|1\\rangle`, false);
        coordEl.textContent = `r = (${fmt(b.x)}, ${fmt(b.y)}, ${fmt(b.z)})  ·  nearest: ${nearState(b)}`;
        pEl.textContent = `P(0) ${Math.round(p0 * 100)}% · P(1) ${Math.round(p1 * 100)}%`;
      };
      const iv = setInterval(readout, 160); readout();

      /* measure: sample P(1), collapse arrow to the outcome pole */
      let n0 = 0, n1 = 0;
      bl.querySelector('[data-bloch-measure]').onclick = () => {
        const b = api.get();
        const hit = Math.random() < (1 - b.z) / 2;
        if (hit) n1++; else n0++;
        api.set(hit ? { x: 0, y: 0, z: -1 } : { x: 0, y: 0, z: 1 });
        outEl.textContent = `→ |${hit ? 1 : 0}⟩   tally 0:${n0} · 1:${n1}`;
      };
      bl.querySelector('[data-bloch-reset]').onclick = () => {
        api.gate('reset'); outEl.textContent = '';
      };

      blochCleanups.push(() => { clearInterval(iv); h.dispose(); });
    });
    /* dispose 3D scenes when the view re-renders or user navigates away */
    if (blochCleanups.length) {
      const prev = window.QML_SCENE_CLEANUP;
      window.QML_SCENE_CLEANUP = () => { prev && prev(); blochCleanups.forEach(f => { try { f(); } catch (e) {} }); };
    }

    /* ---- wire: mark complete ---- */
    const completeBtn = el.querySelector('.crs-complete');
    if (completeBtn) {
      completeBtn.onclick = () => {
        completeBtn.disabled = true;
        DB.completeLesson(course.id, lesson.id, XP_LESSON); // toasts +XP internally on first time
        if (isLast) {
          DB.markCourseComplete(course.id);
          location.hash = '#/course/' + course.id + '/done';
        } else {
          location.hash = '#/course/' + course.id + '/' + (idx + 1);
        }
      };
    }
  };
})();
