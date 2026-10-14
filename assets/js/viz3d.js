/* ============================================================
   QML.viz3d — three.js interactive scenes for equations/symbols.

   Usage: const h = QML.viz3d.create(container, 'bloch', {mode:'precess'})
          h.dispose() when leaving.

   Controls:  drag = orbit   ·   wheel / pinch = zoom   ·
              double-click = reset view

   Scenes: bloch (modes: spin|precess|decay|hadamard),
           landscape (smooth|barren|anneal), spins, entangle,
           encode, fourier, grover, measure.
   Requires vendored THREE (assets/vendor/three/three.min.js).
   ============================================================ */
(function () {
  const C = {
    accent: 0x7cd4f7, warn: 0xffc46b, ok: 0x5be3a1, bad: 0xff7a7a,
    purple: 0xb78cff, mute: 0x8a8aa0, wire: 0x3a3a4e, panel: 0x1c1c28,
    white: 0xffffff, gold: 0xf2c94c,
  };

  function create(container, name, opts) {
    if (!window.THREE) {
      container.innerHTML = '<div class="muted" style="padding:20px">three.js not loaded</div>';
      return { dispose() {} };
    }
    opts = opts || {};
    const W = () => Math.max(80, container.clientWidth), H = () => Math.max(80, container.clientHeight);

    /* ---------- renderer / camera / lights ---------- */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(W(), H());
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(42, W() / H(), 0.1, 100);
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const key = new THREE.DirectionalLight(0xffffff, 1.15); key.position.set(3, 5, 4); scene.add(key);
    const rim = new THREE.DirectionalLight(C.accent, 0.55); rim.position.set(-4, -2, -3); scene.add(rim);
    const fill = new THREE.PointLight(0xffffff, 0.25, 30); fill.position.set(0, -3, 2); scene.add(fill);

    const world = new THREE.Group(); scene.add(world);
    const disposables = [];
    const track = o => { disposables.push(o); return o; };

    /* ---------- materials / geo factories ---------- */
    const mat = (color, extra) => track(new THREE.MeshStandardMaterial(
      Object.assign({ color, roughness: .45, metalness: .25 }, extra)));
    const basic = (color, extra) => track(new THREE.MeshBasicMaterial(
      Object.assign({ color }, extra)));

    /* ---------- orbit camera (drag + wheel + pinch + inertia) ---------- */
    const focus = new THREE.Vector3();
    const home = { th: 0.7, ph: 1.05, r: 4.8 };
    const orb = { th: home.th, ph: home.ph, r: home.r };
    let vth = 0, vph = 0;
    const cvs = renderer.domElement;
    cvs.style.touchAction = 'none';
    cvs.style.cursor = 'grab';

    const pointers = new Map();
    let pinchD = 0;
    cvs.addEventListener('pointerdown', e => {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      cvs.setPointerCapture(e.pointerId);
      cvs.style.cursor = 'grabbing';
      if (pointers.size === 2) {
        const p = [...pointers.values()];
        pinchD = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
      }
    });
    cvs.addEventListener('pointermove', e => {
      const p = pointers.get(e.pointerId);
      if (!p) return;
      if (pointers.size === 1) {
        const dx = e.clientX - p.x, dy = e.clientY - p.y;
        vth = -dx * 0.005; vph = -dy * 0.004;
        orb.th += vth; orb.ph += vph;
        orb.ph = Math.max(0.15, Math.min(Math.PI - 0.15, orb.ph));
      } else if (pointers.size === 2) {
        p.x = e.clientX; p.y = e.clientY;
        const q = [...pointers.values()];
        const d = Math.hypot(q[0].x - q[1].x, q[0].y - q[1].y);
        if (pinchD > 0) orb.r = clamp(orb.r * pinchD / d, 1.8, 14);
        pinchD = d;
      }
      p.x = e.clientX; p.y = e.clientY;
    });
    const release = e => { pointers.delete(e.pointerId); if (!pointers.size) cvs.style.cursor = 'grab'; };
    cvs.addEventListener('pointerup', release);
    cvs.addEventListener('pointercancel', release);
    cvs.addEventListener('wheel', e => {
      e.preventDefault();
      orb.r = clamp(orb.r * (1 + Math.sign(e.deltaY) * 0.09), 1.8, 14);
    }, { passive: false });
    cvs.addEventListener('dblclick', () => { orb.th = home.th; orb.ph = home.ph; orb.r = home.r; });
    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

    /* ---------- building blocks ---------- */
    function sphereUnit(wireColor) {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(track(new THREE.SphereGeometry(1, 48, 32)),
        mat(C.panel, { transparent: true, opacity: .3, roughness: .9 })));
      g.add(new THREE.Mesh(track(new THREE.SphereGeometry(1.002, 24, 16)),
        basic(wireColor || C.wire, { wireframe: true, transparent: true, opacity: .35 })));
      const ring = (rx, ry, col) => {
        const m = new THREE.Mesh(track(new THREE.TorusGeometry(1.003, 0.005, 8, 72)),
          basic(col || 0x555570, { transparent: true, opacity: .5 }));
        m.rotation.x = rx; m.rotation.y = ry; g.add(m);
      };
      ring(Math.PI / 2, 0); ring(0, 0, 0x44445c); ring(0, Math.PI / 2, 0x44445c);
      return g;
    }
    function arrowV(dir, color, len) {
      const a = new THREE.ArrowHelper(dir, new THREE.Vector3(), len || 1, color, 0.16, 0.09);
      const g = new THREE.Group(); g.add(a);
      return {
        g, a,
        set(d, l) { a.setDirection(d); a.setLength(l == null ? 1 : l, 0.16, 0.09); },
      };
    }
    function label(txt, color, scale) {
      const cv = document.createElement('canvas'); cv.width = 256; cv.height = 96;
      const g = cv.getContext('2d');
      g.font = '600 40px Inter, system-ui'; g.fillStyle = color || '#e8e8f0';
      g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, 128, 48);
      const sp = new THREE.Sprite(track(new THREE.SpriteMaterial({ map: track(new THREE.CanvasTexture(cv)), transparent: true })));
      sp.scale.set(scale || 0.85, (scale || 0.85) * 0.375, 1);
      return sp;
    }
    /* a label whose text is redrawn live (readouts, counters) */
    function dynLabel(scale) {
      const cv = document.createElement('canvas'); cv.width = 512; cv.height = 128;
      const g = cv.getContext('2d');
      const tex = track(new THREE.CanvasTexture(cv));
      const sp = new THREE.Sprite(track(new THREE.SpriteMaterial({ map: tex, transparent: true })));
      sp.scale.set(scale, scale / 4, 1);
      return {
        sprite: sp,
        draw(lines, color) {
          g.clearRect(0, 0, 512, 128);
          g.font = '600 34px "JetBrains Mono", monospace'; g.fillStyle = color || '#cfd0e0';
          g.textAlign = 'left'; g.textBaseline = 'middle';
          lines.forEach((ln, i) => g.fillText(ln, 16, 40 + i * 52));
          tex.needsUpdate = true;
        },
      };
    }
    /* fading motion trail behind a moving point */
    function trail(color, n) {
      n = n || 110;
      const geo = track(new THREE.BufferGeometry());
      const pos = new Float32Array(n * 3);
      geo.setAttribute('position', track(new THREE.BufferAttribute(pos, 3)));
      const line = new THREE.Line(geo, track(new THREE.LineBasicMaterial({ color, transparent: true, opacity: .5 })));
      const pts = [];
      return {
        obj: line,
        push(v) {
          pts.push(v.x, v.y, v.z);
          while (pts.length > n * 3) pts.splice(0, 3);
          for (let i = 0; i < pts.length; i++) pos[i] = pts[i];
          geo.setDrawRange(0, pts.length / 3);
          geo.attributes.position.needsUpdate = true;
        },
      };
    }
    function pole() { /* tiny marker ball */
      return new THREE.Mesh(track(new THREE.SphereGeometry(0.06, 16, 12)), mat(C.white, { emissive: 0x555555 }));
    }
    const grid = (y, sz, c1, c2) => {
      const gh = new THREE.GridHelper(sz || 6, 12, c1 || 0x33334a, c2 || 0x22222f);
      gh.position.y = y == null ? -1.6 : y; world.add(gh);
    };
    function axisLabels() {
      [['|0⟩', 0, 1.3, 0, '#7cd4f7'], ['|1⟩', 0, -1.3, 0, '#ff7a7a'],
       ['|+⟩', 1.32, 0, 0], ['|−⟩', -1.32, 0, 0],
       ['|+i⟩', 0, 0, 1.32], ['|−i⟩', 0, 0, -1.32]]
        .forEach(([t, x, y, z, c]) => { const s = label(t, c || '#9a9ab0', 0.7); s.position.set(x, y, z); world.add(s); });
    }
    /* θ/φ arcs drawn on the Bloch sphere so the parametrization is visible */
    function blochArcs() {
      const g = new THREE.Group();
      const thArc = new THREE.Mesh(track(new THREE.TorusGeometry(1.01, 0.012, 6, 40, Math.PI / 2)),
        basic(C.warn, { transparent: true, opacity: .8 }));
      thArc.rotation.y = Math.PI / 2; thArc.rotation.z = Math.PI;
      g.add(thArc);
      const phiArc = new THREE.Mesh(track(new THREE.TorusGeometry(1.01, 0.012, 6, 40, Math.PI / 3)),
        basic(C.purple, { transparent: true, opacity: .8 }));
      phiArc.rotation.x = Math.PI / 2;
      g.add(phiArc);
      const lt = label('θ', '#ffc46b', 0.5); lt.position.set(0.75, 0.75, 0); g.add(lt);
      const lp = label('φ', '#b78cff', 0.5); lp.position.set(1.05, -0.55, 0.5); g.add(lp);
      return g;
    }

    /* ---------- scenes ---------- */
    const tickers = [];
    let api = null;
    const every = (fn) => { /* throttled updater accumulator */ let acc = 0; tickers.push((t, dt) => { acc += dt; if (acc > 0.12) { fn(t); acc = 0; } }); };
    const sph = (th, ph) => new THREE.Vector3(Math.sin(th) * Math.cos(ph), Math.cos(th), Math.sin(th) * Math.sin(ph));

    const build = {

      /* ============ Bloch sphere & its modes ============ */
      bloch() {
        world.add(sphereUnit()); axisLabels();
        const mode = opts.mode || 'spin';
        if (mode === 'lab') return build.blochLab();
        if (mode === 'spin' || mode === 'precess') world.add(blochArcs());
        const vec = arrowV(sph(0, 0), C.accent); world.add(vec.g);
        const tr = trail(C.accent); world.add(tr.obj);
        const hud = dynLabel(1.9); hud.sprite.position.set(0, 1.75, 0); world.add(hud.sprite);
        /* ghost "should-be" unit arrow for decoherence contrast */
        let ghost = null, core = null;
        if (mode === 'decay') {
          ghost = arrowV(sph(Math.PI / 2, 0), 0x555570); world.add(ghost.g);
          ghost.g.children[0].line.material.opacity = .35;
          ghost.g.children[0].cone.material.opacity = .35;
          core = new THREE.Mesh(track(new THREE.SphereGeometry(1, 32, 24)),
            mat(C.bad, { transparent: true, opacity: .12 }));
          world.add(core);
        }
        grid();
        let th = Math.PI / 2, ph = 0, len = 1, last = '';
        tickers.push(t => {
          if (mode === 'precess') { th = Math.PI / 2; ph = t * 1.3; len = 1; }
          else if (mode === 'decay') {
            th = Math.PI / 2; ph = t * 1.5;
            len = Math.max(0.12, 1 - (t % 9) * 0.11);
            ghost.set(sph(Math.PI / 2, t * 1.5));
            core.scale.setScalar(0.02 + len);
            core.material.opacity = 0.28 - len * 0.2;
          } else if (mode === 'hadamard') {
            const k = (Math.sin(t * 1.4) + 1) / 2;              // |0⟩ → |+⟩ → |0⟩
            th = k * Math.PI / 2; ph = 0; len = 1;
          } else {                                             // gentle tumble
            th = Math.PI / 2 + 0.55 * Math.sin(t * 0.5);
            ph = t * 0.8; len = 1;
          }
          const d = sph(th, ph);
          vec.set(d, len);
          tr.push(d.clone().multiplyScalar(len));
        });
        every(() => {
          const deg = r => Math.round(r * 180 / Math.PI) % 360;
          const p0 = Math.round(Math.cos(th / 2) ** 2 * len ** 2 * 100);
          const head = mode === 'decay' ? `|ψ⟩→ρ  purity ${Math.round(len * 100)}%`
            : mode === 'hadamard' ? 'H: |0⟩ → |+⟩ → |0⟩'
            : `θ ${deg(th)}°   φ ${deg(ph)}°`;
          const body = mode === 'decay' ? 'arrow shrinking = coherence lost'
            : `P(0) ${p0}%   P(1) ${100 - p0}%`;
          if (head + body !== last) { last = head + body; hud.draw([head, body]); }
        });
      },

    /* ============ Interactive Bloch lab (gate playground) ============
       mode:'lab' — user-driven single-qubit gates. The state is a Bloch
       vector; every gate is a rotation of that vector about an axis.
       NOTE this scene's axis convention: world +y = |0⟩/|1⟩ axis (Bloch z),
       world +x = |+⟩/|−⟩ (Bloch x), world +z = |+i⟩/|−i⟩ (Bloch y).
       External API via create(...).api: gate(name), set({x,y,z}),
       get() → Bloch coords {x,y,z}, reset(). */
      blochLab() {
      world.add(blochArcs());
      const vec = arrowV(new THREE.Vector3(0, 1, 0), C.purple); world.add(vec.g);
      const tr = trail(C.purple, 160); world.add(tr.obj);
      const hud = dynLabel(2.05); hud.sprite.position.set(0, 1.75, 0); world.add(hud.sprite);
      /* ghost arrow marking where the last gate started — makes the
         rotation legible while the arrow animates to its new pole */
      const ghost = arrowV(new THREE.Vector3(0, 1, 0), 0x555570); world.add(ghost.g);
      ghost.g.children[0].line.material.transparent = true;
      ghost.g.children[0].line.material.opacity = .3;
      ghost.g.children[0].cone.material.transparent = true;
      ghost.g.children[0].cone.material.opacity = .3;
      grid();

      const tgt = new THREE.Vector3(0, 1, 0);            // Bloch target (world coords)
      const cur = tgt.clone();
      let last = '';

      tickers.push((t, dt) => {
        const k = 1 - Math.exp(-(dt || 0.016) * 5.5);    // critically-damped-ish glide
        cur.lerp(tgt, k);
        if (cur.lengthSq() > 1e-10) cur.normalize();
        const d = cur.clone();
        vec.set(d, 1);
        tr.push(d);
      });

      every(() => {
        /* world → Bloch coords: bx=x, by=z, bz=y */
        const bx = cur.x, by = cur.z, bz = cur.y;
        const th = Math.acos(Math.max(-1, Math.min(1, bz)));
        const ph = Math.atan2(by, bx);
        const deg = r => ((Math.round(r * 180 / Math.PI) % 360) + 360) % 360;
        const p0 = Math.round((1 + bz) / 2 * 100);
        const near = [['|0⟩', bz], ['|1⟩', -bz], ['|+⟩', bx], ['|−⟩', -bx], ['|+i⟩', by], ['|−i⟩', -by]]
          .sort((a, b) => b[1] - a[1])[0];
        const head = `θ ${deg(th)}°   φ ${deg(ph)}°   ≈ ${near[0]}`;
        const body = `P(0) ${p0}%   P(1) ${100 - p0}%`;
        if (head + body !== last) { last = head + body; hud.draw([head, body]); }
      });

      /* rotation axes in world coords for Bloch x/y/z. The Bloch→world
         mapping swaps y and z (odd permutation → chirality flips), so
         all right-hand-rule angles take a MINUS sign in world space. */
      const AX = {
        x: new THREE.Vector3(1, 0, 0),
        y: new THREE.Vector3(0, 0, 1),
        z: new THREE.Vector3(0, 1, 0),
      };
      const GATES = {
        X:  [AX.x, Math.PI],     Y:  [AX.y, Math.PI],     Z:  [AX.z, Math.PI],
        H:  [new THREE.Vector3(1 / Math.SQRT2, 1 / Math.SQRT2, 0), Math.PI],   // (x+z)/√2 in Bloch
        S:  [AX.z, -Math.PI / 2], 'S†': [AX.z, Math.PI / 2],
        T:  [AX.z, -Math.PI / 4], 'T†': [AX.z, Math.PI / 4],
      };
      api = {
        gate(name) {
          if (name === 'reset') { ghost.set(tgt.clone(), 1); tgt.set(0, 1, 0); return; }
          let spec = GATES[name];
          if (!spec) {
            const m = /^R([xyz])\((-?[\d.]+)\)$/.exec(name);
            if (!m) return;
            spec = [AX[m[1]], -(+m[2]) * Math.PI / 180];
          }
          ghost.set(tgt.clone(), 1);                     // mark where we were
          tgt.applyAxisAngle(spec[0], spec[1]);
          if (tgt.lengthSq() > 1e-10) tgt.normalize();
        },
        set(b) { tgt.set(b.x, b.z, b.y); },              // Bloch {x,y,z} → world
        get() { return { x: tgt.x, y: tgt.z, z: tgt.y }; },
        reset() { tgt.set(0, 1, 0); },
      };
      home.r = 4.2; orb.r = 4.2;
      },

      /* ============ Cost landscapes ============ */
      landscape() {
        const mode = opts.mode || 'smooth';
        const seg = 64, size = 4.4;
        const geo = track(new THREE.PlaneGeometry(size, size, seg, seg));
        const fns = {
          smooth: (x, y) => 0.55 * Math.cos(x * 1.1) * Math.cos(y * 1.1),
          barren: (x, y) => 0.02 * Math.sin(x * 6) * Math.sin(y * 6),
          rugged: (x, y) => 0.5 * Math.cos(x * 2.2) * Math.cos(y * 2.2) + 0.22 * Math.sin(x * 4 + y * 3),
          flat: (x, y) => 0.05 * Math.sin(x * 0.8),
        };
        const pos = geo.attributes.position;
        const colors = new Float32Array(pos.count * 3);
        geo.setAttribute('color', track(new THREE.BufferAttribute(colors, 3)));
        const mesh = new THREE.Mesh(geo, mat(0xffffff, {
          vertexColors: true, roughness: .55, metalness: .08, side: THREE.DoubleSide }));
        mesh.rotation.x = -Math.PI / 2; world.add(mesh);
        const wire = new THREE.Mesh(geo, basic(0x8899bb, { wireframe: true, transparent: true, opacity: .08 }));
        wire.rotation.x = -Math.PI / 2; wire.position.y = 0.002; world.add(wire);

        const ball = new THREE.Mesh(track(new THREE.SphereGeometry(0.09, 24, 18)),
          mat(C.white, { emissive: 0x888899 }));
        world.add(ball);
        const ballTrail = trail(C.white, 160); world.add(ballTrail.obj);
        /* downhill arrow at the ball — shows the gradient the
           optimizer follows (or the void it faces on a plateau) */
        const grad = arrowV(new THREE.Vector3(1, 0, 0), C.ok, 0.55);
        world.add(grad.g);
        const hud = dynLabel(2.1); hud.sprite.position.set(0, 1.7, 0); world.add(hud.sprite);

        let bx = 1.5, by = 1.1, f = fns.smooth, last = '';
        const setHeights = () => {
          for (let i = 0; i < pos.count; i++) pos.setZ(i, f(pos.getX(i), pos.getY(i)));
          pos.needsUpdate = true; geo.computeVertexNormals();
          for (let i = 0; i < pos.count; i++) {
            const h = clamp((pos.getZ(i) + 0.8) / 1.6, 0, 1);   // low → deep blue, high → bright
            colors[i * 3] = 0.16 + h * 0.35;
            colors[i * 3 + 1] = 0.30 + h * 0.45;
            colors[i * 3 + 2] = 0.48 + h * 0.45;
          }
          geo.attributes.color.needsUpdate = true;
        };
        tickers.push(t => {
          if (mode === 'anneal') {
            const s = 0.5 + 0.5 * Math.sin(t * 0.4);
            f = (x, y) => (1 - s) * fns.flat(x, y) + s * fns.rugged(x, y);
          } else f = fns[mode];
          setHeights();
          const e = 0.02;
          const gx = (f(bx + e, by) - f(bx - e, by)) / (2 * e);
          const gy = (f(bx, by + e) - f(bx, by - e)) / (2 * e);
          if (mode === 'barren') {
            bx = 1.3 + Math.sin(t * 0.3) * 0.4 + Math.sin(t * 1.7) * 0.06;
            by = 0.8 + Math.cos(t * 0.23) * 0.4;
            grad.g.visible = false;                            // no gradient to follow
          } else {
            bx = clamp(bx - gx * 0.014, -2, 2); by = clamp(by - gy * 0.014, -2, 2);
            const gl = Math.hypot(gx, gy);
            grad.g.visible = gl > 0.02;
            if (grad.g.visible) {
              grad.g.position.set(bx, f(bx, by) + 0.12, -by);
              grad.set(new THREE.Vector3(-gx, 0, gy).normalize(), clamp(0.2 + gl * 0.6, 0.2, 0.7));
            }
          }
          ball.position.set(bx, f(bx, by) + 0.1, -by);
          ballTrail.push(ball.position);
        });
        every(t => {
          const head = mode === 'barren' ? 'Var[∇C] ~ 2⁻ⁿ → flat' :
            mode === 'anneal' ? `H(s) morphing  s=${(0.5 + 0.5 * Math.sin(t * 0.4)).toFixed(2)}`
            : 'C(θ): optimizer descends −∇C';
          const body = mode === 'barren' ? 'ball wanders — no downhill exists'
            : mode === 'anneal' ? 'landscape reshapes under the state'
            : 'green arrow = gradient direction';
          if (head + body !== last) { last = head + body; hud.draw([head, body]); }
        });
        focus.set(0, -0.1, 0); home.r = 5.4; orb.r = 5.4; orb.ph = 0.8;
      },

      /* ============ Transverse-field Ising chain ============ */
      spins() {
        const n = 8, arr = [];
        for (let i = 0; i < n; i++) {
          const a = arrowV(sph(0, 0), i % 2 ? C.bad : C.accent);
          a.g.position.set((i - (n - 1) / 2) * 0.66, 0, 0);
          a.set(sph(0, 0), 0.5);
          world.add(a.g); arr.push(a);
        }
        const linkG = track(new THREE.CylinderGeometry(0.018, 0.018, 0.5, 8));
        const links = [];
        for (let i = 0; i < n - 1; i++) {
          const l = new THREE.Mesh(linkG, mat(0x555570, { emissive: 0x111118 }));
          l.rotation.z = Math.PI / 2;
          l.position.set((i - (n - 1) / 2) * 0.66 + 0.33, 0, 0);
          world.add(l); links.push(l);
        }
        /* big field arrow above — the transverse Γ field */
        const field = arrowV(new THREE.Vector3(1, 0, 0), C.purple, 1.4);
        field.g.position.set(0, 1.15, 0); world.add(field.g);
        const fl = label('Γ field', '#b78cff', 0.8); fl.position.set(0, 1.7, 0); world.add(fl);
        const hud = dynLabel(2.2); hud.sprite.position.set(0, -1.4, 0); world.add(hud.sprite);
        grid(-1.1, 7);
        let last = '';
        tickers.push(t => {
          const g = 0.5 + 0.5 * Math.sin(t * 0.45);            // Γ strength breathing
          field.a.setLength(0.3 + g * 1.4, 0.16, 0.09);
          field.a.line.material.opacity = 0.3 + g * 0.7;
          field.a.cone.material.opacity = 0.3 + g * 0.7;
          arr.forEach((a, i) => {
            if (g > 0.5) {
              const j = (g - 0.5) * 2;
              a.set(new THREE.Vector3(1, 0.3 * j * Math.sin(t * 9 + i), 0.3 * j * Math.cos(t * 9 + i)).normalize(), 0.5);
            } else {
              a.set(new THREE.Vector3(0.06 * Math.sin(t * 3 + i), 0, i % 2 ? -1 : 1).normalize(), 0.5);
            }
          });
          links.forEach(l => l.material.emissive.setScalar(0.05 + (1 - g) * 0.35));
        });
        every(t => {
          const g = 0.5 + 0.5 * Math.sin(t * 0.45);
          const head = `Γ = ${g.toFixed(2)}`;
          const body = g > 0.5 ? 'field dominates → quantum fluctuations (all x)'
            : 'couplings dominate → ↑↓↑↓ order emerges';
          if (head + body !== last) { last = head + body; hud.draw([head, body]); }
        });
        home.r = 5.6; orb.r = 5.6; orb.ph = 1.15;
      },

      /* ============ Entangled pair ============ */
      entangle() {
        const s1 = sphereUnit(); s1.position.x = -1.45; world.add(s1);
        const s2 = sphereUnit(); s2.position.x = 1.45; world.add(s2);
        const a1 = arrowV(new THREE.Vector3(1, 0, 0), C.accent); a1.g.position.x = -1.45; world.add(a1.g);
        const a2 = arrowV(new THREE.Vector3(-1, 0, 0), C.bad); a2.g.position.x = 1.45; world.add(a2.g);
        /* correlation beam */
        const beamGeo = track(new THREE.BufferGeometry().setFromPoints(
          [new THREE.Vector3(-1.45, 0, 0), new THREE.Vector3(1.45, 0, 0)]));
        const beam = new THREE.Line(beamGeo, track(new THREE.LineDashedMaterial(
          { color: C.purple, dashSize: 0.12, gapSize: 0.08, transparent: true, opacity: .8 })));
        beam.computeLineDistances(); world.add(beam);
        const la = label('qubit A', '#7cd4f7', 0.75); la.position.set(-1.45, 1.5, 0); world.add(la);
        const lb = label('qubit B', '#ff7a7a', 0.75); lb.position.set(1.45, 1.5, 0); world.add(lb);
        const lc = label('|Φ⁺⟩ pair', '#b78cff', 0.8); lc.position.set(0, 1.9, 0); world.add(lc);
        const hud = dynLabel(2.2); hud.sprite.position.set(0, -1.7, 0); world.add(hud.sprite);
        let last = '';
        tickers.push(t => {
          const ph = t * 0.9;
          a1.set(new THREE.Vector3(Math.cos(ph), Math.sin(ph), 0));
          a2.set(new THREE.Vector3(-Math.cos(ph), -Math.sin(ph), 0));
          beam.material.dashSize = 0.1 + 0.05 * Math.sin(t * 4);
        });
        every(() => {
          const head = 'each qubit alone: maximally mixed';
          const body = 'only the PAIR has a definite state';
          if (head + body !== last) { last = head + body; hud.draw([head, body]); }
        });
        focus.set(0, 0, 0); home.r = 5.6; orb.r = 5.6;
      },

      /* ============ Feature-map encoding ============ */
      encode() {
        /* classical data plane */
        const plane = new THREE.Mesh(track(new THREE.PlaneGeometry(2.6, 2.6)),
          basic(0x2a2a3e, { transparent: true, opacity: .45, side: THREE.DoubleSide }));
        plane.position.set(-2.4, 0, 0); world.add(plane);
        const pgrid = new THREE.GridHelper(2.6, 4, 0x555570, 0x3a3a4e);
        pgrid.rotation.x = Math.PI / 2; pgrid.position.set(-2.4, 0, 0.001); world.add(pgrid);
        const sp = sphereUnit(); sp.position.x = 1.8; world.add(sp);
        const l1 = label('data x', '#9a9ab0', 0.7); l1.position.set(-2.4, 1.7, 0); world.add(l1);
        const l2 = label('Φ(x)', '#7cd4f7', 0.8); l2.position.set(1.8, 1.5, 0); world.add(l2);
        /* two highlighted embedded points + their overlap line */
        const dots = [], trails = [];
        const dg = track(new THREE.SphereGeometry(0.06, 14, 10));
        for (let i = 0; i < 9; i++) {
          const cls = i % 2;
          const d = new THREE.Mesh(dg, mat(cls ? C.bad : C.accent, { emissive: cls ? 0x331115 : 0x0d2530 }));
          const x = (i % 3 - 1) * 0.85, y = (Math.floor(i / 3) - 1) * 0.85;
          const th = Math.PI / 2 - y * 0.65, ph = x * 1.5 + cls * 0.8;
          const to = sph(th, ph).multiplyScalar(1).add(new THREE.Vector3(1.8, 0, 0));
          const tr = trail(cls ? C.bad : C.accent, 40); world.add(tr.obj);
          world.add(d);
          dots.push({ d, from: new THREE.Vector3(-2.4 + x, y, 0), to });
          trails.push(tr);
        }
        /* kernel line between dot 0 and dot 1 */
        const kGeo = track(new THREE.BufferGeometry().setFromPoints(
          [new THREE.Vector3(), new THREE.Vector3(1, 0, 0)]));
        const kLine = new THREE.Line(kGeo, track(new THREE.LineDashedMaterial(
          { color: C.gold, dashSize: .1, gapSize: .06, transparent: true })));
        kLine.computeLineDistances(); world.add(kLine);
        const kLab = label('K = |⟨ψ|ψ′⟩|²', '#f2c94c', 0.9); world.add(kLab);
        const hud = dynLabel(2.2); hud.sprite.position.set(-0.2, 1.95, 0); world.add(hud.sprite);
        let last = '';
        tickers.push(t => {
          const k = 0.5 + 0.5 * Math.sin(t * 0.55);
          dots.forEach((o, i) => {
            o.d.position.lerpVectors(o.from, o.to, k);
            trails[i].push(o.d.position);
          });
          const p = kGeo.attributes.position;
          p.setXYZ(0, dots[3].d.position.x, dots[3].d.position.y, dots[3].d.position.z);
          p.setXYZ(1, dots[4].d.position.x, dots[4].d.position.y, dots[4].d.position.z);
          p.needsUpdate = true; kLine.computeLineDistances();
          kLine.visible = k > 0.6;
          kLab.position.copy(dots[3].d.position).add(dots[4].d.position).multiplyScalar(0.5);
          kLab.position.y += 0.3; kLab.visible = k > 0.6;
        });
        every(t => {
          const k = 0.5 + 0.5 * Math.sin(t * 0.55);
          const head = k > 0.6 ? 'embedding done — measure overlaps'
            : `U_Φ(x): mapping ${Math.round(k * 100)}%`;
          const body = k > 0.6 ? 'dashed link = one kernel entry'
            : 'same data, new geometry';
          if (head + body !== last) { last = head + body; hud.draw([head, body]); }
        });
        focus.set(-0.3, 0, 0); home.r = 6; orb.r = 6; orb.ph = 1.1;
      },

      /* ============ QFT ============ */
      fourier() {
        const nb = 16;
        const inB = [], outB = [];
        const bg = track(new THREE.BoxGeometry(0.1, 1, 0.1));
        const cg = track(new THREE.ConeGeometry(0.06, 0.16, 10));
        for (let i = 0; i < nb; i++) {
          const ib = new THREE.Mesh(bg, mat(i === 0 ? C.gold : 0x55556e));
          ib.position.set((i - nb / 2 + .5) * 0.26, -0.5, 1.3);
          ib.scale.y = 0.08; world.add(ib); inB.push(ib);
          const grp = new THREE.Group();
          grp.position.set((i - nb / 2 + .5) * 0.26, -0.5, -1.3);
          const b = new THREE.Mesh(bg, mat(C.accent));
          b.scale.y = 0.6; grp.add(b);
          /* phase hand: little cone spinning on top, showing e^{iφ} */
          const hand = new THREE.Mesh(cg, mat(C.warn, { emissive: 0x332211 }));
          hand.position.set(0, 0.42, 0.09); hand.rotation.x = Math.PI / 2;
          const hg = new THREE.Group(); hg.add(hand); grp.add(hg);
          world.add(grp); outB.push({ grp, hg });
        }
        const l1 = label('|j⟩ input', '#9a9ab0', 0.75); l1.position.set(-2.6, -0.5, 1.3); world.add(l1);
        const l2 = label('QFT phases', '#f2c94c', 0.8); l2.position.set(-2.6, 0.1, -1.3); l2.scale.set(1.3, .45, 1); world.add(l2);
        const hud = dynLabel(2.2); hud.sprite.position.set(0, 1.3, 0); world.add(hud.sprite);
        grid(-1.2, 6);
        let last = '';
        tickers.push(t => {
          const j = Math.floor(t * 0.6) % nb;
          inB.forEach((b, i) => {
            const on = i === j;
            b.scale.y += ((on ? 0.9 : 0.08) - b.scale.y) * 0.2;
            b.material.emissive.setScalar(on ? 0.35 : 0);
          });
          outB.forEach((o, k) => {
            const ph = 2 * Math.PI * j * k / nb;
            o.hg.rotation.y = -ph;                              // phase hand winds around
            o.grp.children[0].material.color.setHSL(((ph % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) / (2 * Math.PI), 0.65, 0.55);
          });
        });
        every(t => {
          const j = Math.floor(t * 0.6) % nb;
          const head = `input |${j}⟩ → uniform amplitudes`;
          const body = 'info moved into the phase winding';
          if (head + body !== last) { last = head + body; hud.draw([head, body]); }
        });
        home.r = 5.4; orb.r = 5.4; orb.ph = 0.9;
      },

      /* ============ Grover amplification ============ */
      grover() {
        const ax1 = new THREE.Mesh(track(new THREE.CylinderGeometry(0.01, 0.01, 3.6, 6)), mat(0x555570));
        ax1.rotation.z = Math.PI / 2; world.add(ax1);
        const ax2 = new THREE.Mesh(track(new THREE.CylinderGeometry(0.01, 0.01, 3.6, 6)), mat(0x555570));
        world.add(ax2);
        const lg = label('good (marked)', '#5be3a1', 0.9); lg.position.set(0.55, 2, 0); world.add(lg);
        const lb = label('rest', '#8a8aa0', 0.65); lb.position.set(1.9, -0.35, 0); world.add(lb);
        const vec = arrowV(new THREE.Vector3(1, 0.15, 0).normalize(), C.accent, 1.8);
        world.add(vec.g);
        const tr = trail(C.accent, 200); world.add(tr.obj);
        /* success meter */
        const pbar = new THREE.Mesh(track(new THREE.BoxGeometry(0.22, 1, 0.22)),
          mat(C.ok, { emissive: 0x0d2b1c }));
        pbar.position.set(2.1, -1.5, 0); world.add(pbar);
        const pl = label('P(win)', '#5be3a1', 0.6); pl.position.set(2.1, 0.6, 0); world.add(pl);
        const hud = dynLabel(2.2); hud.sprite.position.set(-0.4, 2.5, 0); world.add(hud.sprite);
        const theta = Math.asin(1 / 4);                          // N=16
        let last = '';
        tickers.push(t => {
          const cyc = Math.PI / 2 / theta + 3.5;
          const steps = (t * 0.8) % cyc;
          const angle = Math.abs(Math.sin(steps * theta)) * Math.PI / 2;
          vec.set(new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0).normalize(), 1.8);
          tr.push(vec.g.children[0].position.clone().set(
            Math.cos(angle) * 1.8, Math.sin(angle) * 1.8, 0));
          const p = Math.sin(angle) ** 2;
          pbar.scale.y = Math.max(0.02, p * 1.9);
          pbar.position.y = -1.5 + pbar.scale.y / 2;
        });
        every(t => {
          const cyc = Math.PI / 2 / theta + 3.5;
          const steps = (t * 0.8) % cyc;
          const p = Math.sin(Math.abs(Math.sin(steps * theta)) * Math.PI / 2) ** 2;
          const head = `P(success) = ${Math.round(p * 100)}%`;
          const body = steps * theta > Math.PI / 2 ? 'overshooting — stop at √N steps'
            : 'each iteration rotates by 2θ';
          if (head + body !== last) { last = head + body; hud.draw([head, body]); }
        });
        home.r = 4.8; orb.r = 4.8; orb.ph = 1.35;
      },

      /* ============ Measurement (Born rule) ============ */
      measure() {
        world.add(sphereUnit()); axisLabels();
        const vec = arrowV(new THREE.Vector3(1, 0, 0), C.accent); world.add(vec.g);
        const tr = trail(C.accent, 60); world.add(tr.obj);
        /* accumulating histogram on the floor */
        const h0 = new THREE.Mesh(track(new THREE.BoxGeometry(0.5, 1, 0.5)), mat(C.accent));
        h0.position.set(-0.4, -1.85, 0); world.add(h0);
        const h1 = new THREE.Mesh(track(new THREE.BoxGeometry(0.5, 1, 0.5)), mat(C.bad));
        h1.position.set(0.4, -1.85, 0); world.add(h1);
        const hl0 = label('|0⟩', '#7cd4f7', 0.5); hl0.position.set(-0.4, -1.15, 0); world.add(hl0);
        const hl1 = label('|1⟩', '#ff7a7a', 0.5); hl1.position.set(0.4, -1.15, 0); world.add(hl1);
        const hl2 = label('outcomes', '#8a8aa0', 0.55); hl2.position.set(0, -1.1, 0.4); world.add(hl2);
        const hud = dynLabel(2.2); hud.sprite.position.set(0, 1.7, 0); world.add(hud.sprite);
        /* outcome flash at the pole it lands on */
        const flash = new THREE.Mesh(track(new THREE.SphereGeometry(0.1, 16, 12)),
          basic(C.white, { transparent: true, opacity: 0 }));
        world.add(flash);
        grid(-1.9, 5);
        let phase = 'precess', t0 = 0, pole = 1, n0 = 0, n1 = 0, last = '';
        tickers.push(t => {
          const lt = t - t0;
          if (phase === 'precess') {
            const ph = lt * 2.4;
            const d = new THREE.Vector3(Math.cos(ph), 0, Math.sin(ph));
            vec.set(d, 1); tr.push(d);
            flash.material.opacity = 0;
            if (lt > 2.4) { phase = 'snap'; pole = Math.random() < 0.5 ? 1 : -1; }
          } else {
            const k = Math.min(1, lt / 0.3);
            vec.set(new THREE.Vector3(0, 0, pole), Math.max(0.05, k));
            flash.position.set(0, 0, pole * 1.12);
            flash.material.opacity = Math.max(0, 0.9 - lt);
            if (lt > 1.1) {
              if (n0 + n1 >= 60) { n0 = n1 = 0; }               // reset the run
              if (pole > 0) n0++; else n1++;
              h0.scale.y = Math.max(0.03, n0 / 15); h0.position.y = -1.85 + h0.scale.y / 2;
              h1.scale.y = Math.max(0.03, n1 / 15); h1.position.y = -1.85 + h1.scale.y / 2;
              phase = 'precess'; t0 = t;
            }
          }
        });
        every(() => {
          const tot = n0 + n1 || 1;
          const head = `shots ${n0 + n1}:  |0⟩ ${Math.round(n0 / tot * 100)}%  |1⟩ ${Math.round(n1 / tot * 100)}%`;
          const body = 'histogram → Born-rule probabilities';
          if (head + body !== last) { last = head + body; hud.draw([head, body]); }
        });
        home.r = 4.8; orb.r = 4.8;
      },

      /* ============================================================
         Compact symbol scenes — same orbit/zoom controls, tuned
         for the small popup stage. opts carries params.
         ============================================================ */

      /* fixed/slowly-animated state on the Bloch sphere.
         opts: th, ph (radians), label s */
      state() {
        world.add(sphereUnit()); axisLabels();
        const vec = arrowV(sph(opts.th ?? Math.PI / 2, opts.ph ?? 0), C.accent);
        world.add(vec.g);
        if (opts.lab) { const l = label(opts.lab, '#7cd4f7', 0.85); l.position.set(0, 1.7, 0); world.add(l); }
        grid();
        tickers.push(t => {
          const th = (opts.th ?? Math.PI / 2) + 0.05 * Math.sin(t * 0.8);
          const ph = (opts.ph ?? 0) + (opts.free ? t * 0.9 : 0);
          vec.set(sph(th, ph));
        });
        home.r = 3.9; orb.r = 3.9;
      },

      /* gate in action: arrow pulses |0⟩ → target (opts.axis: 'x'|'z'|'h').
         'x' flips pole→pole, 'z' spins phase on equator, 'h' pole→equator,
         'u' generic wanders. */
      gate() {
        world.add(sphereUnit()); axisLabels();
        const axis = opts.axis || 'x';
        const vec = arrowV(sph(0, 0), axis === 'z' ? C.purple : C.accent);
        world.add(vec.g);
        const tr = trail(axis === 'z' ? C.purple : C.accent, 80); world.add(tr.obj);
        if (opts.lab) { const l = label(opts.lab, '#e8e8f0', 0.9); l.position.set(0, 1.7, 0); world.add(l); }
        grid();
        tickers.push(t => {
          const k = 0.5 + 0.5 * Math.sin(t * 1.5);            // 0..1 smooth pulse
          let d;
          if (axis === 'x') d = sph(k * Math.PI, 0);                       // |0⟩↔|1⟩
          else if (axis === 'z') d = sph(Math.PI / 2, k * Math.PI);        // |+⟩↔|−⟩ phase
          else if (axis === 'h') d = sph(k * Math.PI / 2, 0);              // |0⟩↔|+⟩
          else d = sph(k * Math.PI * 0.75, t * 1.1);                       // generic U
          vec.set(d); tr.push(d.clone());
        });
        home.r = 3.9; orb.r = 3.9;
      },

      /* CNOT family: control qubit (left, |1⟩) toggles the target's flip. */
      cnot() {
        const n = opts.controls || 1;
        const xs = n === 2 ? [-2.6, -1.5, 1.8] : [-1.5, 1.8];
        const sC1 = sphereUnit(); sC1.position.x = xs[0]; sC1.scale.setScalar(.75); world.add(sC1);
        const c1 = arrowV(sph(Math.PI, 0), C.warn); c1.g.position.x = xs[0]; c1.g.scale.setScalar(.75); world.add(c1.g);
        const lc = label('control |1⟩', '#ffc46b', 0.65); lc.position.set(xs[0], 1.25, 0); world.add(lc);
        if (n === 2) {
          const sC2 = sphereUnit(); sC2.position.x = xs[1]; sC2.scale.setScalar(.75); world.add(sC2);
          const c2 = arrowV(sph(Math.PI, 0), C.warn); c2.g.position.x = xs[1]; c2.g.scale.setScalar(.75); world.add(c2.g);
        }
        const sT = sphereUnit(); sT.position.x = xs[n]; sT.scale.setScalar(.75); world.add(sT);
        const tgt = arrowV(sph(0, 0), C.accent); tgt.g.position.x = xs[n]; tgt.g.scale.setScalar(.75); world.add(tgt.g);
        const lt = label('target', '#7cd4f7', 0.65); lt.position.set(xs[n], 1.25, 0); world.add(lt);
        const beamGeo = track(new THREE.BufferGeometry().setFromPoints(
          [new THREE.Vector3(xs[0], 0, 0), new THREE.Vector3(xs[n], 0, 0)]));
        const beam = new THREE.Line(beamGeo, track(new THREE.LineDashedMaterial(
          { color: C.purple, dashSize: .1, gapSize: .07, transparent: true })));
        beam.computeLineDistances(); world.add(beam);
        tickers.push(t => {
          const k = 0.5 + 0.5 * Math.sin(t * 1.8);            // flip in progress
          tgt.set(sph(k * Math.PI, 0), 1);
          beam.material.opacity = 0.4 + 0.5 * Math.abs(Math.sin(t * 3));
        });
        focus.set((xs[0] + xs[n]) / 2, 0, 0); home.r = 4.6; orb.r = 4.6;
      },

      /* two-qubit scenes. opts.mode: 'bell' (anticorr), 'same', 'free' */
      pair() {
        const mode = opts.mode || 'bell';
        const s1 = sphereUnit(); s1.position.x = -1.45; world.add(s1);
        const s2 = sphereUnit(); s2.position.x = 1.45; world.add(s2);
        const a1 = arrowV(sph(mode === 'same' ? 0 : Math.PI / 2, 0), C.accent);
        a1.g.position.x = -1.45; world.add(a1.g);
        const a2 = arrowV(sph(mode === 'same' ? 0 : Math.PI / 2, Math.PI), C.bad);
        a2.g.position.x = 1.45; world.add(a2.g);
        const bg = track(new THREE.BufferGeometry().setFromPoints(
          [new THREE.Vector3(-1.45, 0, 0), new THREE.Vector3(1.45, 0, 0)]));
        const beam = new THREE.Line(bg, track(new THREE.LineDashedMaterial(
          { color: C.purple, dashSize: .1, gapSize: .07, transparent: true, opacity: mode === 'free' ? 0.12 : .7 })));
        beam.computeLineDistances(); world.add(beam);
        if (opts.lab) { const l = label(opts.lab, '#b78cff', 0.8); l.position.set(0, 1.6, 0); world.add(l); }
        tickers.push(t => {
          if (mode === 'bell') {
            const ph = t * 1.1;
            a1.set(sph(Math.PI / 2, ph)); a2.set(sph(Math.PI / 2, ph + Math.PI));
          } else if (mode === 'same') {
            a1.set(sph(0, 0)); a2.set(sph(0, 0));
          } else {
            a1.set(sph(Math.PI / 2 + 0.4 * Math.sin(t * 0.7), t * 0.9));
            a2.set(sph(Math.PI / 2 + 0.4 * Math.cos(t * 0.5), -t * 1.2));
          }
        });
        home.r = 4.8; orb.r = 4.8;
      },

      /* matrix grid — kinds: 'diag' (δᵢⱼ/trace), 'gram' (symmetric),
         'herm' (mirror pairs), 'grid' (generic/Jᵢⱼ/QUBO weights) */
      matrix() {
        const n = 4, kind = opts.kind || 'grid', cells = [];
        const cg = track(new THREE.BoxGeometry(0.42, 0.42, 0.1));
        for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
          const m = new THREE.Mesh(cg, mat(0x3a3a52));
          m.position.set((j - (n - 1) / 2) * 0.55, ((n - 1) / 2 - i) * 0.55, 0);
          world.add(m); cells.push(m);
        }
        const rng = (i, j) => Math.abs(Math.sin(i * 12.3 + j * 7.7));
        tickers.push(t => {
          const pulse = 0.5 + 0.5 * Math.sin(t * 2);
          cells.forEach((m, k) => {
            const i = Math.floor(k / n), j = k % n;
            let v = rng(i, j);
            if (kind === 'diag') v = i === j ? 1 : 0.12;
            else if (kind === 'gram') v = Math.abs(Math.cos((i - j) * 0.9));
            else if (kind === 'herm') v = i === j ? 1 : Math.max(rng(i, j), rng(j, i)) * (0.7 + 0.3 * pulse);
            m.material.color.setRGB(0.15 + v * 0.4, 0.25 + v * 0.55, 0.4 + v * 0.55);
            m.material.emissive.setScalar(v * 0.12);
          });
        });
        if (opts.lab) { const l = label(opts.lab, '#e8e8f0', 0.85); l.position.set(0, 1.55, 0); world.add(l); }
        home.r = 3.6; orb.r = 3.6; orb.ph = 0.55;
      },

      /* complex plane: z, its conjugate z*, the |z| circle */
      complex() {
        const kind = opts.kind || 'z';
        const ax = new THREE.Mesh(track(new THREE.CylinderGeometry(0.008, 0.008, 3.2, 6)), mat(0x555570));
        ax.rotation.z = Math.PI / 2; world.add(ax);
        const ay = new THREE.Mesh(track(new THREE.CylinderGeometry(0.008, 0.008, 3.2, 6)), mat(0x555570));
        world.add(ay);
        const lr = label('Re', '#8a8aa0', 0.55); lr.position.set(1.8, -0.25, 0); world.add(lr);
        const li = label('Im', '#8a8aa0', 0.55); li.position.set(0.25, 1.8, 0); world.add(li);
        const ring = new THREE.Mesh(track(new THREE.TorusGeometry(1.0, 0.012, 8, 64)),
          basic(C.gold, { transparent: true, opacity: .6 }));
        world.add(ring);
        const zv = arrowV(new THREE.Vector3(1, 1, 0).normalize(), C.accent, 1); world.add(zv.g);
        let cz = null;
        if (kind !== 'z') {                                     // z* mirrored below
          cz = arrowV(new THREE.Vector3(1, -1, 0).normalize(), C.purple, 1);
          world.add(cz.g);
          const lz = label('z*', '#b78cff', 0.6); lz.position.set(0.9, -1.3, 0); world.add(lz);
        }
        const lz0 = label('z', '#7cd4f7', 0.6); lz0.position.set(0.9, 1.35, 0); world.add(lz0);
        tickers.push(t => {
          const a = t * 0.7;
          const d = new THREE.Vector3(Math.cos(a), Math.sin(a), 0);
          zv.set(d, 1);
          if (cz) cz.set(new THREE.Vector3(Math.cos(a), -Math.sin(a), 0), 1);
        });
        home.r = 4; orb.r = 4; orb.ph = 1.2;
      },

      /* energy levels: lines + hopping ball, optional gap band */
      levels() {
        const n = 4, lv = [];
        for (let i = 0; i < n; i++) {
          const h = -1.1 + i * 0.62;
          const ln = new THREE.Mesh(track(new THREE.BoxGeometry(2.6, 0.05, 0.5)),
            mat(i === 1 || i === 2 ? C.warn : 0x4a4a66));
          ln.position.y = h; world.add(ln); lv.push(h);
          const ll = label('E' + i, i === 1 || i === 2 ? '#ffc46b' : '#8a8aa0', 0.45);
          ll.position.set(1.65, h, 0); world.add(ll);
        }
        /* gap arrow between E1 and E2 */
        const gap = new THREE.Mesh(track(new THREE.CylinderGeometry(0.015, 0.015, lv[2] - lv[1], 6)),
          mat(C.ok, { emissive: 0x0d2b1c }));
        gap.position.set(-1.45, (lv[1] + lv[2]) / 2, 0); world.add(gap);
        const lg = label('Δ gap', '#5be3a1', 0.55); lg.position.set(-1.45, lv[2] + 0.3, 0); world.add(lg);
        const ball = new THREE.Mesh(track(new THREE.SphereGeometry(0.09, 20, 14)),
          mat(C.white, { emissive: 0x777788 })); world.add(ball);
        const la = label(opts.lab || 'energy', '#e8e8f0', 0.8); la.position.set(0, 1.9, 0); world.add(la);
        tickers.push(t => {
          /* ball mostly rests on E0, occasionally hops the gap */
          const cyc = t % 4;
          const y = cyc < 3 ? lv[0] : (cyc < 3.5 ? lv[1] : lv[2] - 0.62);
          ball.position.y += (y + 0.14 - ball.position.y) * 0.15;
          ball.position.x = Math.sin(t * 0.4) * 0.5;
        });
        home.r = 4.4; orb.r = 4.4; orb.ph = 1.25;
      },

      /* overlap: two arrows + dashed link, overlap readout bar */
      overlap() {
        const a1 = arrowV(sph(Math.PI / 2, 0), C.accent); world.add(a1.g);
        const a2 = arrowV(sph(Math.PI / 2, 0.6), C.bad); world.add(a2.g);
        const geo = track(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(1, 0, 0)]));
        const link = new THREE.Line(geo, track(new THREE.LineDashedMaterial(
          { color: C.gold, dashSize: .08, gapSize: .05, transparent: true })));
        link.computeLineDistances(); world.add(link);
        const meter = new THREE.Mesh(track(new THREE.BoxGeometry(2, 0.12, 0.12)), mat(0x3a3a52));
        meter.position.set(0, -1.5, 0); world.add(meter);
        const fill = new THREE.Mesh(track(new THREE.BoxGeometry(1, 0.1, 0.1)), mat(C.gold, { emissive: 0x33260d }));
        world.add(fill);
        const lm = label('overlap |⟨ψ|ψ′⟩|', '#f2c94c', 0.65); lm.position.set(0, -1.15, 0); world.add(lm);
        grid(-1.7, 5);
        tickers.push(t => {
          const sep = 0.35 + 0.55 * Math.abs(Math.sin(t * 0.8));      // angle between them
          a1.set(sph(Math.PI / 2, 0)); a2.set(sph(Math.PI / 2, sep));
          const p = geo.attributes.position;
          const tip1 = sph(Math.PI / 2, 0), tip2 = sph(Math.PI / 2, sep);
          p.setXYZ(0, tip1.x, tip1.y, tip1.z); p.setXYZ(1, tip2.x, tip2.y, tip2.z);
          p.needsUpdate = true; link.computeLineDistances();
          const ov = Math.abs(Math.cos(sep));                          // |⟨ψ|ψ′⟩| for equatorial states
          fill.scale.x = ov * 2; fill.position.set(-1 + ov, -1.5, 0);
        });
        home.r = 4; orb.r = 4;
      },

      /* phase wheels — QFT/QPE/kickback readout */
      winding() {
        const n = 8, hands = [];
        const cg = track(new THREE.CylinderGeometry(0.03, 0.03, 0.5, 8));
        for (let i = 0; i < n; i++) {
          const hg = new THREE.Group();
          hg.position.set((i - (n - 1) / 2) * 0.55, 0, 0);
          const dial = new THREE.Mesh(track(new THREE.TorusGeometry(0.22, 0.012, 8, 40)), basic(0x555570));
          hg.add(dial);
          const hand = new THREE.Mesh(cg, mat(C.warn, { emissive: 0x332211 }));
          hand.position.y = 0.12; hand.geometry = cg;
          const grp2 = new THREE.Group(); grp2.add(hand); hg.add(grp2);
          world.add(hg); hands.push(grp2);
        }
        const ll = label('phases e^{2πijk/N}', '#ffc46b', 0.85); ll.position.set(0, 0.85, 0); world.add(ll);
        grid(-0.9, 6);
        tickers.push(t => {
          const j = Math.floor(t * 0.6) % n;
          hands.forEach((h, k) => { h.rotation.z = -(2 * Math.PI * j * k / n) + t * 0.3; });
        });
        home.r = 4.2; orb.r = 4.2; orb.ph = 1.2;
      },

      /* outer product: ket arrow + bra plate → grid appears */
      outer() {
        const ket = arrowV(sph(0.8, 0.4), C.accent); ket.g.position.x = -1.6; world.add(ket.g);
        const bra = new THREE.Mesh(track(new THREE.BoxGeometry(0.9, 0.06, 0.4)), mat(C.purple));
        bra.position.set(0, 0.4, 0); world.add(bra);
        const x = label('×', '#e8e8f0', 0.6); x.position.set(-0.6, 0.4, 0); world.add(x);
        const n = 3, cells = [];
        const cg = track(new THREE.BoxGeometry(0.3, 0.3, 0.06));
        for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
          const m = new THREE.Mesh(cg, mat(0x4a6fa5));
          m.position.set(1.5 + (j - 1) * 0.38, (1 - i) * 0.38, 0);
          m.scale.setScalar(0.01); world.add(m); cells.push(m);
        }
        const lab = label('|ψ⟩⟨φ| = matrix', '#e8e8f0', 0.75); lab.position.set(0.2, 1.35, 0); world.add(lab);
        tickers.push(t => {
          const k = 0.5 + 0.5 * Math.sin(t * 1.2);
          ket.set(sph(0.8, t * 0.8));
          bra.rotation.y = t * 0.8;
          cells.forEach((m, c) => {
            const i = Math.floor(c / n), j = c % n;
            m.scale.setScalar(k * (0.4 + 0.6 * Math.abs(Math.sin(i * 1.3 + j * 0.9))));
          });
        });
        focus.set(0.1, 0.3, 0); home.r = 4.6; orb.r = 4.6;
      },

      /* weighted sum: bars stacking = Σᵢ λᵢ |aᵢ⟩|bᵢ⟩ */
      sum() {
        const n = 5, bars = [];
        const bg = track(new THREE.BoxGeometry(0.4, 1, 0.4));
        for (let i = 0; i < n; i++) {
          const b = new THREE.Mesh(bg, mat(new THREE.Color().setHSL(0.55 - i * 0.09, 0.6, 0.55).getHex()));
          b.position.set((i - 2) * 0.55, -1.2, 0); b.scale.y = 0.05;
          world.add(b); bars.push(b);
        }
        const lab = label('Σᵢ λᵢ', '#e8e8f0', 0.8); lab.position.set(0, 0.9, 0); world.add(lab);
        grid(-1.3, 5);
        tickers.push(t => {
          bars.forEach((b, i) => {
            const w = Math.abs(Math.sin(t * 0.9 + i * 1.1)) * 1.4 + 0.05;
            b.scale.y = w; b.position.y = -1.2 + w / 2;
          });
        });
        home.r = 3.8; orb.r = 3.8; orb.ph = 1.15;
      },

      /* unitary evolution: arrow orbiting (smooth, reversible) */
      evolve() {
        world.add(sphereUnit());
        const vec = arrowV(sph(Math.PI / 3, 0), C.ok); world.add(vec.g);
        const tr = trail(C.ok, 160); world.add(tr.obj);
        const lab = label(opts.lab || 'U(t)', '#5be3a1', 0.8); lab.position.set(0, 1.55, 0); world.add(lab);
        grid();
        tickers.push(t => {
          const d = sph(Math.PI / 3, t * 1.1);
          vec.set(d); tr.push(d.clone());
        });
        home.r = 3.9; orb.r = 3.9;
      },

      /* exponential dimension: dots doubling 1→2→4→8→16 */
      dims() {
        const groups = [];
        const dg = track(new THREE.SphereGeometry(0.07, 14, 10));
        for (let g = 0; g < 5; g++) {
          const cnt = 1 << g, row = [];
          const y = (g - 2) * 0.55;
          for (let i = 0; i < cnt; i++) {
            const d = new THREE.Mesh(dg, mat(C.accent, { emissive: 0x0d2530 }));
            d.position.set((i - (cnt - 1) / 2) * Math.min(0.5, 2.6 / cnt), y, 0);
            world.add(d); row.push(d);
          }
          const l = label('2^' + g, '#9a9ab0', 0.5); l.position.set(1.9, y, 0); world.add(l);
          groups.push(row);
        }
        const lab = label('Hilbert space grows as 2ⁿ', '#e8e8f0', 0.8); lab.position.set(0, 1.7, 0); world.add(lab);
        grid(-1.8, 6);
        tickers.push(t => {
          const on = Math.floor(t * 1.2) % 6;
          groups.forEach((row, g) => row.forEach(d =>
            d.material.emissive.setScalar(g <= on ? 0.3 : 0.02)));
        });
        home.r = 4.6; orb.r = 4.6; orb.ph = 1.2;
      },

      /* norm: arrow on a unit circle — length is the thing */
      norm() {
        const ring = new THREE.Mesh(track(new THREE.TorusGeometry(1, 0.01, 8, 64)), basic(0x555570));
        ring.rotation.x = Math.PI / 2; world.add(ring);
        const vec = arrowV(new THREE.Vector3(1, 0, 0), C.gold); world.add(vec.g);
        const lab = label('‖ψ‖ = 1 always', '#f2c94c', 0.8); lab.position.set(0, 0.5, 0); world.add(lab);
        grid(-0.4, 4);
        tickers.push(t => {
          vec.set(new THREE.Vector3(Math.cos(t), 0, Math.sin(t)), 1);
        });
        home.r = 3.4; orb.r = 3.4; orb.ph = 0.5;
      },

      /* probability bars: |α|², |β|² histogram */
      bars() {
        const bs = [], labs = [];
        [['P(0)=|α|²', '#7cd4f7', 0], ['P(1)=|β|²', '#ff7a7a', 1]].forEach(([t2, c, i]) => {
          const b = new THREE.Mesh(track(new THREE.BoxGeometry(0.6, 1, 0.6)), mat(parseInt(c.slice(1), 16)));
          b.position.set(i ? 0.5 : -0.5, -1.2, 0); world.add(b); bs.push(b);
          const l = label(t2, c, 0.55); l.position.set(i ? 0.5 : -0.5, 0.9, 0); world.add(l);
        });
        grid(-1.3, 4);
        tickers.push(t => {
          const p = 0.5 + 0.4 * Math.sin(t * 0.9);
          [[bs[0], p], [bs[1], 1 - p]].forEach(([b, w]) => {
            b.scale.y = w * 1.6; b.position.y = -1.2 + w * 0.8;
          });
        });
        home.r = 3.6; orb.r = 3.6; orb.ph = 1.1;
      },

      /* SWAP: two qubits exchange states */
      swap() {
        const s1 = sphereUnit(); s1.position.x = -1.4; world.add(s1);
        const s2 = sphereUnit(); s2.position.x = 1.4; world.add(s2);
        const a1 = arrowV(sph(0.6, 0), C.accent); a1.g.position.x = -1.4; world.add(a1.g);
        const a2 = arrowV(sph(Math.PI - 0.6, 0), C.bad); a2.g.position.x = 1.4; world.add(a2.g);
        const arc = new THREE.Mesh(track(new THREE.TorusGeometry(1.4, 0.015, 8, 60, Math.PI)),
          basic(C.purple, { transparent: true, opacity: .7 }));
        arc.position.y = 0; world.add(arc);
        const lab = label('SWAP', '#b78cff', 0.8); lab.position.set(0, 1.8, 0); world.add(lab);
        tickers.push(t => {
          const k = 0.5 + 0.5 * Math.sin(t * 1.2);              // exchange progress
          const d1 = sph(0.6 + k * (Math.PI - 1.2), 0), d2 = sph(Math.PI - 0.6 - k * (Math.PI - 1.2), 0);
          a1.set(d1); a2.set(d2);
          arc.rotation.y = t * 0.8;
        });
        home.r = 4.6; orb.r = 4.6;
      },

      /* decoherence: arrow spirals inward (purity dies) */
      decay() {
        world.add(sphereUnit());
        const vec = arrowV(sph(Math.PI / 2, 0), C.bad); world.add(vec.g);
        const tr = trail(C.bad, 120); world.add(tr.obj);
        const core = new THREE.Mesh(track(new THREE.SphereGeometry(1, 24, 16)),
          mat(C.bad, { transparent: true, opacity: .1 }));
        world.add(core);
        const lab = label(opts.lab || 'purity falling', '#ff7a7a', 0.75); lab.position.set(0, 1.55, 0); world.add(lab);
        grid();
        tickers.push(t => {
          const len = Math.max(0.12, 1 - (t % 8) * 0.12);
          const d = sph(Math.PI / 2, t * 1.6);
          vec.set(d, len); tr.push(d.clone().multiplyScalar(len));
          core.scale.setScalar(0.02 + len);
        });
        home.r = 3.9; orb.r = 3.9;
      },

      /* dataset / many points */
      dataset() {
        const dg = track(new THREE.SphereGeometry(0.07, 12, 8));
        const pts = [];
        for (let i = 0; i < 40; i++) {
          const a = i * 0.55, r = 0.3 + (i % 5) * 0.35;
          const d = new THREE.Mesh(dg, mat(i % 3 ? C.accent : C.bad));
          d.position.set(Math.cos(a) * r, (i % 7 - 3) * 0.3, Math.sin(a) * r);
          world.add(d); pts.push({ d, a, r });
        }
        const lab = label(opts.lab || 'dataset D', '#e8e8f0', 0.8); lab.position.set(0, 1.6, 0); world.add(lab);
        grid(-1.5, 5);
        tickers.push(t => {
          pts.forEach(p => {
            p.d.position.x = Math.cos(p.a + t * 0.25) * p.r;
            p.d.position.z = Math.sin(p.a + t * 0.25) * p.r;
          });
        });
        home.r = 4.6; orb.r = 4.6;
      },
    };

    (build[name] || build.bloch)();

    /* ---------- main loop ---------- */
    let alive = true, last = performance.now(), elapsed = 0;
    function frame(now) {
      if (!alive) return;
      const dt = Math.min(0.05, (now - last) / 1000); last = now; elapsed += dt;
      if (!pointers.size) { orb.th += vth; orb.ph += vph; vth *= 0.94; vph *= 0.94;
        orb.ph = Math.max(0.15, Math.min(Math.PI - 0.15, orb.ph)); }
      cam.position.set(
        focus.x + orb.r * Math.sin(orb.ph) * Math.sin(orb.th),
        focus.y + orb.r * Math.cos(orb.ph),
        focus.z + orb.r * Math.sin(orb.ph) * Math.cos(orb.th));
      cam.lookAt(focus);
      tickers.forEach(f => f(elapsed, dt));
      renderer.render(scene, cam);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    const ro = new ResizeObserver(() => {
      renderer.setSize(W(), H());
      cam.aspect = W() / H(); cam.updateProjectionMatrix();
    });
    ro.observe(container);

    return {
      api,
      dispose() {
        alive = false; ro.disconnect();
        disposables.forEach(d => { try { d.dispose && d.dispose(); } catch (e) {} });
        try { renderer.dispose(); cvs.remove(); } catch (e) {}
      },
    };
  }

  window.QML = window.QML || {};
  window.QML.viz3d = { create };
})();
