# BUG FIX: Drawer fecha ao selecionar produto

## Problema
Quando você seleciona um produto, a janela lateral (drawer) fecha inesperadamente ao clicar em qualquer opção.

## Causa
Os eventos de clique nos elementos do drawer estão se propagando para o overlay de fundo, que tem um evento de clique para fechar o drawer.

## Solução
Adicione `event.stopPropagation()` ou `event.preventDefault()` aos cliques dentro do drawer.

### Código a corrigir no seu JavaScript:

1. **Na função que abre o drawer de produtos**, adicione:
```javascript
// Impedir propagação de cliques dentro do drawer
drawer.addEventListener('click', (e) => {
    e.stopPropagation();
});
```

2. **Nos botões/opções de seleção de produtos**, certifique-se de ter:
```javascript
button.addEventListener('click', (e) => {
    e.stopPropagation(); // Impede que o clique propague para fechar o drawer
    // seu código aqui
});
```

3. **No overlay/fundo**, mantenha o evento de fechamento:
```javascript
drawerOverlay.addEventListener('click', () => {
    closeDrawer();
});
```

## Como aplicar a correção

Procure no arquivo `Lista_de_Produtos_v9.html` por:
- Função que abre o drawer de detalhes do produto
- Evento de clique no overlay
- Botões de opções/ações

Adicione `.stopPropagation()` aos cliques internos do drawer.

## Teste
Após aplicar a correção:
1. Abra a lista de produtos
2. Clique em um produto para abrir o drawer
3. Clique em qualquer opção/botão dentro do drawer
4. O drawer não deve fechar mais
