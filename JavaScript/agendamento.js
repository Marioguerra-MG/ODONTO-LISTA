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
    // Remove a linha correspondente ao botão de deletar clicado
    button.closest('tr').remove();
}
