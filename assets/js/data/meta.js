/* ============================================================
   QML_META_QUESTIONS — meta-cognition drills: map concepts to
   pictures and back. Two question shapes (both kind:'mcq'):

   A) viz on the prompt + text options:
     { viz:{type:'bloch',state:'plus'}, options:[...], answer }
   B) text prompt + visual option tiles:
     { vizOptions:[viz,viz,viz,viz], options:[labels for review], answer }

   Rendered via QML.viz(). topic:'meta'; domain = real topic id
   for per-domain stats (metaDomains).
   ============================================================ */
(function () {
  const Q = [];
  let n = 0;
  const pad = k => 'm' + String(k).padStart(3, '0');
  const q = o => { o.id = pad(++n); o.topic = 'meta'; o.kind = o.kind || 'mcq'; Q.push(o); };

  /* ---------- A. Bloch sphere → state ---------- */
  const BLOCH = [
    { st: 'zero',   sym: '$|0\\rangle$',      viz: { type: 'bloch', state: 'zero' } },
    { st: 'one',    sym: '$|1\\rangle$',      viz: { type: 'bloch', state: 'one' } },
    { st: 'plus',   sym: '$|+\\rangle$',      viz: { type: 'bloch', state: 'plus' } },
    { st: 'minus',  sym: '$|-\\rangle$',      viz: { type: 'bloch', state: 'minus' } },
    { st: 'plusi',  sym: '$|{+i}\\rangle$',   viz: { type: 'bloch', state: 'plusi' } },
    { st: 'minusi', sym: '$|{-i}\\rangle$',   viz: { type: 'bloch', state: 'minusi' } },
  ];
  BLOCH.forEach((b, i) => {
    const others = BLOCH.filter(x => x !== b).map(x => x.sym);
    const ds = [others[(i + 1) % 5], others[(i + 2) % 5], others[(i + 3) % 5]];
    const options = ds.slice(); options.splice(i % 4, 0, b.sym);
    q({ domain: 'states', diff: i > 3 ? 2 : 1,
      prompt: 'Which state does this Bloch vector represent?',
      viz: b.viz, options, answer: options.indexOf(b.sym),
      explain: 'The arrow points along ' + b.sym + ' — poles are |0⟩/|1⟩, equator axes are |±⟩ and |±i⟩.' });
  });

  /* ---------- B. amplitude diagrams → state (relative phase!) ---------- */
  const AMPS = [
    { amps: [0.707, 0.707],  sym: '$|+\\rangle$',    lab: 'equal, same sign' },
    { amps: [0.707, -0.707], sym: '$|-\\rangle$',    lab: 'equal, opposite sign' },
    { amps: [0.707, 'i'],    sym: '$|{+i}\\rangle$', lab: 'real + imaginary' },
    { amps: [1, 0],          sym: '$|0\\rangle$',    lab: 'all on |0⟩' },
    { amps: [0, 1],          sym: '$|1\\rangle$',    lab: 'all on |1⟩' },
    { amps: [-0.707, 0.707], sym: '$-|+\\rangle$',   lab: 'flipped signs' },
  ];
  AMPS.forEach((a, i) => {
    const others = AMPS.filter(x => x !== a);
    const pics = [others[(i + 1) % 5], others[(i + 2) % 5], others[(i + 4) % 5]].map(o => ({ type: 'amps', amps: o.amps, labels: ['|0⟩', '|1⟩'] }));
    pics.splice(i % 4, 0, { type: 'amps', amps: a.amps, labels: ['|0⟩', '|1⟩'] });
    const labels = pics.map(p => '(' + p.amps.map(v => v === 'i' ? '+i·0.7' : (v > 0 ? '+' : '') + v) + ')');
    q({ domain: 'states', diff: 2,
      prompt: 'Which amplitude diagram is ' + a.sym + '? (bar below the axis = negative amplitude, dashed = imaginary)',
      vizOptions: pics, options: labels, answer: i % 4,
      explain: a.sym + ' has amplitudes ' + a.lab + ' — only that bar pattern matches, signs included.' });
  });

  /* ---------- C. probability histograms ---------- */
  q({ domain: 'states', diff: 1,
    prompt: 'Repeated measurement of a qubit gives these statistics. Which state fits?',
    viz: { type: 'bars', probs: [1, 0], labels: ['0', '1'] },
    options: ['$|0\\rangle$', '$|1\\rangle$', '$|+\\rangle$', '$|-\\rangle$'],
    answer: 0,
    explain: 'All shots land on 0 — the state is |0⟩ (up to a global phase).' });
  q({ domain: 'states', diff: 1,
    prompt: 'These are Z-basis measurement stats. Which state fits?',
    viz: { type: 'bars', probs: [0, 1], labels: ['0', '1'] },
    options: ['$|0\\rangle$', '$|1\\rangle$', '$|+\\rangle$', '$|{+i}\\rangle$'],
    answer: 1,
    explain: 'Every shot returns 1 — definite Z-eigenstate |1⟩.' });
  q({ domain: 'states', diff: 2,
    prompt: '50/50 statistics in the computational basis. Which of these could produce it?',
    viz: { type: 'bars', probs: [0.5, 0.5], labels: ['0', '1'] },
    options: ['$|+\\rangle$', '$|0\\rangle$', '$|1\\rangle$', '$\\frac{3}{5}|0\\rangle + \\frac{4}{5}|1\\rangle$'],
    answer: 0,
    explain: 'Equal Z-basis odds need |α|² = |β|² = ½ — |+⟩ qualifies (so would |−⟩, |±i⟩).' });
  q({ domain: 'multi', diff: 2,
    prompt: 'A two-qubit state measured in the computational basis gives this histogram. Which state is it?',
    viz: { type: 'bars', probs: [0.5, 0, 0, 0.5], labels: ['00', '01', '10', '11'] },
    options: ['$\\frac{|00\\rangle+|01\\rangle}{\\sqrt{2}}$', '$|\\Phi^{+}\\rangle = \\frac{|00\\rangle+|11\\rangle}{\\sqrt{2}}$', '$|00\\rangle$', '$\\frac{|01\\rangle+|10\\rangle}{\\sqrt{2}}$'],
    answer: 1,
    explain: 'Perfect correlation with only 00 and 11 outcomes — the Bell state |Φ+⟩.' });
  q({ domain: 'multi', diff: 3,
    prompt: 'Which histogram belongs to |Ψ+⟩ = (|01⟩+|10⟩)/√2?',
    vizOptions: [
      { type: 'bars', probs: [0.5, 0, 0, 0.5], labels: ['00', '01', '10', '11'] },
      { type: 'bars', probs: [0, 0.5, 0.5, 0], labels: ['00', '01', '10', '11'] },
      { type: 'bars', probs: [0.25, 0.25, 0.25, 0.25], labels: ['00', '01', '10', '11'] },
      { type: 'bars', probs: [0, 0, 0, 1], labels: ['00', '01', '10', '11'] },
    ],
    options: ['only 00 and 11', 'only 01 and 10', 'uniform 25% each', 'all 11'],
    answer: 1,
    explain: 'Ψ+ only ever yields 01 or 10 — anticorrelated outcomes, half each.' });
  q({ domain: 'measure', diff: 2,
    prompt: 'Roughly how many shots produced this estimate for |+⟩? (true p = 50%)',
    viz: { type: 'bars', probs: [0.48, 0.52], labels: ['0', '1'], vals: true },
    options: ['4 shots', 'About 100 shots', 'About 2500 shots', 'Exactly 10 shots'],
    answer: 2,
    explain: 'Sampling error scales as 1/√N — a 2% deviation needs thousands of shots.' });

  /* ---------- D. circuits ---------- */
  q({ domain: 'gatemodel', diff: 1,
    prompt: 'Starting from |0⟩, what does this circuit output?',
    viz: { type: 'circuit', wires: ['q0'], gates: [{ g: 'H', w: 0 }] },
    options: ['$|0\\rangle$', '$|1\\rangle$', '$|+\\rangle$', '$|-\\rangle$'],
    answer: 2,
    explain: 'H|0⟩ = |+⟩ — Hadamard turns a basis state into an equal superposition.' });
  q({ domain: 'gatemodel', diff: 2,
    prompt: 'Starting from |0⟩, what does this circuit output?',
    viz: { type: 'circuit', wires: ['q0'], gates: [{ g: 'X', w: 0 }, { g: 'H', w: 0 }] },
    options: ['$|+\\rangle$', '$|-\\rangle$', '$|0\\rangle$', '$|1\\rangle$'],
    answer: 1,
    explain: 'X first: |0⟩→|1⟩. Then H: |1⟩→|−⟩. Gates apply left to right.' });
  q({ domain: 'gatemodel', diff: 1,
    prompt: 'Starting from |0⟩, what does this circuit output?',
    viz: { type: 'circuit', wires: ['q0'], gates: [{ g: 'H', w: 0 }, { g: 'H', w: 0 }] },
    options: ['$|0\\rangle$', '$|+\\rangle$', '$|-\\rangle$', '$|1\\rangle$'],
    answer: 0,
    explain: 'H is its own inverse: HH = I, so |0⟩ returns to |0⟩.' });
  q({ domain: 'gatemodel', diff: 2,
    prompt: 'This symbol — a solid control dot wired to a ⊕ — denotes which gate?',
    viz: { type: 'circuit', wires: ['q0', 'q1'], gates: [{ g: 'CX', c: 0, t: 1 }] },
    options: ['SWAP', 'CNOT (controlled-X)', 'Controlled-Z', 'A measurement'],
    answer: 1,
    explain: 'Dot = control, ⊕ = target bit-flip: the CNOT/CX gate.' });
  q({ domain: 'multi', diff: 2,
    prompt: 'Both qubits start in |0⟩. What does this circuit prepare?',
    viz: { type: 'circuit', wires: ['q0', 'q1'], gates: [{ g: 'H', w: 0 }, { g: 'CX', c: 0, t: 1 }] },
    options: ['$|00\\rangle$', '$|\\Phi^{+}\\rangle = \\frac{|00\\rangle+|11\\rangle}{\\sqrt{2}}$', '$|+\\rangle|0\\rangle$', '$|\\Psi^{-}\\rangle$'],
    answer: 1,
    explain: 'H puts q0 in |+⟩; CNOT copies it to q1 — entangling (|00⟩+|11⟩)/√2, a Bell state.' });
  q({ domain: 'multi', diff: 3,
    prompt: 'Which circuit creates |Φ+⟩ = (|00⟩+|11⟩)/√2 from |00⟩?',
    vizOptions: [
      { type: 'circuit', wires: ['q0', 'q1'], gates: [{ g: 'H', w: 0 }, { g: 'CX', c: 0, t: 1 }] },
      { type: 'circuit', wires: ['q0', 'q1'], gates: [{ g: 'X', w: 0 }, { g: 'CX', c: 0, t: 1 }] },
      { type: 'circuit', wires: ['q0', 'q1'], gates: [{ g: 'H', w: 0 }, { g: 'H', w: 0 }] },
      { type: 'circuit', wires: ['q0', 'q1'], gates: [{ g: 'CX', c: 0, t: 1 }] },
    ],
    options: ['H on q0, then CX', 'X on q0, then CX', 'H twice on q0', 'CX alone'],
    answer: 0,
    explain: 'H creates the superposition, CNOT spreads it — entanglement needs exactly this pattern.' });
  q({ domain: 'gatemodel', diff: 2,
    prompt: 'What does the meter box at the end of a wire do?',
    viz: { type: 'circuit', wires: ['q0'], gates: [{ g: 'H', w: 0 }, { g: 'M', w: 0 }] },
    options: ['Resets the qubit to |0⟩', 'Measures the qubit in the Z basis, collapsing the state', 'Applies a Z gate', 'Stores the qubit in memory'],
    answer: 1,
    explain: 'The meter symbol is a computational-basis measurement — it collapses |+⟩ here to 0 or 1, half each.' });
  q({ domain: 'gatemodel', diff: 3,
    prompt: 'In which order does the matrix product XH|ψ⟩ apply the gates of this circuit?',
    viz: { type: 'circuit', wires: ['q0'], gates: [{ g: 'H', w: 0 }, { g: 'X', w: 0 }] },
    options: ['H first, then X — matrices apply right-to-left', 'X first, then H', 'Simultaneously', 'It is ambiguous'],
    answer: 0,
    explain: 'Circuit time flows left→right, but matrix products apply right→left: XH|ψ⟩ = X(H|ψ⟩).' });
  q({ domain: 'gatemodel', diff: 2,
    prompt: 'What does this two-dot connection denote?',
    viz: { type: 'circuit', wires: ['q0', 'q1'], gates: [{ g: 'CZ', c: 0, t: 1 }] },
    options: ['CNOT', 'SWAP', 'Controlled-Z — a −1 phase on |11⟩', 'A Bell measurement'],
    answer: 2,
    explain: 'Two linked dots is a controlled-phase (CZ): it phases only the |11⟩ component.' });
  q({ domain: 'algorithms', diff: 3,
    prompt: 'This fragment — ancilla H, controlled-SWAP, H, measure — estimates…',
    viz: { type: 'circuit', wires: ['a', 'q1'], gates: [{ g: 'H', w: 0 }, { g: 'SWAP', c: 0, t: 1 }, { g: 'H', w: 0 }, { g: 'M', w: 0 }] },
    options: ['$|\\langle\\psi|\\varphi\\rangle|^{2}$ — the swap test', 'The eigenphase — QPE', 'The kernel matrix', 'The condition number κ'],
    answer: 0,
    explain: 'H–CSWAP–H on an ancilla is the swap test: P(0) = (1+|⟨ψ|φ⟩|²)/2 reads out the overlap.' });

  /* ---------- E. matrices → gates ---------- */
  const MATS = [
    { m: [[1, 0], [0, 1]],   name: 'identity I' },
    { m: [[0, 1], [1, 0]],   name: 'Pauli X (NOT)' },
    { m: [[1, 0], [0, -1]],  name: 'Pauli Z' },
    { m: [[0, '−i'], ['i', 0]], name: 'Pauli Y' },
    { m: [[1, 0], [0, 'i']],   name: 'phase gate S' },
    { m: [['a', 'a'], ['a', '−a']], name: 'Hadamard H', note: 'a = 1/√2' },
  ];
  MATS.forEach((g, i) => {
    const others = MATS.filter(x => x !== g).map(x => x.name);
    const ds = [others[(i + 1) % 5], others[(i + 3) % 5], others[(i + 4) % 5]];
    const options = ds.slice(); options.splice(i % 4, 0, g.name);
    q({ domain: 'gatemodel', diff: i >= 3 ? 2 : 1,
      prompt: 'Which gate has this matrix?' + (g.note ? ' (a = 1/√2)' : ''),
      viz: { type: 'matrix', m: g.m }, options, answer: options.indexOf(g.name),
      explain: 'That matrix is ' + g.name + ' — match the entry pattern.' });
  });
  q({ domain: 'gatemodel', diff: 2,
    prompt: 'Which matrix is the Hadamard? (a = 1/√2)',
    vizOptions: [
      { type: 'matrix', m: [[0, 1], [1, 0]] },
      { type: 'matrix', m: [[1, 0], [0, -1]] },
      { type: 'matrix', m: [['a', 'a'], ['a', '−a']] },
      { type: 'matrix', m: [[1, 0], [0, 'i']] },
    ],
    options: ['[[0,1],[1,0]]', '[[1,0],[0,−1]]', '[[a,a],[a,−a]]', '[[1,0],[0,i]]'],
    answer: 2,
    explain: 'H = (1/√2)[[1,1],[1,−1]] — all entries equal magnitude, one sign flip.' });
  q({ domain: 'gatemodel', diff: 2,
    prompt: 'Which matrix is Pauli-X?',
    vizOptions: [
      { type: 'matrix', m: [[1, 0], [0, -1]] },
      { type: 'matrix', m: [[0, 1], [1, 0]] },
      { type: 'matrix', m: [[1, 0], [0, 1]] },
      { type: 'matrix', m: [[0, '-i'], ['i', 0]] },
    ],
    options: ['[[1,0],[0,−1]]', '[[0,1],[1,0]]', 'identity', '[[0,−i],[i,0]]'],
    answer: 1,
    explain: 'X swaps the basis: off-diagonal 1s — the quantum NOT.' });

  /* ---------- F. curves ---------- */
  const CURVE_QS = [
    { shape: 'flat',  what: 'a barren plateau — cost gradients vanish', diff: 2,
      ex: 'A flat cost landscape means ∇C ≈ 0 everywhere — the signature training hazard of deep variational circuits.' },
    { shape: 'drop',  what: 'successful training — cost C(θ) converging', diff: 1,
      ex: 'A decaying cost curve means the optimizer is descending the landscape — training is working.' },
    { shape: 's',     what: 'an annealing schedule — H₀ ramping into H_P', diff: 2,
      ex: 'H(s) = (1−s)H₀ + sH_P interpolates driver→problem; the S-curve shows the ramp over time.' },
    { shape: 'decay', what: 'T1 relaxation — energy decay of |1⟩ to |0⟩', diff: 2,
      ex: 'Exponential decay of excited-state population is T1 relaxation — the qubit loses energy to its environment.' },
    { shape: 'ring',  what: 'dephasing / damped oscillation — coherence fading (T2)', diff: 3,
      ex: 'Oscillations dying out = phase coherence decaying — that is T2 dephasing.' },
    { shape: 'gap',   what: 'the spectral gap shrinking at the avoided crossing', diff: 3,
      ex: 'The dip is the minimum energy gap Δ_min during annealing — adiabaticity demands slowing there.' },
    { shape: 'barrier', what: 'tunneling through an energy barrier', diff: 3,
      ex: 'The wavefunction leaking through a classically forbidden region — quantum tunneling, exploited by annealers.' },
  ];
  CURVE_QS.forEach((c, i) => {
    const others = CURVE_QS.filter(x => x !== c).map(x => x.what);
    const ds = [others[(i + 2) % 6], others[(i + 4) % 6], others[(i + 5) % 6]];
    const options = ds.slice(); options.splice(i % 4, 0, c.what);
    q({ domain: ['vqa', 'annealing', 'mixed', 'dynamics'][i % 4], diff: c.diff,
      prompt: 'What does this curve depict?',
      viz: { type: 'curve', shape: c.shape, xlabel: 't', ylabel: c.shape === 's' ? 'H' : c.shape === 'gap' ? 'E' : 'C' },
      options, answer: options.indexOf(c.what), explain: c.ex });
  });
  q({ domain: 'vqa', diff: 2,
    prompt: 'Which curve is the signature of a barren plateau?',
    vizOptions: [
      { type: 'curve', shape: 'drop' }, { type: 'curve', shape: 'flat' },
      { type: 'curve', shape: 's' }, { type: 'curve', shape: 'ring' },
    ],
    options: ['descending curve', 'flat landscape', 'S-curve', 'dying oscillation'],
    answer: 1,
    explain: 'Barren plateaus are flat: exponentially small gradients everywhere kill gradient-based training.' });
  q({ domain: 'annealing', diff: 2,
    prompt: 'Which curve shows the annealing schedule s(t): H₀ → H_P?',
    vizOptions: [
      { type: 'curve', shape: 's' }, { type: 'curve', shape: 'decay' },
      { type: 'curve', shape: 'flat' }, { type: 'curve', shape: 'ring' },
    ],
    options: ['S-ramp', 'exponential decay', 'flat', 'damped oscillation'],
    answer: 0,
    explain: 'The schedule interpolates Hamiltonians over time — the rising S-curve from driver to problem.' });

  /* ---------- G. density-matrix heatmaps ---------- */
  const RHO = [
    { cells: [[1, 0], [0, 0]],      name: '$|0\\rangle\\langle 0|$', what: 'pure |0⟩' },
    { cells: [[0.5, 0.5], [0.5, 0.5]], name: '$|+\\rangle\\langle +|$', what: 'pure |+⟩' },
    { cells: [[0.5, 0], [0, 0.5]],  name: '$\\frac{I}{2}$', what: 'maximally mixed' },
    { cells: [[0, 0], [0, 1]],      name: '$|1\\rangle\\langle 1|$', what: 'pure |1⟩' },
    { cells: [[0.85, 0.2], [0.2, 0.15]], name: 'mixed, biased toward |0⟩', what: 'noisy |0⟩' },
  ];
  RHO.forEach((r, i) => {
    const others = RHO.filter(x => x !== r);
    const pics = [others[(i + 1) % 4], others[(i + 2) % 4], others[(i + 3) % 4]].map(o => ({ type: 'heat', cells: o.cells }));
    pics.splice(i % 4, 0, { type: 'heat', cells: r.cells });
    const labels = pics.map(p => 'ρ = ' + JSON.stringify(p.cells).replace(/\s/g, ''));
    q({ domain: 'mixed', diff: i >= 2 ? 3 : 2,
      prompt: 'Which density-matrix heatmap is ' + r.name + '? (brightness = |ρᵢⱼ|)',
      vizOptions: pics, options: labels, answer: i % 4,
      explain: r.name + ' is the ' + r.what + ' case — diagonal weight is population, off-diagonal is coherence.' });
  });
  q({ domain: 'mixed', diff: 2,
    prompt: 'In a density-matrix heatmap, what do bright off-diagonal cells mean?',
    viz: { type: 'heat', cells: [[0.5, 0.5], [0.5, 0.5]] },
    options: ['Coherence — the state has a definite phase relation', 'Classical randomness only', 'The matrix is invalid', 'Entanglement between two qubits'],
    answer: 0,
    explain: 'Off-diagonal |ρ₀₁| tracks coherence; a fully mixed state has black off-diagonals.' });
  q({ domain: 'mixed', diff: 3,
    prompt: 'This heatmap shows equal diagonal population but no off-diagonal — what is it?',
    viz: { type: 'heat', cells: [[0.5, 0], [0, 0.5]] },
    options: ['$|+\\rangle\\langle+|$', 'The maximally mixed state $I/2$', '$|0\\rangle$', 'An entangled pair'],
    answer: 1,
    explain: 'Half probability each way with zero coherence — a classical coin flip, ρ = I/2.' });

  /* ---------- H. flow / pipeline diagrams ---------- */
  q({ domain: 'encoding', diff: 2,
    prompt: 'This pipeline maps a data vector x through U_Φ(x) into a quantum state. What does the middle block represent?',
    viz: { type: 'flow', nodes: ['x', 'U_Φ(x)', '|ψ(x)⟩'], hi: 1 },
    options: ['The feature map — data encoded into a state', 'The loss function', 'A measurement', 'The ansatz'],
    answer: 0,
    explain: 'Φ is the feature map: an encoding unitary that embeds classical x into |ψ(x)⟩.' });
  q({ domain: 'vqa', diff: 2,
    prompt: 'Which pipeline is the variational (VQE-style) loop?',
    vizOptions: [
      { type: 'flow', nodes: ['U(θ)|0⟩', '⟨H⟩_θ', '∇C', 'θ ← θ−η∇C'] },
      { type: 'flow', nodes: ['x', 'U_Φ(x)', '|ψ(x)⟩'] },
      { type: 'flow', nodes: ['|ψ⟩', '|φ⟩', 'swap test', '|⟨ψ|φ⟩|²'] },
      { type: 'flow', nodes: ['A', 'e^{iAt}', 'QPE', '|x⟩'] },
    ],
    options: ['ansatz → cost → gradient → update', 'x → encoding → state', 'swap test → overlap', 'HHL pipeline'],
    answer: 0,
    explain: 'Prepare the ansatz, measure the cost expectation, shift for gradients, update θ — the hybrid loop.' });
  q({ domain: 'algorithms', diff: 2,
    prompt: 'What does this pipeline compute?',
    viz: { type: 'flow', nodes: ['A', 'e^{iAt}', 'QPE', '|x⟩'], hi: 3 },
    options: ['A quantum kernel', 'The HHL solution |x⟩ ∝ A⁻¹b', 'Grover search', 'A feature map'],
    answer: 1,
    explain: 'Exponentiate A, phase-estimate eigenvalues, invert them — the HHL linear-system pipeline.' });
  q({ domain: 'mlmethods', diff: 2,
    prompt: 'This pipeline estimates a quantity used in kernel methods. What is it?',
    viz: { type: 'flow', nodes: ['|ψ(x)⟩', '|ψ(x′)⟩', 'swap test', 'K(x,x′)'], hi: 3 },
    options: ['A quantum kernel K(x,x′) = |⟨ψ(x′)|ψ(x)⟩|²', 'The condition number', 'The cost function', 'Amplitude encoding'],
    answer: 0,
    explain: 'The kernel is the squared overlap of two encoded data states — estimated by a swap test.' });

  /* ---------- I. equation tiles ---------- */
  q({ domain: 'measure', diff: 1,
    prompt: 'Which expression is the Born rule?',
    vizOptions: [
      { type: 'tex', tex: '$|\\langle x|\\psi\\rangle|^{2}$' },
      { type: 'tex', tex: '$\\langle\\psi|\\psi\\rangle$' },
      { type: 'tex', tex: '$|\\psi\\rangle\\langle\\varphi|$' },
      { type: 'tex', tex: '$\\mathrm{Tr}(\\rho)$' },
    ],
    options: ['squared overlap', 'the norm', 'outer product', 'trace of ρ'],
    answer: 0,
    explain: 'Born rule: outcome probability = squared magnitude of the amplitude |⟨x|ψ⟩|².' });
  q({ domain: 'vqa', diff: 2,
    prompt: 'Which expression is the parameter-shift gradient rule?',
    vizOptions: [
      { type: 'tex', tex: '$\\frac{C(\\theta+s)-C(\\theta-s)}{2\\sin s}$' },
      { type: 'tex', tex: '$\\theta \\leftarrow \\theta - \\eta\\nabla C$' },
      { type: 'tex', tex: '$C(\\theta) = \\langle\\psi(\\theta)|H|\\psi(\\theta)\\rangle$' },
      { type: 'tex', tex: '$U^{\\dagger}U = I$' },
    ],
    options: ['two shifted evaluations', 'gradient descent update', 'cost as expectation', 'unitarity'],
    answer: 0,
    explain: 'Parameter shift: exact ∂C/∂θ from two cost evaluations at θ±s — no hardware-level gradients needed.' });
  q({ domain: 'mixed', diff: 2,
    prompt: 'Which expression tests whether ρ is pure?',
    vizOptions: [
      { type: 'tex', tex: '$\\mathrm{Tr}(\\rho) = 1$' },
      { type: 'tex', tex: '$\\mathrm{Tr}(\\rho^{2}) = 1$' },
      { type: 'tex', tex: '$\\rho^{\\dagger} = \\rho$' },
      { type: 'tex', tex: '$\\rho \\succeq 0$' },
    ],
    options: ['trace is 1', 'Tr ρ² = 1', 'ρ Hermitian', 'ρ positive'],
    answer: 1,
    explain: 'Tr ρ = 1, Hermiticity and positivity hold for every density matrix — only purity Tr ρ² = 1 singles out pure states.' });
  q({ domain: 'mlmethods', diff: 2,
    prompt: 'Which expression is a quantum kernel entry?',
    vizOptions: [
      { type: 'tex', tex: '$K(x,x^{\\prime}) = |\\langle\\psi(x^{\\prime})|\\psi(x)\\rangle|^{2}$' },
      { type: 'tex', tex: '$\\mathcal{L}(\\theta) = \\tfrac{1}{N}\\sum (y - \\hat{y})^{2}$' },
      { type: 'tex', tex: '$f_{\\theta}(x) = \\langle O\\rangle_{x}$' },
      { type: 'tex', tex: '$\\kappa = \\lambda_{\\max}/\\lambda_{\\min}$' },
    ],
    options: ['kernel = squared overlap', 'loss = squared error', 'model = expectation', 'κ = condition number'],
    answer: 0,
    explain: 'The kernel matrix entry is the squared overlap of two data-encoding quantum states.' });
  q({ domain: 'algorithms', diff: 3,
    prompt: 'Which quantity limits HHL speed the most?',
    vizOptions: [
      { type: 'tex', tex: '$\\kappa = \\frac{\\lambda_{\\max}}{\\lambda_{\\min}}$' },
      { type: 'tex', tex: '$\\sqrt{N}$' },
      { type: 'tex', tex: '$n_{\\text{shots}}$' },
      { type: 'tex', tex: '$2^{n}$' },
    ],
    options: ['condition number κ', '√N scaling', 'shot count', 'Hilbert dimension'],
    answer: 0,
    explain: 'HHL is polylog in N but polynomial in κ — ill-conditioned matrices erase the exponential speedup.' });
  q({ domain: 'dynamics', diff: 2,
    prompt: 'Which expression says observables A and B are compatible?',
    vizOptions: [
      { type: 'tex', tex: '$[A,B] = AB - BA = 0$' },
      { type: 'tex', tex: '$\\{A,B\\} = AB + BA$' },
      { type: 'tex', tex: '$A^{\\dagger} = A$' },
      { type: 'tex', tex: '$\\mathrm{Tr}(AB) = 0$' },
    ],
    options: ['commutator vanishes', 'anticommutator', 'Hermitian', 'traceless product'],
    answer: 0,
    explain: '[A,B] = 0 means they share eigenvectors and can be measured jointly.' });

  /* ---------- J. metacognitive conceptual ---------- */
  q({ domain: 'math', diff: 1,
    prompt: 'Memory anchor: a ket |ψ⟩ looks like a bracket pointing right. Which visual does the bra ⟨ψ| mirror?',
    vizOptions: [
      { type: 'tex', tex: '$\\langle\\psi|$ — a row vector (bra)' },
      { type: 'tex', tex: '$|\\psi\\rangle$ — a column vector (ket)' },
      { type: 'tex', tex: '$\\langle\\varphi|\\psi\\rangle$ — an inner product' },
      { type: 'tex', tex: '$|\\psi\\rangle\\langle\\varphi|$ — an outer product' },
    ],
    options: ['row vector', 'column vector', 'scalar', 'operator'],
    answer: 0,
    explain: 'The bra is the mirror image of the ket — a left-facing bracket, a row vector.' });
  q({ domain: 'annealing', diff: 2,
    prompt: 'An Ising energy diagram shows spins σ_i^z σ_j^z linked by J_ij edges. What does J_ij control?',
    vizOptions: [
      { type: 'tex', tex: 'coupling strength between spins i and j' },
      { type: 'tex', tex: 'the local field on spin i' },
      { type: 'tex', tex: 'the transverse field' },
      { type: 'tex', tex: 'the annealing schedule' },
    ],
    options: ['coupler', 'local field h', 'transverse Γ', 'schedule s(t)'],
    answer: 0,
    explain: 'J_ij weights the pairwise coupling term — h_i is the single-spin field, Γ drives tunneling.' });
  q({ domain: 'encoding', diff: 2,
    prompt: 'Which encoding stores N features in the amplitudes of only log₂N qubits?',
    vizOptions: [
      { type: 'tex', tex: 'basis encoding — bits in basis states' },
      { type: 'tex', tex: 'amplitude encoding — numbers in amplitudes' },
      { type: 'tex', tex: 'angle encoding — features in rotation angles' },
      { type: 'tex', tex: 'data re-uploading' },
    ],
    options: ['basis', 'amplitude', 'angle', 're-uploading'],
    answer: 1,
    explain: 'Amplitude encoding is exponentially dense: log₂N qubits hold N numbers — costly to prepare though.' });
  q({ domain: 'vqa', diff: 2,
    prompt: 'Visually, the ansatz U(θ) in a VQA circuit is usually drawn as…',
    vizOptions: [
      { type: 'flow', nodes: ['|0⟩', 'U(θ)', '⟨H⟩'] },
      { type: 'circuit', wires: ['q0', 'q1'], gates: [{ g: 'H', w: 0 }, { g: 'CX', c: 0, t: 1 }] },
      { type: 'curve', shape: 's' },
      { type: 'heat', cells: [[0.5, 0.5], [0.5, 0.5]] },
    ],
    options: ['parametrized block feeding a measurement', 'Bell circuit', 'schedule curve', 'density matrix'],
    answer: 0,
    explain: 'The ansatz is a parametrized circuit block — tune θ, then measure the cost expectation.' });
  q({ domain: 'measure', diff: 2,
    prompt: 'A Bloch vector pointing along +x is measured in the Z basis. Which histogram results?',
    vizOptions: [
      { type: 'bars', probs: [0.5, 0.5], labels: ['0', '1'] },
      { type: 'bars', probs: [1, 0], labels: ['0', '1'] },
      { type: 'bars', probs: [0, 1], labels: ['0', '1'] },
      { type: 'bars', probs: [0.85, 0.15], labels: ['0', '1'] },
    ],
    options: ['50/50', 'all 0', 'all 1', '85/15'],
    answer: 0,
    explain: 'X-axis states |+⟩ are unbiased in Z — |⟨0|+⟩|² = |⟨1|+⟩|² = ½.' });
  q({ domain: 'measure', diff: 3,
    prompt: 'A Bloch vector on the +z pole is measured in the X basis instead. Which histogram?',
    vizOptions: [
      { type: 'bars', probs: [1, 0], labels: ['+', '−'] },
      { type: 'bars', probs: [0.5, 0.5], labels: ['+', '−'] },
      { type: 'bars', probs: [0, 1], labels: ['+', '−'] },
      { type: 'bars', probs: [0.9, 0.1], labels: ['+', '−'] },
    ],
    options: ['certain +', '50/50', 'certain −', '90/10'],
    answer: 1,
    explain: 'Measuring |0⟩ in the X basis is unbiased — orthogonal axes give coin-flip statistics.' });
  q({ domain: 'multi', diff: 2,
    prompt: 'Two qubits wired as a Bell pair — measuring one collapses the other. Which picture shows a PRODUCT (non-entangled) state?',
    vizOptions: [
      { type: 'tex', tex: '$\\frac{|00\\rangle+|11\\rangle}{\\sqrt{2}}$' },
      { type: 'tex', tex: '$|+\\rangle \\otimes |0\\rangle$' },
      { type: 'tex', tex: '$\\frac{|01\\rangle-|10\\rangle}{\\sqrt{2}}$' },
      { type: 'tex', tex: '$\\frac{|00\\rangle-|11\\rangle}{\\sqrt{2}}$' },
    ],
    options: ['Φ+ Bell', 'product |+⟩|0⟩', 'Ψ− singlet', 'Φ− Bell'],
    answer: 1,
    explain: '|+⟩⊗|0⟩ factors into separate one-qubit states — no entanglement. The other three are Bell states.' });
  q({ domain: 'dynamics', diff: 2,
    prompt: 'Time evolution is drawn as U(t) = e^{−iHt/ℏ}. In this picture the Hamiltonian H acts as…',
    vizOptions: [
      { type: 'flow', nodes: ['|ψ(0)⟩', 'e^{-iHt}', '|ψ(t)⟩'], hi: 1 },
      { type: 'flow', nodes: ['x', 'Φ(x)', '|ψ(x)⟩'] },
      { type: 'curve', shape: 'decay' },
      { type: 'bars', probs: [0.5, 0.5], labels: ['0', '1'] },
    ],
    options: ['the generator of the evolution', 'a feature map', 'a decay curve', 'measurement stats'],
    answer: 0,
    explain: 'Exponentiating H yields the unitary that moves states forward — H generates time evolution.' });

  /* ============================================================
     INTERACTIVE BLOCK — build it yourself, don't just name it.
     kinds: blochset · gateseq · predict · selfexp (see interact.js)
     conf:true on any mcq adds a mandatory confidence judgment first.
     ============================================================ */

  /* ---------- blank-canvas state construction (generation effect) ---------- */
  q({ domain: 'states', diff: 2, kind: 'blochset',
    prompt: 'Build **$|+\\rangle$** on the sphere. θ controls the |0⟩/|1⟩ balance, φ the phase.',
    target: { theta: 90, phi: 0 }, conf: true,
    explain: '$|+\\rangle$ sits on the equator at φ = 0 — θ = 90° equalizes, phase zero keeps it real-positive.' });
  q({ domain: 'states', diff: 2, kind: 'blochset',
    prompt: 'Build **$|-\\rangle$** — same superposition, but the phase is flipped.',
    target: { theta: 90, phi: 180 }, conf: true,
    explain: 'φ = 180° puts the vector at −x: $\\frac{|0\\rangle-|1\\rangle}{\\sqrt{2}}$.' });
  q({ domain: 'states', diff: 3, kind: 'blochset',
    prompt: 'Build **$|{+i}\\rangle$** — the relative phase is now $e^{i\\pi/2} = i$. Where does the arrow go?',
    target: { theta: 90, phi: 90 }, conf: true,
    explain: 'φ = 90° swings the arrow along +y — imaginary relative phase.' });
  q({ domain: 'states', diff: 3, kind: 'blochset',
    prompt: 'Build **$|{-i}\\rangle$**.',
    target: { theta: 90, phi: 270 },
    explain: 'φ = 270° (−90°) is −y: $\\frac{|0\\rangle-i|1\\rangle}{\\sqrt{2}}$.' });
  q({ domain: 'states', diff: 3, kind: 'blochset',
    prompt: 'Build the state with **75% probability of |0⟩** and phase φ = 0.',
    target: { theta: 60, phi: 0 }, conf: true,
    explain: '$|\\alpha|^2 = \\cos^2(\\theta/2) = 0.75$ gives θ = 60° — probabilities fix the latitude, not the longitude.' });
  q({ domain: 'states', diff: 3, kind: 'blochset',
    prompt: 'Build $\\cos\\tfrac{\\pi}{6}|0\\rangle + e^{i\\pi/3}\\sin\\tfrac{\\pi}{6}|1\\rangle$.',
    target: { theta: 60, phi: 60 },
    explain: 'θ = 60° (since θ/2 = π/6), φ = 60° — read the parametrization literally.' });

  /* ---------- circuit construction (generation + transfer) ---------- */
  q({ domain: 'gatemodel', diff: 1, kind: 'gateseq',
    prompt: 'Starting from $|0\\rangle$, construct **$|+\\rangle$** with the gate palette.',
    start: 'zero', target: 'plus', maxMoves: 3, conf: true,
    explain: 'One H does it. X then H, or H then Z-then… also land — any sequence reaching the vector counts.' });
  q({ domain: 'gatemodel', diff: 2, kind: 'gateseq',
    prompt: 'From $|0\\rangle$, reach **$|-\\rangle$**.',
    start: 'zero', target: 'minus', maxMoves: 4, conf: true,
    explain: 'X then H works (|0⟩→|1⟩→|−⟩). So does H then Z. Two paths, same point — feel the non-uniqueness.' });
  q({ domain: 'gatemodel', diff: 3, kind: 'gateseq',
    prompt: 'From $|0\\rangle$, build **$|{+i}\\rangle$** — you need an imaginary relative phase.',
    start: 'zero', target: 'plusi', maxMoves: 4, conf: true,
    explain: 'H then S: H equalizes, S turns the |1⟩ amplitude by i — phases are built by S/T, not H.' });
  q({ domain: 'gatemodel', diff: 3, kind: 'gateseq',
    prompt: 'From $|0\\rangle$, build **$|{-i}\\rangle$**.',
    start: 'zero', target: 'minusi', maxMoves: 4,
    explain: 'H then S† applies $-i$ to the |1⟩ branch.' });
  q({ domain: 'gatemodel', diff: 2, kind: 'gateseq',
    prompt: 'Start at $|+\\rangle$ (pretend it is loaded). Reach **$|0\\rangle$** — undo superposition.',
    start: 'plus', target: 'zero', maxMoves: 3,
    explain: 'H is self-inverse: H|+⟩ = |0⟩. Un-computing is just running the conjugate.' });
  q({ domain: 'gatemodel', diff: 3, kind: 'gateseq',
    prompt: 'From $|1\\rangle$, reach **$|{+i}\\rangle$**.',
    start: 'one', target: 'plusi', maxMoves: 5,
    explain: 'H|1⟩ = |−⟩, then S: $\\frac{|0\\rangle-i|1\\rangle}{\\sqrt{2}}$… that is |−i⟩ — you need a Z first (or X) to fix the sign.' });

  /* ---------- predict-then-reveal (pretesting effect) ---------- */
  q({ domain: 'measure', diff: 1, kind: 'predict',
    prompt: '**Predict** the Z-basis measurement histogram of $|+\\rangle$ before seeing it.',
    probs: [0.5, 0.5], labels: ['0', '1'],
    explain: 'Equal superposition → 50/50. Your guess vs. reality is the lesson — misses teach more here.' });
  q({ domain: 'measure', diff: 2, kind: 'predict',
    prompt: '$H T H |0\\rangle$ — **predict** the Z-basis histogram ($T$ adds a $\u200b\\pi/4$ phase).',
    probs: [0.854, 0.146], labels: ['0', '1'],
    explain: '$HTH|0\\rangle = \\cos\\tfrac{\\pi}{8}|0\\rangle + e^{i\\pi/4}\\sin\\tfrac{\\pi}{8}|1\\rangle$ — an 85/15 split, not 50/50: the phase changed the angle.' });
  q({ domain: 'multi', diff: 2, kind: 'predict',
    prompt: 'Bell state $|\\Phi^+\\rangle$ measured in the computational basis — **predict** the histogram.',
    probs: [0.5, 0, 0, 0.5], labels: ['00', '01', '10', '11'],
    explain: 'Only 00 and 11 ever appear — perfect correlation is entanglement\'s signature.' });
  q({ domain: 'measure', diff: 2, kind: 'predict',
    prompt: 'A state $\\sqrt{0.7}|0\\rangle + \\sqrt{0.3}|1\\rangle$ — **predict** Z-basis stats.',
    probs: [0.7, 0.3], labels: ['0', '1'],
    explain: 'Born rule: probabilities are the squared amplitudes — 70/30, not 85/15 or 50/50.' });
  q({ domain: 'multi', diff: 3, kind: 'predict',
    prompt: '$|\\Psi^+\\rangle = (|01\\rangle+|10\\rangle)/\\sqrt{2}$ measured in Z — **predict**.',
    probs: [0, 0.5, 0.5, 0], labels: ['00', '01', '10', '11'],
    explain: 'Anticorrelation: always exactly one |1⟩ — the opposite fingerprint of Φ+.' });
  q({ domain: 'vqa', diff: 3, kind: 'predict',
    prompt: 'A deep random 40-qubit ansatz: **predict** the distribution of gradient magnitudes across parameters.',
    probs: [0.9, 0.08, 0.02], labels: ['~0 (noise)', 'small', 'usable'],
    explain: 'Barren plateau — almost every gradient is indistinguishable from shot noise. Prediction vs reality is the McClean punchline.' });

  /* ---------- explain-it-back (self-explanation, g≈0.55) ---------- */
  q({ domain: 'states', diff: 2, kind: 'selfexp',
    prompt: 'A phase of $e^{i\\pi}$ on the |1⟩ amplitude is invisible in Z-basis stats but real. **Explain why** a Z measurement cannot see it — and what measurement could.',
    model: 'Probabilities are squared amplitudes: $|e^{i\\pi}\\beta|^2 = |\\beta|^2$, so Z-basis statistics cannot feel the sign. Change basis first — apply H — and the relative phase becomes an amplitude difference that measurement *can* see ($|+\\rangle$ vs $|-\\rangle$ give + vs − in the X basis).',
    rubric: ['$|\\alpha|^2$ kills the phase factor', 'need a basis change (H / X-basis) to expose it', 'relative ≠ global phase distinction'],
    explain: 'Self-graded — compare your words to the rubric honestly. The honest gap is the learning.' });
  q({ domain: 'mlmethods', diff: 3, kind: 'selfexp',
    prompt: 'A friend says: "the quantum kernel is just the overlap of two states, so it cannot beat a classical SVM." **Explain the flaw** in that reasoning.',
    model: 'The overlap is computed in a quantum feature space. If the feature map $\\Phi(x)$ is classically intractable, the kernel values themselves are hard to get classically — the SVM never sees them. Advantage lives in the embedding, not the overlap formula.',
    rubric: ['kernel values may be classically hard to compute', 'advantage comes from the feature map, not the formula', 'structure of data must match the map'],
    explain: 'Self-graded — the key is separating the formula (simple) from the values (potentially hard).' });
  q({ domain: 'vqa', diff: 2, kind: 'selfexp',
    prompt: '**Explain in your own words** why a VQA is called a *hybrid* algorithm — who computes what?',
    model: 'The quantum device evaluates the cost: run $U(\\theta)$, measure observables. The classical computer owns the loop: collects costs, updates $\\theta$ by gradient descent or a search rule, sends back new parameters. Neither half is optional.',
    rubric: ['quantum = evaluate cost/expectations', 'classical = optimizer updates θ', 'iterative loop between the two'],
    explain: 'Self-graded.' });
  q({ domain: 'annealing', diff: 3, kind: 'selfexp',
    prompt: '**Explain** why the transverse field Γ in quantum annealing must eventually go to zero — and why starting it high helps.',
    model: 'Γ generates tunneling/fluctuations: high early = explore freely, escaping local minima. But the answer must be a classical bitstring — the problem Hamiltonian has no Γ term — so it must fade to zero for the state to commit to a definite configuration.',
    rubric: ['high Γ = quantum exploration/tunneling early', 'final H must be purely the problem (classical) Hamiltonian', 'adiabatic hand-off between them'],
    explain: 'Self-graded.' });

  /* ---------- confidence-flagged MCQs (calibration practice) ---------- */
  q({ domain: 'states', diff: 2, kind: 'mcq', conf: true,
    prompt: 'How many **distinct states** can a Z-basis measurement distinguish? (e.g. $|+\\rangle$ vs $|-\\rangle$)',
    options: ['Infinitely many', 'Exactly 2', '4', 'Depends on the phase'],
    answer: 1,
    explain: 'One basis = two outcomes. Equatorial states are phase-twins to Z — indistinguishable there.' });
  q({ domain: 'math', diff: 3, kind: 'mcq', conf: true,
    prompt: '$\\langle 0 | \\psi \\rangle$ for $|\\psi\\rangle = \\tfrac{1}{2}|0\\rangle + \\tfrac{\\sqrt{3}}{2}|1\\rangle$ equals…',
    options: ['$\\tfrac{1}{4}$', '$\\tfrac{1}{2}$', '$\\tfrac{\\sqrt{3}}{2}$', '1'],
    answer: 1,
    explain: 'The overlap picks out the |0⟩ amplitude: 1/2 — probability would be 1/4.' });
  q({ domain: 'mlmethods', diff: 3, kind: 'mcq', conf: true,
    prompt: 'Two data points with $|\\langle\\psi(x)|\\psi(x^{\\prime})\\rangle|^2 = 0.98$ are, to the kernel…',
    options: ['Nearly orthogonal', 'Nearly identical in feature space', 'Distant but related', 'Misclassified'],
    answer: 1,
    explain: 'Kernel ≈ 1 means the embeddings nearly coincide — maximal similarity.' });
  q({ domain: 'gatemodel', diff: 2, kind: 'mcq', conf: true,
    prompt: 'Which sequence turns $|0\\rangle$ into $|-\\rangle$?',
    options: ['$H$ then $S$', '$X$ then $H$', '$Z$ then $H$', '$S$ then $H$'],
    answer: 1,
    explain: '|0⟩ →(X)→ |1⟩ →(H)→ |−⟩. Note Z-then-H gives |0⟩→(Z)→|0⟩→(H)→|+⟩ — order matters.' });
  q({ domain: 'mixed', diff: 3, kind: 'mcq', conf: true,
    prompt: '$\\rho = \\tfrac{1}{2}(|0\\rangle\\langle 0| + |1\\rangle\\langle 1|)$ has purity $\\mathrm{Tr}(\\rho^2) = $…',
    options: ['1', '1/2', '1/4', '0'],
    answer: 1,
    explain: '$\\rho = I/2$; $\\rho^2 = I/4$; Tr gives $2 \\cdot \\tfrac14 = \\tfrac12$ — maximally mixed.' });
  q({ domain: 'multi', diff: 3, kind: 'mcq', conf: true,
    prompt: 'Measuring qubit A of $|\\Phi^+\\rangle$ gives 0. Qubit B is now…',
    options: ['Still entangled', 'Definitely $|1\\rangle$', 'Definitely $|0\\rangle$', 'In $|+\\rangle$'],
    answer: 2,
    explain: 'Φ+ only contains |00⟩ and |11⟩ — learning A instantly fixes B. That is the correlation.' });

  /* ---------- more viz drills: kernels & ML visuals ---------- */
  q({ domain: 'mlmethods', diff: 2,
    prompt: 'Which picture is a quantum kernel pipeline?',
    vizOptions: [
      { type: 'flow', nodes: ['x', 'U_Φ(x)', 'K(x,x′)'] },
      { type: 'flow', nodes: ['|ψ(0)⟩', 'e^{-iHt}', '|ψ(t)⟩'] },
      { type: 'curve', shape: 's' },
      { type: 'heat', cells: [[1, 0], [0, 0]] },
    ],
    options: ['encode → overlap → kernel value', 'time evolution', 'annealing schedule', 'density matrix'],
    answer: 0,
    explain: 'Kernel = data → feature-map circuit → overlap value. The pipeline is the whole trick.' });
  q({ domain: 'mlmethods', diff: 2,
    prompt: 'This Gram matrix (kernel matrix) heatmap — bright diagonal, faint elsewhere — tells you…',
    viz: { type: 'heat', cells: [[1, 0.1, 0.15], [0.1, 1, 0.08], [0.15, 0.08, 1]], labels: ['rows', 'cols'] },
    options: ['The kernel concentrates — bad for learning', 'Strong self-similarity, good separation between examples', 'The data is normalized', 'Shots were insufficient'],
    answer: 1,
    explain: 'K(x,x)=1 always on the diagonal; the useful signal is how *different* off-diagonals look.' });
  q({ domain: 'mlmethods', diff: 3,
    prompt: 'All off-diagonal entries near 1.0 in this Gram matrix means…',
    viz: { type: 'heat', cells: [[1, 0.97, 0.95], [0.97, 1, 0.96], [0.95, 0.96, 1]], labels: ['rows', 'cols'] },
    options: ['Perfectly trained kernel', 'Kernel concentration — the feature map crushes all points together', 'High entanglement is good here', 'The data is already labeled'],
    answer: 1,
    explain: 'Everything looks the same to this kernel — exponential concentration makes training hopeless.' });
  q({ domain: 'vqa', diff: 2,
    prompt: 'Which curve is a barren-plateau cost landscape $C(\\theta)$?',
    vizOptions: [
      { type: 'curve', shape: 'flat' },
      { type: 'curve', shape: 'drop' },
      { type: 'curve', shape: 's' },
      { type: 'curve', shape: 'barrier' },
    ],
    options: ['flat — no gradient signal', 'smooth descent', 'S-curve schedule', 'a barrier to tunnel through'],
    answer: 0,
    explain: 'Barren = flat. Gradients drown in shot noise when the landscape has no slope.' });
  q({ domain: 'vqa', diff: 2,
    prompt: 'This landscape shape is what you want your cost function to look like. Why?',
    viz: { type: 'curve', shape: 'drop', xlabel: 'θ', ylabel: 'C' },
    options: ['It is flat everywhere', 'There is a clear downhill direction for the optimizer to follow', 'It minimizes shots', 'It has more parameters'],
    answer: 1,
    explain: 'A slope gives the optimizer something to follow — the whole point of the variational loop.' });
  q({ domain: 'encoding', diff: 2,
    prompt: 'This pipeline belongs to which encoding?',
    viz: { type: 'flow', nodes: ['x_i', 'R_y(x_i)', '|ψ(x)⟩'], hi: 1 },
    options: ['Basis encoding', 'Angle encoding', 'Amplitude encoding', 'Phase estimation'],
    answer: 1,
    explain: 'Features riding rotation angles — one R per feature — is angle encoding.' });
  q({ domain: 'encoding', diff: 3,
    prompt: 'Which flow shows *amplitude* encoding (not angle)?',
    vizOptions: [
      { type: 'flow', nodes: ['x', 'Σ x_i/‖x‖ |i⟩', '|ψ(x)⟩'], hi: 1 },
      { type: 'flow', nodes: ['x_i', 'R_y(x_i)', '|ψ(x)⟩'] },
      { type: 'flow', nodes: ['bits', '|x₁…x_n⟩'] },
      { type: 'flow', nodes: ['A', 'A^{-1}', '|x⟩'] },
    ],
    options: ['features into amplitudes', 'features into rotation angles', 'bitstring into basis state', 'linear solve'],
    answer: 0,
    explain: 'Amplitude encoding normalizes x into the amplitude vector itself — log₂N qubits hold N features.' });
  q({ domain: 'annealing', diff: 2,
    prompt: 'The S-curve below shows which quantity evolving during an anneal?',
    viz: { type: 'curve', shape: 's', xlabel: 's', ylabel: '' },
    options: ['The loss', 'The Hamiltonian morphing H₀ → H_P', 'The fidelity', 'The kernel value'],
    answer: 1,
    explain: 'H(s) = (1−s)H₀ + sH_P — driver fades out as problem fades in.' });
  q({ domain: 'mixed', diff: 2,
    prompt: 'This density-matrix heatmap (bright corners, dark off-diagonals) is…',
    viz: { type: 'heat', cells: [[0.5, 0], [0, 0.5]], labels: ['|0⟩', '|1⟩'] },
    options: ['A pure |+⟩ state', 'A maximally mixed state', 'A Bell state', 'The zero matrix'],
    answer: 1,
    explain: 'ρ = I/2: equal populations, zero coherence — no phase relationship between outcomes.' });
  q({ domain: 'mixed', diff: 3,
    prompt: 'Same populations, but now the off-diagonals glow too. What changed?',
    vizOptions: [
      { type: 'heat', cells: [[0.5, 0], [0, 0.5]] },
      { type: 'heat', cells: [[0.5, 0.5], [0.5, 0.5]] },
      { type: 'heat', cells: [[1, 0], [0, 0]] },
      { type: 'heat', cells: [[0.5, -0.5], [-0.5, 0.5]] },
    ],
    options: ['fully mixed', 'a coherent superposition — coherence lives off-diagonal', 'a definite |0⟩', 'phase-flipped coherence'],
    answer: 1,
    explain: 'ρ = |+⟩⟨+| has bright off-diagonals: coherence IS the off-diagonal weight.' });

  window.QML_META_QUESTIONS = Q;
})();
