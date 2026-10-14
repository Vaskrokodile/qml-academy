/* ============================================================
   QML.ix — interactive meta-cognition widgets.
   Each widget mounts into a container and calls onSubmit(result)
   with {ok, scorePct, detail} — the host view handles scoring,
   XP, DB recording and feedback chrome.

   Widgets:
     blochset  — set θ/φ sliders to construct a target state
     gateseq   — click gates in order to reach a target state
     predict   — drag histogram bars to predict outcomes, then reveal
     selfexp   — explain in your own words, self-grade vs rubric
     confidence— confidence slider (wraps any question kind)
   ============================================================ */
(function () {
  const ui = () => QML.ui;

  /* ---------- complex helpers ---------- */
  const c = (r, i) => ({ r: r || 0, i: i || 0 });
  const cmul = (a, b) => c(a.r * b.r - a.i * b.i, a.r * b.i + a.i * b.r);
  const cadd = (a, b) => c(a.r + b.r, a.i + b.i);
  const cconj = a => c(a.r, -a.i);
  const cabs2 = a => a.r * a.r + a.i * a.i;
  const inner2 = (s, t) => cadd(cmul(cconj(t[0]), s[0]), cmul(cconj(t[1]), s[1])); // <t|s>
  const fidelity = (s, t) => cabs2(inner2(s, t));
  const fmtAmp = z => {
    const r = Math.round(z.r * 100) / 100, i = Math.round(z.i * 100) / 100;
    if (!i) return String(r);
    if (!r) return (i < 0 ? '−' : '') + Math.abs(i) + 'i';
    return r + (i < 0 ? '−' : '+') + Math.abs(i) + 'i';
  };

  const STATES = {
    zero:   [c(1), c(0)],
    one:    [c(0), c(1)],
    plus:   [c(Math.SQRT1_2), c(Math.SQRT1_2)],
    minus:  [c(Math.SQRT1_2), c(-Math.SQRT1_2)],
    plusi:  [c(Math.SQRT1_2), c(0, Math.SQRT1_2)],
    minusi: [c(Math.SQRT1_2), c(0, -Math.SQRT1_2)],
  };
  const STATE_TEX = {
    zero: '$|0\\rangle$', one: '$|1\\rangle$', plus: '$|+\\rangle$',
    minus: '$|-\\rangle$', plusi: '$|{+i}\\rangle$', minusi: '$|{-i}\\rangle$',
  };
  function stateOf(spec) {
    if (typeof spec === 'string') return STATES[spec];
    if (spec && spec.theta != null) {
      const th = spec.theta * Math.PI / 180, ph = (spec.phi || 0) * Math.PI / 180;
      return [c(Math.cos(th / 2)), c(Math.cos(ph) * Math.sin(th / 2), Math.sin(ph) * Math.sin(th / 2))];
    }
    if (spec && spec.a) return [c(spec.a[0], spec.a[1] || 0), c(spec.b[0], spec.b[1] || 0)];
    return STATES.zero;
  }
  /* state vector -> Bloch coordinates */
  const blochOf = s => {
    const [a, b] = s;
    const x = 2 * cmul(cconj(a), b).r;
    const y = 2 * cmul(cconj(a), b).i;
    const z = cabs2(a) - cabs2(b);
    return [x, y, z];
  };

  /* ---------- Bloch sphere SVG (θ, φ interactive) ---------- */
  function blochSVG(arrow) {  // arrow: [x,y,z] unit or null
    const cx = 90, cy = 58, R = 40;
    const px = (x, y, z) => [cx + R * (x + 0.42 * y), cy - R * (z + 0.42 * y)];
    const seg = (p, q, o) => `<line x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${q[0].toFixed(1)}" y2="${q[1].toFixed(1)}"
      stroke="${o.c || 'var(--border-2)'}" stroke-width="${o.w || 1}" ${o.d ? `stroke-dasharray="${o.d}"` : ''}/>`;
    const lab = (x, y, t, s) => `<text x="${x}" y="${y}" font-size="${s || 8.5}" fill="var(--text-3)" text-anchor="middle" font-family="var(--font-mono)">${t}</text>`;
    let out = '';
    const A = px(1.12, 0, 0), Am = px(-1.12, 0, 0), B = px(0, 1.18, 0), Z = px(0, 0, 1.14), Zm = px(0, 0, -1.18);
    out += seg(px(0, 0, -1.14), Z); out += seg(Am, A); out += seg(px(0, -1.18, 0), B, { d: '2 2.5' });
    out += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="var(--border-2)" stroke-width="1.2"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${R}" ry="${(R * 0.32).toFixed(1)}" fill="none" stroke="var(--border-2)" stroke-width="0.8" stroke-dasharray="2 2.5"/>`;
    const pz = px(0, 0, 1), pmz = px(0, 0, -1), pX = px(1.05, 0, 0), pXm = px(-1.05, 0, 0), pY = px(0, 1.3, 0);
    out += lab(pz[0] + 8, pz[1] + 2, '|0⟩') + lab(pmz[0] + 8, pmz[1] + 4, '|1⟩')
         + lab(pX[0] + 6, pX[1] + 3, '|+⟩') + lab(pXm[0] - 6, pXm[1] + 3, '|−⟩')
         + lab(pY[0] + 6, pY[1], '|+i⟩');
    if (arrow) {
      const [x, y, z] = arrow;
      const e = px(x * 0.97, y * 0.97, z * 0.97), o = px(0, 0, 0);
      out += `<line x1="${o[0]}" y1="${o[1]}" x2="${e[0]}" y2="${e[1]}" stroke="var(--accent)" stroke-width="2.4" stroke-linecap="round"/>
        <circle cx="${e[0]}" cy="${e[1]}" r="3.4" fill="var(--accent)"/>`;
      /* projection to equator — helps read φ */
      const g = px(x * 0.97, y * 0.97, 0);
      out += `<line x1="${e[0]}" y1="${e[1]}" x2="${g[0]}" y2="${g[1]}" stroke="var(--accent)" stroke-width="0.8" stroke-dasharray="2 2" opacity=".5"/>`;
    }
    return `<svg viewBox="0 0 180 118" class="viz ix-sphere">${out}</svg>`;
  }

  /* ================= blochset ================= */
  /* {target: stateSpec, label: 'what to build'} — sliders θ, φ */
  function blochset(host, spec, onSubmit) {
    let theta = 90, phi = 0;
    const tgt = stateOf(spec.target);
    const tgtB = blochOf(tgt);
    host.innerHTML = `
      <div class="ix-wrap">
        <div class="ix-bloch">
          <div class="ix-sphere-box">${blochSVG(blochOf([c(Math.SQRT1_2), c(Math.SQRT1_2)]))}</div>
          <div class="ix-bloch-ctl">
            <div class="ix-slider">
              <label><span>θ — polar angle (0° = |0⟩ north, 180° = |1⟩ south)</span><b id="ix-th">90°</b></label>
              <input type="range" min="0" max="180" step="1" value="90" id="ix-th-r">
            </div>
            <div class="ix-slider">
              <label><span>φ — azimuthal phase (the $e^{i\\varphi}$ angle)</span><b id="ix-ph">0°</b></label>
              <input type="range" min="0" max="359" step="1" value="0" id="ix-ph-r">
            </div>
            <div class="ix-state-eq" id="ix-eq"></div>
          </div>
        </div>
        <div class="hc-input-row" style="margin-top:10px">
          <button class="btn btn-primary" id="ix-go">${QML.icon('check', 14)} Check my state</button>
          <span class="muted" id="ix-msg" style="font-size:12px">Fidelity ≥ 97% counts — get the vector within ~14°.</span>
        </div>
      </div>`;
    const cur = () => {
      const th = theta * Math.PI / 180, ph = phi * Math.PI / 180;
      return [c(Math.cos(th / 2)), c(Math.cos(ph) * Math.sin(th / 2), Math.sin(ph) * Math.sin(th / 2))];
    };
    const redraw = () => {
      host.querySelector('#ix-th').textContent = theta + '°';
      host.querySelector('#ix-ph').textContent = phi + '°';
      host.querySelector('.ix-sphere-box').innerHTML = blochSVG(blochOf(cur()));
      const s = cur();
      host.querySelector('#ix-eq').innerHTML = QML.ui.md(
        '$|\\psi\\rangle = ' + fmtAmp(s[0]) + '|0\\rangle ' + (s[1].i < 0 || (s[1].i === 0 && s[1].r < 0) ? '' : '+') + fmtAmp(s[1]) + '|1\\rangle$');
    };
    host.querySelector('#ix-th-r').oninput = e => { theta = +e.target.value; redraw(); };
    host.querySelector('#ix-ph-r').oninput = e => { phi = +e.target.value; redraw(); };
    redraw();
    host.querySelector('#ix-go').onclick = () => {
      const f = fidelity(cur(), tgt);
      const ok = f >= 0.97;
      onSubmit({ ok, scorePct: Math.round(f * 100), detail: 'fidelity ' + (f * 100).toFixed(1) + '%' });
      host.querySelector('#ix-go').disabled = true;
      host.querySelectorAll('input').forEach(i => i.disabled = true);
    };
  }

  /* ================= gateseq ================= */
  const GATES = {
    H:  [[c(Math.SQRT1_2), c(Math.SQRT1_2)], [c(Math.SQRT1_2), c(-Math.SQRT1_2)]],
    X:  [[c(0), c(1)], [c(1), c(0)]],
    Y:  [[c(0), c(0, -1)], [c(0, 1), c(0)]],
    Z:  [[c(1), c(0)], [c(0), c(-1)]],
    S:  [[c(1), c(0)], [c(0), c(0, 1)]],
    'S†': [[c(1), c(0)], [c(0), c(0, -1)]],
    T:  [[c(1), c(0)], [c(0), c(Math.SQRT1_2, Math.SQRT1_2)]],
    'T†': [[c(1), c(0)], [c(0), c(Math.SQRT1_2, -Math.SQRT1_2)]],
  };
  const applyGate = (st, g) => [
    cadd(cmul(g[0][0], st[0]), cmul(g[0][1], st[1])),
    cadd(cmul(g[1][0], st[0]), cmul(g[1][1], st[1])),
  ];
  /* {start, target, palette, maxMoves} — build the state yourself */
  function gateseq(host, spec, onSubmit) {
    const start = stateOf(spec.start || 'zero');
    const tgt = stateOf(spec.target);
    const pal = spec.palette || ['H', 'X', 'Z', 'S', 'S†', 'T', 'T†', 'Y'];
    let seq = [];
    const cur = () => seq.reduce((s, g) => applyGate(s, GATES[g]), start);
    host.innerHTML = `
      <div class="ix-wrap">
        <div class="ix-bloch">
          <div class="ix-sphere-box">${blochSVG(blochOf(cur()))}</div>
          <div class="ix-bloch-ctl">
            <div class="ix-gates">
              <div class="ix-gate-pal">${pal.map(g =>
                `<button class="ix-gate-btn" data-g="${g}">${g}</button>`).join('')}</div>
              <div class="ix-gate-seq" id="ix-seq"><span class="muted">click gates to build a sequence — left to right</span></div>
              <div class="ix-readout">
                <span class="ix-fid">fidelity to target: <b id="ix-fidv">—</b></span>
                <button class="btn btn-ghost btn-sm" id="ix-undo">Undo</button>
                <button class="btn btn-ghost btn-sm" id="ix-clear">Clear</button>
              </div>
            </div>
          </div>
        </div>
        <div class="hc-input-row" style="margin-top:10px">
          <button class="btn btn-primary" id="ix-go">${QML.icon('check', 14)} Check sequence</button>
          <span class="muted" style="font-size:12px">Any working sequence counts (fidelity ≥ 97%). Max ${spec.maxMoves || 6} gates.</span>
        </div>
      </div>`;
    const redraw = () => {
      const s = cur();
      host.querySelector('.ix-sphere-box').innerHTML = blochSVG(blochOf(s));
      host.querySelector('#ix-fidv').textContent = seq.length ? (fidelity(s, tgt) * 100).toFixed(0) + '%' : '—';
      const sq = host.querySelector('#ix-seq');
      sq.innerHTML = seq.length
        ? seq.map((g, i) => `<span class="ix-gate-chip" data-i="${i}" title="click to remove">${g}</span>`).join(' → ')
        : '<span class="muted">click gates to build a sequence — left to right</span>';
      sq.querySelectorAll('.ix-gate-chip').forEach(ch => ch.onclick = () => { seq.splice(+ch.dataset.i, 1); redraw(); });
    };
    host.querySelectorAll('.ix-gate-btn').forEach(b => b.onclick = () => {
      if (seq.length >= (spec.maxMoves || 6)) { QML.ui.toast('Max ' + (spec.maxMoves || 6) + ' gates', 'x'); return; }
      seq.push(b.dataset.g); redraw();
    });
    host.querySelector('#ix-undo').onclick = () => { seq.pop(); redraw(); };
    host.querySelector('#ix-clear').onclick = () => { seq = []; redraw(); };
    redraw();
    host.querySelector('#ix-go').onclick = () => {
      const f = fidelity(cur(), tgt);
      const ok = f >= 0.97;
      onSubmit({ ok, scorePct: Math.round(f * 100), detail: seq.length + ' gates, fidelity ' + (f * 100).toFixed(1) + '%' });
      host.querySelector('#ix-go').disabled = true;
      host.querySelectorAll('button').forEach(i => i.disabled = true);
    };
  }

  /* ================= predict ================= */
  /* {probs:[true distribution], labels} — user drags bars, then reveal. */
  function predict(host, spec, onSubmit) {
    const n = spec.probs.length;
    const labels = spec.labels || spec.probs.map((_, i) => String(i));
    let pred = spec.start || spec.probs.map(() => Math.round(100 / n));
    host.innerHTML = `
      <div class="ix-wrap">
        <div style="font-size:12.5px;color:var(--text-2);margin-bottom:4px">Drag the bars — commit to a prediction before the reveal.</div>
        <div class="ix-predict" id="ix-pred">
          ${pred.map((p, i) => `<div class="ix-pbar" data-i="${i}">
            <span class="ix-pbar-val">${p}%</span>
            <div class="bar" style="height:${Math.max(3, p)}%"></div>
            <span class="ix-pbar-lab">${labels[i]}</span>
          </div>`).join('')}
        </div>
        <div id="ix-reveal" hidden>
          <div style="font-size:12px;color:var(--text-2);margin:8px 0 2px">Actual outcome:</div>
          <div class="ix-actual">
            ${spec.probs.map((p, i) => `<div class="ab">
              <i style="height:${Math.max(3, p * 100)}%"></i>
              <span>${labels[i]} · ${Math.round(p * 100)}%</span>
            </div>`).join('')}
          </div>
        </div>
        <div class="hc-input-row" style="margin-top:10px">
          <button class="btn btn-primary" id="ix-go">${QML.icon('check', 14)} Reveal & score</button>
          <span class="muted" id="ix-err" style="font-size:12px"></span>
        </div>
      </div>`;
    /* drag: pointerdown on a bar, move vertically */
    host.querySelectorAll('.ix-pbar').forEach(pb => {
      const i = +pb.dataset.i, bar = pb.querySelector('.bar'), val = pb.querySelector('.ix-pbar-val');
      const set = ev => {
        const r = pb.getBoundingClientRect();
        const p = Math.max(0, Math.min(100, (1 - (ev.clientY - r.top - 18) / (r.height - 30)) * 100));
        pred[i] = Math.round(p);
        bar.style.height = Math.max(3, pred[i]) + '%';
        val.textContent = pred[i] + '%';
      };
      pb.onpointerdown = ev => {
        pb.setPointerCapture(ev.pointerId);
        set(ev);
        const mv = e => set(e);
        pb.onpointermove = mv;
        pb.onpointerup = () => { pb.onpointermove = null; };
      };
    });
    host.querySelector('#ix-go').onclick = () => {
      host.querySelector('#ix-reveal').hidden = false;
      /* score: mean absolute error vs truth, 0 → 100 pts, ≥75 counts ok */
      const mae = pred.reduce((a, p, i) => a + Math.abs(p / 100 - spec.probs[i]), 0) / n;
      const scorePct = Math.round(Math.max(0, 1 - mae * 2) * 100);
      const ok = scorePct >= 75;
      host.querySelector('#ix-err').textContent = 'mean error ' + Math.round(mae * 100) + ' pts — score ' + scorePct + '%';
      host.querySelector('#ix-go').disabled = true;
      host.querySelectorAll('.ix-pbar').forEach(pb => { pb.onpointerdown = null; pb.style.pointerEvents = 'none'; });
      onSubmit({ ok, scorePct, detail: 'prediction error ' + Math.round(mae * 100) + 'pp' });
    };
  }

  /* ================= selfexp ================= */
  /* {model, rubric:[..]} — type your explanation, compare, self-grade */
  function selfexp(host, spec, onSubmit) {
    host.innerHTML = `
      <div class="ix-wrap ix-selfexp">
        <div style="font-size:12.5px;color:var(--text-2);margin-bottom:6px">
          Explain it like you're teaching it — <b>before</b> seeing the model answer. That struggle is the exercise.</div>
        <textarea id="ix-ta" placeholder="In your own words…"></textarea>
        <div class="hc-input-row">
          <button class="btn btn-primary" id="ix-rev" disabled>${QML.icon('eye', 14)} Reveal & self-grade</button>
          <span class="muted" style="font-size:12px">Write at least a sentence first.</span>
        </div>
        <div id="ix-model" hidden>
          <div class="ix-rubric">
            <b style="font-size:12.5px">Model answer — check what you covered:</b>
            <p style="margin:6px 0">${QML.ui.md(spec.model)}</p>
            <ul>${(spec.rubric || []).map(r => `<li>${QML.ui.md(r)}</li>`).join('')}</ul>
          </div>
          <div class="ix-selfgrade">
            <button class="btn btn-primary" data-g="2">${QML.icon('check', 14)} I captured the key idea</button>
            <button class="btn btn-ghost" data-g="1">Partially — missed a piece</button>
            <button class="btn btn-ghost" data-g="0">Missed it</button>
          </div>
        </div>
      </div>`;
    const ta = host.querySelector('#ix-ta');
    ta.oninput = () => { host.querySelector('#ix-rev').disabled = ta.value.trim().length < 15; };
    host.querySelector('#ix-rev').onclick = () => {
      host.querySelector('#ix-model').hidden = false;
      host.querySelector('#ix-rev').disabled = true;
      ta.disabled = true;
      host.querySelectorAll('.ix-selfgrade .btn').forEach(b => b.onclick = () => {
        const g = +b.dataset.g;
        onSubmit({ ok: g === 2, scorePct: [0, 60, 100][g], detail: ['missed', 'partial', 'captured'][g] });
        host.querySelectorAll('.ix-selfgrade .btn').forEach(x => x.disabled = true);
      });
    };
  }

  /* ================= confidence =================
     Mounts a "how sure are you?" slider. onLock(confPct) when committed.
     Returns {get:()=>pct} so callers can also read it lazily. */
  function confidence(host, onLock) {
    host.innerHTML = `
      <div class="ix-conf">
        <span class="ix-conf-face" id="ix-face">🤔</span>
        <span class="ix-conf-lab">How confident are you <b>before</b> answering?</span>
        <input type="range" min="0" max="100" step="5" value="50" id="ix-conf-r">
        <span class="ix-conf-val" id="ix-conf-v">50%</span>
        <button class="btn btn-ghost btn-sm" id="ix-conf-lock">Lock</button>
      </div>`;
    const r = host.querySelector('#ix-conf-r'), v = host.querySelector('#ix-conf-v'),
          f = host.querySelector('#ix-face'), lk = host.querySelector('#ix-conf-lock');
    let pct = 50, locked = false;
    r.oninput = () => {
      pct = +r.value;
      v.textContent = pct + '%';
      f.textContent = pct >= 80 ? '😤' : pct >= 60 ? '🙂' : pct >= 40 ? '🤔' : pct >= 20 ? '😬' : '🫠';
    };
    lk.onclick = () => { locked = true; r.disabled = true; lk.disabled = true; if (onLock) onLock(pct); };
    return { get: () => pct, locked: () => locked };
  }

  window.QML = window.QML || {};
  window.QML.ix = { blochset, gateseq, predict, selfexp, confidence, blochSVG, stateOf, fidelity, STATES, GATES };
})();
