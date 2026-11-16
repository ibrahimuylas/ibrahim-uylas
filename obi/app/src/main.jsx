import React from "react";
import "@fontsource/dm-serif-display/latin-400.css";
import "@fontsource/dm-serif-display/latin-ext-400.css";
import { locale } from './i18n';
document.documentElement.lang=locale;
document.title=locale==='tr'?'Obi · Onun küçük dünyası':'Obi · Her little world';
document.querySelector('link[rel="canonical"]')?.setAttribute('href','https://obi.uylas.net'+(locale==='tr'?'/tr':'/'));
document.querySelector('meta[name="description"]')?.setAttribute('content',locale==='tr'?'Obi’nin küçük dünyası: hikâyesi, fotoğrafları, ailesi ve üreticisinden bilgiler.':'Obi’s little world: her story, photographs, family and breeder records.');
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./styles.css";
import "./polish.css";
import "./profile-layout.css";
import "./mobile.css";
import "./obi-page.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
