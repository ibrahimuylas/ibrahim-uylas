import { translate, locale, languageUrl } from './i18n';
import { thumbnailSource } from './image-sources';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowSquareOut, X, CaretLeft, CaretRight, Image as ImageIcon } from '@phosphor-icons/react';
import archive from './data/archive.json';
import { galleryItems, mediaDescription } from './gallery-items';
import { FamilyTree } from './FamilyTree';
import { Gallery, PhotoCredit, formatDate } from './Gallery';
import { Profile } from './Profile';
import { nextOverlay, archiveHash } from './overlay-navigation';
import '@fontsource-variable/inter';
import { useMobile } from './use-mobile';
import { attachSheetGesture } from './sheet-gesture';

const views=['family','puppies','photos','sources'];
const labels={family:'Family tree',puppies:'Puppies',photos:'Photos',sources:'Sources'};
const {dogs,sources,documents,history}=archive;
const familyIds=['billie','zane','jay','ryder','halsey','not-an-illusion'];
const candidates=dogs.filter(d=>d.role==='Candidate');
const siblings=dogs.filter(d=>d.role==='Sibling');
function initialLocation(){
 const [view,query]=location.hash.slice(1).split('?');const params=new URLSearchParams(query);const id=params.get('dog');
 const type=['profile','photo','source'].find(t=>params.has(t));const record=type&&params.get(type);
 const valid=type==='source'?sources.some(s=>s.id===record):dogs.some(d=>d.id===record);
 const stored=window.history.state?.xxArchiveOverlay;
 const modal=valid&&type?(stored?.type===type&&stored.id===record?stored:{type,id:record,depth:0,trail:[]}):null;
 return {view:views.includes(view)?view:'family',dog:dogs.some(d=>d.id===id)?id:'puppy-01',modal};
}

function Dialog({title,onClose,children,wide=false,drawer=false,onBack,backLabel,navigationKey}){
 const mobile=useMobile();const sheet=mobile&&drawer;
 const [closing,setClosing]=useState(false);
 const close=()=>{if(drawer&&!matchMedia('(prefers-reduced-motion: reduce)').matches)setClosing(true);else onClose();};
 const ref=useRef(null);const closeRef=useRef(close);closeRef.current=close;
 useEffect(()=>{if(!sheet)return;return attachSheetGesture(ref.current,()=>closeRef.current());},[sheet]);
 useEffect(()=>{if(!closing)return;const timer=setTimeout(onClose,300);return()=>clearTimeout(timer);},[closing,onClose]);
 const previousNavigation=useRef(navigationKey);
 useEffect(()=>{if(previousNavigation.current!==navigationKey){setClosing(false);ref.current.scrollTop=0;ref.current.querySelector('.dialog-content').scrollTop=0;ref.current.style.removeProperty('--sheet-drag');delete ref.current.dataset.sheetDragged;ref.current.querySelector("h2")?.focus({preventScroll:true});previousNavigation.current=navigationKey;}},[navigationKey]);
 useEffect(()=>{const el=ref.current;const previous=document.activeElement;el.showModal();const old=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{el.close();document.body.style.overflow=old;previous?.focus?.();};},[]);
 return <dialog ref={ref} className={`dialog ${wide?'wide-dialog':''} ${drawer?'profile-drawer':''} ${sheet?'mobile-sheet':''} ${closing?'closing':''}`} aria-label={translate(title)} onAnimationEnd={e=>{if(closing&&e.target===ref.current)onClose();}} onCancel={e=>{e.preventDefault();close();}} onClick={e=>{if(e.target===ref.current){const r=ref.current.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();}}}><div className="sheet-top">{sheet&&<div className="sheet-grip" aria-hidden="true"><span/></div>}<div className="dialog-header">{onBack&&<button className="drawer-back" onClick={onBack} disabled={closing} aria-label={translate(backLabel)}><ArrowLeft size={19}/><span>{translate("Back")}</span></button>}<h2 tabIndex={-1}>{translate(title)}</h2><button className="icon-button" autoFocus onClick={close} aria-label={translate(drawer?'Close profile':'Close dialog')}><X size={24}/></button></div></div><div className="dialog-content">{children}</div></dialog>;
}
function Lightbox({dog,index,change}){
 const photos=galleryItems(dog);const step=useCallback(delta=>change(dog.id,(index+delta+photos.length)%photos.length),[dog.id,index,photos.length,change]);
 useEffect(()=>{const handler=e=>{if(e.key==='ArrowLeft'){e.preventDefault();step(-1);}if(e.key==='ArrowRight'){e.preventDefault();step(1);}};document.addEventListener('keydown',handler);return()=>document.removeEventListener('keydown',handler);},[step]);
 return <div className="lightbox"><div className="lightbox-image"><img src={photos[index].src} alt={translate(mediaDescription(dog,photos[index],index))}/>{photos.length>1&&<><button className="photo-arrow previous" aria-label={translate("Previous enlarged photo")} onClick={()=>step(-1)}><CaretLeft size={26}/></button><button className="photo-arrow next" aria-label={translate("Next enlarged photo")} onClick={()=>step(1)}><CaretRight size={26}/></button></>}</div><p className="lightbox-caption">{translate(`${index+1} of ${photos.length} · ${dog.name}`)}</p><PhotoCredit photo={photos[index]}/></div>;
}
function Puppies({openProfile,openPhoto,indexes,change,initialConcept}){
 const [active,setActive]=useState(initialConcept||'puppy-01');const [mode,setMode]=useState(initialConcept?'concepts':'originals');
 const dog=candidates.find(d=>d.id===active);
 return <section className="collection-page compact-collection"><div className="page-heading"><span className="eyebrow">{translate("THE NEXT CHAPTER")}</span><h1>{translate("Three little possibilities.")}</h1><p>{translate("Her name will be Obi. We haven’t chosen which puppy will join us yet.")}</p></div><div className="segmented" aria-label={translate("Puppy photo view")}><button aria-pressed={mode==='originals'} onClick={()=>setMode('originals')}>{translate("Photos & concepts")}</button><button aria-pressed={mode==='concepts'} onClick={()=>setMode('concepts')}>{translate("Adult appearance concepts")}</button></div>
  {mode==='originals'?<div className="puppy-grid">{candidates.map(d=><article key={d.id}><Gallery dog={d} index={indexes[d.id]||0} change={change} onOpen={()=>openPhoto(d.id)}/><span className="eyebrow">{translate("CANDIDATE")}</span><h2>{translate(d.name)}</h2><p>{translate(d.descriptor)}</p><button className="text-link" onClick={()=>openProfile(d.id)}>{translate("View profile ")}<ArrowRight size={16}/></button></article>)}</div>:<div className="concept-section"><div className="concept-controls"><div className="candidate-picker">{candidates.map(d=><button key={d.id} className={d.id===active?'active':''} aria-pressed={d.id===active} onClick={()=>setActive(d.id)}><img src={thumbnailSource(d.photos[0].src)} style={{objectPosition:d.photos[0].objectPosition}} alt="" decoding="async"/><span>{translate(d.name)}</span></button>)}</div></div><div key={active} className="comparison content-enter"><div><h3>{translate("Original photograph")}</h3><img src={dog.photos[0].src} alt={translate(`${dog.name} original puppy photograph`)}/><p>{translate("Archived ")}{translate(formatDate(dog.photos[0].capturedAt))}</p></div><div><h3>{translate("AI concept ")}<span className="subtle-label">{translate("Speculative")}</span></h3><a href={dog.concepts[0].src} target="_blank" rel="noreferrer" aria-label={translate(`Open adult concept for ${dog.name}`)}><img src={dog.concepts[0].src} alt={translate(`Speculative AI adult appearance for ${dog.name}`)}/></a><p>{translate("An imagined adult appearance. Eye colour, coat and markings are not predictions.")}</p></div></div></div>}
  <section className="siblings-section" id="siblings"><h2>{translate("The rest of the litter")}</h2><p>{translate("Four more photographs from the same archived puppy page. Numbers are archive labels.")}</p><div className="sibling-grid">{siblings.map(d=><button key={d.id} onClick={()=>openProfile(d.id)}><img src={d.photos[0].src} alt={translate(d.name)} loading="lazy"/><strong>{translate(d.name)}</strong></button>)}</div></section>
 </section>;
}
function Photos({openPhoto,change,indexes}){
 const [filter,setFilter]=useState('all');const group=dogs.filter(d=>familyIds.includes(d.id));const selected=filter==='all'?group:group.filter(d=>d.id===filter);
 return <section className="collection-page compact-collection"><div className="page-heading"><span className="eyebrow">{translate("KEPT TOGETHER")}</span><h1>{translate("The family album.")}</h1><p>{translate("Original photographs, with a source behind every image.")}</p></div><label className="filter-label">{translate("Show photographs of ")}<select value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">{translate("All family members")}</option>{group.map(d=><option key={d.id} value={d.id}>{translate(d.name)}{translate(" (")}{translate(d.photos.length)}{translate(")")}</option>)}</select></label><div key={filter} className="photo-grid content-enter">{translate(selected.flatMap(d=>d.photos.map((p,i)=><button key={d.id+p.id} onClick={()=>{change(d.id,i);openPhoto(d.id);}}><img src={p.src} alt={translate(`${d.name}, photo ${i+1}`)} loading="lazy"/><span><strong>{translate(d.name)}</strong><small>{translate(i+1)}{translate(" / ")}{translate(d.photos.length)}</small></span></button>)))}</div></section>;
}
function Sources({openSource}){
 return <section className="collection-page source-page"><div className="page-heading"><span className="eyebrow">{translate("A RECORD TO RETURN TO")}</span><h1>{translate("Sources & history.")}</h1><p>{translate("Original links, saved records and the dates we archived them.")}</p></div><div className="source-columns"><section><h2>{translate("Saved source pages")}</h2><div className="source-list">{sources.map(s=><article key={s.id}><h3>{translate(s.title.split(' - ')[0])}</h3><a href={s.url} target="_blank" rel="noreferrer">{translate(s.url)}<ArrowSquareOut size={14}/></a><div><span>{translate("Archived ")}{translate(formatDate(s.capturedAt))}</span><button className="text-link" onClick={()=>openSource(s.id)}>{translate("Read saved copy ")}<ArrowRight size={15}/></button></div></article>)}</div></section><aside><h2>{translate("Archive timeline")}</h2><ol className="timeline">{history.map(h=><li key={h.date}><time>{translate(formatDate(h.date))}</time><h3>{translate(h.title)}</h3><p>{translate(h.description)}</p></li>)}</ol><h2>{translate("Pedigree documents")}</h2>{documents.map((d,i)=><a className="document-link" href={d.original} target="_blank" rel="noreferrer" key={d.id}><ImageIcon size={22}/><span>{translate(`${['Billie','Zane','Ryder'][i]} pedigree`)}</span><ArrowSquareOut size={16}/></a>)}<p className="health-note">{translate("Source pages may change or disappear. Saved text and image files remain in this archive. Unidentified photographs from shared galleries have not been assigned to a family member.")}</p></aside></div></section>;
}
export function App(){
 const mobile=useMobile();
 const navigation=useRef(null);
 const initial=useRef(initialLocation());const [view,setView]=useState(initial.current.view);const [selected,setSelected]=useState(initial.current.dog);const [indexes,setIndexes]=useState({});const [modal,setModal]=useState(initial.current.modal);const [concept,setConcept]=useState(null);
 useEffect(()=>{
  if(!mobile)return;
  const nav=navigation.current,active=nav?.querySelector('[aria-current="page"]');
  if(!active)return;
  const left=active.offsetLeft,right=left+active.offsetWidth;
  if(left<nav.scrollLeft)nav.scrollLeft=left;
  else if(right>nav.scrollLeft+nav.clientWidth)nav.scrollLeft=right-nav.clientWidth;
 },[view,mobile]);
 const dog=dogs.find(d=>d.id===selected)||dogs[0];
 const change=useCallback((id,index)=>setIndexes(prev=>({...prev,[id]:index})),[]);
 const updateLocation=useCallback((nextView,id)=>{window.history.pushState({xxArchiveOverlay:null},'',archiveHash(nextView,id));},[]);
 const navigate=useCallback(next=>{setView(next);setConcept(null);updateLocation(next,selected);window.scrollTo({top:0,behavior:'instant'});},[selected,updateLocation]);
 const select=useCallback(id=>{
  setSelected(id);
  if(mobile){const next=nextOverlay(null,'profile',id);window.history.pushState({xxArchiveOverlay:next},'',archiveHash('family',id,next));setModal(next);}
  else updateLocation('family',id);
 },[updateLocation,mobile]);
 useEffect(()=>{const read=()=>{if(location.hash==='#main-content')return;const next=initialLocation();setView(next.view);setSelected(next.dog);setModal(next.modal);};window.addEventListener('popstate',read);window.addEventListener('hashchange',read);return()=>{window.removeEventListener('popstate',read);window.removeEventListener('hashchange',read);};},[]);
 const openOverlay=(type,id)=>{
  if(modal?.type===type&&modal.id===id)return;
  const next=nextOverlay(modal,type,id);
  window.history.pushState({xxArchiveOverlay:next},'',archiveHash(view,selected,next));
  setModal(next);
 };
 const openProfile=id=>openOverlay('profile',id);
 const openPhoto=id=>openOverlay('photo',id);
 const openSource=id=>openOverlay('source',id);
 const backProfile=()=>window.history.back();
 const closeOverlay=()=>{
  if(modal.depth){window.history.go(-modal.depth);return;}
  window.history.replaceState({xxArchiveOverlay:null},'',archiveHash(view,selected));setModal(null);
 };
 const previousOverlay=modal?.trail?.at(-1);
 const previousLabel=previousOverlay?.type==='source'?'saved source':dogs.find(d=>d.id===previousOverlay?.id)?.name||'previous profile';
 const modalDog=modal&&dogs.find(d=>d.id===modal.id);const modalSource=modal&&sources.find(s=>s.id===modal.id);
 return <><a className="skip-link" href="#main-content">{translate("Skip to content")}</a><div className={`app-shell ${view==='family'?'family-home':''}`}><header className="site-header"><button className="wordmark" onClick={()=>navigate('family')} aria-label={translate("Obi family archive home")}><strong>{translate("Obi")}</strong></button><nav ref={navigation} id="main-navigation" aria-label={translate("Main navigation")}>{views.map(v=><button key={v} onClick={()=>navigate(v)} className={view===v?'active':''} aria-current={view===v?'page':undefined}>{translate(labels[v])}</button>)}</nav><a className="language-switch" href={languageUrl(locale==='tr'?'en':'tr',location.hash)} hrefLang={locale==='tr'?'en':'tr'} lang={locale==='tr'?'en':'tr'} aria-label={translate(locale==='tr'?'English version':'Turkish version')}>{locale==='tr'?'EN':'TR'}</a></header>
 <main key={view} className="page-enter" id="main-content" tabIndex={-1}>{view==='family'?<div className="family-layout"><div className="tree-column">{mobile?<h1 className="sr-only">{translate("Family tree")}</h1>:<div className="tree-intro"><h1 className="sr-only">{translate("Family tree")}</h1><p>{translate("One of the three highlighted puppies will be Obi. Explore their siblings and every known generation above them.")}</p></div>}<FamilyTree onOpenProfile={openProfile} dogs={dogs} selected={selected} indexes={indexes} change={change} onSelect={select} onSiblings={()=>{navigate('puppies');requestAnimationFrame(()=>document.getElementById('siblings')?.scrollIntoView({behavior:'smooth'}));}} onConcepts={()=>{navigate('puppies');setConcept(candidates.some(d=>d.id===selected)?selected:'puppy-01');}}/></div>{!mobile&&<aside className="inspector"><Profile key={dog.id} dog={dog} index={indexes[dog.id]||0} change={change} openPhoto={openPhoto} openProfile={openProfile} openSource={openSource}/></aside>}</div>:view==='puppies'?<Puppies key={concept||'originals'} initialConcept={concept} openProfile={openProfile} openPhoto={openPhoto} indexes={indexes} change={change}/>:view==='photos'?<Photos openPhoto={openPhoto} change={change} indexes={indexes}/>:<Sources openSource={openSource}/>}</main>
 <footer className="site-footer"><span>{translate("Obi · A family archive")}</span><span>{translate("Photographs & source records from ")}<a href="https://www.basileas-minis.com/" target="_blank" rel="noreferrer">{translate("Basileas Minis ")}<ArrowSquareOut size={12}/></a></span></footer></div>
 {modal&&<Dialog key={modal.type==='profile'?'profile':modal.type+modal.id} navigationKey={modal.id} onBack={modal.trail?.length?backProfile:undefined} backLabel={`Back to ${previousLabel}`} title={translate(modal.type==='photo'?`${modalDog.name} · gallery`:modal.type==='source'?'Saved source record':`${modalDog.name} · full profile`)} onClose={closeOverlay} drawer={modal.type==='profile'} wide={modal.type==='photo'}>{modal.type==='photo'?<Lightbox dog={modalDog} index={indexes[modal.id]||0} change={change}/>:modal.type==='profile'?<Profile key={modal.id} dog={modalDog} index={indexes[modal.id]||0} change={change} openPhoto={openPhoto} openSource={openSource} full allDogs={dogs} selectRelative={openProfile}/>:<section className="saved-source"><a href={modalSource.url} target="_blank" rel="noreferrer">{translate(modalSource.url)} <ArrowSquareOut size={15}/></a><p>{translate("Archived ")}{translate(formatDate(modalSource.capturedAt))}{translate(" · saved page text")}</p>{modalSource.note&&<p className="archive-note">{translate(modalSource.note)}</p>}<h3>{translate("Original source text (English)")}</h3><pre lang="en" translate="no">{modalSource.text}</pre></section>}</Dialog>}
 </>;
}
