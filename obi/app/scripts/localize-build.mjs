import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const file='dist/client/index.html';
const alternatives='<link rel="alternate" hreflang="en" href="https://obi.uylas.net/"/><link rel="alternate" hreflang="tr" href="https://obi.uylas.net/tr"/>';
const english=readFileSync(file,'utf8').replace('</head>',alternatives+'</head>');
writeFileSync(file,english);
mkdirSync('dist/client/tr',{recursive:true});
writeFileSync('dist/client/tr/index.html',english.replace('lang="en"','lang="tr"').replace('Obi · Her little world','Obi · Onun küçük dünyası').replace('Obi’s little world: her story, photographs, family and breeder records.','Obi’nin küçük dünyası: hikâyesi, fotoğrafları, ailesi ve üreticisinden bilgiler.').replace('rel="canonical" href="https://obi.uylas.net/"','rel="canonical" href="https://obi.uylas.net/tr"').replace('/manifest.webmanifest','/manifest-tr.webmanifest'));
