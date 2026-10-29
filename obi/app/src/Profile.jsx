import { translate } from './i18n';
import { thumbnailSource } from './image-sources';
import { parentPortraitStyle } from './parent-portraits';
import { useEffect, useState } from 'react';
import { healthSummary, healthReferences } from './health-summary';
import healthReview from './data/health-review.json';
import { galleryItems } from './gallery-items';
import { ArrowRight, ArrowSquareOut, Info, Ruler, PawPrint, Eye } from '@phosphor-icons/react';
import { parentRole, healthGroups } from './profile-records';
import { Gallery, formatDate, PhotoCredit } from './Gallery';

export function SourceRecord({ dog, openSource, full=false }) {
 const familyReference=dog.sourceKind==='family-reference';
 const record=<><a className="source-url" href={dog.sourcePageUrl} target="_blank" rel="noreferrer">{translate(dog.sourcePageUrl)}<ArrowSquareOut size={14}/></a><p>{translate("Archived ")}{translate(formatDate(dog.capturedAt))}</p><button className="text-link" onClick={()=>openSource(dog.sourceId)}>{translate("Open saved copy ")}<ArrowSquareOut size={15}/></button></>;
 if(familyReference)return <div className="source-record"><h3>{translate("Profile source")}</h3><p>{translate(`No individual profile page has been archived for ${dog.name}.`)}</p>{full&&<div className="relationship-source"><h3>{translate("Family relationship source")}</h3><p>{translate(`${dog.name} is mentioned on ${dog.sourceContext}’s profile. This documents the family relationship, not a separate profile or health record for ${dog.name}.`)}</p>{translate(record)}</div>}</div>;
 return <div className="source-record"><h3>{translate(dog.sourceKind==='litter'?'Litter page source':'Source record')}</h3>{translate(record)}</div>;
}
function shortResult(result){return result.replace(/ \(.*?\)/g,'').replace('+/−','+/−')+(result.includes('carrier')?' carrier':result.includes('clear')?' clear':'');}
export function HealthTable({dog,full=false,records}){
 const order=['Hips (HD)','Elbows (ED)','Eyes','LTV','LSTV','Patella','Patella (PL)','MDR1','NAD','CDDY/IVDD'];
 const rows=records || (full?dog.tests:order.map(n=>dog.tests.find(t=>t.name===n)).filter(Boolean));
 if(!rows.length)return <p className="empty-note">{translate("No individual health results recorded in the archived source.")}</p>;
 return <><table className="health-table"><caption className="sr-only">{translate(`${dog.name} health results reported by the breeder`)}</caption><tbody>{rows.map(t=><tr key={t.name}><th scope="row">{translate(t.name)}</th><td>{t.carrier?<span className="carrier">{translate("+/− carrier")}</span>:full?t.result:shortResult(t.result)}{t.carrier&&<Info size={15} className="info-icon" aria-label={translate("Carrier result as reported by breeder")}/>}{full&&<a className="test-source" href={t.sourcePageUrl} target="_blank" rel="noreferrer" aria-label={translate(`Source for ${t.name}`)}><ArrowSquareOut size={14}/></a>}</td></tr>)}</tbody></table>{!full&&rows.length<dog.tests.length&&<p className="health-preview-note">{translate(`Showing ${rows.length} of ${`${dog.tests.length} recorded results`}. Full profile includes the complete list.`)}</p>}</>;
}
export function Profile({dog,index,change,openPhoto,openProfile,openSource,full=false,selectRelative,allDogs=[]}){
 const [tab,setTab]=useState('health');useEffect(()=>setTab(dog.tests.length?'health':'overview'),[dog.id,dog.tests.length]);
 return <article className={`profile ${full?'full-profile':''}`} aria-label={translate(`${dog.name} profile`)}>
   <div className="profile-gallery"><Gallery dog={dog} index={index} change={change} onOpen={()=>openPhoto(dog.id)} thumbs={full}/></div>
   <div className="profile-heading">{dog.role==='Candidate'&&<span className="candidate-note">{translate("One of three candidates · not chosen yet")}</span>}<h2>{translate(dog.name)}</h2><p>{translate(dog.role)}{translate(dog.formalName!==dog.name?` · ${dog.formalName}`:'')}</p>{!full&&(dog.facts.Height||dog.facts.Coat)&&<p>{translate([dog.facts.Height?.replace(/ \(.*\)/,''),dog.facts.Coat?.replace(' c/w','')].filter(Boolean).join(' · '))}</p>}</div>
   {full?<>
    {Object.keys(dog.facts).length>0&&<dl className="facts">{Object.entries(dog.facts).map(([key,value])=>{const Icon=key==='Height'?Ruler:key==='Eye colour'?Eye:PawPrint;return <div key={key}><Icon size={24} aria-hidden="true"/><div><dt>{translate(key)}</dt><dd>{translate(value)}</dd></div></div>;})}</dl>}
    <section className="profile-notes"><h3>{translate(dog.overviewLabel||'Profile notes')}</h3>{dog.overview.map((p,i)=><p className="overview-text" key={i}>{translate(p)}</p>)}</section>
    {dog.parents.length>0&&<div className="relatives"><h3>{translate("Parents")}</h3><div className="parent-links">{dog.parents.map(id=>{const parent=allDogs.find(d=>d.id===id);if(!parent)return null;return <button className="parent-link" key={id} onClick={()=>selectRelative(id)} aria-label={translate(`View ${parent.name}, ${parentRole(id).toLowerCase()} of ${dog.name}`)}>{parent.photos[0]&&<span className="parent-avatar"><img src={thumbnailSource(parent.photos[0].src)} style={parentPortraitStyle(parent.photos[0])} decoding="async" alt=""/></span>}<span><small>{translate(parentRole(id))}</small><strong>{translate(parent.name)}</strong></span><ArrowRight size={18}/></button>;})}</div></div>}
    <div className="health-heading"><h3>{translate("Health records")}</h3>{dog.tests.length>0&&<span className="record-count">{translate(`${dog.tests.length} recorded results`)}</span>}</div>
    {healthReview.profiles[dog.id]&&<p className="health-verification">{translate(`Complete list checked on ${formatDate(healthReview.checkedAt)} against the`)} <a href={healthReview.profiles[dog.id].sourceUrl} target="_blank" rel="noreferrer">{translate("breeder’s page")}</a>{translate(".")}</p>}
    {dog.tests.length?<div className="health-groups">{healthGroups(dog.tests).map(group=><section key={group.title}><h4>{translate(group.title)}</h4><HealthTable dog={dog} full records={group.rows}/></section>)}</div>:<HealthTable dog={dog} full/>}{dog.tests.length>0&&<><p className="health-note">{translate("Results are transcribed from the breeder’s page; original laboratory certificates have not been independently verified. “Eyes: clear” describes an eye examination, not eye colour. These are not test results for the puppies.")}</p><HealthSummary dog={dog}/></>}
    <PhotoCredit photo={galleryItems(dog)[index]}/>
   </>:<>
    <div className="profile-tabs" role="tablist" aria-label={translate("Profile information")}>{['overview','health'].map(t=><button key={t} id={`${dog.id}-${t}-tab`} role="tab" aria-selected={tab===t} aria-controls={`${dog.id}-panel`} onClick={()=>setTab(t)}>{translate(t==='overview'?'Overview':'Health')}</button>)}</div>
    <div key={tab} className="content-enter" id={`${dog.id}-panel`} role="tabpanel" aria-labelledby={`${dog.id}-${tab}-tab`}>{tab==='health'?<HealthTable dog={dog}/>:<div className="overview-summary">{dog.overview.map((p,i)=><p key={i}>{translate(p)}</p>)}</div>}</div>
    <button className="primary-button" onClick={()=>openProfile(dog.id)}>{translate("View full profile ")}<ArrowRight size={18}/></button>
   </>}
   <SourceRecord dog={dog} openSource={openSource} full={full}/>
 </article>;
}

function HealthSummary({dog}) {
 const notes=healthSummary(dog);
 return <section className="health-summary" aria-label={translate(`AI-assisted health summary for ${dog.name}`)}>
  <span className="eyebrow">{translate("READING THE RECORD")}</span><h3>{translate("AI-assisted summary")}</h3>
  <p className="summary-intro">{translate("An explanation of the archived entries, separate from the breeder’s results.")}</p>
  <dl>{notes.map(note=><div key={note.title}><dt>{translate(note.title)}</dt><dd>{translate(note.text)}{note.reference&&<a href={healthReferences[note.reference].url} target="_blank" rel="noreferrer">{translate(healthReferences[note.reference].label)}<ArrowSquareOut size={13}/></a>}</dd></div>)}</dl>
  <p className="summary-limit">{translate("This is a reading aid, not a veterinary assessment. No puppy health score or inherited test result is inferred. A vet can interpret the original certificates alongside the dog’s clinical history.")}</p>
 </section>;
}
