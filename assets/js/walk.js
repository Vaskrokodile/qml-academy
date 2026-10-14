/* ============================================================
   QML.walk — post-answer walkthrough modal for the grind.
   Beginner steps (real rendered math) + a live QML.viz3d scene
   generated per question. QML.walk.open(question, result).
   ============================================================ */
(function () {
  let live = null;  // active viz handle + overlay

  function close() {
    if (!live) return;
    try { live.viz && live.viz.dispose(); } catch (e) {}
    try { live.el.remove(); } catch (e) {}
    live = null;
    document.removeEventListener('keydown', onKey);
  }
  function onKey(e) { if (e.key === 'Escape') close(); }

  function open(q, result) {
    const ui = QML.ui;
    const walk = (window.QML_APPLIED_WALK || {})[q.id];
    if (!walk) return;
    close();

    const el = document.createElement('div');
    el.className = 'ax-walk-overlay';
    el.innerHTML = `
      <div class="ax-walk" role="dialog" aria-label="Walkthrough">
        <div class="ax-walk-head">
          <div class="ax-walk-head-txt">
            <span class="eqx-name">${QML.icon('atom', 13)} ${ui.esc(q.eq && q.eq.name || 'Walkthrough')}</span>
            <div class="ax-walk-prompt">${ui.md(q.prompt)}</div>
          </div>
          <button class="ax-walk-x" aria-label="Close">${QML.icon('x', 16)}</button>
        </div>
        <div class="ax-walk-body">
          <div class="ax-walk-steps">
            ${(walk.steps || []).map((s, i) => `
              <div class="ax-step" style="--d:${i * 60}ms">
                <span class="ax-step-n">${i + 1}</span>
                <div class="ax-step-txt">
                  <div class="ax-step-h">${ui.md(s.h)}</div>
                  ${s.t ? `<div class="ax-step-t">${ui.md(s.t)}</div>` : ''}
                  ${s.eq ? `<div class="ax-step-eq">${QML.eq.texRaw(s.eq, true)}</div>` : ''}
                </div>
              </div>`).join('')}
            <div class="ax-step ax-verdict ${result && result.ok ? 'ok' : 'bad'}" style="--d:${(walk.steps || []).length * 60}ms">
              <span class="ax-step-n">${QML.icon(result && result.ok ? 'check' : 'x', 13)}</span>
              <div class="ax-step-txt">
                <div class="ax-step-h">So the answer is <b>${'ABCD'[q.answer]}</b></div>
                ${q.explain ? `<div class="ax-step-t muted">${ui.md(q.explain)}</div>` : ''}
              </div>
            </div>
          </div>
          <div class="ax-walk-stage">
            <div class="ax-walk-viz"></div>
            <div class="muted ax-walk-viz-hint">${QML.icon('eye', 12)} live render — drag to orbit</div>
          </div>
        </div>
      </div>`;

    document.body.appendChild(el);
    document.addEventListener('keydown', onKey);
    el.querySelector('.ax-walk-x').onclick = close;
    el.addEventListener('pointerdown', e => { if (e.target === el) close(); });

    /* mount the procedural scene */
    let viz = null;
    const stage = el.querySelector('.ax-walk-viz');
    const spec = walk.viz || { scene: 'state' };
    try {
      if (window.QML.viz3d && window.THREE) {
        const opts = Object.assign({}, spec); delete opts.scene;
        viz = QML.viz3d.create(stage, spec.scene, opts);
      } else {
        stage.innerHTML = '<div class="muted" style="padding:20px">3D engine unavailable</div>';
      }
    } catch (e) {
      stage.innerHTML = '<div class="muted" style="padding:20px">visual failed to build</div>';
    }
    live = { el, viz };
    requestAnimationFrame(() => el.classList.add('open'));
  }

  window.QML = window.QML || {};
  window.QML.walk = { open, close };
})();
