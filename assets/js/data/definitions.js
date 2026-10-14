/* ============================================================
   QML_SYMBOLS — the glossary. Every symbol used across quantum
   machine learning, tagged by domain (the QML.DB.TOPICS ids).
   {
     sym:   '$\\rho$',            // KaTeX-ish (md()/tex() render it) or plain text
     name:  'density matrix',     // short canonical name
     desc:  '…',                  // one-line meaning, may contain $..$ math
     topic: 'mixed',              // domain it belongs to
     diff:  1,                    // 1 core notation, 2 intermediate, 3 advanced
   }

   QML_DEF_QUESTIONS — drill bank generated below: for EVERY
   glossary entry it builds three MCQs —
     dn###  symbol → name
     dd###  symbol → description
     ds###  name  → symbol
   plus a handcrafted block (dh###) for classic confusions.
   ============================================================ */
window.QML_SYMBOLS = [

  /* ---------- math foundations ---------- */
  { sym:'$\\mathbb{C}$', name:'complex numbers', desc:'the number field quantum amplitudes live in', topic:'math', diff:1 },
  { sym:'$z^{*}$', name:'complex conjugate', desc:'flips the sign of the imaginary part: $(a+bi)^{*}=a-bi$', topic:'math', diff:1 },
  { sym:'$|z|$', name:'modulus', desc:'magnitude of a complex number, $|z|=\\sqrt{zz^{*}}$', topic:'math', diff:1 },
  { sym:'$\\langle\\varphi|\\psi\\rangle$', name:'inner product', desc:'complex overlap of two states — a scalar', topic:'math', diff:1 },
  { sym:'$|\\psi\\rangle\\langle\\varphi|$', name:'outer product', desc:'ket-bra — a rank-1 operator (matrix)', topic:'math', diff:2 },
  { sym:'$\\|\\psi\\|$', name:'norm', desc:'length of a vector; valid states have norm 1', topic:'math', diff:1 },
  { sym:'$\\lambda$', name:'eigenvalue', desc:'scalar $\\lambda$ in $Av=\\lambda v$ — how much an operator stretches its eigenvector', topic:'math', diff:1 },
  { sym:'$\\mathrm{Tr}(A)$', name:'trace', desc:'sum of diagonal entries — equals the sum of eigenvalues', topic:'math', diff:2 },
  { sym:'$A^{\\dagger}$', name:'adjoint (Hermitian conjugate)', desc:'conjugate transpose $A^{\\dagger}=(A^{*})^{T}$', topic:'math', diff:2 },
  { sym:'$\\otimes$', name:'tensor product', desc:'combines vector spaces — dimensions multiply', topic:'math', diff:1 },
  { sym:'$\\oplus$', name:'direct sum / XOR', desc:'block-diagonal combination of operators; on bits it is addition mod 2', topic:'math', diff:3 },
  { sym:'$\\delta_{ij}$', name:'Kronecker delta', desc:'1 when $i=j$, else 0 — appears in orthonormality $\\langle i|j\\rangle=\\delta_{ij}$', topic:'math', diff:2 },

  /* ---------- quantum states ---------- */
  { sym:'$|\\psi\\rangle$', name:'ket', desc:'a quantum state as a column vector', topic:'states', diff:1 },
  { sym:'$\\langle\\psi|$', name:'bra', desc:'conjugate-transpose row vector of the ket $|\\psi\\rangle$', topic:'states', diff:1 },
  { sym:'$|0\\rangle$', name:'computational basis state 0', desc:'the column vector $(1,0)^{T}$', topic:'states', diff:1 },
  { sym:'$|1\\rangle$', name:'computational basis state 1', desc:'the column vector $(0,1)^{T}$', topic:'states', diff:1 },
  { sym:'$|+\\rangle$', name:'plus state', desc:'$\\frac{|0\\rangle+|1\\rangle}{\\sqrt{2}}$ — the $+1$ eigenstate of X', topic:'states', diff:1 },
  { sym:'$|-\\rangle$', name:'minus state', desc:'$\\frac{|0\\rangle-|1\\rangle}{\\sqrt{2}}$ — the $-1$ eigenstate of X', topic:'states', diff:2 },
  { sym:'$|{+i}\\rangle$', name:'i-plus state', desc:'$\\frac{|0\\rangle+i|1\\rangle}{\\sqrt{2}}$ — the $+1$ eigenstate of Y', topic:'states', diff:2 },
  { sym:'$\\alpha,\\ \\beta$', name:'amplitudes', desc:'complex coefficients in $|\\psi\\rangle=\\alpha|0\\rangle+\\beta|1\\rangle$', topic:'states', diff:1 },
  { sym:'$|\\alpha|^{2}$', name:'Born probability', desc:'squared amplitude — the probability of that measurement outcome', topic:'states', diff:1 },
  { sym:'$e^{i\\theta}$', name:'phase factor', desc:'unit-modulus complex number; a global phase is unobservable', topic:'states', diff:2 },

  /* ---------- multi-qubit & entanglement ---------- */
  { sym:'$|00\\rangle$', name:'two-qubit basis state', desc:'shorthand for $|0\\rangle\\otimes|0\\rangle=(1,0,0,0)^{T}$', topic:'multi', diff:1 },
  { sym:'$|\\Phi^{+}\\rangle$', name:'Bell state Phi-plus', desc:'$\\frac{|00\\rangle+|11\\rangle}{\\sqrt{2}}$ — maximally entangled', topic:'multi', diff:2 },
  { sym:'$|\\Phi^{-}\\rangle$', name:'Bell state Phi-minus', desc:'$\\frac{|00\\rangle-|11\\rangle}{\\sqrt{2}}$ — differs by a relative phase', topic:'multi', diff:2 },
  { sym:'$|\\Psi^{+}\\rangle$', name:'Bell state Psi-plus', desc:'$\\frac{|01\\rangle+|10\\rangle}{\\sqrt{2}}$ — entangled with odd parity', topic:'multi', diff:2 },
  { sym:'$|\\Psi^{-}\\rangle$', name:'singlet state', desc:'$\\frac{|01\\rangle-|10\\rangle}{\\sqrt{2}}$ — antisymmetric Bell state', topic:'multi', diff:3 },
  { sym:'$|\\psi\\rangle_{AB}$', name:'bipartite state', desc:'a state shared between subsystems A and B', topic:'multi', diff:2 },
  { sym:'$\\sum_i \\lambda_i\\,|a_i\\rangle|b_i\\rangle$', name:'Schmidt decomposition', desc:'any bipartite state written with non-negative Schmidt coefficients $\\lambda_i$; more than one term means entanglement', topic:'multi', diff:3 },

  /* ---------- measurement ---------- */
  { sym:'$\\langle A\\rangle$', name:'expectation value', desc:'average outcome of measuring $A$: $\\langle\\psi|A|\\psi\\rangle$', topic:'measure', diff:1 },
  { sym:'$\\langle Z\\rangle$', name:'Z expectation', desc:'population difference $p(0)-p(1)$ read off the Bloch z-axis', topic:'measure', diff:2 },
  { sym:'$|\\langle x|\\psi\\rangle|^{2}$', name:'Born rule', desc:'the probability of outcome $|x\\rangle$ — squared overlap', topic:'measure', diff:1 },
  { sym:'$\\Pi_i$', name:'projector', desc:'Hermitian operator with $\\Pi_i^2=\\Pi_i$; defines a sharp measurement outcome', topic:'measure', diff:2 },
  { sym:'$\\{E_i\\}$', name:'POVM', desc:'positive-operator-valued measure — generalized measurement with $\\sum_i E_i=I$', topic:'measure', diff:3 },
  { sym:'$M_m$', name:'measurement operator', desc:'Kraus-like operator for outcome $m$; post-measurement state $\\propto M_m|\\psi\\rangle$', topic:'measure', diff:3 },
  { sym:'$n_{\\text{shots}}$', name:'shot count', desc:'number of circuit repetitions used to estimate probabilities — estimates scale as $1/\\sqrt{n_{\\text{shots}}}$', topic:'measure', diff:1 },

  /* ---------- mixed states & open systems ---------- */
  { sym:'$\\rho$', name:'density matrix', desc:'operator form of a (possibly mixed) state — $\\mathrm{Tr}\\,\\rho=1$, $\\rho\\succeq 0$', topic:'mixed', diff:1 },
  { sym:'$|\\psi\\rangle\\langle\\psi|$', name:'pure-state density matrix', desc:'projector form of a ket — the pure case of $\\rho$', topic:'mixed', diff:2 },
  { sym:'$\\mathrm{Tr}(\\rho^{2})$', name:'purity', desc:'1 for pure states, below 1 for mixed — measures mixedness', topic:'mixed', diff:2 },
  { sym:'$S(\\rho)$', name:'von Neumann entropy', desc:'$-\\mathrm{Tr}(\\rho\\log\\rho)$ — quantum mixedness, and entanglement of a reduced state', topic:'mixed', diff:3 },
  { sym:'$\\mathrm{Tr}_{B}$', name:'partial trace', desc:'averages out subsystem B, leaving the reduced state $\\rho_A$', topic:'mixed', diff:3 },
  { sym:'$\\sigma$', name:'second density matrix', desc:'another state, e.g. inside the fidelity $F(\\rho,\\sigma)$', topic:'mixed', diff:2 },
  { sym:'$F(\\rho,\\sigma)$', name:'fidelity', desc:'closeness of two density matrices — 1 means identical', topic:'mixed', diff:3 },
  { sym:'$\\{K_k\\}$', name:'Kraus operators', desc:'operators of a noise channel: $\\rho\\to\\sum_k K_k\\rho K_k^{\\dagger}$', topic:'mixed', diff:3 },
  { sym:'$\\mathcal{E}$', name:'quantum channel', desc:'a completely positive trace-preserving map on density matrices', topic:'mixed', diff:3 },
  { sym:'$T_1$', name:'relaxation time', desc:'energy-decay timescale — how fast $|1\\rangle$ relaxes to $|0\\rangle$', topic:'mixed', diff:2 },
  { sym:'$T_2$', name:'dephasing time', desc:'phase-coherence decay timescale — how fast superpositions decohere', topic:'mixed', diff:2 },

  /* ---------- dynamics & many-body ---------- */
  { sym:'$H$', name:'Hamiltonian', desc:'energy operator that generates time evolution', topic:'dynamics', diff:1 },
  { sym:'$\\hbar$', name:'reduced Planck constant', desc:'$h/2\\pi$ — sets the quantum scale in $e^{-iHt/\\hbar}$', topic:'dynamics', diff:1 },
  { sym:'$i\\hbar\\,\\partial_t|\\psi\\rangle=H|\\psi\\rangle$', name:'Schrodinger equation', desc:'the law of quantum time evolution', topic:'dynamics', diff:2 },
  { sym:'$U(t)=e^{-iHt/\\hbar}$', name:'time-evolution operator', desc:'unitary that moves a state forward by time $t$', topic:'dynamics', diff:2 },
  { sym:'$[A,B]$', name:'commutator', desc:'$AB-BA$ — zero means A and B can be jointly measured', topic:'dynamics', diff:2 },
  { sym:'$\\{A,B\\}$', name:'anticommutator', desc:'$AB+BA$ — distinct Pauli matrices anticommute', topic:'dynamics', diff:3 },
  { sym:'$e^{iHt}$', name:'Hamiltonian simulation', desc:'exponentiating $H$ as a subroutine — powers quantum PCA and HHL', topic:'dynamics', diff:3 },
  { sym:'$\\sigma_i^{z}\\sigma_j^{z}$', name:'Ising interaction', desc:'coupling term between neighboring spins in a many-body Hamiltonian', topic:'dynamics', diff:3 },

  /* ---------- gate-model QC ---------- */
  { sym:'$I$', name:'identity gate', desc:'does nothing: $I|\\psi\\rangle=|\\psi\\rangle$', topic:'gatemodel', diff:1 },
  { sym:'$X$', name:'Pauli-X (NOT) gate', desc:'flips $|0\\rangle\\leftrightarrow|1\\rangle$ — the quantum NOT', topic:'gatemodel', diff:1 },
  { sym:'$Z$', name:'Pauli-Z gate', desc:'leaves $|0\\rangle$, applies a $-1$ phase to $|1\\rangle$', topic:'gatemodel', diff:1 },
  { sym:'$Y$', name:'Pauli-Y gate', desc:'bit flip plus phase — $Y=iXZ$', topic:'gatemodel', diff:2 },
  { sym:'$H$', name:'Hadamard gate', desc:'creates superposition: $|0\\rangle\\to|+\\rangle$, $|1\\rangle\\to|-\\rangle$', topic:'gatemodel', diff:1 },
  { sym:'$S$', name:'phase gate', desc:'$\\sqrt{Z}$ — applies a phase of $i$ to $|1\\rangle$', topic:'gatemodel', diff:2 },
  { sym:'$T$', name:'T gate', desc:'$\\sqrt{S}$ — applies $e^{i\\pi/4}$; required for universal computation', topic:'gatemodel', diff:2 },
  { sym:'$R_x(\\theta),R_y(\\theta),R_z(\\theta)$', name:'rotation gates', desc:'single-qubit rotations by angle $\\theta$ about the Bloch axes', topic:'gatemodel', diff:2 },
  { sym:'CNOT / CX', name:'controlled-NOT', desc:'flips the target qubit only when the control is $|1\\rangle$', topic:'gatemodel', diff:1 },
  { sym:'CZ', name:'controlled-Z', desc:'applies a $-1$ phase to $|11\\rangle$ only', topic:'gatemodel', diff:2 },
  { sym:'SWAP', name:'swap gate', desc:'exchanges the states of two qubits', topic:'gatemodel', diff:1 },
  { sym:'CCX', name:'Toffoli gate', desc:'doubly-controlled NOT — flips the target iff both controls are $|1\\rangle$', topic:'gatemodel', diff:3 },
  { sym:'$U(\\theta,\\phi,\\lambda)$', name:'general single-qubit gate', desc:'the fully parametrized 2×2 unitary — any one-qubit gate', topic:'gatemodel', diff:3 },
  { sym:'$U^{\\dagger}$', name:'inverse gate', desc:'adjoint of $U$ — undoes the operation, since $U^{\\dagger}U=I$', topic:'gatemodel', diff:2 },

  /* ---------- adiabatic & annealing ---------- */
  { sym:'$H_0$', name:'driver Hamiltonian', desc:'easy initial Hamiltonian — usually a transverse field', topic:'annealing', diff:2 },
  { sym:'$H_P$', name:'problem Hamiltonian', desc:'final Hamiltonian whose ground state encodes the answer', topic:'annealing', diff:2 },
  { sym:'$s(t)$', name:'annealing schedule', desc:'interpolation parameter: $H(s)=(1-s)H_0+s\\,H_P$', topic:'annealing', diff:2 },
  { sym:'$J_{ij}$', name:'Ising coupler', desc:'interaction strength between spins $i$ and $j$', topic:'annealing', diff:2 },
  { sym:'$h_i$', name:'local field', desc:'on-site bias term of an Ising model', topic:'annealing', diff:2 },
  { sym:'$\\Gamma$', name:'transverse field', desc:'quantum fluctuation strength driving tunneling between configurations', topic:'annealing', diff:3 },
  { sym:'QUBO', name:'quadratic unconstrained binary optimization', desc:'the problem format annealers minimize', topic:'annealing', diff:2 },
  { sym:'$E(x)$', name:'Ising energy', desc:'cost landscape the annealer searches for a minimum', topic:'annealing', diff:1 },

  /* ---------- variational algorithms ---------- */
  { sym:'$\\theta$', name:'variational parameters', desc:'trainable rotation angles of a parametrized circuit', topic:'vqa', diff:1 },
  { sym:'$U(\\theta)$', name:'parametrized ansatz', desc:'the trainable circuit family explored by the optimizer', topic:'vqa', diff:1 },
  { sym:'$C(\\theta)$', name:'cost function', desc:'measured expectation the classical optimizer minimizes', topic:'vqa', diff:1 },
  { sym:'$\\langle H\\rangle_{\\theta}$', name:'cost expectation', desc:'energy of the ansatz state — what VQE minimizes', topic:'vqa', diff:2 },
  { sym:'$\\eta$', name:'learning rate', desc:'step size in $\\theta\\leftarrow\\theta-\\eta\\nabla C$', topic:'vqa', diff:1 },
  { sym:'$\\nabla C$', name:'cost gradient', desc:'direction of steepest cost increase — points downhill when negated', topic:'vqa', diff:2 },
  { sym:'$\\partial C/\\partial\\theta$', name:'parameter-shift gradient', desc:'exact gradient from two shifted evaluations: $\\tfrac{C(\\theta+s)-C(\\theta-s)}{2\\sin s}$', topic:'vqa', diff:3 },
  { sym:'$\\mathrm{Var}(\\partial C)$', name:'barren-plateau variance', desc:'vanishing gradient signal — when it collapses, training stalls', topic:'vqa', diff:3 },

  /* ---------- data encoding ---------- */
  { sym:'$\\mathbf{x}$', name:'classical data vector', desc:'input feature vector to be encoded', topic:'encoding', diff:1 },
  { sym:'$\\Phi(x)$', name:'feature map', desc:'map from classical data to quantum states', topic:'encoding', diff:2 },
  { sym:'$|\\psi(x)\\rangle$', name:'data-encoding state', desc:'quantum state that carries the input $x$', topic:'encoding', diff:1 },
  { sym:'$U_{\\Phi}(x)$', name:'encoding unitary', desc:'circuit that prepares $|\\psi(x)\\rangle$ from $|0\\rangle^{\\otimes n}$', topic:'encoding', diff:3 },
  { sym:'basis encoding', name:'basis encoding', desc:'data stored as bit strings in computational basis states', topic:'encoding', diff:1 },
  { sym:'angle encoding', name:'angle encoding', desc:'data stored in rotation angles of gates — one feature per gate', topic:'encoding', diff:2 },
  { sym:'amplitude encoding', name:'amplitude encoding', desc:'data stored in state amplitudes — $N$ numbers on $\\log_2 N$ qubits', topic:'encoding', diff:2 },
  { sym:'data re-uploading', name:'data re-uploading', desc:'interleaving encoding and trainable layers for expressivity', topic:'encoding', diff:3 },
  { sym:'$\\mathcal{D}$', name:'dataset', desc:'the collection of labeled examples used for training', topic:'encoding', diff:2 },

  /* ---------- QML methods ---------- */
  { sym:'$K(x,x^{\\prime})$', name:'quantum kernel', desc:'overlap $|\\langle\\psi(x^{\\prime})|\\psi(x)\\rangle|^{2}$ used by kernel methods like QSVM', topic:'mlmethods', diff:2 },
  { sym:'$\\mathcal{L}(\\theta)$', name:'loss function', desc:'training objective the model minimizes', topic:'mlmethods', diff:1 },
  { sym:'$\\hat{y}$', name:'predicted label', desc:"the model's output class", topic:'mlmethods', diff:1 },
  { sym:'$f_{\\theta}(x)$', name:'hypothesis / model', desc:'parametrized prediction function — in QML, an expectation value of the circuit', topic:'mlmethods', diff:2 },
  { sym:'$\\langle O\\rangle_x$', name:'readout expectation', desc:'model output measured as an expectation value on encoded input $x$', topic:'mlmethods', diff:2 },
  { sym:'QNN', name:'quantum neural network', desc:'parametrized quantum circuit trained like a neural network', topic:'mlmethods', diff:1 },
  { sym:'QSVM', name:'quantum support vector machine', desc:'SVM whose kernel matrix is estimated on a quantum device', topic:'mlmethods', diff:2 },
  { sym:'NISQ', name:'noisy intermediate-scale quantum', desc:"today's imperfect devices — tens to hundreds of noisy qubits", topic:'mlmethods', diff:2 },
  { sym:'$\\varepsilon$', name:'error rate / accuracy target', desc:'small tolerance for noise or for the precision of an estimate', topic:'mlmethods', diff:2 },

  /* ---------- QFT / HHL / linear algebra ---------- */
  { sym:'QFT', name:'quantum Fourier transform', desc:'Fourier transform in $O(n^{2})$ gates — basis of phase estimation', topic:'algorithms', diff:1 },
  { sym:'QPE', name:'quantum phase estimation', desc:'extracts the eigenphase of a unitary — core of Shor and HHL', topic:'algorithms', diff:2 },
  { sym:'HHL', name:'Harrow-Hassidim-Lloyd algorithm', desc:'quantum linear-system solver producing $|x\\rangle\\propto A^{-1}b$', topic:'algorithms', diff:2 },
  { sym:'$\\kappa$', name:'condition number', desc:'$\\lambda_{\\max}/\\lambda_{\\min}$ of $A$ — controls HHL runtime', topic:'algorithms', diff:3 },
  { sym:'$|x\\rangle$', name:'solution state', desc:'HHL output — amplitude-encodes the solution vector $x$', topic:'algorithms', diff:2 },
  { sym:'$\\mathcal{O}$', name:'oracle', desc:'black-box operation queried by an algorithm', topic:'algorithms', diff:2 },
  { sym:'$\\sqrt{N}$', name:'Grover scaling', desc:'quadratic search speedup — $\\sim\\sqrt{N}$ queries instead of $N$', topic:'algorithms', diff:1 },
  { sym:'swap test', name:'swap test', desc:'circuit estimating $|\\langle\\psi|\\varphi\\rangle|^{2}$ via an ancilla and controlled-SWAP', topic:'algorithms', diff:2 },
  { sym:'QRAM', name:'quantum random-access memory', desc:'device loading classical data into superposition — required for real speedups', topic:'algorithms', diff:3 },
  { sym:'$|\\!-\\!\\rangle$ trick', name:'phase kickback', desc:'eigenphase of a controlled gate kicked onto the control register', topic:'algorithms', diff:3 },

  /* ---------- additions: the coverage-audit gaps ---------- */
  /* math */
  { sym:'$\\mathcal{H}$', name:'Hilbert space', desc:'the vector space quantum states live in — $n$ qubits give $\\mathcal{H}\\cong\\mathbb{C}^{2^{n}}$', topic:'math', diff:1 },
  { sym:'$A=A^{\\dagger}$', name:'Hermitian condition', desc:'operator equals its own adjoint — the requirement for being an observable', topic:'math', diff:1 },
  { sym:'$2^{n}$', name:'Hilbert dimension', desc:'amplitude count for $n$ qubits — why quantum states resist classical storage', topic:'math', diff:2 },
  /* states */
  { sym:'$(\\theta,\\varphi)$', name:'Bloch angles', desc:'polar and azimuthal angles pinpointing a qubit state on the Bloch sphere', topic:'states', diff:2 },
  { sym:'$\\vec{r}$', name:'Bloch vector', desc:'the 3-vector $(\\langle X\\rangle,\\langle Y\\rangle,\\langle Z\\rangle)$ locating the state on/inside the sphere', topic:'states', diff:3 },
  /* multi */
  { sym:'$|+\\rangle^{\\otimes n}$', name:'uniform superposition', desc:'$H^{\\otimes n}|0\\rangle^{\\otimes n}$ — equal amplitude on all $2^{n}$ basis states', topic:'multi', diff:2 },
  /* measure */
  { sym:'$\\mathrm{Var}(A)$', name:'measurement variance', desc:'$\\langle A^{2}\\rangle-\\langle A\\rangle^{2}$ — the spread behind shot noise', topic:'measure', diff:3 },
  /* mixed */
  { sym:'$\\gamma$', name:'decoherence rate', desc:'per-time probability of a noise event — sets $T_1$/$T_2$ scales', topic:'mixed', diff:2 },
  { sym:'$\\mathcal{L}[\\rho]$', name:'Lindbladian', desc:'the generator of open-system evolution — unitary part plus dissipative jump terms', topic:'mixed', diff:3 },
  /* dynamics */
  { sym:'$\\vec{\\sigma}$', name:'Pauli vector', desc:'the triple $(X,Y,Z)$ — dot products $\\vec{a}\\cdot\\vec{\\sigma}$ build any single-qubit Hamiltonian', topic:'dynamics', diff:3 },
  { sym:'$E_n$', name:'energy eigenvalue', desc:'eigenenergy of level $n$ in $H|E_n\\rangle=E_n|E_n\\rangle$', topic:'dynamics', diff:1 },
  /* annealing */
  { sym:'$\\Delta$', name:'spectral gap', desc:'energy gap between ground and first excited state — sets how slow annealing must go', topic:'annealing', diff:2 },
  { sym:'$g_{\\min}$', name:'minimum gap', desc:'the smallest gap along the anneal path — the bottleneck in the adiabatic condition', topic:'annealing', diff:3 },
  /* gate model */
  { sym:'$P(\\varphi)$', name:'phase gate (general)', desc:'applies $e^{i\\varphi}$ to $|1\\rangle$ — $S=P(\\pi/2)$, $T=P(\\pi/4)$', topic:'gatemodel', diff:2 },
  /* vqa */
  { sym:'$\\theta^{*}$', name:'optimal parameters', desc:'the parameter set minimizing the cost — what training searches for', topic:'vqa', diff:1 },
  { sym:'$\\arg\\min_{\\theta} \\mathcal{L}(\\theta)$', name:'training objective', desc:'"the θ that minimizes the loss" — the formal statement of what optimization solves', topic:'vqa', diff:2 },
  { sym:'$L$', name:'ansatz depth', desc:'number of repeated layers in a parametrized circuit — trades expressivity for trainability', topic:'vqa', diff:1 },
  { sym:'VQE', name:'variational quantum eigensolver', desc:'VQA that minimizes $\\langle H\\rangle$ to find ground-state energies', topic:'vqa', diff:2 },
  { sym:'QAOA', name:'quantum approximate optimization algorithm', desc:'alternating problem/mixer Hamiltonian layers tuned for combinatorial problems', topic:'vqa', diff:2 },
  /* encoding */
  { sym:'$\\log_2 N$', name:'qubit count for amplitude encoding', desc:'qubits needed to hold $N$ features in amplitudes — the density advantage', topic:'encoding', diff:2 },
  { sym:'$N$', name:'dataset size / feature count', desc:'number of training examples or features, depending on context', topic:'encoding', diff:1 },
  /* mlmethods */
  { sym:'$K_{ij}$', name:'Gram (kernel) matrix', desc:'the $N\\times N$ table of all pairwise kernels — the object kernel machines actually train on', topic:'mlmethods', diff:2 },
  { sym:'$\\alpha_i$', name:'dual coefficients', desc:'per-example weights in the kernel-machine solution $w=\\sum_i\\alpha_i y_i\\Phi(x_i)$', topic:'mlmethods', diff:3 },
  /* algorithms */
  { sym:'$e^{2\\pi i\\phi}$', name:'eigenphase', desc:'the phase a unitary applies to its eigenvector — what QPE extracts, $\\phi\\in[0,1)$', topic:'algorithms', diff:3 },
  { sym:'Hadamard test', name:'Hadamard test', desc:'circuit estimating $\\mathrm{Re}\\langle\\psi|U|\\psi\\rangle$ via an ancilla — how kernels and overlaps get measured', topic:'algorithms', diff:2 },
];

/* ============================================================
   Generated drill bank — every glossary entry gets three MCQs.
   Deterministic (no Math.random at data-load time) so ids and
   distractor picks are stable across reloads.
   ============================================================ */
(function () {
  const G = window.QML_SYMBOLS || [];
  const TOPICS = (window.QML && QML.DB && QML.DB.TOPICS) || [];
  const tName = id => (TOPICS.find(t => t.id === id) || {}).name || id;

  const hash = s => {
    let h = 7;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h;
  };
  const shuffledBy = (arr, seed) =>
    arr.slice().sort((a, b) => hash(seed + '|' + a) - hash(seed + '|' + b));

  /* unique values of `key` for distractors — same domain first */
  function distractors(s, key, seed) {
    const same = G.filter(o => o !== s && o.topic === s.topic && o[key] !== s[key]).map(o => o[key]);
    const rest = G.filter(o => o !== s && o.topic !== s.topic && o[key] !== s[key]).map(o => o[key]);
    const seen = new Set([s[key]]);
    const out = [];
    for (const v of shuffledBy(same, seed).concat(shuffledBy(rest, seed))) {
      if (!seen.has(v)) { seen.add(v); out.push(v); if (out.length === 3) break; }
    }
    return out;
  }

  function mcq(id, s, prompt, correct, seed, explain) {
    const ds = distractors(s, seed === 'sym' ? 'sym' : seed === 'desc' ? 'desc' : 'name', id);
    if (ds.length < 3) return null;
    const options = ds.slice();
    const at = hash(id) % 4;
    options.splice(at, 0, correct);
    return { id, topic: 'symbols', domain: s.topic, diff: s.diff || 1, kind: 'mcq',
             prompt, options, answer: at, explain };
  }

  const qs = [];
  const pad = n => String(n).padStart(3, '0');
  G.forEach((s, i) => {
    const dom = tName(s.topic);
    const q1 = mcq('dn' + pad(i + 1), s,
      'In ' + dom + ' notation, what does ' + s.sym + ' denote?',
      s.name, 'name',
      s.sym + ' is the ' + s.name + ' — ' + s.desc + '.');
    const q2 = mcq('dd' + pad(i + 1), s,
      'In ' + dom + ', ' + s.sym + ' is best described as…',
      s.desc, 'desc',
      s.sym + ' (' + s.name + '): ' + s.desc + '.');
    const q3 = mcq('ds' + pad(i + 1), s,
      'Which symbol denotes the ' + s.name + '?',
      s.sym, 'sym',
      'The ' + s.name + ' is written ' + s.sym + ' — ' + s.desc + '.');
    if (q1) qs.push(q1);
    if (q2) qs.push(q2);
    if (q3) qs.push(q3);
  });

  /* ---------- handcrafted: classic symbol confusions ---------- */
  qs.push(
    { id:'dh01', topic:'symbols', domain:'math', diff:2, kind:'mcq',
      prompt:'$\\langle\\varphi|\\psi\\rangle$ and $|\\psi\\rangle\\langle\\varphi|$ look similar — the second one is…',
      options:['Also a complex scalar','An operator (matrix)','A two-qubit state','A probability'],
      answer:1,
      explain:'Bra-ket order matters: $\\langle\\varphi|\\psi\\rangle$ is a scalar inner product, while $|\\psi\\rangle\\langle\\varphi|$ is a rank-1 outer-product operator.' },
    { id:'dh02', topic:'symbols', domain:'dynamics', diff:3, kind:'mcq',
      prompt:'The letter $H$ appears twice in QML notation. In $e^{-iHt/\\hbar}$ it means…',
      options:['The Hadamard gate','The Hamiltonian','The entropy','The Hilbert space'],
      answer:1,
      explain:'Inside an evolution exponent, $H$ is the Hamiltonian. As a gate label, the same letter is the Hadamard — context decides.' },
    { id:'dh03', topic:'symbols', domain:'multi', diff:2, kind:'mcq',
      prompt:'$|0\\rangle\\otimes|0\\rangle$ and $|0\\rangle\\oplus|0\\rangle$ are…',
      options:['The same vector','A 4-dim product state vs a direct-sum construction','Both illegal notation','Both equal to $|00\\rangle$'],
      answer:1,
      explain:'$\\otimes$ multiplies dimensions ($2\\times 2=4$, giving $|00\\rangle$); $\\oplus$ adds them block-diagonally — and on bits means XOR.' },
    { id:'dh04', topic:'symbols', domain:'mixed', diff:2, kind:'mcq',
      prompt:'Which expression is the density matrix of a pure state $|\\psi\\rangle$?',
      options:['$\\langle\\psi|\\psi\\rangle$','$\\mathrm{Tr}(\\psi)$','$|\\psi\\rangle\\langle\\psi|$','$\\psi^{2}$'],
      answer:2,
      explain:'$\\rho=|\\psi\\rangle\\langle\\psi|$ is the outer-product projector form; $\\langle\\psi|\\psi\\rangle$ is just the scalar 1.' },
    { id:'dh05', topic:'symbols', domain:'states', diff:3, kind:'mcq',
      prompt:'$e^{i\\theta}|\\psi\\rangle$ and $|\\psi\\rangle$ are indistinguishable because…',
      options:['$\\theta$ must be zero','Global phase cancels in every measurement probability','They have different norms','Amplitudes cannot be complex'],
      answer:1,
      explain:'$|e^{i\\theta}\\alpha|^{2}=|\\alpha|^{2}$ — a global phase changes no Born-rule probability. Relative phases do matter.' },
    { id:'dh06', topic:'symbols', domain:'gatemodel', diff:3, kind:'mcq',
      prompt:'$S$ and $T$ relate to $Z$ as…',
      options:['$S=Z^{2},\\ T=S^{2}$','$S=\\sqrt{Z},\\ T=\\sqrt{S}$','$S=T=Z$','$S=Z^{\\dagger}$'],
      answer:1,
      explain:'$S^{2}=Z$ and $T^{2}=S$ — they are square-root phase gates adding finer $Z$-rotations.' },
    { id:'dh07', topic:'symbols', domain:'measure', diff:2, kind:'mcq',
      prompt:'$\\langle\\psi|A|\\psi\\rangle$ is read as…',
      options:['The norm of $A$','The outer product of $A$','The expectation value of observable $A$','The trace of $A$'],
      answer:2,
      explain:'Sandwiching $A$ between bra and ket gives the average measurement outcome $\\langle A\\rangle$.' },
    { id:'dh08', topic:'symbols', domain:'algorithms', diff:3, kind:'mcq',
      prompt:'In HHL, $\\kappa$ (kappa) controls the runtime because it is…',
      options:['The number of qubits','The condition number $\\lambda_{\\max}/\\lambda_{\\min}$ of $A$','The error tolerance','The circuit depth'],
      answer:1,
      explain:'HHL is polylog in $N$ but polynomial in $\\kappa$ — well-conditioned matrices are the fast case.' }
  );

  window.QML_DEF_QUESTIONS = qs;
})();
