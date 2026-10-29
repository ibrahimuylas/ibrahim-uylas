import test from 'node:test';
import assert from 'node:assert/strict';
import {zoomAround,attachModifierZoom,MIN_ZOOM,MAX_ZOOM} from '../src/zoom.js';
test('zoom keeps the world point under the pointer fixed and clamps at both limits',()=>{
 const old={x:100,y:-20,zoom:.7},p={x:450,y:180};
 for(const delta of [-200,200,-99999,99999]){
  const next=zoomAround(old,p,delta);
  assert.ok(next.zoom>=MIN_ZOOM&&next.zoom<=MAX_ZOOM);
  assert.ok(Math.abs((p.x-old.x)/old.zoom-(p.x-next.x)/next.zoom)<1e-9);
  assert.ok(Math.abs((p.y-old.y)/old.zoom-(p.y-next.y)/next.zoom)<1e-9);
 }
});
test('ordinary scroll is untouched; Cmd/Ctrl wheel zooms only the bound canvas and cleans up',()=>{
 const el=new EventTarget();el.getBoundingClientRect=()=>({left:10,top:20,height:600});
 let viewport={x:0,y:0,zoom:1},manual=0;
 const off=attachModifierZoom(el,()=>viewport,v=>{viewport=v;},()=>manual++);
 const wheel=(props={})=>{const e=new Event('wheel',{cancelable:true});Object.assign(e,{deltaY:-50,deltaMode:0,clientX:210,clientY:220,metaKey:false,ctrlKey:false,...props});el.dispatchEvent(e);return e;};
 assert.equal(wheel().defaultPrevented,false);assert.equal(manual,0);assert.equal(viewport.zoom,1);
 assert.equal(wheel({metaKey:true}).defaultPrevented,true);assert.ok(viewport.zoom>1);assert.equal(manual,1);
 const prior=viewport.zoom;wheel({ctrlKey:true,deltaY:2,deltaMode:1});assert.ok(viewport.zoom<prior);
 off();const after=viewport;assert.equal(wheel({metaKey:true}).defaultPrevented,false);assert.equal(viewport,after);
});
