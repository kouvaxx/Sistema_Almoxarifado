# Almoxarifado • Lista de Produtos v9

Reestruturação da Lista de Produtos v8 para um sistema offline-first de almoxarifado, estoque, compras, NF-e, orçamentos e auditoria.

## O que foi iniciado nesta v9

- Dashboard operacional com KPIs de estoque, valor, críticos e entradas.
- Navegação lateral por módulos, substituindo a concentração de controles no cabeçalho.
- Cadastro de produto em ficha/drawer, com estoque mínimo/máximo e fornecedor independente.
- Estoque separado de cadastro de produto.
- Movimentações rastreáveis: entrada, saída, ajuste, devolução e transferência.
- Bloqueio de estoque negativo por padrão, com opção configurável.
- Inventário físico com ajuste rastreável.
- Fornecedores independentes com dados operacionais e produtos vinculados.
- Base para histórico de preços através das entradas de estoque.
- Inbox de NF-e com fila de revisão.
- Armazenamento local de PDF da NF-e; o projeto-fonte possui adaptador PDF.js para leitura de texto/metadados quando as dependências estiverem instaladas.
- Importação JSON/CSV com mesclagem.
- Exportação JSON de snapshot e CSV de produtos.
- Orçamentos persistentes no banco local.
- Auditoria operacional.
- Command Palette com Ctrl+K.
- Consulta por código/código de barras.
- Tema claro/escuro.
- Layout responsivo para celular/tablet.
- PWA/service worker no projeto-fonte.
- IDs internos únicos para produtos, preservando o código original da v8, inclusive nos casos em que havia códigos duplicados.
- Migração automática do `localStorage` da v8 quando o sistema for aberto no mesmo contexto/origem; para migração mais segura, exporte o JSON da v8 e importe na v9.

## Abrir agora

Use:

`Lista_de_Produtos_v9.html`

Essa versão é autocontida e não depende de internet ou instalação de pacotes para as funções locais já implementadas.

## Projeto de desenvolvimento

Requisitos recomendados:

- Node.js 20.19+ ou 22.12+
- npm

Comandos:

```bash
npm install
npm run dev
```

Para produção:

```bash
npm run build
npm run preview
```

A configuração preparada usa TypeScript, Vite, Dexie, Zod, Lucide e PDF.js. O ambiente de geração desta entrega não conseguiu concluir `npm install` por indisponibilidade/tempo limite do registro de pacotes, portanto o `dist/app.js` fornecido foi gerado com TypeScript diretamente e mantém uma versão sem dependências externas.

## Migração da v8

1. Na v8, use **Exportar JSON**.
2. Abra a v9.
3. Use **Importar backup**.
4. A v9 faz correspondência por código + nome e preserva registros distintos quando a v8 tinha códigos duplicados.
5. Depois revise o módulo **Estoque** e defina os níveis mínimos.

## Estrutura

```text
Lista_de_Produtos_v9/
├─ index.html
├─ package.json
├─ tsconfig.json
├─ README.md
├─ src/
│  ├─ main.ts
│  ├─ db.ts
│  ├─ seed.ts
│  ├─ types.ts
│  ├─ styles.css
│  └─ seed.json
├─ public/
│  ├─ manifest.json
│  └─ sw.js
├─ dist/
│  ├─ index.html
│  ├─ app.js
│  ├─ styles.css
│  ├─ manifest.json
│  └─ sw.js
└─ Lista_de_Produtos_v9.html
```
