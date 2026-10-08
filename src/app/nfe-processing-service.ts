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
  changedProducts: Product[];
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

  const workingSuppliers = [...suppliers];
  const workingProducts = new Map<string, Product>();
  const changedItems = new Map<string, NfeItem>();
  const changedProducts = new Map<string, Product>();
  const createdProducts: Product[] = [];
  const createdSuppliers: Supplier[] = [];
  const movements: Movement[] = [];
  let createdProductCount = 0;
  let updatedProductCount = 0;

  const findProduct = (id: string): Product | undefined =>
    workingProducts.get(id) ?? products.find(product => product.id === id);

  for (const sourceItem of processableItems) {
    let product = sourceItem.matchedProductId
      ? findProduct(sourceItem.matchedProductId)
      : undefined;

    let workingItem = changedItems.get(sourceItem.id);

    if (!workingItem) {
      workingItem = {
        ...sourceItem,
        warnings: sourceItem.warnings ? [...sourceItem.warnings] : undefined,
      };
    }

    if (!product && sourceItem.status === 'new') {
      let supplierId: string | undefined;

      if (nfe.supplierName) {
        let supplier = workingSuppliers.find(candidate =>
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
          workingSuppliers.push(supplier);
          createdSuppliers.push(supplier);
        }

        supplierId = supplier.id;
      }

      const category =
        categories.find(candidate => candidate.name === 'Outros') ||
        categories[0];

      product = {
        id: uid('p'),
        code: sourceItem.code || '—',
        name: sourceItem.description.toUpperCase(),
        supplierId,
        supplierNameLegacy: nfe.supplierName || '',
        categoryId: category?.id || '',
        unit: sourceItem.unit || 'un',
        currentStock: 0,
        minimumStock: config.defaultMinimumStock,
        reservedStock: 0,
        currentCost: sourceItem.unitCost || 0,
        averageCost: sourceItem.unitCost || 0,
        active: true,
        createdAt: now(),
        updatedAt: now(),
        legacySource: 'manual',
      };

      workingProducts.set(product.id, product);
      changedProducts.set(product.id, product);
      createdProducts.push(product);
      workingItem.matchedProductId = product.id;
      changedItems.set(workingItem.id, workingItem);
      createdProductCount++;
    }

    if (!product) {
      continue;
    }

    const amount = Math.max(0, sourceItem.quantity || 0);
    const cost = sourceItem.unitCost || product.currentCost;

    if (amount > 0) {
      const updatedProduct: Product = {
        ...product,
        averageCost: calculateWeightedAverageCost(
          product.currentStock,
          product.averageCost,
          amount,
          cost,
        ),
        currentCost: cost,
        currentStock: product.currentStock + amount,
        lastPurchaseAt: nfe.issueDate || now(),
        updatedAt: now(),
      };

      workingProducts.set(updatedProduct.id, updatedProduct);
      changedProducts.set(updatedProduct.id, updatedProduct);

      const movement: Movement = {
        id: uid('mov'),
        productId: updatedProduct.id,
        productCode: updatedProduct.code,
        productName: updatedProduct.name,
        type: 'entrada',
        quantity: amount,
        unitCost: cost,
        document: nfe.number || nfe.key || nfe.sourceName,
        note: `Importação inteligente · ${nfe.readerProfile || 'documento'} · ${sourceItem.matchMethod || 'sem-match'}`,
        createdAt: now(),
      };

      movements.push(movement);
      workingItem.status = 'update';
      changedItems.set(workingItem.id, workingItem);
      updatedProductCount++;
    }
  }

  const processedNfe: NfeDocument = {
    ...nfe,
    status: 'processed',
    note: `Processado: ${updatedProductCount} movimentos · ${createdProductCount} novos produtos.`,
  };

  const updatedItems = [...changedItems.values()];
  const changedProductList = [...changedProducts.values()];

  await repository.saveNfeProcessing({
    nfe: processedNfe,
    suppliers: createdSuppliers,
    products: changedProductList,
    movements,
    nfeItems: updatedItems,
  });

  return {
    nfe: processedNfe,
    updatedItems,
    changedProducts: changedProductList,
    createdProducts,
    createdSuppliers,
    movements,
    updatedProductCount,
    createdProductCount,
  };
}
