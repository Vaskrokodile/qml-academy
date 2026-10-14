/* Dedicated course: one-qubit gates, Bloch-sphere geometry, and QML circuits.
   Loaded after courses.js; append rather than replace the global course list. */
(window.QML_COURSES || (window.QML_COURSES = [])).push({
  id: 'c-bloch-gates',
  title: 'Bloch Sphere & Quantum Gates',
  subtitle: 'Read a qubit as a point, then move it with gates and circuits',
  theme: 'gatemodel',
  icon: 'atom',
  estMin: 70,
  lessons: [
    {
      id: 'l1', part: 'States as arrows',
      title: 'A Qubit Is a State, Not a Tiny Coin',
      sections: [
        { type: 'text', body: 'A classical bit is either 0 or 1. A qubit can be prepared in a **superposition** of the two basis states: $|\\psi\\rangle=\\alpha|0\\rangle+\\beta|1\\rangle$. The complex numbers $\\alpha$ and $\\beta$ are amplitudes, not probabilities. A measurement in the computational basis returns 0 with probability $|\\alpha|^2$ and 1 with probability $|\\beta|^2$, so a valid state obeys $|\\alpha|^2+|\\beta|^2=1$. Superposition does not mean that a measurement reveals both answers; it means amplitudes can combine before an outcome is sampled.' },
        { type: 'equation', body: '$|\\psi\\rangle=\\cos(\\theta/2)|0\\rangle+e^{i\\varphi}\\sin(\\theta/2)|1\\rangle$', desc: 'Every pure one-qubit state can be written this way, up to an overall physically irrelevant phase.' },
        { type: 'points', items: [
          '**The north pole** $|0\\rangle$ has $\\alpha=1,\\beta=0$; the **south pole** $|1\\rangle$ has $\\alpha=0,\\beta=1$.',
          'The amplitude magnitudes set measurement odds; the **relative phase** between them affects interference.',
          'A global phase such as $e^{i\\gamma}|\\psi\\rangle$ changes no measurement prediction. Relative phase is the part that matters.',
          'A pure qubit is one point on the unit Bloch sphere, so a three-dimensional picture can summarize its two independent real parameters.'
        ] },
        { type: 'steps', title: 'Worked example — locate $|+i\\rangle$',
          hint: 'Separate amplitude magnitude (latitude) from relative phase (longitude).',
          steps: [
            'Write $|+i\\rangle=(|0\\rangle+i|1\\rangle)/\\sqrt{2}$. Thus $|\\alpha|=|\\beta|=1/\\sqrt{2}$, so the state lies on the equator.',
            'Compare the state with $e^{i\\varphi}$ in the parametrization: its relative phase is $\\varphi=\\pi/2$.',
            'Use $x=\\sin\\theta\\cos\\varphi$, $y=\\sin\\theta\\sin\\varphi$, and $z=\\cos\\theta$. At $\\theta=\\pi/2,\\varphi=\\pi/2$, this gives $(0,1,0)$.',
            'The arrow points along +y. A computational-basis measurement is still 50/50: the sphere position also records phase, not only odds.'
          ] },
        { type: 'symbols', items: [
          { sym: '$|\\psi\\rangle$', name: 'state ket', desc: 'a normalized column of complex amplitudes' },
          { sym: '$|\\alpha|^2, |\\beta|^2$', name: 'measurement probabilities', desc: 'the Born rule for outcomes 0 and 1' },
          { sym: '$\\theta,\\varphi$', name: 'Bloch angles', desc: 'polar angle and azimuth that locate a pure qubit' }
        ] },
        { type: 'explore', widget: 'bloch', title: 'Meet the state arrow', start: '0', gates: ['X', 'H'], note: 'Begin at $|0\\rangle$. Apply H to reach the equator at $|+\\rangle$, then measure several times. The arrow describes the prepared state; each measurement is a single sampled result and collapses the state.' },
        { type: 'quiz', question: {
          prompt: 'For $|\\psi\\rangle=(|0\\rangle+i|1\\rangle)/\\sqrt{2}$, what are the computational-basis probabilities?',
          options: ['100% for 0 and 0% for 1', '50% for 0 and 50% for 1', '0% for 0 and 100% for 1', 'The phase $i$ makes the probabilities undefined'],
          answer: 1,
          explain: 'Both amplitudes have squared magnitude $1/2$. The relative phase places the state along +y on the Bloch sphere, but does not change these Z-basis odds.'
        } },
        { type: 'quiz', question: {
          prompt: 'Which change leaves all predictions unchanged for an isolated state?',
          options: ['Multiply both amplitudes by the same phase $e^{i\\gamma}$', 'Change only the relative phase of $|1\\rangle$', 'Replace $|\\beta|$ by $2|\\beta|$ without renormalizing', 'Swap the amplitudes'],
          answer: 0,
          explain: 'A common global phase cancels from every probability and expectation value. Changing relative phase can change later interference, and the other changes alter the state.'
        } },
        { type: 'reflect', prompt: 'In your own words, what information does the Bloch arrow add beyond the two measurement probabilities?', model: 'The probabilities fix the z-coordinate, but the arrow also records relative phase through its direction around the equator. Two states can have identical Z-basis odds and behave differently after another gate.' }
      ]
    },
    {
      id: 'l2', part: 'States as arrows',
      title: 'Bloch-Sphere Geometry and Coordinates',
      sections: [
        { type: 'text', body: 'Think of the Bloch sphere as a globe for pure one-qubit states. The north and south poles are $|0\\rangle$ and $|1\\rangle$. The equator contains equal-magnitude superpositions: $|+\\rangle=(|0\\rangle+|1\\rangle)/\\sqrt{2}$ sits on +x, $| - \\rangle=(|0\\rangle-|1\\rangle)/\\sqrt{2}$ on -x, while $|+i\\rangle$ and $|-i\\rangle$ sit on +y and -y. Longitude distinguishes relative phase; latitude controls the Z measurement odds.' },
        { type: 'equation', body: '$\\vec r=(\\sin\\theta\\cos\\varphi,\\;\\sin\\theta\\sin\\varphi,\\;\\cos\\theta),\\qquad P(0)=\\frac{1+z}{2},\\quad P(1)=\\frac{1-z}{2}$', desc: 'For a pure qubit, $\\|\\vec r\\|=1$. The Z probabilities depend only on the vertical coordinate.' },
        { type: 'steps', title: 'Worked example — state at $\\theta=60^\\circ,\\varphi=90^\\circ$',
          steps: [
            'The vertical coordinate is $z=\\cos 60^\\circ=1/2$.',
            'The horizontal coordinates are $x=\\sin60^\\circ\\cos90^\\circ=0$ and $y=\\sin60^\\circ\\sin90^\\circ=\\sqrt{3}/2$.',
            'The point is $(0,\\sqrt{3}/2,1/2)$ and has unit length: $3/4+1/4=1$.',
            'A Z-basis measurement returns 0 with probability $(1+1/2)/2=3/4$, and 1 with probability $1/4$. The nonzero y-coordinate stores the phase information.'
          ] },
        { type: 'points', items: [
          'The **equator** means $z=0$, hence equal Z-basis probabilities; it does not mean the state lacks phase.',
          'Rotating around the z-axis changes longitude and relative phase while preserving $P(0)$ and $P(1)$.',
          'The surface represents pure states. Points strictly inside the sphere represent mixed states, which are not a single pure ket.',
          'The Bloch vector is a compact geometric representation; its coordinates are expectation values of Pauli measurements: $(\\langle X\\rangle,\\langle Y\\rangle,\\langle Z\\rangle)$.'
        ] },
        { type: 'explore', widget: 'bloch', title: 'Compare poles, equator, and longitude', start: '+', gates: ['X', 'Y', 'Z', 'H'], note: 'The lab reports Bloch coordinates and estimated state amplitudes. Start from $|+\\rangle$. Apply Z to move to $| - \\rangle$: Z changes the equatorial direction but leaves the Z-basis measurement at 50/50.' },
        { type: 'quiz', question: {
          prompt: 'A pure state has Bloch coordinates $(0,1,0)$. What is its computational-basis measurement distribution?',
          options: ['Certain 0', 'Certain 1', '50/50 between 0 and 1', 'The probabilities cannot be inferred from a Bloch vector'],
          answer: 2,
          explain: 'Here $z=0$, so $P(0)=(1+z)/2=1/2$ and $P(1)=(1-z)/2=1/2$. The y-coordinate tells us the relative phase.'
        } },
        { type: 'quiz', question: {
          prompt: 'What does a rotation about the Bloch z-axis do to computational-basis probabilities?',
          options: ['It swaps them every time', 'It leaves them unchanged while changing relative phase', 'It forces both to zero', 'It makes every state mixed'],
          answer: 1,
          explain: 'A z-axis rotation changes longitude. Since it leaves z fixed, $P(0)$ and $P(1)$ remain fixed, though interference after other gates can change.'
        } },
        { type: 'reflect', prompt: 'Why can two qubits have the same Z-basis measurement odds but different behavior in a circuit?', model: 'They may have different relative phases and therefore different x/y coordinates. A later gate can convert that phase difference into different amplitudes and measurable outcomes.' }
      ]
    },
    {
      id: 'l3', part: 'Single-qubit gates',
      title: 'The Pauli Gates X, Y, and Z',
      sections: [
        { type: 'text', body: 'A one-qubit gate is a reversible linear transformation, represented by a unitary matrix. The Pauli gates are the simplest nontrivial examples. X flips the computational basis labels, Z adds a minus sign to $|1\\rangle$, and Y combines a flip with phase factors. On the Bloch sphere each is a half-turn ($180^\\circ$) around its named axis. The sphere makes the action geometric; the matrix makes it calculable.' },
        { type: 'equation', body: '$X=\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix},\\quad Y=\\begin{pmatrix}0&-i\\\\i&0\\end{pmatrix},\\quad Z=\\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}$', desc: 'Each Pauli matrix is unitary and Hermitian, and each squares to the identity.' },
        { type: 'steps', title: 'Worked example — apply Z to an equatorial state',
          steps: [
            'Start with $|+\\rangle=(|0\\rangle+|1\\rangle)/\\sqrt{2}$.',
            'Apply $Z|0\\rangle=|0\\rangle$ and $Z|1\\rangle=-|1\\rangle$.',
            'Therefore $Z|+\\rangle=(|0\\rangle-|1\\rangle)/\\sqrt{2}=| - \\rangle$.',
            'Before and after, a Z measurement is 50/50. An X measurement distinguishes the states: $|+\\rangle$ yields +1 certainly and $| - \\rangle$ yields -1 certainly.'
          ] },
        { type: 'points', items: [
          '**X** maps $|0\\rangle\\leftrightarrow|1\\rangle$; on Bloch coordinates it maps $(x,y,z)$ to $(x,-y,-z)$.',
          '**Y** maps $|0\\rangle$ to $i|1\\rangle$ and $|1\\rangle$ to $-i|0\\rangle$; these phases are part of the operation.',
          '**Z** maps $(x,y,z)$ to $(-x,-y,z)$; it changes relative phase but preserves computational measurement probabilities.',
          'The Pauli matrices anticommute in pairs, for example $XZ=-ZX$. Gate order matters because matrix multiplication is not generally commutative.'
        ] },
        { type: 'explore', widget: 'bloch', title: 'Half-turns about three axes', start: '+', gates: ['X', 'Y', 'Z'], note: 'Apply each Pauli gate to $|+\\rangle$ and compare the readout. X leaves this particular state fixed, while Y and Z move it to different points. A gate can act nontrivially even when one chosen input happens to be an eigenstate.' },
        { type: 'quiz', question: {
          prompt: 'What state results from applying Z to $|+\\rangle=(|0\\rangle+|1\\rangle)/\\sqrt{2}$?',
          options: ['$|0\\rangle$', '$|1\\rangle$', '$| - \\rangle=(|0\\rangle-|1\\rangle)/\\sqrt{2}$', '$|+i\\rangle$'],
          answer: 2,
          explain: 'Z leaves the $|0\\rangle$ component fixed and negates the $|1\\rangle$ component, producing $| - \\rangle$.'
        } },
        { type: 'quiz', question: {
          prompt: 'Which statement about X on computational-basis states is correct?',
          options: ['X changes only the phase of $|1\\rangle$', 'X maps $|0\\rangle$ to $|1\\rangle$ and vice versa', 'X maps both basis states to $|+\\rangle$', 'X is a measurement, not a gate'],
          answer: 1,
          explain: 'The matrix X swaps the amplitudes, so it exchanges the computational basis states. It is a reversible unitary operation, not a measurement.'
        } },
        { type: 'reflect', prompt: 'Z leaves computational-basis odds alone. Why can we still detect that Z was applied?', model: 'Prepare a state with coherence, such as $|+\\rangle$, then measure in a different basis or apply another gate first. Z changes relative phase, which can become a measurable probability change through interference.' }
      ]
    },
    {
      id: 'l4', part: 'Single-qubit gates',
      title: 'Hadamard: Basis Change and Interference',
      sections: [
        { type: 'text', body: 'The Hadamard gate H is a basis-changing gate. It sends $|0\\rangle$ to $|+\\rangle$ and $|1\\rangle$ to $| - \\rangle$. In the opposite direction, H converts these phase-basis states back to computational basis states. This is why a phase that is invisible in an immediate Z measurement can become visible after a later H: the second gate recombines amplitudes, allowing constructive or destructive interference.' },
        { type: 'equation', body: '$H=\\frac{1}{\\sqrt{2}}\\begin{pmatrix}1&1\\\\1&-1\\end{pmatrix},\\qquad H^2=I$', desc: 'H is its own inverse; applying it twice restores any input state.' },
        { type: 'steps', title: 'Worked example — interference distinguishes $|+\\rangle$ and $| - \\rangle$',
          steps: [
            'Start with $|+\\rangle=(|0\\rangle+|1\\rangle)/\\sqrt{2}$. H maps its two equal amplitudes to $(|0\\rangle+|1\\rangle+|0\\rangle-|1\\rangle)/2$.',
            'The $|1\\rangle$ terms cancel and the $|0\\rangle$ terms add, leaving $|0\\rangle$.',
            'For $| - \\rangle=(|0\\rangle-|1\\rangle)/\\sqrt{2}$, the signs reverse: the $|0\\rangle$ terms cancel and the $|1\\rangle$ terms add.',
            'Thus H followed by a computational-basis measurement returns 0 for $|+\\rangle$ and 1 for $| - \\rangle$ with certainty.'
          ] },
        { type: 'points', items: [
          'H exchanges the z and x axes: $|0\\rangle\\to|+\\rangle$, $|+\\rangle\\to|0\\rangle$, and $|1\\rangle\\to| - \\rangle$.',
          'H is not a randomizer. It creates a coherent superposition whose amplitudes can later interfere.',
          'The identity $HZH=X$ says that a phase flip sandwiched between basis changes behaves like a bit flip.',
          'The common circuit pattern H → phase operation → H converts phase information into a computational-basis result.'
        ] },
        { type: 'explore', widget: 'bloch', title: 'Watch H exchange axes', start: '0', gates: ['H', 'X', 'Z'], note: 'Apply H to move the north-pole state to the +x equator. Apply H again: because $H^2=I$, the arrow returns to $|0\\rangle$. Try starting at $|1\\rangle$ by resetting and then applying X before H.' },
        { type: 'quiz', question: {
          prompt: 'What is $H|0\\rangle$?',
          options: ['$|1\\rangle$', '$(|0\\rangle+|1\\rangle)/\\sqrt{2}$', '$(|0\\rangle-|1\\rangle)/\\sqrt{2}$', '$i|0\\rangle$'],
          answer: 1,
          explain: 'The first column of H is $(1,1)^T/\\sqrt{2}$, which is the equal superposition $|+\\rangle$.'
        } },
        { type: 'quiz', question: {
          prompt: 'Starting from $| - \\rangle$, apply H and then measure in the computational basis. What happens?',
          options: ['Outcome 0 is certain', 'Outcome 1 is certain', 'The outcomes are 50/50', 'The state cannot be normalized'],
          answer: 1,
          explain: 'H maps $| - \\rangle$ to $|1\\rangle$. The signs interfere so the 0 amplitude cancels and the 1 amplitude remains.'
        } },
        { type: 'reflect', prompt: 'How does the sequence H-Z-H let a Z phase flip show up as a bit flip?', model: 'The first H changes basis, Z changes the relative phase in that basis, and the final H recombines amplitudes. Algebraically $HZH=X$, so the full sequence swaps $|0\\rangle$ and $|1\\rangle$.' }
      ]
    },
    {
      id: 'l5', part: 'Phase and rotations',
      title: 'Phase Gates S and T',
      sections: [
        { type: 'text', body: 'A phase gate leaves $|0\\rangle$ untouched and multiplies $|1\\rangle$ by a phase. S uses $i=e^{i\\pi/2}$; T uses $e^{i\\pi/4}$. Since these gates are diagonal, computational-basis probabilities do not change when they are applied. Their value is in controlling relative phase, which later gates can turn into interference. S and T are fractional z-axis rotations, not measurements.' },
        { type: 'equation', body: '$S=\\begin{pmatrix}1&0\\\\0&i\\end{pmatrix},\\quad T=\\begin{pmatrix}1&0\\\\0&e^{i\\pi/4}\\end{pmatrix},\\quad S^2=Z,\\quad T^2=S$', desc: 'The phase on $|1\\rangle$ accumulates with repeated applications.' },
        { type: 'steps', title: 'Worked example — S turns $|+\\rangle$ into $|+i\\rangle$',
          steps: [
            'Write $|+\\rangle=(|0\\rangle+|1\\rangle)/\\sqrt{2}$.',
            'S multiplies the $|1\\rangle$ amplitude by $i$ and leaves the $|0\\rangle$ amplitude alone.',
            'The result is $(|0\\rangle+i|1\\rangle)/\\sqrt{2}=|+i\\rangle$, the +y equator state.',
            'The computational-basis odds remain 50/50. Applying H afterward still gives equal Z-basis probabilities for this input, but moves the state to a different equatorial direction; a Y-basis measurement distinguishes that phase.'
          ] },
        { type: 'points', items: [
          'S is a 90-degree z-axis phase rotation; T is a 45-degree z-axis phase rotation.',
          'S is often called the phase gate and T the pi/8 gate. Their adjoints reverse the direction: $S^\\dagger=S^{-1}$ and $T^\\dagger=T^{-1}$.',
          'A global phase on the whole ket is unobservable, but the phase difference between basis components is operationally meaningful.',
          'The combination H, S, and T with entangling gates supports universal circuit constructions in the standard gate model; a finite circuit approximates general operations.'
        ] },
        { type: 'explore', widget: 'bloch', title: 'Accumulate phase on the equator', start: '+', gates: ['S', 'T', 'Z'], note: 'Start from $|+\\rangle$ so the phase is relative. Apply S once to move toward $|+i\\rangle$, then again: $S^2=Z$ and the state reaches $| - \\rangle$. T advances by half as much around the equator as S.' },
        { type: 'quiz', question: {
          prompt: 'What does S do to $|+\\rangle$?',
          options: ['It leaves $|+\\rangle$ unchanged', 'It maps the state to $|+i\\rangle$', 'It maps the state to $|1\\rangle$', 'It measures and collapses the qubit'],
          answer: 1,
          explain: 'S applies a factor of i to the $|1\\rangle$ component, giving $(|0\\rangle+i|1\\rangle)/\\sqrt{2}=|+i\\rangle$.'
        } },
        { type: 'quiz', question: {
          prompt: 'Which identity is correct for the phase gates as defined here?',
          options: ['$S^2=Z$', '$T^2=Z$', '$S^2=H$', '$T^2=X$'],
          answer: 0,
          explain: 'Two S gates multiply the $|1\\rangle$ amplitude by $i^2=-1$, which is exactly Z. Also, $T^2=S$.'
        } },
        { type: 'reflect', prompt: 'If S leaves computational-basis odds unchanged, what makes it useful?', model: 'S changes relative phase without changing those immediate odds. Interference with a later gate or a measurement in another basis can convert that phase into a detectable difference.' }
      ]
    },
    {
      id: 'l6', part: 'Phase and rotations',
      title: 'Rotations, Measurement, and Repeated Shots',
      sections: [
        { type: 'text', body: 'The Pauli gates make half-turns. Rotation gates let us choose the angle: $R_x(\\theta)$, $R_y(\\theta)$, and $R_z(\\theta)$ rotate the Bloch vector around the corresponding axis by angle $\\theta$. The matrix definition uses half the angle in its sine and cosine terms. Measurement is different from rotation: it samples an outcome according to the Born rule and, for an ideal projective measurement, leaves the qubit in the corresponding eigenstate.' },
        { type: 'equation', body: '$R_a(\\theta)=e^{-i\\theta\\sigma_a/2}=\\cos(\\theta/2)I-i\\sin(\\theta/2)\\sigma_a,\\qquad P(0)=\\frac{1+z}{2}$', desc: 'Here $a\\in\\{x,y,z\\}$ and $\\sigma_a$ is the matching Pauli matrix.' },
        { type: 'steps', title: 'Worked example — prepare and measure with $R_y(60^\\circ)$',
          steps: [
            'Start at $|0\\rangle$, the north pole $(0,0,1)$.',
            'Rotate about y by $60^\\circ$. The state becomes $\\cos30^\\circ|0\\rangle+\\sin30^\\circ|1\\rangle=(\\sqrt{3}/2)|0\\rangle+(1/2)|1\\rangle$.',
            'Therefore $P(0)=3/4$ and $P(1)=1/4$. A single shot is random; one thousand shots should be near, not exactly equal to, those proportions.',
            'After an ideal Z measurement, outcome 0 leaves the state at the north pole and outcome 1 leaves it at the south pole. Reset or reprepare before collecting another sample of the original state.'
          ] },
        { type: 'points', items: [
          'The Bloch-vector expectation values are $\\langle X\\rangle=x$, $\\langle Y\\rangle=y$, and $\\langle Z\\rangle=z$.',
          'For Z measurement, $\\langle Z\\rangle=P(0)-P(1)=z$; the mean of many $\\pm1$ outcomes estimates this value.',
          'Finite-shot estimates fluctuate. For independent samples, typical statistical error shrinks approximately as $1/\\sqrt{N}$, not as $1/N$.',
          'A rotation is reversible and preserves purity. Measurement generally is not reversible because it discards coherence relative to the chosen basis.'
        ] },
        { type: 'explore', widget: 'bloch', title: 'Tune a rotation, then sample it', start: '0', gates: ['X', 'H'], note: 'Use the rotation slider with Ry and compare the displayed Z probabilities to $P(0)=\\cos^2(\\theta/2)$ for an initial $|0\\rangle$. Measure repeatedly to see sampling variation, then reset to prepare the original state again.' },
        { type: 'quiz', question: {
          prompt: 'After applying $R_y(60^\\circ)$ to $|0\\rangle$, what is the probability of measuring 1?',
          options: ['$0$', '$1/4$', '$1/2$', '$3/4$'],
          answer: 1,
          explain: '$R_y(\\theta)|0\\rangle=\\cos(\\theta/2)|0\\rangle+\\sin(\\theta/2)|1\\rangle$. At 60 degrees, the 1 amplitude is $\\sin30^\\circ=1/2$, whose square is $1/4$.'
        } },
        { type: 'quiz', question: {
          prompt: 'For Bloch coordinate $z=-0.6$, what are the Z-basis probabilities?',
          options: ['$P(0)=0.2, P(1)=0.8$', '$P(0)=0.8, P(1)=0.2$', '$P(0)=P(1)=0.5$', '$P(0)=-0.6, P(1)=1.6$'],
          answer: 0,
          explain: '$P(0)=(1+z)/2=(1-0.6)/2=0.2$, and $P(1)=(1-z)/2=0.8$. Probabilities remain between zero and one and sum to one.'
        } },
        { type: 'reflect', prompt: 'Why do we need many circuit repetitions (shots) when a quantum measurement returns only one bit?', model: 'One shot gives one random sample, not the underlying probability. Repeating a prepared circuit estimates its outcome frequencies or expectation value; statistical uncertainty shrinks with the square root of the number of shots.' }
      ]
    },
    {
      id: 'l7', part: 'Circuits and QML',
      title: 'Gate Circuits and a QML Application',
      sections: [
        { type: 'text', body: 'A circuit is a time-ordered recipe of gates followed by measurements. In matrix notation the rightmost operation acts first: if a circuit applies $U_1$ and then $U_2$, its total matrix is $U_2U_1$. A simple QML model can encode a real feature $x$ as a rotation, apply trainable gates with parameters $\\theta$, and estimate a prediction from measurement frequencies. The quantum circuit is only one part of the model; a classical optimizer can update parameters from the measured cost.' },
        { type: 'equation', body: '$|\\psi(x,\\theta)\\rangle=R_y(\\theta)R_y(x)|0\\rangle=R_y(x+\\theta)|0\\rangle,\\qquad f_\\theta(x)=\\langle Z\\rangle=\\cos(x+\\theta)$', desc: 'A one-qubit toy feature map and variational layer. Angles are in radians in this equation.' },
        { type: 'steps', title: 'Worked example — encode a feature and read out a prediction',
          steps: [
            'Choose one input $x=\\pi/3$ and initialize the qubit in $|0\\rangle$. Apply $R_y(x)$ to encode the feature.',
            'Apply a trainable rotation $R_y(\\theta)$; choose $\\theta=0$ for this first calculation. The combined rotation angle is $\\pi/3$.',
            'The output is $\\cos(\\pi/6)|0\\rangle+\\sin(\\pi/6)|1\\rangle$, so a Z-basis sample is 0 with probability $3/4$ and 1 with probability $1/4$.',
            'The model prediction as an expectation value is $f_0(x)=P(0)-P(1)=1/2$. A real training loop estimates this mean from shots and adjusts $\\theta$ to reduce a chosen loss.',
            'This one-qubit model demonstrates encoding, trainable gates, and readout; by itself it does not establish a quantum speedup or solve a useful task better than a classical model.'
          ] },
        { type: 'points', items: [
          '**Feature map:** a circuit $U_{\\mathrm{enc}}(x)$ that turns classical data into a quantum state.',
          '**Ansatz:** a parameterized gate sequence $U(\\theta)$ whose parameters are selected during training.',
          '**Readout:** an observable such as Z whose expectation is estimated from repeated measurements.',
          '**Cost:** a classical objective comparing predictions with targets; a hybrid loop measures, computes an update, and runs again.',
          'Practical evaluation must account for circuit depth, noise, shot cost, optimizer behavior, and a fair classical baseline. A circuit diagram alone is not evidence of advantage.'
        ] },
        { type: 'explore', widget: 'bloch', title: 'Read a tiny variational circuit geometrically', start: '0', gates: ['H', 'S', 'T'], note: 'The lab exposes fixed gates plus Rx, Ry, and Rz rotations. Try Ry at $x=60^\\circ$ as a simple feature encoding, then a second Ry rotation as a trainable layer. Read the resulting Z probabilities; this visual is an intuition aid, not a training or benchmarking system.' },
        { type: 'quiz', question: {
          prompt: 'A circuit applies $U_1$ first and $U_2$ second. Which matrix represents the full circuit?',
          options: ['$U_1U_2$', '$U_2U_1$', '$U_1+U_2$', '$U_2-U_1$'],
          answer: 1,
          explain: 'The rightmost matrix acts first on a ket: $|\\psi_{\\mathrm{out}}\\rangle=U_2(U_1|\\psi\\rangle)=(U_2U_1)|\\psi\\rangle$.'
        } },
        { type: 'quiz', question: {
          prompt: 'In the toy QML model, what does repeated measurement provide to the classical training loop?',
          options: ['An exact real number from a single shot', 'Samples used to estimate an expectation or prediction', 'A proof of quantum advantage', 'A replacement for choosing a loss function'],
          answer: 1,
          explain: 'Measurements produce samples. Their frequencies estimate probabilities and observables; a classical process can use that estimate to evaluate a loss and update parameters.'
        } },
        { type: 'reflect', prompt: 'Name the three moving parts of the toy QML circuit and explain what each contributes.', model: 'The feature map encodes input x into a state, the parameterized ansatz applies trainable gates, and measurement estimates a prediction such as $\\langle Z\\rangle$. A classical optimizer can use the measured cost to change the parameters.' }
      ]
    }
  ]
});
