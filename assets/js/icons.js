/* QML Academy — inline SVG icon set. Usage: QML.icon('home') */
(function () {
  const P = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V21h13V9.5"/><path d="M9.5 21v-6h5v6"/>',
    courses: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5Z"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20"/><path d="M9 7.5h7"/>',
    evals: '<rect x="5" y="4" width="14" height="17" rx="2.5"/><path d="M9 4a3 3 0 0 1 6 0"/><path d="m9.5 13.5 2 2 3.5-4"/>',
    bolt: '<path d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5Z"/>',
    stats: '<path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-8"/><path d="M22 20H2" opacity=".4"/>',
    flame: '<path class="body" d="M12 2c1 4-4 6-4 11a4.5 4.5 0 0 0 9 0c0-1.5-.5-2.5-1.2-3.6-.5 1-1.2 1.6-2 1.6.8-2.8-.3-6.5-1.8-9Z"/>',
    atom: '<circle cx="12" cy="12" r="1.6"/><ellipse cx="12" cy="12" rx="9.5" ry="3.8"/><ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(120 12 12)"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m20.5 20.5-4.8-4.8"/>',
    check: '<path d="m4.5 12.5 5 5 10-11"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    right: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    left: '<path d="M19 12H5m6-6-6 6 6 6"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0Z"/><path d="M8 5H4.5a3.5 3.5 0 0 0 3.6 3.5M16 5h3.5a3.5 3.5 0 0 1-3.6 3.5"/><path d="M12 13v4m-3.5 4h7M10 21l.6-4h2.8l.6 4"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5.2l3.4 2"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5V5m0 14v2.5M2.5 12H5m14 0h2.5M5.3 5.3 7 7m10 10 1.7 1.7M18.7 5.3 17 7M7 17l-1.7 1.7"/>',
    moon: '<path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z"/>',
    play: '<path d="M7 4.5 19 12 7 19.5Z"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5Z"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M8 3v4m8-4v4M3.5 10h17"/>',
    medal: '<circle cx="12" cy="14" r="5.5"/><path d="M8.5 9 6 3h4l2 4 2-4h4l-2.5 6"/><path d="m10.5 14 1.2 1.2 2.3-2.7"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5Z"/><path d="m3 13 9 5 9-5" opacity=".5"/>',
    gem: '<path d="M7 3h10l4 6-9 12L3 9Z"/><path d="M3 9h18M9.5 9 12 21l2.5-12M9.5 9 7 3m7.5 6L17 3"/>',
    refresh: '<path d="M20 11a8 8 0 1 0-2.3 6.3"/><path d="M20 4v7h-7"/>',
    award: '<circle cx="12" cy="9" r="5.5"/><path d="m8.8 13.5-1.3 7 4.5-2.5 4.5 2.5-1.3-7"/>',
    zap: '<path d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5Z"/>',
    spark: '<path d="M12 3v4m0 10v4M3 12h4m10 0h4M6.3 6.3l2.1 2.1m7.2 7.2 2.1 2.1m0-11.4-2.1 2.1M8.4 15.6l-2.1 2.1"/>',
    infinity: '<path d="M8 15a3 3 0 1 1 0-6c4 0 4 6 8 6a3 3 0 1 0 0-6c-4 0-4 6-8 6Z"/>',
    flask: '<path d="M9 3h6"/><path d="M10 3v5.5L4.5 18a2 2 0 0 0 1.8 3h11.4a2 2 0 0 0 1.8-3L14 8.5V3"/><path d="M7 14h10"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>',
    skull: '<path d="M12 3a7.5 7.5 0 0 0-7.5 7.5c0 3 1.7 5 3.5 5.7V19a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.8c1.8-.7 3.5-2.7 3.5-5.7A7.5 7.5 0 0 0 12 3Z"/><circle cx="9" cy="11" r="1.2" fill="currentColor"/><circle cx="15" cy="11" r="1.2" fill="currentColor"/><path d="M11 17v1.5M13 17v1.5"/>',
    orbit3d: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="9" ry="3.4"/><ellipse cx="12" cy="12" rx="3.4" ry="9"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/>',
    wave: '<path d="M2 12c2.5-6 5-6 7.5 0s5 6 7.5 0 3.5-5 5-2.5"/>',
    sliders: '<path d="M5 4v6M5 14v6M12 4v10M12 18v2M19 4v4M19 12v8"/><circle cx="5" cy="12" r="2"/><circle cx="12" cy="16" r="2"/><circle cx="19" cy="10" r="2"/>',
    grid: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9.3 4v16M14.6 4v16M4 9.3h16M4 14.6h16"/>',
    pencil: '<path d="M4 20l.8-3.8L15.5 5.5a2.1 2.1 0 0 1 3 3L7.8 19.2 4 20Z"/><path d="M13.5 7.5l3 3"/>',
  };
  window.QML = window.QML || {};
  window.QML.icon = function (name, size) {
    const d = P[name] || P.atom;
    const s = size || 24;
    return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  };
  window.QML.ICONS = P;
})();
