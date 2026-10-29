import React from 'react';
import {createRoot} from 'react-dom/client';
import {App} from '../src/App';
import '../src/styles.css';
import '../src/polish.css';
function Harness(){
 const [result,setResult]=React.useState('Not run');
 const check=async()=>{
  const canvas=document.querySelector('.tree-canvas');
  const viewport=canvas.querySelector('.react-flow__viewport');
  const rect=canvas.getBoundingClientRect();
  const results=[];
  const scale=()=>Number(viewport.style.transform.match(/scale\(([^)]+)\)/)?.[1]);
  for(const [name,options,expected,target] of [
   ['Cmd zoom in',{metaKey:true,deltaY:-100},1,'.react-flow__pane'],
   ['Cmd zoom out',{metaKey:true,deltaY:100},-1,'.react-flow__pane'],
   ['Ctrl over photograph',{ctrlKey:true,deltaY:-100},1,'.photo-open img'],
   ['Ordinary scroll',{deltaY:100},0,'.react-flow__pane']
  ]){
   const before=scale();
   const event=new WheelEvent('wheel',{bubbles:true,cancelable:true,clientX:rect.left+rect.width/2,clientY:rect.top+rect.height/2,...options});
   canvas.querySelector(target).dispatchEvent(event);
   await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
   const after=scale();
   results.push({name,pass:Math.sign(after-before)===expected&&event.defaultPrevented===(expected!==0),before,after,defaultPrevented:event.defaultPrevented});
  }
  setResult(JSON.stringify({pass:results.every(r=>r.pass),results}));
 };
 return <><section style={{padding:15,background:'#fff5d6',position:'relative',zIndex:50}}><button onClick={check}>Run modifier-wheel regression</button><output style={{display:'block'}}>{result}</output></section><App/></>;
}
createRoot(document.getElementById('root')).render(<React.StrictMode><Harness/></React.StrictMode>);
