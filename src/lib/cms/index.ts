import { isArticleSource, isEventSource, isPageSource, isPeopleSource, isProgramSource } from './sources/is';
import { mockArticleSource, mockEventSource, mockPageSource, mockPeopleSource, mockProgramSource } from './sources/mock';
import { wordpressArticleSource, wordpressPageSource, wordpressProgramSource } from './sources/wordpress';
import type { Article, ArticleSource, EventSource, PageSource, PeopleSource, ProgramPillar, ProgramSource } from './types';

export type * from './types';

function pick<T>(sources: Record<string, T>, name: string | undefined, envVar: string): T {
  const key = name ?? 'mock';
  const source = sources[key];
  if (!source) throw new Error(`${envVar}="${key}" není podporovaný zdroj (${Object.keys(sources).join(', ')})`);
  return source;
}

const env = import.meta.env;

const articles = pick<ArticleSource>(
  { mock: mockArticleSource, wordpress: wordpressArticleSource, is: isArticleSource },
  env.CMS_ARTICLES_SOURCE,
  'CMS_ARTICLES_SOURCE',
);
const people = pick<PeopleSource>({ mock: mockPeopleSource, is: isPeopleSource }, env.CMS_PEOPLE_SOURCE, 'CMS_PEOPLE_SOURCE');
const pages = pick<PageSource>(
  { mock: mockPageSource, wordpress: wordpressPageSource, is: isPageSource },
  env.CMS_PAGES_SOURCE,
  'CMS_PAGES_SOURCE',
);
const program = pick<ProgramSource>(
  { mock: mockProgramSource, wordpress: wordpressProgramSource, is: isProgramSource },
  env.CMS_PROGRAM_SOURCE,
  'CMS_PROGRAM_SOURCE',
);
const events = pick<EventSource>({ mock: mockEventSource, is: isEventSource }, env.CMS_EVENTS_SOURCE, 'CMS_EVENTS_SOURCE');

// Během jednoho buildu se seznamy načtou jen jednou, i když je používá víc stránek.
let articlesCache: Promise<Article[]> | undefined;
let programCache: Promise<ProgramPillar[]> | undefined;

export const cms = {
  listArticles: () => (articlesCache ??= articles.listArticles()),
  getArticle: (slug: string) => articles.getArticle(slug),
  listPeople: people.listPeople,
  getPage: (slug: string) => pages.getPage(slug),
  listPillars: () => (programCache ??= program.listPillars()),
  listUpcomingEvents: () => events.listUpcomingEvents(),
};
