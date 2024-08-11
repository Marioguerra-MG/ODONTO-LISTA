const sNome = document.querySelector('#mNome');
const sHora = document.querySelector('#mHora');
const sData = document.querySelector('#mData');
const sContato = document.querySelector('#mContato');
const tbody = document.querySelector('tbody');
const btnSalvarParciente = document.querySelector('#btnSalvarParciente');

let agenda = [];
let id;

function inserirParciente(index) {
    let tr = document.createElement('tr');

    // Formatar a data de `ano-mês-dia` para `dia/mês/ano`
    let data = agenda[index].data;
    let formattedDate = data.split('-').reverse().join('/');
    let telefone = formatarTelefone(agenda[index].contato);

    tr.innerHTML = `
    <td data-label="Nome:">${agenda[index].nome}</td>
    <td data-label="Hora:">${agenda[index].hora}</td>
    <td data-label="Data:">${formattedDate}</td>
    <!--<td data-label="Contato:">${agenda[index].contato}</td>-->
    <td data-label="Contato:">${telefone}</td>
    <td class="acao">
      <button id="botaoDeletar" onclick="deleteItem(${index})"><i id="iconeDeletar" class='bx bx-trash'></i></button>
    </td>
  `;
    tbody.appendChild(tr);
}

function formatarTelefone(telefone) {
    // Remove todos os caracteres não numéricos
    telefone = telefone.replace(/\D/g, '');

    // Verifica se o número tem o comprimento esperado
    if (telefone.length === 11) {
        // Formata o número como (11) 98765-4321
        return telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (telefone.length === 10) {
        // Formata o número como (11) 9876-5432
        return telefone.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    }
    return telefone; // Retorna o número sem formatação se não corresponder aos casos esperados
}


btnSalvarParciente.onclick = e => {
    e.preventDefault();

    if (sNome.value === '' || sHora.value === '' || sData.value === '' || sContato.value === '') {
        return;
    }

    if (id !== undefined) {
        // Edita um item existente
        agenda[id].nome = sNome.value;
        agenda[id].hora = sHora.value;
        agenda[id].data = sData.value;
        agenda[id].contato = sContato.value;
        id = undefined; // Limpa o ID para não editar o próximo paciente erroneamente
    } else {
        // Adiciona um novo item
        agenda.push({
            nome: sNome.value,
            hora: sHora.value,
            data: sData.value,
            contato: sContato.value
        });
    }

    setItensBD(); // Atualiza o localStorage
    renderAgenda(); // Re-renderiza a tabela

    // Limpa os campos do formulário
    sNome.value = '';
    sHora.value = '';
    sData.value = '';
    sContato.value = '';
};

function deleteItem(index) {
    agenda.splice(index, 1); // Remove o item do array agenda
    setItensBD(); // Atualiza o localStorage
    renderAgenda(); // Re-renderiza a tabela
}

function renderAgenda() {
    tbody.innerHTML = ''; // Limpa o conteúdo atual da tabela
    agenda.forEach((item, index) => {
        inserirParciente(index);
    });
}

function loadItens() {
    agenda = getItensBD(); // Carrega os itens do localStorage
    renderAgenda(); // Renderiza a tabela
}

const getItensBD = () => JSON.parse(localStorage.getItem('dbagenda')) ?? [];
const setItensBD = () => localStorage.setItem('dbagenda', JSON.stringify(agenda));

// Carrega os itens ao iniciar
loadItens();
