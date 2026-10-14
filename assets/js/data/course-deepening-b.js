/* Deepening lessons for the seven technical QML courses.
   Load after courses.js so the course catalog already exists. */
(function () {
  'use strict';

  var additions = {
    'c-gatemodel': [
      {
        id: 'deep-gatemodel-compilation',
        part: 'Deepening',
        title: 'From Logical Circuit to Hardware Schedule',
        sections: [
          { type: 'text', body: 'A circuit diagram is a program, not yet a set of physical instructions. Its logical qubits are abstract labels; a chip has a particular interaction graph, native gates, and finite coherence time. Think of compilation as routing a small team through a building with locked doors: the desired interaction is unchanged, but the route may need extra moves. Those extra gates matter because each noisy operation can reduce the chance that the final sample reflects the intended state.' },
          { type: 'steps', title: 'Numeric example — routing a two-qubit gate', hint: 'Assume three physical qubits lie on a line: q0—q1—q2, and only neighbors can interact.', steps: [
            'The logical circuit asks for CNOT between logical qubits A and C, initially placed on physical q0 and q2. That pair is not connected directly.',
            'A SWAP between q0 and q1 moves one logical state next to the other. A SWAP is exactly three CNOT gates, so the routing has a real gate cost.',
            'Now the logical states occupy neighboring sites; perform the requested CNOT using the available edge. The compiler tracks which physical site represents each logical label.',
            'If later gates benefit from the new placement, the compiler can keep that permutation rather than pay to swap back. Circuit quality depends on the whole schedule, not just one interaction.'
          ] },
          { type: 'equation', body: '$\\mathrm{SWAP}=\\mathrm{CNOT}_{1\\to2}\\mathrm{CNOT}_{2\\to1}\\mathrm{CNOT}_{1\\to2}$', desc: 'Three entangling gates implement an exact exchange of two qubit states.' },
          { type: 'text', body: 'Formally, hardware connectivity is a graph G=(V,E): qubits are vertices and directly executable two-qubit couplings are edges. A placement maps logical vertices into V; every requested interaction must map to an edge or be routed. The compiler also chooses native-gate decompositions and a schedule that respects qubit conflicts. Minimizing two-qubit depth and error is a constrained optimization problem; the shortest logical circuit is not necessarily the best physical circuit.' },
          { type: 'quiz', question: { prompt: 'On hardware where only adjacent qubits interact, why can a compiler insert SWAP gates?', options: ['To route logical qubits until the requested pair is adjacent', 'To make every measurement deterministic', 'To increase the number of logical variables', 'To remove the need for calibration'], answer: 0, explain: 'A SWAP exchanges the states at two neighboring sites. A sequence of such exchanges routes a logical interaction across a sparse hardware graph, at the cost of additional physical gates.' } },
          { type: 'points', items: ['A logical gate and its hardware realization are different levels of description.', 'A SWAP is exact but costs three CNOTs in the standard decomposition.', 'Compiler mapping, routing, native-gate synthesis, and scheduling all affect depth and accumulated error.', 'Fewer gates can help, but the best compilation also depends on calibrated error rates and parallelism.'] },
          { type: 'quiz', question: { prompt: 'A line of three qubits has edges q0—q1 and q1—q2 only. Which statement about a direct q0–q2 CNOT is correct?', options: ['It is not a native edge interaction and needs routing or a different decomposition', 'It is always free because the graph is connected', 'It can be implemented by measuring q1', 'It changes the machine into an all-to-all device'], answer: 0, explain: 'Connectivity is about direct edges, not whether a path exists. A path allows routing, but typically adds gates such as SWAPs and can increase depth.' } },
          { type: 'reflect', prompt: 'When estimating whether a circuit is practical, why should you count routed physical gates rather than only the gates in its logical algorithm?', model: 'Sparse device connectivity can turn a logical interaction into several physical entangling gates. Those extra gates consume depth and expose the computation to more noise, so logical gate count alone can substantially understate the hardware cost.' }
        ]
      },
      {
        id: 'deep-gatemodel-measurement',
        part: 'Deepening',
        title: 'Measurement, Sampling Error & Circuit Reliability',
        sections: [
          { type: 'text', body: 'A quantum circuit does not print its full state vector. It prepares a state, and measurement returns one classical outcome at a time. Repeating the same circuit is like repeatedly sampling a biased coin: the pattern of outcomes estimates probabilities and averages, but a finite batch fluctuates. A correct circuit can therefore produce a sample that looks atypical, and a plausible-looking sample does not by itself prove that every gate behaved correctly.' },
          { type: 'steps', title: 'Numeric example — testing a Bell-pair parity', hint: 'Prepare (|00⟩+|11⟩)/√2 and measure both qubits in the computational basis.', steps: [
            'Ideally the only outcomes are 00 and 11, each with probability 1/2. The parity check “are the bits equal?” succeeds every time.',
            'Suppose each measured bit independently flips with probability 0.02. Parity becomes wrong if exactly one of the two bits flips.',
            'That error probability is 0.02×0.98 + 0.98×0.02 = 0.0392, about 3.9%.',
            'In 100 shots, about four wrong-parity results are expected on average, but the actual count varies. More shots narrow sampling uncertainty; they do not remove systematic readout bias.'
          ] },
          { type: 'equation', body: '$p(z)=|\\langle z|\\psi\\rangle|^2,\\quad \\mathbb{E}[O]=\\sum_z p(z)O(z)$', desc: 'The Born rule gives outcome probabilities; repeated outcomes estimate an observable’s expectation.' },
          { type: 'text', body: 'Technically, a pure state evolves by unitary matrices U with U†U=I, so its norm is conserved. A measurement with projectors Πz returns z with probability ⟨ψ|Πz|ψ⟩ and leaves the corresponding conditional state. Real noise is more generally a quantum channel, and readout errors act after the state is prepared. If an observable has bounded outcomes, the standard error of its sample mean decreases like 1/√N for N independent shots; calibration, drift, and correlated errors require separate treatment.' },
          { type: 'quiz', question: { prompt: 'For |ψ⟩=(|00⟩+|11⟩)/√2, what are the ideal computational-basis measurement outcomes?', options: ['00 or 11, each with probability 1/2', '01 or 10, each with probability 1/2', 'Only 00 with certainty', 'All four strings with probability 1/4'], answer: 0, explain: 'The two nonzero amplitudes are on 00 and 11, each with squared magnitude 1/2. The state has perfect same-bit correlations in this basis.' } },
          { type: 'points', items: ['Measurement yields samples, not a readable list of every amplitude.', 'For independent shots, statistical uncertainty typically scales as 1/√N.', 'Readout noise and gate noise are distinct error sources.', 'Entanglement creates correlations between registers; a useful test can measure a joint observable such as parity.'] },
          { type: 'quiz', question: { prompt: 'If the number of independent shots rises from 100 to 400, how does the standard sampling error scale approximately?', options: ['It is halved', 'It doubles', 'It becomes zero', 'It is unchanged'], answer: 0, explain: 'Standard error scales as 1/√N. Quadrupling N multiplies it by 1/2, although systematic errors are not cured by taking more shots.' } },
          { type: 'reflect', prompt: 'What is one limitation that remains even after taking many more circuit shots?', model: 'More shots reduce random sampling error, but they do not automatically correct systematic readout bias, drift, a miscompiled circuit, or errors in the physical gates.' }
        ]
      }
    ],
    'c-annealing': [
      {
        id: 'deep-annealing-qubo',
        part: 'Deepening',
        title: 'Translate a Binary Objective into an Ising Hamiltonian',
        sections: [
          { type: 'text', body: 'An annealer is not handed a sentence such as “choose the best schedule.” It is given a numerical energy landscape whose low-energy configurations represent good choices. A QUBO uses binary variables xᵢ∈{0,1}; an Ising model uses spins sᵢ∈{−1,+1}. This is a change of coordinates, not a promise that the machine will always find the global minimum.' },
          { type: 'steps', title: 'Numeric example — a two-variable QUBO', hint: 'Minimize E(x₁,x₂)=x₁+2x₂−4x₁x₂.', steps: [
            'Evaluate the four assignments: E(0,0)=0, E(1,0)=1, E(0,1)=2, and E(1,1)=−1. The best assignment is (1,1).',
            'Use sᵢ=2xᵢ−1, equivalently xᵢ=(1+sᵢ)/2. A binary choice is now an Ising spin.',
            'Substitute and simplify: E = 1/2 − (1/2)s₁ − s₁s₂. The constant 1/2 shifts every energy equally and does not change which assignment is best.',
            'The minimum has s₁=s₂=+1, which maps back to x₁=x₂=1. The pair coupling encodes the preference for the two choices to be selected together.'
          ] },
          { type: 'equation', body: '$E(x)=\\sum_i a_i x_i+\\sum_{i<j}b_{ij}x_ix_j,\\quad s_i=2x_i-1$', desc: 'A quadratic binary objective becomes a pairwise spin energy, up to a constant offset.' },
          { type: 'text', body: 'For a larger problem, expand the substitution for each bit and collect constants, linear fields hᵢsᵢ, and pair couplings Jᵢⱼsᵢsⱼ. The resulting diagonal problem Hamiltonian has computational-basis assignments as energy eigenstates. Hardware coefficient ranges, precision, and sparse connectivity can require rescaling or minor embedding; rescaling may make small energy differences harder to resolve. Penalty terms for constraints must be large enough to discourage violations but not so large that they overwhelm useful objective differences.' },
          { type: 'quiz', question: { prompt: 'Under s=2x−1, which Ising spin corresponds to binary choice x=1?', options: ['s=+1', 's=0', 's=−1', 's=2'], answer: 0, explain: 'Substituting x=1 gives s=2(1)−1=+1; x=0 maps to −1.' } },
          { type: 'points', items: ['QUBO and Ising formulations encode the same discrete assignments in different variables.', 'An additive constant changes reported energies but not the minimizing assignment.', 'Quadratic cross terms become pairwise spin couplings.', 'Penalty strength, coefficient precision, scaling, and embedding all affect practical behavior.'] },
          { type: 'quiz', question: { prompt: 'In the worked objective E=x₁+2x₂−4x₁x₂, which assignment has the lowest energy?', options: ['(1,1)', '(0,0)', '(1,0)', '(0,1)'], answer: 0, explain: 'The four energies are 0, 1, 2, and −1 respectively; the minimum is −1 at (1,1).' } },
          { type: 'reflect', prompt: 'Why does translating an objective to Ising form not establish that an annealer will return its exact optimum?', model: 'The translation preserves the energy ranking mathematically, but physical annealing is finite-time and noisy, with thermal excitations, calibration limits, and embedding overhead. Finding a ground state is an optimization outcome, not a guarantee supplied by the encoding.' }
        ]
      },
      {
        id: 'deep-annealing-schedule',
        part: 'Deepening',
        title: 'Schedules, Energy Gaps & Repeated Anneals',
        sections: [
          { type: 'text', body: 'The annealing picture is a controlled change from an easy-to-prepare state to an energy landscape representing the problem. The intuition is to reshape a landscape gradually so the system can follow its low-energy state. “Gradually” is relative: a narrow avoided crossing can demand a very long runtime, while a real device also has temperature, control error, and coupling to its surroundings.' },
          { type: 'steps', title: 'Numeric example — retries improve odds, not certainty', hint: 'Suppose one complete anneal returns an acceptable configuration with probability p=0.2, independently on each run.', steps: [
            'One run succeeds with probability 0.2 and fails with probability 0.8.',
            'Ten independent runs all fail with probability 0.8¹⁰≈0.1074.',
            'Therefore at least one acceptable result appears with probability 1−0.8¹⁰≈0.8926, or about 89%.',
            'This is the probability of meeting the stated acceptance criterion, not proof that the exact ground state was found. Correlated runs or a changing success probability also change the calculation.'
          ] },
          { type: 'equation', body: '$H(s)=-A(s)\\sum_i X_i+B(s)H_{\\mathrm{problem}},\\quad 0\\le s\\le1$', desc: 'The transverse-field driver dominates near s=0; the encoded problem Hamiltonian dominates near s=1.' },
          { type: 'text', body: 'For an ideal closed system initialized in the driver ground state, the adiabatic theorem relates successful ground-state tracking to the schedule’s rate and the minimum spectral gap Δmin along the path; small gaps can require runtimes scaling roughly with an inverse power of Δmin (often summarized as an inverse-square dependence under simplified assumptions). Actual open-system annealers need not follow that ideal theorem. Their outputs are empirical samples whose energy histogram can be compared across schedules, reads, and classical baselines.' },
          { type: 'quiz', question: { prompt: 'In an ideal adiabatic analysis, what makes a very small minimum energy gap difficult?', options: ['It can require slower evolution to remain near the ground state', 'It makes the objective independent of its variables', 'It guarantees every run returns the minimum', 'It removes thermal effects from hardware'], answer: 0, explain: 'A small gap makes transitions out of the instantaneous ground state more likely unless the schedule is sufficiently slow. The ideal bound does not remove real-device noise or guarantee an optimum.' } },
          { type: 'points', items: ['The driver and problem terms trade dominance over the schedule.', 'The ideal adiabatic theorem is not an automatic guarantee for a noisy finite-time annealer.', 'Repeats help estimate an output distribution and raise the chance of seeing a good sample.', 'Compare energy distributions and success criteria against appropriate classical methods; no quantum advantage follows from the device label alone.'] },
          { type: 'quiz', question: { prompt: 'With independent success probability 0.2 per run, what is the chance of at least one success in 10 runs?', options: ['About 0.893', 'Exactly 0.2', 'Exactly 0.8', 'About 0.107'], answer: 0, explain: 'The chance all ten fail is 0.8¹⁰≈0.1074, so the complement is about 0.8926.' } },
          { type: 'reflect', prompt: 'Distinguish the ideal adiabatic claim from the practical use of repeated anneals.', model: 'The ideal theorem gives conditions under which a closed system tracks its ground state. A real annealer has finite runtime and environmental noise, so repeated anneals instead provide samples whose quality and distribution must be measured.' }
        ]
      }
    ],
    'c-vqa': [
      {
        id: 'deep-vqa-cost-estimation',
        part: 'Deepening',
        title: 'Estimate a QAOA Cost from Finite Shots',
        sections: [
          { type: 'text', body: 'A variational circuit is evaluated through measurements, so the optimizer sees an estimate rather than an exact energy. For MaxCut, each edge contributes one when its endpoints differ and zero when they match. QAOA changes the probability of sampled bit strings; the classical loop estimates their average cost and then chooses new angles. The sample average can move around even when the parameters have not changed.' },
          { type: 'steps', title: 'Numeric example — one edge and four shots', hint: 'For a graph with one edge, the cut value is 1 on 01 or 10 and 0 on 00 or 11.', steps: [
            'Suppose four measured strings are 01, 00, 10, 11. Their cut values are 1, 0, 1, 0.',
            'The sample mean cut value is (1+0+1+0)/4=0.5.',
            'If the objective is instead to minimize the negative cut value, the estimated energy is −0.5. Be explicit about which sign convention the optimizer uses.',
            'Four shots are only an illustration. With more samples the estimate usually stabilizes, but hardware bias and correlated errors can remain.'
          ] },
          { type: 'equation', body: '$C(z)=\\sum_{(i,j)\\in E}\\frac{1-z_i z_j}{2},\\quad \\widehat{C}=\\frac{1}{N}\\sum_{r=1}^{N}C(z^{(r)})$', desc: 'For zᵢ∈{−1,+1}, an edge contributes one exactly when its endpoint spins differ.' },
          { type: 'text', body: 'At depth p, the standard QAOA state is built from alternating problem and mixer evolutions, for example |ψ(γ,β)⟩=U_B(β)U_C(γ)|+⟩ⁿ at p=1. The expected cost is ⟨ψ|C|ψ⟩, but estimating it requires circuit executions. If C is a sum of many terms, measurement grouping and shot allocation affect the total budget. A better estimated objective does not alone certify a better-than-classical solution or a hardware speedup.' },
          { type: 'quiz', question: { prompt: 'For a single MaxCut edge, which measured strings contribute cut value 1?', options: ['01 and 10', '00 and 11', 'Only 00', 'All four equally'], answer: 0, explain: 'The endpoints are on opposite sides of the cut exactly when the bits differ: 01 or 10.' } },
          { type: 'points', items: ['The QPU produces samples; a cost estimate is a statistic over those samples.', 'State the sign convention: maximizing cut and minimizing negative cut are equivalent objectives.', 'Finite shots create uncertainty, while calibration and device drift create additional errors.', 'QAOA is a parameterized heuristic family; quality depends on instance, depth, optimization, and hardware.'] },
          { type: 'quiz', question: { prompt: 'If the four one-edge outcomes are 01, 00, 10, 11, what is the average cut value?', options: ['0.5', '0', '1', '2'], answer: 0, explain: 'The cut values are 1, 0, 1, 0, whose mean is 2/4=0.5.' } },
          { type: 'reflect', prompt: 'Why can two evaluations at identical QAOA angles return slightly different measured costs?', model: 'Each evaluation samples a finite number of measurement outcomes. Random sampling produces statistical variation, and hardware noise or drift can add further differences even though the programmed angles are the same.' }
        ]
      },
      {
        id: 'deep-vqa-gradients',
        part: 'Deepening',
        title: 'Parameter-Shift Gradients and Optimization Noise',
        sections: [
          { type: 'text', body: 'The classical optimizer needs to know which direction in angle space lowers the measured cost. A quantum circuit is not normally differentiated by peeking inside a wavefunction; instead, certain gate parameters have an exact shift rule. Intuitively, run two nearby-but-specifically-shifted circuits and use their cost difference as a slope. In practice, each cost is itself estimated from finite shots, so a mathematically exact identity can still yield a noisy gradient estimate.' },
          { type: 'steps', title: 'Numeric example — differentiate cos(θ)', hint: 'Let C(θ)=cos θ and evaluate at θ=π/3.', steps: [
            'Shift upward: C(π/3+π/2)=cos(5π/6)=−√3/2≈−0.866.',
            'Shift downward: C(π/3−π/2)=cos(−π/6)=√3/2≈0.866.',
            'The parameter-shift estimate is (−0.866−0.866)/2≈−0.866.',
            'The analytic derivative is −sin(π/3)=−√3/2≈−0.866, matching the shift result exactly.'
          ] },
          { type: 'equation', body: '$\\frac{dC}{d\\theta}=\\frac{C(\\theta+\\pi/2)-C(\\theta-\\pi/2)}{2}$', desc: 'For a gate generated by a Pauli operator with the conventional half-angle rotation, this parameter-shift identity is exact.' },
          { type: 'text', body: 'The identity follows by writing an expectation for a generator with two eigenvalues as a constant plus sine and cosine terms in θ; shifting by ±π/2 isolates the derivative. It applies gate-by-gate under the stated generator convention, not as a universal formula for every arbitrary parameterization. With shots, the variances of the two cost estimates add into the gradient uncertainty. Increasing shots reduces statistical noise but costs more QPU time; barren plateaus, poor initialization, and optimizer choice are separate obstacles.' },
          { type: 'quiz', question: { prompt: 'For C(θ)=cos θ at θ=π/3, what derivative does the parameter-shift rule give?', options: ['−√3/2', '0', '+√3/2', '−1/2'], answer: 0, explain: 'The shifted values are −√3/2 and +√3/2; half their difference is −√3/2, equal to −sin(π/3).' } },
          { type: 'points', items: ['Parameter shift is an exact derivative identity for suitable gate generators.', 'The two shifted circuit evaluations still require measurements.', 'Shot noise can make the estimated gradient uncertain even when the identity is exact.', 'A low-noise gradient does not guarantee a favorable optimization landscape or a quantum advantage.'] },
          { type: 'quiz', question: { prompt: 'Why may a parameter-shift gradient be noisy on hardware?', options: ['Each shifted cost is estimated from a finite number of noisy measurement shots', 'The derivative rule requires nonunitary gates', 'The shift changes the number of qubits', 'A classical optimizer cannot subtract two numbers'], answer: 0, explain: 'The formula uses estimates of two expectation values. Finite sampling and device errors affect both values and therefore their difference.' } },
          { type: 'reflect', prompt: 'How can a gradient rule be exact while the gradient measured on a device is uncertain?', model: 'The shift identity exactly relates ideal expectation values. A device estimates those values with finite, noisy samples, so the computed difference has statistical and hardware uncertainty.' }
        ]
      }
    ],
    'c-encoding': [
      {
        id: 'deep-encoding-state-loading',
        part: 'Deepening',
        title: 'State Loading Is Part of the Algorithm',
        sections: [
          { type: 'text', body: 'Amplitude encoding looks like a dramatic compression: a vector with d entries can be represented by amplitudes on only about log₂(d) qubits. The catch is that a compact representation is not automatically cheap to prepare or easy to inspect. This is like storing a long table in a compact code: the code is useful only if you can encode the input and extract the answer you need within the full resource budget.' },
          { type: 'steps', title: 'Numeric example — a normalized two-entry vector', hint: 'Take x=(3/5,4/5).', steps: [
            'Check normalization: (3/5)²+(4/5)²=9/25+16/25=1.',
            'One qubit has two computational basis states, so the vector can be represented as |x⟩=(3/5)|0⟩+(4/5)|1⟩.',
            'A computational-basis measurement returns 0 with probability 9/25=0.36 and 1 with probability 16/25=0.64.',
            'Those probabilities do not reveal the signs or relative phases of arbitrary amplitudes. Recovering a full vector generally takes repeated measurements or additional measurement settings.'
          ] },
          { type: 'equation', body: '$|x\\rangle=\\sum_i x_i|i\\rangle,\\quad \\sum_i|x_i|^2=1,\\quad n=\\lceil\\log_2 d\\rceil$', desc: 'A d-dimensional normalized vector occupies d basis amplitudes in n qubits, where 2ⁿ≥d.' },
          { type: 'text', body: 'The circuit preparing |x⟩ from |0⟩ⁿ must encode the input-dependent amplitudes. A generic state has many independent degrees of freedom, and a generic exact preparation can require a number of gates that grows with d; structured vectors may be easier. If a downstream algorithm uses the state only through a few expectation values, full tomography may be unnecessary. A fair complexity comparison includes classical data access, state preparation, repetitions, error correction where relevant, and the cost of the desired output.' },
          { type: 'quiz', question: { prompt: 'What are the computational-basis measurement probabilities for |x⟩=(3/5)|0⟩+(4/5)|1⟩?', options: ['P(0)=9/25 and P(1)=16/25', 'P(0)=3/5 and P(1)=4/5', 'P(0)=P(1)=1/2', 'P(0)=16/25 and P(1)=9/25'], answer: 0, explain: 'Probabilities are squared amplitude magnitudes: (3/5)²=9/25 and (4/5)²=16/25.' } },
          { type: 'points', items: ['Basis encoding is direct for discrete labels but uses one qubit per encoded bit.', 'Amplitude encoding stores normalized vector entries as amplitudes.', 'Preparation and readout costs can erase apparent space or runtime savings.', 'The right encoding depends on data structure and on which output the application actually needs.'] },
          { type: 'quiz', question: { prompt: 'Why can a one-shot computational-basis measurement not reconstruct a general amplitude-encoded vector?', options: ['It returns one sampled index and does not directly reveal all amplitudes and phases', 'It always changes the vector length to d²', 'It reports every amplitude exactly', 'It is prohibited for normalized states'], answer: 0, explain: 'A measurement produces one outcome with Born-rule probabilities. Reconstructing amplitudes, especially relative phases, needs further measurements and repeated data.' } },
          { type: 'reflect', prompt: 'When comparing amplitude encoding with a classical data pipeline, what costs belong in the comparison besides qubit count?', model: 'Include how the classical values are loaded into amplitudes, the preparation circuit depth and error, the number of repeated executions, and the work needed to extract the relevant output. A compact state representation alone does not establish end-to-end efficiency.' }
        ]
      },
      {
        id: 'deep-encoding-hamiltonians',
        part: 'Deepening',
        title: 'Problem Hamiltonians Versus Hamiltonian Simulation',
        sections: [
          { type: 'text', body: '“Encode the problem in a Hamiltonian” can mean two related but distinct things. In optimization, a diagonal problem Hamiltonian assigns an energy to each candidate and its ground state represents a lowest-cost assignment. In Hamiltonian simulation, the goal is to implement the time evolution generated by a specified operator. One asks for a low-energy configuration; the other asks how a quantum state evolves.' },
          { type: 'steps', title: 'Numeric example — a two-spin optimization encoding', hint: 'The QUBO E=x₁+2x₂−4x₁x₂ has its minimum at x₁=x₂=1.', steps: [
            'Set sᵢ=2xᵢ−1, so the objective becomes E=1/2−(1/2)s₁−s₁s₂.',
            'Represent each spin by the eigenvalue of a Pauli-Z operator. The diagonal operator is H=1/2 I−(1/2)Z₁−Z₁Z₂.',
            'On |00⟩, where both Z eigenvalues are +1, the energy is 1/2−1/2−1=−1, the minimum.',
            'The identity term shifts all energies equally. It can be omitted when only the minimizing bit string matters, though it matters when reporting absolute energies.'
          ] },
          { type: 'equation', body: '$H_{\\mathrm{problem}}|x\\rangle=E(x)|x\\rangle,\\quad U(t)=e^{-iHt}$', desc: 'A cost Hamiltonian labels candidate energies; a simulation unitary applies the dynamics generated by H.' },
          { type: 'text', body: 'In QAOA the cost Hamiltonian contributes a phase separator exp(−iγHproblem), while a mixer evolves the state between cost phases. Hamiltonian simulation instead approximates e^(−iHt), often by decomposing a sum H=ΣⱼHⱼ into implementable terms. If terms do not commute, e^(−i(H₁+H₂)t) is not generally equal to e^(−iH₁t)e^(−iH₂t); product formulas introduce approximation error that depends on time, term structure, and step size. Neither encoding removes the need to account for data access, circuit depth, and measurement.' },
          { type: 'quiz', question: { prompt: 'In an Ising optimization encoding, what does the ground-state bit string represent?', options: ['An assignment with minimum encoded objective energy', 'A complete list of all input data', 'The time evolution of every possible state', 'A guaranteed classical optimum from any finite run'], answer: 0, explain: 'The problem Hamiltonian assigns each computational-basis assignment an energy matching the encoded objective, up to any constant offset. The ground state represents a minimizing assignment.' } },
          { type: 'points', items: ['An optimization Hamiltonian encodes candidate costs as eigenvalues.', 'Hamiltonian simulation encodes dynamics through exp(−iHt).', 'Noncommuting terms require care when splitting evolution into implementable pieces.', 'Encoding a problem does not by itself guarantee efficient preparation, readout, or a practical advantage.'] },
          { type: 'quiz', question: { prompt: 'If two Hamiltonian terms H₁ and H₂ do not commute, which statement is generally correct?', options: ['e^(−i(H₁+H₂)t) is not exactly the same as e^(−iH₁t)e^(−iH₂t)', 'Their exponentials are always identical in either order', 'Their sum cannot be Hermitian', 'The system no longer has a unitary evolution'], answer: 0, explain: 'Noncommutation prevents the simple factorization in general. Product formulas approximate the combined evolution, with an error controlled by the decomposition and step size.' } },
          { type: 'reflect', prompt: 'State the conceptual difference between using a Hamiltonian to encode an optimization objective and using one to simulate dynamics.', model: 'Optimization uses energy eigenvalues to rank candidate assignments and seeks a low-energy state. Simulation applies the time-evolution operator generated by H and seeks information about how a state changes over time.' }
        ]
      }
    ],
    'c-mlmethods': [
      {
        id: 'deep-mlmethods-qboost',
        part: 'Deepening',
        title: 'QBoost: From Sparse Ensemble Selection to QUBO',
        sections: [
          { type: 'text', body: 'An ensemble combines several predictors, but keeping every weak model can add complexity without improving predictions. QBoost turns a simplified model-selection task into a discrete optimization: binary variables decide which predictors participate, a loss penalizes disagreement with labels, and a sparsity term discourages selecting too many. The useful bridge is algebraic: squaring a weighted sum creates pairwise interactions between selection variables.' },
          { type: 'steps', title: 'Numeric example — select one of two predictors', hint: 'Use binary selectors w₁,w₂ and the illustrative objective L=(w₁+w₂−1)²+0.2(w₁+w₂).', steps: [
            'Selecting neither gives L(0,0)=1: the target count of one selected model is missed.',
            'Selecting just one gives L(1,0)=L(0,1)=0.2: the fit term is zero and the sparsity penalty is 0.2.',
            'Selecting both gives L(1,1)=(2−1)²+0.2(2)=1+0.4=1.4, because it incurs both the fit term and the sparsity penalty.',
            'Using wᵢ²=wᵢ for binary variables, expansion gives L=1−0.8w₁−0.8w₂+2w₁w₂. The positive pair term penalizes selecting both; either single predictor is optimal.'
          ] },
          { type: 'equation', body: '$L(w)=\\sum_i(\\sum_k w_k c_k(x_i)-y_i)^2+\\lambda\\sum_k w_k,\\quad w_k\\in\\{0,1\\}$', desc: 'A squared prediction loss plus a binary sparsity penalty; expansion gives linear biases and pairwise couplings.' },
          { type: 'text', body: 'The example is a toy selector objective; in an actual ensemble, cₖ(xᵢ) are model outputs, labels and weights determine the coefficients, and regularization strength λ controls the fit-versus-sparsity tradeoff. Once expanded, a quadratic binary objective is a QUBO and can be mapped to an Ising energy. A solver returns candidate weights that still need evaluation on held-out data. The formulation does not make the statistical model automatically generalize or guarantee that a quantum optimizer beats classical QUBO solvers.' },
          { type: 'quiz', question: { prompt: 'Why does expanding a squared ensemble loss produce pairwise terms between model selectors?', options: ['Cross-products of weighted model outputs multiply wₖwₗ', 'The square removes every interaction', 'The label becomes a quantum state', 'Regularization makes the objective linear by definition'], answer: 0, explain: 'Squaring a sum creates cross-products. With binary selector variables, these become quadratic couplings that fit the QUBO form.' } },
          { type: 'points', items: ['Binary selectors make inclusion or exclusion explicit.', 'Squared loss creates linear and pairwise coefficients after expansion.', 'The sparsity penalty trades fit against ensemble size.', 'Validate chosen ensembles on held-out data and compare with classical optimization baselines.'] },
          { type: 'quiz', question: { prompt: 'For L=(w₁+w₂−1)²+0.2(w₁+w₂), what is L when both predictors are selected?', options: ['1.4', '0.2', '0', '2.2'], answer: 0, explain: 'With w₁=w₂=1, the squared term is (2−1)²=1 and the penalty is 0.4, for a total of 1.4.' } },
          { type: 'reflect', prompt: 'Why is mapping QBoost to a QUBO only one stage of building a useful predictor?', model: 'The QUBO encodes a finite optimization objective, but its solution must still be found reliably, translated into selected predictors, and evaluated for generalization. Data quality, regularization, sampling, and classical baselines remain essential.' }
        ]
      },
      {
        id: 'deep-mlmethods-kernels',
        part: 'Deepening',
        title: 'Quantum Kernels: Overlaps, Gram Matrices & Sampling',
        sections: [
          { type: 'text', body: 'A kernel is a similarity measure that lets a classical learner reason as if examples had been mapped into a feature space. A quantum feature circuit prepares a state for each input; the overlap between two states supplies a similarity. Interference circuits turn that overlap into observable frequencies. The machine estimates pairwise similarities; it does not hand the learner an explicit exponentially long feature vector.' },
          { type: 'steps', title: 'Numeric example — compare two encoded vectors', hint: 'Encode x=(1,0) and z=(3/5,4/5) as normalized real one-qubit states.', steps: [
            'The states are |φ(x)⟩=|0⟩ and |φ(z)⟩=(3/5)|0⟩+(4/5)|1⟩.',
            'Their amplitude overlap is ⟨φ(x)|φ(z)⟩=3/5=0.6.',
            'If the kernel convention is squared fidelity, K(x,z)=|⟨φ(x)|φ(z)⟩|²=0.36. Some methods use the overlap itself, so the convention must be stated.',
            'For the two examples with unit diagonal, the squared-overlap Gram matrix is [[1,0.36],[0.36,1]], whose eigenvalues are 1.36 and 0.64; both are nonnegative.'
          ] },
          { type: 'equation', body: '$\\kappa(x,z)=\\langle\\phi(x)|\\phi(z)\\rangle,\\quad K(x,z)=|\\kappa(x,z)|^2$', desc: 'A feature-state overlap and its squared-fidelity variant are related kernel conventions.' },
          { type: 'text', body: 'A valid kernel must produce a positive-semidefinite Gram matrix for every finite set of inputs. Inner products do so because v†Kv is a squared norm; squared overlaps are also positive semidefinite for pure-state feature maps. In the Hadamard-test convention, an ancilla probability can satisfy P(0)=[1+Re κ]/2, so κ=0.6 gives P(0)=0.8. With only 100 ancilla shots, the standard error of that probability estimate is √(0.8×0.2/100)=0.04. Building a full N×N training Gram matrix can itself require many circuit evaluations.' },
          { type: 'quiz', question: { prompt: 'For states with overlap ⟨φ(x)|φ(z)⟩=0.6, what is their squared-fidelity kernel value?', options: ['0.36', '0.6', '1.6', '0'], answer: 0, explain: 'The squared-fidelity convention takes the squared magnitude: |0.6|²=0.36.' } },
          { type: 'points', items: ['A feature map defines states; the chosen overlap convention defines the kernel.', 'Positive-semidefinite Gram matrices are required for standard kernel methods.', 'Interference circuits estimate overlaps from probabilities and finite shots.', 'Data encoding, Gram-matrix construction, classical training, and generalization all belong in an end-to-end evaluation.'] },
          { type: 'quiz', question: { prompt: 'If a Hadamard-test circuit has P(0)=[1+Re κ]/2 and Re κ=0.6, what is P(0)?', options: ['0.8', '0.6', '0.3', '1.6'], answer: 0, explain: 'Substitution gives (1+0.6)/2=0.8.' } },
          { type: 'reflect', prompt: 'Why does a quantum kernel method still need a careful classical and statistical evaluation?', model: 'The QPU supplies noisy estimates of selected pairwise similarities, while the Gram matrix may require many evaluations. Kernel choice, data loading, shot uncertainty, classical SVM training, and held-out performance determine whether the method is useful.' }
        ]
      }
    ],
    'c-algorithms': [
      {
        id: 'deep-algorithms-qft',
        part: 'Deepening',
        title: 'Read a Small Quantum Fourier Transform by Hand',
        sections: [
          { type: 'text', body: 'The Fourier transform changes how a vector is described: patterns in its entries become patterns of frequency and phase. The QFT performs this linear transformation on the amplitudes of a quantum register. A useful intuition is that each basis label contributes a phase ramp; different ramps interfere after transformation. The register remains quantum, so one measurement does not reveal the entire transformed vector.' },
          { type: 'steps', title: 'Numeric example — N=4', hint: 'Four basis states fit in two qubits.', steps: [
            'For x=0, every phase factor e^(2πi·0·k/4) equals 1.',
            'Thus QFT|0⟩=(|0⟩+|1⟩+|2⟩+|3⟩)/2. Each outcome has probability |1/2|²=1/4.',
            'For x=1, the amplitudes are (1,i,−1,−i)/2 as k runs from 0 to 3: a phase pattern rather than four different probabilities.',
            'The QFT preserves total probability because it is unitary. Measuring the x=1 output in this basis gives a uniform distribution, so the relative phases require an appropriate later interference operation to be useful.'
          ] },
          { type: 'equation', body: '$\\mathrm{QFT}|x\\rangle=\\frac{1}{\\sqrt{N}}\\sum_{k=0}^{N-1}e^{2\\pi i xk/N}|k\\rangle,\\quad N=2^n$', desc: 'The discrete Fourier transform applied to a computational-basis state, using the positive-phase convention.' },
          { type: 'text', body: 'A circuit factors the transform into Hadamards and controlled phase rotations, followed by a register reversal in common decompositions. The exact circuit uses O(n²) elementary controlled rotations for n qubits, with approximate versions dropping very small rotations. This can be compact compared with an N-entry classical transform, but the advantage depends on having the input amplitudes prepared efficiently and needing an output observable that can be extracted from samples. A QFT is not a free classical data transform.' },
          { type: 'quiz', question: { prompt: 'Under the stated QFT convention, what state results from applying a four-dimensional QFT to |0⟩?', options: ['(|0⟩+|1⟩+|2⟩+|3⟩)/2', '|0⟩ with certainty', '(|0⟩−|1⟩+|2⟩−|3⟩)/2', 'A non-normalized sum with amplitudes 1'], answer: 0, explain: 'For x=0 all phase factors are 1, and 1/√4=1/2 normalizes the equal superposition.' } },
          { type: 'points', items: ['The QFT transforms amplitudes, not a classical list of probabilities.', 'Relative phase is physically relevant because later gates can make amplitudes interfere.', 'The circuit uses structured controlled rotations and can be approximated by truncating small rotations.', 'Input preparation and output extraction are part of any runtime or advantage claim.'] },
          { type: 'quiz', question: { prompt: 'For QFT|0⟩ with N=4, what is the probability of measuring any one specified basis label?', options: ['1/4', '1/2', '1', '0'], answer: 0, explain: 'Each of the four amplitudes is 1/2, so each Born probability is (1/2)²=1/4.' } },
          { type: 'reflect', prompt: 'Why can the QFT create a useful phase pattern without making every transformed amplitude directly readable?', model: 'The QFT stores its output in coherent amplitudes and phases. Measurement samples a basis outcome, not the full vector; later interference or a suitable observable must expose the information the algorithm needs.' }
        ]
      },
      {
        id: 'deep-algorithms-phase-hhl',
        part: 'Deepening',
        title: 'Phase Estimation as a Route to Linear-System States',
        sections: [
          { type: 'text', body: 'Phase estimation turns a hidden rotation rate into bits. If a state is an eigenvector of a unitary, applying controlled powers of that unitary writes its eigenphase into a register through phase kickback. HHL uses this subroutine to estimate eigenvalues of a matrix-related evolution, apply an inverse-eigenvalue factor, and encode the solution direction in amplitudes. It is best understood as producing a quantum state useful for certain measurements, not a printed vector of all coordinates.' },
          { type: 'steps', title: 'Numeric example — three-bit phase readout', hint: 'Suppose U|u⟩=e^(2πiθ)|u⟩ with θ=3/8.', steps: [
            'Write 3/8 in binary: θ=0.011₂ exactly.',
            'A three-qubit precision register can represent the phase to increments of 1/8, so this dyadic phase is exactly representable in the ideal circuit.',
            'Controlled U, U², and U⁴ imprint phase information on the register; inverse QFT converts the phase pattern into the bit string 011.',
            'For a phase not exactly representable with the chosen number of bits, outcomes are distributed around nearby estimates rather than always giving one exact string.'
          ] },
          { type: 'equation', body: '$U|u\\rangle=e^{2\\pi i\\theta}|u\\rangle,\\quad A|u_i\\rangle=\\lambda_i|u_i\\rangle$', desc: 'Phase estimation reads a unitary eigenphase; HHL uses eigenvalue information to apply inverse spectral weights.' },
          { type: 'text', body: 'For a small example, take A=diag(1,2) and |b⟩=(|0⟩+|1⟩)/√2. Then A⁻¹|b⟩ is proportional to (1,1/2), and its normalized direction is (2/√5,1/√5). HHL can represent that direction as amplitudes after phase estimation and a controlled ancilla rotation. The method has important conditions: efficient preparation of |b⟩, sparse and suitably conditioned A, coherent simulation, and a useful observable or readout. Recovering every classical component can remove the apparent output advantage.' },
          { type: 'quiz', question: { prompt: 'With three phase bits, what binary string represents θ=3/8 exactly?', options: ['011', '101', '110', '001'], answer: 0, explain: 'The binary fraction 0.011₂ equals 0/2+1/4+1/8=3/8.' } },
          { type: 'points', items: ['Controlled powers create phase kickback on a precision register.', 'The inverse QFT converts that phase pattern into a digital estimate.', 'HHL applies reciprocal eigenvalue weights and returns a solution state up to normalization.', 'Sparsity, condition number, state preparation, fault tolerance, and output access govern practical applicability.'] },
          { type: 'quiz', question: { prompt: 'For A=diag(1,2) and b proportional to (1,1), what is the normalized direction of A⁻¹b?', options: ['(2/√5,1/√5)', '(1/√2,1/√2)', '(1/√5,2/√5)', '(1,2)'], answer: 0, explain: 'Applying A⁻¹ gives a vector proportional to (1,1/2), or equivalently (2,1). Its norm is √5, giving (2/√5,1/√5).' } },
          { type: 'reflect', prompt: 'Why is “HHL outputs the full classical solution vector quickly” an unsafe summary?', model: 'HHL prepares a quantum state proportional to the solution and supports certain measurements. State preparation, matrix conditions, coherent resources, postselection, and the cost of reading many classical components all affect end-to-end complexity.' }
        ]
      }
    ],
    'c-notation': [
      {
        id: 'deep-notation-bra-ket',
        part: 'Deepening',
        title: 'Bra-Ket Arithmetic: Scalars, Operators & Probabilities',
        sections: [
          { type: 'text', body: 'Dirac notation is a compact way to track both the shape and the role of a quantity. A ket is a column vector; a bra is its conjugate-transpose row. Put a bra before a ket and the dimensions contract to a scalar overlap. Put a ket before a bra and the dimensions expand into an operator. Similar-looking symbols therefore describe different mathematical objects.' },
          { type: 'steps', title: 'Numeric example — one overlap and one outer product', hint: 'Let |ψ⟩=(3/5,4/5)ᵀ and |0⟩=(1,0)ᵀ.', steps: [
            'The bra ⟨0| is the row (1,0), so ⟨0|ψ⟩=3/5, a scalar amplitude.',
            'The probability of obtaining 0 when measuring |ψ⟩ in this basis is |⟨0|ψ⟩|²=9/25=0.36.',
            'The reversed product |ψ⟩⟨0| is a matrix: [[3/5,0],[4/5,0]]. It maps an input vector to a multiple of |ψ⟩.',
            'Order and dimensions settle the question: row×column is a scalar; column×row is an operator.'
          ] },
          { type: 'equation', body: '$\\langle\\phi|\\psi\\rangle=\\phi^\\dagger\\psi,\\quad P(\\phi|\\psi)=|\\langle\\phi|\\psi\\rangle|^2,\\quad |\\psi\\rangle\\langle\\phi|=\\mathrm{operator}$', desc: 'The inner product gives an amplitude; the Born rule squares its magnitude to obtain a probability.' },
          { type: 'text', body: 'For complex coordinates, the dagger conjugates as well as transposes: if |ψ⟩=(a,b)ᵀ, then ⟨ψ|=(a*,b*). This conjugation makes ⟨ψ|ψ⟩=|a|²+|b|² nonnegative and real. A normalized ket has ⟨ψ|ψ⟩=1, while a measurement probability is the squared magnitude of an overlap with the relevant basis state. An overlap itself may be complex and is not generally a probability.' },
          { type: 'quiz', question: { prompt: 'What kind of object is ⟨0|ψ⟩?', options: ['A scalar amplitude', 'A 2×2 matrix', 'A probability by definition', 'A two-qubit ket'], answer: 0, explain: 'A bra row multiplied by a ket column gives a scalar. Its squared magnitude is the corresponding Born-rule probability.' } },
          { type: 'points', items: ['A ket |ψ⟩ is a vector and its bra ⟨ψ| is the conjugate transpose.', 'An inner product is a scalar; an outer product is an operator.', 'Complex conjugation is essential when forming a norm or overlap.', 'The Born rule converts an amplitude into a probability by taking its squared magnitude.'] },
          { type: 'quiz', question: { prompt: 'For |ψ⟩=(3/5)|0⟩+(4/5)|1⟩, what is the probability of outcome 0 in the computational basis?', options: ['9/25', '3/5', '16/25', '1'], answer: 0, explain: 'The outcome amplitude is 3/5, so the probability is |3/5|²=9/25.' } },
          { type: 'reflect', prompt: 'Use dimensions to explain the difference between ⟨φ|ψ⟩ and |ψ⟩⟨φ|.', model: 'The bra is a row and the ket is a column, so bra-times-ket contracts to a scalar overlap. Ket-times-bra is a column times a row, producing a matrix operator.' }
        ]
      },
      {
        id: 'deep-notation-density',
        part: 'Deepening',
        title: 'Expectation Values, Density Matrices & Coherence',
        sections: [
          { type: 'text', body: 'A ket describes one pure state, but experiments may prepare a statistical mixture, and noise can blur phase relationships. A density matrix handles both cases in a single notation. Its diagonal entries in a measurement basis give outcome probabilities; off-diagonal entries carry coherence that can affect measurements in another basis. Two preparations can therefore have identical computational-basis probabilities but different physical predictions elsewhere.' },
          { type: 'steps', title: 'Numeric example — a mixture versus a coherent state', hint: 'Compare a 75% |0⟩, 25% |1⟩ mixture with a pure state having the same basis probabilities.', steps: [
            'The mixture is ρmix=diag(0.75,0.25). Its trace is 1, its Z expectation is 0.75−0.25=0.5, and Tr(ρmix²)=0.75²+0.25²=0.625.',
            'The pure state |ψ⟩=(√3/2)|0⟩+(1/2)|1⟩ has density matrix [[0.75,√3/4],[√3/4,0.25]]. Its trace is 1 and its purity Tr(ρ²) is 1.',
            'Both give computational-basis probabilities 0.75 and 0.25, hence the same Z expectation 0.5.',
            'For the coherent state, ⟨X⟩=2(√3/2)(1/2)=√3/2≈0.866. For the diagonal mixture, ⟨X⟩=0. A measurement in the X basis distinguishes their coherence.'
          ] },
          { type: 'equation', body: '$\\langle O\\rangle=\\operatorname{Tr}(\\rho O),\\quad \\operatorname{Tr}(\\rho)=1,\\quad \\operatorname{Tr}(\\rho^2)=1\\text{ for a pure state}$', desc: 'Expectation values use the trace; purity distinguishes pure states from mixed states.' },
          { type: 'text', body: 'A pure state has ρ=|ψ⟩⟨ψ|, while a probabilistic ensemble has ρ=Σⱼpⱼ|ψⱼ⟩⟨ψⱼ|. Physical noise can suppress off-diagonal coherence, and a general channel acts as ρ↦ΣₖKₖρKₖ† with ΣₖKₖ†Kₖ=I for a trace-preserving process. For the qubit example, ρmix has purity 0.625<1; it is mixed even though it has no uncertainty about its own matrix. Purity is not a measure of a classical observer’s ignorance alone; it is a property of the quantum state description.' },
          { type: 'quiz', question: { prompt: 'For ρmix=diag(0.75,0.25), what is Tr(ρmix²)?', options: ['0.625', '1', '0.5', '0.75'], answer: 0, explain: 'The purity is 0.75²+0.25²=0.5625+0.0625=0.625, below 1 as expected for a mixed state.' } },
          { type: 'points', items: ['Density matrices represent pure states and statistical mixtures.', 'The trace is one for a normalized state.', 'Off-diagonal entries encode coherence and can change predictions in another basis.', 'Expectation values are Tr(ρO); purity Tr(ρ²) equals one for a pure state.'] },
          { type: 'quiz', question: { prompt: 'Why do the mixture and coherent pure state in the example differ under an X measurement?', options: ['The pure state has nonzero off-diagonal coherence, while the mixture does not', 'Their computational-basis probabilities differ', 'The mixture has trace zero', 'An X measurement cannot be performed on a qubit'], answer: 0, explain: 'The preparations have the same diagonal entries but different off-diagonal entries. Those coherences yield ⟨X⟩=√3/2 for the pure state and 0 for the mixture.' } },
          { type: 'reflect', prompt: 'How can two states agree on computational-basis probabilities yet disagree on another measurement?', model: 'The computational-basis probabilities are determined by the density matrix diagonal in that basis. Coherent off-diagonal terms can still differ and affect an observable such as X, so agreement in one basis does not mean the full states are identical.' }
        ]
      }
    ]
  };

  var courses = window.QML_COURSES;
  if (!Array.isArray(courses)) return;

  Object.keys(additions).forEach(function (courseId) {
    var course = courses.find(function (candidate) {
      return candidate && candidate.id === courseId;
    });
    if (!course || !Array.isArray(course.lessons)) return;

    var existingIds = new Set(course.lessons.map(function (lesson) {
      return lesson && lesson.id;
    }));
    additions[courseId].forEach(function (lesson) {
      if (existingIds.has(lesson.id)) return;
      course.lessons.push(lesson);
      existingIds.add(lesson.id);
    });
  });
})();
