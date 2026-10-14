/* ============================================================
   Practical Center — staged QML labs and pipeline evaluation.
   Work is browser-local and saved through QML.DB; the UI guides
   notebook/model work but does not claim to execute quantum code.
   ============================================================ */
(function () {
  const DB = QML.DB;
  const ui = QML.ui;
  const esc = ui.esc;
  QML.views = QML.views || {};

  const labs = () => window.QML_PRACTICAL_LABS || [];
  const routeHref = route => {
    const r = String(route || '').trim();
    if (!r) return '#/courses';
    if (r.startsWith('#/')) return /^#\/[a-z0-9/_-]+$/i.test(r) ? r : '#/courses';
    return /^\/?[a-z0-9/_-]+$/i.test(r) ? '#/' + r.replace(/^\//, '') : '#/courses';
  };
  const pct = lab => DB.labBest(lab.id) || 0;
  const doneCount = () => labs().filter(l => DB.labDone(l.id)).length;
  const labType = l => String(l.type || (l.isCapstone ? 'Evaluation' : 'Challenge'));
  const instructions = l => {
    const src = l.instructions ?? l.practicalInstructions ?? l.brief ?? l.steps ?? [];
    return Array.isArray(src) ? src : [src];
  };
  const checks = l => {
    const src = l.checklist ?? l.acceptance ?? l.acceptanceChecklist ?? l.checks ?? [];
    return (Array.isArray(src) ? src : [src]).map((x, i) => typeof x === 'string'
      ? { id: 'check-' + i, label: x, points: 1, required: true }
      : { id: String(x.id || 'check-' + i), label: String(x.label || x.text || x.item || ''), points: Number(x.points) || 1, required: x.required !== false });
  };
  const prereqs = l => l.prerequisites || l.prereqs || [];

  QML.views.practice = function (el, params) {
    const id = params && params[0];
    const selected = id && labs().find(l => l.id === id);
    if (selected && selected.requiresStage && !DB.labDone(selected.requiresStage)) {
      const previous = labs().find(l => l.id === selected.requiresStage);
      el.innerHTML = `<div class="pc-wrap"><a class="pc-back" href="#/practice">${QML.icon('left', 14)} All practical stages</a><section class="card pc-locked"><span class="pc-kicker">STAGE LOCKED</span><h1>${esc(selected.title)}</h1><p>Complete the previous milestone first${previous ? `: <b>${esc(previous.title)}</b>` : ''}.</p>${previous ? `<a class="btn btn-primary" href="#/practice/${esc(previous.id)}">Open previous stage ${QML.icon('right', 14)}</a>` : ''}</section></div>`;
      return;
    }
    if (selected) return renderLab(el, selected);
    renderIndex(el);
  };

  function renderIndex(el) {
    const all = labs();
    const capstone = all.find(l => l.isCapstone || l.type === 'Evaluation' || l.kind === 'capstone') || all[all.length - 1];
    const startStage = all.find(l => l.track === 'capstone' && l.stage === 1) || capstone;
    const stages = all.filter(l => l !== capstone);
    const complete = doneCount();
    const total = all.length;
    const topics = (window.QML_PRACTICAL_BANK || []).length;
    const group = new Map();
    stages.forEach(l => {
      const phase = String(l.phase || 'Practice').startsWith('Capstone') ? 'End-to-end capstone' : (l.phase || 'Practice');
      group.set(phase, (group.get(phase) || []).concat(l));
    });
    const stageCards = Array.from(group.entries()).map(([phase, items], gi) => `
      <section class="pc-phase">
        <div class="pc-phase-head"><span class="pc-phase-num">${String(gi + 1).padStart(2, '0')}</span><h2>${esc(phase)}</h2><span class="pc-phase-count">${items.filter(x => DB.labDone(x.id)).length}/${items.length}</span></div>
        <div class="pc-cards">${items.map(l => card(l)).join('')}</div>
      </section>`).join('');

    el.innerHTML = `<div class="pc-wrap">
      <section class="pc-hero">
        <div class="pc-kicker">HANDS-ON QUANTUM MACHINE LEARNING</div>
        <h1>From idea to a tested pipeline.</h1>
        <p>Turn the theory into explicit artifacts: a defensible model choice, leakage-safe data plan, classical baseline, quantum circuit, training log, held-out evaluation, and a serving/reproducibility plan.</p>
        <div class="pc-hero-foot">
          <div class="pc-progress"><div><b>${complete}<small>/${total}</small></b><span>stages passed</span></div><div class="pc-track"><i style="width:${total ? complete / total * 100 : 0}%"></i></div></div>
          ${startStage ? `<a class="btn btn-primary" href="#/practice/${esc(startStage.id)}">Begin pipeline project ${QML.icon('right', 15)}</a>` : '<a class="btn btn-primary" href="#/courses">Start with courses</a>'}
        </div>
      </section>

      <div class="pc-note"><span>${QML.icon('flask', 18)}</span><p><b>Execution boundary:</b> this static browser app stores plans, checklists and evidence. It does not install Qiskit/PennyLane, train a model, access quantum hardware, or deploy services. Labs specify reproducible work to run in your own notebook/environment; no simulated checklist score is presented as model performance.</p></div>

      <div class="pc-summary">
        <div class="card pc-summary-card"><span class="pc-summary-ic pc-violet">${QML.icon('layers', 19)}</span><div><b>${total}</b><small>project stages</small></div></div>
        <div class="card pc-summary-card"><span class="pc-summary-ic pc-green">${QML.icon('check', 19)}</span><div><b>${complete}</b><small>passed at 70%+</small></div></div>
        <div class="card pc-summary-card"><span class="pc-summary-ic pc-blue">${QML.icon('target', 19)}</span><div><b>${topics}</b><small>practical review questions</small></div></div>
      </div>

      <div class="pc-section-title"><div><span class="pc-kicker">BUILD IT IN MILESTONES</span><h2>Project track</h2></div><a class="pc-link" href="#/challenges">Adaptive review ${QML.icon('right', 13)}</a></div>
      ${stageCards || '<div class="card pc-empty">Practical lab content is loading. Open Courses to start with the foundations.</div>'}
      ${capstone ? `<section class="pc-capstone">${card(capstone, true)}</section>` : ''}
    </div>`;
  }

  function card(lab, capstone) {
    const done = DB.labDone(lab.id);
    const best = DB.labBest(lab.id);
    const checksN = checks(lab).length;
    const prereqN = prereqs(lab).length;
    const locked = !!(lab.requiresStage && !DB.labDone(lab.requiresStage));
    const tag = locked ? 'div' : 'a';
    const href = locked ? '' : ` href="#/practice/${esc(lab.id)}"`;
    return `<${tag} class="pc-card ${capstone ? 'pc-card-capstone' : ''} ${done ? 'is-done' : ''} ${locked ? 'is-locked' : ''}"${href}>
      <div class="pc-card-top"><span class="pc-card-icon">${QML.icon(locked ? 'lock' : capstone ? 'trophy' : 'flask', 18)}</span><span class="pc-card-type">${esc(labType(lab))} · ${esc(lab.level || 'Guided')}</span>${done ? `<span class="pc-complete">${QML.icon('check', 12)} Passed</span>` : locked ? '<span class="pc-card-lock">Complete prior stage</span>' : ''}</div>
      <h3>${esc(lab.title)}</h3>
      <p>${esc(lab.summary || lab.description || lab.objective || 'Complete a focused stage in the end-to-end QML project.')}</p>
      <div class="pc-card-meta"><span>${QML.icon('clock', 13)} ${esc(String(lab.estimatedTime || lab.estMin || lab.time || '30 min'))}</span><span>${QML.icon('check', 13)} ${checksN} acceptance checks</span><span>${QML.icon('courses', 13)} ${prereqN} prerequisites</span></div>
      <div class="pc-card-bottom"><span class="pc-progress-mini"><i style="width:${best || 0}%"></i></span><b>${best == null ? 'Not attempted' : best + '% best'}</b>${locked ? QML.icon('lock', 14) : QML.icon('right', 15)}</div>
    </${tag}>`;
  }

  function renderLab(el, lab) {
    const labChecks = checks(lab);
    const draft = DB.labDraft(lab.id);
    const checked = new Set(draft.checks || []);
    const done = DB.labDone(lab.id);
    const score = DB.labBest(lab.id);
    const instructionsList = instructions(lab).filter(Boolean);
    const prereqLinks = prereqs(lab).map(p => {
      const r = typeof p === 'string' ? p : (p.route || p.href || p.id || '');
      const label = typeof p === 'string' ? p.replace(/^#\//, '').replaceAll('-', ' ') : (p.title || p.label || p.id || 'Review prerequisite');
      return `<a class="pc-prereq" href="${routeHref(r)}">${QML.icon('book', 13)} ${esc(label)}</a>`;
    }).join('');
    const weighted = labChecks.reduce((s, c) => s + c.points, 0) || 1;

    el.innerHTML = `<div class="pc-wrap pc-runner">
      <a class="pc-back" href="#/practice">${QML.icon('left', 14)} All practical stages</a>
      <header class="pc-run-head">
        <div><span class="pc-kicker">${esc(lab.phase || 'PRACTICAL CENTER')} · ${esc(labType(lab))}</span><h1>${esc(lab.title)}</h1><p>${esc(lab.summary || lab.description || lab.objective || '')}</p></div>
        <div class="pc-score-card"><span>Best score</span><b>${score == null ? '—' : score + '%'}</b><small>${done ? 'Passed' : 'Pass threshold: 70%'}</small></div>
      </header>
      ${lab.isCapstone || lab.type === 'Evaluation' ? `<div class="pc-note"><span>${QML.icon('target', 18)}</span><p><b>Capstone evaluation:</b> submit a coherent, evidence-backed pipeline plan. Completion scoring measures whether required work artifacts are documented; it does not validate that training or deployment succeeded.</p></div>` : ''}
      ${prereqLinks ? `<section class="pc-prereqs"><b>Recommended preparation</b><div>${prereqLinks}</div></section>` : ''}
      <div class="pc-run-grid">
        <div class="pc-run-main">
          <section class="card pc-instructions"><div class="pc-block-head"><span class="pc-step-number">01</span><div><h2>Brief & workflow</h2><small>${esc(String(lab.estimatedTime || lab.estMin || '30 min'))} · ${esc(lab.level || 'Guided')}</small></div></div>
            ${instructionsList.length ? `<ol>${instructionsList.map(x => `<li>${ui.md(typeof x === 'string' ? x : (x.text || x.instruction || x.title || ''))}</li>`).join('')}</ol>` : '<p>Read the stage goal, then complete each acceptance check using your own notebook/environment.</p>'}
            ${lab.code ? `<pre class="pc-code"><code>${esc(lab.code)}</code></pre>` : ''}
          </section>
          <section class="card pc-checks"><div class="pc-block-head"><span class="pc-step-number">02</span><div><h2>Acceptance criteria</h2><small>Tick a criterion only when you can show the work artifact.</small></div><b class="pc-check-count"><span data-check-count>${checked.size}</span>/${labChecks.length}</b></div>
            <div class="pc-check-list">${labChecks.map(c => `<label class="pc-check ${checked.has(c.id) ? 'checked' : ''}"><input type="checkbox" data-check="${esc(c.id)}" ${checked.has(c.id) ? 'checked' : ''}><span class="pc-check-box">${QML.icon('check', 13)}</span><span>${ui.md(c.label)}</span><small>${c.points} pt${c.points === 1 ? '' : 's'}</small></label>`).join('')}</div>
          </section>
          <section class="card pc-evidence"><div class="pc-block-head"><span class="pc-step-number">03</span><div><h2>Evidence & notes</h2><small>Record notebook paths, measurements, decisions, and limitations.</small></div></div>
            <label for="pc-evidence">Evidence record</label><textarea id="pc-evidence" maxlength="12000" placeholder="Example: notebook qml-project/03_baseline.ipynb · fixed seed 17 · stratified 70/15/15 split · baseline AUROC ...">${esc(draft.evidence || '')}</textarea>
            <div class="pc-save-status" role="status">Draft saves locally as you work${draft.updated ? ` · last saved ${esc(draft.updated)}` : ''}</div>
          </section>
          <div class="pc-submit-row"><button class="btn btn-primary btn-lg" id="pc-submit">${QML.icon('check', 15)} Submit stage evaluation</button><span class="muted">Checklist score ${Math.round(100 * labChecks.filter(c => checked.has(c.id)).reduce((n, c) => n + c.points, 0) / weighted)}% · 70% required</span></div>
        </div>
        <aside class="pc-run-side">
          <section class="card pc-rubric"><div class="pc-block-head"><span class="pc-step-number">04</span><div><h2>Scoring rubric</h2><small>Artifact completeness</small></div></div>
            <div class="pc-rubric-line"><span>Documented checks</span><b>70%</b></div><div class="pc-rubric-line"><span>Evidence record</span><b>20%</b></div><div class="pc-rubric-line"><span>Reflection</span><b>10%</b></div>
            <p>Self-attestation is a progress signal, not an external grade. Be able to reproduce every checked artifact.</p>
          </section>
          <section class="card pc-next"><span class="pc-kicker">PIPELINE PRINCIPLE</span><h3>Keep the classical control.</h3><p>For each quantum component, write down the classical baseline, data split, shot budget, optimizer, and failure criteria. Compare under matched compute budgets before making a performance claim.</p><a href="#/courses">Review core courses ${QML.icon('right', 13)}</a></section>
        </aside>
      </div>
      <dialog class="pc-result" id="pc-result"><div class="pc-result-inner"><span class="pc-kicker">STAGE RESULT</span><h2 data-result-title>Evaluation complete</h2><b class="pc-result-score" data-result-score></b><p data-result-msg></p><div class="pc-result-actions"><button class="btn btn-ghost" data-result-close>Back to stage</button><a class="btn btn-primary" href="#/practice">Track overview ${QML.icon('right', 14)}</a></div></div></dialog>
    </div>`;

    const checksNow = () => Array.from(el.querySelectorAll('[data-check]:checked')).map(x => x.dataset.check);
    const evidence = el.querySelector('#pc-evidence');
    let saveTimer;
    const saveDraft = () => {
      el.querySelector('.pc-save-status').textContent = 'Saving…';
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => {
        DB.saveLabDraft(lab.id, { checks: checksNow(), evidence: evidence.value });
        el.querySelector('.pc-save-status').textContent = 'Draft saved on this device · ' + new Date().toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
      }, 160);
    };
    el.querySelectorAll('[data-check]').forEach(input => input.addEventListener('change', () => {
      input.closest('.pc-check').classList.toggle('checked', input.checked);
      el.querySelector('[data-check-count]').textContent = checksNow().length;
      saveDraft();
    }));
    evidence.addEventListener('input', saveDraft);

    const dialog = el.querySelector('#pc-result');
    el.querySelector('[data-result-close]').onclick = () => dialog.close();
    el.querySelector('#pc-submit').onclick = () => {
      clearTimeout(saveTimer);
      const chosen = new Set(checksNow());
      const got = labChecks.filter(c => chosen.has(c.id)).reduce((n, c) => n + c.points, 0);
      const checkScore = labChecks.length ? 100 * got / weighted : 0;
      const evidenceScore = evidence.value.trim().length >= 40 ? 20 : evidence.value.trim().length ? 10 : 0;
      const reflectionScore = evidence.value.trim().length >= 180 ? 10 : 0;
      const documentedScore = checkScore * .7 + evidenceScore + reflectionScore;
      const requiredComplete = labChecks.every(c => !c.required || chosen.has(c.id));
      const finalScore = Math.round(requiredComplete ? documentedScore : Math.min(69, documentedScore));
      DB.saveLabDraft(lab.id, { checks: Array.from(chosen), evidence: evidence.value });
      DB.finishLab(lab.id, finalScore);
      dialog.querySelector('[data-result-title]').textContent = finalScore >= 70 ? 'Stage passed' : 'Stage needs more evidence';
      dialog.querySelector('[data-result-score]').textContent = finalScore + '%';
      dialog.querySelector('[data-result-msg]').textContent = finalScore >= 70
        ? 'Stage progress saved locally. Keep your actual notebook and results in version control.'
        : 'Add more completed criteria and a reproducible evidence record, then submit again. Your draft remains saved.';
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else { dialog.open = true; }
    };
  }
})();
