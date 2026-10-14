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
        options: ['pᵢ ≥ 0 for all i and Σᵢ pᵢ = 1', 'Σᵢ |pᵢ|² = 1', 'pᵢ ∈ ℂ with |pᵢ| ≤ 1', 'Every column of p sums to 1'],
        answer: 0,
        explain: 'Stochastic vectors are non-negative and normalized in the ℓ¹ norm; the ℓ² rule belongs to quantum amplitudes.'
      },
      {
        id: 'e01-02', topic: 'math', diff: 2, kind: 'mcq',
        prompt: 'The left-stochastic matrix M = [[0.5, 1],[0.5, 0]] acts on p = (0.4, 0.6)ᵀ. What is Mp?',
        options: ['(0.8, 0.2)ᵀ', '(0.5, 0.5)ᵀ', '(0.2, 0.8)ᵀ', '(0.44, 0.56)ᵀ'],
        answer: 0,
        explain: 'Mp = (0.5·0.4 + 1·0.6, 0.5·0.4 + 0·0.6) = (0.8, 0.2); columns summing to 1 keep the output stochastic.'
      },
      {
        id: 'e01-03', topic: 'math', diff: 2, kind: 'mcq',
        prompt: 'For operators A and B, the adjoint (AB)† equals:',
        options: ['B†A†', 'A†B†', 'A*B*', '(AB)* alone'],
        answer: 0,
        explain: 'The adjoint reverses order: (AB)† = B†A† — which is why (U₂U₁)† = U₁†U₂† undoes gates in reverse.'
      },
      {
        id: 'e01-04', topic: 'states', diff: 1, kind: 'mcq',
        prompt: 'For |ψ⟩ = α|0⟩ + β|1⟩, a computational-basis measurement yields outcome 1 with probability:',
        options: ['|β|²', 'β', '|α|²', 'Re(α*β)'],
        answer: 0,
        explain: 'Born rule: P(1) = |⟨1|ψ⟩|² = |β|²; amplitudes are not probabilities directly.'
      },
      {
        id: 'e01-05', topic: 'states', diff: 2, kind: 'mcq',
        prompt: 'The unnormalized vector (1+i)|0⟩ + (1−i)|1⟩ must be multiplied by which N to become a valid state?',
        options: ['1/2', '1/√2', '1/4', '1/(2√2)'],
        answer: 0,
        explain: 'Σ|αᵢ|² = |1+i|² + |1−i|² = 2 + 2 = 4, so N = 1/√4 = 1/2 — complex phases are free, the ℓ² norm is not.'
      },
      {
        id: 'e01-06', topic: 'states', diff: 2, kind: 'mcq',
        prompt: 'Let |+i⟩ = (|0⟩ + i|1⟩)/√2 and |+⟩ = (|0⟩ + |1⟩)/√2. What is |⟨+|+i⟩|²?',
        options: ['1/2', '1/4', '1/√2', '0'],
        answer: 0,
        explain: '⟨+|+i⟩ = (1 + i)/2, so the squared modulus is |1+i|²/4 = 2/4 = 1/2.'
      },
      {
        id: 'e01-07', topic: 'math', diff: 3, kind: 'mcq',
        prompt: 'Suppose U is unitary and U|ψ⟩ = λ|ψ⟩ for some |ψ⟩ ≠ 0. Comparing norms of both sides forces:',
        options: ['|λ| = 1', 'λ is real', 'λ = ±1 only', '|λ| < 1 unless U = I'],
        answer: 0,
        explain: 'Unitaries preserve the ℓ² norm, so |λ|·‖ψ‖ = ‖ψ‖ ⇒ |λ| = 1; eigenvalues need not be real (T has e^{iπ/4}).'
      },
      {
        id: 'e01-08', topic: 'states', diff: 3, kind: 'mcq',
        prompt: 'Which pair of states can be distinguished by some measurement?',
        options: ['(|0⟩+|1⟩)/√2 and (|0⟩−|1⟩)/√2', '|ψ⟩ and e^{iπ/3}|ψ⟩', '|ψ⟩ and −|ψ⟩', 'e^{iθ}|0⟩ and |0⟩'],
        answer: 0,
        explain: 'Global phases are unobservable, but |+⟩ vs |−⟩ differ by a relative phase — an X-basis measurement separates them perfectly.'
      },
      {
        id: 'e01-09', topic: 'states', diff: 3, kind: 'mcq',
        prompt: 'For the Pauli matrices, the conjugation XZX equals:',
        options: ['−Z', 'Z', 'iY', '−X'],
        answer: 0,
        explain: 'ZX = iY, so XZX = iXY = i(iZ) = −Z; equivalently X anticommutes with Z and X² = I.'
      },
      {
        id: 'e01-10', topic: 'states', diff: 2, kind: 'mcq',
        prompt: 'For |ψ⟩ = (√3/2)|0⟩ + (1/2)|1⟩, the expectation value ⟨Z⟩ = ⟨ψ|Z|ψ⟩ is:',
        options: ['1/2', '√3/2', '1/4', '−1/2'],
        answer: 0,
        explain: '⟨Z⟩ = |α|² − |β|² = 3/4 − 1/4 = 1/2; only populations matter for a diagonal observable.'
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
        options: ['8', '6', '9', '3'],
        answer: 0,
        explain: 'Dimension grows as 2ⁿ: 2³ = 8 — the exponential scaling that makes classical simulation expensive.'
      },
      {
        id: 'e02-02', topic: 'multi', diff: 2, kind: 'mcq',
        prompt: 'In the ordered basis {|00⟩,|01⟩,|10⟩,|11⟩}, the state |1⟩ ⊗ |+⟩ is which column vector?',
        options: ['(0, 0, 1, 1)ᵀ/√2', '(0, 1, 0, 1)ᵀ/√2', '(1, 0, 1, 0)ᵀ/√2', '(0, 1, 1, 0)ᵀ/√2'],
        answer: 0,
        explain: '|1⟩⊗|+⟩ = (|10⟩+|11⟩)/√2; the first tensor factor selects the second 2-block of the vector.'
      },
      {
        id: 'e02-03', topic: 'multi', diff: 2, kind: 'mcq',
        prompt: 'Which of these two-qubit states is entangled?',
        options: ['(|00⟩+|11⟩)/√2', '(|00⟩+|01⟩)/√2', '(|00⟩+|01⟩+|10⟩+|11⟩)/2', '|10⟩'],
        answer: 0,
        explain: 'The others factor: (|00⟩+|01⟩)/√2 = |0⟩|+⟩, the uniform state is |+⟩|+⟩; |Φ⁺⟩ admits no product decomposition.'
      },
      {
        id: 'e02-04', topic: 'multi', diff: 3, kind: 'mcq',
        prompt: 'A normalized state a|00⟩+b|01⟩+c|10⟩+d|11⟩ is separable iff ad = bc. Which of these is separable?',
        options: ['(|00⟩−|01⟩+|10⟩−|11⟩)/2', '(|00⟩+|11⟩)/√2', '(|01⟩+|10⟩)/√2', '(|00⟩+|01⟩+|10⟩)/√3'],
        answer: 0,
        explain: 'Only the first satisfies ad = bc (= −1/4): it equals |+⟩|−⟩. Bell states and the truncated state have ad ≠ bc.'
      },
      {
        id: 'e02-05', topic: 'measure', diff: 1, kind: 'mcq',
        prompt: 'The Born rule says measuring |ψ⟩ in an orthonormal basis {|x⟩} gives outcome x with probability:',
        options: ['|⟨x|ψ⟩|²', '⟨x|ψ⟩', 'Re⟨x|ψ⟩', 'Tr(|x⟩⟨x|)'],
        answer: 0,
        explain: 'P(x) = |⟨x|ψ⟩|² — the squared modulus of the amplitude, after which the state collapses to |x⟩.'
      },
      {
        id: 'e02-06', topic: 'measure', diff: 2, kind: 'mcq',
        prompt: 'Both qubits of |Φ⁺⟩ = (|00⟩+|11⟩)/√2 are measured in the Z basis. Which statement holds?',
        options: ['Outcomes always agree and each marginal is uniform', 'Outcomes always disagree', 'The first outcome is deterministic, the second random', 'Outcomes are independent and both uniform'],
        answer: 0,
        explain: 'P(00) = P(11) = 1/2: marginals are uniform yet perfectly correlated — entanglement lives in the correlations.'
      },
      {
        id: 'e02-07', topic: 'measure', diff: 2, kind: 'mcq',
        prompt: 'For |ψ⟩ = (|00⟩+|01⟩+|10⟩)/√3, the first qubit is measured in the Z basis. What are P(0) and the post-measurement state on outcome 0?',
        options: ['2/3, leaving |0⟩⊗|+⟩', '1/3, leaving |1⟩|0⟩', '2/3, leaving |+⟩⊗|0⟩', '1/2, leaving |Φ⁺⟩'],
        answer: 0,
        explain: 'Regroup as |0⟩(|0⟩+|1⟩)/√3 + |1⟩|0⟩/√3: P(0) = 2/3, and renormalizing that branch gives |0⟩⊗(|0⟩+|1⟩)/√2.'
      },
      {
        id: 'e02-08', topic: 'measure', diff: 3, kind: 'mcq',
        prompt: 'For the singlet |Ψ⁻⟩ = (|01⟩−|10⟩)/√2, the expectation value ⟨Z⊗Z⟩ is:',
        options: ['−1', '0', '+1', '1/√2'],
        answer: 0,
        explain: 'Z⊗Z has eigenvalue (+1)(−1) = −1 on both |01⟩ and |10⟩, so |Ψ⁻⟩ is a −1 eigenstate of Z⊗Z.'
      },
      {
        id: 'e02-09', topic: 'measure', diff: 3, kind: 'mcq',
        prompt: 'Qubit 1 of the singlet |Ψ⁻⟩ is measured in the X basis and yields +. Qubit 2 collapses to:',
        options: ['|−⟩', '|+⟩', '|0⟩', 'A state still entangled with qubit 1'],
        answer: 0,
        explain: 'Rewriting |Ψ⁻⟩ = (|−⟩|+⟩ − |+⟩|−⟩)/√2 shows X outcomes are anticorrelated: + on qubit 1 leaves |−⟩.'
      },
      {
        id: 'e02-10', topic: 'measure', diff: 3, kind: 'mcq',
        prompt: 'For |Φ⁺⟩ = (|00⟩+|11⟩)/√2 with reduced state ρ₁ = Tr₂|Φ⁺⟩⟨Φ⁺|, what are ⟨Z⊗I⟩ and the purity Tr(ρ₁²)?',
        options: ['0 and 1/2', '1 and 1', '0 and 1', '1/2 and 1/2'],
        answer: 0,
        explain: 'Each Bell qubit is locally maximally mixed (ρ₁ = I/2): zero magnetization and purity 1/2 despite the globally pure state.'
      }
    ]
  },
  {
    id: 'eval-systems',
    themes: ['mixed','dynamics'],
    title: 'Density Matrices & Quantum Dynamics',
    desc: 'ρ, traces, Hamiltonians, Schrödinger evolution, Ising models, open systems.',
    icon: 'layers',
    timeMin: 10,
    questions: [
      {
        id: 'e03-01', topic: 'mixed', diff: 1, kind: 'mcq',
        prompt: 'Which of the following is a valid density matrix?',
        options: ['ρ = diag(1/2, 1/2)', 'ρ = diag(1/2, 1/4)', 'ρ = |0⟩⟨1|', 'ρ = [[1, 1],[1, 0]]'],
        answer: 0,
        explain: 'ρ must be Hermitian, positive semidefinite and unit-trace; only the maximally mixed qubit state satisfies all three.'
      },
      {
        id: 'e03-02', topic: 'mixed', diff: 2, kind: 'mcq',
        prompt: 'The matrix ρ = [[0.6, 0.5],[0.5, 0.4]] is Hermitian with Tr ρ = 1. Is it a valid density matrix?',
        options: ['No — it has a negative eigenvalue', 'Yes — Hermiticity and unit trace suffice', 'Yes — it describes a pure state', 'No — its trace exceeds 1'],
        answer: 0,
        explain: 'det ρ = 0.6·0.4 − 0.25 = −0.01 < 0, so one eigenvalue is negative: positivity fails even though Tr ρ = 1 and ρ† = ρ.'
      },
      {
        id: 'e03-03', topic: 'mixed', diff: 2, kind: 'mcq',
        prompt: 'The mixture ρ = ½|0⟩⟨0| + ½|1⟩⟨1| and the pure state |+⟩⟨+| give identical Z-basis statistics. Which observable distinguishes them?',
        options: ['σ_x', 'σ_z', 'σ_z measured twice', 'None — they are the same state'],
        answer: 0,
        explain: 'The mixture lacks coherence: ⟨X⟩ = 0 for I/2 but ⟨X⟩ = +1 for |+⟩⟨+| — off-diagonal terms carry the phase information.'
      },
      {
        id: 'e03-04', topic: 'mixed', diff: 3, kind: 'mcq',
        prompt: 'A source prepares |0⟩ with probability 1/2 and |+⟩ with probability 1/2. What is the purity Tr(ρ²) of the resulting ensemble?',
        options: ['3/4', '1', '1/2', '5/8'],
        answer: 0,
        explain: 'ρ = ½|0⟩⟨0| + ½|+⟩⟨+| = [[3/4, 1/4],[1/4, 1/4]], so Tr ρ² = (9+1+1+1)/16 = 3/4 — intermediate purity from classical ignorance.'
      },
      {
        id: 'e03-05', topic: 'dynamics', diff: 1, kind: 'mcq',
        prompt: 'Evolution of a closed quantum system is described by a unitary U, which satisfies:',
        options: ['U†U = UU† = I', 'U† = U', 'det U = 1', 'U² = I'],
        answer: 0,
        explain: 'U†U = I preserves the ℓ² norm so states stay normalized; U† = U (Hermiticity) is the property of observables, not generic U.'
      },
      {
        id: 'e03-06', topic: 'dynamics', diff: 2, kind: 'mcq',
        prompt: 'For a time-independent Hamiltonian, the Schrödinger equation iℏ ∂ₜ|ψ⟩ = H|ψ⟩ is solved by:',
        options: ['|ψ(t)⟩ = e^{−iHt/ℏ}|ψ(0)⟩', '|ψ(t)⟩ = e^{−Ht/ℏ}|ψ(0)⟩', '|ψ(t)⟩ = (I − iHt/ℏ)|ψ(0)⟩', 'e^{−iHt/ℏ}|ψ(0)⟩, but only if H is diagonal'],
        answer: 0,
        explain: 'The matrix exponential e^{−iHt/ℏ} is the unitary generated by Hermitian H; diagonalizability is not required.'
      },
      {
        id: 'e03-07', topic: 'dynamics', diff: 2, kind: 'mcq',
        prompt: 'With ℏ = 1, a qubit evolves under H = (ω/2)Z starting from |+⟩. What is ⟨X⟩(t)?',
        options: ['cos(ωt)', 'sin(ωt)', 'cos(ωt/2)', '1 — X is conserved'],
        answer: 0,
        explain: 'The |1⟩ amplitude gains relative phase e^{iωt}, so ⟨X⟩ = 2 Re(α*β) = cos(ωt): Larmor precession about the z axis.'
      },
      {
        id: 'e03-08', topic: 'dynamics', diff: 3, kind: 'mcq',
        prompt: 'For the transverse-field Ising chain H = −J Σᵢ σᶻᵢσᶻᵢ₊₁ − h Σᵢ σˣᵢ with J, h > 0, the ground state for h ≫ J is approximately:',
        options: ['|+⟩^{⊗N}, polarized along +x', 'The degenerate doublet |00…0⟩ and |11…1⟩', 'The GHZ state (|00…0⟩+|11…1⟩)/√2', 'A product of singlet pairs'],
        answer: 0,
        explain: 'When h ≫ J the field term dominates and its unique ground state is |+⟩^{⊗N}; the ferromagnetic doublet is the J ≫ h limit.'
      },
      {
        id: 'e03-09', topic: 'dynamics', diff: 3, kind: 'mcq',
        prompt: 'In an open quantum system, tracing out the environment from a joint system–environment state generally:',
        options: ['Decreases purity — pure entangled system states become mixed', 'Increases Tr(ρ_S²) — the system gets purer', 'Leaves ρ_S unchanged', 'Always produces I/d'],
        answer: 0,
        explain: 'Partial trace discards correlations: a pure entangled joint state yields a mixed ρ_S (e.g. a Bell pair gives I/2), modeling decoherence.'
      },
      {
        id: 'e03-10', topic: 'dynamics', diff: 3, kind: 'mcq',
        prompt: 'A dephasing channel maps ρ → [[ρ₀₀, (1−η)ρ₀₁],[(1−η)ρ₁₀, ρ₁₁]]. As η → 1, which statement is correct?',
        options: ['Z-basis populations survive while the coherence ρ₀₁ vanishes', 'Populations and coherences decay equally', 'Every state is driven to |0⟩⟨0|', 'The purity Tr ρ² increases'],
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
        prompt: 'The Hadamard gate maps |0⟩ → (|0⟩+|1⟩)/√2. What is H|1⟩?',
        options: ['(|0⟩−|1⟩)/√2', '(|0⟩+|1⟩)/√2', '|1⟩', '−|1⟩'],
        answer: 0,
        explain: 'H interchanges the Z and X bases: H|0⟩ = |+⟩ and H|1⟩ = |−⟩.'
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
        prompt: 'A CNOT with control q₁ and target q₂ is conjugated as (H⊗H)·CNOT·(H⊗H). The resulting circuit equals:',
        options: ['CNOT with control q₂ and target q₁', 'The original CNOT', 'CZ controlled on q₂', 'SWAP(q₁, q₂)'],
        answer: 0,
        explain: 'Hadamards swap the roles of control and target — conjugating a CNOT by H⊗H reverses the direction of information flow.'
      },
      {
        id: 'e04-04', topic: 'gatemodel', diff: 3, kind: 'mcq',
        prompt: 'Which gate set is universal for quantum computation?',
        options: ['{H, T, CNOT}', '{H, CNOT} alone', '{X, Z, CNOT}', '{H, S, CNOT}'],
        answer: 0,
        explain: 'Clifford sets like {H, S, CNOT} are efficiently simulable (Gottesman–Knill); adding the non-Clifford T = diag(1, e^{iπ/4}) gives universality.'
      },
      {
        id: 'e04-05', topic: 'gatemodel', diff: 2, kind: 'mcq',
        prompt: 'With T = diag(1, e^{iπ/4}), the product T⁴ equals:',
        options: ['Z', 'S', 'I', 'T†'],
        answer: 0,
        explain: 'T⁴ = diag(1, e^{iπ}) = diag(1, −1) = Z; the phase gates form a ladder T² = S, T⁴ = Z, T⁸ = I.'
      },
      {
        id: 'e04-06', topic: 'gatemodel', diff: 3, kind: 'mcq',
        prompt: 'The minimum number of CNOTs needed to implement SWAP(q₁, q₂), and the correct sequence, is:',
        options: ['3: CNOT₁₂·CNOT₂₁·CNOT₁₂', '2: CNOT₁₂·CNOT₂₁', '3: CNOT₁₂ applied three times', '4: alternating CNOTs'],
        answer: 0,
        explain: 'SWAP = CNOT₁₂ CNOT₂₁ CNOT₁₂; fewer than three CNOTs cannot exchange both bit values.'
      },
      {
        id: 'e04-07', topic: 'annealing', diff: 1, kind: 'mcq',
        prompt: 'The adiabatic theorem says a system starting in the ground state of H(0) stays in the instantaneous ground state of H(t) provided:',
        options: ['H(t) varies slowly relative to the spectral gap', 'The gap closes somewhere on the path', 'H(t) is diagonal at every t', 'The total runtime is minimized'],
        answer: 0,
        explain: 'The theorem needs a nonzero gap and a schedule slow on the scale of 1/g²_min; gap closings cause diabatic jumps out of the ground state.'
      },
      {
        id: 'e04-08', topic: 'annealing', diff: 2, kind: 'mcq',
        prompt: 'In adiabatic quantum computing, the required runtime T scales roughly as:',
        options: ['T ≳ 1/g²_min, where g_min is the minimum gap along H(s)', 'T ∝ g²_min', 'T ∝ log g_min', 'T is independent of the gap'],
        answer: 0,
        explain: 'The adiabatic condition gives T = O(1/g²_min); exponentially small gaps at first-order transitions can destroy the speedup.'
      },
      {
        id: 'e04-09', topic: 'annealing', diff: 2, kind: 'mcq',
        prompt: 'Quantum annealing as implemented on real hardware differs from ideal adiabatic QC because:',
        options: ['It re-runs fast anneals and samples low-energy configurations with no ground-state guarantee', 'It is universal using only σᶻσᶻ couplers', 'It always runs slower than the adiabatic limit', 'It solves arbitrary NP-hard problems in polynomial time'],
        answer: 0,
        explain: 'Since g_min is hard to compute, annealers repeat the schedule ~10³ times and keep the best sample — a heuristic; universality would additionally need σˣσˣ terms.'
      },
      {
        id: 'e04-10', topic: 'annealing', diff: 3, kind: 'mcq',
        prompt: 'For the schedule H(s) = A(s)H_driver + B(s)H_problem, s = t/T, with transverse-field driver H_driver = −Σᵢσˣᵢ, the situation at s = 0 is:',
        options: ['A(0) dominates and the initial ground state is |+⟩^{⊗N}', 'B(0) dominates and the system starts in the Ising ground state', 'The gap is exactly zero at s = 0', 'H(0) = 0, so nothing evolves'],
        answer: 0,
        explain: 'The schedule opens with the driver alone, whose easy ground state |+⟩^{⊗N} is the launch point; B(s) is then ramped toward the problem Hamiltonian.'
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
        options: ['The QPU evaluates a parametrized circuit and cost; a classical optimizer updates θ', 'The QPU runs gradient descent internally', 'The classical CPU simulates the full state vector', 'Parameters are sampled randomly and never updated'],
        answer: 0,
        explain: 'VQAs are hybrid loops: short quantum circuits produce cost estimates while classical optimization adjusts θ — built for shallow, noisy devices.'
      },
      {
        id: 'e05-02', topic: 'vqa', diff: 2, kind: 'mcq',
        prompt: 'QAOA at depth p prepares |γ,β⟩ = Πₖ₌₁..p e^{−iβₖH_M} e^{−iγₖH_C} |+⟩^{⊗n}. How many independent parameters are optimized?',
        options: ['2p', 'p', 'p²', '2^p'],
        answer: 0,
        explain: 'Each layer contributes one problem angle γₖ and one mixer angle βₖ — 2p parameters total.'
      },
      {
        id: 'e05-03', topic: 'vqa', diff: 2, kind: 'mcq',
        prompt: 'For f(θ) = ⟨ψ|U†(θ) O U(θ)|ψ⟩ with U(θ) = e^{−iθG/2} and G² = I, the exact analytic gradient ∂f/∂θ is:',
        options: ['[f(θ+π/2) − f(θ−π/2)]/2', '[f(θ+ε) − f(θ−ε)]/(2ε), only approximately', 'f(θ+π) − f(θ)', 'Not measurable on quantum hardware'],
        answer: 0,
        explain: 'Eigenvalues ±1 of G yield the two-term parameter-shift rule — an exact gradient from two shifted evaluations, unlike shot-noise-limited finite differences.'
      },
      {
        id: 'e05-04', topic: 'vqa', diff: 3, kind: 'mcq',
        prompt: 'The barren plateau phenomenon in deep random parametrized circuits refers to:',
        options: ['Var(∂θC) decaying exponentially in qubit count, so gradients drown in shot noise', 'The cost landscape having no local minima', 'The classical optimizer overfitting', 'Hardware noise systematically inflating the gradient'],
        answer: 0,
        explain: 'Deep random ansätze approximate 2-designs with gradient variance ~ 2^{−n}, needing exponentially many shots; local costs and shallow structured circuits mitigate it.'
      },
      {
        id: 'e05-05', topic: 'vqa', diff: 3, kind: 'mcq',
        prompt: 'The variational principle guarantees that for any ansatz state |ψ(θ)⟩ and Hamiltonian H:',
        options: ['⟨ψ(θ)|H|ψ(θ)⟩ ≥ E₀, the true ground-state energy', '⟨H⟩ = E₀ exactly', '⟨H⟩ ≤ E₀', '∂θ⟨H⟩ = 0 only at E₀'],
        answer: 0,
        explain: 'Expanding in H eigenstates gives ⟨H⟩ = Σᵢ pᵢEᵢ ≥ E₀ — the measured energy always upper-bounds the ground energy, so minimization is justified.'
      },
      {
        id: 'e05-06', topic: 'vqa', diff: 3, kind: 'mcq',
        prompt: 'As p → ∞, QAOA approximates which object — and why does that suggest it can approach the optimum?',
        options: ['A Trotterized adiabatic evolution from driver to problem Hamiltonian', 'A Grover search with p oracle calls', 'A uniformly random Clifford circuit', 'Phase estimation of H_C'],
        answer: 0,
        explain: 'Alternating e^{−iγH_C} and e^{−iβH_M} layers discretize an adiabatic path, so deep QAOA can inherit the adiabatic guarantee.'
      },
      {
        id: 'e05-07', topic: 'encoding', diff: 1, kind: 'mcq',
        prompt: 'The basis encoding of the integer 5 on three qubits is:',
        options: ['|101⟩', '|5⟩', '|111⟩', '(|101⟩+|010⟩)/√2'],
        answer: 0,
        explain: '5 = 101₂ — flip the corresponding qubits of |000⟩; simple to prepare but wasteful of qubits.'
      },
      {
        id: 'e05-08', topic: 'encoding', diff: 2, kind: 'mcq',
        prompt: 'Amplitude encoding a normalized vector x ∈ ℝ⁸ requires how many qubits, and what is the catch?',
        options: ['3 qubits, but preparing arbitrary amplitudes can cost an exponentially deep circuit', '8 qubits, and x must be binary', '3 qubits, with a fixed O(1) preparation cost', '1 qubit, since amplitudes are continuous'],
        answer: 0,
        explain: 'log₂8 = 3 qubits hold 8 amplitudes — exponentially compact, but generic state preparation is expensive and x must already be unit-norm.'
      },
      {
        id: 'e05-09', topic: 'encoding', diff: 2, kind: 'mcq',
        prompt: 'A data vector x = (2, −1) is to be amplitude-encoded directly. What must happen first, and why?',
        options: ['Normalize to x/‖x‖ = (2, −1)/√5, since amplitudes require unit ℓ² norm', 'Nothing — any real vector is a valid state', 'Round x to binary and use basis encoding', 'Encode x as a diagonal density matrix'],
        answer: 0,
        explain: 'Quantum states are normalized: |ψ(x)⟩ = Σᵢ xᵢ|i⟩/‖x‖; the original norm is lost unless stored in a separate register.'
      },
      {
        id: 'e05-10', topic: 'encoding', diff: 3, kind: 'mcq',
        prompt: 'A feature map U(x) defines the quantum kernel k(x, x′) = |⟨0|U†(x′)U(x)|0⟩|². Which is a genuine practical concern?',
        options: ['For generic high-dimensional encodings the kernel concentrates near a constant and becomes uninformative', 'The resulting matrix need not be positive semidefinite', 'k(x, x′) can exceed 1', 'Each entry requires physically entangling the two data points'],
        answer: 0,
        explain: 'In exponentially large feature spaces |⟨φ(x)|φ(x′)⟩|² clusters near ~2^{−n} (exponential concentration); it is still a Gram matrix, hence PSD and bounded by 1.'
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
        options: ['Squared loss of the ensemble prediction plus an ℓ₀ penalty ‖w‖₀', 'Exponential loss as in AdaBoost, with no regularizer', 'Negative log-likelihood with an ℓ₂ penalty', 'Pure sparsity ‖w‖₀ with no loss term'],
        answer: 0,
        explain: 'Minimizing Σᵢ(Σₖ wₖhₖ(xᵢ) − yᵢ)² + λ‖w‖₀ maps to a QUBO/Ising problem; λ trades ensemble size against accuracy.'
      },
      {
        id: 'e06-03', topic: 'mlmethods', diff: 2, kind: 'mcq',
        prompt: 'Edge case: as the regularization parameter λ → 0 in the QBoost objective, the optimizer tends to:',
        options: ['Keep every useful classifier, ignoring sparsity', 'Exclude all classifiers', 'Return w = 0', 'Set all wₖ = 1/2'],
        answer: 0,
        explain: 'λ‖w‖₀ penalizes each selected model; with λ → 0 the penalty vanishes and pure square loss retains every weak learner that helps.'
      },
      {
        id: 'e06-04', topic: 'mlmethods', diff: 3, kind: 'mcq',
        prompt: 'An SVM with quantum kernel k(x, x′) uses f(x) = Σᵢ αᵢyᵢk(xᵢ, x) + b. Which property must k satisfy for this to define a legitimate kernel machine?',
        options: ['k must be positive semidefinite (a valid Gram/kernel function)', 'k must be invertible as a function', 'k must be linear in x', 'k must satisfy k ≤ 1 for all inputs'],
        answer: 0,
        explain: 'The Mercer/PSD condition guarantees k is an inner product in some feature space; |⟨φ(x)|φ(x′)⟩|² satisfies it automatically.'
      },
      {
        id: 'e06-05', topic: 'mlmethods', diff: 3, kind: 'mcq',
        prompt: 'Why is the quantum Boltzmann machine harder to sample classically than the classical Boltzmann machine?',
        options: ['Its Hamiltonian adds noncommuting σˣ terms, so Gibbs weights lack a simple classical form', 'It uses strictly more nodes', 'Its energy is unbounded below', 'Classical Boltzmann machines cannot be sampled at all'],
        answer: 0,
        explain: 'Classical BM energies are diagonal; the transverse-field term −Σσˣ makes H noncommuting, breaking easy Gibbs sampling while enabling quantum thermal-state preparation.'
      },
      {
        id: 'e06-06', topic: 'algorithms', diff: 1, kind: 'mcq',
        prompt: 'The quantum Fourier transform acts on basis states as:',
        options: ['F|x⟩ = (1/√N) Σₖ e^{2πixk/N} |k⟩', 'F|x⟩ = |x+1 mod N⟩', 'F|x⟩ = e^{2πix/N} |x⟩', 'F|x⟩ = |N−x⟩'],
        answer: 0,
        explain: 'QFT is the discrete Fourier transform applied to amplitudes — phases e^{2πixk/N} encode the spectral structure.'
      },
      {
        id: 'e06-07', topic: 'algorithms', diff: 2, kind: 'mcq',
        prompt: 'The QFT on n qubits uses O(n²) gates versus O(n·2ⁿ) for the classical FFT. Why does this alone not yield an exponential speedup for computing Fourier coefficients?',
        options: ['The output is a quantum state: reading all amplitudes needs ~2ⁿ measurements', 'The QFT only works on single qubits', 'QFT gates are not unitary', 'The FFT is actually faster'],
        answer: 0,
        explain: 'The advantage survives only inside subroutines like phase estimation where a few qubits are measured — full readout destroys it.'
      },
      {
        id: 'e06-08', topic: 'algorithms', diff: 2, kind: 'mcq',
        prompt: 'Quantum phase estimation of U|ψ⟩ = e^{2πiφ}|ψ⟩ with a t-qubit counting register requires which key resources?',
        options: ['Controlled-U^{2^j} operations and an inverse QFT', 'Only single-qubit gates on |ψ⟩', 'A classical FFT of φ', 'Simultaneous measurement of all eigenvalues'],
        answer: 0,
        explain: 'Phase kickback through controlled powers U^{2^j} writes φ in Fourier form on the register; the inverse QFT then extracts its binary digits.'
      },
      {
        id: 'e06-09', topic: 'algorithms', diff: 3, kind: 'mcq',
        prompt: 'HHL produces |x⟩ ∝ A⁻¹|b⟩ in time poly(log N, κ). Which of the following is NOT a required assumption?',
        options: ['The solution vector x must be sparse', 'A must be sparse or efficiently row-computable so e^{iAt} is simulable', 'The condition number κ must be small', '|b⟩ must admit efficient state preparation'],
        answer: 0,
        explain: 'HHL needs sparse well-conditioned A and efficiently prepared |b⟩; x need not be sparse — but only features like ⟨x|M|x⟩ are cheap to read out.'
      },
      {
        id: 'e06-10', topic: 'algorithms', diff: 3, kind: 'mcq',
        prompt: 'Gaussian process regression requires inverting an N×N kernel matrix — O(N³) classically. The quantum-assisted approach obtains speedup by:',
        options: ['Using HHL-type inversion to estimate quantities like yᵀK⁻¹y without full classical inversion', 'Reading K⁻¹ off the device in a single measurement', 'Storing K in a single qubit', 'Replacing the kernel with a linear model'],
        answer: 0,
        explain: 'Quantum linear-algebra routines estimate inner products involving K⁻¹ in time scaling with log N, inheriting the usual caveats: conditioning, state preparation, limited readout.'
      }
    ]
  }
];
