// Vygeneruje podklady pro stránku Pro média (public/brand/): varianty loga a značky v SVG a PNG,
// profilový obrázek na sociální sítě a ZIP se vším. Zdroj: public/logo-voluntia.svg.
// Spuštění: npm run brand  (výstup se commituje, build ho jen zkopíruje)

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { deflateRawSync, crc32 } from 'node:zlib';
import sharp from 'sharp';

const OUT = 'public/brand';
const COLORS = { zluta: '#FED801', bila: '#FFFFFF', cerna: '#000000' };

mkdirSync(OUT, { recursive: true });

// Logo: celé logo z webu, jen s jinou barvou výplně.
const logo = readFileSync('public/logo-voluntia.svg', 'utf8').replace(/^﻿/, '');
// Značka: první tři cesty loga (srdce z podaných rukou), ořezané na vlastní rozměr.
const markPaths = [...logo.matchAll(/<path d="[^"]+"/g)].slice(0, 3).map((m) => `${m[0]} />`);
const mark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 0.8 62.3 49" fill="white">\n${markPaths.join('\n')}\n</svg>\n`;

const recolor = (svg, color) => svg.replace(/fill="white"/g, `fill="${color}"`);

const files = [];
const save = (name, data) => {
  writeFileSync(`${OUT}/${name}`, data);
  files.push(name);
};

for (const [name, color] of Object.entries(COLORS)) {
  const logoSvg = recolor(logo, color);
  const markSvg = recolor(mark, color);
  save(`voluntia-logo-${name}.svg`, logoSvg);
  save(`voluntia-znacka-${name}.svg`, markSvg);
  save(`voluntia-logo-${name}.png`, await sharp(Buffer.from(logoSvg), { density: 1200 }).resize({ width: 2400 }).png().toBuffer());
  save(`voluntia-znacka-${name}.png`, await sharp(Buffer.from(markSvg), { density: 2400 }).resize({ width: 1200 }).png().toBuffer());
}

// Profilový obrázek (sociální sítě): černá značka na žlutém čtverci, s okrajem pro kulatý ořez.
const avatarSize = 1080;
const avatarMark = await sharp(Buffer.from(recolor(mark, COLORS.cerna)), { density: 2400 }).resize({ width: 620 }).png().toBuffer();
save(
  'voluntia-profilovka.png',
  await sharp({ create: { width: avatarSize, height: avatarSize, channels: 4, background: COLORS.zluta } })
    .composite([{ input: avatarMark, gravity: 'center' }])
    .png()
    .toBuffer(),
);

// ZIP se vším (bez komprese pro PNG by byl zbytečně velký, proto deflate).
writeFileSync(`${OUT}/voluntia-brand.zip`, zip(files.map((name) => ({ name, data: readFileSync(`${OUT}/${name}`) }))));
console.log(`public/brand: ${files.length} souborů + voluntia-brand.zip`);

/** Minimální ZIP (deflate) bez závislostí. */
function zip(entries) {
  const local = [];
  const central = [];
  let offset = 0;
  for (const { name, data } of entries) {
    const nameBuf = Buffer.from(name, 'utf8');
    const deflated = deflateRawSync(data, { level: 9 });
    const crc = crc32(data) >>> 0;
    const header = Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50, 0);
    header.writeUInt16LE(20, 4); // verze
    header.writeUInt16LE(0x0800, 6); // UTF-8 názvy
    header.writeUInt16LE(8, 8); // deflate
    header.writeUInt32LE(crc, 14);
    header.writeUInt32LE(deflated.length, 18);
    header.writeUInt32LE(data.length, 22);
    header.writeUInt16LE(nameBuf.length, 26);
    local.push(header, nameBuf, deflated);

    const dir = Buffer.alloc(46);
    dir.writeUInt32LE(0x02014b50, 0);
    dir.writeUInt16LE(20, 4);
    dir.writeUInt16LE(20, 6);
    dir.writeUInt16LE(0x0800, 8);
    dir.writeUInt16LE(8, 10);
    dir.writeUInt32LE(crc, 16);
    dir.writeUInt32LE(deflated.length, 20);
    dir.writeUInt32LE(data.length, 24);
    dir.writeUInt16LE(nameBuf.length, 28);
    dir.writeUInt32LE(offset, 42);
    central.push(dir, nameBuf);
    offset += header.length + nameBuf.length + deflated.length;
  }
  const centralBuf = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralBuf.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...local, centralBuf, end]);
}
