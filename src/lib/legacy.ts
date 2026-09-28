// Staré adresy z WordPressu (voluntia.cz) → nové adresy webu.
// Používá se pro přesměrování (astro.config.mjs) i pro přepis odkazů uvnitř obsahu z CMS.

import { links } from '../config';

/** Pevná přesměrování: stará cesta → nová cesta nebo externí adresa (IS). */
export const legacyRedirects: Record<string, string> = {
  '/program-2025/': '/program/',
  '/lide/': links.people,
  '/mapa/': links.map,
  '/zapojit-se/': links.getInvolved,
  '/prihlaska/': links.signupMember,
  '/dary/': links.donate,
  '/dekujeme-za-platbu/': links.donate,
  '/tiskove-zpravy/': '/clanky/',
  '/aktuality/': '/clanky/',
  '/novinky/': '/clanky/',
  '/oou/': '/ochrana-osobnich-udaju/',
  '/kalendar-akci/': '/akce/',
  '/manifest2/': '/manifest/',
  '/vyrocni-financni-zprava-za-rok-2025/': '/transparentnost/',
  '/financovani-volebni-kampane-do-psp-2025/': '/transparentnost/',
  '/volby-2025/': '/program/',
  '/uvod2/': '/',
  '/kontakt/': '/o-nas/#kontakt',
};

/**
 * Převede starou cestu na novou. Kromě pevných přesměrování řeší i vzory:
 *   /aktuality/{slug}/, /novinky/{slug}/ → /clanky/{slug}/
 *   /program-2025/{pilir}/          → /program/{pilir}/
 *   /program-2025/{pilir}/{navrh}/  → /program/{pilir}/{navrh}/
 *   /lide/{kdokoli}/                → lidé v IS
 * Vrací null, když cesta nemá náhradu (zůstává stejná).
 */
export function mapLegacyPath(pathname: string): string | null {
  const path = pathname.endsWith('/') ? pathname : `${pathname}/`;
  if (legacyRedirects[path]) return legacyRedirects[path];
  let m = path.match(/^\/(?:aktuality|novinky)\/([^/]+)\/$/);
  if (m) return `/clanky/${m[1]}/`;
  m = path.match(/^\/program-2025\/(.+)$/);
  if (m) return `/program/${m[1]}`;
  if (/^\/lide\/[^/]+\/$/.test(path)) return links.people;
  return null;
}

const OLD_HOSTS = /^https?:\/\/(www\.)?voluntia\.cz/i;

/**
 * Přepíše odkazy v HTML z CMS, které míří na staré adresy voluntia.cz, na nové.
 * Soubory z WordPressu (/wp-content/… – PDF, obrázky) na novém webu nejsou, takže vedou
 * na plnou adresu současného webu. TODO: přenést soubory do IS, než se WordPress vypne.
 */
export function rewriteLegacyLinks(html: string): string {
  return html
    .replace(/(href|src)="\/wp-content\//g, '$1="https://voluntia.cz/wp-content/')
    .replace(/(srcset="[^"]*)/g, (s) => s.replace(/(^|[\s,"])\/wp-content\//g, '$1https://voluntia.cz/wp-content/'))
    .replace(/href="([^"]+)"/g, (attr, href: string) => {
      let url: URL;
      try {
        url = new URL(href, 'https://voluntia.cz');
      } catch {
        return attr;
      }
      const isOldSite = OLD_HOSTS.test(href) || href.startsWith('/');
      if (!isOldSite || url.pathname.startsWith('/wp-content/')) return attr;
      const mapped = mapLegacyPath(url.pathname);
      if (mapped) return `href="${mapped}${mapped.includes('#') ? '' : url.hash}"`;
      // Odkaz na starý web bez náhrady – necháme relativní, aby vedl na nový web.
      return OLD_HOSTS.test(href) ? `href="${url.pathname}${url.hash}"` : attr;
    });
}
