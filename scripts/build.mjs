// One-shot builder: bundles vendor/astryx.js and copies CSS/fonts into vendor/.
// Re-run only when dependencies change: node scripts/build.mjs
import {build } from 'esbuild';
import {cpSync, mkdirSync, writeFileSync, existsSync, statSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const nm = join(root, 'node_modules');
const vendor = join(root, 'vendor');
mkdirSync(join(vendor, 'themes'), {recursive: true});
mkdirSync(join(vendor, 'fonts'), {recursive: true});

// 1. JS bundle — IIFE so plain <script src> works over file://
const outfile = join(vendor, 'astryx.js');
const r = await build({
  entryPoints: [join(root, 'scripts', 'entry.js')],
  bundle: true,
  minify: true,
  format: 'iife',
  globalName: 'AstryxKit',
  platform: 'browser',
  define: {'process.env.NODE_ENV': '"production"'},
  outfile,
  logLevel: 'info',
});
console.log('bundle:', outfile, (statSync(outfile).size / 1024).toFixed(0) + ' KB');

// 2. CSS: reset + component styles (scoped by class, theme-agnostic)
cpSync(join(nm, '@astryxdesign/core/src/reset.css'), join(vendor, 'reset.css'));
cpSync(join(nm, '@astryxdesign/core/dist/astryx.css'), join(vendor, 'astryx.css'));

// 3. Seven theme CSS files — each @scope'd to [data-astryx-theme="<name>"],
//    so all can ship at once and switching = flipping one html attribute.
const themes = ['neutral', 'butter', 'chocolate', 'matcha', 'stone', 'gothic', 'y2k'];
for (const t of themes) {
  const src = join(nm, `@astryxdesign/theme-${t}/dist/theme.css`);
  if (existsSync(src)) cpSync(src, join(vendor, 'themes', `${t}.css`));
  else console.warn('missing theme css:', t);
}

// 4. Figtree (theme's named font) — self-hosted, no Google Fonts dependency
const weights = [400, 500, 600, 700];
let faces = '';
for (const w of weights) {
  const file = `figtree-latin-${w}-normal.woff2`;
  cpSync(join(nm, '@fontsource/figtree/files', file), join(vendor, 'fonts', file));
  faces += `@font-face{font-family:Figtree;font-style:normal;font-weight:${w};font-display:swap;src:url(fonts/${file}) format('woff2')}\n`;
}
writeFileSync(join(vendor, 'fonts.css'), faces);

console.log('css+fonts copied. themes:', themes.join(','));
