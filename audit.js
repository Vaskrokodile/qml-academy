const fs = require('fs');
const j = JSON.parse(fs.readFileSync('./mathmap.json', 'utf8'));
const uni = /[\u0391-\u03a9\u03b1-\u03c9\u27e8\u27e9\u221a\u00b2-\u00b3\u00b9\u1d62\u2c7c\u209a-\u209c\u2070-\u2079\u1d38\u2211\u220f\u221d\u221e\u2248\u2260\u2264\u2265\u00d7\u00f7\u2192\u21d2\u00b7\u2212\u2016\u2308\u2309\u230a\u230b\u2020\u2021\u2295\u2297\u2032]/;
let n = 0;
for (const e of j) {
  const outside = e.conv.replace(/\$[^$]*\$/g, '');
  if (uni.test(outside)) { n++; console.log('OUT> ' + e.conv.slice(0, 180)); }
}
console.log('--- leftover unicode outside math:', n);

// suspicious: $ wrapped around a single space, empty math, unbalanced
let s = 0;
for (const e of j) {
  const parts = e.conv.split('$');
  if (parts.length % 2 === 0) { s++; console.log('UNBALANCED $:', e.conv.slice(0, 120)); }
  for (let k = 1; k < parts.length; k += 2) {
    if (!parts[k].trim()) { s++; console.log('EMPTY MATH:', e.conv.slice(0, 120)); }
  }
}
console.log('--- unbalanced/empty:', s);
