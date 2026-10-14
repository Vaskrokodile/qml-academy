/* ============================================================
   QML.views.palace — memory palace (method of loci).
   Route: #/palace

   The loci are fixed locations along a familiar route. Each pin
   binds a concept to a locus with a vivid mental image. "Walk
   the palace" is a retrieval session: recall before reveal,
   then self-grade — successful recalls feed MMR.
   ============================================================ */
(function () {
  const esc = s => QML.ui.esc(s);
  const md = s => QML.ui.md(s);
  QML.views = QML.views || {};

  QML.views.palace = function (el) {
    const DB = QML.DB;
    const pal = DB.state().palace;
    const pins = DB.palacePins();
    const byLocus = {};
    pal.loci.forEach(l => { byLocus[l] = []; });
    pins.forEach(p => { (byLocus[p.locus] = byLocus[p.locus] || []).push(p); });

    const recalls = pins.reduce((a, p) => a + (p.recall.ok || 0) + (p.recall.hazy || 0) + (p.recall.miss || 0), 0);

    el.innerHTML = `
      <div class="pal-wrap stagger">
        <div class="card pal-how">
          <div class="card-head"><div class="card-title">${QML.icon('layers', 17)} The method of loci — your secret weapon</div></div>
          <div class="pal-how-grid">
            <div class="pal-step"><b>1 · Pin</b><span>Take a concept you just learned and attach it to a <em>real place you know</em> — your front door, your desk.</span></div>
            <div class="pal-step"><b>2 · Make it weird</b><span>Absurd, exaggerated, sensory images stick. A ψ screaming at your door beats a note on it.</span></div>
            <div class="pal-step"><b>3 · Walk</b><span>To recall, mentally stroll your route. The places hand the concepts back to you.</span></div>
          </div>
        </div>

        <div class="pal-actions">
          <button class="btn btn-primary" id="pal-walk" ${pins.length ? '' : 'disabled'}>${QML.icon('target', 15)} Walk your palace (${pins.length})</button>
          <button class="btn btn-ghost" id="pal-add">${QML.icon('check', 15)} Pin a concept</button>
          <span class="muted pal-meta">${pins.length} pinned · ${recalls} recall${recalls === 1 ? '' : 's'}${pins.length ? ' · recalls feed MMR' : ''}</span>
        </div>

        <div class="pal-route" id="pal-route">
          ${pal.loci.map((locus, k) => {
            const ps = byLocus[locus] || [];
            return `<div class="pal-locus ${ps.length ? 'has' : ''}" draggable="true" data-k="${k}">
              <div class="pal-locus-head">
                <span class="pal-stop">${k + 1}</span>
                <span class="pal-locus-name" title="Click to rename">${esc(locus)}</span>
                <span class="pal-grip" title="Drag to reorder">${QML.icon('layers', 12)}</span>
                <button class="pal-del" title="Remove this stop" aria-label="Remove stop">×</button>
              </div>
              ${ps.map(p => `
                <button class="pal-pin" data-id="${esc(p.id)}" title="Click to reveal">
                  <span class="pal-pin-t">${esc(p.title)}</span>
                  <span class="pal-pin-v" hidden>${md(p.vivid || 'no image recorded')}</span>
                  <span class="pal-pin-r muted">${(p.recall.ok || 0)}✓ ${(p.recall.hazy || 0)}~ ${(p.recall.miss || 0)}✗</span>
                </button>`).join('') || '<div class="pal-empty muted">— nothing pinned here yet —</div>'}
            </div>`;
          }).join('')}
          <button class="pal-add-locus" id="pal-add-locus" title="Add a stop to your route">
            <span class="pal-add-plus">+</span><span>New stop</span>
          </button>
        </div>
      </div>`;

    /* reveal a pin's vivid image in-place */
    el.querySelectorAll('.pal-pin').forEach(b => {
      b.onclick = () => {
        const v = b.querySelector('.pal-pin-v');
        v.hidden = !v.hidden;
      };
      b.oncontextmenu = e => {
        e.preventDefault();
        if (confirm('Unpin this concept?')) { DB.unpinPalace(b.dataset.id); QML.render(); }
      };
    });

    el.querySelector('#pal-add').onclick = () => QML.ui.pinModal();

    /* ---- route customization: add / rename / delete / drag-reorder ---- */
    const route = el.querySelector('#pal-route');
    const commit = loci => { DB.setLoci(loci); QML.render(); };

    /* "+" card → inline input → append a stop */
    const addBtn = el.querySelector('#pal-add-locus');
    addBtn.onclick = () => {
      const inp = document.createElement('input');
      inp.className = 'pal-newname';
      inp.placeholder = 'Name this place… (Enter)';
      inp.maxLength = 40;
      addBtn.replaceWith(inp);
      inp.focus();
      const done = ok => {
        const v = inp.value.trim();
        if (ok && v) { commit(pal.loci.concat(v)); return; }
        QML.render();
      };
      inp.onkeydown = e => { if (e.key === 'Enter') done(true); if (e.key === 'Escape') done(false); };
      inp.onblur = () => done(true);
    };

    /* click a stop's name → rename inline */
    el.querySelectorAll('.pal-locus-name').forEach(nm => {
      nm.onclick = e => {
        e.stopPropagation();
        const card = nm.closest('.pal-locus');
        const k = +card.dataset.k;
        const inp = document.createElement('input');
        inp.className = 'pal-newname';
        inp.value = pal.loci[k];
        inp.maxLength = 40;
        nm.replaceWith(inp);
        inp.focus();
        inp.select();
        const done = ok => {
          const v = inp.value.trim();
          if (ok && v && v !== pal.loci[k]) {
            const loci = pal.loci.slice();
            const old = loci[k];
            loci[k] = v;
            pins.filter(p => p.locus === old).forEach(p => { p.locus = v; }); // keep pins on the renamed stop
            DB.setLoci(loci); QML.render();
          } else QML.render();
        };
        inp.onkeydown = e => { if (e.key === 'Enter') done(true); if (e.key === 'Escape') done(false); };
        inp.onblur = () => done(true);
      };
    });

    /* × on a stop → remove it; its pins slide to the previous stop */
    el.querySelectorAll('.pal-del').forEach(b => {
      b.onclick = e => {
        e.stopPropagation();
        const k = +b.closest('.pal-locus').dataset.k;
        const dead = pal.loci[k];
        const n = (byLocus[dead] || []).length;
        if (n && !confirm(`"${dead}" has ${n} pin${n === 1 ? '' : 's'} — they will move to the previous stop. Remove it?`)) return;
        const loci = pal.loci.filter((_, i) => i !== k);
        const fallback = loci[Math.max(0, k - 1)] || loci[0];
        pins.filter(p => p.locus === dead).forEach(p => { p.locus = fallback; });
        DB.setLoci(loci); QML.render();
      };
    });

    /* drag a stop to reorder the route */
    let dragK = null;
    el.querySelectorAll('.pal-locus').forEach(card => {
      card.addEventListener('dragstart', e => {
        dragK = +card.dataset.k;
        card.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      });
      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        el.querySelectorAll('.pal-locus').forEach(c => c.classList.remove('over'));
      });
      card.addEventListener('dragover', e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        card.classList.add('over');
      });
      card.addEventListener('dragleave', () => card.classList.remove('over'));
      card.addEventListener('drop', e => {
        e.preventDefault();
        const to = +card.dataset.k;
        if (dragK == null || to === dragK) return;
        const loci = pal.loci.slice();
        const [mv] = loci.splice(dragK, 1);
        loci.splice(to, 0, mv);
        commit(loci);
      });
    });

    /* ---- recall walk ---- */
    el.querySelector('#pal-walk').onclick = () => walk(el, pal, pins);
  };

  function walk(el, pal, pins) {
    const stops = pal.loci
      .map(l => ({ locus: l, pins: pins.filter(p => p.locus === l) }))
      .filter(s => s.pins.length);
    const queue = [];
    stops.forEach(s => s.pins.forEach(p => queue.push({ locus: s.locus, pin: p })));
    let i = 0, ok = 0, hazy = 0, miss = 0;

    function step() {
      const it = queue[i];
      el.innerHTML = `
        <div class="pal-walk">
          <div class="pbar"><i style="width:${(i / queue.length) * 100}%"></i></div>
          <div class="card pal-wcard qz-in">
            <div class="pal-wstop">${QML.icon('layers', 15)} Stop ${i + 1} of ${queue.length} — <b>${esc(it.locus)}</b></div>
            <div class="pal-wq">You are standing at the ${esc(it.locus.toLowerCase())}.<br>What did you pin here?</div>
            <div class="pal-wans" hidden>
              <div class="pal-wt">${esc(it.pin.title)}</div>
              ${it.pin.vivid ? `<div class="pal-wv muted">${md(it.pin.vivid)}</div>` : ''}
            </div>
            <div class="pal-wbtns">
              <button class="btn btn-ghost" id="pal-rev">${QML.icon('check', 15)} Reveal</button>
            </div>
          </div>
        </div>`;
      const rev = el.querySelector('#pal-rev');
      const ans = el.querySelector('.pal-wans');
      const btns = el.querySelector('.pal-wbtns');
      rev.onclick = () => {
        ans.hidden = false;
        btns.innerHTML = `
          <span class="muted" style="font-size:12.5px;margin-right:auto">Honestly — did you get it?</span>
          <button class="btn btn-ghost btn-sm" data-v="miss">Forgot it</button>
          <button class="btn btn-ghost btn-sm" data-v="hazy">Hazy</button>
          <button class="btn btn-primary btn-sm" data-v="ok">${QML.icon('check', 13)} Got it</button>`;
        btns.querySelectorAll('[data-v]').forEach(b => b.onclick = () => {
          const v = b.dataset.v;
          DB.recallPin(it.pin.id, v);
          if (v === 'ok') ok++; else if (v === 'hazy') hazy++; else miss++;
          i++;
          if (i < queue.length) step(); else done();
        });
      };
    }

    function done() {
      const total = queue.length;
      el.innerHTML = `
        <div class="crs-done">
          <div class="crs-done-check">${QML.icon('layers', 30)}</div>
          <div class="crs-done-title">Walk complete</div>
          <div class="crs-done-sub">${ok} clean recall${ok === 1 ? '' : 's'} · ${hazy} hazy · ${miss} forgotten.
            ${miss ? 'The forgotten ones deserve a re-pin with a weirder image.' : 'Your palace is holding strong.'}</div>
          <div class="crs-done-actions">
            <a class="btn btn-primary" href="#/palace">${QML.icon('left', 15)} Back to the palace</a>
          </div>
        </div>`;
    }

    step();
  }
})();
