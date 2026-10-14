const katex = require('./node_modules/katex');
const opts = { strict: 'ignore', trust: true };
const out = katex.renderToString('\\htmlData{sym=rho}{\\rho}+\\htmlData{sym=psi}{\\psi_i}^{2}', opts);
console.log(out.match(/data-sym="[^"]+"/g));
const out2 = katex.renderToString('\\frac{\\htmlData{sym=alpha}{\\alpha}}{\\htmlData{sym=beta}{\\beta_1}}+\\sum_{\\htmlData{sym=i}{i}=1}^{\\htmlData{sym=n}{n}}', Object.assign({displayMode:true}, opts));
console.log(out2.match(/data-sym="[^"]+"/g));
