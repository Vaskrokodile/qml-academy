/* ============================================================
   QML.views.challenges — adaptive quick drills.
   8 questions per session; the picker weights your weakest
   topics (DB.weakTopics / stats().topicAcc), prefers unseen
   questions, and escalates difficulty on correct streaks.
   Route: #/challenges
   ============================================================ */
(function () {
  const DB = QML.DB;
  const ui = QML.ui;
  QML.views = QML.views || {};

  const SESSION_LEN = 8;
  const topicName = id => (DB.TOPICS.find(t => t.id === id) || {}).name || id;
  const diffName = d => ['Easy', 'Easy', 'Medium', 'Hard'][Math.min(Math.max(d || 1, 1), 3)];

  const todayStats = () => {
    const d = (DB.state().challenge.days || {})[DB.today()] || { total: 0, correct: 0 };
    return { total: d.total, correct: d.correct, acc: d.total ? Math.round(d.correct / d.total * 100) : null };
  };
  const courseFor = tid => (window.QML_COURSES || []).find(c => c.theme === tid);

  /* resolve a qid against every bank that recordAnswer can log to */
  const byIdAll = () => {
    const bank = (window.QML_QUESTIONS || [])
      .concat(window.QML_DEF_QUESTIONS || [], window.QML_META_QUESTIONS || [], window.QML_EQ_QUESTIONS || [], window.QML_PRACTICAL_BANK || []);
    return Object.fromEntries(bank.map(q => [q.id, q]));
  };

  /* ---------- adaptive picker ----------
     Scores every unseen candidate: weak-half topic bonus +
     continuous weakness rank + low-accuracy bonus + difficulty
     match + unseen-topic bonus + jitter. Difficulty starts at 1,
     +1 per 2 consecutive correct, -1 per miss (clamped 1–3).
     Spaced repetition: `dueQids` interleaves review-due items
     into fresh sessions; db.js uses a transparent fixed-step schedule. */
  function makePicker(bank, dueQids, dueOnly) {
    const weak = DB.weakTopics();                          // weakest first
    const weakHalf = new Set(weak.slice(0, Math.ceil(weak.length / 2)));
    const rank = {};
    weak.forEach((id, i) => { rank[id] = weak.length - i; }); // weaker → bigger
    const acc = {};
    DB.stats().topicAcc.forEach(t => { acc[t.id] = t; });
    const seen = new Set();
    let diff = 1, run = 0, picks = 0;
    const due = (dueQids || []).slice();

    return {
      get diff() { return diff; },
      next() {
        let pool = bank.filter(q => !seen.has(q.id));
        if (!pool.length) { seen.clear(); pool = bank.slice(); }   // tiny bank: allow repeats
        if (due.length && (dueOnly || picks % 3 === 1)) {
          const qid = due.shift();
          const q = byIdAll()[qid] || pool.find(x => x.id === qid);
          if (q && !seen.has(q.id)) { seen.add(q.id); picks++; return q; }
        }
        const score = q => {
          const t = acc[q.topic];
          const tAcc = t && t.acc != null ? t.acc : 50;
          return (weakHalf.has(q.topic) ? 2.5 : 0)                 // weakest-half priority
            + (rank[q.topic] || 0) / weak.length * 2               // continuous weakness weight
            + (100 - tAcc) / 100 * 1.5                             // low recorded accuracy
            + (!t || !t.seen ? 1.2 : t.seen < 3 ? 0.6 : 0)         // prefer unseen
            + (2 - Math.abs((q.diff || 1) - diff))                 // match current difficulty
            + Math.random() * 0.8;                                 // jitter / tie-break
        };
        let best = pool[0], bs = -Infinity;
        for (const q of pool) { const s = score(q); if (s > bs) { bs = s; best = q; } }
        seen.add(best.id);
        picks++;
        return best;
      },
      answer(ok) {
        if (ok) { run++; if (run >= 2 && diff < 3) { diff++; run = 0; } }
        else { run = 0; diff = Math.max(1, diff - 1); }
      },
    };
  }

  /* ================= VIEW ================= */
  QML.views.challenges = function (el) {
    const bank = (window.QML_QUESTIONS || [])
      .concat(window.QML_EQ_QUESTIONS || [], window.QML_PRACTICAL_BANK || [])
      .filter(q =>
      q && q.prompt && Array.isArray(q.options) && q.options.length === 4 && Number.isInteger(q.answer));
    if (!bank.length) {
      el.innerHTML = ui.empty('bolt', 'Question bank is empty', 'Challenges unlock once questions are loaded.');
      return;
    }
    landing();

    /* ---------- landing ---------- */
    function landing() {
      const s = DB.stats();
      const day = todayStats();
      const weak3 = DB.weakTopics().slice(0, 3);
      const srs = s.srs || { due: 0, learning: 0, mature: 0 };
      const dueN = Math.min(srs.due, SESSION_LEN);
      el.innerHTML = `
        <div class="qz-land">
          <div class="card qz-land-hero">
            <span class="qz-land-ico">${QML.icon('bolt', 26)}</span>
            <div>
              <div class="qz-land-title">Adaptive quick challenge</div>
              <p class="muted">${SESSION_LEN} questions that target your <strong>weakest topics</strong> — the drill learns what you miss and serves more of it.</p>
              <ul class="qz-land-list">
                <li>${QML.icon('target', 14)} Weights questions toward topics where your accuracy is lowest</li>
                <li>${QML.icon('stats', 14)} Difficulty climbs after 2 correct in a row, eases off when you miss</li>
                <li>${QML.icon('refresh', 14)} <b>Spaced review</b> — every answer joins a forgetting-curve schedule; misses come back tomorrow, recalls drift weeks out</li>
                <li>${QML.icon('check', 14)} Instant feedback with an explanation on every question</li>
              </ul>
              <div class="qz-land-weak">Currently targeting: ${weak3.map(t => `<span class="tag warn">${ui.esc(topicName(t))}</span>`).join(' ')}</div>
            </div>
          </div>
          <div class="qz-land-stats stagger">
            <div class="card qz-mini">
              ${ui.flame(s.streak, s.streak > 0)}
              <div><strong>${s.streak} day${s.streak === 1 ? '' : 's'}</strong><span class="muted">current streak</span></div>
            </div>
            <div class="card qz-mini">
              <span class="qz-mini-ico">${QML.icon('layers', 19)}</span>
              <div><strong>${day.total}</strong><span class="muted">questions today</span></div>
            </div>
            <div class="card qz-mini">
              <span class="qz-mini-ico">${QML.icon('target', 19)}</span>
              <div><strong>${day.acc == null ? '—' : day.acc + '%'}</strong><span class="muted">accuracy today</span></div>
            </div>
            <div class="card qz-mini qz-srs">
              <span class="qz-mini-ico">${QML.icon('refresh', 19)}</span>
              <div><strong>${srs.due}</strong><span class="muted">reviews due · ${srs.mature} mastered</span></div>
            </div>
          </div>
          <div class="qz-land-cta">
            <button class="btn btn-primary btn-lg qz-start" id="qz-start">${QML.icon('play', 16)} Start challenge</button>
            ${srs.due ? `<button class="btn btn-ghost btn-lg" id="qz-review">${QML.icon('refresh', 16)} Review ${dueN} due</button>` : ''}
          </div>
          <p class="qz-land-note muted">${SESSION_LEN} questions · +10 XP per correct · reviews use a simple fixed-step schedule (1, 3, 7, 16, 35, 75 days), not a learned memory model. See “Unbounded Human Learning: Optimal Scheduling for Spaced Repetition” (arXiv:1602.07032v2) for research context.</p>
        </div>`;
      el.querySelector('#qz-start').onclick = () => session();
      const rv = el.querySelector('#qz-review');
      if (rv) rv.onclick = () => session(true);
    }

    /* ---------- session ---------- */
    function session(reviewOnly) {
      /* build the review queue: all banks, filtered to due qids */
      const idMap = byIdAll();
      /* only text-renderable questions can be served by this runner */
      const renderable = q => q && q.options && q.options.length === 4 && !q.viz && !q.vizOptions;
      const dueIds = (DB.srsDue ? DB.srsDue() : []).filter(id => idMap[id] && renderable(idMap[id]));
      let dueQueue;
      let sessionBank = bank;
      if (reviewOnly) {
        /* dedicated review session: only due questions */
        sessionBank = dueIds.map(id => idMap[id]);
        dueQueue = sessionBank.map(q => q.id);
        if (!sessionBank.length) return landing();
      } else {
        /* normal session: interleave up to 2 due items */
        dueQueue = dueIds.slice(0, 2);
      }
      const sessionLen = reviewOnly ? Math.min(SESSION_LEN, sessionBank.length) : SESSION_LEN;
      const picker = makePicker(sessionBank, dueQueue, !!reviewOnly);
      const results = [];          // {q, pick, ok}
      let xp = 0;

      const hud = () => {
        const s = DB.stats();
        const day = todayStats();
        return `<div class="qz-hud">
          <div class="qz-hud-left">
            ${ui.flame(s.streak, s.streak > 0)}
            <span class="qz-hud-tally">${day.total} today${day.total ? ` · ${day.acc}%` : ''}</span>
          </div>
          <div class="qz-dots">${Array.from({ length: sessionLen }, (_, i) => {
            const r = results[i];
            return `<span class="qz-dot ${i === results.length ? 'cur' : ''} ${r ? (r.ok ? 'ok' : 'bad') : ''}"></span>`;
          }).join('')}</div>
          <span class="tag" title="Current difficulty">${QML.icon('stats', 12)} ${diffName(picker.diff)}</span>
        </div>`;
      };

      function nextQ() {
        if (results.length >= sessionLen) return summary();
        renderQ(picker.next());
      }

      function renderQ(q) {
        el.innerHTML = `
          <div class="qz-exam">
            ${hud()}
            <div class="card qz-qcard qz-in">
              <div class="qz-qmeta">
                <span class="tag">${ui.esc(topicName(q.topic))}</span>
                <span class="tag">${diffName(q.diff)}</span>
                <span class="qz-qnum muted">Q${results.length + 1}/${sessionLen}</span>
              </div>
              <div class="qz-prompt">${ui.md(q.prompt)}</div>
              <div class="qz-opts">
                ${q.options.map((o, k) => `
                  <button class="qz-opt" data-k="${k}">
                    <span class="qz-letter">${'ABCD'[k]}</span>
                    <span class="qz-opt-txt">${ui.md(o)}</span>
                  </button>`).join('')}
              </div>
              <div class="qz-explain" hidden></div>
              <div class="qz-qfoot">
                <span class="muted" id="qz-hint">Pick an answer — feedback is instant</span>
                <button class="btn btn-primary" id="qz-next" disabled>${results.length === sessionLen - 1 ? 'Finish' : 'Next'} ${QML.icon('right', 15)}</button>
              </div>
            </div>
          </div>`;

        el.querySelectorAll('.qz-opt').forEach(b => b.onclick = () => {
          const pick = +b.dataset.k;
          const ok = pick === q.answer;
          results.push({ q, pick, ok });
          picker.answer(ok);
          DB.recordAnswer(q.id, q.topic, ok);
          if (ok) { xp += 10; DB.addXP(10, 'Correct answer'); }

          el.querySelectorAll('.qz-opt').forEach(x => {
            x.disabled = true;
            const xk = +x.dataset.k;
            if (xk === q.answer) x.classList.add('ok');
            else if (xk === pick) x.classList.add('bad');
          });
          const ex = el.querySelector('.qz-explain');
          ex.hidden = false;
          ex.classList.add(ok ? 'ok' : 'bad');
          ex.innerHTML = `${QML.icon(ok ? 'check' : 'x', 16)}<div>
            <strong>${ok ? 'Correct — +10 XP' : `Not quite — the answer is ${'ABCD'[q.answer]}`}</strong>
            <span>${ui.md(q.explain || '')}</span></div>`;
          const nx = el.querySelector('#qz-next');
          nx.disabled = false;
          nx.focus();

          /* refresh HUD bits: dot + today's tally */
          const dots = el.querySelectorAll('.qz-dot');
          if (dots[results.length - 1]) {
            dots[results.length - 1].classList.add(ok ? 'ok' : 'bad');
            dots[results.length - 1].classList.remove('cur');
          }
          const day = todayStats();
          const tally = el.querySelector('.qz-hud-tally');
          if (tally) tally.textContent = `${day.total} today${day.total ? ` · ${day.acc}%` : ''}`;
          const hint = el.querySelector('#qz-hint');
          if (hint) hint.textContent = ok ? 'Nice.' : 'Review the explanation, then move on';
        });

        el.querySelector('#qz-next').onclick = () => {
          const card = el.querySelector('.qz-qcard');
          card.classList.remove('qz-in');
          card.classList.add('qz-out');
          setTimeout(nextQ, 170);
        };
      }

      /* ---------- summary ---------- */
      function summary() {
        const correct = results.filter(r => r.ok).length;
        const pct = Math.round(correct / sessionLen * 100);
        const perfect = correct === sessionLen;
        DB.state().challenge.sessions = (DB.state().challenge.sessions || 0) + 1;
        DB.save();
        const s = DB.stats();

        const byTopic = {};
        results.forEach(r => {
          const t = byTopic[r.q.topic] = byTopic[r.q.topic] || { seen: 0, ok: 0 };
          t.seen++; if (r.ok) t.ok++;
        });
        const struggled = Object.entries(byTopic)
          .filter(([, v]) => v.ok < v.seen)
          .sort((a, b) => (a[1].ok / a[1].seen) - (b[1].ok / b[1].seen));
        const weakest = DB.weakTopics().slice(0, 3);

        el.innerHTML = `
          <div class="qz-result ${perfect ? 'qz-perfect' : ''}">
            <div class="card qz-hero qz-in">
              ${perfect ? `<div class="qz-burst">${Array.from({ length: 12 }, (_, i) =>
                `<i style="--a:${i * 30}deg;animation-delay:${i * 45}ms"></i>`).join('')}</div>` : ''}
              ${ui.ring(pct, 140, pct + '%', 10)}
              <div class="qz-hero-info">
                ${perfect ? `<span class="tag success qz-perfect-tag">Perfect run — ${sessionLen}/${sessionLen}!</span>` : ''}
                <div class="qz-hero-line"><strong>${correct}/${sessionLen}</strong> correct this session</div>
                <div class="muted">+${xp} XP earned</div>
                <div class="qz-hero-streak">${ui.flame(s.streak, s.streak > 0)}<span>${s.streak} day streak${s.bestStreak > s.streak ? ` · best ${s.bestStreak}` : ''}</span></div>
                <div class="qz-hero-btns">
                  <button class="btn btn-primary" id="qz-again">${QML.icon('refresh', 15)} Play again</button>
                  <a class="btn btn-ghost" href="#/courses">${QML.icon('courses', 15)} Review courses</a>
                </div>
              </div>
            </div>
            <div class="grid qz-sum-grid section-gap">
              <div class="card">
                <div class="card-head"><div class="card-title">${QML.icon('target', 17)} Session breakdown</div></div>
                ${struggled.length ? `
                  <p class="muted" style="margin-bottom:4px">You struggled with — review suggested:</p>
                  <ul class="qz-topic-list">
                    ${struggled.map(([tid, v]) => {
                      const c = courseFor(tid);
                      return `<li>
                        <span class="qz-dot bad"></span>
                        <strong>${ui.esc(topicName(tid))}</strong>
                        <span class="muted">${v.ok}/${v.seen}</span>
                        <a class="btn btn-ghost btn-sm" href="#/${c ? 'course/' + c.id : 'courses'}">Review ${QML.icon('right', 12)}</a>
                      </li>`;
                    }).join('')}
                  </ul>` : `
                  <p class="muted">No weak spots this session — clean sweep across ${Object.keys(byTopic).length} topic${Object.keys(byTopic).length === 1 ? '' : 's'}.</p>`}
              </div>
              <div class="card">
                <div class="card-head"><div class="card-title">${QML.icon('stats', 17)} Weakest topics overall</div></div>
                <ul class="qz-topic-list">
                  ${weakest.map(tid => {
                    const t = s.topicAcc.find(x => x.id === tid);
                    const c = courseFor(tid);
                    return `<li>
                      <span class="qz-dot ${t && t.acc != null && t.acc >= 70 ? 'ok' : 'bad'}"></span>
                      <strong>${ui.esc(topicName(tid))}</strong>
                      <span class="muted">${t && t.acc != null ? t.acc + '%' : 'new'}</span>
                      <a class="btn btn-ghost btn-sm" href="#/${c ? 'course/' + c.id : 'courses'}">Study ${QML.icon('right', 12)}</a>
                    </li>`;
                  }).join('')}
                </ul>
              </div>
            </div>
          </div>`;
        el.querySelector('#qz-again').onclick = () => session();
      }

      nextQ();
    }
  };
})();
