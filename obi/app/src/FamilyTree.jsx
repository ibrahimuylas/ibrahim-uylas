import { translate } from './i18n';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { thumbnailSource } from './image-sources';
import { useMobile } from './use-mobile';
import { ReactFlow, ReactFlowProvider, Handle, Position, useReactFlow } from '@xyflow/react';
import { Minus, Plus, ArrowsOut, ArrowsIn, CornersOut, ArrowRight, X } from '@phosphor-icons/react';
import { Gallery } from './Gallery';
import { attachModifierZoom } from './zoom';
import { familyEdgePath, buildFamilyLayout } from './family-layout';
import { MIN_ZOOM } from './zoom';
import { fittedTreeViewport, focusedTreeViewport, sameViewport, observeTreeSize } from './tree-viewport';
import '@xyflow/react/dist/style.css';

function DogNode({ data }) {
  const {dog,index,change,onSelect,selected,tier}=data;
  return <div className={`dog-node ${tier} ${selected?'is-selected':''}`}>
    <Handle type="target" position={Position.Top}/>
    <Gallery dog={dog} index={index} change={change} compact selected={selected} onOpen={()=>onSelect(dog.id)} />
    <button className="dog-label nodrag nopan" onClick={()=>onSelect(dog.id)} aria-pressed={selected}><strong>{translate(dog.name)}</strong><span className="node-role">{translate(dog.descriptor || dog.role)}</span>{tier==='parent' && <span className="node-formal">{translate(dog.formalName)}</span>}{tier==='parent' && <span className="node-count">{translate(dog.photos.length)}{translate(" photos")}</span>}</button>
    <Handle type="source" position={Position.Bottom}/>
    {tier==='parent' && <Handle id="partner" type="source" position={dog.id==='billie'?Position.Right:Position.Left} style={{top:106}}/>}
  </div>;
}
function Junction(){return <div className="junction"><Handle type="target" position={Position.Top}/><Handle id="left" type="target" position={Position.Left}/><Handle id="right" type="target" position={Position.Right}/><Handle type="source" position={Position.Bottom}/></div>;}
function CandidateGroup({data}){return <div className={`candidate-group ${data.candidate?'':'siblings-group'}`} aria-label={translate(data.candidate?'Our three candidates. One of these puppies will be Obi; no puppy has been chosen yet.':'Other siblings from the same litter')}><Handle type="target" position={Position.Top}/><div className="candidate-group-heading"><strong>{translate(data.title)}</strong></div>{data.candidate&&<span className="candidate-group-status">{translate("Not chosen yet")}</span>}</div>;}
const nodeTypes={dog:DogNode,junction:Junction,candidates:CandidateGroup};
function FamilyEdge(props){return <path className={`react-flow__edge-path family-connector ${props.data.active?'is-active':''}`} d={familyEdgePath(props)} pathLength="1" style={{...props.style,'--draw-delay':props.data.delay+'ms'}}/>;}
const motionDuration=duration=>matchMedia('(prefers-reduced-motion: reduce)').matches?0:duration;
const edgeTypes={family:FamilyEdge};
function TreeInner({ dogs, selected, indexes, change, onSelect, onSiblings, onConcepts, onOpenProfile }) {
  const mobile=useMobile();
  const ownsFullscreen=useRef(false);const expandedRequested=useRef(false);
  const layout=useMemo(()=>buildFamilyLayout(dogs),[dogs]);
  const flow=useReactFlow();const initialized=flow.viewportInitialized;const wrapper=useRef(null);const canvas=useRef(null);const fitting=useRef(true);
  const [entering,setEntering]=useState(true);
  useEffect(()=>{const timer=setTimeout(()=>setEntering(false),1350);return()=>clearTimeout(timer);},[]);
  const [expanded,setExpanded]=useState(false);const expandButton=useRef(null);const wasExpanded=useRef(false);const openingExpanded=useRef(false);const [fitMode,setFitMode]=useState(true);const [zoom,setZoom]=useState(1);
  const {getViewport,setViewport,zoomIn,zoomOut}=flow;
  const applyFit=useCallback((width,height,duration=0)=>{
    const next=fittedTreeViewport(layout,width,height);
    if(next&&!sameViewport(getViewport(),next))setViewport(next,{duration:motionDuration(duration)});
  },[layout,getViewport,setViewport]);
  const fit=useCallback((duration=420)=>{
    fitting.current=true;setFitMode(true);
    if(canvas.current)applyFit(canvas.current.clientWidth,canvas.current.clientHeight,duration);
  },[applyFit]);
  useEffect(()=>{
    if(!canvas.current||!initialized)return;
    return observeTreeSize(canvas.current,(width,height)=>{
      if(openingExpanded.current){openingExpanded.current=false;const next=focusedTreeViewport(layout,selected,width,height);if(next)setViewport(next,{duration:0});}
      else if(fitting.current)applyFit(width,height);
    });
  },[applyFit,initialized,expanded,layout,selected,setViewport]);
  useEffect(()=>{
    if(!expanded){expandedRequested.current=false;if(wasExpanded.current)expandButton.current?.focus({preventScroll:true});wasExpanded.current=false;return;}
    wasExpanded.current=true;
    const fullscreenChanged=()=>{if(ownsFullscreen.current&&!document.fullscreenElement){ownsFullscreen.current=false;expandedRequested.current=false;setExpanded(false);fitting.current=true;setFitMode(true);}};
    document.addEventListener('fullscreenchange',fullscreenChanged);
    const old=document.body.style.overflow;document.body.style.overflow='hidden';
    const shell=document.querySelector('.app-shell');const wasInert=shell?.inert;if(shell)shell.inert=true;
    wrapper.current?.querySelector('.expanded-close')?.focus({preventScroll:true});
    const handler=e=>{
      if(document.querySelector('dialog[open]'))return;
      if(e.key==='Escape'){e.preventDefault();expandedRequested.current=false;setExpanded(false);fitting.current=true;setFitMode(true);}
      if(e.key==='Tab'){
        const buttons=[...wrapper.current.querySelectorAll('button:not(:disabled),a[href]')].filter(el=>el.getClientRects().length);
        const first=buttons[0],last=buttons.at(-1);
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
      }
    };
    document.addEventListener('keydown',handler);
    return()=>{document.removeEventListener('keydown',handler);document.removeEventListener('fullscreenchange',fullscreenChanged);document.body.style.overflow=old;if(shell)shell.inert=wasInert;if(ownsFullscreen.current&&document.fullscreenElement){ownsFullscreen.current=false;document.exitFullscreen().catch(()=>{});}};
  },[expanded]);
  useEffect(()=>{if(!canvas.current||!initialized)return;return attachModifierZoom(canvas.current,getViewport,setViewport,()=>{fitting.current=false;setFitMode(false);});},[getViewport,setViewport,initialized,expanded]);
  const nodes=useMemo(()=>[
    ...layout.groups.map(g=>({id:g.id,type:'candidates',position:{x:g.x,y:g.y},data:g,style:{width:g.width,height:g.height},zIndex:-1,draggable:false,selectable:false,focusable:false})),
    ...layout.placements.map(({id,x,y,tier,width})=>({id,type:'dog',position:{x,y},data:{dog:dogs.find(d=>d.id===id),index:indexes[id]||0,change,onSelect,selected:selected===id,tier},style:{width},draggable:false})),
    ...layout.junctions.map(({id,x,y})=>({id,type:'junction',position:{x,y},style:{width:1,height:1},draggable:false,focusable:false}))
  ],[layout,dogs,indexes,change,onSelect,selected]);
  const visibleEdges=useMemo(()=>layout.edges.map(edge=>({...edge,type:'family',selectable:false,data:{...edge.data,active:edge.relatives.includes(selected)}})),[layout,selected]);
  const manual=()=>{fitting.current=false;setFitMode(false);};
  const selectedDog=dogs.find(d=>d.id===selected);
  const toggleExpanded=()=>{
    const next=!expanded;expandedRequested.current=next;const focusOnOpen=next&&mobile;
    openingExpanded.current=focusOnOpen;fitting.current=!focusOnOpen;setFitMode(!focusOnOpen);setExpanded(next);
    if(next&&mobile&&matchMedia('(pointer:coarse)').matches&&document.fullscreenEnabled&&!document.fullscreenElement){
      ownsFullscreen.current=true;
      document.documentElement.requestFullscreen({navigationUI:'hide'}).then(()=>{if(!expandedRequested.current&&document.fullscreenElement===document.documentElement){ownsFullscreen.current=false;return document.exitFullscreen();}}).catch(()=>{ownsFullscreen.current=false;});
    }
  };
  const tree=<section ref={wrapper} role={expanded?'dialog':undefined} aria-modal={expanded?true:undefined} className={`family-tree ${expanded?'expanded':''} ${entering?'tree-entering':''}`} aria-label={translate("Interactive family tree")}>
    {expanded&&<div className="expanded-tree-header"><div><span className="eyebrow">{translate("FAMILY TREE")}</span><h2>{translate("Explore the family")}</h2></div><button className="expanded-close" onClick={toggleExpanded}><X size={20}/><span>{translate("Done")}</span></button></div>}
    <div ref={canvas} className="tree-canvas" style={{'--tree-aspect':`${layout.width} / ${layout.height}`}}>
      <ReactFlow nodes={nodes} edges={visibleEdges} nodeTypes={nodeTypes} edgeTypes={edgeTypes} nodesDraggable={false} nodesConnectable={false} elementsSelectable={false} nodesFocusable={false} edgesFocusable={false} minZoom={MIN_ZOOM} maxZoom={2.5} zoomOnScroll={false} zoomOnPinch zoomOnDoubleClick={false} zoomActivationKeyCode={null} panOnScroll={false} preventScrolling={false} panOnDrag selectionKeyCode={null} deleteKeyCode={null} onMoveStart={event=>{if(event)manual();}} onMove={(_,viewport)=>setZoom(viewport.zoom)} attributionPosition="bottom-right" />
    </div>
    {!expanded&&<div className="mobile-candidates" aria-label={translate("Choose a candidate to view")}><span className="eyebrow">{translate("OUR THREE CANDIDATES")}</span><div>{dogs.filter(d=>d.role==='Candidate').map(d=><button key={d.id} aria-pressed={selected===d.id} onClick={()=>onSelect(d.id)}><img src={thumbnailSource(d.photos[0].src)} style={{objectPosition:d.photos[0].objectPosition}} alt=""/><span>{translate(d.name)}</span></button>)}</div></div>}
    {expanded&&!mobile&&selectedDog&&<div className="expanded-selection"><img src={thumbnailSource(selectedDog.photos[0].src)} style={{objectPosition:selectedDog.photos[0].objectPosition}} alt=""/><div><strong>{translate(selectedDog.name)}</strong><span>{translate(selectedDog.descriptor||selectedDog.role)}</span></div><button onClick={()=>onOpenProfile(selectedDog.id)}>{translate("View profile ")}<ArrowRight size={18}/></button></div>}
    <div className="tree-links"><button onClick={onSiblings}>{translate("View other siblings ")}<ArrowRight size={16}/></button><span/><button onClick={onConcepts}>{translate("Adult appearance concepts ")}<ArrowRight size={16}/></button></div>
    <div className="tree-controls">
      <div className="zoom-buttons"><button aria-label={translate("Zoom out")} disabled={zoom<=MIN_ZOOM+.001} onClick={()=>{manual();zoomOut({duration:motionDuration(280)});}}><Minus size={20}/></button><button className={`fit-button ${fitMode?'active':''}`} onClick={()=>fit()}><CornersOut size={20}/><span className="desktop-label">{translate("Fit to screen")}</span><span className="mobile-label">{translate("Fit")}</span></button><button aria-label={translate("Zoom in")} disabled={zoom>=2.499} onClick={()=>{manual();zoomIn({duration:motionDuration(280)});}}><Plus size={20}/></button><button ref={expanded?undefined:expandButton} aria-label={translate(expanded?'Exit expanded tree':'Expand family tree')} aria-pressed={expanded} onClick={toggleExpanded}>{expanded?<ArrowsIn size={20}/>:<ArrowsOut size={20}/>}<span className="mobile-label expand-label">{translate(expanded?'Close':'Expand')}</span></button></div>
      <span className="tree-help desktop-label">{translate("Drag to pan · ⌘ + scroll to zoom")}</span><span className="tree-help mobile-label">{translate("Pinch to zoom · drag to explore")}</span>
      <output className="sr-only" aria-live="polite">{translate("Tree zoom ")}{translate(Math.round(zoom*100))}{translate(" percent")}</output>
    </div>
  </section>;
  return expanded?createPortal(tree,document.body):tree;
}
export function FamilyTree(props){return <ReactFlowProvider><TreeInner {...props}/></ReactFlowProvider>;}
