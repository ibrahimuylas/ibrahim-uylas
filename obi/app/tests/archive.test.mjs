import {healthSummary} from '../src/health-summary.js';
import {healthGroups,parentRole} from '../src/profile-records.js';
import {buildFamilyLayout,familyEdgePath} from '../src/family-layout.js';
import {nextOverlay,archiveHash} from '../src/overlay-navigation.js';
import {galleryItems, mediaDescription} from '../src/gallery-items.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const archive=JSON.parse(fs.readFileSync(path.join(root,'src/data/archive.json'),'utf8'));
test('tree includes every recorded dog and parent relationship in the correct generation',()=>{
 const graph=buildFamilyLayout(archive.dogs);
 const placements=new Map(graph.placements.map(p=>[p.id,p]));
 assert.equal(placements.size,archive.dogs.length);
 for(const dog of archive.dogs){
  assert.ok(placements.has(dog.id));
  for(const parent of dog.parents){
   assert.ok(placements.get(parent).y<placements.get(dog.id).y);
   assert.ok(graph.edges.some(e=>e.source===parent&&graph.edges.some(child=>child.source===e.target&&(child.target===dog.id||graph.groups.some(g=>g.id===child.target&&g.members.includes(dog.id))))));
  }
 }
 const rows=Map.groupBy(graph.placements,p=>p.y);
 for(const row of rows.values()){
  row.sort((a,b)=>a.x-b.x);
  for(let i=1;i<row.length;i++)assert.ok(row[i].x>=row[i-1].x+row[i-1].width);
 }
 assert.equal(graph.groups.filter(g=>g.candidate).length,1);
 assert.equal(new Set(graph.placements.map(p=>p.y)).size,4);
});
test('tree expands automatically for a newly recorded ancestor and keeps paths orthogonal',()=>{
 const dogs=structuredClone(archive.dogs);
 dogs.find(d=>d.id==='halsey').parents=['new-ancestor'];
 dogs.push({id:'new-ancestor',role:'Great-grandparent',parents:[]});
 const graph=buildFamilyLayout(dogs);
 assert.ok(graph.placements.some(p=>p.id==='new-ancestor'));
 for(const route of ['ancestors','children','direct'])assert.doesNotMatch(familyEdgePath({sourceX:10,sourceY:20,targetX:100,targetY:200,data:{route}}),/L/);
});
test('overlay history preserves multi-generation and gallery return trails',()=>{
 const root=nextOverlay(null,'profile','billie');
 const jay=nextOverlay(root,'profile','jay');
 const ancestor=nextOverlay(jay,'profile','basileas-american-journey');
 assert.equal(ancestor.depth,3);
 assert.deepEqual(ancestor.trail,[{type:'profile',id:'billie'},{type:'profile',id:'jay'}]);
 assert.deepEqual(nextOverlay(jay,'photo','jay').trail.at(-1),{type:'profile',id:'jay'});
 assert.equal(archiveHash('family','billie',jay),'#family?dog=billie&profile=jay');
 assert.equal(archiveHash('family','billie'),'#family?dog=billie');
 assert.equal(root.trail.length,0);
});
test('profile groups retain every original result once and resolve documented parent roles',()=>{
 for(const dog of archive.dogs){
  const rows=healthGroups(dog.tests).flatMap(group=>group.rows);
  assert.equal(rows.length,dog.tests.length);
  assert.equal(new Set(rows).size,dog.tests.length);
  for(const entry of dog.tests)assert.ok(rows.includes(entry));
  if(dog.parents.length)assert.deepEqual(dog.parents.map(parentRole),['Mother','Father']);
 }
 assert.equal(parentRole('unrecorded'),'Parent');
});
test('every profile, health result and real photograph retains a source URL',()=>{
 for(const dog of archive.dogs){
  assert.match(dog.sourcePageUrl,/^https:\/\/www\.basileas-minis\.com\//);
  assert.ok(archive.sources.some(s=>s.id===dog.sourceId));
  for(const t of dog.tests)assert.equal(t.sourcePageUrl,dog.sourcePageUrl);
  for(const p of dog.photos){assert.match(p.sourceImageUrl,/^https:\/\//);assert.ok(fs.existsSync(path.join(root,'public',p.src)));assert.ok(fs.existsSync(path.join(root,'public',p.original)));}
 }
});
test('parentage resolves without cycles; all candidates and siblings share the documented parents',()=>{
 const byId=new Map(archive.dogs.map(d=>[d.id,d]));
 const walk=(id,seen=new Set())=>{assert.ok(byId.has(id));assert.ok(!seen.has(id),`Cycle at ${id}`);for(const p of byId.get(id).parents)walk(p,new Set([...seen,id]));};
 for(const d of archive.dogs)walk(d.id);
 for(const d of archive.dogs.filter(d=>d.id.startsWith('puppy-')))assert.deepEqual(d.parents,['billie','zane']);
 assert.equal(archive.dogs.filter(d=>d.role==='Candidate').length,3);
 assert.equal(archive.dogs.filter(d=>d.role==='Sibling').length,4);
});
test('source exceptions and missing puppy results remain explicit',()=>{
 const billie=archive.dogs.find(d=>d.id==='billie');const zane=archive.dogs.find(d=>d.id==='zane');
 assert.equal(billie.tests.find(t=>t.name==='NAD').result,'+/− (carrier)');
 assert.equal(zane.tests.find(t=>t.name==='Hips (HD)').result,'B/C (FCI)');
 assert.equal(billie.photos.length,5);
 for(const d of archive.dogs.filter(d=>d.id.startsWith('puppy-')))assert.equal(d.tests.length,0);
 for(const d of archive.dogs.filter(d=>d.role==='Candidate')){assert.ok(d.concept);assert.ok(fs.existsSync(path.join(root,'public',d.concept)));assert.ok(!d.photos.some(p=>p.src===d.concept));}
});

test('each candidate carousel includes the original and one updated concept with honest provenance',()=>{
 for(const dog of archive.dogs.filter(d=>d.role==='Candidate')){
  const items=galleryItems(dog);
  assert.equal(items.length,2);
  assert.ok(items[0].sourceImageUrl);
  assert.deepEqual(items.slice(1).map(p=>p.variant),['updated']);
  for(const item of items.slice(1)){
   assert.equal(item.kind,'ai-concept');
   assert.equal(item.sourceImageUrl,undefined);
   assert.match(mediaDescription(dog,item,1),/AI adult concept/);
   assert.ok(fs.existsSync(path.join(root,'public',item.src)));
  }
 }
});

test('all health entries checked on the live parent pages are retained',()=>{
 const review=JSON.parse(fs.readFileSync(path.join(root,'src/data/health-review.json'),'utf8'));
 for(const [id,record] of Object.entries(review.profiles)){
  const dog=archive.dogs.find(d=>d.id===id);
  assert.deepEqual(dog.tests.map(t=>t.name),record.tests);
  assert.equal(dog.sourcePageUrl,record.sourceUrl);
 }
});
test('health interpretation preserves carrier and hip exceptions and never invents puppy results',()=>{
 const get=id=>healthSummary(archive.dogs.find(d=>d.id===id));
 assert.ok(get('billie').some(n=>n.title==='NAD carrier result'));
 assert.match(get('zane').find(n=>n.title==='Hip screening').text,/should not be described as/);
 assert.ok(!get('zane').some(n=>n.title==='NAD carrier result'));
 for(const d of archive.dogs.filter(d=>!d.tests.length))assert.deepEqual(healthSummary(d),[]);
});

test('shared litter connects only to the two group borders, above their cards',()=>{
 const graph=buildFamilyLayout(archive.dogs);
 const litter=graph.edges.filter(e=>e.source==='family:billie|zane');
 assert.deepEqual(litter.map(e=>e.target).sort(),['group:Candidate','group:Sibling']);
 assert.ok(!graph.edges.some(e=>e.target.startsWith('puppy-')));
 const junction=graph.junctions.find(j=>j.id==='family:billie|zane');
 for(const group of graph.groups)assert.ok(junction.y<group.y);
 assert.deepEqual(graph.groups.flatMap(g=>g.members).sort(),archive.dogs.filter(d=>d.id.startsWith('puppy-')).map(d=>d.id).sort());
});
