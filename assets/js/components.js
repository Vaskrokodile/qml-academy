/* QML.ui — shared UI helpers for all views. */
(function () {
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function toast(msg, icon) {
    const box = document.getElementById('toasts');
    if (!box) return;
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = QML.icon(icon || 'check', 18) + '<span>' + esc(msg) + '</span>';
    box.appendChild(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 320); }, 2600);
  }

  /* Circular progress ring. pct 0-100 */
  function ring(pct, size, label, stroke) {
    size = size || 64; stroke = stroke || 6;
    const r = (size - stroke) / 2, c = 2 * Math.PI * r;
    const off = c * (1 - Math.min(Math.max(pct, 0), 100) / 100);
    return `<div class="ring" style="width:${size}px;height:${size}px">
      <svg width="${size}" height="${size}">
        <circle class="track" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="${stroke}" fill="none"/>
        <circle class="val" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="${stroke}" fill="none"
          stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"/>
      </svg>
      <span class="ring-label" style="font-size:${Math.round(size / 3.4)}px">${label != null ? label : Math.round(pct) + '%'}</span>
    </div>`;
  }

  /* Streak flame with count inside */
  function flame(count, lit) {
    return `<span class="flame-wrap ${lit ? 'lit' : ''}" title="${count} day streak">
      <svg viewBox="0 0 24 24" fill="none"><path class="body" d="M12 2c1 4-4 6-4 11a4.5 4.5 0 0 0 9 0c0-1.5-.5-2.5-1.2-3.6-.5 1-1.2 1.6-2 1.6.8-2.8-.3-6.5-1.8-9Z" fill="var(--surface-3)" stroke="var(--text-3)" stroke-width="1.4" stroke-linejoin="round"/></svg>
      <span class="flame-num">${count}</span>
    </span>`;
  }

  /* ---------- animated rank gems ----------
     Each tier gets a distinct gem cut + animation layer:
     halo (spin) → body+facets → shine sweep → orbit particles
     → twinkles/rays (top tiers). Styles live in rank.css. */
  const GEM_PTS = {
    initiate: '24,16 31,20 31,28 24,32 17,28 17,20',
    bronze:   '24,12 34,18 34,30 24,36 14,30 14,18',
    silver:   '24,12 34,18 34,30 24,36 14,30 14,18',
    gold:     '24,10 31,13 35,20 35,28 31,35 24,38 17,35 13,28 13,20 17,13',
    platinum: '24,10 35,17 35,31 24,38 13,31 13,17',
    diamond:  '18,14 30,14 34,20 24,38 14,20',
    ruby:     '24,10 30,15 33,21 30,27 24,31 18,27 15,21 18,15',
    master:   '24,8 31,16 34,24 31,32 24,40 17,32 14,24 17,16',
    sage:     '24,8 33,15 33,24 24,32 15,24 15,15',
  };
  function starPts(n, r1, r2) {
    const pts = [];
    for (let i = 0; i < n * 2; i++) {
      const a = -Math.PI / 2 + i * Math.PI / n;
      const r = i % 2 ? r2 : r1;
      pts.push((24 + r * Math.cos(a)).toFixed(1) + ',' + (24 + r * Math.sin(a)).toFixed(1));
    }
    return pts.join(' ');
  }
  /* extra facet work per tier — emerald gets the classic step-cut
     look: outer/inner chamfered squares + alternating facet quads */
  const GEM_EXTRA = {
    diamond: `<path class="rgem-fac" d="M18,14 L30,14 L34,20 L14,20 Z M18,14 L24,20 M30,14 L24,20 M14,20 L24,38 M20,20 L24,38 M28,20 L24,38 M34,20 L24,38"/>`,
    emerald: `<path class="rgem-fac" d="M19,17 29,17 32,20 32,28 29,31 19,31 16,28 16,20 Z
      M17,12 19,17 M31,12 29,17 M36,17 32,20 M36,31 32,28 M31,36 29,31 M17,36 19,31 M12,31 16,28 M12,17 16,20
      M19,17 24,24 M29,17 24,24 M32,28 24,24 M16,28 24,24"/>
      <path class="rgem-facl" d="M17,12 19,17 16,20 12,17 Z M31,12 36,17 32,20 29,17 Z M24,24 29,31 32,28 Z"/>
      <path class="rgem-facd" d="M36,17 36,31 32,28 32,20 Z M12,31 16,28 19,31 17,36 Z M19,17 24,24 16,20 Z"/>`,
    master: `<path class="rgem-fac" d="M24,8 L24,40 M17,16 L31,32 M31,16 L17,32 M14,24 L34,24"/>`,
    ruby: `<path class="rgem-fac" d="M24,10 L24,31 M15,21 L33,21 M18,15 L30,27 M30,15 L18,27"/>`,
    sage: `<g class="rgem-rays"><path d="M24,4v4M24,40v4M6,10l3,3M42,10l-3,3M6,38l3-3M42,38l-3-3"/></g>`,
    tesla: `<g class="rgem-rays"><path d="M24,3v5M24,40v5M3,24h5M40,24h5M9.2,9.2l3.5,3.5M35.3,35.3l3.5,3.5M38.8,9.2l-3.5,3.5M12.7,35.3l-3.5,3.5"/></g>`,
    grandmaster: `<g class="rgem-rays"><path d="M24,5v4M24,39v4M5,24h4M39,24h4"/></g>`,
  };
  const GEM_TIERS = {
    initiate: {}, bronze: {}, silver: { pulse: 1 }, gold: { shine: 1 },
    platinum: { pulse: 1, shine: 1 },
    diamond: { shine: 1, twinkle: 1 }, emerald: { pulse: 1, shine: 1, glow: 1 },
    ruby: { shine: 1, glow: 1, twinkle: 1 },
    master: { orbit: 1, glow: 1 }, grandmaster: { orbit: 2, glow: 1, twinkle: 1 },
    sage: { orbit: 2, glow: 1, twinkle: 1, shine: 1 },
    tesla: { orbit: 3, glow: 1, twinkle: 1, hot: 1 },
  };
  function rankGem(rank, size) {
    size = size || 30;
    const c = rank.color;
    const t = GEM_TIERS[rank.id] || {};
    const pts = GEM_PTS[rank.id] || starPts(8, 15, 7);
    const verts = pts.split(' ').map(p => p.split(',').map(Number));
    const cx = verts.reduce((a, v) => a + v[0], 0) / verts.length;
    const cy = verts.reduce((a, v) => a + v[1], 0) / verts.length;
    const facLines = verts.filter((v, i) => GEM_PTS[rank.id] || !(i % 2))
      .map(v => `M${cx.toFixed(1)},${cy.toFixed(1)}L${v[0]},${v[1]}`).join('');
    const orbits = t.orbit ? Array.from({ length: t.orbit }, (_, i) =>
      `<g class="rgem-orb o${i + 1}"><circle class="rgem-orbp" cx="24" cy="6.5" r="${i === 1 ? 1.1 : 1.5}"/></g>`).join('') : '';
    const twinkles = t.twinkle
      ? `<path class="rgem-tk tk1" d="M36,9l1.1,2.4 2.4,1.1-2.4,1.1-1.1,2.4-1.1-2.4-2.4-1.1 2.4-1.1Z"/>
         <path class="rgem-tk tk2" d="M12,32l.9,1.9 1.9,.9-1.9,.9-.9,1.9-.9-1.9-1.9-.9 1.9-.9Z"/>` : '';
    /* division pips: I/II/III shown as 1–3 lit dots beneath the gem */
    const sub = rank.sub || 0;
    const pips = sub ? `<span class="rgem-pips">${[1, 2, 3].map(i =>
      `<i class="${i <= sub ? 'lit' : ''}"></i>`).join('')}</span>` : '';
    return `<span class="rgem rgem-${rank.id}${t.hot ? ' rgem-hot' : ''}" style="--gc:${c};width:${size}px;height:${size}px">
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle class="rgem-halo" cx="24" cy="24" r="20.5"/>
        <circle class="rgem-halo h2" cx="24" cy="24" r="17.5"/>
        ${GEM_EXTRA[rank.id] && GEM_EXTRA[rank.id].includes('rays') ? GEM_EXTRA[rank.id] : ''}
        ${orbits}
        <polygon class="rgem-body" points="${pts}"/>
        <path class="rgem-fac" d="${facLines}"/>
        ${GEM_EXTRA[rank.id] && !GEM_EXTRA[rank.id].includes('rays') ? GEM_EXTRA[rank.id] : ''}
        <path class="rgem-hl" d="M${cx - 7},${cy - 7} Q${cx - 3},${cy - 9} ${cx + 2},${cy - 6} L${cx - 3},${cy - 2} Z"/>
        ${t.shine ? `<path class="rgem-shine" d="M${cx},${cy} L${cx + 1.5},${cy - 14} A14,14 0 0 1 ${cx + 10},${cy - 9.8} Z"/>` : ''}
        ${twinkles}
      </svg>
      <span class="rgem-letter">${rank.name[0]}</span>
      ${pips}
    </span>`;
  }

  function fmtTime(sec) {
    sec = Math.round(sec);
    if (sec < 60) return sec + 's';
    const h = Math.floor(sec / 3600), m = Math.round((sec % 3600) / 60);
    return h ? `${h}h ${m}m` : `${m}m`;
  }

  /* Inline SVG line/area sparkline. data: number[] */
  function spark(data, w, h, filled) {
    w = w || 90; h = h || 30;
    if (!data.length) data = [0, 0];
    const max = Math.max(...data, 1), min = Math.min(...data, 0);
    const rng = max - min || 1;
    const pts = data.map((v, i) => {
      const x = (i / (data.length - 1 || 1)) * (w - 4) + 2;
      const y = h - 3 - ((v - min) / rng) * (h - 6);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    const line = `M${pts.join(' L')}`;
    const area = `${line} L${w - 2},${h - 2} L2,${h - 2} Z`;
    return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none">
      ${filled ? `<path d="${area}" fill="var(--accent-soft)"/>` : ''}
      <path d="${line}" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>
    </svg>`;
  }

  /* Mini bar chart for stats. data: [{label, value}] */
  function bars(data, w, h) {
    w = w || 240; h = h || 120;
    const max = Math.max(...data.map(d => d.value), 1);
    const bw = Math.min(26, (w / data.length) * 0.55);
    const gap = w / data.length;
    let out = '';
    data.forEach((d, i) => {
      const bh = Math.max(3, (d.value / max) * (h - 24));
      const x = i * gap + (gap - bw) / 2;
      out += `<rect x="${x.toFixed(1)}" y="${(h - 16 - bh).toFixed(1)}" width="${bw}" height="${bh.toFixed(1)}" rx="4" fill="var(--accent)" opacity="${d.value ? .9 : .25}"/>`;
      out += `<text x="${(x + bw / 2).toFixed(1)}" y="${h - 3}" text-anchor="middle" font-size="9" fill="var(--text-3)" font-family="var(--font-body)">${esc(d.label)}</text>`;
    });
    return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${out}</svg>`;
  }

  function empty(icon, msg, sub) {
    return `<div class="empty">${QML.icon(icon || 'atom', 38)}<p>${esc(msg)}</p>${sub ? `<p class="muted" style="font-size:12px;margin-top:4px">${esc(sub)}</p>` : ''}</div>`;
  }

  /* Render a TeX string via KaTeX; falls back to escaped text if
     katex is missing or the source fails to parse. */
  function tex(src, display) {
    try {
      if (window.katex) {
        const m = /^\$([\s\S]+)\$$/.exec(String(src).trim());
        if (m) src = m[1];                       // tolerate $...$ wrappers from the data
        return katex.renderToString(src, { displayMode: !!display, throwOnError: true, strict: 'ignore' });
      }
    } catch (e) { /* fall through to raw text */ }
    return esc(src);
  }

  /* Render markdown-ish: **bold**, `code`, $...$ math, line breaks.
     Math segments are stashed as placeholders first so **...** can wrap
     around them (e.g. **$\log N$ qubits**) without breaking the markdown. */
  function md(s) {
    const PH = '\u0003';
    const segs = [];
    const txt = String(s == null ? '' : s).replace(/\$([^$]+)\$/g, (m, inner) => {
      segs.push(inner);
      return PH + (segs.length - 1) + PH;
    });
    const html = esc(txt)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="math">$1</code>')
      .replace(/\n/g, '<br>');
    return html.replace(new RegExp(PH + '(\\d+)' + PH, 'g'), (m, i) => tex(segs[+i], false));
  }

  /* Lightweight modal overlay — click backdrop or Esc to dismiss. */
  function modal(html) {
    const ov = document.createElement('div');
    ov.className = 'modal-ov';
    ov.innerHTML = `<div class="modal card" role="dialog">${html}</div>`;
    ov.addEventListener('click', e => { if (e.target === ov) ov.remove(); });
    const onKey = e => { if (e.key === 'Escape') { ov.remove(); document.removeEventListener('keydown', onKey); } };
    document.addEventListener('keydown', onKey);
    document.body.appendChild(ov);
    return ov;
  }

  /* Rank roadmap: every division (I/II/III per tier), the MMR needed,
     and where the user stands — grouped under their tier. */
  function rankRoadmap() {
    const m = QML.DB.mmrRank();
    const lad = QML.DB.ladder();
    const rows = QML.DB.RANKS.map((tier, ti) => {
      const subs = lad.slice(ti * 3, ti * 3 + 3);
      const tierDone = m.value >= tier.mmr + (subs[2] ? subs[2].mmr - tier.mmr : 0) && m.rank.mmr >= subs[2].mmr;
      const curTier = m.rank.id === tier.id;
      const subRows = subs.map(r => {
        const done = m.value >= r.mmr;
        const cur = curTier && r.sub === m.rank.sub;
        const bandPct = cur ? Math.round((m.value - r.mmr) / r.span * 100) : done ? 100 : 0;
        return `<div class="rm-row rm-sub ${cur ? 'cur' : ''} ${done ? 'done' : ''}">
          <div class="rm-info">
            <div class="rm-name">${esc(r.label)} ${cur ? '<span class="tag">you are here</span>' : done ? QML.icon('check', 13) : ''}</div>
            <div class="pbar rm-bar"><i style="width:${bandPct}%"></i></div>
          </div>
          <div class="rm-you muted mono">${done ? '✓' : r.mmr}</div>
        </div>`;
      }).join('');
      return `<div class="rm-tier ${curTier ? 'cur' : ''} ${tierDone && !curTier ? 'done' : ''}">
        <div class="rm-tier-head">
          ${rankGem(curTier ? m.rank : tier, 36)}
          <div class="rm-name">${esc(tier.name)}</div>
          <div class="rm-mmr muted">${tier.mmr}+ MMR</div>
        </div>
        ${subRows}
      </div>`;
    }).join('');
    modal(`
      <div class="rm-head">
        <div class="card-title">${QML.icon('gem')} Rank roadmap</div>
        <button class="btn btn-ghost" onclick="this.closest('.modal-ov').remove()">Close</button>
      </div>
      <div class="rm-now">
        ${rankGem(m.rank, 64)}
        <div class="rm-now-l"><small>Your MMR</small><b>${m.value}</b><em class="muted">${esc(m.rank.label)}</em></div>
        <div class="rm-now-r">${m.next ? `${m.next.mmr - m.value} to ${esc(m.next.label)}` : 'Top rank reached'}</div>
      </div>
      <div class="rm-list">${rows}</div>
      <div class="rm-foot muted">MMR v2 is grind-resistant: drill points soft-cap around 600, evals only count above 55%, misses claw back drill gains. The real climb runs through <b>proofs, hardcore derivations and eval excellence</b>. Each tier splits into I → II → III; Tesla means you've essentially solved everything.</div>`);
  }

  /* Pin a concept to the memory palace: choose a locus, write a vivid
     (weirder = stickier) association. Callable from anywhere. */
  function pinModal(prefill) {
    const pal = QML.DB.state().palace;
    const ov = modal(`
      <div class="rm-head">
        <div class="card-title">${QML.icon('layers')} Pin to your palace</div>
        <button class="btn btn-ghost" onclick="this.closest('.modal-ov').remove()">Close</button>
      </div>
      <div class="pin-tip muted">Method of loci: pick a spot on your route, then imagine the concept there —
        the <b>more absurd, vivid and sensory</b> the image, the better it sticks.</div>
      <label class="pin-l">Location
        <select class="pin-sel" id="pin-locus">
          ${pal.loci.map(l => `<option>${esc(l)}</option>`).join('')}
        </select>
      </label>
      <label class="pin-l">Concept
        <input class="pin-inp" id="pin-title" placeholder="e.g. Born rule — probabilities are squared amplitudes" value="${esc(prefill || '')}">
      </label>
      <label class="pin-l">The vivid image
        <textarea class="pin-ta" id="pin-vivid" rows="3" placeholder="e.g. A huge glowing ψ stamped on the front door — it SCREAMS the squared amplitude at anyone who knocks…"></textarea>
      </label>
      <button class="btn btn-primary" id="pin-save">${QML.icon('check', 14)} Pin it</button>`);
    ov.querySelector('#pin-save').onclick = () => {
      const title = ov.querySelector('#pin-title').value.trim();
      const vivid = ov.querySelector('#pin-vivid').value.trim();
      const locus = ov.querySelector('#pin-locus').value;
      if (!title) { ov.querySelector('#pin-title').focus(); return; }
      QML.DB.pinPalace({ locus, title, vivid });
      ov.remove();
      toast('Pinned to ' + locus, 'check');
      QML.views.palace && QML.routeInfo && QML.routeInfo.view === 'palace' && QML.render();
    };
    setTimeout(() => ov.querySelector('#pin-title').focus(), 30);
    return ov;
  }

  window.QML = window.QML || {};
  window.QML.ui = { esc, toast, ring, flame, rankGem, fmtTime, spark, bars, empty, md, tex, modal, rankRoadmap, pinModal };
})();
