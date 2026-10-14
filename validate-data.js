/* Validate every $...$ math segment in the real data files compiles with KaTeX. */
const fs = require('fs');
const katex = require('./assets/vendor/katex/katex.js');
const files = ['assets/js/data/courses.js', 'assets/js/data/course-gates.js', 'assets/js/data/course-deepening-a.js', 'assets/js/data/course-deepening-b.js', 'assets/js/data/practical.js', 'assets/js/data/bank.js', 'assets/js/data/evals.js', 'assets/js/data/definitions.js', 'assets/js/data/meta.js'];
let bad = 0, total = 0, eqBad = 0, eqTotal = 0;

for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  // pull JS string literals containing $
  const re = /'((?:[^'\\]|\\.)*\$[^']*)'/g;
  let m;
  while ((m = re.exec(src))) {
    let dec;
    try { dec = JSON.parse('"' + m[1].replace(/\\'/g, "'").replace(/'/g, "\\'").replace(/^(.*)$/, '$1').replace(/"/g, '\\"') + '"'); }
    catch { dec = m[1].replace(/\\(.)/g, '$1'); }
    const parts = dec.split('$');
    for (let k = 1; k < parts.length; k += 2) {
      total++;
      try { katex.renderToString(parts[k], { throwOnError: true, strict: 'ignore' }); }
      catch (e) {
        bad++;
        console.log('FAIL', f, '->', JSON.stringify(parts[k]).slice(0, 90), '|', e.message.slice(0, 80));
      }
    }
  }
}

// also check display-equation bodies: type:'equation' bodies feed tex() raw
const courseFiles = ['assets/js/data/courses.js', 'assets/js/data/course-gates.js', 'assets/js/data/course-deepening-a.js', 'assets/js/data/course-deepening-b.js'];
const re2 = /type:\s*'equation'[^}]*?body:\s*'((?:[^'\\]|\\.)*)'/g;
let m2;
for (const f of courseFiles) {
  const cs = fs.readFileSync(f, 'utf8');
  re2.lastIndex = 0;
  while ((m2 = re2.exec(cs))) {
    eqTotal++;
    let body = m2[1].replace(/\\(.)/g, '$1');
    const mm = /^\$([\s\S]+)\$$/.exec(body.trim());
    if (mm) body = mm[1];
    try { katex.renderToString(body, { displayMode: true, throwOnError: true, strict: 'ignore' }); }
    catch (e) { eqBad++; console.log('EQ FAIL', f, '->', JSON.stringify(body).slice(0, 90), '|', e.message.slice(0, 80)); }
  }
}
console.log(`--- ${total} inline segments (${bad} bad), ${eqTotal} equation bodies (${eqBad} bad)`);
