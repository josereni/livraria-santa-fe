# Livraria Santa Fé

Site demonstrativo de uma livraria católica, feito com HTML, CSS e JavaScript puro.

## Arquivos

- `index.html` — estrutura e conteúdo da página.
- `style.css` — cores, fontes, layout e adaptação para celular.
- `script.js` — catálogo, pesquisa, filtro, carrinho e configurações de contato.

## Como abrir no computador

1. Extraia o ZIP para uma pasta do computador.
2. Abra a pasta `livraria-santa-fe` no VS Code.
3. Abra `index.html` no navegador. Também é possível usar a extensão Live Server.

## Antes de divulgar o site: configurar contato e endereço

Abra `script.js` e encontre o bloco `STORE_CONFIG`, no começo do arquivo:

```js
const STORE_CONFIG = {
  whatsapp: "",
  address: ""
};
```

- Em `whatsapp`, coloque o número comercial com código do país e DDD, somente números. Exemplo fictício: `5511988887777`.
- Em `address`, coloque o endereço físico completo, se houver. O botão "Ver no mapa" será ativado automaticamente. Não publique endereço residencial ou particular sem desejar torná-lo público.

## Funcionalidades

- Navegação entre as seções do site.
- Catálogo de livros de demonstração.
- Pesquisa por nome, categoria ou descrição.
- Filtro por categoria.
- Adicionar livros ao carrinho.
- Alterar quantidades, remover itens e calcular o total.
- Carrinho salvo no navegador usando armazenamento local.
- Preparar um pedido e abrir uma conversa no WhatsApp depois de configurar o número.
- Layout adaptado para celular.
- Exibição do endereço e link do Google Maps depois de cadastrar o endereço.

## Importante

Este projeto é um protótipo de aprendizagem. Os livros, capas e preços são exemplos e precisam ser substituídos por dados reais. O carrinho não processa pagamentos, não calcula frete e não confirma estoque. O pedido enviado pelo WhatsApp é apenas uma solicitação para confirmação. Para uma loja virtual completa, será necessário integrar um sistema seguro de pagamento, gestão de pedidos e tratamento de dados dos clientes.

## Publicar no GitHub Pages

1. Abra o repositório `livraria-santa-fe` no GitHub.
2. Use **Add file > Upload files**.
3. Envie `index.html`, `style.css`, `script.js` e `README.md` para a raiz do repositório.
4. Confirme em **Commit changes**.
5. Abra **Settings > Pages**.
6. Em **Build and deployment**, escolha **Deploy from a branch**, selecione `main` e `/ (root)` e clique em **Save**.
7. Depois que a publicação terminar, o GitHub Pages mostrará o endereço do site na seção Pages.
