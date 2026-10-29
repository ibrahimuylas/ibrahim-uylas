import { translate, locale } from './i18n';
import { useRef } from 'react';
import { galleryItems, mediaDescription } from './gallery-items';
import { thumbnailSource } from './image-sources';
import { CaretLeft, CaretRight, ArrowSquareOut } from '@phosphor-icons/react';

export function Gallery({ dog, index = 0, change, onOpen, compact = false, selected = false, thumbs = false }) {
  const touch = useRef(null);
  const photos = galleryItems(dog);
  const current = photos[index % photos.length];
  const step = (delta) => change(dog.id, (index + delta + photos.length) % photos.length);
  return <div className={`gallery ${compact ? 'compact-gallery' : 'detail-gallery'} ${selected ? 'selected' : ''} dog-${dog.id}`}>
    <div className={`photo-frame nodrag nopan ${current.kind==='ai-concept'?'ai-frame':''}`} onTouchStart={e => { if (e.touches.length === 1) touch.current = {x:e.touches[0].clientX,y:e.touches[0].clientY}; else touch.current = null; }} onTouchEnd={e => {
      if (!touch.current) return;
      const dx = e.changedTouches[0].clientX - touch.current.x;
      const dy = e.changedTouches[0].clientY - touch.current.y;
      if (photos.length > 1 && Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)*1.5) step(dx < 0 ? 1 : -1);
      touch.current = null;
    }}>
      <button className="photo-open" onClick={onOpen} aria-label={translate(`${compact ? 'Select' : 'Enlarge photo of'} ${dog.name}`)}>
        <img key={current.id} src={compact ? thumbnailSource(current.src) : current.src} decoding="async" alt={translate(mediaDescription(dog,current,index))} draggable="false" />
      </button>
      {current.kind==='ai-concept' && <span className="media-kind ai-label">{translate(current.label)}</span>}
      {photos.length > 1 && <>
        <button className="photo-arrow previous" aria-label={translate(`Previous photo of ${dog.name}`)} onClick={() => step(-1)}><CaretLeft size={23}/></button>
        <button className="photo-arrow next" aria-label={translate(`Next photo of ${dog.name}`)} onClick={() => step(1)}><CaretRight size={23}/></button>
        <span className="photo-count" aria-live={compact ? 'off' : 'polite'}>{translate(index + 1)}{translate(" / ")}{translate(photos.length)}</span>
      </>}
    </div>
    {thumbs && photos.length > 1 && <div className="thumbnail-strip" aria-label={translate(`${dog.name} photographs`)}>
      {photos.map((p, i) => <button key={p.id} onClick={() => change(dog.id, i)} aria-label={translate(`Show ${mediaDescription(dog,p,i)}`)} aria-pressed={index === i} className={index===i?'active':''}><img src={thumbnailSource(p.src)} alt="" loading="lazy" decoding="async" /></button>)}
    </div>}
  </div>;
}

export function PhotoCredit({ photo }) {
  if (photo.kind === 'ai-concept') return <div className="photo-credit ai-credit"><strong>{translate(photo.label)}</strong><span>{translate("Imagined adult appearance · not a photograph or a prediction.")}</span><a href={photo.original} target="_blank" rel="noreferrer">{translate("Open AI concept ")}<ArrowSquareOut size={14}/></a></div>;
  return <div className="photo-credit"><span>{translate("Photograph: Basileas Minis · archived ")}{translate(formatDate(photo.capturedAt))}</span><a href={photo.sourceImageUrl} target="_blank" rel="noreferrer">{translate("Original source ")}<ArrowSquareOut size={14}/></a><a href={photo.original} target="_blank" rel="noreferrer">{translate("Saved original ")}<ArrowSquareOut size={14}/></a></div>;
}
export function formatDate(value) { return new Intl.DateTimeFormat(locale==='tr'?'tr-TR':'en-GB', {day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(value+'T12:00:00Z')); }
