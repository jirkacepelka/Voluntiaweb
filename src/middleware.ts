import { defineMiddleware } from 'astro:middleware';
import { markExternalLinks } from './lib/external-links';

// Běží při sestavení každé stránky (i ve vývojovém serveru): odkazy mimo web dostanou
// target="_blank", takže se to nemusí hlídat v každé komponentě ani v obsahu z CMS.
export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  if (!response.headers.get('content-type')?.includes('text/html')) return response;
  const html = markExternalLinks(await response.text());
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  return new Response(html, { status: response.status, statusText: response.statusText, headers });
});
