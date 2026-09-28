/**
 * Datový model webu. Každý zdroj (mock, WordPress, IS) převádí svá data do těchto typů,
 * takže komponenty nevědí, odkud obsah pochází.
 */

export interface CmsImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface Category {
  slug: string;
  name: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  /** Krátký perex bez HTML. */
  excerpt: string;
  /** Tělo článku jako HTML (z vlastního CMS, považujeme za důvěryhodné). */
  contentHtml: string;
  /** ISO 8601 */
  publishedAt: string;
  category: Category | null;
  cover: CmsImage | null;
  author: string | null;
}

export interface Person {
  id: string;
  slug: string;
  name: string;
  /** Funkce, např. „lídr v Praze“, „statutární zástupce“. */
  role: string | null;
  /** Kraj, za který člověk působí. */
  region: string | null;
  bio: string | null;
  photo: CmsImage | null;
  /** Odkaz na detail osoby (typicky profil v IS), pokud existuje. */
  url: string | null;
  /** Skupiny pro filtrování, např. "lidri", "kulaty-stul", "kontrolni-komise". */
  groups: string[];
  /** Pořadí pro řazení (menší = dřív). */
  order: number;
}

/** Obsahová stránka (O nás, Manifest, Ochrana osobních údajů…). */
export interface Page {
  slug: string;
  title: string;
  /** Tělo stránky jako HTML, bez titulku (ten vykresluje šablona). */
  contentHtml: string;
}

/** Konkrétní návrh v programu, např. „Důchodová reforma“. */
export interface Policy {
  slug: string;
  title: string;
  /** Krátké shrnutí bez HTML. */
  excerpt: string;
  contentHtml: string;
  cover: CmsImage | null;
  order: number;
}

/** Návrhy jednoho pilíře programu. Texty pilíře (heslo, úvod) jsou v src/data/program.ts. */
export interface ProgramPillar {
  /** Slug pilíře: zestihlit-stat | zastavet-stat | zastavit-stat */
  slug: string;
  policies: Policy[];
}

export interface CmsEvent {
  id: string;
  title: string;
  /** ISO 8601 */
  startsAt: string;
  endsAt: string | null;
  place: string | null;
  description: string | null;
  /** Odkaz na registraci nebo podrobnosti (např. Discord, Facebook událost). */
  url: string | null;
}

export interface ArticleSource {
  /** Všechny publikované články, od nejnovějšího. */
  listArticles(): Promise<Article[]>;
  getArticle(slug: string): Promise<Article | null>;
}

export interface PeopleSource {
  /** Lidé seřazení podle `order`; volitelně jen z dané skupiny. */
  listPeople(opts?: { group?: string }): Promise<Person[]>;
}

export interface PageSource {
  getPage(slug: string): Promise<Page | null>;
}

export interface ProgramSource {
  /** Návrhy rozdělené podle pilířů; návrhy seřazené podle `order`. */
  listPillars(): Promise<ProgramPillar[]>;
}

export interface EventSource {
  /** Nadcházející akce, od nejbližší. */
  listUpcomingEvents(): Promise<CmsEvent[]>;
}
