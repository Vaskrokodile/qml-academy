(function () {
  const bank = window.QML_PRACTICAL_BANK || [];
  if (!window.QML_EVALS || window.QML_EVALS.some(e => e.id === 'eval-practical-pipeline')) return;
  window.QML_EVALS.push({
    id: 'eval-practical-pipeline',
    title: 'Practical QML Pipeline Readiness',
    description: 'A rigorous scenario-based check across problem framing, data leakage, baselines, feature maps, variational training, evaluation, and reproducible serving.',
    icon: 'flask',
    themes: ['practical'],
    timeMin: 45,
    questions: bank.map(q => ({ ref: q.id, topic: 'practical' })),
  });
})();
