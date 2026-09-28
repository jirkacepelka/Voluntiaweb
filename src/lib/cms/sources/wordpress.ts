import { rewriteLegacyLinks } from '../../legacy';
import { cleanWpHtml, firstParagraphText, stripLeadingTitle } from '../html';
import { decodeEntities, fetchJson, stripTags } from '../http';
import type { Article, ArticleSource, CmsImage, Page, PageSource, Policy, ProgramSource } from '../types';

// Přechodný zdroj: obsah ze současného WordPressu na voluntia.cz přes jeho REST API.
// Obsah z Elementoru se čistí (src/lib/cms/html.ts) a odkazy na staré adresy se přepisují.

const base = (import.meta.env.WP_API_URL ?? 'https://voluntia.cz/wp-json/wp/v2').replace(/\/$/, '');

/** Adresy stránek na novém webu, které mají ve WordPressu jiný slug. */
const WP_PAGE_SLUGS: Record<string, string> = {
  'ochrana-osobnich-udaju': 'oou',
};

/** Slug stránky „Program 2025“, pod kterou jsou pilíře a pod nimi návrhy. */
const PROGRAM_ROOT_SLUG = 'program-2025';

interface WpEmbedded {
  author?: { name?: string }[];
  'wp:featuredmedia'?: { source_url?: string; alt_text?: string; media_details?: { width?: number; height?: number } }[];
  'wp:term'?: { taxonomy: string; slug: string; name: string }[][];
}

interface WpPost {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  _embedded?: WpEmbedded;
}

interface WpPage {
  id: number;
  slug: string;
  parent: number;
  menu_order: number;
  title: { rendered: string };
  content: { rendered: string };
  _embedded?: WpEmbedded;
}

const cover = (e?: WpEmbedded): CmsImage | null => {
  const media = e?.['wp:featuredmedia']?.[0];
  return media?.source_url
    ? { url: media.source_url, alt: media.alt_text ?? '', width: media.media_details?.width, height: media.media_details?.height }
    : null;
};

/**
 * Společné čištění obsahu: Elementor pryč, titulek na začátku pryč (vykresluje ho šablona),
 * ostatní h1 → h2 (na stránce smí být jen jeden h1), staré odkazy na nové adresy.
 * Banner se starým dlouhým názvem strany („Voluntia, protože dobrovolnost…“) vynecháváme.
 */
const prepareHtml = (html: string, title: string) => {
  // Banner odstraníme před čištěním, aby se s ním uklidil i jeho prázdný obal.
  let out = cleanWpHtml(html.replace(/<img[^>]*Frame-29[^>]*>/gi, ''));
  out = stripLeadingTitle(out, title);
  out = out.replace(/<h1(\s[^>]*)?>([\s\S]*?)<\/h1>/i, (h, _attrs: string | undefined, _inner: string, offset: number) =>
    /<p[\s>]/.test(out.slice(0, offset)) ? h : '',
  );
  out = out.replace(/<(\/?)h1\b/gi, '<$1h2');
  return rewriteLegacyLinks(out);
};

const toArticle = (p: WpPost): Article => {
  const category = p._embedded?.['wp:term']?.flat().find((t) => t.taxonomy === 'category' && t.slug !== 'nezarazene');
  const title = decodeEntities(p.title.rendered);
  return {
    id: String(p.id),
    slug: p.slug,
    title,
    excerpt: stripTags(p.excerpt.rendered).replace(/\s*\[?…\]?$/, '…'),
    contentHtml: prepareHtml(p.content.rendered, title),
    publishedAt: p.date,
    category: category ? { slug: category.slug, name: decodeEntities(category.name) } : null,
    cover: cover(p._embedded),
    author: p._embedded?.author?.[0]?.name ?? null,
  };
};

export const wordpressArticleSource: ArticleSource = {
  async listArticles() {
    const all: Article[] = [];
    for (let page = 1, pages = 1; page <= pages; page++) {
      const { data, res } = await fetchJson<WpPost[]>(`${base}/posts?per_page=100&page=${page}&_embed=1`);
      all.push(...data.map(toArticle));
      pages = Number(res.headers.get('X-WP-TotalPages') ?? 1);
    }
    return all;
  },
  async getArticle(slug) {
    const { data } = await fetchJson<WpPost[]>(`${base}/posts?slug=${encodeURIComponent(slug)}&_embed=1`);
    return data[0] ? toArticle(data[0]) : null;
  },
};

// ── Stránky ─────────────────────────────────────────────────────────────────

let allPagesCache: Promise<WpPage[]> | undefined;

/** Všechny stránky najednou (je jich málo) – program z nich skládá strom pilířů a návrhů. */
const allPages = () =>
  (allPagesCache ??= (async () => {
    const all: WpPage[] = [];
    for (let page = 1, pages = 1; page <= pages; page++) {
      const { data, res } = await fetchJson<WpPage[]>(`${base}/pages?per_page=100&page=${page}&_embed=1`);
      all.push(...data);
      pages = Number(res.headers.get('X-WP-TotalPages') ?? 1);
    }
    return all;
  })());

export const wordpressPageSource: PageSource = {
  async getPage(slug) {
    const wpSlug = WP_PAGE_SLUGS[slug] ?? slug;
    const page = (await allPages()).find((p) => p.slug === wpSlug);
    if (!page) return null;
    const title = decodeEntities(page.title.rendered);
    return { slug, title, contentHtml: prepareHtml(page.content.rendered, title) } satisfies Page;
  },
};

export const wordpressProgramSource: ProgramSource = {
  async listPillars() {
    const pages = await allPages();
    const root = pages.find((p) => p.slug === PROGRAM_ROOT_SLUG);
    if (!root) return [];
    return pages
      .filter((p) => p.parent === root.id)
      .map((pillar) => ({
        slug: pillar.slug,
        policies: pages
          .filter((p) => p.parent === pillar.id)
          .map((p): Policy => {
            const title = decodeEntities(p.title.rendered);
            const contentHtml = prepareHtml(p.content.rendered, title);
            return {
              slug: p.slug,
              title,
              excerpt: firstParagraphText(contentHtml),
              contentHtml,
              cover: cover(p._embedded),
              order: p.menu_order,
            };
          })
          .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'cs')),
      }));
  },
};
