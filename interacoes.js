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
    fetch('/status_estoque')
        .then(response => {
            if (!response.ok) throw new Error(response.status + ' ' + response.statusText);
            return response.json();
        })
        .then(data => {
            container.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
        })
        .catch(err => {
            container.innerHTML = '<div class="error">Erro ao carregar estoque: ' + err.message + '</div>';
        });
}

function fetchVendas() {
    const container = document.getElementById('vendas-content');
    if (!container) return;
    container.innerHTML = '<em>Carregando dados de vendas...</em>';
    fetch('/status_vendas')
        .then(response => {
            if (!response.ok) throw new Error(response.status + ' ' + response.statusText);
            return response.json();
        })
        .then(data => {
            container.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
        })
        .catch(err => {
            container.innerHTML = '<div class="error">Erro ao carregar vendas: ' + err.message + '</div>';
        });
}

function setupPedidoForm() {
    const form = document.getElementById('pedido-form');
    const result = document.getElementById('pedido-result');
    if (!form) return;
    // evita múltiplos listeners
    if (form.__bound) return;
    form.__bound = true;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(form);
        const body = {
            produto: formData.get('produto'),
            quantidade: Number(formData.get('quantidade')),
            cliente: formData.get('cliente')
        };
        if (result) result.textContent = 'Enviando pedido...';

        fetch('/adiciona_pedido', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
            .then(response => {
                if (!response.ok) throw new Error(response.status + ' ' + response.statusText);
                return response.json().catch(() => ({}));
            })
            .then(data => {
                if (result) result.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
                form.reset();
            })
            .catch(err => {
                if (result) result.textContent = 'Erro ao enviar pedido: ' + err.message;
            });
    });
}