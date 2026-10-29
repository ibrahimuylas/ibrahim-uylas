// Diagnostic only: copy the existing production bundle and disable tree motion.
// No application JS, images, routing or production deployment is changed.
import { cpSync, copyFileSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const staging = mkdtempSync(join(tmpdir(), 'obi-ios27-motion-'));
cpSync(resolve(root, 'dist/client'), join(staging, 'dist/client'), { recursive: true });
copyFileSync(resolve(root, 'netlify.toml'), join(staging, 'netlify.toml'));
const index = join(staging, 'dist/client/index.html');
writeFileSync(index, readFileSync(index, 'utf8').replace('</head>', `
<style id="tree-motion-isolation">
.family-tree *,.family-tree *::before,.family-tree *::after{animation:none!important;transition:none!important}
</style></head>`));
console.log(staging);
