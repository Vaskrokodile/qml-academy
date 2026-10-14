/* ============================================================
   APPLIED MECHANICS — the equation-only track.
   Three brutal courses pushed onto QML_COURSES. Lessons are built
   from 'eqx' sections: an annotated equation (@{key} markers →
   \htmlData spans) + meta card (what / pipeline / limits / open).

   symbols: { key: ['Title', 'what it does here', 'glyphTeX'?] }
   ============================================================ */
(function () {
  const courses = [

    /* ========================================================
       1. READOUT MECHANICS — states → numbers
       ======================================================== */
    {
      id: 'ca-states',
      title: 'Readout Mechanics',
      subtitle: 'Born rule, expectation values, density operators — where a state becomes a number',
      theme: 'applied',
      track: 'applied',
      icon: 'atom',
      estMin: 40,
      lessons: [
        {
          id: 'l1', part: 'Readout Mechanics',
          title: 'Born rule & expectation values',
          sections: [
            { type: 'text', body: 'No motivation, no history — just the equations that turn a quantum state into something a loss function can eat. **Drag across any symbol** to see what it is doing right there in the formula.' },
            {
              type: 'eqx', name: 'Born rule',
              tex: '@{p}{p(1)} = |@{bra}{\\langle 1|}@{psi}{\\psi\\rangle}|^{2}',
              symbols: {
                p:   ['p(1)', 'The probability of reading out 1 — the actual number a QML model outputs as its prediction.', 'p'],
                bra: ['⟨1|', 'The bra of outcome 1 — a row vector that asks how much of the state points along |1⟩.', '\\langle 1|'],
                psi: ['|ψ⟩', 'The state your circuit just produced — amplitudes for every possible answer.', '|\\psi\\rangle'],
              },
              what: 'Squares the amplitude overlapping an outcome → a classical probability.',
              pipeline: 'Readout — the last step of every QML circuit. The model output IS a Born probability.',
              limits: 'One shot is one coin flip. Estimating p to error ε needs ~1/ε² shots — the measurement budget.',
              open: 'The measurement bottleneck: reading many amplitudes or large observables costs exponentially many shots. Efficient readout is an open front.',
            },
            {
              type: 'eqx', name: 'Completeness',
              tex: '\\sum_{@{i}{i}} @{p}{p(i)} = \\sum_{i} |@{b}{\\langle i|}@{psi}{\\psi\\rangle}|^{2} = 1',
              symbols: {
                i:   ['i', 'Index running over every basis outcome.', 'i'],
                p:   ['p(i)', 'Probability of outcome i.', 'p_i'],
                b:   ['⟨i|', 'Basis bra — the projector asking "how much along outcome i?"', '\\langle i|'],
                psi: ['|ψ⟩', 'The measured state.', '|\\psi\\rangle'],
              },
              what: 'All outcome probabilities sum to 1 — a complete measurement consumes the whole state.',
              pipeline: 'Sanity check on readout distributions; this is why model outputs behave like a softmax.',
              limits: 'Only for a complete basis measurement — partial readouts and POVMs need the generalized version.',
            },
            {
              type: 'eqx', name: 'Expectation value',
              tex: '@{exp}{\\langle O\\rangle} = @{bra}{\\langle\\psi|}@{O}{O}@{ket}{|\\psi\\rangle}',
              symbols: {
                exp: ['⟨O⟩', 'The mean result of measuring observable O over many shots.', '\\langle O\\rangle'],
                bra: ['⟨ψ|', 'Bra of the state under test.', '\\langle\\psi|'],
                O:   ['O', 'The observable — a Hermitian matrix whose eigenvalues are the possible outcomes.', 'O'],
                ket: ['|ψ⟩', 'The state under test.', '|\\psi\\rangle'],
              },
              what: 'Sandwiches an observable between bra and ket → its average value on that state.',
              pipeline: 'This IS the cost function. C(θ)=⟨ψ(θ)|H|ψ(θ)⟩ — a variational model\'s loss is exactly an expectation value.',
              limits: 'Only directly measurable if O is diagonal in your measurement basis; general O must be decomposed into Pauli terms, and the term count can explode.',
              open: 'Measuring large observables cheaply — Pauli grouping, classical shadows, and derandomized shadows are live research.',
            },
            { type: 'predict', prompt: 'For $|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle$, what is $p(0)$?', options: ['$|\\alpha|$', '$|\\alpha|^{2}$', '$\\alpha^{2}$', '$1-|\\beta|$'], reveal: '**$|\\alpha|^{2}$** — the Born rule squares the amplitude\'s magnitude. Not |α|, not α² (that could be complex).' },
          ],
        },
        {
          id: 'l2', part: 'Readout Mechanics',
          title: 'Density operators — when the state is a mixture',
          sections: [
            { type: 'text', body: 'Real hardware never hands you a pure |ψ⟩. It hands you a matrix. These are the four equations that let you read it.' },
            {
              type: 'eqx', name: 'Density operator',
              tex: '@{r}{\\rho} = \\sum_{i} @{pi}{p_i} \\; @{op}{|\\psi_i\\rangle\\langle\\psi_i|}',
              symbols: {
                r:  ['ρ', 'Density operator — a matrix packing both quantum superposition and classical ignorance.', '\\rho'],
                pi: ['p_i', 'Classical weight of ensemble member i — "with probability p_i the state is ψ_i".', 'p_i'],
                op: ['|ψᵢ⟩⟨ψᵢ|', 'Projector onto member state i — its outer-product fingerprint.', '|\\psi_i\\rangle\\langle\\psi_i|'],
              },
              what: 'One object holding both superposition and "we\'re not sure which state we have".',
              pipeline: 'Noise models — real hardware outputs ρ, not |ψ⟩. Decoherence, batched data, ensembles all live here.',
              limits: 'd×d matrix for a d-dim space — classical simulation cost squares vs a state vector.',
            },
            {
              type: 'eqx', name: 'Purity',
              tex: '@{g}{\\gamma} = @{tr}{\\mathrm{Tr}}\\!\\big(@{r}{\\rho}^{2}\\big)',
              symbols: {
                g:  ['γ', 'Purity — 1 for pure states, 1/d for maximally mixed. A scalar "how quantum is this" gauge.', '\\gamma'],
                tr: ['Tr', 'Trace — sum of diagonal entries, i.e. sum of eigenvalues.', '\\mathrm{Tr}'],
                r:  ['ρ', 'The density operator being tested.', '\\rho'],
              },
              what: 'A one-number diagnostic: how pure vs classically scrambled the state is.',
              pipeline: 'Noise detection — if your feature map output keeps losing purity, information is leaking to the environment.',
              limits: 'Aggregates all mixing into one scalar — tells you THAT it\'s mixed, not where the noise entered.',
            },
            {
              type: 'eqx', name: 'Bloch form',
              tex: '@{r}{\\rho} = \\frac{1}{2}\\Big(@{I}{I} + @{rv}{\\vec{r}}\\cdot@{s}{\\vec{\\sigma}}\\Big)',
              symbols: {
                r:  ['ρ', 'Any single-qubit state, pure or mixed.', '\\rho'],
                I:  ['I', '2×2 identity matrix.', 'I'],
                rv: ['r⃗', 'Bloch vector — 3 real numbers placing the state in the ball. |r|=1 pure, |r|<1 mixed, r=0 maximally mixed.', '\\vec{r}'],
                s:  ['σ⃗', 'Pauli vector (X, Y, Z) — the three measurement axes.', '\\vec{\\sigma}'],
              },
              what: 'Every qubit state = a point in a 3D ball. Geometry replaces matrix algebra.',
              pipeline: 'How single-qubit encodings are visualized; noise literally drags r⃗ toward the origin.',
              limits: 'One qubit only. n qubits need d²−1 real parameters — no sphere, no picture.',
            },
            { type: 'quiz', question: { prompt: 'A maximally mixed single qubit has Bloch vector $\\vec{r} =$ ?', options: ['$(1,0,0)$', '$(0,0,0)$', '$(0,0,1)$', 'undefined'], answer: 1, explain: 'Zero vector — dead center of the ball, ρ = I/2.' } },
          ],
        },
        {
          id: 'l3', part: 'Readout Mechanics',
          title: 'Splitting & comparing states',
          sections: [
            {
              type: 'eqx', name: 'Tensor product',
              tex: '@{j}{|\\Psi\\rangle} = @{a}{|\\psi\\rangle} \\otimes @{b}{|\\varphi\\rangle}',
              symbols: {
                j: ['|Ψ⟩', 'The joint state of the combined system.', '|\\Psi\\rangle'],
                a: ['|ψ⟩', 'State of subsystem A.', '|\\psi\\rangle'],
                b: ['|φ⟩', 'State of subsystem B.', '|\\varphi\\rangle'],
              },
              what: 'Stacks two systems into one joint vector — dimensions multiply (2 ⊗ 2 = 4).',
              pipeline: 'The register setup: n qubits start as |0⟩^{⊗n} before the circuit entangles them.',
              limits: 'Most joint states are NOT tensors — entanglement is exactly the failure to factor this way.',
            },
            {
              type: 'eqx', name: 'Partial trace',
              tex: '@{ra}{\\rho_A} = @{tr}{\\mathrm{Tr}_B}\\big(@{rab}{\\rho_{AB}}\\big)',
              symbols: {
                ra:  ['ρ_A', 'What subsystem A is left with when you ignore B.', '\\rho_A'],
                tr:  ['Tr_B', 'Partial trace — average over (forget) all of B\'s outcomes.', '\\mathrm{Tr}_B'],
                rab: ['ρ_AB', 'The joint density operator of A+B.', '\\rho_{AB}'],
              },
              what: 'Throw away a subsystem — what remains is generally mixed even if the whole was pure.',
              pipeline: 'Why local readouts lose information: measuring qubit A of an entangled pair sees a mixed ρ_A.',
              limits: 'No inverse — tracing out is the fundamental information-destroying step in QM.',
              open: 'State tomography — reconstructing ρ_AB from measurements costs exponentially many copies. Better tomography = better debugging of every QML device.',
            },
            {
              type: 'eqx', name: 'Fidelity (pure states)',
              tex: '@{f}{F} = |@{br}{\\langle\\psi|}@{ke}{\\varphi\\rangle}|^{2}',
              symbols: {
                f:  ['F', 'Fidelity — squared overlap. 1 = identical, 0 = orthogonal.', 'F'],
                br: ['⟨ψ|', 'Bra of the first state.', '\\langle\\psi|'],
                ke: ['|φ⟩', 'Ket of the second state.', '|\\varphi\\rangle'],
              },
              what: 'How close two states are — literally the squared inner product.',
              pipeline: 'Quantum kernels ARE fidelities: k(x,x′)=|⟨φ(x)|φ(x′)⟩|² is this exact formula with feature-map states plugged in.',
              limits: 'Mixed states need Uhlmann fidelity — messier, costlier to estimate.',
            },
            {
              type: 'eqx', name: 'Trace distance',
              tex: '@{d}{D} = \\frac{1}{2}\\|@{r}{\\rho} - @{s}{\\sigma}\\|_{1}',
              symbols: {
                d: ['D', 'Trace distance — the max bias ANY measurement can achieve telling the two states apart.', 'D'],
                r: ['ρ', 'First state.', '\\rho'],
                s: ['σ', 'Second state.', '\\sigma'],
              },
              what: 'The operational "how different": the best detector in existence distinguishes them with advantage D.',
              pipeline: 'Encoding sanity check — if two classes map to states with tiny D, no circuit can separate them reliably.',
              limits: 'Needs the matrices (or a norm estimate) — not directly measurable in one shot.',
            },
            { type: 'predict', prompt: 'For the Bell state $|\\Phi^+\\rangle = (|00\\rangle+|11\\rangle)/\\sqrt{2}$, what is $\\rho_A = \\mathrm{Tr}_B(|\\Phi^+\\rangle\\langle\\Phi^+|)$?', reveal: '**$I/2$** — the perfect entangled pair leaves each qubit maximally mixed. All the information lives in the correlation, none in either half.' },
          ],
        },
      ],
    },

    /* ========================================================
       2. ENCODING MECHANICS — data → state
       ======================================================== */
    {
      id: 'ca-encode',
      title: 'Encoding Mechanics',
      subtitle: 'Amplitude, basis & angle encoding, feature maps, quantum kernels',
      theme: 'applied',
      track: 'applied',
      icon: 'layers',
      estMin: 40,
      lessons: [
        {
          id: 'l1', part: 'Encoding Mechanics',
          title: 'Getting numbers into amplitudes',
          sections: [
            { type: 'text', body: 'Every QML pipeline starts by fighting the input problem: your data is classical, the machine only speaks amplitudes. These are the equations of that border crossing.' },
            {
              type: 'eqx', name: 'Amplitude encoding',
              tex: '@{k}{|x\\rangle} = \\frac{1}{@{n}{\\|x\\|}}\\sum_{i} @{xi}{x_i}@{b}{|i\\rangle}',
              symbols: {
                k:  ['|x⟩', 'The data vector as a quantum state — N features packed into log₂N qubits.', '|x\\rangle'],
                n:  ['‖x‖', 'The vector norm — dividing by it makes the state unit length (mandatory).', '\\|x\\|'],
                xi: ['x_i', 'One feature — it literally becomes an amplitude.', 'x_i'],
                b:  ['|i⟩', 'Basis state — the index slot feature i lands in.', '|i\\rangle'],
              },
              what: 'Stores N features in log₂N amplitudes — exponential compression on paper.',
              pipeline: 'The input step. Every downstream gate amortizes against this loading cost.',
              limits: 'The catch: preparing an ARBITRARY amplitude state can cost O(N) gates — erasing the compression win. This is the QML input bottleneck.',
              open: 'Quantum RAM (qRAM): an efficient general loader is still unproven hardware. Many published QML speedups quietly assume it exists.',
            },
            {
              type: 'eqx', name: 'Basis encoding',
              tex: '@{x}{x = (1011)} \\;\\longrightarrow\\; @{q}{|1011\\rangle}',
              symbols: {
                x: ['x', 'The raw bitstring input.', 'x'],
                q: ['|1011⟩', 'One qubit per bit — each sitting in |0⟩ or |1⟩.', '|1011\\rangle'],
              },
              what: 'The dumb, reliable option: one computational-basis state per input string.',
              pipeline: 'Discrete/boolean inputs, arithmetic subroutines, anything that needs exact bit structure.',
              limits: 'Zero compression — n bits = n qubits, and continuous values need discretizing first.',
            },
            {
              type: 'eqx', name: 'Normalization constraint',
              tex: '@{br}{\\langle x|}@{ke}{x\\rangle} = \\sum_i |@{xi}{x_i}|^{2} = 1',
              symbols: {
                br: ['⟨x|', 'Bra of the encoded state.', '\\langle x|'],
                ke: ['|x⟩', 'The encoded state.', '|x\\rangle'],
                xi: ['x_i', 'Each amplitude — their squares must sum to one.', 'x_i'],
              },
              what: 'Quantum states must be unit-norm — raw data has to be rescaled before encoding, no exceptions.',
              pipeline: 'Preprocessing. Feature scaling in amplitude encoding isn\'t a modeling choice — it\'s physics.',
              limits: 'Rescaling distorts geometry: two vectors differing only in magnitude collapse onto the same ray.',
            },
          ],
        },
        {
          id: 'l2', part: 'Encoding Mechanics',
          title: 'Rotating data in — angle encoding & re-uploading',
          sections: [
            {
              type: 'eqx', name: 'Single-qubit rotation',
              tex: '@{g}{R_Y}(@{t}{\\theta})@{z}{|0\\rangle} = @{c}{\\cos\\tfrac{\\theta}{2}}|0\\rangle + @{s}{\\sin\\tfrac{\\theta}{2}}|1\\rangle',
              symbols: {
                g: ['R_Y', 'Rotation about the Y axis of the Bloch sphere.', 'R_Y'],
                t: ['θ', 'The angle — this is where your feature value lands.', '\\theta'],
                z: ['|0⟩', 'Starting state.', '|0\\rangle'],
                c: ['cos(θ/2)', 'Amplitude of |0⟩ after rotating.', '\\cos\\tfrac{\\theta}{2}'],
                s: ['sin(θ/2)', 'Amplitude of |1⟩ — Born probability sin²(θ/2).', '\\sin\\tfrac{\\theta}{2}'],
              },
              what: 'Maps one scalar to a Bloch-sphere angle — one feature per qubit, smoothly.',
              pipeline: 'The workhorse of feature maps: x_i → RY(x_i) on qubit i.',
              limits: 'Periodic — θ and θ+4π give the same state. Features must be scaled into a useful window.',
            },
            {
              type: 'eqx', name: 'Product feature map',
              tex: '@{u}{U_{\\varphi}(x)} = \\bigotimes_{i=1}^{n} @{r}{R_Y}(@{xi}{x_i})',
              symbols: {
                u:  ['U_φ(x)', 'The complete encoding circuit for input x.', 'U_{\\varphi}(x)'],
                r:  ['R_Y', 'Rotation gate — one per qubit.', 'R_Y'],
                xi: ['x_i', 'Feature i, driving the angle on qubit i.', 'x_i'],
              },
              what: 'Writes an n-dim vector into n qubits, one rotation each — a pure product state, no entanglement yet.',
              pipeline: 'Step one of kernel methods and VQCs: |φ(x)⟩ = U_φ(x)|0⟩^n becomes the quantum feature vector.',
              limits: 'Product states occupy a tiny corner of Hilbert space — entangling layers are added to reach the rest.',
            },
            {
              type: 'eqx', name: 'Data re-uploading',
              tex: '@{o}{|\\psi(x)\\rangle} = @{w}{W}\\,@{u}{U_\\varphi(x)}\\,@{w}{W}\\,@{u}{U_\\varphi(x)}@{z}{|0\\rangle}',
              symbols: {
                o: ['|ψ(x)⟩', 'The final encoded state after interleaved layers.', '|\\psi(x)\\rangle'],
                w: ['W', 'Trainable layer — learned weights between data uploads.', 'W'],
                u: ['U_φ(x)', 'The SAME data, uploaded again.', 'U_\\varphi(x)'],
                z: ['|0⟩', 'Initial state.', '|0\\rangle'],
              },
              what: 'Feed the input multiple times between trainable layers — the quantum analogue of network depth.',
              pipeline: 'Data re-uploading circuits — a single qubit can act as a universal classifier this way (Pérez-Salinas et al.).',
              limits: 'Each upload multiplies circuit depth — depth multiplies noise exposure.',
            },
            { type: 'predict', prompt: 'Angle-encoding the feature $x=\\pi$ with $R_Y(x)|0\\rangle$ gives which state?', options: ['$|0\\rangle$', '$|1\\rangle$', '$\\tfrac{|0\\rangle+|1\\rangle}{\\sqrt{2}}$', '$\\tfrac{|0\\rangle-|1\\rangle}{\\sqrt{2}}$'], reveal: '**$|1\\rangle$** — RY(π)|0⟩ = cos(π/2)|0⟩ + sin(π/2)|1⟩ = |1⟩. A full π rotation flips the bit.' },
          ],
        },
        {
          id: 'l3', part: 'Encoding Mechanics',
          title: 'Quantum kernels — similarity as an inner product',
          sections: [
            {
              type: 'eqx', name: 'Fidelity kernel',
              tex: '@{k}{k(x,x^{\\prime})} = |@{f}{\\langle\\varphi(x)|}@{g}{\\varphi(x^{\\prime})\\rangle}|^{2}',
              symbols: {
                k: ['k(x,x′)', 'Kernel value — the similarity score between two inputs.', 'k'],
                f: ['⟨φ(x)|', 'Bra of the first input\'s feature state.', '\\langle\\varphi(x)|'],
                g: ['|φ(x′)⟩', 'Ket of the second input\'s feature state.', '|\\varphi(x^{\prime})\\rangle'],
              },
              what: 'The overlap of two encoded states IS a kernel — quantum feature space, classical math.',
              pipeline: 'Quantum kernel methods: estimate k on hardware, hand the matrix to a classical SVM.',
              limits: 'If encoded states are near-orthogonal the kernel is all ~0; near-identical, all ~1. Bandwidth tuning matters as much as in classical kernels.',
              open: 'Do quantum kernels beat classical ones on real data? A provable practical advantage is still open.',
            },
            {
              type: 'eqx', name: 'Kernel (Gram) matrix',
              tex: '@{K}{K_{ij}} = @{k}{k}(@{xi}{x_i}, @{xj}{x_j})',
              symbols: {
                K:  ['K_ij', 'Gram matrix entry — pairwise similarity of training points.', 'K_{ij}'],
                k:  ['k', 'The kernel function.', 'k'],
                xi: ['x_i', 'Training point i.', 'x_i'],
                xj: ['x_j', 'Training point j.', 'x_j'],
              },
              what: 'All pairwise similarities in one matrix — the concrete object the SVM actually consumes.',
              pipeline: 'Filling K costs ~N²/2 circuit evaluations — the real price tag of quantum kernel methods.',
              limits: 'Shot noise perturbs every entry; the matrix must stay positive-semidefinite or the SVM solver breaks.',
            },
            {
              type: 'eqx', name: 'SVM decision function',
              tex: '@{f}{f(x)} = \\sum_{i} @{a}{\\alpha_i}@{y}{y_i}\\,@{k}{k}(@{xi}{x_i},@{x}{x}) + @{b}{b}',
              symbols: {
                f:  ['f(x)', 'Decision score — its sign picks the class.', 'f(x)'],
                a:  ['α_i', 'Learned weight of support vector i.', '\\alpha_i'],
                y:  ['y_i', 'Its label, ±1.', 'y_i'],
                k:  ['k', 'Kernel similarity to training point i.', 'k'],
                xi: ['x_i', 'Support vector i — a remembered training point.', 'x_i'],
                x:  ['x', 'The new input being classified.', 'x'],
                b:  ['b', 'Bias offset.', 'b'],
              },
              what: 'Classify by comparing the new point to remembered support vectors — the quantum device only computes k.',
              pipeline: 'The hybrid pipeline boundary: quantum inside k, everything else classical.',
              limits: 'Every quantum-advantage claim lives or dies inside k — the SVM itself is ordinary convex optimization.',
            },
          ],
        },
      ],
    },

    /* ========================================================
       3. LEARNING MECHANICS — cost, gradients, trainability
       ======================================================== */
    {
      id: 'ca-learn',
      title: 'Learning Mechanics',
      subtitle: 'Cost as an expectation value, parameter-shift, QAOA, barren plateaus, scale laws',
      theme: 'applied',
      track: 'applied',
      icon: 'bolt',
      estMin: 45,
      lessons: [
        {
          id: 'l1', part: 'Learning Mechanics',
          title: 'Cost is an expectation value',
          sections: [
            { type: 'text', body: 'Training a quantum model is ordinary optimization wrapped around an extraordinary gradient source. Three equations run the whole loop.' },
            {
              type: 'eqx', name: 'Variational cost',
              tex: '@{c}{C(\\theta)} = @{br}{\\langle\\psi(\\theta)|}@{H}{H}@{ke}{|\\psi(\\theta)\\rangle}',
              symbols: {
                c:  ['C(θ)', 'Scalar loss — the number training minimizes.', 'C(\\theta)'],
                br: ['⟨ψ(θ)|', 'Bra of the parametrized output state.', '\\langle\\psi(\\theta)|'],
                H:  ['H', 'Cost Hamiltonian — the observable that encodes the objective.', 'H'],
                ke: ['|ψ(θ)⟩', 'Output of the ansatz at parameters θ.', '|\\psi(\\theta)\\rangle'],
              },
              what: 'A variational circuit\'s loss is literally an expectation value of an observable.',
              pipeline: 'Objective design: pick H so its lowest expectation = the solution (Ising losses, classification margins).',
              limits: 'Global observables cause famous trainability collapse; local costs train better but see less.',
            },
            {
              type: 'eqx', name: 'Parameter-shift rule',
              tex: '\\frac{@{d}{\\partial f}}{@{dt}{\\partial\\theta}} = \\frac{1}{2}\\Big[@{fp}{f(\\theta+\\tfrac{\\pi}{2})} - @{fm}{f(\\theta-\\tfrac{\\pi}{2})}\\Big]',
              symbols: {
                d:  ['∂f', 'Rate of change of the circuit output.', '\\partial f'],
                dt: ['∂θ', 'Wiggle of one gate angle.', '\\partial\\theta'],
                fp: ['f(θ+π/2)', 'Same circuit, angle shifted up π/2.', 'f(\\theta+\\tfrac{\\pi}{2})'],
                fm: ['f(θ−π/2)', 'Same circuit, angle shifted down π/2.', 'f(\\theta-\\tfrac{\\pi}{2})'],
              },
              what: 'The exact analytic gradient from just TWO forward evaluations — no finite-difference epsilon.',
              pipeline: 'How VQCs compute gradients on hardware — there is no backprop through a physical device.',
              limits: 'Exact only for generators with two eigenvalues (standard Pauli rotations). Each parameter costs 2 extra circuit runs per estimate.',
              open: 'Gradient estimation under noise — the rule is unbiased but shot noise still demands ~1/ε² samples per coordinate. Variance reduction is open.',
            },
            {
              type: 'eqx', name: 'Gradient update',
              tex: '@{t}{\\theta} \\;\\leftarrow\\; @{t2}{\\theta} - @{e}{\\eta}\\,@{g}{\\nabla C}',
              symbols: {
                t:  ['θ', 'Parameters — the thing being learned.', '\\theta'],
                t2: ['θ', 'The old parameter value.', '\\theta'],
                e:  ['η', 'Learning rate — step size.', '\\eta'],
                g:  ['∇C', 'Gradient — assembled from parameter-shift evaluations.', '\\nabla C'],
              },
              what: 'Identical to any neural net update — the gradient just happened to come from a quantum device.',
              pipeline: 'The classical outer loop (SGD, Adam, SPSA). The quantum hardware only supplies ∇C estimates.',
              limits: 'Noisy gradients stall convergence; SPSA (2 evals/step) often beats full parameter-shift (2·params evals/step) on real hardware.',
            },
          ],
        },
        {
          id: 'l2', part: 'Learning Mechanics',
          title: 'QAOA & the shot-noise floor',
          sections: [
            {
              type: 'eqx', name: 'QAOA energy',
              tex: '@{e}{E(\\gamma,\\beta)} = @{br}{\\langle\\gamma,\\beta|}@{H}{H_C}@{ke}{|\\gamma,\\beta\\rangle}',
              symbols: {
                e:  ['E(γ,β)', 'Expected cost — the thing being minimized.', 'E'],
                br: ['⟨γ,β|', 'Bra of the p-layer QAOA state.', '\\langle\\gamma,\\beta|'],
                H:  ['H_C', 'Cost Hamiltonian — diagonal, encodes the combinatorial objective.', 'H_C'],
                ke: ['|γ,β⟩', 'The QAOA state — alternating cost + mixer layers.', '|\\gamma,\\beta\\rangle'],
              },
              what: 'Prepare a state with alternating cost and mixer gates, then classically tune the 2p angles to squeeze its expected cost down.',
              pipeline: 'Combinatorial optimization — MaxCut, routing, portfolios. Loop: prepare → measure → update angles.',
              limits: 'Low-depth QAOA underperforms classical solvers on most benchmarks; deeper layers invite barren plateaus.',
              open: 'Whether ANY p yields real-world advantage over classical optimizers — genuinely unresolved.',
            },
            {
              type: 'eqx', name: 'Shot estimate',
              tex: '@{e}{\\hat{E}} = \\frac{1}{@{S}{S}}\\sum_{s=1}^{S} @{o}{o_s}',
              symbols: {
                e: ['Ê', 'Your measured estimate of the true expectation.', '\\hat{E}'],
                S: ['S', 'Shot count — how many times you ran the circuit.', 'S'],
                o: ['o_s', 'Single-shot outcome — the eigenvalue observed in shot s.', 'o_s'],
              },
              what: 'Reality: you never see ⟨H⟩, only an average over noisy samples.',
              pipeline: 'Every cost evaluation in a VQA inner loop is exactly this average.',
              limits: 'Standard error ~ σ/√S — halving the error costs 4× the shots. Shot budgets dominate real experiments.',
            },
            {
              type: 'eqx', name: 'QAOA layer stack',
              tex: '@{s}{|\\gamma,\\beta\\rangle} = \\prod_{l=1}^{p} @{m}{e^{-i\\beta_l H_M}}\\,@{c}{e^{-i\\gamma_l H_C}}\\;@{z}{|+\\rangle^{\\otimes n}}',
              symbols: {
                s: ['|γ,β⟩', 'The QAOA output state.', '|\\gamma,\\beta\\rangle'],
                m: ['e^{−iβH_M}', 'Mixer layer — spreads amplitude between candidate solutions.', 'e^{-i\\beta_l H_M}'],
                c: ['e^{−iγH_C}', 'Cost layer — phase-encodes the objective value.', 'e^{-i\\gamma_l H_C}'],
                z: ['|+⟩^n', 'Uniform superposition — the standard QAOA start.', '|+\\rangle^{\\otimes n}'],
              },
              what: 'p repetitions of "cost phase, then mixer" — the angles γ,β are the only trainables.',
              pipeline: 'The ansatz for combinatorial QML — structured, problem-aware, shallow by necessity.',
              limits: 'Each layer adds controlled-phase cost; hardware noise compounds fast past p≈5 on NISQ devices.',
            },
          ],
        },
        {
          id: 'l3', part: 'Learning Mechanics',
          title: 'Scale laws — where the math fights back',
          sections: [
            {
              type: 'eqx', name: 'Barren plateau',
              tex: '@{v}{\\mathrm{Var}}\\Big[\\frac{@{d}{\\partial C}}{@{dt}{\\partial\\theta}}\\Big] \\sim @{sc}{2^{-n}}',
              symbols: {
                v:  ['Var', 'Variance of the gradient over random parameter draws.', '\\mathrm{Var}'],
                d:  ['∂C', 'Gradient of the cost.', '\\partial C'],
                dt: ['∂θ', 'With respect to any single parameter.', '\\partial\\theta'],
                sc: ['2^{−n}', 'Exponential suppression in qubit count n.', '2^{-n}'],
              },
              what: 'Deep/random circuits have exponentially flat gradients — the landscape becomes a desert.',
              pipeline: 'Why naive deep VQCs die at scale. Motivates local costs, shallow layers, smart init.',
              limits: 'A worst-case scaling law, not a death sentence — structured problems and local observables escape it.',
              open: 'Which architectures provably avoid plateaus at useful sizes is one of the central open questions in QML.',
            },
            {
              type: 'eqx', name: 'Quantum Fourier transform',
              tex: '@{j}{|j\\rangle} \\;\\longrightarrow\\; \\frac{1}{\\sqrt{@{N}{N}}}\\sum_{k=0}^{N-1} @{ph}{e^{2\\pi i jk/N}}\\,@{k}{|k\\rangle}',
              symbols: {
                j:  ['|j⟩', 'Basis input — an integer in quantum register.', '|j\\rangle'],
                N:  ['N', 'Dimension 2ⁿ of the register.', 'N'],
                ph: ['e^{2πijk/N}', 'Phase factor — the Fourier kernel.', 'e^{2\\pi i jk/N}'],
                k:  ['|k⟩', 'Output basis index.', '|k\\rangle'],
              },
              what: 'Spreads each basis state into an equal superposition with phase-graded amplitudes.',
              pipeline: 'The engine inside phase estimation → HHL, amplitude estimation, order finding. Half the famous algorithms call it.',
              limits: 'Needs precise controlled rotations — on noisy hardware the QFT is usually the most expensive part of any algorithm that uses it.',
            },
            {
              type: 'eqx', name: 'HHL scaling',
              tex: '@{t}{T} = O\\!\\Big(@{k}{\\kappa}^{2}\\,\\tfrac{@{l}{\\log N}}{@{e}{\\varepsilon}}\\Big)',
              symbols: {
                t: ['T', 'Runtime of the linear-systems algorithm.', 'T'],
                k: ['κ', 'Condition number — how ill-conditioned the matrix is.', '\\kappa'],
                l: ['log N', 'Log of the matrix size — the source of the exponential claim.', '\\log N'],
                e: ['ε', 'Target precision.', '\\varepsilon'],
              },
              what: 'The HHL promise: solve Ax=b-type problems in polylog time vs O(N)-ish classically.',
              pipeline: 'Theoretical backbone of "quantum linear algebra for ML" — quantum SVMs, least squares, PCA proposals.',
              limits: 'The fine print: needs sparse, well-conditioned A, efficient |b⟩ loading, and returns only an expectation value — not the solution vector. End-to-end advantage is rare.',
              open: 'Dequantization — classical algorithms inspired by HHL closed many claimed gaps. Where a strict exponential advantage survives is still open.',
            },
            { type: 'reflect', prompt: 'In one sentence: why does the shot estimate formula make deep variational training so expensive at scale?', model: 'Each gradient coordinate needs ~1/ε² shots, and barren plateaus shrink the signal (gradient) itself toward zero — so the shots needed to resolve it explode exponentially.' },
          ],
        },
      ],
    },
  ];

  (window.QML_COURSES || (window.QML_COURSES = [])).push(...courses);
})();
