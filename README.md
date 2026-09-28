# Voluntia – web

Nový web voluntia.cz postavený v [Astru](https://astro.build). Výsledkem je statické
HTML/CSS s trochou JS, které poběží na jakémkoli hostingu. Obsah (články, stránky, program,
akce, lídři) se stahuje při buildu z CMS.

Vzhled vychází z veřejné části IS (is.voluntia.cz) a ze statnidluh.voluntia.cz – stejné
tokeny, písmo Inter, tlačítka, záložky, karty – a přebírá kompozici z návrhu ve Frameru.

## Spuštění

```bash
npm install
cp .env.example .env
npm run dev        # http://localhost:4321
npm run build      # typová kontrola + build do dist/
npm run preview    # náhled buildu
```

## Stránky

| adresa                               | obsah                                                   |
| ------------------------------------ | ------------------------------------------------------- |
| `/`                                  | hero se 3 čísly, články, program, hodnoty, lídři, dary  |
| `/clanky/`, `/clanky/{slug}/`        | výpis a detail článků                                   |
| `/program/`                          | hlavní postoje a 3 pilíře s návrhy                      |
| `/program/{pilir}/`, `…/{navrh}/`    | pilíř a detail konkrétního návrhu                       |
| `/manifest/`                         | manifest s obsahem kapitol                              |
| `/o-nas/`, `/stanovy-a-hodnoty/`     | o straně, hodnoty a stanovy                             |
| `/kontakt/`, `/transparentnost/`     | kontakty a identifikace, finanční zprávy a účty         |
| `/akce/`                             | kalendář akcí                                           |
| `/ochrana-osobnich-udaju/`           | ochrana osobních údajů                                  |

Lidé, členství, přihlášky a dary jsou v IS – web na ně jen odkazuje.
**Všechny odkazy mimo tento web se otevírají v novém okně** (doplňuje `src/middleware.ts`,
takže platí i pro odkazy uvnitř obsahu z CMS).

## Odkud se berou data

Nastavuje se v `.env`:

| proměnná              | hodnoty                   | význam                                           |
| --------------------- | ------------------------- | ------------------------------------------------ |
| `CMS_ARTICLES_SOURCE` | `mock`, `wordpress`, `is` | články                                           |
| `CMS_PAGES_SOURCE`    | `mock`, `wordpress`, `is` | O nás, Manifest, Ochrana osobních údajů          |
| `CMS_PROGRAM_SOURCE`  | `mock`, `wordpress`, `is` | návrhy pod pilíři programu                       |
| `CMS_PEOPLE_SOURCE`   | `mock`, `is`              | krajští lídři na homepage                        |
| `CMS_EVENTS_SOURCE`   | `mock`, `is`              | kalendář akcí                                    |
| `IS_API_URL`          | URL                       | API IS, výchozí `https://is.voluntia.cz/api/web` |
| `IS_API_TOKEN`        | token                     | volitelný                                        |
| `WP_API_URL`          | URL                       | REST API současného WordPressu                   |

- `mock` – ukázková data v `src/lib/cms/mock-data.ts`, funguje offline.
- `wordpress` – obsah ze současného voluntia.cz (přechodné období). Obsah z Elementoru se
  čistí (`src/lib/cms/html.ts`) a odkazy na staré adresy se přepisují na nové.
- `is` – cílový stav. Kontrakt, který musí IS vystavit, je v [docs/is-api.md](docs/is-api.md).

Nový zdroj = soubor v `src/lib/cms/sources/` implementující rozhraní z `src/lib/cms/types.ts`
a řádek v `src/lib/cms/index.ts`.

> Pozor: obrázky v obsahu z WordPressu se načítají přímo z voluntia.cz/wp-content. Před
> vypnutím WordPressu je potřeba přenést obsah i s obrázky do IS.

## Nasazení a staré adresy

`npm run build` vytvoří `dist/` – ten se nahraje na hosting. Web je statický, takže nový
obsah z CMS se objeví po dalším buildu (doporučení v [docs/is-api.md](docs/is-api.md)).

Staré adresy z WordPressu (`/aktuality/…`, `/program-2025/…`, `/oou/`, `/dary/`, …) se
přesměrovávají na nové – tabulka je v `src/lib/legacy.ts`. Build vytvoří:

- `dist/.htaccess` se skutečnými přesměrováními 301 a vlastní stránkou 404 (hosting s Apache),
- HTML přesměrování pro každou starou adresu (záloha pro jiný hosting),
- `sitemap-index.xml` a `robots.txt`.

### Vercel

Repozitář se na Vercelu importuje jako projekt, nic dalšího se nastavovat nemusí
(`vercel.json`: framework Astro, `npm run build`). Na Vercelu (proměnná `VERCEL`) se zapne
adaptér `@astrojs/vercel`, který z přesměrování udělá skutečné 301 a stránku 404;
`scripts/vercel-routes.mjs` je po buildu doladí (lomítko na konci, `/lide/*` → IS).

Zdroje dat pro produkci jsou v `.env.production` (commitovaný, bez tajemství). Token do IS
se případně nastaví v Settings → Environment Variables. Nový obsah z CMS se objeví po dalším
deployi – ten jde spouštět Deploy Hookem (Settings → Git → Deploy Hooks) z IS/WordPressu.

## Struktura

```
src/
  config.ts             odkazy, kontakty, transparentní účty, menu, čísla v hero
  data/                 texty pilířů programu a hodnoty
  lib/cms/              datová vrstva a zdroje (mock, wordpress, is), čištění HTML
  lib/legacy.ts         staré adresy → nové
  middleware.ts         odkazy mimo web do nového okna
  layouts/              Base (hlavička, patička), ContentPage (obsahové stránky)
  components/           Hero, karty, Program, Hodnoty, obsah kapitol, sdílení, …
  pages/                stránky webu (viz tabulka výše)
  styles/global.css     tokeny a komponenty převzaté z IS, typografie textu (.prose)
public/                 loga, logo IALP, mapa Evropy, favicon, robots.txt
```

## Co zbývá doplnit

Všechno je v kódu označené `TODO`:

- čísla v hero: daňové zatížení pracujících a náklady nelegalizace konopí (`src/config.ts`)
- odkazy na fórum, Pivo za svobodu, sociální sítě a dokument se stanovami (`src/config.ts`)
- přímé odkazy na záložky Dobrovolník a Příznivec v IS (`src/config.ts`)
- ověřit čísla transparentních účtů (odvozená z odkazů Fio, `src/config.ts`)
- fotky lidí (přijdou z IS)
- napojení čísla státního dluhu přímo na zdroj statnidluh.voluntia.cz
- větší verze loga IALP (teď 150 × 120 px)
