import type { MovementType, Product } from '../types';

export type StockStatus = 'critical' | 'low' | 'over' | 'ok';

export function getStockStatus(product: Pick<Product, 'currentStock' | 'minimumStock' | 'maximumStock'>): StockStatus {
  if (product.currentStock <= 0) return 'critical';
  if (product.minimumStock > 0 && product.currentStock <= product.minimumStock) return 'low';
  if (product.maximumStock && product.currentStock > product.maximumStock) return 'over';
  return 'ok';
}

export function stockStatusLabel(status: StockStatus): string {
  return status === 'critical' ? 'Zerado'
    : status === 'low' ? 'Comprar'
    : status === 'over' ? 'Excedente'
    : 'Normal';
}

export function stockStatusClass(status: StockStatus): string {
  return `status-${status}`;
}

export function movementTypeLabel(type: MovementType): string {
  return type === 'entrada' ? 'Entrada'
    : type === 'saida' ? 'Saída'
    : type === 'ajuste' ? 'Ajuste'
    : type === 'devolucao' ? 'Devolução'
    : 'Transferência';
}

export function calculateNextStock(current: number, type: MovementType, quantity: number): number {
  if (type === 'entrada' || type === 'devolucao') return current + quantity;
  if (type === 'saida' || type === 'transferencia') return current - quantity;
  return quantity;
}

export function calculateWeightedAverageCost(
  currentStock: number,
  averageCost: number,
  quantity: number,
  unitCost: number,
): number {
  if (quantity <= 0 || unitCost <= 0) return averageCost;
  return (averageCost * currentStock + unitCost * quantity) / (currentStock + quantity || 1);
}
