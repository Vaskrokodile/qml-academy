/* ============================================================
   QML.views.home — the dashboard.
   Layout translated from refs/home-ref.png (learning dashboard):
   greeting hero + "now learning" strip → tinted stat cards +
   completion donut → schedule | analytics | course list.
   ============================================================ */
(function () {
  const ui = QML.ui;
  const esc = ui.esc;
  QML.views = QML.views || {}; // views load before app.js creates the registry

  /* ---------- small date helpers ---------- */
  function dayKey(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  function relDay(key) {
    const today = QML.DB.today();
    if (key === today) return 'Today';
    const d = new Date(key + 'T12:00:00');
    const t = new Date(today + 'T12:00:00');
    const diff = Math.round((t - d) / 86400000);
    if (diff === 1) return 'Yesterday';
    if (diff > 1 && diff < 7) return d.toLocaleDateString(undefined, { weekday: 'short' });
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  /* theme → card hue, cycling the ref2 palette */
  const HUES = ['h-purple', 'h-blue', 'h-green', 'h-orange', 'h-pink'];
  const themeHue = (c, i) => {
    const map = { math: 'h-blue', states: 'h-purple', multi: 'h-pink', measure: 'h-green',
      mixed: 'h-slate', dynamics: 'h-orange', gatemodel: 'h-purple', annealing: 'h-orange',
      vqa: 'h-green', encoding: 'h-blue', mlmethods: 'h-pink', algorithms: 'h-purple',
      symbols: 'h-slate', meta: 'h-blue', practical: 'h-green' };
    return map[c.theme] || HUES[i % HUES.length];
  };

  /* animated "now playing" bars */
  const wave = () => `<span class="h-wave" aria-hidden="true">${
    Array.from({ length: 16 }, (_, i) =>
      `<i style="height:${[38, 62, 45, 80, 55, 95, 70, 40, 88, 60, 30, 75, 50, 65, 42, 58][i]}%;animation-delay:${i * 90}ms"></i>`).join('')
  }</span>`;

  /* multi-arc donut — segments: [{pct, color, name, n}] */
  function donut(segs, size, label) {
    size = size || 132;
    const sw = 15, r = (size - sw) / 2, c = 2 * Math.PI * r;
    let off = 0;
    const arcs = segs.map(s => {
      const len = Math.max(0, s.pct / 100) * c - 2;
      const el = `<circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none"
        stroke="${s.color}" stroke-width="${sw}" stroke-linecap="round"
        stroke-dasharray="${Math.max(0.5, len)} ${c}" stroke-dashoffset="${-off}"/>`;
      off += Math.max(0, s.pct / 100) * c;
      return el;
    }).join('');
    return `<div class="h-donut"><svg width="${size}" height="${size}">
        <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none"
          stroke="var(--ring-track)" stroke-width="${sw}"/>${arcs}
      </svg><div class="h-donut-c"><div><b>${label}</b><small>overview</small></div></div></div>`;
  }

  /* ---------- activity calendar (last 35 days) ---------- */
  function calendar(activity) {
    const now = new Date();
    const days = [];
    for (let i = 34; i >= 0; i--) {
      const d = new Date(now); d.setDate(now.getDate() - i);
      days.push(d);
    }
    const lead = days[0].getDay();
    const todayK = dayKey(now);
    const dows = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    let cells = dows.map(d => `<span class="h-cal-dow">${d}</span>`).join('');
    for (let i = 0; i < lead; i++) cells += '<span class="h-cal-blank"></span>';
    cells += days.map(d => {
      const k = dayKey(d);
      const sec = activity[k] || 0;
      const lvl = sec >= 1800 ? 'l3' : sec >= 600 ? 'l2' : sec > 0 ? 'l1' : '';
      return `<span class="h-cal-day ${lvl} ${k === todayK ? 'today' : ''}"
        title="${k}${sec ? ' — ' + ui.fmtTime(sec) : ''}">${d.getDate()}</span>`;
    }).join('');
    return cells;
  }

  /* ---------- view ---------- */
  QML.views.home = function (el) {
    const DB = QML.DB;
    const s = DB.stats();
    const courses = window.QML_COURSES || [];

    const prog = courses.map(c => ({ c, p: DB.courseProgress(c.id, c.lessons.length) }));
    const inProgress = prog.filter(x => x.p.pct > 0 && x.p.pct < 100);
    const done = prog.filter(x => x.p.pct >= 100);
    const fresh = prog.filter(x => x.p.pct === 0);
    const current = inProgress[0] || fresh[0] || null;
    const nextUp = inProgress[1] || fresh[1] || fresh[0] || null;

    const dateStr = new Date().toLocaleDateString(undefined, {
      weekday: 'long', month: 'long', day: 'numeric',
    });

    /* resume target = first unfinished lesson */
    const resumeLesson = current
      ? Math.min(current.p.done, current.c.lessons.length - 1) : 0;

    /* weekly minutes for the analytics card */
    const WD = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const d7 = [];
    for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); d7.push(d); }
    const wkMin = d7.map(d => Math.round((s.activity[dayKey(d)] || 0) / 60));
    const wkMax = Math.max(...wkMin, 1);
    const barHues = [
      ['#6aa8ff', '#2d4fb8'], ['#8b5cf6', '#5b34c9'], ['#5ee0a0', '#1d7a4e'],
      ['#ff9d5c', '#a8491d'], ['#f472d0', '#8f2d83'], ['#a78bfa', '#6d3ee0'], ['#6aa8ff', '#2d4fb8'],
    ];

    /* summary donut data */
    const tot = courses.length || 1;
    const segs = [
      { pct: done.length / tot * 100, color: '#5ee0a0', name: 'Completed', n: done.length },
      { pct: inProgress.length / tot * 100, color: '#ff9d5c', name: 'In progress', n: inProgress.length },
      { pct: fresh.length / tot * 100, color: '#a78bfa', name: 'Not started', n: fresh.length },
    ];

    /* today's schedule items: study sessions logged today + SRS reviews */
    const todayK = dayKey(new Date());
    const todaySessions = (s.studyLog || []).filter(l => l.day === todayK);
    const srsDue = s.srs ? s.srs.due : 0;

    const rewards = (s.xpEvents || []).slice(0, 5);

    el.innerHTML = `
    <div class="home">
      <!-- ===== hero (ref: greeting + now-playing strip) ===== -->
      <div class="h-hero">
        <div class="h-hero-top">
          <div>
            <h1 class="h-hello">Hello!</h1>
            <div class="h-hello-q">What do you want to learn today?</div>
          </div>
          <span class="h-hero-date">${QML.icon('calendar', 14)} ${esc(dateStr)}</span>
        </div>
        <div class="h-now">
          ${current ? `
            <span class="h-now-ic">${QML.icon(current.c.icon || 'book', 21)}</span>
            <div class="h-now-info">
              <div class="h-now-t">${esc(current.c.title)}</div>
              <div class="h-now-s">Lesson ${resumeLesson + 1}/${current.c.lessons.length} · ${esc(current.c.lessons[resumeLesson] ? current.c.lessons[resumeLesson].title : '')}</div>
            </div>
            ${wave()}
            <a class="h-now-play" href="#/course/${esc(current.c.id)}/${resumeLesson}" title="Resume course">${QML.icon('play', 17)}</a>
            <div class="h-now-chips">
              ${nextUp ? `<a class="h-chip" href="#/course/${esc(nextUp.c.id)}">Next: ${esc(nextUp.c.title)}</a>` : ''}
              <a class="h-chip" href="#/challenges">Drill</a>
            </div>` : `
            <span class="h-now-ic">${QML.icon('atom', 21)}</span>
            <div class="h-now-info">
              <div class="h-now-t">Lecture path complete — keep building research-level practice</div>
              <div class="h-now-s">Keep your edge: reviews, evals, hardcore papers</div>
            </div>
            ${wave()}
            <a class="h-now-play" href="#/evals" title="Take an eval">${QML.icon('play', 17)}</a>
            <div class="h-now-chips"><a class="h-chip" href="#/hardcore">Hardcore</a></div>`}
        </div>
      </div>

      <!-- ===== tinted stat row + summary donut ===== -->
      <div class="h-stats stagger">
        <div class="h-tint h-green">
          <div class="h-stat-head"><span class="h-card-label">Courses</span><span class="h-ic">${QML.icon('courses', 18)}</span></div>
          <div><span class="h-stat-num">${inProgress.length}</span> <small>in progress</small></div>
          <div class="h-stat-sub">${done.length} completed · ${fresh.length} waiting</div>
        </div>
        <div class="h-tint h-blue">
          <div class="h-stat-head"><span class="h-card-label">Eval average</span><span class="h-ic">${QML.icon('evals', 18)}</span></div>
          <div><span class="h-stat-num">${s.evalCount ? s.evalAvg : '—'}<small>%</small></span></div>
          <div class="h-stat-sub">${s.evalCount} eval${s.evalCount === 1 ? '' : 's'} attempted</div>
        </div>
        <div class="h-tint h-orange">
          <div class="h-stat-head"><span class="h-card-label">Focused study</span><span class="h-ic">${QML.icon('clock', 18)}</span></div>
          <div><span class="h-stat-num">${esc(ui.fmtTime(s.studySec))}</span></div>
          <div class="h-stat-sub">${ui.flame(s.streak, s.streak > 0)} ${s.streak} day streak</div>
        </div>
        <div class="card h-sum">
          <div class="h-card-label" style="color:var(--text-3)">Total summary</div>
          <div class="h-sum-body">
            ${donut(segs, 124, `${Math.round(done.length / tot * 100)}%`)}
            <div class="h-legend">
              ${segs.map(sg => `<div class="h-leg"><i style="background:${sg.color}"></i><span>${sg.name}</span><b>${sg.n}</b></div>`).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- ===== 3-col: schedule | analytics | courses ===== -->
      <div class="h-grid">
        <div class="card">
          <div class="card-head">
            <span class="card-title">${QML.icon('calendar')} Today</span>
            <span class="muted" style="font-size:12px">${esc(new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }))}</span>
          </div>
          <div class="h-sched-list">
            ${srsDue ? `<a class="h-ev" href="#/challenges">
              <i class="h-ev-dot" style="color:var(--hue-pink);background:var(--hue-pink)"></i>
              <span class="h-ev-info"><span class="h-ev-t">Spaced review</span><span class="h-ev-s">forgetting-curve queue</span></span>
              <span class="h-ev-amt">${srsDue} due</span></a>` : ''}
            ${todaySessions.length ? todaySessions.map(l => `<div class="h-ev">
              <i class="h-ev-dot" style="color:var(--hue-green);background:var(--hue-green)"></i>
              <span class="h-ev-info"><span class="h-ev-t">Focus session</span><span class="h-ev-s">${new Date(l.t).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}</span></span>
              <span class="h-ev-amt">${ui.fmtTime(l.sec)}</span></div>`).join('') : ''}
            ${!srsDue && !todaySessions.length ? `<div class="h-ev">
              <i class="h-ev-dot" style="color:var(--accent);background:var(--accent)"></i>
              <span class="h-ev-info"><span class="h-ev-t">Nothing logged yet</span><span class="h-ev-s">start a challenge or a focus timer</span></span>
              <a class="h-ev-amt" href="#/focus">Go →</a></div>` : ''}
            <a class="h-ev" href="#/practice">
              <i class="h-ev-dot" style="color:var(--hue-blue);background:var(--hue-blue)"></i>
              <span class="h-ev-info"><span class="h-ev-t">Practical Center</span><span class="h-ev-s">${s.labsDone || 0} labs done</span></span>
              <span class="h-ev-amt">${QML.icon('right', 13)}</span></a>
          </div>
        </div>

        <div class="card">
          <div class="card-head">
            <span class="card-title">${QML.icon('stats')} Study minutes — last 7 days</span>
            <span class="muted" style="font-size:12px">${wkMin.reduce((a, b) => a + b, 0)} min total</span>
          </div>
          <div class="h-bars">
            ${wkMin.map((v, i) => `
              <div class="h-bar" title="${WD[d7[i].getDay()]} — ${v} min">
                <div class="h-bar-col"><div class="h-bar-fill" style="height:${Math.max(4, v / wkMax * 100)}%;--bc1:${barHues[i][0]};--bc2:${barHues[i][1]}"></div></div>
                <span class="h-bar-lab">${WD[d7[i].getDay()]}</span>
              </div>`).join('')}
          </div>
        </div>

        <div class="card">
          <div class="card-head">
            <span class="card-title">${QML.icon('courses')} Your courses</span>
            <a class="link" href="#/courses" style="font-size:12.5px;font-weight:600;color:var(--text-3)">View all</a>
          </div>
          <div class="h-crs-list">
            ${prog.slice(0, 6).map((x, i) => {
              const hue = themeHue(x.c, i);
              return `<a class="h-crs" href="#/course/${esc(x.c.id)}">
                <span class="h-crs-ic ${hue}">${QML.icon(x.c.icon || 'book', 17)}</span>
                <span class="h-crs-info">
                  <span class="h-crs-t">${esc(x.c.title)} ${x.p.pct === 0 ? '<span class="tag">New</span>' : ''}</span>
                  <span class="h-crs-s">${x.p.done}/${x.c.lessons.length} lessons</span>
                  <span class="h-crs-bar"><i style="width:${x.p.pct}%"></i></span>
                </span>
                <span class="h-crs-pct">${x.p.pct}%</span>
              </a>`;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- ===== rewards + calendar ===== -->
      <div class="h-grid h-extra-grid section-gap">
        <div class="card">
          <div class="card-head">
            <span class="card-title">${QML.icon('award')} Rewards</span>
            <a class="link" href="#/stats" style="font-size:12.5px;font-weight:600;color:var(--text-3)">View all</a>
          </div>
          ${rewards.length ? rewards.map(e => `
            <div class="h-rw">
              <span class="h-ic" style="width:34px;height:34px;border-radius:10px;background:var(--accent-soft);border-color:var(--border)">${QML.icon('spark', 15)}</span>
              <span class="h-rw-info"><b>${esc(e.label)}</b><small>${esc(relDay(e.day))}</small></span>
              <span class="h-rw-amt">+${e.n} XP</span>
            </div>`).join('')
          : `<div class="h-rw-empty">${QML.icon('spark', 16)} Earn XP by finishing lessons and challenges</div>`}
        </div>
        <div class="card">
          <div class="card-head">
            <span class="card-title">${QML.icon('calendar')} Activity</span>
            <span class="muted" style="font-size:12px">${esc(new Date().toLocaleDateString(undefined, { month: 'long' }))}</span>
          </div>
          <div class="h-cal">${calendar(s.activity)}</div>
          <div class="h-cal-legend">
            <span>Less</span>
            <i class="h-cal-day"></i><i class="h-cal-day l1"></i>
            <i class="h-cal-day l2"></i><i class="h-cal-day l3"></i>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>`;
  };
})();
