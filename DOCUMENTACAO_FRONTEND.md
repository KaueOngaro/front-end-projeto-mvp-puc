# Documentação do Frontend - KTextil

## Objetivo

Este documento serve como roteiro para apresentação do frontend do projeto, com explicação da interface, integração com o backend e sugestões para gravação de vídeo.

---

## 1. Visão geral do frontend

O frontend é uma aplicação estática em HTML, CSS e JavaScript.

- `index.html` - interface principal com três abas: Estoque, Pedidos e Vendas
- `estilo.css` - estilos visuais para botões, abas, tabelas e formulários
- `interacoes.js` - lógica de navegação entre abas e chamadas ao backend

O frontend consome o backend em `http://localhost:5000`.

---

## 2. Estrutura da interface

### 2.1 Abas e telas

- `📦 Estoque`
  - mostra a lista de tecidos em estoque em tabela
  - consulta `GET /estoque`

- `🛒 Pedidos`
  - formulário de envio de pedido
  - atualmente envia um pedido fixo com `vendedor_id: 1` e `tecido_id: 1`
  - chama `POST /venda`

- `💰 Vendas`
  - mostra relatório de vendas em tabela
  - consulta `GET /relatorio`

### 2.2 Formulário de pedido

Campos:

- Produto (texto)
- Quantidade (numero)
- Cliente (texto)

O backend recebe:

```json
{
  "vendedor_id": 1,
  "itens": [
    {"tecido_id": 1, "metragem_vendida": 5.0}
  ]
}
```

---

## 3. Como o frontend integra com o backend

### 3.1 Rotas chamadas

- `GET /estoque`
- `GET /relatorio`
- `POST /venda`

### 3.2 Comportamento da página

- A aba ativa carrega seu conteúdo automaticamente.
- O frontend constrói tabelas HTML a partir das respostas JSON.
- Erros do backend são exibidos de forma amigável.

### 3.3 Observação importante

Para o `fetch` funcionar corretamente no navegador, é recomendado abrir o frontend por um servidor local, por exemplo:

```bash
cd front-end-projeto-mvp-puc
python -m http.server 8000
```

Depois acesse:

```text
http://localhost:8000
```

---

## 4. Pontos-chave para o vídeo

### 4.1 Introdução rápida

- Mostrar a pasta do frontend:
  - `index.html`
  - `estilo.css`
  - `interacoes.js`
- Explicar que o frontend consome o backend pela URL `http://localhost:5000`

### 4.2 Explicar as três abas

- `Estoque`: visualização dos tecidos disponíveis e suas quantidades
- `Pedidos`: formulário para enviar uma nova venda
- `Vendas`: relatório das vendas registradas

### 4.3 Demonstração prática

1. Abrir o frontend no navegador via servidor local
2. Mostrar a aba `Estoque` carregando a tabela de tecidos
3. Ir para `Pedidos` e preencher o pedido
4. Enviar o pedido e mostrar a resposta de sucesso
5. Ir para `Vendas` e mostrar a nova entrada no relatório

### 4.4 Dicas de fala

- "Aqui o frontend mostra o estoque disponível e consulta o backend." 
- "O pedido é enviado como JSON para o endpoint `/venda`."
- "Depois de registrar a venda, o relatório é atualizado com o nome do vendedor e os itens." 
- "A interface é simples e clara: estoque, pedido e vendas." 

---

## 5. Exemplo de script para o vídeo

> Neste vídeo, vou mostrar o frontend do KTextil e como ele se conecta ao backend.

1. "Estou na pasta do projeto e tenho aqui o `index.html`, o `estilo.css` e o `interacoes.js`."
2. "A interface tem três abas: Estoque, Pedidos e Vendas."
3. "A aba Estoque faz um `GET /estoque` e mostra os tecidos disponíveis."  
4. "No Pedidos, eu preencho a metragem e envio o pedido."
5. "Esse pedido é enviado para o backend em `http://localhost:5000/venda` e  atualiza o estoque."  
6. "Na aba Vendas, eu confirmo que a venda foi registrada e todos os itens aparecem no relatório."  
7. "Assim, o frontend e o backend estão integrados em um fluxo completo." 

---

## 6. Comandos úteis

```bash
cd front-end-projeto-mvp-puc
python -m http.server 8000
```

Acesse em:

```text
http://localhost:8000
```

---

## 7. Observações finais

- O frontend já está preparado para exibir tabelas em vez de JSON cru.
- O backend deve estar rodando em `http://localhost:5000` antes de usar o frontend.
- Se preferir, a parte de pedido pode ser melhorada para listar vendedores e tecidos dinamicamente.
