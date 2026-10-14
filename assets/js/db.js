/* ============================================================
   QML.DB — localStorage persistence layer (the "local database").
   Owns: XP, streak, time tracking, challenge answers, eval grades,
   course progress, composite QML grade + rank.

   All views MUST go through these methods — never touch
   localStorage directly.
   ============================================================ */
(function () {
  const KEY = 'qml-academy-v1';

  const TOPICS = [
    { id: 'math',       name: 'Math Foundations' },
    { id: 'states',     name: 'Quantum States' },
    { id: 'multi',      name: 'Multi-Qubit & Entanglement' },
    { id: 'measure',    name: 'Measurement' },
    { id: 'mixed',      name: 'Mixed States & Open Systems' },
    { id: 'dynamics',   name: 'Dynamics & Many-Body' },
    { id: 'gatemodel',  name: 'Gate-Model QC' },
    { id: 'annealing',  name: 'Adiabatic & Annealing' },
    { id: 'vqa',        name: 'Variational Algorithms' },
    { id: 'encoding',   name: 'Data Encoding' },
    { id: 'mlmethods',  name: 'QML Methods' },
    { id: 'algorithms', name: 'QFT / HHL / Linear Algebra' },
    { id: 'symbols',    name: 'Notation & Symbols' },
    { id: 'meta',       name: 'Meta & Visual' },
    { id: 'practical',  name: 'Practical Center' },
    { id: 'applied',    name: 'Applied Mechanics' },
  ];

  /* Rank bands are MMR thresholds — see mmrRank(). Each tier holds three
     divisions (I → II → III) carved as thirds of its band, so 12 tiers
     give 36 ladder steps. Tesla is deliberately brutal: PhD-quantum
     level. It demands proof work, hardcore derivations, eval excellence,
     full courses and long focused hours — grinding easy drills plateaus
     hard under the new soft-cap formula. */
  const RANKS = [
    { id: 'initiate',    name: 'Initiate',    mmr: 0,    color: '#8b93a1' },
    { id: 'bronze',      name: 'Bronze',      mmr: 120,  color: '#c98d5e' },
    { id: 'silver',      name: 'Silver',      mmr: 300,  color: '#c9ced6' },
    { id: 'gold',        name: 'Gold',        mmr: 550,  color: '#f2c94c' },
    { id: 'platinum',    name: 'Platinum',    mmr: 850,  color: '#a8e6f0' },
    { id: 'diamond',     name: 'Diamond',     mmr: 1250, color: '#7cd4f7' },
    { id: 'emerald',     name: 'Emerald',     mmr: 1700, color: '#4ade80' },
    { id: 'ruby',        name: 'Ruby',        mmr: 2200, color: '#ff6b7a' },
    { id: 'master',      name: 'Master',      mmr: 2800, color: '#b78cff' },
    { id: 'grandmaster', name: 'Grandmaster', mmr: 3600, color: '#ff7ab8' },
    { id: 'sage',        name: 'Sage',        mmr: 4600, color: '#94d2bd' },
    { id: 'tesla',       name: 'Tesla',       mmr: 5800, color: '#ffffff' },
  ];
  const LAST_BAND_SPAN = 1200;               // width used to subdivide Tesla
  const ROMAN = ['I', 'II', 'III'];

  /* Expand a tier into its three divisions:
     sub 1 spans [tier.mmr, +span/3), sub 2 [+span/3, +2span/3), sub 3 rest. */
  function subRanks(tierIdx) {
    const tier = RANKS[tierIdx];
    const hi = RANKS[tierIdx + 1] ? RANKS[tierIdx + 1].mmr : tier.mmr + LAST_BAND_SPAN;
    const span = hi - tier.mmr;
    return ROMAN.map((r, i) => ({
      id: tier.id, name: tier.name, color: tier.color,
      sub: i + 1, label: tier.name + ' ' + r,
      mmr: Math.round(tier.mmr + span * i / 3),
      span: Math.round(span / 3),
    }));
  }
  /* The whole ladder, flattened — every division I/II/III in order. */
  function ladder() { return RANKS.flatMap((t, i) => subRanks(i)); }

  const DEFAULT = () => ({
    xp: 0,
    theme: 'dark',
    xpEvents: [],               // {day, n, label} — recent rewards feed
    streak: { count: 0, best: 0, lastDay: null },
    activity: {},               // 'YYYY-MM-DD' -> seconds on site
    challenge: {
      total: 0, correct: 0,
      topics: {},               // topicId -> {seen, correct}
      days: {},                 // 'YYYY-MM-DD' -> {total, correct}
      sessions: 0,
    },
    symDomains: {},             // glossary domain id -> {seen, correct} (Definitions drills)
    metaDomains: {},            // domain id -> {seen, correct} (Meta-Challenges drills)
    evals: {},                  // evalId -> {best, attempts:[{score, day, correct, total}]}
    courses: {},                // courseId -> {done: [lessonId], completedDay}
    timeSec: 0,
    studySec: 0,                // focused-study seconds logged via the manual timer
    studyDays: {},              // 'YYYY-MM-DD' -> focused seconds banked that day
    studyLog: [],               // recent sessions: {day, t, sec}
    timer: { running: false, acc: 0, startedAt: 0 },   // persists across views/reloads
    seededStudy: false,         // one-time seeding flag
    proofs: {},                 // problemId -> {scorePct, day, rubricMet}
    hardcore: {},               // subId -> {solved:{exId:scorePct}, day, done}
    metaConf: { n: 0, brier: 0, // confidence calibration running stats
                bins: { low: { seen: 0, correct: 0 }, med: { seen: 0, correct: 0 }, high: { seen: 0, correct: 0 } } },
    confErr: {},                // qid -> {day, clears} — high-confidence misses pending retest
    palace: {
      name: 'Home',
      loci: ['Front door', 'Hallway', 'Kitchen table', 'Sofa', 'Desk',
             'Window', 'Bookshelf', 'Bedroom door', 'Mirror', 'Bedside table'],
      pins: [],                 // {id, locus, title, vivid, day, recall:{ok,hazy,miss}}
    },
    srs: {},                    // qid -> {due:'YYYY-MM-DD', ivl:days, rep, lapses, last}
    labs: {},                   // labId -> {best, attempts:[{score,day}], done}
    labDrafts: {},              // labId -> local checklist/evidence draft
    applied: { total: 0, correct: 0 },   // Applied Mechanics grind — top MMR per answer
  });

  let S = DEFAULT();

  function today() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  function yesterday() {
    const d = new Date(); d.setDate(d.getDate() - 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function load() {
    let parsed = false;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) { S = Object.assign(DEFAULT(), JSON.parse(raw)); parsed = true; }
    } catch (e) { S = DEFAULT(); }
    /* main key missing/corrupt but snapshots exist → resurrect newest */
    try {
      if (!parsed) {
        const snaps = snapshots();
        for (const d of snaps) {
          const snap = loadSnapshot(d);
          if (snap) { S = Object.assign(DEFAULT(), snap); break; }
        }
      }
    } catch (e) {}
    // one-time seed: prior study time before the site existed
    if (!S.seededStudy) { S.studySec += 6 * 3600; S.seededStudy = true; save(); }
    if (!S.timer || typeof S.timer !== 'object') S.timer = { running: false, acc: 0, startedAt: 0 };
    if (!S.metaConf || typeof S.metaConf !== 'object') S.metaConf = DEFAULT().metaConf;
    if (!S.confErr || typeof S.confErr !== 'object') S.confErr = {};
    if (!S.hardcore || typeof S.hardcore !== 'object') S.hardcore = {};
    if (!S.srs || typeof S.srs !== 'object') S.srs = {};
    if (!S.labs || typeof S.labs !== 'object') S.labs = {};
    if (!S.labDrafts || typeof S.labDrafts !== 'object') S.labDrafts = {};
    if (!S.applied || typeof S.applied !== 'object') S.applied = { total: 0, correct: 0 };
    return S;
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
    snapshot();
  }

  /* Shadow backups: once per day, mirror the full state into a dated
     snapshot key, keeping the 7 newest. If the main key is ever wiped
     or corrupted, snapshots survive independently. */
  function snapshot() {
    try {
      const key = KEY + '-snap-' + today();
      if (localStorage.getItem(key)) return;               // one per day
      localStorage.setItem(key, JSON.stringify(S));
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.indexOf(KEY + '-snap-') === 0) keys.push(k);
      }
      keys.sort();
      while (keys.length > 7) { localStorage.removeItem(keys.shift()); }
    } catch (e) {}
  }
  function snapshots() {
    const out = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.indexOf(KEY + '-snap-') === 0) out.push(k.slice((KEY + '-snap-').length));
      }
    } catch (e) {}
    return out.sort().reverse();                           // newest first
  }
  function loadSnapshot(day) {
    try {
      const raw = localStorage.getItem(KEY + '-snap-' + day);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  /* ---- activity time ---- */
  function noteTime(sec) {
    const d = today();
    S.timeSec += sec;
    S.activity[d] = (S.activity[d] || 0) + sec;
    save();
  }

  /* ---- streak: call on any meaningful action ---- */
  function touchStreak() {
    const d = today();
    if (S.streak.lastDay === d) return;
    S.streak.count = (S.streak.lastDay === yesterday()) ? S.streak.count + 1 : 1;
    S.streak.lastDay = d;
    S.streak.best = Math.max(S.streak.best, S.streak.count);
    save();
  }

  /* ---- XP ---- */
  function addXP(n, label) {
    S.xp += n;
    S.xpEvents.unshift({ day: today(), n, label, t: Date.now() });
    S.xpEvents = S.xpEvents.slice(0, 30);
    save();
    if (window.QML && QML.ui) QML.ui.toast(`+${n} XP — ${label}`, 'spark');
  }

  /* ---- challenges ---- */
  function recordAnswer(questionId, topic, correct) {
    const d = today();
    S.challenge.total++;
    S.challenge.days[d] = S.challenge.days[d] || { total: 0, correct: 0 };
    S.challenge.days[d].total++;
    if (correct) { S.challenge.correct++; S.challenge.days[d].correct++; }
    const t = S.challenge.topics[topic] = S.challenge.topics[topic] || { seen: 0, correct: 0 };
    t.seen++; if (correct) t.correct++;
    if (topic === 'applied') {
      if (!S.applied) S.applied = { total: 0, correct: 0 };
      S.applied.total++; if (correct) S.applied.correct++;
    }
    srsReview(questionId, correct);
    touchStreak();
    save();
  }

  /* ---- fixed-step spaced retrieval schedule ----
     Every answered question joins a review queue. Misses return tomorrow;
     consecutive recalls advance through wider intervals (1, 3, 7, 16, 35,
     then 75 days). This is a simple heuristic, not a fitted memory model. */
  const SRS_STEPS = [1, 3, 7, 16, 35, 75];
  function plusDays(n) {
    const d = new Date(); d.setDate(d.getDate() + n);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  function srsReview(qid, ok) {
    if (!qid) return;
    if (!S.srs || typeof S.srs !== 'object') S.srs = {};
    const e = S.srs[qid] = S.srs[qid] || { due: null, ivl: 0, rep: 0, lapses: 0 };
    e.last = today();
    if (ok) {
      e.rep++;
      e.ivl = SRS_STEPS[Math.min(e.rep - 1, SRS_STEPS.length - 1)];
      e.due = plusDays(e.ivl);
    } else {
      e.lapses++;
      e.rep = 0;
      e.ivl = 0;
      e.due = plusDays(1);
    }
  }
  /* questions due for review, most overdue / most-lapsed first */
  function srsDue() {
    if (!S.srs) return [];
    const t = today();
    return Object.entries(S.srs)
      .filter(([, e]) => e.due && e.due <= t)
      .sort((a, b) => (a[1].due < b[1].due ? -1 : a[1].due > b[1].due ? 1 : b[1].lapses - a[1].lapses))
      .map(([qid]) => qid);
  }
  function srsStats() {
    const t = today();
    let due = 0, learning = 0, mature = 0;
    Object.values(S.srs || {}).forEach(e => {
      if (e.due && e.due <= t) due++;
      if (e.ivl >= 16) mature++; else learning++;
    });
    return { due, learning, mature, total: Object.keys(S.srs || {}).length };
  }
  /* forget a question's schedule (e.g. mastered) */
  function srsDrop(qid) { if (S.srs) delete S.srs[qid]; save(); }

  /* ---- practical labs (Practical Center) ---- */
  function saveLabDraft(labId, draft) {
    if (!labId || !draft || typeof draft !== 'object') return false;
    S.labDrafts[labId] = {
      checks: Array.isArray(draft.checks) ? draft.checks.filter(x => typeof x === 'string').slice(0, 100) : [],
      evidence: typeof draft.evidence === 'string' ? draft.evidence.slice(0, 12000) : '',
      updated: today(),
    };
    save();
    return true;
  }
  function labDraft(labId) { return S.labDrafts[labId] || { checks: [], evidence: '', updated: null }; }
  function finishLab(labId, scorePct) {
    const score = Math.max(0, Math.min(100, Math.round(Number(scorePct) || 0)));
    const l = S.labs[labId] = S.labs[labId] || { best: 0, attempts: [], done: false };
    l.attempts.push({ score, day: today() });
    l.best = Math.max(l.best, score);
    if (!l.done && score >= 70) { l.done = true; addXP(80, 'Lab complete'); }
    touchStreak();
    save();
  }
  function labBest(labId) { const l = S.labs[labId]; return l ? l.best : null; }
  function labDone(labId) { const l = S.labs[labId]; return !!(l && l.done); }

  /* Per-domain accuracy for Definitions / Meta drills — companion to
     recordAnswer (which owns totals/streak). Call it right after.
     bucket: 'symDomains' | 'metaDomains' */
  function recordDomainStat(bucket, domain, correct) {
    const B = S[bucket] = S[bucket] || {};
    const t = B[domain] = B[domain] || { seen: 0, correct: 0 };
    t.seen++; if (correct) t.correct++;
    save();
  }
  const recordSymDomain = (domain, correct) => recordDomainStat('symDomains', domain, correct);
  const recordMetaDomain = (domain, correct) => recordDomainStat('metaDomains', domain, correct);

  /* Weakest topics first for adaptive challenge selection.
     Returns topic ids sorted ascending by accuracy (unseen topics score 0.5). */
  function weakTopics() {
    return TOPICS.map(t => {
      const s = S.challenge.topics[t.id];
      const acc = s && s.seen >= 2 ? s.correct / s.seen : 0.5;
      return { id: t.id, acc, seen: s ? s.seen : 0 };
    }).sort((a, b) => a.acc - b.acc || b.seen - a.seen).map(x => x.id);
  }

  /* ---- evals ---- */
  function finishEval(evalId, scorePct, correct, total) {
    const e = S.evals[evalId] = S.evals[evalId] || { best: 0, attempts: [] };
    e.attempts.push({ score: Math.round(scorePct), day: today(), correct, total });
    e.best = Math.max(e.best, Math.round(scorePct));
    touchStreak();
    save();
  }
  function evalBest(evalId) { const e = S.evals[evalId]; return e ? e.best : null; }

  /* ---- courses ---- */
  function completeLesson(courseId, lessonId, xpReward) {
    const c = S.courses[courseId] = S.courses[courseId] || { done: [], completedDay: null };
    if (c.done.includes(lessonId)) return false;
    c.done.push(lessonId);
    touchStreak();
    save();
    if (xpReward) addXP(xpReward, 'Lesson complete');
    return true;
  }
  function isLessonDone(courseId, lessonId) {
    const c = S.courses[courseId];
    return !!(c && c.done.includes(lessonId));
  }
  function courseProgress(courseId, totalLessons) {
    const c = S.courses[courseId];
    const done = c ? c.done.length : 0;
    return { done, total: totalLessons, pct: totalLessons ? Math.round(done / totalLessons * 100) : 0 };
  }
  function markCourseComplete(courseId) {
    const c = S.courses[courseId] = S.courses[courseId] || { done: [], completedDay: null };
    if (!c.completedDay) { c.completedDay = today(); addXP(150, 'Course complete'); save(); }
  }

  /* ---- focused-study timer ----
     elapsed() counts paused accrued seconds + live segment while running.
     timerStop() banks the elapsed time into studySec + today's activity. */
  function timerElapsed() {
    const t = S.timer;
    return Math.round(t.acc + (t.running ? Math.max(0, (Date.now() - t.startedAt) / 1000) : 0));
  }
  function timerStart() {
    if (S.timer.running) return;
    S.timer.running = true; S.timer.startedAt = Date.now(); save();
  }
  function timerPause() {
    if (!S.timer.running) return;
    S.timer.acc += (Date.now() - S.timer.startedAt) / 1000;
    S.timer.running = false; save();
  }
  function timerStop() {
    const el = timerElapsed();
    S.timer = { running: false, acc: 0, startedAt: 0 };
    if (el >= 1) {
      const d = today();
      S.studySec += el;
      S.studyDays[d] = (S.studyDays[d] || 0) + el;
      S.studyLog.unshift({ day: d, t: Date.now(), sec: el });
      S.studyLog = S.studyLog.slice(0, 30);
      S.activity[d] = (S.activity[d] || 0) + el;
      touchStreak();
    }
    save();
    return el;
  }

  /* ---- memory palace (method of loci) ----
     Pins bind a concept to a location in the user's familiar route;
     recall walks revisit pins and track self-graded retrieval. */
  function pinPalace(pin) {
    pin.id = 'p' + Date.now().toString(36) + Math.floor(Math.random() * 1e4);
    pin.day = pin.day || today();
    pin.recall = { ok: 0, hazy: 0, miss: 0 };
    S.palace.pins.push(pin);
    touchStreak(); save();
    return pin;
  }
  function unpinPalace(id) {
    S.palace.pins = S.palace.pins.filter(p => p.id !== id); save();
  }
  function recallPin(id, verdict) {   // 'ok' | 'hazy' | 'miss'
    const p = S.palace.pins.find(x => x.id === id);
    if (!p) return;
    p.recall[verdict] = (p.recall[verdict] || 0) + 1;
    p.lastRecall = today();
    save();
  }
  function palacePins() { return S.palace.pins.slice(); }
  function setLoci(loci) { S.palace.loci = loci.filter(Boolean); save(); }

  /* ---- proof / research-tier problems (self-scored against a rubric) ---- */
  function recordProof(id, scorePct, rubricMet) {
    S.proofs[id] = { scorePct, day: today(), rubricMet };
    touchStreak(); save();
  }

  /* ---- hardcore paper subjects ----
     Each exercise records its best score; a subject is "done" when
     every exercise is solved. Both feed MMR. */
  function recordHardcore(subId, exId, scorePct) {
    const h = S.hardcore[subId] = S.hardcore[subId] || { solved: {}, day: null, done: false };
    const prev = h.solved[exId] || 0;
    if (scorePct > prev) h.solved[exId] = scorePct;
    h.day = today();
    touchStreak(); save();
  }
  function hardcoreSolved(subId) {
    const h = S.hardcore[subId];
    return h ? h.solved : {};
  }
  function markHardcoreDone(subId) {
    const h = S.hardcore[subId] = S.hardcore[subId] || { solved: {}, day: null, done: false };
    if (!h.done) { h.done = true; save(); }
  }
  function hardcoreTotals() {
    let solved = 0, done = 0;
    Object.keys(S.hardcore).forEach(k => {
      solved += Object.keys(S.hardcore[k].solved || {}).length;
      if (S.hardcore[k].done) done++;
    });
    return { solved, done };
  }

  /* ---- confidence calibration (metacognitive monitoring) ----
     conf: 0-100 self-reported certainty; ok: was the answer right.
     Brier score = mean (conf/100 - outcome)^2 — lower is better
     calibrated. High-confidence misses join the retest queue. */
  function recordConfidence(qid, conf, ok) {
    conf = Math.max(0, Math.min(100, conf));
    const b = ok ? 1 : 0;
    const mc = S.metaConf = S.metaConf || DEFAULT().metaConf;
    mc.n++; mc.brier += Math.pow(conf / 100 - b, 2);
    const bin = conf >= 67 ? 'high' : conf >= 34 ? 'med' : 'low';
    mc.bins[bin].seen++; if (ok) mc.bins[bin].correct++;
    if (conf >= 80 && !ok && qid) {
      S.confErr[qid] = { day: today(), clears: 0 };
    }
    save();
  }
  /* A queued confident-error got re-attempted: clears after two
     clean retrievals (hypercorrection protocol). */
  function recordConfRetest(qid, ok) {
    const e = S.confErr[qid];
    if (!e) return;
    if (ok) { e.clears = (e.clears || 0) + 1; if (e.clears >= 2) delete S.confErr[qid]; }
    else e.clears = 0;
    save();
  }
  function confQueue() { return Object.keys(S.confErr); }
  function calibration() {
    const mc = S.metaConf;
    return mc && mc.n ? { n: mc.n, brier: mc.brier / mc.n, bins: mc.bins } : null;
  }

  /* ---- aggregates ---- */
  function stats(courseCount) {
    const ch = S.challenge;
    const acc = ch.total ? Math.round(ch.correct / ch.total * 100) : 0;
    const evals = Object.values(S.evals).map(e => e.best);
    const evalAvg = evals.length ? Math.round(evals.reduce((a, b) => a + b, 0) / evals.length) : 0;
    let coursesDone = 0;
    if (window.QML_COURSES) {
      for (const c of QML_COURSES) {
        const p = courseProgress(c.id, c.lessons.length);
        if (p.pct === 100) coursesDone++;
      }
    }
    return {
      xp: S.xp,
      streak: S.streak.count,
      bestStreak: S.streak.best,
      questions: { total: ch.total, correct: ch.correct, acc },
      evalAvg, evalCount: evals.length,
      coursesDone, courseCount: courseCount || (window.QML_COURSES ? QML_COURSES.length : 0),
      timeSec: S.timeSec,
      days: Object.keys(S.activity).length,
      topicAcc: TOPICS.map(t => {
        const s = ch.topics[t.id];
        return { id: t.id, name: t.name, seen: s ? s.seen : 0, correct: s ? s.correct : 0, acc: s && s.seen ? Math.round(s.correct / s.seen * 100) : null };
      }),
      activity: S.activity,
      xpEvents: S.xpEvents,
      sessions: ch.sessions,
      studySec: S.studySec,
      studyDays: S.studyDays,
      studyLog: S.studyLog,
      proofs: Object.keys(S.proofs).length,
      srs: srsStats(),
      labsDone: Object.values(S.labs).filter(l => l.done).length,
      proofAvg: (() => { const v = Object.values(S.proofs); return v.length ? Math.round(v.reduce((a, p) => a + p.scorePct, 0) / v.length) : null; })(),
      palacePins: S.palace.pins.length,
      palaceRecalls: S.palace.pins.reduce((a, p) => a + (p.recall.ok || 0) + (p.recall.hazy || 0) + (p.recall.miss || 0), 0),
      timer: { running: S.timer.running, elapsed: timerElapsed() },
      hardcore: hardcoreTotals(),
      calibration: calibration(),
      confQueue: confQueue().length,
      applied: {
        total: S.applied.total, correct: S.applied.correct,
        acc: S.applied.total ? Math.round(S.applied.correct / S.applied.total * 100) : null,
        mmr: Math.min(S.applied.correct * 12, 840), cap: 840,
      },
    };
  }

  /* Composite 0-100 grade: 40% eval avg, 30% challenge accuracy,
     20% course completion, 10% consistency (streak vs 14 days). */
  function grade() {
    const s = stats();
    const coursePct = s.courseCount ? s.coursesDone / s.courseCount * 100 : 0;
    const consist = Math.min(S.streak.count / 14, 1) * 100;
    const score = Math.round(s.evalAvg * 0.4 + s.questions.acc * 0.3 + coursePct * 0.2 + consist * 0.1);
    const m = mmrRank();
    return {
      score, rank: m.rank, next: m.next,
      breakdown: { evalAvg: s.evalAvg, challengeAcc: s.questions.acc, coursePct: Math.round(coursePct), consist: Math.round(consist) },
    };
  }

  /* Match-making-style rating — hardcore calibration, v2.
     Drills now hit a soft cap (asymptote ≈600 MMR) so challenge grinding
     alone can never buy Diamond+; misses cost up to 60% of drill gains.
     The real ladder is climbed through eval excellence (>55% only),
     proof problems, hardcore paper derivations, lessons and focused
     hours. Tesla ≈ having solved essentially everything. */
  function mmr() {
    const s = stats();
    const lessonsDone = Object.values(S.courses)
      .reduce((a, c) => a + (c && c.done ? c.done.length : 0), 0);
    const chGain = 600 * (1 - Math.exp(-s.questions.correct / 120));
    const missPen = Math.min((s.questions.total - s.questions.correct) * 3, chGain * 0.6);
    const evalPts = Object.values(S.evals)
      .reduce((a, e) => a + Math.max(0, (e && e.best ? e.best : 0) - 55) * 1.5, 0);
    const proofPts = Object.values(S.proofs)
      .reduce((a, p) => a + 150 * (p.scorePct || 0) / 100, 0);
    const hc = hardcoreTotals();
    const recalls = S.palace.pins
      .reduce((a, p) => a + (p.recall.ok || 0) + (p.recall.hazy || 0), 0);
    const calib = S.metaConf && S.metaConf.n
      ? Math.min(S.metaConf.n * (S.metaConf.brier / S.metaConf.n < 0.25 ? 2 : 1), 100)
      : 0;
    const v = 150                                     // base rating
      + chGain                                        // drills: soft-capped
      - missPen                                       // misses claw back gains
      + evalPts                                       // only excellence counts
      + proofPts                                      // research-tier problems
      + hc.solved * 70 + hc.done * 180                // hardcore derivations
      + lessonsDone * 8
      + s.coursesDone * 40
      + s.labsDone * 45                              // practical pipeline work
      + Math.min(s.srs.mature * 6, 180)              // long-interval retention
      + Math.min(recalls * 2, 80)                     // palace recall practice
      + calib                                         // confidence calibration work
      + Math.floor(s.studySec / 90)                   // ~1 MMR per 1.5 focused min
      + Math.floor(s.timeSec / 500)                   // + on-site time
      + Math.min(s.streak * 4, 80)
      + Math.min((S.applied && S.applied.correct || 0) * 12, 840);  // applied grind — richest per-answer source
    return Math.max(0, Math.round(v));
  }

  /* Current MMR + division. rank/next are ladder() entries
     ({id,name,sub,label,mmr,...}). Returns {value, rank, next, into, span, pct}. */
  function mmrRank() {
    const value = mmr();
    const lad = ladder();
    let rank = lad[0], next = null;
    for (let i = 0; i < lad.length; i++) {
      if (value >= lad[i].mmr) rank = lad[i];
      else { next = lad[i]; break; }
    }
    const span = next ? next.mmr - rank.mmr : 0;
    const into = next ? value - rank.mmr : 0;
    return { value, rank, next, into, span, pct: next ? Math.round(into / span * 100) : 100 };
  }

  function setTheme(t) { S.theme = t; save(); }
  function reset() { S = DEFAULT(); save(); }

  /* Replace all state from an exported backup object.
     Merges onto DEFAULT so new fields added later still exist. */
  function importState(obj) {
    if (!obj || typeof obj !== 'object') return false;
    S = Object.assign(DEFAULT(), obj);
    save();
    return true;
  }
  function exportState() { return JSON.stringify(S); }

  load();

  window.QML = window.QML || {};
  window.QML.DB = {
    TOPICS, RANKS, ladder, subRanks, today,
    state: () => S, save, reset, setTheme, importState, exportState,
    snapshots, loadSnapshot,
    noteTime, touchStreak, addXP,
    recordAnswer, recordSymDomain, recordMetaDomain, weakTopics,
    finishEval, evalBest,
    completeLesson, isLessonDone, courseProgress, markCourseComplete,
    stats, grade, mmr, mmrRank,
    timerElapsed, timerStart, timerPause, timerStop,
    pinPalace, unpinPalace, recallPin, palacePins, setLoci,
    recordProof,
    recordHardcore, hardcoreSolved, markHardcoreDone, hardcoreTotals,
    recordConfidence, recordConfRetest, confQueue, calibration,
    srsReview, srsDue, srsStats, srsDrop,
    saveLabDraft, labDraft,
    finishLab, labBest, labDone,
  };
})();
