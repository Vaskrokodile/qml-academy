const fs = require('fs');
const store = {};
global.localStorage = { getItem: k => store[k] || null, setItem: (k, v) => { store[k] = v; }, removeItem: k => { delete store[k]; } };
global.window = {};
global.document = { hidden: false, createElement: () => ({ className: '', prepend() {}, querySelector: () => null, querySelectorAll: () => [] }), body: { appendChild() {} }, addEventListener() {}, contains: () => false };
global.location = { hash: '' };
eval(fs.readFileSync('assets/js/db.js', 'utf8'));
global.QML = window.QML;
global.window.katex = require('./assets/vendor/katex/katex.js');
eval(fs.readFileSync('assets/js/icons.js', 'utf8'));
eval(fs.readFileSync('assets/js/components.js', 'utf8'));
eval(fs.readFileSync('assets/js/viz.js', 'utf8'));
['bank', 'definitions', 'meta', 'evals', 'courses', 'practical', 'eval-practical', 'course-gates', 'course-deepening-a', 'course-deepening-b'].forEach(f => eval(fs.readFileSync(`assets/js/data/${f}.js`, 'utf8')));
['course', 'evals', 'palace', 'practice'].forEach(f => eval(fs.readFileSync(`assets/js/views/${f}.js`, 'utf8')));
Object.assign(global, window);

// palace render — stub DOM with dummy elements for wiring
const dummy = () => new Proxy({ innerHTML: '', hidden: false, classList: { toggle() {}, add() {}, remove() {} }, style: {}, dataset: {}, querySelector: () => dummy(), querySelectorAll: () => [], focus() {}, onclick: null }, { get: (t, k) => k in t ? t[k] : (() => {}) });
const el = { innerHTML: '', querySelectorAll: () => [], querySelector: () => dummy() };
QML.views.palace(el);
console.log('palace render:', el.innerHTML.includes('method of loci'), '| loci:', (el.innerHTML.match(/pal-locus\b/g) || []).length);

// palace pin + recall + MMR
QML.DB.pinPalace({ locus: 'Front door', title: 'Born rule', vivid: 'psi screams' });
console.log('pin ok:', QML.DB.palacePins().length === 1);
QML.DB.recallPin(QML.DB.palacePins()[0].id, 'ok');
QML.DB.recordProof('mm-proof1', 75, '3/4');
console.log('MMR after proof+recall:', QML.DB.mmr(), '(was ~560 baseline w/ 6h seed)');

// eval resolution: refs + kinds in mini-states
const mini = window.QML_EVALS.find(e => e.id === 'mini-states');
const bank = window.QML_QUESTIONS;
const byId = Object.fromEntries(bank.map(q => [q.id, q]));
const resolved = mini.questions.map(q => q.ref ? byId[q.ref] : q);
console.log('mini-states resolved:', resolved.every(q => q && q.prompt), '| kinds:', resolved.map(q => q.kind || 'mcq').join(','));

// course render with parts + gates
const el2 = { innerHTML: '', querySelectorAll: () => [], querySelector: () => dummy() };
QML.views.course(el2, ['c-foundations', '0']);
const h = el2.innerHTML;
console.log('parts:', (h.match(/crs-part/g) || []).length, '| gate:', h.includes('crs-gate'), '| pin:', h.includes('Pin to palace'));

const gatesCourse = window.QML_COURSES.find(c => c.id === 'c-bloch-gates');
console.log('Bloch course:', gatesCourse && gatesCourse.lessons.length === 7, '| lessons:', gatesCourse && gatesCourse.lessons.length);
const blochEl = { innerHTML: '', querySelectorAll: () => [], querySelector: () => dummy() };
QML.views.course(blochEl, ['c-bloch-gates', '0']);
console.log('Bloch widget markup:', blochEl.innerHTML.includes('data-bloch') && blochEl.innerHTML.includes('Apply H'));

QML.DB.srsReview('srs-smoke', false);
const queued = QML.DB.srsDue().includes('srs-smoke');
QML.DB.srsReview('srs-smoke', true);
console.log('SRS due/relearn:', !queued && !QML.DB.srsDue().includes('srs-smoke'));
QML.DB.saveLabDraft('draft-smoke', { checks: ['one'], evidence: 'reproducible artifact notes' });
console.log('lab draft persistence:', QML.DB.labDraft('draft-smoke').checks[0] === 'one');

const pcEl = { innerHTML: '' };
QML.views.practice(pcEl, []);
const locked = { innerHTML: '' };
QML.views.practice(locked, ['capstone-qml-package']);
console.log('Practical Center:', pcEl.innerHTML.includes('Project track'), '| capstone gate:', locked.innerHTML.includes('STAGE LOCKED'));

QML.DB.completeLesson('legacy-smoke', 'lesson-1', 0);
const legacy = JSON.parse(QML.DB.exportState());
const keep = { xp: legacy.xp, challenge: legacy.challenge.total, done: legacy.courses['legacy-smoke'].done[0] };
delete legacy.srs; delete legacy.labs; delete legacy.labDrafts;
store['qml-academy-v1'] = JSON.stringify(legacy);
eval(fs.readFileSync('assets/js/db.js', 'utf8'));
const upgraded = window.QML.DB.state();
console.log('Legacy state migration:', !!(upgraded.xp === keep.xp && upgraded.challenge.total === keep.challenge && upgraded.courses['legacy-smoke'].done[0] === keep.done && upgraded.srs && upgraded.labs && upgraded.labDrafts));
