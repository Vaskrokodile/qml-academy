/* ============================================================
   QML.views.courses — catalog grid of all QML_COURSES.
   Route: #/courses  (no params)
   ============================================================ */
(function () {
  let themeFilter = 'all';

  function themeName(id) {
    const t = (QML.DB.TOPICS || []).find(t => t.id === id);
    return t ? t.name : id;
  }

  function stateTag(pct) {
    if (pct >= 100) return '<span class="tag success">Done</span>';
    if (pct > 0)    return '<span class="tag warn">In progress</span>';
    return '<span class="tag">New</span>';
  }

  function card(c) {
    const ui = QML.ui;
    const total = (c.lessons || []).length;
    const p = QML.DB.courseProgress(c.id, total);
    return `<a class="crs-card card card-hover" href="#/course/${ui.esc(c.id)}">
      <div class="crs-card-top">
        <span class="crs-icon">${QML.icon(c.icon || 'book', 22)}</span>
        ${ui.ring(p.pct, 52)}
      </div>
      <div class="crs-card-title">${ui.esc(c.title)}</div>
      <div class="crs-card-sub">${ui.esc(c.subtitle || '')}</div>
      <div class="crs-card-meta">
        <span class="crs-meta-item">${QML.icon('book', 14)} ${total} lesson${total === 1 ? '' : 's'}</span>
        <span class="crs-meta-item">${QML.icon('clock', 14)} ${ui.esc(String(c.estMin || 0))} min</span>
        ${stateTag(p.pct)}
      </div>
    </a>`;
  }

  QML.views = QML.views || {};
  QML.views.courses = function (el) {
    const ui = QML.ui;
    const courses = window.QML_COURSES || [];

    if (!courses.length) {
      el.innerHTML = ui.empty('courses', 'No courses yet', 'Course content is on the way.');
      return;
    }

    const themes = [...new Set(courses.map(c => c.theme).filter(Boolean))];
    const visible = themeFilter === 'all' ? courses : courses.filter(c => c.theme === themeFilter);
    const totalLessons = courses.reduce((n, c) => n + (c.lessons || []).length, 0);

    el.innerHTML = `
      <div class="crs-head">
        <div class="crs-head-meta">${courses.length} course${courses.length === 1 ? '' : 's'} · ${totalLessons} lessons</div>
        ${themes.length > 1 ? `<div class="crs-filters">
          <button class="crs-chip ${themeFilter === 'all' ? 'active' : ''}" data-theme="all">All</button>
          ${themes.map(t => `<button class="crs-chip ${themeFilter === t ? 'active' : ''}" data-theme="${ui.esc(t)}">${ui.esc(themeName(t))}</button>`).join('')}
        </div>` : ''}
      </div>
      ${visible.length
        ? `<div class="crs-grid stagger">${visible.map(card).join('')}</div>`
        : ui.empty('search', 'Nothing in this theme yet')}`;

    el.querySelectorAll('.crs-chip').forEach(b => {
      b.onclick = () => {
        themeFilter = b.dataset.theme || 'all';
        QML.views.courses(el);
      };
    });
  };
})();
