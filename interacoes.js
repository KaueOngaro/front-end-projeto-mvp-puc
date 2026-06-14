// URL base da API do backend
const API_BASE = 'http://localhost:5000';

// 1. Seleciona todos os botões e todas as seções (telas) de conteúdo
const botoes = document.querySelectorAll('.nav-btn');
const telas = document.querySelectorAll('.tab-content');

// 2. Interação de cada btão ( Lógica entre os botões e as Telas )
botoes.forEach(botao => {
    botao.addEventListener('click', () => {
        
        // Remove a classe 'active' de todos os botões para apagar o destaque antigo
        botoes.forEach(b => b.classList.remove('active'));
        
        // Adiciona a classe 'active' ao botão clicado
        botao.classList.add('active');

        // Esconde todas as telas adicionando a classe 'hidden' em todas elas
        telas.forEach(tela => tela.classList.add('hidden'));

        // Pega qual o botão ativo
        const idAlvo = botao.getAttribute('data-target');
        
        // De acordo com o botão clicado, mostra a tela ( tirando a classe hidden da tela correspondente )
        document.getElementById(idAlvo).classList.remove('hidden');

        // De acordo com o botão clicado, a tela é exibida e iremos carregar os dados necessários.
        acaoTela(idAlvo);
    });
});

// Dispara a ação para a tela que já está ativa ao carregar a página
const botaoAtivo = document.querySelector('.nav-btn.active');
if (botaoAtivo) {
    acaoTela(botaoAtivo.getAttribute('data-target'));
}

// Lógica de Negócio de quais dados devem ser acessados
function acaoTela(id) {
    if (id === 'tela-estoque') {
        fetchEstoque();
    } else if (id === 'tela-vendas') {
        fetchVendas();
    } else if (id === 'tela-pedido') {
        setupPedidoForm();
    }
}

// Lógicas de interação com o back-end para cada tela
function fetchEstoque() {
    const container = document.getElementById('estoque-content');
    if (!container) return;
    container.innerHTML = '<em>Carregando dados do estoque...</em>';
    fetch(`${API_BASE}/estoque`)
        .then(response => {
            if (!response.ok) throw new Error(response.status + ' ' + response.statusText);
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data) || data.length === 0) {
                container.innerHTML = '<p>Nenhum tecido encontrado.</p>';
                return;
            }
            container.innerHTML = renderEstoqueTable(data);
        })
        .catch(err => {
            container.innerHTML = `<div class="error">Erro ao carregar estoque: ${err.message}</div>`;
        });
}

function fetchVendas() {
    const container = document.getElementById('vendas-content');
    if (!container) return;
    container.innerHTML = '<em>Carregando dados de vendas...</em>';
    fetch(`${API_BASE}/relatorio`)
        .then(response => {
            if (!response.ok) throw new Error(response.status + ' ' + response.statusText);
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data) || data.length === 0) {
                container.innerHTML = '<p>Nenhuma venda registrada.</p>';
                return;
            }
            container.innerHTML = renderVendasTable(data);
        })
        .catch(err => {
            container.innerHTML = `<div class="error">Erro ao carregar vendas: ${err.message}</div>`;
        });
}

// Registrar o listener do formulário apenas uma vez
(function initFormListener() {
    const form = document.getElementById('pedido-form');
    const result = document.getElementById('pedido-result');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(form);
        const vendedor_id = Number(formData.get('vendedor_id'));
        const tecido_id = Number(formData.get('tecido_id'));
        const metragem = Number(formData.get('metragem'));

        if (!vendedor_id || !tecido_id || !metragem) {
            if (result) result.textContent = 'Erro: Preencha todos os campos.';
            return;
        }

        const body = {
            vendedor_id: vendedor_id,
            itens: [
                {
                    tecido_id: tecido_id,
                    metragem_vendida: metragem
                }
            ]
        };
        if (result) result.textContent = 'Enviando pedido...';

        fetch(`${API_BASE}/venda`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
            .then(response => {
                if (!response.ok) throw new Error(response.status + ' ' + response.statusText);
                return response.json();
            })
            .then(data => {
                if (result) result.innerHTML = renderPedidoResult(data);
                form.reset();
            })
            .catch(err => {
                if (result) result.innerHTML = `<div class="error">Erro ao enviar pedido: ${err.message}</div>`;
            });
    });
})();

function setupPedidoForm() {
    const form = document.getElementById('pedido-form');
    if (!form) return;

    // Carregar vendedores
    const vendedorSelect = form.querySelector('select[name="vendedor_id"]');
    if (vendedorSelect && vendedorSelect.children.length === 1) {
        // Só carregar se vazio
        fetch(`${API_BASE}/vendedores`)
            .then(response => {
                if (!response.ok) throw new Error('Erro ao carregar vendedores');
                return response.json();
            })
            .then(vendedores => {
                vendedores.forEach(v => {
                    const option = document.createElement('option');
                    option.value = v.id;
                    option.textContent = v.nome;
                    vendedorSelect.appendChild(option);
                });
            })
            .catch(err => console.error('Erro ao carregar vendedores:', err));
    }

    // Carregar tecidos
    const tecidoSelect = form.querySelector('select[name="tecido_id"]');
    if (tecidoSelect && tecidoSelect.children.length === 1) {
        // Só carregar se vazio
        fetch(`${API_BASE}/estoque`)
            .then(response => {
                if (!response.ok) throw new Error('Erro ao carregar tecidos');
                return response.json();
            })
            .then(tecidos => {
                tecidos.forEach(t => {
                    const option = document.createElement('option');
                    option.value = t.id;
                    option.textContent = `${t.nome} (${t.quantidade_metros}m)`;
                    tecidoSelect.appendChild(option);
                });
            })
            .catch(err => console.error('Erro ao carregar tecidos:', err));
    }
}

function renderEstoqueTable(estoque) {
    const rows = estoque.map(item => `
        <tr>
            <td>${item.id}</td>
            <td>${item.nome}</td>
            <td>${item.quantidade_metros}</td>
        </tr>
    `).join('');

    return `
        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Tecido</th>
                    <th>Quantidade (m)</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;
}

function renderVendasTable(vendas) {
    const rows = vendas.map(venda => `
        <tr>
            <td>${venda.id}</td>
            <td>${venda.vendedor_nome || venda.vendedor_id}</td>
            <td>${formatDate(venda.data_venda)}</td>
            <td>${venda.itens?.length || 0}</td>
            <td>${renderItensVenda(venda.itens)}</td>
        </tr>
    `).join('');

    return `
        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Vendedor</th>
                    <th>Data</th>
                    <th>Quantidade</th>
                    <th>Itens</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;
}

function renderItensVenda(itens) {
    if (!Array.isArray(itens) || itens.length === 0) {
        return '<em>Sem itens</em>';
    }

    return itens.map(item => `
        <div class="item-venda">
            <strong>${item.tecido_nome || item.tecido_id}</strong>: ${item.metragem_vendida} m
        </div>
    `).join('');
}

function renderPedidoResult(data) {
    if (!data || !data.id) {
        return '<p>Resposta inesperada do servidor.</p>';
    }

    return `
        <div class="pedido-sucesso">
            <p><strong>Pedido enviado com sucesso!</strong></p>
            <p>ID da venda: ${data.id}</p>
            <p>Vendedor: ${data.vendedor_nome || data.vendedor_id}</p>
            <p>Data: ${formatDate(data.data_venda)}</p>
        </div>
    `;
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
