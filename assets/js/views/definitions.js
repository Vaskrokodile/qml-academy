/* ============================================================
   QML.views.definitions — "what does this symbol mean?"
   - Adaptive 8-question drills built ONLY from symbol questions
     (QML_DEF_QUESTIONS), weighted toward your weakest domains
     (DB.state().symDomains) and escalating difficulty.
   - The full QML_SYMBOLS glossary: searchable, grouped by domain.
   - Related study: the notation course + eval (theme 'symbols').
   Route: #/definitions
   ============================================================ */
(function () {
  const DB = QML.DB;
  const ui = QML.ui;
  QML.views = QML.views || {};

  const SESSION_LEN = 8;
  const dName = id => (DB.TOPICS.find(t => t.id === id) || {}).name || id;
  const diffName = d => ['Easy', 'Easy', 'Medium', 'Hard'][Math.min(Math.max(d || 1, 1), 3)];
  const DOMAINS = DB.TOPICS.filter(t => t.id !== 'symbols');

  /* glossary entries whose sym is written in KaTeX render via tex() */
  const symHtml = s => /^\$[\s\S]+\$$/.test(String(s).trim()) ? ui.tex(s, false) : ui.esc(s);

  let domainFilter = 'all', query = '';

  const glossary = () => window.QML_SYMBOLS || [];
  const bank = () => (window.QML_DEF_QUESTIONS || []).filter(q =>
    q && q.prompt && Array.isArray(q.options) && q.options.length === 4 && Number.isInteger(q.answer));

  const domAcc = id => {
    const d = (DB.state().symDomains || {})[id];
    return d && d.seen ? { seen: d.seen, acc: Math.round(d.correct / d.seen * 100) } : null;
  };

  /* Weakest domains first: unseen counts as 50%, fewer-seen breaks ties. */
  function weakDomains() {
    return DOMAINS.map(t => {
      const d = (DB.state().symDomains || {})[t.id];
      const acc = d && d.seen >= 2 ? d.correct / d.seen : 0.5;
      return { id: t.id, acc, seen: d ? d.seen : 0 };
    }).sort((a, b) => a.acc - b.acc || b.seen - a.seen).map(x => x.id);
  }

  /* Same adaptive skeleton as challenges, weighted by domain accuracy. */
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

  /* ================= VIEW ================= */
  QML.views.definitions = function (el) {
    if (!bank().length) {
      el.innerHTML = ui.empty('infinity', 'Definition bank is empty', 'Symbol questions unlock once data/definitions.js is loaded.');
      return;
    }
    landing();

    /* ---------- landing ---------- */
    function landing() {
      const s = DB.stats();
      const st = DB.state();
      const symTopic = (st.challenge.topics || {}).symbols;
      const symAcc = symTopic && symTopic.seen ? Math.round(symTopic.correct / symTopic.seen * 100) : null;
      const weak3 = weakDomains().slice(0, 3);
      const course = (window.QML_COURSES || []).find(c => c.theme === 'symbols');
      const ev = (window.QML_EVALS || []).find(e => (e.themes || []).includes('symbols') && !e.courseId);

      el.innerHTML = `
        <div class="qz-land">
          <div class="card qz-land-hero">
            <span class="qz-land-ico">${QML.icon('infinity', 26)}</span>
            <div>
              <div class="qz-land-title">Definition drills</div>
              <p class="muted">${SESSION_LEN} questions on <strong>what the symbols mean</strong> — bras, kets, gates, density matrices, cost functions, and every bit of QML notation.</p>
              <ul class="qz-land-list">
                <li>${QML.icon('target', 14)} Chases the domains where your symbol recall is weakest</li>
                <li>${QML.icon('stats', 14)} Difficulty climbs after 2 correct in a row, eases off on a miss</li>
                <li>${QML.icon('check', 14)} Instant feedback — every answer comes with the meaning</li>
              </ul>
              <div class="qz-land-weak">Currently targeting: ${weak3.map(t => `<span class="tag warn">${ui.esc(dName(t))}</span>`).join(' ')}</div>
            </div>
          </div>
          <div class="qz-land-stats stagger">
            <div class="card qz-mini">
              <span class="qz-mini-ico">${QML.icon('infinity', 19)}</span>
              <div><strong>${glossary().length}</strong><span class="muted">symbols in glossary</span></div>
            </div>
            <div class="card qz-mini">
              <span class="qz-mini-ico">${QML.icon('bolt', 19)}</span>
              <div><strong>${symTopic ? symTopic.seen : 0}</strong><span class="muted">symbol drills done</span></div>
            </div>
            <div class="card qz-mini">
              <span class="qz-mini-ico">${QML.icon('target', 19)}</span>
              <div><strong>${symAcc == null ? '—' : symAcc + '%'}</strong><span class="muted">symbol accuracy</span></div>
            </div>
          </div>
          <button class="btn btn-primary btn-lg qz-start" id="def-start">${QML.icon('play', 16)} Start definition drill</button>
          <p class="qz-land-note muted">${SESSION_LEN} questions · +10 XP per correct answer</p>
        </div>

        ${(course || ev) ? `<div class="def-related section-gap">
          <div class="card-head"><div class="card-title">${QML.icon('book', 17)} Study the symbols</div></div>
          <div class="def-related-grid">
            ${course ? `<a class="card card-hover def-rel" href="#/course/${ui.esc(course.id)}">
              <span class="crs-icon">${QML.icon(course.icon || 'book', 20)}</span>
              <div class="def-rel-txt">
                <div class="def-rel-title">${ui.esc(course.title)}</div>
                <div class="muted">${(course.lessons || []).length} lessons · ~${ui.esc(String(course.estMin || 0))} min</div>
              </div>
              ${QML.icon('right', 16)}
            </a>` : ''}
            ${ev ? `<a class="card card-hover def-rel" href="#/eval/${encodeURIComponent(ev.id)}">
              <span class="crs-icon">${QML.icon(ev.icon || 'evals', 20)}</span>
              <div class="def-rel-txt">
                <div class="def-rel-title">${ui.esc(ev.title)}</div>
                <div class="muted">${(ev.questions || []).length} questions · ~${ev.timeMin} min${DB.evalBest(ev.id) != null ? ' · best ' + DB.evalBest(ev.id) + '%' : ''}</div>
              </div>
              ${QML.icon('right', 16)}
            </a>` : ''}
          </div>
        </div>` : ''}

        <div class="card section-gap">
          <div class="card-head"><div class="card-title">${QML.icon('search', 17)} Symbol glossary</div>
            <span class="muted">${glossary().length} entries across ${DOMAINS.length} domains</span>
          </div>
          <div class="def-tools">
            <div class="def-search-wrap">
              ${QML.icon('search', 15)}
              <input class="def-search" id="def-search" type="text" placeholder="Search symbols — e.g. rho, kernel, eigenvalue…" value="${ui.esc(query)}">
            </div>
            <div class="crs-filters def-chips">
              <button class="crs-chip ${domainFilter === 'all' ? 'active' : ''}" data-d="all">All</button>
              ${DOMAINS.map(t => `<button class="crs-chip ${domainFilter === t.id ? 'active' : ''}" data-d="${t.id}">${ui.esc(t.name)}</button>`).join('')}
            </div>
          </div>
          <div id="def-gloss"></div>
        </div>`;

      el.querySelector('#def-start').onclick = () => session();
      wireGlossary();
    }

    /* ---------- glossary rendering ---------- */
    function wireGlossary() {
      const inp = el.querySelector('#def-search');
      if (inp) inp.oninput = () => { query = inp.value; drawGloss(); };
      el.querySelectorAll('.def-chips .crs-chip').forEach(b => {
        b.onclick = () => { domainFilter = b.dataset.d; 
          el.querySelectorAll('.def-chips .crs-chip').forEach(x => x.classList.toggle('active', x === b));
          drawGloss(); };
      });
      drawGloss();
    }

    function drawGloss() {
      const host = el.querySelector('#def-gloss');
      if (!host) return;
      const q = query.trim().toLowerCase();
      const match = s => !q || s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q)
        || String(s.sym).toLowerCase().replace(/[\\${}]/g, '').includes(q);
      const groups = DOMAINS.map(t => ({
        t, items: glossary().filter(s => s.topic === t.id && match(s)
          && (domainFilter === 'all' || s.topic === domainFilter)),
      })).filter(g => g.items.length);

      if (!groups.length) {
        host.innerHTML = ui.empty('search', 'No symbols match', 'Try a different search or domain filter.');
        return;
      }
      host.innerHTML = groups.map(g => {
        const a = domAcc(g.t.id);
        return `<div class="def-domain">
          <div class="def-domain-head">
            <span class="def-domain-name">${ui.esc(g.t.name)}</span>
            <span class="muted">${g.items.length} symbol${g.items.length === 1 ? '' : 's'}</span>
            ${a ? `<span class="tag ${a.acc >= 70 ? 'success' : 'warn'}" title="${a.seen} drill answers">${a.acc}% recall</span>` : `<span class="tag">new</span>`}
          </div>
          <div class="def-grid stagger">
            ${g.items.map(s => `<button class="def-sym" data-sym="${ui.esc(s.sym)}" data-topic="${s.topic}" title="Open — what it does, where it's used, live example">
              <div class="def-sym-tex">${symHtml(s.sym)}</div>
              <div class="def-sym-name">${ui.esc(s.name)}</div>
              <div class="def-sym-desc">${ui.md(s.desc)}</div>
              <div class="def-sym-open">${QML.icon('orbit3d', 12)} live</div>
            </button>`).join('')}
          </div>
        </div>`;
      }).join('');
      host.querySelectorAll('.def-sym').forEach(b => b.onclick = () => openSym(b.dataset.sym, b.dataset.topic));
    }

    /* ---------- symbol detail popup ---------- */
    let symScene = null;
    function openSym(sym, topic) {
      const s = glossary().find(x => x.sym === sym && x.topic === topic);
      if (!s) return;
      const d = (window.QML_SYM_DETAIL || {})[sym + '|' + topic];
      const ov = document.createElement('div');
      ov.className = 'modal-ov';
      ov.innerHTML = `<div class="modal card syp" role="dialog">
        <button class="modal-x" aria-label="Close">${QML.icon('x', 16)}</button>
        <div class="syp-head">
          <div class="syp-sym">${symHtml(s.sym)}</div>
          <div>
            <div class="syp-name">${ui.esc(s.name)}</div>
            <div class="syp-meta">
              <span class="tag">${ui.esc(dName(topic))}</span>
              <span class="tag">${diffName(s.diff)}</span>
            </div>
          </div>
        </div>
        ${d ? `<div class="syp-scene"><div class="syp-mount"></div>
          <div class="vz-hint">drag to orbit · scroll to zoom · double-click reset</div></div>` : ''}
        <div class="syp-sec"><b>What it is</b><p>${ui.md(s.desc)}</p></div>
        ${d ? `<div class="syp-sec"><b>Where it's used</b><p>${ui.md(d.use)}</p></div>
        <div class="syp-sec"><b>Remember it as</b><p>${ui.md(d.example)}</p></div>` : ''}
      </div>`;
      const kill = () => { if (symScene) { symScene.dispose(); symScene = null; } ov.remove(); document.removeEventListener('keydown', onKey); };
      const onKey = e => { if (e.key === 'Escape') kill(); };
      ov.addEventListener('click', e => { if (e.target === ov) kill(); });
      ov.querySelector('.modal-x').onclick = kill;
      document.addEventListener('keydown', onKey);
      document.body.appendChild(ov);
      if (d && QML.viz3d) {
        try { symScene = QML.viz3d.create(ov.querySelector('.syp-mount'), d.scene.name, d.scene); }
        catch (e) { /* scene optional */ }
      }
    }

    /* ---------- session ---------- */
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
        el.innerHTML = `
          <div class="qz-exam">
            ${hud()}
            <div class="card qz-qcard qz-in">
              <div class="qz-qmeta">
                <span class="tag">${ui.esc(dName(q.domain))}</span>
                <span class="tag">${diffName(q.diff)}</span>
                <span class="qz-qnum muted">Q${results.length + 1}/${SESSION_LEN}</span>
              </div>
              <div class="qz-prompt">${ui.md(q.prompt)}</div>
              <div class="qz-opts">
                ${q.options.map((o, k) => `
                  <button class="qz-opt" data-k="${k}">
                    <span class="qz-letter">${'ABCD'[k]}</span>
                    <span class="qz-opt-txt">${ui.md(o)}</span>
                  </button>`).join('')}
              </div>
              <div class="qz-explain" hidden></div>
              <div class="qz-qfoot">
                <span class="muted" id="qz-hint">What does the symbol mean?</span>
                <button class="btn btn-primary" id="qz-next" disabled>${results.length === SESSION_LEN - 1 ? 'Finish' : 'Next'} ${QML.icon('right', 15)}</button>
              </div>
            </div>
          </div>`;

        el.querySelectorAll('.qz-opt').forEach(b => b.onclick = () => {
          const pick = +b.dataset.k;
          const ok = pick === q.answer;
          results.push({ q, pick, ok });
          picker.answer(ok);
          DB.recordAnswer(q.id, 'symbols', ok);
          DB.recordSymDomain(q.domain, ok);
          if (ok) { xp += 10; DB.addXP(10, 'Correct answer'); }

          el.querySelectorAll('.qz-opt').forEach(x => {
            x.disabled = true;
            const xk = +x.dataset.k;
            if (xk === q.answer) x.classList.add('ok');
            else if (xk === pick) x.classList.add('bad');
          });
          const ex = el.querySelector('.qz-explain');
          ex.hidden = false;
          ex.classList.add(ok ? 'ok' : 'bad');
          ex.innerHTML = `${QML.icon(ok ? 'check' : 'x', 16)}<div>
            <strong>${ok ? 'Correct — +10 XP' : `Not quite — the answer is ${'ABCD'[q.answer]}`}</strong>
            <span>${ui.md(q.explain || '')}</span></div>`;
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
          if (hint) hint.textContent = ok ? 'Nice.' : 'Review the meaning, then move on';
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
        const course = (window.QML_COURSES || []).find(c => c.theme === 'symbols');

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
                  <button class="btn btn-primary" id="def-again">${QML.icon('refresh', 15)} Play again</button>
                  <a class="btn btn-ghost" href="#/definitions">${QML.icon('infinity', 15)} Back to glossary</a>
                </div>
              </div>
            </div>
            <div class="grid qz-sum-grid section-gap">
              <div class="card">
                <div class="card-head"><div class="card-title">${QML.icon('target', 17)} Session breakdown</div></div>
                ${struggled.length ? `
                  <p class="muted" style="margin-bottom:4px">Symbols you missed — review suggested:</p>
                  <ul class="qz-topic-list">
                    ${struggled.map(([tid, v]) => `<li>
                      <span class="qz-dot bad"></span>
                      <strong>${ui.esc(dName(tid))}</strong>
                      <span class="muted">${v.ok}/${v.seen}</span>
                      ${course ? `<a class="btn btn-ghost btn-sm" href="#/course/${ui.esc(course.id)}">Review ${QML.icon('right', 12)}</a>` : ''}
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
                      ${course ? `<a class="btn btn-ghost btn-sm" href="#/course/${ui.esc(course.id)}">Study ${QML.icon('right', 12)}</a>` : ''}
                    </li>`;
                  }).join('')}
                </ul>
              </div>
            </div>
          </div>`;
        el.querySelector('#def-again').onclick = () => session();
      }

      nextQ();
    }
  };
})();
