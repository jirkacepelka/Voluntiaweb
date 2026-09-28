import type { Article, CmsEvent, Page, Person, ProgramPillar } from './types';

// Ukázková data převzatá ze současného voluntia.cz. Slouží pro vývoj bez připojení k CMS.

export const mockArticles: Article[] = [
  {
    id: 'a3',
    slug: 'voluntia-kandiduje-i-v-praze',
    title: 'Voluntia kandiduje i v Praze',
    excerpt:
      'Do komunálních voleb 2026 staví Voluntia vlastní pražskou kandidátku a představuje program pod heslem „Město, které nepřekáží“.',
    contentHtml:
      '<p>Voluntia rozšiřuje svoje působení i do hlavního města. Do komunálních voleb 2026 v Praze staví vlastní kandidátku a představuje program pod heslem „Město, které nepřekáží“.</p><p>Po úspěšném vstupu do celostátní politiky se Voluntia poprvé utká i o hlasy Pražanů. Kandidátku a program pro pražský magistrát představujeme na samostatném webu <a href="https://magistrat.voluntia.cz/">magistrat.voluntia.cz</a>.</p><h2>Kdo vede pražskou kandidátku</h2><p>Kandidátku vede Tadeáš Janků.</p>',
    publishedAt: '2026-09-22T10:00:00+02:00',
    category: { slug: 'volby', name: 'Volby' },
    cover: null,
    author: null,
  },
  {
    id: 'a2',
    slug: 'tiskova-zprava-voluntia-manifest',
    title: 'Voluntia představuje dlouhodobý Manifest',
    excerpt:
      'Jak může vypadat Česká republika postavená na důvěře v jednotlivce, na odpovědnosti a na skutečné svobodě.',
    contentHtml:
      '<p><strong>Praha, 25. listopadu 2025</strong> – Libertariánská strana Voluntia s hrdostí představuje svůj dlouhodobý Manifest – inspirativní dokument, který ukazuje, jak může vypadat Česká republika postavená na důvěře v jednotlivce, na odpovědnosti a na skutečné svobodě.</p><p>Manifest není jen další politický program.</p>',
    publishedAt: '2025-11-25T09:00:00+01:00',
    category: { slug: 'tiskove-zpravy', name: 'Tisková zpráva' },
    cover: null,
    author: null,
  },
  {
    id: 'a1',
    slug: 'libertarianska-strana-voluntia',
    title: 'Nový název: Libertariánská strana Voluntia',
    excerpt: 'Ministerstvo vnitra schválilo zkrácení celého názvu strany. Děkujeme za vaše podněty a podporu.',
    contentHtml:
      '<p>Ministerstvo vnitra dnes oficiálně schválilo změnu celého názvu Voluntie z „Voluntia, protože dobrovolnost je základním kamenem svobodné, respektující a produktivní společnosti“ na „Libertariánská strana Voluntia“.</p><p>Tímto jsme vyslyšeli podněty mnoha našich podporovatelů, kteří žádali o zkrácení názvu. Děkujeme vám za vaše podněty a podporu.</p>',
    publishedAt: '2025-11-05T12:00:00+01:00',
    category: { slug: 'strana', name: 'Strana' },
    cover: null,
    author: null,
  },
];

const leader = (
  order: number,
  slug: string,
  name: string,
  region: string,
  role: string,
  bio: string,
  roundTable = false,
): Person => ({
  id: slug,
  slug,
  name,
  role,
  region,
  bio,
  photo: null,
  url: 'https://is.voluntia.cz/lide/',
  groups: roundTable ? ['lidri', 'kulaty-stul'] : ['lidri'],
  order,
});

export const mockPeople: Person[] = [
  leader(1, 'jiri-fabera', 'Jiří Fábera', 'Praha', 'lídr v Praze, statutární zástupce', 'Podnikatel v dopravě, kapitalista, milující manžel.', true),
  leader(2, 'tomas-roud', 'Tomáš Roud', 'Středočeský kraj', 'lídr Středočeského kraje', 'Podnikatel, programátor, investor, mentor, manžel, otec 4 dětí. Voluntarista.'),
  leader(3, 'david-forbelsky', 'David Forbelský', 'Liberecký kraj', 'lídr Libereckého kraje', 'Systémový inženýr, zaměstnanec, golfový rozhodčí.', true),
  leader(4, 'michal-dragoun', 'Michal Dragoun', 'Ústecký kraj', 'lídr Ústeckého kraje', 'Chemik-technolog, minarchista, motorkář, trenér a rozhodčí plavání.', true),
  leader(5, 'matej-kotulan', 'Matěj Kotulán', 'Jihomoravský kraj', 'lídr Jihomoravského kraje', 'Spoluzakladatel 120 pro Prahu, nadšenec do ekonomie, svobody, hor a sportu.', true),
  leader(6, 'jindrich-stibor', 'Jindřich Stibor', 'Olomoucký kraj', 'lídr Olomouckého kraje', 'Voluntarista, informatik, milující manžel a nadšenec do technologií a popkultury.', true),
  leader(7, 'samuel-creeps', 'Samuel Creeps', 'Zlínský kraj', 'lídr Zlínského kraje', 'Informatik, libertarián a amatérský automechanik.', true),
  leader(8, 'victor-wolf', 'Victor Wolf', 'Moravskoslezský kraj', 'lídr Moravskoslezského kraje', 'Libertarián, gotik, kreslíř, písničkář, básník, korektor a milovník historie.', true),
  leader(9, 'vaclav-bauer', 'Václav Bauer', 'Karlovarský kraj', 'lídr Karlovarského kraje', 'QA Automation Engineer, bitcoinový maximalista, minarchista a zastánce svobody.'),
  leader(10, 'anna-marie-piskacova', 'Anna Marie Piskačová', 'Kraj Vysočina', 'lídryně Vysočiny', 'Individualistka, libertariánka a animátorka se zájmem o politiku.'),
  leader(11, 'ivana-rekeda', 'Ivana Rekeda', 'Královéhradecký kraj', 'lídryně Královéhradeckého kraje', 'Podnikatelka a mentorka se zkušenostmi z osobního rozvoje, vzdělávání dospělých a překladatelství.'),
  leader(12, 'petr-krouzil', 'Petr Kroužil', 'Jihočeský kraj', 'lídr Jihočeského kraje', 'Podnikatel a zapálený historik.'),
  leader(13, 'petr-flidr', 'Petr Flídr', 'Plzeňský kraj', 'lídr Plzeňského kraje', 'Softwarový integrátor, otec pětičlenné rodiny.'),
];

// ── Stránky, program, akce ──────────────────────────────────────────────────
// Zkrácené texty z původního webu. Plné znění dodá CMS (WordPress nebo IS).

const MOCK_NOTE = '<p><em>Ukázková data – plné znění stránky dodá CMS.</em></p>';

export const mockPages: Page[] = [
  {
    slug: 'o-nas',
    title: 'O politické straně Voluntia',
    contentHtml: `<h2>Libertariánská strana Voluntia</h2>
<p>Název naší politické strany Voluntia jsme zvolili proto, že pro nás je nejvyšší hodnotou dobrovolnost. Slovo „Voluntia“ vychází z latinského základu <em>voluntas</em>, což znamená vůle nebo dobrovolnost. Dobrovolnost vnímáme jako základní kámen svobodné, respektující a produktivní společnosti.</p>
<h2>Cíle strany</h2>
<ol>
<li><strong>Dobrovolné vztahy</strong> – Usilujeme o to, aby vztahy mezi podnikateli, zákazníky, zaměstnanci i institucemi byly vždy dobrovolné, založené na vzájemné dohodě a respektu.</li>
<li><strong>Volný trh</strong> – Prosazujeme volný trh, včetně přeshraničního, který podporuje konkurenci a inovace mezi soukromými subjekty.</li>
<li><strong>Efektivní a zúžený stát</strong> – Chceme odstranit nadbytečné regulace a byrokracii.</li>
<li><strong>Edukace populace</strong> – Klíčová je pro nás osvěta o významu individualismu a právu rozhodovat o svém životě bez nátlaku.</li>
<li><strong>Odmítání kolektivismu</strong> – Prosazujeme úspěch jednotlivce jako přínos pro celou společnost.</li>
</ol>${MOCK_NOTE}`,
  },
  {
    slug: 'manifest',
    title: 'Manifest',
    contentHtml: `<h2>Preambule</h2><p>Manifest Libertariánské strany Voluntia – pro svobodu, pro odpovědnost, pro budoucnost.</p>
<h2>Svoboda jednotlivce</h2><p>…</p><h2>Odpovědnost</h2><p>…</p><h2>Minimální stát</h2><p>…</p><h2>Závěr</h2><p>…</p>${MOCK_NOTE}`,
  },
  {
    slug: 'ochrana-osobnich-udaju',
    title: 'Ochrana osobních údajů',
    contentHtml: `<p>Správcem vašich osobních údajů je Libertariánská strana Voluntia.</p>${MOCK_NOTE}`,
  },
];

const policy = (slug: string, title: string, excerpt: string, order: number) => ({
  slug,
  title,
  excerpt,
  contentHtml: `<p>${excerpt}</p>${MOCK_NOTE}`,
  cover: null,
  order,
});

export const mockProgram: ProgramPillar[] = [
  {
    slug: 'zestihlit-stat',
    policies: [
      policy('zastavime-statni-zadluzovani', 'Zastavíme státní zadlužování', 'Stát se chová jako špatný hospodář – utrácí víc, než vybere, výsledný rozdíl si pak půjčí.', 1),
      policy('podpora-podnikatelu', 'Podpora podnikatelů', 'Stát nepodporuje podnikatele – stát jim překáží.', 2),
      policy('snizeni-poctu-ministerstev', 'Snížení počtu ministerstev', 'Česká republika má dnes 14 ministerstev – víc, než je potřeba a než je schopný stát efektivně řídit.', 3),
      policy('zruseni-narodnich-dotaci', 'Zrušení národních dotací', 'Národní dotace představují zásadní deformaci trhu.', 4),
      policy('zjednoduseni-zakoniku-prace', 'Zjednodušení zákoníku práce', 'Chceme, aby zákoník práce umožňoval volnější pracovní vztahy a větší svobodu pro zaměstnance i zaměstnavatele.', 5),
      policy('zlepseni-podminek-pro-akcie-a-kryptomeny', 'Zlepšení podmínek pro akcie a kryptoměny', 'Věříme v budoucnost, kde mají občané svobodu spravovat své finance moderně, bezpečně a s důvěrou.', 6),
      policy('duchodova-reforma', 'Důchodová reforma', 'Navrhujeme reformu založenou na daňových úlevách pro investice do soukromých penzijních fondů.', 7),
    ],
  },
  {
    slug: 'zastavet-stat',
    policies: [
      policy('tvuj-dum-do-7-dni', 'Tvůj dům – do 7 dní', 'Chceme, aby výstavba menších domů probíhala rychle, jednoduše, bez složitého papírování a byrokracie.', 1),
      policy('ochrana-poctivych-majitelu-a-najemniku', 'Ochrana poctivých majitelů a nájemníků', 'Cílem návrhu je zajistit spravedlnost a rovnováhu pro pronajímatele i nájemníky.', 2),
      policy('stavebni-pozemek-do-30-dni', 'Stavební pozemek do 30 dní', 'Dnes často nelze stavět ani na vlastním pozemku, pokud není vedený jakožto stavební v územním plánu.', 3),
      policy('levnejsi-a-rychlejsi-vystavba-vyskovych-budov', 'Levnější a rychlejší výstavba výškových budov', 'Dnešní stavební regulace často brání výstavbě do výšky i tam, kde by to bylo ekonomické a žádané.', 4),
      policy('omezeni-pravomoci-pamatkaru', 'Omezení pravomocí památkářů', 'Péče o kulturní dědictví nesmí být záminkou k plošnému omezování svobody výstavby.', 5),
    ],
  },
  {
    slug: 'zastavit-stat',
    policies: [
      policy('konec-valky-proti-psychotropnim-latkam', 'Konec války proti psychotropním látkám', 'Věříme, že stát nemá právo trestat dospělé lidi za to, co vkládají do vlastního těla, pokud tím neohrožují ostatní.', 1),
      policy('odstatneni-manzelstvi-svoboda-misto-regulace', 'Odstátnění manželství – svoboda místo regulace', 'Stát nemá určovat, jaký vztah je „správný“.', 2),
      policy('zruseni-nuceneho-financovani-osa-ct-a-cro', 'Zrušení nuceného financování OSA, ČT a ČRo', 'Současná právní úprava nutí občany i podnikatele hradit poplatky organizacím, které si sami nezvolili.', 3),
      policy('svobodne-a-efektivni-skolstvi', 'Svobodné a efektivní školství', 'Aktuální školní systém je zkostnatělý a neefektivní, proto prosazujeme jeho radikální deregulaci a liberalizaci.', 4),
    ],
  },
];

/** Žádné akce – stránka /akce/ ukáže prázdný stav. */
export const mockEvents: CmsEvent[] = [];
