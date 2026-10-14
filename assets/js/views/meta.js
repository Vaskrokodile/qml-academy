/* ============================================================
   QML.views.meta — "Meta-Challenges": wire symbols & equations
   to their pictures. 8-question adaptive sessions drawn only
   from QML_META_QUESTIONS (Bloch spheres, circuits, histograms,
   matrices, curves, density heatmaps, pipelines, equation tiles).
   Answers record under topic 'meta' + per-domain metaDomains.
   Route: #/meta-challenges
   ============================================================ */
(function () {
  const DB = QML.DB;
  const ui = QML.ui;
  QML.views = QML.views || {};

  const SESSION_LEN = 8;
  const dName = id => (DB.TOPICS.find(t => t.id === id) || {}).name || id;
  const diffName = d => ['Easy', 'Easy', 'Medium', 'Hard'][Math.min(Math.max(d || 1, 1), 3)];
  const DOMAINS = DB.TOPICS.filter(t => !['symbols', 'meta'].includes(t.id));

  const bank = () => (window.QML_META_QUESTIONS || []).filter(q =>
    q && q.prompt && Array.isArray(q.options) && q.options.length === 4 && Number.isInteger(q.answer));

  const domAcc = id => {
    const d = (DB.state().metaDomains || {})[id];
    return d && d.seen ? { seen: d.seen, acc: Math.round(d.correct / d.seen * 100) } : null;
  };

  function weakDomains() {
    return DOMAINS.map(t => {
      const d = (DB.state().metaDomains || {})[t.id];
      const acc = d && d.seen >= 2 ? d.correct / d.seen : 0.5;
      return { id: t.id, acc, seen: d ? d.seen : 0 };
    }).sort((a, b) => a.acc - b.acc || b.seen - a.seen).map(x => x.id);
  }

  function makePicker(pool) {
    const weak = weakDomains();
    const weakHalf = new Set(weak.slice(0, Math.ceil(weak.length / 2)));
    const rank = {};
    weak.forEach((id, i) => { rank[id] = weak.length - i; });
    const acc = {};
    DOMAINS.forEach(t => { acc[t.id] = domAcc(t.id); });
    const seen = new Set();
    let diff = 1, run = 0;
    return {
      get diff() { return diff; },
      next() {
        let cand = pool.filter(q => !seen.has(q.id));
        if (!cand.length) { seen.clear(); cand = pool.slice(); }
        const score = q => {
          const t = acc[q.domain];
          const tAcc = t ? t.acc : 50;
          return (weakHalf.has(q.domain) ? 2.5 : 0)
            + (rank[q.domain] || 0) / weak.length * 2
            + (100 - tAcc) / 100 * 1.5
            + (!t ? 1.2 : t.seen < 3 ? 0.6 : 0)
            + (2 - Math.abs((q.diff || 1) - diff))
            + Math.random() * 0.8;
        };
        let best = cand[0], bs = -Infinity;
        for (const q of cand) { const s = score(q); if (s > bs) { bs = s; best = q; } }
        seen.add(best.id);
        return best;
      },
      answer(ok) {
        if (ok) { run++; if (run >= 2 && diff < 3) { diff++; run = 0; } }
        else { run = 0; diff = Math.max(1, diff - 1); }
      },
    };
  }

  /* option button body: visual tile or markdown text */
  const optBody = (q, k) =>
    q.vizOptions && q.vizOptions[k] ? `<span class="meta-opt-viz">${QML.viz(q.vizOptions[k])}</span>` : ui.md(q.options[k]);

  const KIND_NAME = { blochset: 'build the state', gateseq: 'build the circuit', predict: 'predict it', selfexp: 'explain it' };

  /* ---------- calibration & clinic cards (metacognition research) ---------- */
  function calibCard() {
    const c = DB.calibration ? DB.calibration() : null;
    if (!c) return '';
    const score = Math.round((1 - c.brier) * 100);
    const bin = (k, lab) => {
      const b = c.bins[k];
      const acc = b.seen ? Math.round(b.correct / b.seen * 100) : null;
      return `<div class="calib-bin"><small>${lab}</small><b>${acc == null ? '—' : acc + '%'}</b>
        <span class="muted" style="font-size:10px">${b.seen}×</span>
        <div class="pbar"><i style="width:${acc || 0}%"></i></div></div>`;
    };
    return `<div class="card section-gap">
      <div class="card-head"><div class="card-title">${QML.icon('eye', 17)} Calibration</div>
        <span class="muted">how well you know what you know</span></div>
      <div class="calib-card">
        <div><div style="font-family:var(--font-display);font-size:26px;font-weight:700">${score}<small style="font-size:13px;color:var(--text-3)">%</small></div>
          <div class="muted" style="font-size:11.5px">Brier score · ${c.n} judgments</div></div>
        <div class="calib-bins">
          ${bin('low', 'said low')}
          ${bin('med', 'said mid')}
          ${bin('high', 'said high')}
        </div>
      </div>
      <p class="muted" style="font-size:12px;margin-top:8px">Each bar: your accuracy when you felt that confident.
        Perfect calibration = high-confidence bars near 100%, low near 0%. High-confidence misses go to the clinic below.</p>
    </div>`;
  }

  function clinicCard() {
    const qids = DB.confQueue ? DB.confQueue() : [];
    if (!qids.length) return '';
    const bankAll = bank();
    const items = qids.map(id => bankAll.find(q => q.id === id)).filter(Boolean);
    return `<div class="card section-gap">
      <div class="card-head"><div class="card-title">${QML.icon('flask', 17)} Confident-error clinic</div>
        <span class="muted">${qids.length} high-confidence miss${qids.length === 1 ? '' : 'es'} awaiting retest</span></div>
      <p class="muted" style="font-size:12px;margin-bottom:8px">You were ≥80% sure and wrong — the highest-value material there is
        (hypercorrection, Butterfield &amp; Metcalfe 2001). Two clean retests clear each item.</p>
      ${items.map(q => `<div class="conferr-item">
        <span class="conferr-item">${QML.icon('flask', 15)}</span>
        <div style="flex:1;min-width:0"><div style="font-size:13px">${ui.md(String(q.prompt).slice(0, 110))}${String(q.prompt).length > 110 ? '…' : ''}</div>
          <div class="qid">${ui.esc(q.id)} · ${ui.esc(dName(q.domain))}</div></div>
        <button class="btn btn-ghost btn-sm" data-clinic="${ui.esc(q.id)}">Retest ${QML.icon('right', 11)}</button>
      </div>`).join('')}
    </div>`;
  }

  /* Modal retest for a confident-error item */
  function clinicRetest(qid) {
    const q = bank().find(x => x.id === qid);
    if (!q) return;
    const ov = ui.modal(`
      <div class="rm-head"><div class="card-title">${QML.icon('flask')} Confident-error retest</div>
        <button class="btn btn-ghost" onclick="this.closest('.modal-ov').remove()">Close</button></div>
      <div class="qz-prompt" style="font-size:14.5px">${ui.md(q.prompt)}</div>
      ${q.viz ? `<div class="meta-viz-prompt">${QML.viz(q.viz)}</div>` : ''}
      ${q.kind && q.kind !== 'mcq' ? `<div class="ix-host"></div>` : `
      <div class="qz-opts">${q.options.map((o, k) => `
        <button class="qz-opt" data-k="${k}"><span class="qz-letter">${'ABCD'[k]}</span><span class="qz-opt-txt">${optBody(q, k)}</span></button>`).join('')}</div>`}
      <div class="qz-explain" hidden></div>`);
    const finish = (ok, extra) => {
      DB.recordConfRetest(qid, ok);
      DB.recordAnswer(q.id, 'meta', ok);
      DB.recordMetaDomain(q.domain, ok);
      const ex = ov.querySelector('.qz-explain');
      ex.hidden = false; ex.classList.add(ok ? 'ok' : 'bad');
      ex.innerHTML = `${QML.icon(ok ? 'check' : 'x', 16)}<div><strong>${ok ? 'Clean retrieval — counted toward clearing' : 'Still shaky — stays in the queue'}</strong><span>${ui.md(q.explain || '')}${extra ? ' · ' + extra : ''}</span></div>`;
      setTimeout(() => { ov.remove(); QML.render(); }, 2200);
    };
    if (q.kind && q.kind !== 'mcq' && QML.ix && QML.ix[q.kind]) {
      QML.ix[q.kind](ov.querySelector('.ix-host'), q, r => finish(r.ok, r.detail));
    } else {
      ov.querySelectorAll('.qz-opt').forEach(b => b.onclick = () => {
        const ok = +b.dataset.k === q.answer;
        ov.querySelectorAll('.qz-opt').forEach(x => {
          x.disabled = true;
          if (+x.dataset.k === q.answer) x.classList.add('ok');
          else if (x === b) x.classList.add('bad');
        });
        finish(ok);
      });
    }
  }

  /* ================= VIEW ================= */
  QML.views.meta = function (el) {
    if (!bank().length) {
      el.innerHTML = ui.empty('target', 'Meta-challenge bank is empty', 'Visual questions unlock once data/meta.js is loaded.');
      return;
    }
    landing();

    function landing() {
      const s = DB.stats();
      const st = DB.state();
      const metaTopic = (st.challenge.topics || {}).meta;
      const metaAcc = metaTopic && metaTopic.seen ? Math.round(metaTopic.correct / metaTopic.seen * 100) : null;
      const weak3 = weakDomains().slice(0, 3);
      const evals = (window.QML_EVALS || []).filter(e => e.meta);

      /* visual alphabet — one live example per viz kind */
      const ALPHABET = [
        { name: 'Bloch vector', viz: { type: 'bloch', state: 'plus' }, note: 'states as arrows on the sphere' },
        { name: 'Amplitudes', viz: { type: 'amps', amps: [0.707, -0.707], labels: ['|0⟩', '|1⟩'] }, note: 'signed bars — phases matter' },
        { name: 'Probabilities', viz: { type: 'bars', probs: [0.5, 0.5], labels: ['0', '1'] }, note: 'what shots actually show' },
        { name: 'Circuits', viz: { type: 'circuit', wires: ['q0', 'q1'], gates: [{ g: 'H', w: 0 }, { g: 'CX', c: 0, t: 1 }] }, note: 'wires, gates, control dots' },
        { name: 'Gate matrices', viz: { type: 'matrix', m: [[0, 1], [1, 0]] }, note: 'operators as grids of numbers' },
        { name: 'Curves', viz: { type: 'curve', shape: 'drop', xlabel: 't', ylabel: 'C' }, note: 'landscapes, decays, schedules' },
        { name: 'Density heatmaps', viz: { type: 'heat', cells: [[0.5, 0.5], [0.5, 0.5]] }, note: 'ρ as brightness: populations + coherence' },
        { name: 'Pipelines', viz: { type: 'flow', nodes: ['x', 'Φ(x)', '|ψ(x)⟩'], hi: 1 }, note: 'algorithms as block diagrams' },
      ];

      el.innerHTML = `
        <div class="qz-land">
          <div class="card qz-land-hero">
            <span class="qz-land-ico">${QML.icon('target', 26)}</span>
            <div>
              <div class="qz-land-title">Meta-challenges</div>
              <p class="muted">${SESSION_LEN} visual puzzles that train the <strong>symbol ↔ picture</strong> mapping — Bloch spheres, circuits, histograms, matrices, landscapes and density heatmaps.</p>
              <ul class="qz-land-list">
                <li>${QML.icon('pencil', 14)} <b>Build it yourself</b> — drag the Bloch vector, click gate sequences, sketch prediction histograms</li>
                <li>${QML.icon('eye', 14)} <b>Confidence before answers</b> — calibrated judgment tracked; high-confidence misses enter the clinic</li>
                <li>${QML.icon('target', 14)} Read a picture, name the concept — or pick the picture the concept describes</li>
                <li>${QML.icon('stats', 14)} Targets your weakest domains, ramps difficulty on streaks</li>
                <li>${QML.icon('check', 14)} Instant feedback — every miss comes with the visual decoded</li>
              </ul>
              <div class="qz-land-weak">Currently targeting: ${weak3.map(t => `<span class="tag warn">${ui.esc(dName(t))}</span>`).join(' ')}</div>
            </div>
          </div>
          <div class="qz-land-stats stagger">
            <div class="card qz-mini">
              <span class="qz-mini-ico">${QML.icon('layers', 19)}</span>
              <div><strong>${bank().length}</strong><span class="muted">visual puzzles</span></div>
            </div>
            <div class="card qz-mini">
              <span class="qz-mini-ico">${QML.icon('bolt', 19)}</span>
              <div><strong>${metaTopic ? metaTopic.seen : 0}</strong><span class="muted">meta drills done</span></div>
            </div>
            <div class="card qz-mini">
              <span class="qz-mini-ico">${QML.icon('target', 19)}</span>
              <div><strong>${metaAcc == null ? '—' : metaAcc + '%'}</strong><span class="muted">meta accuracy</span></div>
            </div>
          </div>
          <button class="btn btn-primary btn-lg qz-start" id="meta-start">${QML.icon('play', 16)} Start meta-challenge</button>
          <p class="qz-land-note muted">${SESSION_LEN} questions · +10 XP per correct answer · some ask you to <b>build the state yourself</b></p>
        </div>

        ${calibCard()}
        ${clinicCard()}

        ${evals.length ? `<div class="def-related section-gap">
          <div class="card-head"><div class="card-title">${QML.icon('evals', 17)} Meta evals</div>
            <span class="muted">scored versions — they hit your MMR</span></div>
          <div class="def-related-grid">
            ${evals.map(ev => `<a class="card card-hover def-rel" href="#/eval/${encodeURIComponent(ev.id)}">
              <span class="crs-icon">${QML.icon(ev.icon || 'evals', 20)}</span>
              <div class="def-rel-txt">
                <div class="def-rel-title">${ui.esc(ev.title)}</div>
                <div class="muted">${(ev.questions || []).length} questions · ~${ev.timeMin} min${DB.evalBest(ev.id) != null ? ' · best ' + DB.evalBest(ev.id) + '%' : ''}</div>
              </div>
              ${QML.icon('right', 16)}
            </a>`).join('')}
          </div>
        </div>` : ''}

        <div class="card section-gap">
          <div class="card-head"><div class="card-title">${QML.icon('search', 17)} The visual alphabet</div>
            <span class="muted">the picture types every drill is built from</span>
          </div>
          <div class="meta-alpha stagger">
            ${ALPHABET.map(a => `<div class="meta-alpha-cell">
              <div class="meta-alpha-viz">${QML.viz(a.viz)}</div>
              <div class="meta-alpha-name">${ui.esc(a.name)}</div>
              <div class="meta-alpha-note muted">${ui.esc(a.note)}</div>
            </div>`).join('')}
          </div>
        </div>`;

      el.querySelector('#meta-start').onclick = () => session();
      el.querySelectorAll('[data-clinic]').forEach(b => b.onclick = () => clinicRetest(b.dataset.clinic));
    }

    function session() {
      const picker = makePicker(bank());
      const results = [];
      let xp = 0;

      const todayStats = () => {
        const d = (DB.state().challenge.days || {})[DB.today()] || { total: 0, correct: 0 };
        return { total: d.total, correct: d.correct, acc: d.total ? Math.round(d.correct / d.total * 100) : null };
      };

      const hud = () => {
        const s = DB.stats();
        const day = todayStats();
        return `<div class="qz-hud">
          <div class="qz-hud-left">
            ${ui.flame(s.streak, s.streak > 0)}
            <span class="qz-hud-tally">${day.total} today${day.total ? ` · ${day.acc}%` : ''}</span>
          </div>
          <div class="qz-dots">${Array.from({ length: SESSION_LEN }, (_, i) => {
            const r = results[i];
            return `<span class="qz-dot ${i === results.length ? 'cur' : ''} ${r ? (r.ok ? 'ok' : 'bad') : ''}"></span>`;
          }).join('')}</div>
          <span class="tag" title="Current difficulty">${QML.icon('stats', 12)} ${diffName(picker.diff)}</span>
        </div>`;
      };

      function nextQ() {
        if (results.length >= SESSION_LEN) return summary();
        renderQ(picker.next());
      }

      function renderQ(q) {
        const isIx = q.kind && q.kind !== 'mcq' && QML.ix && QML.ix[q.kind];
        const isViz = !!(q.vizOptions);
        const needsConf = !!q.conf || isIx;
        el.innerHTML = `
          <div class="qz-exam">
            ${hud()}
            <div class="card qz-qcard qz-in">
              <div class="qz-qmeta">
                <span class="tag">${ui.esc(dName(q.domain))}</span>
                <span class="tag">${diffName(q.diff)}</span>
                <span class="tag">${QML.icon('target', 12)} meta</span>
                ${isIx ? `<span class="tag warn">${QML.icon('pencil', 11)} ${KIND_NAME[q.kind] || q.kind}</span>` : ''}
                <span class="qz-qnum muted">Q${results.length + 1}/${SESSION_LEN}</span>
              </div>
              <div class="qz-prompt">${ui.md(q.prompt)}</div>
              ${q.viz ? `<div class="meta-viz-prompt">${QML.viz(q.viz)}</div>` : ''}
              ${needsConf ? '<div id="ix-conf-mount"></div>' : ''}
              ${isIx ? '<div id="ix-mount"></div>' : `
              <div class="qz-opts ${isViz ? 'qz-opts-viz' : ''}">
                ${q.options.map((o, k) => `
                  <button class="qz-opt ${isViz ? 'qz-opt-tile' : ''}" data-k="${k}" ${needsConf ? 'disabled' : ''}>
                    <span class="qz-letter">${'ABCD'[k]}</span>
                    <span class="qz-opt-txt">${optBody(q, k)}</span>
                  </button>`).join('')}
              </div>`}
              <div class="qz-explain" hidden></div>
              <div class="qz-qfoot">
                <span class="muted" id="qz-hint">${isIx ? 'Build it — no guessing' : needsConf ? 'Lock your confidence first' : isViz ? 'Pick the right picture' : 'Read the picture, pick the meaning'}</span>
                <button class="btn btn-primary" id="qz-next" disabled>${results.length === SESSION_LEN - 1 ? 'Finish' : 'Next'} ${QML.icon('right', 15)}</button>
              </div>
            </div>
          </div>`;

        /* confidence gate: rate certainty before the answer counts */
        let confPct = null;
        const ixMount = el.querySelector('#ix-mount');
        if (needsConf) {
          if (ixMount) ixMount.style.pointerEvents = 'none';
          QML.ix.confidence(el.querySelector('#ix-conf-mount'), pct => {
            confPct = pct;
            el.querySelectorAll('.qz-opt').forEach(x => x.disabled = false);
            if (ixMount) ixMount.style.pointerEvents = '';
            const h = el.querySelector('#qz-hint');
            if (h) h.textContent = 'Locked at ' + pct + '% — now ' + (isIx ? 'build it' : 'answer');
          });
        }

        const finish = (ok, detail, opts) => {
          opts = opts || {};
          results.push({ q, pick: opts.pick, ok });
          picker.answer(ok);
          DB.recordAnswer(q.id, 'meta', ok);
          DB.recordMetaDomain(q.domain, ok);
          if (confPct != null) DB.recordConfidence(q.id, confPct, ok);
          if (ok) { xp += 10; DB.addXP(10, KIND_NAME[q.kind] ? 'Interactive solved' : 'Correct answer'); }
          else if (opts.pick == null) { /* interactive partial */ }

          const hyper = confPct != null && confPct >= 80 && !ok;
          const ex = el.querySelector('.qz-explain');
          ex.hidden = false;
          ex.classList.add(ok ? 'ok' : 'bad');
          ex.innerHTML = `${QML.icon(ok ? 'check' : 'x', 16)}<div>
            <strong>${ok ? (isIx ? 'Nailed it — ' + (detail || '') + ' · +10 XP' : 'Correct — +10 XP')
                          : `Not quite — ${opts.pick != null ? 'the answer is ' + 'ABCD'[q.answer] : (detail || 'review the feedback')}`}</strong>
            <span>${ui.md(q.explain || '')}</span>
            ${hyper ? `<div class="tag warn" style="margin-top:6px">high-confidence miss → added to the Confident-Error clinic</div>` : ''}</div>`;
          const nx = el.querySelector('#qz-next');
          nx.disabled = false;
          nx.focus();

          const dots = el.querySelectorAll('.qz-dot');
          if (dots[results.length - 1]) {
            dots[results.length - 1].classList.add(ok ? 'ok' : 'bad');
            dots[results.length - 1].classList.remove('cur');
          }
          const day = todayStats();
          const tally = el.querySelector('.qz-hud-tally');
          if (tally) tally.textContent = `${day.total} today${day.total ? ` · ${day.acc}%` : ''}`;
          const hint = el.querySelector('#qz-hint');
          if (hint) hint.textContent = ok ? 'Nice.' : isIx ? 'Study the gap — that\'s the signal' : 'Study the picture vs. the answer';
        };

        if (isIx) {
          QML.ix[q.kind](el.querySelector('#ix-mount'), q, r => finish(r.ok, r.detail));
        }

        el.querySelectorAll('.qz-opt').forEach(b => b.onclick = () => {
          const pick = +b.dataset.k;
          const ok = pick === q.answer;
          el.querySelectorAll('.qz-opt').forEach(x => {
            x.disabled = true;
            const xk = +x.dataset.k;
            if (xk === q.answer) x.classList.add('ok');
            else if (xk === pick) x.classList.add('bad');
          });
          finish(ok, null, { pick });
        });

        el.querySelector('#qz-next').onclick = () => {
          const card = el.querySelector('.qz-qcard');
          card.classList.remove('qz-in');
          card.classList.add('qz-out');
          setTimeout(nextQ, 170);
        };
      }

      function summary() {
        const correct = results.filter(r => r.ok).length;
        const pct = Math.round(correct / SESSION_LEN * 100);
        const perfect = correct === SESSION_LEN;
        const s = DB.stats();

        const byDom = {};
        results.forEach(r => {
          const t = byDom[r.q.domain] = byDom[r.q.domain] || { seen: 0, ok: 0 };
          t.seen++; if (r.ok) t.ok++;
        });
        const struggled = Object.entries(byDom)
          .filter(([, v]) => v.ok < v.seen)
          .sort((a, b) => (a[1].ok / a[1].seen) - (b[1].ok / b[1].seen));
        const weakest = weakDomains().slice(0, 3);
        const evals = (window.QML_EVALS || []).filter(e => e.meta);

        el.innerHTML = `
          <div class="qz-result ${perfect ? 'qz-perfect' : ''}">
            <div class="card qz-hero qz-in">
              ${perfect ? `<div class="qz-burst">${Array.from({ length: 12 }, (_, i) =>
                `<i style="--a:${i * 30}deg;animation-delay:${i * 45}ms"></i>`).join('')}</div>` : ''}
              ${ui.ring(pct, 140, pct + '%', 10)}
              <div class="qz-hero-info">
                ${perfect ? `<span class="tag success qz-perfect-tag">Perfect run — 8/8!</span>` : ''}
                <div class="qz-hero-line"><strong>${correct}/${SESSION_LEN}</strong> correct this session</div>
                <div class="muted">+${xp} XP earned</div>
                <div class="qz-hero-streak">${ui.flame(s.streak, s.streak > 0)}<span>${s.streak} day streak${s.bestStreak > s.streak ? ` · best ${s.bestStreak}` : ''}</span></div>
                <div class="qz-hero-btns">
                  <button class="btn btn-primary" id="meta-again">${QML.icon('refresh', 15)} Play again</button>
                  ${evals.length ? `<a class="btn btn-ghost" href="#/eval/${encodeURIComponent(evals[0].id)}">${QML.icon('evals', 15)} Take a meta eval</a>` : `<a class="btn btn-ghost" href="#/meta-challenges">${QML.icon('target', 15)} Back</a>`}
                </div>
              </div>
            </div>
            <div class="grid qz-sum-grid section-gap">
              <div class="card">
                <div class="card-head"><div class="card-title">${QML.icon('target', 17)} Session breakdown</div></div>
                ${struggled.length ? `
                  <p class="muted" style="margin-bottom:4px">Domains you missed — review suggested:</p>
                  <ul class="qz-topic-list">
                    ${struggled.map(([tid, v]) => `<li>
                      <span class="qz-dot bad"></span>
                      <strong>${ui.esc(dName(tid))}</strong>
                      <span class="muted">${v.ok}/${v.seen}</span>
                    </li>`).join('')}
                  </ul>` : `
                  <p class="muted">No weak spots this session — clean sweep across ${Object.keys(byDom).length} domain${Object.keys(byDom).length === 1 ? '' : 's'}.</p>`}
              </div>
              <div class="card">
                <div class="card-head"><div class="card-title">${QML.icon('stats', 17)} Weakest domains overall</div></div>
                <ul class="qz-topic-list">
                  ${weakest.map(tid => {
                    const a = domAcc(tid);
                    return `<li>
                      <span class="qz-dot ${a && a.acc >= 70 ? 'ok' : 'bad'}"></span>
                      <strong>${ui.esc(dName(tid))}</strong>
                      <span class="muted">${a ? a.acc + '%' : 'new'}</span>
                    </li>`;
                  }).join('')}
                </ul>
              </div>
            </div>
          </div>`;
        el.querySelector('#meta-again').onclick = () => session();
      }

      nextQ();
    }
  };
})();
