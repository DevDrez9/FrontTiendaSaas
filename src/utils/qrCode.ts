/**
 * Generador nativo de códigos QR (ISO/IEC 18004) en TypeScript puro (sin dependencias externas).
 * Soporta Modo Byte (UTF-8), Nivel de Corrección de Errores M (15%), Versiones 1 a 10.
 */

interface VersionSpec {
  version: number;
  totalDataCodewords: number;
  ecCodewordsPerBlock: number;
  groups: { blocks: number; dataCodewords: number }[];
  alignmentPatterns: number[];
}

// Especificación oficial ISO/IEC 18004 para Nivel M (Error Correction Level M = 00)
const VERSION_SPECS_M: VersionSpec[] = [
  { version: 1, totalDataCodewords: 16, ecCodewordsPerBlock: 10, groups: [{ blocks: 1, dataCodewords: 16 }], alignmentPatterns: [] },
  { version: 2, totalDataCodewords: 28, ecCodewordsPerBlock: 16, groups: [{ blocks: 1, dataCodewords: 28 }], alignmentPatterns: [6, 18] },
  { version: 3, totalDataCodewords: 44, ecCodewordsPerBlock: 26, groups: [{ blocks: 1, dataCodewords: 44 }], alignmentPatterns: [6, 22] },
  { version: 4, totalDataCodewords: 64, ecCodewordsPerBlock: 18, groups: [{ blocks: 2, dataCodewords: 32 }], alignmentPatterns: [6, 26] },
  { version: 5, totalDataCodewords: 86, ecCodewordsPerBlock: 24, groups: [{ blocks: 2, dataCodewords: 43 }], alignmentPatterns: [6, 30] },
  { version: 6, totalDataCodewords: 108, ecCodewordsPerBlock: 16, groups: [{ blocks: 4, dataCodewords: 27 }], alignmentPatterns: [6, 34] },
  { version: 7, totalDataCodewords: 124, ecCodewordsPerBlock: 18, groups: [{ blocks: 4, dataCodewords: 31 }], alignmentPatterns: [6, 22, 38] },
  { version: 8, totalDataCodewords: 154, ecCodewordsPerBlock: 22, groups: [{ blocks: 2, dataCodewords: 38 }, { blocks: 2, dataCodewords: 39 }], alignmentPatterns: [6, 24, 42] },
  { version: 9, totalDataCodewords: 182, ecCodewordsPerBlock: 22, groups: [{ blocks: 3, dataCodewords: 36 }, { blocks: 2, dataCodewords: 37 }], alignmentPatterns: [6, 26, 46] },
  { version: 10, totalDataCodewords: 216, ecCodewordsPerBlock: 26, groups: [{ blocks: 4, dataCodewords: 43 }, { blocks: 1, dataCodewords: 44 }], alignmentPatterns: [6, 28, 50] },
];

// Tablas de Campo de Galois GF(256) con polinomio primitivo 0x11D
const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) {
    GF_EXP[i] = GF_EXP[i - 255];
  }
})();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return GF_EXP[GF_LOG[a] + GF_LOG[b]];
}

function rsGeneratorPoly(degree: number): Uint8Array {
  let poly = new Uint8Array([1]);
  for (let i = 0; i < degree; i++) {
    const next = new Uint8Array(poly.length + 1);
    const root = GF_EXP[i];
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j];
      next[j + 1] ^= gfMul(poly[j], root);
    }
    poly = next;
  }
  return poly;
}

function rsEncode(data: Uint8Array, ecLen: number): Uint8Array {
  const gen = rsGeneratorPoly(ecLen);
  const rem = new Uint8Array(ecLen);
  for (let i = 0; i < data.length; i++) {
    const factor = data[i] ^ rem[0];
    rem.copyWithin(0, 1);
    rem[ecLen - 1] = 0;
    if (factor !== 0) {
      for (let j = 0; j < ecLen; j++) {
        rem[j] ^= gfMul(gen[j + 1], factor);
      }
    }
  }
  return rem;
}

function computeFormatBits(ecIndicator: number, maskPattern: number): number {
  const data = (ecIndicator << 3) | maskPattern;
  let rem = data << 10;
  const gen = 0b10100110111; // x^10 + x^8 + x^5 + x^4 + x^2 + x + 1
  for (let i = 14; i >= 10; i--) {
    if ((rem >> i) & 1) {
      rem ^= gen << (i - 10);
    }
  }
  return ((data << 10) | rem) ^ 0b101010000010010;
}

function computeVersionBits(version: number): number {
  let rem = version << 12;
  const gen = 0b1111100100101;
  for (let i = 17; i >= 12; i--) {
    if ((rem >> i) & 1) {
      rem ^= gen << (i - 12);
    }
  }
  return (version << 12) | rem;
}

export function generateQrMatrix(text: string): boolean[][] {
  const utf8Bytes = new TextEncoder().encode(text);

  // Seleccionar la versión más pequeña donde quepan los bytes
  // En modo Byte: 4 bits de modo + (8 o 16 bits de longitud) + 8*N bits de datos
  let spec: VersionSpec | undefined;
  for (const candidate of VERSION_SPECS_M) {
    const countBits = candidate.version <= 9 ? 8 : 16;
    const maxDataBits = candidate.totalDataCodewords * 8;
    const neededBits = 4 + countBits + utf8Bytes.length * 8;
    if (neededBits <= maxDataBits) {
      spec = candidate;
      break;
    }
  }

  if (!spec) {
    throw new Error('El texto es demasiado largo para generar el QR.');
  }

  // Construir flujo de bits de datos
  const bits: number[] = [];
  const pushBits = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) {
      bits.push((val >> i) & 1);
    }
  };

  // Indicador de modo Byte = 0100
  pushBits(0b0100, 4);
  pushBits(utf8Bytes.length, spec.version <= 9 ? 8 : 16);
  for (const b of utf8Bytes) {
    pushBits(b, 8);
  }

  const totalDataBits = spec.totalDataCodewords * 8;
  // Terminador de hasta 4 ceros
  const terminatorLen = Math.min(4, totalDataBits - bits.length);
  pushBits(0, terminatorLen);

  // Alinear a múltiplo de 8
  while (bits.length % 8 !== 0) {
    bits.push(0);
  }

  // Bytes de relleno alternados 0xEC, 0x11
  const padBytes = [0xec, 0x11];
  let padIdx = 0;
  while (bits.length < totalDataBits) {
    pushBits(padBytes[padIdx % 2], 8);
    padIdx++;
  }

  const dataCodewords = new Uint8Array(spec.totalDataCodewords);
  for (let i = 0; i < spec.totalDataCodewords; i++) {
    let byte = 0;
    for (let b = 0; b < 8; b++) {
      byte = (byte << 1) | bits[i * 8 + b];
    }
    dataCodewords[i] = byte;
  }

  // Dividir en bloques y calcular Reed-Solomon por bloque
  const dataBlocks: Uint8Array[] = [];
  const ecBlocks: Uint8Array[] = [];
  let offset = 0;
  for (const g of spec.groups) {
    for (let b = 0; b < g.blocks; b++) {
      const block = dataCodewords.slice(offset, offset + g.dataCodewords);
      offset += g.dataCodewords;
      dataBlocks.push(block);
      ecBlocks.push(rsEncode(block, spec.ecCodewordsPerBlock));
    }
  }

  // Intercalar bloques de datos y bloques EC
  const finalCodewords: number[] = [];
  const maxDataBlockLen = Math.max(...dataBlocks.map((b) => b.length));
  for (let i = 0; i < maxDataBlockLen; i++) {
    for (const block of dataBlocks) {
      if (i < block.length) finalCodewords.push(block[i]);
    }
  }
  for (let i = 0; i < spec.ecCodewordsPerBlock; i++) {
    for (const block of ecBlocks) {
      finalCodewords.push(block[i]);
    }
  }

  const size = spec.version * 4 + 17;
  const modules: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
  const isFunction: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  const setFunctionModule = (r: number, c: number, dark: boolean) => {
    if (r >= 0 && r < size && c >= 0 && c < size) {
      modules[r][c] = dark;
      isFunction[r][c] = true;
    }
  };

  // Patrones de búsqueda (Finder patterns 7x7 + separadores)
  const drawFinderPattern = (row: number, col: number) => {
    for (let dr = -1; dr <= 7; dr++) {
      for (let dc = -1; dc <= 7; dc++) {
        const r = row + dr;
        const c = col + dc;
        if (r < 0 || r >= size || c < 0 || c >= size) continue;
        const inOuter = dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6;
        const onBorder = dr === 0 || dr === 6 || dc === 0 || dc === 6;
        const inInner = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
        setFunctionModule(r, c, inOuter && (onBorder || inInner));
      }
    }
  };

  drawFinderPattern(0, 0);
  drawFinderPattern(0, size - 7);
  drawFinderPattern(size - 7, 0);

  // Patrones de sincronización (Timing patterns)
  for (let i = 8; i < size - 8; i++) {
    setFunctionModule(6, i, i % 2 === 0);
    setFunctionModule(i, 6, i % 2 === 0);
  }

  // Patrones de alineación (Alignment patterns 5x5)
  const alignCoords = spec.alignmentPatterns;
  for (let i = 0; i < alignCoords.length; i++) {
    for (let j = 0; j < alignCoords.length; j++) {
      // Omitir si coincide con los 3 finder patterns
      if (
        (i === 0 && j === 0) ||
        (i === 0 && j === alignCoords.length - 1) ||
        (i === alignCoords.length - 1 && j === 0)
      ) {
        continue;
      }
      const centerR = alignCoords[i];
      const centerC = alignCoords[j];
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          const dark = Math.max(Math.abs(dr), Math.abs(dc)) !== 1;
          setFunctionModule(centerR + dr, centerC + dc, dark);
        }
      }
    }
  }

  // Módulo oscuro fijo
  setFunctionModule(size - 8, 8, true);

  // Reservar áreas de formato
  for (let i = 0; i <= 8; i++) {
    if (!isFunction[8][i]) setFunctionModule(8, i, false);
    if (!isFunction[i][8]) setFunctionModule(i, 8, false);
  }
  for (let i = 0; i < 8; i++) {
    if (!isFunction[8][size - 1 - i]) setFunctionModule(8, size - 1 - i, false);
    if (!isFunction[size - 1 - i][8]) setFunctionModule(size - 1 - i, 8, false);
  }

  // Información de versión (para versión >= 7)
  if (spec.version >= 7) {
    const vBits = computeVersionBits(spec.version);
    for (let i = 0; i < 18; i++) {
      const bit = ((vBits >> i) & 1) === 1;
      const a = size - 11 + (i % 3);
      const b = Math.floor(i / 3);
      setFunctionModule(b, a, bit);
      setFunctionModule(a, b, bit);
    }
  }

  // Colocar bits de datos en zigzag de derecha a izquierda
  let bitIdx = 0;
  const totalBits = finalCodewords.length * 8;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5; // Saltar columna de sincronización vertical
    const upward = ((right + 1) & 2) === 0;
    for (let v = 0; v < size; v++) {
      const row = upward ? size - 1 - v : v;
      for (let j = 0; j < 2; j++) {
        const col = right - j;
        if (!isFunction[row][col]) {
          let dark = false;
          if (bitIdx < totalBits) {
            const cw = finalCodewords[bitIdx >> 3];
            dark = ((cw >> (7 - (bitIdx & 7))) & 1) === 1;
            bitIdx++;
          }
          modules[row][col] = dark;
        }
      }
    }
  }

  // Aplicar máscara 0 (row + col) % 2 === 0 y escribir bits de formato
  const maskPattern = 0;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!isFunction[r][c] && (r + c) % 2 === 0) {
        modules[r][c] = !modules[r][c];
      }
    }
  }

  // Escribir los 15 bits de formato (EC Level M = 00)
  const formatBits = computeFormatBits(0b00, maskPattern);
  for (let i = 0; i <= 5; i++) modules[8][i] = ((formatBits >> i) & 1) === 1;
  modules[8][7] = ((formatBits >> 6) & 1) === 1;
  modules[8][8] = ((formatBits >> 7) & 1) === 1;
  modules[7][8] = ((formatBits >> 8) & 1) === 1;
  for (let i = 9; i < 15; i++) modules[14 - i][8] = ((formatBits >> i) & 1) === 1;

  for (let i = 0; i < 8; i++) modules[8][size - 1 - i] = ((formatBits >> i) & 1) === 1;
  for (let i = 8; i < 15; i++) modules[size - 15 + i][8] = ((formatBits >> i) & 1) === 1;

  return modules;
}

export interface QrPosterOptions {
  url: string;
  storeName: string;
  domain: string;
  accentColor?: string;
  includeFrame?: boolean;
}

/**
 * Dibuja el QR (solo o con tarjeta de presentación de la tienda) en un HTMLCanvasElement.
 */
export function renderStoreQrToCanvas(
  canvas: HTMLCanvasElement,
  options: QrPosterOptions
): void {
  const { url, storeName, domain, accentColor = '#2563eb', includeFrame = true } = options;
  const matrix = generateQrMatrix(url);
  const count = matrix.length;
  const quietZone = 4;
  const totalModules = count + quietZone * 2;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (!includeFrame) {
    const scale = 12;
    const pxSize = totalModules * scale;
    canvas.width = pxSize;
    canvas.height = pxSize;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, pxSize, pxSize);

    ctx.fillStyle = '#0f172a';
    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        if (matrix[r][c]) {
          ctx.fillRect((c + quietZone) * scale, (r + quietZone) * scale, scale, scale);
        }
      }
    }
    return;
  }

  // Tarjeta lista para imprimir o compartir por redes/WhatsApp
  const width = 640;
  const height = 820;
  canvas.width = width;
  canvas.height = height;

  // Fondo con color de marca suave
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, width, height);

  // Franja superior con color de la tienda
  ctx.fillStyle = accentColor;
  ctx.fillRect(0, 0, width, 210);

  // Tarjeta central blanca con bordes redondeados
  const cardX = 50;
  const cardY = 60;
  const cardW = width - 100;
  const cardH = height - 120;
  const radius = 28;

  ctx.save();
  ctx.shadowColor = 'rgba(15, 23, 42, 0.14)';
  ctx.shadowBlur = 32;
  ctx.shadowOffsetY = 12;
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, cardX, cardY, cardW, cardH, radius);
  ctx.fill();
  ctx.restore();

  // Encabezado dentro de la tarjeta
  ctx.fillStyle = '#64748b';
  ctx.font = '600 18px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('VISITA NUESTRO CATÁLOGO EN LÍNEA', width / 2, cardY + 60);

  ctx.fillStyle = '#0f172a';
  ctx.font = '800 36px Inter, system-ui, sans-serif';
  const truncatedName =
    storeName.length > 24 ? storeName.slice(0, 22) + '…' : storeName;
  ctx.fillText(truncatedName, width / 2, cardY + 112);

  // Marco del QR
  const qrBoxSize = 400;
  const qrBoxX = (width - qrBoxSize) / 2;
  const qrBoxY = cardY + 150;

  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  roundRect(ctx, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 20);
  ctx.stroke();

  const modulePx = qrBoxSize / totalModules;
  ctx.fillStyle = '#0f172a';
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (matrix[r][c]) {
        const x = qrBoxX + (c + quietZone) * modulePx;
        const y = qrBoxY + (r + quietZone) * modulePx;
        ctx.fillRect(Math.floor(x), Math.floor(y), Math.ceil(modulePx), Math.ceil(modulePx));
      }
    }
  }

  // Pie de la tarjeta con la URL y llamado a la acción
  ctx.fillStyle = accentColor;
  roundRect(ctx, cardX + 45, qrBoxY + qrBoxSize + 30, cardW - 90, 54, 27);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 20px Inter, system-ui, sans-serif';
  ctx.fillText('Escanea el código QR con tu cámara', width / 2, qrBoxY + qrBoxSize + 64);

  ctx.fillStyle = '#475569';
  ctx.font = '600 18px Inter, system-ui, sans-serif';
  ctx.fillText(`/${domain}`, width / 2, qrBoxY + qrBoxSize + 112);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
