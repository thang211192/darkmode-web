const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const dest = path.join(root, 'export', 'Luna-Edge');
fs.mkdirSync(path.join(root, 'extension', 'vendor'), {recursive: true});
let engine = fs.readFileSync(require.resolve('darkreader'), 'utf8');
// Package Dark Reader's self-contained page proxy as a MAIN-world content script.
// MV3 disallows the API bundle's inline script injection.
const proxyStart = engine.indexOf('    function injectProxy(');
const proxyEnd = engine.indexOf('    const definedCustomElements', proxyStart);
if (proxyStart < 0 || proxyEnd < 0) throw Error('Dark Reader proxy structure changed');
const proxy = engine.slice(proxyStart, proxyEnd);
const inlineBlock = /\{\s*const proxyScript = createOrUpdateScript\("darkreader--proxy"\);[\s\S]*?proxyScript\.remove\(\);\s*\}/;
if (!inlineBlock.test(engine)) throw Error('Dark Reader injection structure changed');
engine = engine.replace(inlineBlock, 'document.dispatchEvent(new CustomEvent("__luna_startProxy"));');
fs.writeFileSync(path.join(root, 'extension', 'vendor', 'darkreader.js'), engine);
fs.writeFileSync(path.join(root, 'extension', 'vendor', 'page-proxy.js'), '// Adapted from Dark Reader (MIT); see LICENSE-DarkReader.txt.\n(() => {\n' + proxy + '\ndocument.addEventListener("__luna_startProxy", () => injectProxy(true, true));\n})();\n');
fs.copyFileSync(path.join(root, 'node_modules', 'darkreader', 'LICENSE'), path.join(root, 'extension', 'vendor', 'LICENSE-DarkReader.txt'));
fs.cpSync(path.join(root, 'extension'), dest, {recursive: true});
fs.copyFileSync(path.join(root, 'README.md'), path.join(dest, 'HUONG-DAN.md'));
console.log(`Ready to load: ${dest}`);
