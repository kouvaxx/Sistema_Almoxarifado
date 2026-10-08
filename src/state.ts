import type {
  AppConfig,
  AuditEntry,
  Category,
  Movement,
  NfeDocument,
  NfeItem,
  Product,
  Quote,
  Supplier,
  View,
} from './types';
import { defaultConfig } from './db';

export interface AppState {
  products: Product[];
  suppliers: Supplier[];
  categories: Category[];
  movements: Movement[];
  nfe: NfeDocument[];
  nfeItems: NfeItem[];
  quotes: Quote[];
  audit: AuditEntry[];
  config: AppConfig;
  view: View;
  query: string;
  categoryId: string;
  supplierId: string;
  stockStatus: string;
  sort: string;
  mobileNav: boolean;
  sidebarCollapsed: boolean;
  theme: AppConfig['theme'];
}

export function createInitialState(): AppState {
  return {
    products: [],
    suppliers: [],
    categories: [],
    movements: [],
    nfe: [],
    nfeItems: [],
    quotes: [],
    audit: [],
    config: defaultConfig(),
    view: 'dashboard',
    query: '',
    categoryId: '',
    supplierId: '',
    stockStatus: '',
    sort: 'name',
    mobileNav: false,
    sidebarCollapsed: false,
    theme: 'dark',
  };
}
