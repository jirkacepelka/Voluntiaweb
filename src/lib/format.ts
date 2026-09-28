const dateFormat = new Intl.DateTimeFormat('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric', timeZone: 'Europe/Prague' });

/** „22. 9. 2026“ */
export const formatDate = (iso: string) => dateFormat.format(new Date(iso));

export const formatNumber = (n: number) => new Intl.NumberFormat('cs-CZ').format(n);

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
