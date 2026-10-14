/* ============================================================
   QML_EQUATIONS — the equations of the course, each with a
   name + what it actually does. Feeds:
     · generated challenge questions  (equation → name+definition)
     · the Visuals gallery            (3D scenes per equation)
   {
     eq: 'P(x) = |\\langle x|\\psi\\rangle|^{2}',
     name: 'Born rule',
     desc: '…what it does, in plain words…',
     topic: 'measure', diff: 1,
   }
   ============================================================ */
window.QML_EQUATIONS = [

  /* ---------- math ---------- */
  { eq: '\\langle\\varphi|\\psi\\rangle = \\sum_i \\varphi_i^{*}\\psi_i',
    name: 'Inner product',
    desc: 'measures how much two states overlap — a complex scalar; zero means perfectly distinguishable',
    topic: 'math', diff: 1 },
  { eq: 'A = \\sum_i \\lambda_i\\,|u_i\\rangle\\langle u_i|',
    name: 'Spectral decomposition',
    desc: 'writes a Hermitian operator as eigenvalues times projectors onto its eigenvectors — the diagonal "physics form" of a matrix',
    topic: 'math', diff: 3 },
  { eq: 'd = 2^{n}',
    name: 'Hilbert-space dimension',
    desc: 'n qubits live in a space of 2ⁿ amplitudes — the exponential growth behind quantum speedups and the curse of simulation',
    topic: 'math', diff: 1 },
  { eq: '|\\psi\\rangle\\langle\\varphi|',
    name: 'Outer product',
    desc: 'ket-bra builds a rank-1 operator (a matrix) instead of a scalar — basis of projectors and density matrices',
    topic: 'math', diff: 2 },

  /* ---------- states ---------- */
  { eq: '|\\psi\\rangle = \\cos\\tfrac{\\theta}{2}|0\\rangle + e^{i\\varphi}\\sin\\tfrac{\\theta}{2}|1\\rangle',
    name: 'Bloch-sphere parametrization',
    desc: 'any qubit state = a point on a sphere: θ sets the |0⟩/|1⟩ balance, φ the relative phase',
    topic: 'states', diff: 2 },
  { eq: '|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle,\\ \\ |\\alpha|^{2}+|\\beta|^{2}=1',
    name: 'Normalized qubit state',
    desc: 'the general qubit: two complex amplitudes whose squared magnitudes must sum to one',
    topic: 'states', diff: 1 },
  { eq: 'e^{i\\theta}|\\psi\\rangle \\sim |\\psi\\rangle',
    name: 'Global phase equivalence',
    desc: 'multiplying the whole state by a phase changes nothing observable — only relative phases matter',
    topic: 'states', diff: 2 },
  { eq: '|\\pm\\rangle = \\tfrac{|0\\rangle\\pm|1\\rangle}{\\sqrt{2}}',
    name: 'Hadamard-basis states',
    desc: 'the X-basis pair — equal Z-basis odds, distinguished only by relative phase',
    topic: 'states', diff: 1 },

  /* ---------- multi ---------- */
  { eq: '|\\Phi^{+}\\rangle = \\tfrac{|00\\rangle+|11\\rangle}{\\sqrt{2}}',
    name: 'Bell state',
    desc: 'the maximally entangled two-qubit state — perfectly correlated outcomes, no product form exists',
    topic: 'multi', diff: 1 },
  { eq: '|\\psi\\rangle_{AB} = \\sum_i \\lambda_i\\,|a_i\\rangle|b_i\\rangle',
    name: 'Schmidt decomposition',
    desc: 'any bipartite state collapses to a single sum of paired terms — more than one λᵢ > 0 means entanglement',
    topic: 'multi', diff: 3 },
  { eq: '|\\psi\\rangle\\otimes|\\varphi\\rangle',
    name: 'Tensor product of states',
    desc: 'how independent systems combine — amplitudes multiply, so dimensions grow as products',
    topic: 'multi', diff: 1 },

  /* ---------- measure ---------- */
  { eq: 'P(x) = |\\langle x|\\psi\\rangle|^{2}',
    name: 'Born rule',
    desc: 'the probability of outcome x is the squared overlap with its eigenstate — quantum randomness itself',
    topic: 'measure', diff: 1 },
  { eq: '\\langle A\\rangle = \\langle\\psi|A|\\psi\\rangle',
    name: 'Expectation value',
    desc: 'the average measurement outcome of observable A — the single number QML models output',
    topic: 'measure', diff: 1 },
  { eq: '\\sigma_{p} \\propto 1/\\sqrt{N_{\\text{shots}}}',
    name: 'Shot-noise scaling',
    desc: 'probability estimates from N circuit runs converge like 1/√N — why precision is expensive on hardware',
    topic: 'measure', diff: 2 },

  /* ---------- mixed ---------- */
  { eq: '\\rho = \\sum_i p_i\\,|\\psi_i\\rangle\\langle\\psi_i|',
    name: 'Density matrix',
    desc: 'a weighted mixture of pure states as one operator — handles classical uncertainty on top of quantum amplitudes',
    topic: 'mixed', diff: 2 },
  { eq: '\\mathrm{Tr}(\\rho^{2})',
    name: 'Purity',
    desc: '1 for pure states, less for mixed — a quick thermometer for how "quantum" the state still is',
    topic: 'mixed', diff: 2 },
  { eq: 'S(\\rho) = -\\mathrm{Tr}(\\rho\\log\\rho)',
    name: 'von Neumann entropy',
    desc: 'mixedness of a state — and, for a reduced state, the amount of entanglement with what was traced out',
    topic: 'mixed', diff: 3 },
  { eq: '\\rho_A = \\mathrm{Tr}_B\\,\\rho_{AB}',
    name: 'Partial trace',
    desc: 'averages out subsystem B to get the best possible description of A alone',
    topic: 'mixed', diff: 3 },
  { eq: '\\dot{\\rho} = -\\tfrac{i}{\\hbar}[H,\\rho] + \\sum_k\\!\\big(K_k\\rho K_k^{\\dagger} - \\tfrac{1}{2}\\{K_k^{\\dagger}K_k,\\rho\\}\\big)',
    name: 'Lindblad master equation',
    desc: 'open-system dynamics: unitary evolution plus jump terms for noise — how decoherence actually computes',
    topic: 'mixed', diff: 3 },

  /* ---------- dynamics ---------- */
  { eq: 'i\\hbar\\,\\partial_t|\\psi\\rangle = H|\\psi\\rangle',
    name: 'Schrödinger equation',
    desc: 'the law of motion: the Hamiltonian tells a state how to change, continuously and reversibly',
    topic: 'dynamics', diff: 1 },
  { eq: 'U(t) = e^{-iHt/\\hbar}',
    name: 'Time-evolution operator',
    desc: 'exponentiating the Hamiltonian produces the unitary that carries a state forward t seconds',
    topic: 'dynamics', diff: 2 },
  { eq: 'H = -J\\sum_{\\langle i,j\\rangle}\\sigma_i^{z}\\sigma_j^{z} - \\Gamma\\sum_i \\sigma_i^{x}',
    name: 'Transverse-field Ising model',
    desc: 'a magnet of coupled spins plus a perpendicular field that makes them tunnel — the workhorse of annealers',
    topic: 'dynamics', diff: 3 },
  { eq: '[A,B] = AB - BA',
    name: 'Commutator',
    desc: 'zero means the observables can be sharp simultaneously; nonzero drives evolution and uncertainty',
    topic: 'dynamics', diff: 2 },

  /* ---------- gate model ---------- */
  { eq: 'U^{\\dagger}U = I',
    name: 'Unitarity',
    desc: 'the constraint on every quantum gate: reversible, norm-preserving — no information lost',
    topic: 'gatemodel', diff: 1 },
  { eq: 'R_x(\\theta) = e^{-i\\theta X/2}',
    name: 'Rotation gate',
    desc: 'turns the Bloch vector by angle θ around axis x — the parametrized building block of ansätze',
    topic: 'gatemodel', diff: 2 },

  /* ---------- annealing ---------- */
  { eq: 'H(s) = (1-s)\\,H_0 + s\\,H_P',
    name: 'Annealing schedule',
    desc: 'slides the Hamiltonian from "easy to prepare" to "encodes the problem" — stay slow and the ground state follows',
    topic: 'annealing', diff: 2 },
  { eq: 'T \\gg \\dfrac{\\max_s |\\langle 1|\\partial_s H|0\\rangle|}{\\min_s \\Delta(s)^{2}}',
    name: 'Adiabatic condition',
    desc: 'how slow is slow enough: total runtime must beat the gap-squared bottleneck — the price of annealing',
    topic: 'annealing', diff: 3 },
  { eq: 'E(x) = \\sum_i h_i x_i + \\sum_{i<j} J_{ij}x_i x_j',
    name: 'Ising / QUBO energy',
    desc: 'the cost landscape annealers descend: linear biases plus pairwise couplings over binary variables',
    topic: 'annealing', diff: 2 },

  /* ---------- vqa ---------- */
  { eq: 'C(\\theta) = \\langle 0|U^{\\dagger}(\\theta)\\,H\\,U(\\theta)|0\\rangle',
    name: 'Variational cost',
    desc: 'the expectation value a VQA minimizes — the circuit proposes, the observable scores',
    topic: 'vqa', diff: 2 },
  { eq: '\\partial_\\mu C = \\tfrac{1}{2}\\big[C(\\theta+\\tfrac{\\pi}{2}e_\\mu) - C(\\theta-\\tfrac{\\pi}{2}e_\\mu)\\big]',
    name: 'Parameter-shift rule',
    desc: 'exact analytic gradient from just two shifted circuit evaluations — no finite-difference approximation',
    topic: 'vqa', diff: 3 },
  { eq: '\\theta \\leftarrow \\theta - \\eta\\,\\nabla C(\\theta)',
    name: 'Gradient-descent update',
    desc: 'the classical optimizer stepping downhill — the outer loop of every variational algorithm',
    topic: 'vqa', diff: 1 },
  { eq: '\\mathrm{Var}[\\partial_\\mu C] \\sim 2^{-n}',
    name: 'Barren-plateau scaling',
    desc: 'gradients shrink exponentially in qubit count on deep random ansätze — training dies of starvation, not noise',
    topic: 'vqa', diff: 3 },

  /* ---------- encoding ---------- */
  { eq: '|\\psi(x)\\rangle = \\sum_i \\tfrac{x_i}{\\|x\\|}|i\\rangle',
    name: 'Amplitude encoding',
    desc: 'stores N features in the amplitudes of just log₂N qubits — maximally dense, expensive to prepare',
    topic: 'encoding', diff: 3 },
  { eq: '|\\psi(x)\\rangle = U_{\\Phi}(x)|0\\rangle^{\\otimes n}',
    name: 'Feature-map state',
    desc: 'the circuit embeds a data point as a quantum state — where classical information enters the quantum model',
    topic: 'encoding', diff: 2 },
  { eq: '|x\\rangle = |x_1\\rangle\\otimes\\cdots\\otimes|x_n\\rangle',
    name: 'Basis encoding',
    desc: 'one bit-string per basis state — cheap, parallel, and the entry point of most oracle algorithms',
    topic: 'encoding', diff: 1 },

  /* ---------- mlmethods ---------- */
  { eq: 'K(x,x^{\\prime}) = |\\langle\\psi(x^{\\prime})|\\psi(x)\\rangle|^{2}',
    name: 'Quantum kernel',
    desc: 'similarity = squared overlap of the two encoded states — the Gram matrix entry QSVM learns from',
    topic: 'mlmethods', diff: 2 },
  { eq: 'f_\\theta(x) = \\langle\\psi(x)|U^{\\dagger}(\\theta)\\,O\\,U(\\theta)|\\psi(x)\\rangle',
    name: 'Quantum model output',
    desc: 'a QNN prediction is literally an expectation value: encode, evolve, measure an observable',
    topic: 'mlmethods', diff: 2 },
  { eq: '\\mathcal{L}(\\theta) = \\tfrac{1}{N}\\sum_i \\ell\\big(f_\\theta(x_i),\\,y_i\\big)',
    name: 'Empirical training loss',
    desc: 'average error over the dataset — the scalar the whole hybrid loop exists to shrink',
    topic: 'mlmethods', diff: 1 },
  { eq: 'w = \\textstyle\\sum_i \\alpha_i\\, y_i\\, \\Phi(x_i)',
    name: 'Kernel classifier weights',
    desc: 'the SVM solution lives in feature space as a data-weighted sum — why only kernel values are ever needed',
    topic: 'mlmethods', diff: 3 },

  /* ---------- algorithms ---------- */
  { eq: '\\mathrm{QFT}|j\\rangle = \\tfrac{1}{\\sqrt{N}}\\sum_k e^{2\\pi i\\, jk/N}|k\\rangle',
    name: 'Quantum Fourier transform',
    desc: 'spreads a basis state into phase-encoded Fourier coefficients — the engine of phase estimation and Shor',
    topic: 'algorithms', diff: 2 },
  { eq: '|x\\rangle \\propto A^{-1}|b\\rangle',
    name: 'HHL solution state',
    desc: 'solving Ax=b as a quantum state: inversion by phase estimation, output read through the amplitudes',
    topic: 'algorithms', diff: 3 },
  { eq: 'N_{\\mathrm{iter}} \\approx \\tfrac{\\pi}{4}\\sqrt{N}',
    name: 'Grover iteration count',
    desc: 'search needs only √N oracle calls — each Grover step rotates the state toward the marked items',
    topic: 'algorithms', diff: 2 },
];

/* ============================================================
   QML_EQ_QUESTIONS — generated drills.
   For every equation: one "name it" MCQ whose options are
   "Name — what it does" strings (name + definition together),
   plus a flipped "which equation is X?" with tex options.
   Deterministic picks (same hash scheme as definitions.js).
   ============================================================ */
(function () {
  const E = window.QML_EQUATIONS || [];
  const hash = s => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
  const shuffledBy = (arr, seed) =>
    arr.slice().sort((a, b) => hash(seed + '|' + a) - hash(seed + '|' + b));

  function dist(eq, key, same) {
    const pool = E.filter(o => o !== eq && (same ? o.topic === eq.topic : o.topic !== eq.topic));
    const seen = new Set();
    const out = [];
    for (const o of shuffledBy(pool, eq.eq + key)) {
      const v = key === 'nd' ? o.name + ' — ' + o.desc : o[key];
      if (!seen.has(v)) { seen.add(v); out.push(o); if (out.length === 3) break; }
    }
    return out;
  }

  const qs = [];
  const pad = n => String(n).padStart(3, '0');
  E.forEach((e, i) => {
    /* A) equation shown → pick "name — definition" */
    let ds = dist(e, 'nd', true);
    if (ds.length < 3) ds = ds.concat(dist(e, 'nd', false).slice(0, 3 - ds.length));
    if (ds.length === 3) {
      const options = ds.map(d => '**' + d.name + '** — ' + d.desc);
      const at = hash('eqA' + i) % 4;
      options.splice(at, 0, '**' + e.name + '** — ' + e.desc);
      qs.push({
        id: 'eq' + pad(i + 1) + 'a', topic: e.topic, diff: e.diff, kind: 'mcq',
        prompt: 'This equation — what is it called and what does it do?\n\n$' + e.eq + '$',
        options, answer: at,
        explain: 'That is the **' + e.name + '**: ' + e.desc + '.',
      });
    }
    /* B) name given → pick the equation */
    ds = dist(e, 'eq', true);
    if (ds.length < 3) ds = ds.concat(dist(e, 'eq', false).slice(0, 3 - ds.length));
    if (ds.length === 3) {
      const options = ds.map(d => '$' + d.eq + '$');
      const at = hash('eqB' + i) % 4;
      options.splice(at, 0, '$' + e.eq + '$');
      qs.push({
        id: 'eq' + pad(i + 1) + 'b', topic: e.topic, diff: Math.min(3, e.diff + 1), kind: 'mcq',
        prompt: 'Which expression is the **' + e.name + '**?',
        options, answer: at,
        explain: 'The ' + e.name + ' is $' + e.eq + '$ — ' + e.desc + '.',
      });
    }
  });
  window.QML_EQ_QUESTIONS = qs;
})();
