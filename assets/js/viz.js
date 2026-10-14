/* ============================================================
   QML.viz — inline SVG renderers for visual/meta questions.
   Every spec returns an SVG string. Used by meta-challenges,
   eval mcq `viz` (prompt visual) and `vizOptions` (visual tiles).

   Spec types:
     {type:'bloch',   state:'zero|one|plus|minus|plusi|minusi'  or x,y, label}
     {type:'bars',    probs:[..], labels:[..], vals:bool}
     {type:'amps',    amps:[..signed or 'i'..], labels:[..]}
     {type:'circuit', wires:n|['q0','q1'], gates:[{g,w,x,c,t,label}]}
     {type:'matrix',  m:[[a,b],[c,d]]}
     {type:'curve',   shape:'flat|drop|s|decay|ring|gap', xlabel,ylabel}
     {type:'heat',    cells:[[..],[..]]}     // density-matrix heatmap
     {type:'flow',    nodes:['x','Φ(x)','|ψ(x)⟩'], hi:idx}
     {type:'tex',     tex:'$..$', big:bool}  // KaTeX tile
   ============================================================ */
(function () {
  const C = {
    ink: 'var(--text)', dim: 'var(--text-3)', line: 'var(--border-2)',
    accent: 'var(--accent)', ok: 'var(--success)', warn: 'var(--warn)', bad: 'var(--danger)',
  };
  const NS = 'http://www.w3.org/2000/svg';

  /* ---- helpers ---- */
  const txt = (x, y, s, o) =>
    `<text x="${x}" y="${y}" font-size="${o && o.s || 8.5}" fill="${o && o.c || C.dim}"
      text-anchor="${o && o.a || 'middle'}" font-family="var(--font-mono)">${s}</text>`;
  const line = (x1, y1, x2, y2, o) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${o && o.c || C.line}"
      stroke-width="${o && o.w || 1}" ${o && o.d ? `stroke-dasharray="${o.d}"` : ''}/>`;

  /* ---------- Bloch sphere (2D projection: z up, x right, y = ⊙/⊗) ---------- */
  const BLOCH_STATES = {
    zero: [0, -1], one: [0, 1], plus: [1, 0], minus: [-1, 0],
    plusi: null, minusi: null,
  };
  function bloch(s) {
    const cx = 80, cy = 52, R = 34;
    let v = s.state != null ? BLOCH_STATES[s.state] : [s.x || 0, s.y || 0];
    let arrow = '', marker = '';
    if (v) {
      const ex = cx + v[0] * (R - 3), ey = cy + v[1] * (R - 3);
      arrow = `<line x1="${cx}" y1="${cy}" x2="${ex}" y2="${ey}" stroke="${C.accent}" stroke-width="2.2" stroke-linecap="round"/>
        <circle cx="${ex}" cy="${ey}" r="3" fill="${C.accent}"/>`;
    } else if (s.state === 'plusi' || s.state === 'minusi') {
      /* y-axis points: draw at the 45° diagonal, ⊙ out of page, ⊗ in */
      const dx = s.state === 'plusi' ? 1 : -1;
      const ex = cx + dx * (R - 8) * 0.7, ey = cy - (R - 8) * 0.7;
      marker = `<circle cx="${ex}" cy="${ey}" r="5.5" fill="none" stroke="${C.accent}" stroke-width="1.8"/>
        ${s.state === 'plusi'
          ? `<circle cx="${ex}" cy="${ey}" r="1.6" fill="${C.accent}"/>`
          : `<line x1="${ex - 3.4}" y1="${ey - 3.4}" x2="${ex + 3.4}" y2="${ey + 3.4}" stroke="${C.accent}" stroke-width="1.6"/>
             <line x1="${ex - 3.4}" y1="${ey + 3.4}" x2="${ex + 3.4}" y2="${ey - 3.4}" stroke="${C.accent}" stroke-width="1.6"/>`}`;
    }
    return `<svg viewBox="0 0 160 104" class="viz viz-bloch">
      <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${C.line}" stroke-width="1.2"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${R}" ry="${R * 0.32}" fill="none" stroke="${C.line}" stroke-width="0.8" stroke-dasharray="2 2.5"/>
      ${line(cx, cy - R - 6, cx, cy + R + 6, { c: C.dim, w: 0.9 })}
      ${line(cx - R - 6, cy, cx + R + 6, cy, { c: C.dim, w: 0.9 })}
      ${line(cx + R * 0.5, cy - R * 0.5, cx + R + 2, cy - R - 2, { c: C.dim, w: 0.8, d: '2 2.5' })}
      ${txt(cx + 4, cy - R - 8, '|0⟩')}${txt(cx + 4, cy + R + 15, '|1⟩')}
      ${txt(cx + R + 12, cy + 3, '|+⟩')}${txt(cx - R - 12, cy + 3, '|−⟩')}
      ${txt(cx + R + 6, cy - R - 6, '|+i⟩', { s: 7.5 })}
      ${arrow}${marker}
      ${s.label ? txt(cx, 100, s.label, { s: 8 }) : ''}
    </svg>`;
  }

  /* ---------- measurement probability histogram ---------- */
  function bars(s) {
    const p = s.probs || [0.5, 0.5], n = p.length;
    const base = 82, top = 18, span = 118, left = 26;
    const bw = Math.min(26, (span / n) * 0.55);
    let out = '';
    p.forEach((v, i) => {
      const x = left + (i + 0.5) * (span / n) - bw / 2;
      const bh = Math.max(1.5, v * (base - top));
      out += `<rect x="${x.toFixed(1)}" y="${(base - bh).toFixed(1)}" width="${bw}" height="${bh.toFixed(1)}" rx="3" fill="${C.accent}" opacity="${v ? 0.9 : 0.25}"/>`;
      if (s.vals !== false) out += txt(x + bw / 2, base - bh - 4, String(Math.round(v * 100)) + '%', { s: 7.5, c: C.ink });
      if (s.labels && s.labels[i] != null) out += txt(x + bw / 2, base + 11, s.labels[i], { s: 8 });
    });
    return `<svg viewBox="0 0 160 104" class="viz viz-bars">
      ${line(left - 6, base, left + span + 6, base, { c: C.dim, w: 1 })}
      ${line(left - 6, top - 4, left - 6, base, { c: C.dim, w: 1 })}
      ${txt(left - 12, top + 2, 'p', { s: 8 })}
      ${out}
    </svg>`;
  }

  /* ---------- amplitude diagram (signed) ---------- */
  function amps(s) {
    const a = s.amps || [0.707, -0.707], n = a.length;
    const mid = 52, span = 118, left = 26;
    const bw = Math.min(24, (span / n) * 0.5);
    let out = '';
    a.forEach((v, i) => {
      const isI = typeof v === 'string';
      const val = isI ? parseFloat(v.replace('i', '')) || 0.707 : v;
      const x = left + (i + 0.5) * (span / n) - bw / 2;
      const bh = Math.max(2, Math.abs(val) * 42);
      const neg = val < 0, img = isI;
      const y = neg ? mid : mid - bh;
      const col = img ? C.warn : neg ? C.bad : C.ok;
      out += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw}" height="${bh.toFixed(1)}" rx="3"
        fill="${col}" opacity="0.85" ${img ? 'stroke-dasharray="3 2" stroke="' + col + '" fill-opacity="0.35"' : ''}/>`;
      if (img) out += txt(x + bw / 2, y - 4, 'i', { s: 8, c: C.warn });
      if (s.labels && s.labels[i] != null) out += txt(x + bw / 2, mid + 22, s.labels[i], { s: 8 });
    });
    return `<svg viewBox="0 0 160 104" class="viz viz-amps">
      ${line(left - 6, mid, left + span + 6, mid, { c: C.dim, w: 1 })}
      ${txt(left - 12, mid - 20, '+α', { s: 7.5 })}${txt(left - 12, mid + 26, '−α', { s: 7.5 })}
      ${out}
    </svg>`;
  }

  /* ---------- circuit diagram ---------- */
  function circuit(s) {
    const wires = Array.isArray(s.wires) ? s.wires : Array.from({ length: s.wires || 1 }, (_, i) => 'q' + i);
    const n = wires.length;
    const left = 26, right = 148, step = (right - left) / Math.max(1, (s.gates || []).length);
    const y = i => 30 + i * Math.min(40, 72 / Math.max(1, n - 1 || 1));
    const single = n === 1 ? 56 : 0;
    const yw = i => n === 1 ? 52 : y(i);
    let out = wires.map((w, i) =>
      line(left - 14, yw(i), right + 4, yw(i), { c: C.dim, w: 1.1 }) + txt(left - 18, yw(i) + 3, w, { s: 8, a: 'end' })).join('');
    const box = (x, yy, label, wide) => `<rect x="${x - (wide ? 12 : 9)}" y="${yy - 9}" width="${wide ? 24 : 18}" height="18" rx="4"
        fill="var(--surface-3)" stroke="${C.ink}" stroke-width="1.2"/>
      ${txt(x, yy + 3.5, label, { s: label.length > 3 ? 6 : 8, c: C.ink })}`;
    (s.gates || []).forEach((g, gi) => {
      const x = left + step * (g.x != null ? g.x : gi) + step / 2;
      if (g.g === 'CX') {
        out += line(x, yw(g.c), x, yw(g.t), { c: C.ink, w: 1.4 })
          + `<circle cx="${x}" cy="${yw(g.c)}" r="3" fill="${C.ink}"/>
             <circle cx="${x}" cy="${yw(g.t)}" r="7" fill="none" stroke="${C.ink}" stroke-width="1.4"/>
             ${line(x, yw(g.t) - 7, x, yw(g.t) + 7, { c: C.ink, w: 1.4 })}
             ${line(x - 7, yw(g.t), x + 7, yw(g.t), { c: C.ink, w: 1.4 })}`;
      } else if (g.g === 'CZ') {
        out += line(x, yw(g.c), x, yw(g.t), { c: C.ink, w: 1.4 })
          + `<circle cx="${x}" cy="${yw(g.c)}" r="3" fill="${C.ink}"/>
             <circle cx="${x}" cy="${yw(g.t)}" r="3" fill="${C.ink}"/>`;
      } else if (g.g === 'SWAP') {
        out += line(x, yw(g.c), x, yw(g.t), { c: C.ink, w: 1.4 })
          + [g.c, g.t].map(w => `<path d="M${x - 4},${yw(w) - 4} l8,8 M${x - 4},${yw(w) + 4} l8,-8" stroke="${C.ink}" stroke-width="1.4" fill="none"/>`).join('');
      } else if (g.g === 'M') {
        out += `<rect x="${x - 9}" y="${yw(g.w) - 9}" width="18" height="18" rx="4" fill="var(--surface-3)" stroke="${C.ink}" stroke-width="1.2"/>
          <path d="M${x - 5},${yw(g.w) + 3} a5,5 0 0 1 10,0" fill="none" stroke="${C.ink}" stroke-width="1.1"/>
          ${line(x, yw(g.w) + 3, x + 3.6, yw(g.w) - 3.4, { c: C.ink, w: 1.3 })}`;
      } else {
        out += box(x, yw(g.w != null ? g.w : 0), g.label || g.g, (g.label || g.g).length > 2);
      }
    });
    return `<svg viewBox="0 0 160 104" class="viz viz-circ">${out}</svg>`;
  }

  /* ---------- matrix ---------- */
  function matrix(s) {
    const m = s.m || [[1, 0], [0, 1]];
    const n = m.length, sz = 30, x0 = 80 - n * sz / 2, y0 = 52 - n * sz / 2;
    let out = `<path d="M${x0 - 6},${y0 - 4} v${n * sz + 8} M${x0 + n * sz + 6},${y0 - 4} v${n * sz + 8}"
      stroke="${C.ink}" stroke-width="1.4" fill="none"/>`;
    m.forEach((row, i) => row.forEach((v, j) => {
      const x = x0 + j * sz, y = y0 + i * sz;
      out += `<rect x="${x + 2}" y="${y + 2}" width="${sz - 4}" height="${sz - 4}" rx="4"
        fill="var(--surface-2)" stroke="${C.line}" stroke-width="0.6"/>`
        + txt(x + sz / 2, y + sz / 2 + 3.5, String(v), { s: 9, c: C.ink });
    }));
    return `<svg viewBox="0 0 160 104" class="viz viz-mat">${out}</svg>`;
  }

  /* ---------- small curve chart ---------- */
  const CURVES = {
    flat:    'M20,78 L140,72',
    drop:    'M20,26 C55,70 90,74 140,78',
    s:       'M20,80 C70,80 85,24 140,24',
    decay:   'M20,24 C55,30 95,66 140,78',
    ring:    'M20,30 C40,10 45,88 65,74 S110,50 140,62',
    gap:     'M20,30 C60,60 75,72 95,74 C115,72 128,45 140,30',
    barrier: 'M20,80 L68,80 C82,80 84,34 100,34 C116,34 118,80 140,80',
  };
  function curve(s) {
    const d = CURVES[s.shape] || CURVES.drop;
    return `<svg viewBox="0 0 160 104" class="viz viz-curve">
      ${line(16, 86, 146, 86, { c: C.dim, w: 1 })}${line(16, 14, 16, 86, { c: C.dim, w: 1 })}
      ${s.ylabel ? txt(10, 16, s.ylabel, { s: 7.5 }) : ''}
      ${s.xlabel ? txt(148, 96, s.xlabel, { s: 7.5 }) : ''}
      <path d="${d}" fill="none" stroke="${C.accent}" stroke-width="2" stroke-linecap="round"/>
      ${s.shape === 's' ? txt(34, 90, 'H₀', { s: 7.5, c: C.dim }) + txt(132, 18, 'H_P', { s: 7.5, c: C.dim }) : ''}
    </svg>`;
  }

  /* ---------- density-matrix heatmap ---------- */
  function heat(s) {
    const m = s.cells || [[1, 0], [0, 0]], n = m.length;
    const sz = 26, x0 = 80 - n * sz / 2, y0 = 48 - n * sz / 2;
    let out = '';
    m.forEach((row, i) => row.forEach((v, j) => {
      out += `<rect x="${x0 + j * sz + 1.5}" y="${y0 + i * sz + 1.5}" width="${sz - 3}" height="${sz - 3}" rx="4"
        fill="${C.accent}" opacity="${Math.max(0, Math.min(1, v)).toFixed(2)}" stroke="${C.line}" stroke-width="0.6"/>`;
    }));
    out += txt(x0 + sz / 2, y0 + n * sz + 12, s.labels ? s.labels[0] : '⟨0|', { s: 7 });
    out += txt(x0 - 8, y0 + sz / 2 + 3, s.labels ? s.labels[1] : '|0⟩', { s: 7 });
    return `<svg viewBox="0 0 160 104" class="viz viz-heat">${out}</svg>`;
  }

  /* ---------- flow / pipeline diagram ---------- */
  function flow(s) {
    const nodes = s.nodes || ['x', 'Φ(x)', '|ψ(x)⟩'];
    const n = nodes.length, bw = 42, gap = (150 - 14 - n * bw) / (n - 1 || 1), cy = 52;
    let out = '';
    nodes.forEach((nd, i) => {
      const x = 12 + i * (bw + gap);
      const hot = s.hi === i;
      out += `<rect x="${x}" y="${cy - 14}" width="${bw}" height="28" rx="7"
          fill="${hot ? 'var(--accent-soft)' : 'var(--surface-2)'}" stroke="${hot ? C.accent : C.line}" stroke-width="1.1"/>
        ${txt(x + bw / 2, cy + 3.5, nd, { s: 8.5, c: C.ink })}`;
      if (i < n - 1) {
        const x2 = x + bw, x3 = x + bw + gap;
        out += line(x2 + 1, cy, x3 - 1, cy, { c: C.dim, w: 1.2 })
          + `<path d="M${x3 - 5},${cy - 3.5} L${x3},${cy} L${x3 - 5},${cy + 3.5}" fill="none" stroke="${C.dim}" stroke-width="1.2"/>`;
      }
    });
    return `<svg viewBox="0 0 160 104" class="viz viz-flow">${out}</svg>`;
  }

  /* ---------- KaTeX tile ---------- */
  function tex(s) {
    const inner = QML.ui && QML.ui.tex ? QML.ui.tex(s.tex || '', true) : (s.tex || '');
    return `<div class="viz-tex${s.big ? ' big' : ''}">${inner}${s.sub ? `<div class="viz-tex-sub">${QML.ui.md(s.sub)}</div>` : ''}</div>`;
  }

  const KINDS = { bloch, bars, amps, circuit, matrix, curve, heat, flow, tex };
  window.QML = window.QML || {};
  window.QML.viz = function (spec) {
    const fn = spec && KINDS[spec.type];
    return fn ? fn(spec) : '';
  };
  window.QML.VIZ_KINDS = Object.keys(KINDS);
})();
