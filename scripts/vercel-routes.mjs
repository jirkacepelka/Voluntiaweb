// Doladí přesměrování, která z astro.config.ts vygeneroval adaptér pro Vercel
// (.vercel/output/config.json). Spouští se po buildu, mimo Vercel nic nedělá.
//  - Adaptér chytá jen adresy bez lomítka na konci (/novinky), staré odkazy ale mají /novinky/.
//  - Cíle bez lomítka (/clanky/$1) by udělaly zbytečný druhý skok na /clanky/$1/.
//  - /lide/{kdokoli}/ → IS: Astro neumí dynamické přesměrování na cizí web bez výčtu cest.

import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const file = '.vercel/output/config.json';
if (!existsSync(file)) process.exit(0);

const config = JSON.parse(readFileSync(file, 'utf8'));
let count = 0;
config.routes = config.routes.map((route) => {
  if (route.status !== 301 || !route.headers?.Location) return route;
  count++;
  const location = route.headers.Location;
  const isPath = location.startsWith('/') && !/[#?]/.test(location) && !location.endsWith('/');
  return {
    ...route,
    src: route.src.replace(/\$$/, '/?$'),
    headers: { ...route.headers, Location: isPath ? `${location}/` : location },
  };
});

const firstRedirect = config.routes.findIndex((r) => r.status === 301);
config.routes.splice(firstRedirect, 0, {
  src: '^/lide/[^/]+/?$',
  headers: { Location: 'https://is.voluntia.cz/lide/' },
  status: 301,
});

writeFileSync(file, JSON.stringify(config, null, 2));
console.log(`vercel-routes: upraveno ${count} přesměrování + /lide/*`);
