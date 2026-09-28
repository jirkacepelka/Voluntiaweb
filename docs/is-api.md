# API pro web – kontrakt s IS (is.voluntia.cz)

Web (voluntia.cz) si při buildu stahuje články a lidi z IS. Tohle je rozhraní, které musí IS
vystavit. Klient na straně webu je v `src/lib/cms/sources/is.ts`, datové typy v
`src/lib/cms/types.ts`.

- Základní URL: `https://is.voluntia.cz/api/web` (nastavitelné přes `IS_API_URL`)
- Formát: JSON, UTF-8, `camelCase`
- Autorizace: volitelná. Když je nastavený `IS_API_TOKEN`, web posílá `Authorization: Bearer <token>`.
  Data jsou veřejná, takže endpointy můžou být i bez tokenu.
- Obrázky: `url` může být absolutní, nebo relativní vůči originu IS (`/upload/…`).
  Web si je při buildu stáhne a zoptimalizuje (WebP, víc velikostí).
- Datumy: ISO 8601 s časovou zónou (`2026-09-22T10:00:00+02:00`).
- Vracet jen publikovaný obsah (žádné koncepty).

## `GET /articles?page=1&perPage=50`

Seznam článků, od nejnovějšího.

```json
{
  "items": [Article, …],
  "page": 1,
  "pages": 3,
  "total": 124
}
```

## `GET /articles/{slug}`

Jeden článek včetně celého `contentHtml`. Neexistující slug → `404`.

### Article

| pole          | typ                          | poznámka                                    |
| ------------- | ---------------------------- | ------------------------------------------- |
| `id`          | string \| number             |                                             |
| `slug`        | string                       | použije se v URL `/clanky/{slug}/`         |
| `title`       | string                       |                                             |
| `excerpt`     | string                       | perex bez HTML, ideálně do 200 znaků        |
| `contentHtml` | string                       | tělo článku jako HTML (v seznamu může chybět) |
| `publishedAt` | string (ISO 8601)            |                                             |
| `category`    | `{ slug, name }` \| null     | např. `{ "slug": "volby", "name": "Volby" }` |
| `cover`       | `Image` \| null              | titulní obrázek, ideálně 16:9, min. 1600 px |
| `author`      | string \| null               | jméno autora                                |

HTML v `contentHtml` web vkládá tak, jak je – IS by měl pustit jen bezpečné značky
(`p, h2, h3, ul, ol, li, a, strong, em, blockquote, img, figure, figcaption, iframe` z YouTube).

## `GET /people?group=lidri`

Lidé, volitelně filtrovaní podle skupiny. Bez `group` vrátí všechny veřejné profily.

```json
{ "items": [Person, …] }
```

### Person

| pole     | typ                 | poznámka                                                    |
| -------- | ------------------- | ----------------------------------------------------------- |
| `id`     | string \| number    |                                                             |
| `slug`   | string              |                                                             |
| `name`   | string              |                                                             |
| `role`   | string \| null      | funkce, např. „lídr Středočeského kraje“                    |
| `region` | string \| null      | kraj, např. „Středočeský kraj“                              |
| `bio`    | string \| null      | krátký medailonek (jako poznámka pod jménem na `/lide/` v IS) |
| `photo`  | `Image` \| null     | čtverec, min. 600 × 600 px                                  |
| `url`    | string \| null      | odkaz na profil v IS, např. `/lide/jiri-fabera/`            |
| `groups` | string[]            | např. `["lidri", "kulaty-stul"]`                            |
| `order`  | number              | pořadí (menší = dřív)                                       |

Skupiny, které web používá: `lidri` (krajští lídři na homepage). Samostatnou stránku lidí
web nemá – odkazuje na `https://is.voluntia.cz/lide/`, takže `url` u osoby ideálně míří na její
profil v IS.

## `GET /pages/{slug}`

Obsahová stránka. Neexistující slug → `404`. Web používá tyto slugy:
`o-nas`, `manifest`, `ochrana-osobnich-udaju`.

```json
{ "slug": "o-nas", "title": "O politické straně Voluntia", "contentHtml": "<h2>…</h2><p>…</p>" }
```

- `contentHtml` bez titulku stránky (ten vykresluje web).
- U Manifestu web sám vytvoří obsah kapitol ze všech `<h2>` – kapitoly proto dávejte jako `h2`.

## `GET /program`

Konkrétní návrhy rozdělené podle pilířů. Texty samotných pilířů (heslo, úvod, hashtag)
jsou zatím ve webu (`src/data/program.ts`); `slug` pilíře musí sedět.

```json
{
  "pillars": [
    {
      "slug": "zestihlit-stat",
      "policies": [
        {
          "slug": "duchodova-reforma",
          "title": "Důchodová reforma",
          "excerpt": "Navrhujeme reformu založenou na daňových úlevách…",
          "contentHtml": "<p>…</p>",
          "cover": null,
          "order": 7
        }
      ]
    }
  ]
}
```

Slugy pilířů: `zestihlit-stat`, `zastavet-stat`, `zastavit-stat`. Návrh má adresu
`/program/{pilir}/{navrh}/`. `excerpt` je volitelný – když chybí, web vezme začátek prvního odstavce.

## `GET /events?upcoming=1`

Nadcházející akce pro `/akce/`, od nejbližší. Prázdný seznam = web ukáže „žádné akce“ a odkaz na Discord.

```json
{
  "items": [
    {
      "id": 12,
      "title": "Pivo za svobodu – Brno",
      "startsAt": "2026-10-15T18:00:00+02:00",
      "endsAt": null,
      "place": "Brno, …",
      "description": "Neformální setkání příznivců.",
      "url": "https://discord.gg/…"
    }
  ]
}
```

Volitelná pole: `endsAt`, `place`, `description`, `url`.

### Image

```json
{ "url": "/upload/member/96e25d354fabd621a6e5d23c.jpg", "alt": "Jiří Fábera", "width": 800, "height": 800 }
```

## Aktualizace webu po změně obsahu

Web je statický – nový článek, stránka nebo akce se objeví po dalším buildu. Doporučení: když IS publikuje
nebo upraví článek či profil, zavolá webhook, který spustí build a nasazení (např. GitHub
Actions `workflow_dispatch`, nebo deploy hook hostingu). Jako pojistka stačí build jednou za hodinu.
