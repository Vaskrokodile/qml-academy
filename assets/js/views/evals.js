/* ============================================================
   QML.views.evals / QML.views.eval — evaluation list + focused
   exam runner (one question at a time, live timer, review).
   Route: #/evals   |   #/eval/<id>  (params[0] = eval id)
   ============================================================ */
(function () {
  const DB = QML.DB;
  const ui = QML.ui;
  QML.views = QML.views || {};

  const topicName = id => (DB.TOPICS.find(t => t.id === id) || {}).name || id;
  const gradeLetter = pct => pct >= 90 ? 'A' : pct >= 80 ? 'B' : pct >= 70 ? 'C' : pct >= 60 ? 'D' : 'F';
  const mmss = sec => {
    sec = Math.max(0, Math.floor(sec));
    return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
  };

  /* ================= LIST VIEW ================= */
  QML.views.evals = function (el) {
    const evals = window.QML_EVALS || [];
    if (!evals.length) {
      el.innerHTML = ui.empty('evals', 'No evaluations yet', 'Evals will appear here once the bank is loaded.');
      return;
    }
    const state = DB.state();
    el.innerHTML = `
      <div class="qz-grid stagger">
        ${evals.map(ev => {
          const best = DB.evalBest(ev.id);
          const rec = (state.evals || {})[ev.id];
          const attempts = rec ? rec.attempts.length : 0;
          const n = (ev.questions || []).length;
          return `<div class="card card-hover qz-eval-card">
            <div class="qz-eval-top">
              <span class="qz-eval-ico">${QML.icon(ev.icon || 'evals', 22)}</span>
              ${best != null
                ? `<span class="qz-grade" title="Best score: ${best}%">${ui.ring(best, 48, gradeLetter(best), 5)}</span>`
                : `<span class="qz-grade-none" title="Not attempted yet">—</span>`}
            </div>
            <div class="qz-eval-title">${ui.esc(ev.title)}</div>
            <p class="qz-eval-desc">${ui.esc(ev.desc || '')}</p>
            <div class="qz-eval-tags">${(ev.themes || []).map(t => `<span class="tag">${ui.esc(topicName(t))}</span>`).join('')}</div>
            <div class="qz-eval-meta">
              <span>${QML.icon('layers', 14)} ${n} question${n === 1 ? '' : 's'}</span>
              <span>${QML.icon('clock', 14)} ${ev.timeMin} min</span>
              <span>${QML.icon('refresh', 14)} ${attempts} attempt${attempts === 1 ? '' : 's'}</span>
            </div>
            ${n
              ? `<a class="btn btn-primary qz-eval-go" href="#/eval/${encodeURIComponent(ev.id)}">Take eval ${QML.icon('right', 15)}</a>`
              : `<span class="btn btn-ghost qz-eval-go qz-disabled">Coming soon</span>`}
          </div>`;
        }).join('')}
      </div>`;
  };

  /* ================= RUNNER ================= */

  const KIND_NAMES = { mcq: 'Multiple choice', match: 'Matching', order: 'Ordering', fill: 'Fill in', proof: 'Deep problem' };

  /* resolve {ref:'q001'} against the challenge + definition banks */
  function resolveQs(ev) {
    const bank = (window.QML_QUESTIONS || []).concat(window.QML_DEF_QUESTIONS || [], window.QML_META_QUESTIONS || [], window.QML_PRACTICAL_BANK || []);
    const byId = Object.fromEntries(bank.map(q => [q.id, q]));
    return (ev.questions || [])
      .map(q => q && q.ref && byId[q.ref] ? Object.assign({}, byId[q.ref], q.topic ? { topic: q.topic } : {}) : q)
      .filter(q => q && q.prompt);
  }
  const shuffle = arr => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  const norm = s => String(s || '').toLowerCase().replace(/\s+/g, ' ')
    .replace(/[−–]/g, '-').replace(/[×·]/g, '*').trim();
  const numOf = s => {
    s = norm(s).replace(/\$/g, '').replace(/\s/g, '');
    const f = /^(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)$/.exec(s);
    if (f) return +f[1] / +f[2];
    const n = parseFloat(s);
    return isNaN(n) ? null : n;
  };

  /* ---------- per-kind bodies: each returns {html, wire(card,q,st,next), grade(ans), review(ans)} ---------- */
  const KINDS = {
    mcq: {
      html: q => (q.viz && window.QML.viz ? '<div class="meta-viz-prompt">' + QML.viz(q.viz) + '</div>' : '')
        + '<div class="qz-opts' + (q.vizOptions ? ' qz-opts-viz' : '') + '">' + q.options.map((o, k) =>
        '<button class="qz-opt' + (q.vizOptions ? ' qz-opt-tile' : '') + '" data-k="' + k + '"><span class="qz-letter">' + 'ABCD'[k] + '</span><span class="qz-opt-txt">'
        + (q.vizOptions && q.vizOptions[k] && window.QML.viz ? '<span class="meta-opt-viz">' + QML.viz(q.vizOptions[k]) + '</span>' : ui.md(o))
        + '</span></button>').join('') + '</div>',
      wire(card, q, st, next) {
        card.querySelectorAll('.qz-opt').forEach(b => b.onclick = () => {
          st.ans = +b.dataset.k;
          card.querySelectorAll('.qz-opt').forEach(x => x.classList.toggle('sel', +x.dataset.k === st.ans));
          next.disabled = false;
        });
      },
      grade: (q, a) => (a === q.answer ? 1 : 0),
      review: (q, a) => {
        const ok = a === q.answer;
        return '<span class="qz-rev-pick">You: ' + (a != null ? 'ABCD'[a] + ' · ' + ui.md(q.options[a]) : '—') + '</span>'
          + (ok ? '' : '<span class="qz-rev-fix">' + QML.icon('right', 11) + ' ' + 'ABCD'[q.answer] + ' · ' + ui.md(q.options[q.answer]) + '</span>');
      },
    },

    match: {
      html: q => {
        return '<div class="qz-match"><div class="qz-match-col">' +
          q.pairs.map((p, i) => '<button class="qz-m left" data-l="' + i + '"><span class="qz-m-key">' + (i + 1) + '</span><span>' + ui.md(p[0]) + '</span></button>').join('') +
          '</div><div class="qz-match-col right">' +
          shuffle(q.pairs.map((p, i) => i)).map(ri => '<button class="qz-m right" data-r="' + ri + '"><span class="qz-m-tag" hidden></span><span>' + ui.md(q.pairs[ri][1]) + '</span></button>').join('') +
          '</div></div><div class="muted" style="font-size:12px;margin-top:8px">Click a term on the left, then its match on the right.</div>';
      },
      wire(card, q, st, next) {
        st.ans = { pairs: {}, sel: null };
        const paint = () => {
          card.querySelectorAll('.qz-m.left').forEach(b => {
            const l = +b.dataset.l;
            b.classList.toggle('sel', st.ans.sel === l);
            b.classList.toggle('paired', st.ans.pairs[l] != null);
            const tag = b.querySelector('.qz-m-key');
            if (tag) tag.textContent = st.ans.pairs[l] != null ? (l + 1) + '→' + (st.ans.pairs[l] + 1) : (l + 1);
          });
          card.querySelectorAll('.qz-m.right').forEach(b => {
            const r = +b.dataset.r;
            b.classList.toggle('paired', Object.values(st.ans.pairs).includes(r));
          });
          next.disabled = Object.keys(st.ans.pairs).length !== q.pairs.length;
        };
        card.querySelectorAll('.qz-m.left').forEach(b => b.onclick = () => { st.ans.sel = +b.dataset.l; paint(); });
        card.querySelectorAll('.qz-m.right').forEach(b => b.onclick = () => {
          const r = +b.dataset.r;
          if (st.ans.sel == null) return;
          for (const l in st.ans.pairs) if (st.ans.pairs[l] === r) delete st.ans.pairs[l];
          st.ans.pairs[st.ans.sel] = r;
          st.ans.sel = null;
          paint();
        });
        paint();
      },
      grade: (q, a) => {
        if (!a || !a.pairs) return 0;
        let ok = 0;
        for (const l in a.pairs) if (+a.pairs[l] === +l) ok++;
        return ok / q.pairs.length;
      },
      review: (q, a) => {
        const got = q.pairs.map((p, i) => {
          const r = a && a.pairs ? a.pairs[i] : null;
          const ok = r === i;
          return '<div class="qz-mrow ' + (ok ? 'ok' : 'bad') + '">' + ui.md(p[0]) + ' ' + QML.icon('right', 11) + ' ' + ui.md(r != null ? q.pairs[r][1] : '—') + (ok ? '' : ' <small>(was: ' + ui.md(p[1]) + ')</small>') + '</div>';
        }).join('');
        return got;
      },
    },

    order: {
      html: q => {
        const sh = shuffle(q.items.map((t, i) => ({ t, i })));
        return '<div class="qz-order"><div class="qz-order-pool">' +
          sh.map(x => '<button class="qz-o" data-i="' + x.i + '">' + ui.md(x.t) + '</button>').join('') +
          '</div><div class="qz-order-seq" data-empty="Click items in the pool in the correct order"></div></div>';
      },
      wire(card, q, st, next) {
        st.ans = [];
        const seq = card.querySelector('.qz-order-seq');
        const paint = () => {
          seq.innerHTML = st.ans.map((i, k) =>
            '<button class="qz-o seq" data-k="' + k + '"><b>' + (k + 1) + '.</b> ' + ui.md(q.items[i]) + '</button>').join('');
          seq.classList.toggle('empty', !st.ans.length);
          card.querySelectorAll('.qz-order-pool .qz-o').forEach(b =>
            b.classList.toggle('used', st.ans.includes(+b.dataset.i)));
          seq.querySelectorAll('.qz-o.seq').forEach(b => b.onclick = () => {
            st.ans.splice(+b.dataset.k, 1); paint();
          });
          next.disabled = st.ans.length !== q.items.length;
        };
        card.querySelectorAll('.qz-order-pool .qz-o').forEach(b => b.onclick = () => {
          const i = +b.dataset.i;
          if (!st.ans.includes(i)) st.ans.push(i);
          paint();
        });
        paint();
      },
      grade: (q, a) => {
        if (!a) return 0;
        let ok = 0;
        a.forEach((i, k) => { if (i === k) ok++; });
        return ok / q.items.length;
      },
      review: (q, a) => '<div class="qz-mrow">Correct order: ' + q.items.map(t => ui.md(t)).join(' → ') + '</div>'
        + (a ? '<div class="qz-mrow muted">Yours: ' + a.map(i => ui.md(q.items[i])).join(' → ') + '</div>' : ''),
    },

    fill: {
      html: q => '<input class="qz-fill" type="text" placeholder="Type the answer — e.g. 1/2 or -0.3 or sigma_z" autocomplete="off">',
      wire(card, q, st, next) {
        st.ans = '';
        const inp = card.querySelector('.qz-fill');
        inp.focus();
        inp.oninput = () => { st.ans = inp.value; next.disabled = !inp.value.trim(); };
        inp.onkeydown = e => { if (e.key === 'Enter' && !next.disabled) next.click(); };
      },
      grade: (q, a) => {
        const wants = q.answers || [q.answer];
        const ua = numOf(a);
        return wants.some(w => {
          if (ua != null) { const wv = numOf(w); if (wv != null && Math.abs(ua - wv) < 0.011) return true; }
          return norm(w) === norm(a);
        }) ? 1 : 0;
      },
      review: (q, a) => '<span class="qz-rev-pick">You: ' + ui.esc(a || '—') + '</span><span class="qz-rev-fix">' + QML.icon('right', 11) + ' ' + ui.md((q.answers || [q.answer])[0]) + '</span>',
    },

    proof: {
      html: q => '<textarea class="qz-proof-ta" rows="6" placeholder="Work it out — sketch the derivation, define the terms, argue the point. Then check yourself against the rubric."></textarea>'
        + '<div class="qz-proof-steps"><button class="btn btn-ghost btn-sm" id="qz-rubric-btn">' + QML.icon('check', 13) + ' I am done — show the rubric</button></div>'
        + '<div class="qz-rubric" hidden>' + (q.rubric || []).map((r, i) =>
          '<label class="qz-rub"><input type="checkbox" data-i="' + i + '"><span>' + ui.md(r) + '</span></label>').join('') + '</div>',
      wire(card, q, st, next) {
        st.ans = { attempt: '', checks: [] };
        const ta = card.querySelector('.qz-proof-ta');
        const rb = card.querySelector('#qz-rubric-btn');
        const rub = card.querySelector('.qz-rubric');
        ta.oninput = () => { st.ans.attempt = ta.value; };
        rb.onclick = () => {
          rb.hidden = true;
          rub.hidden = false;
          rub.querySelectorAll('input').forEach(c => c.onchange = () => {
            st.ans.checks[+c.dataset.i] = c.checked;
            next.disabled = false;
          });
          if (st.ans.checks.length) next.disabled = false;
        };
      },
      grade: (q, a) => {
        if (!a || !a.checks || !q.rubric || !q.rubric.length) return 0;
        const got = a.checks.filter(Boolean).length;
        const frac = got / q.rubric.length;
        DB.recordProof(q.id, Math.round(frac * 100), got + '/' + q.rubric.length);
        return frac;
      },
      review: (q, a) => {
        const got = a && a.checks ? a.checks.filter(Boolean).length : 0;
        return '<div class="qz-mrow">Self-scored <b>' + got + '/' + (q.rubric || []).length + '</b> rubric points</div>'
          + (q.rubric || []).map((r, i) => '<div class="qz-mrow ' + (a && a.checks && a.checks[i] ? 'ok' : 'bad') + '">' + (a && a.checks && a.checks[i] ? '✓' : '✗') + ' ' + ui.md(r) + '</div>').join('');
      },
    },
  };

  QML.views.eval = function (el, params) {
    const ev = (window.QML_EVALS || []).find(e => e.id === params[0]);
    if (!ev) {
      el.innerHTML = ui.empty('evals', 'Evaluation not found', 'It may have been renamed or removed.')
        + '<div style="text-align:center;margin-top:14px"><a class="btn btn-ghost" href="#/evals">' + QML.icon('left', 15) + ' Back to evals</a></div>';
      return;
    }
    const qs = resolveQs(ev);
    if (!qs.length) {
      el.innerHTML = ui.empty('evals', 'This eval has no questions yet')
        + '<div style="text-align:center;margin-top:14px"><a class="btn btn-ghost" href="#/evals">' + QML.icon('left', 15) + ' Back to evals</a></div>';
      return;
    }
    startExam(el, ev, qs);
  };

  function startExam(el, ev, qs) {
    const st = { i: 0, ans: new Array(qs.length), t0: Date.now(), subs: [] };
    let iv = null;

    function renderQ() {
      const q = qs[st.i];
      const kind = KINDS[q.kind || 'mcq'] ? (q.kind || 'mcq') : 'mcq';
      const last = st.i === qs.length - 1;
      const sub = st.subs[st.i] || (st.subs[st.i] = { ans: null });
      el.innerHTML = '<div class="qz-exam">'
        + '<div class="qz-exam-head">'
        +   '<div class="qz-exam-id">'
        +     '<span class="qz-eval-ico sm">' + QML.icon(ev.icon || 'evals', 18) + '</span>'
        +     '<div><div class="qz-exam-title">' + ui.esc(ev.title) + '</div>'
        +     '<div class="qz-exam-sub">Question ' + (st.i + 1) + ' of ' + qs.length + ' · ' + (KIND_NAMES[kind]) + ' · ~' + ev.timeMin + ' min</div></div>'
        +   '</div>'
        +   '<div class="qz-timer" title="Elapsed time">' + QML.icon('clock', 15) + '<span id="qz-clock">0:00</span></div>'
        + '</div>'
        + '<div class="pbar"><i style="width:' + (st.i / qs.length) * 100 + '%"></i></div>'
        + '<div class="card qz-qcard qz-in" data-kind="' + kind + '">'
        +   '<div class="qz-prompt">' + ui.md(q.prompt) + '</div>'
        +   '<div class="qz-body">' + KINDS[kind].html(q) + '</div>'
        +   '<div class="qz-qfoot">'
        +     '<span class="muted" id="qz-hint">' + (kind === 'proof' ? 'Write first, score against the rubric' : 'Answer to continue') + '</span>'
        +     '<button class="btn btn-primary" id="qz-next" disabled>' + (last ? 'Submit eval' : 'Next') + ' ' + QML.icon(last ? 'check' : 'right', 15) + '</button>'
        +   '</div>'
        + '</div></div>';

      const clock = el.querySelector('#qz-clock');
      if (iv) clearInterval(iv);
      iv = setInterval(() => {
        if (!document.contains(clock)) { clearInterval(iv); iv = null; return; }
        clock.textContent = mmss((Date.now() - st.t0) / 1000);
      }, 500);
      clock.textContent = mmss((Date.now() - st.t0) / 1000);

      const next = el.querySelector('#qz-next');
      const card = el.querySelector('.qz-qcard');
      KINDS[kind].wire(card, q, sub, next);

      next.onclick = () => {
        if (last) { finish(); return; }
        card.classList.remove('qz-in');
        card.classList.add('qz-out');
        setTimeout(() => { st.i++; renderQ(); }, 170);
      };
    }

    function finish() {
      if (iv) { clearInterval(iv); iv = null; }
      const total = qs.length;
      const scores = qs.map((q, i) => KINDS[qs[i].kind || 'mcq'].grade(qs[i], st.subs[i].ans));
      const frac = scores.reduce((a, b) => a + b, 0) / total;
      const correct = scores.filter(x => x >= 0.999).length;
      const pct = Math.round(frac * 100);
      const letter = gradeLetter(pct);
      const elapsed = mmss((Date.now() - st.t0) / 1000);
      DB.finishEval(ev.id, pct, correct, total);
      DB.addXP(50 + correct * 10, 'Eval complete');
      const best = DB.evalBest(ev.id);

      const reviewHtml = qs.map((q, i) => {
        const sc = scores[i];
        const ok = sc >= 0.999, half = sc > 0 && sc < 0.999;
        const kind = q.kind || 'mcq';
        return '<li class="qz-rev ' + (ok ? 'ok' : 'bad') + '">'
          + '<span class="qz-rev-ico">' + QML.icon(ok ? 'check' : 'x', 14) + '</span>'
          + '<div class="qz-rev-body">'
          + '<div class="qz-rev-q">' + (i + 1) + '. <span class="tag">' + KIND_NAMES[kind] + '</span> ' + ui.md(q.prompt) + '</div>'
          + '<div class="qz-rev-a">' + KINDS[kind].review(q, st.subs[i].ans) + (half ? ' <span class="tag warn">' + Math.round(sc * 100) + '%</span>' : '') + '</div>'
          + (q.explain ? '<div class="qz-rev-x muted">' + ui.md(q.explain) + '</div>' : '')
          + '</div></li>';
      }).join('');

      el.innerHTML = '<div class="qz-result">'
        + '<div class="card qz-hero qz-in">'
        +   ui.ring(pct, 150, pct + '%', 10)
        +   '<div class="qz-hero-info">'
        +     '<div class="qz-grade-line"><span class="qz-letter-grade">' + letter + '</span>'
        +       '<span class="tag ' + (pct >= 70 ? 'success' : pct >= 50 ? 'warn' : 'danger') + '">' + (pct >= 70 ? 'Passed' : 'Keep practicing') + '</span></div>'
        +     '<div class="qz-hero-line"><strong>' + correct + '/' + total + '</strong> fully correct · finished in ' + elapsed + '</div>'
        +     '<div class="muted">Best score on this eval: ' + best + '%</div>'
        +     '<div class="qz-hero-btns"><button class="btn btn-primary" id="qz-retake">' + QML.icon('refresh', 15) + ' Retake</button>'
        +     '<a class="btn btn-ghost" href="#/evals">' + QML.icon('left', 15) + ' Back to evals</a></div>'
        +   '</div></div>'
        + '<div class="card section-gap">'
        +   '<div class="card-head"><div class="card-title">' + QML.icon('evals', 17) + ' Review — ' + qs.length + ' questions</div></div>'
        +   '<ul class="qz-review">' + reviewHtml + '</ul></div></div>';
      el.querySelector('#qz-retake').onclick = () => startExam(el, ev, qs);
    }

    renderQ();
  }
})();
