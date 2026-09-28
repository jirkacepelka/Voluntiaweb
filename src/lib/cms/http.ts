export class CmsHttpError extends Error {
  constructor(
    readonly url: string,
    readonly status: number,
  ) {
    super(`CMS request failed: ${status} ${url}`);
  }
}

export async function fetchJson<T>(url: string, headers: Record<string, string> = {}): Promise<{ data: T; res: Response }> {
  const res = await fetch(url, { headers: { Accept: 'application/json', ...headers } });
  if (!res.ok) throw new CmsHttpError(url, res.status);
  return { data: (await res.json()) as T, res };
}

/** Převede relativní URL (např. /upload/…) na absolutní vůči originu API. */
export function absoluteUrl(url: string, base: string): string {
  return new URL(url, base).toString();
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  ndash: '–', mdash: '—', hellip: '…', bdquo: '„', ldquo: '“', rdquo: '”',
};

export function decodeEntities(s: string): string {
  return s.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === '#') {
      const code = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    return NAMED_ENTITIES[e.toLowerCase()] ?? m;
  });
}

export function stripTags(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
}
