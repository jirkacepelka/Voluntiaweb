import { firstParagraphText } from '../html';
import { CmsHttpError, absoluteUrl, fetchJson } from '../http';
import type {
  Article,
  ArticleSource,
  CmsEvent,
  CmsImage,
  EventSource,
  Page,
  PageSource,
  PeopleSource,
  Person,
  Policy,
  ProgramSource,
} from '../types';

// Klient pro API informačního systému is.voluntia.cz. Kontrakt je popsaný v docs/is-api.md.

const base = (import.meta.env.IS_API_URL ?? 'https://is.voluntia.cz/api/web').replace(/\/$/, '');
const token = import.meta.env.IS_API_TOKEN;
const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

interface Paged<T> {
  items: T[];
  page: number;
  pages: number;
  total: number;
}

type IsImage = CmsImage | null | undefined;
type IsArticle = Omit<Article, 'cover' | 'category' | 'author'> & Partial<Pick<Article, 'category' | 'author'>> & { cover?: IsImage };
type IsPerson = Omit<Person, 'photo' | 'url' | 'groups' | 'order'> & { photo?: IsImage; url?: string | null; groups?: string[]; order?: number };

const image = (img: IsImage): CmsImage | null =>
  img?.url ? { ...img, url: absoluteUrl(img.url, base), alt: img.alt ?? '' } : null;

const toArticle = (a: IsArticle): Article => ({
  id: String(a.id),
  slug: a.slug,
  title: a.title,
  excerpt: a.excerpt ?? '',
  contentHtml: a.contentHtml ?? '',
  publishedAt: a.publishedAt,
  category: a.category ?? null,
  cover: image(a.cover),
  author: a.author ?? null,
});

const toPerson = (p: IsPerson): Person => ({
  id: String(p.id),
  slug: p.slug,
  name: p.name,
  role: p.role ?? null,
  region: p.region ?? null,
  bio: p.bio ?? null,
  photo: image(p.photo),
  url: p.url ? absoluteUrl(p.url, base) : null,
  groups: p.groups ?? [],
  order: p.order ?? 0,
});

export const isArticleSource: ArticleSource = {
  async listArticles() {
    const all: Article[] = [];
    for (let page = 1, pages = 1; page <= pages; page++) {
      const { data } = await fetchJson<Paged<IsArticle>>(`${base}/articles?page=${page}&perPage=50`, headers);
      all.push(...data.items.map(toArticle));
      pages = data.pages;
    }
    return all.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  },
  async getArticle(slug) {
    try {
      const { data } = await fetchJson<IsArticle>(`${base}/articles/${encodeURIComponent(slug)}`, headers);
      return toArticle(data);
    } catch (e) {
      if (e instanceof CmsHttpError && e.status === 404) return null;
      throw e;
    }
  },
};

export const isPeopleSource: PeopleSource = {
  async listPeople(opts) {
    const query = opts?.group ? `?group=${encodeURIComponent(opts.group)}` : '';
    const { data } = await fetchJson<{ items: IsPerson[] }>(`${base}/people${query}`, headers);
    return data.items.map(toPerson).sort((a, b) => a.order - b.order);
  },
};

export const isPageSource: PageSource = {
  async getPage(slug) {
    try {
      const { data } = await fetchJson<Page>(`${base}/pages/${encodeURIComponent(slug)}`, headers);
      return { slug: data.slug ?? slug, title: data.title, contentHtml: data.contentHtml ?? '' };
    } catch (e) {
      if (e instanceof CmsHttpError && e.status === 404) return null;
      throw e;
    }
  },
};

type IsPolicy = Omit<Policy, 'cover' | 'excerpt' | 'order'> & { cover?: IsImage; excerpt?: string; order?: number };

export const isProgramSource: ProgramSource = {
  async listPillars() {
    const { data } = await fetchJson<{ pillars: { slug: string; policies: IsPolicy[] }[] }>(`${base}/program`, headers);
    return data.pillars.map((pillar) => ({
      slug: pillar.slug,
      policies: pillar.policies
        .map((p) => ({
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt ?? firstParagraphText(p.contentHtml ?? ''),
          contentHtml: p.contentHtml ?? '',
          cover: image(p.cover),
          order: p.order ?? 0,
        }))
        .sort((a, b) => a.order - b.order),
    }));
  },
};

type IsEvent = Omit<CmsEvent, 'id' | 'endsAt' | 'place' | 'description' | 'url'> &
  Partial<Pick<CmsEvent, 'endsAt' | 'place' | 'description' | 'url'>> & { id: string | number };

export const isEventSource: EventSource = {
  async listUpcomingEvents() {
    const { data } = await fetchJson<{ items: IsEvent[] }>(`${base}/events?upcoming=1`, headers);
    return data.items
      .map((e) => ({
        id: String(e.id),
        title: e.title,
        startsAt: e.startsAt,
        endsAt: e.endsAt ?? null,
        place: e.place ?? null,
        description: e.description ?? null,
        url: e.url ?? null,
      }))
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  },
};
