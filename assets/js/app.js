/* ============================================================
   QML.app — shell: hash router, icon rail, topbar, theme,
   time-tracking heartbeat.

   View contract: views register into QML.views = { name: fn(el, params) }
   Routes: '' → home, courses, course/:id, evals, eval/:id, challenges, stats
   ============================================================ */
(function () {
  const DB = QML.DB;
  QML.views = QML.views || {};

  const NAV = [
    { path: '',          view: 'home',       icon: 'home',    label: 'Home' },
    { path: 'courses',   view: 'courses',    icon: 'courses', label: 'Courses' },
    { path: 'practice',  view: 'practice',   icon: 'flask',   label: 'Practical Center' },
    { path: 'evals',     view: 'evals',      icon: 'evals',   label: 'Evals' },
    { path: 'challenges',view: 'challenges', icon: 'bolt',    label: 'Challenges' },
    { path: 'applied-mechanics', view: 'applied', icon: 'atom', label: 'Applied Mechanics' },
    { path: 'definitions', view: 'definitions', icon: 'infinity', label: 'Definitions' },
    { path: 'meta-challenges', view: 'meta', icon: 'target',  label: 'Meta-Challenges' },
    { path: 'hardcore',  view: 'hardcore',   icon: 'skull',   label: 'Hardcore' },
    { path: 'visuals',   view: 'visuals',    icon: 'orbit3d', label: 'Visuals' },
    { path: 'focus',     view: 'focus',      icon: 'clock',   label: 'Focus' },
    { path: 'palace',    view: 'palace',     icon: 'layers',  label: 'Palace' },
    { path: 'stats',     view: 'stats',      icon: 'stats',   label: 'Stats' },
  ];

  const TITLES = {
    home: ['Welcome back', 'Your quantum command center'],
    courses: ['Courses', 'The full lecture path, from probability to pipelines'],
    practice: ['Practical Center', 'Hands-on labs — build real quantum ML pipelines'],
    course: ['Course', ''],
    evals: ['Evaluations', 'Score yourself on each theme'],
    eval: ['Evaluation', ''],
    challenges: ['Quick Challenges', 'Adaptive drills — it learns what you miss'],
    applied: ['Applied Mechanics', 'Equations only — annotated, brutal, highest MMR per answer'],
    definitions: ['Definitions', 'What every QML symbol means — drills and the full glossary'],
    meta: ['Meta-Challenges', 'Wire symbols to visuals — train the mapping, not just the math'],
    hardcore: ['Hardcore', 'Real papers. Real derivations. Find the result yourself.'],
    visuals: ['Visuals', 'See the equations move — 3D scenes for every key formula'],
    focus: ['Focus', 'Time your study — minutes become MMR'],
    palace: ['Memory Palace', 'Pin concepts to places — walk the route to recall'],
    stats: ['Statistics', 'Your full QML profile'],
  };

  /* ---------- router ---------- */
  function parseHash() {
    const h = location.hash.replace(/^#\/?/, '');
    const parts = h.split('/').filter(Boolean);
    if (!parts.length) return { view: 'home', params: [] };
    const first = parts[0];
    const nav = NAV.find(n => n.path === first);
    if (nav) return { view: nav.view, params: parts.slice(1) };
    if (first === 'course') return { view: 'course', params: parts.slice(1) };
    if (first === 'eval') return { view: 'eval', params: parts.slice(1) };
    return { view: 'home', params: parts.slice(1) };
  }

  let current = null;
  function render() {
    const { view, params } = QML.routeInfo = parseHash();
    current = view;
    const navBase = view === 'course' ? 'courses' : view === 'eval' ? 'evals' : view;
    drawRail(navBase);
    drawTopbar(view);
    const el = document.getElementById('view');
    el.scrollTop = 0;
    if (window.QML_SCENE_CLEANUP) {          // dispose any live 3D scenes (course bloch labs)
      try { window.QML_SCENE_CLEANUP(); } catch (e) {}
      window.QML_SCENE_CLEANUP = null;
    }
    el.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'view-enter';
    el.appendChild(wrap);
    const fn = QML.views[view];
    if (fn) fn(wrap, params);
    else wrap.innerHTML = QML.ui.empty('atom', 'View not found');
  }

  /* ---------- rail ---------- */
  function drawRail(active) {
    const rail = document.getElementById('rail');
    rail.innerHTML = `
      <a class="rail-logo" href="#/" title="QML Academy">Q</a>
      ${NAV.map(n => `
        <a class="rail-btn ${active === n.view ? 'active' : ''}" href="#/${n.path}">
          ${QML.icon(n.icon, 21)}<span class="rail-tip">${n.label}</span>
        </a>`).join('')}
      <div class="rail-spacer"></div>
      <button class="rail-btn" id="rail-theme" title="Toggle theme">
        ${QML.icon(document.documentElement.dataset.theme === 'dark' ? 'sun' : 'moon', 20)}
        <span class="rail-tip">Theme</span>
      </button>`;
    document.getElementById('rail-theme').onclick = toggleTheme;
  }

  /* ---------- topbar ---------- */
  function drawTopbar(view) {
    const [title, sub] = TITLES[view] || TITLES.home;
    const s = DB.stats();
    const g = DB.grade();
    const m = DB.mmrRank();
    document.getElementById('topbar').innerHTML = `
      <div>
        <div class="topbar-title">${title}</div>
        ${sub ? `<div class="topbar-sub">${sub}</div>` : ''}
      </div>
      <div class="topbar-right">
        <a class="pill" href="#/challenges" title="Challenge streak — answer today to keep it">
          ${QML.ui.flame(s.streak, s.streak > 0)}
          <span style="margin-left:2px">${s.streak} day${s.streak === 1 ? '' : 's'}</span>
        </a>
        <a class="pill tb-timer-pill" id="tb-timer" href="#/focus" title="Study timer running — open Focus"
           style="display:none">${QML.icon('clock', 14)}<span class="mono" id="tb-timer-txt">00:00</span></a>
        <button class="rank-chip" id="tb-rank" title="Open rank roadmap — grade ${g.score}/100">
          ${QML.ui.rankGem(m.rank)}
          <span><small>Rank</small>${m.rank.label || g.rank.name} · ${m.value} MMR</span>
        </button>
        <div class="avatar" title="${s.xp} XP">Ψ</div>
      </div>`;
    const chip = document.getElementById('tb-rank');
    if (chip) chip.onclick = () => QML.ui.rankRoadmap();
  }

  /* ---------- theme ---------- */
  function applyTheme() {
    document.documentElement.dataset.theme = DB.state().theme || 'dark';
  }
  function toggleTheme() {
    const cur = DB.state().theme === 'dark' ? 'light' : 'dark';
    DB.setTheme(cur);
    applyTheme();
    drawRail(current === 'course' ? 'courses' : current === 'eval' ? 'evals' : current);
  }

  /* ---------- heartbeat: time on site ---------- */
  let lastTick = Date.now();
  setInterval(() => {
    const now = Date.now();
    if (!document.hidden && now - lastTick < 120000) {
      DB.noteTime(Math.round((now - lastTick) / 1000));
    }
    lastTick = now;
  }, 15000);
  document.addEventListener('visibilitychange', () => { lastTick = Date.now(); });

  /* ---------- topbar live timer chip ---------- */
  setInterval(() => {
    const pill = document.getElementById('tb-timer');
    if (!pill) return;
    const st = DB.state().timer;
    const el = DB.timerElapsed();
    const show = st.running || el > 0;
    pill.style.display = show ? '' : 'none';
    if (show) {
      const mm = Math.floor(el / 60), ss = el % 60, hh = Math.floor(mm / 60);
      const txt = hh ? `${hh}:${String(mm % 60).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
                     : `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
      const t = document.getElementById('tb-timer-txt');
      if (t) t.textContent = txt;
      pill.classList.toggle('live', st.running);
    }
  }, 1000);

  /* ---------- boot ---------- */
  /* Manual restore only: open the app with ?restore=1 to import the
     bundled QML_RESTORE payload (one shot). Silent auto-imports are
     disabled so a lost/corrupt main key can never silently replace
     real progress with canned data — snapshot recovery in db.js
     handles that case instead. */
  (function autoRestore() {
    try {
      if (!/[?&]restore=1/.test(location.search)) return;
      if (!window.QML_RESTORE) return;
      DB.importState(window.QML_RESTORE);
      location.replace(location.pathname + location.hash);
      location.reload();
    } catch (e) {}
  })();
  QML.render = render;
  applyTheme();
  window.addEventListener('hashchange', render);
  render();
})();
