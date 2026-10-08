export type View = 'dashboard' | 'products' | 'stock' | 'suppliers' | 'nfe' | 'quotes' | 'inventory' | 'audit' | 'settings';

export type MovementType = 'entrada' | 'saida' | 'ajuste' | 'devolucao' | 'transferencia';

export interface Category {
  id: string;
  name: string;
  icon: string;
  tone: string;
}

export interface Supplier {
  id: string;
  name: string;
  tradeName?: string;
  cnpj?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  contact?: string;
  paymentTerms?: string;
  averageLeadDays?: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  supplierId?: string;
  supplierNameLegacy?: string;
  categoryId: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
  maximumStock?: number;
  reservedStock: number;
  currentCost: number;
  averageCost: number;
  lastPurchaseAt?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  legacySource?: 'v8-seed' | 'v8-import' | 'manual';
  photoHash?: string;
  photoUpdatedAt?: string;
}

export interface Movement {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  type: MovementType;
  quantity: number;
  unitCost: number;
  document?: string;
  workOrder?: string;
  vehicle?: string;
  responsible?: string;
  note?: string;
  createdAt: string;
}

export interface NfeItem {
  id: string;
  nfeId: string;
  code: string;
  description: string;
  quantity: number;
  unit: string;
  unitCost: number;
  matchedProductId?: string;
  confidence?: number;
  status: 'new' | 'update' | 'skip' | 'review';
  matchConfidence?: number;
  matchMethod?: string;
  sourceLine?: string;
  warnings?: string[];
}

export interface NfeDocument {
  id: string;
  number?: string;
  key?: string;
  supplierName?: string;
  cnpj?: string;
  issueDate?: string;
  total?: number;
  sourceName: string;
  sourceType: 'pdf' | 'json' | 'csv' | 'manual';
  status: 'new' | 'review' | 'processed' | 'error';
  createdAt: string;
  note?: string;
  readerProfile?: 'danfe' | 'pedido' | 'orcamento' | 'generic';
  readerConfidence?: number;
  parseWarnings?: string[];
}

export interface NfeFile {
  id: string;
  nfeId: string;
  blob: Blob;
  mimeType: string;
  name: string;
  createdAt: string;
}

export interface ProductMedia {
  id: string;
  productId: string;
  blob: Blob;
  mimeType: string;
  name: string;
  updatedAt: string;
}

export interface QuoteItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
}

export interface Quote {
  id: string;
  number: string;
  customer: string;
  title: string;
  validUntil?: string;
  status: 'draft' | 'sent' | 'waiting' | 'approved' | 'rejected' | 'cancelled';
  notes?: string;
  items: QuoteItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AuditEntry {
  id: string;
  type: 'create' | 'update' | 'delete' | 'movement' | 'import' | 'export' | 'system' | 'inventory';
  message: string;
  detail?: string;
  entityType?: string;
  entityId?: string;
  createdAt: string;
}

export interface AppConfig {
  id: string;
  theme: 'dark' | 'light';
  allowNegativeStock: boolean;
  defaultMinimumStock: number;
  backupRetention: number;
  lastBackupAt?: string;
  initializedAt: string;
  schemaVersion: number;
  liteMode?: boolean;
}

export interface DatabaseSnapshot {
  products: Product[];
  suppliers: Supplier[];
  categories: Category[];
  movements: Movement[];
  nfe: NfeDocument[];
  nfeItems: NfeItem[];
  quotes: Quote[];
  audit: AuditEntry[];
  config: AppConfig;
}
