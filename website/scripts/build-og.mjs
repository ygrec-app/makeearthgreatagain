#!/usr/bin/env node
// Generates public/og.png from public/svg/mega.svg.
// Single source of truth: any wordmark change in mega.svg flows through here
// on the next dev/build. Output is gitignored.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { Resvg } from "@resvg/resvg-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SOURCE = resolve(ROOT, "public/svg/mega.svg");
const OUT = resolve(ROOT, "public/og.png");

const PRIMARY = "#4048F3";
const WHITE = "#FFFFFF";
const W = 1200;
const H = 630;

const src = readFileSync(SOURCE, "utf8");

// Strip the outer <svg> wrapper and swap the source palette:
//   - Letter shapes (#4048F3 in source) → white, so they stand out on the
//     primary-blue OG canvas.
//   - Microcopy (fill="white" in source — Make/Earth/Great/Again inside each
//     letter) → primary, so it reads inside the white letters at OG scale.
// Use placeholders to avoid the second pass overwriting the first.
const PLACEHOLDER_LETTER = "__OG_LETTER__";
const PLACEHOLDER_MICRO = "__OG_MICRO__";
const inner = src
  .trim()
  .replace(/^<svg[^>]*>/, "")
  .replace(/<\/svg>\s*$/, "")
  .replace(new RegExp(PRIMARY, "gi"), PLACEHOLDER_LETTER)
  .replace(/fill="white"/gi, `fill="${PLACEHOLDER_MICRO}"`)
  .replaceAll(PLACEHOLDER_LETTER, WHITE)
  .replaceAll(PLACEHOLDER_MICRO, PRIMARY);

// mega.svg viewBox is 0 0 545 275. Scale the wordmark up to fill ~90% of the
// 1200×630 frame so the per-letter "Make/Earth/Great/Again" microcopy embedded
// inside each glyph stays legible at OG-thumbnail size.
const SVG_W = 545;
const SVG_H = 275;
const TARGET_W = W * 0.9;
const SCALE = TARGET_W / SVG_W;
const drawnW = SVG_W * SCALE;
const drawnH = SVG_H * SCALE;
const tx = (W - drawnW) / 2;
const ty = (H - drawnH) / 2;

const composed = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${PRIMARY}"/>
  <g transform="translate(${tx} ${ty}) scale(${SCALE})">${inner}</g>
</svg>`;

const png = new Resvg(composed, { fitTo: { mode: "width", value: W } })
  .render()
  .asPng();
writeFileSync(OUT, png);

console.log(`build-og: wrote ${OUT} (${png.length} bytes)`);
