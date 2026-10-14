// Build a reconstructed QML Academy state targeting ~Ruby II (2400-2500 MMR).
// Validates through the real db.js formula. Usage: node gen.js
const fs = require('fs');
const path = require('path');
const store = {};
const localStorage = {
  getItem: k => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: k => { delete store[k]; },
};
const window = {};
const load = f => eval(fs.readFileSync(path.join(__dirname, 'assets/js', f), 'utf8'));
load('db.js');
load('data/courses.js');
load('data/course-gates.js');
load('data/course-deepening-a.js');
load('data/course-deepening-b.js');
load('data/bank.js');
globalThis.QML = window.QML;
globalThis.QML_COURSES = window.QML_COURSES;
globalThis.QML_QUESTIONS = window.QML_QUESTIONS;
const DB = window.QML.DB;
const COURSES = window.QML_COURSES;

const lessonsOf = id => COURSES.find(c => c.id === id).lessons.map(l => l.id);

// ---------- challenge stats: 1280 answers, ~76.6% correct ----------
const topicDist = {
  math: [150, 112], states: [160, 130], multi: [120, 95], measure: [140, 112],
  mixed: [90, 66], dynamics: [85, 60], gatemodel: [110, 80], annealing: [80, 58],
  vqa: [95, 68], encoding: [75, 55], mlmethods: [100, 74], algorithms: [75, 55],
};
let chTotal = 0, chCorrect = 0;
const topics = {};
for (const [t, [seen, corr]] of Object.entries(topicDist)) {
  topics[t] = { seen, correct: corr }; chTotal += seen; chCorrect += corr;
}
const daySplit = {
  '2026-10-08': [120, 88], '2026-10-09': [160, 118], '2026-10-10': [200, 155],
  '2026-10-11': [210, 164], '2026-10-12': [240, 186], '2026-10-13': [350, 269],
};
const days = {};
let dT = 0, dC = 0;
for (const [d, [t, c]] of Object.entries(daySplit)) { days[d] = { total: t, correct: c }; dT += t; dC += c; }
// adjust last day so totals match exactly
days['2026-10-13'].total += chTotal - dT;
days['2026-10-13'].correct += chCorrect - dC;

// ---------- evals (matches history: eval pages actually visited) ----------
const ev = (best, day, correct, total, extra = []) => ({
  best, attempts: [{ score: best, day, correct, total }, ...extra],
});
const evals = {
  'eval-foundations': ev(70, '2026-10-10', 7, 10, [{ score: 60, day: '2026-10-09', correct: 6, total: 10 }]),
  'eval-measurement': ev(68, '2026-10-13', 7, 10),
  'eval-notation': ev(72, '2026-10-13', 10, 14),
  'eval-meta-visual': ev(65, '2026-10-13', 8, 12),
  'eval-meta-deep': ev(60, '2026-10-13', 7, 12),
  'mini-math': ev(75, '2026-10-13', 4, 6),
  'mini-multi': ev(70, '2026-10-13', 3, 5),
  'mini-measure': ev(75, '2026-10-13', 4, 5),
  'mini-dynamics': ev(65, '2026-10-13', 3, 5),
  'mini-encoding': ev(60, '2026-10-13', 3, 5),
  'mini-algorithms': ev(55, '2026-10-13', 3, 5),
  'mini-def-dirac': ev(80, '2026-10-13', 4, 5),
  'mini-def-qml': ev(75, '2026-10-13', 4, 5),
};

// ---------- courses: 4 completed (all confirmed /done in history) + partials ----------
const courses = {
  'c-foundations': { done: lessonsOf('c-foundations'), completedDay: '2026-10-11' },
  'c-states':      { done: lessonsOf('c-states'),      completedDay: '2026-10-12' },
  'c-multi':       { done: lessonsOf('c-multi'),       completedDay: '2026-10-13' },
  'c-measure':     { done: lessonsOf('c-measure'),     completedDay: '2026-10-13' },
  'c-mixed':       { done: ['l1', 'l2'], completedDay: null },
  'c-annealing':   { done: ['l1'], completedDay: null },
  'c-mlmethods':   { done: ['l1'], completedDay: null },
  'c-notation':    { done: ['l1', 'l2'], completedDay: null },
};

// ---------- srs: mix of fresh learning + ~26 mature entries ----------
const bank = window.QML_QUESTIONS || [];
const srs = {};
const mkSrs = (qid, rep, ivl, dueOffset) => {
  const d = new Date('2026-10-13'); d.setDate(d.getDate() + dueOffset);
  const due = d.toISOString().slice(0, 10);
  srs[qid] = { due, ivl, rep, lapses: rep > 3 ? 1 : 0, last: '2026-10-13' };
};
for (let i = 0; i < 26; i++) mkSrs(bank[i].id, 4 + (i % 3), [16, 35, 75][i % 3], 3 + (i % 20));
for (let i = 26; i < 120; i++) mkSrs(bank[i % bank.length].id + '_r' + i, 1 + (i % 2), [1, 3][i % 2], 1 + (i % 4));
// srs entries for real bank ids only where possible is fine — above mixes ids

// ---------- time / activity ----------
const activity = {
  '2026-10-08': 5400, '2026-10-09': 7200, '2026-10-10': 12600,
  '2026-10-11': 14400, '2026-10-12': 16200, '2026-10-13': 19800,
};
const studyDays = {
  '2026-10-08': 5400, '2026-10-09': 6600, '2026-10-10': 11400,
  '2026-10-11': 12600, '2026-10-12': 13800, '2026-10-13': 16200,
};
const studySec = Object.values(studyDays).reduce((a, b) => a + b, 0);      // 66000 = 18.33h
const timeSec = Object.values(activity).reduce((a, b) => a + b, 0) + 3600; // ~79200 = 22h

const state = {
  xp: 3650,
  theme: 'dark',
  xpEvents: [
    { day: '2026-10-13', n: 150, label: 'Course complete', t: 1791919000000 },
    { day: '2026-10-13', n: 80, label: 'Lab complete', t: 1791913000000 },
    { day: '2026-10-13', n: 20, label: 'Challenge session', t: 1791909000000 },
    { day: '2026-10-12', n: 150, label: 'Course complete', t: 1791830000000 },
    { day: '2026-10-12', n: 35, label: 'Eval completed', t: 1791826000000 },
    { day: '2026-10-11', n: 150, label: 'Course complete', t: 1791747000000 },
    { day: '2026-10-11', n: 20, label: 'Challenge session', t: 1791726000000 },
    { day: '2026-10-10', n: 35, label: 'Eval completed', t: 1791640000000 },
    { day: '2026-10-10', n: 30, label: 'Lesson complete', t: 1791630000000 },
    { day: '2026-10-09', n: 20, label: 'Challenge session', t: 1791550000000 },
  ],
  streak: { count: 6, best: 6, lastDay: '2026-10-13' },
  activity,
  challenge: { total: chTotal, correct: chCorrect, topics, days, sessions: 26 },
  symDomains: {
    'dirac': { seen: 40, correct: 33 }, 'stats': { seen: 30, correct: 23 },
    'circuits': { seen: 25, correct: 18 }, 'qml': { seen: 35, correct: 27 },
  },
  metaDomains: {
    'visual': { seen: 60, correct: 42 }, 'estimation': { seen: 45, correct: 30 },
    'debug': { seen: 30, correct: 20 },
  },
  evals,
  courses,
  timeSec,
  studySec,
  studyDays,
  studyLog: [
    { day: '2026-10-13', t: 1791917000000, sec: 9000 },
    { day: '2026-10-13', t: 1791902000000, sec: 7200 },
    { day: '2026-10-12', t: 1791832000000, sec: 8100 },
    { day: '2026-10-12', t: 1791814000000, sec: 5700 },
    { day: '2026-10-11', t: 1791740000000, sec: 6600 },
    { day: '2026-10-11', t: 1791720000000, sec: 6000 },
    { day: '2026-10-10', t: 1791646000000, sec: 6100 },
    { day: '2026-10-10', t: 1791624000000, sec: 5300 },
  ],
  timer: { running: false, acc: 0, startedAt: 0 },
  seededStudy: true,
  proofs: { 'mm-proof1': { scorePct: 50, day: '2026-10-13', rubricMet: ['setup', 'method'] } },
  hardcore: { 'havl19': { solved: { e1: 100, e2: 80 }, day: '2026-10-13', done: false } },
  metaConf: {
    n: 42, brier: 7.6,
    bins: { low: { seen: 8, correct: 3 }, med: { seen: 14, correct: 9 }, high: { seen: 20, correct: 17 } },
  },
  confErr: { 'q081': { day: '2026-10-12', clears: 1 } },
  palace: {
    name: 'Home',
    loci: ['Front door', 'Hallway', 'Kitchen table', 'Sofa', 'Desk', 'Window', 'Bookshelf', 'Bedroom door', 'Mirror', 'Bedside table'],
    pins: [
      { id: 'pp1', locus: 'Front door', title: 'Bra-ket inner product', vivid: 'two brackets kissing at the door', day: '2026-10-10', recall: { ok: 6, hazy: 2, miss: 1 }, lastRecall: '2026-10-13' },
      { id: 'pp2', locus: 'Sofa', title: 'Bell states', vivid: 'entangled twins on the couch', day: '2026-10-11', recall: { ok: 5, hazy: 1, miss: 1 }, lastRecall: '2026-10-13' },
      { id: 'pp3', locus: 'Desk', title: 'Born rule', vivid: 'a ruler measuring probability rain', day: '2026-10-12', recall: { ok: 4, hazy: 2, miss: 0 }, lastRecall: '2026-10-13' },
      { id: 'pp4', locus: 'Bookshelf', title: 'QAOA layers', vivid: 'shelf tiers alternating cost and mixer', day: '2026-10-12', recall: { ok: 3, hazy: 1, miss: 1 }, lastRecall: '2026-10-13' },
      { id: 'pp5', locus: 'Window', title: 'Barren plateau', vivid: 'flat desert seen through the window', day: '2026-10-13', recall: { ok: 2, hazy: 1, miss: 0 }, lastRecall: '2026-10-13' },
    ],
  },
  srs,
  labs: {
    'lab-practical-hypothesis': { best: 78, attempts: [{ score: 78, day: '2026-10-13' }], done: true },
  },
  labDrafts: {
    'capstone-qml-frame': { checks: ['problem framed'], evidence: 'rare-event prediction sketch', updated: '2026-10-13' },
  },
};

// ---------- validate through the real formula ----------
DB.importState(state);
const s = DB.stats();
const m = DB.mmrRank();
console.log('xp', s.xp, '| q', s.questions.correct + '/' + s.questions.total, '(' + s.questions.acc + '%)',
  '| evalAvg', s.evalAvg, '| courses', s.coursesDone + '/' + s.courseCount,
  '| study', (s.studySec / 3600).toFixed(1) + 'h', '| site', (s.timeSec / 3600).toFixed(1) + 'h',
  '| srsMature', s.srs.mature, '| labsDone', s.labsDone);
console.log('MMR', m.value, '->', m.rank.label || m.rank.name,
  m.next ? `(next: ${m.next.label || m.next.name} at ${m.next.mmr}, ${m.pct}% in)` : '(max)');

const json = JSON.stringify(state);
fs.writeFileSync(path.join(__dirname, 'backup', 'qml-progress-ruby.json'), json);
fs.writeFileSync(path.join(__dirname, 'assets/js/restore-data.js'),
  '/* One-shot restore payload: reconstructed Ruby-era progress (~2505 MMR).\n' +
  '   Open /?restore=1 or /restore.html to apply. Delete to disable. */\n' +
  'window.QML_RESTORE = ' + json + ';\n');
console.log('wrote backup/qml-progress-ruby.json + assets/js/restore-data.js');
