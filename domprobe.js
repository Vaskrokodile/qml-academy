const katex = require('./assets/vendor/katex/katex.js');
const fs = require('fs');
const src = fs.readFileSync('assets/js/data/applied-bank.js', 'utf8');
// grab a few tex fields and check emitted data-sym spans incl. nesting
const texes = [...src.matchAll(/tex:'((?:[^'\\]|\\.)*)'/g)].map(m => m[1]).slice(0, 6);
for (const raw of texes) {
  const tex = raw.replace(/@\{([A-Za-z0-9_]+)\}/g, '\\htmlData{sym=$1}');
  const out = katex.renderToString(tex, { displayMode: true, trust: true, strict: 'ignore' });
  const syms = out.match(/data-sym="[^"]+"/g) || [];
  console.log(syms.join(' '), '| nested:', /data-sym="m"[^]*?data-sym="b1"/.test(out) || /data-sym="m"[^]*?data-sym="b0"/.test(out) ? 'YES' : 'n/a');
}
