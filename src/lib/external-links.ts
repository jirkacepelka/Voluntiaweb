// Odkazy mimo tento web (IS, statnidluh, Discord, sociální sítě, odkazy v článcích…)
// se otevírají v novém okně. Doplňuje se centrálně v src/middleware.ts.

/** Hostitelé, které považujeme za „tento web“ – odkazy na ně zůstávají ve stejném okně. */
const OWN_HOSTS = new Set(['voluntia.cz', 'www.voluntia.cz', 'localhost', '127.0.0.1']);

export function isExternalHref(href: string): boolean {
  // Dokumenty (PDF) vždy do nového okna, i když jsou na našem webu.
  if (/\.pdf(?:$|[?#])/i.test(href)) return true;
  if (!/^https?:\/\//i.test(href)) return false;
  try {
    return !OWN_HOSTS.has(new URL(href).hostname);
  } catch {
    return false;
  }
}

/** Doplní odkazům mimo web target="_blank" a rel="noopener noreferrer" (zachová existující rel). */
export function markExternalLinks(html: string): string {
  return html.replace(/<a\b([^>]*)>/gi, (tag, attrs: string) => {
    const href = /\shref="([^"]*)"/i.exec(attrs)?.[1];
    if (!href || !isExternalHref(href) || /\starget=/i.test(attrs)) return tag;
    const relMatch = /\srel="([^"]*)"/i.exec(attrs);
    const rel = new Set((relMatch?.[1] ?? '').split(/\s+/).filter(Boolean));
    rel.add('noopener');
    rel.add('noreferrer');
    const withoutRel = relMatch ? attrs.replace(relMatch[0], '') : attrs;
    return `<a${withoutRel} target="_blank" rel="${[...rel].join(' ')}">`;
  });
}
