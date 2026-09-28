// Odkazy a nastavení webu na jednom místě. TODO = doplnit skutečnou hodnotu.
// Odkazy mimo tento web se automaticky otevírají v novém okně (src/middleware.ts).

export const links = {
  // Stránky tohoto webu
  program: '/program/',
  manifest: '/manifest/',
  about: '/o-nas/',
  contact: '/o-nas/#kontakt',
  values: '/stanovy-a-hodnoty/',
  events: '/akce/',
  getInvolved: '/zapojte-se/',
  press: '/pro-media/',
  transparency: '/transparentnost/',
  privacy: '/ochrana-osobnich-udaju/',
  news: '/clanky/',

  // Informační systém (portál člena)
  join: 'https://is.voluntia.cz/',
  donate: 'https://is.voluntia.cz/dary/',
  people: 'https://is.voluntia.cz/lide/',
  map: 'https://is.voluntia.cz/mapa/',
  // Přihlášky v IS
  signupMember: 'https://is.voluntia.cz/prihlaska/?typ=clen',
  supporter: 'https://is.voluntia.cz/prihlaska/?typ=priznivec',
  volunteer: 'https://is.voluntia.cz/prihlaska/?typ=dobrovolnik',
  contributor: 'https://is.voluntia.cz/prihlaska/?typ=prispevatel',

  // Ostatní weby
  discord: 'https://discord.gg/bbvgGMhQza',
  forum: '#', // TODO: Voluntia Forum
  beer: '#', // TODO: Pivo za svobodu
  // Stanovy (PDF ze stránky O nás na původním webu). TODO: přenést do IS, než se WordPress vypne.
  statutes: 'https://voluntia.cz/wp-content/uploads/2026/04/2026-02-02-voluntia-stanovy-zmena.pdf',
  magistrat: 'https://magistrat.voluntia.cz/',
  statniDluh: 'https://statnidluh.voluntia.cz/',
  ialp: 'https://ialp.net/',
};

/** Orgány strany na stránce O nás → jejich stránky v IS (klíč = název v textu). */
export const organs: Record<string, string> = {
  'Kulatý stůl': 'https://is.voluntia.cz/organ/kulaty-stul/',
  'Kontrolní komise': 'https://is.voluntia.cz/organ/kontrolni-komise/',
  'Rozhodčí komise': 'https://is.voluntia.cz/organ/rozhodci-komise/',
  'Statutární zástupce': 'https://is.voluntia.cz/lide/019cf0b6-e7fc-74d6-a835-063d7b8c6dc6/',
};

/** Kontaktní a identifikační údaje strany (ze stránky Kontakt na původním webu). */
export const contact = {
  name: 'Libertariánská strana Voluntia',
  email: 'voluntia@voluntia.cz',
  mediaEmail: 'media@voluntia.cz',
  address: 'Fořtova 16/3, 181 00 Praha – Čimice',
  dataBox: '8324u37',
  ico: '23201703',
  dic: 'CZ23201703',
};

/** Finanční zprávy a transparentní účty (ze stránek o financování na původním webu). */
export const transparency = {
  reports: [
    { label: 'Výroční finanční zpráva za rok 2025', href: 'https://zpravy.udh.gov.cz/zprava/vfz2025/vodore' },
    { label: 'Zpráva o financování volební kampaně – volby do Poslanecké sněmovny 2025', href: 'https://zpravy.udh.gov.cz/zprava/ps2025/vodore' },
  ],
  // Čísla účtů odvozená z odkazů na transparentní účty Fio (kód banky 2010) – TODO: ověřit.
  accounts: [
    { label: 'Příspěvky a dary', number: '2703182268/2010', href: 'https://ib.fio.cz/ib/transparent?a=2703182268' },
    { label: 'Volby do Poslanecké sněmovny 2025', number: '2103182272/2010', href: 'https://ib.fio.cz/ib/transparent?a=2103182272' },
  ],
};

export const socials: { label: string; href: string; icon: 'facebook' | 'instagram' | 'x' | 'youtube' }[] = [
  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61561021276834', icon: 'facebook' },
  { label: 'Instagram', href: 'https://www.instagram.com/voluntiacz/', icon: 'instagram' },
  { label: 'X / Twitter', href: 'https://x.com/voluntiacz', icon: 'x' },
  { label: 'YouTube', href: 'https://www.youtube.com/channel/UCEZE0ks5rD51RcGjY59N2_w', icon: 'youtube' },
];

export interface NavLink {
  label: string;
  href: string;
}

/**
 * Položky menu – každá stránka má jeden název, stejný v horní liště i v patičce.
 * Odkazy, které ještě nemají adresu (`'#'`), se v menu nezobrazí (viz `existing`).
 */
export const pages = {
  about: { label: 'O nás', href: links.about },
  program: { label: 'Program', href: links.program },
  manifest: { label: 'Manifest', href: links.manifest },
  values: { label: 'Stanovy a hodnoty', href: links.values },
  people: { label: 'Lidé', href: links.people },
  contact: { label: 'Kontakt', href: links.contact },
  transparency: { label: 'Transparentnost', href: links.transparency },
  statutes: { label: 'Stanovy (PDF)', href: links.statutes },
  privacy: { label: 'Ochrana osobních údajů', href: links.privacy },
  press: { label: 'Pro média', href: links.press },
  news: { label: 'Články', href: links.news },
  events: { label: 'Kalendář akcí', href: links.events },
  discord: { label: 'Discord', href: links.discord },
  forum: { label: 'Voluntia Forum', href: links.forum },
  beer: { label: 'Pivo za svobodu', href: links.beer },
  getInvolved: { label: 'Všechny možnosti', href: links.getInvolved },
  join: { label: 'Stát se členem', href: links.signupMember },
  donate: { label: 'Přispět', href: links.donate },
  volunteer: { label: 'Dobrovolník', href: links.volunteer },
  supporter: { label: 'Příznivec', href: links.supporter },
} satisfies Record<string, NavLink>;

/** Jen odkazy, které už někam vedou (bez zástupného `'#'`). */
export const existing = (items: NavLink[]) => items.filter((i) => i.href !== '#');

/** Hlavní položky horní lišty. */
export const nav: NavLink[] = [pages.values, pages.program, pages.people, { label: 'Členství', href: links.join }, { label: 'Zapojte se', href: links.getInvolved }];

/** Rozbalovací menu „Více“ – tři sloupce jako v návrhu ve Frameru. */
export const navMore: { title: string; items: NavLink[] }[] = [
  { title: 'O Voluntii', items: [pages.about, pages.manifest, pages.people, pages.transparency, pages.press, pages.contact] },
  { title: 'Komunita', items: [pages.news, pages.events, pages.discord, pages.forum, pages.beer] },
  { title: 'Jak se zapojit?', items: [pages.supporter, pages.volunteer, pages.join, pages.donate, pages.getInvolved] },
].map((g) => ({ ...g, items: existing(g.items) }));

/**
 * Tři čísla v hero. Státní dluh se dopočítává živě (viz `debt`), ostatní jsou statické.
 * `value: null` se zobrazí jako „doplníme“. Karta s `href: '#'` není odkaz.
 */
export interface HeroStat {
  id: string;
  icon: 'Landmark' | 'Receipt' | 'Leaf';
  label: string;
  /** Hodnota bez jednotky; null = zatím chybí. U dluhu se přepisuje živě. */
  value: string | null;
  unit: string;
  sub: string;
  href: string;
  live?: boolean;
}

export const heroStats: HeroStat[] = [
  {
    id: 'dluh',
    icon: 'Landmark',
    label: 'Státní dluh',
    value: null, // počítá se z `debt`
    unit: 'kč',
    sub: 'od otevření stránky',
    href: links.statniDluh,
    live: true,
  },
  {
    id: 'dane',
    icon: 'Receipt',
    label: 'Daňové zatížení pracujících',
    value: '55 kč',
    unit: 'z každých 100 kč',
    sub: 'z ceny vaší práce si bere stát',
    href: '#', // TODO: stránka s metodikou (do té doby karta není odkaz)
  },
  {
    id: 'konopi',
    icon: 'Leaf',
    label: 'Nelegalizace konopí nás stojí',
    value: '2 500 000 000',
    unit: 'kč / rok',
    sub: 'represe a ušlé daně',
    href: '#', // TODO: stránka s metodikou (do té doby karta není odkaz)
  },
];

/**
 * Údaje pro okno „Státní dluh“ v hero. Částka se v prohlížeči dopočítává od `measuredAt`
 * podle denního přírůstku, stejně jako na statnidluh.voluntia.cz.
 * TODO: napojit na zdroj dat statnidluh.voluntia.cz, ať se to nemusí aktualizovat ručně.
 */
export const debt = {
  amount: 3_803_159_930_780,
  measuredAt: '2026-09-28T00:00:00+02:00',
  perDay: 859_000_000,
  perCapita: 349_042,
};
