import './styles.css';
import { db, defaultConfig, loadSnapshot } from './db';
import { createInitialState } from './state';
import { CATEGORY_META, SEED_CATEGORIES, SEED_PRODUCTS, SEED_SUPPLIERS } from './seed';
import {
  calculateWeightedAverageCost,
  getStockStatus,
  movementTypeLabel,
  stockStatusClass,
  stockStatusLabel,
} from './domain/stock';
import {
  validateImportedProducts,
  validateInventoryCount,
  validateStockMovement,
} from './domain/validation';
import type { AuditEntry, MovementType } from './types';

// A implementação abaixo foi restaurada a partir da versão funcional v9.2 autocontida.
// A etapa seguinte do roadmap deve separar UI, domínio e persistência sem alterar seu comportamento.

function $id<T extends HTMLElement = HTMLInputElement>(id: string): T | null {
    return document.getElementById(id) as T | null;
}
function $q<T extends HTMLElement = HTMLInputElement>(root: ParentNode, selector: string): T | null {
    return root.querySelector(selector) as T | null;
}
function $qa<T extends HTMLElement = HTMLInputElement>(root: ParentNode, selector: string): T[] {
    return Array.from(root.querySelectorAll(selector)) as T[];
}
const APP = 'Almoxarifado v9.2';
const uid = (prefix = 'id') => `${prefix}-${crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`}`;
const now = () => new Date().toISOString();
const money = (n) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number.isFinite(n) ? n : 0);
const qty = (n) => new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 3 }).format(Number.isFinite(n) ? n : 0);
const dateTime = (s) => s ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(s)) : '—';
const dateOnly = (s) => s ? new Intl.DateTimeFormat('pt-BR').format(new Date(s)) : '—';
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const norm = (v: unknown): string => String(v ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const NAV = [
    { id: 'dashboard', label: 'Visão geral', section: 'INÍCIO', icon: 'dashboard' },
    { id: 'products', label: 'Produtos', section: 'CADASTRO', icon: 'box' },
    { id: 'suppliers', label: 'Fornecedores', section: 'CADASTRO', icon: 'building' },
    { id: 'stock', label: 'Estoque', section: 'ESTOQUE', icon: 'layers' },
    { id: 'inventory', label: 'Inventário', section: 'ESTOQUE', icon: 'clipboard' },
    { id: 'nfe', label: 'NF-e', section: 'COMPRAS', icon: 'file' },
    { id: 'quotes', label: 'Orçamentos', section: 'COMERCIAL', icon: 'receipt' },
    { id: 'audit', label: 'Auditoria', section: 'GESTÃO', icon: 'shield' },
    { id: 'settings', label: 'Configurações', section: 'SISTEMA', icon: 'settings' }
];
const ICONS = {
    dashboard: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    box: '<path d="m21 8-9-5-9 5 9 5 9-5Z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>',
    building: '<path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 9h1M14 9h1M9 13h1M14 13h1M9 17h1M14 17h1"/>',
    layers: '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
    clipboard: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3h6v3H9z"/><path d="M8 10h8M8 14h8M8 18h5"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>',
    receipt: '<path d="M4 3h16v18l-3-2-3 2-4-2-3 2-3-2Z"/><path d="M8 8h8M8 12h8M8 16h4"/>',
    shield: '<path d="M12 3 20 6v6c0 5-3.4 8.7-8 10-4.6-1.3-8-5-8-10V6l8-3Z"/><path d="m9 12 2 2 4-4"/>',
    settings: '<path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.5 1.5-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20H12v-.4a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.5-1.5.06-.06A1.7 1.7 0 0 0 7.6 15a1.7 1.7 0 0 0-1.56-1.03H5V12h1.04A1.7 1.7 0 0 0 7.6 11a1.7 1.7 0 0 0-.34-1.88L7.2 9.06l1.5-1.5.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 11.67 6V5H14v1a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.5 1.5-.06.06A1.7 1.7 0 0 0 18.06 11 1.7 1.7 0 0 0 19.6 12H21v2h-1.04A1.7 1.7 0 0 0 19.4 15Z"/>',
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
    print: '<path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/>',
    filePlus: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M12 12v6M9 15h6"/>',
    barcode: '<path d="M4 5v14M7 5v14M10 5v14M14 5v14M17 5v14M20 5v14"/>',
    scan: '<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/>',
    camera: '<path d="M3 7h4l1.5-2h7L17 7h4v12H3z"/><circle cx="12" cy="13" r="3.5"/>',
    zap: '<path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z"/>',
    truck: '<path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z"/><circle cx="7" cy="19" r="2"/><circle cx="18" cy="19" r="2"/>',
    wallet: '<path d="M4 6h16v12H4z"/><path d="M4 6V4h14"/><path d="M16 12h4"/>',
    chart: '<path d="M4 19V9M10 19V5M16 19v-8M22 19V3"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l2 2M14 9l2 2"/>'
};
const icon = (name: string, size = 18) => `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${(ICONS as Record<string, string>)[name] ?? ICONS.box}</svg>`;
let state = createInitialState();
let productIndex = new Map();
let productCodeIndex = new Map();
let productNormalizedCodeIndex = new Map();
let productNameIndex = new Map();
let supplierIndex = new Map();
let categoryIndex = new Map();
let pendingPhotoFile: File | undefined;
let photoSearchFile: File | undefined;
function rebuildIndexes() { productIndex = new Map(state.products.map(p => [p.id, p])); productCodeIndex = new Map(); productNormalizedCodeIndex = new Map(); productNameIndex = new Map(); for (const p of state.products) {
    productCodeIndex.set(String(p.code).trim(), p);
    const nc = normalizedCode(p.code);
    const bucket = productNormalizedCodeIndex.get(nc) || [];
    bucket.push(p);
    productNormalizedCodeIndex.set(nc, bucket);
    productNameIndex.set(norm(p.name), p);
} supplierIndex = new Map(state.suppliers.map(s => [s.id, s])); categoryIndex = new Map(state.categories.map(c => [c.id, c])); }
function getProduct(id) { return productIndex.get(id) ?? state.products.find(p => p.id === id); }
function getSupplier(id) { return id ? (supplierIndex.get(id) ?? state.suppliers.find(s => s.id === id)) : undefined; }
function getCategory(id) { return categoryIndex.get(id) ?? state.categories.find(c => c.id === id); }
const statusFor = getStockStatus;
const statusLabel = stockStatusLabel;
const statusClass = stockStatusClass;
function log(type: AuditEntry['type'], message: string, detail?: string, entityType?: string, entityId?: string) {
    const item = { id: uid('audit'), type, message, detail, entityType, entityId, createdAt: now() };
    state.audit.unshift(item);
    state.audit = state.audit.slice(0, 3000);
    db.put('audit', item).catch(() => { });
}
function toast(message: string, type: 'success' | 'warning' | 'error' = 'success') {
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<span>${type === 'success' ? icon('check', 16) : type === 'warning' ? icon('alert', 16) : icon('alert', 16)}</span>${esc(message)}`;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => el.classList.remove('show'), 2500);
    setTimeout(() => el.remove(), 3000);
}
async function seedDatabase() {
    const snapshot = await loadSnapshot();
    if (snapshot.products.length)
        return snapshot;
    const categories = SEED_CATEGORIES;
    const suppliers = SEED_SUPPLIERS;
    const products = SEED_PRODUCTS;
    const movements = [];
    const quotes = [];
    const nfe = [];
    const nfeItems = [];
    const audit = [];
    const config = defaultConfig();
    await db.bulkPut('categories', categories);
    await db.bulkPut('suppliers', suppliers);
    await db.bulkPut('products', products);
    await db.bulkPut('movements', movements);
    await db.bulkPut('quotes', quotes);
    await db.bulkPut('audit', audit);
    await db.bulkPut('nfe', nfe);
    await db.bulkPut('nfeItems', []);
    await db.put('config', config);
    return { products, suppliers, categories, movements, nfe, nfeItems, quotes, audit, config };
}
async function tryLegacyMigration() {
    try {
        const legacy = localStorage.getItem('produtos_lista_v8');
        if (!legacy)
            return false;
        const existing = await db.getAll('products');
        if (existing.length)
            return false;
        const arr = JSON.parse(legacy);
        if (!Array.isArray(arr) || !arr.length)
            return false;
        const suppliersByName = new Map();
        const categoriesByName = new Map();
        const products = [];
        const t = now();
        for (const [i, p] of arr.entries()) {
            const supplierName = String(p.fornecedor || '—').trim();
            let supplierId;
            if (supplierName && supplierName !== '?' && supplierName !== '—') {
                supplierId = 'sup-' + norm(supplierName).replace(/[^a-z0-9]+/g, '-');
                if (!suppliersByName.has(supplierName))
                    suppliersByName.set(supplierName, { id: supplierId, name: supplierName, active: true, createdAt: t, updatedAt: t });
            }
            const catName = String(p.categoria || 'Outros');
            const catId = 'cat-' + norm(catName).replace(/[^a-z0-9]+/g, '-');
            if (!categoriesByName.has(catName))
                categoriesByName.set(catName, { id: catId, name: catName, icon: CATEGORY_META[catName]?.icon ?? 'Lista', tone: CATEGORY_META[catName]?.tone ?? 'slate' });
            const stock = Math.max(0, Number(p.estoqueAtual ?? p.quantidade) || 0);
            const cost = Math.max(0, Number(p.preco) || 0);
            products.push({ id: uid('p'), code: String(p.id ?? '—'), name: String(p.nome || '').trim().toUpperCase(), supplierId, supplierNameLegacy: supplierName, categoryId: catId, unit: p.unidade || 'un', currentStock: stock, minimumStock: 2, reservedStock: 0, currentCost: cost, averageCost: cost, active: true, createdAt: t, updatedAt: t, legacySource: 'v8-import' });
        }
        await db.bulkPut('suppliers', [...suppliersByName.values()]);
        await db.bulkPut('categories', [...categoriesByName.values()]);
        await db.bulkPut('products', products);
        const config = defaultConfig();
        await db.put('config', config);
        log('import', `Migração da v8 concluída: ${products.length} produtos`, 'Origem: localStorage produtos_lista_v8');
        return true;
    }
    catch {
        return false;
    }
}
function filteredProducts() {
    let arr = state.products.filter(p => p.active);
    const q = norm(state.query);
    if (q)
        arr = arr.filter(p => norm(`${p.name} ${p.code} ${p.supplierNameLegacy ?? getSupplier(p.supplierId)?.name ?? ''} ${getCategory(p.categoryId)?.name ?? ''}`).includes(q));
    if (state.categoryId)
        arr = arr.filter(p => p.categoryId === state.categoryId);
    if (state.supplierId)
        arr = arr.filter(p => p.supplierId === state.supplierId);
    if (state.stockStatus)
        arr = arr.filter(p => statusFor(p) === state.stockStatus);
    arr = [...arr];
    switch (state.sort) {
        case 'name':
            arr.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
            break;
        case 'stock':
            arr.sort((a, b) => b.currentStock - a.currentStock);
            break;
        case 'cost':
            arr.sort((a, b) => b.currentCost - a.currentCost);
            break;
        case 'value':
            arr.sort((a, b) => (b.currentStock * b.currentCost) - (a.currentStock * a.currentCost));
            break;
        case 'low':
            arr.sort((a, b) => ({ critical: 0, low: 1, over: 2, ok: 3 }[statusFor(a)] - ({ critical: 0, low: 1, over: 2, ok: 3 }[statusFor(b)])));
            break;
    }
    return arr;
}
function kpis() {
    const products = state.products.filter(p => p.active);
    const value = products.reduce((s, p) => s + p.currentStock * p.currentCost, 0);
    const low = products.filter(p => ['low', 'critical'].includes(statusFor(p))).length;
    const zero = products.filter(p => p.currentStock <= 0).length;
    const month = state.movements.filter(m => new Date(m.createdAt).getMonth() === new Date().getMonth() && m.type === 'entrada').length;
    return { products: products.length, value, low, zero, month, movements: state.movements.length };
}
function shell() {
    const navSections = [...new Set(NAV.map(x => x.section))];
    const grouped = navSections.map(section => `<div class="nav-section"><div class="nav-label">${section}</div>${NAV.filter(x => x.section === section).map(n => `<button class="nav-item ${state.view === n.id ? 'active' : ''}" data-view="${n.id}">${icon(n.icon, 17)}<span>${n.label}</span>${n.id === 'nfe' && state.nfe.filter(n => n.status === 'new' || n.status === 'review').length ? `<b class="nav-badge">${state.nfe.filter(n => n.status === 'new' || n.status === 'review').length}</b>` : ''}</button>`).join('')}</div>`).join('');
    const themeIcon = state.theme === 'dark' ? icon('moon', 15) : icon('sun', 15);
    return `<div class="app-shell ${state.theme === 'light' ? 'theme-light' : ''} ${state.sidebarCollapsed ? 'sidebar-collapsed' : ''} ${state.config.liteMode ? 'lite-mode' : ''}">
    <aside class="sidebar ${state.mobileNav ? 'open' : ''}">
      <div class="brand"><div class="brand-mark">${icon('box', 19)}</div><div><strong>Almoxarifado</strong><span>Lista de Produtos • v9.2</span></div></div>
      <div class="sidebar-scroll">${grouped}</div>
      <div class="sidebar-foot"><button class="user-chip" data-action="settings"><span class="avatar">JB</span><span><b>Operação</b><small>Offline-first</small></span>${icon('settings', 15)}</button></div>
    </aside>
    <div class="sidebar-backdrop ${state.mobileNav ? 'open' : ''}" data-action="toggle-nav"></div>
    <div class="main-shell">
      <header class="topbar">
        <button class="icon-btn mobile-menu" data-action="toggle-nav">${icon('menu', 20)}</button>
        <button class="global-search" data-action="command"><span class="search-symbol">${icon('search', 17)}</span><span>Pesquisar produto, fornecedor, NF-e...</span><kbd>Ctrl K</kbd></button>
        <div class="top-actions"><span class="save-status"><i></i> Banco local</span><button class="icon-btn top-photo-btn" data-action="photo-search" title="Buscar por foto">${icon('camera', 16)}</button><button class="icon-btn" data-action="theme" title="Alternar tema">${themeIcon}</button><button class="btn btn-primary" data-action="new-product">${icon('plus', 16)} Novo produto</button></div>
      </header>
      <main class="page">${renderView()}</main>
    </div>
    <div id="modal-root"></div><div id="drawer-root"></div><div id="toast-root"></div>
  </div>`;
}
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
    }
}
function pageHead(title, sub, actions = '') { return `<div class="page-head"><div><div class="eyebrow">ALMOXARIFADO</div><h1>${title}</h1><p>${sub}</p></div><div class="page-head-actions">${actions}</div></div>`; }
function actionBtn(label, action, iconName = 'plus', primary = false) { return `<button class="btn ${primary ? 'btn-primary' : ''}" data-action="${action}">${icon(iconName, 15)} ${label}</button>`; }
function renderDashboard() {
    const k = kpis();
    const critical = filteredCritical(6);
    const recent = state.movements.slice().sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 7);
    const pending = state.nfe.filter(n => n.status === 'new' || n.status === 'review');
    return pageHead('Visão geral', 'O que precisa da sua atenção hoje?', actionBtn('Nova movimentação', 'new-movement', 'plus', true)) + `<section class="kpi-grid">
      ${kpi('Valor em estoque', money(k.value), 'wallet', '', true)}
      ${kpi('Produtos ativos', String(k.products), 'box', '')}
      ${kpi('Estoque crítico', String(k.low), 'alert', k.low ? 'danger' : 'good')}
      ${kpi('Entradas no mês', String(k.month), 'truck', '')}
    </section>
    <section class="dashboard-grid">
      <div class="panel span-2"><div class="panel-head"><div><h2>Estoque crítico</h2><p>Itens zerados ou abaixo do mínimo.</p></div>${actionBtn('Ver estoque', 'stock', 'arrow')}</div>${critical.length ? `<div class="table-wrap compact"><table><thead><tr><th>Produto</th><th>Estoque</th><th>Mínimo</th><th>Status</th><th></th></tr></thead><tbody>${critical.map(p => productRow(p)).join('')}</tbody></table></div>` : `<div class="empty-state mini"><div class="empty-icon success">${icon('check', 28)}</div><b>Nenhum item crítico</b><span>O estoque está dentro dos parâmetros cadastrados.</span></div>`}</div>
      <div class="panel"><div class="panel-head"><div><h2>Atenção</h2><p>Filas de operação.</p></div></div><div class="attention-list">
        <button class="attention-item" data-view="nfe"><span class="attention-icon amber">${icon('file', 17)}</span><span><b>${pending.length} NF-e</b><small>Aguardando conferência</small></span>${icon('arrow', 15)}</button>
        <button class="attention-item" data-view="inventory"><span class="attention-icon blue">${icon('clipboard', 17)}</span><span><b>${k.zero} zerados</b><small>Precisam de reposição</small></span>${icon('arrow', 15)}</button>
        <button class="attention-item" data-view="suppliers"><span class="attention-icon violet">${icon('building', 17)}</span><span><b>${state.suppliers.filter(s => s.active).length} fornecedores</b><small>Base cadastrada</small></span>${icon('arrow', 15)}</button>
      </div></div>
      <div class="panel lite-secondary"><div class="panel-head"><div><h2>Últimas movimentações</h2><p>Registro operacional recente.</p></div>${actionBtn('Abrir', 'stock', 'arrow')}</div><div class="timeline">${recent.length ? recent.map(m => movementItem(m)).join('') : `<div class="empty-state mini"><span>Nenhuma movimentação registrada.</span></div>`}</div></div>
      <div class="panel span-2 lite-secondary"><div class="panel-head"><div><h2>Resumo por categoria</h2><p>Valor e quantidade no estoque atual.</p></div></div><div class="category-grid">${summaryCategories().map(x => `<button class="category-card" data-category="${x.id}"><span class="cat-dot tone-${x.tone}">${icon('box', 16)}</span><span><b>${esc(x.name)}</b><small>${qty(x.stock)} ${x.stock === 1 ? 'unidade' : 'unidades'}</small></span><strong>${money(x.value)}</strong></button>`).join('')}</div></div>
    </section>`;
}
function kpi(label, value, iconName, tone, featured = false) { return `<div class="kpi ${featured ? 'featured' : ''}"><div class="kpi-icon ${tone}">${icon(iconName, 18)}</div><div><span>${label}</span><strong>${value}</strong></div></div>`; }
function filteredCritical(limit) { return state.products.filter(p => p.active && ['low', 'critical'].includes(statusFor(p))).sort((a, b) => a.currentStock - b.currentStock).slice(0, limit); }
function productRow(p) { const cat = getCategory(p.categoryId); const s = statusFor(p); return `<tr><td><button class="link-button" data-product="${p.id}"><b>${esc(p.name)}</b><small>${esc(p.code)} · ${esc(cat?.name || 'Outros')}</small></button></td><td><strong>${qty(p.currentStock)}</strong> ${esc(p.unit)}</td><td>${qty(p.minimumStock)}</td><td><span class="status ${statusClass(s)}"><i></i>${statusLabel(s)}</span></td><td><button class="icon-btn" data-product="${p.id}">${icon('arrow', 15)}</button></td></tr>`; }
function movementItem(m) { return `<div class="timeline-item"><span class="move-icon ${m.type === 'entrada' || m.type === 'devolucao' ? 'positive' : 'negative'}">${icon(m.type === 'entrada' || m.type === 'devolucao' ? 'download' : 'upload', 15)}</span><div><b>${esc(m.productName)}</b><small>${m.type.toUpperCase()} · ${dateTime(m.createdAt)}${m.document ? ' · ' + esc(m.document) : ''}</small></div><strong class="${m.type === 'entrada' || m.type === 'devolucao' ? 'positive-text' : 'negative-text'}">${m.type === 'saida' ? '−' : '+'}${qty(m.quantity)}</strong></div>`; }
function summaryCategories() { const map = new Map(); for (const p of state.products) {
    const c = getCategory(p.categoryId);
    const x = map.get(p.categoryId) ?? { id: p.categoryId, name: c?.name || 'Outros', tone: c?.tone || 'slate', stock: 0, value: 0 };
    x.stock += p.currentStock;
    x.value += p.currentStock * p.currentCost;
    map.set(p.categoryId, x);
} return [...map.values()].sort((a, b) => b.value - a.value).slice(0, 8); }
function renderProducts() {
    const products = filteredProducts();
    const actions = actionBtn('Importar backup', 'import-backup', 'upload') + actionBtn('Exportar JSON', 'export-json', 'download') + actionBtn('Novo produto', 'new-product', 'plus', true);
    return pageHead('Produtos', 'Cadastro central de materiais, peças e consumíveis.', actions) + `<div class="toolbar panel"><div class="search-box"><span>${icon('search', 17)}</span><input id="query" value="${esc(state.query)}" placeholder="Buscar nome, código, fornecedor..." /></div><select id="cat-filter"><option value="">Todas as categorias</option>${state.categories.map(c => `<option value="${c.id}" ${state.categoryId === c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select><select id="supplier-filter"><option value="">Todos os fornecedores</option>${state.suppliers.filter(s => s.active).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')).map(s => `<option value="${s.id}" ${state.supplierId === s.id ? 'selected' : ''}>${esc(s.name)}</option>`).join('')}</select><select id="stock-filter"><option value="">Todos os estoques</option><option value="critical" ${state.stockStatus === 'critical' ? 'selected' : ''}>Zerado</option><option value="low" ${state.stockStatus === 'low' ? 'selected' : ''}>Baixo</option><option value="ok" ${state.stockStatus === 'ok' ? 'selected' : ''}>Normal</option><option value="over" ${state.stockStatus === 'over' ? 'selected' : ''}>Excedente</option></select><select id="sort-filter"><option value="name">Nome</option><option value="stock" ${state.sort === 'stock' ? 'selected' : ''}>Maior estoque</option><option value="cost" ${state.sort === 'cost' ? 'selected' : ''}>Maior custo</option><option value="value" ${state.sort === 'value' ? 'selected' : ''}>Maior valor</option><option value="low" ${state.sort === 'low' ? 'selected' : ''}>Maior urgência</option></select><button class="icon-btn" data-action="clear-filters" title="Limpar filtros">${icon('refresh', 17)}</button></div>
  <div class="table-panel panel"><div class="table-meta"><span><b>${products.length}</b> produtos exibidos</span><span>Valor filtrado <b>${money(products.reduce((s, p) => s + p.currentStock * p.currentCost, 0))}</b></span></div><div class="table-wrap"><table><thead><tr><th>Produto</th><th>Fornecedor</th><th>Estoque</th><th>Mín.</th><th>Custo atual</th><th>Valor estoque</th><th>Status</th><th></th></tr></thead><tbody>${products.map(p => productTableRow(p)).join('')}</tbody></table></div>${!products.length ? empty('Nenhum produto encontrado', 'Ajuste os filtros ou cadastre um novo item.', 'box') : ''}</div>`;
}
function productTableRow(p) { const s = statusFor(p), sup = getSupplier(p.supplierId)?.name || p.supplierNameLegacy || '—', cat = getCategory(p.categoryId)?.name || 'Outros'; return `<tr><td><button class="link-button" data-product="${p.id}"><b>${esc(p.name)}</b><small>${esc(p.code)} · ${esc(cat)}</small></button></td><td>${esc(sup)}</td><td><strong>${qty(p.currentStock)}</strong> <small>${esc(p.unit)}</small></td><td>${qty(p.minimumStock)}</td><td>${money(p.currentCost)}</td><td><b>${money(p.currentStock * p.currentCost)}</b></td><td><span class="status ${statusClass(s)}"><i></i>${statusLabel(s)}</span></td><td><button class="icon-btn" data-product="${p.id}">${icon('more', 17)}</button></td></tr>`; }
function renderSuppliers() {
    const rows = state.suppliers.filter(s => s.active).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')).map(s => { const ps = state.products.filter(p => p.supplierId === s.id); const total = ps.reduce((x, p) => x + p.currentStock * p.currentCost, 0); const last = state.movements.filter(m => m.type === 'entrada' && ps.some(p => p.id === m.productId)).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))[0]; return `<tr><td><button class="link-button" data-supplier="${s.id}"><b>${esc(s.name)}</b><small>${esc(s.cnpj || 'CNPJ não informado')}</small></button></td><td>${ps.length}</td><td>${money(total)}</td><td>${last ? dateOnly(last.createdAt) : '—'}</td><td><span class="status status-ok"><i></i>Ativo</span></td><td><button class="icon-btn" data-supplier="${s.id}">${icon('arrow', 15)}</button></td></tr>`; }).join('');
    return pageHead('Fornecedores', 'Cadastro independente com histórico de compras e produtos.', actionBtn('Novo fornecedor', 'new-supplier', 'plus', true)) + `<div class="supplier-grid">${state.suppliers.filter(s => s.active).slice(0, 6).map(s => `<button class="supplier-card" data-supplier="${s.id}"><span class="supplier-avatar">${esc(s.name.slice(0, 2))}</span><span><b>${esc(s.name)}</b><small>${state.products.filter(p => p.supplierId === s.id).length} produtos</small></span>${icon('arrow', 15)}</button>`).join('')}</div><div class="panel table-panel"><div class="table-meta"><span>${state.suppliers.filter(s => s.active).length} fornecedores ativos</span><span>Histórico de custo disponível por produto</span></div><div class="table-wrap"><table><thead><tr><th>Fornecedor</th><th>Produtos</th><th>Valor no estoque</th><th>Última entrada</th><th>Status</th><th></th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
}
function renderStock() {
    const movements = state.movements.slice().sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    return pageHead('Estoque', 'Movimente entradas, saídas e ajustes com rastreabilidade.', actionBtn('Registrar movimento', 'new-movement', 'plus', true)) + `<div class="stock-layout"><div class="panel"><div class="panel-head"><div><h2>Saldo atual</h2><p>Produtos e indicadores de reposição.</p></div></div><div class="stock-summary"><div><span>Valor</span><b>${money(kpis().value)}</b></div><div><span>Críticos</span><b class="danger-text">${kpis().low}</b></div><div><span>Reservado</span><b>${qty(state.products.reduce((s, p) => s + p.reservedStock, 0))}</b></div></div><div class="table-wrap"><table><thead><tr><th>Produto</th><th>Atual</th><th>Disponível</th><th>Custo</th><th>Status</th></tr></thead><tbody>${filteredProducts().slice(0, 20).map(p => `<tr><td><button class="link-button" data-product="${p.id}"><b>${esc(p.name)}</b><small>${esc(p.code)}</small></button></td><td>${qty(p.currentStock)} ${esc(p.unit)}</td><td>${qty(Math.max(0, p.currentStock - p.reservedStock))}</td><td>${money(p.currentCost)}</td><td><span class="status ${statusClass(statusFor(p))}"><i></i>${statusLabel(statusFor(p))}</span></td></tr>`).join('')}</tbody></table></div></div><div class="panel"><div class="panel-head"><div><h2>Movimentações</h2><p>Últimos 50 lançamentos.</p></div></div><div class="timeline tall">${movements.slice(0, 50).map(m => movementItem(m)).join('') || '<div class="empty-state mini"><span>Nenhuma movimentação.</span></div>'}</div></div></div>`;
}
function renderInventory() {
    const candidates = state.products.filter(p => p.active).slice().sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    return pageHead('Inventário', 'Conferência física com ajuste rastreável.', actionBtn('Gerar ajuste', 'save-inventory', 'check', true)) + `<div class="panel inventory-panel"><div class="panel-head"><div><h2>Contagem física</h2><p>Informe a quantidade encontrada. O sistema só altera o estoque após a confirmação.</p></div><div class="inventory-count"><b id="inv-diff">0</b><span>itens com diferença</span></div></div><div class="inventory-table table-wrap"><table><thead><tr><th>Produto</th><th>Estoque sistema</th><th>Contagem física</th><th>Diferença</th><th></th></tr></thead><tbody>${candidates.map(p => `<tr><td><button class="link-button" data-product="${p.id}"><b>${esc(p.name)}</b><small>${esc(p.code)}</small></button></td><td>${qty(p.currentStock)}</td><td><input class="number-input inventory-input" data-product="${p.id}" type="number" min="0" step="0.001" placeholder="${p.currentStock}" /></td><td class="inventory-diff" data-diff="${p.id}">—</td><td>${icon('clipboard', 15)}</td></tr>`).join('')}</tbody></table></div></div>`;
}
function renderNfe() {
    const docs = state.nfe.slice().sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    const itemCount = new Map();
    for (const item of state.nfeItems)
        itemCount.set(item.nfeId, (itemCount.get(item.nfeId) || 0) + 1);
    const profileLabel = (p) => p.readerProfile === 'danfe' ? 'DANFE' : p.readerProfile === 'pedido' ? 'Pedido' : p.readerProfile === 'orcamento' ? 'Orçamento' : p.readerProfile === 'generic' ? 'Genérico' : '—';
    const profileTone = (p) => p.readerProfile === 'danfe' || p.readerProfile === 'pedido' ? 'status-ok' : p.readerProfile === 'generic' ? 'status-low' : 'status-over';
    const pending = (n) => n.status !== 'processed' && n.status !== 'cancelled';
    return pageHead('NF-e', 'Entrada de documentos, conferência e rastreabilidade.', actionBtn('Importar documento', 'import-nfe', 'upload', true)) + `<div class="nfe-drop panel" id="nfe-drop" data-action="nfe-drop"><div class="drop-icon">${icon('filePlus', 30)}</div><div><h2>Importação inteligente</h2><p>Aceita NF-e/DANFE, pedidos, ordens de compra, orçamentos, TXT/CSV e outros PDFs estruturados. O leitor identifica o formato, infere colunas e mostra confiança antes da entrada no estoque.</p></div><button class="btn btn-secondary" data-action="import-nfe">${icon('upload', 15)} Selecionar arquivo</button><input type="file" id="nfe-file" hidden accept=".pdf,.json,.csv,.txt,text/plain,application/json,text/csv" /></div><div class="panel table-panel"><div class="table-meta"><span><b>${docs.length}</b> documentos</span><span>${docs.filter(x => pending(x)).length} aguardando ação</span></div><div class="table-wrap"><table><thead><tr><th>Documento</th><th>Fornecedor</th><th>Leitura</th><th>Itens</th><th>Data</th><th>Total</th><th>Status</th><th>Ações</th></tr></thead><tbody>${docs.map(n => { const count = itemCount.get(n.id) || 0; const canChange = pending(n); return `<tr><td><b>${esc(n.number || 'Documento sem número')}</b><small>${esc(n.key || n.sourceName)}</small></td><td>${esc(n.supplierName || '—')}</td><td><span class="status ${profileTone(n)}"><i></i>${profileLabel(n)}${n.readerConfidence ? ` · ${Math.round(n.readerConfidence * 100)}%` : ''}</span></td><td>${count}</td><td>${dateOnly(n.issueDate)}</td><td>${money(n.total || 0)}</td><td><span class="status ${n.status === 'processed' ? 'status-ok' : n.status === 'error' ? 'status-critical' : n.status === 'cancelled' ? 'status-over' : 'status-low'}"><i></i>${n.status === 'processed' ? 'Processada' : n.status === 'review' ? 'Revisar' : n.status === 'error' ? 'Erro' : n.status === 'cancelled' ? 'Cancelada' : 'Nova'}</span></td><td><div class="nfe-row-actions"><button class="icon-btn" data-nfe="${n.id}" title="Abrir revisão">${icon('arrow', 15)}</button>${canChange ? `<button class="icon-btn nfe-danger-btn" data-action="delete-nfe" data-id="${n.id}" title="Excluir documento">${icon('trash', 14)}</button><button class="icon-btn nfe-warn-btn" data-action="cancel-nfe" data-id="${n.id}" title="Cancelar revisão">${icon('close', 14)}</button>` : n.status === 'cancelled' ? `<button class="icon-btn" data-action="reopen-nfe" data-id="${n.id}" title="Reabrir revisão">${icon('refresh', 14)}</button>` : ''}</div></td></tr>`; }).join('') || `<tr><td colspan="8">Nenhum documento importado.</td></tr>`}</tbody></table></div></div>`;
}
function renderQuotes() { const qs = state.quotes.slice().sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)); return pageHead('Orçamentos', 'Monte propostas a partir do catálogo e mantenha versões.', actionBtn('Novo orçamento', 'new-quote', 'plus', true)) + `<div class="quote-grid">${qs.slice(0, 4).map(q => `<button class="quote-card" data-quote="${q.id}"><div class="quote-status ${q.status}">${q.status}</div><b>${esc(q.number)} · ${esc(q.title || 'Sem título')}</b><span>${esc(q.customer || 'Cliente não informado')}</span><small>${q.items.length} itens · ${money(quoteTotal(q))}</small>${icon('arrow', 15)}</button>`).join('') || `<div class="empty-state mini"><div class="empty-icon">${icon('receipt', 26)}</div><b>Nenhum orçamento salvo</b><span>Crie um orçamento a partir do catálogo.</span></div>`}</div><div class="panel table-panel"><div class="table-wrap"><table><thead><tr><th>Número</th><th>Cliente</th><th>Status</th><th>Itens</th><th>Total</th><th>Atualizado</th></tr></thead><tbody>${qs.map(q => `<tr><td><button class="link-button" data-quote="${q.id}"><b>${esc(q.number)}</b><small>${esc(q.title)}</small></button></td><td>${esc(q.customer || '—')}</td><td><span class="quote-status ${q.status}">${q.status}</span></td><td>${q.items.length}</td><td>${money(quoteTotal(q))}</td><td>${dateTime(q.updatedAt)}</td></tr>`).join('') || '<tr><td colspan="6">Nenhum orçamento.</td></tr>'}</tbody></table></div></div>`; }
function quoteTotal(q) { return q.items.reduce((sum, i) => sum + i.quantity * i.unitPrice - (i.discount || 0), 0); }
function renderAudit() { const entries = state.audit.slice().sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)); return pageHead('Auditoria', 'Histórico das alterações e operações relevantes.', actionBtn('Exportar JSON', 'export-json', 'download')) + `<div class="panel"><div class="audit-list">${entries.slice(0, 150).map(a => `<div class="audit-row"><span class="audit-icon ${a.type}">${icon(a.type === 'movement' ? 'layers' : a.type === 'delete' ? 'trash' : a.type === 'create' ? 'plus' : a.type === 'import' ? 'upload' : 'history', 15)}</span><div><b>${esc(a.message)}</b><small>${dateTime(a.createdAt)}${a.detail ? ' · ' + esc(a.detail) : ''}</small></div><span class="audit-type">${esc(a.type)}</span></div>`).join('') || `<div class="empty-state mini"><span>Nenhum registro.</span></div>`}</div></div>`; }
function renderSettings() { return pageHead('Configurações', 'Preferências operacionais, desempenho e manutenção do banco local.') + `<div class="settings-grid"><div class="panel settings-card"><div class="panel-head"><div><h2>Estoque</h2><p>Regras de movimentação.</p></div></div><label class="setting-row"><span><b>Permitir estoque negativo</b><small>Desligado por padrão para evitar saídas acima do físico.</small></span><input id="cfg-negative" type="checkbox" ${state.config.allowNegativeStock ? 'checked' : ''}/></label><label class="setting-row"><span><b>Estoque mínimo padrão</b><small>Aplicado a novos produtos.</small></span><input id="cfg-min" class="small-input" type="number" min="0" step="0.001" value="${state.config.defaultMinimumStock}"/></label></div><div class="panel settings-card"><div class="panel-head"><div><h2>Desempenho</h2><p>Reduza efeitos e renderizações secundárias em máquinas menos potentes.</p></div></div><label class="setting-row"><span><b>Modo Lite</b><small>Desativa desfoque, sombras, transições e painéis secundários do dashboard.</small></span><input id="cfg-lite" type="checkbox" ${state.config.liteMode ? 'checked' : ''}/></label><div class="data-note"><span>${icon('zap', 17)}</span><p><b>Indicado para PCs com pouca RAM/GPU.</b><br/>Os dados e funções permanecem iguais.</p></div></div><div class="panel settings-card"><div class="panel-head"><div><h2>Dados</h2><p>Backup e migração.</p></div></div><div class="setting-actions">${actionBtn('Exportar backup', 'export-json', 'download')} ${actionBtn('Exportar CSV', 'export-csv', 'download')} ${actionBtn('Importar backup', 'import-backup', 'upload')} ${actionBtn('Imprimir relatório', 'print-report', 'print')}</div><div class="data-note"><span>${icon('shield', 17)}</span><p><b>Banco local seguro por estrutura</b><br/>A v9 usa IndexedDB em navegador suportado e mantém exportação manual.</p></div></div><div class="panel settings-card"><div class="panel-head"><div><h2>Uso no iPhone</h2><p>Instale o web app pela tela inicial do Safari.</p></div></div><div class="data-note"><span>${icon('camera', 17)}</span><p><b>Busca por foto</b><br/>Use a câmera/fotos para localizar produtos por código quando disponível ou por foto de referência cadastrada.</p></div><div class="setting-actions">${actionBtn('Compartilhar acesso', 'share-app', 'upload')}</div><div class="data-note"><span>${icon('layers', 17)}</span><p><b>Banco local por dispositivo</b><br/>O iPhone e o PC ainda mantêm cópias locais independentes. A sincronização em nuvem será a próxima camada.</p></div></div></div>`; }
function empty(title, text, iconName = 'box') { return `<div class="empty-state"><div class="empty-icon">${icon(iconName, 28)}</div><b>${title}</b><span>${text}</span></div>`; }
function openProductDrawer(productId) {
    const p = productId ? getProduct(productId) : undefined;
    const isNew = !p;
    const cats = state.categories;
    const sups = state.suppliers.filter(s => s.active);
    const html = `<div class="drawer-overlay" data-action="close-drawer"><aside class="drawer" data-stop><div class="drawer-head"><div><div class="eyebrow">${isNew ? 'NOVO CADASTRO' : 'FICHA DO PRODUTO'}</div><h2>${isNew ? 'Novo produto' : esc(p.name)}</h2><p>${isNew ? 'Cadastre material com estoque mínimo e fornecedor.' : esc(p.code)}</p></div><button class="icon-btn" data-action="close-drawer">${icon('close', 20)}</button></div><div class="drawer-body">
    <div class="form-section"><div class="form-section-title">Identificação</div><label>Nome *<input id="p-name" value="${esc(p?.name || '')}" /></label><div class="form-grid"><label>Código<input id="p-code" value="${esc(p?.code || '')}" /></label><label>Unidade<select id="p-unit">${['un', 'cx', 'pct', 'par', 'kg', 'g', 'L', 'mL', 'm', 'dz', 'ct'].map(u => `<option ${p?.unit === u ? 'selected' : ''}>${u}</option>`).join('')}</select></label></div><div class="form-grid"><label>Categoria<select id="p-cat">${cats.map(c => `<option value="${c.id}" ${p?.categoryId === c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select></label><label>Fornecedor<select id="p-sup"><option value="">Sem fornecedor</option>${sups.map(s => `<option value="${s.id}" ${p?.supplierId === s.id ? 'selected' : ''}>${esc(s.name)}</option>`).join('')}</select></label></div></div>
    <div class="form-section"><div class="form-section-title">Identificação visual</div><label>Foto de referência<input id="p-photo" type="file" accept="image/*" capture="environment" /><small class="field-help">Usada pela Busca por foto. A imagem fica neste dispositivo.</small><span class="photo-state">${p?.photoHash ? '✓ Foto de referência cadastrada' : 'Nenhuma foto cadastrada'}</span></label></div><div class="form-section"><div class="form-section-title">Estoque e custo</div><div class="form-grid"><label>Estoque atual<input id="p-stock" type="number" min="0" step="0.001" value="${p?.currentStock ?? 0}" ${isNew ? '' : 'disabled'} /></label><label>Estoque mínimo<input id="p-min" type="number" min="0" step="0.001" value="${p?.minimumStock ?? state.config.defaultMinimumStock}" /></label></div><div class="form-grid"><label>Custo atual<input id="p-cost" type="number" min="0" step="0.01" value="${p?.currentCost ?? 0}" /></label><label>Estoque máximo<input id="p-max" type="number" min="0" step="0.001" value="${p?.maximumStock ?? ''}" placeholder="Opcional" /></label></div></div>
    ${!isNew ? `<div class="form-section"><div class="detail-strip"><div><span>Disponível</span><b>${qty(Math.max(0, p.currentStock - p.reservedStock))}</b></div><div><span>Valor estoque</span><b>${money(p.currentStock * p.currentCost)}</b></div><div><span>Status</span><b class="${statusClass(statusFor(p))}">${statusLabel(statusFor(p))}</b></div></div></div>` : ''}
  </div><div class="drawer-foot">${!isNew ? `<button class="btn btn-danger ghost" data-action="delete-product" data-id="${p.id}">${icon('trash', 15)} Excluir</button>` : '<span></span>'}<div><button class="btn btn-secondary" data-action="close-drawer">Cancelar</button><button class="btn btn-primary" data-action="save-product" data-id="${p?.id || ''}">${icon('check', 15)} ${isNew ? 'Criar produto' : 'Salvar alterações'}</button></div></div></aside></div>`;
    const root = $id('drawer-root');
    root.innerHTML = html;
    requestAnimationFrame(() => $q(root, '.drawer-overlay')?.classList.add('open'));
}
function openSupplierDrawer(supplierId) { const s = supplierId ? getSupplier(supplierId) : undefined; const ps = state.products.filter(p => p.supplierId === supplierId); const html = `<div class="drawer-overlay" data-action="close-drawer"><aside class="drawer" data-stop><div class="drawer-head"><div><div class="eyebrow">FORNECEDOR</div><h2>${s ? esc(s.name) : 'Novo fornecedor'}</h2><p>${s ? esc(s.cnpj || 'Cadastro sem CNPJ') : 'Dados de contato e compra'}</p></div><button class="icon-btn" data-action="close-drawer">${icon('close', 20)}</button></div><div class="drawer-body"><div class="form-section"><div class="form-section-title">Identificação</div><label>Nome *<input id="s-name" value="${esc(s?.name || '')}" /></label><div class="form-grid"><label>CNPJ<input id="s-cnpj" value="${esc(s?.cnpj || '')}" /></label><label>Contato<input id="s-contact" value="${esc(s?.contact || '')}" /></label></div><div class="form-grid"><label>Telefone<input id="s-phone" value="${esc(s?.phone || '')}" /></label><label>WhatsApp<input id="s-whatsapp" value="${esc(s?.whatsapp || '')}" /></label></div><label>E-mail<input id="s-email" value="${esc(s?.email || '')}" /></label><div class="form-grid"><label>Prazo médio (dias)<input id="s-lead" type="number" min="0" value="${s?.averageLeadDays ?? ''}" /></label><label>Condição pagamento<input id="s-payment" value="${esc(s?.paymentTerms || '')}" /></label></div></div>${s ? `<div class="form-section"><div class="form-section-title">Produtos vinculados</div>${ps.slice(0, 12).map(p => `<button class="mini-product-row" data-product="${p.id}"><span>${esc(p.name)}<small>${esc(p.code)}</small></span><b>${money(p.currentCost)}</b>${icon('arrow', 14)}</button>`).join('') || '<span class="muted">Nenhum produto vinculado.</span>'}</div>` : ''}</div><div class="drawer-foot">${s ? `<button class="btn btn-danger ghost" data-action="delete-supplier" data-id="${s.id}">${icon('trash', 15)} Desativar</button>` : '<span></span>'}<div><button class="btn btn-secondary" data-action="close-drawer">Cancelar</button><button class="btn btn-primary" data-action="save-supplier" data-id="${s?.id || ''}">${icon('check', 15)} Salvar fornecedor</button></div></div></aside></div>`; const root = document.getElementById('drawer-root'); root.innerHTML = html; requestAnimationFrame(() => $q(root, '.drawer-overlay')?.classList.add('open')); }
function openMovementModal() { const products = state.products.filter(p => p.active).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')); showModal('Nova movimentação', `<div class="modal-grid"><label>Produto<select id="m-product">${products.map(p => `<option value="${p.id}">${esc(p.name)} · ${qty(p.currentStock)} ${esc(p.unit)}</option>`).join('')}</select></label><label>Tipo<select id="m-type"><option value="entrada">Entrada</option><option value="saida">Saída</option><option value="ajuste">Ajuste de saldo</option><option value="devolucao">Devolução</option><option value="transferencia">Transferência</option></select></label></div><div class="modal-grid"><label>Quantidade<input id="m-qty" type="number" min="0.001" step="0.001" value="1" /></label><label>Custo unitário<input id="m-cost" type="number" min="0" step="0.01" value="0" /></label></div><div class="modal-grid"><label>Documento<input id="m-doc" placeholder="NF-e, OS, inventário..." /></label><label>Responsável<input id="m-resp" placeholder="Nome" /></label></div><div class="modal-grid"><label>Ordem de serviço<input id="m-os" placeholder="Opcional" /></label><label>Veículo<input id="m-vehicle" placeholder="Opcional" /></label></div><label>Observação<textarea id="m-note" rows="3" placeholder="Motivo, origem ou destino..."></textarea></label><div class="modal-actions"><button class="btn btn-secondary" data-action="close-modal">Cancelar</button><button class="btn btn-primary" data-action="save-movement">${icon('check', 15)} Registrar</button></div>`); }
function openQuoteModal() {
    const products = state.products.filter(p => p.active);
    showModal('Novo orçamento', `<div class="modal-grid"><label>Cliente<input id="q-customer" placeholder="Cliente / empresa" /></label><label>Validade<input id="q-valid" type="date" /></label></div><label>Título<input id="q-title" placeholder="Ex.: Materiais para recuperação - OS 1234" /></label><label>Adicionar produto<select id="q-product"><option value="">Selecione...</option>${products.map(p => `<option value="${p.id}">${esc(p.name)} · ${money(p.currentCost)}</option>`).join('')}</select></label><div id="q-cart" class="quote-cart-empty">Nenhum item.</div><label>Observações<textarea id="q-notes" rows="3"></textarea></label><div class="modal-actions"><button class="btn btn-secondary" data-action="close-modal">Cancelar</button><button class="btn btn-primary" data-action="save-quote">${icon('check', 15)} Salvar orçamento</button></div>`);
    let cart = [];
    const select = document.getElementById('q-product');
    const cartEl = document.getElementById('q-cart');
    const paint = () => { cartEl.innerHTML = cart.length ? cart.map((x, i) => { const p = getProduct(x.productId); return `<div class="cart-row"><span>${esc(p.name)}<small>${money(x.unitPrice)} / un</small></span><input class="small-number" data-q-idx="${i}" type="number" min="1" step="1" value="${x.quantity}" /><b>${money(x.quantity * x.unitPrice)}</b><button class="icon-btn" data-q-remove="${i}">${icon('trash', 14)}</button></div>`; }).join('') : '<span class="muted">Nenhum item.</span>'; };
    select.addEventListener('change', () => { const id = select.value; if (!id)
        return; const p = getProduct(id); const existing = cart.find(i => i.productId === id); if (existing)
        existing.quantity += 1;
    else
        cart.push({ productId: id, quantity: 1, unitPrice: p.currentCost }); select.value = ''; paint(); });
    cartEl.addEventListener('input', e => { const el = (e.target as HTMLElement).closest('[data-q-idx]'); if (el)
        cart[Number(el.dataset.qIdx)].quantity = Math.max(1, Number(el.value) || 1); });
    cartEl.addEventListener('click', e => { const el = e.target.closest('[data-q-remove]'); if (el) {
        cart.splice(Number(el.dataset.qRemove), 1);
        paint();
    } });
    window._quoteCart = () => cart;
}
function showModal(title, body) { const root = document.getElementById('modal-root'); root.innerHTML = `<div class="modal-overlay" data-action="close-modal"><div class="modal" data-stop><div class="modal-head"><div><div class="eyebrow">AÇÃO</div><h2>${title}</h2></div><button class="icon-btn" data-action="close-modal">${icon('close', 20)}</button></div><div class="modal-body">${body}</div></div></div>`; requestAnimationFrame(() => $q(root, '.modal-overlay')?.classList.add('open')); }
async function saveProduct(id) {
    const name = document.getElementById('p-name').value.trim().toUpperCase();
    if (!name) {
        toast('Nome do produto é obrigatório', 'error');
        return;
    }
    const categoryId = document.getElementById('p-cat').value;
    const supplierId = document.getElementById('p-sup').value || undefined;
    const code = document.getElementById('p-code').value.trim() || '—';
    const unit = document.getElementById('p-unit').value;
    const min = Math.max(0, Number(document.getElementById('p-min').value) || 0);
    const cost = Math.max(0, Number(document.getElementById('p-cost').value) || 0);
    const maxValue = Number(document.getElementById('p-max').value);
    const p = id ? getProduct(id) : undefined;
    const photoFile = document.getElementById('p-photo')?.files?.[0] || pendingPhotoFile;
    let photoHash = p?.photoHash;
    if (photoFile) {
        try {
            photoHash = await imageDHash(photoFile);
        }
        catch {
            toast('Não foi possível processar a foto.', 'warning');
        }
    }
    if (!p) {
        const newProduct = { id: uid('p'), code, name, supplierId, supplierNameLegacy: getSupplier(supplierId)?.name, categoryId, unit, currentStock: Math.max(0, Number(document.getElementById('p-stock').value) || 0), minimumStock: min, reservedStock: 0, currentCost: cost, averageCost: cost, maximumStock: Number.isFinite(maxValue) && maxValue > 0 ? maxValue : undefined, active: true, createdAt: now(), updatedAt: now(), legacySource: 'manual', photoHash, photoUpdatedAt: photoFile ? now() : undefined };
        await db.put('products', newProduct);
        if (photoFile) {
            await db.put('productMedia', {
                id: newProduct.id,
                productId: newProduct.id,
                blob: photoFile,
                mimeType: photoFile.type || 'image/*',
                name: photoFile.name,
                updatedAt: newProduct.photoUpdatedAt || now(),
            });
        }
        state.products.unshift(newProduct);
        rebuildIndexes();
        log('create', `Produto criado: ${name}`, `Código ${code}`, 'product', newProduct.id);
        toast('Produto criado');
    }
    else {
        Object.assign(p, { code, name, supplierId, supplierNameLegacy: getSupplier(supplierId)?.name, categoryId, unit, minimumStock: min, currentCost: cost, averageCost: p.averageCost || cost, maximumStock: Number.isFinite(maxValue) && maxValue > 0 ? maxValue : undefined, photoHash, photoUpdatedAt: photoFile ? now() : p.photoUpdatedAt, updatedAt: now() });
        await db.put('products', p);
        if (photoFile) {
            await db.put('productMedia', {
                id: p.id,
                productId: p.id,
                blob: photoFile,
                mimeType: photoFile.type || 'image/*',
                name: photoFile.name,
                updatedAt: p.photoUpdatedAt || now(),
            });
        }
        log('update', `Produto alterado: ${name}`, 'Cadastro atualizado', 'product', p.id);
        toast('Alterações salvas');
    }
    pendingPhotoFile = undefined;
    closeDrawer();
    renderPage();
}
async function deleteProduct(id) { const p = getProduct(id); if (!p)
    return; if (!confirm(`Desativar “${p.name}”? O histórico será preservado.`))
    return; p.active = false; p.updatedAt = now(); await db.put('products', p); rebuildIndexes(); log('delete', `Produto desativado: ${p.name}`, 'Histórico preservado', 'product', p.id); closeDrawer(); renderPage(); toast('Produto desativado', 'warning'); }
async function saveSupplier(id) { const name = document.getElementById('s-name').value.trim().toUpperCase(); if (!name) {
    toast('Nome do fornecedor é obrigatório', 'error');
    return;
} let s = id ? getSupplier(id) : undefined; if (!s) {
    s = { id: uid('sup'), name, active: true, createdAt: now(), updatedAt: now(), cnpj: document.getElementById('s-cnpj').value.trim(), contact: document.getElementById('s-contact').value.trim(), phone: document.getElementById('s-phone').value.trim(), whatsapp: document.getElementById('s-whatsapp').value.trim(), email: document.getElementById('s-email').value.trim(), averageLeadDays: Math.max(0, Number(document.getElementById('s-lead').value) || 0), paymentTerms: document.getElementById('s-payment').value.trim() };
    state.suppliers.push(s);
    await db.put('suppliers', s);
    rebuildIndexes();
    log('create', `Fornecedor criado: ${name}`, '');
}
else {
    Object.assign(s, { name, cnpj: document.getElementById('s-cnpj').value.trim(), contact: document.getElementById('s-contact').value.trim(), phone: document.getElementById('s-phone').value.trim(), whatsapp: document.getElementById('s-whatsapp').value.trim(), email: document.getElementById('s-email').value.trim(), averageLeadDays: Math.max(0, Number(document.getElementById('s-lead').value) || 0), paymentTerms: document.getElementById('s-payment').value.trim(), updatedAt: now() });
    await db.put('suppliers', s);
    log('update', `Fornecedor alterado: ${name}`, 'Cadastro atualizado', 'supplier', s.id);
} closeDrawer(); renderPage(); toast('Fornecedor salvo'); }
async function deleteSupplier(id) { const s = getSupplier(id); if (!s)
    return; if (!confirm(`Desativar ${s.name}?`))
    return; s.active = false; s.updatedAt = now(); await db.put('suppliers', s); log('delete', `Fornecedor desativado: ${s.name}`, 'Produtos vinculados permanecem cadastrados.', 'supplier', id); closeDrawer(); renderPage(); toast('Fornecedor desativado', 'warning'); }
async function saveMovement() {
    const product = getProduct(document.getElementById('m-product').value);
    if (!product) {
        toast('Produto inválido', 'error');
        return;
    }
    const type = document.getElementById('m-type').value as MovementType;
    const amount = Math.max(0, Number(document.getElementById('m-qty').value) || 0);
    if (!(amount > 0)) {
        toast('Informe uma quantidade válida', 'error');
        return;
    }
    const current = product.currentStock;
    const validation = validateStockMovement({
        currentStock: current,
        type,
        quantity: amount,
        allowNegativeStock: state.config.allowNegativeStock,
    });
    if (!validation.ok) {
        toast(validation.message, 'error');
        return;
    }
    const next = validation.nextStock;
    const cost = Math.max(0, Number(document.getElementById('m-cost').value) || product.currentCost);
    if (type === 'entrada' && amount > 0 && cost > 0) {
        product.averageCost = calculateWeightedAverageCost(current, product.averageCost, amount, cost);
        product.currentCost = cost;
        product.lastPurchaseAt = now();
    }
    product.currentStock = next;
    product.updatedAt = now();
    const m = { id: uid('mov'), productId: product.id, productCode: product.code, productName: product.name, type, quantity: amount, unitCost: cost, document: document.getElementById('m-doc').value.trim(), responsible: document.getElementById('m-resp').value.trim(), workOrder: document.getElementById('m-os').value.trim(), vehicle: document.getElementById('m-vehicle').value.trim(), note: document.getElementById('m-note').value.trim(), createdAt: now() };
    state.movements.unshift(m);
    await db.put('movements', m);
    await db.put('products', product);
    log('movement', `${typeLabel(type)} · ${product.name}`, `${type === 'ajuste' ? 'Saldo final: ' + qty(next) : 'Quantidade: ' + qty(amount)} · Documento: ${m.document || '—'}`, 'movement', m.id);
    closeModal();
    renderPage();
    toast('Movimentação registrada');
}
const typeLabel = movementTypeLabel;
async function saveInventory() {
    const inputs = [...$qa(document, '.inventory-input')];
    const changes = [];

    for (const input of inputs) {
        if (input.value === '') continue;

        const product = getProduct(input.dataset.product || '');
        if (!product) continue;

        const counted = Number(input.value);
        if (!validateInventoryCount(counted)) {
            toast(`Contagem inválida para ${product.name}.`, 'error');
            return;
        }

        if (counted === product.currentStock) continue;

        changes.push({ product, counted });
    }

    for (const { product, counted } of changes) {
        const before = product.currentStock;
        product.currentStock = counted;
        product.updatedAt = now();

        const movement = {
            id: uid('mov'),
            productId: product.id,
            productCode: product.code,
            productName: product.name,
            type: 'ajuste',
            quantity: Math.abs(counted - before),
            unitCost: product.currentCost,
            document: 'INVENTÁRIO',
            note: `Ajuste de ${qty(before)} para ${qty(counted)}`,
            createdAt: now(),
        };

        state.movements.unshift(movement);
        await db.put('movements', movement);
        await db.put('products', product);
        log('inventory', `Inventário ajustado: ${product.name}`, `${qty(before)} → ${qty(counted)}`, 'product', product.id);
    }

    const count = changes.length;
    toast(count ? `${count} ajustes registrados` : 'Nenhuma diferença para ajustar', count ? 'success' : 'warning');
    renderPage();
}
async function saveQuote() { const cart = (window._quoteCart?.() ?? []); const q = { id: uid('quote'), number: `ORC-${new Date().getFullYear()}-${String(state.quotes.length + 1).padStart(4, '0')}`, customer: document.getElementById('q-customer').value.trim(), title: document.getElementById('q-title').value.trim() || 'Orçamento', validUntil: document.getElementById('q-valid').value || undefined, status: 'draft', notes: document.getElementById('q-notes').value.trim(), items: cart, createdAt: now(), updatedAt: now() }; state.quotes.unshift(q); await db.put('quotes', q); log('create', `Orçamento criado: ${q.number}`, `${q.items.length} itens · ${money(quoteTotal(q))}`, 'quote', q.id); closeModal(); renderPage(); toast('Orçamento salvo'); }
function openNfeDetail(nfeId) { const n = state.nfe.find(x => x.id === nfeId); if (!n)
    return; const items = state.nfeItems.filter(i => i.nfeId === n.id); const profile = n.readerProfile === 'danfe' ? 'DANFE' : n.readerProfile === 'pedido' ? 'Pedido' : n.readerProfile === 'orcamento' ? 'Orçamento' : n.readerProfile === 'generic' ? 'Documento genérico' : 'Não identificado'; const review = items.filter(i => i.status === 'review').length; const canProcess = n.status !== 'processed' && n.status !== 'cancelled' && items.length > 0; const footer = `<div class="modal-actions nfe-modal-actions"><button class="btn btn-secondary" data-action="close-modal">Fechar</button>${n.status === 'cancelled' ? `<button class="btn btn-secondary" data-action="reopen-nfe" data-id="${n.id}">${icon('refresh', 15)} Reabrir revisão</button>` : n.status !== 'processed' ? `<button class="btn btn-danger ghost" data-action="delete-nfe" data-id="${n.id}">${icon('trash', 15)} Excluir nota</button><button class="btn btn-secondary" data-action="cancel-nfe" data-id="${n.id}">${icon('close', 15)} Cancelar revisão</button>` : ''}${canProcess ? `<button class="btn btn-primary" data-action="process-nfe" data-id="${n.id}">${icon('check', 15)} Confirmar entrada</button>` : ''}</div>`; showModal('Revisar documento', `<div class="detail-grid"><div><span>Status</span><b>${esc(n.status)}</b></div><div><span>Leitura</span><b>${esc(profile)}${n.readerConfidence ? ` · ${Math.round(n.readerConfidence * 100)}%` : ''}</b></div><div><span>Fornecedor</span><b>${esc(n.supplierName || '—')}</b></div><div><span>Número</span><b>${esc(n.number || '—')}</b></div><div><span>Itens</span><b>${items.length}</b></div><div><span>Revisão</span><b>${review ? review + ' item(ns)' : 'Nenhum item pendente'}</b></div></div>${n.parseWarnings?.length ? `<div class="data-note"><span>${icon('alert', 17)}</span><p><b>Alertas</b><br/>${n.parseWarnings.map(w => esc(w)).join('<br/>')}</p></div>` : ''}<div class="data-note"><span>${icon('file', 17)}</span><p><b>${esc(n.sourceName)}</b><br/>${esc(n.note || 'Documento pronto para conferência.')}</p></div>${items.length ? `<div class="modal-subtitle">Itens reconhecidos</div><div class="table-wrap mini-table"><table><thead><tr><th>Item</th><th>Código</th><th>Qtd.</th><th>Unit.</th><th>Confiança</th><th>Correspondência</th><th>Ação</th></tr></thead><tbody>${items.map(i => { const conf = Math.round((i.confidence ?? 0) * 100), m = Math.round((i.matchConfidence ?? 0) * 100), p = i.matchedProductId ? getProduct(i.matchedProductId) : undefined; const cls = conf >= 80 ? 'status-ok' : conf >= 60 ? 'status-low' : 'status-critical'; return `<tr><td><b>${esc(i.description)}</b><small>${i.warnings?.[0] ? esc(i.warnings[0]) : esc(i.sourceLine || '')}</small></td><td>${esc(i.code || '—')}</td><td>${qty(i.quantity)} ${esc(i.unit)}</td><td>${money(i.unitCost)}</td><td><span class="status ${cls}"><i></i>${conf}%</span></td><td><span class="status ${p ? 'status-ok' : 'status-low'}"><i></i>${p ? esc(p.name) : 'Novo'}${m ? ` · ${m}%` : ''}</span></td><td><span class="status ${i.status === 'review' ? 'status-low' : i.status === 'skip' ? 'status-critical' : 'status-ok'}"><i></i>${i.status === 'review' ? 'Revisar' : i.status === 'skip' ? 'Ignorado' : i.status === 'new' ? 'Novo' : 'Pronto'}</span></td></tr>`; }).join('')}</tbody></table></div>` : ''}${footer}`); }
async function setNfeItemStatus(id, status) { const item = state.nfeItems.find(i => i.id === id); if (!item)
    return; item.status = status; await db.put('nfeItems', item); closeModal(); openNfeDetail(item.nfeId); }
async function deleteNfe(id) { const n = state.nfe.find(x => x.id === id); if (!n)
    return; if (n.status === 'processed') {
    toast('NF-e processada não pode ser excluída.', 'warning');
    return;
} if (!confirm(`Excluir o documento "${n.sourceName}" e todos os itens reconhecidos?`))
    return; const items = state.nfeItems.filter(i => i.nfeId === id); for (const item of items)
    await db.delete('nfeItems', item.id); state.nfeItems = state.nfeItems.filter(i => i.nfeId !== id); state.nfe = state.nfe.filter(x => x.id !== id); await db.delete('nfeFiles', id); await db.delete('nfe', id); log('delete', `Documento excluído: ${n.sourceName}`, `${items.length} itens removidos`, 'nfe', id); closeModal(); renderPage(); toast('Documento excluído', 'warning'); }
async function cancelNfe(id) { const n = state.nfe.find(x => x.id === id); if (!n || n.status === 'processed')
    return; n.status = 'cancelled'; n.note = `Revisão cancelada em ${dateTime(now())}.`; await db.put('nfe', n); log('update', `Revisão cancelada: ${n.sourceName}`, 'Documento mantido para histórico', 'nfe', id); closeModal(); renderPage(); toast('Revisão cancelada', 'warning'); }
async function reopenNfe(id) { const n = state.nfe.find(x => x.id === id); if (!n || n.status !== 'cancelled')
    return; n.status = 'review'; n.note = `Revisão reaberta em ${dateTime(now())}.`; await db.put('nfe', n); log('update', `Revisão reaberta: ${n.sourceName}`, 'Documento voltou para conferência', 'nfe', id); closeModal(); openNfeDetail(id); }
async function processNfe(id) { const n = state.nfe.find(x => x.id === id); if (!n)
    return; if (n.status === 'processed') {
    toast('Este documento já foi processado.', 'warning');
    return;
} if (n.status === 'cancelled') {
    toast('Reabra a revisão antes de processar.', 'warning');
    return;
} const items = state.nfeItems.filter(i => i.nfeId === id && i.status !== 'skip'); const pending = items.filter(i => i.status === 'review'); if (pending.length) {
    toast(`Ainda há ${pending.length} item(ns) para revisar. Aceite ou ignore os itens sinalizados.`, 'warning');
    return;
} if (!items.length) {
    toast('Nenhum item selecionado para entrada.', 'warning');
    return;
} let created = 0, updated = 0; for (const item of items) {
    let p = item.matchedProductId ? getProduct(item.matchedProductId) : undefined;
    if (!p && item.status === 'new') {
        let supId;
        if (n.supplierName) {
            let sup = state.suppliers.find(s => norm(s.name) === norm(n.supplierName));
            if (!sup) {
                sup = { id: uid('sup'), name: n.supplierName, active: true, createdAt: now(), updatedAt: now() };
                state.suppliers.push(sup);
                await db.put('suppliers', sup);
            }
            supId = sup.id;
        }
        const cat = state.categories.find(c => c.name === 'Outros') || state.categories[0];
        p = { id: uid('p'), code: item.code || '—', name: item.description.toUpperCase(), supplierId: supId, supplierNameLegacy: n.supplierName || '', categoryId: cat?.id || '', unit: item.unit || 'un', currentStock: 0, minimumStock: state.config.defaultMinimumStock, reservedStock: 0, currentCost: item.unitCost || 0, averageCost: item.unitCost || 0, active: true, createdAt: now(), updatedAt: now(), legacySource: 'manual' };
        state.products.unshift(p);
        item.matchedProductId = p.id;
        await db.put('products', p);
        created++;
    }
    if (!p)
        continue;
    const amount = Math.max(0, item.quantity || 0), cost = item.unitCost || p.currentCost, current = p.currentStock;
    if (amount > 0) {
        p.averageCost = (p.averageCost * current + cost * amount) / (current + amount || 1);
        p.currentCost = cost;
        p.currentStock = current + amount;
        p.lastPurchaseAt = n.issueDate || now();
        p.updatedAt = now();
        await db.put('products', p);
        const m = { id: uid('mov'), productId: p.id, productCode: p.code, productName: p.name, type: 'entrada', quantity: amount, unitCost: cost, document: n.number || n.key || n.sourceName, note: `Importação inteligente · ${n.readerProfile || 'documento'} · ${item.matchMethod || 'sem-match'}`, createdAt: now() };
        state.movements.unshift(m);
        await db.put('movements', m);
        item.status = 'update';
        await db.put('nfeItems', item);
        updated++;
    }
} rebuildIndexes(); n.status = 'processed'; n.note = `Processado: ${updated} movimentos · ${created} novos produtos.`; await db.put('nfe', n); log('import', `Documento processado: ${n.sourceName}`, `${updated} movimentos · ${created} novos produtos`, 'nfe', id); closeModal(); renderPage(); toast(`Entrada confirmada: ${updated} movimentos · ${created} novos`, 'success'); }
function scanCode() { showModal('Consultar código', `<div class="scan-box"><div class="scan-visual">${icon('barcode', 56)}</div><p>Digite ou cole o código interno/EAN. Em navegadores que suportam BarcodeDetector, o leitor por câmera pode ser adicionado ao adaptador PWA.</p><label>Código<input id="scan-code" autofocus placeholder="Ex.: 7891645083014" /></label><div class="modal-actions"><button class="btn btn-secondary" data-action="close-modal">Cancelar</button><button class="btn btn-primary" data-action="lookup-code">${icon('search', 15)} Consultar</button></div></div>`); setTimeout(() => document.getElementById('scan-code')?.focus(), 50); }
function lookupCode() { const code = document.getElementById('scan-code')?.value.trim(); if (!code)
    return toast('Informe um código', 'warning'); const p = state.products.find(x => x.code === code); if (!p) {
    toast('Código não encontrado', 'error');
    return;
} closeModal(); openProductDrawer(p.id); }
const UNIT_RE = /^(UN|UND|UNID|PC|P[CÇ]|PCS|PÇS|CX|CXS|CAIXA|PCT|PAC|PACOTE|PAR|KIT|JG|JOGO|KG|G|MG|T|L|LT|ML|M|MT|M2|M²|M3|M³|CM|MM|FR|FRASCO|TB|TUBO|BD|BALDE|GL|GAL[AÃ]O|RL|ROLO|B?JUNTO)$/i;
const EXCLUDE_LINE_RE = /(DANFE|DOCUMENTO AUXILIAR|CHAVE DE ACESSO|CNPJ|INSCRI[CÇ][AÃ]O|CEP|FONE|TELEFONE|FAX|NCM|CFOP|ICMS|IPI|PIS|COFINS|FRETE|SEGURO|DESCONTO|VALOR TOTAL DA NOTA|DADOS DO TRANSPORTE|DADOS ADICIONAIS|RESERVADO AO FISCO)/i;
const HEADER_RE = /(C[ÓO]DIGO|SKU|ITEM|PRODUTO|DESCRI[CÇ][AÃ]O|DESCRI[ÇC][AÃ]O|QTD|QUANT|QUANTIDADE|UNID|UNIDADE|PRE[CÇ]O|VALOR UNIT|TOTAL)/i;
const MONEY_TOKEN_RE = /^R?\$?\s*\d{1,3}(?:\.\d{3})*,\d{2}$|^R?\$?\s*\d+[.,]\d{2}$/;
const NUMBER_TOKEN_RE = /^\d+(?:[.,]\d+)?$/;
const normalize = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
const upper = (s) => normalize(s).toUpperCase();
const brNumber = (value) => {
    const s = value.replace(/R\$|\s/gi, '').trim();
    if (!s)
        return 0;
    if (s.includes(',') && s.includes('.'))
        return Number(s.replace(/\./g, '').replace(',', '.')) || 0;
    if (s.includes(','))
        return Number(s.replace(',', '.')) || 0;
    return Number(s) || 0;
};
const cleanToken = (s) => s.replace(/[|;]/g, ' ').trim();
function looksLikeCode(token) {
    const t = token.replace(/[^A-Z0-9._\-/]/gi, '');
    if (!t || t.length < 2 || t.length > 30)
        return false;
    if (/^\d{1,4}$/.test(t))
        return false;
    return /\d/.test(t) && /^[A-Z0-9._\-/]+$/i.test(t);
}
function tokenise(line) {
    return line.trim().match(/"[^"]+"|'[^']+'|\S+/g) ?? [];
}
function dateFromText(text) {
    const m = text.match(/\b(\d{2})[\/.\-](\d{2})[\/.\-](\d{4})\b/);
    return m ? `${m[3]}-${m[2]}-${m[1]}` : undefined;
}
function parseHeaderValue(text, labels) {
    for (const re of labels) {
        const m = text.match(re);
        if (m?.[1])
            return m[1].trim();
    }
    return undefined;
}
function detectProfile(rawText, lines) {
    const t = upper(rawText);
    let danfe = 0, pedido = 0, orc = 0;
    if (/DADOS DOS PRODUTOS/.test(t))
        danfe += 6;
    if (/DANFE|DOCUMENTO AUXILIAR DA NOTA FISCAL/.test(t))
        danfe += 4;
    if (/CHAVE DE ACESSO/.test(t) && /44\s*D[IÍ]GITOS/.test(t))
        danfe += 3;
    if (/PEDIDO DE COMPRA|PEDIDO\s+N[ºO°]|PEDIDO\b/.test(t))
        pedido += 5;
    if (/ORDEM DE COMPRA|ORDEM DE PEDIDO|SOLICITA[CÇ][AÃ]O DE COMPRA/.test(t))
        pedido += 5;
    if (/OR[CÇ]AMENTO|COTA[CÇ][AÃ]O|PROPOSTA COMERCIAL/.test(t))
        orc += 5;
    if (/ITEM\s+DESCRI[CÇ][AÃ]O/.test(t) || /SKU\s+DESCRI[CÇ][AÃ]O/.test(t))
        pedido += 2;
    const sample = lines.slice(0, 80).join(' ');
    if (/QTDE?\b|QTD\b|QUANT\.?\b/.test(upper(sample)))
        pedido += 1;
    if (/PRE[CÇ]O\s+UNIT|VL\.?\s*UNIT|UNIT[AÁ]RIO/.test(upper(sample)))
        pedido += 1;
    const score = Math.max(danfe, pedido, orc);
    if (!score)
        return { profile: 'generic', confidence: 0.45 };
    if (danfe === score)
        return { profile: 'danfe', confidence: Math.min(.99, .68 + danfe * .05) };
    if (pedido === score)
        return { profile: 'pedido', confidence: Math.min(.97, .66 + pedido * .05) };
    return { profile: 'orcamento', confidence: Math.min(.95, .66 + orc * .05) };
}
function groupWordsIntoLines(words) {
    const sorted = [...words].sort((a, b) => a.page - b.page || a.y - b.y || a.x - b.x);
    const groups = [];
    for (const word of sorted) {
        const last = groups[groups.length - 1];
        const tolerance = Math.max(2.2, word.height * 0.55);
        if (!last || last.page !== word.page || Math.abs(last.y - word.y) > tolerance) {
            groups.push({ page: word.page, y: word.y, words: [word] });
        }
        else {
            last.words.push(word);
            last.y = (last.y * 0.65) + (word.y * 0.35);
        }
    }
    return groups.map(g => g.words.sort((a, b) => a.x - b.x).map(w => w.text).join(' ').replace(/\s+/g, ' ').trim()).filter(Boolean);
}
function parseDanfeRow(line) {
    const raw = line.trim();
    if (!raw || EXCLUDE_LINE_RE.test(raw) || HEADER_RE.test(raw) && !/\d/.test(raw))
        return null;
    const t = tokenise(raw);
    if (t.length < 4)
        return null;
    let codeIdx = t.findIndex(looksLikeCode);
    if (codeIdx < 0 && /^\d{4}$/.test(t[0]))
        codeIdx = 0;
    if (codeIdx < 0)
        return null;
    let code = cleanToken(t[codeIdx]);
    if (/^\d{1,4}$/.test(code) && t[codeIdx + 1] && looksLikeCode(t[codeIdx + 1])) {
        codeIdx += 1;
        code = cleanToken(t[codeIdx]);
    }
    const after = t.slice(codeIdx + 1);
    const unitIdx = after.findIndex(x => UNIT_RE.test(x.replace(/[.,:]/g, '')));
    let unit = 'un';
    let qty = 0;
    let qtyIdx = -1;
    let unitPrice = 0;
    let total = 0;
    if (unitIdx >= 0) {
        unit = upper(after[unitIdx]).replace('PÇ', 'PC').toLowerCase();
        const numericAfterUnit = [];
        after.slice(unitIdx + 1).forEach((x, i) => {
            const c = x.replace(/[()]/g, '');
            if (NUMBER_TOKEN_RE.test(c) || MONEY_TOKEN_RE.test(c))
                numericAfterUnit.push({ idx: unitIdx + 1 + i, value: brNumber(c), token: c });
        });
        if (numericAfterUnit.length) {
            qtyIdx = numericAfterUnit[0].idx;
            qty = numericAfterUnit[0].value;
            if (numericAfterUnit[1])
                unitPrice = numericAfterUnit[1].value;
            if (numericAfterUnit[2])
                total = numericAfterUnit[2].value;
        }
    }
    else {
        const nums = after.map((x, idx) => ({ idx, value: brNumber(x), token: x })).filter(x => NUMBER_TOKEN_RE.test(x.token) || MONEY_TOKEN_RE.test(x.token));
        if (nums.length >= 2) {
            total = nums[nums.length - 1].value;
            unitPrice = nums[nums.length - 2].value;
            if (nums.length >= 3) {
                qty = nums[nums.length - 3].value;
                qtyIdx = nums[nums.length - 3].idx;
            }
        }
    }
    if (!(qty > 0) || !(unitPrice >= 0))
        return null;
    const endDesc = unitIdx >= 0 ? unitIdx : (qtyIdx >= 0 ? qtyIdx : Math.max(0, after.length - 2));
    let descTokens = after.slice(0, endDesc);
    descTokens = descTokens.filter((x, i) => !(i > 0 && /^\d{8}$/.test(x)) && !/^\d{4}$/.test(x));
    let description = descTokens.join(' ').replace(/\s{2,}/g, ' ').trim();
    description = description.replace(/^[-:–]+|[-:–]+$/g, '').trim();
    if (!description || description.length < 2)
        return null;
    const warnings = [];
    let confidence = 0.55;
    if (looksLikeCode(code))
        confidence += .14;
    if (qty > 0)
        confidence += .1;
    if (unitPrice > 0)
        confidence += .12;
    if (total > 0 && Math.abs(total - qty * unitPrice) <= Math.max(.05, total * .035))
        confidence += .08;
    else if (total > 0)
        warnings.push('Total da linha não confere exatamente com quantidade × preço unitário.');
    if (description.length > 5)
        confidence += .05;
    if (!unit)
        warnings.push('Unidade não identificada.');
    return { code, description: upper(description), quantity: qty, unit, unitCost: unitPrice, totalCost: total || undefined, sourceLine: raw, confidence: Math.min(.99, confidence), warnings };
}
function parseGenericLine(line) {
    const raw = line.trim();
    if (!raw || raw.length < 8 || EXCLUDE_LINE_RE.test(raw))
        return null;
    const t = tokenise(raw);
    if (t.length < 4)
        return null;
    if (/^(TOTAL|SUBTOTAL|PAGAMENTO|FRETE|DESCONTO|OBSERV)/i.test(raw))
        return null;
    let codeIdx = t.findIndex(looksLikeCode);
    let sequenceIdx = -1;
    if (/^\d{1,4}$/.test(t[0])) {
        const next = t.findIndex((x, i) => i > 0 && looksLikeCode(x));
        if (next > 0 && next <= 2) {
            sequenceIdx = 0;
            codeIdx = next;
        }
        else if (t[0].length >= 4)
            codeIdx = 0;
        else {
            sequenceIdx = 0;
            if (codeIdx === 0)
                codeIdx = -1;
        }
    }
    if (codeIdx < 0) {
        codeIdx = -1;
    }
    const start = codeIdx >= 0 ? codeIdx + 1 : (sequenceIdx >= 0 ? 1 : 0);
    const rest = t.slice(start);
    const numeric = rest.map((x, idx) => ({ idx, value: brNumber(x), token: x })).filter(x => NUMBER_TOKEN_RE.test(x.token) || MONEY_TOKEN_RE.test(x.token));
    if (numeric.length < 2)
        return null;
    const unitIn = rest.findIndex(x => UNIT_RE.test(x.replace(/[.,:]/g, '')));
    let unit = unitIn >= 0 ? upper(rest[unitIn]).replace('PÇ', 'PC').toLowerCase() : 'un';
    let qty = 0, unitCost = 0, total = 0, qtyIdx = -1, priceIdx = -1;
    const tolerance = .03;
    for (let a = 0; a < numeric.length; a++) {
        for (let b = a + 1; b < numeric.length; b++) {
            const q = numeric[a].value, p = numeric[b].value;
            if (!(q > 0) || !(p > 0))
                continue;
            for (let c = b + 1; c < numeric.length; c++) {
                const tot = numeric[c].value;
                if (tot > 0 && Math.abs(q * p - tot) <= Math.max(.05, tot * tolerance)) {
                    qty = q;
                    unitCost = p;
                    total = tot;
                    qtyIdx = numeric[a].idx;
                    priceIdx = numeric[b].idx;
                    break;
                }
            }
            if (qty)
                break;
        }
        if (qty)
            break;
    }
    if (!qty) {
        total = numeric[numeric.length - 1].value;
        unitCost = numeric[numeric.length - 2].value;
        qty = numeric.length >= 3 ? numeric[numeric.length - 3].value : 1;
        qtyIdx = numeric.length >= 3 ? numeric[numeric.length - 3].idx : -1;
        priceIdx = numeric[numeric.length - 2].idx;
    }
    if (!(qty > 0) || !(unitCost >= 0))
        return null;
    let descEnd = qtyIdx >= 0 ? qtyIdx : priceIdx;
    if (unitIn >= 0 && unitIn < descEnd)
        descEnd = unitIn;
    const descTokens = rest.slice(0, Math.max(1, descEnd)).filter((x, i) => {
        if (/^\d{4,8}$/.test(x) && i < 4)
            return false;
        return !UNIT_RE.test(x);
    });
    const description = upper(descTokens.join(' ')).replace(/^[-:–]+|[-:–]+$/g, '').trim();
    if (!description || description.length < 3 || HEADER_RE.test(description))
        return null;
    const code = codeIdx >= 0 ? cleanToken(t[codeIdx]) : '—';
    let confidence = 0.47;
    const warnings = [];
    if (code !== '—')
        confidence += .12;
    if (unitIn >= 0)
        confidence += .08;
    if (qty > 0)
        confidence += .1;
    if (unitCost > 0)
        confidence += .1;
    if (total > 0 && Math.abs(total - qty * unitCost) <= Math.max(.05, total * .03))
        confidence += .1;
    else if (total > 0)
        warnings.push('Relação quantidade × preço × total não fechou perfeitamente.');
    if (code === '—')
        warnings.push('Código não identificado; item requer conferência manual.');
    return { code, description, quantity: qty, unit, unitCost, totalCost: total || undefined, sourceLine: raw, confidence: Math.min(.94, confidence), warnings };
}
function dedupeItems(items) {
    const map = new Map();
    for (const item of items) {
        const key = `${item.code}|${normalize(item.description)}|${item.quantity}|${item.unitCost.toFixed(4)}`;
        const prev = map.get(key);
        if (!prev || item.confidence > prev.confidence)
            map.set(key, item);
    }
    return [...map.values()];
}
function extractMetadata(rawText) {
    const t = normalize(rawText);
    const key = (t.match(/\b\d{44}\b/) ?? [])[0];
    const cnpj = (t.match(/\b\d{2}[.\s]?\d{3}[.\s]?\d{3}[\/\s]?\d{4}[-\s]?\d{2}\b/) ?? [])[0]?.replace(/\s/g, '');
    const issueDate = dateFromText(t);
    const number = parseHeaderValue(t, [/(?:N[ÚU]MERO|N[ºO°]|NF-?E)\s*[:#]?\s*(\d{1,12})\b/i, /NOTA\s+FISCAL\s*[:#]?\s*(\d{1,12})\b/i]);
    const totalRaw = (t.match(/VALOR\s+TOTAL[^\n\r0-9]{0,100}(?:R\$\s*)?([\d.]+,\d{2})/i) ?? [])[1];
    const total = totalRaw ? brNumber(totalRaw) : undefined;
    let supplierName;
    const emitter = t.match(/IDENTIFICA[CÇ][AÃ]O\s+DO\s+EMITENTE\s+([^\n\r]{3,120})/i);
    if (emitter?.[1])
        supplierName = emitter[1].trim();
    if (!supplierName) {
        const genericSupplier = t.match(/(?:FORNECEDOR|EMITENTE|EMPRESA|RAZ[AÃ]O\s+SOCIAL)\s*[:#-]?\s*([A-Z0-9][^\n\r]{3,100})/i);
        if (genericSupplier?.[1])
            supplierName = genericSupplier[1].replace(/\s{2,}/g, ' ').trim();
    }
    return { number, key, cnpj, issueDate, total, supplierName };
}
function analyzeTextDocument(rawText, explicitProfile) {
    const normalized = rawText.replace(/\r/g, '').replace(/[\u00A0\t]+/g, ' ');
    const lines = normalized.split('\n').map(x => x.replace(/\s+/g, ' ').trim()).filter(Boolean);
    const profileInfo = explicitProfile ? { profile: explicitProfile, confidence: 1 } : detectProfile(normalized, lines);
    let items = [];
    const warnings = [];
    const danfeItems = lines.map(parseDanfeRow).filter((x) => !!x);
    const generic = lines.map(parseGenericLine).filter((x) => !!x);
    if (profileInfo.profile === 'danfe' && danfeItems.length) {
        const knownCodes = new Set(danfeItems.map(x => normalize(x.code)).filter(Boolean));
        const supplements = generic.filter(x => !knownCodes.has(normalize(x.code)));
        items = [...danfeItems, ...supplements];
    }
    else {
        items = generic;
    }
    items = dedupeItems(items);
    items = items.filter(x => x.confidence >= .53 && x.description.length >= 3);
    if (!items.length)
        warnings.push('Nenhuma linha de item foi reconhecida automaticamente. O documento pode ser escaneado, tabelado por imagem ou exigir mapeamento manual.');
    if (lines.length && items.length < Math.max(1, Math.floor(lines.length * .03)))
        warnings.push('Poucas linhas foram reconhecidas; revise todos os itens antes de confirmar.');
    if (/PEDIDO|ORDEM DE COMPRA|OR[CÇ]AMENTO|COTA[CÇ][AÃ]O/.test(upper(normalized)) && profileInfo.profile !== 'danfe')
        warnings.push('Documento tratado como pedido/orçamento. A estrutura de colunas foi inferida dinamicamente, não pelo layout DANFE.');
    const metadata = extractMetadata(normalized);
    const averageConfidence = items.length ? items.reduce((s, x) => s + x.confidence, 0) / items.length : 0;
    return {
        profile: profileInfo.profile,
        profileConfidence: Math.min(.99, (profileInfo.confidence + averageConfidence) / 2),
        pages: 1,
        rawText: normalized,
        metadata,
        items,
        warnings
    };
}
async function readPdfSmartStandalone(file) {
    const pdfjs = window.pdfjsLib;
    if (!pdfjs)
        throw new Error('Leitor PDF indisponível. Abra a aplicação com internet para carregar o PDF.js ou use o projeto com dependências locais.');
    try {
        pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
    catch { }
    const data = new Uint8Array(await file.arrayBuffer());
    const pdf = await pdfjs.getDocument({ data }).promise;
    const pageBlocks = [];
    let wordCount = 0;
    for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
        const page = await pdf.getPage(pageNo);
        const content = await page.getTextContent();
        const words = [];
        const viewport = page.getViewport({ scale: 1 });
        for (const raw of content.items) {
            const text = String(raw.str ?? '').trim();
            if (!text)
                continue;
            const x = Number(raw.transform?.[4] ?? 0);
            const y = viewport.height - Number(raw.transform?.[5] ?? 0) - Number(raw.height ?? 0);
            const width = Number(raw.width ?? 0);
            const height = Number(raw.height ?? 0);
            words.push({ text, x, y, width, height, page: pageNo });
            wordCount++;
        }
        pageBlocks.push(groupWordsIntoLines(words).join('\n'));
    }
    if (!wordCount) {
        return {
            profile: 'generic', profileConfidence: 0, pages: pdf.numPages, rawText: '', metadata: {}, items: [],
            warnings: ['O PDF não contém texto selecionável. Ele provavelmente é um PDF escaneado/imagem e precisa de OCR.']
        };
    }
    const result = analyzeTextDocument(pageBlocks.join('\n'));
    result.pages = pdf.numPages;
    return result;
}
async function parsePdfMetadata(file) { return readPdfSmartStandalone(file); }
async function imageDHash(blob) { const w = 9, h = 8; const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h; const ctx = canvas.getContext('2d', { willReadFrequently: true }); if (!ctx)
    throw new Error('Canvas não disponível'); const url = URL.createObjectURL(blob); try {
    const img = await new Promise((resolve, reject) => { const el = new Image(); el.onload = () => resolve(el); el.onerror = () => reject(new Error('Imagem inválida.')); el.src = url; });
    ctx.drawImage(img, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h).data;
    let bits = '';
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < 8; x++) {
            const i = (y * w + x) * 4, j = (y * w + x + 1) * 4, a = .299 * data[i] + .587 * data[i + 1] + .114 * data[i + 2], b = .299 * data[j] + .587 * data[j + 1] + .114 * data[j + 2];
            bits += a > b ? '1' : '0';
        }
    }
    let hex = '';
    for (let i = 0; i < 64; i += 4)
        hex += parseInt(bits.slice(i, i + 4), 2).toString(16);
    return hex;
}
finally {
    URL.revokeObjectURL(url);
} }
function hammingHex(a, b) { if (!a || !b)
    return 99; let d = 0; for (let i = 0; i < Math.min(a.length, b.length); i++) {
    let x = parseInt(a[i], 16) ^ parseInt(b[i], 16);
    while (x) {
        d += x & 1;
        x >>= 1;
    }
} return d + Math.abs(a.length - b.length) * 4; }
async function detectBarcodeFromImage(blob) { try {
    const Detector = globalThis.BarcodeDetector;
    if (!Detector)
        return;
    const detector = new Detector({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'qr_code', 'data_matrix'] });
    const bitmap = await createImageBitmap(blob);
    try {
        const codes = await detector.detect(bitmap);
        return codes?.[0]?.rawValue ? String(codes[0].rawValue) : undefined;
    }
    finally {
        bitmap.close?.();
    }
}
catch {
    return undefined;
} }
async function searchByPhoto(file) { if (!file.type.startsWith('image/')) {
    toast('Selecione uma imagem.', 'warning');
    return;
} photoSearchFile = file; pendingPhotoFile = undefined; let code = await detectBarcodeFromImage(file); if (code) {
    const p = productCodeIndex.get(code) ?? state.products.find(x => normalizedCode(x.code) === normalizedCode(code) || x.code === code);
    if (p) {
        closeModal();
        openProductDrawer(p.id);
        toast(`Produto localizado pelo código ${code}`);
        return;
    }
} let hash; try {
    hash = await imageDHash(file);
}
catch { } const matches = hash ? state.products.filter(p => p.active && p.photoHash).map(p => ({ p, d: hammingHex(hash, p.photoHash) })).sort((a, b) => a.d - b.d).slice(0, 6) : []; const url = URL.createObjectURL(file); const rows = matches.filter(x => x.d <= 22).map(x => { const score = Math.max(0, Math.round(100 - (x.d / 64) * 100)); return `<button class="photo-match" data-product="${x.p.id}"><span class="photo-match-score">${score}%</span><span><b>${esc(x.p.name)}</b><small>${esc(x.p.code)} · ${qty(x.p.currentStock)} ${esc(x.p.unit)}</small></span>${icon('arrow', 14)}</button>`; }).join(''); showModal('Busca por foto', `<div class="photo-search-panel"><img class="photo-search-preview" src="${url}" alt="Foto para busca"/>${rows ? `<div class="modal-subtitle">Correspondências locais</div><div class="photo-match-list">${rows}</div>` : `<div class="empty-state mini"><div class="empty-icon">${icon('search', 25)}</div><b>Nenhuma correspondência local</b><span>Cadastre uma foto de referência no produto para habilitar a comparação visual offline.</span></div>`}<div class="modal-actions"><button class="btn btn-secondary" data-action="close-modal">Fechar</button><button class="btn btn-primary" data-action="new-product-from-photo">${icon('plus', 15)} Novo produto com esta foto</button></div></div>`); setTimeout(() => URL.revokeObjectURL(url), 30000); }
function normalizedCode(value) { return value.toUpperCase().replace(/[^A-Z0-9]/g, '').replace(/^0+/, '') || '0'; }
function tokenSimilarity(a, b) { const aa = norm(a).split(/\s+/).filter(x => x.length > 1), bb = norm(b).split(/\s+/).filter(x => x.length > 1); if (!aa.length || !bb.length)
    return 0; const B = new Set(bb), overlap = aa.filter(x => B.has(x)).length, base = overlap / Math.max(aa.length, bb.length); const ca = norm(a).replace(/\s/g, ''), cb = norm(b).replace(/\s/g, ''), max = Math.max(ca.length, cb.length); let same = 0; for (let i = 0; i < Math.min(ca.length, cb.length); i++)
    if (ca[i] === cb[i])
        same++; return Math.min(1, base * .72 + (max ? same / max : 0) * .28); }
function matchImportedItem(item) { const code = String(item.code || '').trim(); if (code && code !== '—') {
    const exact = productCodeIndex.get(code);
    if (exact)
        return { product: exact, confidence: 1, method: 'codigo-exato' };
    const nc = normalizedCode(code), by = productNormalizedCodeIndex.get(nc) || [];
    if (nc !== '0' && by.length === 1)
        return { product: by[0], confidence: .97, method: 'codigo-normalizado' };
} const exactName = productNameIndex.get(norm(item.description)); if (exactName)
    return { product: exactName, confidence: .95, method: 'nome-exato' }; let best, bs = 0, second = 0; for (const p of state.products) {
    const sc = tokenSimilarity(item.description, p.name);
    if (sc > bs) {
        second = bs;
        bs = sc;
        best = p;
    }
    else if (sc > second)
        second = sc;
} if (best && bs >= .84 && bs - second >= .08)
    return { product: best, confidence: bs, method: 'nome-aproximado' }; return { confidence: bs, method: 'sem-match' }; }
function applyImportedItems(resultItems, nfeId) { return resultItems.map(item => { const m = matchImportedItem(item), ex = item.confidence ?? .5, mc = m.product ? m.confidence : Math.min(.84, m.confidence); let status = 'new'; if (m.product && mc >= .84 && ex >= .62)
    status = 'update';
else if (!m.product && ex < .62)
    status = 'review'; const warnings = [...(item.warnings || [])]; if (!m.product)
    warnings.push('Produto não localizado no cadastro atual. Será tratado como novo após conferência.'); if (m.product && mc < .95)
    warnings.push('Correspondência aproximada; confira o cadastro antes de confirmar.'); return { id: uid('nfei'), nfeId, code: item.code || '—', description: item.description, quantity: item.quantity, unit: item.unit || 'un', unitCost: item.unitCost || 0, matchedProductId: m.product?.id, confidence: ex, matchConfidence: mc, matchMethod: m.method, sourceLine: item.sourceLine, warnings, status }; }); }
async function importTextOrder(text, name) { const result = analyzeTextDocument(text); if (!result.items.length) {
    toast('Nenhum item identificável no pedido. Revise o texto ou use CSV.', 'error');
    return;
} const n = { id: uid('nfe'), sourceName: name, sourceType: 'manual', status: 'review', createdAt: now(), number: result.metadata.number, key: result.metadata.key, cnpj: result.metadata.cnpj, issueDate: result.metadata.issueDate, total: result.metadata.total, supplierName: result.metadata.supplierName, readerProfile: result.profile, readerConfidence: result.profileConfidence, parseWarnings: result.warnings, note: `Leitura inteligente de texto · ${result.profile}` }; const items = applyImportedItems(result.items, n.id); state.nfe.unshift(n); state.nfeItems.push(...items); await db.put('nfe', n); await db.bulkPut('nfeItems', items); log('import', `Pedido importado: ${name}`, `${items.length} itens · ${result.profile} · ${Math.round(result.profileConfidence * 100)}%`, 'nfe', n.id); toast(`${items.length} itens reconhecidos`, 'success'); renderPage(); }
async function importFile(file) { const ext = file.name.split('.').pop()?.toLowerCase(); if (ext === 'json') {
    try {
        await importSnapshot(JSON.parse(await file.text()), file.name);
    }
    catch {
        toast('JSON inválido', 'error');
    }
}
else if (ext === 'csv' || file.type === 'text/csv') {
    await importCsv(await file.text(), file.name);
}
else if (ext === 'txt' || file.type === 'text/plain') {
    await importTextOrder(await file.text(), file.name);
}
else if (ext === 'pdf' || file.type === 'application/pdf') {
    try {
        const result = await parsePdfMetadata(file);
        const n = { id: uid('nfe'), sourceName: file.name, sourceType: 'pdf', status: result.items.length ? 'review' : 'error', createdAt: now(), number: result.metadata.number, key: result.metadata.key, cnpj: result.metadata.cnpj, issueDate: result.metadata.issueDate, total: result.metadata.total, supplierName: result.metadata.supplierName, readerProfile: result.profile, readerConfidence: result.profileConfidence, parseWarnings: result.warnings, note: result.items.length ? `Leitura inteligente: ${result.profile} · ${result.items.length} itens.` : 'Nenhum item reconhecido automaticamente.' };
        const items = applyImportedItems(result.items, n.id);
        state.nfe.unshift(n);
        state.nfeItems.push(...items);
        await db.put('nfe', n);
        await db.put('nfeFiles', {
            id: n.id,
            nfeId: n.id,
            blob: file,
            mimeType: file.type || 'application/pdf',
            name: file.name,
            createdAt: n.createdAt,
        });
        if (items.length)
            await db.bulkPut('nfeItems', items);
        log('import', `PDF importado: ${file.name}`, `${items.length} itens · ${result.profile} · ${Math.round(result.profileConfidence * 100)}%`, 'nfe', n.id);
        toast(items.length ? `${items.length} itens reconhecidos. Revise a leitura.` : 'PDF lido, mas nenhum item foi reconhecido.', 'warning');
        renderPage();
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        const n = { id: uid('nfe'), sourceName: file.name, sourceType: 'pdf', status: 'error', createdAt: now(), parseWarnings: [message], note: 'Falha na leitura do PDF.' };
        state.nfe.unshift(n);
        await db.put('nfe', n);
        await db.put('nfeFiles', {
            id: n.id,
            nfeId: n.id,
            blob: file,
            mimeType: file.type || 'application/pdf',
            name: file.name,
            createdAt: n.createdAt,
        });
        log('import', `Erro ao ler PDF: ${file.name}`, message, 'nfe', n.id);
        toast(message, 'error');
        renderPage();
    }
}
else
    toast('Formato não suportado', 'error'); }
async function importCsv(text, name) {
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) {
        toast('CSV vazio', 'error');
        return;
    }

    const headers = lines[0].split(';').map(x => norm(x));
    const idx = (...names) => headers.findIndex(h => names.some(n => h.includes(n)));
    const iCode = idx('codigo', 'id', 'sku');
    const iName = idx('produto', 'nome', 'descricao');
    const iQty = idx('quantidade', 'qtd');
    const iUnit = idx('unidade', 'un');
    const iCost = idx('preco', 'custo', 'valor');

    const candidates = [];
    for (const [offset, line] of lines.slice(1).entries()) {
        const cells = line.split(';');
        const nameValue = (cells[iName] || '').trim();
        if (!nameValue) continue;

        candidates.push({
            code: (cells[iCode] || '').trim() || '—',
            name: nameValue,
            unit: (cells[iUnit] || '').trim() || 'un',
            categoryName: 'Outros',
            currentStock: Math.max(0, Number((cells[iQty] || '0').replace(',', '.')) || 0),
            minimumStock: 0,
            currentCost: Math.max(0, Number((cells[iCost] || '0').replace('.', '').replace(',', '.')) || 0),
            averageCost: Math.max(0, Number((cells[iCost] || '0').replace('.', '').replace(',', '.')) || 0),
            supplierName: undefined,
            __csvRow: offset + 2,
        });
    }

    const validation = validateImportedProducts(candidates);
    if (!validation.ok) {
        toast(`CSV rejeitado: ${validation.errors.length} linha(s) inválida(s).`, 'error');
        return;
    }

    const n = {
        id: uid('nfe'),
        sourceName: name,
        sourceType: 'csv',
        status: 'new',
        createdAt: now(),
        note: `${validation.products.length} linhas importadas`,
    };

    await db.put('nfe', n);
    state.nfe.unshift(n);

    let applied = 0;
    for (const raw of validation.products) {
        const p = state.products.find(x => (raw.code !== '—' && x.code === raw.code) || norm(x.name) === norm(raw.name));
        if (!p) continue;

        if (raw.currentStock > 0) {
            const stockCheck = validateStockMovement({
                currentStock: p.currentStock,
                type: 'entrada',
                quantity: raw.currentStock,
                allowNegativeStock: state.config.allowNegativeStock,
            });
            if (!stockCheck.ok) {
                n.status = 'error';
                n.note = stockCheck.message;
                await db.put('nfe', n);
                toast(`Importação interrompida: ${stockCheck.message}`, 'error');
                return;
            }
        }

        const cost = raw.currentCost || p.currentCost;
        p.currentCost = cost;
        p.currentStock = p.currentStock + raw.currentStock;
        p.averageCost = p.averageCost ? p.averageCost : raw.averageCost;
        p.updatedAt = now();
        await db.put('products', p);

        if (raw.currentStock > 0) {
            const movement = {
                id: uid('mov'),
                productId: p.id,
                productCode: p.code,
                productName: p.name,
                type: 'entrada',
                quantity: raw.currentStock,
                unitCost: cost,
                document: name,
                createdAt: now(),
            };
            state.movements.unshift(movement);
            await db.put('movements', movement);
        }
        applied++;
    }

    n.status = 'processed';
    await db.put('nfe', n);
    log('import', `CSV processado: ${name}`, `${applied} produtos atualizados`, 'nfe', n.id);
    toast(`Importação concluída: ${applied} produtos`);
    renderPage();
}
async function importSnapshot(parsed, name) {
    const rawProducts = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed.products)
            ? parsed.products
            : Array.isArray(parsed.produtos)
                ? parsed.produtos
                : [];

    if (!rawProducts.length) {
        toast('Backup sem produtos', 'error');
        return;
    }

    const validation = validateImportedProducts(rawProducts);
    if (!validation.ok) {
        toast(`Backup rejeitado: ${validation.errors.length} registro(s) inválido(s).`, 'error');
        return;
    }

    const ok = confirm(`Importar ${validation.products.length} produtos do arquivo “${name}”?\\n\\nOK = mesclar\\nCancelar = abortar`);
    if (!ok) return;

    let created = 0;
    let updated = 0;

    for (const raw of validation.products) {
        const code = raw.code.trim();
        const nameValue = raw.name.trim().toUpperCase();
        const found = state.products.find(p => p.code === code && norm(p.name) === norm(nameValue));

        if (found) {
            Object.assign(found, {
                currentCost: raw.currentCost || found.currentCost,
                averageCost: raw.averageCost || found.averageCost,
                currentStock: raw.currentStock,
                minimumStock: raw.minimumStock,
            });
            await db.put('products', found);
            updated++;
            continue;
        }

        const catName = raw.categoryName;
        let cat = state.categories.find(c => c.name === catName);
        if (!cat) {
            cat = {
                id: uid('cat'),
                name: catName,
                icon: CATEGORY_META[catName]?.icon ?? 'Lista',
                tone: CATEGORY_META[catName]?.tone ?? 'slate',
            };
            state.categories.push(cat);
            await db.put('categories', cat);
        }

        const supplierName = raw.supplierName?.trim() || '';
        let supplierId;
        if (supplierName && supplierName !== '?' && supplierName !== '—') {
            let supplier = state.suppliers.find(x => x.name === supplierName);
            if (!supplier) {
                supplier = {
                    id: uid('sup'),
                    name: supplierName,
                    active: true,
                    createdAt: now(),
                    updatedAt: now(),
                };
                state.suppliers.push(supplier);
                await db.put('suppliers', supplier);
            }
            supplierId = supplier.id;
        }

        const product = {
            id: uid('p'),
            code,
            name: nameValue,
            supplierId,
            supplierNameLegacy: supplierName,
            categoryId: cat.id,
            unit: raw.unit,
            currentStock: raw.currentStock,
            minimumStock: raw.minimumStock,
            reservedStock: 0,
            currentCost: raw.currentCost,
            averageCost: raw.averageCost,
            active: true,
            createdAt: now(),
            updatedAt: now(),
            legacySource: 'v8-import',
        };

        state.products.push(product);
        await db.put('products', product);
        created++;
    }

    rebuildIndexes();
    log('import', `Backup importado: ${name}`, `${created} novos · ${updated} atualizados`);
    toast(`Importação concluída: ${created} novos · ${updated} atualizados`);
    renderPage();
}
function exportSnapshot() { const snapshot = { products: state.products, suppliers: state.suppliers, categories: state.categories, movements: state.movements, nfe: state.nfe, nfeItems: state.nfeItems, quotes: state.quotes, audit: state.audit, config: state.config }; downloadText(`almoxarifado-v9-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(snapshot, null, 2), 'application/json'); log('export', 'Backup JSON exportado', 'Snapshot completo'); toast('Backup JSON exportado'); }
function exportCsv() { const rows = [['Código', 'Produto', 'Fornecedor', 'Categoria', 'Unidade', 'Estoque', 'Mínimo', 'Custo atual', 'Valor estoque', 'Status']]; for (const p of state.products) {
    rows.push([p.code, p.name, getSupplier(p.supplierId)?.name || p.supplierNameLegacy || '', getCategory(p.categoryId)?.name || '', p.unit, String(p.currentStock).replace('.', ','), String(p.minimumStock).replace('.', ','), String(p.currentCost).replace('.', ','), String(p.currentStock * p.currentCost).replace('.', ','), statusLabel(statusFor(p))]);
} downloadText('almoxarifado-produtos.csv', rows.map(r => r.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(';')).join('\n'), 'text/csv;charset=utf-8'); log('export', 'CSV de produtos exportado'); toast('CSV exportado'); }
function downloadText(name, text, type) { const blob = new Blob([text], { type }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 500); }
function quickSearchItems(q) {
    const query = norm(q);
    const items = [];
    if (query) {
        for (const p of state.products.filter(p => p.active)) {
            const supplier = getSupplier(p.supplierId)?.name || p.supplierNameLegacy || 'Sem fornecedor';
            const category = getCategory(p.categoryId)?.name || 'Outros';
            if (norm(`${p.name} ${p.code} ${supplier} ${category}`).includes(query))
                items.push({ kind: 'product', id: p.id, title: p.name, meta: `${p.code} · ${supplier}`, icon: 'box' });
            if (items.length >= 8)
                break;
        }
        if (items.length < 10)
            for (const sp of state.suppliers.filter(s => s.active)) {
                if (norm(`${sp.name} ${sp.cnpj || ''} ${sp.contact || ''} ${sp.phone || ''}`).includes(query))
                    items.push({ kind: 'supplier', id: sp.id, title: sp.name, meta: `Fornecedor${sp.cnpj ? ' · ' + sp.cnpj : ''}`, icon: 'building' });
                if (items.length >= 10)
                    break;
            }
        if (items.length < 10)
            for (const n of state.nfe) {
                if (norm(`${n.number || ''} ${n.supplierName || ''} ${n.sourceName || ''} ${n.status || ''}`).includes(query))
                    items.push({ kind: 'nfe', id: n.id, title: n.number ? `NF-e ${n.number}` : n.sourceName, meta: `${n.supplierName || 'Fornecedor não identificado'} · ${n.status}`, icon: 'file' });
                if (items.length >= 10)
                    break;
            }
    }
    return items.slice(0, 10);
}
function quickSearchHtml(q = '') {
    const results = quickSearchItems(q);
    if (!q.trim())
        return `<div class="quick-empty">${icon('search', 22)}<b>Pesquise em todo o almoxarifado</b><span>Produto, código, fornecedor ou NF-e.</span></div><div class="command-list">${[['photo-search', 'Buscar por foto', 'camera'], ['new-product', 'Novo produto', 'box'], ['new-movement', 'Registrar movimentação', 'layers'], ['import-nfe', 'Importar NF-e', 'filePlus'], ['inventory', 'Abrir inventário', 'clipboard']].map(x => `<button class="command-item" data-action="${x[0]}"><span>${icon(x[2], 17)}</span><b>${x[1]}</b>${icon('arrow', 14)}</button>`).join('')}</div>`;
    if (!results.length)
        return `<div class="quick-empty compact">${icon('search', 20)}<b>Nenhum resultado</b><span>Tente outro nome, código, fornecedor ou número da NF-e.</span></div>`;
    return `<div class="quick-results">${results.map(r => `<button class="quick-result" ${r.kind === 'product' ? `data-product="${r.id}"` : r.kind === 'supplier' ? `data-supplier="${r.id}"` : `data-nfe="${r.id}"`}><span class="quick-result-icon">${icon(r.icon, 17)}</span><span class="quick-result-text"><b>${esc(r.title)}</b><small>${esc(r.meta)}</small></span>${icon('arrow', 14)}</button>`).join('')}</div>`;
}
function commandPalette(initial = '') { showModal('Pesquisa rápida', `<div class="quick-search-wrap"><span class="quick-search-icon">${icon('search', 18)}</span><input id="command-search" class="quick-search-input" value="${esc(initial)}" autocomplete="off" placeholder="Digite produto, código, fornecedor ou NF-e..." /><kbd>ESC</kbd></div><div id="quick-search-results">${quickSearchHtml(initial)}</div>`); setTimeout(() => { const input = document.getElementById('command-search'); input?.focus(); input?.setSelectionRange(input.value.length, input.value.length); }, 40); }
function updateQuickSearch() { const input = document.getElementById('command-search'); const root = document.getElementById('quick-search-results'); if (input && root)
    root.innerHTML = quickSearchHtml(input.value); }
function closeDrawer() { const root = document.getElementById('drawer-root'); if (!root)
    return; const ov = $q(root, '.drawer-overlay'); ov?.classList.remove('open'); setTimeout(() => root.innerHTML = '', 160); }
function closeModal() { document.getElementById('modal-root').innerHTML = ''; }
async function applyConfig() { const negative = document.getElementById('cfg-negative')?.checked; const lite = document.getElementById('cfg-lite')?.checked; if (negative !== undefined) {
    state.config.allowNegativeStock = negative;
    state.config.defaultMinimumStock = Math.max(0, Number(document.getElementById('cfg-min').value) || 0);
    if (lite !== undefined)
        state.config.liteMode = lite;
    await db.put('config', state.config);
    $q(document, '.app-shell')?.classList.toggle('lite-mode', !!state.config.liteMode);
    log('system', 'Configurações atualizadas', `Modo Lite: ${state.config.liteMode ? 'ativado' : 'desativado'}`);
    toast('Configurações salvas');
} }
async function shareApp() { const url = location.href.split('?')[0]; try {
    if (navigator.share) {
        await navigator.share({ title: 'Almoxarifado', text: 'Acessar o Almoxarifado', url });
        return;
    }
    if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        toast('Endereço copiado');
        return;
    }
}
catch { } toast('Não foi possível compartilhar o acesso.', 'warning'); }
function printReport() { window.print(); }
function wire() {
    document.addEventListener('click', async (e) => {
        const t = e.target as HTMLElement;
        const v = t.closest('[data-view]');
        if (v) {
            closeModal();
            state.view = v.dataset.view;
            state.mobileNav = false;
            renderPage();
            return;
        }
        const p = t.closest('[data-product]');
        if (p) {
            closeModal();
            openProductDrawer(p.dataset.product);
            return;
        }
        const s = t.closest('[data-supplier]');
        if (s) {
            closeModal();
            openSupplierDrawer(s.dataset.supplier);
            return;
        }
        const q = t.closest('[data-quote]');
        if (q) {
            openQuoteModal();
            return;
        }
        const n = t.closest('[data-nfe]');
        if (n) {
            closeModal();
            openNfeDetail(n.dataset.nfe);
            return;
        }
        const c = t.closest('[data-category]');
        if (c) {
            state.view = 'products';
            state.categoryId = c.dataset.category || '';
            renderPage();
            return;
        }
        const a = t.closest('[data-action]');
        if (!a)
            return;
        const action = a.dataset.action;
        if (NAV.some(n => n.id === action)) {
            closeModal();
            state.view = action;
            state.mobileNav = false;
            renderPage();
            return;
        }
        if (action === 'toggle-nav') {
            if (window.matchMedia('(max-width:760px)').matches) {
                state.mobileNav = !state.mobileNav;
            }
            else {
                state.sidebarCollapsed = !state.sidebarCollapsed;
                state.mobileNav = false;
            }
            const shell = $q(document, '.app-shell');
            shell?.classList.toggle('sidebar-collapsed', state.sidebarCollapsed);
            shell?.classList.toggle('mobile-nav', state.mobileNav);
            $q(document, '.sidebar-backdrop')?.classList.toggle('open', state.mobileNav);
            $q(document, '.sidebar')?.classList.toggle('open', state.mobileNav);
            return;
        }
        if (action === 'theme') {
            state.theme = state.theme === 'dark' ? 'light' : 'dark';
            state.config.theme = state.theme;
            await db.put('config', state.config);
            const shell = $q(document, '.app-shell');
            shell?.classList.toggle('theme-light', state.theme === 'light');
            const tb = $q(document, '[data-action=theme]');
            if (tb)
                tb.innerHTML = state.theme === 'dark' ? icon('moon', 15) : icon('sun', 15);
            return;
        }
        if (action === 'photo-search') {
            document.getElementById('photo-search-file')?.click();
            return;
        }
        if (action === 'share-app') {
            await shareApp();
            return;
        }
        if (action === 'new-product') {
            pendingPhotoFile = undefined;
            closeModal();
            openProductDrawer();
            return;
        }
        if (action === 'new-product-from-photo') {
            pendingPhotoFile = photoSearchFile;
            closeModal();
            openProductDrawer();
            return;
        }
        if (action === 'new-supplier') {
            closeModal();
            openSupplierDrawer();
            return;
        }
        if (action === 'new-movement') {
            closeModal();
            openMovementModal();
            return;
        }
        if (action === 'new-quote') {
            closeModal();
            openQuoteModal();
            return;
        }
        if (action === 'import-nfe' || action === 'nfe-drop') {
            closeModal();
            document.getElementById('nfe-file')?.click();
            return;
        }
        if (action === 'import-backup') {
            document.getElementById('global-file')?.click();
            return;
        }
        if (action === 'export-json') {
            closeModal();
            exportSnapshot();
            return;
        }
        if (action === 'export-csv') {
            exportCsv();
            return;
        }
        if (action === 'print-report') {
            printReport();
            return;
        }
        if (action === 'command') {
            commandPalette();
            return;
        }
        if (action === 'clear-filters') {
            state.query = '';
            state.categoryId = '';
            state.supplierId = '';
            state.stockStatus = '';
            state.sort = 'name';
            renderPage();
            return;
        }
        if (action === 'close-drawer') {
            closeDrawer();
            return;
        }
        if (action === 'close-modal') {
            closeModal();
            return;
        }
        if (action === 'save-product') {
            await saveProduct(a.dataset.id || undefined);
            return;
        }
        if (action === 'delete-product') {
            await deleteProduct(a.dataset.id);
            return;
        }
        if (action === 'save-supplier') {
            await saveSupplier(a.dataset.id || undefined);
            return;
        }
        if (action === 'delete-supplier') {
            await deleteSupplier(a.dataset.id);
            return;
        }
        if (action === 'save-movement') {
            await saveMovement();
            return;
        }
        if (action === 'save-inventory') {
            await saveInventory();
            return;
        }
        if (action === 'save-quote') {
            await saveQuote();
            return;
        }
        if (action === 'process-nfe') {
            await processNfe(a.dataset.id);
            return;
        }
        if (action === 'set-nfe-item') {
            await setNfeItemStatus(a.dataset.id, a.dataset.status);
            return;
        }
        if (action === 'scan-code') {
            closeModal();
            scanCode();
            return;
        }
        if (action === 'lookup-code') {
            lookupCode();
            return;
        }
        if (action === 'delete-nfe') {
            await deleteNfe(a.dataset.id);
            return;
        }
        if (action === 'cancel-nfe') {
            await cancelNfe(a.dataset.id);
            return;
        }
        if (action === 'reopen-nfe') {
            await reopenNfe(a.dataset.id);
            return;
        }
    });
    document.addEventListener('input', e => { const t = e.target; if (t.id === 'command-search') {
        updateQuickSearch();
        return;
    } if (t.id === 'query') {
        const pos = t.selectionStart ?? t.value.length;
        state.query = t.value;
        schedulePageRender(pos);
        return;
    } if (t.matches('.inventory-input')) {
        const p = getProduct(t.dataset.product || '');
        const cell = $q(document, `[data-diff="${t.dataset.product}"]`);
        if (cell && p && t.value !== '') {
            const diff = Number(t.value) - p.currentStock;
            cell.textContent = (diff > 0 ? '+' : '') + qty(diff);
            cell.className = `inventory-diff ${diff === 0 ? 'zero' : diff > 0 ? 'positive' : 'negative'}`;
        }
        return;
    } });
    document.addEventListener('change', e => { const t = e.target; if (t.id === 'cat-filter') {
        state.categoryId = t.value;
        renderPage();
    }
    else if (t.id === 'supplier-filter') {
        state.supplierId = t.value;
        renderPage();
    }
    else if (t.id === 'stock-filter') {
        state.stockStatus = t.value;
        renderPage();
    }
    else if (t.id === 'sort-filter') {
        state.sort = t.value;
        renderPage();
    }
    else if (t.id === 'photo-search-file') {
        const file = t.files?.[0];
        if (file)
            searchByPhoto(file);
    }
    else if (t.id === 'nfe-file') {
        const file = t.files?.[0];
        if (file)
            importFile(file);
    }
    else if (t.id === 'global-file') {
        const file = t.files?.[0];
        if (file)
            importFile(file);
    }
    else if (t.id?.startsWith('cfg-')) {
        applyConfig();
    } });
    document.addEventListener('dragover', e => { const zone = e.target.closest('#nfe-drop'); if (zone) {
        e.preventDefault();
        zone.classList.add('dragging');
    } });
    document.addEventListener('dragleave', e => { const zone = e.target.closest('#nfe-drop'); if (zone)
        zone.classList.remove('dragging'); });
    document.addEventListener('drop', e => { const zone = e.target.closest('#nfe-drop'); if (zone) {
        e.preventDefault();
        zone.classList.remove('dragging');
        const file = e.dataTransfer?.files?.[0];
        if (file)
            importFile(file);
    } });
    document.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        commandPalette();
    } if (e.key === 'Escape') {
        closeModal();
        closeDrawer();
    } });
}
function mountHiddenInputs() { const a = document.createElement('input'); a.type = 'file'; a.id = 'global-file'; a.accept = '.json,.csv,.txt'; a.hidden = true; document.body.appendChild(a); const photo = document.createElement('input'); photo.type = 'file'; photo.id = 'photo-search-file'; photo.accept = 'image/*'; photo.setAttribute('capture', 'environment'); photo.hidden = true; document.body.appendChild(photo); }
function handleStartAction() { const action = new URLSearchParams(location.search).get('action'); if (!action)
    return; history.replaceState(null, '', location.pathname); if (action === 'photo')
    setTimeout(() => document.getElementById('photo-search-file')?.click(), 120);
else if (action === 'movement') {
    state.view = 'stock';
    renderPage();
    setTimeout(() => openMovementModal(), 120);
}
else if (action === 'nfe') {
    state.view = 'nfe';
    renderPage();
    setTimeout(() => document.getElementById('nfe-file')?.click(), 120);
} }
async function init() {
    mountHiddenInputs();
    wire();
    const migrated = await tryLegacyMigration();
    const snapshot = await seedDatabase();
    state = { ...state, ...snapshot, theme: snapshot.config.theme };
    rebuildIndexes();
    if (migrated)
        toast('Dados da v8 migrados para o banco local');
    render();
    handleStartAction();
    if ('serviceWorker' in navigator && location.protocol !== 'file:')
        navigator.serviceWorker.register('/sw.js').catch(() => { });
}
let pageRenderFrame = 0;
let pendingQueryCaret: number | undefined;
function schedulePageRender(caret?: number) { if (caret !== undefined)
    pendingQueryCaret = caret; if (pageRenderFrame)
    return; pageRenderFrame = requestAnimationFrame(() => { pageRenderFrame = 0; renderPage(); if (pendingQueryCaret !== undefined) {
    const input = document.getElementById('query');
    if (input) {
        input.focus();
        const pos = Math.min(pendingQueryCaret, input.value.length);
        input.setSelectionRange(pos, pos);
    }
    pendingQueryCaret = undefined;
} }); }
function rebuildNavState() { $qa(document, '.nav-item[data-view]').forEach(el => el.classList.toggle('active', (el as HTMLElement).dataset.view === state.view)); const badge = $q(document, '.nav-item[data-view="nfe"] .nav-badge'); const pending = state.nfe.filter(n => n.status === 'new' || n.status === 'review').length; if (pending && badge)
    badge.textContent = String(pending);
else if (!pending && badge)
    badge.remove(); }
function renderPage() { const page = $q(document, '.page'); if (page)
    page.innerHTML = renderView(); rebuildNavState(); }
function render() { document.getElementById('app').innerHTML = shell(); }
init().catch(err => { document.getElementById('app').innerHTML = `<div style="padding:40px;font-family:system-ui;color:#fff;background:#0b1118;min-height:100vh"><h1>Não foi possível iniciar</h1><p>${esc(err?.message || err)}</p></div>`; });

export {};
