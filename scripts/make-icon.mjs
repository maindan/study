// Gera um ícone próprio (sem dependências): um quadrado arredondado com
// gradiente verde e a letra "S" (de Study), igual à marca do app.
// Saída: build/icon.ico (16..256) e build/icon.png (256).
import zlib from "node:zlib";
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "build");
fs.mkdirSync(OUT, { recursive: true });

// ---------- desenho (com supersampling 4x) ----------
function lerp(a, b, t) {
  return a + (b - a) * t;
}

// distância (com sinal aproximado por |d| ) de um ponto à borda de um
// retângulo arredondado — usada para anti-aliasing suave do fundo.
function sdRoundRect(x, y, cx, cy, hw, hh, r) {
  const qx = Math.abs(x - cx) - (hw - r);
  const qy = Math.abs(y - cy) - (hh - r);
  const ax = Math.max(qx, 0);
  const ay = Math.max(qy, 0);
  return Math.min(Math.max(qx, qy), 0) + Math.sqrt(ax * ax + ay * ay) - r;
}

// Constrói a polilinha de um "S": dois arcos de 225° empilhados e tangentes
// no centro. Calculada uma vez por tamanho.
function buildSPath(S) {
  const cx = S / 2;
  const h = 0.54 * S; // altura do glifo
  const r = h / 4; // raio de cada arco
  const top = (S - h) / 2;
  const c1y = top + r; // centro do arco de cima
  const c2y = top + h - r; // centro do arco de baixo
  const pts = [];
  const N = 80;
  // arco superior: de π/2 (centro) → 7π/4 (ponta superior direita)
  for (let i = 0; i <= N; i++) {
    const a = Math.PI / 2 + (5 * Math.PI / 4) * (i / N);
    pts.push([cx + r * Math.cos(a), c1y + r * Math.sin(a)]);
  }
  // arco inferior: de -π/2 (centro) → 3π/4 (ponta inferior esquerda)
  for (let i = 0; i <= N; i++) {
    const a = -Math.PI / 2 + (5 * Math.PI / 4) * (i / N);
    pts.push([cx + r * Math.cos(a), c2y + r * Math.sin(a)]);
  }
  return pts;
}

function distToPath(x, y, pts) {
  let best = Infinity;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const dx = x1 - x0,
      dy = y1 - y0;
    const len2 = dx * dx + dy * dy || 1;
    let t = ((x - x0) * dx + (y - y0) * dy) / len2;
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    const px = x0 + t * dx - x,
      py = y0 + t * dy - y;
    const d = px * px + py * py;
    if (d < best) best = d;
  }
  return Math.sqrt(best);
}

// retorna [r,g,b,a] no ponto (x,y) para um canvas de tamanho S
function sample(x, y, S, sPath) {
  const m = S * 0.05; // margem
  const r = S * 0.225; // raio dos cantos
  const hw = (S - 2 * m) / 2;
  // anti-aliasing da silhueta do quadrado arredondado
  const dRect = sdRoundRect(x, y, S / 2, S / 2, hw, hw, r);
  const aa = 0.8;
  let coverage = 1 - (dRect + aa) / (2 * aa);
  coverage = coverage < 0 ? 0 : coverage > 1 ? 1 : coverage;
  if (coverage <= 0) return [0, 0, 0, 0];

  // fundo: gradiente verde na diagonal (canto sup. esq. -> inf. dir.)
  const t = ((x - m) / (S - 2 * m) + (y - m) / (S - 2 * m)) / 2;
  const tt = t < 0 ? 0 : t > 1 ? 1 : t;
  let R = Math.round(lerp(80, 36, tt));
  let G = Math.round(lerp(230, 176, tt));
  let B = Math.round(lerp(150, 110, tt));

  // letra "S" em verde escuro, com borda anti-aliased
  const stroke = 0.07 * S; // meia-espessura do traço
  const dS = distToPath(x, y, sPath);
  let inkA = 1 - (dS - stroke + aa) / (2 * aa);
  inkA = inkA < 0 ? 0 : inkA > 1 ? 1 : inkA;
  if (inkA > 0) {
    R = Math.round(lerp(R, 6, inkA));
    G = Math.round(lerp(G, 38, inkA));
    B = Math.round(lerp(B, 27, inkA));
  }
  return [R, G, B, Math.round(255 * coverage)];
}

function render(size) {
  const ss = 4;
  const big = size * ss;
  const sPath = buildSPath(big);
  const buf = Buffer.alloc(size * size * 4);
  for (let ty = 0; ty < size; ty++) {
    for (let tx = 0; tx < size; tx++) {
      let sA = 0,
        sR = 0,
        sG = 0,
        sB = 0;
      for (let oy = 0; oy < ss; oy++) {
        for (let ox = 0; ox < ss; ox++) {
          const [r, g, b, a] = sample(tx * ss + ox + 0.5, ty * ss + oy + 0.5, big, sPath);
          sA += a;
          sR += r * a;
          sG += g * a;
          sB += b * a;
        }
      }
      const n = ss * ss;
      const a = sA / n;
      const idx = (ty * size + tx) * 4;
      buf[idx] = sA > 0 ? Math.round(sR / sA) : 0;
      buf[idx + 1] = sA > 0 ? Math.round(sG / sA) : 0;
      buf[idx + 2] = sA > 0 ? Math.round(sB / sA) : 0;
      buf[idx + 3] = Math.round(a);
    }
  }
  return buf;
}

// ---------- encoder PNG ----------
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}
function encodePNG(rgba, size) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  // raw com filtro 0 por linha
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ---------- encoder ICO (PNG embutido) ----------
function encodeICO(images) {
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2); // tipo ícone
  header.writeUInt16LE(count, 4);
  const entries = [];
  const datas = [];
  let offset = 6 + count * 16;
  for (const img of images) {
    const e = Buffer.alloc(16);
    e[0] = img.size >= 256 ? 0 : img.size; // 0 = 256
    e[1] = img.size >= 256 ? 0 : img.size;
    e[2] = 0;
    e[3] = 0;
    e.writeUInt16LE(1, 4); // planes
    e.writeUInt16LE(32, 6); // bpp
    e.writeUInt32LE(img.png.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += img.png.length;
    entries.push(e);
    datas.push(img.png);
  }
  return Buffer.concat([header, ...entries, ...datas]);
}

// ---------- gerar ----------
const sizes = [16, 24, 32, 48, 64, 128, 256];
const images = sizes.map((size) => ({ size, png: encodePNG(render(size), size) }));

fs.writeFileSync(path.join(OUT, "icon.ico"), encodeICO(images));
fs.writeFileSync(path.join(OUT, "icon.png"), images[images.length - 1].png);

console.log("Gerado:");
console.log("  build/icon.ico  (" + sizes.join(", ") + ")");
console.log("  build/icon.png  (256x256)");
