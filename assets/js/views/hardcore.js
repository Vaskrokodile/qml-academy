/* ============================================================
   QML.views.hardcore — research-paper derivations.
   Each subject: summary (context without the punchline), the
   tools the paper hands you, and exercises that make YOU find
   the result. Solving = the learning. Route: #/hardcore[/subid]
   ============================================================ */
(function () {
  const DB = QML.DB;
  const ui = QML.ui;
  QML.views = QML.views || {};

  const subs = () => window.QML_HARDCORE || [];
  const SOLVED_AT = 70;                  // exercise counts once ≥70%
  const XP_PER_EX = 25, XP_DONE = 100;

  const solvedPct = sub => Object.keys(DB.hardcoreSolved(sub.id))
    .filter(k => DB.hardcoreSolved(sub.id)[k] >= SOLVED_AT).length;

  QML.views.hardcore = function (el, params) {
    const id = params && params[0];
    const sub = subs().find(s => s.id === id);
    if (sub) subject(el, sub); else list(el);
  };

  /* ================= LIST ================= */
  function list(el) {
    const tot = DB.hardcoreTotals();
    el.innerHTML = `
      <div class="card hc-hero section-gap">
        <span class="hc-hero-ic">${QML.icon('skull', 26)}</span>
        <div>
          <div class="qz-land-title">Hardcore — real papers, real derivations</div>
          <p class="muted" style="margin:0">Each subject is a real paper from the QML literature. You get the context,
            the assumptions and the tools — <b>but the headline result is withheld</b>. Work the exercises to derive
            the quantity X yourself. That is how you actually understand quantum mechanics rather than recognizing slogans.</p>
          <div class="hc-paper-meta">
            <span class="tag warn">${tot.solved} exercises solved</span>
            <span class="tag">${tot.done}/${subs().length} papers cleared</span>
            <span class="tag success">+70 MMR per exercise · +180 per cleared paper · +${XP_PER_EX} XP each</span>
          </div>
        </div>
      </div>
      <div class="hc-grid stagger">
        ${subs().map(s => {
          const done = solvedPct(s), total = s.exercises.length;
          const cleared = DB.state().hardcore[s.id] && DB.state().hardcore[s.id].done;
          return `<a class="card card-hover hc-card" href="#/hardcore/${s.id}">
            ${cleared ? `<span class="hc-done-badge">${QML.icon('check', 18)}</span>` : ''}
            <span class="hc-arxiv">arXiv:${s.arxiv} · ${s.year} · ${ui.esc(s.venue)}</span>
            <div class="hc-title">${ui.esc(s.title)}</div>
            <div class="hc-tagline">${ui.esc(s.tagline)}</div>
            <div class="hc-diff" title="difficulty">${[1,2,3].map(i => `<i class="${i <= s.diff ? 'on' : ''}"></i>`).join('')}</div>
            <div class="hc-prog">
              <div class="pbar"><i style="width:${Math.round(done / total * 100)}%"></i></div>
              <span class="muted mono" style="font-size:11px">${done}/${total}</span>
            </div>
          </a>`;
        }).join('')}
      </div>`;
  }

  /* ================= SUBJECT ================= */
  function subject(el, s) {
    const solved = DB.hardcoreSolved(s.id);
    const nSolved = solvedPct(s);
    const total = s.exercises.length;
    const allDone = nSolved >= total;

    el.innerHTML = `
      <a class="link" href="#/hardcore">${QML.icon('right', 12)} back to papers</a>
      <div class="card section-gap" style="margin-top:10px">
        <div class="hc-hero">
          <span class="hc-hero-ic">${QML.icon(s.icon || 'skull', 26)}</span>
          <div style="flex:1">
            <div class="hc-paper-meta">
              <span class="tag">arXiv:${s.arxiv}</span>
              <span class="tag">${s.year}</span>
              <span class="tag">${ui.esc(s.venue)}</span>
              <a class="tag" href="https://arxiv.org/abs/${s.arxiv}" target="_blank" rel="noopener">open paper ↗</a>
            </div>
            <div class="hc-title" style="font-size:19px">${ui.esc(s.title)}</div>
            <div class="muted" style="font-size:12.5px;margin-top:2px">${ui.esc(s.authors)}</div>
          </div>
          <div class="hc-prog" style="flex-direction:column;align-items:flex-end">
            <b class="mono">${nSolved}/${total}</b>
            <span class="muted" style="font-size:11px">derived</span>
          </div>
        </div>
      </div>

      <div class="card section-gap hc-summary">
        <div class="card-head"><div class="card-title">${QML.icon('search', 17)} The setup</div>
          <span class="muted">context & assumptions — the punchline stays hidden</span></div>
        ${s.summary.map(p => `<p style="font-size:13.5px;line-height:1.65">${ui.md(p)}</p>`).join('')}
        <div class="hc-block-key"><b>What you know going in:</b> ${ui.md(s.tagline)}</div>
        <div class="hc-given">
          ${s.given.map(g => `<span class="hc-chip" title="${ui.esc(g.note)}">${QML.ui.tex(g.tex)}<span class="muted" style="font-size:10.5px;margin-left:5px">${ui.esc(g.note)}</span></span>`).join('')}
        </div>
      </div>

      <div class="hc-mission">
        <div class="hc-mission-t">${QML.icon('target', 14)} The mission — find X</div>
        <div style="font-size:14px">${ui.md(s.mission)}</div>
      </div>

      <div class="section-gap">
        ${s.exercises.map((ex, i) => exCard(s, ex, i, solved[ex.id])).join('')}
      </div>

      ${allDone ? `<div class="card section-gap" style="border-color:var(--success)">
        <div class="card-head"><div class="card-title">${QML.icon('trophy', 17)} Result derived</div></div>
        <p style="font-size:14px">${ui.esc(s.reveal)}</p>
        <p class="muted" style="font-size:12.5px">You earned this one the hard way — that knowledge sticks.
        Read the actual paper now; you'll see the machinery you just built.</p>
      </div>` : `<div class="card section-gap muted" style="font-size:12.5px">
        ${QML.icon('skull', 14)} Clear every exercise to reveal the paper's result — and your MMR bonus.</div>`}
    `;

    /* wire exercises */
    s.exercises.forEach(ex => mountEx(el, s, ex));
  }

  function exCard(s, ex, i, prevScore) {
    const solved = (prevScore || 0) >= SOLVED_AT;
    return `<div class="hc-ex ${solved ? 'solved' : ''}" id="ex-${s.id}-${ex.id}">
      <div class="hc-ex-head">
        <span class="hc-ex-n">EX ${String(i + 1).padStart(2, '0')}</span>
        <span class="tag">${ex.kind === 'value' ? 'compute' : 'derive'}</span>
        ${solved ? `<span class="hc-solved-tag">${QML.icon('check', 13)} solved ${Math.round(prevScore)}%</span>` : ''}
      </div>
      <div class="qz-prompt">${ui.md(ex.prompt)}</div>
      ${ex.kind === 'mcq' ? `
        <div class="qz-opts">
          ${ex.options.map((o, k) => `<button class="qz-opt" data-k="${k}">
            <span class="qz-letter">${'ABCD'[k]}</span><span class="qz-opt-txt">${ui.md(o)}</span></button>`).join('')}
        </div>` : `
        <div class="hc-input-row">
          <input type="text" inputmode="decimal" placeholder="your number…" id="hcv-${s.id}-${ex.id}">
          ${ex.unit ? `<span class="hc-unit">${ui.esc(ex.unit)}</span>` : ''}
          <button class="btn btn-primary btn-sm" id="hcs-${s.id}-${ex.id}">${QML.icon('check', 13)} Check</button>
        </div>`}
      ${(ex.hints && ex.hints.length) ? `<div class="hc-hints">
        <button class="btn btn-ghost btn-sm" id="hch-${s.id}-${ex.id}">${QML.icon('search', 12)} hint (0/${ex.hints.length})</button>
        <div class="hc-hint-list" style="font-size:12.5px;margin-top:6px"></div></div>` : ''}
      <div class="hc-worked" hidden><div class="hc-worked-t" id="hcw-t-${s.id}-${ex.id}"></div>
        <div>${ui.md(ex.explain || '')}</div></div>
    </div>`;
  }

  function mountEx(el, s, ex) {
    const box = el.querySelector(`#ex-${s.id}-${ex.id}`);
    if (!box) return;
    const solved = () => (DB.hardcoreSolved(s.id)[ex.id] || 0) >= SOLVED_AT;

    /* hints */
    const hb = box.querySelector(`#hch-${s.id}-${ex.id}`);
    let shown = 0;
    if (hb) hb.onclick = () => {
      if (shown >= ex.hints.length) return;
      const list = box.querySelector('.hc-hint-list');
      list.innerHTML = ex.hints.slice(0, ++shown)
        .map(h => `<div class="hc-chip" style="display:block;margin:4px 0">${QML.ui.md(h)}</div>`).join('');
      hb.textContent = `hint (${shown}/${ex.hints.length})`;
      if (shown === ex.hints.length) hb.disabled = true;
    };

    const finish = ok => {
      const was = solved();
      const score = ok ? 100 : 0;
      DB.recordHardcore(s.id, ex.id, ok ? 100 : Math.max(score, DB.hardcoreSolved(s.id)[ex.id] || 0));
      if (ok && !was) {
        DB.addXP(XP_PER_EX, 'Hardcore exercise solved');
        ui.toast(`+${XP_PER_EX} XP — derivation step complete`, 'ok');
      }
      const w = box.querySelector('.hc-worked');
      w.hidden = false;
      box.querySelector(`#hcw-t-${s.id}-${ex.id}`).innerHTML =
        `${QML.icon(ok ? 'check' : 'x', 14)} ${ok ? 'Correct.' : 'Not yet — walk through the worked reasoning:'}`;
      w.classList.toggle('ok', ok);
      /* exercise card visual */
      if (ok) {
        box.classList.add('solved');
        const head = box.querySelector('.hc-ex-head');
        if (!head.querySelector('.hc-solved-tag'))
          head.insertAdjacentHTML('beforeend',
            `<span class="hc-solved-tag">${QML.icon('check', 13)} solved</span>`);
        /* subject completion check */
        const s_ = subs().find(x => x.id === s.id);
        const doneAll = s_.exercises.every(e => (DB.hardcoreSolved(s.id)[e.id] || 0) >= SOLVED_AT);
        if (doneAll) {
          DB.markHardcoreDone(s.id);
          DB.addXP(XP_DONE, 'Paper derived');
          ui.toast(`Paper derived — +${XP_DONE} XP and +180 MMR bonus`, 'ok');
          setTimeout(() => QML.render(), 600);
        }
      }
    };

    if (ex.kind === 'mcq') {
      box.querySelectorAll('.qz-opt').forEach(b => b.onclick = () => {
        const ok = +b.dataset.k === ex.answer;
        box.querySelectorAll('.qz-opt').forEach(x => {
          x.disabled = true;
          const xk = +x.dataset.k;
          if (xk === ex.answer) x.classList.add('ok');
          else if (x === b) x.classList.add('bad');
        });
        finish(ok);
      });
    } else {
      const input = box.querySelector(`#hcv-${s.id}-${ex.id}`);
      const go = () => {
        const v = parseFloat(String(input.value).replace(',', '.'));
        if (isNaN(v)) { ui.toast('Enter a number', 'x'); return; }
        const ok = Math.abs(v - ex.value) <= (ex.tol || 0.01);
        input.disabled = ok;
        if (ok) box.querySelector(`#hcs-${s.id}-${ex.id}`).disabled = true;
        finish(ok);
      };
      box.querySelector(`#hcs-${s.id}-${ex.id}`).onclick = go;
      input.onkeydown = e => { if (e.key === 'Enter') go(); };
    }
  }
})();
