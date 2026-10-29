// Deploy only this app's built assets, without inheriting the blog's Netlify config.
import { cpSync, copyFileSync, mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const siteId='7cba6e48-7c53-4928-a35c-98b464d0532f';
if(!existsSync(path.join(root,'dist/client/index.html')))throw new Error('Run npm run build first.');
const staging=mkdtempSync(path.join(tmpdir(),'obi-netlify-'));
try {
  cpSync(path.join(root,'dist/client'),path.join(staging,'dist/client'),{recursive:true});
  copyFileSync(path.join(root,'netlify.toml'),path.join(staging,'netlify.toml'));
  const result=spawnSync('netlify',['deploy','--site',siteId,'--dir','dist/client','--prod','--no-build','--message','Publish Obi family archive'],{cwd:staging,stdio:'inherit'});
  if(result.error)throw result.error;
  process.exitCode=result.status??1;
} finally {
  rmSync(staging,{recursive:true,force:true});
}
