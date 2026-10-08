import { z } from 'zod';
import type { MovementType } from '../types';
import { calculateNextStock } from './stock';

const nonNegativeNumber = z.number().finite().nonnegative();

export const importedProductSchema = z.object({
  code: z.string().trim().min(1),
  name: z.string().trim().min(1),
  unit: z.string().trim().min(1),
  categoryName: z.string().trim().min(1),
  supplierName: z.string().trim().optional(),
  currentStock: nonNegativeNumber,
  minimumStock: nonNegativeNumber,
  currentCost: nonNegativeNumber,
  averageCost: nonNegativeNumber,
});

export type ImportedProduct = z.infer<typeof importedProductSchema>;

function text(value: unknown, fallback: string): string {
  const normalized = String(value ?? '').trim();
  return normalized || fallback;
}

function numberValue(value: unknown, fallback = 0): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : fallback;
  const normalized = String(value ?? '').trim().replace(/\./g, '').replace(',', '.');
  if (!normalized) return fallback;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function normalizeImportedProduct(raw: unknown, row: number): ImportedProduct {
  if (!raw || typeof raw !== 'object') {
    throw new Error(`Linha ${row}: registro inválido.`);
  }

  const source = raw as Record<string, unknown>;
  const candidate = {
    code: text(source.code ?? source.codigo ?? source.sku ?? source.id, '—'),
    name: text(source.name ?? source.nome ?? source.descricao, ''),
    unit: text(source.unit ?? source.unidade ?? source.un, 'un'),
    categoryName: text(source.categoryName ?? source.categoria, 'Outros'),
    supplierName: text(source.supplierName ?? source.supplier ?? source.fornecedor, '') || undefined,
    currentStock: Math.max(0, numberValue(source.currentStock ?? source.estoqueAtual ?? source.quantidade)),
    minimumStock: Math.max(0, numberValue(source.minimumStock ?? source.minimo)),
    currentCost: Math.max(0, numberValue(source.currentCost ?? source.preco ?? source.custo)),
    averageCost: Math.max(0, numberValue(source.averageCost ?? source.preco ?? source.custo)),
  };

  const parsed = importedProductSchema.safeParse(candidate);
  if (!parsed.success) {
    const message = parsed.error.issues.map(issue => issue.message).join('; ');
    throw new Error(`Linha ${row}: ${message}`);
  }

  return parsed.data;
}

export function validateImportedProducts(rawProducts: unknown[]): {
  ok: true;
  products: ImportedProduct[];
} | {
  ok: false;
  errors: string[];
} {
  const products: ImportedProduct[] = [];
  const errors: string[] = [];

  rawProducts.forEach((raw, index) => {
    try {
      products.push(normalizeImportedProduct(raw, index + 1));
    } catch (error) {
      errors.push(error instanceof Error ? error.message : `Linha ${index + 1}: registro inválido.`);
    }
  });

  return errors.length ? { ok: false, errors } : { ok: true, products };
}

export const stockMovementSchema = z.object({
  currentStock: z.number().finite(),
  type: z.enum(['entrada', 'saida', 'ajuste', 'devolucao', 'transferencia']),
  quantity: z.number().finite().positive(),
  allowNegativeStock: z.boolean(),
});

export function validateStockMovement(input: {
  currentStock: number;
  type: MovementType;
  quantity: number;
  allowNegativeStock: boolean;
}): {
  ok: true;
  nextStock: number;
} | {
  ok: false;
  message: string;
} {
  const parsed = stockMovementSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: 'Dados da movimentação inválidos.' };
  }

  const nextStock = calculateNextStock(parsed.data.currentStock, parsed.data.type, parsed.data.quantity);
  if (!Number.isFinite(nextStock)) {
    return { ok: false, message: 'O saldo calculado é inválido.' };
  }

  if (nextStock < 0 && !parsed.data.allowNegativeStock) {
    return {
      ok: false,
      message: `Estoque insuficiente. Disponível: ${parsed.data.currentStock}.`,
    };
  }

  return { ok: true, nextStock };
}

export function validateInventoryCount(value: number): boolean {
  return Number.isFinite(value) && value >= 0;
}
