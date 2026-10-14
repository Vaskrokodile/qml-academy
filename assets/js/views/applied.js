/* ============================================================
   QML.views.applied — Applied Mechanics track.
   Equation-only courses, gated evals, and the grind: brutal
   eqresult challenges paying the highest MMR per answer.
   Route: #/applied-mechanics
   ============================================================ */
(function () {
  const DB = QML.DB;
  const ui = QML.ui;
  QML.views = QML.views || {};

  const SESSION_LEN = 10;
  const XP_CORRECT = 25;

  const bank = () => (window.QML_APPLIED_BANK || [])
    .filter(q => q && q.eq && Array.isArray(q.options) && q.options.length === 4 && Number.isInteger(q.answer));
  const courses = () => (window.QML_COURSES || []).filter(c => c.track === 'applied');
  const evals = () => {
    const ids = new Set(courses().map(c => c.id));
    return (window.QML_EVALS || []).filter(e => ids.has(e.courseId));
  };

  /* ================= LANDING ================= */
  function landing(el) {
    const s = DB.stats();
    const a = s.applied || { total: 0, correct: 0, acc: null, mmr: 0, cap: 840 };
    const cs = courses(), evs = evals();
    const lessonsDone = cs.reduce((n, c) => n + (DB.state().courses[c.id] ? DB.state().courses[c.id].done.length : 0), 0);
    const lessonsAll = cs.reduce((n, c) => n + (c.lessons || []).length, 0);

    el.innerHTML = `
      <div class="ap-hero">
        <div class="card">
          <span class="ap-hero-ico">${QML.icon('atom', 26)}</span>
          <div class="ap-hero-title">Applied Mechanics</div>
          <p class="muted">The equation-only track. Every formula annotated — <strong>drag across any symbol</strong> to see what it does, where it sits in a QML pipeline, and where it breaks.</p>
          <ul class="qz-land-list">
            <li>${QML.icon('eye', 14)} Courses are equations + pipeline context + limitations + open problems — nothing else</li>
            <li>${QML.icon('bolt', 14)} The grind: an equation, four possible results, pick right — <b>the richest MMR per answer in the academy</b></li>
            <li>${QML.icon('target', 14)} Dragging on a symbol during the grind shows its meaning + the equation's identity card — but answer options stay silent</li>
          </ul>
          <span class="ap-mmr-chip">${QML.icon('zap', 13)} +12 MMR per correct answer · cap ${a.cap}</span>
        </div>
        <div class="card">
          <div class="ap-stat-row" style="margin-top:0">
            <div class="ap-stat"><b>${a.correct}</b><span>applied correct</span></div>
            <div class="ap-stat"><b>${a.acc == null ? '—' : a.acc + '%'}</b><span>grind accuracy</span></div>
            <div class="ap-stat"><b class="ax-mmr">+${a.mmr}</b><span>MMR earned here</span></div>
          </div>
          <div class="ap-stat-row">
            <div class="ap-stat"><b>${lessonsDone}/${lessonsAll}</b><span>lessons done</span></div>
            <div class="ap-stat"><b>${evs.filter(e => DB.evalBest(e.id) != null).length}/${evs.length}</b><span>evals attempted</span></div>
            <div class="ap-stat"><b>${(DB.srsDue() || []).filter(id => /^ax/.test(id)).length}</b><span>applied reviews due</span></div>
          </div>
          <button class="btn btn-primary btn-lg qz-start" id="ax-start" style="margin-top:16px;width:100%">
            ${QML.icon('bolt', 16)} Start the grind — ${SESSION_LEN} equations
          </button>
        </div>
      </div>

      <div class="ap-sec">
        <div class="ap-sec-head">${QML.icon('courses', 16)} Track courses — equations only</div>
        <div class="ap-grid">
          ${cs.map(c => {
            const p = DB.courseProgress(c.id, (c.lessons || []).length);
            return `<div class="card card-hover ap-course">
              <span class="qz-eval-ico">${QML.icon(c.icon || 'atom', 20)}</span>
              <div class="ap-course-title">${ui.esc(c.title)}</div>
              <div class="ap-course-desc">${ui.esc(c.subtitle || '')}</div>
              <div class="pbar"><i style="width:${p.pct}%"></i></div>
              <div class="ap-course-meta">
                <span class="muted">${p.done}/${p.total} lessons</span>
                <a class="btn btn-ghost btn-sm" href="#/course/${encodeURIComponent(c.id)}">${p.done ? 'Continue' : 'Start'} ${QML.icon('right', 12)}</a>
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>

      <div class="ap-sec">
        <div class="ap-sec-head">${QML.icon('evals', 16)} Track evals</div>
        <div class="ap-eval-row">
          ${evs.map(e => {
            const best = DB.evalBest(e.id);
            return `<div class="card card-hover ap-eval">
              <span class="qz-eval-ico">${QML.icon('target', 18)}</span>
              <div style="flex:1">
                <div class="ap-eval-name">${ui.esc(e.title)}</div>
                <div class="ap-eval-sub">${(e.questions || []).length} questions · ${e.timeMin} min${best != null ? ` · best ${best}%` : ''}</div>
              </div>
              <a class="btn btn-ghost btn-sm" href="#/eval/${encodeURIComponent(e.id)}">${best != null ? 'Retake' : 'Take'} ${QML.icon('right', 12)}</a>
            </div>`;
          }).join('')}
        </div>
      </div>`;

    el.querySelector('#ax-start').onclick = () => session(el);
  }

  /* ================= GRIND SESSION ================= */
  function session(el) {
    const pool = bank().slice();
    if (!pool.length) { el.innerHTML = ui.empty('bolt', 'Applied bank is empty'); return; }

    /* prefer SRS-due applied questions first, then unseen, then wrap */
    const due = (DB.srsDue ? DB.srsDue() : []).filter(id => pool.some(q => q.id === id));
    const seen = new Set();
    const pick = () => {
      const dueQ = due.length ? pool.find(q => q.id === due.shift() && !seen.has(q.id)) : null;
      if (dueQ) { seen.add(dueQ.id); return dueQ; }
      let fresh = pool.filter(q => !seen.has(q.id) && !(DB.state().srs || {})[q.id]);
      if (!fresh.length) fresh = pool.filter(q => !seen.has(q.id));
      if (!fresh.length) { seen.clear(); fresh = pool.slice(); }
      const q = fresh[Math.floor(Math.random() * fresh.length)];
      seen.add(q.id);
      return q;
    };

    const results = [];
    let xp = 0;

    const hud = () => {
      const d = (DB.state().challenge.days || {})[DB.today()] || { total: 0, correct: 0 };
      return `<div class="qz-hud">
        <div class="qz-hud-left">
          ${ui.flame(DB.stats().streak, DB.stats().streak > 0)}
          <span class="qz-hud-tally">${d.total} today</span>
        </div>
        <div class="qz-dots">${Array.from({ length: SESSION_LEN }, (_, i) => {
          const r = results[i];
          return `<span class="qz-dot ${i === results.length ? 'cur' : ''} ${r ? (r.ok ? 'ok' : 'bad') : ''}"></span>`;
        }).join('')}</div>
        <span class="tag warn" title="Applied answers pay +12 MMR">${QML.icon('zap', 12)} +12 MMR</span>
      </div>`;
    };

    function renderQ() {
      const q = pick();
      const eqHtml = QML.eq.block(q.eq, 'eqx-grind');
      el.innerHTML = `
        <div class="qz-exam">
          ${hud()}
          <div class="card qz-qcard qz-in">
            <div class="qz-qmeta">
              <span class="tag">${ui.esc('Applied Mechanics')}</span>
              <span class="tag warn">${QML.icon('skull', 12)} brutal</span>
              <span class="qz-qnum muted">Q${results.length + 1}/${SESSION_LEN}</span>
            </div>
            <div class="ax-eq-wrap">${eqHtml}</div>
            <div class="qz-prompt">${ui.md(q.prompt)}</div>
            <div class="ax-opts">
              ${q.options.map((o, k) => `
                <button class="ax-opt" data-k="${k}">${QML.eq.texRaw(o.t, true)}</button>`).join('')}
            </div>
            <div class="qz-explain" hidden></div>
            <div class="qz-qfoot">
              <span class="muted" id="qz-hint">No tips on the options — that's the challenge</span>
              <button class="btn btn-primary" id="qz-next" disabled>${results.length === SESSION_LEN - 1 ? 'Finish' : 'Next'} ${QML.icon('right', 15)}</button>
            </div>
          </div>
        </div>`;

      /* wire the drag-card on the question equation only */
      const eqNode = el.querySelector('.eqx');
      if (eqNode) QML.eq.bind(eqNode, q.eq);

      el.querySelectorAll('.ax-opt').forEach(b => b.onclick = () => {
        const pickI = +b.dataset.k;
        const ok = pickI === q.answer;
        results.push({ q, pick: pickI, ok });
        DB.recordAnswer(q.id, 'applied', ok);
        if (ok) { xp += XP_CORRECT; DB.addXP(XP_CORRECT, 'Applied answer'); }

        el.querySelectorAll('.ax-opt').forEach(x => {
          x.disabled = true;
          const xk = +x.dataset.k;
          if (xk === q.answer) x.classList.add('ok');
          else if (xk === pickI) x.classList.add('bad');
        });
        const ex = el.querySelector('.qz-explain');
        ex.hidden = false;
        ex.classList.add(ok ? 'ok' : 'bad');
        const hasWalk = !!(window.QML_APPLIED_WALK || {})[q.id];
        ex.innerHTML = `${QML.icon(ok ? 'check' : 'x', 16)}<div>
          <strong>${ok ? `Correct — +${XP_CORRECT} XP, +12 MMR` : `Not quite — option ${'ABCD'[q.answer]}`}</strong>
          <span>${ui.md(q.explain || '')}</span>
          ${hasWalk ? `<button class="btn btn-ghost btn-sm ax-walk-btn">${QML.icon('eye', 13)} Walk me through it — steps + visual</button>` : ''}
          </div>`;
        if (hasWalk) ex.querySelector('.ax-walk-btn').onclick = () => QML.walk.open(q, { ok });
        const nx = el.querySelector('#qz-next');
        nx.disabled = false;
        nx.focus();
        const dots = el.querySelectorAll('.qz-dot');
        if (dots[results.length - 1]) {
          dots[results.length - 1].classList.add(ok ? 'ok' : 'bad');
          dots[results.length - 1].classList.remove('cur');
        }
        const hint = el.querySelector('#qz-hint');
        if (hint) hint.textContent = ok ? 'Clean.' : 'Read the why, then move.';
      });

      el.querySelector('#qz-next').onclick = () => {
        const card = el.querySelector('.qz-qcard');
        card.classList.remove('qz-in');
        card.classList.add('qz-out');
        setTimeout(nextQ, 170);
      };
    }

    function nextQ() {
      if (results.length >= SESSION_LEN) return summary();
      renderQ();
    }

    function summary() {
      const correct = results.filter(r => r.ok).length;
      const pct = Math.round(correct / SESSION_LEN * 100);
      const perfect = correct === SESSION_LEN;
      const a = DB.stats().applied;
      el.innerHTML = `
        <div class="qz-result ${perfect ? 'qz-perfect' : ''}">
          <div class="card qz-hero qz-in">
            ${perfect ? `<div class="qz-burst">${Array.from({ length: 12 }, (_, i) =>
              `<i style="--a:${i * 30}deg;animation-delay:${i * 45}ms"></i>`).join('')}</div>` : ''}
            ${ui.ring(pct, 140, pct + '%', 10)}
            <div class="qz-hero-info">
              ${perfect ? `<span class="tag success qz-perfect-tag">Perfect grind — ${SESSION_LEN}/${SESSION_LEN}!</span>` : ''}
              <div class="qz-hero-line"><strong>${correct}/${SESSION_LEN}</strong> correct this session</div>
              <div class="muted">+${xp} XP earned</div>
              <div class="ax-mmr" style="font-size:15px">+${correct * 12} MMR banked · ${a.mmr}/${a.cap} cap reached</div>
              <div class="qz-hero-streak">${ui.flame(DB.stats().streak, DB.stats().streak > 0)}<span>${DB.stats().streak} day streak</span></div>
              <div class="qz-hero-btns">
                <button class="btn btn-primary" id="ax-again">${QML.icon('refresh', 15)} Grind again</button>
                <a class="btn btn-ghost" href="#/applied-mechanics">${QML.icon('left', 15)} Track page</a>
              </div>
            </div>
          </div>
          <div class="card section-gap">
            <div class="card-head"><div class="card-title">${QML.icon('target', 17)} Review the misses</div></div>
            ${results.filter(r => !r.ok).length ? `
              <ul class="qz-review">
                ${results.filter(r => !r.ok).map(r => `
                  <li class="qz-rev bad">
                    <span class="qz-rev-ico">${QML.icon('x', 14)}</span>
                    <div class="qz-rev-body">
                      <div class="qz-rev-q">${ui.md(r.q.prompt)}</div>
                      <div class="qz-rev-a"><span class="qz-rev-pick">You: ${'ABCD'[r.pick]}</span>
                        <span class="qz-rev-fix">${QML.icon('right', 11)} ${'ABCD'[r.q.answer]}</span></div>
                      <div class="qz-rev-x muted">${ui.md(r.q.explain || '')}</div>
                    </div>
                  </li>`).join('')}
              </ul>` : `<p class="muted">Nothing missed — machine-like run.</p>`}
          </div>
        </div>`;
      el.querySelector('#ax-again').onclick = () => session(el);
    }

    renderQ();
  }

  QML.views.applied = function (el) { landing(el); };
})();
