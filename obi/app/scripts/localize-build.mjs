import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const file='dist/client/index.html';
const alternatives='<link rel="alternate" hreflang="en" href="https://obi.uylas.net/"/><link rel="alternate" hreflang="tr" href="https://obi.uylas.net/tr"/>';
const english=readFileSync(file,'utf8').replace('</head>',alternatives+'</head>');
writeFileSync(file,english);
mkdirSync('dist/client/tr',{recursive:true});
writeFileSync('dist/client/tr/index.html',english.replace('lang="en"','lang="tr"').replace('Obi · Family archive','Obi · Aile arşivi').replace('Obi’s family archive: photographs, family tree, health records and original sources.','Obi’nin aile arşivi: fotoğraflar, soy ağacı, sağlık kayıtları ve özgün kaynaklar.').replace('rel="canonical" href="https://obi.uylas.net/"','rel="canonical" href="https://obi.uylas.net/tr"').replace('/manifest.webmanifest','/manifest-tr.webmanifest'));
