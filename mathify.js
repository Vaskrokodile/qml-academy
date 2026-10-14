// mathify.js — convert unicode math inside JS string literals to $...$ LaTeX.
//   node mathify.js scan    -> writes mathmap.json + mathmap.txt (review, no file changes)
//   node mathify.js apply   -> rewrites data files using mathmap.json
// Hand overrides live in OVERRIDES keyed by the exact decoded string.
const fs = require('fs');
const path = require('path');
const root = __dirname;
const DATA = ['bank.js', 'evals.js', 'courses.js'].map(f => path.join(root, 'assets/js/data', f));
const flags = [];

/* ================= character maps ================= */
const GREEK = {
  'α':'\\alpha','β':'\\beta','γ':'\\gamma','δ':'\\delta','ε':'\\varepsilon','ζ':'\\zeta',
  'η':'\\eta','θ':'\\theta','ι':'\\iota','κ':'\\kappa','λ':'\\lambda','μ':'\\mu','ν':'\\nu',
  'ξ':'\\xi','π':'\\pi','ρ':'\\rho','ς':'\\varsigma','σ':'\\sigma','τ':'\\tau','υ':'\\upsilon',
  'φ':'\\varphi','ϕ':'\\phi','χ':'\\chi','ψ':'\\psi','ω':'\\omega',
  'Γ':'\\Gamma','Δ':'\\Delta','Θ':'\\Theta','Λ':'\\Lambda','Ξ':'\\Xi','Π':'\\Pi','Φ':'\\Phi','Ψ':'\\Psi','Ω':'\\Omega'
};
const SUB = { '₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9',
  'ᵢ':'i','ⱼ':'j','ₖ':'k','ₗ':'l','ₘ':'m','ₙ':'n','ₚ':'p','ᵣ':'r','ₛ':'s','ₜ':'t','ₓ':'x',
  '₊':'+','₋':'-','₌':'=','₍':'(','₎':')','ₐ':'a','ₑ':'e' };
const SUP = { '⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9',
  'ⁿ':'n','ⁱ':'i','ʲ':'j','ᵏ':'k','ˡ':'l','ᵐ':'m','ᵖ':'p','ʳ':'r','ˢ':'s','ᵗ':'t','ᵛ':'v','ʷ':'w','ˣ':'x','ʸ':'y',
  'ᵀ':'T','ᴺ':'N','ᴸ':'L','ᴴ':'H','ᴮ':'B','ᶻ':'z','⁺':'+','⁻':'-','⁼':'=','⁽':'(','⁾':')',
  '†':'\\dagger','‡':'\\ddagger','′':'\\prime','″':'\\prime\\prime' };
const OPS = {
  '⟨':'\\langle ','⟩':'\\rangle ','⊗':'\\otimes ','⊕':'\\oplus ','⊖':'\\ominus ','⊙':'\\odot ',
  '⇒':'\\Rightarrow ','⇔':'\\Leftrightarrow ','→':'\\to ','⟶':'\\longrightarrow ','←':'\\leftarrow ',
  '↔':'\\leftrightarrow ','↦':'\\mapsto ','↑':'\\uparrow ','↓':'\\downarrow ',
  '∝':'\\propto ','≈':'\\approx ','≃':'\\simeq ','≅':'\\cong ','≡':'\\equiv ',
  '≥':'\\geq ','≤':'\\leq ','≠':'\\neq ','⪰':'\\succeq ','⪯':'\\preceq ','≫':'\\gg ','≪':'\\ll ',
  '∞':'\\infty ','∈':'\\in ','∉':'\\notin ','⊆':'\\subseteq ','⊂':'\\subset ','∪':'\\cup ','∩':'\\cap ',
  '∂':'\\partial ','∇':'\\nabla ','∫':'\\int ','ℏ':'\\hbar ','ℓ':'\\ell ',
  '·':'\\cdot ','⋅':'\\cdot ','±':'\\pm ','∓':'\\mp ','−':'-','×':'\\times ','÷':'\\div ',
  '⌈':'\\lceil ','⌉':'\\rceil ','⌊':'\\lfloor ','⌋':'\\rfloor ',
  '‖':'\\|','∥':'\\|','~':'\\sim ','∘':'\\circ ','∀':'\\forall ','∃':'\\exists ','¬':'\\neg ',
  '∧':'\\wedge ','∨':'\\vee ','∅':'\\emptyset ','⊤':'\\top ','⊥':'\\bot ',
  'ℝ':'\\mathbb{R}','ℂ':'\\mathbb{C}','ℕ':'\\mathbb{N}','ℤ':'\\mathbb{Z}','ℚ':'\\mathbb{Q}','ℍ':'\\mathbb{H}',
  '…':'\\dots ','⋯':'\\cdots ','⋮':'\\vdots ','⨂':'\\bigotimes ','∑':'\\sum '
};
const NONSEED_OPS = new Set(['…','⋯','·','⋅']);  // join clusters but never start one
const FRACCHAR = { '½':[1,2],'⅓':[1,3],'⅔':[2,3],'¼':[1,4],'¾':[3,4],'⅛':[1,8],'⅜':[3,8],'⅝':[5,8],'⅞':[7,8],'⅕':[1,5],'⅖':[2,5],'⅗':[3,5],'⅘':[4,5] };
const MATHWORDS = {
  Tr:'\\mathrm{Tr}',Re:'\\mathrm{Re}',Im:'\\mathrm{Im}',Pr:'\\Pr',det:'\\det',dim:'\\dim',ker:'\\ker',
  min:'\\min',max:'\\max',log:'\\log',ln:'\\ln',exp:'\\exp',cos:'\\cos',sin:'\\sin',tan:'\\tan',
  mod:'\\bmod',diag:'\\mathrm{diag}',rank:'\\mathrm{rank}',argmin:'\\mathrm{argmin}',argmax:'\\mathrm{argmax}',
  cut:'\\mathrm{cut}',runtime:'\\mathrm{runtime}',ancilla:'\\mathrm{ancilla}',driver:'\\mathrm{driver}',
  problem:'\\mathrm{problem}',cost:'\\mathrm{cost}',th:'\\mathrm{th}',sign:'\\mathrm{sign}',sgn:'\\mathrm{sgn}',
  QFT:'\\mathrm{QFT}',QPE:'\\mathrm{QPE}',CNOT:'\\mathrm{CNOT}',GHZ:'\\mathrm{GHZ}',HHL:'\\mathrm{HHL}',
  QAOA:'\\mathrm{QAOA}',QUBO:'\\mathrm{QUBO}',VQE:'\\mathrm{VQE}',SVM:'\\mathrm{SVM}',QML:'\\mathrm{QML}',
  QPU:'\\mathrm{QPU}',GPU:'\\mathrm{GPU}',BPP:'\\mathrm{BPP}',BQP:'\\mathrm{BQP}',NP:'\\mathrm{NP}',ReLU:'\\mathrm{ReLU}'
};
const TEXTWORDS = new Set(['and','or','where','on','for','with','if','to','in','of','as','at','by','over','maps','gives','into','under','from','then','else','when','is','be','are','than']);
/* math function/operator names — always math when followed by math-ish tokens */
const FUNCWORDS = new Set(['Tr','Re','Im','Pr','det','dim','ker','min','max','log','ln','exp','cos','sin','tan','argmin','argmax','mod','sgn','QFT','QPE','CNOT','GHZ','HHL','QAOA','QUBO','VQE','SVM','ReLU','diag']);
/* short English words that must not glue into math */
const PROSE3 = new Set(['the','and','for','with','then','than','this','that','into','only','also','just','some','such','each','both','more','most','less','very','what','when','can','are','not','but','all','any','one','two','way','use','see','per','via','has','may','was','its','new','get','set','how','who','say','put','let']);
const ROMANSUB = new Set(['driver','problem','cost','th','min','max','ancilla','runtime','crit','mix','eff','avg','tot','opt']);
const PAULI = { 'ᶻ':'z','ˣ':'x','ʸ':'y' };
const JOINPUNCT = new Set(['(',')','[',']','{','}','|','=','+','-','*','/','^','_','<','>','~',':']);

function isSeedChar(ch) {
  return GREEK[ch] || SUB[ch] || SUP[ch] || FRACCHAR[ch] || ch === '⃗' ||
    (OPS[ch] && !NONSEED_OPS.has(ch)) || ch === '√' || ch === '∛' ||
    'Σ∏'.includes(ch);
}

/* ================= tokenizer ================= */
function tokenize(s) {
  const toks = [];
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (/\s/.test(ch)) { let j = i; while (j < s.length && /\s/.test(s[j])) j++; toks.push({ t: 'sp', v: s.slice(i, j) }); i = j; continue; }
    if (/[0-9]/.test(ch)) { let j = i; while (j < s.length && /[0-9.]/.test(s[j])) j++; toks.push({ t: 'num', v: s.slice(i, j) }); i = j; continue; }
    if (/[A-Za-z]/.test(ch)) { let j = i; while (j < s.length && /[A-Za-z]/.test(s[j])) j++; toks.push({ t: 'word', v: s.slice(i, j) }); i = j; continue; }
    if (GREEK[ch]) { toks.push({ t: 'greek', v: ch }); i++; continue; }
    if (SUB[ch]) { let j = i; while (j < s.length && SUB[s[j]]) j++; toks.push({ t: 'sub', v: s.slice(i, j) }); i = j; continue; }
    if (SUP[ch]) { let j = i; while (j < s.length && SUP[s[j]]) j++; toks.push({ t: 'sup', v: s.slice(i, j) }); i = j; continue; }
    if (FRACCHAR[ch]) { toks.push({ t: 'frac', v: ch }); i++; continue; }
    if (ch === '⃗') { toks.push({ t: 'vec', v: ch }); i++; continue; }
    if (ch === '√' || ch === '∛') { toks.push({ t: 'sqrt', v: ch }); i++; continue; }
    if ('Σ∏'.includes(ch)) { toks.push({ t: 'sumop', v: ch }); i++; continue; }
    if (OPS[ch]) { toks.push({ t: 'op', v: ch }); i++; continue; }
    toks.push({ t: 'punct', v: ch }); i++;
  }
  return toks;
}

function mathOK(tok) {
  switch (tok.t) {
    case 'num': case 'greek': case 'sub': case 'sup': case 'frac': case 'op': case 'vec':
    case 'sqrt': case 'sumop': return true;
    case 'word': return tok.v.length === 1 || MATHWORDS[tok.v] || TEXTWORDS.has(tok.v.toLowerCase()) ||
      (tok.v.length <= 4 && tok.v.length > 1 && !PROSE3.has(tok.v.toLowerCase()) && !PROSE2.has(tok.v.toLowerCase()) && !TEXTWORDS.has(tok.v.toLowerCase()));
    case 'punct': return JOINPUNCT.has(tok.v) || tok.v === ',' || tok.v === '.' || tok.v === '*';
    case 'sp': return true;
    default: return false;
  }
}
/* words that are (almost) always prose even when short */
const PROSE2 = new Set(['no','up','us','go','am','an','we','it','me','my','he','so','do','ok','hi','oh','ah','um']);
const ARITH = new Set(['-','+','/','*','=','^','_','(',',','<','>','−','±','·']);

function isSignal(toks, i) {
  const t = toks[i];
  if (['greek','sub','sup','frac','vec','sqrt','sumop'].includes(t.t)) return true;
  if (t.t === 'op') return !NONSEED_OPS.has(t.v);
  if (t.t === 'punct' && t.v === '/' && i > 0 && toks[i - 1].t === 'num' && toks[i + 1] && toks[i + 1].t === 'num') return true;  // 2/3
  if (t.t === 'word' && MATHWORDS[t.v]) {
    // seed only when math follows: Tr(A), min E, cut =, runtime ∝
    const p = nextNonSpace(toks, i + 1);
    if (p < 0) return false;
    const nt = toks[p];
    if (nt.t === 'punct') return nt.v === '(' || nt.v === '=';   // Tr(A), cut = — strong signals
    if (!FUNCWORDS.has(t.v)) {                                  // nouns like 'driver' need non-prose context
      const pr = prevNonSpace(toks, i - 1);
      if (pr >= 0 && isProseWord(toks[pr])) return false;
    }
    return (nt.t !== 'word' && mathOK(nt)) || (nt.t === 'word' && nt.v.length === 1);
  }
  // lone letter glued to ( or =  -> math like P(0), x =
  if (t.t === 'word' && t.v.length === 1) {
    const nxt = toks[i + 1], nxt2 = toks[i + 2];
    if (nxt && nxt.t === 'punct' && nxt.v === '(') return true;
    if (nxt && nxt.t === 'sp' && nxt2 && nxt2.t === 'punct' && (nxt2.v === '=' || nxt2.v === '(')) return true;
    if (nxt && nxt.t === 'punct' && nxt.v === '=') return true;
  }
  return false;
}
function isProseWord(tok) {
  return tok.t === 'word' && tok.v.length > 1 && !MATHWORDS[tok.v];
}
/* index of next/prev non-space token, or -1 */
function nextNonSpace(toks, i) { let k = i; while (k < toks.length && toks[k].t === 'sp') k++; return k < toks.length ? k : -1; }
function prevNonSpace(toks, i) { let k = i; while (k >= 0 && toks[k].t === 'sp') k--; return k; }

/* can a word absorb into a math cluster across a space?
   dir 'L': word is LEFT of the cluster; 'R': word is RIGHT of it. */
function wordAbsorb(toks, wi, dir) {
  const w = toks[wi].v;
  const nxt = nextNonSpace(toks, wi + 1);
  const prv = prevNonSpace(toks, wi - 1);
  const inIdx = dir === 'L' ? nxt : prv;   // token toward the cluster
  const outIdx = dir === 'L' ? prv : nxt;  // token away from the cluster
  const outTok = outIdx >= 0 ? toks[outIdx] : null;
  const inTok = inIdx >= 0 ? toks[inIdx] : null;
  const outProse = outTok && isProseWord(outTok);
  if (MATHWORDS[w]) return !outProse;                      // 'driver'/'sign' next to prose stays prose
  if (TEXTWORDS.has(w.toLowerCase())) {                  // 'and'/'with' only between math tokens
    if (!outTok || !mathOK(outTok) || outProse || outTok.t === 'op' || outTok.t === 'punct') return false;
    if (outTok.t === 'word') {                           // 'is a bra', 'and the result' — phrase, not math
      const nxt = dir === 'R' ? nextNonSpace(toks, outIdx + 1) : prevNonSpace(toks, outIdx - 1);
      if (nxt >= 0 && toks[nxt].t === 'word' && toks[nxt].v.length > 1) return false;
    }
    return true;
  }
  if (w.length === 1) {
    if ((w === 'e' || w === 'i') && toks[wi + 1] && toks[wi + 1].v === '.') return false;  // e.g. / i.e.
    if ('aAI'.includes(w)) {                             // articles/pronouns: only in arith context
      if (outTok && outTok.t === 'word' && outTok.v.length > 1) return false;  // 'a computational', 'a state'
      const script = t => t && (t.t === 'sub' || t.t === 'sup' || t.t === 'frac');
      return !!(inTok && (ARITH.has(inTok.v) || script(inTok))) ||
             !!(outTok && (ARITH.has(outTok.v) || script(outTok)));
    }
    return true;                                         // x, i, v, Z ... single letters are math
  }
  if (w.length === 2 && !PROSE2.has(w.toLowerCase()))    // bi, ij, Av, xk — products of two vars
    return !outProse || !!(inTok && (ARITH.has(inTok.v) || inTok.v === '='));
  return false;
}

function clusters(toks) {
  const out = [], n = toks.length, used = new Array(n).fill(false);
  const DROP_R = new Set(['(', '[', '{', '=', ':', '.', ',', '-', '+', '/', '_', '^', '⟨', '⌈', '→', '⇒', '∝', '~', '×', '±', '−', '<', '>', '·', '…']);
  const DROP_L = new Set([')', ']', '}', ',', ':', '.', '=', '-', '+', '*', '/', '_', '^', '→', '⇒', '∝', '×', '±', '−', '<', '>', '·', '…', '⟩', '⌉']);
  for (let si = 0; si < n; si++) {
    if (!isSignal(toks, si) || used[si]) continue;
    let lo = si, hi = si;
    while (lo > 0) {                       // grow left
      const t = toks[lo - 1];
      if (t.t === 'sp') {
        const p = prevNonSpace(toks, lo - 1);
        if (p < 0 || !mathOK(toks[p]) || used[p]) break;
        if (toks[p].t === 'word' && !wordAbsorb(toks, p, 'L')) break;
        lo = p; continue;
      }
      if (!mathOK(t) || used[lo - 1]) break;
      if (t.t === 'word' && isProseWord(t) && !(t.v.length <= 4 && !PROSE3.has(t.v.toLowerCase()) && !PROSE2.has(t.v.toLowerCase()) && !TEXTWORDS.has(t.v.toLowerCase()))) break;
      if (t.v === '*' && lo - 2 >= 0 && toks[lo - 2].v === '*') break;          // ** markdown bold
      if (t.t === 'word' && (t.v === 'e' || t.v === 'i') && toks[lo] && toks[lo].v === '.') break;  // e.g./i.e.
      if (t.t === 'word' && t.v.length === 1 && toks[lo - 2] && toks[lo - 2].v === '.' &&
          toks[lo - 3] && (toks[lo - 3].v === 'e' || toks[lo - 3].v === 'i')) break;                  // tail of e.g./i.e.
      if ((t.v === ',' || t.v === '.' || t.v === ':') && (lo - 2 < 0 || !mathOK(toks[lo - 2]))) break;
      lo--;
    }
    while (hi < n - 1) {                   // grow right
      const t = toks[hi + 1];
      if (t.t === 'sp') {
        const p = nextNonSpace(toks, hi + 1);
        if (p < 0 || !mathOK(toks[p]) || used[p]) break;
        if (toks[p].t === 'word' && !wordAbsorb(toks, p, 'R')) break;
        hi = p; continue;
      }
      if (!mathOK(t) || used[hi + 1]) break;
      if (t.t === 'word' && isProseWord(t) && !(t.v.length <= 4 && !PROSE3.has(t.v.toLowerCase()) && !PROSE2.has(t.v.toLowerCase()) && !TEXTWORDS.has(t.v.toLowerCase()))) break;
      if (t.v === '*' && hi + 2 < n && toks[hi + 2].v === '*') break;           // ** markdown bold
      if (t.t === 'word' && (t.v === 'e' || t.v === 'i') && toks[hi + 2] && toks[hi + 2].v === '.') break;  // e.g./i.e.
      if (t.t === 'punct') {
        if (t.v === ',' || t.v === ':') {
          const p = nextNonSpace(toks, hi + 2);
          if (p >= 0 && mathOK(toks[p]) && !isProseWord(toks[p]) &&
              !(toks[p].t === 'word' && (toks[p].v === 'e' || toks[p].v === 'i') && toks[p + 1] && toks[p + 1].v === '.')) { hi = p; continue; }
          break;
        }
        if (t.v === '.') { if (!(toks[hi].t === 'num' && toks[hi + 2] && toks[hi + 2].t === 'num')) break; }
      }
      hi++;
    }
    while (lo <= hi && toks[lo].t === 'sp') lo++;
    while (hi >= lo && toks[hi].t === 'sp') hi--;
    // edge trim: dangling openers/operators on the right, closers/relics on the left
    while (hi > lo && (DROP_R.has(toks[hi].v) || toks[hi].t === 'sp')) hi--;
    while (lo < hi && (DROP_L.has(toks[lo].v) || toks[lo].t === 'sp')) lo++;
    // paren balance: drop unmatched edge brackets
    const bal = ch => toks.slice(lo, hi + 1).filter(t => t.v === ch).length;
    while (hi > lo && bal('(') > bal(')') && toks[hi].v === '(') hi--;
    while (lo < hi && bal(')') > bal('(') && toks[lo].v === ')') lo++;
    while (hi > lo && bal(')') > bal('(') && toks[hi].v === ')') hi--;
    while (lo < hi && bal('(') > bal(')') && toks[lo].v === '(') lo++;
    while (hi > lo && bal(']') > bal('[') && toks[hi].v === ']') hi--;
    while (hi > lo && bal('}') > bal('{') && toks[hi].v === '}') hi--;
    // unclosed opener (a prose paren sucked into the cluster) -> truncate at it
    {
      const st = [];
      let cut = -1;
      const PAIR = { ')': '(', ']': '[', '}': '{', '⌉': '⌈', '⌋': '⌊' };
      for (let k = lo; k <= hi && cut < 0; k++) {
        const v = toks[k].v;
        if ('([{⌈⌊'.includes(v)) st.push({ v, k });
        else if (PAIR[v]) {
          const ix = st.map(x => x.v).lastIndexOf(PAIR[v]);
          if (ix < 0) { cut = k; } else st.splice(ix, 1);
        } else if (v === '⟨') st.push({ v, k });
        else if (v === '‖') {
          const ix = st.map(x => x.v).lastIndexOf('‖');
          if (ix < 0) st.push({ v, k }); else st.splice(ix, 1);
        } else if (v === '|') {
          if (st.some(x => x.v === '⟨')) { /* bar inside a bra-ket: separator */ }
          else {
            const ix = st.map(x => x.v).lastIndexOf('|');
            if (ix < 0) st.push({ v, k }); else st.splice(ix, 1);
          }
        } else if (v === '⟩') {
          const ixBar = st.map(x => x.v).lastIndexOf('|');
          const ixBra = st.map(x => x.v).lastIndexOf('⟨');
          if (ixBar >= 0) st.splice(ixBar, 1);
          else if (ixBra >= 0) st.splice(ixBra, 1);
          else cut = k;
        }
      }
      if (cut >= 0) hi = cut - 1;
      else {
        const bad = st.filter(x => x.v !== '⟨');   // bare ⟨ψ| (a bra) is fine
        if (bad.length) hi = Math.min(hi, Math.min(...bad.map(x => x.k)) - 1);
      }
    }
    while (hi > lo && (DROP_R.has(toks[hi].v) || toks[hi].t === 'sp')) hi--;
    while (lo < hi && (DROP_L.has(toks[lo].v) || toks[lo].t === 'sp')) lo++;
    lo = Math.min(lo, si); hi = Math.max(hi, si);   // never trim the seed itself away
    if (lo <= hi) { for (let k = lo; k <= hi; k++) used[k] = true; out.push([lo, hi]); }
  }
  return out;
}

/* ================= unicode math -> LaTeX ================= */
function subText(run) { return [...run].map(c => SUB[c] || c).join(''); }
function supText(run) { return [...run].map(c => SUP[c] || c).join(''); }

const PROT = ' '; // protected-block sentinel

function translate(src, noFrac) {
  // σᶻᵢ₊₁ -> \sigma_z^{i+1}  (Pauli axis drops to subscript, site index rises)
  src = src.replace(/σ([ᶻˣʸ])([₀-₉ᵢⱼₖₗₘₙₚᵣₛₜₓₐₑ₊₋₌₍₎]*)/g,
    (m, ax, subs) => `${PROT}\\sigma_{${PAULI[ax]}}${subs ? `^{${subText(subs)}}` : ''}${PROT}`);
  // [[a,b],[c,d]] -> bmatrix
  src = src.replace(/\[\[(.+?)\]\]/g, (m, inner) => {
    const rows = inner.split('],[').map(r => r.split(',').map(c => translate(c.trim())).join('&'));
    return `${PROT}\\begin{bmatrix}${rows.join('\\\\')}\\end{bmatrix}${PROT}`;
  });

  let out = '';
  const atoms = [];       // [start,end) in out — for \vec and frac operand lookup
  let i = 0;
  const emit = t => { const st = out.length; out += t; return st; };
  const pushAtom = (st, en) => atoms.push([st, en == null ? out.length : en]);

  function nextAtomRaw(s, from) {
    let j = from;
    const c = s[j];
    if (c === '(' || c === '{') {
      const close = c === '(' ? ')' : '}';
      let d = 0;
      for (; j < s.length; j++) { if (s[j] === c) d++; if (s[j] === close) { d--; if (!d) { j++; break; } } }
      while (j < s.length && SUP[s[j]]) j++;
      return { end: j, paren: c === '(' };
    }
    if (c === '⟨') { while (j < s.length && s[j] !== '⟩') j++; return { end: j + 1 }; }
    if (c === '‖' || c === '∥') { const q = c; j++; while (j < s.length && s[j] !== q) j++; return { end: j + 1 }; }
    if (c === '|') { while (j < s.length && s[j] !== '⟩') j++; return { end: Math.min(j + 1, s.length) }; }
    if (c === '√' || c === '∛') { const a = nextAtomRaw(s, j + 1); return { end: a.end }; }
    if (c === 'Σ' || c === '∏') {
      j++;
      while (j < s.length && (SUB[s[j]] || SUP[s[j]])) j++;
      if (s[j] === '⟨') { while (j < s.length && s[j] !== '⟩') j++; return { end: j + 1 }; }
      const m = /^[a-z]{1,5}/.exec(s.slice(j));
      if (m) j += m[0].length;
      return { end: j };
    }
    if (/[0-9]/.test(c)) { while (j < s.length && /[0-9.]/.test(s[j])) j++; }
    else if (/[A-Za-z]/.test(c)) { while (j < s.length && /[A-Za-z]/.test(s[j])) j++; }
    else { j++; }
    while (j < s.length && (SUB[s[j]] || SUP[s[j]])) {
      if (SUB[s[j]]) { while (j < s.length && SUB[s[j]]) j++; }
      else { while (j < s.length && SUP[s[j]]) j++; }
    }
    return { end: j };
  }

  while (i < src.length) {
    const ch = src[i];
    if (ch === PROT) {
      const e = src.indexOf(PROT, i + 1);
      pushAtom(emit(src.slice(i + 1, e)));
      i = e + 1; continue;
    }
    if (/\s/.test(ch)) {
      let j = i; while (j < src.length && /\s/.test(src[j])) j++;
      out += (j - i >= 2) ? '\\quad ' : ' ';
      i = j; continue;
    }
    if (/[0-9]/.test(ch)) {
      let j = i; while (j < src.length && /[0-9.]/.test(src[j])) j++;
      pushAtom(emit(src.slice(i, j))); i = j; continue;
    }
    if (/[A-Za-z]/.test(ch)) {
      let j = i; while (j < src.length && /[A-Za-z]/.test(src[j])) j++;
      const w = src.slice(i, j), st = out.length;
      if (MATHWORDS[w]) out += MATHWORDS[w] + ' ';
      else if (TEXTWORDS.has(w.toLowerCase())) out += `\\text{ ${w} }`;
      else if (w.length <= 4 && !PROSE3.has(w.toLowerCase())) out += w;  // i, bi, kT, ixk — products
      else { out += `\\mathrm{${w}}`; flags.push(`word "${w}" -> \\mathrm{${w}}`); }
      pushAtom(st); i = j; continue;
    }
    if (GREEK[ch]) { pushAtom(emit(GREEK[ch] + (/[A-Za-z0-9]/.test(src[i + 1] || '') ? ' ' : ''))); i++; continue; }
    if (SUB[ch]) {
      let j = i; while (j < src.length && SUB[src[j]]) j++;
      pushAtom(emit(`_{${subText(src.slice(i, j))}}`)); i = j; continue;
    }
    if (SUP[ch]) {
      let j = i; while (j < src.length && SUP[src[j]]) j++;
      pushAtom(emit(`^{${supText(src.slice(i, j))}}`)); i = j; continue;
    }
    if (FRACCHAR[ch]) { const [a, b] = FRACCHAR[ch]; pushAtom(emit(`\\tfrac{${a}}{${b}}`)); i++; continue; }
    if (ch === '√' || ch === '∛') {
      const a = nextAtomRaw(src, i + 1);
      let inner = src.slice(i + 1, a.end);
      if (inner[0] === '(' && inner[inner.length - 1] === ')') inner = inner.slice(1, -1);
      pushAtom(emit(`\\sqrt{${translate(inner)}}`));
      i = a.end; continue;
    }
    if (ch === 'Σ' || ch === '∏' || ch === '∑') {
      const cmd = ch === '∏' ? '\\prod' : '\\sum';
      const st = out.length;
      if (src[i + 1] === '⟨') {
        let j = i + 2, inner = '';
        while (j < src.length && src[j] !== '⟩') inner += src[j++];
        const parts = [...inner].map(c => SUB[c] || c).join('').split('').join(',');
        out += `${cmd}_{\\langle ${parts}\\rangle}`; i = j + 1;
      } else {
        out += cmd + ' ';
        const m = /^[a-z]{2,5}/.exec(src.slice(i + 1));
        if (m && !MATHWORDS[m[0]]) { out += `_{${m[0]}}`; i += m[0].length; }
        i++;
      }
      pushAtom(st); continue;
    }
    if (ch === '(') {
      const a = nextAtomRaw(src, i);
      let d = 0, k = i;
      for (; k < a.end; k++) { if (src[k] === '(') d++; if (src[k] === ')') { d--; if (!d) break; } }
      const st = emit('(' + translate(src.slice(i + 1, k)) + ')');
      let j = k + 1;
      while (j < a.end) { emit(`^{${supText(src[j])}}`); j++; }
      pushAtom(st); i = a.end; continue;
    }
    if (ch === '_') {
      if (src[i + 1] === '{') {
        let k = i + 1, d = 0;
        for (; k < src.length; k++) { if (src[k] === '{') d++; if (src[k] === '}') { d--; if (!d) { k++; break; } } }
        pushAtom(emit(src.slice(i, k))); i = k; continue;
      }
      let j = i + 1; while (j < src.length && /[A-Za-z0-9]/.test(src[j])) j++;
      const w = src.slice(i + 1, j);
      if (!w) { emit('_'); i++; continue; }
      pushAtom(emit(`_{${ROMANSUB.has(w) ? '\\mathrm{' + w + '}' : w}}`));
      i = j; continue;
    }
    if (ch === '^') {
      if (i + 1 >= src.length) { emit('^'); i++; continue; }
      if (src[i + 1] === '(') {
        const a = nextAtomRaw(src, i + 1);
        let inner = src.slice(i + 2, a.end - 1);
        pushAtom(emit(`^{${translate(inner, true)}}`)); i = a.end; continue;
      }
      if (src[i + 1] === '{') {
        let k = i + 1, d = 0;
        for (; k < src.length; k++) { if (src[k] === '{') d++; if (src[k] === '}') { d--; if (!d) { k++; break; } } }
        pushAtom(emit('^{' + translate(src.slice(i + 2, k - 1), true) + '}')); i = k; continue;
      }
      pushAtom(emit(`^{${src[i + 1]}}`)); i += 2; continue;
    }
    if (ch === '{') {
      let k = i, d = 0;
      for (; k < src.length; k++) { if (src[k] === '{') d++; if (src[k] === '}') { d--; if (!d) { k++; break; } } }
      pushAtom(emit('\\{' + translate(src.slice(i + 1, k - 1)) + '\\}')); i = k; continue;
    }
    if (ch === '⃗') {
      const last = atoms[atoms.length - 1];
      if (last && last[1] === out.length) out = out.slice(0, last[0]) + '\\vec{' + out.slice(last[0]) + '}';
      i++; continue;
    }
    if (ch === '*' && src[i + 1] === '*') { emit('**'); i += 2; continue; }   // markdown bold
    if (ch === '*') { emit('^{*}'); i++; continue; }
    if (OPS[ch]) { emit(OPS[ch]); i++; continue; }
    if (ch === '|' || ch === '/' || ch === ',' || ch === '<' || ch === '>' || ch === ':' || ch === ')' || ch === ']' || ch === '}' || ch === '(' || ch === '[') { emit(ch); i++; continue; }
    out += ch; i++;
  }

  // range subscripts: _{k=1..p} -> _{k=1}^{p}; merge ^{-1}^-style double supers
  out = out.replace(/_\{([^{}]*)\.\.([^{}]*)\}/g, '_{$1}^{$2}');
  out = out.replace(/\^\{(-?[^{}]*)\}\^\{([^{}]*)\}/g, '^{$1$2}');

  /* ---------- fraction pass (iterative, on emitted LaTeX) ---------- */
  if (!noFrac) {
    // mask brace groups so slashes inside exponents/subscripts stay untouched
    const grps = [];
    out = out.replace(/\{(?:[^{}]|\{[^{}]*\})*\}/g, g => { grps.push(g); return '' + (grps.length - 1) + ''; });
    const GRP = String.raw`\{(?:[^{}]|\{[^{}]*\})*\}`;
    const ATOM = String.raw`(?:\([^()]*\)(?:\^\d+)?|\d+|\\[a-zA-Z]+${GRP}|\|[^|]*?\\rangle|\|[^|]*?\||\\?[A-Za-z](?:_\d+|\^\d+|_${GRP}|_\w|\^${GRP}|\^\w|\d+|[A-Za-z0-9])*|\d+(?:\.\d+)?)`;
    const FR = new RegExp(`(${ATOM})\\s*\\/\\s*(${ATOM})`, 'g');
    let prev;
    do {
      prev = out;
      out = out.replace(FR, (m, a, b) => {
        if (a.startsWith('\\text') || b.startsWith('\\text')) return m;
        const s = x => (/^\(.*\)$/.test(x) && !x.includes(',') && !/\^/.test(x)) ? x.slice(1, -1) : x;
        return `\\frac{${s(a)}}{${s(b)}}`;
      });
    } while (out !== prev);
    out = out.replace(/(\d+)/g, (m, i) => grps[+i]);
  }
  return out;
}

/* ================= literal extraction ================= */
function extractLiterals(text) {
  const lits = [];
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (ch === '/' && (text[i + 1] === '/' || text[i + 1] === '*')) {
      if (text[i + 1] === '/') { while (i < text.length && text[i] !== '\n') i++; }
      else { i += 2; while (i < text.length && !(text[i] === '*' && text[i + 1] === '/')) i++; i += 2; }
      continue;
    }
    if (ch === "'" || ch === '"') {
      const q = ch; let j = i + 1, raw = '';
      while (j < text.length) {
        if (text[j] === '\\') { raw += text[j] + text[j + 1]; j += 2; continue; }
        if (text[j] === q) break;
        raw += text[j]; j++;
      }
      lits.push({ start: i, end: j + 1, quote: q, raw });
      i = j + 1; continue;
    }
    i++;
  }
  return lits;
}
function decode(raw) {
  return raw.replace(/\\(.)/g, (m, c) => ({ n: '\n', t: '\t', r: '\r', "'": "'", '"': '"', '\\': '\\', 'u': '\\u' }[c] ?? (c === 'u' ? m : c)));
}
function encode(str, q) {
  return str.replace(/\\/g, '\\\\').replace(/\n/g, '\\n')
    .replace(new RegExp(q === "'" ? "'" : '"', 'g'), q === "'" ? "\\'" : '\\"');
}

/* ================= assembly ================= */
const WORDLIST = Object.keys(MATHWORDS).concat([...TEXTWORDS]);
const WORD_RE = new RegExp(`\\b(${WORDLIST.join('|')})\\b`, 'g');
function hasMathShape(s) {
  if ([...s].some(isSeedChar)) return true;
  if (s.length > 60 || !/^[\w\s+\-*/()^|=.,:{}\[\]<>~'\\#%&]+$/.test(s)) return false;
  if (!/[/()=|^_\[\]{}\\]/.test(s) && !/^\s*[+-]?\d+(\.\d+)?\s*$/.test(s)) return false;
  if (/^\s*[A-Za-z][\w-]*\s*$/.test(s)) return false;                    // lone word
  return !/[A-Za-z]{3,}/.test(s.replace(WORD_RE, ''));                  // no prose words left
}

function convertString(str) {
  const toks = tokenize(str);
  const cls = clusters(toks);
  const offsets = [];
  { let p = 0; for (const t of toks) { offsets.push([p, p + t.v.length]); p += t.v.length; } }
  if (!cls.length) {
    // whole-string conversion only for seedless (pure-ASCII) math — never for
    // strings whose seeds failed to cluster (those are prose with math bits).
    if (![...str].some(isSeedChar) && hasMathShape(str) && str.trim())
      return '$' + translate(str) + '$';
    return null;
  }
  let outStr = '', pos = 0;
  for (const [lo, hi] of cls) {
    const cs = offsets[lo][0], ce = offsets[hi][1];
    outStr += str.slice(pos, cs) + '$' + translate(str.slice(cs, ce)) + '$';
    pos = ce;
  }
  outStr += str.slice(pos);
  return outStr === str ? null : outStr;
}

/* hand overrides: decoded string -> final string (may be pure latex for equations) */
const OVERRIDES = {
};

if (process.argv[2] === 'scan') {
  const map = [];
  for (const f of DATA) {
    const text = fs.readFileSync(f, 'utf8');
    for (const lit of extractLiterals(text)) {
      const dec = decode(lit.raw);
      if (dec.includes('$')) continue;                                    // already converted
      if (![...dec].some(isSeedChar) && !hasMathShape(dec)) continue;
      const conv = OVERRIDES[dec] ?? convertString(dec);
      if (conv && conv !== dec) map.push({ file: path.basename(f), offset: lit.start, orig: dec, conv });
    }
  }
  fs.writeFileSync('mathmap.json', JSON.stringify(map, null, 2));
  fs.writeFileSync('mathmap.txt', map.map((m, i) => `[${i}] ${m.file}\n  IN : ${m.orig}\n  OUT: ${m.conv}\n`).join('\n'));
  console.log(`${map.length} strings would be converted — review mathmap.txt`);
  if (flags.length) { const u = [...new Set(flags)]; console.log(`\nflags (${u.length}):`); u.slice(0, 40).forEach(x => console.log('  ' + x)); }
} else if (process.argv[2] === 'apply') {
  const map = JSON.parse(fs.readFileSync('mathmap.json', 'utf8'));
  const byFile = {};
  map.forEach(m => (byFile[m.file] = byFile[m.file] || []).push(m));
  for (const f of DATA) {
    const base = path.basename(f);
    if (!byFile[base]) continue;
    let text = fs.readFileSync(f, 'utf8');
    const wanted = new Map(byFile[base].map(m => [m.orig, m.conv]));
    const lits = extractLiterals(text).sort((a, b) => b.start - a.start);
    let n = 0;
    for (const lit of lits) {
      const conv = wanted.get(decode(lit.raw));
      if (conv == null) continue;
      text = text.slice(0, lit.start) + lit.quote + encode(conv, lit.quote) + lit.quote + text.slice(lit.end);
      n++;
    }
    fs.writeFileSync(f, text);
    console.log(`${base}: rewrote ${n} literals`);
  }
} else {
  console.log('usage: node mathify.js scan|apply');
}
