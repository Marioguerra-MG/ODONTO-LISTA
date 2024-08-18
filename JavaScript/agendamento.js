document.addEventListener('DOMContentLoaded', function() {
    carregarPacientesSalvos();
});

document.getElementById('btnSalvarParciente').addEventListener('click', function() {
    // Captura os valores dos inputs
    const nome = document.getElementById('mNome').value.trim();
    const hora = document.getElementById('mHora').value.trim();
    const data = document.getElementById('mData').value.trim();
    const contato = document.getElementById('mContato').value.trim();

    // Verifica se algum campo está vazio
    if (!nome) {
        alert("Por favor, preencha o campo Nome.");
        return;
    }
    if (!hora) {
        alert("Por favor, preencha o campo Hora.");
        return;
    }
    if (!data) {
        alert("Por favor, preencha o campo Data.");
        return;
    }
    if (!contato) {
        alert("Por favor, preencha o campo Contato.");
        return;
    }

    // Se todos os campos estiverem preenchidos, prossiga com a lógica de salvar
    inserirParciente({ nome, hora, data, contato });

    // Salva o paciente no Local Storage
    salvarPacienteLocalStorage({ nome, hora, data, contato });

    // Limpa os campos após o salvamento
    document.getElementById('mNome').value = '';
    document.getElementById('mHora').value = '';
    document.getElementById('mData').value = '';
    document.getElementById('mContato').value = '';
});

function inserirParciente(paciente) {
    // Aqui você pode adicionar a lógica para inserir o paciente na tabela
    let tbody = document.querySelector('tbody');
    let tr = document.createElement('tr');

    // Formatar a data de `ano-mês-dia` para `dia/mês/ano`
    let formattedDate = paciente.data.split('-').reverse().join('/');

    // Formatar o número de telefone
    let telefone = formatarTelefone(paciente.contato);

    tr.innerHTML = `
        <td data-label="Nome:">${paciente.nome}</td>
        <td data-label="Hora:">${paciente.hora}</td>
        <td data-label="Data:">${formattedDate}</td>
        <td data-label="Contato:">${telefone}</td>
        <td class="acao">
            <button id="botaoDeletar" onclick="deleteItem(this)"><i id="iconeDeletar" class='bx bx-trash'></i></button>
        </td>
    `;
    tbody.appendChild(tr);
}

function salvarPacienteLocalStorage(paciente) {
    // Recupera os pacientes salvos no Local Storage
    let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    
    // Adiciona o novo paciente à lista
    pacientes.push(paciente);

    // Salva a lista atualizada no Local Storage
    localStorage.setItem('pacientes', JSON.stringify(pacientes));
}

function carregarPacientesSalvos() {
    // Recupera os pacientes salvos no Local Storage
    let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    
    // Ordena os pacientes por data e hora
    pacientes.sort((a, b) => {
        // Comparar datas
        let dataA = new Date(a.data.split('-').reverse().join('/'));
        let dataB = new Date(b.data.split('-').reverse().join('/'));
        
        if (dataA.getTime() === dataB.getTime()) {
            // Se as datas forem iguais, comparar horas
            return a.hora.localeCompare(b.hora);
        }
        
        return dataA - dataB;
    });

    // Limpa a tabela antes de adicionar os pacientes ordenados
    document.querySelector('tbody').innerHTML = '';
    
    // Insere cada paciente salvo na tabela
    pacientes.forEach(paciente => inserirParciente(paciente));
}

function formatarTelefone(telefone) {
    // Remove todos os caracteres não numéricos
    telefone = telefone.replace(/\D/g, '');

    // Verifica o comprimento do número
    switch (telefone.length) {
        case 11:
            return telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
        case 10:
            return telefone.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
        case 13:
            return telefone.replace(/^(\d{2})(\d{2})(\d{5})(\d{4})$/, '+$1 ($2) $3-$4');
        case 12:
            return telefone.replace(/^(\d{2})(\d{2})(\d{4})(\d{4})$/, '+$1 ($2) $3-$4');
        case 8:
            return telefone.replace(/^(\d{4})(\d{4})$/, '$1-$2');
        case 9:
            return telefone.replace(/^(\d{5})(\d{4})$/, '$1-$2');
        default:
            return telefone;
    }
}

function deleteItem(button) {
    // Obter a linha correspondente ao botão de deletar clicado
    const row = button.closest('tr');
    
    // Obter os dados da linha para identificar o item no Local Storage
    const nome = row.querySelector('td[data-label="Nome:"]').textContent;
    const hora = row.querySelector('td[data-label="Hora:"]').textContent;
    const data = row.querySelector('td[data-label="Data:"]').textContent.split('/').reverse().join('-'); // Formatar de volta para `ano-mês-dia`
    const contato = row.querySelector('td[data-label="Contato:"]').textContent;

    // Remove a linha da tabela
    row.remove();
    
    // Remover o item do Local Storage
    removerPacienteLocalStorage({ nome, hora, data, contato });
}

function removerPacienteLocalStorage(paciente) {
    // Recuperar a lista de pacientes do Local Storage
    let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    
    // Filtrar os pacientes para remover o item específico
    pacientes = pacientes.filter(p => 
        p.nome !== paciente.nome || 
        p.hora !== paciente.hora || 
        p.data !== paciente.data || 
        p.contato !== paciente.contato
    );
    
    // Salvar a lista atualizada no Local Storage
    localStorage.setItem('pacientes', JSON.stringify(pacientes));
}

document.getElementById('mContato').addEventListener('input', function(e) {
    let telefone = e.target.value;

    // Remove todos os caracteres não numéricos
    telefone = telefone.replace(/\D/g, '');

    // Aplica a formatação enquanto o usuário digita
    if (telefone.length <= 10) {
        // Formatação para números fixos ou móveis sem o dígito adicional
        telefone = telefone.replace(/^(\d{2})(\d{0,4})(\d{0,4})$/, '($1) $2-$3');
    } else {
        // Formatação para números móveis com o dígito adicional
        telefone = telefone.replace(/^(\d{2})(\d{0,5})(\d{0,4})$/, '($1) $2-$3');
    }

    // Atualiza o valor do campo de entrada com a formatação
    e.target.value = telefone;
});

// Função de filtro
document.getElementById('btnPesquisar').addEventListener('input', function() {
    const filterValue = this.value.toLowerCase();
    const rows = document.querySelectorAll('tbody tr');

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        let matched = false;

        cells.forEach(cell => {
            if (cell.textContent.toLowerCase().includes(filterValue)) {
                matched = true;
            }
        });

        if (matched) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});
