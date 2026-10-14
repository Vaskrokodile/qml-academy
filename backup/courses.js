/* ============================================================
   QML_COURSES — interactive courses built from the lecture series.
   {
     id: 'c-states',
     title: 'Quantum States',
     subtitle: 'Superposition, amplitudes, bra-ket notation',
     theme: 'states',            // topic id
     icon: 'atom',
     estMin: 25,
     lessons: [
       {
         id: 'l1',
         title: 'What is a quantum state?',
         videoId: 'Y5WRv_9757A',       // youtube id, shown as link
         videoTitle: 'QML 03 — Quantum States',
         sections: [
           { type: 'text',      body: 'paragraph with **bold** and `code`' },
           { type: 'points',    items: ['key point 1', 'key point 2'] },
           { type: 'symbols',   items: [{ sym: '|ψ⟩', name: 'ket', desc: 'column vector state' }] },
           { type: 'flip',      front: '|0⟩', back: 'computational basis state (1,0)ᵀ' },
           { type: 'quiz',      question: { prompt, options, answer, explain } },
           { type: 'equation',  body: '|ψ⟩ = α|0⟩ + β|1⟩', desc: 'general qubit state' },
         ]
       }
     ]
   }
   ============================================================ */
window.QML_COURSES = [
  /* ----------------------------------------------------------
     1. From Probability to Quantum — lectures 01, 02
     ---------------------------------------------------------- */
  {
    id: 'c-foundations',
    title: 'From Probability to Quantum',
    subtitle: 'The QML pitch, stochastic vectors & why complex numbers',
    theme: 'math',
    icon: 'book',
    estMin: 15,
    lessons: [
      {
        id: 'l1',
        title: 'Why Quantum Machine Learning?',
        videoId: 'QtWCmO_KIlg',
        videoTitle: 'QML 01 — Introduction',
        sections: [
          { type: 'text', body: 'Quantum computers have made rapid progress and are becoming useful for a handful of tasks — and one of those tasks is attacking problems in **machine learning**. But the fit is subtle. Deep neural networks already solve classification extremely well on classical hardware by exploiting parallelism, so there is **no point** in porting easy problems to a quantum computer.' },
          { type: 'points', items: [
            '**QML is about hard models** — e.g. probabilistic models defined over graph structures that resist classical calculation',
            'Easy, highly parallel tasks (big image classifiers) stay classical — no quantum advantage there',
            'This course is practical: it studies the imperfect quantum computers of **today**, which interact with their environment, not only idealized machines',
            'Everything is implemented in **Python in Jupyter notebooks** — you will program a quantum computer yourself'
          ] },
          { type: 'flip', front: 'The QML pitch', back: 'Find learning models that resist classical computation — probabilistic models over graphs are the prime example' },
          { type: 'symbols', items: [
            { sym: 'QML', name: 'quantum machine learning', desc: 'machine learning that exploits quantum computation' },
            { sym: 'QPU', name: 'quantum processing unit', desc: 'the quantum chip — used like an accelerator, similar to a GPU' }
          ] },
          { type: 'quiz', question: {
            prompt: 'According to the course philosophy, which task is the best fit for quantum machine learning?',
            options: [
              'Training a very large image classifier',
              'Probabilistic models over graph structures that resist classical calculation',
              'Sorting a database of customer records',
              'Speeding up ordinary spreadsheet arithmetic'
            ],
            answer: 1,
            explain: 'Deep learning already handles easy, parallel-friendly tasks efficiently. QML targets models that are intrinsically hard for classical computers — typically probabilistic models on graphs.'
          } },
          { type: 'text', body: 'Keep this framing in mind through the whole course: we are hunting for **genuine computational advantage**, not just running familiar algorithms on exotic hardware.' }
        ]
      },
      {
        id: 'l2',
        title: 'Classical Probability Theory',
        videoId: 'm77_muSPrs0',
        videoTitle: 'QML 02 — Classical Probability Theory',
        sections: [
          { type: 'text', body: 'Quantum states are best introduced as a **generalization of classical probability distributions**, and quantum computation as a way of transforming them. Start with a coin flip: outcomes heads and tails carry probabilities p₀ and p₁ — non-negative real numbers that sum to one. Every possible distribution sits on a single line segment, from fully biased coins to the unbiased point (½, ½).' },
          { type: 'equation', body: 'p₀ + p₁ = 1,   pᵢ ≥ 0', desc: 'normalization of a probability distribution' },
          { type: 'points', items: [
            '**Entropy** characterizes a distribution’s unpredictability — it peaks at the uniform distribution, where you have zero predictive power',
            'A **stochastic vector** stacks the probabilities into a column vector — all non-negative entries',
            'Because entries are non-negative, summing them equals summing their absolute values: the vector is normalized in the **1-norm**',
            'Transformations that map distributions to distributions are **stochastic matrices** — a left stochastic matrix has columns that each sum to 1'
          ] },
          { type: 'symbols', items: [
            { sym: 'p⃗', name: 'stochastic vector', desc: 'column vector of non-negative probabilities summing to 1' },
            { sym: '‖p‖₁', name: '1-norm', desc: 'Σᵢ pᵢ = 1 — the classical normalization' },
            { sym: 'H(p)', name: 'entropy', desc: 'unpredictability; maximal for the uniform distribution' },
            { sym: 'A', name: 'stochastic matrix', desc: 'columns sum to 1; maps distributions to distributions' }
          ] },
          { type: 'equation', body: '‖p‖₁ = Σᵢ pᵢ = 1', desc: 'stochastic vectors are normalized in the 1-norm — quantum states will use the 2-norm instead' },
          { type: 'flip', front: 'Entropy', back: 'a measure of unpredictability of a distribution — highest for the uniform (unbiased) case' },
          { type: 'quiz', question: {
            prompt: 'A left stochastic matrix, applied to a stochastic vector, must satisfy which condition?',
            options: [
              'Its columns each sum to 1',
              'Its rows must be orthonormal',
              'Its determinant must equal 1',
              'All its entries must be complex'
            ],
            answer: 0,
            explain: 'Columns summing to 1 guarantees that the output is again a valid probability distribution — the classical analogue of unitarity.'
          } }
        ]
      }
    ]
  },

  /* ----------------------------------------------------------
     2. Quantum States & Bra-Ket — lecture 03
     ---------------------------------------------------------- */
  {
    id: 'c-states',
    title: 'Quantum States & Bra-Ket',
    subtitle: 'Qubits, amplitudes, the Bloch sphere & interference',
    theme: 'states',
    icon: 'atom',
    estMin: 15,
    lessons: [
      {
        id: 'l1',
        title: 'Qubits, Kets & Superposition',
        videoId: 'Y5WRv_9757A',
        videoTitle: 'QML 03 — Quantum States',
        sections: [
          { type: 'text', body: 'A **quantum state** is just like a stochastic vector — a column vector — but with two crucial differences: the entries may be **complex numbers**, and normalization happens in the **2-norm**: the squared absolute values sum to 1. The simplest case, a two-level system, is the **qubit**.' },
          { type: 'equation', body: '|ψ⟩ = a₀|0⟩ + a₁|1⟩,   |a₀|² + |a₁|² = 1', desc: 'general qubit state — a superposition over the canonical basis' },
          { type: 'symbols', items: [
            { sym: '|0⟩', name: 'zero ket', desc: 'the basis vector (1,0)ᵀ' },
            { sym: '|1⟩', name: 'one ket', desc: 'the basis vector (0,1)ᵀ' },
            { sym: 'aᵢ', name: 'probability amplitude', desc: 'complex coefficient; |aᵢ|² gives the outcome probability' },
            { sym: '|·⟩', name: 'ket notation', desc: 'marks a column vector — like the arrow on a stochastic vector' }
          ] },
          { type: 'points', items: [
            '**Superposition** is just the expansion of the vector in a basis — nothing mysterious',
            'Amplitudes are not probabilities: the **Born rule** says outcome 0 occurs with probability |a₀|²',
            'After observing an outcome the state **collapses** to that basis state — the collapse of the wavefunction',
            'A quantum state is also called a **wavefunction**'
          ] },
          { type: 'flip', front: 'Collapse of the wavefunction', back: 'measuring outcome 0 leaves the qubit deterministically in |0⟩ — the superposition is destroyed' },
          { type: 'quiz', question: {
            prompt: 'In |ψ⟩ = a₀|0⟩ + a₁|1⟩, the probability of measuring outcome 1 is…',
            options: ['|a₁|²', 'a₁', '|a₁|', '1 − |a₀|'],
            answer: 0,
            explain: 'The Born rule takes the squared absolute value of the amplitude. a₁ itself can be complex or negative — only |a₁|² is a valid probability.'
          } }
        ]
      },
      {
        id: 'l2',
        title: 'Bloch Sphere & Interference',
        videoId: 'Y5WRv_9757A',
        videoTitle: 'QML 03 — Quantum States',
        sections: [
          { type: 'text', body: 'A two-dimensional complex vector would need four real dimensions to draw — but normalization removes a degree of freedom, so qubit states fit on a three-dimensional object: the **Bloch sphere**. The north pole is |0⟩, the south pole |1⟩ — even though those vectors are actually orthogonal, which is unusual geometry to get used to.' },
          { type: 'points', items: [
            'Classical two-outcome distributions live on a **line segment**; qubit states cover a whole **2D surface** — far richer representational power',
            '**Interference**: amplitudes of different basis vectors can interact and cancel during a calculation',
            'Example: an operator M sends |0⟩ ↦ (|0⟩+|1⟩)/√2 and |1⟩ ↦ (−|0⟩+|1⟩)/√2',
            'Applying M **again** to M|0⟩ makes the |0⟩ amplitudes cancel — **destructive interference** — leaving the deterministic outcome |1⟩'
          ] },
          { type: 'equation', body: 'M|0⟩ = (|0⟩+|1⟩)/√2   ⇒   M(M|0⟩) = |1⟩', desc: 'destructive interference erases the |0⟩ amplitude — a deterministic result from two random-looking steps' },
          { type: 'flip', front: 'Bloch sphere', back: 'unit sphere whose surface points are qubit states: |0⟩ at the north pole, |1⟩ at the south' },
          { type: 'symbols', items: [
            { sym: 'θ, φ', name: 'Bloch angles', desc: 'latitude and longitude locating a state on the sphere' },
            { sym: 'M', name: 'interfering operator', desc: 'a rotation-like unitary that redistributes amplitudes' }
          ] },
          { type: 'quiz', question: {
            prompt: 'Applying the operator twice yields a deterministic outcome because…',
            options: [
              'the |0⟩ amplitudes destructively interfere and cancel',
              'the state collapses under measurement',
              'the probabilities renormalize to 1',
              'all amplitudes interfere constructively at once'
            ],
            answer: 0,
            explain: 'The plus and minus contributions to |0⟩ cancel exactly — destructive interference — while the |1⟩ branch survives.'
          } }
        ]
      }
    ]
  },

  /* ----------------------------------------------------------
     3. Multiple Qubits & Entanglement — lecture 04
     ---------------------------------------------------------- */
  {
    id: 'c-multi',
    title: 'Multiple Qubits & Entanglement',
    subtitle: 'Tensor products, product states & the Bell state',
    theme: 'multi',
    icon: 'layers',
    estMin: 12,
    lessons: [
      {
        id: 'l1',
        title: 'Tensor Products & Multi-Qubit Basis',
        videoId: 'bNCC0YMLHuk',
        videoTitle: 'QML 04 — Multiple Qubits',
        sections: [
          { type: 'text', body: 'To build larger systems from qubits we need a new operation: the **tensor product**. Take two kets (a₀,a₁)ᵀ and (b₀,b₁)ᵀ — their tensor product is a four-dimensional vector containing every pairwise product of amplitudes.' },
          { type: 'equation', body: '(a₀,a₁)ᵀ ⊗ (b₀,b₁)ᵀ = (a₀b₀, a₀b₁, a₁b₀, a₁b₁)ᵀ', desc: 'two 2-dim vectors combine into a 4-dim product state' },
          { type: 'points', items: [
            'Basis shorthand: |0⟩ ⊗ |0⟩ is written |0⟩|0⟩ or simply **|00⟩** — it is the first canonical basis vector of the 4-dim space',
            'The four basis states |00⟩, |01⟩, |10⟩, |11⟩ span the whole two-qubit space',
            'Convention: the **rightmost** qubit is qubit 0 — the same ordering as binary digits in digital computers, which is why libraries keep it',
            'States that can be written as a tensor product are called **product states**'
          ] },
          { type: 'symbols', items: [
            { sym: '⊗', name: 'tensor product', desc: 'combines two state spaces into one larger space' },
            { sym: '|01⟩', name: 'two-qubit basis state', desc: 'qubit 1 is 0, qubit 0 (rightmost) is 1' },
            { sym: 'q₀', name: 'qubit 0', desc: 'conventionally the rightmost qubit — least significant' }
          ] },
          { type: 'flip', front: '|10⟩', back: 'qubit 1 = 1, qubit 0 = 0 — the third canonical basis vector of the 4-dim space' },
          { type: 'quiz', question: {
            prompt: 'In standard quantum-computing convention, the rightmost qubit of a register is labeled…',
            options: ['qubit 0', 'the most significant qubit', 'the ancilla', 'the control qubit'],
            answer: 0,
            explain: 'Qubit 0 sits rightmost, mirroring binary notation where the least significant bit is written on the right.'
          } }
        ]
      },
      {
        id: 'l2',
        title: 'Entanglement & the |Φ⁺⟩ State',
        videoId: 'bNCC0YMLHuk',
        videoTitle: 'QML 04 — Multiple Qubits',
        sections: [
          { type: 'text', body: 'Not every state in the two-qubit space factors as a product. The prime example is **|Φ⁺⟩**, the equal superposition of |00⟩ and |11⟩. Suppose it were a product: we would need a₀b₀ = a₁b₁ = 1/√2 — so all four numbers are nonzero — yet the |01⟩ and |10⟩ coefficients a₀b₁ and a₁b₀ must be **zero**. Contradiction. No such factorization exists.' },
          { type: 'equation', body: '|Φ⁺⟩ = (|00⟩ + |11⟩)/√2', desc: 'a maximally entangled Bell state — lives in the same space but cannot be written as a product' },
          { type: 'points', items: [
            'States with no product decomposition are called **entangled states**',
            'Entanglement and interference are the two key quantum resources exploited by quantum algorithms',
            'An entangled system has no description as “state of qubit A plus state of qubit B” — only the joint state exists'
          ] },
          { type: 'symbols', items: [
            { sym: '|Φ⁺⟩', name: 'Bell state', desc: 'maximally entangled two-qubit state' },
            { sym: 'a₀b₀, a₁b₁', name: 'product coefficients', desc: 'would both have to equal 1/√2 while a₀b₁ = a₁b₀ = 0 — impossible' }
          ] },
          { type: 'flip', front: 'Product state vs entangled state', back: 'product: factors into per-qubit kets; entangled: no factorization exists — the whole is more than the parts' },
          { type: 'quiz', question: {
            prompt: 'Why can |Φ⁺⟩ not be written as a product state?',
            options: [
              'a₀b₀ and a₁b₁ must both be nonzero while a₀b₁ and a₁b₀ must both be zero — impossible',
              'its norm is not equal to 1',
              'it contains too many qubits',
              'tensor products cannot mix |0⟩ and |1⟩'
            ],
            answer: 0,
            explain: 'The four required coefficient conditions contradict each other: the |00⟩ and |11⟩ terms force all amplitudes nonzero, while the absent |01⟩ and |10⟩ terms force some to be zero.'
          } }
        ]
      }
    ]
  },

  /* ----------------------------------------------------------
     4. Measurement & Probabilities — lecture 05
     ---------------------------------------------------------- */
  {
    id: 'c-measure',
    title: 'Measurement & Probabilities',
    subtitle: 'Bras, projectors and the Born rule made formal',
    theme: 'measure',
    icon: 'target',
    estMin: 15,
    lessons: [
      {
        id: 'l1',
        title: 'Bras, Daggers & Inner Products',
        videoId: 'aVFe08G0uYk',
        videoTitle: 'QML 05 — Measurements',
        sections: [
          { type: 'text', body: 'Complex numbers admit an operation reals do not: **complex conjugation** — flipping the sign of the imaginary part, a₀ = x₀ + iy₀ ↦ x₀ − iy₀. With it we define the partner of every ket: the **bra** ⟨ψ| is the conjugate transpose (dagger, †) of |ψ⟩ — a row vector of conjugated entries.' },
          { type: 'symbols', items: [
            { sym: '⟨ψ|', name: 'bra', desc: 'conjugate transpose of the ket — a row vector' },
            { sym: '†', name: 'dagger', desc: 'transpose + complex conjugate' },
            { sym: '⟨φ|ψ⟩', name: 'inner product', desc: 'row × column — a scalar (the dot product)' },
            { sym: '|φ⟩⟨ψ|', name: 'outer product', desc: 'column × row — a matrix' }
          ] },
          { type: 'equation', body: '⟨ψ|ψ⟩ = |a₀|² + |a₁|² = 1', desc: 'bra-ket of a state with itself = squared 2-norm = normalization' },
          { type: 'points', items: [
            '⟨0|1⟩ = 0 — orthogonal vectors have zero inner product',
            '**Order matters**: bra·ket gives a scalar, ket·bra gives a matrix',
            '|0⟩⟨0| is the **projector** onto the |0⟩ direction — the building block of measurement'
          ] },
          { type: 'flip', front: '⟨0|1⟩', back: '0 — the two basis states are orthogonal' },
          { type: 'quiz', question: {
            prompt: 'The object |0⟩⟨0| is…',
            options: [
              'a 2×2 projection matrix',
              'a scalar equal to 1',
              'a row vector',
              'a normalized qubit state'
            ],
            answer: 0,
            explain: 'Column times row is an outer product — a matrix. Applied to a state it extracts the |0⟩ component: it is the projector onto |0⟩.'
          } }
        ]
      },
      {
        id: 'l2',
        title: 'Born Rule & Projective Measurement',
        videoId: 'aVFe08G0uYk',
        videoTitle: 'QML 05 — Measurements',
        sections: [
          { type: 'text', body: 'A measurement behaves like a **random variable**: it always returns a random outcome. The Born rule says outcome 0 appears with probability |a₀|², and afterwards the state is |0⟩. Formally, getting outcome 0 means applying the projector **P₀ = |0⟩⟨0|** to the state.' },
          { type: 'equation', body: 'P(0) = ⟨ψ|P₀|ψ⟩ = |⟨0|ψ⟩|²', desc: 'probability = expectation value of the projector — the squared length of the projected vector' },
          { type: 'equation', body: '|ψ′⟩ = P₀|ψ⟩ / √⟨ψ|P₀|ψ⟩', desc: 'post-measurement state — the projected vector renormalized' },
          { type: 'points', items: [
            'P₀|ψ⟩ = |0⟩⟨0|ψ⟩ = a₀|0⟩ — the ⟨0|ψ⟩ part collapses to the scalar a₀',
            'The squared norm of that vector is |a₀|² — exactly the Born rule',
            'After the outcome, renormalize the projected vector — the superposition is gone',
            'This formalism is how we mathematically pull samples out of a quantum distribution'
          ] },
          { type: 'symbols', items: [
            { sym: 'P₀', name: 'projector |0⟩⟨0|', desc: 'measurement operator for outcome 0' },
            { sym: '⟨P₀⟩', name: 'expectation value', desc: '⟨ψ|P₀|ψ⟩ — the outcome probability' }
          ] },
          { type: 'flip', front: 'Post-measurement state', back: 'the projected vector renormalized: P|ψ⟩ / √⟨ψ|P|ψ⟩' },
          { type: 'quiz', question: {
            prompt: 'After a projective measurement yields outcome 1, the qubit…',
            options: [
              'becomes P₁|ψ⟩ renormalized — deterministically |1⟩',
              'remains in its original superposition',
              'becomes maximally mixed',
              'is erased entirely'
            ],
            answer: 0,
            explain: 'Measurement collapses the state onto the observed outcome: the projected and renormalized vector is exactly |1⟩.'
          } }
        ]
      }
    ]
  },

  /* ----------------------------------------------------------
     5. Mixed States & Open Systems — lectures 06, 08
     ---------------------------------------------------------- */
  {
    id: 'c-mixed',
    title: 'Mixed States & Open Systems',
    subtitle: 'Density matrices, noise, decoherence & thermal states',
    theme: 'mixed',
    icon: 'spark',
    estMin: 18,
    lessons: [
      {
        id: 'l1',
        title: 'Density Matrices & Mixed States',
        videoId: 'BE8RxAESx5I',
        videoTitle: 'QML 06 — Mixed States',
        sections: [
          { type: 'text', body: 'A ket describes a **pure** state. The equivalent density-matrix picture, ρ = |ψ⟩⟨ψ|, can do something kets cannot: describe **classical mixtures** — a probability distribution over pure states, representing our ignorance about a noisy system.' },
          { type: 'equation', body: 'ρ = Σᵢ pᵢ |ψᵢ⟩⟨ψᵢ|,   P(0) = Tr(P₀ρ)', desc: 'mixture of pure states; probabilities come from the trace, not the norm' },
          { type: 'points', items: [
            '**Tr** — the trace, the sum of diagonal entries — replaces the vector norm when extracting probabilities',
            '**Off-diagonal entries are coherences** — they carry the quantum interference and are critical for quantum operations',
            'Equal superposition |+⟩ has ρ with all entries ½ — full of coherence; a 50/50 classical mixture of |0⟩ and |1⟩ has **zero** off-diagonals — they are different states',
            'The **maximally mixed state** is the analogue of the uniform distribution: maximal entropy, zero predictive power'
          ] },
          { type: 'equation', body: 'ρ_max = ½|0⟩⟨0| + ½|1⟩⟨1| = ½ I', desc: 'the maximally mixed qubit — the classical uniform distribution in disguise' },
          { type: 'symbols', items: [
            { sym: 'ρ', name: 'density matrix', desc: '|ψ⟩⟨ψ| for pure states; weighted sum for mixtures' },
            { sym: 'Tr', name: 'trace', desc: 'sum of diagonal elements — extracts probabilities' },
            { sym: 'pᵢ', name: 'mixture weights', desc: 'classical probabilities over the pure states in the mix' }
          ] },
          { type: 'flip', front: 'Measuring half of |Φ⁺⟩', back: 'project one qubit (identity on the other): the partner qubit is then perfectly correlated — entanglement at work' },
          { type: 'quiz', question: {
            prompt: 'The off-diagonal entries of a density matrix are called…',
            options: ['coherences', 'eigenvalues', 'marginals', 'partitions'],
            answer: 0,
            explain: 'Coherences encode interference between basis states. Noise destroys them — which is why the equal superposition and the 50/50 mixture are physically different.'
          } }
        ]
      },
      {
        id: 'l2',
        title: 'Open Quantum Systems & Thermal States',
        videoId: '_fmBNpDEen4',
        videoTitle: 'QML 08 — Open Quantum Systems',
        sections: [
          { type: 'text', body: 'Real quantum processors are **open systems**: your device of interest is embedded in an environment — a thermal bath — and interacts with it uncontrollably. Evolution is then no longer unitary but a **CPTP map** (completely positive, trace-preserving). You will not need the formalism — just the picture of a system leaking coherence into its surroundings.' },
          { type: 'equation', body: 'ρ = ν|ψ⟩⟨ψ| + (1−ν) I/d', desc: 'mixing a pure state with random noise at visibility ν ∈ [0,1]' },
          { type: 'points', items: [
            'At visibility ν = 1 the state is pure; as ν drops, **coherences fade**; at ν = 0 only the maximally mixed state remains',
            '**T₂ time**: how long coherences survive — your calculation must finish before decoherence wins; a key hardware quality metric',
            'Equilibration is like coffee cooling to room temperature: the system reaches **thermal equilibrium** with its environment',
            'The resulting **thermal state** samples energies by the Boltzmann distribution, e^(−E/kT)/Z'
          ] },
          { type: 'equation', body: 'P(E) ∝ e^(−E/kT) / Z', desc: 'Boltzmann weights; T → 0 gives the ground state, T → ∞ gives the uniform (maximally mixed) state' },
          { type: 'flip', front: 'T₂ time', back: 'characteristic decoherence timescale — how long a device stays quantum before the environment washes out the coherences' },
          { type: 'symbols', items: [
            { sym: 'ν', name: 'visibility', desc: 'tunes between pure state (1) and maximally mixed (0)' },
            { sym: 'Z', name: 'partition function', desc: 'normalization of the Boltzmann distribution' },
            { sym: 'CPTP', name: 'completely positive trace-preserving map', desc: 'the general evolution of an open system' }
          ] },
          { type: 'quiz', question: {
            prompt: 'At infinite temperature, the thermal state of a qubit becomes…',
            options: [
              'the maximally mixed state',
              'the ground state |0⟩',
              'a pure equal superposition',
              'a Bell state'
            ],
            answer: 0,
            explain: 'At T → ∞ the Boltzmann weights flatten to uniform — every energy level is equally likely — which is exactly the maximally mixed state.'
          } }
        ]
      }
    ]
  },

  /* ----------------------------------------------------------
     6. Dynamics, Ising & Many-Body — lectures 07,09,10,11,12,13
     ---------------------------------------------------------- */
  {
    id: 'c-dynamics',
    title: 'Dynamics, Ising & Many-Body',
    subtitle: 'Unitary evolution, spin models & the many-body problem',
    theme: 'dynamics',
    icon: 'zap',
    estMin: 35,
    lessons: [
      {
        id: 'l1',
        title: 'Unitary Evolution in Closed Systems',
        videoId: 'P-mGqiKcEKE',
        videoTitle: 'QML 07 — Evolution in Closed Quantum Systems',
        sections: [
          { type: 'text', body: 'A quantum computation is the evolution of a probability distribution. In a **closed** system — the idealized case — the analogue of a stochastic matrix is a **unitary** matrix: whatever state goes in, a valid quantum state comes out.' },
          { type: 'equation', body: 'U†U = UU† = I', desc: 'unitarity — the conjugate transpose is the inverse' },
          { type: 'points', items: [
            'Unitaries preserve the **2-norm**, so the output is still a normalized quantum state',
            'Evolution is **linear** — genuine nonlinear operations need approximations and tricks, a recurring headache for QML',
            'Evolution is **reversible**: unlike a classical AND gate (whose output alone cannot tell you the inputs), you can always undo a unitary',
            'Example — the **X gate** (quantum NOT): flips |0⟩ ↔ |1⟩; real and symmetric, so X† = X and applying it twice restores the input'
          ] },
          { type: 'symbols', items: [
            { sym: 'U', name: 'unitary', desc: 'norm-preserving, reversible evolution operator' },
            { sym: 'X', name: 'Pauli-X / NOT gate', desc: 'swaps |0⟩ and |1⟩; its own inverse' },
            { sym: 'U†', name: 'adjoint', desc: 'conjugate transpose — undoes the operation' }
          ] },
          { type: 'flip', front: 'X applied to a superposition', back: 'linearity distributes it: X(α|0⟩+β|1⟩) = α|1⟩+β|0⟩ — it swaps the amplitudes' },
          { type: 'quiz', question: {
            prompt: 'Unitary operations are reversible because…',
            options: [
              'U† is the inverse of U',
              'they preserve the 1-norm',
              'they are stochastic matrices',
              'they are nonlinear'
            ],
            answer: 0,
            explain: 'U†U = I means the adjoint undoes the operation — no information is ever lost, unlike classical logic gates.'
          } }
        ]
      },
      {
        id: 'l2',
        title: 'The Classical Ising Model',
        videoId: 'Wy9YoEYv-fA',
        videoTitle: 'QML 09 — Classical Ising Model',
        sections: [
          { type: 'text', body: 'To understand today’s quantum hardware we borrow a model from statistical mechanics. A **spin** is a two-state variable σᵢ = ±1 — like a magnet with its north face pointing up or down. Neighboring magnets prefer to anti-align/align, and nature seeks the lowest-energy configuration.' },
          { type: 'equation', body: 'H = −Σ⟨ᵢⱼ⟩ Jᵢⱼ σᵢσⱼ − Σᵢ hᵢσᵢ', desc: 'Ising Hamiltonian — couplings between neighbors plus an external field on each site' },
          { type: 'points', items: [
            '**Jᵢⱼ** tunes each pairwise coupling; **hᵢ** is an external magnetic field that can flip an individual spin, creating **frustration**',
            'The energy landscape has **local optima**: the system can get stuck behind an energy barrier instead of reaching the global minimum',
            'This is exactly the structure of **QUBO** — quadratic unconstrained binary optimization — which is NP-hard in general',
            'There is a deep correspondence between what is **computationally hard** and what is **physically hard** to solve'
          ] },
          { type: 'symbols', items: [
            { sym: 'σᵢ', name: 'spin variable', desc: '±1 — up or down' },
            { sym: 'Jᵢⱼ', name: 'coupling', desc: 'interaction strength between spins i and j' },
            { sym: 'hᵢ', name: 'local field / bias', desc: 'external field acting on a single spin' },
            { sym: '⟨ij⟩', name: 'nearest neighbors', desc: 'sum only over interacting pairs' }
          ] },
          { type: 'flip', front: 'QUBO ↔ Ising', back: 'quadratic binary optimization problems map directly onto an Ising energy function — solve one and you solve the other' },
          { type: 'quiz', question: {
            prompt: 'Finding the ground state of a general Ising model is…',
            options: [
              'NP-hard — exponentially difficult in the worst case',
              'solvable in linear time',
              'always easy because nature does it',
              'hard only at zero temperature'
            ],
            answer: 0,
            explain: 'Like QUBO, general Ising minimization is NP-hard — local optima trap both algorithms and physical systems.'
          } }
        ]
      },
      {
        id: 'l3',
        title: 'The Transverse Field Ising Model',
        videoId: 'egli0tC1tRo',
        videoTitle: 'QML 10 — Transverse Field Ising Model',
        sections: [
          { type: 'text', body: 'Nothing in the classical Ising model is quantum yet. Rewrite it with the **Pauli σ_z operator**: σ_z|0⟩ = +|0⟩ and σ_z|1⟩ = −|1⟩ — the ±1 eigenvalues play the role of spin values, and the energy becomes the expectation value ⟨ψ|H|ψ⟩.' },
          { type: 'equation', body: 'H = −Σᵢⱼ Jᵢⱼ σ_zⁱσ_zʲ − Σᵢ hᵢσ_zⁱ − Σᵢ gᵢσ_xⁱ', desc: 'adding a transverse σ_x field makes the model genuinely quantum' },
          { type: 'points', items: [
            'A purely σ_z Hamiltonian has **commuting** terms — commuting operators behave essentially classically',
            'σ_x and σ_z **do not commute**: σ_xσ_z ≠ σ_zσ_x — this is where quantum behavior enters',
            'The eigenstates of σ_z are |0⟩, |1⟩ (definite spin); the eigenstates of σ_x are the equal superpositions |±⟩',
            'So the σ_z terms push toward definite 0/1 configurations while the σ_x field pushes toward **superposition** — the competition produces quantum effects'
          ] },
          { type: 'symbols', items: [
            { sym: 'σ_z', name: 'Pauli-Z', desc: 'diag(1,−1): eigenvalues +1, −1 like classical spins' },
            { sym: 'σ_x', name: 'Pauli-X', desc: 'the transverse field — eigenstates are superpositions' },
            { sym: '|+⟩', name: 'plus state', desc: '(|0⟩+|1⟩)/√2 — eigenstate of σ_x' },
            { sym: '⟨H⟩', name: 'energy expectation', desc: '⟨ψ|H|ψ⟩ — the energy of a quantum state' }
          ] },
          { type: 'flip', front: 'σ_z|1⟩', back: '−|1⟩ — eigenvalue −1, the operator version of a spin-down variable' },
          { type: 'quiz', question: {
            prompt: 'What makes the transverse-field Ising model quantum rather than classical?',
            options: [
              'the σ_x and σ_z terms do not commute',
              'it uses more qubits',
              'its spins can only take ±1',
              'its Hamiltonian is diagonal'
            ],
            answer: 0,
            explain: 'Non-commuting terms cannot be simultaneously definite — the σ_x field forces superposition, creating genuinely quantum behavior.'
          } }
        ]
      },
      {
        id: 'l4',
        title: 'The Quantum Many-Body Problem (Melko)',
        videoId: 'MmpOva4-XPg',
        videoTitle: 'QML 11 — Quantum Many-Body Physics (Roger Melko)',
        sections: [
          { type: 'text', body: 'Guest lectures by **Roger Melko** (Waterloo / Perimeter Institute). Quantum many-body physics asks: what is the behavior of **N strongly-interacting quantum particles** — atoms, electrons, qubits — governed by the Schrödinger equation? N ranges from ~10 in atoms, to thousands in quantum chemistry, up to ~10²³ in materials.' },
          { type: 'points', items: [
            'The **hydrogen atom** (N=1 electron) is solvable in closed form; **helium** (N=2) already has no known exact solution',
            'Breaking 2048-bit RSA with Shor’s algorithm needs ~**4000 logical qubits** — and each logical qubit costs hundreds to thousands of physical ones → **~5 million physical qubits**',
            'Spin-½ gives an effective two-state system — the qubit of condensed matter; the Ising model is its simplest interacting Hamiltonian',
            'A few hundred spins → more configurations (2ᴺ) than **atoms in the known universe (~10⁸⁰)** — brute force is physically impossible'
          ] },
          { type: 'equation', body: 'H|ψ⟩ = E|ψ⟩', desc: 'solving the many-body problem = diagonalizing a 2ᴺ × 2ᴺ matrix — O(M³) where M = 2ᴺ' },
          { type: 'symbols', items: [
            { sym: 'N', name: 'particle count', desc: 'number of interacting quantum species' },
            { sym: '2ᴺ', name: 'Hilbert-space dimension', desc: 'the wavefunction is a superposition over all 2ᴺ classical configurations' },
            { sym: 'Z', name: 'partition function', desc: 'normalization sum over all configurations — itself intractable' },
            { sym: 'β', name: 'inverse temperature', desc: '1/k_BT — weights configurations in the Boltzmann distribution' }
          ] },
          { type: 'flip', front: 'Exact diagonalization limit', back: 'state-of-the-art routines reach only N ≈ 30–40 spins — the Hilbert space doubles with every added qubit' },
          { type: 'quiz', question: {
            prompt: 'Why is exact diagonalization of a many-body Hamiltonian hopeless at scale?',
            options: [
              'the matrix is 2ᴺ × 2ᴺ and diagonalizing costs O(M³) — astronomical even for N ≈ 50',
              'the Schrödinger equation cannot be written down',
              'spins cannot be measured',
              'the partition function is always zero'
            ],
            answer: 0,
            explain: 'The Hilbert space grows exponentially, and even the best diagonalization routines top out around 30–40 qubits — motivating quantum supremacy arguments.'
          } }
        ]
      },
      {
        id: 'l5',
        title: 'Solving the Many-Body Problem (Melko)',
        videoId: 'uTCeQHzQMdc',
        videoTitle: 'QML 13 — Strategies to Solve the Many-Body Problem (Roger Melko)',
        sections: [
          { type: 'text', body: 'How do we actually attack the many-body problem? A classical toolbox built over decades — and a new one based on **machine learning**. Remember: silicon chips are themselves quantum many-body systems — just ones where electron interactions can be neglected.' },
          { type: 'points', items: [
            '**Analytical**: perturbation theory and variational principles — powerful when interactions are weak (semiconductors, metals)',
            '**Exact diagonalization**: still the best tool in many cases, despite exponential scaling; truncation and Lanczos iterative solvers extend its reach',
            '**DMRG**: decimates the Hilbert space using the wavefunction’s **entanglement structure** — superb in one dimension (thousands of sites)',
            '**Quantum Monte Carlo**: samples configurations stochastically — reaches millions of sites, but fails when amplitudes cannot be read as probabilities (the **sign problem**)',
            '**Machine learning**: supervised (label phases like ferro-/paramagnetic), unsupervised (clustering, reconstructing wavefunctions — an alternative to tomography), reinforcement learning (fast quantum error correction)'
          ] },
          { type: 'symbols', items: [
            { sym: 'DMRG', name: 'density-matrix renormalization group', desc: 'truncates by entanglement structure; excels in 1D' },
            { sym: 'QMC', name: 'quantum Monte Carlo', desc: 'stochastic sampling of configurations — huge N when it works' },
            { sym: 'RL', name: 'reinforcement learning', desc: 'learns error-correction strategies without labeled data' }
          ] },
          { type: 'flip', front: 'The sign problem', back: 'QMC fails when wavefunction coefficients are complex or negative — they cannot be interpreted as sampling probabilities' },
          { type: 'flip', front: 'Spin configs as images', back: 'map ↑↓ spins to black/white pixels — a quantum big-data problem becomes an ML image problem' },
          { type: 'quiz', question: {
            prompt: 'DMRG solves certain many-body problems efficiently because it exploits…',
            options: [
              'the entanglement structure of the wavefunction',
              'the partition function directly',
              'dense matrix inversion',
              'the uniform distribution over states'
            ],
            answer: 0,
            explain: 'DMRG compresses the Hilbert space by keeping only the entanglement-relevant part of the wavefunction — devastatingly effective in one dimension.'
          } }
        ]
      }
    ]
  },

  /* ----------------------------------------------------------
     7. Gate-Model Quantum Computing — lectures 14, 17
     ---------------------------------------------------------- */
  {
    id: 'c-gatemodel',
    title: 'Gate-Model Quantum Computing',
    subtitle: 'Universal circuits, gates & real hardware',
    theme: 'gatemodel',
    icon: 'evals',
    estMin: 20,
    lessons: [
      {
        id: 'l1',
        title: 'Circuits, Gates & Universality',
        videoId: '92uqxeofPak',
        videoTitle: 'QML 14 — Gate-Model Quantum Computing',
        sections: [
          { type: 'text', body: 'The **gate model** is the universal quantum computing paradigm. The software stack: a problem definition (say, traveling salesman) → a matching quantum algorithm (e.g. QAOA) → a circuit of elementary gates → **compilation** (gate-set translation + connectivity workarounds) → execution on a QPU or a simulator (~20–22 qubits on a laptop, ~50 on a supercomputer).' },
          { type: 'points', items: [
            '**Solovay–Kitaev theorem**: any unitary can be efficiently approximated by a finite universal gate set — this is what makes the model universal',
            'Classical universality = any logical operation on bits; quantum universality = any quantum state mapped to any other',
            '**X** = quantum NOT; **H** (Hadamard) sends |0⟩ to the equal superposition and |1⟩ to the minus version',
            '**CNOT**: a controlled operation — flips the target only when the control qubit is |1⟩',
            'H on qubit 0 followed by CNOT turns |00⟩ into the Bell state |Φ⁺⟩ — your first real quantum algorithm',
            'Today’s devices are **shallow**: only ~10–20 sequential gates before decoherence hits'
          ] },
          { type: 'equation', body: '|00⟩ —H on q₀→ (|0⟩+|1⟩)|0⟩/√2 —CNOT→ (|00⟩+|11⟩)/√2', desc: 'two gates prepare a maximally entangled Bell pair' },
          { type: 'symbols', items: [
            { sym: 'H', name: 'Hadamard', desc: 'creates equal superpositions' },
            { sym: 'CNOT', name: 'controlled-NOT', desc: 'control qubit |1⟩ triggers X on the target' },
            { sym: 'depth', name: 'circuit depth', desc: 'number of sequential gate layers — severely limited today' }
          ] },
          { type: 'flip', front: 'Solovay–Kitaev theorem', back: 'any unitary is efficiently approximated by a finite gate set — the foundation of quantum universality' },
          { type: 'quiz', question: {
            prompt: 'To prepare the Bell state |Φ⁺⟩ starting from |00⟩ you apply…',
            options: [
              'H on one qubit, then a CNOT',
              'a CNOT, then an X gate',
              'X gates on both qubits',
              'H on both qubits'
            ],
            answer: 0,
            explain: 'The Hadamard creates a superposition on the control; the CNOT then correlates the target — yielding (|00⟩+|11⟩)/√2.'
          } }
        ]
      },
      {
        id: 'l2',
        title: 'Hardware: Superconductors, Ions & Photons',
        videoId: 'l06HATJAbdI',
        videoTitle: 'QML 17 — Implementations',
        sections: [
          { type: 'text', body: 'How do you actually build these machines? Three leading candidates. **Superconducting circuits** reuse silicon fabrication (the same fabs as your phone), cool to ~10 mK in a massive fridge, and steer qubits with **microwave pulses** — nanosecond control, very fast.' },
          { type: 'points', items: [
            'Superconducting wafer = **2D layout**: up to ~4 qubits can be fully connected, then wires can no longer cross — connectivity dies',
            'Missing links force the compiler to insert **SWAP gates** (3 CNOTs each) — one logical gate can cost ~7 physical ones, devastating when depth is capped at ~10–20',
            'Short **coherence times** plus a half-million-dollar fridge per machine: real engineering bottlenecks',
            '**Trapped ions**: superb long coherence, laser control — but slower gates and unclear scaling past ~70 qubits',
            '**Photonics**: room-temperature, polarization qubits — but photons are lost in flight and cannot be stored'
          ] },
          { type: 'symbols', items: [
            { sym: 'SWAP', name: 'swap gate', desc: 'exchanges two qubits — costs 3 CNOTs' },
            { sym: 'mK', name: 'millikelvin', desc: 'operating temperature of superconducting qubits' },
            { sym: 'connectivity', name: 'qubit graph', desc: 'which pairs of qubits can interact directly' }
          ] },
          { type: 'flip', front: 'Why SWAPs hurt', back: 'limited connectivity → one logical two-qubit gate may cost ~7 physical gates — depth is precious' },
          { type: 'quiz', question: {
            prompt: 'The main connectivity limit of superconducting chips comes from…',
            options: [
              'the 2D wafer layout — wires cannot cross',
              'microwave pulses being too slow',
              'ions escaping their traps',
              'photon loss'
            ],
            answer: 0,
            explain: 'Planar chips cannot route an interaction between arbitrary qubit pairs, so the compiler must burn precious depth on SWAP networks.'
          } }
        ]
      }
    ]
  },

  /* ----------------------------------------------------------
     8. Adiabatic QC & Quantum Annealing — lectures 15, 16, 19
     ---------------------------------------------------------- */
  {
    id: 'c-annealing',
    title: 'Adiabatic QC & Quantum Annealing',
    subtitle: 'The adiabatic theorem, D-Wave machines & thermal sampling',
    theme: 'annealing',
    icon: 'flame',
    estMin: 22,
    lessons: [
      {
        id: 'l1',
        title: 'Adiabatic Quantum Computing',
        videoId: 'csgEVurrBpU',
        videoTitle: 'QML 15 — Adiabatic Quantum Computing',
        sections: [
          { type: 'text', body: 'Hamiltonians describe **energy**, unitaries describe **evolution** — and the Schrödinger equation ties them together. For a time-independent Hamiltonian, evolution over duration t is exactly the unitary e^(−iHt): every gate has an underlying Hamiltonian, and H being **Hermitian** is precisely why e^(−iHt) is unitary.' },
          { type: 'equation', body: '|ψ(t)⟩ = e^(−iHt)|ψ(0)⟩', desc: 'time-independent Schrödinger evolution — Hamiltonian generates the unitary' },
          { type: 'equation', body: 'H(t) = (1−t)H₀ + tH₁,   runtime ∝ 1/Δ²_min', desc: 'adiabatic path from an easy Hamiltonian to the problem Hamiltonian' },
          { type: 'points', items: [
            'Start in the ground state of an easy H₀ (a transverse field → the equal superposition)',
            'Morph slowly toward the problem H₁ (e.g. an Ising model): the **adiabatic theorem** keeps you in the instantaneous ground state',
            'Read out the final state — the **global** optimum, not a local trap',
            'Catch: the **speed limit** is set by the minimum gap Δ between ground and first excited state — hard instances have tiny gaps, so NP-hard problems still take exponential time',
            'Universal adiabatic QC needs both σ_zσ_z **and** σ_xσ_x couplings'
          ] },
          { type: 'symbols', items: [
            { sym: 'H₀', name: 'driver Hamiltonian', desc: 'easy starting Hamiltonian with a known ground state' },
            { sym: 'H₁', name: 'problem Hamiltonian', desc: 'encodes the optimization to solve' },
            { sym: 'Δ', name: 'energy gap', desc: 'ground-to-first-excited spacing — sets the speed limit' }
          ] },
          { type: 'flip', front: 'Adiabatic theorem', back: 'evolve slowly enough and the system stays in the instantaneous ground state all the way to the solution' },
          { type: 'quiz', question: {
            prompt: 'The adiabatic speed limit depends on…',
            options: [
              'the inverse square of the minimum energy gap',
              'the number of qubits only',
              'the operating temperature',
              'the Hilbert-space dimension'
            ],
            answer: 0,
            explain: 'Runtime scales like 1/Δ²_min. Hard instances have near-degenerate gaps, so the promised speedup evaporates on exactly the cases you care about.'
          } }
        ]
      },
      {
        id: 'l2',
        title: 'Quantum Annealing & Minor Embedding',
        videoId: '7btX7OuR2QM',
        videoTitle: 'QML 16 — Quantum Annealing',
        sections: [
          { type: 'text', body: 'Computing the minimum gap is itself intractable — so **quantum annealing** drops the guarantee: anneal fast, repeat ~1000 times (≈50 ms), collect the configurations and keep the lowest energy. No promise of the true ground state, but often better than classical heuristics — and clever tricks can bound how far you are from optimal.' },
          { type: 'points', items: [
            'Even restricted to classical Ising/QUBO the model is useful — those problems are NP-hard',
            'D-Wave’s 2000-qubit **superconducting annealer** runs at ~10 mK — finite temperature can knock you out of the ground state mid-anneal',
            'The control electronics themselves inject noise; the box sits inside a **Faraday cage**',
            'Stack: problem → QUBO/Ising → **minor embedding** → QPU → repeated anneal-and-read',
            'Hardware graphs are sparse (8-qubit unit cells with limited long-range links), so logical variables are mapped onto **chains** of strongly-coupled physical qubits that act as one'
          ] },
          { type: 'equation', body: 'min E = Σᵢⱼ Jᵢⱼσᵢσⱼ + Σᵢ hᵢσᵢ', desc: 'the Ising/QUBO objective the annealer samples' },
          { type: 'flip', front: 'Minor embedding', back: 'fitting the problem graph into the sparse hardware graph — chained qubits play the role of one logical variable' },
          { type: 'symbols', items: [
            { sym: 'K₃', name: 'triangle graph', desc: 'needs a 2-qubit chain to embed — no triangles in the hardware' },
            { sym: 'chain', name: 'logical qubit', desc: 'several physical qubits bound by a strong ferromagnetic coupling' }
          ] },
          { type: 'quiz', question: {
            prompt: 'Why might one logical variable occupy several physical qubits on an annealer?',
            options: [
              'the hardware graph lacks the needed edge, so chained qubits mimic the connectivity',
              'more qubits give more numerical precision',
              'it lowers the operating temperature',
              'embedding adds extra optimization variables'
            ],
            answer: 0,
            explain: 'Minor embedding compensates for sparse connectivity: strongly-coupled physical qubits behave as a single logical spin with the right neighbor set.'
          } }
        ]
      },
      {
        id: 'l3',
        title: 'Sampling Thermal States',
        videoId: 'VW43u8RM2qI',
        videoTitle: 'QML 19 — Sampling a Thermal State',
        sections: [
          { type: 'text', body: 'Take imperfection one step further: **accept it**. Let the system equilibrate with its environment and it lands in a **thermal state** — samples drawn from it follow a Boltzmann distribution. Whenever machine learning needs Boltzmann samples (a recurring need), equilibration becomes an algorithmic primitive.' },
          { type: 'points', items: [
            'The temperature that matters is an **effective temperature** — set by noise and device physics, not the fridge thermometer; it must be estimated',
            'Tracing out one half of a maximally entangled state gives the **maximally mixed** state = thermal state at infinite temperature',
            '**Quantum approximate thermalization** generalizes this: prepare an easy system plus an equal-size ancilla in a |+⟩-like entangled state, trace out the ancilla → thermal state of a simple Hamiltonian',
            'Then a QAOA-style approximate unitary drives it to the thermal state of a **target** system (e.g. an Ising model) while staying near equilibrium',
            'Works on gate-model devices too — not just annealers'
          ] },
          { type: 'equation', body: 'ρ_th ∝ e^(−H/kT)', desc: 'thermal (Gibbs) state — the output of equilibration' },
          { type: 'flip', front: 'Effective temperature', back: 'the temperature the QPU actually samples at — determined by noise, not just the dilution refrigerator' },
          { type: 'symbols', items: [
            { sym: 'Tr_B', name: 'partial trace', desc: 'averaging over the ancilla — yields a mixed (thermal) state' },
            { sym: 'ancilla', name: 'auxiliary system', desc: 'extra qubits entangled, then traced away, to manufacture mixedness' }
          ] },
          { type: 'quiz', question: {
            prompt: 'Tracing out an ancilla that is entangled with your system can produce…',
            options: [
              'a thermal (Boltzmann) state of the system Hamiltonian',
              'a pure product state',
              'the exact ground state',
              'a basis-encoded bit string'
            ],
            answer: 0,
            explain: 'Just as partial trace of a Bell pair gives the infinite-temperature state, a carefully prepared ancilla yields the thermal state of a chosen Hamiltonian — the heart of quantum approximate thermalization.'
          } }
        ]
      }
    ]
  },

  /* ----------------------------------------------------------
     9. Variational Circuits & QAOA — lectures 18, 20, 21, 22 (+23)
     ---------------------------------------------------------- */
  {
    id: 'c-vqa',
    title: 'Variational Circuits & QAOA',
    subtitle: 'Hybrid quantum–classical algorithms for the NISQ era',
    theme: 'vqa',
    icon: 'refresh',
    estMin: 28,
    lessons: [
      {
        id: 'l1',
        title: 'QAOA: Trotterizing the Adiabatic Path',
        videoId: 'N8e5nAk6KBQ',
        videoTitle: 'QML 18 — Quantum Approximate Optimization Algorithm (QAOA)',
        sections: [
          { type: 'text', body: 'Imperfections cap circuit depth, so a new breed of algorithms was born: **variational circuits**. Run a short burst on the QPU, extract the result to a classical CPU, adjust the circuit’s parameters, repeat — an iterative hybrid loop designed for noisy hardware.' },
          { type: 'points', items: [
            '**QAOA** mimics the adiabatic pathway on a gate-model device',
            'Discretize the continuous transition into **p steps**: alternate the driver Hamiltonian (σ_x, ground state = equal superposition) with the problem Hamiltonian, each for adjustable durations β and γ',
            'This discretization is **Trotterization** — more steps p means a better approximation of the true path',
            'End of the circuit ≈ ground state of the target system — same read-out as an annealer',
            'The parameters β, γ are tuned by **classical gradient descent** to minimize the measured energy'
          ] },
          { type: 'equation', body: 'U(β,γ) ≈ ∏ₖ₌₁ᵖ e^(−iβₖH₀) e^(−iγₖH₁)', desc: 'the QAOA ansatz — a Trotterized adiabatic transition' },
          { type: 'flip', front: 'The variational loop', back: 'QPU prepares the state → CPU evaluates the cost → classical optimizer updates parameters → repeat' },
          { type: 'symbols', items: [
            { sym: 'p', name: 'Trotter depth', desc: 'number of alternating layers — controls accuracy' },
            { sym: 'β, γ', name: 'variational angles', desc: 'durations of driver / problem evolution per step' }
          ] },
          { type: 'quiz', question: {
            prompt: 'QAOA approximates the adiabatic transition by…',
            options: [
              'alternating driver and problem unitaries in p parametrized Trotter steps',
              'running one very long continuous anneal',
              'measuring every qubit in the X basis',
              'solving the QUBO classically first'
            ],
            answer: 0,
            explain: 'The continuous path is chopped into p discrete blocks; each block’s duration is a variational parameter optimized classically.'
          } }
        ]
      },
      {
        id: 'l2',
        title: 'Quantum Simulation — Feynman’s Idea',
        videoId: 'bVymBcvE7BA',
        videoTitle: 'QML 20 — Variational Circuits and Quantum Simulation 1 (Alan Aspuru-Guzik)',
        sections: [
          { type: 'text', body: 'Guest lectures by **Alan Aspuru-Guzik**. It begins with **Feynman (1982)**: quantum devices — simulators — could efficiently simulate natural quantum phenomena. Map the wavefunction |ψ⟩_S of the system you care about onto |ψ⟩_QS of a controllable quantum system; matching evolutions make their observables indistinguishable.' },
          { type: 'points', items: [
            '**Seth Lloyd** made it rigorous: simulating *natural* Hamiltonians is efficient on a quantum computer',
            'A **k-local** Hamiltonian has terms acting on at most k qubits — interactions stay local',
            'A Hamiltonian is just an **energy cost function**: a sum of L terms, and for natural systems L scales polynomially in n',
            'Polynomial term count + locality is exactly what makes simulation efficient — via Trotterization, the same trick as QAOA'
          ] },
          { type: 'equation', body: 'U(t) = e^(−iHt),   H = Σₗ₌₁ᴸ Hₗ', desc: 'simulate by exponentiating a k-local Hamiltonian' },
          { type: 'symbols', items: [
            { sym: 'k-local', name: 'locality bound', desc: 'each term touches ≤ k qubits' },
            { sym: 'L', name: 'term count', desc: 'number of energy contributions — polynomial in n' },
            { sym: '|ψ⟩_QS', name: 'simulator state', desc: 'the controllable quantum system standing in for nature' }
          ] },
          { type: 'flip', front: 'Feynman 1982', back: 'proposed quantum simulators: let one quantum system mimic another — the founding paper of the field' },
          { type: 'quiz', question: {
            prompt: 'A k-local Hamiltonian is one in which…',
            options: [
              'each term acts on at most k qubits',
              'there are exactly k eigenvalues',
              'k qubits are entangled',
              'the energy gap is at most k'
            ],
            answer: 0,
            explain: 'Locality means no term couples more than k qubits — the key property making efficient quantum simulation possible.'
          } }
        ]
      },
      {
        id: 'l3',
        title: 'Simulating Molecules',
        videoId: 'abB2zwLCmW4',
        videoTitle: 'QML 21 — Variational Circuits and Quantum Simulation 2 (Alan Aspuru-Guzik)',
        sections: [
          { type: 'text', body: 'Why simulate? Exactly computing molecules and materials could unlock new **catalysts, drugs and materials**. The mapping: molecular orbitals → qubits. Each orbital may hold a spin-up or spin-down electron — so H₂’s two orbitals (bonding + antibonding) need about 4 qubits.' },
          { type: 'points', items: [
            'The molecular Hamiltonian has **O(n⁴) terms** — every combination of orbitals contributes',
            '**One-electron integrals**: single-electron hopping — kinetic energy vs attraction to a nucleus (2-local in the fermionic sense)',
            '**Two-electron integrals**: electron–electron repulsion — pairs jumping between orbitals (4-local)',
            'Fermionic **creation/annihilation operators** shuffle electrons between orbitals',
            'Fermions are **indistinguishable**, qubits are distinguishable — the **Jordan–Wigner transformation** maps fermionic algebra onto qubit gates',
            'Early cost estimates ~n⁶ → millions of gates (error correction needed); work by Babbush and others pushed scaling toward ~linear'
          ] },
          { type: 'equation', body: 'H = Σpq h_pq a†_p a_q + Σpqrs h_pqrs a†_p a†_q a_r a_s', desc: 'electronic-structure Hamiltonian in fermionic operators' },
          { type: 'symbols', items: [
            { sym: 'a†', name: 'creation operator', desc: 'adds an electron to an orbital' },
            { sym: 'a', name: 'annihilation operator', desc: 'removes an electron from an orbital' },
            { sym: 'JW', name: 'Jordan–Wigner', desc: 'mapping from fermions to qubits' }
          ] },
          { type: 'flip', front: 'Jordan–Wigner transformation', back: 'translates indistinguishable fermions into distinguishable qubits — implemented in quantum gates' },
          { type: 'quiz', question: {
            prompt: 'Why is the Jordan–Wigner transformation needed?',
            options: [
              'electrons are indistinguishable fermions while qubits are distinguishable',
              'molecular orbitals are continuous',
              'the Hamiltonian has too many terms to store',
              'qubits cannot hold two electrons'
            ],
            answer: 0,
            explain: 'The fermionic anti-commutation algebra must be translated into qubit operations — that translation is Jordan–Wigner.'
          } }
        ]
      },
      {
        id: 'l4',
        title: 'Hybrid Algorithms & the Variational Principle',
        videoId: 'qN0UdJda1a4',
        videoTitle: 'QML 22 — Variational Circuits and Quantum Simulation 3 (Alan Aspuru-Guzik)',
        sections: [
          { type: 'text', body: 'Welcome to the **NISQ era** (Preskill: noisy intermediate-scale quantum). The hybrid recipe treats the quantum computer like a lime in a Mexican restaurant — squeeze it for state preparation, offload everything hard to the classical controller, as if the QPU were a GPU. QAOA (Farhi) and the **variational quantum eigensolver** arrived almost simultaneously — the first hybrid quantum–classical algorithms.' },
          { type: 'points', items: [
            'Define a parametrized circuit — a **stencil** of gates whose parameter vector λ has M components',
            'Loop: prepare state → measure the Hamiltonian (energy) → classical optimizer picks λ to **lower the energy** → repeat — much like training a neural network',
            'Same family: quantum classifiers, the variational error corrector, variational autoencoders and generators',
            'Open problem (McClean et al.): as M grows the landscape develops **barren plateaus** — gradients vanish, so good classical initial guesses matter',
            'Lecture 23 (captions unavailable) continues with the **variational principle** — the engine of VQE'
          ] },
          { type: 'equation', body: 'E(λ) = ⟨ψ(λ)|H|ψ(λ)⟩ ≥ E₀', desc: 'variational principle: any trial state’s energy upper-bounds the true ground energy — minimize E(λ) to approach E₀' },
          { type: 'symbols', items: [
            { sym: 'λ', name: 'parameter vector', desc: 'M tunable angles in the circuit stencil' },
            { sym: 'VQE', name: 'variational quantum eigensolver', desc: 'finds ground-state energies via the variational loop' },
            { sym: 'NISQ', name: 'noisy intermediate-scale quantum', desc: 'Preskill’s term for today’s imperfect devices' }
          ] },
          { type: 'flip', front: 'Barren plateau', back: 'as parameter count grows, the cost landscape flattens — gradients vanish and optimization stalls' },
          { type: 'quiz', question: {
            prompt: 'In a hybrid variational algorithm, the classical computer mainly…',
            options: [
              'optimizes the circuit parameters from measured energies',
              'prepares the quantum state',
              'performs the unitary evolution',
              'stores the full wavefunction'
            ],
            answer: 0,
            explain: 'The QPU prepares and measures states; the CPU runs the optimizer that updates λ — offloading hard arithmetic to the side that does it best.'
          } }
        ]
      }
    ]
  },

  /* ----------------------------------------------------------
     10. Encoding Classical Information — lecture 24
     ---------------------------------------------------------- */
  {
    id: 'c-encoding',
    title: 'Encoding Classical Information',
    subtitle: 'Basis, amplitude & Hamiltonian encodings',
    theme: 'encoding',
    icon: 'gem',
    estMin: 14,
    lessons: [
      {
        id: 'l1',
        title: 'Basis & Amplitude Encoding',
        videoId: 'LHzWAyT5rMI',
        videoTitle: 'QML 24 — Encoding Classical Information',
        sections: [
          { type: 'text', body: 'Whatever the paradigm, you must first answer: **how do I load classical information into a quantum system?** The simplest option is **basis encoding** — exactly what a digital computer does. The number 3 becomes binary 11, which becomes the state |11⟩; vectors concatenate into longer bit strings.' },
          { type: 'points', items: [
            'Basis encoding **pro**: trivial preparation — flip a few qubits with X gates from the all-zero initial state',
            'Basis encoding **con**: wasteful — floating-point data eats enormous qubit counts',
            '**Amplitude encoding**: a normalized vector’s entries become the amplitudes — a d-dimensional vector fits in ~log₂d qubits at effectively infinite precision',
            'Amplitude encoding **con**: state preparation can be deep and hard, and reading the values back out requires **tomography**'
          ] },
          { type: 'equation', body: 'x = (x₁,…,x_d), ‖x‖=1  →  |x⟩ = Σᵢ xᵢ|i⟩', desc: 'amplitude encoding — d numbers compressed into ⌈log₂d⌉ qubits' },
          { type: 'symbols', items: [
            { sym: '|i⟩', name: 'basis label', desc: 'computational basis state indexing amplitude i' },
            { sym: 'X', name: 'preparation gate', desc: 'basis encoding needs only bit flips' },
            { sym: 'log₂d', name: 'qubit count', desc: 'exponential compression of amplitude encoding' }
          ] },
          { type: 'flip', front: '3 in basis encoding', back: 'binary 11 → |11⟩ — two qubits, two X gates' },
          { type: 'quiz', question: {
            prompt: 'Amplitude-encoding a d-dimensional vector requires roughly…',
            options: ['log₂(d) qubits', 'd qubits', 'd² qubits', 'one qubit per bit of precision'],
            answer: 0,
            explain: 'The vector entries ride on d basis states of ~log₂d qubits — exponential compression, at the price of hard state preparation and readout.'
          } }
        ]
      },
      {
        id: 'l2',
        title: 'Hamiltonian Encodings',
        videoId: 'LHzWAyT5rMI',
        videoTitle: 'QML 24 — Encoding Classical Information',
        sections: [
          { type: 'text', body: 'The second family encodes the **problem itself** into a Hamiltonian — in two flavors. **Ising encoding**: couplings Jᵢⱼ and biases hᵢ carry your problem — this is what quantum annealers solve. **Hamiltonian simulation**: implement e^(−iHt) on a gate-model device — QAOA approximates the adiabatic path this way, and quantum matrix inversion encodes the matrix to invert inside H.' },
          { type: 'points', items: [
            'Ising encoding **pro**: implemented at thousands of qubits today',
            'Ising encoding **con**: limited scope — optimization and sampling problems only',
            'Simulation **pro**: encoding a matrix in H is natural — the basis of quantum matrix inversion',
            'Simulation **con**: long lists of conditions (sparsity, conditioning, preparation) — mostly limited to idealized, large-scale machines'
          ] },
          { type: 'equation', body: 'H = Σᵢⱼ Jᵢⱼσᵢσⱼ + Σᵢ hᵢσᵢ   →   U = e^(−iHt)', desc: 'problem in the couplings — or simulate H as a unitary' },
          { type: 'symbols', items: [
            { sym: 'Jᵢⱼ', name: 'coupling weights', desc: 'carry the problem structure in Ising encoding' },
            { sym: 'hᵢ', name: 'bias terms', desc: 'per-variable fields — also part of the encoding' },
            { sym: 'e^(−iHt)', name: 'simulated unitary', desc: 'Hamiltonian-simulation encoding' }
          ] },
          { type: 'flip', front: 'Two Hamiltonian encodings', back: 'Ising problem Hamiltonian (annealing/QUBO) vs Hamiltonian simulation e^(−iHt) (gate model, QAOA, matrix inversion)' },
          { type: 'quiz', question: {
            prompt: 'Quantum matrix inversion is an example of which encoding?',
            options: [
              'Hamiltonian simulation — the matrix to invert is encoded in H',
              'basis encoding',
              'amplitude encoding only',
              'minor embedding'
            ],
            answer: 0,
            explain: 'HHL places the matrix A inside a Hamiltonian and simulates e^(iAt) — the encoding lives in the dynamics, not the state.'
          } }
        ]
      }
    ]
  },

  /* ----------------------------------------------------------
     11. QML Methods — lectures 25-34, 40
     ---------------------------------------------------------- */
  {
    id: 'c-mlmethods',
    title: 'QML Methods: Ensembles, Kernels & PGMs',
    subtitle: 'QBoost, clustering, quantum kernels & graphical models',
    theme: 'mlmethods',
    icon: 'stats',
    estMin: 40,
    lessons: [
      {
        id: 'l1',
        title: 'Ensembles & QBoost',
        videoId: 'TjVEfusNfVg',
        videoTitle: 'QML 25 — Ensemble Learning',
        sections: [
          { type: 'text', body: 'Supervised learning fits a conditional distribution P(label | data); deep learning excels at exactly this — but its **continuous optimization** over millions of 32-bit weights is a poor fit for ~2000-qubit machines. We need a discrete formulation. **Ensembles** provide it: combine K trained models into one stronger predictor — the approach that wins Kaggle competitions.' },
          { type: 'points', items: [
            '**AdaBoost**: grows the ensemble sequentially, weighting each new model by its share of the **exponential loss**',
            'No regularization → every candidate ends up in the ensemble, even useless or correlated predictors',
            'Modern descendants: **XGBoost** and gradient-boosted trees — still industry workhorses',
            '**QBoost**: square loss + an **L0 penalty** on the weight vector — λ controls how many models survive',
            'Discretize the weights (a few bits suffice — only relative importance matters) → a quadratic binary problem → **Ising Hamiltonian** → annealer or QAOA'
          ] },
          { type: 'equation', body: 'L = Σᵢ (Σₖ wₖcₖ(xᵢ) − yᵢ)² + λ‖w‖₀', desc: 'QBoost objective — square loss plus sparsity; expanding the square yields model–model couplings and model–label biases' },
          { type: 'symbols', items: [
            { sym: 'wₖ', name: 'ensemble weight', desc: 'importance of model k — discretized to a few bits' },
            { sym: 'cₖ(x)', name: 'weak predictor', desc: 'output of the k-th pretrained model' },
            { sym: 'λ', name: 'regularization strength', desc: 'larger λ → sparser ensemble' }
          ] },
          { type: 'flip', front: '‖w‖₀ (zero norm)', back: 'counts the nonzero weights — penalizing it prunes redundant models from the ensemble' },
          { type: 'quiz', question: {
            prompt: 'QBoost maps naturally to quantum hardware because its objective becomes…',
            options: [
              'a QUBO/Ising problem with pairwise couplings between model weights',
              'a kernel matrix computation',
              'an exponential-loss problem',
              'a Fourier transform'
            ],
            answer: 0,
            explain: 'Expanding the square loss produces quadratic weight–weight terms (couplings) and linear weight–label terms (biases) — exactly an Ising model an annealer or QAOA can minimize.'
          } }
        ]
      },
      {
        id: 'l2',
        title: 'Clustering by Quantum Optimization',
        videoId: '7MDwycGSiy0',
        videoTitle: 'QML 27 — Clustering by Quantum Optimization',
        sections: [
          { type: 'text', body: '**Unsupervised learning** remains hard even for deep learning — a promising beachhead for QML. In clustering, no labels are given: you must discover groups of points that belong together. **k-means** works when clusters are round blobs near a centroid — and fails when the structure is **density and topology**.' },
          { type: 'points', items: [
            'Compute the **Gram/distance matrix** Wᵢⱼ over all pairs — a symmetric matrix defining a weighted graph',
            'Clustering = **MaxCut**: partition the graph so the total edge weight crossing the cut is **maximal** — a global criterion, not a local heuristic',
            'Assign a spin σᵢ = ±1 to each point labeling which side of the cut it lands on',
            'The cut cost rewrites as an **Ising energy** — feed it to an annealer or QAOA',
            'This finds two maximally separated clusters respecting the global topology — where k-means would fail'
          ] },
          { type: 'equation', body: 'cut = ¼ Σᵢⱼ Wᵢⱼ (1 − σᵢσⱼ)', desc: 'MaxCut objective — points on opposite sides contribute their distance' },
          { type: 'symbols', items: [
            { sym: 'Wᵢⱼ', name: 'edge weight', desc: 'distance/similarity between data points i and j' },
            { sym: 'σᵢ', name: 'cluster label', desc: '−1 for partition V₁, +1 for V₂' },
            { sym: 'V₁, V₂', name: 'partitions', desc: 'the two clusters separated by the cut' }
          ] },
          { type: 'flip', front: 'Why MaxCut ≈ clustering', back: 'maximizing the weight crossing the cut splits the graph into the two most distant groups' },
          { type: 'quiz', question: {
            prompt: 'Where does k-means clustering break down?',
            options: [
              'when cluster structure depends on density/topology rather than distance to a centroid',
              'when labels are binary',
              'only inside quantum systems',
              'when the Gram matrix is symmetric'
            ],
            answer: 0,
            explain: 'k-means only sees proximity to a central point; elongated or interleaved clusters need the global connectivity that MaxCut captures.'
          } }
        ]
      },
      {
        id: 'l3',
        title: 'Kernels & the Interference Circuit',
        videoId: 'HILVRvDaQsE',
        videoTitle: 'QML 28 — Kernel Methods',
        sections: [
          { type: 'text', body: '**Kernel methods** (huge from the mid-90s until deep learning took over) perform a nonlinear embedding **implicitly**. Data that is not linearly separable — one class nested inside another — can be pulled apart in a higher-dimensional feature space where a simple **hyperplane** suffices.' },
          { type: 'points', items: [
            'The **kernel trick**: replace the inner product with a kernel function K(x,x′) — you never need the embedding itself, only pairwise kernel values',
            'Requirement: the kernel/Gram matrix must be **positive semi-definite**',
            'Examples: **kernelized k-means** with an exponential-decay (Gaussian) distance, and **support vector machines** — sparse, well-generalizing models',
            'They faded because they are **shallow** — no learned feature hierarchies — but quantum computers evaluate some kernels naturally',
            '**Interference circuit**: amplitude-encode test and training data into registers (data qubit, ancilla, index, class qubit); the ancilla’s two branches hold test vs train states; a Hadamard on the ancilla **interferes** them; postselecting on the ancilla outcome yields kernel-valued probabilities'
          ] },
          { type: 'equation', body: 'K(x,x′) = ⟨φ(x), φ(x′)⟩', desc: 'a kernel is an inner product in feature space' },
          { type: 'symbols', items: [
            { sym: 'φ', name: 'feature map', desc: 'the (never computed) nonlinear embedding' },
            { sym: 'K', name: 'kernel / Gram matrix', desc: 'pairwise similarities of all data points' },
            { sym: 'e^(−γ‖x−x′‖²)', name: 'Gaussian kernel', desc: 'exponential decay over Euclidean distance' }
          ] },
          { type: 'flip', front: 'Kernel trick', back: 'get the effect of a high-dimensional embedding by evaluating only K(x,x′) — φ itself never materializes' },
          { type: 'quiz', question: {
            prompt: 'In the interference-circuit kernel, the Hadamard gate on the ancilla…',
            options: [
              'interferes the test-instance branch with the training-data branch',
              'flips the class qubit',
              'performs a Fourier transform',
              'traces out the index register'
            ],
            answer: 0,
            explain: 'The ancilla entangles the test state with one branch and the data superposition with the other; H merges the branches so their amplitudes interfere — the kernel survives in the measurement statistics.'
          } }
        ]
      },
      {
        id: 'l4',
        title: 'Quantum-Enhanced Kernels (Schuld)',
        videoId: 'uDAAi5aQbMU',
        videoTitle: 'QML 32 — Quantum-Enhanced Kernel Methods 1 (Maria Schuld)',
        sections: [
          { type: 'text', body: 'Guest lectures by **Maria Schuld**. Kernels are similarity measures; formally, K is a kernel iff every Gram matrix built from it is **positive semi-definite**. The bridge to quantum theory: inner products of feature vectors are always valid kernels — and quantum states live in an inner-product space.' },
          { type: 'points', items: [
            'A data-encoding circuit S(x) prepares |φ(x)⟩ — a **quantum feature map**; the overlap ⟨φ(x′)|φ(x)⟩ is a **quantum kernel**',
            'Overlap circuit: ancilla + Hadamard, condition S(x) and S(x′) on the ancilla branches, second H, measure — P(0) = ½ + ½ Re⟨φ(x′)|φ(x)⟩',
            'Encodings → kernels: basis encoding gives a **Dirac** exact-match kernel; amplitude encoding gives the **linear** kernel; repeating it d times gives a **polynomial** kernel (xᵀx′)ᵈ; photonic **squeezing** gives tunable kernels',
            'Use the quantum device as a **kernel co-processor** feeding a classical SVM — a true hybrid',
            'Variational twists: train a parametrized circuit after the feature map (measure ⟨σ_z⟩ as the prediction), or **learn the kernel itself**',
            'Entangle the dataset with an index register and the resulting density matrix **is** the kernel Gram matrix — enabling quantum linear algebra like inversion for least-squares SVMs'
          ] },
          { type: 'equation', body: 'κ(x,x′) = ⟨φ(x)|φ(x′)⟩ = ⟨0|S†(x′)S(x)|0⟩', desc: 'the quantum kernel as an overlap of encoded states' },
          { type: 'equation', body: 'P(ancilla = 0) = ½ + ½ Re⟨φ(x′)|φ(x)⟩', desc: 'the interference circuit reads out the overlap' },
          { type: 'symbols', items: [
            { sym: 'S(x)', name: 'encoding circuit', desc: 'maps input x to quantum feature state |φ(x)⟩' },
            { sym: 'Kᵢⱼ', name: 'Gram matrix', desc: 'κ(xᵢ,xⱼ) for all training pairs' },
            { sym: '⟨σ_z⟩', name: 'readout', desc: 'expectation value used as a classifier prediction' }
          ] },
          { type: 'flip', front: 'Quantum feature map', back: 'any data-encoding circuit defines a feature vector |φ(x)⟩ — and therefore a kernel' },
          { type: 'quiz', question: {
            prompt: 'Basis-encoding two identical bit strings and computing their overlap gives kernel value…',
            options: [
              '1 — identical states; different strings give 0 (a Dirac-like kernel)',
              '½',
              'it depends on the ancilla outcome',
              'undefined — basis encoding has no kernel'
            ],
            answer: 0,
            explain: 'Basis states are orthonormal: ⟨x|x′⟩ is 1 only when the strings match exactly — a harsh but valid kernel.'
          } }
        ]
      },
      {
        id: 'l5',
        title: 'Graphical Models & Gaussian Processes',
        videoId: 'DdWH2j6P8f0',
        videoTitle: 'QML 30 — Probabilistic Graphical Models',
        sections: [
          { type: 'text', body: 'Some tasks stay hard for deep learning — precisely the QML pitch. **Probabilistic graphical models** capture the dependency structure between random variables: directed graphs give **Bayesian networks** (grass wet → was it rain or the sprinkler?), undirected ones give **Markov networks**.' },
          { type: 'points', items: [
            '**Conditional independence**: X ⊥ Y | Z iff P(x,y|z) = P(x|z)P(y|z) — the graph encodes these independencies',
            'Markov networks assign **energy functions to cliques** (K₁ nodes, K₂ edges, K₃ triangles); the joint distribution factorizes over cliques — Boltzmann-shaped, like a thermal state',
            'The **Ising model** is the special case of binary variables and K₂ cliques; a **Boltzmann machine** splits spins into visible and hidden, marginalizing the hidden ones',
            'Queries are hard: **most probable explanation** and **marginal MAP** are NP-hard even after training',
            'Remedy: approximate inference by sampling — classical MCMC (burn-in, correlated draws) vs **annealers or quantum approximate thermalization** sampling the Boltzmann distribution',
            '**Gaussian processes**: Bayesian regression — a distribution over functions with a kernel covariance; predictions need **matrix inversion** (K+σ²I)⁻¹ twice — plug in quantum matrix inversion; choose a decaying covariance for sparsity and tune noise for conditioning'
          ] },
          { type: 'equation', body: 'P(x) ∝ ∏_C e^(−E_C(x_C))', desc: 'a Markov network factorizes over cliques — the same shape as a thermal state' },
          { type: 'symbols', items: [
            { sym: 'MPE', name: 'most probable explanation', desc: 'argmax of the unobserved variables given evidence' },
            { sym: 'K_c', name: 'clique', desc: 'complete subgraph carrying an energy function' },
            { sym: 'σ²', name: 'noise variance', desc: 'diagonal offset that improves matrix conditioning' }
          ] },
          { type: 'flip', front: 'Visible vs hidden units', back: 'Boltzmann machine: hidden spins mediate correlations; marginalize them to get the visible distribution' },
          { type: 'quiz', question: {
            prompt: 'Inference queries on a trained Markov network are…',
            options: [
              'still NP-hard — a place where quantum sampling can help',
              'always linear time once trained',
              'impossible in principle',
              'only difficult during training'
            ],
            answer: 0,
            explain: 'Unlike a neural network, running a trained PGM is itself hard — approximate Boltzmann sampling from annealers or thermalization protocols offers real speedup.'
          } }
        ]
      }
    ]
  },

  /* ----------------------------------------------------------
     12. Quantum Algorithms for Learning — lectures 35-39, 41
     ---------------------------------------------------------- */
  {
    id: 'c-algorithms',
    title: 'Quantum Algorithms for Learning',
    subtitle: 'QFT, phase estimation, HHL & the QML vision',
    theme: 'algorithms',
    icon: 'bolt',
    estMin: 30,
    lessons: [
      {
        id: 'l1',
        title: 'Quantum Fourier Transform',
        videoId: 'rtDC-j4Uw0A',
        videoTitle: 'QML 35 — Quantum Fourier Transform',
        sections: [
          { type: 'text', body: 'This module assumes **coherent protocols**: near-perfect, large-scale quantum computers where polynomial or exponential speedups live. A crucial twist — inputs and outputs are **quantum states**: if state preparation or tomography costs more than the algorithm saves, the advantage evaporates.' },
          { type: 'points', items: [
            'Classically, the Fourier transform maps a time-domain vector into the **frequency domain**',
            'The **QFT** applies the same transform to the **amplitudes** of a quantum state — amplitudes of |x⟩ become Fourier coefficients',
            'Assume N = 2ⁿ; rewriting the phase factors via **binary expansion** factorizes the transform into a product over qubits',
            'The result: a clean circuit of **conditional rotations** — simple structure, but resource-heavy: many qubits and gates, beyond shallow NISQ devices',
            'It converts between amplitude and basis encodings — a workhorse primitive for bigger algorithms'
          ] },
          { type: 'equation', body: 'QFT|x⟩ = (1/√N) Σₖ e^(2πixk/N)|k⟩', desc: 'the discrete Fourier transform applied to amplitudes' },
          { type: 'symbols', items: [
            { sym: 'N = 2ⁿ', name: 'dimension', desc: 'amplitude vector lives on n qubits' },
            { sym: 'e^(2πixk/N)', name: 'phase factor', desc: 'the complex root-of-unity weighting each basis state' },
            { sym: 'QFT†', name: 'inverse QFT', desc: 'reads phase patterns back into registers' }
          ] },
          { type: 'flip', front: 'Coherent protocol', back: 'algorithm assuming near-perfect qubits; both input and output are quantum states' },
          { type: 'quiz', question: {
            prompt: 'The QFT transforms…',
            options: [
              'the amplitudes of a quantum state — a Fourier transform on the amplitude vector',
              'qubits into classical bits',
              'probabilities into amplitudes',
              'a density matrix into a ket'
            ],
            answer: 0,
            explain: 'QFT performs the classical discrete Fourier transform, but on the amplitude register — this is why it can be exponentially faster in principle.'
          } }
        ]
      },
      {
        id: 'l2',
        title: 'Phase Estimation & the HHL Overview',
        videoId: 'tFQS9QvK-tE',
        videoTitle: 'QML 36 — Quantum Phase Estimation',
        sections: [
          { type: 'text', body: 'Given a unitary U and its eigenvector |u⟩, we have U|u⟩ = e^(2πiθ)|u⟩ — eigenvalues of unitaries lie on the complex unit circle. **Quantum phase estimation** reads out the phase θ to n bits of precision.' },
          { type: 'points', items: [
            'Two registers: an n-qubit **precision register** (will hold θ) and a register holding the eigenvector',
            'Apply controlled-U^(2⁰), U^(2¹), …, U^(2ⁿ⁻¹) in superposition — each control bit triggers a differently-powered U',
            '**Phase kickback**: the eigenvalue phase lands in the control register as a Fourier-pattern phase',
            'The pattern is exactly a QFT of θ — apply the **inverse QFT** to write θ into the register',
            '**HHL** (matrix inversion) builds directly on this: encode b as amplitudes, A as a Hamiltonian, phase-estimate eigenvalues, rotate inverses into an ancilla, uncompute, rejection-sample',
            'Resource estimate mirrors Shor’s algorithm: ~4000 logical qubits → millions of physical — far beyond today’s <100-qubit devices'
          ] },
          { type: 'equation', body: 'U|u⟩ = e^(2πiθ)|u⟩', desc: 'phase estimation recovers θ — the eigenvalue angle' },
          { type: 'symbols', items: [
            { sym: 'θ', name: 'phase', desc: 'the eigenvalue angle being estimated' },
            { sym: 'c-U^(2ᵏ)', name: 'controlled powers', desc: 'each precision qubit gates a different power of U' },
            { sym: 'QFT†', name: 'inverse QFT', desc: 'translates the kicked-back phase into readable bits' }
          ] },
          { type: 'flip', front: 'Phase kickback', back: 'the eigenvalue phase is deposited into the control register, where the inverse QFT can read it' },
          { type: 'quiz', question: {
            prompt: 'In HHL, why must the phase-estimation registers be uncomputed?',
            options: [
              'they are entangled with the ancilla — discarding them would leave a mixed state',
              'uncomputation doubles the speed',
              'to free up qubits for the next iteration',
              'it corrects rounding errors'
            ],
            answer: 0,
            explain: 'Tracing out entangled registers collapses the ancilla’s coherent amplitude — the 1/λ information would be destroyed. Uncomputing disentangles them cleanly.'
          } }
        ]
      },
      {
        id: 'l3',
        title: 'Matrix Inversion & Quantum Linear Algebra',
        videoId: '24gxm-DhH2E',
        videoTitle: 'QML 38 — Quantum Matrix Inversion',
        sections: [
          { type: 'text', body: '**HHL** solves Ax = b as |x⟩ = A⁻¹|b⟩. Conditions: A must be **sparse** (few nonzero entries) and **well-conditioned** (eigenvalue ratio bounded). Non-Hermitian A can be embedded in a Hermitian block matrix of twice the size so Hamiltonian simulation applies.' },
          { type: 'points', items: [
            'After phase estimation, a **controlled rotation** on one ancilla writes C/λᵢ into its |1⟩ amplitude — the eigenvalue inverse is now in the state',
            '**Uncompute** everything except the ancilla, then **rejection sampling**: measure ancilla = 1 and the remaining state is ∝ A⁻¹|b⟩',
            'You get the solution only up to observables — estimate ⟨x|M|x⟩ rather than reading out x',
            '**Quantum PCA**: a density matrix is Hermitian → exponentiate it like a Hamiltonian → phase estimation reveals its eigenstructure',
            'Learning applications: **least-squares quantum SVM**, kernel-matrix preparation, Gaussian processes, topological data analysis',
            'Recipe: find a matrix inversion inside a classical algorithm — or reshape the algorithm so one appears',
            'Caveats: needs efficient |b⟩ preparation and **QRAM** — data loaded in superposition fast — or the exponential edge disappears'
          ] },
          { type: 'equation', body: '|x⟩ ∝ Σᵢ (βᵢ/λᵢ)|uᵢ⟩ = A⁻¹|b⟩', desc: 'the post-selected state is the solution direction of the linear system' },
          { type: 'symbols', items: [
            { sym: 'λᵢ', name: 'eigenvalues of A', desc: 'estimated by phase estimation, then inverted' },
            { sym: 'κ', name: 'condition number', desc: 'max/min eigenvalue ratio — must be well-behaved' },
            { sym: 'C', name: 'rotation constant', desc: 'keeps the C/λ ancilla amplitude ≤ 1' }
          ] },
          { type: 'flip', front: 'QRAM', back: 'a device loading classical data into superposition quickly — required for real speedups and not yet built' },
          { type: 'quiz', question: {
            prompt: 'Quantum PCA works because…',
            options: [
              'a density matrix is Hermitian, so it can be exponentiated like a Hamiltonian to reveal eigenstructure',
              'PCA is already a quantum algorithm',
              'density-matrix eigenvalues are always ±1',
              'it requires no state preparation'
            ],
            answer: 0,
            explain: 'ρ is Hermitian, so e^(iρt) is unitary: self-exponentiating the state lets phase estimation extract its eigenvalues — quantum principal component analysis.'
          } }
        ]
      },
      {
        id: 'l4',
        title: 'Seth Lloyd: The QML Vision',
        videoId: 'OstyW7c0v48',
        videoTitle: 'QML 41 — Guest lecture by Seth Lloyd',
        sections: [
          { type: 'text', body: '**Seth Lloyd** (MIT) gives two reasons quantum mechanics helps learning. First: quantum systems generate patterns no classical system can — so they may **recognize** weird patterns too. Second: classical ML is mostly **linear algebra**, and quantum mechanics is entirely linear algebra.' },
          { type: 'points', items: [
            'n qubits hold an N = 2ⁿ-dim vector: **log N qubits** replace N classical numbers — exponential compression',
            '**QBLAS** vs BLAS: QFT in O((log N)²) vs FFT O(N log N); eigenvalues of sparse matrices in ~(log N)² vs N²; matrix inversion in ~(log N)²',
            'A **terabyte** (10¹² numbers) amplitude-encodes onto ~40 qubits; its Fourier transform needs ~1600 quantum ops vs ~10¹⁴ classical',
            '**QRAM** is the enabling device — map classical data (discs, fiber pulses, capacitors) into quantum states; easier to build than a full fault-tolerant computer',
            'Applications: quantum cluster assignment, SVM hyperplanes, PCA (Netflix-style recommendations), **topological data analysis** (counting holes in data), deep quantum learning',
            'Lloyd’s prediction: QRAMs loading millions–billions of bits onto 20–30 qubits within ~5 years'
          ] },
          { type: 'equation', body: 'N classical numbers → log₂N qubits', desc: 'exponential compression — the core mechanism behind QML speedups' },
          { type: 'symbols', items: [
            { sym: 'QBLAS', name: 'quantum BLAS', desc: 'quantum versions of basic linear algebra subroutines' },
            { sym: 'PCA', name: 'principal component analysis', desc: 'find dominant axes of data — exponentially faster quantumly' },
            { sym: 'QRAM', name: 'quantum random-access memory', desc: 'classical-to-quantum data loader' }
          ] },
          { type: 'flip', front: 'Quantum weirdness for learning', back: 'systems that generate strange patterns may also recognize patterns no classical learner can' },
          { type: 'quiz', question: {
            prompt: 'A terabyte of data (≈10¹² numbers) amplitude-encoded requires about…',
            options: ['40 qubits', '10¹² qubits', 'a million qubits', '4000 logical qubits'],
            answer: 0,
            explain: 'log₂(10¹²) ≈ 40 — the vector lives in a 2⁴⁰-dimensional Hilbert space; that compression is the whole game.'
          } }
        ]
      }
    ]
  }
];
