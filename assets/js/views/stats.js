/* ============================================================
   QML.views.stats — the full statistics dashboard.

   Maps the refs/dashboard.jpg layout language to our data:
     · top row of metric cards w/ sparklines
     · learning funnel + weekly activity bars + grade hero
     · dense "evaluation grades" table + rank ladder
     · "topic mastery" percentage heatmap + rewards feed
   ============================================================ */
(function () {
  const DB = QML.DB;
  const { esc, fmtTime } = QML.ui;

  /* ---------- date helpers ---------- */
  const WD = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  function keyOf(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  /* last n day keys, oldest → newest */
  function lastDays(n) {
    const out = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      out.push({ key: keyOf(d), label: i === 0 ? 'now' : WD[d.getDay()], date: d });
    }
    return out;
  }
  function fmtDay(k) {
    if (!k) return '';
    if (k === DB.today()) return 'Today';
    const y = new Date(); y.setDate(y.getDate() - 1);
    if (k === keyOf(y)) return 'Yesterday';
    const d = new Date(k + 'T00:00:00');
    return isNaN(d) ? esc(k) : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }
  /* letter grade from a 0-100 score */
  function letter(p) {
    if (p == null) return '—';
    return p >= 90 ? 'A+' : p >= 85 ? 'A' : p >= 80 ? 'A−' : p >= 70 ? 'B'
         : p >= 55 ? 'C' : p >= 40 ? 'D' : 'F';
  }
  const hint = (icon, msg) =>
    `<div class="st-hint">${QML.icon(icon, 18)}<span>${esc(msg)}</span></div>`;

  /* ---------- view ---------- */
  QML.views = QML.views || {};
  QML.views.stats = function (el) {
    const ui = QML.ui;
    const s = DB.stats();
    const g = DB.grade();

    const state = DB.state() || {};
    const chDays = (state.challenge && state.challenge.days) || {};
    const act = s.activity || {};
    const evalState = state.evals || {};

    /* ============ metric cards (last 7 days) ============ */
    const d7 = lastDays(7);
    const minSeries  = d7.map(x => Math.round((act[x.key] || 0) / 60));
    const totSeries  = d7.map(x => (chDays[x.key] ? chDays[x.key].total : 0));
    let carry = s.questions.acc || 0;
    const accSeries = d7.map(x => {
      const d = chDays[x.key];
      if (d && d.total) carry = Math.round(d.correct / d.total * 100);
      return carry;
    });
    let run = 0;
    const streakSeries = d7.map(x => {
      run = (act[x.key] || (chDays[x.key] && chDays[x.key].total)) ? run + 1 : 0;
      return run;
    });

    const metric = (icon, label, num, unit, sub, series) => `
      <div class="card st-metric">
        <div class="st-metric-top"><span class="st-metric-ic">${QML.icon(icon, 15)}</span>${esc(label)}</div>
        <div class="st-metric-mid">
          <div class="st-metric-num">${num}${unit ? `<small>${esc(unit)}</small>` : ''}</div>
          <div class="st-metric-spark">${ui.spark(series, 96, 36, true)}</div>
        </div>
        <div class="st-metric-sub">${esc(sub)}</div>
      </div>`;

    const metrics = `
      <div class="st-metrics stagger">
        ${metric('target', 'Challenge accuracy', s.questions.acc, '%',
                 `${s.questions.correct}/${s.questions.total} correct`, accSeries)}
        ${metric('bolt', 'Questions answered', s.questions.total, '',
                 `${s.sessions || 0} challenge sessions`, totSeries)}
        ${metric('clock', 'Time in QML', fmtTime(s.timeSec), '',
                 `${s.days} active day${s.days === 1 ? '' : 's'}`, minSeries)}
        ${metric('flame', 'Day streak', s.streak, '',
                 `best ${s.bestStreak} day${s.bestStreak === 1 ? '' : 's'}`, streakSeries)}
      </div>`;

    /* ============ learning funnel ============ */
    const courses = window.QML_COURSES || [];
    let notStarted = 0, inProgress = 0, completed = 0;
    courses.forEach(c => {
      const p = DB.courseProgress(c.id, (c.lessons || []).length);
      if (p.pct >= 100) completed++;
      else if (p.done > 0) inProgress++;
      else notStarted++;
    });
    const cTot = courses.length;
    const share = n => (cTot ? Math.round(n / cTot * 100) : 0);
    const funCol = (label, count, h, mix, ink) => {
      const pct = share(count);
      return `<div class="st-fun-col" style="flex:${Math.max(pct, 16)} 1 0">
        <div class="st-fun-label">${esc(label)}</div>
        <div class="st-fun-bar" style="height:${h}px;background:color-mix(in srgb, var(--accent) ${mix}%, var(--surface-3))">
          <b${ink ? ' style="color:var(--accent-ink)"' : ''}>${pct}%</b>
        </div>
        <div class="st-fun-val">${count}<small> course${count === 1 ? '' : 's'}</small></div>
      </div>`;
    };
    const funnel = `
      <section class="card st-funnel">
        <div class="card-head">
          <div class="card-title">${QML.icon('layers')} Learning funnel</div>
          <span class="link">${cTot} courses</span>
        </div>
        ${cTot ? `<div class="st-fun-stage">
          ${funCol('Not started', notStarted, 118, 16, false)}
          ${funCol('In progress', inProgress, 86, 45, false)}
          ${funCol('Completed', completed, 56, 86, true)}
        </div>
        <div class="st-fun-foot">
          <span>${esc(String(s.coursesDone))}/${cTot} finished</span>
          <div class="pbar"><i style="width:${share(completed)}%"></i></div>
        </div>` : hint('courses', 'No course data yet — open Courses to get started')}
      </section>`;

    /* ============ weekly activity bars ============ */
    const d14 = lastDays(14);
    const barData = d14.map(x => ({ label: x.label, value: Math.round((act[x.key] || 0) / 60) }));
    const sumMin = barData.reduce((a, b) => a + b.value, 0);
    const bestDay = barData.reduce((a, b) => Math.max(a, b.value), 0);
    const week = `
      <section class="card st-week">
        <div class="card-head">
          <div class="card-title">${QML.icon('stats')} Weekly activity</div>
          <span class="tag">14 days</span>
        </div>
        <div class="st-bars">${ui.bars(barData, 560, 158)}</div>
        <div class="st-week-foot">
          <span><b>${fmtTime(sumMin * 60)}</b> logged</span>
          <span class="muted">peak ${bestDay}m/day</span>
        </div>
        ${sumMin ? '' : hint('clock', 'No activity logged yet — time is tracked automatically')}
      </section>`;

    /* ============ grade hero ============ */
    const m = DB.mmrRank();
    const hero = `
      <section class="card st-hero">
        <div class="card-head">
          <div class="card-title">${QML.icon('award')} QML grade</div>
        </div>
        <div class="st-hero-ring">${ui.ring(g.score, 148, String(g.score))}<small>/ 100</small></div>
        <div class="st-hero-grade"><small>grade</small><b>${letter(g.score)}</b></div>
        <button class="st-hero-rank st-hero-rankbtn" id="st-rank" title="Open rank roadmap">
          ${ui.rankGem(g.rank, 32)}<span>${esc(g.rank.label || g.rank.name)}</span><small class="mono">${m.value} MMR</small>
        </button>
        <div class="st-hero-sub muted">${m.next ? `${m.next.mmr - m.value} MMR to ${esc(m.next.label || m.next.name)}` : 'Highest rank reached'}</div>
      </section>`;

    /* ============ evaluation grades table ============ */
    const evals = window.QML_EVALS || [];
    const evalRows = evals.map(e => {
      const best = DB.evalBest(e.id);
      const att = (evalState[e.id] && evalState[e.id].attempts) ? evalState[e.id].attempts.length : 0;
      const themes = (e.themes || [])
        .map(t => { const f = DB.TOPICS.find(x => x.id === t); return f ? f.name : t; })
        .join(' · ');
      const cls = best == null ? '' : best >= 70 ? 'success' : best >= 40 ? 'warn' : 'danger';
      return `<tr>
        <td><div class="st-ev">
          <span class="st-ev-ic">${QML.icon(e.icon || 'evals', 14)}</span>
          <div class="st-ev-t"><b>${esc(e.title || e.id)}</b><small>${e.timeMin ? esc(e.timeMin + ' min') : ''}</small></div>
        </div></td>
        <td class="muted st-ev-themes">${esc(themes) || '—'}</td>
        <td class="mono">${att || '—'}</td>
        <td class="mono st-ev-best">${best == null ? '—' : best + '%'}</td>
        <td><span class="tag ${cls}">${letter(best)}</span></td>
        <td><div class="pbar st-tbar"><i style="width:${best || 0}%"></i></div></td>
      </tr>`;
    }).join('');
    const evalCard = `
      <section class="card st-evals">
        <div class="card-head">
          <div class="card-title">${QML.icon('evals')} Evaluation grades</div>
          <span class="link">${s.evalCount ? `avg best ${s.evalAvg}%` : `${evals.length} evals`}</span>
        </div>
        ${evals.length ? `<div class="st-tbl-wrap"><table class="tbl">
          <thead><tr>
            <th>Evaluation</th><th>Themes</th><th>Tries</th><th>Best</th><th>Grade</th><th>Mastery</th>
          </tr></thead>
          <tbody>${evalRows}</tbody>
        </table></div>` : hint('evals', 'No evaluations yet — score yourself under Evals')}
      </section>`;

    /* ============ rank ladder + formula ============ */
    const lad = DB.ladder ? DB.ladder() : DB.RANKS;
    const ladder = lad.slice().reverse().map(r => {
      const cur = g.rank.id === r.id && (r.sub == null || g.rank.sub === r.sub);
      const passed = m.value >= r.mmr;
      const dim = !cur && r.sub && r.sub !== 3;   /* condense non-current lower divisions */
      return `<div class="st-rank-row ${cur ? 'cur' : ''} ${passed ? 'passed' : ''} ${dim ? 'dim' : ''}">
        ${ui.rankGem(r, 26)}
        <span class="st-rank-name">${esc(r.label || r.name)}</span>
        <span class="st-rank-min mono">${r.mmr}+ MMR</span>
        ${cur ? '<span class="tag">current</span>' : ''}
      </div>`;
    }).join('');
    let nextBar;
    if (m.next) {
      nextBar = `<div class="st-rank-next">
        <div class="st-rank-next-l"><b>${m.into}/${m.span} MMR</b><span class="muted">to ${esc(m.next.label || m.next.name)}</span></div>
        <div class="pbar"><i style="width:${m.pct}%"></i></div>
      </div>`;
    } else {
      nextBar = `<div class="st-rank-next"><span class="tag success">${QML.icon('trophy', 13)} Max rank</span></div>`;
    }
    const B = [
      ['evalAvg',      'Eval average',       40],
      ['challengeAcc', 'Challenge accuracy', 30],
      ['coursePct',    'Course completion',  20],
      ['consist',      'Consistency',        10],
    ];
    const breakdown = B.map(([k, label, w]) => {
      const v = (g.breakdown && g.breakdown[k]) || 0;
      return `<div class="st-bd-row">
        <span class="st-bd-label">${esc(label)}<small>${w}%</small></span>
        <div class="pbar st-bd-bar"><i style="width:${Math.min(v, 100)}%"></i></div>
        <span class="st-bd-val mono">${v}</span>
      </div>`;
    }).join('');
    const rankCard = `
      <section class="card st-rank">
        <div class="card-head">
          <div class="card-title">${QML.icon('gem')} Rank ladder</div>
          <button class="link" id="st-roadmap" title="Open full rank roadmap">${m.value} MMR · roadmap ${QML.icon('right', 11)}</button>
        </div>
        <div class="st-rank-list">${ladder}</div>
        ${nextBar}
        <div class="st-bd">
          <div class="st-bd-head">Grade formula</div>
          ${breakdown}
        </div>
      </section>`;

    /* ============ topic mastery heatmap ============ */
    const topicRows = s.topicAcc.map(t => {
      const unseen = !t.seen;
      const a = t.acc == null ? 0 : t.acc;
      const mix = 12 + Math.round(a / 100 * 76);            /* 12% → 88% accent */
      const chip = unseen
        ? `<span class="st-heat-chip none">--</span>`
        : `<span class="st-heat-chip" style="background:color-mix(in srgb, var(--accent) ${mix}%, var(--surface-3));${a >= 55 ? 'color:var(--accent-ink);' : ''}">${a}%</span>`;
      return `<tr>
        <td>${esc(t.name)}</td>
        <td class="mono muted">${t.seen || '—'}</td>
        <td class="mono muted">${t.seen ? t.correct : '—'}</td>
        <td>${chip}</td>
      </tr>`;
    }).join('');
    const seen = s.topicAcc.filter(t => t.seen);
    const avgAcc = seen.length ? Math.round(seen.reduce((a, t) => a + t.acc, 0) / seen.length) : null;
    const heat = `
      <section class="card st-heat">
        <div class="card-head">
          <div class="card-title">${QML.icon('target')} Topic mastery</div>
          <span class="link">${seen.length}/${s.topicAcc.length} topics seen</span>
        </div>
        <div class="st-tbl-wrap"><table class="tbl st-heat-tbl">
          <thead><tr><th>Topic</th><th>Seen</th><th>Correct</th><th>Accuracy</th></tr></thead>
          <tbody>${topicRows}</tbody>
          <tfoot><tr>
            <td><b>Overall</b></td>
            <td class="mono">${s.questions.total || '—'}</td>
            <td class="mono">${s.questions.total ? s.questions.correct : '—'}</td>
            <td><span class="st-heat-chip ${avgAcc == null ? 'none' : 'st-heat-total'}">${avgAcc == null ? '--' : avgAcc + '%'}</span></td>
          </tr></tfoot>
        </table></div>
        ${seen.length ? '' : hint('bolt', 'Answer challenge questions to light up this map')}
      </section>`;

    /* ============ recent rewards ============ */
    const feedItems = (s.xpEvents || []).slice(0, 9).map(e => `
      <div class="st-feed-row">
        <span class="st-xp">+${esc(String(e.n))}</span>
        <div class="st-feed-txt"><b>${esc(e.label || 'XP earned')}</b><small>${fmtDay(e.day)}</small></div>
      </div>`).join('');
    const feed = `
      <section class="card st-feed">
        <div class="card-head">
          <div class="card-title">${QML.icon('spark')} Recent rewards</div>
          <span class="link mono">${s.xp} XP</span>
        </div>
        ${feedItems ? `<div class="st-feed-list">${feedItems}</div>`
                    : hint('spark', 'No rewards yet — finish a lesson or eval to earn XP')}
      </section>`;

    /* ============ hardcore + metacognition ============ */
    const hc = s.hardcore || { solved: 0, done: 0 };
    const subjCount = (window.QML_HARDCORE || []).length;
    const exCount = (window.QML_HARDCORE || []).reduce((a, x) => a + (x.exercises || []).length, 0);
    const cal = s.calibration;
    const deep = `
      <section class="card st-feed">
        <div class="card-head">
          <div class="card-title">${QML.icon('flask')} Deep work</div>
          <span class="link">the real MMR climb</span>
        </div>
        <div class="st-deep">
          <div class="st-deep-row">
            <span class="st-deep-ic">${QML.icon('flask', 15)}</span>
            <div><b>${hc.solved}</b>/<span class="muted">${exCount}</span> hardcore exercises
              <small class="muted">${hc.done}/${subjCount} papers cleared</small></div>
            <a class="btn btn-ghost btn-sm" href="#/hardcore">Open ${QML.icon('right', 12)}</a>
          </div>
          <div class="st-deep-row">
            <span class="st-deep-ic">${QML.icon('eye', 15)}</span>
            <div><b>${cal ? Math.round((1 - cal.brier) * 100) : '—'}</b><span class="muted">%</span> calibration
              <small class="muted">${cal ? cal.n + ' judged' : 'rate confidence in Meta-Challenges'}${s.confQueue ? ` · ${s.confQueue} confident misses queued` : ''}</small></div>
            <a class="btn btn-ghost btn-sm" href="#/meta-challenges">Train ${QML.icon('right', 12)}</a>
          </div>
          <div class="st-deep-row">
            <span class="st-deep-ic">${QML.icon('gem', 15)}</span>
            <div><b>${s.proofs || 0}</b><span class="muted"></span> proofs attempted
              <small class="muted">${s.proofAvg != null ? 'avg ' + s.proofAvg + '%' : 'the heavy MMR hitters'}</small></div>
          </div>
        </div>
      </section>`;

    /* ============ backup & restore ============ */
    const snaps = DB.snapshots ? DB.snapshots() : [];
    const backup = `
      <section class="card st-feed">
        <div class="card-head">
          <div class="card-title">${QML.icon('layers')} Progress backup</div>
          <span class="link">auto-snapshots + manual export</span>
        </div>
        <p class="muted" style="margin:0 0 10px;font-size:12.5px">
          Your progress lives in this browser's localStorage — plus a daily <b>shadow snapshot</b>
          (last 7 days kept automatically). Export a file backup too for real safety.</p>
        <div class="btn-row" style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn btn-ghost" id="st-export">${QML.icon('right', 14)} Export backup</button>
          <button class="btn btn-ghost" id="st-import">Import backup</button>
          ${snaps.length ? `<select class="btn btn-ghost" id="st-snap" title="Restore a daily snapshot">
            <option value="">Restore snapshot…</option>
            ${snaps.map(d => `<option value="${esc(d)}">${esc(d)}</option>`).join('')}
          </select>` : ''}
          <input type="file" id="st-import-file" accept="application/json,.json" hidden>
        </div>
      </section>`;

    /* ============ compose ============ */
    el.innerHTML = `<div class="st-grid stagger">
      ${metrics}
      ${funnel}
      ${week}
      ${hero}
      ${evalCard}
      ${rankCard}
      ${heat}
      ${feed}
      ${deep}
      ${backup}
    </div>`;

    /* ============ rank roadmap triggers ============ */
    const openMap = () => ui.rankRoadmap();
    const rankBtn = el.querySelector('#st-rank');   if (rankBtn) rankBtn.onclick = openMap;
    const mapBtn  = el.querySelector('#st-roadmap'); if (mapBtn)  mapBtn.onclick  = openMap;

    /* ============ backup wiring ============ */
    el.querySelector('#st-export').onclick = () => {
      const blob = new Blob([DB.exportState()], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'qml-academy-backup-' + DB.today() + '.json';
      a.click();
      URL.revokeObjectURL(a.href);
      ui.toast('Backup downloaded — keep it somewhere safe');
    };
    const fileIn = el.querySelector('#st-import-file');
    el.querySelector('#st-import').onclick = () => fileIn.click();
    fileIn.onchange = () => {
      const f = fileIn.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        try {
          const obj = JSON.parse(r.result);
          if (!obj || typeof obj.xp !== 'number') throw new Error('not a backup');
          if (DB.importState(obj)) { ui.toast('Progress restored'); location.reload(); }
        } catch (e) { ui.toast('That file is not a QML Academy backup', 'bad'); }
      };
      r.readAsText(f);
    };
    const snapSel = el.querySelector('#st-snap');
    if (snapSel) snapSel.onchange = () => {
      const d = snapSel.value;
      if (!d) return;
      const obj = DB.loadSnapshot(d);
      if (obj && confirm(`Restore progress snapshot from ${d}?\nCurrent progress is overwritten (keep a file export first).`)) {
        DB.importState(obj);
        ui.toast('Snapshot restored — ' + d);
        location.reload();
      } else { snapSel.value = ''; }
    };
  };
})();
