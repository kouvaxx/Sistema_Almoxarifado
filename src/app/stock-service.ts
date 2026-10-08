import { repository } from './repository';
import { calculateWeightedAverageCost } from '../domain/stock';
import { validateStockMovement } from '../domain/validation';
import type { AppConfig, Movement, MovementType, Product } from '../types';

const uid = (prefix = 'id'): string =>
  `${prefix}-${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`}`;

const now = () => new Date().toISOString();

export interface RegisterMovementInput {
  product: Product;
  type: MovementType;
  quantity: number;
  unitCost: number;
  document?: string;
  responsible?: string;
  workOrder?: string;
  vehicle?: string;
  note?: string;
  config: AppConfig;
}

export interface RegisterMovementResult {
  movement: Movement;
  nextStock: number;
}

export interface RegisterMovementError {
  message: string;
}

export async function registerStockMovement(
  input: RegisterMovementInput,
): Promise<RegisterMovementResult | RegisterMovementError> {
  const { product, type, quantity, config } = input;
  const current = product.currentStock;

  const validation = validateStockMovement({
    currentStock: current,
    type,
    quantity,
    allowNegativeStock: config.allowNegativeStock,
  });

  if (!validation.ok) {
    return {
      message: 'message' in validation ? validation.message : 'Movimentação inválida.',
    };
  }

  const nextStock = validation.nextStock;
  const cost = Math.max(0, input.unitCost || product.currentCost);

  if (type === 'entrada' && quantity > 0 && cost > 0) {
    product.averageCost = calculateWeightedAverageCost(
      current,
      product.averageCost,
      quantity,
      cost,
    );
    product.currentCost = cost;
    product.lastPurchaseAt = now();
  }

  product.currentStock = nextStock;
  product.updatedAt = now();

  const movement: Movement = {
    id: uid('mov'),
    productId: product.id,
    productCode: product.code,
    productName: product.name,
    type,
    quantity,
    unitCost: cost,
    document: input.document,
    responsible: input.responsible,
    workOrder: input.workOrder,
    vehicle: input.vehicle,
    note: input.note,
    createdAt: now(),
  };

  await repository.saveMovement(movement);
  await repository.saveProduct(product);

  return { movement, nextStock };
}
