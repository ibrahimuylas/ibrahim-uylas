import test from 'node:test';
import assert from 'node:assert/strict';
import {shouldDismissSheet,attachSheetGesture} from '../src/sheet-gesture.js';

test('sheet ignores short pulls but closes on an intentional drag or downward flick',()=>{
 assert.equal(shouldDismissSheet(30,500,800),false);
 assert.equal(shouldDismissSheet(60,700,800),false);
 assert.equal(shouldDismissSheet(170,800,800),true);
 assert.equal(shouldDismissSheet(60,70,800),true);
 assert.equal(shouldDismissSheet(100,800,400),true);
});

test('content scroll and horizontal photo gestures are not hijacked; cancelled drags reset',()=>{
 const target=()=>({events:{},addEventListener(n,fn){this.events[n]=fn;},removeEventListener(n){delete this.events[n];},setPointerCapture(){},scrollTop:0});
 const header=target(),content=target(),values=new Map();let closed=0,prevented=0;
 const dialog={dataset:{},clientHeight:800,style:{setProperty:(k,v)=>values.set(k,v),removeProperty:k=>values.delete(k)},querySelector:s=>s==='.sheet-top'?header:content};
 const stop=attachSheetGesture(dialog,()=>closed++);
 const event=(x,y,interactive=false)=>({target:{closest:()=>interactive?{}:null},touches:[{clientX:x,clientY:y}],cancelable:true,preventDefault:()=>prevented++});
 content.scrollTop=20;content.events.touchstart(event(0,0));content.events.touchmove(event(0,200));content.events.touchend();assert.equal(closed,0);assert.equal(prevented,0);
 content.scrollTop=0;content.events.touchstart(event(0,0,true));content.events.touchmove(event(0,200));content.events.touchend();assert.equal(closed,0);
 content.events.touchstart(event(0,0));content.events.touchmove(event(80,15));content.events.touchend();assert.equal(closed,0);assert.equal(prevented,0);
 content.events.touchstart(event(0,0));content.events.touchmove(event(2,200));assert.equal(values.get('--sheet-drag'),'200px');content.events.touchcancel();assert.equal(closed,0);assert.equal(values.get('--sheet-drag'),'0px');
 content.events.touchstart(event(0,0));content.events.touchmove(event(2,200));content.events.touchend();assert.equal(closed,1);
 stop();assert.equal(Object.keys(content.events).length,0);assert.equal(Object.keys(header.events).length,0);assert.equal(values.size,0);
});
