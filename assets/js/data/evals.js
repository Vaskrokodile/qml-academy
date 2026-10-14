/* ============================================================
   QML_EVALS — scored evaluations per theme.
   {
     id: 'eval-states',
     themes: ['states','multi'], // array of topic ids from QML.DB.TOPICS
     title: 'Quantum States & Bra-Ket',
     desc: 'Kets, bras, superposition, normalization.',
     icon: 'atom',               // icon name from QML.icon set
     timeMin: 8,
     questions: [ same schema as QML_QUESTIONS (topic optional, defaults to theme) ]
   }
   ============================================================ */
window.QML_EVALS = [
  {
    id: 'eval-foundations',
    themes: ['math','states'],
    title: 'Foundations: Math & Quantum States',
    desc: 'Probability theory, linear algebra, bra-ket notation, normalization.',
    icon: 'book',
    timeMin: 10,
    questions: [
      {
        id: 'e01-01', topic: 'math', diff: 1, kind: 'mcq',
        prompt: 'A classical stochastic vector p describing a probability distribution must satisfy which condition?',
        options: ['$p_{i} \\geq  0$ for all i and $\\sum _{i} p_{i} = 1$', '$\\sum _{i} |p_{i}|^{2} = 1$', '$p_{i} \\in  \\mathbb{C}$ with $|p_{i}| \\leq  1$', 'Every column of p sums to 1'],
        answer: 0,
        explain: 'Stochastic vectors are non-negative and normalized in the $\\ell ^{1}$ norm; the $\\ell ^{2}$ rule belongs to quantum amplitudes.'
      },
      {
        id: 'e01-02', topic: 'math', diff: 2, kind: 'mcq',
        prompt: 'The left-stochastic matrix $M = \\begin{bmatrix}0.5&1\\\\0.5&0\\end{bmatrix}$ acts on $p = (0.4, 0.6)^{T}$. What is Mp?',
        options: ['$(0.8, 0.2)^{T}$', '$(0.5, 0.5)^{T}$', '$(0.2, 0.8)^{T}$', '$(0.44, 0.56)^{T}$'],
        answer: 0,
        explain: 'Mp = (0.5·0.4 + 1·0.6, 0.5·0.4 + 0·0.6) = (0.8, 0.2); columns summing to 1 keep the output stochastic.'
      },
      {
        id: 'e01-03', topic: 'math', diff: 2, kind: 'mcq',
        prompt: 'For operators A and B, the adjoint $(AB)^{\\dagger}$ equals:',
        options: ['$B^{\\dagger}A^{\\dagger}$', '$A^{\\dagger}B^{\\dagger}$', 'A*B*', '(AB)* alone'],
        answer: 0,
        explain: 'The adjoint reverses order: $(AB)^{\\dagger} = B^{\\dagger}A^{\\dagger}$ — which is why $(U_{2}U_{1})^{\\dagger} = U_{1}^{\\dagger}U_{2}^{\\dagger}$ undoes gates in reverse.'
      },
      {
        id: 'e01-04', topic: 'states', diff: 1, kind: 'mcq',
        prompt: 'For $|\\psi\\rangle  = \\alpha|0\\rangle  + \\beta|1\\rangle , a$ computational-basis measurement yields outcome 1 with probability:',
        options: ['$|\\beta|^{2}$', '$\\beta$', '$|\\alpha|^{2}$', '$\\mathrm{Re} (\\alpha^{*}\\beta)$'],
        answer: 0,
        explain: 'Born $rule: P(1) = |\\langle 1|\\psi\\rangle |^{2} = |\\beta|^{2}$; amplitudes are not probabilities directly.'
      },
      {
        id: 'e01-05', topic: 'states', diff: 2, kind: 'mcq',
        prompt: 'The unnormalized vector $(1+i)|0\\rangle  + (1-i)|1\\rangle $ must be multiplied by which N to become a valid state?',
        options: ['$\\frac{1}{2}$', '$\\frac{1}{\\sqrt{2}}$', '$\\frac{1}{4}$', '$\\frac{1}{2\\sqrt{2}}$'],
        answer: 0,
        explain: '$\\sum |\\alpha_{i}|^{2} = |1+i|^{2} + |1-i|^{2} = 2 + 2 = 4$, so $N = \\frac{1}{\\sqrt{4}} = \\frac{1}{2}$ — complex phases are free, the $\\ell ^{2}$ norm is not.'
      },
      {
        id: 'e01-06', topic: 'states', diff: 2, kind: 'mcq',
        prompt: 'Let $|+i\\rangle  = \\frac{|0\\rangle  + i|1\\rangle }{\\sqrt{2}}$ $\\text{ and } |+\\rangle  = \\frac{|0\\rangle  + |1\\rangle }{\\sqrt{2.}}$ What is $|\\langle +|+i\\rangle |^{2}$?',
        options: ['$\\frac{1}{2}$', '$\\frac{1}{4}$', '$\\frac{1}{\\sqrt{2}}$', '$0$'],
        answer: 0,
        explain: '$\\langle +|+i\\rangle  = \\frac{1 + i}{2}$, so the squared modulus is $|1+i|^\\frac{{2}}{4} = \\frac{2}{4} = \\frac{1}{2}.$'
      },
      {
        id: 'e01-07', topic: 'math', diff: 3, kind: 'mcq',
        prompt: 'Suppose U is unitary and $U|\\psi\\rangle  = \\lambda|\\psi\\rangle $ for some $|\\psi\\rangle  \\neq  0.$ Comparing norms of both sides forces:',
        options: ['$|\\lambda| = 1$', '$\\lambda$ is real', '$\\lambda = \\pm 1$ only', '$|\\lambda| < 1$ unless $U = I$'],
        answer: 0,
        explain: 'Unitaries preserve the $\\ell ^{2}$ norm, so $|\\lambda|\\cdot \\|\\psi\\| = \\|\\psi\\| \\Rightarrow  |\\lambda| = 1$; eigenvalues need not be real (T has $e^{i\\pi/4}$).'
      },
      {
        id: 'e01-08', topic: 'states', diff: 3, kind: 'mcq',
        prompt: 'Which pair of states can be distinguished by some measurement?',
        options: ['$\\frac{|0\\rangle +|1\\rangle }{\\sqrt{2}}$ $\\text{ and } \\frac{|0\\rangle -|1\\rangle }{\\sqrt{2}}$', '$|\\psi\\rangle  \\text{ and } e^{i\\pi/3}|\\psi\\rangle $', '$|\\psi\\rangle $ and $-|\\psi\\rangle $', '$e^{i\\theta}|0\\rangle $ and $|0\\rangle $'],
        answer: 0,
        explain: 'Global phases are unobservable, but $|+\\rangle  vs |-\\rangle $ differ by a relative phase — an X-basis measurement separates them perfectly.'
      },
      {
        id: 'e01-09', topic: 'states', diff: 3, kind: 'mcq',
        prompt: 'For the Pauli matrices, the conjugation XZX equals:',
        options: ['$-Z$', 'Z', 'iY', '$-X$'],
        answer: 0,
        explain: 'ZX = iY, so XZX = iXY = $i(iZ) = -Z$; equivalently X anticommutes with Z and $X^{2} = I$.'
      },
      {
        id: 'e01-10', topic: 'states', diff: 2, kind: 'mcq',
        prompt: 'For $|\\psi\\rangle  = (\\frac{\\sqrt{3}}{2})|0\\rangle  + (\\frac{1}{2})|1\\rangle $, the expectation value $\\langle Z\\rangle  = \\langle \\psi|Z|\\psi\\rangle $ is:',
        options: ['$\\frac{1}{2}$', '$\\frac{\\sqrt{3}}{2}$', '$\\frac{1}{4}$', '$-\\frac{1}{2}$'],
        answer: 0,
        explain: '$\\langle Z\\rangle  = |\\alpha|^{2} - |\\beta|^{2} = \\frac{3}{4} - \\frac{1}{4} = \\frac{1}{2}$; only populations matter for a diagonal observable.'
      }
    ]
  },
  {
    id: 'eval-measurement',
    themes: ['multi','measure'],
    title: 'Entanglement & Measurement',
    desc: 'Tensor products, Bell states, Born rule, expectation values.',
    icon: 'target',
    timeMin: 10,
    questions: [
      {
        id: 'e02-01', topic: 'multi', diff: 1, kind: 'mcq',
        prompt: 'The Hilbert space of three qubits has dimension:',
        options: ['$8$', '$6$', '$9$', '$3$'],
        answer: 0,
        explain: 'Dimension grows as $2^{n}: 2^{3} = 8$ — the exponential scaling that makes classical simulation expensive.'
      },
      {
        id: 'e02-02', topic: 'multi', diff: 2, kind: 'mcq',
        prompt: 'In the ordered basis $\\{|00\\rangle ,|01\\rangle ,|10\\rangle ,|11\\rangle \\}$, the state $|1\\rangle  \\otimes  |+\\rangle $ is which column vector?',
        options: ['$\\frac{(0, 0, 1, 1)^{T}}{\\sqrt{2}}$', '$\\frac{(0, 1, 0, 1)^{T}}{\\sqrt{2}}$', '$\\frac{(1, 0, 1, 0)^{T}}{\\sqrt{2}}$', '$\\frac{(0, 1, 1, 0)^{T}}{\\sqrt{2}}$'],
        answer: 0,
        explain: '$|1\\rangle \\otimes |+\\rangle  = \\frac{|10\\rangle +|11\\rangle }{\\sqrt{2}}$; the first tensor factor selects the second 2-block of the vector.'
      },
      {
        id: 'e02-03', topic: 'multi', diff: 2, kind: 'mcq',
        prompt: 'Which of these two-qubit states is entangled?',
        options: ['$\\frac{|00\\rangle +|11\\rangle }{\\sqrt{2}}$', '$\\frac{|00\\rangle +|01\\rangle }{\\sqrt{2}}$', '$\\frac{|00\\rangle +|01\\rangle +|10\\rangle +|11\\rangle }{2}$', '$|10\\rangle $'],
        answer: 0,
        explain: 'The others factor: $\\frac{|00\\rangle +|01\\rangle }{\\sqrt{2}} = |0\\rangle |+\\rangle $, the uniform state is $|+\\rangle |+\\rangle $; $|\\Phi^{+}\\rangle $ admits no product decomposition.'
      },
      {
        id: 'e02-04', topic: 'multi', diff: 3, kind: 'mcq',
        prompt: 'A normalized state $a|00\\rangle +b|01\\rangle +c|10\\rangle +d|11\\rangle $ is separable iff ad = bc. Which of these is separable?',
        options: ['$\\frac{|00\\rangle -|01\\rangle +|10\\rangle -|11\\rangle }{2}$', '$\\frac{|00\\rangle +|11\\rangle }{\\sqrt{2}}$', '$\\frac{|01\\rangle +|10\\rangle }{\\sqrt{2}}$', '$\\frac{|00\\rangle +|01\\rangle +|10\\rangle }{\\sqrt{3}}$'],
        answer: 0,
        explain: 'Only the first satisfies $ad = bc (= -\\frac{1}{4})$: it equals $|+\\rangle |-\\rangle $. Bell states and the truncated state have ad $\\neq  bc$.'
      },
      {
        id: 'e02-05', topic: 'measure', diff: 1, kind: 'mcq',
        prompt: 'The Born rule says measuring $|\\psi\\rangle $ in an orthonormal basis $\\{|x\\rangle \\}$ gives outcome x with probability:',
        options: ['$|\\langle x|\\psi\\rangle |^{2}$', '$\\langle x|\\psi\\rangle $', '$\\mathrm{Re} \\langle x|\\psi\\rangle $', '$\\mathrm{Tr} (|x\\rangle \\langle x|)$'],
        answer: 0,
        explain: '$P(x) = |\\langle x|\\psi\\rangle |^{2}$ — the squared modulus of the amplitude, after which the state collapses to $|x\\rangle $.'
      },
      {
        id: 'e02-06', topic: 'measure', diff: 2, kind: 'mcq',
        prompt: 'Both qubits of $|\\Phi^{+}\\rangle  = \\frac{|00\\rangle +|11\\rangle }{\\sqrt{2}}$ are measured in the Z basis. Which statement holds?',
        options: ['Outcomes always agree and each marginal is uniform', 'Outcomes always disagree', 'The first outcome is deterministic, the second random', 'Outcomes are independent and both uniform'],
        answer: 0,
        explain: 'P(00) = P(11) = 1/2: marginals are uniform yet perfectly correlated — entanglement lives in the correlations.'
      },
      {
        id: 'e02-07', topic: 'measure', diff: 2, kind: 'mcq',
        prompt: 'For $|\\psi\\rangle  = \\frac{|00\\rangle +|01\\rangle +|10\\rangle }{\\sqrt{3}}$, the first qubit is measured in the Z basis. What are $P(0)$ and the post-measurement state on outcome 0?',
        options: ['$\\frac{2}{3}$, leaving $|0\\rangle \\otimes |+\\rangle $', '$\\frac{1}{3}$, leaving $|1\\rangle |0\\rangle $', '$\\frac{2}{3}$, leaving $|+\\rangle \\otimes |0\\rangle $', '$\\frac{1}{2}$, leaving $|\\Phi^{+}\\rangle $'],
        answer: 0,
        explain: 'Regroup as $|0\\rangle \\frac{|0\\rangle +|1\\rangle }{\\sqrt{3}} + |1\\rangle \\frac{|0\\rangle}{\\sqrt{3}}: P(0) = \\frac{2}{3}$, and renormalizing that branch gives $|0\\rangle \\otimes \\frac{|0\\rangle +|1\\rangle }{\\sqrt{2.}}$'
      },
      {
        id: 'e02-08', topic: 'measure', diff: 3, kind: 'mcq',
        prompt: 'For the singlet $|\\Psi^{-}\\rangle  = \\frac{|01\\rangle -|10\\rangle }{\\sqrt{2}}$, the expectation value $\\langle Z\\otimes Z\\rangle $ is:',
        options: ['$-1$', '$0$', '$+1$', '$\\frac{1}{\\sqrt{2}}$'],
        answer: 0,
        explain: '$Z\\otimes Z$ has eigenvalue $(+1)(-1) = -1$ on both $|01\\rangle $ and $|10\\rangle $, so $|\\Psi^{-}\\rangle  \\text{ is } a -1$ eigenstate of $Z\\otimes Z$.'
      },
      {
        id: 'e02-09', topic: 'measure', diff: 3, kind: 'mcq',
        prompt: 'Qubit 1 of the singlet $|\\Psi^{-}\\rangle $ is measured in the X basis and yields +. Qubit 2 collapses to:',
        options: ['$|-\\rangle $', '$|+\\rangle $', '$|0\\rangle $', 'A state still entangled with qubit 1'],
        answer: 0,
        explain: 'Rewriting $|\\Psi^{-}\\rangle  = \\frac{|-\\rangle |+\\rangle  - |+\\rangle |-\\rangle }{\\sqrt{2}}$ shows X outcomes are anticorrelated: + on qubit 1 leaves $|-\\rangle $.'
      },
      {
        id: 'e02-10', topic: 'measure', diff: 3, kind: 'mcq',
        prompt: 'For $|\\Phi^{+}\\rangle  = \\frac{|00\\rangle +|11\\rangle }{\\sqrt{2}}$ with reduced state $\\rho_{1} = \\mathrm{Tr} _{2}|\\Phi^{+}\\rangle \\langle \\Phi^{+}|$, what are $\\langle Z\\otimes I\\rangle $ and the purity $\\mathrm{Tr} (\\rho_{1}^{2})$?',
        options: ['$0 \\text{ and } \\frac{1}{2}$', '1 and 1', '0 and 1', '$\\frac{1}{2} \\text{ and } \\frac{1}{2}$'],
        answer: 0,
        explain: 'Each Bell qubit is locally maximally mixed $(\\rho_{1} = \\frac{I}{2})$: zero magnetization and purity $\\frac{1}{2}$ despite the globally pure state.'
      }
    ]
  },
  {
    id: 'eval-systems',
    themes: ['mixed','dynamics'],
    title: 'Density Matrices & Quantum Dynamics',
    desc: '$\\rho$, traces, Hamiltonians, Schrödinger evolution, Ising models, open systems.',
    icon: 'layers',
    timeMin: 10,
    questions: [
      {
        id: 'e03-01', topic: 'mixed', diff: 1, kind: 'mcq',
        prompt: 'Which of the following is a valid density matrix?',
        options: ['$\\rho = \\mathrm{diag} (\\frac{1}{2}, \\frac{1}{2})$', '$\\rho = \\mathrm{diag} (\\frac{1}{2}, \\frac{1}{4})$', '$\\rho = |0\\rangle \\langle 1|$', '$\\rho = \\begin{bmatrix}1&1\\\\1&0\\end{bmatrix}$'],
        answer: 0,
        explain: '$\\rho$ must be Hermitian, positive semidefinite and unit-trace; only the maximally mixed qubit state satisfies all three.'
      },
      {
        id: 'e03-02', topic: 'mixed', diff: 2, kind: 'mcq',
        prompt: 'The matrix $\\rho = \\begin{bmatrix}0.6&0.5\\\\0.5&0.4\\end{bmatrix}$ is Hermitian with $\\mathrm{Tr}  \\rho = 1.$ Is it a valid density matrix?',
        options: ['No — it has a negative eigenvalue', 'Yes — Hermiticity and unit trace suffice', 'Yes — it describes a pure state', 'No — its trace exceeds 1'],
        answer: 0,
        explain: '$\\det  \\rho = 0.6\\cdot 0.4 - 0.25 = -0.01 < 0$, so one eigenvalue is negative: positivity fails even though $\\mathrm{Tr}  \\rho = 1 \\text{ and } \\rho^{\\dagger} = \\rho$.'
      },
      {
        id: 'e03-03', topic: 'mixed', diff: 2, kind: 'mcq',
        prompt: 'The mixture $\\rho = \\tfrac{1}{2}|0\\rangle \\langle 0| + \\tfrac{1}{2}|1\\rangle \\langle 1|$ and the pure state $|+\\rangle \\langle +|$ give identical Z-basis statistics. Which observable distinguishes them?',
        options: ['$\\sigma_{x}$', '$\\sigma_{z}$', '$\\sigma_{z}$ measured twice', 'None — they are the same state'],
        answer: 0,
        explain: 'The mixture lacks coherence: $\\langle X\\rangle  = 0 \\text{ for } \\frac{I}{2}$ but $\\langle X\\rangle  = +1$ $\\text{ for } |+\\rangle \\langle +|$ — off-diagonal terms carry the phase information.'
      },
      {
        id: 'e03-04', topic: 'mixed', diff: 3, kind: 'mcq',
        prompt: 'A source prepares $|0\\rangle $ with probability $\\frac{1}{2}$ $\\text{ and } |+\\rangle $ with probability $\\frac{1}{2}.$ What is the purity $\\mathrm{Tr} (\\rho^{2})$ of the resulting ensemble?',
        options: ['$\\frac{3}{4}$', '$1$', '$\\frac{1}{2}$', '$\\frac{5}{8}$'],
        answer: 0,
        explain: '$\\rho = \\tfrac{1}{2}|0\\rangle \\langle 0| + \\tfrac{1}{2}|+\\rangle \\langle +| = \\begin{bmatrix}\\frac{3}{4}&\\frac{1}{4}\\\\\\frac{1}{4}&\\frac{1}{4}\\end{bmatrix}$, so $\\mathrm{Tr}  \\rho^{2} = \\frac{9+1+1+1}{16} = \\frac{3}{4}$ — intermediate purity from classical ignorance.'
      },
      {
        id: 'e03-05', topic: 'dynamics', diff: 1, kind: 'mcq',
        prompt: 'Evolution of a closed quantum system is described by a unitary U, which satisfies:',
        options: ['$U^{\\dagger}U = UU^{\\dagger} = I$', '$U^{\\dagger} = U$', '$\\det  U = 1$', '$U^{2} = I$'],
        answer: 0,
        explain: '$U^{\\dagger}U$ = I preserves the $\\ell ^{2}$ norm so states stay normalized; $U^{\\dagger} = U$ (Hermiticity) is the property of observables, not generic U.'
      },
      {
        id: 'e03-06', topic: 'dynamics', diff: 2, kind: 'mcq',
        prompt: 'For a time-independent Hamiltonian, the Schrödinger equation $i\\hbar  \\partial _{t}|\\psi\\rangle  = H|\\psi\\rangle $ is solved by:',
        options: ['$|\\psi(t)\\rangle  = e^{-iHt/\\hbar }|\\psi(0)\\rangle $', '$|\\psi(t)\\rangle  = e^{-Ht/\\hbar }|\\psi(0)\\rangle $', '$|\\psi(t)\\rangle $ = ($I -$ $\\frac{iHt}{\\hbar} $)$|\\psi(0)\\rangle $', '$e^{-iHt/\\hbar }|\\psi(0)\\rangle $, but only if H is diagonal'],
        answer: 0,
        explain: 'The matrix exponential $e^{-iHt/\\hbar }$ is the unitary generated by Hermitian H; diagonalizability is not required.'
      },
      {
        id: 'e03-07', topic: 'dynamics', diff: 2, kind: 'mcq',
        prompt: 'With $\\hbar  = 1, a$ qubit evolves under $H = (\\frac{\\omega}{2})Z$ starting from $|+\\rangle $. What is $\\langle X\\rangle (t)$?',
        options: ['$\\cos (\\omega t)$', '$\\sin (\\omega t)$', '$\\cos (\\omega \\frac{t}{2})$', '1 — X is conserved'],
        answer: 0,
        explain: 'The $|1\\rangle $ amplitude gains relative phase $e^{i\\omega t}$, so $\\langle X\\rangle  = 2 \\mathrm{Re} (\\alpha^{*}\\beta) = \\cos (\\omega t)$: Larmor precession about the z axis.'
      },
      {
        id: 'e03-08', topic: 'dynamics', diff: 3, kind: 'mcq',
        prompt: 'For the transverse-field Ising chain $H = -J \\sum _{i} \\sigma_{z}^{i}\\sigma_{z}^{i+1} - h \\sum _{i} \\sigma_{x}^{i} \\text{ with } J, h > 0$, the ground state for $h \\gg  J$ is approximately:',
        options: ['$|+\\rangle ^{\\otimes N}$, polarized along +x', 'The degenerate doublet $|00\\dots 0\\rangle $ and $|11\\dots 1\\rangle $', 'The GHZ state $\\frac{|00\\dots 0\\rangle +|11\\dots 1\\rangle }{\\sqrt{2}}$', 'A product of singlet pairs'],
        answer: 0,
        explain: 'When $h \\gg  J$ the field term dominates and its unique ground state is $|+\\rangle ^{\\otimes N}$; the ferromagnetic doublet is the $J \\gg  h$ limit.'
      },
      {
        id: 'e03-09', topic: 'dynamics', diff: 3, kind: 'mcq',
        prompt: 'In an open quantum system, tracing out the environment from a joint system–environment state generally:',
        options: ['Decreases purity — pure entangled system states become mixed', 'Increases $\\mathrm{Tr} (\\rho_{S}^{2})$ — the system gets purer', 'Leaves $\\rho_{S}$ unchanged', 'Always produces I/d'],
        answer: 0,
        explain: 'Partial trace discards correlations: a pure entangled joint state yields a mixed $\\rho_{S}$ (e.g. a Bell pair gives I/2), modeling decoherence.'
      },
      {
        id: 'e03-10', topic: 'dynamics', diff: 3, kind: 'mcq',
        prompt: 'A dephasing channel maps $\\rho \\to  \\begin{bmatrix}\\rho_{00}&(1-\\eta)\\rho_{01}\\\\(1-\\eta)\\rho_{10}&\\rho_{11}\\end{bmatrix}$. As $\\eta \\to  1$, which statement is correct?',
        options: ['Z-basis populations survive while the coherence $\\rho_{01}$ vanishes', 'Populations and coherences decay equally', 'Every state is driven to $|0\\rangle \\langle 0|$', 'The purity $\\mathrm{Tr}  \\rho^{2}$ increases'],
        answer: 0,
        explain: 'Phase damping leaves the diagonal untouched but kills off-diagonals — probabilities persist while superposition dies: the essence of decoherence.'
      }
    ]
  },
  {
    id: 'eval-hardware',
    themes: ['gatemodel','annealing'],
    title: 'Quantum Computing Models',
    desc: 'Gates, circuits, universality, adiabatic theorem, quantum annealing.',
    icon: 'atom',
    timeMin: 10,
    questions: [
      {
        id: 'e04-01', topic: 'gatemodel', diff: 1, kind: 'mcq',
        prompt: 'The Hadamard gate maps $|0\\rangle  \\to  \\frac{|0\\rangle +|1\\rangle }{\\sqrt{2.}}$ What is $H|1\\rangle $?',
        options: ['$\\frac{|0\\rangle -|1\\rangle }{\\sqrt{2}}$', '$\\frac{|0\\rangle +|1\\rangle }{\\sqrt{2}}$', '$|1\\rangle $', '$-|1\\rangle $'],
        answer: 0,
        explain: 'H interchanges the Z and X bases: $H|0\\rangle  = |+\\rangle  \\text{ and } H|1\\rangle  = |-\\rangle $.'
      },
      {
        id: 'e04-02', topic: 'gatemodel', diff: 2, kind: 'mcq',
        prompt: 'The conjugation identity HZH equals:',
        options: ['X', 'Z', 'Y', 'I'],
        answer: 0,
        explain: 'Sandwiching Z between Hadamards rotates it into the X basis: HZH = X, and symmetrically HXH = Z.'
      },
      {
        id: 'e04-03', topic: 'gatemodel', diff: 2, kind: 'mcq',
        prompt: 'A CNOT with control $q_{1}$ and target $q_{2}$ is conjugated as $(H\\otimes H)\\cdot \\mathrm{CNOT} \\cdot (H\\otimes H)$. The resulting circuit equals:',
        options: ['CNOT with control $q_{2}$ and target $q_{1}$', 'The original CNOT', 'CZ controlled on $q_{2}$', '$SWAP(q_{1}, q_{2})$'],
        answer: 0,
        explain: 'Hadamards swap the roles of control and target — conjugating a $\\mathrm{CNOT}  \\text{ by } H\\otimes H$ reverses the direction of information flow.'
      },
      {
        id: 'e04-04', topic: 'gatemodel', diff: 3, kind: 'mcq',
        prompt: 'Which gate set is universal for quantum computation?',
        options: ['$\\{H, T, \\mathrm{CNOT} \\}$', '{H, CNOT} alone', '$\\{X, Z, \\mathrm{CNOT} \\}$', '$\\{H, S, \\mathrm{CNOT} \\}$'],
        answer: 0,
        explain: 'Clifford sets like {H, S, CNOT} are efficiently simulable (Gottesman–Knill); adding the non-Clifford $T = \\mathrm{diag} (1, e^{i\\pi/4})$ gives universality.'
      },
      {
        id: 'e04-05', topic: 'gatemodel', diff: 2, kind: 'mcq',
        prompt: 'With $T = \\mathrm{diag} (1, e^{i\\pi/4})$, the product $T^{4}$ equals:',
        options: ['Z', 'S', 'I', '$T^{\\dagger}$'],
        answer: 0,
        explain: '$T^{4} = \\mathrm{diag} (1, e^{i\\pi}) = \\mathrm{diag} (1, -1) = Z$; the phase gates form a ladder $T^{2} = S, T^{4} = Z, T^{8} = I$.'
      },
      {
        id: 'e04-06', topic: 'gatemodel', diff: 3, kind: 'mcq',
        prompt: 'The minimum number of CNOTs needed to implement $SWAP(q_{1}, q_{2})$, and the correct sequence, is:',
        options: ['$3: \\mathrm{CNOT} _{12}\\cdot \\mathrm{CNOT} _{21}\\cdot \\mathrm{CNOT} _{12}$', '$2: \\mathrm{CNOT} _{12}\\cdot \\mathrm{CNOT} _{21}$', '$3: \\mathrm{CNOT} _{12}$ applied three times', '4: alternating CNOTs'],
        answer: 0,
        explain: 'SWAP = $\\mathrm{CNOT} _{12} \\mathrm{CNOT} _{21} \\mathrm{CNOT} _{12}$; fewer than three CNOTs cannot exchange both bit values.'
      },
      {
        id: 'e04-07', topic: 'annealing', diff: 1, kind: 'mcq',
        prompt: 'The adiabatic theorem says a system starting in the ground state of H(0) stays in the instantaneous ground state of H(t) provided:',
        options: ['H(t) varies slowly relative to the spectral gap', 'The gap closes somewhere on the path', 'H(t) is diagonal at every t', 'The total runtime is minimized'],
        answer: 0,
        explain: 'The theorem needs a nonzero gap and a schedule slow on the scale of $\\frac{1}{g^{2}_{\\mathrm{min}}}$; gap closings cause diabatic jumps out of the ground state.'
      },
      {
        id: 'e04-08', topic: 'annealing', diff: 2, kind: 'mcq',
        prompt: 'In adiabatic quantum computing, the required runtime T scales roughly as:',
        options: ['T ≳ $\\frac{1}{g^{2}_{\\mathrm{min}}}$, where g_min is the minimum gap along $H(s)$', '$T \\propto  g^{2}_{\\mathrm{min}}$', '$T \\propto  \\log  g_{\\mathrm{min}}$', 'T is independent of the gap'],
        answer: 0,
        explain: 'The adiabatic condition gives $T = O(\\frac{1}{g^{2}_{\\mathrm{min}}})$; exponentially small gaps at first-order transitions can destroy the speedup.'
      },
      {
        id: 'e04-09', topic: 'annealing', diff: 2, kind: 'mcq',
        prompt: 'Quantum annealing as implemented on real hardware differs from ideal adiabatic QC because:',
        options: ['It re-runs fast anneals and samples low-energy configurations with no ground-state guarantee', 'It is universal using only $\\sigma_{z}\\sigma_{z}$ couplers', 'It always runs slower than the adiabatic limit', 'It solves arbitrary NP-hard problems in polynomial time'],
        answer: 0,
        explain: 'Since g_min is hard to compute, annealers repeat the schedule $\\sim 10^{3}$ times and keep the best sample — a heuristic; universality would additionally need $\\sigma_{x}\\sigma_{x}$ terms.'
      },
      {
        id: 'e04-10', topic: 'annealing', diff: 3, kind: 'mcq',
        prompt: 'For the schedule $H(s) = A(s)H_{\\mathrm{driver}} + B(s)H_{\\mathrm{problem}}, s = \\frac{t}{T}$, with transverse-field driver $H_{\\mathrm{driver}} = -\\sum _{i}\\sigma_{x}^{i}$, the situation at $s = 0$ is:',
        options: ['$A(0)$ dominates and the initial ground state is $|+\\rangle ^{\\otimes N}$', 'B(0) dominates and the system starts in the Ising ground state', 'The gap is exactly zero at s = 0', 'H(0) = 0, so nothing evolves'],
        answer: 0,
        explain: 'The schedule opens with the driver alone, whose easy ground state $|+\\rangle ^{\\otimes N}$ is the launch point; $B(s)$ is then ramped toward the problem Hamiltonian.'
      }
    ]
  },
  {
    id: 'eval-vqa',
    themes: ['vqa','encoding'],
    title: 'Variational Algorithms & Encoding',
    desc: 'Parametrized circuits, QAOA, parameter-shift gradients, barren plateaus, feature maps.',
    icon: 'refresh',
    timeMin: 10,
    questions: [
      {
        id: 'e05-01', topic: 'vqa', diff: 1, kind: 'mcq',
        prompt: 'In a variational quantum algorithm, the division of labor between quantum and classical hardware is:',
        options: ['The QPU evaluates a parametrized circuit and cost; a classical optimizer updates $\\theta$', 'The QPU runs gradient descent internally', 'The classical CPU simulates the full state vector', 'Parameters are sampled randomly and never updated'],
        answer: 0,
        explain: 'VQAs are hybrid loops: short quantum circuits produce cost estimates while classical optimization adjusts $\\theta$ — built for shallow, noisy devices.'
      },
      {
        id: 'e05-02', topic: 'vqa', diff: 2, kind: 'mcq',
        prompt: 'QAOA at depth p prepares $|\\gamma,\\beta\\rangle  = \\Pi_{k=1}$..$p e^{-i\\beta_{k}H_{M}} e^{-i\\gamma_{k}H_{C}} |+\\rangle ^{\\otimes n}$. How many independent parameters are optimized?',
        options: ['2p', 'p', '$p^{2}$', '$2^{p}$'],
        answer: 0,
        explain: 'Each layer contributes one problem angle $\\gamma_{k}$ and one mixer angle $\\beta_{k}$ — 2p parameters total.'
      },
      {
        id: 'e05-03', topic: 'vqa', diff: 2, kind: 'mcq',
        prompt: 'For $f(\\theta) = \\langle \\psi|U^{\\dagger}(\\theta) O U(\\theta)|\\psi\\rangle  \\text{ with } U(\\theta) = e^{-i\\theta G/2} \\text{ and } G^{2} = I$, the exact analytic gradient $\\partial \\frac{f}{\\partial} \\theta$ is:',
        options: ['$[f(\\theta+\\frac{\\pi}{2}) - f(\\theta-\\frac{\\pi}{2})]/2$', '$[f(\\theta+\\varepsilon) - f(\\theta-\\varepsilon)]/(2\\varepsilon)$, only approximately', '$f(\\theta+\\pi) - f(\\theta)$', 'Not measurable on quantum hardware'],
        answer: 0,
        explain: 'Eigenvalues $\\pm 1$ of G yield the two-term parameter-shift rule — an exact gradient from two shifted evaluations, unlike shot-noise-limited finite differences.'
      },
      {
        id: 'e05-04', topic: 'vqa', diff: 3, kind: 'mcq',
        prompt: 'The barren plateau phenomenon in deep random parametrized circuits refers to:',
        options: ['$Var(\\partial \\theta C)$ decaying exponentially in qubit count, so gradients drown in shot noise', 'The cost landscape having no local minima', 'The classical optimizer overfitting', 'Hardware noise systematically inflating the gradient'],
        answer: 0,
        explain: 'Deep random ansätze approximate 2-designs with gradient variance $\\sim  2^{-n}$, needing exponentially many shots; local costs and shallow structured circuits mitigate it.'
      },
      {
        id: 'e05-05', topic: 'vqa', diff: 3, kind: 'mcq',
        prompt: 'The variational principle guarantees that for any ansatz state $|\\psi(\\theta)\\rangle $ and Hamiltonian H:',
        options: ['$\\langle \\psi(\\theta)|H|\\psi(\\theta)\\rangle  \\geq  E_{0}$, the true ground-state energy', '$\\langle H\\rangle  = E_{0}$ exactly', '$\\langle H\\rangle  \\leq  E_{0}$', '$\\partial \\theta\\langle H\\rangle  = 0$ only at $E_{0}$'],
        answer: 0,
        explain: 'Expanding in H eigenstates gives $\\langle H\\rangle  = \\sum _{i} p_{i}E_{i} \\geq  E_{0}$ — the measured energy always upper-bounds the ground energy, so minimization is justified.'
      },
      {
        id: 'e05-06', topic: 'vqa', diff: 3, kind: 'mcq',
        prompt: 'As $p \\to  \\infty , \\mathrm{QAOA} $ approximates which object — and why does that suggest it can approach the optimum?',
        options: ['A Trotterized adiabatic evolution from driver to problem Hamiltonian', 'A Grover search with p oracle calls', 'A uniformly random Clifford circuit', 'Phase estimation of H_C'],
        answer: 0,
        explain: 'Alternating $e^{-i\\gamma H_{C}} \\text{ and } e^{-i\\beta H_{M}}$ layers discretize an adiabatic path, so deep QAOA can inherit the adiabatic guarantee.'
      },
      {
        id: 'e05-07', topic: 'encoding', diff: 1, kind: 'mcq',
        prompt: 'The basis encoding of the integer 5 on three qubits is:',
        options: ['$|101\\rangle $', '$|5\\rangle $', '$|111\\rangle $', '$\\frac{|101\\rangle +|010\\rangle }{\\sqrt{2}}$'],
        answer: 0,
        explain: '$5 = 101_{2}$ — flip the corresponding qubits of $|000\\rangle $; simple to prepare but wasteful of qubits.'
      },
      {
        id: 'e05-08', topic: 'encoding', diff: 2, kind: 'mcq',
        prompt: 'Amplitude encoding a normalized vector $x \\in  \\mathbb{R}^{8}$ requires how many qubits, and what is the catch?',
        options: ['3 qubits, but preparing arbitrary amplitudes can cost an exponentially deep circuit', '8 qubits, and x must be binary', '3 qubits, with a fixed O(1) preparation cost', '1 qubit, since amplitudes are continuous'],
        answer: 0,
        explain: '$\\log _{2}8 = 3$ qubits hold 8 amplitudes — exponentially compact, but generic state preparation is expensive and x must already be unit-norm.'
      },
      {
        id: 'e05-09', topic: 'encoding', diff: 2, kind: 'mcq',
        prompt: 'A data vector $x = (2, -1)$ is to be amplitude-encoded directly. What must happen first, and why?',
        options: ['Normalize to $x/\\|x\\| = \\frac{(2, -1)}{\\sqrt{5}}$, since amplitudes require unit $\\ell ^{2}$ norm', 'Nothing — any real vector is a valid state', 'Round x to binary and use basis encoding', 'Encode x as a diagonal density matrix'],
        answer: 0,
        explain: 'Quantum states are normalized: $|\\psi(x)\\rangle  = \\sum _{i} x_{i}|i\\rangle /\\|x\\|$; the original norm is lost unless stored in a separate register.'
      },
      {
        id: 'e05-10', topic: 'encoding', diff: 3, kind: 'mcq',
        prompt: 'A feature map $U(x)$ defines the quantum kernel $k(x, x^{\\prime}) = |\\langle 0|U^{\\dagger}(x^{\\prime})U(x)|0\\rangle |^{2}$. Which is a genuine practical concern?',
        options: ['For generic high-dimensional encodings the kernel concentrates near a constant and becomes uninformative', 'The resulting matrix need not be positive semidefinite', '$k(x, x^{\\prime})$ can exceed 1', 'Each entry requires physically entangling the two data points'],
        answer: 0,
        explain: 'In exponentially large feature spaces $|\\langle \\varphi(x)|\\varphi(x^{\\prime})\\rangle |^{2}$ clusters near $\\sim 2^{-n}$ (exponential concentration); it is still a Gram matrix, hence PSD and bounded by 1.'
      }
    ]
  },
  {
    id: 'eval-qml',
    themes: ['mlmethods','algorithms'],
    title: 'Quantum ML Methods & Algorithms',
    desc: 'Kernels, QBoost, probabilistic graphical models, QFT, HHL, Gaussian processes.',
    icon: 'spark',
    timeMin: 10,
    questions: [
      {
        id: 'e06-01', topic: 'mlmethods', diff: 1, kind: 'mcq',
        prompt: 'Ensemble methods such as boosting primarily improve predictive performance by:',
        options: ['Combining many weak learners into a strong predictor', 'Training a single much deeper model', 'Removing the need for labels', 'Guaranteeing zero generalization error'],
        answer: 0,
        explain: 'Weighted combinations of weak classifiers reduce bias/variance — the core idea behind AdaBoost and its quantum variant QBoost.'
      },
      {
        id: 'e06-02', topic: 'mlmethods', diff: 2, kind: 'mcq',
        prompt: 'QBoost reformulates ensemble weighting so it can run on a quantum annealer. Its objective is:',
        options: ['Squared loss of the ensemble prediction plus an $\\ell _{0}$ penalty $\\|w\\|_{0}$', 'Exponential loss as in AdaBoost, with no regularizer', 'Negative log-likelihood with an $\\ell _{2}$ penalty', 'Pure sparsity $\\|w\\|_{0}$ with no loss term'],
        answer: 0,
        explain: 'Minimizing $\\sum _{i}(\\sum _{k} w_{k}h_{k}(x_{i}) - y_{i})^{2} + \\lambda\\|w\\|_{0}$ maps to a QUBO/Ising problem; $\\lambda$ trades ensemble size against accuracy.'
      },
      {
        id: 'e06-03', topic: 'mlmethods', diff: 2, kind: 'mcq',
        prompt: 'Edge case: as the regularization parameter $\\lambda \\to  0$ in the QBoost objective, the optimizer tends to:',
        options: ['Keep every useful classifier, ignoring sparsity', 'Exclude all classifiers', 'Return w = 0', 'Set all $w_{k} = \\frac{1}{2}$'],
        answer: 0,
        explain: '$\\lambda\\|w\\|_{0}$ penalizes each selected model; with $\\lambda \\to  0$ the penalty vanishes and pure square loss retains every weak learner that helps.'
      },
      {
        id: 'e06-04', topic: 'mlmethods', diff: 3, kind: 'mcq',
        prompt: 'An SVM with quantum kernel $k(x, x^{\\prime})$ uses $f(x) = \\sum _{i} \\alpha_{i}y_{i}k(x_{i}, x) + b$. Which property must k satisfy for this to define a legitimate kernel machine?',
        options: ['k must be positive semidefinite (a valid Gram/kernel function)', 'k must be invertible as a function', 'k must be linear in x', 'k must satisfy $k \\leq  1$ for all inputs'],
        answer: 0,
        explain: 'The Mercer/PSD condition guarantees k is an inner product in some feature space; $|\\langle \\varphi(x)|\\varphi(x^{\\prime})\\rangle |^{2}$ satisfies it automatically.'
      },
      {
        id: 'e06-05', topic: 'mlmethods', diff: 3, kind: 'mcq',
        prompt: 'Why is the quantum Boltzmann machine harder to sample classically than the classical Boltzmann machine?',
        options: ['Its Hamiltonian adds noncommuting $\\sigma_{x}$ terms, so Gibbs weights lack a simple classical form', 'It uses strictly more nodes', 'Its energy is unbounded below', 'Classical Boltzmann machines cannot be sampled at all'],
        answer: 0,
        explain: 'Classical BM energies are diagonal; the transverse-field term $-\\sum \\sigma_{x}$ makes H noncommuting, breaking easy Gibbs sampling while enabling quantum thermal-state preparation.'
      },
      {
        id: 'e06-06', topic: 'algorithms', diff: 1, kind: 'mcq',
        prompt: 'The quantum Fourier transform acts on basis states as:',
        options: ['$F|x\\rangle  = (\\frac{1}{\\sqrt{N}}) \\sum _{k} e^{2\\pi ixk/N} |k\\rangle $', '$F|x\\rangle  = |x+1 \\bmod  N\\rangle $', '$F|x\\rangle  = e^{2\\pi ix/N} |x\\rangle $', '$F|x\\rangle  = |N-x\\rangle $'],
        answer: 0,
        explain: 'QFT is the discrete Fourier transform applied to amplitudes — phases $e^{2\\pi ixk/N}$ encode the spectral structure.'
      },
      {
        id: 'e06-07', topic: 'algorithms', diff: 2, kind: 'mcq',
        prompt: 'The QFT on n qubits uses $O(n^{2})$ gates versus $O(n\\cdot 2^{n})$ for the classical FFT. Why does this alone not yield an exponential speedup for computing Fourier coefficients?',
        options: ['The output is a quantum state: reading all amplitudes needs $\\sim 2^{n}$ measurements', 'The QFT only works on single qubits', 'QFT gates are not unitary', 'The FFT is actually faster'],
        answer: 0,
        explain: 'The advantage survives only inside subroutines like phase estimation where a few qubits are measured — full readout destroys it.'
      },
      {
        id: 'e06-08', topic: 'algorithms', diff: 2, kind: 'mcq',
        prompt: 'Quantum phase estimation of $U|\\psi\\rangle  = e^{2\\pi i\\varphi}|\\psi\\rangle  \\text{ with }$ a t-qubit counting register requires which key resources?',
        options: ['Controlled-U^{2^j} operations and an inverse QFT', 'Only single-qubit gates on $|\\psi\\rangle $', 'A classical FFT of $\\varphi$', 'Simultaneous measurement of all eigenvalues'],
        answer: 0,
        explain: 'Phase kickback through controlled powers U^{2^j} writes $\\varphi$ in Fourier form on the register; the inverse QFT then extracts its binary digits.'
      },
      {
        id: 'e06-09', topic: 'algorithms', diff: 3, kind: 'mcq',
        prompt: 'HHL produces $|x\\rangle  \\propto  A^{-1}|b\\rangle $ in time $poly(\\log  N, \\kappa)$. Which of the following is NOT a required assumption?',
        options: ['The solution vector x must be sparse', 'A must be sparse or efficiently row-computable so e^{iAt} is simulable', 'The condition number $\\kappa$ must be small', '$|b\\rangle $ must admit efficient state preparation'],
        answer: 0,
        explain: 'HHL needs sparse well-conditioned A and efficiently prepared $|b\\rangle $; x need not be sparse — but only features like $\\langle x|M|x\\rangle $ are cheap to read out.'
      },
      {
        id: 'e06-10', topic: 'algorithms', diff: 3, kind: 'mcq',
        prompt: 'Gaussian process regression requires inverting an $N\\times N$ kernel matrix — $O(N^{3})$ classically. The quantum-assisted approach obtains speedup by:',
        options: ['Using HHL-type inversion to estimate quantities like $y^{T}K^{-1}y$ without full classical inversion', 'Reading $K^{-1}$ off the device in a single measurement', 'Storing K in a single qubit', 'Replacing the kernel with a linear model'],
        answer: 0,
        explain: 'Quantum linear-algebra routines estimate inner products involving $K^{-1}$ in time scaling with $\\log  N$, inheriting the usual caveats: conditioning, state preparation, limited readout.'
      }
    ]
  }
  ,
  /* ----------------------------------------------------------
     SUB-SUBJECT CHECKS — short mixed-format evals.
     Mix MCQ bank refs with puzzles (match / order / fill) and
     deep proof problems. questions[]: {ref:'qXXX'} resolves
     against QML_QUESTIONS at runtime.
     ---------------------------------------------------------- */
  {
    id: 'mini-math', themes: ['math'], courseId: 'c-foundations', part: 'Quantum bridge',
    title: 'Probability → Quantum: Check', icon: 'book', timeMin: 7,
    desc: 'Stochastic vectors, normalization, and the bridge to amplitudes.',
    questions: [
      { ref: 'q003' }, { ref: 'q007' }, { ref: 'q011' },
      {
        id: 'mm-ord1', topic: 'math', kind: 'order',
        prompt: 'Order the steps of applying a stochastic matrix A to a distribution p = (0.8, 0.2):',
        items: [
          'Check that each column of A sums to 1',
          'Compute q₀ = 0.9·0.8 + 0.3·0.2 = 0.78',
          'Compute q₁ = 0.1·0.8 + 0.7·0.2 = 0.22',
          'Verify q₀ + q₁ = 1 — the output is a valid distribution'
        ],
        explain: 'Validate the matrix first, then each output entry, then the sanity check — always close the loop on normalization.'
      },
      {
        id: 'mm-fill1', topic: 'math', kind: 'fill',
        prompt: 'For |ψ⟩ = 0.6|0⟩ + 0.8|1⟩, what is P(1)? (decimal)',
        answers: ['0.64', '16/25'],
        explain: 'P(1) = 0.8² = 0.64 — amplitudes square to probabilities.'
      },
      {
        id: 'mm-proof1', topic: 'math', kind: 'proof',
        prompt: 'Deep problem: argue from first principles why a left stochastic matrix (columns sum to 1) maps any probability distribution to another probability distribution. Write your reasoning, then score against the rubric.',
        rubric: [
          'Stated that entries must stay non-negative (non-neg × non-neg ≥ 0)',
          'Showed the output sums to 1 by expanding the double sum',
          'Used the column-sum condition exactly where it is needed',
          'Noted this is the classical analogue of unitarity'
        ],
        explain: 'Column sums of 1 are precisely the condition "probability is conserved" — the same role unitarity plays for quantum amplitudes.'
      }
    ]
  },
  {
    id: 'mini-states', themes: ['states'], courseId: 'c-states', part: 'Measurement',
    title: 'Quantum States: Check', icon: 'atom', timeMin: 7,
    desc: 'Kets, amplitudes, the Born rule, and measurement collapse.',
    questions: [
      { ref: 'q015' }, { ref: 'q019' }, { ref: 'q024' },
      {
        id: 'ms-match1', topic: 'states', kind: 'match',
        prompt: 'Match each symbol to what it actually means:',
        pairs: [
          ['$|0\\rangle$', 'basis vector (1,0)ᵀ — the "0" outcome'],
          ['$|a_i|^2$', 'probability of outcome i (Born rule)'],
          ['$\\langle\\phi|$', 'bra — the row/conjugate of |φ⟩'],
          ['collapse', 'state becomes the observed outcome after measuring']
        ],
        explain: 'Kets are columns, bras are rows, squared amplitudes are probabilities, and measurement destroys superposition.'
      },
      {
        id: 'ms-ord1', topic: 'states', kind: 'order',
        prompt: 'Put the lifecycle of a qubit in order:',
        items: [
          'Prepare |ψ⟩ = α|0⟩ + β|1⟩ (superposition exists)',
          'Evolve under a unitary — amplitudes shift, stay normalized',
          'Ask a question: measure in a basis',
          'Get one outcome at odds |α|²/|β|² — superposition collapses'
        ],
        explain: 'Prepare → evolve → measure → collapse. The randomness only appears at the last step.'
      }
    ]
  },
  {
    id: 'mini-multi', themes: ['multi'], courseId: 'c-multi', part: 'Multi-qubit states',
    title: 'Multi-Qubit & Entanglement: Check', icon: 'layers', timeMin: 7,
    desc: 'Tensor products, Bell states, and why entanglement is not just correlation.',
    questions: [
      { ref: 'q028' }, { ref: 'q033' }, { ref: 'q037' },
      {
        id: 'mmq-match1', topic: 'multi', kind: 'match',
        prompt: 'Match the state to its description:',
        pairs: [
          ['$|0\\rangle \\otimes |1\\rangle$', 'product state |01⟩ — separable'],
          ['$(|00\\rangle + |11\\rangle)/\\sqrt{2}$', 'Bell pair — maximally entangled'],
          ['$|0\\rangle \\otimes |0\\rangle \\otimes |0\\rangle$', 'three-qubit register |000⟩'],
          ['$2^n$', 'dimension of an n-qubit state space']
        ],
        explain: 'Tensor products build the space; Bell states live in it but cannot be factored — that non-factorability IS entanglement.'
      },
      {
        id: 'mmq-proof1', topic: 'multi', kind: 'proof',
        prompt: 'Deep problem: show that the Bell state (|00⟩ + |11⟩)/√2 cannot be written as a product |a⟩⊗|b⟩ for any single-qubit states a, b. Lay out the contradiction, then score yourself.',
        rubric: [
          'Wrote |a⟩ = α|0⟩ + β|1⟩ and |b⟩ = γ|0⟩ + δ|1⟩ as a general product',
          'Expanded the product: αγ|00⟩ + αδ|01⟩ + βγ|10⟩ + βδ|11⟩',
          'Matched coefficients to the Bell state: αγ = βδ = 1/√2, αδ = βγ = 0',
          'Derived the contradiction (αγ·βδ = 1/2 but αδ·βγ = 0 — impossible)'
        ],
        explain: 'Setting αδ = βγ = 0 kills two coefficients, which forces one of αγ, βδ to be 0 — contradicting both being 1/√2. The state is inseparable.'
      }
    ]
  },
  {
    id: 'mini-measure', themes: ['measure'], courseId: 'c-measure', part: 'Measurement theory',
    title: 'Measurement Theory: Check', icon: 'target', timeMin: 6,
    desc: 'Born rule, POVMs, decoherence, and post-measurement states.',
    questions: [
      { ref: 'q041' }, { ref: 'q046' }, { ref: 'q050' },
      {
        id: 'mme-match1', topic: 'measure', kind: 'match',
        prompt: 'Match the measurement concept to its meaning:',
        pairs: [
          ['Born rule', 'P(i) = |aᵢ|² — probabilities from squared amplitudes'],
          ['POVM', 'generalized measurement via positive operators'],
          ['decoherence', 'environment leaks which-path info — superposition dies'],
          ['non-demolition', 'measurement that leaves the eigenstate intact for reuse']
        ],
        explain: 'Each term names a different layer of the measurement story: rule, generalization, mechanism, engineering trick.'
      },
      {
        id: 'mme-fill1', topic: 'measure', kind: 'fill',
        prompt: 'A qubit has P(0) = 0.36. What is |amplitude on |0⟩| ? (decimal)',
        answers: ['0.6', '3/5'],
        explain: 'Amplitude = √probability: √0.36 = 0.6. The Born rule runs both ways.'
      }
    ]
  },
  {
    id: 'mini-mixed', themes: ['mixed'], courseId: 'c-mixed', part: 'Open systems',
    title: 'Mixed States: Check', icon: 'layers', timeMin: 6,
    desc: 'Density matrices, purity, dephasing, and partial trace.',
    questions: [
      { ref: 'q054' }, { ref: 'q058' }, { ref: 'q063' },
      {
        id: 'mmi-match1', topic: 'mixed', kind: 'match',
        prompt: 'Match the object to its property:',
        pairs: [
          ['$\\rho$', 'density matrix — a probabilistic mixture of states'],
          ['$\\mathrm{Tr}(\\rho) = 1$', 'normalization for mixed states'],
          ['$\\mathrm{Tr}(\\rho^2)$', 'purity — 1 means pure, 1/d maximally mixed'],
          ['partial trace', 'averaging over one qubit to see the other']
        ],
        explain: 'ρ replaces kets when the system is entangled with something you cannot control — like the environment.'
      },
      {
        id: 'mmi-fill1', topic: 'mixed', kind: 'fill',
        prompt: 'A maximally mixed single-qubit ρ = I/2 has purity Tr(ρ²) = ? (decimal)',
        answers: ['0.5', '1/2'],
        explain: 'Tr((I/2)²) = Tr(I/4) = 2·(1/4) = 0.5 — the lowest possible purity for a qubit.'
      }
    ]
  },
  {
    id: 'mini-dynamics', themes: ['dynamics'], courseId: 'c-dynamics', part: 'Quantum dynamics',
    title: 'Dynamics: Check', icon: 'zap', timeMin: 7,
    desc: 'Schrödinger evolution, unitaries, and Hamiltonians.',
    questions: [
      { ref: 'q067' }, { ref: 'q072' }, { ref: 'q076' },
      {
        id: 'md-ord1', topic: 'dynamics', kind: 'order',
        prompt: 'Order the derivation of unitary time evolution:',
        items: [
          'Write the Schrödinger equation iħ ∂|ψ⟩/∂t = H|ψ⟩',
          'Treat it like a differential equation with matrix H',
          'Exponentiate: |ψ(t)⟩ = e^{−iHt/ħ}|ψ(0)⟩',
          'Identify U = e^{−iHt/ħ} as the unitary evolution operator'
        ],
        explain: 'The Schrödinger equation is just a first-order ODE — its solution is a matrix exponential, which is automatically unitary when H is Hermitian.'
      },
      {
        id: 'md-match1', topic: 'dynamics', kind: 'match',
        prompt: 'Match the term to its role:',
        pairs: [
          ['Hamiltonian H', 'the energy operator driving time evolution'],
          ['unitary U', 'norm-preserving evolution — reversible'],
          ['$e^{-iHt/\\hbar}$', 'the exponential map from H to U'],
          ['Hermitian', 'H = H† — required for real energies']
        ],
        explain: 'H generates, U moves, the exponential connects them, and Hermiticity keeps everything physical.'
      }
    ]
  },
  {
    id: 'mini-gatemodel', themes: ['gatemodel'], courseId: 'c-gatemodel', part: 'Hardware',
    title: 'Gate Model: Check', icon: 'bolt', timeMin: 7,
    desc: 'X/H/CNOT, circuits, universality, and reading circuit diagrams.',
    questions: [
      { ref: 'q080' }, { ref: 'q085' }, { ref: 'q089' },
      {
        id: 'mg-ord1', topic: 'gatemodel', kind: 'order',
        prompt: 'Order the gates to prepare a Bell pair (|00⟩ + |11⟩)/√2 from |00⟩:',
        items: [
          'Start: |0⟩⊗|0⟩',
          'Apply H to the first qubit → (|0⟩+|1⟩)/√2 ⊗ |0⟩',
          'Apply CNOT (first controls second) → (|00⟩+|11⟩)/√2',
          'Measure either qubit — the other collapses to match'
        ],
        explain: 'H creates the superposition, CNOT correlates it. Two gates, one entangled pair — the hello-world of quantum computing.'
      },
      {
        id: 'mg-match1', topic: 'gatemodel', kind: 'match',
        prompt: 'Match the gate to its action:',
        pairs: [
          ['X (NOT)', 'flips |0⟩ ↔ |1⟩'],
          ['H (Hadamard)', 'creates/destructs superposition: |0⟩ → (|0⟩+|1⟩)/√2'],
          ['Z', 'phase flip: leaves |0⟩, negates |1⟩'],
          ['CNOT', 'flips the target only if the control is |1⟩']
        ],
        explain: 'X and Z are bit- and phase-flips; H builds superposition; CNOT builds entanglement. Together they are nearly universal.'
      }
    ]
  },
  {
    id: 'mini-annealing', themes: ['annealing'], courseId: 'c-annealing', part: 'Sampling',
    title: 'Annealing & Adiabatic QC: Check', icon: 'flame', timeMin: 6,
    desc: 'Hamiltonian ramps, minimum gaps, tunneling vs climbing.',
    questions: [
      { ref: 'q093' }, { ref: 'q097' }, { ref: 'q102' },
      {
        id: 'ma-ord1', topic: 'annealing', kind: 'order',
        prompt: 'Order the stages of an adiabatic quantum computation:',
        items: [
          'Prepare the easy ground state of a simple Hamiltonian H₀',
          'Slowly interpolate H(s) = (1−s)H₀ + sH₁',
          'The system tracks the instantaneous ground state',
          'Read out: the final state is the ground state of H₁ — the answer'
        ],
        explain: 'Start easy, morph slowly, stay in the ground state throughout. Speed is limited by the minimum energy gap along the path.'
      },
      {
        id: 'ma-fill1', topic: 'annealing', kind: 'fill',
        prompt: 'The bottleneck of adiabatic evolution is the minimum energy ____ between ground and excited states. (one word)',
        answers: ['gap'],
        explain: 'The minimum gap Δ_min sets how slowly you must evolve — small gap, slow evolution.'
      }
    ]
  },
  {
    id: 'mini-vqa', themes: ['vqa'], courseId: 'c-vqa', part: 'VQA pipeline',
    title: 'Variational Algorithms: Check', icon: 'refresh', timeMin: 7,
    desc: 'Ansatz, cost function, classical optimizer — the VQA loop.',
    questions: [
      { ref: 'q106' }, { ref: 'q111' }, { ref: 'q115' },
      {
        id: 'mv-ord1', topic: 'vqa', kind: 'order',
        prompt: 'Order one iteration of a variational quantum algorithm:',
        items: [
          'Prepare the parametrized state with the ansatz circuit',
          'Measure to estimate the cost function',
          'Feed the cost to the classical optimizer',
          'Update parameters and loop until convergence'
        ],
        explain: 'The quantum computer evaluates, the classical computer decides. That division of labor is the whole trick.'
      },
      {
        id: 'mv-proof1', topic: 'vqa', kind: 'proof',
        prompt: 'Deep problem: explain why VQAs need a classical outer loop at all. What would go wrong if the quantum computer tried to update its own parameters? Write your argument, then rubric-check it.',
        rubric: [
          'Identified that measurement collapses the state — you cannot read and reuse it',
          'Argued that cost evaluation requires many circuit runs (shot noise)',
          'Explained parameter updates need storage/computation the QPU lacks',
          'Noted the hybrid loop keeps each part doing what it does best'
        ],
        explain: 'Quantum state is fragile and expensive to produce — the classical loop amortizes it. The QPU evaluates physics; the CPU does bookkeeping.'
      }
    ]
  },
  {
    id: 'mini-encoding', themes: ['encoding'], courseId: 'c-encoding', part: 'Encoding',
    title: 'Data Encoding: Check', icon: 'infinity', timeMin: 6,
    desc: 'Basis, angle, and amplitude encoding — getting data onto qubits.',
    questions: [
      { ref: 'q119' }, { ref: 'q124' }, { ref: 'q128' },
      {
        id: 'me-match1', topic: 'encoding', kind: 'match',
        prompt: 'Match the encoding scheme to its trade-off:',
        pairs: [
          ['basis encoding', 'one feature → one qubit — cheap but qubit-hungry'],
          ['angle encoding', 'feature → rotation angle — dense per qubit'],
          ['amplitude encoding', '2ⁿ features in n qubits — expensive state prep'],
          ['data re-uploading', 'encode repeatedly through the circuit']
        ],
        explain: 'Every encoding trades qubit count against circuit depth and state-preparation cost. There is no free lunch.'
      },
      {
        id: 'me-fill1', topic: 'encoding', kind: 'fill',
        prompt: 'How many qubits do you need to amplitude-encode a vector with 8 features?',
        answers: ['3'],
        explain: 'log₂ 8 = 3 qubits — amplitude encoding is exponentially dense, which is exactly why state preparation is its cost.'
      }
    ]
  },
  {
    id: 'mini-mlmethods', themes: ['mlmethods'], courseId: 'c-mlmethods', part: 'QML methods',
    title: 'QML Methods: Check', icon: 'medal', timeMin: 7,
    desc: 'Quantum kernels, QNNs, and where advantage might live.',
    questions: [
      { ref: 'q132' }, { ref: 'q137' }, { ref: 'q141' },
      {
        id: 'mm2-match1', topic: 'mlmethods', kind: 'match',
        prompt: 'Match the method to its core idea:',
        pairs: [
          ['quantum kernel', 'use |⟨φ(x)|φ(y)⟩|² as a similarity score'],
          ['QNN', 'parametrized quantum circuit trained like a network'],
          ['QSVM', 'classical SVM with a quantum-computed kernel'],
          ['barren plateau', 'gradients vanish exponentially in big circuits']
        ],
        explain: 'Kernels reuse classical machinery on quantum feature maps; QNNs train circuits end-to-end — and barren plateaus are their nemesis.'
      },
      {
        id: 'mm2-ord1', topic: 'mlmethods', kind: 'order',
        prompt: 'Order the quantum kernel workflow:',
        items: [
          'Encode x into a quantum feature state |φ(x)⟩',
          'Build the overlap circuit to estimate |⟨φ(x)|φ(y)⟩|²',
          'Fill the kernel matrix K(xᵢ, xⱼ) over the dataset',
          'Feed K to a classical kernel method (e.g. SVM)'
        ],
        explain: 'The quantum part produces a matrix of overlaps; everything after that is classical machine learning.'
      }
    ]
  },
  {
    id: 'mini-algorithms', themes: ['algorithms'], courseId: 'c-algorithms', part: 'Algorithms',
    title: 'QFT / HHL / Linear Algebra: Check', icon: 'award', timeMin: 7,
    desc: 'The heavy machinery: QFT, phase estimation, Grover, HHL.',
    questions: [
      { ref: 'q145' }, { ref: 'q149' }, { ref: 'q153' },
      {
        id: 'mal-ord1', topic: 'algorithms', kind: 'order',
        prompt: 'Order the quantum phase estimation pipeline:',
        items: [
          'Prepare an eigenstate |u⟩ of unitary U',
          'Apply controlled-U^{2^k} to a register of counting qubits',
          'Run the inverse QFT on the counting register',
          'Read out the phase φ where U|u⟩ = e^{2πiφ}|u⟩'
        ],
        explain: 'Phase estimation is the Swiss-army subroutine — HHL, order finding, and Shor all route through it.'
      },
      {
        id: 'mal-fill1', topic: 'algorithms', kind: 'fill',
        prompt: 'Grover search over N items needs about how many iterations? (N = 100)',
        answers: ['10', '~8', '7.85', '8'],
        explain: 'Grover scales as √N: √100 = 10 iterations (≈ π/4·√N ≈ 7.85) vs 50 average guesses classically.'
      }
    ]
  },
  {
    id: 'eval-notation',
    themes: ['symbols'],
    title: 'Notation Mastery',
    desc: 'Every QML symbol — Dirac notation, gates, density matrices, variational and algorithm notation.',
    icon: 'infinity',
    timeMin: 12,
    questions: [
      { ref: 'dn004', topic: 'symbols' },
      { ref: 'dn013', topic: 'symbols' },
      { ref: 'dn023', topic: 'symbols' },
      { ref: 'dn037', topic: 'symbols' },
      { ref: 'dn078', topic: 'symbols' },
      { ref: 'dn104', topic: 'symbols' },
      { ref: 'ds087', topic: 'symbols' },
      { ref: 'dh02', topic: 'symbols' },
      {
        id: 'nt-match1', topic: 'symbols', kind: 'match',
        prompt: 'Match each symbol to its meaning:',
        pairs: [
          ['$\\rho$', 'density matrix'],
          ['$\\theta$', 'variational parameters'],
          ['CNOT', 'controlled-NOT gate'],
          ['$\\kappa$', 'condition number'],
          ['$K(x, x^{\\prime})$', 'quantum kernel'],
          ['$\\mathrm{Tr}_{B}$', 'partial trace']
        ],
        explain: 'These six span the whole pipeline: state → parameters → gates → algorithms → models → subsystems.'
      },
      {
        id: 'nt-ord1', topic: 'symbols', kind: 'order',
        prompt: 'Order the variational algorithm loop in notation:',
        items: [
          'Prepare the ansatz state $U(\\theta)|0\\rangle$',
          'Measure the cost $C(\\theta) = \\langle H\\rangle_{\\theta}$',
          'Estimate $\\partial C/\\partial\\theta$ via parameter shift',
          'Update $\\theta \\leftarrow \\theta - \\eta\\nabla C$',
          'Repeat until $C(\\theta)$ converges'
        ],
        explain: 'Prepare → measure → gradient → update — the quantum-classical feedback loop at the heart of every VQA.'
      },
      {
        id: 'nt-fill1', topic: 'symbols', kind: 'fill',
        prompt: 'In a circuit diagram, a single-qubit box labeled H denotes which gate?',
        answers: ['hadamard', 'hadamard gate', 'H gate'],
        explain: 'H is the Hadamard — it maps |0⟩ to |+⟩. (Elsewhere, H also means the Hamiltonian — context decides.)'
      },
      {
        id: 'nt-fill2', topic: 'symbols', kind: 'fill',
        prompt: 'The symbol ⊗ denotes which operation? (two words)',
        answers: ['tensor product', 'kronecker product', 'tensor', 'kronecker'],
        explain: '⊗ is the tensor (Kronecker) product — it combines subsystems and multiplies dimensions.'
      },
      {
        id: 'nt-mcq1', topic: 'symbols', diff: 2, kind: 'mcq',
        prompt: 'A paper writes $\\langle O\\rangle_{x}$ for a QML model output. What is it?',
        options: ['The dataset mean', 'An expectation value of observable $O$ on the encoded input $x$', 'The oracle query count', 'The overlap of two kernels'],
        answer: 1,
        explain: 'The readout expectation — the model\'s prediction is a measured expectation value on the data-encoding state.'
      },
      {
        id: 'nt-mcq2', topic: 'symbols', diff: 3, kind: 'mcq',
        prompt: '$\\mathrm{Var}(\\partial C) \\approx 0$ in a variational-circuit paper warns of…',
        options: ['A barren plateau — vanishing gradients', 'Perfect convergence', 'Too many shots', 'An encoding bug'],
        answer: 0,
        explain: 'Exponentially vanishing gradient variance is the barren-plateau signature — the landscape flattens and training stalls.'
      }
    ]
  },
  {
    id: 'mini-def-dirac', themes: ['symbols'], courseId: 'c-notation', part: 'Dirac & states',
    title: 'Dirac Notation: Check', icon: 'medal', timeMin: 6,
    desc: 'Bras, kets, inner products and the basis states.',
    questions: [
      { ref: 'ds015', topic: 'symbols' },
      { ref: 'dn017', topic: 'symbols' },
      { ref: 'dn022', topic: 'symbols' },
      {
        id: 'md1-match1', topic: 'symbols', kind: 'match',
        prompt: 'Match the Dirac object to what it is:',
        pairs: [
          ['$|\\psi\\rangle$', 'ket — column-vector state'],
          ['$\\langle\\psi|$', 'bra — conjugate row vector'],
          ['$\\langle\\varphi|\\psi\\rangle$', 'inner product — scalar'],
          ['$|\\psi\\rangle\\langle\\varphi|$', 'outer product — operator']
        ],
        explain: 'Ket = column, bra = row; bra-ket = scalar, ket-bra = operator. Order is everything.'
      },
      {
        id: 'md1-fill1', topic: 'symbols', kind: 'fill',
        prompt: 'The column vector $(1, 0)^{T}$ is written in Dirac notation as the ket of which number?',
        answers: ['0', 'zero', '|0⟩'],
        explain: '|0⟩ = (1, 0)ᵀ — the first computational basis state.'
      }
    ]
  },
  {
    id: 'mini-def-qml', themes: ['symbols'], courseId: 'c-notation', part: 'QML & algorithms',
    title: 'QML Symbols: Check', icon: 'award', timeMin: 7,
    desc: 'Variational parameters, feature maps, kernels and the big algorithms.',
    questions: [
      { ref: 'dn078', topic: 'symbols' },
      { ref: 'dn095', topic: 'symbols' },
      { ref: 'dn105', topic: 'symbols' },
      {
        id: 'md2-match1', topic: 'symbols', kind: 'match',
        prompt: 'Match the QML symbol to its role:',
        pairs: [
          ['$\\theta$', 'trainable circuit parameters'],
          ['$\\Phi(x)$', 'feature map — data to quantum state'],
          ['$\\kappa$', 'condition number — HHL runtime'],
          ['$\\langle H\\rangle_{\\theta}$', 'cost expectation being minimized'],
          ['$\\eta$', 'learning rate — gradient step size']
        ],
        explain: 'θ gets tuned by η-sized steps so that ⟨H⟩_θ drops; Φ(x) feeds the data in and κ decides if HHL is fast.'
      },
      {
        id: 'md2-fill1', topic: 'symbols', kind: 'fill',
        prompt: 'In $\\theta \\leftarrow \\theta - \\eta\\nabla C$, which Greek letter is the learning rate? (spell it)',
        answers: ['eta', 'η'],
        explain: 'η (eta) sets the gradient-descent step size — too big overshoots, too small crawls.'
      }
    ]
  },
  {
    id: 'eval-meta-visual',
    themes: ['meta'], meta: true,
    title: 'Visual Mapping',
    desc: 'Read the pictures: Bloch spheres, circuits, histograms, matrices, heatmaps.',
    icon: 'target',
    timeMin: 10,
    questions: [
      { ref: 'm002', topic: 'meta' },
      { ref: 'm007', topic: 'meta' },
      { ref: 'm013', topic: 'meta' },
      { ref: 'm016', topic: 'meta' },
      { ref: 'm023', topic: 'meta' },
      { ref: 'm029', topic: 'meta' },
      { ref: 'm037', topic: 'meta' },
      { ref: 'm046', topic: 'meta' },
      { ref: 'm053', topic: 'meta' },
      { ref: 'm057', topic: 'meta' },
      {
        id: 'mv-match1', topic: 'meta', kind: 'match',
        prompt: 'Match the visual to what it encodes:',
        pairs: [
          ['Bloch sphere', 'a single-qubit state as a vector'],
          ['circuit wire', 'a qubit evolving left-to-right in time'],
          ['density heatmap', 'ρ entries shown as brightness'],
          ['dot + ⊕ link', 'a CNOT between two qubits'],
          ['flat cost curve', 'a barren plateau']
        ],
        explain: 'Every QML picture has a fixed reading — internalize the map and papers stop looking alien.'
      },
      {
        id: 'mv-fill1', topic: 'meta', kind: 'fill',
        prompt: 'In a circuit diagram, a solid control dot wired to a ⊕ target denotes which gate?',
        answers: ['cnot', 'controlled-not', 'cx', 'controlled not', 'controlled x'],
        explain: 'Dot = control, ⊕ = target bit-flip — the CNOT/CX gate, the standard entangler.'
      }
    ]
  },
  {
    id: 'eval-meta-deep',
    themes: ['meta'], meta: true,
    title: 'Visual Mapping: Deep',
    desc: 'Harder reads — relative phases, noise heatmaps, landscapes and pipelines.',
    icon: 'award',
    timeMin: 12,
    questions: [
      { ref: 'm012', topic: 'meta' },
      { ref: 'm018', topic: 'meta' },
      { ref: 'm024', topic: 'meta' },
      { ref: 'm026', topic: 'meta' },
      { ref: 'm028', topic: 'meta' },
      { ref: 'm034', topic: 'meta' },
      { ref: 'm043', topic: 'meta' },
      { ref: 'm050', topic: 'meta' },
      { ref: 'm056', topic: 'meta' },
      { ref: 'm061', topic: 'meta' },
      {
        id: 'md-ord1', topic: 'meta', kind: 'order',
        prompt: 'Order the states by Bloch-sphere position, north pole → south pole:',
        items: ['$|0\\rangle$', '$|+\\rangle$', '$|{-i}\\rangle$', '$|1\\rangle$'],
        explain: 'North pole |0⟩, equator |+⟩ and |±i⟩, south pole |1⟩ — z position equals ⟨Z⟩.'
      },
      {
        id: 'md-fill1', topic: 'meta', kind: 'fill',
        prompt: 'A density-matrix heatmap with bright diagonal and black off-diagonals shows zero of what? (one word)',
        answers: ['coherence', 'coherences'],
        explain: 'Off-diagonal ρ₀₁ carries the phase coherence — black there means the state is fully decohered/mixed.'
      }
    ]
  }
];
