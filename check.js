// Sanity check: syntax-check every JS file, then validate data schemas.
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = __dirname;
const files = [];
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (f.endsWith('.js')) files.push(p);
  }
})(path.join(root, 'assets'));

let bad = 0;
for (const f of files) {
  try { execSync(`node --check "${f}"`, { stdio: 'pipe' }); }
  catch (e) { bad++; console.log('SYNTAX FAIL:', f, '\n', e.stderr.toString().slice(0, 600)); }
}
console.log(`checked ${files.length} files, ${bad} syntax errors`);

// schema validation
const window = {};
const load = f => eval(fs.readFileSync(path.join(root, 'assets/js/data', f), 'utf8'));
load('bank.js'); load('definitions.js'); load('meta.js'); load('evals.js'); load('courses.js');
load('practical.js'); load('eval-practical.js'); load('course-gates.js'); load('course-deepening-a.js'); load('course-deepening-b.js');
load('equations.js'); load('hardcore.js'); load('visuals.js'); load('symdetail.js');
const TOPICS = ['math','states','multi','measure','mixed','dynamics','gatemodel','annealing','vqa','encoding','mlmethods','algorithms','symbols','meta','practical'];
const issues = [];

const bankIds = new Set((window.QML_QUESTIONS || [])
  .concat(window.QML_DEF_QUESTIONS || [], window.QML_META_QUESTIONS || [], window.QML_EQ_QUESTIONS || [], window.QML_PRACTICAL_BANK || []).map(q => q.id));
const VIZ_TYPES = ['bloch','bars','amps','circuit','matrix','curve','heat','flow','tex'];
const SCENES = ['bloch','landscape','spins','entangle','encode','fourier','grover','measure',
  'state','gate','cnot','pair','matrix','complex','levels','overlap','winding','outer',
  'sum','evolve','dims','norm','bars','swap','decay','dataset'];
const qOK = q => {
  if (q.ref) return bankIds.has(q.ref);
  if (!q.prompt) return false;
  switch (q.kind || 'mcq') {
    case 'mcq':  return Array.isArray(q.options) && q.options.length === 4 &&
      Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4 && !!q.explain;
    case 'match': return Array.isArray(q.pairs) && q.pairs.length >= 2 &&
      q.pairs.every(p => Array.isArray(p) && p.length === 2 && p[0] && p[1]);
    case 'order': return Array.isArray(q.items) && q.items.length >= 2;
    case 'fill':  return Array.isArray(q.answers) && q.answers.length >= 1;
    case 'proof': return Array.isArray(q.rubric) && q.rubric.length >= 2;
    default: return false;
  }
};

(window.QML_QUESTIONS || []).forEach(q => {
  if (!qOK(q)) issues.push(`bank ${q.id}: malformed`);
  if (!TOPICS.includes(q.topic)) issues.push(`bank ${q.id}: bad topic ${q.topic}`);
});
const practicalIds = new Set();
(window.QML_PRACTICAL_BANK || []).forEach(q => {
  if (!qOK(q)) issues.push(`practical bank ${q.id}: malformed`);
  if (q.topic !== 'practical') issues.push(`practical bank ${q.id}: bad topic ${q.topic}`);
  if (practicalIds.has(q.id)) issues.push(`practical bank dup id ${q.id}`);
  practicalIds.add(q.id);
});
(window.QML_PRACTICAL_LABS || []).forEach(l => {
  if (!l.id || !l.title || !Array.isArray(l.instructions) || !Array.isArray(l.acceptanceChecklist))
    issues.push(`practical lab ${l.id || '?'}: malformed`);
  const pts = (l.acceptanceChecklist || []).reduce((n, c) => n + (Number(c.points) || 0), 0);
  if (l.scoring && pts !== l.scoring.maxPoints) issues.push(`practical lab ${l.id}: checklist points ${pts} != rubric max ${l.scoring.maxPoints}`);
  if ((l.prerequisites || []).some(r => typeof r !== 'string' || !/^#\/(course|eval)\/[a-z0-9/_-]+$/i.test(r)))
    issues.push(`practical lab ${l.id}: invalid prerequisite route`);
});
/* definitions bank: same mcq schema + required domain field */
const defIds = new Set();
(window.QML_DEF_QUESTIONS || []).forEach(q => {
  if (!qOK(q)) issues.push(`defs ${q.id}: malformed`);
  if (q.topic !== 'symbols') issues.push(`defs ${q.id}: bad topic ${q.topic}`);
  if (!TOPICS.includes(q.domain)) issues.push(`defs ${q.id}: bad domain ${q.domain}`);
  if (defIds.has(q.id)) issues.push(`defs dup id ${q.id}`);
  defIds.add(q.id);
});
/* glossary: required fields + valid domain */
const glossIds = new Set();
(window.QML_SYMBOLS || []).forEach(s => {
  if (!s.sym || !s.name || !s.desc) issues.push(`glossary ${s.sym || '?'}: malformed`);
  if (!TOPICS.includes(s.topic)) issues.push(`glossary ${s.sym}: bad topic ${s.topic}`);
  const key = s.sym + '|' + s.topic;
  if (glossIds.has(key)) issues.push(`glossary dup ${key}`);
  glossIds.add(key);
});
/* every glossary entry should produce at least its symbol→name drill */
const glossCovered = new Set((window.QML_DEF_QUESTIONS || [])
  .filter(q => q.id.startsWith('dn')).map(q => q.id));
const glossCount = (window.QML_SYMBOLS || []).length;
if (glossCovered.size < glossCount) issues.push(`glossary coverage ${glossCovered.size}/${glossCount}`);
/* and every symbol should have a popup detail with a valid scene */
(window.QML_SYMBOLS || []).forEach(s => {
  const d = (window.QML_SYM_DETAIL || {})[s.sym + '|' + s.topic];
  if (!d) return issues.push(`symdetail missing ${s.sym}|${s.topic}`);
  if (!d.use || !d.example) issues.push(`symdetail ${s.sym}: missing use/example`);
  if (!d.scene || !SCENES.includes(d.scene.name)) issues.push(`symdetail ${s.sym}: bad scene ${d.scene && d.scene.name}`);
});
/* meta bank: mcq schema + domain + at least one visual element,
   or a supported interactive kind */
const IX_KINDS = ['blochset', 'gateseq', 'predict', 'selfexp'];
const metaIds = new Set();
(window.QML_META_QUESTIONS || []).forEach(q => {
  const kind = q.kind || 'mcq';
  if (IX_KINDS.includes(kind)) {
    if (!q.prompt) issues.push(`meta ${q.id}: no prompt`);
    if (kind === 'blochset' && !q.target) issues.push(`meta ${q.id}: no target`);
    if (kind === 'gateseq' && !(q.start && q.target)) issues.push(`meta ${q.id}: gateseq needs start+target`);
    if (kind === 'predict' && !(Array.isArray(q.probs) && q.probs.length >= 2)) issues.push(`meta ${q.id}: predict needs probs`);
    if (kind === 'selfexp' && !q.model) issues.push(`meta ${q.id}: selfexp needs model`);
  } else if (!qOK(q)) issues.push(`meta ${q.id}: malformed`);
  if (q.topic !== 'meta') issues.push(`meta ${q.id}: bad topic ${q.topic}`);
  if (!TOPICS.includes(q.domain)) issues.push(`meta ${q.id}: bad domain ${q.domain}`);
  const vizOK = (q.viz && VIZ_TYPES.includes(q.viz.type))
    || (Array.isArray(q.vizOptions) && q.vizOptions.length === 4 && q.vizOptions.every(v => v && VIZ_TYPES.includes(v.type)));
  if (!vizOK && kind === 'mcq' && !q.conf) issues.push(`meta ${q.id}: no valid viz`);
  if (metaIds.has(q.id)) issues.push(`meta dup id ${q.id}`);
  metaIds.add(q.id);
});

/* equation drills: generated MCQs must satisfy the bank schema */
const eqIds = new Set();
(window.QML_EQ_QUESTIONS || []).forEach(q => {
  if (!qOK(q)) issues.push(`eq ${q.id}: malformed`);
  if (!TOPICS.includes(q.topic)) issues.push(`eq ${q.id}: bad topic ${q.topic}`);
  if (eqIds.has(q.id)) issues.push(`eq dup ${q.id}`);
  eqIds.add(q.id);
});
if ((window.QML_EQ_QUESTIONS || []).length < (window.QML_EQUATIONS || []).length)
  issues.push('equation coverage < 100%');

/* hardcore subjects */
const HC_KINDS = ['mcq', 'value'];
const hcIds = new Set();
(window.QML_HARDCORE || []).forEach(s => {
  if (!s.id || !s.title || !s.arxiv || !Array.isArray(s.summary) || !Array.isArray(s.exercises) || !s.exercises.length)
    return issues.push(`hardcore ${s.id || '?'}: malformed`);
  if (hcIds.has(s.id)) issues.push(`hardcore dup ${s.id}`);
  hcIds.add(s.id);
  const exIds = new Set();
  s.exercises.forEach(e => {
    if (!e.id || !e.prompt || !HC_KINDS.includes(e.kind)) return issues.push(`hardcore ${s.id}/${e.id || '?'}: malformed`);
    if (exIds.has(e.id)) issues.push(`hardcore ${s.id} dup ex ${e.id}`);
    exIds.add(e.id);
    if (e.kind === 'mcq' && !(Array.isArray(e.options) && e.options.length === 4 && Number.isInteger(e.answer) && e.answer >= 0 && e.answer < 4))
      issues.push(`hardcore ${s.id}/${e.id}: bad mcq`);
    if (e.kind === 'value' && !(typeof e.value === 'number' && e.tol > 0))
      issues.push(`hardcore ${s.id}/${e.id}: bad value`);
  });
});

/* visuals gallery */
const vzIds = new Set();
(window.QML_VISUALS || []).forEach(v => {
  if (!v.id || !v.name || !v.tex || !v.scene || !SCENES.includes(v.scene.name))
    return issues.push(`visual ${v.id || '?'}: malformed or bad scene`);
  if (!v.intuition || !v.why || !v.useCase) issues.push(`visual ${v.id}: missing explanation fields`);
  if (!v.challenge || !Array.isArray(v.challenge.options) || v.challenge.options.length !== 4
      || !Number.isInteger(v.challenge.answer)) issues.push(`visual ${v.id}: bad challenge`);
  if (vzIds.has(v.id)) issues.push(`visual dup ${v.id}`);
  vzIds.add(v.id);
});
(window.QML_EVALS || []).forEach(e => {
  if (!e.id || !e.title || !Array.isArray(e.themes) || !Array.isArray(e.questions)) return issues.push(`eval ${e.id}: malformed`);
  e.themes.forEach(t => { if (!TOPICS.includes(t)) issues.push(`eval ${e.id}: bad theme ${t}`); });
  e.questions.forEach(q => { if (!qOK(q)) issues.push(`eval ${e.id} q ${q.id || q.ref}: malformed`); });
});
const ids = new Set();
(window.QML_QUESTIONS || []).forEach(q => { if (ids.has(q.id)) issues.push(`dup id ${q.id}`); ids.add(q.id); });
const cov = {};
(window.QML_QUESTIONS || []).concat(window.QML_DEF_QUESTIONS || [], window.QML_META_QUESTIONS || [], window.QML_EQ_QUESTIONS || [], window.QML_PRACTICAL_BANK || []).forEach(q => cov[q.topic] = (cov[q.topic] || 0) + 1);
TOPICS.forEach(t => { if (!cov[t]) issues.push(`topic ${t} has 0 questions`); });

let lessons = 0, quizzes = 0;
const courseIds = new Set();
(window.QML_COURSES || []).forEach(c => {
  if (!c.id || !c.title || !Array.isArray(c.lessons)) return issues.push(`course ${c.id}: malformed`);
  if (courseIds.has(c.id)) issues.push(`duplicate course id ${c.id}`);
  courseIds.add(c.id);
  if (!TOPICS.includes(c.theme)) issues.push(`course ${c.id}: bad theme`);
  const lessonIds = new Set();
  c.lessons.forEach(l => {
    lessons++;
    if (!l.id || !l.title || !Array.isArray(l.sections)) issues.push(`${c.id}/${l.id}: malformed lesson`);
    if (lessonIds.has(l.id)) issues.push(`${c.id}: duplicate lesson id ${l.id}`);
    lessonIds.add(l.id);
    (l.sections || []).forEach(s => {
      if (!['text','points','symbols','flip','equation','quiz','predict','steps','reflect','explore'].includes(s.type)) issues.push(`${c.id}/${l.id}: bad section type ${s.type}`);
      if (s.type === 'quiz') { quizzes++; if (!s.question || !qOK(s.question)) issues.push(`${c.id}/${l.id}: bad quiz`); }
    });
  });
});

console.log(`bank=${(window.QML_QUESTIONS || []).length} defs=${(window.QML_DEF_QUESTIONS || []).length} gloss=${(window.QML_SYMBOLS || []).length} meta=${(window.QML_META_QUESTIONS || []).length} eq=${(window.QML_EQ_QUESTIONS || []).length} evals=${(window.QML_EVALS || []).length} (q=${(window.QML_EVALS || []).reduce((a, e) => a + (e.questions || []).length, 0)}) courses=${(window.QML_COURSES || []).length} lessons=${lessons} quizzes=${quizzes} hardcore=${(window.QML_HARDCORE || []).length} (ex=${(window.QML_HARDCORE || []).reduce((a, s) => a + s.exercises.length, 0)}) visuals=${(window.QML_VISUALS || []).length}`);
console.log('topic coverage:', cov);
if (issues.length) { console.log('ISSUES:'); issues.slice(0, 40).forEach(i => console.log(' -', i)); process.exit(1); }
console.log('ALL VALID');
