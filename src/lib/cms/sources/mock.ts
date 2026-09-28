import { mockArticles, mockEvents, mockPages, mockPeople, mockProgram } from '../mock-data';
import type { ArticleSource, EventSource, PageSource, PeopleSource, ProgramSource } from '../types';

export const mockArticleSource: ArticleSource = {
  async listArticles() {
    return [...mockArticles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  },
  async getArticle(slug) {
    return mockArticles.find((a) => a.slug === slug) ?? null;
  },
};

export const mockPeopleSource: PeopleSource = {
  async listPeople(opts) {
    return mockPeople
      .filter((p) => !opts?.group || p.groups.includes(opts.group))
      .sort((a, b) => a.order - b.order);
  },
};

export const mockPageSource: PageSource = {
  async getPage(slug) {
    return mockPages.find((p) => p.slug === slug) ?? null;
  },
};

export const mockProgramSource: ProgramSource = {
  async listPillars() {
    return mockProgram;
  },
};

export const mockEventSource: EventSource = {
  async listUpcomingEvents() {
    const now = new Date().toISOString();
    return mockEvents.filter((e) => (e.endsAt ?? e.startsAt) >= now).sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  },
};
