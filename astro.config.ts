import { writeFile } from 'node:fs/promises';
import type { AstroIntegration } from 'astro';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { legacyRedirects } from './src/lib/legacy';

const site = 'https://voluntia.cz';
const redirectPaths = new Set(Object.keys(legacyRedirects).map((p) => `${site}${p}`));

// Dynamická přesměrování starých adres (vzory) – pro Astro i pro .htaccess.
const legacyPatterns = [
  { astro: ['/aktuality/[slug]', '/clanky/[slug]'], apache: ['^aktuality/([^/]+)/?$', '/clanky/$1/'] },
  { astro: ['/novinky/[slug]', '/clanky/[slug]'], apache: ['^novinky/([^/]+)/?$', '/clanky/$1/'] },
  { astro: ['/program-2025/[pillar]', '/program/[pillar]'], apache: ['^program-2025/([^/]+)/?$', '/program/$1/'] },
  { astro: ['/program-2025/[pillar]/[policy]', '/program/[pillar]/[policy]'], apache: ['^program-2025/([^/]+)/([^/]+)/?$', '/program/$1/$2/'] },
  { astro: null, apache: ['^lide/[^/]+/?$', 'https://is.voluntia.cz/lide/'] },
] as const;

/**
 * Pro hosting s Apache (jako má dnešní WordPress) vygeneruje dist/.htaccess se skutečnými
 * přesměrováními 301 a vlastní stránkou 404. Na jiném hostingu se použijí HTML přesměrování,
 * která Astro generuje samo.
 */
const htaccess = (): AstroIntegration => ({
  name: 'voluntia-htaccess',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const lines = [
        '# Vygenerováno při buildu z src/lib/legacy.ts a astro.config.ts – neupravovat ručně.',
        'ErrorDocument 404 /404.html',
        '',
        '<IfModule mod_rewrite.c>',
        'RewriteEngine On',
        // NE = neescapovat „#“ v cíli (např. /o-nas/#kontakt).
        ...Object.entries(legacyRedirects).map(([from, to]) => `RewriteRule ^${from.slice(1).replace(/\/$/, '')}/?$ ${to} [R=301,L,NE]`),
        ...legacyPatterns.map(({ apache: [from, to] }) => `RewriteRule ${from} ${to} [R=301,L]`),
        '</IfModule>',
        '',
      ];
      await writeFile(new URL('.htaccess', dir), lines.join('\n'), 'utf8');
    },
  },
});

export default defineConfig({
  site,
  // Statický výstup – `npm run build` vytvoří složku dist/, kterou jde nahrát na libovolný hosting.
  output: 'static',
  // Na Vercelu adaptér převede `redirects` na skutečná 301 přesměrování (bez něj by to byly
  // jen HTML stránky s meta refresh). Na jiném hostingu stačí nahrát dist/ (+ .htaccess).
  adapter: process.env.VERCEL ? vercel() : undefined,
  trailingSlash: 'always',
  image: {
    // Obrázky článků a lidí chodí z CMS, povolíme jejich optimalizaci.
    domains: ['is.voluntia.cz', 'voluntia.cz'],
  },
  // Staré adresy z WordPressu → nové adresy (src/lib/legacy.ts).
  redirects: {
    ...legacyRedirects,
    ...Object.fromEntries(legacyPatterns.flatMap(({ astro }) => (astro ? [astro] : []))),
  },
  integrations: [
    sitemap({
      // Do sitemap patří jen skutečné stránky, ne přesměrování a chybová stránka.
      filter: (page) => !redirectPaths.has(page) && !/\/(aktuality|program-2025)\//.test(page) && !page.endsWith('/404/'),
    }),
    htaccess(),
  ],
});
