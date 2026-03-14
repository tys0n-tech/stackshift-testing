// Generate 240 placeholder PNG frames for the image sequence
// Pure Node.js — NO external dependencies (minimal PNG encoder built-in)
// Run: node scripts/generate-frames.mjs

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { deflateSync } from "zlib";

const TOTAL = 195;
const W = 960;
const H = 540;
const OUT_DIR = join(process.cwd(), "public", "sequence");

if (!existsSync(OUT_DIR)) {
  mkdirSync(OUT_DIR, { recursive: true });
}

/* ─── Minimal PNG Encoder ─── */
function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const typeBytes = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crcInput = Buffer.concat([typeBytes, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcInput), 0);
  return Buffer.concat([len, typeBytes, data, crc]);
}

function encodePNG(width, height, pixels) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type: RGB
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // Raw image data with filter byte (0 = None) per row
  const rawSize = height * (1 + width * 3);
  const raw = Buffer.alloc(rawSize);
  let offset = 0;
  for (let y = 0; y < height; y++) {
    raw[offset++] = 0; // filter: None
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 3;
      raw[offset++] = pixels[idx]; // R
      raw[offset++] = pixels[idx + 1]; // G
      raw[offset++] = pixels[idx + 2]; // B
    }
  }

  const compressed = deflateSync(raw);

  // IEND
  const iend = Buffer.alloc(0);

  return Buffer.concat([
    signature,
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", compressed),
    pngChunk("IEND", iend),
  ]);
}

/* ─── HSL to RGB ─── */
function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(1, s));
  l = Math.max(0, Math.min(1, l));
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r, g, b;
  if (h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

/* ─── Generate a frame ─── */
function generateFrame(frameNum) {
  const pixels = new Uint8Array(W * H * 3);
  const t = frameNum / TOTAL; // progress 0..1

  // Base dark background
  const bgR = 10,
    bgG = 10,
    bgB = 10;

  // Blob parameters
  const hue1 = 60 + t * 60;
  const blob1X = W * 0.5 + Math.sin(t * Math.PI * 4) * W * 0.2;
  const blob1Y = H * 0.5 + Math.cos(t * Math.PI * 2) * H * 0.15;
  const blob1R = Math.min(W, H) * (0.35 + Math.sin(t * Math.PI * 2) * 0.15);

  const hue2 = (hue1 + 120) % 360;
  const blob2X = W * 0.35 - Math.cos(t * Math.PI * 3) * W * 0.25;
  const blob2Y = H * 0.6 + Math.sin(t * Math.PI * 5) * H * 0.2;
  const blob2R = Math.min(W, H) * (0.28 + Math.cos(t * Math.PI * 3) * 0.1);

  const hue3 = (hue1 + 240) % 360;
  const blob3X = W * 0.7 + Math.sin(t * Math.PI * 6) * W * 0.15;
  const blob3Y = H * 0.3 - Math.cos(t * Math.PI * 4) * H * 0.15;
  const blob3R = Math.min(W, H) * (0.2 + Math.sin(t * Math.PI) * 0.08);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = (y * W + x) * 3;

      // Start with background
      let r = bgR,
        g = bgG,
        b = bgB;

      // Blob 1
      const d1 = Math.sqrt((x - blob1X) ** 2 + (y - blob1Y) ** 2);
      if (d1 < blob1R) {
        const factor = 1 - d1 / blob1R;
        const intensity = factor * factor * 0.35;
        const [cr, cg, cb] = hslToRgb(hue1, 0.8, 0.45);
        r += cr * intensity;
        g += cg * intensity;
        b += cb * intensity;
      }

      // Blob 2
      const d2 = Math.sqrt((x - blob2X) ** 2 + (y - blob2Y) ** 2);
      if (d2 < blob2R) {
        const factor = 1 - d2 / blob2R;
        const intensity = factor * factor * 0.25;
        const [cr, cg, cb] = hslToRgb(hue2, 0.6, 0.4);
        r += cr * intensity;
        g += cg * intensity;
        b += cb * intensity;
      }

      // Blob 3
      const d3 = Math.sqrt((x - blob3X) ** 2 + (y - blob3Y) ** 2);
      if (d3 < blob3R) {
        const factor = 1 - d3 / blob3R;
        const intensity = factor * factor * 0.2;
        const [cr, cg, cb] = hslToRgb(hue3, 0.5, 0.35);
        r += cr * intensity;
        g += cg * intensity;
        b += cb * intensity;
      }

      // Subtle vignette
      const vx = (x / W - 0.5) * 2;
      const vy = (y / H - 0.5) * 2;
      const vignette = 1 - (vx * vx + vy * vy) * 0.3;

      pixels[idx] = Math.min(255, Math.max(0, Math.round(r * vignette)));
      pixels[idx + 1] = Math.min(255, Math.max(0, Math.round(g * vignette)));
      pixels[idx + 2] = Math.min(255, Math.max(0, Math.round(b * vignette)));
    }
  }

  return pixels;
}

/* ─── Main ─── */
console.log(`Generating ${TOTAL} PNG frames (${W}x${H}) in ${OUT_DIR}...`);
console.time("Total");

for (let i = 1; i <= TOTAL; i++) {
  const padded = String(i).padStart(3, "0");
  const pixels = generateFrame(i);
  const png = encodePNG(W, H, pixels);
  // Save as .jpg extension (as specified) — the SequenceScroll component will load these
  writeFileSync(join(OUT_DIR, `ezgif-frame-${padded}.jpg`), png);
  if (i % 20 === 0 || i === 1) {
    console.log(`  ✓ Frame ${i}/${TOTAL}`);
  }
}

console.timeEnd("Total");
console.log("✅ Done! All frames generated.");
