import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
const archive=JSON.parse(readFileSync(new URL('../src/data/archive.json',import.meta.url)));
const thumbs=JSON.parse(readFileSync(new URL('../src/data/thumbnails.json',import.meta.url)));
test('every real photograph and adult concept has a bounded, separate thumbnail',()=>{
 for(const dog of archive.dogs) for(const item of [...dog.photos,...(dog.concepts||[])]){
  const thumb=thumbs[item.src];
  assert.ok(thumb,`Missing thumbnail for ${item.src}`);
  assert.ok(thumb.width>0&&thumb.width<=384&&thumb.height>0&&thumb.height<=384);
  assert.notEqual(thumb.src,item.src);
  const file=new URL('../public'+thumb.src,import.meta.url);
  assert.ok(existsSync(file));
  const bytes=readFileSync(file);
  assert.equal(bytes.toString('ascii',0,4),'RIFF');
  assert.equal(bytes.toString('ascii',8,12),'WEBP');
  assert.ok(existsSync(new URL('../public'+item.src,import.meta.url)),'Full image retained');
 }
});
test('initial pedigree image decode budget stays under 8 MiB',()=>{
 const bytes=archive.dogs.reduce((sum,d)=>{const t=thumbs[d.photos[0].src];return sum+t.width*t.height*4;},0);
 assert.ok(bytes<8*1024*1024,`${bytes} decoded bytes`);
});
