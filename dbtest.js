/* DB smoke test — localStorage stub + fake DOM-free eval of db.js */
const store = {};
global.localStorage = {
  getItem: k => store[k] || null,
  setItem: (k, v) => { store[k] = v; },
  removeItem: k => { delete store[k]; },
};
global.window = {};
global.QML = {};
global.QML_COURSES = [{ id: 'c1', lessons: [{}, {}, {}] }, { id: 'c2', lessons: [{}] }];
eval(require('fs').readFileSync('./assets/js/db.js', 'utf8'));
const DB = window.QML.DB;

let ok = 0, bad = 0;
const t = (n, c, x) => { if (c) { ok++; console.log('ok  ', n); } else { bad++; console.log('FAIL', n, x); } };

// seed: 6h studySec on fresh state
t('seeded 6h', DB.state().studySec === 21600, DB.state().studySec);
t('seed flag', DB.state().seededStudy === true);
// reload — no double-seed
eval(require('fs').readFileSync('./assets/js/db.js', 'utf8'));
t('no double seed', window.QML.DB.state().studySec === 21600);

// timer flow
DB.timerStart();
setTimeout(() => {
  DB.timerPause();
  const el = DB.timerElapsed();
  t('timer accrues', el >= 1, el);
  t('paused, not running', !DB.state().timer.running);
  DB.timerStart();
  t('resume running', DB.state().timer.running);
  const banked = DB.timerStop();
  t('stop banks', DB.state().studySec > 21600, DB.state().studySec);
  t('timer reset', DB.timerElapsed() === 0 && !DB.state().timer.running);
  t('activity today', (DB.state().activity[DB.today()] || 0) >= 1);

  // MMR
  const v = DB.mmr();
  const r = DB.mmrRank();
  console.log('  mmr =', v, '| rank =', r.rank.name, '| next =', r.next && r.next.name, '|', r.into + '/' + r.span);
  t('mmr > base', v > 200, v);
  t('rank silver+', r.rank.mmr >= 300, r.rank.name);
  t('pct 0-100', r.pct >= 0 && r.pct <= 100);

  // grade still works, rank consistent
  const g = DB.grade();
  t('grade rank == mmr rank', g.rank.id === r.rank.id);
  t('grade 0-100', g.score >= 0 && g.score <= 100);

  // simulate progress: lessons + answers + eval
  DB.completeLesson('c1', 0, 10); DB.completeLesson('c1', 1, 10); DB.completeLesson('c1', 2, 10);
  DB.markCourseComplete('c1');
  for (let i = 0; i < 40; i++) DB.recordAnswer('q' + i, 'math', i % 5 !== 0);
  DB.finishEval('e1', 82, 8, 10);
  const v2 = DB.mmr();
  console.log('  after progress mmr =', v2, '| rank =', DB.mmrRank().rank.name);
  t('mmr grew', v2 > v, `${v} -> ${v2}`);

  console.log(`--- ${ok} passed, ${bad} failed`);
  process.exit(bad ? 1 : 0);
}, 1100);
