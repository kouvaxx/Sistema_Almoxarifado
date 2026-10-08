export type NfeProfile = 'danfe' | 'pedido' | 'orcamento' | 'generic';

export interface ParsedNfeItem {
  code: string;
  description: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost?: number;
  sourceLine?: string;
  confidence: number;
  warnings: string[];
}

export interface DocumentAnalysis {
  profile: NfeProfile;
  profileConfidence: number;
  pages: number;
  rawText: string;
  metadata: {
    number?: string;
    key?: string;
    cnpj?: string;
    issueDate?: string;
    total?: number;
    supplierName?: string;
  };
  items: ParsedNfeItem[];
  warnings: string[];
}

export interface PdfWord {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
}

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
function analyzeTextDocument(rawText, explicitProfile?: 'danfe' | 'pedido' | 'orcamento' | 'generic') {
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


export { analyzeTextDocument, groupWordsIntoLines };
