/* ============================================================
   QML.views.focus — dedicated study-timer page.

   The timer lives in DB.timer {running, acc, startedAt} so it
   survives navigation and reloads. Finish & bank logs the session
   into studySec / studyDays / studyLog (and today's activity).
   ============================================================ */
(function () {
  const DB = QML.DB;
  const { esc, fmtTime } = QML.ui;

  const WD = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  function keyOf(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  function relDay(k, t) {
    const today = DB.today();
    const y = new Date(); y.setDate(y.getDate() - 1);
    const yk = keyOf(y);
    const hhmm = t ? new Date(t).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '';
    const day = k === today ? 'Today' : k === yk ? 'Yesterday'
      : new Date(k + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    return hhmm ? `${day} · ${hhmm}` : day;
  }

  const pad = n => String(n).padStart(2, '0');
  const fmtClock = sec => {
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  QML.views = QML.views || {};
  QML.views.focus = function (el) {
    const ui = QML.ui;
    const s = DB.stats();
    const st = DB.state();
    const days = st.studyDays || {};
    const log = s.studyLog || [];

    /* ---- aggregates ---- */
    const todaySec = days[DB.today()] || 0;
    let weekSec = 0, weekDays = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const v = days[keyOf(d)] || 0;
      weekSec += v; if (v) weekDays++;
    }
    const barData = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      barData.push({
        label: i === 0 ? 'now' : WD[d.getDay()],
        value: Math.round((days[keyOf(d)] || 0) / 60),
      });
    }

    const chip = (icon, label, val, sub) => `
      <div class="fc-chip">
        <span class="fc-chip-ic">${QML.icon(icon, 15)}</span>
        <div><b>${esc(val)}</b><small>${esc(label)}</small></div>
        ${sub ? `<span class="fc-chip-sub muted">${esc(sub)}</span>` : ''}
      </div>`;

    const logRows = log.slice(0, 10).map(e => `
      <div class="fc-log-row">
        <span class="fc-log-ic">${QML.icon('clock', 14)}</span>
        <span class="fc-log-day">${esc(relDay(e.day, e.t))}</span>
        <b class="mono">${esc(fmtTime(e.sec))}</b>
      </div>`).join('');

    el.innerHTML = `
      <div class="fc stagger">
        <!-- timer console -->
        <section class="card fc-main">
          <div class="fc-status" id="fc-status">
            <span class="fc-dot" id="fc-dot"></span><span id="fc-status-txt">idle</span>
          </div>
          <div class="fc-clock mono" id="fc-clock">00:00:00</div>
          <div class="fc-btns">
            <button class="btn btn-primary btn-lg" id="fc-toggle">${QML.icon('play', 16)} Start</button>
            <button class="btn btn-ghost btn-lg" id="fc-stop" disabled>${QML.icon('check', 15)} Finish &amp; bank</button>
          </div>
          <div class="fc-hint muted">Keeps running if you navigate away — time banks only when you hit Finish.</div>
        </section>

        <!-- stat chips -->
        <div class="fc-chips">
          ${chip('clock', 'Total focused', fmtTime(s.studySec), 'includes 6h of earlier study')}
          ${chip('calendar', 'Today', fmtTime(todaySec), weekDays ? `${weekDays} day${weekDays === 1 ? '' : 's'} this week` : '')}
          ${chip('stats', 'This week', fmtTime(weekSec), `${log.length} session${log.length === 1 ? '' : 's'} logged`)}
          ${chip('gem', 'MMR bonus', '+' + Math.floor(s.studySec / 60), '1 MMR / focused min')}
        </div>

        <!-- 14-day bars -->
        <section class="card">
          <div class="card-head">
            <div class="card-title">${QML.icon('stats')} Focused minutes — last 14 days</div>
            <span class="tag">${weekDays} active</span>
          </div>
          <div class="fc-bars">${ui.bars(barData, 720, 150)}</div>
          ${weekDays ? '' : `<div class="st-hint">${QML.icon('clock', 18)}<span>No focused sessions yet — hit Start and bank your first block.</span></div>`}
        </section>

        <!-- recent sessions -->
        <section class="card">
          <div class="card-head">
            <div class="card-title">${QML.icon('calendar')} Recent sessions</div>
            <span class="link mono">${log.length} total</span>
          </div>
          ${logRows ? `<div class="fc-log">${logRows}</div>`
                    : `<div class="st-hint">${QML.icon('spark', 18)}<span>Finished sessions show up here with their duration.</span></div>`}
        </section>
      </div>`;

    /* ---- wiring ---- */
    const clock = el.querySelector('#fc-clock');
    const toggle = el.querySelector('#fc-toggle');
    const stop = el.querySelector('#fc-stop');
    const dot = el.querySelector('#fc-dot');
    const statusTxt = el.querySelector('#fc-status-txt');

    function paint() {
      const el2 = DB.timerElapsed();
      const running = DB.state().timer.running;
      clock.textContent = fmtClock(el2);
      clock.classList.toggle('live', running);
      dot.classList.toggle('live', running);
      statusTxt.textContent = running ? 'focusing…' : el2 ? 'paused' : 'idle';
      toggle.innerHTML = running
        ? `${QML.icon('x', 15)} Pause`
        : `${QML.icon('play', 16)} ${el2 ? 'Resume' : 'Start'}`;
      stop.disabled = !el2 && !running;
    }

    toggle.onclick = () => {
      if (DB.state().timer.running) DB.timerPause(); else DB.timerStart();
      paint();
    };
    stop.onclick = () => {
      const banked = DB.timerStop();
      if (banked >= 1) {
        QML.ui.toast(`+${fmtTime(banked)} banked — ${fmtTime(DB.state().studySec)} total`, 'clock');
        QML.views.focus(el);            // re-render: chips/bars/log now include the session
      }
      paint();
    };

    const tick = setInterval(() => { if (clock.isConnected) paint(); else clearInterval(tick); }, 1000);
    paint();
  };
})();
