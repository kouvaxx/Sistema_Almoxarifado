# v9.0.0 — reestruturação inicial

## Base de dados
- Novo modelo de Produto com `currentStock`, `minimumStock`, `reservedStock`, `currentCost` e `averageCost`.
- Fornecedor deixou de ser apenas texto e passou a ter entidade própria.
- Movimentação passou a ser entidade própria e não simples alteração de quantidade.
- Configuração e auditoria ganharam armazenamento separado.
- IndexedDB adotado como banco local na arquitetura do projeto.

## Interface
- Sidebar modular.
- Dashboard operacional.
- Tabelas com hierarquia visual nova.
- Drawers para produto e fornecedor.
- Command Palette (`Ctrl+K`).
- Responsividade mobile.
- Tema claro/escuro.

## Operação
- Entrada/saída/ajuste/devolução/transferência.
- Bloqueio de estoque negativo por padrão.
- Inventário físico.
- Fornecedores independentes.
- Histórico operacional e auditoria.
- Backup/importação/exportação.
- Orçamentos.
- Inbox de NF-e.
- Consulta por código.

## Compatibilidade
- Seed inicial preserva os 182 produtos do arquivo v8.
- Códigos originais são preservados como `code`, enquanto cada registro recebe ID interno único.
- Importação de JSON da v8 prevista para preservar cadastros antigos.
