import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {translate,languageUrl,localeForPath} from '../src/i18n.js';
import {healthSummary} from '../src/health-summary.js';
const archive=JSON.parse(fs.readFileSync(new URL('../src/data/archive.json',import.meta.url)));
const tr=value=>translate(value,'tr');

test('English stays unchanged; Turkish templates preserve names, grades and source URLs',()=>{
 assert.equal(translate('Family tree','en'),'Family tree');
 assert.equal(tr('Family tree'),'Soy ağacı');
 assert.equal(tr('Puppy 01'),'Yavru 01');
 assert.equal(tr('Show Puppy 01 — original photograph 2'),'Yavru 01 — gerçek fotoğraf 2 göster');
 assert.equal(tr('B/C (FCI)'),'B/C (FCI)');
 assert.equal(tr('+/− carrier'),'+/− taşıyıcı');
 assert.equal(tr('https://example.com/clear?dog=Puppy'),'https://example.com/clear?dog=Puppy');
 assert.equal(tr('Not An Illusion'),'Not An Illusion');
 assert.equal(tr(null),null);
});
test('all profile narratives and health reading aids have Turkish translations',()=>{
 for(const dog of archive.dogs){
  for(const text of dog.overview)assert.notEqual(tr(text),text,`${dog.id} overview`);
  for(const note of healthSummary(dog)){
   const translated=tr(note.text);
   assert.notEqual(translated,note.text,`${dog.id}: ${note.title}`);
   assert.doesNotMatch(translated,/The breeder|This includes|These are|Read each|Recorded as|genetic entries/);
   assert.doesNotMatch(translated,/\{\d+\}/);
  }
 }
});
test('language destinations preserve deep links and root language routes',()=>{
 const hash='#family?dog=billie&profile=jay';
 assert.equal(languageUrl('tr',hash),'/tr'+hash);
 assert.equal(languageUrl('en',hash),'/'+hash);
 assert.equal(languageUrl('tr'),'/tr');
});

test('only Turkish paths select Turkish, including the trailing-slash form',()=>{assert.equal(localeForPath('/tr'),'tr');assert.equal(localeForPath('/tr/'),'tr');assert.equal(localeForPath('/'),'en');assert.equal(localeForPath('/travel'),'en');assert.equal(tr('1 of 3 · Puppy 01'),'1 / 3 · Yavru 01');});
