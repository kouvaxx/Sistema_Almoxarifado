const uid = (prefix = 'id') => `${prefix}-${crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`}`;
const now = () => new Date().toISOString();
const norm = (value: unknown): string => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

import { repository } from './repository';
import { CATEGORY_META, SEED_CATEGORIES, SEED_PRODUCTS, SEED_SUPPLIERS } from '../seed';

export async function seedDatabase() {
    const snapshot = await repository.loadSnapshot();
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
    const config = repository.createDefaultConfig();
    await repository.saveCategories(categories);
    await repository.saveSuppliers(suppliers);
    await repository.saveProducts(products);
    await repository.saveMovements(movements);
    await repository.saveQuotes(quotes);
    for (const entry of audit) await repository.saveAudit(entry);
    await repository.saveNfes(nfe);
    
    await repository.saveConfig(config);
    return { products, suppliers, categories, movements, nfe, nfeItems, quotes, audit, config };
}
export async function tryLegacyMigration(logMigration?: (type: 'import', message: string, detail?: string) => void) {
    try {
        const legacy = localStorage.getItem('produtos_lista_v8');
        if (!legacy)
            return false;
        const existing = await repository.getProducts();
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
        await repository.saveSuppliers([...suppliersByName.values()]);
        await repository.saveCategories([...categoriesByName.values()]);
        await repository.saveProducts(products);
        const config = repository.createDefaultConfig();
        await repository.saveConfig(config);
        logMigration?.('import', `Migração da v8 concluída: ${products.length} produtos`, 'Origem: localStorage produtos_lista_v8');
        return true;
    }
    catch {
        return false;
    }
}
