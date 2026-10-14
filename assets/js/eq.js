/* ============================================================
   QML.eq — annotated equations with drag-to-explain symbols.

   Authoring:
     tex fields use @{key}{...} shorthand around any symbol/group;
     it expands to KaTeX \htmlData{sym=key}{...} (needs trust:true).
     Each eqx spec:
       { name, tex, symbols: { key: [title, 'what it does here'] },
         what, pipeline, limits, open }
   QML.eq.block(spec) renders; QML.eq.bind(node, spec) wires the
   drag/hover card. Unbound equations (answer options) get nothing.
   ============================================================ */
(function () {
  const ui = () => QML.ui;

  /* @{key}{...}  ->  \htmlData{sym=key}{...} */
  function expand(src) {
    return String(src).replace(/@\{([A-Za-z0-9_]+)\}/g, '\\htmlData{sym=$1}');
  }

  function tex(src, display) {
    try {
      if (window.katex) {
        const m = /^\$([\s\S]+)\$$/.exec(String(src).trim());
        if (m) src = m[1];
        return katex.renderToString(src, {
          displayMode: display !== false, throwOnError: true,
          strict: 'ignore', trust: true,
        });
      }
    } catch (e) { /* fall through to raw text */ }
    return ui().esc(src);
  }
  /* plain render, no annotation processing (options, plain display) */
  function texRaw(src, display) {
    try {
      if (window.katex) {
        const m = /^\$([\s\S]+)\$$/.exec(String(src).trim());
        if (m) src = m[1];
        return katex.renderToString(src, { displayMode: !!display, throwOnError: true, strict: 'ignore' });
      }
    } catch (e) { /* fall through */ }
    return ui().esc(src);
  }

  /* ---------- block markup ---------- */
  function block(spec, cls) {
    const esc = ui().esc;
    return `<div class="eqx ${cls || ''}" data-eq>
      <div class="eqx-top">
        ${spec.name ? `<span class="eqx-name">${QML.icon('atom', 13)} ${esc(spec.name)}</span>` : ''}
        <span class="eqx-hint muted">${QML.icon('eye', 12)} drag over symbols</span>
      </div>
      <div class="eqx-body">${tex(expand(spec.tex), true)}</div>
    </div>`;
  }

  /* ---------- floating card ---------- */
  let card = null;
  function getCard() {
    if (card && document.body.contains(card)) return card;
    card = document.createElement('div');
    card.className = 'eqx-card';
    card.hidden = true;
    document.body.appendChild(card);
    return card;
  }
  function place(e) {
    const c = getCard();
    const pad = 14, w = c.offsetWidth, h = c.offsetHeight;
    let x = e.clientX + pad, y = e.clientY + pad;
    if (x + w > innerWidth - 8) x = e.clientX - w - pad;
    if (y + h > innerHeight - 8) y = e.clientY - h - pad;
    c.style.left = Math.max(8, x) + 'px';
    c.style.top = Math.max(8, y) + 'px';
  }
  function metaRows(spec) {
    const esc = ui().esc, md = s => ui().md(s);
    let out = '';
    if (spec.what) out += `<div class="eqx-c-row"><span class="eqx-c-k">what it does</span><span>${md(spec.what)}</span></div>`;
    if (spec.pipeline) out += `<div class="eqx-c-row"><span class="eqx-c-k">in a QML pipeline</span><span>${md(spec.pipeline)}</span></div>`;
    if (spec.limits) out += `<div class="eqx-c-row"><span class="eqx-c-k">limitations</span><span>${md(spec.limits)}</span></div>`;
    if (spec.open) out += `<div class="eqx-c-row"><span class="eqx-c-k">open problem</span><span>${md(spec.open)}</span></div>`;
    return out || `<div class="eqx-c-row"><span class="muted">No notes for this equation.</span></div>`;
  }
  function showCard(e, spec, symKey) {
    const c = getCard();
    const esc = ui().esc, md = s => ui().md(s);
    const sym = symKey && spec.symbols ? spec.symbols[symKey] : null;
    c.innerHTML = `
      ${spec.name ? `<div class="eqx-c-eq">${QML.icon('atom', 12)} ${esc(spec.name)}</div>` : ''}
      ${sym ? `<div class="eqx-c-sym"><span class="eqx-c-glyph">${md('$' + (sym[2] || symKey) + '$')}</span><strong>${esc(sym[0])}</strong></div>
              <div class="eqx-c-does">${md(sym[1])}</div>
              ${sym[3] ? `<div class="eqx-c-ex"><span class="eqx-c-k">e.g.</span> ${md(sym[3])}</div>` : ''}` : ''}
      <div class="eqx-c-meta">${metaRows(spec)}</div>`;
    c.hidden = false;
    place(e);
  }
  function hideCard() { const c = getCard(); c.hidden = true; }

  /* ---------- binding ---------- */
  function bind(node, spec) {
    if (!node || !spec) return;
    let down = false, cur = null;
    const clear = () => {
      if (cur) { cur.classList.remove('on'); cur = null; }
      hideCard();
    };
    const update = e => {
      const t = e.target && e.target.closest ? e.target.closest('[data-sym]') : null;
      if (cur && cur !== t) cur.classList.remove('on');
      cur = t;
      if (cur) cur.classList.add('on');
      showCard(e, spec, t ? t.dataset.sym : null);
    };
    node.addEventListener('pointerdown', e => {
      down = true;
      try { node.setPointerCapture && node.setPointerCapture(e.pointerId); } catch (_) {}
      update(e);
    });
    node.addEventListener('pointermove', e => {
      /* hover works too — drag is just the explicit gesture */
      if (e.pointerType === 'mouse' || down) update(e);
    });
    node.addEventListener('pointerup', () => { down = false; });
    node.addEventListener('pointerleave', () => { down = false; clear(); });
    node.addEventListener('pointercancel', () => { down = false; clear(); });
  }
  /* bind every .eqx under container to specs in DOM order */
  function bindAll(container, specs) {
    const nodes = container.querySelectorAll('.eqx');
    nodes.forEach((n, i) => bind(n, specs[i]));
  }

  window.QML = window.QML || {};
  window.QML.eq = { expand, tex, texRaw, block, bind, bindAll };
})();
