import type { Product } from '../types';

export interface PhotoMatch {
  product: Product;
  distance: number;
}

export interface PhotoSearchResult {
  barcode?: string;
  hash?: string;
  matches: PhotoMatch[];
}

export async function imageDHash(blob: Blob): Promise<string> {
  const w = 9;
  const h = 8;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) throw new Error('Canvas não disponível');

  const url = URL.createObjectURL(blob);

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('Imagem inválida.'));
      el.src = url;
    });

    ctx.drawImage(img, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h).data;
    let bits = '';

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < 8; x++) {
        const i = (y * w + x) * 4;
        const j = (y * w + x + 1) * 4;
        const a = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        const b = 0.299 * data[j] + 0.587 * data[j + 1] + 0.114 * data[j + 2];
        bits += a > b ? '1' : '0';
      }
    }

    let hex = '';
    for (let i = 0; i < 64; i += 4) {
      hex += parseInt(bits.slice(i, i + 4), 2).toString(16);
    }

    return hex;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function hammingHex(a: string | undefined, b: string | undefined): number {
  if (!a || !b) return 99;

  let distance = 0;

  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    let bits = parseInt(a[i], 16) ^ parseInt(b[i], 16);

    while (bits) {
      distance += bits & 1;
      bits >>= 1;
    }
  }

  return distance + Math.abs(a.length - b.length) * 4;
}

export async function detectBarcodeFromImage(blob: Blob): Promise<string | undefined> {
  try {
    const Detector = globalThis.BarcodeDetector;

    if (!Detector) return;

    const detector = new Detector({
      formats: [
        'ean_13',
        'ean_8',
        'upc_a',
        'upc_e',
        'code_128',
        'code_39',
        'qr_code',
        'data_matrix',
      ],
    });

    const bitmap = await createImageBitmap(blob);

    try {
      const codes = await detector.detect(bitmap);
      return codes?.[0]?.rawValue ? String(codes[0].rawValue) : undefined;
    } finally {
      bitmap.close?.();
    }
  } catch {
    return undefined;
  }
}

export function normalizedPhotoCode(value: unknown): string {
  return String(value ?? '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .replace(/^0+/, '') || '0';
}

export async function searchPhoto(
  file: File,
  products: Product[],
): Promise<PhotoSearchResult> {
  const barcode = await detectBarcodeFromImage(file);

  let hash: string | undefined;

  try {
    hash = await imageDHash(file);
  } catch {
    hash = undefined;
  }

  const matches = hash
    ? products
        .filter(product => product.active && product.photoHash)
        .map(product => ({
          product,
          distance: hammingHex(hash, product.photoHash),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 6)
    : [];

  return { barcode, hash, matches };
}
