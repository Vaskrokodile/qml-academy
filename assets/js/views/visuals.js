/* ============================================================
   QML.views.visuals — the equation/symbol 3D gallery.
   #/visuals          → the gallery
   #/visuals/<id>     → live scene + explanation + a challenge
   Scenes are drag-to-rotate. Challenges record to the drill log.
   ============================================================ */
(function () {
  const DB = QML.DB;
  const ui = QML.ui;
  QML.views = QML.views || {};

  const items = () => window.QML_VISUALS || [];
  let activeScene = null;
  const disposeScene = () => { if (activeScene) { activeScene.dispose(); activeScene = null; } };

  QML.views.visuals = function (el, params) {
    disposeScene();
    const id = params && params[0];
    const v = items().find(x => x.id === id);
    if (v) detail(el, v); else gallery(el);
  };

  /* ================= gallery ================= */
  function gallery(el) {
    el.innerHTML = `
      <div class="card hc-hero section-gap">
        <span class="hc-hero-ic">${QML.icon('orbit3d', 26)}</span>
        <div>
          <div class="qz-land-title">Visuals — see the equations move</div>
          <p class="muted" style="margin:0">Every key equation and symbol of quantum ML, running live in 3D.
            Drag the scene to orbit it. Each one opens with what it <b>does</b>, why it matters,
            a use case — and a challenge that tests whether the picture stuck.</p>
        </div>
      </div>
      <div class="vz-grid stagger">
        ${items().map(v => `
          <a class="card card-hover vz-card" href="#/visuals/${v.id}">
            <div class="vz-thumb">
              <div class="vz-thumb-eq">${ui.tex(v.tex, true)}</div>
            </div>
            <div class="vz-kind">${ui.esc(v.kind)} · ${ui.esc(v.scene.name)}</div>
            <div class="vz-name">${ui.esc(v.name)}</div>
          </a>`).join('')}
      </div>`;
  }

  /* ================= detail ================= */
  function detail(el, v) {
    const qid = 'vz_' + v.id;
    el.innerHTML = `
      <a class="link" href="#/visuals">${QML.icon('right', 12)} back to gallery</a>
      <div class="vz-eq-hero">${ui.tex(v.tex, true)}</div>
      <div style="text-align:center;margin-bottom:12px">
        <div class="vz-name" style="font-size:18px">${ui.esc(v.name)}</div>
        <span class="tag">${ui.esc(v.kind)}</span>
      </div>
      <div class="vz-stage section-gap">
        <div id="vz-mount" style="width:100%;height:400px"></div>
        <div class="vz-hint">drag to orbit &nbsp;·&nbsp; scroll / pinch to zoom &nbsp;·&nbsp; double-click resets &nbsp;·&nbsp; scene: ${ui.esc(v.scene.name)}${v.scene.mode ? '/' + v.scene.mode : ''}</div>
      </div>
      <div class="vz-cols section-gap">
        <div class="card vz-panel">
          <h4>${QML.icon('eye', 13)} How to see it</h4>
          <p>${ui.md(v.intuition)}</p>
        </div>
        <div class="card vz-panel">
          <h4>${QML.icon('bolt', 13)} Why it matters</h4>
          <p>${ui.md(v.why)}</p>
        </div>
        <div class="card vz-panel">
          <h4>${QML.icon('target', 13)} Where it shows up</h4>
          <p>${ui.md(v.useCase)}</p>
        </div>
        <div class="card vz-panel">
          <h4>${QML.icon('search', 13)} Read the scene</h4>
          <p style="margin-bottom:8px">${ui.md(v.challenge.prompt)}</p>
          <div class="qz-opts">
            ${v.challenge.options.map((o, k) => `<button class="qz-opt" data-k="${k}">
              <span class="qz-letter">${'ABCD'[k]}</span><span class="qz-opt-txt">${ui.md(o)}</span></button>`).join('')}
          </div>
          <div class="qz-explain" hidden></div>
        </div>
      </div>`;

    /* mount 3D scene */
    const mount = el.querySelector('#vz-mount');
    try { activeScene = QML.viz3d.create(mount, v.scene.name, v.scene); }
    catch (e) { mount.innerHTML = '<div class="muted" style="padding:20px">3D unavailable — ' + ui.esc(String(e.message || e)) + '</div>'; }

    /* challenge wiring */
    el.querySelectorAll('.vz-panel .qz-opt').forEach(b => b.onclick = () => {
      const pick = +b.dataset.k, ok = pick === v.challenge.answer;
      el.querySelectorAll('.vz-panel .qz-opt').forEach(x => {
        x.disabled = true;
        if (+x.dataset.k === v.challenge.answer) x.classList.add('ok');
        else if (x === b) x.classList.add('bad');
      });
      DB.recordAnswer(qid, 'meta', ok);
      if (ok) { DB.addXP(10, 'Visual challenge'); ui.toast('+10 XP — you read the scene', 'ok'); }
      const ex = el.querySelector('.vz-panel .qz-explain');
      ex.hidden = false; ex.classList.add(ok ? 'ok' : 'bad');
      ex.innerHTML = `${QML.icon(ok ? 'check' : 'x', 16)}<div><strong>${ok ? 'Correct' : 'The answer is ' + 'ABCD'[v.challenge.answer]}</strong><span>${ui.md(v.challenge.explain)}</span></div>`;
    });
  }
})();
