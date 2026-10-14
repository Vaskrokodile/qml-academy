/* Additional explanatory lessons for the first six QML courses. */
(function () {
  'use strict';

  var additions = [
    {
      id: 'c-foundations',
      lessons: [
        {
          id: 'deep-foundations-flow',
          part: 'Deepening',
          title: 'Probability Flow: Conservation You Can Calculate',
          sections: [
            { type: 'text', body: 'A stochastic matrix is easiest to understand as a **routing rule for probability mass**. Each input state contributes its probability to several output states, and a valid rule never creates or destroys total probability. This is more than a definition: it is a practical debugging check. If a calculation produces totals other than one, either the input was not normalized or the transition matrix was assembled with the wrong convention.' },
            { type: 'steps', title: 'Worked example — route a three-outcome distribution', hint: 'Use column vectors, so column j tells where all mass from input j goes.', steps: [
              'Start with $p=(0.50,\ 0.30,\ 0.20)^T$. Its entries are nonnegative and sum to 1.',
              'Use $A=\\begin{pmatrix}0.8&0.1&0.2\\\\0.1&0.7&0.3\\\\0.1&0.2&0.5\\end{pmatrix}$. Each column sums to 1, so A is column-stochastic.',
              'The first output is $q_0=0.8(0.50)+0.1(0.30)+0.2(0.20)=0.47$.',
              'The second is $q_1=0.1(0.50)+0.7(0.30)+0.3(0.20)=0.32$.',
              'The third is $q_2=0.1(0.50)+0.2(0.30)+0.5(0.20)=0.21$.',
              'Check the result: $q=(0.47,\ 0.32,\ 0.21)^T$ is nonnegative and $0.47+0.32+0.21=1$. Probability moved between labels; none vanished.'
            ] },
            { type: 'equation', body: '$q=Ap,\\qquad \\mathbf{1}^{T}A=\\mathbf{1}^{T}\\quad\\Longrightarrow\\quad \\mathbf{1}^{T}q=\\mathbf{1}^{T}p=1$', desc: 'For a column-stochastic matrix, conservation follows from its column sums.' },
            { type: 'text', body: 'The formal statement comes from multiplying the output by the all-ones row vector: $\\mathbf{1}^{T}q=\\mathbf{1}^{T}Ap$. Since every column of A sums to one, $\\mathbf{1}^{T}A=\\mathbf{1}^{T}$, and therefore the output total equals the input total. Nonnegative entries matter too: normalization alone would not prevent a negative component, which cannot be an ordinary probability.' },
            { type: 'points', items: [
              'With column-vector distributions, **columns** of a left/column-stochastic matrix sum to one.',
              'The matrix convention and vector convention must be stated together; transposing one without the other changes the rule.',
              'This conservation check is analogous in spirit—but not in norm—to the quantum condition that unitary evolution preserves squared vector length.'
            ] },
            { type: 'quiz', question: {
              prompt: 'For the worked example, what is the second component of $q=Ap$?',
              options: ['$0.21$', '$0.32$', '$0.47$', '$0.50$'],
              answer: 1,
              explain: '$q_1=0.1(0.50)+0.7(0.30)+0.3(0.20)=0.05+0.21+0.06=0.32$.'
            } },
            { type: 'quiz', question: {
              prompt: 'Why do the columns of A sum to one in this column-vector convention?',
              options: ['So every basis input sends exactly one total unit of probability to the outputs', 'So A is necessarily symmetric', 'So every output probability is equal', 'So repeated application must reach a uniform distribution'],
              answer: 0,
              explain: 'Column j contains the destinations and weights for input state j. A column sum of one preserves the total mass of that basis input, and therefore of every distribution.'
            } },
            { type: 'reflect', prompt: 'Explain why the normalization check is useful even when every multiplication seems arithmetically correct.', model: 'A stochastic transition must preserve total probability. Checking nonnegativity and a total of one can reveal a transposed matrix, a mistyped entry, or an arithmetic error; it does not by itself prove every modeling assumption is correct.' }
          ]
        },
        {
          id: 'deep-foundations-amplitudes',
          part: 'Deepening',
          title: 'Why Amplitudes Need a Phase: A Two-Path Calculation',
          sections: [
            { type: 'text', body: 'Imagine two indistinguishable routes that can contribute to the same measurement outcome. Classical probability adds the route probabilities when the routes are alternatives. Quantum mechanics instead adds **amplitudes first**, then takes the squared magnitude. The difference is invisible if one only looks at a single route, but it matters when the alternatives can interfere: their signs or phases can reinforce or cancel.' },
            { type: 'steps', title: 'Worked example — the Hadamard gate recombines two paths', hint: 'Keep the sign of each amplitude. Do not square until the output amplitude has been assembled.', steps: [
              'Define $H=\\tfrac{1}{\\sqrt{2}}\\begin{pmatrix}1&1\\\\1&-1\\end{pmatrix}$, and let $|+\\rangle=(|0\\rangle+|1\\rangle)/\\sqrt{2}$.',
              'For input $|+\\rangle$, the two input amplitudes are each $1/\\sqrt{2}$.',
              'The output amplitude for 0 is $(1/\\sqrt{2})(1/\\sqrt{2})+(1/\\sqrt{2})(1/\\sqrt{2})=1$. The two contributions add.',
              'The output amplitude for 1 is $(1/\\sqrt{2})(1/\\sqrt{2})+(-1/\\sqrt{2})(1/\\sqrt{2})=0$. Opposite signs cancel.',
              'Thus $H|+\\rangle=|0\\rangle$: the output probabilities are $P(0)=1$ and $P(1)=0$.',
              'For comparison, $| -\\rangle=(|0\\rangle-|1\\rangle)/\\sqrt{2}$ gives $H| -\\rangle=|1\\rangle$. The relative sign changed the recombination.'
            ] },
            { type: 'equation', body: '$P(j)=|a_j|^2,\\qquad a_j=\\sum_k U_{jk}c_k$', desc: 'A linear transformation combines complex amplitudes for each output before the Born rule converts them to probabilities.' },
            { type: 'text', body: 'Formally, a state with amplitudes $c_k$ is transformed by matrix multiplication, so output component j is the sum $a_j=\\sum_k U_{jk}c_k$. Measurement then assigns probability $|a_j|^2$. Expanding that square creates cross terms such as $c_k^*c_\\ell$, which depend on relative phase. A classical probability vector has no corresponding signed or complex phase term. This explains interference without suggesting that every quantum process is faster or more useful: it is a rule for predicting outcomes, not a performance guarantee.' },
            { type: 'points', items: [
              'The order is **transform amplitudes → combine contributions → square magnitudes**.',
              'A minus sign is a relative phase of $\\pi$ and can make a contribution cancel another.',
              'Global phase multiplying the whole state does not change measurement probabilities; relative phase can.'
            ] },
            { type: 'quiz', question: {
              prompt: 'After applying H to $|+\\rangle$, what is the probability of outcome 1?',
              options: ['$1$', '$1/2$', '$0$', '$2$'],
              answer: 2,
              explain: 'The outcome-1 amplitude is the sum of equal and opposite contributions, so it is zero and its squared magnitude is zero.'
            } },
            { type: 'quiz', question: {
              prompt: 'At what stage does the Born rule square an amplitude?',
              options: ['Before the transformation is applied', 'After contributions to the measured output amplitude have been combined', 'Only after probabilities from separate runs are added', 'It never squares amplitudes'],
              answer: 1,
              explain: 'The transformed output amplitude is a sum of contributions. The probability for that outcome is the squared magnitude of this total amplitude.'
            } },
            { type: 'reflect', prompt: 'In a sentence, distinguish adding classical path probabilities from quantum path amplitudes.', model: 'Classical alternatives contribute probabilities directly, while quantum alternatives contribute amplitudes that can add or cancel before their squared magnitude becomes a probability.' }
          ]
        }
      ]
    },
    {
      id: 'c-states',
      lessons: [
        {
          id: 'deep-states-phase',
          part: 'Deepening',
          title: 'Global Phase, Relative Phase, and an Interference Test',
          sections: [
            { type: 'text', body: 'Two state vectors can look different on paper yet describe the same physical predictions. Multiplying every amplitude by the same phase $e^{i\\gamma}$ changes no measurement probability; this is called a **global phase**. Changing the phase of only one component is different: that **relative phase** can alter how a later gate combines amplitudes. A useful intuition is that an overall clock shift cannot change a comparison, but changing the timing between two paths can.' },
            { type: 'steps', title: 'Worked example — H makes relative phase observable', hint: 'The first measurement basis hides the phase; the second operation causes interference.', steps: [
              'Compare $|+\\rangle=(|0\\rangle+|1\\rangle)/\\sqrt{2}$ and $| -\\rangle=(|0\\rangle-|1\\rangle)/\\sqrt{2}$.',
              'In the computational basis, each state gives $P(0)=P(1)=1/2$ because each amplitude has magnitude $1/\\sqrt{2}$.',
              'Apply $H=\\tfrac{1}{\\sqrt{2}}\\begin{pmatrix}1&1\\\\1&-1\\end{pmatrix}$ to $|+\\rangle$: the output amplitudes are $(1,0)$, so the result is $|0\\rangle$.',
              'Apply H to $| -\\rangle$: the output amplitudes are $(0,1)$, so the result is $|1\\rangle$.',
              'The input probabilities matched, but their relative signs differed. H converted that phase difference into distinct, certain outcomes.'
            ] },
            { type: 'equation', body: '$|\\psi\\rangle\\sim e^{i\\gamma}|\\psi\\rangle,\\qquad H|+\\rangle=|0\\rangle,\\quad H| -\\rangle=|1\\rangle$', desc: 'The symbol ∼ means the two vectors represent the same physical pure state when they differ only by a global phase.' },
            { type: 'text', body: 'Technically, all outcome probabilities are squared overlaps with measurement vectors. If $|\\psi\\rangle$ is replaced by $e^{i\\gamma}|\\psi\\rangle$, every overlap gains that same factor and its squared magnitude is unchanged because $|e^{i\\gamma}|^2=1$. A relative phase is not a common factor, so it may change overlaps in a basis that mixes the components. This is why computational-basis statistics alone do not fully specify a qubit state.' },
            { type: 'quiz', question: {
              prompt: 'What does applying H to $| -\\rangle=(|0\\rangle-|1\\rangle)/\\sqrt{2}$ produce?',
              options: ['$|0\\rangle$', '$|1\\rangle$', '$|+\\rangle$', 'The zero vector'],
              answer: 1,
              explain: 'The minus sign causes the output-0 contributions to cancel and the output-1 contributions to add, yielding $|1\\rangle$.'
            } },
            { type: 'quiz', question: {
              prompt: 'Why does multiplying a whole ket by $e^{i\\gamma}$ leave measurement probabilities unchanged?',
              options: ['Because every overlap is multiplied by a unit-magnitude factor whose squared magnitude is 1', 'Because complex phases are always zero', 'Because measurement ignores all amplitudes', 'Because normalization changes to the 1-norm'],
              answer: 0,
              explain: 'For any measurement outcome, the amplitude picks up the common factor $e^{i\\gamma}$; its probability gains $|e^{i\\gamma}|^2=1$.'
            } },
            { type: 'reflect', prompt: 'Why can two states with identical computational-basis probabilities still behave differently after a gate?', model: 'Their component amplitudes may have different relative phases. A gate that mixes basis components can make those phases interfere differently, producing different later probabilities.' }
          ]
        },
        {
          id: 'deep-states-bloch',
          part: 'Deepening',
          title: 'Reading a Qubit on the Bloch Sphere',
          sections: [
            { type: 'text', body: 'The Bloch sphere turns a normalized pure qubit into a geometric picture. The north-south coordinate tracks the imbalance between computational outcomes; the direction around the equator tracks relative phase. Thus the sphere is not just decoration: it summarizes which measurement directions will be predictable. A point at a pole is certain in the computational basis, while an equatorial point is balanced there but can be certain in a different basis.' },
            { type: 'steps', title: 'Worked example — one state, three measurement questions', hint: 'Use $|\\psi\\rangle=\\cos(\\theta/2)|0\\rangle+e^{i\\phi}\\sin(\\theta/2)|1\\rangle$ with $\\theta=60^\\circ$ and $\\phi=90^\\circ$.', steps: [
              'The amplitudes are $\\sqrt{3}/2$ and $i/2$, so computational-basis probabilities are $P(0)=3/4$ and $P(1)=1/4$.',
              'The Bloch vector is $r=(\\sin\\theta\\cos\\phi,\\sin\\theta\\sin\\phi,\\cos\\theta)=(0,\\sqrt{3}/2,1/2)$.',
              'For an X-basis measurement, $P(+x)=(1+r_x)/2=1/2$ and $P(-x)=1/2$.',
              'For a Y-basis measurement, $P(+y)=(1+r_y)/2=(2+\\sqrt{3})/4\\approx0.933$ and $P(-y)=(2-\\sqrt{3})/4\\approx0.067$.',
              'The same amplitudes therefore give a 75/25 split along Z, a 50/50 split along X, and about a 93/7 split along Y.'
            ] },
            { type: 'equation', body: '$|\\psi\\rangle=\\cos(\\theta/2)|0\\rangle+e^{i\\phi}\\sin(\\theta/2)|1\\rangle,\\qquad r=(\\sin\\theta\\cos\\phi,\\sin\\theta\\sin\\phi,\\cos\\theta)$', desc: 'For a pure qubit, the angles give a unit Bloch vector; measurement along unit direction n has probabilities $(1\\pm n\\cdot r)/2$.' },
            { type: 'text', body: 'The formal measurement rule can be written with Pauli observables: the expectation along unit direction $n$ is $\\langle n\\cdot\\sigma\\rangle=n\\cdot r$. Since a two-outcome observable has eigenvalues +1 and −1, its probabilities must sum to one and have difference equal to that expectation; solving gives $(1\\pm n\\cdot r)/2$. This derivation links geometry to the Born rule. The angle $\\theta/2$ in the ket is essential: the Bloch vector uses angle $\\theta$, reflecting the double-angle relation between spinor amplitudes and measured orientation.' },
            { type: 'quiz', question: {
              prompt: 'For $\\theta=60^\\circ$, $\\phi=90^\\circ$, what is the computational-basis probability $P(0)$?',
              options: ['$1/4$', '$1/2$', '$3/4$', '$1$'],
              answer: 2,
              explain: 'The $|0\\rangle$ amplitude is $\\cos(30^\\circ)=\\sqrt{3}/2$, whose squared magnitude is $3/4$.'
            } },
            { type: 'quiz', question: {
              prompt: 'For the same state, what is $P(+y)$ when measured along the Y direction?',
              options: ['$(2-\\sqrt{3})/4$', '$1/2$', '$(2+\\sqrt{3})/4$', '$3/4$'],
              answer: 2,
              explain: 'Here $r_y=\\sin(60^\\circ)\\sin(90^\\circ)=\\sqrt{3}/2$, so $P(+y)=(1+r_y)/2=(2+\\sqrt{3})/4\\approx0.933$.'
            } },
            { type: 'reflect', prompt: 'What does the azimuth angle φ encode, and why can it be hidden in one measurement basis?', model: 'The azimuth encodes relative phase between the two computational amplitudes. A Z-basis measurement depends only on their magnitudes, while measurements along other axes mix the components and can reveal phase through interference.' }
          ]
        }
      ]
    },
    {
      id: 'c-multi',
      lessons: [
        {
          id: 'deep-multi-products',
          part: 'Deepening',
          title: 'Tensor Products as Joint Probability Bookkeeping',
          sections: [
            { type: 'text', body: 'A tensor product is the bookkeeping rule for every joint possibility of multiple systems. For product states, each joint amplitude is the product of its local amplitudes, so measuring in the matching product basis gives independent probabilities that multiply. The dimension grows quickly—n qubits have $2^n$ basis labels—but the notation keeps track of which subsystem contributes each factor.' },
            { type: 'steps', title: 'Worked example — two unequal qubit distributions', hint: 'Write the basis in the order $|00\\rangle,|01\\rangle,|10\\rangle,|11\\rangle$; the right-hand qubit varies fastest.', steps: [
              'Let $|a\\rangle=\\tfrac{1}{2}|0\\rangle+\\tfrac{\\sqrt{3}}{2}|1\\rangle$ and $|b\\rangle=\\sqrt{0.8}|0\\rangle+\\sqrt{0.2}|1\\rangle$.',
              'Their joint state is $|a\\rangle\\otimes|b\\rangle$ with amplitudes $(0.4472,\\ 0.2236,\\ 0.7746,\\ 0.3873)$, approximately.',
              'Squaring gives probabilities for $00,01,10,11$: $(0.20,\\ 0.05,\\ 0.60,\\ 0.15)$. They sum to 1.',
              'The probability that the left qubit is 0 is $P(00)+P(01)=0.20+0.05=0.25$, matching $|1/2|^2$.',
              'The probability that the right qubit is 0 is $P(00)+P(10)=0.20+0.60=0.80$, matching $|\\sqrt{0.8}|^2$.',
              'The joint probabilities factor: for example $P(10)=0.75\\times0.80=0.60$. This product rule relies on the state being a product and the measurement being in these local bases.'
            ] },
            { type: 'equation', body: '$(a_0|0\\rangle+a_1|1\\rangle)\\otimes(b_0|0\\rangle+b_1|1\\rangle)=a_0b_0|00\\rangle+a_0b_1|01\\rangle+a_1b_0|10\\rangle+a_1b_1|11\\rangle$', desc: 'The tensor product distributes over sums and multiplies the corresponding amplitudes.' },
            { type: 'text', body: 'More technically, tensor products define the composite vector space: if each subsystem has dimension 2, their joint space has dimension 4. A pure two-qubit state is a product only if its coefficient array has rank one; equivalently, its amplitudes can be written $c_{ij}=a_i b_j$. In the numerical example that condition holds by construction. A general joint state need not factor, and then the joint statistics cannot be reconstructed from independent local state vectors.' },
            { type: 'quiz', question: {
              prompt: 'In the worked example, what is $P(10)$?',
              options: ['$0.05$', '$0.15$', '$0.20$', '$0.60$'],
              answer: 3,
              explain: '$P(10)=P_a(1)P_b(0)=0.75(0.80)=0.60$, equivalently the squared amplitude $|0.7746|^2$.'
            } },
            { type: 'quiz', question: {
              prompt: 'What is the dimension of the joint state space for three qubits?',
              options: ['$3$', '$6$', '$8$', '$9$'],
              answer: 2,
              explain: 'Each qubit contributes a factor of 2, so the tensor-product dimension is $2^3=8$.'
            } },
            { type: 'reflect', prompt: 'Why can local probabilities be multiplied in the example, and what assumption would fail for an entangled state?', model: 'The state is explicitly a tensor product and the measurement is a product-basis measurement, so amplitudes and probabilities factor. An entangled state has no such decomposition into independent local kets.' }
          ]
        },
        {
          id: 'deep-multi-bell',
          part: 'Deepening',
          title: 'Bell Correlations and What a Reduced State Hides',
          sections: [
            { type: 'text', body: 'The Bell state $|\\Phi^+\\rangle=(|00\\rangle+|11\\rangle)/\\sqrt{2}$ has a simple prediction: measuring both qubits in the computational basis gives matching outcomes, each with probability one half. Yet neither qubit alone has a definite computational value. This contrast is the point of a joint state: local statistics can look random while the relation between the outcomes is exact.' },
            { type: 'steps', title: 'Worked example — calculate joint and local statistics', hint: 'Use the Born rule on the two nonzero basis amplitudes, then sum over the unobserved qubit.', steps: [
              'The only nonzero amplitudes are $c_{00}=1/\\sqrt{2}$ and $c_{11}=1/\\sqrt{2}$.',
              'Their probabilities are $P(00)=1/2$ and $P(11)=1/2$; $P(01)=P(10)=0$.',
              'The left-qubit marginal is $P(0)=P(00)+P(01)=1/2$ and $P(1)=1/2$.',
              'The right-qubit marginal is also $(1/2,1/2)$. If the left outcome is observed to be 0, the conditional right outcome is 0 with probability 1.',
              'Tracing out either qubit gives $\\rho_{\\mathrm{local}}=I/2$. That single-qubit density matrix records the local randomness but not the perfect joint correlation.'
            ] },
            { type: 'equation', body: '$|\\Phi^+\\rangle=\\frac{|00\\rangle+|11\\rangle}{\\sqrt{2}},\\qquad \\rho_A=\\mathrm{Tr}_B(|\\Phi^+\\rangle\\langle\\Phi^+|)=\\frac{I}{2}$', desc: 'A pure joint state can have a mixed reduced state for either subsystem.' },
            { type: 'text', body: 'The partial trace is the formal operation that discards access to subsystem B while preserving all predictions for measurements on A. The cross terms in the joint projector vanish under that trace because $\\langle0|1\\rangle=0$, leaving $I/2$. A classical shared random bit can reproduce these computational-basis correlations, so matching outcomes in this one basis alone does **not** establish entanglement. Entanglement is a statement about the joint state not factoring; more complete tests compare predictions across measurement choices.' },
            { type: 'quiz', question: {
              prompt: 'For $|\\Phi^+\\rangle$, what is the probability of joint outcome $01$ in the computational basis?',
              options: ['$0$', '$1/4$', '$1/2$', '$1$'],
              answer: 0,
              explain: 'There is no $|01\\rangle$ term, so its amplitude and Born probability are both zero.'
            } },
            { type: 'quiz', question: {
              prompt: 'What is the reduced state of either qubit in $|\\Phi^+\\rangle$?',
              options: ['$|0\\rangle\\langle0|$', '$I/2$', '$|+\\rangle\\langle+|$', 'The zero matrix'],
              answer: 1,
              explain: 'Taking the partial trace of the Bell-state projector leaves equal diagonal weights and no local coherence: $I/2$.'
            } },
            { type: 'reflect', prompt: 'How can each qubit be locally random while the pair has perfectly matching results?', model: 'The joint state assigns weight only to $00$ and $11$, so the marginal for either side is 50/50 while conditioning on one result fixes the other. The correlation belongs to the pair, not to a definite local value.' }
          ]
        }
      ]
    },
    {
      id: 'c-measure',
      lessons: [
        {
          id: 'deep-measure-project',
          part: 'Deepening',
          title: 'Projectors: Probability, Filtering, and Renormalization',
          sections: [
            { type: 'text', body: 'A projective measurement can be pictured as a filter. The projector for an outcome keeps the component of the state aligned with that outcome and removes the orthogonal component. The length that remains tells us how likely the result was; if that result occurs, we normalize the surviving vector to make a valid new state. Separating these steps prevents a common mistake: the projected vector is generally not normalized.' },
            { type: 'steps', title: 'Worked example — measure an unequal superposition', hint: 'Take $|\\psi\\rangle=(\\sqrt{3}/2)|0\\rangle+(1/2)|1\\rangle$.', steps: [
              'Check the input norm: $3/4+1/4=1$.',
              'For outcome 0, $P_0=|0\\rangle\\langle0|$ gives $P_0|\\psi\\rangle=(\\sqrt{3}/2)|0\\rangle$.',
              'The probability of outcome 0 is the squared length $3/4$; the probability of outcome 1 is $1/4$.',
              'If outcome 0 occurs, divide the projected vector by $\\sqrt{3/4}=\\sqrt{3}/2$ to obtain $|0\\rangle$.',
              'If outcome 1 occurs, the projected vector is $(1/2)|1\\rangle$; dividing by $1/2$ gives $|1\\rangle$.',
              'The two probabilities sum to one, and either recorded outcome leaves a normalized post-measurement state.'
            ] },
            { type: 'equation', body: '$p_j=\\langle\\psi|P_j|\\psi\\rangle=\\|P_j|\\psi\\rangle\\|^2,\\qquad |\\psi_j\\rangle=\\frac{P_j|\\psi\\rangle}{\\sqrt{p_j}}\\quad(p_j>0)$', desc: 'Born probability and conditional post-measurement state for a projective outcome.' },
            { type: 'text', body: 'For an orthogonal projective measurement, the projectors satisfy $P_j^2=P_j$, $P_j^\\dagger=P_j$, $P_jP_k=0$ for distinct outcomes, and $\\sum_jP_j=I$. These relations imply completeness: summing the outcome probabilities gives $\\langle\\psi|I|\\psi\\rangle=1$. The normalization formula applies only when $p_j>0$; a zero-probability outcome cannot occur, so there is no conditional state to normalize for it.' },
            { type: 'quiz', question: {
              prompt: 'For the worked state, what is the probability of outcome 1?',
              options: ['$1/4$', '$1/2$', '$3/4$', '$1$'],
              answer: 0,
              explain: 'The outcome-1 amplitude is $1/2$, so its probability is $|1/2|^2=1/4$.'
            } },
            { type: 'quiz', question: {
              prompt: 'Why is $P_j|\\psi\\rangle$ divided by $\\sqrt{p_j}$ after observing outcome j?',
              options: ['To remove the phase from the original ket', 'To make the conditional post-measurement state have unit norm', 'To change the outcome probability to zero', 'To turn a projector into a unitary'],
              answer: 1,
              explain: 'The projected vector has squared norm $p_j$. Dividing by its norm $\\sqrt{p_j}$ makes the conditional state normalized.'
            } },
            { type: 'reflect', prompt: 'State the three measurement steps in order: probability, projection, and normalization.', model: 'Compute the Born probability from the squared norm of the projected component; if that outcome occurs, project onto it; then divide by the square root of its probability to normalize the conditional state.' }
          ]
        },
        {
          id: 'deep-measure-basis',
          part: 'Deepening',
          title: 'Changing Measurement Basis Changes the Question',
          sections: [
            { type: 'text', body: 'A measurement basis defines which alternatives count as distinct answers. Measuring in the computational basis asks whether the result is 0 or 1; measuring in the X basis asks whether it is plus or minus. A state can be biased for one question and nearly certain for another. This is not an inconsistency: probabilities belong to a state **and** a specified measurement.' },
            { type: 'steps', title: 'Worked example — express a state in the X basis', hint: 'Use $|+\\rangle=(|0\\rangle+|1\\rangle)/\\sqrt{2}$ and $| -\\rangle=(|0\\rangle-|1\\rangle)/\\sqrt{2}$.', steps: [
              'Take $|\\psi\\rangle=(\\sqrt{3}/2)|0\\rangle+(1/2)|1\\rangle$. It is normalized.',
              'The plus amplitude is $\\langle+|\\psi\\rangle=(\\sqrt{3}+1)/(2\\sqrt{2})$.',
              'Therefore $P(+)=|\\langle+|\\psi\\rangle|^2=(2+\\sqrt{3})/4\\approx0.933$.',
              'The minus amplitude is $\\langle-|\\psi\\rangle=(\\sqrt{3}-1)/(2\\sqrt{2})$.',
              'Therefore $P(-)=(2-\\sqrt{3})/4\\approx0.067$; the two values sum to one.',
              'In the Z basis the same state gave probabilities $0.75$ and $0.25$. Basis choice changes the question and hence the outcome distribution.'
            ] },
            { type: 'equation', body: '$P(\\pm)=|\\langle\\pm|\\psi\\rangle|^2,\\qquad P(+)=\\frac{2+\\sqrt{3}}{4},\\quad P(-)=\\frac{2-\\sqrt{3}}{4}$', desc: 'The X-basis probabilities are squared overlaps with its orthonormal basis kets.' },
            { type: 'text', body: 'More generally, for orthonormal basis vectors $|b_j\\rangle$, the measurement projectors are $P_j=|b_j\\rangle\\langle b_j|$, and $p_j=|\\langle b_j|\\psi\\rangle|^2$. Orthonormality and completeness ensure $\\sum_jP_j=I$, so the probabilities normalize. Equivalently, a unitary change-of-basis matrix first expresses the same vector in new coordinates; it does not physically alter the state unless it is actually applied as an operation.' },
            { type: 'quiz', question: {
              prompt: 'For the worked state, approximately what is the probability of the X-basis plus outcome?',
              options: ['0.067', '0.25', '0.75', '0.933'],
              answer: 3,
              explain: 'The exact value $(2+\\sqrt{3})/4$ is approximately 0.933. It is the squared overlap with $|+\\rangle$.'
            } },
            { type: 'quiz', question: {
              prompt: 'What is the role of an orthonormal measurement basis?',
              options: ['It defines the possible outcomes and gives complete, mutually orthogonal projectors', 'It forces all states to be uniformly random', 'It changes every pure state into a mixed state before measurement', 'It guarantees outcomes in different bases can be read simultaneously'],
              answer: 0,
              explain: 'Each basis ket labels an outcome. Orthonormality makes the projectors mutually orthogonal, and a complete basis makes their sum the identity.'
            } },
            { type: 'reflect', prompt: 'Why is “the state is 75/25” incomplete unless a basis is named?', model: 'Those numbers describe outcomes only for a particular measurement basis. A different orthonormal basis uses different overlaps with the same state and can produce a different distribution.' }
          ]
        }
      ]
    },
    {
      id: 'c-mixed',
      lessons: [
        {
          id: 'deep-mixed-coherence',
          part: 'Deepening',
          title: 'Pure Superposition or Classical Mixture?',
          sections: [
            { type: 'text', body: 'A fifty-fifty measurement result does not tell you by itself whether a qubit is in a coherent superposition or in a classical mixture. Both can produce half zeros and half ones in the computational basis. The difference is in the off-diagonal entries of the density matrix: a coherent state retains phase relationships that another measurement can reveal, while the corresponding classical mixture does not.' },
            { type: 'steps', title: 'Worked example — the Z basis hides the distinction', hint: 'Compare a pure $|+\\rangle$ state with a 50/50 preparation mixture of $|0\\rangle$ and $|1\\rangle$.', steps: [
              'For $|+\\rangle=(|0\\rangle+|1\\rangle)/\\sqrt{2}$, form $\\rho_+=|+\\rangle\\langle+|=\\tfrac12\\begin{pmatrix}1&1\\\\1&1\\end{pmatrix}$.',
              'For the classical mixture, $\\rho_{mix}=\\tfrac12|0\\rangle\\langle0|+\\tfrac12|1\\rangle\\langle1|=\\tfrac12\\begin{pmatrix}1&0\\\\0&1\\end{pmatrix}$.',
              'Both matrices have diagonal $(1/2,1/2)$, so both give 50/50 outcomes in the computational (Z) basis.',
              'In the X basis, $|+\\rangle$ gives plus with probability 1 and minus with probability 0.',
              'The mixture gives plus and minus with probability 1/2 each. It has no off-diagonal coherence to support constructive or destructive interference.',
              'Their purities also differ: $\\mathrm{Tr}(\\rho_+^2)=1$, while $\\mathrm{Tr}(\\rho_{mix}^2)=1/2$.'
            ] },
            { type: 'equation', body: '$\\rho_+=\\frac12\\begin{pmatrix}1&1\\\\1&1\\end{pmatrix},\\qquad \\rho_{mix}=\\frac12 I,\\qquad P(+_X)=\\mathrm{Tr}(|+\\rangle\\langle+|\\rho)$', desc: 'Density matrices predict measurement statistics through traces with the corresponding projectors.' },
            { type: 'text', body: 'A valid density matrix is Hermitian, positive semidefinite, and has trace one. A pure state projector has rank one and purity $\\mathrm{Tr}(\\rho^2)=1$; a nontrivial mixture has purity below one. In the example, the off-diagonal entries are the coherences in the Z representation. They are not extra probabilities: they encode phase-sensitive information that changes predictions for measurements in other bases.' },
            { type: 'quiz', question: {
              prompt: 'Which measurement distinguishes $|+\\rangle\\langle+|$ from $I/2$ most directly?',
              options: ['Computational-basis measurement, because their Z probabilities differ', 'X-basis measurement, because the pure state is always plus but the mixture is 50/50', 'No measurement can distinguish them', 'A measurement of trace, because their traces differ'],
              answer: 1,
              explain: 'They have the same Z probabilities, but in the X basis $|+\\rangle$ is certain while $I/2$ gives equal outcomes. Both traces are one.'
            } },
            { type: 'quiz', question: {
              prompt: 'What is the purity $\\mathrm{Tr}(\\rho^2)$ of the maximally mixed qubit $I/2$?',
              options: ['$0$', '$1/4$', '$1/2$', '$1$'],
              answer: 2,
              explain: '$(I/2)^2=I/4$, whose trace in dimension two is $2/4=1/2$.'
            } },
            { type: 'reflect', prompt: 'What evidence would show that a 50/50 computational-basis result is not enough to identify the state?', model: 'A different basis can reveal different statistics: the coherent plus state is certain in the X basis, while a classical 50/50 mixture remains random there. The off-diagonal density-matrix entries encode this distinction.' }
          ]
        },
        {
          id: 'deep-mixed-dephasing',
          part: 'Deepening',
          title: 'Partial Dephasing as a Quantitative Model',
          sections: [
            { type: 'text', body: 'Noise often weakens phase coherence without immediately changing the populations of the computational basis states. A simple model makes that gradual loss visible: begin with $|+\\rangle$ and let its off-diagonal terms shrink by a visibility factor $\\nu$. At $\\nu=1$ the original pure state remains; at $\\nu=0$ the state is the equal classical mixture. Intermediate values describe partial coherence, not an all-or-nothing switch.' },
            { type: 'steps', title: 'Worked example — read probabilities from visibility', hint: 'For this example, use the dephased state $\\rho=\\tfrac12\\begin{pmatrix}1&\\nu\\\\\\nu&1\\end{pmatrix}$ with $\\nu=0.6$.', steps: [
              'Substitute $\\nu=0.6$: $\\rho=\\begin{pmatrix}0.5&0.3\\\\0.3&0.5\\end{pmatrix}$. Its trace is 1.',
              'The Z-basis probabilities are the diagonal entries: $P(0)=P(1)=0.5$. Dephasing has not changed these populations.',
              'The X-plus projector is $P_+=(I+X)/2$, so $P(+)=\\mathrm{Tr}(P_+\\rho)=(1+\\nu)/2=0.8$.',
              'Consequently $P(-)=(1-\\nu)/2=0.2$; coherence still biases the X-basis measurement toward plus.',
              'The eigenvalues are $(1+\\nu)/2=0.8$ and $(1-\\nu)/2=0.2$, giving purity $\\mathrm{Tr}(\\rho^2)=(1+\\nu^2)/2=0.68$.',
              'At $\\nu=1$ these values become a pure plus state; at $\\nu=0$ they become a 50/50 mixture with $P(+)=1/2$.'
            ] },
            { type: 'equation', body: '$\\rho_\\nu=\\frac12\\begin{pmatrix}1&\\nu\\\\\\nu&1\\end{pmatrix},\\qquad P(+_X)=\\frac{1+\\nu}{2},\\qquad \\mathrm{Tr}(\\rho_\\nu^2)=\\frac{1+\\nu^2}{2}$', desc: 'This one-qubit dephasing family has fixed Z populations and tunable coherence.' },
            { type: 'text', body: 'For $0\\leq\\nu\\leq1$, the eigenvalues are nonnegative, so the matrix is positive semidefinite; its unit trace makes it a density matrix. One implementation is a phase-flip channel applied to $|+\\rangle$: with probability $p$, apply Z, and otherwise do nothing. Averaging the two possibilities gives $\\nu=1-2p$ for $0\\leq p\\leq1/2$. This is an illustrative model, not a complete description of every hardware noise process; actual devices can have several error mechanisms and timescales.' },
            { type: 'quiz', question: {
              prompt: 'At visibility $\\nu=0.6$, what is the X-plus probability?',
              options: ['$0.2$', '$0.5$', '$0.6$', '$0.8$'],
              answer: 3,
              explain: '$P(+_X)=(1+\\nu)/2=(1+0.6)/2=0.8$.'
            } },
            { type: 'quiz', question: {
              prompt: 'Which part of $\\rho_\\nu$ changes as dephasing lowers $\\nu$ in this model?',
              options: ['The trace changes from 1 to 0', 'The diagonal populations change, but coherence stays fixed', 'The off-diagonal coherence shrinks while the diagonal populations stay at 1/2', 'The state becomes non-Hermitian'],
              answer: 2,
              explain: 'The two diagonal entries remain 1/2. The off-diagonal entries are $\\nu/2$, so they vanish as visibility approaches zero.'
            } },
            { type: 'reflect', prompt: 'Why can Z-basis measurements fail to notice this dephasing even though the state changes?', model: 'This model leaves the diagonal populations at one half each, so Z statistics stay 50/50. The off-diagonal coherence changes, which instead affects phase-sensitive measurements such as the X basis.' }
          ]
        }
      ]
    },
    {
      id: 'c-dynamics',
      lessons: [
        {
          id: 'deep-dynamics-unitary',
          part: 'Deepening',
          title: 'Unitarity as Length Preservation and Reversibility',
          sections: [
            { type: 'text', body: 'A unitary gate is like a rigid rotation of a state vector: it may redistribute amplitudes among basis labels, but it cannot stretch the state or lose information. That picture explains two important properties at once. Normalized inputs remain normalized, and the transformation can be undone. The Hadamard gate provides a small calculation where both properties can be checked explicitly.' },
            { type: 'steps', title: 'Worked example — H creates and then removes a superposition', hint: 'Use $H=\\tfrac{1}{\\sqrt{2}}\\begin{pmatrix}1&1\\\\1&-1\\end{pmatrix}$.', steps: [
              'Apply H to $|0\\rangle=(1,0)^T$: the output is $|+\\rangle=(1/\\sqrt{2},1/\\sqrt{2})^T$.',
              'The output norm is $1/2+1/2=1$, and a computational-basis measurement is 50/50.',
              'Apply H again: the first amplitude is $(1/2)+(1/2)=1$; the second is $(1/2)-(1/2)=0$.',
              'Thus $H^2|0\\rangle=|0\\rangle$: the second application reverses the first.',
              'More generally, direct multiplication gives $H^\\dagger H=H^2=I$, so H is unitary and its own inverse.'
            ] },
            { type: 'equation', body: '$U^\\dagger U=I\\quad\\Longrightarrow\\quad \\langle U\\psi|U\\psi\\rangle=\\langle\\psi|U^\\dagger U|\\psi\\rangle=\\langle\\psi|\\psi\\rangle$', desc: 'Unitaries preserve inner products and therefore preserve normalization.' },
            { type: 'text', body: 'The inner-product identity is the technical reason behind the rotation intuition. Since $U^\\dagger U=I$, every pair of vectors keeps the same inner product after evolution; in particular, each vector keeps its norm. The inverse is $U^\\dagger$, because multiplying it by U in either order gives identity. These conclusions apply to ideal closed-system evolution. If a subsystem interacts with an unobserved environment, its reduced state can instead evolve non-unitarily even though the larger closed system has unitary dynamics.' },
            { type: 'quiz', question: {
              prompt: 'What is the result of applying the Hadamard gate twice to $|0\\rangle$?',
              options: ['$|1\\rangle$', '$|+\\rangle$', '$|0\\rangle$', 'The zero vector'],
              answer: 2,
              explain: '$H^2=I$, so the second application reverses the first and returns $|0\\rangle$.'
            } },
            { type: 'quiz', question: {
              prompt: 'Which equation states that U preserves the norm of every state?',
              options: ['$U^\\dagger U=I$', '$U+U^\\dagger=0$', '$\\det U=0$', '$U^2=0$'],
              answer: 0,
              explain: 'From $U^\\dagger U=I$, we obtain $\\langle U\\psi|U\\psi\\rangle=\\langle\\psi|\\psi\\rangle$ for every $|\\psi\\rangle$.'
            } },
            { type: 'reflect', prompt: 'Connect the algebraic condition $U^\\dagger U=I$ to normalization and reversibility.', model: 'It preserves every inner product, including a state’s squared norm, so normalized states stay normalized. The adjoint is also an inverse, so ideal unitary evolution can be undone.' }
          ]
        },
        {
          id: 'deep-dynamics-ising',
          part: 'Deepening',
          title: 'A Two-Spin Ising Model: Energies Before Algorithms',
          sections: [
            { type: 'text', body: 'An Ising model assigns an energy to each configuration of spins $s_i\\in\\{+1,-1\\}$. The useful first habit is to calculate the energy table before discussing how to find a low-energy configuration. Couplings reward or penalize pairs, while local fields favor one orientation. The signs in the Hamiltonian determine those preferences, so a small numeric example is safer than relying on slogans about aligned or opposed spins.' },
            { type: 'steps', title: 'Worked example — enumerate all four configurations', hint: 'Use $E(s_1,s_2)=-J s_1s_2-h(s_1+s_2)$ with $J=1$, $h=0.2$.', steps: [
              'For $(+1,+1)$: $E=-1(1)-0.2(2)=-1.4$.',
              'For $(+1,-1)$: $E=-1(-1)-0.2(0)=+1$.',
              'For $(-1,+1)$: the same calculation gives $E=+1$.',
              'For $(-1,-1)$: $E=-1(1)-0.2(-2)=-0.6$.',
              'The ground configuration is $(+1,+1)$ with energy $-1.4$, the minimum of these four values.',
              'At inverse temperature $\\beta=1$ in reciprocal energy units, Boltzmann weights are $e^{1.4},e^{-1},e^{-1},e^{0.6}$ in the same order; divide each by their sum to obtain normalized thermal probabilities.'
            ] },
            { type: 'equation', body: '$E(s)=-J s_1s_2-h(s_1+s_2),\\qquad p(s)=\\frac{e^{-\\beta E(s)}}{Z},\\qquad Z=\\sum_s e^{-\\beta E(s)}$', desc: 'The ground state minimizes E; at finite temperature, the Gibbs distribution assigns weight to every configuration.' },
            { type: 'text', body: 'The partition function Z is the normalization that makes the Boltzmann probabilities sum to one. Here the energies are $(-1.4,+1,+1,-0.6)$ and at $\\beta=1$ the partition function is approximately $4.0552+0.3679+0.3679+1.8221=6.6131$. The corresponding probabilities are about $(0.613,0.056,0.056,0.276)$. This is a finite-temperature distribution, not a deterministic ground-state answer. The same diagonal energy function can be represented by a two-qubit Hamiltonian using Z operators, but writing that Hamiltonian down does not itself establish an algorithmic speedup.' },
            { type: 'quiz', question: {
              prompt: 'With $J=1$ and $h=0.2$, what is the energy of configuration $(+1,-1)$?',
              options: ['$-1.4$', '$-0.6$', '$0$', '$+1$'],
              answer: 3,
              explain: 'The spin product is $-1$ and the sum is 0, so $E=-1(-1)-0.2(0)=+1$.'
            } },
            { type: 'quiz', question: {
              prompt: 'What does the partition function Z do in $p(s)=e^{-\\beta E(s)}/Z$?',
              options: ['Selects only the lowest-energy configuration', 'Normalizes the Boltzmann weights so probabilities sum to one', 'Changes the spin values from $\\pm1$ to 0 or 1', 'Guarantees the distribution is uniform'],
              answer: 1,
              explain: '$Z=\\sum_s e^{-\\beta E(s)}$ is the sum of all weights, so dividing by Z produces a normalized distribution.'
            } },
            { type: 'reflect', prompt: 'Why should one distinguish finding the ground state from sampling a finite-temperature state?', model: 'Ground-state search asks for a configuration with minimum energy. A finite-temperature Gibbs distribution assigns probabilities to all configurations according to their energies, so higher-energy outcomes can still occur.' }
          ]
        }
      ]
    }
  ];

  var courses = window.QML_COURSES;
  if (!Array.isArray(courses)) return;

  additions.forEach(function (addition) {
    var course = courses.find(function (candidate) {
      return candidate && candidate.id === addition.id;
    });
    if (!course || !Array.isArray(course.lessons)) return;

    var existingIds = new Set(course.lessons.map(function (lesson) {
      return lesson && lesson.id;
    }));
    addition.lessons.forEach(function (lesson) {
      if (existingIds.has(lesson.id)) return;
      course.lessons.push(lesson);
      existingIds.add(lesson.id);
    });
  });
}());
