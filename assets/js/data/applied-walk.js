/* ============================================================
   APPLIED WALKTHROUGHS — beginner breakdowns + live visuals.
   axNNN -> { viz:{scene, ...opts} (QML.viz3d spec — generated on
   the fly), steps:[{h:'title', t:'text ($..$ inline math)',
   eq?:'display tex'}] }
   ============================================================ */
window.QML_APPLIED_WALK = {

  /* ---------- Born rule / projectors ---------- */
  ax001: { viz: { scene: 'measure' }, steps: [
    { h: 'What we\'re doing', t: 'We want the probability of seeing outcome **1**. The state is $|\\psi\\rangle = \\tfrac{1}{\\sqrt{2}}(|0\\rangle + i|1\\rangle)$ — half its amplitude sits on $|1\\rangle$.' },
    { h: 'Grab the amplitude of |1⟩', t: 'The bra $\\langle 1|$ just picks out the coefficient sitting next to $|1\\rangle$: that\'s $\\tfrac{i}{\\sqrt{2}}$.' },
    { h: 'Square the magnitude', t: 'The Born rule says probability = magnitude squared:', eq: 'p(1) = \\left|\\tfrac{i}{\\sqrt{2}}\\right|^{2} = \\tfrac{i\\cdot(-i)}{2} = \\tfrac{-i^{2}}{2} = \\tfrac{1}{2}' },
    { h: 'Answer', t: '**p(1) = 1/2**. The $i$ is only a *phase* — it disappears the moment we take a magnitude. That\'s why phases are invisible to single measurements.' },
  ]},

  ax002: { viz: { scene: 'state', th: Math.PI / 3, lab: '|ψ⟩ — mostly |0⟩' }, steps: [
    { h: 'What we\'re doing', t: 'The state $|\\psi\\rangle = \\tfrac{\\sqrt{3}}{2}|0\\rangle + \\tfrac{1}{2}|1\\rangle$ leans toward $|0\\rangle$ — its amplitude there is bigger.' },
    { h: 'Pick out the |0⟩ coefficient', t: 'Applying $\\langle 0|$ extracts the $|0\\rangle$ coefficient: $\\tfrac{\\sqrt{3}}{2}$.' },
    { h: 'Square it', eq: 'p(0) = \\left(\\tfrac{\\sqrt{3}}{2}\\right)^{2} = \\tfrac{3}{4}', t: 'Don\'t stop at the amplitude — probabilities are squares.' },
    { h: 'Answer', t: '**p(0) = 3/4**. Check the pair: $\\tfrac{3}{4} + \\tfrac{1}{4} = 1$ ✓ — probabilities always add to one.' },
  ]},

  ax003: { viz: { scene: 'bars' }, steps: [
    { h: 'What we\'re doing', t: 'State: $|\\psi\\rangle = \\tfrac{2}{3}|0\\rangle + \\tfrac{\\sqrt{5}}{3}|1\\rangle$. Question: how often does measurement return 0?' },
    { h: 'Isolate the |0⟩ amplitude', t: 'It\'s $\\tfrac{2}{3}$ — the number in front of the $|0\\rangle$ term.' },
    { h: 'Born square', eq: 'p(0) = \\left(\\tfrac{2}{3}\\right)^{2} = \\tfrac{4}{9}', t: '' },
    { h: 'Answer + sanity check', t: '**p(0) = 4/9**. And the other outcome: $(\\sqrt{5}/3)^{2} = 5/9$. Sum: $4/9 + 5/9 = 1$ ✓ — a real probability distribution.' },
  ]},

  ax004: { viz: { scene: 'overlap' }, steps: [
    { h: 'What we\'re doing', t: 'Fidelity asks: how much do $|0\\rangle$ and $|+\\rangle$ overlap? $|+\\rangle = \\tfrac{1}{\\sqrt{2}}(|0\\rangle+|1\\rangle)$.' },
    { h: 'Inner product', t: '$\\langle 0|+\\rangle = \\tfrac{1}{\\sqrt{2}}\\langle 0|0\\rangle + \\tfrac{1}{\\sqrt{2}}\\langle 0|1\\rangle = \\tfrac{1}{\\sqrt{2}}$. The $|1\\rangle$ part contributes nothing — it\'s perpendicular to $|0\\rangle$.' },
    { h: 'Square', eq: 'F = \\left|\\tfrac{1}{\\sqrt{2}}\\right|^{2} = \\tfrac{1}{2}', t: '' },
    { h: 'Answer', t: '**F = 1/2** — halfway between identical (1) and orthogonal (0). Makes sense: |+⟩ is a 45° tilt away from |0⟩ on the Bloch sphere.' },
  ]},

  ax005: { viz: { scene: 'overlap' }, steps: [
    { h: 'What we\'re doing', t: '$|+\\rangle = \\tfrac{1}{\\sqrt{2}}(|0\\rangle+|1\\rangle)$ and $|-\\rangle = \\tfrac{1}{\\sqrt{2}}(|0\\rangle-|1\\rangle)$ — opposite poles of the X axis.' },
    { h: 'Inner product', eq: '\\langle +|-\\rangle = \\tfrac{1}{2}\\big(\\langle 0|0\\rangle - \\langle 0|1\\rangle + \\langle 1|0\\rangle - \\langle 1|1\\rangle\\big) = \\tfrac{1}{2}(1 - 0 + 0 - 1) = 0', t: 'The plus and minus terms cancel exactly.' },
    { h: 'Answer', t: '**0** — perfectly distinguishable. Orthogonal states never get confused for each other, no matter the noise budget.' },
  ]},

  /* ---------- expectations ---------- */
  ax006: { viz: { scene: 'state', th: Math.PI / 2, ph: 0, lab: '|+⟩ on the equator' }, steps: [
    { h: 'What we\'re doing', t: '$\\langle Z\\rangle$ = average of Z-measurements on $|+\\rangle$. Picture: $|+\\rangle$ points along the X axis — it has zero tilt toward $|0\\rangle$ or $|1\\rangle$.' },
    { h: 'Apply Z', t: '$Z|+\\rangle = \\tfrac{1}{\\sqrt{2}}(|0\\rangle - |1\\rangle) = |-\\rangle$.' },
    { h: 'Take the overlap', eq: '\\langle +|Z|+\\rangle = \\langle +|-\\rangle = 0', t: '' },
    { h: 'Answer', t: '**0** — measuring Z on |+⟩ is a 50/50 coin: +1 half the time, −1 half the time. Mean zero.' },
  ]},

  ax007: { viz: { scene: 'state', th: Math.PI / 2, ph: 0, lab: '|+⟩ is X\'s eigenstate' }, steps: [
    { h: 'What we\'re doing', t: '$\\langle X\\rangle$ on $|+\\rangle$ — and $|+\\rangle$ happens to BE an eigenstate of $X$.' },
    { h: 'Eigenvalue equation', t: '$X|+\\rangle = +1\\cdot|+\\rangle$. Applying X just multiplies by 1 — the state doesn\'t move.' },
    { h: 'Expectation', eq: '\\langle +|X|+\\rangle = +1\\cdot\\langle +|+\\rangle = 1', t: '' },
    { h: 'Answer', t: '**1** — every shot reads +1. Eigenstate = deterministic measurement.' },
  ]},

  ax008: { viz: { scene: 'state', th: 0, lab: '|0⟩ at the north pole' }, steps: [
    { h: 'What we\'re doing', t: '$\\langle X\\rangle$ on $|0\\rangle$. $|0\\rangle$ points straight up the Z axis — perpendicular to X.' },
    { h: 'Apply X', t: '$X|0\\rangle = |1\\rangle$ — the quantum NOT flips it.' },
    { h: 'Overlap', eq: '\\langle 0|X|0\\rangle = \\langle 0|1\\rangle = 0', t: '' },
    { h: 'Answer', t: '**0**. Orthogonal axis → zero expectation. Pattern worth memorizing: a state\'s expectation along an axis = its Bloch coordinate on that axis.' },
  ]},

  ax009: { viz: { scene: 'state', th: Math.PI, lab: '|1⟩ at the south pole' }, steps: [
    { h: 'What we\'re doing', t: 'Solving $Z|1\\rangle = \\lambda|1\\rangle$ — what does Z multiply $|1\\rangle$ by?' },
    { h: 'Z\'s action', t: '$Z$ leaves $|0\\rangle$ alone but flips the sign of $|1\\rangle$: $Z|1\\rangle = -|1\\rangle$.' },
    { h: 'Read off λ', eq: 'Z|1\\rangle = (-1)|1\\rangle \\;\\Rightarrow\\; \\lambda = -1', t: '' },
    { h: 'Answer', t: '**−1**. Both Pauli eigenvalues are always ±1 — that\'s why measurements give binary outcomes.' },
  ]},

  ax010: { viz: { scene: 'state', th: Math.PI, lab: '|1⟩ → ⟨Z⟩ = −1' }, steps: [
    { h: 'What we\'re doing', t: '$\\langle Z\\rangle$ on $|1\\rangle$ — the state sitting at the bottom of the Z axis.' },
    { h: 'Eigenstate shortcut', t: '$Z|1\\rangle = -|1\\rangle$, so $\\langle 1|Z|1\\rangle = -\\langle 1|1\\rangle$.' },
    { h: 'Normalize', eq: '\\langle 1|Z|1\\rangle = -1', t: '' },
    { h: 'Answer', t: '**−1** — every Z shot returns −1. Deterministic because $|1\\rangle$ is an eigenstate.' },
  ]},

  ax011: { viz: { scene: 'pair', mode: 'same', lab: 'correlated pair' }, steps: [
    { h: 'What we\'re doing', t: '$\\langle ZZ\\rangle$ = mean of (qubit-A outcome × qubit-B outcome). If they always agree → +1; always disagree → −1; random → 0.' },
    { h: 'Look at the Bell state', t: '$|\\Phi^+\\rangle = \\tfrac{1}{\\sqrt{2}}(|00\\rangle + |11\\rangle)$ — only the terms 00 and 11 appear. Both bits are ALWAYS equal.' },
    { h: 'Check each term', t: '$Z \\otimes Z$ on $|00\\rangle$: $(+1)(+1) = +1$. On $|11\\rangle$: $(-1)(-1) = +1$. Same result either way!' },
    { h: 'Answer', eq: '\\langle\\Phi^+|ZZ|\\Phi^+\\rangle = \\tfrac{1}{2}(+1) + \\tfrac{1}{2}(+1) = 1', t: '**1** — perfect correlation. This is entanglement\'s fingerprint: individual outcomes are random, but they always match.' },
  ]},

  /* ---------- unitaries / gates ---------- */
  ax012: { viz: { scene: 'evolve', lab: 'U then U† = do nothing' }, steps: [
    { h: 'What we\'re doing', t: '$U^{\\dagger}$ is the *undo* of $U$ — every unitary is reversible.' },
    { h: 'Collapse the pair', t: '$U^{\\dagger}U = I$, the identity. Do-something-then-undo-it = nothing happened.' },
    { h: 'Evaluate', eq: '\\langle\\psi|I|\\psi\\rangle = \\langle\\psi|\\psi\\rangle = 1', t: 'A normalized state has unit norm — that\'s what "normalized" means.' },
    { h: 'Answer', t: '**1**, always, for any unitary and any normalized state. Unitarity = probability conservation.' },
  ]},

  ax013: { viz: { scene: 'gate', axis: 'x', lab: 'X |+⟩ = |+⟩' }, steps: [
    { h: 'What we\'re doing', t: 'X swaps the $|0\\rangle$ and $|1\\rangle$ amplitudes — a quantum NOT.' },
    { h: 'Apply it', t: '$X|+\\rangle = X\\tfrac{1}{\\sqrt{2}}(|0\\rangle+|1\\rangle) = \\tfrac{1}{\\sqrt{2}}(|1\\rangle+|0\\rangle)$.' },
    { h: 'But the amplitudes are equal', t: 'Swapping two equal numbers changes nothing — the state is identical.' },
    { h: 'Answer', eq: 'X|+\\rangle = |+\\rangle', t: '**|+⟩** — X\'s eigenstate. It sits right on the rotation axis, so the X rotation can\'t move it.' },
  ]},

  ax014: { viz: { scene: 'gate', axis: 'h', lab: 'H |1⟩ = |−⟩' }, steps: [
    { h: 'What we\'re doing', t: 'The Hadamard gate $H$ takes basis states to superpositions — it\'s how quantum parallelism gets started.' },
    { h: 'H\'s rule', t: '$H|0\\rangle = \\tfrac{|0\\rangle+|1\\rangle}{\\sqrt{2}} = |+\\rangle$ and $H|1\\rangle = \\tfrac{|0\\rangle-|1\\rangle}{\\sqrt{2}} = |-\\rangle$.' },
    { h: 'Answer', eq: 'H|1\\rangle = \\tfrac{|0\\rangle - |1\\rangle}{\\sqrt{2}} = |-\\rangle', t: '**the minus-signed superposition**. Same magnitudes as |+⟩, opposite phase — phase is real information.' },
  ]},

  ax015: { viz: { scene: 'cnot' }, steps: [
    { h: 'What we\'re doing', t: 'CNOT has two slots: **control** (first bit) and **target** (second). If control = 1, target flips.' },
    { h: 'Read $|11\\rangle$', t: 'Control = 1 → the rule fires. Target = 1 → flips to 0.' },
    { h: 'Answer', eq: '\\mathrm{CNOT}|11\\rangle = |10\\rangle', t: '**|10⟩** — control untouched, target flipped. CNOT is the gate that *creates* entanglement in bigger circuits.' },
  ]},

  ax016: { viz: { scene: 'swap' }, steps: [
    { h: 'What we\'re doing', t: 'SWAP exchanges whatever the two qubits hold — bit values trade seats.' },
    { h: 'Apply to $|01\\rangle$', t: 'Qubit A holds 0, qubit B holds 1. After swapping, A holds 1 and B holds 0.' },
    { h: 'Answer', eq: '\\mathrm{SWAP}|01\\rangle = |10\\rangle', t: '**|10⟩**. Fun fact: SWAP is built from three CNOTs.' },
  ]},

  /* ---------- rotations / Bloch ---------- */
  ax017: { viz: { scene: 'gate', axis: 'x', lab: 'R_Y(π) — half turn' }, steps: [
    { h: 'What we\'re doing', t: '$R_Y(\\theta)$ rotates the state $\\theta$ radians around the Bloch sphere\'s Y axis. A full $\\pi$ is a half-turn.' },
    { h: 'The formula', eq: 'R_Y(\\theta)|0\\rangle = \\cos\\tfrac{\\theta}{2}|0\\rangle + \\sin\\tfrac{\\theta}{2}|1\\rangle', t: '' },
    { h: 'Plug θ = π', t: '$\\cos(\\pi/2)|0\\rangle + \\sin(\\pi/2)|1\\rangle = 0\\cdot|0\\rangle + 1\\cdot|1\\rangle$.' },
    { h: 'Answer', t: '**|1⟩** — a π rotation flips the bit. This is exactly why angle encoding maps features to rotations: the angle IS the data.' },
  ]},

  ax018: { viz: { scene: 'state', th: Math.PI / 3, lab: 'θ = 60°' }, steps: [
    { h: 'What we\'re doing', t: 'After $R_Y(\\theta)|0\\rangle$, the probability of reading 1 is $\\sin^2(\\theta/2)$ — amplitude squared, Born rule.' },
    { h: 'Plug θ = π/3', t: '$\\theta/2 = \\pi/6$, and $\\sin(\\pi/6) = \\tfrac{1}{2}$.' },
    { h: 'Square it', eq: 'p(1) = \\sin^{2}\\tfrac{\\pi}{6} = \\left(\\tfrac{1}{2}\\right)^{2} = \\tfrac{1}{4}', t: '' },
    { h: 'Answer', t: '**1/4**. Small angle → slight tilt → mostly still measures 0.' },
  ]},

  ax019: { viz: { scene: 'state', th: 0, lab: 'r⃗ = (0,0,1) → |0⟩' }, steps: [
    { h: 'What we\'re doing', t: 'In the Bloch picture, each Pauli expectation equals one coordinate: $\\langle X\\rangle = r_x$, $\\langle Y\\rangle = r_y$, $\\langle Z\\rangle = r_z$.' },
    { h: 'Read the vector', t: '$\\vec{r} = (0,0,1)$ means $r_z = 1$ — the state sits at the very top of the Z axis.' },
    { h: 'Answer', eq: '\\langle Z\\rangle = r_z = 1', t: '**1** — the state is exactly $|0\\rangle$, and Z measurement is deterministically +1.' },
  ]},

  ax020: { viz: { scene: 'state', th: 0, lab: 'north pole = |0⟩' }, steps: [
    { h: 'What we\'re doing', t: 'Build $\\rho = \\tfrac{1}{2}(I + \\vec{r}\\cdot\\vec{\\sigma})$ for $\\vec{r}=(0,0,1)$. Only the Z term survives: $\\vec{r}\\cdot\\vec{\\sigma} = 0\\cdot X + 0\\cdot Y + 1\\cdot Z = Z$.' },
    { h: 'Compute the matrix', eq: '\\rho = \\tfrac{1}{2}(I + Z) = \\tfrac{1}{2}\\begin{pmatrix} 1+1 & 0 \\\\ 0 & 1-1 \\end{pmatrix} = \\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}', t: '' },
    { h: 'Recognize it', t: 'That diagonal matrix is exactly the projector $|0\\rangle\\langle 0|$.' },
    { h: 'Answer', t: '**|0⟩⟨0|** — the north pole of the Bloch sphere is the |0⟩ state.' },
  ]},

  /* ---------- density operators ---------- */
  ax021: { viz: { scene: 'state', th: Math.PI / 2, ph: 0.5, free: true, lab: 'pure: arrow on surface' }, steps: [
    { h: 'What we\'re doing', t: 'Purity $\\mathrm{Tr}(\\rho^2)$ asks how "unmixed" a state is — 1 means perfectly pure.' },
    { h: 'Pure state ρ', t: 'For $\\rho = |\\psi\\rangle\\langle\\psi|$ (a projector), $\\rho^2 = \\rho$ — projectors are idempotent.' },
    { h: 'Trace it', eq: '\\mathrm{Tr}(\\rho^2) = \\mathrm{Tr}(\\rho) = \\langle\\psi|\\psi\\rangle = 1', t: '' },
    { h: 'Answer', t: '**1** — a pure state has maximal purity. The Bloch arrow sits exactly on the sphere surface.' },
  ]},

  ax022: { viz: { scene: 'decay', lab: 'mixed: arrow shrinks' }, steps: [
    { h: 'What we\'re doing', t: '$\\rho = I/2$ is the "total ignorance" state — equal probability of everything.' },
    { h: 'Square it', t: '$\\rho^2 = I/4$.' },
    { h: 'Trace it', eq: '\\mathrm{Tr}(I/4) = \\tfrac{1}{4}\\cdot\\mathrm{Tr}(I) = \\tfrac{1}{4}\\cdot 2 = \\tfrac{1}{2}', t: 'The trace of a 2×2 identity is just 2.' },
    { h: 'Answer', t: '**1/2** — the single-qubit purity floor. Bloch vector: zero length, dead center.' },
  ]},

  ax023: { viz: { scene: 'decay', lab: 'S_L measures the shrink' }, steps: [
    { h: 'What we\'re doing', t: 'Linear entropy $S_L = 1 - \\mathrm{Tr}(\\rho^2)$ = "one minus purity".' },
    { h: 'Pure state first', t: 'For pure $\\rho$: $\\mathrm{Tr}(\\rho^2) = 1$ (from the purity definition).' },
    { h: 'Answer', eq: 'S_L = 1 - 1 = 0', t: '**0** — zero mixedness. Maximal for the maximally mixed state: $1 - \\tfrac{1}{2} = \\tfrac{1}{2}$.' },
  ]},

  ax024: { viz: { scene: 'pair', mode: 'same', lab: 'product state |00⟩' }, steps: [
    { h: 'What we\'re doing', t: 'Partial trace $\\mathrm{Tr}_B$ means: forget qubit B, keep whatever A still knows.' },
    { h: 'Check for entanglement', t: '$\\rho_{AB} = |00\\rangle\\langle 00|$ is a *product* state — A and B are independent. No entanglement.' },
    { h: 'Trace out B', t: 'Forgetting B on a product state just removes it: A keeps its pure $|0\\rangle$.' },
    { h: 'Answer', eq: '\\rho_A = |0\\rangle\\langle 0|', t: '**pure |0⟩** — product states trace out cleanly. Compare with the entangled case (I/2) next.' },
  ]},

  ax025: { viz: { scene: 'pair', mode: 'bell', lab: 'Bell pair — halves are mixed' }, steps: [
    { h: 'What we\'re doing', t: 'Same partial trace, but now on the entangled Bell state $|\\Phi^+\\rangle = \\tfrac{1}{\\sqrt{2}}(|00\\rangle+|11\\rangle)$.' },
    { h: 'Expand and trace', eq: '\\rho_A = \\tfrac{1}{2}\\big(|0\\rangle\\langle 0| \\cdot \\langle 0|0\\rangle + |1\\rangle\\langle 1| \\cdot \\langle 1|1\\rangle\\big)', t: 'Each B-outcome contributes its A-projector weighted by the overlap of the B-parts.' },
    { h: 'Simplify', eq: '\\rho_A = \\tfrac{1}{2}|0\\rangle\\langle 0| + \\tfrac{1}{2}|1\\rangle\\langle 1| = \\tfrac{I}{2}', t: '' },
    { h: 'Answer', t: '**I/2** — maximally mixed. The pair is perfectly pure, yet each half is total ignorance: all the information lives in the correlation. This is *the* definition of entanglement.' },
  ]},

  ax026: { viz: { scene: 'outer' }, steps: [
    { h: 'What we\'re doing', t: 'Rank = number of independent directions a matrix pushes into — equivalently, its number of nonzero eigenvalues.' },
    { h: 'Look at $|\\psi\\rangle\\langle\\psi|$', t: 'Every output is proportional to $|\\psi\\rangle$: $(|\\psi\\rangle\\langle\\psi|)|\\varphi\\rangle = \\langle\\psi|\\varphi\\rangle\\cdot|\\psi\\rangle$ — always a scaled copy of the same vector.' },
    { h: 'Answer', eq: '\\mathrm{rank}(|\\psi\\rangle\\langle\\psi|) = 1', t: '**1** — one column direction spans everything. Ket-bras are the simplest possible matrices.' },
  ]},

  /* ---------- encoding ---------- */
  ax027: { viz: { scene: 'state', th: 2 * Math.acos(3 / 5), lab: '(3,4) → |x⟩' }, steps: [
    { h: 'What we\'re doing', t: 'Amplitude encoding: put the vector\'s entries onto basis states, then normalize so the state has length 1.' },
    { h: 'Find the norm', eq: '\\|x\\| = \\sqrt{3^2 + 4^2} = \\sqrt{25} = 5', t: 'The classic 3-4-5 triangle.' },
    { h: 'Divide through', eq: '|x\\rangle = \\tfrac{1}{5}(3|0\\rangle + 4|1\\rangle)', t: '' },
    { h: 'Answer', t: '**$(3|0\\rangle + 4|1\\rangle)/5$** — a unit state: $(3/5)^2 + (4/5)^2 = 9/25 + 16/25 = 1$ ✓.' },
  ]},

  ax028: { viz: { scene: 'dims' }, steps: [
    { h: 'What we\'re doing', t: 'Each qubit doubles the number of amplitude slots: $n$ qubits hold $2^n$ features.' },
    { h: 'Invert it', eq: 'N = 2^n \\;\\Rightarrow\\; n = \\log_2 N', t: '' },
    { h: 'Plug N = 1024', t: '$\\log_2 1024 = 10$ since $2^{10} = 1024$.' },
    { h: 'Answer', t: '**10 qubits** — the exponential compression that makes amplitude encoding seductive… and its brutal loading cost is the catch nobody skips.' },
  ]},

  ax029: { viz: { scene: 'overlap' }, steps: [
    { h: 'What we\'re doing', t: 'Two angle-encoded states overlap as $k(x,x^{\\prime}) = \\cos^2(\\Delta x/2)$ where $\\Delta x = x - x^{\\prime}$.' },
    { h: 'Plug Δx = π', t: '$\\Delta x/2 = \\pi/2$ and $\\cos(\\pi/2) = 0$.' },
    { h: 'Square', eq: 'k = \\cos^{2}\\tfrac{\\pi}{2} = 0', t: '' },
    { h: 'Answer', t: '**0** — inputs π apart encode to *orthogonal* states ($|0\\rangle$ vs $|1\\rangle$). Maximum dissimilarity.' },
  ]},

  ax030: { viz: { scene: 'overlap' }, steps: [
    { h: 'What we\'re doing', t: 'Same kernel: $k = \\cos^2(\\Delta x/2)$, now with $\\Delta x = \\pi/2$.' },
    { h: 'Half it', t: '$\\Delta x/2 = \\pi/4$, and $\\cos(\\pi/4) = \\tfrac{\\sqrt{2}}{2}$.' },
    { h: 'Square — don\'t skip this', eq: 'k = \\left(\\tfrac{\\sqrt{2}}{2}\\right)^{2} = \\tfrac{2}{4} = \\tfrac{1}{2}', t: 'The overlap is $\\tfrac{\\sqrt{2}}{2}$; the kernel is its square.' },
    { h: 'Answer', t: '**1/2** — midway similarity. Common trap: reporting $\\sqrt{2}/2$ (the overlap, not the kernel).' },
  ]},

  ax031: { viz: { scene: 'norm' }, steps: [
    { h: 'What we\'re doing', t: 'To be a valid state, amplitudes must square-sum to 1. Currently $(1,1,1,1)$ has norm $\\sqrt{4} = 2$.' },
    { h: 'Divide by the norm', eq: '|x\\rangle = \\tfrac{1}{2}(|00\\rangle + |01\\rangle + |10\\rangle + |11\\rangle)', t: 'Each entry becomes $1/2$.' },
    { h: 'Verify', t: '$4 \\times (1/2)^2 = 4 \\times 1/4 = 1$ ✓' },
    { h: 'Answer', t: '**1/2 each** — the uniform superposition over 2 qubits. This is the state $H|00\\rangle$ builds.' },
  ]},

  /* ---------- learning / VQA ---------- */
  ax032: { viz: { scene: 'landscape', mode: 'smooth' }, steps: [
    { h: 'What we\'re doing', t: 'Parameter-shift computes the exact gradient using the function itself, evaluated at two shifted angles — no backprop needed.' },
    { h: 'Set up', t: '$f(\\theta) = \\sin\\theta$, at $\\theta = 0$.' },
    { h: 'Two evaluations', eq: '\\partial_\\theta f = \\tfrac{1}{2}\\big[\\sin(\\tfrac{\\pi}{2}) - \\sin(-\\tfrac{\\pi}{2})\\big] = \\tfrac{1}{2}[1 - (-1)] = 1', t: '' },
    { h: 'Answer', t: '**1** — matching $\\cos(0) = 1$ from calculus. The quantum computer gives you the true derivative, not an approximation.' },
  ]},

  ax033: { viz: { scene: 'landscape', mode: 'smooth' }, steps: [
    { h: 'What we\'re doing', t: 'Same rule: $\\partial_\\theta f = \\tfrac{1}{2}[f(\\theta+\\pi/2) - f(\\theta-\\pi/2)]$.' },
    { h: 'Plug f = cos, θ = 0', eq: '\\tfrac{1}{2}\\big[\\cos(\\tfrac{\\pi}{2}) - \\cos(-\\tfrac{\\pi}{2})\\big] = \\tfrac{1}{2}[0 - 0] = 0', t: '' },
    { h: 'Answer', t: '**0** — the cosine is flat at its peak: gradient zero exactly where the function is maximal. Matches $-\\sin(0) = 0$.' },
  ]},

  ax034: { viz: { scene: 'landscape', mode: 'smooth' }, steps: [
    { h: 'What we\'re doing', t: 'One gradient-descent step: move opposite the gradient, scaled by the learning rate.' },
    { h: 'The rule', eq: '\\theta^{\\prime} = \\theta - \\eta\\,\\nabla C', t: '' },
    { h: 'Plug in', t: '$\\theta^{\\prime} = 1 - 0.1 \\times 2 = 1 - 0.2$.' },
    { h: 'Answer', t: '**0.8** — a step downhill. η controls how brave the step is: too big overshoots, too small crawls.' },
  ]},

  ax035: { viz: { scene: 'measure' }, steps: [
    { h: 'What we\'re doing', t: 'You never see $\\langle H\\rangle$ directly — only the average of your shots.' },
    { h: 'The estimator', eq: '\\hat{E} = \\tfrac{1}{S}\\sum_{s} o_s', t: '' },
    { h: 'Sum the outcomes', t: '$+1 + 1 - 1 + 1 = 2$, over $S = 4$ shots.' },
    { h: 'Answer', eq: '\\hat{E} = \\tfrac{2}{4} = \\tfrac{1}{2}', t: '**1/2**. More shots → this estimate converges to the true expectation.' },
  ]},

  ax036: { viz: { scene: 'measure' }, steps: [
    { h: 'What we\'re doing', t: 'Every measured probability has binomial noise: $\\sigma_{\\hat{p}} = \\sqrt{p(1-p)/S}$.' },
    { h: 'Plug p = 1/4, S = 100', eq: '\\sigma_{\\hat{p}} = \\sqrt{\\tfrac{0.25 \\times 0.75}{100}} = \\sqrt{0.001875}', t: '' },
    { h: 'Compute', t: '$\\sqrt{0.001875} \\approx 0.0433 \\approx 4.3\\%$.' },
    { h: 'Answer', t: '**≈ 4.3%** — with only 100 shots, your probability estimate has a ~4-point error bar. This is why real experiments burn millions of shots.' },
  ]},

  ax037: { viz: { scene: 'measure' }, steps: [
    { h: 'What we\'re doing', t: 'Monte Carlo rule: error shrinks as $1/\\sqrt{S}$, so getting error $\\varepsilon$ needs $S \\sim 1/\\varepsilon^2$ shots.' },
    { h: 'Plug ε = 0.01', eq: 'S \\sim \\tfrac{1}{(0.01)^2} = \\tfrac{1}{10^{-4}} = 10^{4}', t: '' },
    { h: 'Answer', t: '**10⁴ shots** — ten thousand runs for two decimal places. Halve the error → quadruple the shots. This quadratic tax is THE bottleneck of every variational quantum algorithm.' },
  ]},

  ax038: { viz: { scene: 'landscape', mode: 'barren' }, steps: [
    { h: 'What we\'re doing', t: 'On deep random circuits, gradient variance scales as $\\mathrm{Var} \\sim 2^{-n}$ — it dies exponentially with qubit count.' },
    { h: 'Plug n = 20', eq: '2^{-20} = \\tfrac{1}{1{,}048{,}576} \\approx 10^{-6}', t: '' },
    { h: 'Answer', t: '**~10⁻⁶** — the gradient signal is a million times weaker than at n=0. Below shot noise → training is blind. That\'s the barren plateau.' },
  ]},

  ax039: { viz: { scene: 'dims' }, steps: [
    { h: 'What we\'re doing', t: 'HHL runtime: $O(\\kappa^2 \\log N / \\varepsilon)$. Ask which factor creates the exponential gap vs classical $O(N)$-ish solvers.' },
    { h: 'Compare terms', t: '$\\kappa^2$ and $1/\\varepsilon$ are "constants" of the problem\'s difficulty — they exist classically too.' },
    { h: 'The magic factor', t: '$\\log N$ vs $N$: for $N = 10^{12}$, classical needs ~trillion operations, HHL ~40. THAT\'S the exponential claim.' },
    { h: 'Answer', t: '**log N** — the fine print (sparse matrix, low κ, fast loading, expectation-only output) is what often erases it in practice.' },
  ]},

  ax040: { viz: { scene: 'winding' }, steps: [
    { h: 'What we\'re doing', t: 'QFT output amplitude on basis state $k$ is $\\tfrac{1}{\\sqrt{N}}e^{2\\pi i jk/N}$ — magnitude fixed, phase winds.' },
    { h: 'Plug N=4, j=1, k=1', eq: '\\tfrac{1}{\\sqrt{4}}e^{2\\pi i \\cdot 1 \\cdot 1/4} = \\tfrac{1}{2}e^{i\\pi/2}', t: '' },
    { h: 'Evaluate the phase', t: '$e^{i\\pi/2} = i$ — a quarter-turn around the unit circle.' },
    { h: 'Answer', t: '**i/2** — amplitude magnitude 1/2, pure phase $i$. QFT moves all the information into the phase winding.' },
  ]},

  ax041: { viz: { scene: 'levels', lab: 'p layers → 2p angles' }, steps: [
    { h: 'What we\'re doing', t: 'Each QAOA layer adds exactly two angles: $\\gamma_l$ for the cost layer, $\\beta_l$ for the mixer.' },
    { h: 'Count', eq: 'n_{params} = 2 \\times p', t: '' },
    { h: 'Plug p = 3', t: '$2 \\times 3 = 6$ parameters: $\\gamma_1,\\beta_1,\\gamma_2,\\beta_2,\\gamma_3,\\beta_3$.' },
    { h: 'Answer', t: '**6** — QAOA has remarkably few knobs. The classical optimizer only tunes these angles.' },
  ]},

  ax042: { viz: { scene: 'state', th: Math.PI / 2, ph: Math.PI / 2, lab: '|+i⟩ on the Y axis' }, steps: [
    { h: 'What we\'re doing', t: '$|{+i}\\rangle = \\tfrac{1}{\\sqrt{2}}(|0\\rangle + i|1\\rangle)$ — sits at the +Y pole of the Bloch sphere.' },
    { h: 'Eigenstate check', t: '$Y|{+i}\\rangle = +1\\cdot|{+i}\\rangle$ — it\'s Y\'s eigenstate, just like |+⟩ is X\'s.' },
    { h: 'Expectation', eq: '\\langle +i|Y|+i\\rangle = +1 \\cdot \\langle +i|+i\\rangle = 1', t: '' },
    { h: 'Answer', t: '**1** — deterministic +1. Three eigenstate pairs, three axes: |0⟩/|1⟩ ↔ Z, |±⟩ ↔ X, |±i⟩ ↔ Y.' },
  ]},
};
