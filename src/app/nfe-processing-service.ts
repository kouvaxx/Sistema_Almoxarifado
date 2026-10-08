import { repository } from './repository';
import { calculateWeightedAverageCost } from '../domain/stock';
import type {
  AppConfig,
  Category,
  Movement,
  NfeDocument,
  NfeItem,
  Product,
  Supplier,
} from '../types';

const uid = (prefix = 'id'): string =>
  `${prefix}-${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`}`;

const now = () => new Date().toISOString();

const norm = (value: unknown): string =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export interface ProcessNfeInput {
  nfe: NfeDocument;
  items: NfeItem[];
  products: Product[];
  suppliers: Supplier[];
  categories: Category[];
  config: AppConfig;
}

export interface ProcessNfeResult {
  nfe: NfeDocument;
  updatedItems: NfeItem[];
  createdProducts: Product[];
  createdSuppliers: Supplier[];
  movements: Movement[];
  updatedProductCount: number;
  createdProductCount: number;
}

export interface ProcessNfeError {
  message: string;
}

export async function processNfeDocument(
  input: ProcessNfeInput,
): Promise<ProcessNfeResult | ProcessNfeError> {
  const { nfe, items, products, suppliers, categories, config } = input;

  if (nfe.status === 'processed') {
    return { message: 'Este documento já foi processado.' };
  }

  if (nfe.status === 'cancelled') {
    return { message: 'Reabra a revisão antes de processar.' };
  }

  const processableItems = items.filter(item => item.status !== 'skip');
  const pending = processableItems.filter(item => item.status === 'review');

  if (pending.length) {
    return {
      message: `Ainda há ${pending.length} item(ns) para revisar. Aceite ou ignore os itens sinalizados.`,
    };
  }

  if (!processableItems.length) {
    return { message: 'Nenhum item selecionado para entrada.' };
  }

  const createdProducts: Product[] = [];
  const createdSuppliers: Supplier[] = [];
  const movements: Movement[] = [];
  const updatedItems: NfeItem[] = [];
  let createdProductCount = 0;
  let updatedProductCount = 0;

  for (const item of processableItems) {
    let product = item.matchedProductId
      ? products.find(candidate => candidate.id === item.matchedProductId)
      : undefined;

    if (!product && item.status === 'new') {
      let supplierId: string | undefined;

      if (nfe.supplierName) {
        let supplier = suppliers.find(candidate =>
          norm(candidate.name) === norm(nfe.supplierName),
        );

        if (!supplier) {
          supplier = {
            id: uid('sup'),
            name: nfe.supplierName,
            active: true,
            createdAt: now(),
            updatedAt: now(),
          };
          createdSuppliers.push(supplier);
          suppliers.push(supplier);
          await repository.saveSupplier(supplier);
        }

        supplierId = supplier.id;
      }

      const category =
        categories.find(candidate => candidate.name === 'Outros') ||
        categories[0];

      product = {
        id: uid('p'),
        code: item.code || '—',
        name: item.description.toUpperCase(),
        supplierId,
        supplierNameLegacy: nfe.supplierName || '',
        categoryId: category?.id || '',
        unit: item.unit || 'un',
        currentStock: 0,
        minimumStock: config.defaultMinimumStock,
        reservedStock: 0,
        currentCost: item.unitCost || 0,
        averageCost: item.unitCost || 0,
        active: true,
        createdAt: now(),
        updatedAt: now(),
        legacySource: 'manual',
      };

      createdProducts.push(product);
      products.unshift(product);
      item.matchedProductId = product.id;
      await repository.saveProduct(product);
      createdProductCount++;
    }

    if (!product) {
      continue;
    }

    const amount = Math.max(0, item.quantity || 0);
    const cost = item.unitCost || product.currentCost;
    const current = product.currentStock;

    if (amount > 0) {
      product.averageCost = calculateWeightedAverageCost(
        current,
        product.averageCost,
        amount,
        cost,
      );
      product.currentCost = cost;
      product.currentStock = current + amount;
      product.lastPurchaseAt = nfe.issueDate || now();
      product.updatedAt = now();

      await repository.saveProduct(product);

      const movement: Movement = {
        id: uid('mov'),
        productId: product.id,
        productCode: product.code,
        productName: product.name,
        type: 'entrada',
        quantity: amount,
        unitCost: cost,
        document: nfe.number || nfe.key || nfe.sourceName,
        note: `Importação inteligente · ${nfe.readerProfile || 'documento'} · ${item.matchMethod || 'sem-match'}`,
        createdAt: now(),
      };

      movements.push(movement);
      await repository.saveMovement(movement);

      item.status = 'update';
      updatedItems.push(item);
      await repository.saveNfeItem(item);
      updatedProductCount++;
    }
  }

  nfe.status = 'processed';
  nfe.note = `Processado: ${updatedProductCount} movimentos · ${createdProductCount} novos produtos.`;
  await repository.saveNfe(nfe);

  return {
    nfe,
    updatedItems,
    createdProducts,
    createdSuppliers,
    movements,
    updatedProductCount,
    createdProductCount,
  };
}
