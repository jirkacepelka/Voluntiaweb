// Tři pilíře programu (texty z Programu 2025 na původním webu).
// Konkrétní návrhy pod pilíři chodí z CMS (cms.listPillars()), propojené přes `slug`.

export interface PillarMeta {
  /** Slug pilíře – shodný s CMS a s adresou /program/{slug}/ */
  slug: string;
  tag: string;
  title: string;
  text: string;
  punchline: string;
}

export const pillars: PillarMeta[] = [
  {
    slug: 'zestihlit-stat',
    tag: '#Zeštíhlit stát',
    title: 'Zeštíhlit stát',
    text: 'Český stát žije nad poměry – na váš účet. Místo škrtů přibývají daně, formuláře a sliby na dluh. Voluntia říká dost. Chceme zeštíhlit stát, který nechá lidem více peněz, svobody i odpovědnosti. Naše ekonomika potřebuje méně politiků a více prostoru pro práci a podnikání.',
    punchline: 'Vaše peněženka není státní bankomat.',
  },
  {
    slug: 'zastavet-stat',
    tag: '#Zastavět stát',
    title: 'Zastavět stát',
    text: 'Bydlení je nedostupné, protože stát stavění spíše brzdí, než umožňuje. Limity, razítka, regulace – to všechno žene ceny nahoru a mladé lidi pryč. Voluntia chce změnu. Potřebujeme uvolnit ruce těm, kdo chtějí stavět a bydlet. Bez debyrokratizace a deregulace výstavby to nepůjde.',
    punchline: 'Bydlet není luxus. Je to základní potřeba.',
  },
  {
    slug: 'zastavit-stat',
    tag: '#Zastavit stát',
    title: 'Zastavit stát',
    text: 'Stát vám chce říkat, jak máte žít, vychovávat děti, nebo co si smíte dát k obědu. Od školek po lékaře se lidé musí přizpůsobit systému, místo aby systém sloužil jim. Voluntia věří v důvěru, ne v kontrolu. Chceme méně povinného a více dobrovolného – ve vzdělání, péči i životních volbách.',
    punchline: 'Váš život, vaše volba.',
  },
];

/** Hlavní postoje z úvodu Programu 2025. */
export const programPrinciples = [
  'Chceme více osobní i ekonomické svobody.',
  'Jsme pro reformu EU – konec regulací, dotací a byrokracie.',
  'Chceme setrvat v NATO – nutnost pro naši obranu.',
  'Jsme pro podporu Ukrajiny – Rusko je jasný agresor.',
];

export const pillarBySlug = (slug: string) => pillars.find((p) => p.slug === slug);
