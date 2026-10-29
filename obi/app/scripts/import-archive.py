from pathlib import Path
from PIL import Image,ImageOps
from bs4 import BeautifulSoup
from urllib.parse import urlparse
import json,shutil
base=Path(__file__).resolve().parents[2];archive=base/'design/archive';app=base/'app'
media=app/'public/media';originals=app/'public/archive/photos';media.mkdir(parents=True,exist_ok=True);originals.mkdir(parents=True,exist_ok=True)
(app/'src/data').mkdir(parents=True,exist_ok=True)
m=json.loads((archive/'photo-manifest.json').read_text());photos={};documents=[]
for i,r in enumerate(m['photos']):
 p=archive/r['localPath'];shutil.copy2(p,originals/p.name)
 with Image.open(p) as image:
  im=ImageOps.exif_transpose(image).convert('RGB');im.thumbnail((1600,1400));im.save(media/(p.stem+'.webp'),'WEBP',quality=87)
 data={'id':r['sha256'][:12],'src':'/media/'+p.stem+'.webp','original':'/archive/photos/'+p.name,'sourceImageUrl':r['sourceImageUrl'],'sourcePageUrl':r['sourcePages'][0],'sourcePages':r['sourcePages'],'capturedAt':r['capturedAt'],'kind':r['kind'],'sourceFile':p.name}
 if r['kind']=='pedigree':documents.append(data);continue
 if r.get('preferredGalleryVersion') is False:continue
 for subject in r['subjectIds']:photos.setdefault(subject,[]).append(data)
cover={'billie':'279704891','zane':'dsc6706','jay':'jay_orig','ryder':'178355829'}
for subject,match in cover.items():photos[subject].sort(key=lambda p:0 if match in p['sourceFile'] else 1)
source_pages={}
for path in (archive/'pages-2026-10-27').glob('*.html'):
 soup=BeautifulSoup(path.read_bytes(),'html.parser');main=soup.find(id='wsite-content') or soup.find(class_='wsite-elements') or soup.body
 for el in main.select('script,style,nav'):el.decompose()
 text='\n'.join(line.strip() for line in main.get_text('\n',strip=True).splitlines() if line.strip())
 source_pages[path.stem]={'id':path.stem,'url':'https://www.basileas-minis.com/'+path.name,'capturedAt':'2026-10-27','title':soup.title.get_text() if soup.title else path.stem,'text':text}
 # Plain text saved snapshot cannot execute third-party code.
 target=app/'public/archive/pages';target.mkdir(parents=True,exist_ok=True)
 (target/(path.stem+'.txt')).write_text(source_pages[path.stem]['url']+'\nArchived: 27 October 2026\n\n'+text)
def tests(rows):return [{'name':n,'result':v,'carrier':'carrier' in v,'category':c} for n,v,c in rows]
gen=lambda name,val:(name,val,'Genetic')
ort=lambda name,val:(name,val,'Orthopaedic')
billie_tests=[ort('Hips (HD)','A/A (Prof Dr Flückiger, FCI)'),ort('Elbows (ED)','0:0 (Prof Dr Flückiger, FCI)'),ort('Patella','Normal (OFA)'),ort('LSTV','Clear (Prof Dr Flückiger, FCI)'),('Eyes','Clear','Eye examination')]+[gen(n,'+/+ (clear)') for n in ['MDR1','HSF4','PRA','DM','CEA']]+[gen('NAD','+/− (carrier)')]
zane_tests=[ort('Hips (HD)','B/C (FCI)'),ort('Elbows (ED)','Normal (FCI)'),ort('LTV','Normal (FCI)'),('Eyes','Clear','Eye examination')]+[gen(n,'+/+') for n in ['MDR1','DM/SOD1','HSF4','PRCD-PRA','CEA','NAD','CDDY/IVDD']]
jay_tests=[ort('Hips (HD)','A/A'),ort('Elbows (ED)','0/0'),ort('Patella (PL)','Normal'),('Eyes','Clear','Eye examination')]+[gen(n,'+/+ (clear)') for n in ['MDR1','HSF4','PRA','DM','CEA']]+[gen('NAD','+/− (carrier)')]
ryder_tests=[ort('Hips (HD)','A1 (Dr Viefhues, FCI)'),ort('Elbows (ED)','0:0 (Dr Viefhues, FCI)'),ort('OCD','Normal (Dr Viefhues, FCI)'),ort('LTV','Clear (Dr Viefhues, FCI)'),ort('Patella (PL)','Normal (Dr Viefhues, FCI)'),('Eyes','Cleared annually','Eye examination')]+[gen(n,'+/+') for n in ['MDR1','DM/SOD1','HSF4','PRCD-PRA','CEA','CM','CMR1','NCL','CDDY/IVDD','NAD']]
dogs=[
 {'id':'billie','name':'Billie','formalName':'Basileas Journey Continues','role':'Mother','sourceId':'billie123','facts':{'Height':'39 cm (KC Medium)','Coat':'Blue merle c/w','Tail':'Long'},'parents':['jay','ryder'],'tests':tests(billie_tests),'overview':['An outgoing, happy and bouncy dog who enjoys meeting people and other dogs.','Billie earned the Swiss Junior Beauty Champion title and has begun agility foundation training.'],'overviewLabel':'From the breeder’s notes'},
 {'id':'zane','name':'Zane','formalName':'Basileas Lil Bit N Zane','role':'Father','sourceId':'zane','facts':{'Height':'40 cm','Coat':'Black, copper & white','Eye colour':'Blue'},'parents':['halsey','not-an-illusion'],'tests':tests(zane_tests),'overview':['Zane’s breeder profile records blue eyes, a black, copper and white coat, and a height of 40 cm.'],'overviewLabel':'Profile notes'},
 {'id':'jay','name':'Jay','formalName':'Basileas Epic Journey','role':'Maternal grandmother','sourceId':'jay123','facts':{'Height':'36 cm','Coat':'Blue merle','Eye colour':'Brown (both eyes)'},'parents':['basileas-american-journey','gordonview-all-my-exs-live-in-texas'],'tests':tests(jay_tests),'overview':['Billie’s mother, recorded as Basileas Epic Journey. Her profile includes her health results and her parents.'],'overviewLabel':'Profile notes'},
 {'id':'ryder','name':'Ryder','formalName':'Ryder','role':'Maternal grandfather','sourceId':'ryder','facts':{'Height':'42 cm','Colour profile':'Bb awat Kk EE DD','Tail':'Long/docked (by DNA test)'},'parents':['timberlines-different-dimension','timberlines-fenaz'],'tests':tests(ryder_tests),'overview':['Friendly with people and dogs, fond of children and cuddles, and comfortable travelling and hiking.','The breeder describes a Swiss mountain holiday just after he arrived at nine months old, including trains, buses, cable cars and a chair lift. Ryder is co-owned with Just Gorgeous Minis.'],'overviewLabel':'From the breeder’s notes'},
 {'id':'halsey','name':'Halsey','formalName':"Cross L’s Halsey Valley of Blues",'role':'Paternal grandmother','sourceId':'zane','facts':{},'parents':[],'tests':[],'overview':['Identified as Zane’s mother on his breeder profile. No separate health results are recorded in the archived source.']},
 {'id':'not-an-illusion','name':'Not An Illusion','formalName':"Cross L’s Not An Illusion",'role':'Paternal grandfather','sourceId':'zane','facts':{},'parents':[],'tests':[],'overview':['Identified as Zane’s father on his breeder profile. No separate health results are recorded in the archived source.']}
]
for id,name,source in [('basileas-american-journey','Basileas American Journey','jay123'),('gordonview-all-my-exs-live-in-texas',"Gordonview All My Ex’s Live In Texas",'jay123'),('timberlines-different-dimension','Timberlines Different Dimension','ryder'),('timberlines-fenaz','Timberlines Fenaz','ryder')]:
 dogs.append({'id':id,'name':name,'formalName':name,'role':'Great-grandparent','sourceId':source,'facts':{},'parents':[],'tests':[],'overview':['Family relationship and photograph recorded on the linked breeder profile.']})
for d in dogs:
 d['photos']=photos.get(d['id'],[])
 d['sourcePageUrl']=source_pages[d['sourceId']]['url'];d['capturedAt']='2026-10-27'
 for t in d['tests']:t['sourcePageUrl']=d['sourcePageUrl'];t['capturedAt']=d['capturedAt']
puppy_order=[('01','11-41-56','Copper face'),('02','11-29-15','Wide white blaze'),('03','11-32-06','Small white marking'),('04','11-30-38','Sibling'),('05','11-43-22','Sibling'),('06','11-38-48','Sibling'),('07','11-40-29','Sibling')]
for number,time,desc in puppy_order:
 p=archive/'puppies-2026-10-25'/f'whatsapp-image-2026-10-25-at-{time}.jpeg';dest=f'puppy-{number}.webp';shutil.copy2(p,originals/p.name)
 with Image.open(p) as image:
  im=ImageOps.exif_transpose(image).convert('RGB');im.thumbnail((1000,1300));im.save(media/dest,'WEBP',quality=90)
 photo={'id':'puppy-'+number,'src':'/media/'+dest,'original':'/archive/photos/'+p.name,'sourcePageUrl':'https://www.basileas-minis.com/puppies.html','sourceImageUrl':'https://www.basileas-minis.com/uploads/1/1/0/9/11094747/'+p.name,'capturedAt':'2026-10-25','kind':'photo'}
 dogs.append({'id':'puppy-'+number,'name':'Puppy '+number,'formalName':desc,'role':'Candidate' if int(number)<4 else 'Sibling','descriptor':desc,'sourceId':'puppies','sourcePageUrl':photo['sourcePageUrl'],'capturedAt':'2026-10-25','facts':{'Parents':'Billie × Zane'},'parents':['billie','zane'],'tests':[],'photos':[photo],'concept':'/media/ai-puppy-'+number+'.png' if int(number)<4 else None,'overview':['Archived puppy photograph. Puppy numbers are archive labels, not registered names. Obi has not been selected yet.','No individual test results or confirmed future eye colour are recorded.']})
for d in dogs:
 if d['role']=='Candidate':
  n=d['id'].split('-')[1]
  d['concepts']=[{'id':f'ai-{n}-{v}','src':f'/media/ai-puppy-{n}'+('-light' if v=='light' else '')+'.png','original':f'/media/ai-puppy-{n}'+('-light' if v=='light' else '')+'.png','kind':'ai-concept','variant':v,'label':'AI concept · '+('Light' if v=='light' else 'Dark'),'createdAt':'2026-10-27'} for v in ['light','dark']]
# Puppy source snapshot on 27 October no longer contains all archived puppy photographs.
pup=base/'design/references/puppies.html';s=BeautifulSoup(pup.read_bytes(),'html.parser');main=s.find(id='wsite-content') or s.body
for e in main.select('script,style,nav'):e.decompose()
source_pages['puppies']={'id':'puppies','url':'https://www.basileas-minis.com/puppies.html','capturedAt':'2026-10-27','title':'Puppies · Basileas Minis','text':main.get_text('\n',strip=True),'note':'The seven puppy photographs were archived on 25 October 2026. The page snapshot was saved on 27 October 2026, after some photographs had been removed. It does not prove their earlier placement.'}
# Distinguish an individual profile from a relative mentioned on another page.
for d in dogs:
 d['sourceKind']='profile' if d['id'] in {'billie','zane','jay','ryder'} else 'litter' if d['sourceId']=='puppies' else 'family-reference'
 if d['sourceKind']=='family-reference':d['sourceContext']={'zane':'Zane','jay123':'Jay','ryder':'Ryder'}[d['sourceId']]
(app/'src/data/archive.json').write_text(json.dumps({'dogs':dogs,'sources':list(source_pages.values()),'documents':documents,'history':[{'date':'2026-10-25','title':'Puppy photographs archived','description':'Seven original photographs preserved, including the three merle candidates.'},{'date':'2026-10-27','title':'Family records archived','description':'Profiles, health results, original image URLs and pedigree documents saved from Basileas Minis.'}]},indent=2,ensure_ascii=False))
print('Prepared',len(dogs),'profiles,',sum(len(d['photos']) for d in dogs),'gallery entries,',len(documents),'pedigrees.')
