import { ArrowRight, ArrowSquareOut, CalendarBlank } from '@phosphor-icons/react';
import { translate } from './i18n';
import { Gallery, PhotoCredit, formatDate } from './Gallery';
import { thumbnailSource } from './image-sources';
import { parentPortraitStyle } from './parent-portraits';
import { parentRole } from './profile-records';
import { galleryItems } from './gallery-items';

export function ObiPage({dog, dogs, record, index, change, openPhoto, openProfile, openSource, onFamily}) {
  const breeder = record.breederNotes;
  return <section className="obi-page">
    <div className="obi-hero">
      <div className="obi-introduction">
        <span className="eyebrow">{translate('HER LITTLE WORLD')}</span>
        <h1>{translate('Meet Obi')}<span aria-hidden="true">.</span></h1>
        <p className="obi-lead">{translate('Our girl. A little merle, a whole new chapter.')}</p>
        <dl className="obi-key-dates">
          <div><CalendarBlank size={29} aria-hidden="true"/><div><dt>{translate('BORN')}</dt><dd>{translate(dog.facts.Born)}</dd></div></div>
          <div><CalendarBlank size={29} aria-hidden="true"/><div><dt>{translate('COMING HOME')}</dt><dd>{translate(dog.facts['Coming home'])}</dd><small>{translate('(approximate)')}</small></div></div>
        </dl>
        <dl className="obi-facts">
          {Object.entries(dog.facts).filter(([key])=>key!=='Born'&&key!=='Coming home').map(([key,value])=><div key={key}><dt>{translate(key)}</dt><dd>{translate(value)}</dd></div>)}
          <div><dt>{translate('Breed')}</dt><dd>Miniature American Shepherd</dd></div>
          <div><dt>{translate('Breeder')}</dt><dd><a href="https://www.basileas-minis.com/" target="_blank" rel="noreferrer">Basileas Minis <ArrowSquareOut size={13}/></a></dd></div>
        </dl>
        <button className="text-link" onClick={onFamily}>{translate('Explore her family tree')} <ArrowRight size={17}/></button>
      </div>
      <div className="obi-portrait">
        <Gallery dog={dog} index={index} change={change} onOpen={()=>openPhoto(dog.id)} thumbs/>
      </div>
    </div>

    <section className="obi-chapter obi-story">
      <div className="obi-section-heading"><span className="eyebrow">{translate('THE BEGINNING')}</span><h2>{translate('Her story so far.')}</h2></div>
      <ol className="obi-milestones">
        <li><time dateTime={record.birthDate}>{formatDate(record.birthDate)}</time><h3>{translate('Hello, Obi.')}</h3><p>{translate('Born to Billie and Zane. Birth date confirmed by her family.')}</p></li>
        <li><time dateTime={record.confirmedAt}>{formatDate(record.confirmedAt)}</time><h3>{translate('Our girl, at last.')}</h3><p>{translate('Puppy 03 is Obi. Her family confirmed her identity and shared her seven-week portrait.')}</p></li>
        <li><time dateTime={record.expectedHomeDate}>{translate('Around 28 November 2026')}</time><h3>{translate('Coming home.')}</h3><p>{translate('Her expected homecoming. The date is approximate; the first chapter together is still ahead.')}</p></li>
      </ol>
    </section>

    <section className="obi-chapter obi-family">
      <div className="obi-section-heading"><span className="eyebrow">{translate('WHERE SHE COMES FROM')}</span><h2>{translate('Mum & dad.')}</h2><p>{translate('Their photographs, pedigrees and complete breeder-reported health records.')}</p></div>
      <div className="obi-parents">{dog.parents.map(id=>{
        const parent=dogs.find(d=>d.id===id);
        return <button key={id} onClick={()=>openProfile(id)} className="obi-parent">
          <span className="parent-avatar"><img src={thumbnailSource(parent.photos[0].src)} style={parentPortraitStyle(parent.photos[0])} alt=""/></span>
          <span><small>{translate(parentRole(id))}</small><strong>{parent.name}</strong><span>{parent.formalName}</span></span><ArrowRight size={20}/>
        </button>;
      })}</div>
    </section>

    <section className="obi-chapter">
      <div className="obi-section-heading"><span className="eyebrow">{translate('KEPT FOR HER')}</span><h2>{translate('Notes from her breeder.')}</h2><p>{translate('Saved from Basileas Minis. Litter information and the breeder’s general programme, with the original source kept alongside.')}</p></div>
      <div className="obi-breeder-notes">{breeder.items.map(item=><article key={item.title}><h3>{translate(item.title)}</h3><p>{translate(item.text)}</p></article>)}</div>
      <div className="obi-source-line"><span>{translate('Archived ')}{formatDate(breeder.archivedAt)}</span><button className="text-link" onClick={()=>openSource(breeder.sourceId)}>{translate('Read saved breeder notes')} <ArrowRight size={16}/></button><a href={breeder.sourcePageUrl} target="_blank" rel="noreferrer">{translate('Original source')} <ArrowSquareOut size={14}/></a></div>
    </section>

    <section className="obi-chapter obi-personal-records">
      <div className="obi-section-heading"><span className="eyebrow">{translate('HER OWN RECORD')}</span><h2>{translate('Health & documents.')}</h2></div>
      <p>{translate('Obi’s individual health results, vaccination record, microchip details and registration documents have not been archived yet. Her parents’ health results remain in their own profiles.')}</p>
      <details className="obi-disclosure"><summary>{translate('Profile notes & photo history')}</summary><div><PhotoCredit photo={galleryItems(dog)[index]}/>{dog.overview.map((text,i)=><p key={i}>{translate(text)}</p>)}<button className="text-link" onClick={()=>openProfile(dog.id)}>{translate('View full profile ')}<ArrowRight size={16}/></button></div></details>
    </section>

    <details className="obi-disclosure obi-secondary"><summary>{translate('Imagining grown-up Obi')}<span>{translate('AI concept · speculative')}</span></summary><div><p>{translate('An imagined adult appearance. Eye colour, coat and markings are not predictions.')}</p><a href={dog.concepts[0].original} target="_blank" rel="noreferrer"><img className="obi-adult-concept" src={dog.concepts[0].src} alt={translate('Speculative AI adult appearance for Obi')} loading="lazy"/></a></div></details>
    <details className="obi-disclosure obi-secondary"><summary>{translate('Her siblings')}<span>{translate('Six little relatives')}</span></summary><div className="obi-siblings">{dogs.filter(d=>d.role==='Sibling').map(d=><button key={d.id} onClick={()=>openProfile(d.id)}><img src={thumbnailSource(d.photos[0].src)} style={{objectPosition:d.photos[0].objectPosition}} alt="" loading="lazy"/><span>{translate(d.name)}</span></button>)}</div></details>
  </section>;
}
