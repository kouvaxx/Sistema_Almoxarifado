import type { AppConfig, AuditEntry, Category, DatabaseSnapshot, Movement, NfeDocument, NfeItem, Product, Quote, Supplier } from './types';

const DB_NAME = 'almoxarifado_v9';
export const DB_VERSION = 2;
const STORES = ['products', 'suppliers', 'categories', 'movements', 'nfe', 'nfeItems', 'quotes', 'audit', 'config'] as const;

type StoreName = typeof STORES[number];

function createBaseSchema(db: IDBDatabase): void {
  for (const store of STORES) {
    if (!db.objectStoreNames.contains(store)) {
      db.createObjectStore(store, { keyPath: 'id' });
    }
  }
}

function ensureIndex(
  store: IDBObjectStore,
  name: string,
  keyPath: string | string[],
  options: IDBIndexParameters = {},
): void {
  if (!store.indexNames.contains(name)) {
    store.createIndex(name, keyPath, options);
  }
}

function migrateV1ToV2(db: IDBDatabase, transaction: IDBTransaction): void {
  const products = transaction.objectStore('products');
  ensureIndex(products, 'byCode', 'code');
  ensureIndex(products, 'byName', 'name');
  ensureIndex(products, 'byCategoryId', 'categoryId');
  ensureIndex(products, 'bySupplierId', 'supplierId');

  const suppliers = transaction.objectStore('suppliers');
  ensureIndex(suppliers, 'byName', 'name');

  const categories = transaction.objectStore('categories');
  ensureIndex(categories, 'byName', 'name');

  const movements = transaction.objectStore('movements');
  ensureIndex(movements, 'byProductId', 'productId');
  ensureIndex(movements, 'byCreatedAt', 'createdAt');
  ensureIndex(movements, 'byType', 'type');

  const nfe = transaction.objectStore('nfe');
  ensureIndex(nfe, 'byStatus', 'status');
  ensureIndex(nfe, 'byCreatedAt', 'createdAt');

  const nfeItems = transaction.objectStore('nfeItems');
  ensureIndex(nfeItems, 'byNfeId', 'nfeId');
  ensureIndex(nfeItems, 'byMatchedProductId', 'matchedProductId');

  const quotes = transaction.objectStore('quotes');
  ensureIndex(quotes, 'byStatus', 'status');
  ensureIndex(quotes, 'byCreatedAt', 'createdAt');

  // Keep the transaction reference explicit: this function intentionally performs
  // only schema work, while data normalization happens after the DB opens.
  void db;
}

class LocalDB {
  private db?: IDBDatabase;

  async open(): Promise<void> {
    if (this.db) return;

    this.db = await new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);

      req.onerror = () => reject(req.error ?? new Error('Não foi possível abrir o banco local.'));
      req.onblocked = () => reject(new Error('A atualização do banco está bloqueada por outra aba aberta do sistema.'));

      req.onupgradeneeded = () => {
        const db = req.result;
        const transaction = req.transaction;
        if (!transaction) {
          throw new Error('Transação de migração do IndexedDB indisponível.');
        }

        const oldVersion = req.oldVersion;
        createBaseSchema(db);

        if (oldVersion < 2) {
          migrateV1ToV2(db, transaction);
        }
      };

      req.onsuccess = () => {
        const db = req.result;
        db.onversionchange = () => {
          db.close();
          if (this.db === db) this.db = undefined;
        };
        resolve(db);
      };
    });
  }

  private async ready(): Promise<IDBDatabase> {
    await this.open();
    if (!this.db) throw new Error('Banco não inicializado.');
    return this.db;
  }

  async getAll<T>(store: StoreName): Promise<T[]> {
    const db = await this.ready();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readonly');
      const req = tx.objectStore(store).getAll();
      req.onsuccess = () => resolve(req.result as T[]);
      req.onerror = () => reject(req.error);
    });
  }

  async get<T>(store: StoreName, id: string): Promise<T | undefined> {
    const db = await this.ready();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readonly');
      const req = tx.objectStore(store).get(id);
      req.onsuccess = () => resolve(req.result as T | undefined);
      req.onerror = () => reject(req.error);
    });
  }

  async put<T extends { id: string }>(store: StoreName, value: T): Promise<void> {
    const db = await this.ready();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).put(value);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error ?? new Error('Transação abortada.'));
    });
  }

  async bulkPut<T extends { id: string }>(store: StoreName, values: T[]): Promise<void> {
    if (!values.length) return;
    const db = await this.ready();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(store, 'readwrite');
      const os = tx.objectStore(store);
      for (const value of values) os.put(value);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error ?? new Error('Transação abortada.'));
    });
  }

  async delete(store: StoreName, id: string): Promise<void> {
    const db = await this.ready();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error ?? new Error('Transação abortada.'));
    });
  }

  async clear(store: StoreName): Promise<void> {
    const db = await this.ready();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error ?? new Error('Transação abortada.'));
    });
  }
}

export const db = new LocalDB();

export async function loadSnapshot(): Promise<DatabaseSnapshot> {
  const [products, suppliers, categories, movements, nfe, nfeItems, quotes, audit, configs] = await Promise.all([
    db.getAll<Product>('products'),
    db.getAll<Supplier>('suppliers'),
    db.getAll<Category>('categories'),
    db.getAll<Movement>('movements'),
    db.getAll<NfeDocument>('nfe'),
    db.getAll<NfeItem>('nfeItems'),
    db.getAll<Quote>('quotes'),
    db.getAll<AuditEntry>('audit'),
    db.getAll<AppConfig>('config'),
  ]);

  const config = configs[0] ?? defaultConfig();
  if (config.schemaVersion < DB_VERSION) {
    config.schemaVersion = DB_VERSION;
    await db.put('config', config);
  }

  return {
    products,
    suppliers,
    categories,
    movements,
    nfe,
    nfeItems,
    quotes,
    audit,
    config,
  };
}

export async function replaceSnapshot(snapshot: DatabaseSnapshot): Promise<void> {
  const sets: Array<[StoreName, any[]]> = [
    ['products', snapshot.products],
    ['suppliers', snapshot.suppliers],
    ['categories', snapshot.categories],
    ['movements', snapshot.movements],
    ['nfe', snapshot.nfe],
    ['nfeItems', snapshot.nfeItems],
    ['quotes', snapshot.quotes],
    ['audit', snapshot.audit],
    ['config', [{ ...snapshot.config, schemaVersion: DB_VERSION }]],
  ];

  for (const [store, values] of sets) {
    await db.clear(store);
    await db.bulkPut(store, values);
  }
}

export function defaultConfig(): AppConfig {
  return {
    id: 'main',
    theme: 'dark',
    allowNegativeStock: false,
    defaultMinimumStock: 2,
    backupRetention: 20,
    initializedAt: new Date().toISOString(),
    schemaVersion: DB_VERSION,
  };
}
