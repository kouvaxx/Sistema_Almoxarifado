import { db, defaultConfig, loadSnapshot } from '../db';
import type {
  AppConfig,
  AuditEntry,
  Category,
  Movement,
  NfeDocument,
  NfeItem,
  Product,
  ProductMedia,
  Quote,
  Supplier,
  NfeFile,
} from '../types';

export const repository = {
  loadSnapshot(): Promise<import('../types').DatabaseSnapshot> {
    return loadSnapshot();
  },

  createDefaultConfig(): AppConfig {
    return defaultConfig();
  },

  getProducts(): Promise<Product[]> {
    return db.getAll<Product>('products');
  },

  saveProducts(values: Product[]): Promise<void> {
    return db.bulkPut('products', values);
  },

  saveSuppliers(values: Supplier[]): Promise<void> {
    return db.bulkPut('suppliers', values);
  },

  saveCategories(values: Category[]): Promise<void> {
    return db.bulkPut('categories', values);
  },

  saveAudit(value: AuditEntry): Promise<void> {
    return db.put('audit', value);
  },

  saveProduct(value: Product): Promise<void> {
    return db.put('products', value);
  },

  saveProductMedia(value: ProductMedia): Promise<void> {
    return db.put('productMedia', value);
  },

  saveSupplier(value: Supplier): Promise<void> {
    return db.put('suppliers', value);
  },

  saveCategory(value: Category): Promise<void> {
    return db.put('categories', value);
  },

  saveMovements(values: Movement[]): Promise<void> {
    return db.bulkPut('movements', values);
  },

  saveMovement(value: Movement): Promise<void> {
    return db.put('movements', value);
  },

  saveQuotes(values: Quote[]): Promise<void> {
    return db.bulkPut('quotes', values);
  },

  saveQuote(value: Quote): Promise<void> {
    return db.put('quotes', value);
  },

  saveNfes(values: NfeDocument[]): Promise<void> {
    return db.bulkPut('nfe', values);
  },

  saveNfe(value: NfeDocument): Promise<void> {
    return db.put('nfe', value);
  },

  saveNfeItem(value: NfeItem): Promise<void> {
    return db.put('nfeItems', value);
  },

  saveNfeFile(value: NfeFile): Promise<void> {
    return db.put('nfeFiles', value);
  },

  saveNfeItems(values: NfeItem[]): Promise<void> {
    return db.bulkPut('nfeItems', values);
  },

  async saveNfeProcessing(input: {
    nfe: NfeDocument;
    suppliers: Supplier[];
    products: Product[];
    movements: Movement[];
    nfeItems: NfeItem[];
  }): Promise<void> {
    await db.runTransaction(
      ['suppliers', 'products', 'movements', 'nfeItems', 'nfe'],
      tx => {
        const suppliers = tx.objectStore('suppliers');
        const products = tx.objectStore('products');
        const movements = tx.objectStore('movements');
        const nfeItems = tx.objectStore('nfeItems');
        const nfe = tx.objectStore('nfe');

        for (const value of input.suppliers) suppliers.put(value);
        for (const value of input.products) products.put(value);
        for (const value of input.movements) movements.put(value);
        for (const value of input.nfeItems) nfeItems.put(value);
        nfe.put(input.nfe);
      },
    );
  },

  saveConfig(value: AppConfig): Promise<void> {
    return db.put('config', value);
  },

  deleteNfeItem(id: string): Promise<void> {
    return db.delete('nfeItems', id);
  },

  deleteNfeFile(id: string): Promise<void> {
    return db.delete('nfeFiles', id);
  },

  deleteNfe(id: string): Promise<void> {
    return db.delete('nfe', id);
  },
};
