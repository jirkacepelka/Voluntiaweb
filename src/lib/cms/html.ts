// Úpravy HTML obsahu z CMS. Hlavně pro přechodné období s WordPressem (Elementor),
// ale bezpečné i pro čisté HTML z IS. Pracuje nad stromem dokumentu (node-html-parser).

import { parse, type HTMLElement } from 'node-html-parser';
import { stripTags } from './http';

const text = (el: HTMLElement) => el.textContent.replace(/\s+/g, ' ').trim();

/** Vyčistí HTML z WordPressu/Elementoru. */
export function cleanWpHtml(html: string): string {
  const root = parse(html, { comment: false });

  // Styly, skripty, inline styly.
  root.querySelectorAll('style, script, noscript').forEach((el) => el.remove());
  root.querySelectorAll('[style]').forEach((el) => el.removeAttribute('style'));

  // Mezery, obsah kapitol a oddělovače z Elementoru (web si obsah kapitol vykresluje sám).
  root
    .querySelectorAll('.elementor-widget-spacer, .elementor-widget-table-of-contents, .elementor-widget-divider, .elementor-menu-anchor')
    .forEach((el) => el.remove());

  // Tlačítka z Elementoru → tlačítka webu (bez ikon FontAwesome).
  root.querySelectorAll('a.elementor-button').forEach((a) => {
    const label = text(a.querySelector('.elementor-button-text') ?? a);
    const href = a.getAttribute('href') ?? '#';
    a.replaceWith(parse(`<a class="btn btn--ghost" href="${href.replace(/"/g, '&quot;')}">${escapeHtml(label)}</a>`));
  });
  // Skupina tlačítek vedle sebe: blok, jehož všechny podřízené bloky obsahují jen tlačítko.
  root.querySelectorAll('div').forEach((div) => {
    const kids = div.childNodes.filter((n) => n.nodeType === 1) as HTMLElement[];
    if (kids.length > 0 && kids.every((k) => k.querySelectorAll('a.btn').length === 1 && text(k) === text(k.querySelector('a.btn')!))) {
      div.classList.add('btn-row');
    }
  });

  // Výzva „Přispět – Každý příspěvek se počítá…“ – web má pod obsahem vlastní blok Pomozte Voluntii.
  root
    .querySelectorAll('h1, h2, h3, h4, h5, h6')
    .filter((h) => /^každý příspěvek se počítá/i.test(text(h)))
    .forEach((h) => (h.closest('.e-parent') ?? h.parentNode)?.remove());

  // Navigace „<- Předchozí bod“, „Další bod ->“, „<- Zpět na program“ – web ji má vlastní.
  root
    .querySelectorAll('h2, h3, h4, h5, h6')
    .filter((h) => h.querySelector('a') && /^(<-|←)|(->|→)$/.test(text(h)))
    .forEach((h) => h.remove());

  // Prázdné obrázkové bloky (např. po odstranění banneru) a prázdné odstavce.
  root.querySelectorAll('figure').forEach((f) => !f.querySelector('img, iframe, video') && f.remove());
  root.querySelectorAll('p').forEach((p) => !p.querySelector('img, iframe, a') && text(p).replace(/ /g, '') === '' && p.remove());

  // Dlouhé věty naformátované jako nadpis → zvýrazněný odstavec.
  root.querySelectorAll('h3, h4, h5, h6').forEach((h) => {
    if (text(h).length > 90) h.replaceWith(parse(`<p class="callout">${h.innerHTML}</p>`));
  });

  numberedListsToOl(root);
  boldListTerms(root);

  return root.toString();
}

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Odrážkový seznam, kde každá položka začíná ručně psaným číslem („1.Dobrovolné vztahy…“,
 * v Elementoru často jako <span class="number">1.</span>), převede na číslovaný seznam
 * a ruční čísla odstraní – číslování dělá seznam sám.
 */
function numberedListsToOl(root: HTMLElement) {
  root.querySelectorAll('ul').forEach((ul) => {
    const items = ul.querySelectorAll(':scope > li');
    if (items.length < 2 || !items.every((li) => /^\d+\.\s*/.test(text(li)))) return;
    items.forEach((li) => {
      const num = li.querySelector('span.number');
      if (num && /^\d+\.?$/.test(text(num))) num.remove();
      else li.innerHTML = li.innerHTML.replace(/^(\s*(?:<[^>]+>\s*)*)\d+\.\s*/, '$1');
    });
    ul.tagName = 'ol';
  });
  root.querySelectorAll('span.number').forEach((s) => text(s) === '' && s.remove());
}

/** „Dobrovolnost – Nikdo nesmí…“ → pojem před pomlčkou tučně. Jen krátké pojmy na začátku položky. */
function boldListTerms(root: HTMLElement) {
  root.querySelectorAll('li').forEach((li) => {
    if (li.querySelector('strong, b')) return;
    li.innerHTML = li.innerHTML.replace(/^(\s*)([^<–—]{2,40}?)\s+(–|—|&#8211;|&ndash;)\s+/, '$1<strong>$2</strong> – ');
  });
}

/**
 * Odstraní elementy (včetně vnořeného obsahu), jejichž otevírací tag odpovídá `openTag`.
 * Počítá zanoření stejných tagů, takže funguje i pro vnořené <div>.
 * Jen pro párové tagy – u prázdných (img, br) by chybějící uzavírací tag smazal zbytek HTML.
 */
export function removeElements(html: string, openTag: RegExp): string {
  let out = html;
  for (let guard = 0; guard < 50; guard++) {
    const match = openTag.exec(out);
    if (!match) break;
    const start = match.index;
    const tag = /^<([a-z0-9]+)/i.exec(match[0])?.[1];
    if (!tag) break;
    const re = new RegExp(`<\\/?${tag}\\b[^>]*>`, 'gi');
    re.lastIndex = start;
    let depth = 0;
    let end = -1;
    for (let m = re.exec(out); m; m = re.exec(out)) {
      depth += m[0][1] === '/' ? -1 : 1;
      if (depth === 0) {
        end = m.index + m[0].length;
        break;
      }
    }
    out = out.slice(0, start) + (end === -1 ? '' : out.slice(end));
  }
  return out;
}

/**
 * Odstraní sekci začínající nadpisem s daným textem – tedy nejbližší blok, který nadpis obsahuje
 * spolu s dalším obsahem. Pro stránky, kde web danou část vykresluje sám (např. výzva „Zapojte se“).
 */
export function removeSectionByHeading(html: string, heading: string): string {
  const root = parse(html, { comment: false });
  const h = root.querySelectorAll('h2, h3').find((el) => text(el).toLowerCase() === heading.toLowerCase());
  if (!h) return html;
  let block: HTMLElement = h;
  // Vystoupat k bloku, který kromě nadpisu obsahuje i další obsah sekce.
  while (block.parentNode && text(block.parentNode) === text(block)) block = block.parentNode;
  (block.parentNode ?? block).remove();
  return root.toString();
}

/**
 * Odstraní nadpis s daným textem a jeden blok hned za ním (obsah té části).
 * Bezpečnější než removeSectionByHeading, když nadpis a obsah nemají společný obal.
 */
export function removeHeadingAndNextBlock(html: string, heading: string): string {
  const root = parse(html, { comment: false });
  const h = root.querySelectorAll('h2, h3').find((el) => text(el).toLowerCase() === heading.toLowerCase());
  if (!h) return html;
  let block: HTMLElement = h;
  while (block.parentNode && block.parentNode.childNodes.filter((n) => n.nodeType === 1).length === 1) block = block.parentNode;
  block.nextElementSibling?.remove();
  block.remove();
  return root.toString();
}

/**
 * Odstraní první nadpis (h1/h2), pokud jen opakuje titulek stránky a je před prvním odstavcem.
 * Stránky i články z Elementoru ho mají v obsahu – web titulek vykresluje sám.
 */
export function stripLeadingTitle(html: string, title: string): string {
  return html.replace(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/, (heading, inner: string, offset: number) =>
    stripTags(inner).toLowerCase() === title.toLowerCase() && !/<p[\s>]/.test(html.slice(0, offset)) ? '' : heading,
  );
}

const slugify = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export interface Heading {
  id: string;
  text: string;
}

/** Doplní nadpisům h2 kotvy (id) a vrátí jejich seznam pro obsah stránky. */
export function addHeadingIds(html: string): { html: string; headings: Heading[] } {
  const headings: Heading[] = [];
  const used = new Set<string>();
  const out = html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (_, attrs: string, inner: string) => {
    const label = stripTags(inner);
    let id = slugify(label) || 'kapitola';
    while (used.has(id)) id += '-2';
    used.add(id);
    headings.push({ id, text: label });
    const cleanAttrs = attrs.replace(/\sid="[^"]*"/i, '');
    return `<h2${cleanAttrs} id="${id}">${inner}</h2>`;
  });
  return { html: out, headings };
}

/** Text prvního odstavce, zkrácený na `max` znaků – pro perex, když ho CMS nedodá. */
export function firstParagraphText(html: string, max = 220): string {
  const p = /<p[^>]*>([\s\S]*?)<\/p>/i.exec(html);
  const t = stripTags(p?.[1] ?? html);
  return t.length > max ? `${t.slice(0, max).replace(/\s+\S*$/, '')}…` : t;
}
