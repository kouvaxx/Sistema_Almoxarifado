import './styles.css';
import { db, defaultConfig, loadSnapshot } from './db';
import { CATEGORY_META, SEED_CATEGORIES, SEED_PRODUCTS, SEED_SUPPLIERS } from './seed';
import type {
  AppConfig,
  AuditEntry,
  Category,
  DatabaseSnapshot,
  Movement,
  MovementType,
  NfeDocument,
  NfeItem,
  Product,
  Quote,
  QuoteItem,
  Supplier,
  View,
} from './types';

const APP = 'Almoxarifado v9';
const uid = (prefix = 'id') => `${prefix}-${crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`}`;
const now = () => new Date().toISOString();
const money = (n: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number.isFinite(n) ? n : 0);
const qty = (n: number) => new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 3 }).format(Number.isFinite(n) ? n : 0);
const dateTime = (s?: string) => s ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(s)) : '—';
const dateOnly = (s?: string) => s ? new Intl.DateTimeFormat('pt-BR').format(new Date(s)) : '—';
const esc = (v: unknown) => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c as keyof Record<string, string>] ?? c));
const norm = (v: string) => v.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

const NAV: Array<{ id: View; label: string; section: string; icon: string }> = [
  { id: 'dashboard', label: 'Visão geral', section: 'INÍCIO', icon: 'dashboard' },
  { id: 'products', label: 'Produtos', section: 'CADASTRO', icon: 'box' },
  { id: 'suppliers', label: 'Fornecedores', section: 'CADASTRO', icon: 'building' },
  { id: 'stock', label: 'Estoque', section: 'ESTOQUE', icon: 'layers' },
  { id: 'inventory', label: 'Inventário', section: 'ESTOQUE', icon: 'clipboard' },
  { id: 'nfe', label: 'NF-e', section: 'COMPRAS', icon: 'file' },
  { id: 'quotes', label: 'Orçamentos', section: 'COMERCIAL', icon: 'receipt' },
  { id: 'audit', label: 'Auditoria', section: 'GESTÃO', icon: 'shield' },
  { id: 'settings', label: 'Configurações', section: 'SISTEMA', icon: 'settings' },
];

const ICONS: Record<string, string> = {
  dashboard: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  box: '<path d="m21 8-9-5-9 5 9 5 9-5Z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>',
  building: '<path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 9h1M14 9h1M9 13h1M14 13h1M9 17h1M14 17h1"/>',
  layers: '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
  clipboard: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3h6v3H9z"/><path d="M8 10h8M8 14h8M8 18h5"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>',
  receipt: '<path d="M4 3h16v18l-3-2-3 2-4-2-3 2-3-2Z"/><path d="M8 8h8M8 12h8M8 16h4"/>',
  shield: '<path d="M12 3 20 6v6c0 5-3.4 8.7-8 10-4.6-1.3-8-5-8-10V6l8-3Z"/><path d="m9 12 2 2 4-4"/>',
  settings: '<path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.5 1.5-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20H12v-.4a1.7 1.7 0 0 0-1.56-1.7 1.7 1.7 0 0 0-1.56 1.7V20H8v-.4a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.5-1.5.06-.06a1.7 1.7 0 0 0 .34-1.88 1.7 1.7 0 0 0-1.56-1.03H4v-1.8h.4a1.7 1.7 0 0 0 1.56-1.03 1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.5-1.5.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 9.2 9.2V8.8H10v.4a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.5 1.5-.06.06a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0 1.56 1.03H15v1.8h-.4a1.7 1.7 0 0 0-1.56 1.03Z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  filter: '<path d="M4 5h16M7 12h10M10 19h4"/>',
  download: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 21h16"/>',
  upload: '<path d="M12 21V9"/><path d="m7 14 5-5 5 5"/><path d="M4 3h16"/>',
  more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  edit: '<path d="m4 17 9-9 4 4-9 9H4v-4Z"/><path d="m14 7 2-2 4 4-2 2"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7l1-3h4l1 3"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  refresh: '<path d="M20 11a8 8 0 0 0-14-4L3 10"/><path d="M3 5v5h5M4 13a8 8 0 0 0 14 4l3-3"/><path d="M21 19v-5h-5"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  alert: '<path d="M12 3 21 19H3L12 3Z"/><path d="M12 9v4M12 16h.01"/>',
  history: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5M12 7v5l3 2"/>',
  moon: '<path d="M20 14.6A8.5 8.5 0 0 1 9.4 4 8.5 8.5 0 1 0 20 14.6Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/>',
} as const;

const icon = (name: string, size = 18) => `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] ?? ''}</svg>`;

interface State extends DatabaseSnapshot {
  view: View;
  query: string;
  categoryId: string;
  supplierId: string;
  stockStatus: string;
  sort: string;
  mobileNav: boolean;
  theme: 'dark' | 'light';
}

let state: State = {
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
  theme: 'dark',
};

function getProduct(id: string) { return state.products.find(p => p.id === id); }
function getSupplier(id?: string) { return state.suppliers.find(s => s.id === id); }
function getCategory(id: string) { return state.categories.find(c => c.id === id); }
function statusFor(p: Product) {
  if (p.currentStock <= 0) return 'critical';
  if (p.minimumStock > 0 && p.currentStock <= p.minimumStock) return 'low';
  if (p.maximumStock && p.currentStock > p.maximumStock) return 'over';
  return 'ok';
}
function statusLabel(s: string) { return s === 'critical' ? 'Zerado' : s === 'low' ? 'Comprar' : s === 'over' ? 'Excedente' : 'Normal'; }
function statusClass(s: string) { return `status-${s}`; }
function log(type: AuditEntry['type'], message: string, detail?: string, entityType?: string, entityId?: string) {
  const item: AuditEntry = { id: uid('audit'), type, message, detail, entityType, entityId, createdAt: now() };
  state.audit.unshift(item);
  state.audit = state.audit.slice(0, 3000);
  void db.put('audit', item).catch(() => {});
}
function toast(message: string, type: 'success' | 'warning' | 'error' = 'success') {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span>${type === 'success' ? icon('check', 16) : icon('alert', 16)}</span>${esc(message)}`;
  const root = document.getElementById('toast-root');
  root?.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => el.remove(), 2500);
}

async function seedDatabase() {
  const snapshot = await loadSnapshot();
  if (snapshot.products.length) return snapshot;

  const categories = SEED_CATEGORIES;
  const suppliers = SEED_SUPPLIERS;
  const products = SEED_PRODUCTS;
  const movements: Movement[] = [];
  const quotes: Quote[] = [];
  const nfe: NfeDocument[] = [];
  const nfeItems: NfeItem[] = [];
  const audit: AuditEntry[] = [];
  const config = defaultConfig();
  config.schemaVersion = 1;

  await db.bulkPut('categories', categories);
  await db.bulkPut('suppliers', suppliers);
  await db.bulkPut('products', products);
  await db.bulkPut('movements', movements);
  await db.bulkPut('quotes', quotes);
  await db.bulkPut('audit', audit);
  await db.bulkPut('nfe', nfe);
  await db.bulkPut('nfeItems', nfeItems);
  await db.put('config', config);

  return { products, suppliers, categories, movements, nfe, nfeItems, quotes, audit, config };
}

function renderDashboard() {
  const total = state.products.filter(p => p.active).length;
  const value = state.products.filter(p => p.active).reduce((sum, p) => sum + p.currentStock * p.currentCost, 0);
  const low = state.products.filter(p => p.active && ['low', 'critical'].includes(statusFor(p))).length;

  return `
    <div class="page-head">
      <div>
        <div class="eyebrow">ALMOXARIFADO</div>
        <h1>Visão geral</h1>
        <p>Resumo da operação.</p>
      </div>
      <div class="page-head-actions">
        <button class="btn btn-primary" data-action="new-product">${icon('plus', 15)} Novo produto</button>
      </div>
    </div>
    <section class="kpi-grid">
      <div class="kpi featured"><div class="kpi-icon">${icon('wallet', 18)}</div><div><small>Valor em estoque</small><b>${money(value)}</b></div></div>
      <div class="kpi"><div class="kpi-icon">${icon('box', 18)}</div><div><small>Produtos ativos</small><b>${total}</b></div></div>
      <div class="kpi"><div class="kpi-icon">${icon('alert', 18)}</div><div><small>Estoque crítico</small><b>${low}</b></div></div>
      <div class="kpi"><div class="kpi-icon">${icon('truck', 18)}</div><div><small>Movimentações</small><b>${state.movements.length}</b></div></div>
    </section>
    <section class="dashboard-grid">
      <div class="panel span-2">
        <div class="panel-head"><div><h2>Resumo</h2><p>Monitoramento rápido.</p></div></div>
        <div class="timeline">
          <div class="timeline-item"><span class="move-icon positive">${icon('check', 18)}</span><span><b>Banco local carregado</b><small>${APP}</small></span></div>
          <div class="timeline-item"><span class="move-icon neutral">${icon('history', 18)}</span><span><b>Dados sincronizados com IndexedDB</b><small>Offline-first</small></span></div>
        </div>
      </div>
    </section>
  `;
}

function renderProducts() {
  const items = state.products.filter(p => p.active);
  return `
    <div class="page-head">
      <div><div class="eyebrow">ALMOXARIFADO</div><h1>Produtos</h1><p>Cadastro central de materiais, peças e consumíveis.</p></div>
      <div class="page-head-actions">
        <button class="btn" data-action="import-backup">${icon('upload', 15)} Importar backup</button>
        <button class="btn btn-primary" data-action="new-product">${icon('plus', 15)} Novo produto</button>
      </div>
    </div>
    <div class="toolbar panel">
      <div class="search-box"><span>${icon('search', 17)}</span><input id="query" value="${esc(state.query)}" placeholder="Pesquisar produto..." /></div>
    </div>
    <div class="table-panel panel">
      <div class="table-meta"><span><b>${items.length}</b> produtos exibidos</span></div>
      <table class="table">
        <thead><tr><th>Produto</th><th>Estoque</th><th>Fornecedor</th><th>Status</th></tr></thead>
        <tbody>
          ${items.slice(0, 20).map(p => `
            <tr>
              <td><button class="link-button" data-product="${p.id}"><b>${esc(p.name)}</b><small>${esc(p.code)}</small></button></td>
              <td>${qty(p.currentStock)} ${esc(p.unit)}</td>
              <td>${esc(getSupplier(p.supplierId)?.name ?? p.supplierNameLegacy ?? '—')}</td>
              <td><span class="status ${statusClass(statusFor(p))}">${statusLabel(statusFor(p))}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderSuppliers() { return `<div class="page-head"><div><div class="eyebrow">ALMOXARIFADO</div><h1>Fornecedores</h1><p>Cadastro independente com histórico de compras e produtos.</p></div><div class="page-head-actions"><button class="btn btn-primary" data-action="new-supplier">${icon('plus', 15)} Novo fornecedor</button></div></div>`; }
function renderStock() { return `<div class="page-head"><div><div class="eyebrow">ALMOXARIFADO</div><h1>Estoque</h1><p>Movimente entradas, saídas e ajustes com rastreabilidade.</p></div><div class="page-head-actions"><button class="btn btn-primary" data-action="new-movement">${icon('plus', 15)} Registrar movimento</button></div></div>`; }
function renderInventory() { return `<div class="page-head"><div><div class="eyebrow">ALMOXARIFADO</div><h1>Inventário</h1><p>Conferência física com ajuste rastreável.</p></div></div>`; }
function renderNfe() { return `<div class="page-head"><div><div class="eyebrow">ALMOXARIFADO</div><h1>NF-e</h1><p>Entrada de documentos e conferência.</p></div></div>`; }
function renderQuotes() { return `<div class="page-head"><div><div class="eyebrow">ALMOXARIFADO</div><h1>Orçamentos</h1><p>Propostas e cotações.</p></div></div>`; }
function renderAudit() { return `<div class="page-head"><div><div class="eyebrow">ALMOXARIFADO</div><h1>Auditoria</h1><p>Histórico das mudanças recentes.</p></div></div>`; }
function renderSettings() { return `<div class="page-head"><div><div class="eyebrow">ALMOXARIFADO</div><h1>Configurações</h1><p>Preferências operacionais do sistema.</p></div></div>`; }

function renderView() {
  switch (state.view) {
    case 'dashboard': return renderDashboard();
    case 'products': return renderProducts();
    case 'suppliers': return renderSuppliers();
    case 'stock': return renderStock();
    case 'inventory': return renderInventory();
    case 'nfe': return renderNfe();
    case 'quotes': return renderQuotes();
    case 'audit': return renderAudit();
    case 'settings': return renderSettings();
    default: return renderDashboard();
  }
}

function shell() {
  const navSections = [...new Set(NAV.map(item => item.section))];
  const grouped = navSections.map(section => `
    <div class="nav-section">
      <div class="nav-label">${section}</div>
      ${NAV.filter(item => item.section === section).map(item => `<button class="nav-item ${state.view === item.id ? 'active' : ''}" data-view="${item.id}">${icon(item.icon, 17)}<span>${item.label}</span>${item.id === 'nfe' && state.nfe.some(n => n.status === 'new' || n.status === 'review') ? `<b>${state.nfe.filter(n => n.status === 'new' || n.status === 'review').length}</b>` : ''}</button>`).join('')}
    </div>
  `).join('');

  return `
    <div class="app-shell ${state.theme === 'light' ? 'theme-light' : ''}">
      <aside class="sidebar ${state.mobileNav ? 'open' : ''}">
        <div class="brand">
          <div class="brand-mark">${icon('box', 19)}</div>
          <div><strong>Almoxarifado</strong><span>Lista de Produtos • v9</span></div>
        </div>
        <div class="sidebar-scroll">${grouped}</div>
      </aside>
      <div class="main-shell">
        <header class="topbar">
          <button class="icon-btn mobile-menu" data-action="toggle-nav">${icon('menu', 20)}</button>
          <button class="global-search" data-action="command"><span class="search-symbol">${icon('search', 17)}</span><span>Pesquisar produto, fornecedor, NF-e...</span><kbd>Ctrl K</kbd></button>
          <div class="top-actions">
            <span class="save-status"><i></i> Banco local</span>
            <button class="icon-btn" data-action="theme" title="Alternar tema">${state.theme === 'dark' ? icon('moon', 15) : icon('sun', 15)}</button>
            <button class="btn btn-primary" data-action="new-product">${icon('plus', 15)} Novo produto</button>
          </div>
        </header>
        <main class="page">${renderView()}</main>
      </div>
      <div id="modal-root"></div>
      <div id="drawer-root"></div>
      <div id="toast-root"></div>
    </div>
  `;
}

function wire() {
  document.addEventListener('click', (e: MouseEvent) => {
    const t = e.target as HTMLElement;
    const actionEl = t.closest('[data-action]') as HTMLElement | null;
    const drawerContainer = t.closest('[data-stop]') as HTMLElement | null;

    if (drawerContainer && (!actionEl || !drawerContainer.contains(actionEl))) {
      e.stopPropagation();
      return;
    }

    const viewEl = t.closest('[data-view]') as HTMLElement | null;
    if (viewEl) {
      state.view = viewEl.dataset.view as View;
      state.mobileNav = false;
      render();
      return;
    }

    if (!actionEl) return;

    const { action } = actionEl.dataset;

    switch (action) {
      case 'toggle-nav':
        state.mobileNav = !state.mobileNav;
        render();
        break;
      case 'theme':
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        render();
        break;
      case 'new-product':
        toast('Novo produto em desenvolvimento.', 'success');
        break;
      case 'new-supplier':
        toast('Novo fornecedor em desenvolvimento.', 'success');
        break;
      case 'new-movement':
        toast('Nova movimentação em desenvolvimento.', 'success');
        break;
      default:
        break;
    }
  });

  document.addEventListener('input', (e: Event) => {
    const t = e.target as HTMLInputElement;
    if (t.id === 'query') {
      state.query = t.value;
      render();
    }
  });
}

function render() {
  const root = document.getElementById('app');
  if (!root) return;
  root.innerHTML = shell();
}

async function init() {
  wire();
  const snapshot = await seedDatabase();
  state = { ...state, ...snapshot, theme: snapshot.config.theme };
  render();
}

window.addEventListener('DOMContentLoaded', () => {
  const mount = document.getElementById('app');
  if (!mount) {
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
  }
  void init();
});

export {};
