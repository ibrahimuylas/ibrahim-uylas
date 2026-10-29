import test from 'node:test';
import assert from 'node:assert/strict';
import {fittedTreeViewport,focusedTreeViewport,sameViewport,observeTreeSize} from '../src/tree-viewport.js';

function harness(onResize){
 let observer, id=0;
 const frames=new Map();
 class Observer{
  constructor(callback){this.callback=callback;observer=this;}
  observe(){}
  disconnect(){this.disconnected=true;}
 }
 const stop=observeTreeSize({},onResize,{Observer,
  requestFrame:fn=>{frames.set(++id,fn);return id;},cancelFrame:id=>frames.delete(id)});
 const notify=(width,height)=>observer.callback([{contentRect:{width,height}}]);
 const flush=()=>{const batch=[...frames.values()];frames.clear();for(const fn of batch)fn();};
 return {notify,flush,stop,frames,get disconnected(){return observer.disconnected;}};
}

test('a fit that delivers the same resize back cannot schedule a feedback loop',()=>{
 let fits=0;
 const h=harness((w,hgt)=>{fits++;h.notify(w,hgt);});
 h.notify(398,340);h.flush();
 for(let i=0;i<1000;i++)h.notify(398.1+(i%2)*0.1,340.1);
 h.flush();
 assert.equal(fits,1);
 assert.equal(h.frames.size,0);
});
test('a resize burst produces one fit with the final size; cleanup cancels it',()=>{
 const sizes=[];const h=harness((w,hgt)=>sizes.push([w,hgt]));
 h.notify(0,0);assert.equal(h.frames.size,0);
 h.notify(398,340);h.notify(430,360);h.notify(600,460);h.flush();
 assert.deepEqual(sizes,[[600,460]]);
 h.notify(800,600);h.stop();h.flush();h.notify(900,700);
 assert.equal(h.disconnected,true);assert.equal(h.frames.size,0);assert.equal(sizes.length,1);
});
test('fitting is deterministic and does not depend on the current transform or node measurements',()=>{
 const layout={width:2006,height:1520};
 const initial=fittedTreeViewport(layout,398,340);
 for(let i=0;i<1000;i++)assert.ok(sameViewport(initial,fittedTreeViewport(layout,398,340)));
 assert.ok(initial.zoom>=.1&&initial.zoom<.2);
 assert.ok(initial.zoom*layout.width<=398);
 assert.ok(initial.zoom*layout.height<=340);
 assert.equal(fittedTreeViewport(layout,0,340),null);
 assert.ok(!sameViewport(initial,{...initial,zoom:initial.zoom*1.2}));
});


test('expanded mobile inspection centers a larger card and bounds horizontal margins',()=>{
 const layout={width:2006,height:1520,placements:[{id:'puppy-02',x:300,y:1180,width:250}]};
 for(const [width,height] of [[366,520],[320,360],[820,210]]){
  const view=focusedTreeViewport(layout,'puppy-02',width,height);
  const centerX=view.x+425*view.zoom,centerY=view.y+1310*view.zoom;
  assert.ok(centerX>0&&centerX<width);
  assert.ok(centerY>0&&centerY<height);
  assert.ok(view.x<=16&&view.y<=16);
  assert.ok(view.x+layout.width*view.zoom>=width-16);
  assert.ok(Math.abs(centerY-height/2)<.01);
  assert.ok(view.zoom>=.5&&view.zoom<=1.2);
  if(width<430)assert.ok(250*view.zoom>width*.55);
  assert.ok(250*view.zoom<width);
 }
 assert.equal(focusedTreeViewport(layout,'puppy-02',0,300),null);
 assert.deepEqual(focusedTreeViewport(layout,'unknown',366,520),fittedTreeViewport(layout,366,520));
});
