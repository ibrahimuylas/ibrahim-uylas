import messages from './data/tr.json' with {type:'json'};

export const localeForPath = path => /^\/tr(?:\/|$)/.test(path) ? 'tr' : 'en';
export const locale = localeForPath(typeof window !== 'undefined' ? window.location.pathname : '/');
export const localePath = locale === 'tr' ? '/tr' : '/';
const templates = Object.entries(messages).filter(([key]) => key.includes('{0}')).sort(([a],[b])=>b.replace(/\{\d+\}/g,'').length-a.replace(/\{\d+\}/g,'').length).map(([key,value]) => {
  const indexes=[];
  const escaped=key.split(/(\{\d+\})/).map(part=>{
    if(/^\{\d+\}$/.test(part)){indexes.push(part);return '(.*?)';}
    return part.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  }).join('');
  return {pattern:new RegExp('^'+escaped+'$','s'),value,indexes};
});

// Translate presentation only: record IDs, relationship roles, grades and URLs
// remain unchanged in the shared archive and application logic.
export function translate(value, language=locale) {
  if(language!=='tr'||typeof value!=='string'||!value.trim())return value;
  const key=value.trim();
  if(/^https?:\/\//.test(key))return value;
  const pad=result=>value.slice(0,value.indexOf(key))+result+value.slice(value.indexOf(key)+key.length);
  if(Object.hasOwn(messages,key))return pad(messages[key]);
  for(const {pattern,value:template,indexes} of templates){
    const match=key.match(pattern);
    if(match)return pad(template.replace(/\{\d+\}/g,token=>translate(match[indexes.indexOf(token)+1],language)));
  }
  if(key.includes('; '))return pad(key.split('; ').map(s=>translate(s,language)).join('; '));
  if(key.includes(' · '))return pad(key.split(' · ').map(s=>translate(s,language)).join(' · '));
  // Preserve exact grades, test abbreviations and clinician names.
  const result=key.replace(/\bclear\b/gi,'temiz').replace(/\bcarrier\b/gi,'taşıyıcı').replace(/\bnormal\b/gi,'normal');
  return pad(result);
}

export function languageUrl(language, hash='') {return (language==='tr'?'/tr':'/')+hash;}
