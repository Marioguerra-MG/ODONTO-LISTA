document.addEventListener('DOMContentLoaded', function() {
    carregarPacientesSalvos();
});

document.getElementById('btnSalvarParciente').addEventListener('click', function() {
    const nome = document.getElementById('mNome').value.trim();
    const hora = document.getElementById('mHora').value.trim();
    const data = document.getElementById('mData').value.trim();
    const contato = document.getElementById('mContato').value.trim();

    if (!nome || !hora || !data || !contato) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    // Verificação adicional do formato da data e hora
    if (!/^(\d{4}-\d{2}-\d{2})$/.test(data) || !/^\d{2}:\d{2}$/.test(hora)) {
        alert("Formato de data ou hora inválido.");
        return;
    }

    const paciente = { nome, hora, data, contato };
    inserirPaciente(paciente);
    salvarPacienteLocalStorage(paciente);

    // Limpar campos
    document.getElementById('mNome').value = '';
    document.getElementById('mHora').value = '';
    document.getElementById('mData').value = '';
    document.getElementById('mContato').value = '';
});

function inserirPaciente(paciente) {
    let tbody = document.querySelector('tbody');
    let tr = document.createElement('tr');

    let formattedDate = paciente.data.split('-').reverse().join('/');
    let telefone = formatarTelefone(paciente.contato);

    tr.innerHTML = `
        <td data-label="Nome:">${paciente.nome}</td>
        <td data-label="Hora:">${paciente.hora}</td>
        <td data-label="Data:">${formattedDate}</td>
        <td data-label="Contato:">${telefone}</td>
        <td class="acao">
            <button onclick="deleteItem(this)"><i class='bx bx-trash'></i></button>
        </td>
    `;
    tbody.appendChild(tr);
}

function salvarPacienteLocalStorage(paciente) {
    let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    pacientes.push(paciente);
    localStorage.setItem('pacientes', JSON.stringify(pacientes));
    carregarPacientesSalvos(); // Atualizar tabela após salvar
}

function carregarPacientesSalvos() {
    let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];

    // Limpar a tabela antes de preencher
    let tbody = document.querySelector('tbody');
    tbody.innerHTML = '';

    pacientes.sort((a, b) => {
        if (!a || !b || !a.data || !b.data || !a.hora || !b.hora) {
            console.error('Dados incompletos ou inválidos para ordenação.');
            console.log(`Paciente A:`, a);
            console.log(`Paciente B:`, b);
            return 0;
        }

        let [anoA, mesA, diaA] = a.data.split('-');
        let [anoB, mesB, diaB] = b.data.split('-');
        let dataA = new Date(`${anoA}-${mesA}-${diaA}T${a.hora}`);
        let dataB = new Date(`${anoB}-${mesB}-${diaB}T${b.hora}`);

        if (isNaN(dataA.getTime()) || isNaN(dataB.getTime())) {
            console.error('Erro ao converter data e hora para objetos Date.');
            console.log(`Data e hora A: ${anoA}-${mesA}-${diaA}T${a.hora}`);
            console.log(`Data e hora B: ${anoB}-${mesB}-${diaB}T${b.hora}`);
            return 0;
        }

        return dataA - dataB;
    });

    pacientes.forEach(paciente => inserirPaciente(paciente));
}

function formatarTelefone(telefone) {
    telefone = telefone.replace(/\D/g, '');
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
    const row = button.closest('tr');
    const nome = row.querySelector('td[data-label="Nome:"]').textContent;
    const hora = row.querySelector('td[data-label="Hora:"]').textContent;
    const data = row.querySelector('td[data-label="Data:"]').textContent.split('/').reverse().join('-');
    const contato = row.querySelector('td[data-label="Contato:"]').textContent;

    row.remove();
    removerPacienteLocalStorage({ nome, hora, data, contato });
}

function removerPacienteLocalStorage(paciente) {
    let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    pacientes = pacientes.filter(p => 
        p.nome !== paciente.nome || 
        p.hora !== paciente.hora || 
        p.data !== paciente.data || 
        p.contato !== paciente.contato
    );
    localStorage.setItem('pacientes', JSON.stringify(pacientes));
}

document.getElementById('mContato').addEventListener('input', function(e) {
    let telefone = e.target.value.replace(/\D/g, '');
    if (telefone.length <= 10) {
        telefone = telefone.replace(/^(\d{2})(\d{0,4})(\d{0,4})$/, '($1) $2-$3');
    } else {
        telefone = telefone.replace(/^(\d{2})(\d{0,5})(\d{0,4})$/, '($1) $2-$3');
    }
    e.target.value = telefone;
});

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

        row.style.display = matched ? '' : 'none';
    });
});
