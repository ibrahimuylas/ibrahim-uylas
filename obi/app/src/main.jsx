import React from "react";
import { locale } from './i18n';
document.documentElement.lang=locale;
document.title=locale==='tr'?'Obi · Aile arşivi':'Obi · Family archive';
document.querySelector('link[rel="canonical"]')?.setAttribute('href','https://obi.uylas.net'+(locale==='tr'?'/tr':'/'));
document.querySelector('meta[name="description"]')?.setAttribute('content',locale==='tr'?'Obi’nin aile arşivi: fotoğraflar, soy ağacı, sağlık kayıtları ve özgün kaynaklar.':'Obi’s family archive: photographs, family tree, health records and original sources.');
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./styles.css";
import "./polish.css";
import "./profile-layout.css";
import "./mobile.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
