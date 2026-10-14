// Probe: enumerate data catalogs (ids) like mmr.js does
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
load('data/evals.js');
load('data/eval-practical.js');
load('data/hardcore.js');
load('data/practical.js');
load('data/bank.js');
load('data/meta.js');

console.log('=== COURSES ===');
(window.QML_COURSES || []).forEach(c =>
  console.log(c.id, '| lessons:', (c.lessons || []).map(l => l.id).join(','), '|', (c.title || '').slice(0, 50)));

console.log('=== EVALS ===');
(window.QML_EVALS || []).forEach(e =>
  console.log(e.id, '| qs:', (e.questions || e.qs || []).length, '|', (e.title || '').slice(0, 50), '| keys:', Object.keys(e).join(',')));

console.log('=== HARDCORE ===');
(window.QML_HARDCORE || []).forEach(s =>
  console.log(s.id, '| exs:', (s.exercises || s.exs || []).map(x => x.id).join(','), '|', (s.title || '').slice(0, 50)));

console.log('=== LABS ===');
(window.QML_PRACTICAL_LABS || []).forEach(l => console.log(l.id, '|', (l.title || '').slice(0, 50)));

console.log('=== BANK ===');
const qs = window.QML_QUESTIONS || [];
const topics = {};
qs.forEach(q => { topics[q.topic] = (topics[q.topic] || 0) + 1; });
console.log('total questions:', qs.length, '| topics:', JSON.stringify(topics));
console.log('sample qids:', qs.slice(0, 5).map(q => q.id).join(','));

console.log('=== META ===');
console.log('meta questions:', (window.QML_META_QUESTIONS || []).length);

// find proof/rubric questions in evals
console.log('=== PROOF qs (rubric) ===');
(window.QML_EVALS || []).forEach(e => (e.questions || []).forEach(q => {
  if (q.rubric) console.log(e.id, '>', q.id, '| rubric items:', q.rubric.length);
}));
