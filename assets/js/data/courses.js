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
    estMin: 35,
    lessons: [
      {
        id: 'l1', part: 'The QML pitch',
        title: 'Why Quantum Machine Learning?',
        videoId: 'QtWCmO_KIlg',
        videoTitle: 'QML 01 — Introduction',
        sections: [
          { type: 'text', body: 'Quantum computers have made rapid progress and are becoming useful for a handful of tasks — and one of those tasks is attacking problems in **machine learning**. But the fit is subtle. Deep neural networks already solve classification extremely well on classical hardware by exploiting parallelism, so there is **no point** in porting easy problems to a quantum computer.' },
          { type: 'predict', prompt: 'Before the formal rule — your instinct: which task could a quantum computer plausibly beat a classical one at?',
            options: [
              'Sorting a phonebook alphabetically',
              'Sampling from a probabilistic model whose state space is astronomically large',
              'Multiplying two ordinary 100×100 matrices',
              'Running the same Python code, just faster'
            ],
            reveal: '**Sampling from huge structured state spaces** is the prime candidate — probabilistic models over graphs resist classical calculation. Sorting and plain matrix multiply are easy, parallel-friendly tasks: a QPU adds nothing there.' },
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
          { type: 'reflect', prompt: 'Close the tab for a second and say it out loud: why does QML aim at "hard" models instead of every ML problem?',
            model: 'If a classical GPU already parallelizes a task perfectly (image classification, sorting), a quantum processor cannot add advantage — overhead just loses time. Advantage only exists where classical computation hits a wall: exponentially large structured state spaces, like probabilistic models on graphs.' },
          { type: 'text', body: 'Keep this framing in mind through the whole course: we are hunting for **genuine computational advantage**, not just running familiar algorithms on exotic hardware.' }
        ]
      },
      {
        id: 'l2', part: 'Probability basics',
        title: 'Classical Probability Theory',
        videoId: 'm77_muSPrs0',
        videoTitle: 'QML 02 — Classical Probability Theory',
        sections: [
          { type: 'text', body: 'Quantum states are best introduced as a **generalization of classical probability distributions**, and quantum computation as a way of transforming them. Start with a coin flip: outcomes heads and tails carry probabilities $p_{0} \text{ and } p_{1}$ — non-negative real numbers that sum to one. Every possible distribution sits on a single line segment, from fully biased coins to the unbiased point $(\tfrac{1}{2}, \tfrac{1}{2})$.' },
          { type: 'equation', body: '$p_{0} + p_{1} = 1,\\quad p_{i} \\geq  0$', desc: 'normalization of a probability distribution' },
          { type: 'predict', prompt: 'Coin A is biased $p = (0.3, 0.7)$. Coin B is fair $p = (0.5, 0.5)$. Which distribution has **higher entropy** — more unpredictable?',
            options: ['The biased coin', 'The fair coin', 'Equal — both are coins'],
            reveal: 'The **fair coin** — entropy peaks at the uniform distribution. A biased coin is partially predictable: you would bet on the heavy side.' },
          { type: 'points', items: [
            '**Entropy** characterizes a distribution’s unpredictability — it peaks at the uniform distribution, where you have zero predictive power',
            'A **stochastic vector** stacks the probabilities into a column vector — all non-negative entries',
            'Because entries are non-negative, summing them equals summing their absolute values: the vector is normalized in the **1-norm**',
            'Transformations that map distributions to distributions are **stochastic matrices** — a left stochastic matrix has columns that each sum to 1'
          ] },
          { type: 'steps', title: 'Worked example — applying a stochastic matrix',
            hint: 'Read each step, then predict the next number in your head before clicking.',
            steps: [
              'Start with a distribution $p = (0.8,\ 0.2)$ — an 80%-biased coin.',
              'Apply $A = \\begin{pmatrix}0.9 & 0.3\\\\ 0.1 & 0.7\\end{pmatrix}$ — check: each column sums to 1, so it is stochastic.',
              'First output: $q_0 = 0.9 \\times 0.8 + 0.3 \\times 0.2 = 0.72 + 0.06 = 0.78$',
              'Second output: $q_1 = 0.1 \\times 0.8 + 0.7 \\times 0.2 = 0.08 + 0.14 = 0.22$',
              'Sanity check: $q_0 + q_1 = 0.78 + 0.22 = 1$ — still a valid distribution. The matrix moved probability mass but preserved the total.'
            ] },
          { type: 'symbols', items: [
            { sym: '$\\vec{p}$', name: 'stochastic vector', desc: 'column vector of non-negative probabilities summing to 1' },
            { sym: '$\\|p\\|_{1}$', name: '1-norm', desc: '$\\sum _{i} p_{i} = 1$ — the classical normalization' },
            { sym: '$H(p)$', name: 'entropy', desc: 'unpredictability; maximal for the uniform distribution' },
            { sym: 'A', name: 'stochastic matrix', desc: 'columns sum to 1; maps distributions to distributions' }
          ] },
          { type: 'equation', body: '$\\|p\\|_{1} = \\sum _{i} p_{i} = 1$', desc: 'stochastic vectors are normalized in the 1-norm — quantum states will use the 2-norm instead' },
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
          } },
          { type: 'reflect', prompt: 'Explain it back: why must each *column* of a stochastic matrix sum to 1 — what would go wrong if a column summed to 0.5?',
            model: 'Column j tells us where all the probability mass of input j goes. If it summed to 0.5, applying the matrix to the basis state $|j\\rangle$ would destroy half the total probability — the output would no longer be a distribution. Column-sums of 1 are exactly "probability is conserved".' }
        ]
      },
      {
        id: 'l3', part: 'Stochastic dynamics',
        title: 'Stochastic Matrices in Action',
        videoId: 'm77_muSPrs0',
        videoTitle: 'QML 02 — Classical Probability Theory',
        sections: [
          { type: 'text', body: 'A stochastic matrix is more than bookkeeping — it is a **dynamics**. Apply it once and a distribution shifts; apply it repeatedly and the distribution often relaxes toward a state that no longer changes. Understanding this classical picture is the fastest route to understanding quantum evolution, where unitary matrices play the same role in the 2-norm world.' },
          { type: 'symbols', items: [
            { sym: '$p_{t+1} = A\\,p_t$', name: 'one step', desc: 'a stochastic matrix moves a distribution forward in time' },
            { sym: 'Markov chain', name: 'repeated application', desc: '$A^2 p, A^3 p, \\dots$ — a sequence of distributions' },
            { sym: '$A\\pi = \\pi$', name: 'fixed point', desc: 'a stationary distribution — the chain has settled' }
          ] },
          { type: 'steps', title: 'Watch a distribution relax to its fixed point',
            hint: 'Same matrix as before: $A = \\begin{pmatrix}0.9 & 0.3\\\\ 0.1 & 0.7\\end{pmatrix}$. Predict each iteration before revealing it.',
            steps: [
              'Start from certainty: $p_0 = (1,\ 0)$.',
              'One step: $p_1 = A\\,p_0 = (0.9,\ 0.1)$ — the first column itself.',
              'Two steps: $p_2 = A\\,p_1 = (0.84,\ 0.16)$ — drifting toward balance.',
              'Three steps: $p_3 \\approx (0.804,\ 0.196)$.',
              'It settles at $\\pi = (0.75,\ 0.25)$, where $A\\pi = \\pi$ exactly. From here, every further step does nothing.'
            ] },
          { type: 'predict', prompt: 'You keep multiplying by A forever. What happens to the distribution?',
            options: [
              'It cycles between two states forever',
              'It converges to a fixed point that stops changing',
              'It becomes uniform (0.5, 0.5) regardless of A',
              'It stops being a valid distribution'
            ],
            reveal: 'For this well-behaved matrix it **converges to a fixed point** $\\pi$ with $A\\pi = \\pi$ — here $(0.75, 0.25)$, not $(0.5, 0.5)$. The fixed point remembers the structure of A even though it forgets the start.' },
          { type: 'flip', front: 'Markov chain', back: 'repeatedly applying a stochastic matrix to a distribution — the mathematical backbone of sampling algorithms' },
          { type: 'quiz', question: {
            prompt: 'A distribution $\\pi$ satisfies $A\\pi = \\pi$ for a stochastic matrix A. What is $\\pi$ called?',
            options: [
              'The eigenvector of zero',
              'A fixed point (stationary distribution) of A',
              'The entropy of A',
              'An invalid distribution'
            ],
            answer: 1,
            explain: '$\\pi$ is the stationary distribution: applying A leaves it unchanged, so the chain has equilibrated.'
          } },
          { type: 'reflect', prompt: 'One-sentence bridge: if stochastic matrices preserve the 1-norm, guess what kind of matrix preserves "quantum distributions" — and which norm do you think they protect?',
            model: 'Unitary matrices — they preserve the **2-norm** $\\sum_i |\\psi_i|^2 = 1$. Where classical dynamics conserves the sum of probabilities, quantum dynamics conserves the sum of squared amplitudes.' }
        ]
      },
      {
        id: 'l4', part: 'Quantum bridge',
        title: 'From Probabilities to Amplitudes',
        videoId: 'Y5WRv_9757A',
        videoTitle: 'QML 03 — Quantum States (preview)',
        sections: [
          { type: 'text', body: 'Here is the single most important idea of this course: a **quantum state is like a probability distribution whose entries live in the 2-norm**. Classical probabilities are non-negative and sum to 1. Quantum **amplitudes** can be negative — even complex — and it is their *squared magnitudes* that must sum to 1. That one change, 1-norm → 2-norm, is where all the quantum weirdness comes from.' },
          { type: 'equation', body: '$|\\psi\\rangle  = \\alpha|0\\rangle  + \\beta|1\\rangle ,\\quad |\\alpha|^{2} + |\\beta|^{2} = 1$', desc: 'a qubit: two amplitudes, normalized in the 2-norm' },
          { type: 'points', items: [
            '**Amplitude** $\\alpha$ is like a probability that forgot to be non-negative — it can be negative or complex',
            'You get an actual probability by **squaring the magnitude**: $P(0) = |\\alpha|^{2}$, $P(1) = |\\beta|^{2}$',
            'Because amplitudes square, two paths to the same outcome can **interfere** — $+0.7$ and $-0.7$ cancel; probabilities could never do that',
            'The $\\tfrac{1}{2}$ inside $\\cos(\\theta/2)$ has a geometric reason — you will see it on the Bloch sphere in the next course'
          ] },
          { type: 'explore', widget: 'amplitudes', title: 'Your first qubit — drag θ, then Measure',
            note: 'The slider sets $|\\psi\\rangle = \\cos(\\theta/2)|0\\rangle + \\sin(\\theta/2)|1\\rangle$. Watch the *probabilities* — the squares — respond to the *amplitudes*. Then hit Measure: the qubit picks an outcome at those odds and **collapses**.' },
          { type: 'predict', prompt: 'Set the slider to θ = 90°. Before you look at the bars — what are $P(0)$ and $P(1)$?',
            options: ['100% / 0%', '50% / 50%', '90% / 10%', 'It depends on the measurement'],
            reveal: '$\\cos^2(45°) = \\sin^2(45°) = \\tfrac{1}{2}$ — a 50/50 coin. $\theta/2 = 45°$ splits the amplitude evenly, and squaring gives equal odds. Try measuring at θ = 90° a few times and watch the tally.' },
          { type: 'steps', title: 'Compute a measurement probability by hand',
            steps: [
              'Suppose $|\\psi\\rangle = \\tfrac{3}{5}|0\\rangle + \\tfrac{4}{5}|1\\rangle$.',
              'Amplitudes square to probabilities: $P(0) = (\\tfrac{3}{5})^2 = \\tfrac{9}{25} = 0.36$.',
              'Similarly $P(1) = (\\tfrac{4}{5})^2 = \\tfrac{16}{25} = 0.64$.',
              'Check: $0.36 + 0.64 = 1$ — the 2-norm normalization is doing its job.',
              'So a 3-4-5 triangle is secretly a qubit state: amplitudes are its legs, probabilities are their squares.'
            ] },
          { type: 'symbols', items: [
            { sym: '$|\\psi\\rangle$', name: 'ket psi', desc: 'the quantum state — a column vector of amplitudes' },
            { sym: '$\\alpha,\\ \\beta$', name: 'amplitudes', desc: 'can be negative or complex; $|\\cdot|^2$ gives probabilities' },
            { sym: '$|\\alpha|^2 + |\\beta|^2 = 1$', name: '2-norm rule', desc: 'the quantum normalization — replaces $\\sum p_i = 1$' }
          ] },
          { type: 'quiz', question: {
            prompt: 'For $|\\psi\\rangle = 0.6|0\\rangle  + 0.8|1\\rangle $, what is $P(1)$?',
            options: ['0.8', '0.64', '0.4', '1.6'],
            answer: 1,
            explain: 'Probabilities are squared amplitudes: $P(1) = 0.8^2 = 0.64$. Note $0.6^2 + 0.8^2 = 0.36 + 0.64 = 1$ — the 3-4-5 triangle again.'
          } },
          { type: 'reflect', prompt: 'In one sentence, for future-you: what is the difference between a probability and an amplitude?',
            model: 'A probability *is* the chance — non-negative, sums to 1. An amplitude is a number (possibly negative or complex) whose **squared magnitude** is the chance — which is why amplitudes can interfere and probabilities cannot.' }
        ]
      },
          {
        id: 'l5', part: 'Quantum bridge',
        title: 'Vectors, Matrices & Inner Products',
        videoId: 'm77_muSPrs0',
        videoTitle: 'QML 02 — Classical Probability Theory',
        sections: [
          { type: 'text', body: 'Everything in quantum mechanics is **linear algebra**. If vectors and matrices feel rusty, this lesson is the refresher that makes the whole course tractable. A vector is a list of numbers; a matrix is a machine that eats a vector and returns another vector. That is genuinely all we need.' },
          { type: 'symbols', items: [
            { sym: '$\\vec{v}$', name: 'vector', desc: 'a column of numbers — a point, or a state' },
            { sym: '$A\\vec{v}$', name: 'matrix times vector', desc: 'row-by-column dot products — the transformed vector' },
            { sym: '$\\vec{u}\\cdot\\vec{v}$', name: 'dot product', desc: '$\\sum_i u_i v_i$ — how much two vectors point together' },
            { sym: '$\\|\\vec{v}\\|$', name: 'norm', desc: 'the length — different norms measure length differently' }
          ] },
          { type: 'steps', title: 'Dot product, done by hand',
            steps: [
              'Take $\\vec{u} = (3, 4)$ and $\\vec{v} = (1, -2)$.',
              'Multiply corresponding entries: $3 \\times 1 = 3$ and $4 \\times (-2) = -8$.',
              'Add them: $\\vec{u} \\cdot \\vec{v} = 3 - 8 = -5$.',
              'A negative dot product means the vectors point more apart than together — angle > 90°.',
              'Dot product of a vector with itself gives its squared length: $\\vec{u} \\cdot \\vec{u} = 9 + 16 = 25 = 5^2$.'
            ] },
          { type: 'predict', prompt: 'For vectors $\\vec{a} = (0.6, 0.8)$ — what is $\\vec{a} \\cdot \\vec{a}$, i.e. its squared length?',
            options: ['0.2', '1', '1.4', '0.64 + 0.36 = 1.00… wait, that is 1'],
            reveal: '$0.36 + 0.64 = 1$ — a **unit vector**. Notice: (0.6, 0.8) has length 1 in the **2-norm** — exactly the normalization a qubit state needs. The 3-4-5 triangle has followed us into linear algebra.' },
          { type: 'steps', title: 'Matrix × vector — the machine at work',
            steps: [
              'Matrix $A = \\begin{pmatrix} 2 & 0 \\\\ 0 & 3 \\end{pmatrix}$ meets vector $\\vec{v} = (1, 1)$.',
              'Row 1 times column: $2 \\times 1 + 0 \\times 1 = 2$.',
              'Row 2 times column: $0 \\times 1 + 3 \\times 1 = 3$.',
              'Output: $A\\vec{v} = (2, 3)$ — the matrix stretched v by 2× along x and 3× along y.',
              'That is all a quantum gate is: a matrix that stretches and rotates a state vector while preserving its length.'
            ] },
          { type: 'flip', front: 'unitary matrix', back: 'a matrix that preserves vector lengths — the quantum version of a stochastic matrix preserving probability' },
          { type: 'quiz', question: {
            prompt: 'The dot product of $|0\\rangle = (1,0)$ and $|1\\rangle = (0,1)$ is…',
            options: ['0', '1', '2', '$i$'],
            answer: 0,
            explain: '$1 \\times 0 + 0 \\times 1 = 0$ — the basis states are **orthogonal**. Outcomes that cannot overlap is what makes measurement well-defined.'
          } },
          { type: 'reflect', prompt: 'Connect it back: the Born rule $P(i) = |a_i|^2$ — where did you see this same quantity in today lesson?',
            model: 'The squared length of a vector: $\\vec{v} \\cdot \\vec{v} = \\sum v_i^2$. Probabilities in the quantum world ARE squared vector lengths — measuring asks which basis direction your state leans into.' }
        ]
      },
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
    estMin: 30,
    lessons: [
      {
        id: 'l1', part: 'Amplitudes & kets',
        title: 'Qubits, Kets & Superposition',
        videoId: 'Y5WRv_9757A',
        videoTitle: 'QML 03 — Quantum States',
        sections: [
          { type: 'text', body: 'A **quantum state** is just like a stochastic vector — a column vector — but with two crucial differences: the entries may be **complex numbers**, and normalization happens in the **2-norm**: the squared absolute values sum to 1. The simplest case, a two-level system, is the **qubit**.' },
          { type: 'equation', body: '$|\\psi\\rangle  = a_{0}|0\\rangle  + a_{1}|1\\rangle ,\\quad |a_{0}|^{2} + |a_{1}|^{2} = 1$', desc: 'general qubit state — a superposition over the canonical basis' },
          { type: 'predict', prompt: 'The one formula you must not forget: given $|\\psi\\rangle = a_0|0\\rangle + a_1|1\\rangle$, what is the probability of measuring 0?',
            options: ['$a_0$', '$|a_0|^2$', '$|a_0|$', '$1 - a_1$'],
            reveal: '**$|a_0|^2$** — the Born rule. The amplitude itself can be negative or complex, so only its squared magnitude is a valid probability.' },
          { type: 'symbols', items: [
            { sym: '$|0\\rangle $', name: 'zero ket', desc: 'the basis vector $(1,0)^{T}$' },
            { sym: '$|1\\rangle $', name: 'one ket', desc: 'the basis vector $(0,1)^{T}$' },
            { sym: '$a_{i}$', name: 'probability amplitude', desc: 'complex coefficient; $|a_{i}|^{2}$ gives the outcome probability' },
            { sym: '$|\\cdot \\rangle $', name: 'ket notation', desc: 'marks a column vector — like the arrow on a stochastic vector' }
          ] },
          { type: 'points', items: [
            '**Superposition** is just the expansion of the vector in a basis — nothing mysterious',
            'Amplitudes are not probabilities: the **Born rule** says outcome 0 occurs with probability $|a_{0}|^{2}$',
            'After observing an outcome the state **collapses** to that basis state — the collapse of the wavefunction',
            'A quantum state is also called a **wavefunction**'
          ] },
          { type: 'explore', widget: 'amplitudes', title: 'Play with superposition',
            note: '$\\theta$ on the slider gives $|\\psi\\rangle = \\cos(\\theta/2)|0\\rangle + \\sin(\\theta/2)|1\\rangle$. Watch the squared amplitudes — the probabilities — then hit Measure and watch the state collapse to a definite outcome.' },
          { type: 'flip', front: 'Collapse of the wavefunction', back: 'measuring outcome 0 leaves the qubit deterministically in $|0\\rangle $ — the superposition is destroyed' },
          { type: 'quiz', question: {
            prompt: 'In $|\\psi\\rangle  = a_{0}|0\\rangle  + a_{1}|1\\rangle $, the probability of measuring outcome 1 is…',
            options: ['$|a_{1}|^{2}$', '$a_{1}$', '$|a_{1}|$', '$1 - |a_{0}|$'],
            answer: 0,
            explain: 'The Born rule takes the squared absolute value of the amplitude. $a_{1}$ itself can be complex or negative — only $|a_{1}|^{2}$ is a valid probability.'
          } },
          { type: 'reflect', prompt: 'Explain it back: the classical rule was $\\sum p_i = 1$ (1-norm). What replaces it for quantum states, and why does that change unlock interference?',
            model: 'The 2-norm $\\sum |a_i|^2 = 1$. Because only squared magnitudes are constrained, the amplitudes themselves can carry a sign (or phase) — so two paths to the same outcome can cancel, which ordinary probabilities could never do.' }
        ]
      },
      {
        id: 'l2', part: 'Bloch sphere & interference',
        title: 'Bloch Sphere & Interference',
        videoId: 'Y5WRv_9757A',
        videoTitle: 'QML 03 — Quantum States',
        sections: [
          { type: 'text', body: 'A two-dimensional complex vector would need four real dimensions to draw — but normalization removes a degree of freedom, so qubit states fit on a three-dimensional object: the **Bloch sphere**. The north pole is $|0\\rangle $, the south pole $|1\\rangle $ — even though those vectors are actually orthogonal, which is unusual geometry to get used to.' },
          { type: 'points', items: [
            'Classical two-outcome distributions live on a **line segment**; qubit states cover a whole **2D surface** — far richer representational power',
            '**Interference**: amplitudes of different basis vectors can interact and cancel during a calculation',
            'Example: an operator M sends $|0\\rangle  \\mapsto  \\frac{|0\\rangle +|1\\rangle }{\\sqrt{2}}$ $\\text{ and } |1\\rangle  \\mapsto  \\frac{-|0\\rangle +|1\\rangle }{\\sqrt{2}}$',
            'Applying M **again** to $M|0\\rangle $ makes the $|0\\rangle $ amplitudes cancel — **destructive interference** — leaving the deterministic outcome $|1\\rangle $'
          ] },
          { type: 'predict', prompt: 'Before the math: you apply M to $|0\\rangle$, get a superposition, then apply M **again**. Is the final outcome deterministic or random?',
            options: ['Deterministic', 'Random — always 50/50', 'Random — depends on the amplitudes'],
            reveal: '**Deterministic** — and the reason is the heart of quantum computing: the $|0\\rangle$ amplitudes arrive with opposite signs and cancel. Work it through below.' },
          { type: 'steps', title: 'Interference, line by line: M applied twice',
            hint: 'Predict each line before revealing it — this is the whole trick of quantum algorithms.',
            steps: [
              'Start: $|0\\rangle$.',
              'First application: $M|0\\rangle = \\tfrac{|0\\rangle + |1\\rangle}{\\sqrt{2}}$.',
              'Apply M again and use linearity: $M(M|0\\rangle) = \\tfrac{M|0\\rangle + M|1\\rangle}{\\sqrt{2}}$.',
              'Substitute both rules: $= \\tfrac{1}{\\sqrt{2}}\\left(\\tfrac{|0\\rangle+|1\\rangle}{\\sqrt{2}} + \\tfrac{-|0\\rangle+|1\\rangle}{\\sqrt{2}}\\right)$.',
              'Collect the $|0\\rangle$ terms: $\\tfrac{+1 - 1}{2} = 0$ — **destructive interference** erases them.',
              'Collect the $|1\\rangle$ terms: $\\tfrac{+1 + 1}{2} = 1$ — **constructive interference**. Result: $|1\\rangle$, deterministic.'
            ] },
          { type: 'equation', body: '$M|0\\rangle  = \\frac{|0\\rangle +|1\\rangle }{\\sqrt{2}}\\quad \\Rightarrow \\quad M(M|0\\rangle ) = |1\\rangle $', desc: 'destructive interference erases the $|0\\rangle $ amplitude — a deterministic result from two random-looking steps' },
          { type: 'flip', front: 'Bloch sphere', back: 'unit sphere whose surface points are qubit states: $|0\\rangle $ at the north pole, $|1\\rangle $ at the south' },
          { type: 'symbols', items: [
            { sym: '$\\theta, \\varphi$', name: 'Bloch angles', desc: 'latitude and longitude locating a state on the sphere' },
            { sym: 'M', name: 'interfering operator', desc: 'a rotation-like unitary that redistributes amplitudes' }
          ] },
          { type: 'quiz', question: {
            prompt: 'Applying the operator twice yields a deterministic outcome because…',
            options: [
              'the $|0\\rangle $ amplitudes destructively interfere and cancel',
              'the state collapses under measurement',
              'the probabilities renormalize to 1',
              'all amplitudes interfere constructively at once'
            ],
            answer: 0,
            explain: 'The plus and minus contributions to $|0\\rangle $ cancel exactly — destructive interference — while the $|1\\rangle $ branch survives.'
          } },
          { type: 'reflect', prompt: 'One sentence for future-you: why can amplitudes cancel each other when probabilities cannot?',
            model: 'Probabilities are non-negative, so they can only pile up. Amplitudes carry sign (and phase), so a $+$ branch and a $-$ branch of the same basis state can annihilate — that cancellation is how quantum algorithms steer probability mass toward the right answer.' }
        ]
      },
      {
        id: 'l3', part: 'Measurement',
        title: 'Measurement & the Born Rule',
        videoId: 'Y5WRv_9757A',
        videoTitle: 'QML 03 — Quantum States',
        sections: [
          { type: 'text', body: 'Measurement is where the abstract vector meets reality. You cannot read an amplitude directly — you can only ask the qubit a yes/no question, and it answers **probabilistically** with odds set by the squared amplitudes. Worse for the qubit, answering destroys the superposition: after the measurement it stands in whatever state you observed.' },
          { type: 'symbols', items: [
            { sym: 'Born rule', name: '$P(i) = |a_i|^2$', desc: 'outcome odds = squared amplitude magnitudes' },
            { sym: 'collapse', name: 'post-measurement', desc: 'after seeing $i$, the state becomes $|i\\rangle$' },
            { sym: 'basis', name: 'measurement basis', desc: 'the yes/no question asked — computational basis = "0 or 1?"' }
          ] },
          { type: 'explore', widget: 'amplitudes', title: 'Run the experiment — measure 10+ times',
            note: 'Pick a $\\theta$, then click Measure repeatedly. Watch the tally $0:N \\cdot 1:M$ converge toward the predicted percentages — that convergence *is* the Born rule.' },
          { type: 'steps', title: 'From amplitudes to an experimental prediction',
            steps: [
              'State: $|\\psi\\rangle = \\tfrac{\\sqrt{3}}{2}|0\\rangle + \\tfrac{1}{2}|1\\rangle$.',
              'Check normalization: $\\tfrac{3}{4} + \\tfrac{1}{4} = 1$ ✓.',
              'Born rule: $P(0) = |\\tfrac{\\sqrt{3}}{2}|^2 = \\tfrac{3}{4}$, $P(1) = \\tfrac{1}{4}$.',
              'In 1000 measurements you expect roughly **750 zeros and 250 ones** — never exactly, but close.',
              'The qubit gave you a fair sampling device for odds that have no classical coin equivalent at first glance.'
            ] },
          { type: 'predict', prompt: 'You measure the state and see outcome **1**. If you measure a second time, what do you get?',
            options: [
              '1 again — the state collapsed to $|1\\rangle$',
              '50/50 — superposition is still there',
              'The original probabilities $\\tfrac{3}{4}/\\tfrac{1}{4}$'
            ],
            reveal: '**1 again** — the first measurement collapsed the state to $|1\\rangle$. The superposition is gone; asking the same question twice gives the same answer. This is why quantum data is so fragile.' },
          { type: 'flip', front: 'Born rule', back: '$P(i) = |a_i|^2$ — outcome probabilities come from squaring amplitudes, never from the amplitudes themselves' },
          { type: 'quiz', question: {
            prompt: 'Measuring $|\\psi\\rangle = \\tfrac{|0\\rangle + e^{i\\theta}|1\\rangle}{\\sqrt{2}}$ in the computational basis gives $P(0)$ equal to…',
            options: ['$\\tfrac{1}{2}$', '$|e^{i\\theta}|$', '$\\theta/\\pi$', '$\\tfrac{1}{4}$'],
            answer: 0,
            explain: '$|e^{i\\theta}| = 1$ for any phase $\\theta$ — a relative phase is invisible to a computational-basis measurement. $P(0) = P(1) = \\tfrac{1}{2}$ always.'
          } },
          { type: 'reflect', prompt: 'Two states differ only in the phase of $a_1$: $+\\tfrac{1}{\\sqrt{2}}$ versus $e^{i\\theta}\\tfrac{1}{\\sqrt{2}}$. Can a single computational-basis measurement tell them apart? Explain why that is a problem for quantum programmers.',
            model: 'No — both give identical 50/50 statistics because $|e^{i\\theta}|^2 = 1$. Phase information is real but hidden: you need a *different basis* (or interference) to detect it. Programming a quantum computer means arranging interference so hidden phase differences become measurable.' }
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
        id: 'l1', part: 'Multi-qubit states',
        title: 'Tensor Products & Multi-Qubit Basis',
        videoId: 'bNCC0YMLHuk',
        videoTitle: 'QML 04 — Multiple Qubits',
        sections: [
          { type: 'text', body: 'To build larger systems from qubits we need a new operation: the **tensor product**. Take two kets $(a_{0},a_{1})^{T}$ $\\text{ and } (b_{0},b_{1})^{T}$ — their tensor product is a four-dimensional vector containing every pairwise product of amplitudes.' },
          { type: 'equation', body: '$(a_{0},a_{1})^{T} \\otimes  (b_{0},b_{1})^{T} = (a_{0}b_{0}, a_{0}b_{1}, a_{1}b_{0}, a_{1}b_{1})^{T}$', desc: 'two 2-dim vectors combine into a 4-dim product state' },
          { type: 'points', items: [
            'Basis shorthand: $|0\\rangle  \\otimes  |0\\rangle $ is written $|0\\rangle |0\\rangle $ or simply **$|00\\rangle $** — it is the first canonical basis vector of the 4-dim space',
            'The four basis states $|00\\rangle , |01\\rangle , |10\\rangle , |11\\rangle $ span the whole two-qubit space',
            'Convention: the **rightmost** qubit is qubit 0 — the same ordering as binary digits in digital computers, which is why libraries keep it',
            'States that can be written as a tensor product are called **product states**'
          ] },
          { type: 'symbols', items: [
            { sym: '$\\otimes $', name: 'tensor product', desc: 'combines two state spaces into one larger space' },
            { sym: '$|01\\rangle $', name: 'two-qubit basis state', desc: 'qubit 1 is 0, qubit 0 (rightmost) is 1' },
            { sym: '$q_{0}$', name: 'qubit 0', desc: 'conventionally the rightmost qubit — least significant' }
          ] },
          { type: 'flip', front: '$|10\\rangle $', back: 'qubit 1 = 1, qubit 0 = 0 — the third canonical basis vector of the 4-dim space' },
          { type: 'quiz', question: {
            prompt: 'In standard quantum-computing convention, the rightmost qubit of a register is labeled…',
            options: ['qubit 0', 'the most significant qubit', 'the ancilla', 'the control qubit'],
            answer: 0,
            explain: 'Qubit 0 sits rightmost, mirroring binary notation where the least significant bit is written on the right.'
          } },
          { type: 'reflect', prompt: 'Explain it back — in one or two sentences, what was "Multiple Qubits & Entanglement" really about?', model: 'Say the main idea, name the key formula or concept, and give one reason it matters. If any of the three felt fuzzy, re-scan the sections above before moving on.' }
        ]
      },
      {
        id: 'l2', part: 'Entanglement',
        title: 'Entanglement & the $|\\Phi^{+}\\rangle $ State',
        videoId: 'bNCC0YMLHuk',
        videoTitle: 'QML 04 — Multiple Qubits',
        sections: [
          { type: 'text', body: 'Not every state in the two-qubit space factors as a product. The prime example is **$|\\Phi^{+}\\rangle $**, the equal superposition of $|00\\rangle $ and $|11\\rangle $. Suppose it were a product: we would need $a_{0}b_{0} = a_{1}b_{1} = \\frac{1}{\\sqrt{2}}$ — so all four numbers are nonzero — yet the $|01\\rangle $ and $|10\\rangle $ coefficients $a_{0}b_{1} \\text{ and } a_{1}b_{0}$ must be **zero**. Contradiction. No such factorization exists.' },
          { type: 'equation', body: '$|\\Phi^{+}\\rangle  = \\frac{|00\\rangle  + |11\\rangle }{\\sqrt{2}}$', desc: 'a maximally entangled Bell state — lives in the same space but cannot be written as a product' },
          { type: 'points', items: [
            'States with no product decomposition are called **entangled states**',
            'Entanglement and interference are the two key quantum resources exploited by quantum algorithms',
            'An entangled system has no description as “state of qubit A plus state of qubit B” — only the joint state exists'
          ] },
          { type: 'symbols', items: [
            { sym: '$|\\Phi^{+}\\rangle $', name: 'Bell state', desc: 'maximally entangled two-qubit state' },
            { sym: '$a_{0}b_{0}, a_{1}b_{1}$', name: 'product coefficients', desc: 'would both have to equal $\\frac{1}{\\sqrt{2}}$ while $a_{0}b_{1} = a_{1}b_{0} = 0$ — impossible' }
          ] },
          { type: 'flip', front: 'Product state vs entangled state', back: 'product: factors into per-qubit kets; entangled: no factorization exists — the whole is more than the parts' },
          { type: 'quiz', question: {
            prompt: 'Why can $|\\Phi^{+}\\rangle $ not be written as a product state?',
            options: [
              '$a_{0}b_{0} \\text{ and } a_{1}b_{1}$ must both be nonzero while $a_{0}b_{1} \\text{ and } a_{1}b_{0}$ must both be zero — impossible',
              'its norm is not equal to 1',
              'it contains too many qubits',
              'tensor products cannot mix $|0\\rangle $ and $|1\\rangle $'
            ],
            answer: 0,
            explain: 'The four required coefficient conditions contradict each other: the $|00\\rangle $ and $|11\\rangle $ terms force all amplitudes nonzero, while the absent $|01\\rangle $ and $|10\\rangle $ terms force some to be zero.'
          } },
          { type: 'reflect', prompt: 'Explain it back — in one or two sentences, what was "Entanglement & the $|\\Phi^{+}\\rangle $ State" really about?', model: 'Say the main idea, name the key formula or concept, and give one reason it matters. If any of the three felt fuzzy, re-scan the sections above before moving on.' }
        ]
      },
          {
        id: 'l3', part: 'Entanglement',
        title: 'Entanglement: Seeing It, Using It',
        videoId: 'Y5WRv_9757A',
        videoTitle: 'QML 03 — Quantum States',
        sections: [
          { type: 'text', body: 'Entanglement is the property classical physics simply does not have: two qubits whose joint state is defined, while their individual states are not. Measure one and you instantly know the other — not because of a hidden list, but because the **pair itself** is the fundamental object.' },
          { type: 'equation', body: '$|\\Phi^{+}\\rangle = \\tfrac{|00\\rangle + |11\\rangle}{\\sqrt{2}}$', desc: 'the Bell state — the simplest entangled pair' },
          { type: 'predict', prompt: 'In the Bell state above, if you measure the FIRST qubit and get 0 — what is the second qubit?',
            options: ['Definitely 0', 'Definitely 1', 'Still 50/50 — it is independent'],
            reveal: '**Definitely 0** — the only terms in the state are $|00\\rangle$ and $|11\\rangle$. There is no $|01\\rangle$ branch at all: the outcomes are perfectly correlated, even though each was random before the measurement.' },
          { type: 'steps', title: 'Why entanglement ≠ classical correlation',
            steps: [
              'Classical version: two envelopes, one says 0 and one says 1 — you just do not know which is which.',
              'Quantum version: neither qubit has a definite value until measured — the pair has a state, the individuals do not.',
              'Tell them apart: measure in DIFFERENT bases. Classical envelopes always agree in every basis; Bell pairs correlate in every basis.',
              'That stronger-than-classical correlation (Bell inequality violation) is the experimental proof that quantum mechanics is real.'
            ] },
          { type: 'flip', front: 'product state', back: 'a state that factors $|a\\rangle\\otimes|b\\rangle$ — opposite of entangled; the Bell state cannot be factored' },
          { type: 'quiz', question: {
            prompt: 'Which of these is entangled?',
            options: [
              '$\\tfrac{1}{\\sqrt{2}}(|00\\rangle + |11\\rangle)$',
              '$\\tfrac{1}{2}(|00\\rangle + |01\\rangle + |10\\rangle + |11\\rangle)$',
              '$|0\\rangle \\otimes |1\\rangle$',
              '$\\tfrac{1}{\\sqrt{2}}(|0\\rangle + |1\\rangle) \\otimes |0\\rangle$'
            ],
            answer: 0,
            explain: 'The Bell state has no factored form — it only describes the PAIR. The second option factors as $|+\\rangle \\otimes |+\\rangle$, and the other two are explicitly products.'
          } },
          { type: 'reflect', prompt: 'Explain back the difference between "two coins that always match" and "a Bell pair".',
            model: 'Coins that match had their values all along — you were just ignorant. Bell pair outcomes have NO values until measured, yet always match in ANY basis. The correlation is built into the joint state, not the individual states.' }
        ]
      },
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
        id: 'l1', part: 'Inner products',
        title: 'Bras, Daggers & Inner Products',
        videoId: 'aVFe08G0uYk',
        videoTitle: 'QML 05 — Measurements',
        sections: [
          { type: 'text', body: 'Complex numbers admit an operation reals do not: **complex conjugation** — flipping the sign of the imaginary $part, a_{0} = x_{0} + iy_{0} \\mapsto  x_{0} - iy_{0}$. With it we define the partner of every ket: the **$bra** \\langle \\psi|$ is the conjugate transpose (dagger, $^{\\dagger}$) of $|\\psi\\rangle $ — a row vector of conjugated entries.' },
          { type: 'symbols', items: [
            { sym: '$\\langle \\psi|$', name: 'bra', desc: 'conjugate transpose of the ket — a row vector' },
            { sym: '$^{\\dagger}$', name: 'dagger', desc: 'transpose + complex conjugate' },
            { sym: '$\\langle \\varphi|\\psi\\rangle $', name: 'inner product', desc: 'row $\\times $ column — a scalar (the dot product)' },
            { sym: '$|\\varphi\\rangle \\langle \\psi|$', name: 'outer product', desc: 'column $\\times $ row — a matrix' }
          ] },
          { type: 'equation', body: '$\\langle \\psi|\\psi\\rangle  = |a_{0}|^{2} + |a_{1}|^{2} = 1$', desc: 'bra-ket of a state with itself = squared 2-norm = normalization' },
          { type: 'points', items: [
            '$\\langle 0|1\\rangle  = 0$ — orthogonal vectors have zero inner product',
            '**Order matters**: bra·ket gives a scalar, ket·bra gives a matrix',
            '$|0\\rangle \\langle 0|$ is the **projector** onto the $|0\\rangle $ direction — the building block of measurement'
          ] },
          { type: 'flip', front: '$\\langle 0|1\\rangle $', back: '0 — the two basis states are orthogonal' },
          { type: 'quiz', question: {
            prompt: 'The object $|0\\rangle \\langle 0|$ is…',
            options: [
              'a $2\\times 2$ projection matrix',
              'a scalar equal to 1',
              'a row vector',
              'a normalized qubit state'
            ],
            answer: 0,
            explain: 'Column times row is an outer product — a matrix. Applied to a state it extracts the $|0\\rangle $ component: it is the projector onto $|0\\rangle $.'
          } },
          { type: 'reflect', prompt: 'Explain it back — in one or two sentences, what was "Measurement & Probabilities" really about?', model: 'Say the main idea, name the key formula or concept, and give one reason it matters. If any of the three felt fuzzy, re-scan the sections above before moving on.' }
        ]
      },
      {
        id: 'l2', part: 'Measurement theory',
        title: 'Born Rule & Projective Measurement',
        videoId: 'aVFe08G0uYk',
        videoTitle: 'QML 05 — Measurements',
        sections: [
          { type: 'text', body: 'A measurement behaves like a **random variable**: it always returns a random outcome. The Born rule says outcome 0 appears with probability $|a_{0}|^{2}$, and afterwards the state is $|0\\rangle $. Formally, getting outcome 0 means applying the projector **$P_{0} = |0\\rangle \\langle 0|$** to the state.' },
          { type: 'equation', body: '$P(0) = \\langle \\psi|P_{0}|\\psi\\rangle  = |\\langle 0|\\psi\\rangle |^{2}$', desc: 'probability = expectation value of the projector — the squared length of the projected vector' },
          { type: 'equation', body: '$|\\psi^{\\prime}\\rangle  = P_{0}\\frac{|\\psi\\rangle}{\\sqrt{\\langle \\psi|P_{0}|\\psi\\rangle }}$', desc: 'post-measurement state — the projected vector renormalized' },
          { type: 'points', items: [
            '$P_{0}|\\psi\\rangle  = |0\\rangle \\langle 0|\\psi\\rangle  = a_{0}|0\\rangle $ — the $\\langle 0|\\psi\\rangle $ part collapses to the scalar $a_{0}$',
            'The squared norm of that vector is $|a_{0}|^{2}$ — exactly the Born rule',
            'After the outcome, renormalize the projected vector — the superposition is gone',
            'This formalism is how we mathematically pull samples out of a quantum distribution'
          ] },
          { type: 'symbols', items: [
            { sym: '$P_{0}$', name: 'projector $|0\\rangle \\langle 0|$', desc: 'measurement operator for outcome 0' },
            { sym: '$\\langle P_{0}\\rangle $', name: 'expectation value', desc: '$\\langle \\psi|P_{0}|\\psi\\rangle $ — the outcome probability' }
          ] },
          { type: 'flip', front: 'Post-measurement state', back: 'the projected vector renormalized: $P\\frac{|\\psi\\rangle}{\\sqrt{\\langle \\psi|P|\\psi\\rangle }}$' },
          { type: 'quiz', question: {
            prompt: 'After a projective measurement yields outcome 1, the qubit…',
            options: [
              'becomes $P_{1}|\\psi\\rangle $ renormalized — deterministically $|1\\rangle $',
              'remains in its original superposition',
              'becomes maximally mixed',
              'is erased entirely'
            ],
            answer: 0,
            explain: 'Measurement collapses the state onto the observed outcome: the projected and renormalized vector is exactly $|1\\rangle $.'
          } },
          { type: 'reflect', prompt: 'Explain it back — in one or two sentences, what was "Born Rule & Projective Measurement" really about?', model: 'Say the main idea, name the key formula or concept, and give one reason it matters. If any of the three felt fuzzy, re-scan the sections above before moving on.' }
        ]
      },
          {
        id: 'l3', part: 'Measurement theory',
        title: 'Choosing Your Question: Measurement Bases',
        videoId: 'Y5WRv_9757A',
        videoTitle: 'QML 03 — Quantum States',
        sections: [
          { type: 'text', body: 'Measuring a qubit is asking it a question — and **you choose the question**. "Are you 0 or 1?" is the computational basis. But "Are you + or −?" is a different basis, and the same state gives different answers depending on which you ask. There is no answer to a question you did not ask.' },
          { type: 'symbols', items: [
            { sym: '$\\{|0\\rangle, |1\\rangle\\}$', name: 'Z basis', desc: '"0 or 1?" — the computational basis' },
            { sym: '$|+\\rangle = \\tfrac{|0\\rangle+|1\\rangle}{\\sqrt{2}}$', name: 'plus state', desc: 'the + outcome of the X basis' },
            { sym: '$|-\\rangle = \\tfrac{|0\\rangle-|1\\rangle}{\\sqrt{2}}$', name: 'minus state', desc: 'the − outcome of the X basis' }
          ] },
          { type: 'predict', prompt: 'State $|+\\rangle$ measured in the computational basis gives 50/50. What does it give when measured in the X basis?',
            options: ['Always +', 'Always −', 'Still 50/50'],
            reveal: '**Always +** — $|+\\rangle$ IS the + eigenstate. A state that looks perfectly random in one basis is perfectly certain in another. The uncertainty was never in the qubit — it was in the question you asked.' },
          { type: 'steps', title: 'Rewriting a state in a new basis',
            steps: [
              'Start: $|0\\rangle$. In the X basis we need |+⟩ and |−⟩ coefficients.',
              'Use the identities $|0\\rangle = \\tfrac{|+\\rangle + |-\\rangle}{\\sqrt{2}}$ and $|1\\rangle = \\tfrac{|+\\rangle - |-\\rangle}{\\sqrt{2}}$.',
              'So $|0\\rangle$ in the X basis = $\\tfrac{1}{\\sqrt{2}}|+\\rangle + \\tfrac{1}{\\sqrt{2}}|-\\rangle$.',
              'X-basis measurement of $|0\\rangle$: 50/50 between + and − — a certainty in Z becomes a coin flip in X.',
              'Lesson: the SAME state carries different answers for different questions — that is the whole secret of quantum cryptography.'
            ] },
          { type: 'flip', front: 'measurement basis', back: 'the question you ask a qubit — orthonormal pair of directions; the state is certain in its own basis' },
          { type: 'quiz', question: {
            prompt: 'State $|-\\rangle$ measured in the X basis gives…',
            options: ['always −', 'always +', '50/50', 'always 1'],
            answer: 0,
            explain: '$|-\\rangle$ is the − eigenstate of X — it answers "−" with probability 1. Eigenstates of a basis are deterministic in that basis.'
          } },
          { type: 'reflect', prompt: 'One sentence for future-you: what is the relationship between a measurement basis and "asking a question"?',
            model: 'Choosing a basis IS choosing the question — each basis pair defines two possible answers. A state is only as certain as its alignment with the question asked; certainty in one basis is randomness in another.' }
        ]
      },
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
        id: 'l1', part: 'Density matrices',
        title: 'Density Matrices & Mixed States',
        videoId: 'BE8RxAESx5I',
        videoTitle: 'QML 06 — Mixed States',
        sections: [
          { type: 'text', body: 'A ket describes a **pure** state. The equivalent density-matrix picture, $\\rho = |\\psi\\rangle \\langle \\psi|$, can do something kets cannot: describe **classical mixtures** — a probability distribution over pure states, representing our ignorance about a noisy system.' },
          { type: 'equation', body: '$\\rho = \\sum _{i} p_{i} |\\psi_{i}\\rangle \\langle \\psi_{i}|,\\quad P(0) = \\mathrm{Tr} (P_{0}\\rho)$', desc: 'mixture of pure states; probabilities come from the trace, not the norm' },
          { type: 'points', items: [
            '**Tr** — the trace, the sum of diagonal entries — replaces the vector norm when extracting probabilities',
            '**Off-diagonal entries are coherences** — they carry the quantum interference and are critical for quantum operations',
            'Equal superposition $|+\\rangle $ has $\\rho$ with all entries $\\tfrac{1}{2}$ — full of coherence; a $\\frac{50}{50}$ classical mixture of $|0\\rangle $ and $|1\\rangle $ has **zero** off-diagonals — they are different states',
            'The **maximally mixed state** is the analogue of the uniform distribution: maximal entropy, zero predictive power'
          ] },
          { type: 'equation', body: '$\\rho_{\\max} = \\tfrac{1}{2}|0\\rangle\\langle 0| + \\tfrac{1}{2}|1\\rangle\\langle 1| = \\tfrac{1}{2} I$', desc: 'the maximally mixed qubit — the classical uniform distribution in disguise' },
          { type: 'symbols', items: [
            { sym: '$\\rho$', name: 'density matrix', desc: '$|\\psi\\rangle \\langle \\psi|$ for pure states; weighted sum for mixtures' },
            { sym: 'Tr', name: 'trace', desc: 'sum of diagonal elements — extracts probabilities' },
            { sym: '$p_{i}$', name: 'mixture weights', desc: 'classical probabilities over the pure states in the mix' }
          ] },
          { type: 'flip', front: 'Measuring half of $|\\Phi^{+}\\rangle $', back: 'project one qubit (identity on the other): the partner qubit is then perfectly correlated — entanglement at work' },
          { type: 'quiz', question: {
            prompt: 'The off-diagonal entries of a density matrix are called…',
            options: ['coherences', 'eigenvalues', 'marginals', 'partitions'],
            answer: 0,
            explain: 'Coherences encode interference between basis states. Noise destroys them — which is why the equal superposition and the 50/50 mixture are physically different.'
          } },
          { type: 'reflect', prompt: 'Explain it back — in one or two sentences, what was "Mixed States & Open Systems" really about?', model: 'Say the main idea, name the key formula or concept, and give one reason it matters. If any of the three felt fuzzy, re-scan the sections above before moving on.' }
        ]
      },
      {
        id: 'l2', part: 'Open systems',
        title: 'Open Quantum Systems & Thermal States',
        videoId: '_fmBNpDEen4',
        videoTitle: 'QML 08 — Open Quantum Systems',
        sections: [
          { type: 'text', body: 'Real quantum processors are **open systems**: your device of interest is embedded in an environment — a thermal bath — and interacts with it uncontrollably. Evolution is then no longer unitary but a **CPTP map** (completely positive, trace-preserving). You will not need the formalism — just the picture of a system leaking coherence into its surroundings.' },
          { type: 'equation', body: '$\\rho = \\nu|\\psi\\rangle \\langle \\psi| + (1-\\nu) \\frac{I}{d}$', desc: 'mixing a pure state with random noise at visibility $\\nu \\in  [0,1]$' },
          { type: 'points', items: [
            'At visibility $\\nu = 1$ the state is pure; as $\\nu$ drops, **coherences fade**; at $\\nu = 0$ only the maximally mixed state remains',
            '**$T_{2}$ time**: how long coherences survive — your calculation must finish before decoherence wins; a key hardware quality metric',
            'Equilibration is like coffee cooling to room temperature: the system reaches **thermal equilibrium** with its environment',
            'The resulting **thermal state** samples energies by the Boltzmann distribution, $\\frac{e^{-E/kT}}{Z}$'
          ] },
          { type: 'equation', body: '$P(E) \\propto  \\frac{e^{-E/kT}}{Z}$', desc: 'Boltzmann weights; $T \\to  0$ gives the ground state, $T \\to  \\infty $ gives the uniform (maximally mixed) state' },
          { type: 'flip', front: '$T_{2}$ time', back: 'characteristic decoherence timescale — how long a device stays quantum before the environment washes out the coherences' },
          { type: 'symbols', items: [
            { sym: '$\\nu$', name: 'visibility', desc: 'tunes between pure state (1) and maximally mixed (0)' },
            { sym: 'Z', name: 'partition function', desc: 'normalization of the Boltzmann distribution' },
            { sym: 'CPTP', name: 'completely positive trace-preserving map', desc: 'the general evolution of an open system' }
          ] },
          { type: 'quiz', question: {
            prompt: 'At infinite temperature, the thermal state of a qubit becomes…',
            options: [
              'the maximally mixed state',
              'the ground state $|0\\rangle $',
              'a pure equal superposition',
              'a Bell state'
            ],
            answer: 0,
            explain: 'At $T \\to  \\infty $ the Boltzmann weights flatten to uniform — every energy level is equally likely — which is exactly the maximally mixed state.'
          } },
          { type: 'reflect', prompt: 'Explain it back — in one or two sentences, what was "Open Quantum Systems & Thermal States" really about?', model: 'Say the main idea, name the key formula or concept, and give one reason it matters. If any of the three felt fuzzy, re-scan the sections above before moving on.' }
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
        id: 'l1', part: 'Unitary evolution',
        title: 'Unitary Evolution in Closed Systems',
        videoId: 'P-mGqiKcEKE',
        videoTitle: 'QML 07 — Evolution in Closed Quantum Systems',
        sections: [
          { type: 'text', body: 'A quantum computation is the evolution of a probability distribution. In a **closed** system — the idealized case — the analogue of a stochastic matrix is a **unitary** matrix: whatever state goes in, a valid quantum state comes out.' },
          { type: 'equation', body: '$U^{\\dagger}U = UU^{\\dagger} = I$', desc: 'unitarity — the conjugate transpose is the inverse' },
          { type: 'points', items: [
            'Unitaries preserve the **2-norm**, so the output is still a normalized quantum state',
            'Evolution is **linear** — genuine nonlinear operations need approximations and tricks, a recurring headache for QML',
            'Evolution is **reversible**: unlike a classical AND gate (whose output alone cannot tell you the inputs), you can always undo a unitary',
            'Example — the **X gate** (quantum NOT): flips $|0\\rangle  \\leftrightarrow  |1\\rangle $; real and symmetric, so $X^{\\dagger} = X$ and applying it twice restores the input'
          ] },
          { type: 'symbols', items: [
            { sym: 'U', name: 'unitary', desc: 'norm-preserving, reversible evolution operator' },
            { sym: 'X', name: 'Pauli-X / NOT gate', desc: 'swaps $|0\\rangle $ and $|1\\rangle $; its own inverse' },
            { sym: '$U^{\\dagger}$', name: 'adjoint', desc: 'conjugate transpose — undoes the operation' }
          ] },
          { type: 'flip', front: 'X applied to a superposition', back: 'linearity distributes it: $X(\\alpha|0\\rangle +\\beta|1\\rangle ) = \\alpha|1\\rangle +\\beta|0\\rangle $ — it swaps the amplitudes' },
          { type: 'quiz', question: {
            prompt: 'Unitary operations are reversible because…',
            options: [
              '$U^{\\dagger}$ is the inverse of U',
              'they preserve the 1-norm',
              'they are stochastic matrices',
              'they are nonlinear'
            ],
            answer: 0,
            explain: '$U^{\\dagger}U$ = I means the adjoint undoes the operation — no information is ever lost, unlike classical logic gates.'
          } },
          { type: 'reflect', prompt: 'Explain it back — in one or two sentences, what was "Dynamics, Ising & Many-Body" really about?', model: 'Say the main idea, name the key formula or concept, and give one reason it matters. If any of the three felt fuzzy, re-scan the sections above before moving on.' }
        ]
      },
      {
        id: 'l2', part: 'Ising models',
        title: 'The Classical Ising Model',
        videoId: 'Wy9YoEYv-fA',
        videoTitle: 'QML 09 — Classical Ising Model',
        sections: [
          { type: 'text', body: 'To understand today’s quantum hardware we borrow a model from statistical mechanics. A **spin** is a two-state variable $\\sigma_{i} = \\pm 1$ — like a magnet with its north face pointing up or down. Neighboring magnets prefer to anti-align/align, and nature seeks the lowest-energy configuration.' },
          { type: 'equation', body: '$H = -\\sum_{\\langle i,j\\rangle} J_{ij} \\sigma_{i}\\sigma_{j} - \\sum _{i} h_{i}\\sigma_{i}$', desc: 'Ising Hamiltonian — couplings between neighbors plus an external field on each site' },
          { type: 'points', items: [
            '**$J_{ij}$** tunes each pairwise coupling; **$h_{i}$** is an external magnetic field that can flip an individual spin, creating **frustration**',
            'The energy landscape has **local optima**: the system can get stuck behind an energy barrier instead of reaching the global minimum',
            'This is exactly the structure of **QUBO** — quadratic unconstrained binary optimization — which is NP-hard in general',
            'There is a deep correspondence between what is **computationally hard** and what is **physically hard** to solve'
          ] },
          { type: 'symbols', items: [
            { sym: '$\\sigma_{i}$', name: 'spin variable', desc: '$\\pm 1$ — up or down' },
            { sym: '$J_{ij}$', name: 'coupling', desc: 'interaction strength between spins i and j' },
            { sym: '$h_{i}$', name: 'local field / bias', desc: 'external field acting on a single spin' },
            { sym: '$\\langle ij\\rangle $', name: 'nearest neighbors', desc: 'sum only over interacting pairs' }
          ] },
          { type: 'flip', front: '$\\mathrm{QUBO}  \\leftrightarrow $ Ising', back: 'quadratic binary optimization problems map directly onto an Ising energy function — solve one and you solve the other' },
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
          } },
          { type: 'reflect', prompt: 'Explain it back — in one or two sentences, what was "The Classical Ising Model" really about?', model: 'Say the main idea, name the key formula or concept, and give one reason it matters. If any of the three felt fuzzy, re-scan the sections above before moving on.' }
        ]
      },
      {
        id: 'l3', part: 'Ising models',
        title: 'The Transverse Field Ising Model',
        videoId: 'egli0tC1tRo',
        videoTitle: 'QML 10 — Transverse Field Ising Model',
        sections: [
          { type: 'text', body: 'Nothing in the classical Ising model is quantum yet. Rewrite it with the **Pauli $\\sigma_{z}$ operator**: $\\sigma_{z}|0\\rangle  = +|0\\rangle  \\text{ and } \\sigma_{z}|1\\rangle  = -|1\\rangle $ — the $\\pm 1$ eigenvalues play the role of spin values, and the energy becomes the expectation value $\\langle \\psi|H|\\psi\\rangle $.' },
          { type: 'equation', body: '$H = -\\sum _{ij} J_{ij} \\sigma_{z}^{i}\\sigma_{z}^{j} - \\sum _{i} h_{i}\\sigma_{z}^{i} - \\sum _{i} g_{i}\\sigma_{x}^{i}$', desc: 'adding a transverse $\\sigma_{x}$ field makes the model genuinely quantum' },
          { type: 'points', items: [
            'A purely $\\sigma_{z}$ Hamiltonian has **commuting** terms — commuting operators behave essentially classically',
            '$\\sigma_{x} \\text{ and } \\sigma_{z} **$do not commute**: $\\sigma_{x}\\sigma_{z} \\neq  \\sigma_{z}\\sigma_{x}$ — this is where quantum behavior enters',
            'The eigenstates of $\\sigma_{z}$ $\\text{ are } |0\\rangle , |1\\rangle $ (definite spin); the eigenstates of $\\sigma_{x}$ are the equal superpositions $|\\pm \\rangle $',
            'So the $\\sigma_{z}$ terms push toward definite $\\frac{0}{1}$ configurations while the $\\sigma_{x}$ field pushes toward **superposition** — the competition produces quantum effects'
          ] },
          { type: 'symbols', items: [
            { sym: '$\\sigma_{z}$', name: 'Pauli-Z', desc: '$\\mathrm{diag} (1,-1)$: eigenvalues +$1, -1$ like classical spins' },
            { sym: '$\\sigma_{x}$', name: 'Pauli-X', desc: 'the transverse field — eigenstates are superpositions' },
            { sym: '$|+\\rangle $', name: 'plus state', desc: '$\\frac{|0\\rangle +|1\\rangle }{\\sqrt{2}}$ — eigenstate of $\\sigma_{x}$' },
            { sym: '$\\langle H\\rangle $', name: 'energy expectation', desc: '$\\langle \\psi|H|\\psi\\rangle $ — the energy of a quantum state' }
          ] },
          { type: 'flip', front: '$\\sigma_{z}|1\\rangle $', back: '$-|1\\rangle $ — eigenvalue $-1$, the operator version of a spin-down variable' },
          { type: 'quiz', question: {
            prompt: 'What makes the transverse-field Ising model quantum rather than classical?',
            options: [
              'the $\\sigma_{x} \\text{ and } \\sigma_{z}$ terms do not commute',
              'it uses more qubits',
              'its spins can only take $\\pm 1$',
              'its Hamiltonian is diagonal'
            ],
            answer: 0,
            explain: 'Non-commuting terms cannot be simultaneously definite — the $\\sigma_{x}$ field forces superposition, creating genuinely quantum behavior.'
          } },
          { type: 'reflect', prompt: 'Explain it back — in one or two sentences, what was "The Transverse Field Ising Model" really about?', model: 'Say the main idea, name the key formula or concept, and give one reason it matters. If any of the three felt fuzzy, re-scan the sections above before moving on.' }
        ]
      },
      {
        id: 'l4', part: 'Quantum dynamics',
        title: 'The Quantum Many-Body Problem (Melko)',
        videoId: 'MmpOva4-XPg',
        videoTitle: 'QML 11 — Quantum Many-Body Physics (Roger Melko)',
        sections: [
          { type: 'text', body: 'Guest lectures by **Roger Melko** (Waterloo / Perimeter Institute). Quantum many-body physics asks: what is the behavior of **N strongly-interacting quantum particles** — atoms, electrons, qubits — governed by the Schrödinger equation? N ranges from $\\sim 10$ in atoms, to thousands in quantum chemistry, up to $\\sim 10^{23}$ in materials.' },
          { type: 'points', items: [
            'The **hydrogen atom** (N=1 electron) is solvable in closed form; **helium** (N=2) already has no known exact solution',
            'Breaking 2048-bit RSA with Shor’s algorithm needs $\\sim $**4000 logical qubits** — and each logical qubit costs hundreds to thousands of physical ones $\\to  **\\sim 5$ million physical qubits**',
            '$Spin-\\tfrac{1}{2}$ gives an effective two-state system — the qubit of condensed matter; the Ising model is its simplest interacting Hamiltonian',
            'A few hundred spins $\\to $ more configurations $(2^{N})$ than **atoms in the known universe $(\\sim 10^{80})$** — brute force is physically impossible'
          ] },
          { type: 'equation', body: '$H|\\psi\\rangle  = E|\\psi\\rangle $', desc: 'solving the many-body $\\mathrm{problem} $ = diagonalizing a $2^{N} \\times  2^{N}$ matrix — $O(M^{3}) \\text{ where } M = 2^{N}$' },
          { type: 'symbols', items: [
            { sym: 'N', name: 'particle count', desc: 'number of interacting quantum species' },
            { sym: '$2^{N}$', name: 'Hilbert-space dimension', desc: 'the wavefunction is a superposition over all $2^{N}$ classical configurations' },
            { sym: 'Z', name: 'partition function', desc: 'normalization sum over all configurations — itself intractable' },
            { sym: '$\\beta$', name: 'inverse temperature', desc: '1/k_BT — weights configurations in the Boltzmann distribution' }
          ] },
          { type: 'flip', front: 'Exact diagonalization limit', back: 'state-of-the-art routines reach only $N \\approx  30$–40 spins — the Hilbert space doubles with every added qubit' },
          { type: 'quiz', question: {
            prompt: 'Why is exact diagonalization of a many-body Hamiltonian hopeless at scale?',
            options: [
              'the matrix is $2^{N} \\times  2^{N}$ and diagonalizing costs $O(M^{3})$ — astronomical even for $N \\approx  50$',
              'the Schrödinger equation cannot be written down',
              'spins cannot be measured',
              'the partition function is always zero'
            ],
            answer: 0,
            explain: 'The Hilbert space grows exponentially, and even the best diagonalization routines top out around 30–40 qubits — motivating quantum supremacy arguments.'
          } },
          { type: 'reflect', prompt: 'Explain it back — in one or two sentences, what was "The Quantum Many-Body Problem (Melko)" really about?', model: 'Say the main idea, name the key formula or concept, and give one reason it matters. If any of the three felt fuzzy, re-scan the sections above before moving on.' }
        ]
      },
      {
        id: 'l5', part: 'Quantum dynamics',
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
          { type: 'flip', front: 'Spin configs as images', back: 'map $\\uparrow \\downarrow $ spins to black/white pixels — a quantum big-data problem becomes an ML image problem' },
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
          } },
          { type: 'reflect', prompt: 'Explain it back — in one or two sentences, what was "Solving the Many-Body Problem (Melko)" really about?', model: 'Say the main idea, name the key formula or concept, and give one reason it matters. If any of the three felt fuzzy, re-scan the sections above before moving on.' }
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
        id: 'l1', part: 'Gate model',
        title: 'Circuits, Gates & Universality',
        videoId: '92uqxeofPak',
        videoTitle: 'QML 14 — Gate-Model Quantum Computing',
        sections: [
          { type: 'text', body: 'The **gate model** is the universal quantum computing paradigm. The software stack: a problem definition (say, traveling salesman$) \\to $ a matching quantum algorithm (e.g. $\\mathrm{QAOA} ) \\to $ a circuit of elementary gates $\\to  **$compilation** (gate-set translation + connectivity workarounds$) \\to $ execution on a QPU or a simulator ($\\sim 20$–22 qubits on a laptop, $\\sim 50$ on a supercomputer).' },
          { type: 'points', items: [
            '**Solovay–Kitaev theorem**: any unitary can be efficiently approximated by a finite universal gate set — this is what makes the model universal',
            'Classical universality = any logical operation on bits; quantum universality = any quantum state mapped to any other',
            '**X** = quantum NOT; **H** (Hadamard) sends $|0\\rangle $ to the equal superposition and $|1\\rangle $ to the minus version',
            '**CNOT**: a controlled operation — flips the target only when the control qubit is $|1\\rangle $',
            'H on qubit 0 followed by CNOT turns $|00\\rangle $ into the Bell state $|\\Phi^{+}\\rangle $ — your first real quantum algorithm',
            'Today’s devices are **shallow**: only $\\sim 10$–20 sequential gates before decoherence hits'
          ] },
          { type: 'equation', body: '$|00\\rangle \\xrightarrow{H \\text{ on } q_0} \\frac{(|0\\rangle+|1\\rangle)|0\\rangle}{\\sqrt{2}} \\xrightarrow{\\mathrm{CNOT}} \\frac{|00\\rangle+|11\\rangle}{\\sqrt{2}}$', desc: 'two gates prepare a maximally entangled Bell pair' },
          { type: 'symbols', items: [
            { sym: 'H', name: 'Hadamard', desc: 'creates equal superpositions' },
            { sym: 'CNOT', name: 'controlled-NOT', desc: 'control qubit $|1\\rangle $ triggers X on the target' },
            { sym: 'depth', name: 'circuit depth', desc: 'number of sequential gate layers — severely limited today' }
          ] },
          { type: 'flip', front: 'Solovay–Kitaev theorem', back: 'any unitary is efficiently approximated by a finite gate set — the foundation of quantum universality' },
          { type: 'quiz', question: {
            prompt: 'To prepare the Bell state $|\\Phi^{+}\\rangle $ starting from $|00\\rangle $ you apply…',
            options: [
              'H on one qubit, then a CNOT',
              'a CNOT, then an X gate',
              'X gates on both qubits',
              'H on both qubits'
            ],
            answer: 0,
            explain: 'The Hadamard creates a superposition on the control; the CNOT then correlates the target — yielding $\\frac{|00\\rangle +|11\\rangle }{\\sqrt{2.}}$'
          } },
          { type: 'reflect', prompt: 'Explain it back — in one or two sentences, what was "Gate-Model Quantum Computing" really about?', model: 'Say the main idea, name the key formula or concept, and give one reason it matters. If any of the three felt fuzzy, re-scan the sections above before moving on.' }
        ]
      },
      {
        id: 'l2', part: 'Hardware',
        title: 'Hardware: Superconductors, Ions & Photons',
        videoId: 'l06HATJAbdI',
        videoTitle: 'QML 17 — Implementations',
        sections: [
          { type: 'text', body: 'How do you actually build these machines? Three leading candidates. **Superconducting circuits** reuse silicon fabrication (the same fabs as your phone), cool to $\\sim 10$ mK in a massive fridge, and steer qubits with **microwave pulses** — nanosecond control, very fast.' },
          { type: 'points', items: [
            'Superconducting wafer = **2D layout**: up to $\\sim 4$ qubits can be fully connected, then wires can no longer cross — connectivity dies',
            'Missing links force the compiler to insert **SWAP gates** (3 CNOTs each) — one logical gate can cost $\\sim 7$ physical ones, devastating when depth is capped at $\\sim 10$–20',
            'Short **coherence times** plus a half-million-dollar fridge per machine: real engineering bottlenecks',
            '**Trapped ions**: superb long coherence, laser control — but slower gates and unclear scaling past $\\sim 70$ qubits',
            '**Photonics**: room-temperature, polarization qubits — but photons are lost in flight and cannot be stored'
          ] },
          { type: 'symbols', items: [
            { sym: 'SWAP', name: 'swap gate', desc: 'exchanges two qubits — costs 3 CNOTs' },
            { sym: 'mK', name: 'millikelvin', desc: 'operating temperature of superconducting qubits' },
            { sym: 'connectivity', name: 'qubit graph', desc: 'which pairs of qubits can interact directly' }
          ] },
          { type: 'flip', front: 'Why SWAPs hurt', back: 'limited connectivity $\\to $ one logical two-qubit gate may cost $\\sim 7$ physical gates — depth is precious' },
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
          } },
          { type: 'reflect', prompt: 'Explain it back — in one or two sentences, what was "Hardware: Superconductors, Ions & Photons" really about?', model: 'Say the main idea, name the key formula or concept, and give one reason it matters. If any of the three felt fuzzy, re-scan the sections above before moving on.' }
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
        id: 'l1', part: 'Annealing',
        title: 'Adiabatic Quantum Computing',
        videoId: 'csgEVurrBpU',
        videoTitle: 'QML 15 — Adiabatic Quantum Computing',
        sections: [
          { type: 'text', body: 'Hamiltonians describe **energy**, unitaries describe **evolution** — and the Schrödinger equation ties them together. For a time-independent Hamiltonian, evolution over duration t is exactly the unitary $e^{-iHt}$: every gate has an underlying Hamiltonian, and H being **Hermitian** is precisely why $e^{-iHt}$ is unitary.' },
          { type: 'equation', body: '$|\\psi(t)\\rangle  = e^{-iHt}|\\psi(0)\\rangle $', desc: 'time-independent Schrödinger evolution — Hamiltonian generates the unitary' },
          { type: 'equation', body: '$H(t) = (1-t)H_{0} + tH_{1},\\quad \\mathrm{runtime}  \\propto  \\frac{1}{\\Delta^{2}_{\\mathrm{min}}}$', desc: 'adiabatic path from an easy Hamiltonian to the problem Hamiltonian' },
          { type: 'points', items: [
            'Start in the ground state of an easy $H_{0}$ (a transverse field $\\to $ the equal superposition)',
            'Morph slowly toward the problem $H_{1}$ (e.g. an Ising model): the **adiabatic theorem** keeps you in the instantaneous ground state',
            'Read out the final state — the **global** optimum, not a local trap',
            'Catch: the **speed limit** is set by the minimum gap $\\Delta$ between ground and first excited state — hard instances have tiny gaps, so NP-hard problems still take exponential time',
            'Universal adiabatic QC needs both $\\sigma_{z}\\sigma_{z} **$and** $\\sigma_{x}\\sigma_{x}$ couplings'
          ] },
          { type: 'symbols', items: [
            { sym: '$H_{0}$', name: 'driver Hamiltonian', desc: 'easy starting Hamiltonian with a known ground state' },
            { sym: '$H_{1}$', name: 'problem Hamiltonian', desc: 'encodes the optimization to solve' },
            { sym: '$\\Delta$', name: 'energy gap', desc: 'ground-to-first-excited spacing — sets the speed limit' }
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
            explain: 'Runtime scales like $\\frac{1}{\\Delta^{2}_{\\mathrm{min}}}$. Hard instances have near-degenerate gaps, so the promised speedup evaporates on exactly the cases you care about.'
          } },
          { type: 'reflect', prompt: 'Explain it back — in one or two sentences, what was "Adiabatic QC & Quantum Annealing" really about?', model: 'Say the main idea, name the key formula or concept, and give one reason it matters. If any of the three felt fuzzy, re-scan the sections above before moving on.' }
        ]
      },
      {
        id: 'l2', part: 'Annealing',
        title: 'Quantum Annealing & Minor Embedding',
        videoId: '7btX7OuR2QM',
        videoTitle: 'QML 16 — Quantum Annealing',
        sections: [
          { type: 'text', body: 'Computing the minimum gap is itself intractable — so **quantum annealing** drops the guarantee: anneal fast, repeat $\\sim 1000$ times $(\\approx 50 ms)$, collect the configurations and keep the lowest energy. No promise of the true ground state, but often better than classical heuristics — and clever tricks can bound how far you are from optimal.' },
          { type: 'points', items: [
            'Even restricted to classical Ising/QUBO the model is useful — those problems are NP-hard',
            'D-Wave’s 2000-qubit **superconducting annealer** runs at $\\sim 10 mK$ — finite temperature can knock you out of the ground state mid-anneal',
            'The control electronics themselves inject noise; the box sits inside a **Faraday cage**',
            'Stack: $\\mathrm{problem}  \\to  \\mathrm{QUBO} $/Ising $\\to  **$minor embedding** $\\to  \\mathrm{QPU} $ $\\to $ repeated anneal-and-read',
            'Hardware graphs are sparse (8-qubit unit cells with limited long-range links), so logical variables are mapped onto **chains** of strongly-coupled physical qubits that act as one'
          ] },
          { type: 'equation', body: '$\\min  E = \\sum _{ij} J_{ij}\\sigma_{i}\\sigma_{j} + \\sum _{i} h_{i}\\sigma_{i}$', desc: 'the Ising/QUBO objective the annealer samples' },
          { type: 'flip', front: 'Minor embedding', back: 'fitting the problem graph into the sparse hardware graph — chained qubits play the role of one logical variable' },
          { type: 'symbols', items: [
            { sym: '$K_{3}$', name: 'triangle graph', desc: 'needs a 2-qubit chain to embed — no triangles in the hardware' },
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
          } },
          { type: 'reflect', prompt: 'Explain it back — in one or two sentences, what was "Quantum Annealing & Minor Embedding" really about?', model: 'Say the main idea, name the key formula or concept, and give one reason it matters. If any of the three felt fuzzy, re-scan the sections above before moving on.' }
        ]
      },
      {
        id: 'l3', part: 'Sampling',
        title: 'Sampling Thermal States',
        videoId: 'VW43u8RM2qI',
        videoTitle: 'QML 19 — Sampling a Thermal State',
        sections: [
          { type: 'text', body: 'Take imperfection one step further: **accept it**. Let the system equilibrate with its environment and it lands in a **thermal state** — samples drawn from it follow a Boltzmann distribution. Whenever machine learning needs Boltzmann samples (a recurring need), equilibration becomes an algorithmic primitive.' },
          { type: 'points', items: [
            'The temperature that matters is an **effective temperature** — set by noise and device physics, not the fridge thermometer; it must be estimated',
            'Tracing out one half of a maximally entangled state gives the **maximally mixed** state = thermal state at infinite temperature',
            '**Quantum approximate thermalization** generalizes this: prepare an easy system plus an equal-size ancilla in a $|+\\rangle -like$ entangled state, trace out the ancilla $\\to $ thermal state of a simple Hamiltonian',
            'Then a QAOA-style approximate unitary drives it to the thermal state of a **target** system (e.g. an Ising model) while staying near equilibrium',
            'Works on gate-model devices too — not just annealers'
          ] },
          { type: 'equation', body: '$\\rho_{\\mathrm{th}} \\propto  e^{-H/kT}$', desc: 'thermal (Gibbs) state — the output of equilibration' },
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
          } },
          { type: 'reflect', prompt: 'Explain it back — in one or two sentences, what was "Sampling Thermal States" really about?', model: 'Say the main idea, name the key formula or concept, and give one reason it matters. If any of the three felt fuzzy, re-scan the sections above before moving on.' }
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
        id: 'l1', part: 'VQA pipeline',
        title: 'QAOA: Trotterizing the Adiabatic Path',
        videoId: 'N8e5nAk6KBQ',
        videoTitle: 'QML 18 — Quantum Approximate Optimization Algorithm (QAOA)',
        sections: [
          { type: 'text', body: 'Imperfections cap circuit depth, so a new breed of algorithms was born: **variational circuits**. Run a short burst on the QPU, extract the result to a classical CPU, adjust the circuit’s parameters, repeat — an iterative hybrid loop designed for noisy hardware.' },
          { type: 'points', items: [
            '**QAOA** mimics the adiabatic pathway on a gate-model device',
            'Discretize the continuous transition into **p steps**: alternate the driver Hamiltonian ($\\sigma_{x}$, ground state = equal superposition) with the problem Hamiltonian, each for adjustable durations $\\beta \\text{ and } \\gamma$',
            'This discretization is **Trotterization** — more steps p means a better approximation of the true path',
            'End of the circuit $\\approx $ ground state of the target system — same read-out as an annealer',
            'The parameters $\\beta, \\gamma$ are tuned by **classical gradient descent** to minimize the measured energy'
          ] },
          { type: 'equation', body: '$U(\\beta,\\gamma) \\approx  \\prod _{k=1}^{p} e^{-i\\beta_{k}H_{0}} e^{-i\\gamma_{k}H_{1}}$', desc: 'the QAOA ansatz — a Trotterized adiabatic transition' },
          { type: 'flip', front: 'The variational loop', back: 'QPU prepares the state $\\to $ CPU evaluates the cost $\\to $ classical optimizer updates parameters $\\to $ repeat' },
          { type: 'symbols', items: [
            { sym: 'p', name: 'Trotter depth', desc: 'number of alternating layers — controls accuracy' },
            { sym: '$\\beta, \\gamma$', name: 'variational angles', desc: 'durations of driver / problem evolution per step' }
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
          } },
          { type: 'reflect', prompt: 'Explain it back — in one or two sentences, what was "Variational Circuits & QAOA" really about?', model: 'Say the main idea, name the key formula or concept, and give one reason it matters. If any of the three felt fuzzy, re-scan the sections above before moving on.' }
        ]
      },
      {
        id: 'l2', part: 'Quantum simulation',
        title: 'Quantum Simulation — Feynman’s Idea',
        videoId: 'bVymBcvE7BA',
        videoTitle: 'QML 20 — Variational Circuits and Quantum Simulation 1 (Alan Aspuru-Guzik)',
        sections: [
          { type: 'text', body: 'Guest lectures by **Alan Aspuru-Guzik**. It begins with **Feynman (1982)**: quantum devices — simulators — could efficiently simulate natural quantum phenomena. Map the wavefunction $|\\psi\\rangle _{S}$ of the system you care about onto $|\\psi\\rangle _{QS}$ of a controllable quantum system; matching evolutions make their observables indistinguishable.' },
          { type: 'points', items: [
            '**Seth Lloyd** made it rigorous: simulating *natural* Hamiltonians is efficient on a quantum computer',
            'A **k-local** Hamiltonian has terms acting on at most k qubits — interactions stay local',
            'A Hamiltonian is just an **energy cost function**: a sum of L terms, and for natural systems L scales polynomially in n',
            'Polynomial term count + locality is exactly what makes simulation efficient — via Trotterization, the same trick as QAOA'
          ] },
          { type: 'equation', body: '$U(t) = e^{-iHt},\\quad H = \\sum _{l=1}^{L} H_{l}$', desc: 'simulate by exponentiating a k-local Hamiltonian' },
          { type: 'symbols', items: [
            { sym: 'k-local', name: 'locality bound', desc: 'each term touches $\\leq  k$ qubits' },
            { sym: 'L', name: 'term count', desc: 'number of energy contributions — polynomial in n' },
            { sym: '$|\\psi\\rangle _{QS}$', name: 'simulator state', desc: 'the controllable quantum system standing in for nature' }
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
          } },
          { type: 'reflect', prompt: 'Explain it back — in one or two sentences, what was "Quantum Simulation — Feynman’s Idea" really about?', model: 'Say the main idea, name the key formula or concept, and give one reason it matters. If any of the three felt fuzzy, re-scan the sections above before moving on.' }
        ]
      },
      {
        id: 'l3', part: 'VQA pipeline',
        title: 'Simulating Molecules',
        videoId: 'abB2zwLCmW4',
        videoTitle: 'QML 21 — Variational Circuits and Quantum Simulation 2 (Alan Aspuru-Guzik)',
        sections: [
          { type: 'text', body: 'Why simulate? Exactly computing molecules and materials could unlock new **catalysts, drugs and materials**. The mapping: molecular orbitals $\\to $ qubits. Each orbital may hold a spin-up or spin-down electron — so $H_{2}$’s two orbitals (bonding + antibonding) need about 4 qubits.' },
          { type: 'points', items: [
            'The molecular Hamiltonian has **$O(n^{4})$ terms** — every combination of orbitals contributes',
            '**One-electron integrals**: single-electron hopping — kinetic energy vs attraction to a nucleus (2-local in the fermionic sense)',
            '**Two-electron integrals**: electron–electron repulsion — pairs jumping between orbitals (4-local)',
            'Fermionic **creation/annihilation operators** shuffle electrons between orbitals',
            'Fermions are **indistinguishable**, qubits are distinguishable — the **Jordan–Wigner transformation** maps fermionic algebra onto qubit gates',
            'Early cost estimates $\\sim n^{6}$ $\\to $ millions of gates (error correction needed); work by Babbush and others pushed scaling toward $\\sim $linear'
          ] },
          { type: 'equation', body: '$H = \\sum _{pq} h_{pq} a^{\\dagger}_{p} a_{q} + \\sum _{pqrs} h_{pqrs} a^{\\dagger}_{p} a^{\\dagger}_{q} a_{r} a_{s}$', desc: 'electronic-structure Hamiltonian in fermionic operators' },
          { type: 'symbols', items: [
            { sym: '$a^{\\dagger}$', name: 'creation operator', desc: 'adds an electron to an orbital' },
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
          } },
          { type: 'reflect', prompt: 'Explain it back — in one or two sentences, what was "Simulating Molecules" really about?', model: 'Say the main idea, name the key formula or concept, and give one reason it matters. If any of the three felt fuzzy, re-scan the sections above before moving on.' }
        ]
      },
      {
        id: 'l4', part: 'VQA pipeline',
        title: 'Hybrid Algorithms & the Variational Principle',
        videoId: 'qN0UdJda1a4',
        videoTitle: 'QML 22 — Variational Circuits and Quantum Simulation 3 (Alan Aspuru-Guzik)',
        sections: [
          { type: 'text', body: 'Welcome to the **NISQ era** (Preskill: noisy intermediate-scale quantum). The hybrid recipe treats the quantum computer like a lime in a Mexican restaurant — squeeze it for state preparation, offload everything hard to the classical controller, as if the QPU were a GPU. QAOA (Farhi) and the **variational quantum eigensolver** arrived almost simultaneously — the first hybrid quantum–classical algorithms.' },
          { type: 'points', items: [
            'Define a parametrized circuit — a **stencil** of gates whose parameter vector $\\lambda$ has M components',
            'Loop: prepare state $\\to $ measure the Hamiltonian (energy$) \\to $ classical optimizer picks $\\lambda$ to **lower the energy*$^{*} \\to $ repeat — much like training a neural network',
            'Same family: quantum classifiers, the variational error corrector, variational autoencoders and generators',
            'Open problem (McClean et al.): as M grows the landscape develops **barren plateaus** — gradients vanish, so good classical initial guesses matter',
            'Lecture 23 (captions unavailable) continues with the **variational principle** — the engine of VQE'
          ] },
          { type: 'equation', body: '$E(\\lambda) = \\langle \\psi(\\lambda)|H|\\psi(\\lambda)\\rangle  \\geq  E_{0}$', desc: 'variational principle: any trial state’s energy upper-bounds the true ground energy — minimize $E(\\lambda)$ to approach $E_{0}$' },
          { type: 'symbols', items: [
            { sym: '$\\lambda$', name: 'parameter vector', desc: 'M tunable angles in the circuit stencil' },
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
            explain: 'The QPU prepares and measures states; the CPU runs the optimizer that updates $\\lambda$ — offloading hard arithmetic to the side that does it best.'
          } },
          { type: 'reflect', prompt: 'Explain it back — in one or two sentences, what was "Hybrid Algorithms & the Variational Principle" really about?', model: 'Say the main idea, name the key formula or concept, and give one reason it matters. If any of the three felt fuzzy, re-scan the sections above before moving on.' }
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
        id: 'l1', part: 'Encoding',
        title: 'Basis & Amplitude Encoding',
        videoId: 'LHzWAyT5rMI',
        videoTitle: 'QML 24 — Encoding Classical Information',
        sections: [
          { type: 'text', body: 'Whatever the paradigm, you must first answer: **how do I load classical information into a quantum system?** The simplest option is **basis encoding** — exactly what a digital computer does. The number 3 becomes binary 11, which becomes the state $|11\\rangle $; vectors concatenate into longer bit strings.' },
          { type: 'points', items: [
            'Basis encoding **pro**: trivial preparation — flip a few qubits with X gates from the all-zero initial state',
            'Basis encoding **con**: wasteful — floating-point data eats enormous qubit counts',
            '**Amplitude encoding**: a normalized vector’s entries become the amplitudes — a d-dimensional vector fits in $\\sim \\log _{2}d$ qubits at effectively infinite precision',
            'Amplitude encoding **con**: state preparation can be deep and hard, and reading the values back out requires **tomography**'
          ] },
          { type: 'equation', body: '$x = (x_{1},\\dots ,x_{d}), \\|x\\|=1\\quad \\to \\quad |x\\rangle  = \\sum _{i} x_{i}|i\\rangle $', desc: 'amplitude encoding — d numbers compressed into $\\lceil \\log _{2}d\\rceil $ qubits' },
          { type: 'symbols', items: [
            { sym: '$|i\\rangle $', name: 'basis label', desc: 'computational basis state indexing amplitude i' },
            { sym: 'X', name: 'preparation gate', desc: 'basis encoding needs only bit flips' },
            { sym: '$\\log _{2}d$', name: 'qubit count', desc: 'exponential compression of amplitude encoding' }
          ] },
          { type: 'flip', front: '3 in basis encoding', back: 'binary $11 \\to  |11\\rangle $ — two qubits, two X gates' },
          { type: 'quiz', question: {
            prompt: 'Amplitude-encoding a d-dimensional vector requires roughly…',
            options: ['$\\log _{2}(d)$ qubits', 'd qubits', '$d^{2}$ qubits', 'one qubit per bit of precision'],
            answer: 0,
            explain: 'The vector entries ride on d basis states of $\\sim \\log _{2}d$ qubits — exponential compression, at the price of hard state preparation and readout.'
          } },
          { type: 'reflect', prompt: 'Explain it back — in one or two sentences, what was "Encoding Classical Information" really about?', model: 'Say the main idea, name the key formula or concept, and give one reason it matters. If any of the three felt fuzzy, re-scan the sections above before moving on.' }
        ]
      },
      {
        id: 'l2', part: 'Encoding',
        title: 'Hamiltonian Encodings',
        videoId: 'LHzWAyT5rMI',
        videoTitle: 'QML 24 — Encoding Classical Information',
        sections: [
          { type: 'text', body: 'The second family encodes the **problem itself** into a Hamiltonian — in two flavors. **Ising encoding**: couplings $J_{ij}$ and biases $h_{i}$ carry your problem — this is what quantum annealers solve. **Hamiltonian simulation**: implement $e^{-iHt}$ on a gate-model device — QAOA approximates the adiabatic path this way, and quantum matrix inversion encodes the matrix to invert inside H.' },
          { type: 'points', items: [
            'Ising encoding **pro**: implemented at thousands of qubits today',
            'Ising encoding **con**: limited scope — optimization and sampling problems only',
            'Simulation **pro**: encoding a matrix in H is natural — the basis of quantum matrix inversion',
            'Simulation **con**: long lists of conditions (sparsity, conditioning, preparation) — mostly limited to idealized, large-scale machines'
          ] },
          { type: 'equation', body: '$H = \\sum _{ij} J_{ij}\\sigma_{i}\\sigma_{j} + \\sum _{i} h_{i}\\sigma_{i}\\quad \\to \\quad U = e^{-iHt}$', desc: 'problem in the couplings — or simulate H as a unitary' },
          { type: 'symbols', items: [
            { sym: '$J_{ij}$', name: 'coupling weights', desc: 'carry the problem structure in Ising encoding' },
            { sym: '$h_{i}$', name: 'bias terms', desc: 'per-variable fields — also part of the encoding' },
            { sym: '$e^{-iHt}$', name: 'simulated unitary', desc: 'Hamiltonian-simulation encoding' }
          ] },
          { type: 'flip', front: 'Two Hamiltonian encodings', back: 'Ising problem Hamiltonian (annealing/QUBO) vs Hamiltonian simulation $e^{-iHt}$ (gate model, QAOA, matrix inversion)' },
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
          } },
          { type: 'reflect', prompt: 'Explain it back — in one or two sentences, what was "Hamiltonian Encodings" really about?', model: 'Say the main idea, name the key formula or concept, and give one reason it matters. If any of the three felt fuzzy, re-scan the sections above before moving on.' }
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
        id: 'l1', part: 'QML methods',
        title: 'Ensembles & QBoost',
        videoId: 'TjVEfusNfVg',
        videoTitle: 'QML 25 — Ensemble Learning',
        sections: [
          { type: 'text', body: 'Supervised learning fits a conditional distribution $P$(label | data); deep learning excels at exactly this — but its **continuous optimization** over millions of 32-bit weights is a poor fit for $\\sim 2000$-qubit machines. We need a discrete formulation. **Ensembles** provide it: combine K trained models into one stronger predictor — the approach that wins Kaggle competitions.' },
          { type: 'points', items: [
            '**AdaBoost**: grows the ensemble sequentially, weighting each new model by its share of the **exponential loss**',
            'No regularization $\\to $ every candidate ends up in the ensemble, even useless or correlated predictors',
            'Modern descendants: **XGBoost** and gradient-boosted trees — still industry workhorses',
            '**QBoost**: square loss + an **L0 penalty** on the weight vector — $\\lambda$ controls how many models survive',
            'Discretize the weights (a few bits suffice — only relative importance matters$) \\to $ a quadratic binary problem $\\to  **$Ising Hamiltonian*$^{*} \\to $ annealer or QAOA'
          ] },
          { type: 'equation', body: '$L = \\sum _{i} (\\sum _{k} w_{k}c_{k}(x_{i}) - y_{i})^{2} + \\lambda\\|w\\|_{0}$', desc: 'QBoost objective — square loss plus sparsity; expanding the square yields model–model couplings and model–label biases' },
          { type: 'symbols', items: [
            { sym: '$w_{k}$', name: 'ensemble weight', desc: 'importance of model k — discretized to a few bits' },
            { sym: '$c_{k}(x)$', name: 'weak predictor', desc: 'output of the k-th pretrained model' },
            { sym: '$\\lambda$', name: 'regularization strength', desc: 'larger $\\lambda$ $\\to $ sparser ensemble' }
          ] },
          { type: 'flip', front: '$\\|w\\|_{0}$ (zero norm)', back: 'counts the nonzero weights — penalizing it prunes redundant models from the ensemble' },
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
          } },
          { type: 'reflect', prompt: 'Explain it back — in one or two sentences, what was "QML Methods: Ensembles, Kernels & PGMs" really about?', model: 'Say the main idea, name the key formula or concept, and give one reason it matters. If any of the three felt fuzzy, re-scan the sections above before moving on.' }
        ]
      },
      {
        id: 'l2', part: 'QML methods',
        title: 'Clustering by Quantum Optimization',
        videoId: '7MDwycGSiy0',
        videoTitle: 'QML 27 — Clustering by Quantum Optimization',
        sections: [
          { type: 'text', body: '**Unsupervised learning** remains hard even for deep learning — a promising beachhead for QML. In clustering, no labels are given: you must discover groups of points that belong together. **k-means** works when clusters are round blobs near a centroid — and fails when the structure is **density and topology**.' },
          { type: 'points', items: [
            'Compute the **Gram/distance matrix** $W_{ij}$ over all pairs — a symmetric matrix defining a weighted graph',
            'Clustering = **MaxCut**: partition the graph so the total edge weight crossing the cut is **maximal** — a global criterion, not a local heuristic',
            'Assign a spin $\\sigma_{i} = \\pm 1$ to each point labeling which side of the cut it lands on',
            'The cut cost rewrites as an **Ising energy** — feed it to an annealer or QAOA',
            'This finds two maximally separated clusters respecting the global topology — where k-means would fail'
          ] },
          { type: 'equation', body: '$\\mathrm{cut}  = \\tfrac{1}{4} \\sum _{ij} W_{ij} (1 - \\sigma_{i}\\sigma_{j})$', desc: 'MaxCut objective — points on opposite sides contribute their distance' },
          { type: 'symbols', items: [
            { sym: '$W_{ij}$', name: 'edge weight', desc: 'distance/similarity between data points i and j' },
            { sym: '$\\sigma_{i}$', name: 'cluster label', desc: '$-1$ for partition $V_{1}, +1 \\text{ for } V_{2}$' },
            { sym: '$V_{1}, V_{2}$', name: 'partitions', desc: 'the two clusters separated by the cut' }
          ] },
          { type: 'flip', front: 'Why MaxCut $\\approx $ clustering', back: 'maximizing the weight crossing the cut splits the graph into the two most distant groups' },
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
          } },
          { type: 'reflect', prompt: 'Explain it back — in one or two sentences, what was "Clustering by Quantum Optimization" really about?', model: 'Say the main idea, name the key formula or concept, and give one reason it matters. If any of the three felt fuzzy, re-scan the sections above before moving on.' }
        ]
      },
      {
        id: 'l3', part: 'Kernels',
        title: 'Kernels & the Interference Circuit',
        videoId: 'HILVRvDaQsE',
        videoTitle: 'QML 28 — Kernel Methods',
        sections: [
          { type: 'text', body: '**Kernel methods** (huge from the mid-90s until deep learning took over) perform a nonlinear embedding **implicitly**. Data that is not linearly separable — one class nested inside another — can be pulled apart in a higher-dimensional feature space where a simple **hyperplane** suffices.' },
          { type: 'points', items: [
            'The **kernel trick**: replace the inner product with a kernel function $K(x,x^{\\prime})$ — you never need the embedding itself, only pairwise kernel values',
            'Requirement: the kernel/Gram matrix must be **positive semi-definite**',
            'Examples: **kernelized k-means** with an exponential-decay (Gaussian) distance, and **support vector machines** — sparse, well-generalizing models',
            'They faded because they are **shallow** — no learned feature hierarchies — but quantum computers evaluate some kernels naturally',
            '**Interference circuit**: amplitude-encode test and training data into registers (data qubit, ancilla, index, class qubit); the ancilla’s two branches hold test vs train states; a Hadamard on the ancilla **interferes** them; postselecting on the ancilla outcome yields kernel-valued probabilities'
          ] },
          { type: 'equation', body: '$K(x,x^{\\prime}) = \\langle \\varphi(x), \\varphi(x^{\\prime})\\rangle $', desc: 'a kernel is an inner product in feature space' },
          { type: 'symbols', items: [
            { sym: '$\\varphi$', name: 'feature map', desc: 'the (never computed) nonlinear embedding' },
            { sym: 'K', name: 'kernel / Gram matrix', desc: 'pairwise similarities of all data points' },
            { sym: '$e^{-\\gamma\\|x-x^{\\prime}\\|^{2}}$', name: 'Gaussian kernel', desc: 'exponential decay over Euclidean distance' }
          ] },
          { type: 'flip', front: 'Kernel trick', back: 'get the effect of a high-dimensional embedding by evaluating only $K(x,x^{\\prime})$ — $\\varphi$ itself never materializes' },
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
          } },
          { type: 'reflect', prompt: 'Explain it back — in one or two sentences, what was "Kernels & the Interference Circuit" really about?', model: 'Say the main idea, name the key formula or concept, and give one reason it matters. If any of the three felt fuzzy, re-scan the sections above before moving on.' }
        ]
      },
      {
        id: 'l4', part: 'Kernels',
        title: 'Quantum-Enhanced Kernels (Schuld)',
        videoId: 'uDAAi5aQbMU',
        videoTitle: 'QML 32 — Quantum-Enhanced Kernel Methods 1 (Maria Schuld)',
        sections: [
          { type: 'text', body: 'Guest lectures by **Maria Schuld**. Kernels are similarity measures; formally, K is a kernel iff every Gram matrix built from it is **positive semi-definite**. The bridge to quantum theory: inner products of feature vectors are always valid kernels — and quantum states live in an inner-product space.' },
          { type: 'points', items: [
            'A data-encoding circuit $S(x)$ prepares $|\\varphi(x)\\rangle $ — a **quantum feature map**; the overlap $\\langle \\varphi(x^{\\prime})|\\varphi(x)\\rangle  \\text{ is } a **$quantum kernel**',
            'Overlap circuit: ancilla + Hadamard, condition $S(x) \\text{ and } S(x^{\\prime})$ on the ancilla branches, second H, measure — $P(0) = \\tfrac{1}{2} + \\tfrac{1}{2} \\mathrm{Re} \\langle \\varphi(x^{\\prime})|\\varphi(x)\\rangle $',
            'Encodings $\\to $ kernels: basis encoding gives a **Dirac** exact-match kernel; amplitude encoding gives the **linear** kernel; repeating it d times gives a **polynomial** kernel $(x^{T}x^{\\prime})$ᵈ; photonic **squeezing** gives tunable kernels',
            'Use the quantum device as a **kernel co-processor** feeding a classical SVM — a true hybrid',
            'Variational twists: train a parametrized circuit after the feature map (measure $\\langle \\sigma_{z}\\rangle $ as the prediction), or **learn the kernel itself**',
            'Entangle the dataset with an index register and the resulting density matrix **is** the kernel Gram matrix — enabling quantum linear algebra like inversion for least-squares SVMs'
          ] },
          { type: 'equation', body: '$\\kappa(x,x^{\\prime}) = \\langle \\varphi(x)|\\varphi(x^{\\prime})\\rangle  = \\langle 0|S^{\\dagger}(x^{\\prime})S(x)|0\\rangle $', desc: 'the quantum kernel as an overlap of encoded states' },
          { type: 'equation', body: '$P(\\mathrm{ancilla}  = 0) = \\tfrac{1}{2} + \\tfrac{1}{2} \\mathrm{Re} \\langle \\varphi(x^{\\prime})|\\varphi(x)\\rangle $', desc: 'the interference circuit reads out the overlap' },
          { type: 'symbols', items: [
            { sym: '$S(x)$', name: 'encoding circuit', desc: 'maps input x to quantum feature state $|\\varphi(x)\\rangle $' },
            { sym: '$K_{ij}$', name: 'Gram matrix', desc: '$\\kappa(x_{i},x_{j})$ for all training pairs' },
            { sym: '$\\langle \\sigma_{z}\\rangle $', name: 'readout', desc: 'expectation value used as a classifier prediction' }
          ] },
          { type: 'flip', front: 'Quantum feature map', back: 'any data-encoding circuit defines a feature vector $|\\varphi(x)\\rangle $ — and therefore a kernel' },
          { type: 'quiz', question: {
            prompt: 'Basis-encoding two identical bit strings and computing their overlap gives kernel value…',
            options: [
              '1 — identical states; different strings give 0 (a Dirac-like kernel)',
              '$\\tfrac{1}{2}$',
              'it depends on the ancilla outcome',
              'undefined — basis encoding has no kernel'
            ],
            answer: 0,
            explain: 'Basis states are orthonormal: $\\langle x|x^{\\prime}\\rangle  \\text{ is } 1$ only when the strings match exactly — a harsh but valid kernel.'
          } },
          { type: 'reflect', prompt: 'Explain it back — in one or two sentences, what was "Quantum-Enhanced Kernels (Schuld)" really about?', model: 'Say the main idea, name the key formula or concept, and give one reason it matters. If any of the three felt fuzzy, re-scan the sections above before moving on.' }
        ]
      },
      {
        id: 'l5', part: 'QML methods',
        title: 'Graphical Models & Gaussian Processes',
        videoId: 'DdWH2j6P8f0',
        videoTitle: 'QML 30 — Probabilistic Graphical Models',
        sections: [
          { type: 'text', body: 'Some tasks stay hard for deep learning — precisely the QML pitch. **Probabilistic graphical models** capture the dependency structure between random variables: directed graphs give **Bayesian networks** (grass wet $\\to $ was it rain or the sprinkler?), undirected ones give **Markov networks**.' },
          { type: 'points', items: [
            '**Conditional independence**: $X \\bot  Y$ | Z iff $P(x,y|z) = P(x|z)P(y)$|z) — the graph encodes these independencies',
            'Markov networks assign **energy functions to cliques** ($K_{1}$ nodes, $K_{2}$ edges, $K_{3}$ triangles); the joint distribution factorizes over cliques — Boltzmann-shaped, like a thermal state',
            'The **Ising model** is the special case of binary variables and $K_{2}$ cliques; a **Boltzmann machine** splits spins into visible and hidden, marginalizing the hidden ones',
            'Queries are hard: **most probable explanation** and **marginal MAP** are NP-hard even after training',
            'Remedy: approximate inference by sampling — classical MCMC (burn-in, correlated draws) vs **annealers or quantum approximate thermalization** sampling the Boltzmann distribution',
            '**Gaussian processes**: Bayesian regression — a distribution over functions with a kernel covariance; predictions need **matrix inversion** $(K+\\sigma^{2}I)^{-1}$ twice — plug in quantum matrix inversion; choose a decaying covariance for sparsity and tune noise for conditioning'
          ] },
          { type: 'equation', body: '$P(x) \\propto  \\prod _{C} e^{-E_{C}(x_{C})}$', desc: 'a Markov network factorizes over cliques — the same shape as a thermal state' },
          { type: 'symbols', items: [
            { sym: 'MPE', name: 'most probable explanation', desc: 'argmax of the unobserved variables given evidence' },
            { sym: 'K_c', name: 'clique', desc: 'complete subgraph carrying an energy function' },
            { sym: '$\\sigma^{2}$', name: 'noise variance', desc: 'diagonal offset that improves matrix conditioning' }
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
          } },
          { type: 'reflect', prompt: 'Explain it back — in one or two sentences, what was "Graphical Models & Gaussian Processes" really about?', model: 'Say the main idea, name the key formula or concept, and give one reason it matters. If any of the three felt fuzzy, re-scan the sections above before moving on.' }
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
        id: 'l1', part: 'Algorithms',
        title: 'Quantum Fourier Transform',
        videoId: 'rtDC-j4Uw0A',
        videoTitle: 'QML 35 — Quantum Fourier Transform',
        sections: [
          { type: 'text', body: 'This module assumes **coherent protocols**: near-perfect, large-scale quantum computers where polynomial or exponential speedups live. A crucial twist — inputs and outputs are **quantum states**: if state preparation or tomography costs more than the algorithm saves, the advantage evaporates.' },
          { type: 'points', items: [
            'Classically, the Fourier transform maps a time-domain vector into the **frequency domain**',
            'The **QFT** applies the same transform to the **amplitudes** of a quantum state — amplitudes of $|x\\rangle $ become Fourier coefficients',
            'Assume $N = 2^{n}$; rewriting the phase factors via **binary expansion** factorizes the transform into a product over qubits',
            'The result: a clean circuit of **conditional rotations** — simple structure, but resource-heavy: many qubits and gates, beyond shallow NISQ devices',
            'It converts between amplitude and basis encodings — a workhorse primitive for bigger algorithms'
          ] },
          { type: 'equation', body: '$\\mathrm{QFT} |x\\rangle  = (\\frac{1}{\\sqrt{N}}) \\sum _{k} e^{2\\pi ixk/N}|k\\rangle $', desc: 'the discrete Fourier transform applied to amplitudes' },
          { type: 'symbols', items: [
            { sym: '$N = 2^{n}$', name: 'dimension', desc: 'amplitude vector lives on n qubits' },
            { sym: '$e^{2\\pi ixk/N}$', name: 'phase factor', desc: 'the complex root-of-unity weighting each basis state' },
            { sym: '$\\mathrm{QFT} ^{\\dagger}$', name: 'inverse QFT', desc: 'reads phase patterns back into registers' }
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
          } },
          { type: 'reflect', prompt: 'Explain it back — in one or two sentences, what was "Quantum Algorithms for Learning" really about?', model: 'Say the main idea, name the key formula or concept, and give one reason it matters. If any of the three felt fuzzy, re-scan the sections above before moving on.' }
        ]
      },
      {
        id: 'l2', part: 'Algorithms',
        title: 'Phase Estimation & the HHL Overview',
        videoId: 'tFQS9QvK-tE',
        videoTitle: 'QML 36 — Quantum Phase Estimation',
        sections: [
          { type: 'text', body: 'Given a unitary U and its eigenvector $|u\\rangle $, we have $U|u\\rangle  = e^{2\\pi i\\theta}|u\\rangle $ — eigenvalues of unitaries lie on the complex unit circle. **Quantum phase estimation** reads out the phase $\\theta$ to n bits of precision.' },
          { type: 'points', items: [
            'Two registers: an n-qubit **precision register** (will hold $\\theta$) and a register holding the eigenvector',
            'Apply controlled-$U^{2^{0}}, U^{2^{1}}, \\dots , U^{2^{n-1}}$ in superposition — each control bit triggers a differently-powered U',
            '**Phase kickback**: the eigenvalue phase lands in the control register as a Fourier-pattern phase',
            'The pattern is exactly a $\\mathrm{QFT}  \\text{ of } \\theta$ — apply the **inverse QFT** to write $\\theta$ into the register',
            '**HHL** (matrix inversion) builds directly on this: encode b as amplitudes, A as a Hamiltonian, phase-estimate eigenvalues, rotate inverses into an ancilla, uncompute, rejection-sample',
            'Resource estimate mirrors Shor’s algorithm: $\\sim 4000$ logical qubits $\\to $ millions of physical — far beyond today’s <100-qubit devices'
          ] },
          { type: 'equation', body: '$U|u\\rangle  = e^{2\\pi i\\theta}|u\\rangle $', desc: 'phase estimation recovers $\\theta$ — the eigenvalue angle' },
          { type: 'symbols', items: [
            { sym: '$\\theta$', name: 'phase', desc: 'the eigenvalue angle being estimated' },
            { sym: '$c-U^{2^{k}}$', name: 'controlled powers', desc: 'each precision qubit gates a different power of U' },
            { sym: '$\\mathrm{QFT} ^{\\dagger}$', name: 'inverse QFT', desc: 'translates the kicked-back phase into readable bits' }
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
            explain: 'Tracing out entangled registers collapses the ancilla’s coherent amplitude — the $\\frac{1}{\\lambda}$ information would be destroyed. Uncomputing disentangles them cleanly.'
          } },
          { type: 'reflect', prompt: 'Explain it back — in one or two sentences, what was "Phase Estimation & the HHL Overview" really about?', model: 'Say the main idea, name the key formula or concept, and give one reason it matters. If any of the three felt fuzzy, re-scan the sections above before moving on.' }
        ]
      },
      {
        id: 'l3', part: 'Algorithms',
        title: 'Matrix Inversion & Quantum Linear Algebra',
        videoId: '24gxm-DhH2E',
        videoTitle: 'QML 38 — Quantum Matrix Inversion',
        sections: [
          { type: 'text', body: '**HHL** solves $Ax = b \\text{ as } |x\\rangle  = A^{-1}|b\\rangle $. Conditions: A must be **sparse** (few nonzero entries) and **well-conditioned** (eigenvalue ratio bounded). Non-Hermitian A can be embedded in a Hermitian block matrix of twice the size so Hamiltonian simulation applies.' },
          { type: 'points', items: [
            'After phase estimation, a **controlled rotation** on one ancilla writes $\\frac{C}{\\lambda_{i}}$ into its $|1\\rangle $ amplitude — the eigenvalue inverse is now in the state',
            '**Uncompute** everything except the ancilla, then **rejection sampling**: measure $\\mathrm{ancilla}  = 1$ and the remaining state is $\\propto  A^{-1}|b\\rangle $',
            'You get the solution only up to observables — estimate $\\langle x|M|x\\rangle $ rather than reading out x',
            '**Quantum PCA**: a density matrix is Hermitian $\\to $ exponentiate it like a Hamiltonian $\\to $ phase estimation reveals its eigenstructure',
            'Learning applications: **least-squares quantum SVM**, kernel-matrix preparation, Gaussian processes, topological data analysis',
            'Recipe: find a matrix inversion inside a classical algorithm — or reshape the algorithm so one appears',
            'Caveats: needs efficient $|b\\rangle $ preparation and **QRAM** — data loaded in superposition fast — or the exponential edge disappears'
          ] },
          { type: 'equation', body: '$|x\\rangle  \\propto  \\sum _{i} (\\frac{\\beta_{i}}{\\lambda_{i}})|u_{i}\\rangle  = A^{-1}|b\\rangle $', desc: 'the post-selected state is the solution direction of the linear system' },
          { type: 'symbols', items: [
            { sym: '$\\lambda_{i}$', name: 'eigenvalues of A', desc: 'estimated by phase estimation, then inverted' },
            { sym: '$\\kappa$', name: 'condition number', desc: 'max/min eigenvalue ratio — must be well-behaved' },
            { sym: 'C', name: 'rotation constant', desc: 'keeps the $\\frac{C}{\\lambda}$ ancilla amplitude $\\leq  1$' }
          ] },
          { type: 'flip', front: 'QRAM', back: 'a device loading classical data into superposition quickly — required for real speedups and not yet built' },
          { type: 'quiz', question: {
            prompt: 'Quantum PCA works because…',
            options: [
              'a density matrix is Hermitian, so it can be exponentiated like a Hamiltonian to reveal eigenstructure',
              'PCA is already a quantum algorithm',
              'density-matrix eigenvalues are always $\\pm 1$',
              'it requires no state preparation'
            ],
            answer: 0,
            explain: '$\\rho$ is Hermitian, so $e^{i\\rho t}$ is unitary: self-exponentiating the state lets phase estimation extract its eigenvalues — quantum principal component analysis.'
          } },
          { type: 'reflect', prompt: 'Explain it back — in one or two sentences, what was "Matrix Inversion & Quantum Linear Algebra" really about?', model: 'Say the main idea, name the key formula or concept, and give one reason it matters. If any of the three felt fuzzy, re-scan the sections above before moving on.' }
        ]
      },
      {
        id: 'l4', part: 'Algorithms',
        title: 'Seth Lloyd: The QML Vision',
        videoId: 'OstyW7c0v48',
        videoTitle: 'QML 41 — Guest lecture by Seth Lloyd',
        sections: [
          { type: 'text', body: '**Seth Lloyd** (MIT) gives two reasons quantum mechanics helps learning. First: quantum systems generate patterns no classical system can — so they may **recognize** weird patterns too. Second: classical ML is mostly **linear algebra**, and quantum mechanics is entirely linear algebra.' },
          { type: 'points', items: [
            'n qubits hold an $N = 2^{n}-\\dim $ vector: **$\\log  N$ qubits** replace N classical numbers — exponential compression',
            '**QBLAS** $vs BLAS: \\mathrm{QFT}  \\text{ in } O((\\log  N)^{2})$ vs FFT $O(N \\log  N)$; eigenvalues of sparse matrices in $\\sim (\\log  N)^{2} vs N^{2}$; matrix inversion in $\\sim (\\log  N)^{2}$',
            'A **terabyte** ($10^{12}$ numbers) amplitude-encodes onto $\\sim 40$ qubits; its Fourier transform needs $\\sim 1600$ quantum ops vs $\\sim 10^{14}$ classical',
            '**QRAM** is the enabling device — map classical data (discs, fiber pulses, capacitors) into quantum states; easier to build than a full fault-tolerant computer',
            'Applications: quantum cluster assignment, SVM hyperplanes, PCA (Netflix-style recommendations), **topological data analysis** (counting holes in data), deep quantum learning',
            'Lloyd’s prediction: QRAMs loading millions–billions of bits onto 20–30 qubits within $\\sim 5$ years'
          ] },
          { type: 'equation', body: '$\\underbrace{N}_{\\text{classical numbers}} \\to \\underbrace{\\log_{2} N}_{\\text{qubits}}$', desc: 'exponential compression — the core mechanism behind QML speedups' },
          { type: 'symbols', items: [
            { sym: 'QBLAS', name: 'quantum BLAS', desc: 'quantum versions of basic linear algebra subroutines' },
            { sym: 'PCA', name: 'principal component analysis', desc: 'find dominant axes of data — exponentially faster quantumly' },
            { sym: 'QRAM', name: 'quantum random-access memory', desc: 'classical-to-quantum data loader' }
          ] },
          { type: 'flip', front: 'Quantum weirdness for learning', back: 'systems that generate strange patterns may also recognize patterns no classical learner can' },
          { type: 'quiz', question: {
            prompt: 'A terabyte of data ($\\approx 10^{12}$ numbers) amplitude-encoded requires about…',
            options: ['40 qubits', '$10^{12}$ qubits', 'a million qubits', '4000 logical qubits'],
            answer: 0,
            explain: '$\\log _{2}(10^{12}) \\approx  40$ — the vector lives in a $2^{40}$-dimensional Hilbert space; that compression is the whole game.'
          } },
          { type: 'reflect', prompt: 'Explain it back — in one or two sentences, what was "Seth Lloyd: The QML Vision" really about?', model: 'Say the main idea, name the key formula or concept, and give one reason it matters. If any of the three felt fuzzy, re-scan the sections above before moving on.' }
        ]
      }
    ]
  },

  /* ----------------------------------------------------------
     13. QML Notation & Definitions — the symbol vocabulary
     ---------------------------------------------------------- */
  {
    id: 'c-notation',
    title: 'QML Notation & Definitions',
    subtitle: 'Every symbol in quantum machine learning, decoded',
    theme: 'symbols',
    icon: 'infinity',
    estMin: 40,
    lessons: [
      {
        id: 'l1', part: 'Dirac & states',
        title: 'Bras, Kets & Inner Products',
        sections: [
          { type: 'text', body: 'QML papers are dense with Dirac notation — and it is far simpler than it looks. A **ket** $|\\psi\\rangle$ is just a column vector holding a quantum state. A **bra** $\\langle\\psi|$ is its conjugate transpose, a row vector. Put them together facing each other — a **bra-ket** $\\langle\\varphi|\\psi\\rangle$ — and you get a complex number: the inner product, the overlap between two states.' },
          { type: 'symbols', items: (window.QML_SYMBOLS || []).filter(s => s.topic === 'math') },
          { type: 'equation', body: '$|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle,\\qquad |\\alpha|^{2} + |\\beta|^{2} = 1$', desc: 'a qubit state: amplitudes whose squared magnitudes sum to 1' },
          { type: 'predict', prompt: 'Before looking — in $\\langle\\varphi|\\psi\\rangle$, which side is the row vector?',
            options: ['The left — $\\langle\\varphi|$ is the bra', 'The right — $|\\psi\\rangle$ is the bra', 'Both are column vectors'],
            reveal: 'The **left**. $\\langle\\varphi|$ is the bra (row), $|\\psi\\rangle$ the ket (column). Row times column gives a scalar — the inner product.' },
          { type: 'flip', front: '$|\\psi\\rangle\\langle\\varphi|$', back: 'outer product — ket times bra makes a rank-1 **operator** (a matrix), not a scalar' },
          { type: 'quiz', question: {
            prompt: 'What does $\\langle\\varphi|\\psi\\rangle$ evaluate to?',
            options: ['A matrix', 'A complex scalar — the overlap of the two states', 'A probability between 0 and 1', 'A tensor product'],
            answer: 1,
            explain: 'Bra-ket is an inner product — a complex number. Squaring its magnitude, $|\\langle\\varphi|\\psi\\rangle|^{2}$, gives a probability.'
          } },
          { type: 'points', items: [
            '**$\\langle\\varphi|\\psi\\rangle$** — inner product, a complex scalar',
            '**$|\\psi\\rangle\\langle\\varphi|$** — outer product, a rank-1 operator',
            '**$|\\langle\\varphi|\\psi\\rangle|^{2}$** — squared overlap, the Born-rule probability',
            '**$e^{i\\theta}|\\psi\\rangle$** — same state: global phases are unobservable',
            '**$A^{\\dagger}$** — adjoint: conjugate transpose $(A^{*})^{T}$'
          ] },
          { type: 'reflect', prompt: 'Explain the difference between $\\langle\\varphi|\\psi\\rangle$ and $|\\psi\\rangle\\langle\\varphi|$ in one sentence.',
            model: 'Same symbols, different order: bra-ket is the inner product (a complex scalar measuring overlap); ket-bra is the outer product (a rank-1 operator that transforms states).' }
        ]
      },
      {
        id: 'l2', part: 'Dirac & states',
        title: 'Basis States, ± States & Tensor Products',
        sections: [
          { type: 'text', body: 'Single qubits live in a 2-dimensional space spanned by the **computational basis** $|0\\rangle, |1\\rangle$. Other standard bases get their own symbols: $|+\\rangle, |-\\rangle$ on the X axis and $|{+i}\\rangle, |{-i}\\rangle$ on the Y axis. To join qubits you use the **tensor product** $\\otimes$ — and some joint states, the **Bell states**, cannot be factored back into separate qubits at all. That is entanglement.' },
          { type: 'symbols', items: (window.QML_SYMBOLS || []).filter(s => ['states', 'multi'].includes(s.topic)) },
          { type: 'equation', body: '$|\\Phi^{+}\\rangle = \\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}}$', desc: 'a Bell state — perfectly correlated, maximally entangled' },
          { type: 'steps', title: 'Reading a multi-qubit ket',
            hint: 'Predict each step before revealing.',
            steps: [
              '$|00\\rangle$ is shorthand for $|0\\rangle \\otimes |0\\rangle$ — qubit 1 is 0 and qubit 2 is 0.',
              'As a vector it is $(1,0,0,0)^{T}$ — dimensions multiply under $\\otimes$: $2 \\times 2 = 4$.',
              '$\\frac{|00\\rangle+|11\\rangle}{\\sqrt{2}}$ is a superposition over two basis states.',
              'It cannot be written as $|a\\rangle \\otimes |b\\rangle$ — try it: the equations contradict. That is entanglement.'
            ] },
          { type: 'quiz', question: {
            prompt: 'What does $|+\\rangle$ denote?',
            options: ['$\\frac{|0\\rangle+|1\\rangle}{\\sqrt{2}}$ — the +1 eigenstate of X', '$|0\\rangle+|1\\rangle$ unnormalized', 'The state with all amplitudes positive', 'A two-qubit state'],
            answer: 0,
            explain: '$|+\\rangle$ is the normalized equal superposition — the $+1$ eigenstate of the Pauli X operator, produced by applying Hadamard to $|0\\rangle$.'
          } },
          { type: 'flip', front: '$|\\Psi^{-}\\rangle$', back: 'the singlet $\\frac{|01\\rangle-|10\\rangle}{\\sqrt{2}}$ — the antisymmetric Bell state, key in entanglement protocols' },
          { type: 'points', items: [
            '**$\\otimes$** tensor product — combines systems, dimensions multiply',
            '**$|00\\rangle$** — basis state of two qubits, shorthand for $|0\\rangle\\otimes|0\\rangle$',
            '**$|\\Phi^{\\pm}\\rangle, |\\Psi^{\\pm}\\rangle$** — the four Bell states',
            '**$\\sum_i \\lambda_i |a_i\\rangle|b_i\\rangle$** — Schmidt form; more than one $\\lambda_i > 0$ means entangled',
            '**$|{+i}\\rangle$** — the $+1$ eigenstate of Y, carrying a relative phase of $i$'
          ] },
          { type: 'reflect', prompt: 'Why does writing $|00\\rangle$ as $|0\\rangle\\otimes|0\\rangle$ matter — what does the symbol $\\otimes$ actually do?',
            model: 'The tensor product builds the joint state space: it multiplies dimensions, so n qubits give a $2^n$-dimensional vector. Every product state factors through it; states that cannot factor (Bell states) are entangled.' }
        ]
      },
      {
        id: 'l3', part: 'Operators & measurement',
        title: 'Gate & Operator Symbols',
        sections: [
          { type: 'text', body: 'Gates are **unitary operators** $U$ — matrices satisfying $U^{\\dagger}U = I$, which makes them reversible and norm-preserving. The Pauli trio $X, Y, Z$ are the alphabet; $H$ creates superposition; $S$ and $T$ add finer phases; controlled gates like CNOT and CZ entangle qubits. Read them right-to-left, as function composition: $HXH$ applies X, then H, then X.' },
          { type: 'symbols', items: (window.QML_SYMBOLS || []).filter(s => ['gatemodel', 'measure'].includes(s.topic)) },
          { type: 'equation', body: '$U^{\\dagger}U = I$', desc: 'the definition of a unitary — every quantum gate satisfies it' },
          { type: 'predict', prompt: 'You see $S$ and $T$ in a circuit. How do they relate to $Z$?',
            options: ['$S=\\sqrt{Z}$ and $T=\\sqrt{S}$', 'They are unrelated gates', '$S=Z^{\\dagger}$', '$T=XSX$'],
            reveal: '$S^2=Z$ and $T^2=S$: the **phase gate** S applies a phase of $i$, and T applies $e^{i\\pi/4}$. T is the one that makes the gate set universal.' },
          { type: 'quiz', question: {
            prompt: 'In $\\langle Z\\rangle = \\langle\\psi|Z|\\psi\\rangle$, what does the expression give you?',
            options: ['The norm of Z', 'The probability of outcome 1', 'The expected Z-measurement: $p(0)-p(1)$', 'The phase of the state'],
            answer: 2,
            explain: 'Sandwiching an observable between bra and ket is the expectation value — for Z it is the difference of the two outcome probabilities.'
          } },
          { type: 'flip', front: 'CNOT / CX', back: 'controlled-NOT — flips the target only when the control qubit is $|1\\rangle$; the workhorse two-qubit gate' },
          { type: 'points', items: [
            '**$\\langle A\\rangle$** — expectation value, the average measurement outcome',
            '**$\\Pi_i$** — projector: the operator for a sharp measurement outcome',
            '**$|\\langle x|\\psi\\rangle|^2$** — the Born rule: probability is a squared overlap',
            '**$n_{\\text{shots}}$** — repetitions; estimates improve like $1/\\sqrt{n}$',
            '**CCX** — Toffoli, the doubly-controlled NOT'
          ] },
          { type: 'reflect', prompt: 'What makes $U(\\theta,\\phi,\\lambda)$ special compared to $X$, $H$, or $T$?',
            model: 'It is the general parametrized single-qubit gate — any 2×2 unitary can be written that way, so it captures every possible one-qubit operation in three angles.' }
        ]
      },
      {
        id: 'l4', part: 'Operators & measurement',
        title: 'Density Matrices, Noise & Dynamics',
        sections: [
          { type: 'text', body: 'Real quantum hardware is noisy, so states are written as **density matrices** $\\rho$ — operators with $\\mathrm{Tr}\\,\\rho = 1$ that describe pure *and* mixed states. Noise acts through **quantum channels** $\\mathcal{E}$ built from Kraus operators. Dynamics come from the **Hamiltonian** $H$, the energy operator that generates time evolution $e^{-iHt/\\hbar}$.' },
          { type: 'symbols', items: (window.QML_SYMBOLS || []).filter(s => ['mixed', 'dynamics'].includes(s.topic)) },
          { type: 'equation', body: '$i\\hbar\\,\\frac{\\partial}{\\partial t}|\\psi\\rangle = H|\\psi\\rangle$', desc: 'the Schrödinger equation — $H$ drives all closed-system evolution' },
          { type: 'quiz', question: {
            prompt: 'What does $\\mathrm{Tr}(\\rho^{2})$ measure?',
            options: ['The energy of the state', 'Purity — 1 for pure states, less for mixed', 'The entanglement between qubits', 'The number of qubits'],
            answer: 1,
            explain: 'Purity equals 1 exactly when $\\rho = |\\psi\\rangle\\langle\\psi|$; anything below 1 means the state is mixed — uncertainty beyond superposition.'
          } },
          { type: 'flip', front: '$\\mathrm{Tr}_B$', back: 'partial trace — sums out subsystem B, leaving the reduced state $\\rho_A$ of A alone' },
          { type: 'points', items: [
            '**$[A,B] = AB-BA$** — the commutator; zero means compatible observables',
            '**$\\{A,B\\} = AB+BA$** — the anticommutator; distinct Paulis anticommute',
            '**$T_1, T_2$** — relaxation and dephasing times: the hardware noise budget',
            '**$S(\\rho)$** — von Neumann entropy: mixedness, or entanglement of a reduced state',
            '**$F(\\rho,\\sigma)$** — fidelity between two density matrices'
          ] },
          { type: 'predict', prompt: 'A channel is written $\\rho \\to \\sum_k K_k \\rho K_k^{\\dagger}$. What are the $K_k$?',
            options: ['Kraus operators describing the noise', 'Energy eigenvalues', 'Bell states', 'Gate angles'],
            reveal: '**Kraus operators** — any physical noise process (decoherence, bit flips, loss) can be decomposed into them. $\\sum_k K_k^{\\dagger}K_k = I$ keeps the map trace-preserving.' },
          { type: 'reflect', prompt: 'In one sentence: why does QML need $\\rho$ when $|\\psi\\rangle$ already describes a state?',
            model: 'Kets only describe pure states. Real devices suffer noise, which mixes states — and only the density-matrix language can express both the state and its mixedness, purity, entropy and channels.' }
        ]
      },
      {
        id: 'l5', part: 'QML & algorithms',
        title: 'Variational, Encoding & Algorithm Notation',
        sections: [
          { type: 'text', body: 'This is the notation you will see in every QML paper. **$\\theta$** are the trainable parameters of an **ansatz** $U(\\theta)$; a classical optimizer tunes them to minimize a **cost** $C(\\theta)$ measured as an expectation value. Data enters through a **feature map** $\\Phi(x)$ producing $|\\psi(x)\\rangle$, and models read out through kernels $K(x,x^{\\prime})$ or loss functions $\\mathcal{L}(\\theta)$. Underneath sit the big algorithms: QFT, QPE, HHL.' },
          { type: 'symbols', items: (window.QML_SYMBOLS || []).filter(s => ['vqa', 'encoding', 'mlmethods', 'annealing', 'algorithms'].includes(s.topic)) },
          { type: 'equation', body: '$\\frac{\\partial C}{\\partial\\theta} = \\frac{C(\\theta + s) - C(\\theta - s)}{2\\sin s}$', desc: 'the parameter-shift rule — exact quantum gradients from two shifted evaluations' },
          { type: 'quiz', question: {
            prompt: 'What does $K(x, x^{\\prime}) = |\\langle\\psi(x^{\\prime})|\\psi(x)\\rangle|^{2}$ define?',
            options: ['The learning rate', 'A quantum kernel — similarity between encoded data points', 'The circuit depth', 'The condition number'],
            answer: 1,
            explain: 'The kernel is the squared overlap of two data-encoding states — the similarity measure that powers quantum SVMs and kernel methods.'
          } },
          { type: 'predict', prompt: 'A paper says training failed because $\\mathrm{Var}(\\partial C) \\approx 0$. What phenomenon is that?',
            options: ['Overfitting', 'A barren plateau — gradients vanish', 'Shot noise', 'A decoherence error'],
            reveal: 'A **barren plateau** — the cost landscape flattens exponentially in qubits, so gradient descent gets no signal. It is the central training hazard of variational QML.' },
          { type: 'flip', front: '$\\kappa$', back: 'condition number $\\lambda_{\\max}/\\lambda_{\\min}$ — in HHL it controls runtime: small $\\kappa$ means fast inversion' },
          { type: 'points', items: [
            '**$\\eta$** — learning rate in $\\theta \\leftarrow \\theta - \\eta\\nabla C$',
            '**$\\Phi(x), |\\psi(x)\\rangle$** — feature map and the encoded data state',
            '**$\\hat{y}, f_\\theta(x), \\langle O\\rangle_x$** — predicted label, model, readout expectation',
            '**QFT / QPE / HHL** — Fourier transform, phase estimation, linear-system solver',
            '**$J_{ij}, h_i, \\Gamma, s(t)$** — Ising couplers, local fields, transverse field, annealing schedule',
            '**NISQ** — noisy intermediate-scale quantum: the devices we actually have'
          ] },
          { type: 'reflect', prompt: 'Translate this sentence from a paper into plain English: "We minimize $C(\\theta)=\\langle H\\rangle_\\theta$ with a parameter-shift gradient."',
            model: 'We run the parametrized circuit, measure the average energy of the state it produces, and nudge the circuit angles in the direction that lowers it — computing each exact gradient by evaluating the cost at two shifted angle values.' }
        ]
      }
    ]
  }
];
