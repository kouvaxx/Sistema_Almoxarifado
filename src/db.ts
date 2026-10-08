import type { AppConfig, AuditEntry, Category, DatabaseSnapshot, Movement, NfeDocument, NfeItem, Product, Quote, Supplier } from './types';

const DB_NAME = 'almoxarifado_v9';
const DB_VERSION = 1;
const STORES = ['products','suppliers','categories','movements','nfe','nfeItems','quotes','audit','config'] as const;

type StoreName = typeof STORES[number];

class LocalDB {
  private db?: IDBDatabase;

  async open(): Promise<void> {
    if (this.db) return;
    this.db = await new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onerror = () => reject(req.error ?? new Error('Não foi possível abrir o banco local.'));
      req.onupgradeneeded = () => {
        const db = req.result;
        for (const store of STORES) {
          if (!db.objectStoreNames.contains(store)) {
            db.createObjectStore(store, { keyPath: 'id' });
          }
        }
      };
      req.onsuccess = () => resolve(req.result);
    });
  }

  private async ready() { await this.open(); if (!this.db) throw new Error('Banco não inicializado.'); return this.db; }

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

  async put<T extends {id:string}>(store: StoreName, value: T): Promise<void> {
    const db = await this.ready();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).put(value);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error ?? new Error('Transação abortada.'));
    });
  }

  async bulkPut<T extends {id:string}>(store: StoreName, values: T[]): Promise<void> {
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
  const [products,suppliers,categories,movements,nfe,nfeItems,quotes,audit,configs] = await Promise.all([
    db.getAll<Product>('products'), db.getAll<Supplier>('suppliers'), db.getAll<Category>('categories'),
    db.getAll<Movement>('movements'), db.getAll<NfeDocument>('nfe'), db.getAll<NfeItem>('nfeItems'),
    db.getAll<Quote>('quotes'), db.getAll<AuditEntry>('audit'), db.getAll<AppConfig>('config')
  ]);
  return {
    products, suppliers, categories, movements, nfe, nfeItems, quotes, audit,
    config: configs[0] ?? defaultConfig()
  };
}

export async function replaceSnapshot(snapshot: DatabaseSnapshot): Promise<void> {
  const sets: Array<[StoreName, any[]]> = [
    ['products', snapshot.products], ['suppliers', snapshot.suppliers], ['categories', snapshot.categories],
    ['movements', snapshot.movements], ['nfe', snapshot.nfe], ['nfeItems', snapshot.nfeItems],
    ['quotes', snapshot.quotes], ['audit', snapshot.audit], ['config', [snapshot.config]]
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
    schemaVersion: 1
  };
}
