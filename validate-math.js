/* Validate every $...$ segment in mathmap.json renders with KaTeX. */
const fs = require('fs');
const katex = require('./assets/vendor/katex/katex.js');
const j = JSON.parse(fs.readFileSync('./mathmap.json', 'utf8'));
let bad = 0, total = 0;
for (const e of j) {
  const parts = e.conv.split('$');
  for (let k = 1; k < parts.length; k += 2) {
    total++;
    try {
      katex.renderToString(parts[k], { throwOnError: true, strict: 'ignore' });
    } catch (err) {
      bad++;
      console.log('KATEX FAIL:', JSON.stringify(parts[k]));
      console.log('        in:', e.orig.slice(0, 100));
      console.log('        =>:', err.message.slice(0, 120));
      console.log();
    }
  }
}
console.log(`--- ${total} segments checked, ${bad} failures`);
