import type { NfeItem, Product } from '../types';
import type { ParsedNfeItem } from './nfe-parser';

export interface NfeMatchResult {
  product?: Product;
  confidence: number;
  method: 'codigo-exato' | 'codigo-normalizado' | 'nome-exato' | 'nome-aproximado' | 'sem-match';
}

const norm = (value: unknown): string =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\\u0300-\\u036f]/g, '')
    .toLowerCase()
    .trim();

export function normalizedCode(value: unknown): string {
  return String(value ?? '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .replace(/^0+/, '') || '0';
}

export function tokenSimilarity(a: unknown, b: unknown): number {
  const aa = norm(a).split(/\\s+/).filter(x => x.length > 1);
  const bb = norm(b).split(/\\s+/).filter(x => x.length > 1);
  if (!aa.length || !bb.length) return 0;

  const setB = new Set(bb);
  const overlap = aa.filter(x => setB.has(x)).length;
  const base = overlap / Math.max(aa.length, bb.length);

  const ca = norm(a).replace(/\\s/g, '');
  const cb = norm(b).replace(/\\s/g, '');
  const max = Math.max(ca.length, cb.length);
  let same = 0;

  for (let i = 0; i < Math.min(ca.length, cb.length); i += 1) {
    if (ca[i] === cb[i]) same += 1;
  }

  return Math.min(1, base * 0.72 + (max ? same / max : 0) * 0.28);
}

export interface NfeProductMatcher {
  match(item: Pick<ParsedNfeItem, 'code' | 'description'>): NfeMatchResult;
}

export function createNfeProductMatcher(products: Product[]): NfeProductMatcher {
  const productCodeIndex = new Map<string, Product>();
  const productNormalizedCodeIndex = new Map<string, Product[]>();
  const productNameIndex = new Map<string, Product>();

  for (const product of products) {
    productCodeIndex.set(String(product.code).trim(), product);

    const code = normalizedCode(product.code);
    const bucket = productNormalizedCodeIndex.get(code) ?? [];
    bucket.push(product);
    productNormalizedCodeIndex.set(code, bucket);

    productNameIndex.set(norm(product.name), product);
  }

  return {
    match(item) {
      const code = String(item.code ?? '').trim();

      if (code && code !== '—') {
        const exact = productCodeIndex.get(code);
        if (exact) {
          return { product: exact, confidence: 1, method: 'codigo-exato' };
        }

        const normalized = normalizedCode(code);
        const byCode = productNormalizedCodeIndex.get(normalized) ?? [];
        if (normalized !== '0' && byCode.length === 1) {
          return { product: byCode[0], confidence: 0.97, method: 'codigo-normalizado' };
        }
      }

      const exactName = productNameIndex.get(norm(item.description));
      if (exactName) {
        return { product: exactName, confidence: 0.95, method: 'nome-exato' };
      }

      let best: Product | undefined;
      let bestScore = 0;
      let secondScore = 0;

      for (const product of products) {
        const score = tokenSimilarity(item.description, product.name);

        if (score > bestScore) {
          secondScore = bestScore;
          bestScore = score;
          best = product;
        } else if (score > secondScore) {
          secondScore = score;
        }
      }

      if (best && bestScore >= 0.84 && bestScore - secondScore >= 0.08) {
        return {
          product: best,
          confidence: bestScore,
          method: 'nome-aproximado',
        };
      }

      return {
        confidence: bestScore,
        method: 'sem-match',
      };
    },
  };
}

const uid = (prefix = 'id'): string =>
  `${prefix}-${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`}`;

export function applyImportedItems(
  resultItems: ParsedNfeItem[],
  nfeId: string,
  products: Product[],
): NfeItem[] {
  const matcher = createNfeProductMatcher(products);

  return resultItems.map(item => {
    const match = matcher.match(item);
    const extractionConfidence = item.confidence ?? 0.5;
    const matchConfidence = match.product
      ? match.confidence
      : Math.min(0.84, match.confidence);

    let status: NfeItem['status'] = 'new';
    if (match.product && matchConfidence >= 0.84 && extractionConfidence >= 0.62) {
      status = 'update';
    } else if (!match.product && extractionConfidence < 0.62) {
      status = 'review';
    }

    const warnings = [...(item.warnings ?? [])];

    if (!match.product) {
      warnings.push('Produto não localizado no cadastro atual. Será tratado como novo após conferência.');
    }

    if (match.product && matchConfidence < 0.95) {
      warnings.push('Correspondência aproximada; confira o cadastro antes de confirmar.');
    }

    return {
      id: uid('nfei'),
      nfeId,
      code: item.code || '—',
      description: item.description,
      quantity: item.quantity,
      unit: item.unit || 'un',
      unitCost: item.unitCost || 0,
      matchedProductId: match.product?.id,
      confidence: extractionConfidence,
      matchConfidence,
      matchMethod: match.method,
      sourceLine: item.sourceLine,
      warnings,
      status,
    };
  });
}
