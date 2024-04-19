document.addEventListener('DOMContentLoaded', function () {
    const addButton = document.getElementById('addButton');
    const gustoInput = document.getElementById('gustoInput');
    const acceptButton = document.getElementById('acceptButton');
    const myForm = document.getElementById('myForm');

    addButton.addEventListener('click', function (event) {
        event.preventDefault();
        const gusto = gustoInput.value.trim();

        if (gusto) {
            addRow(gusto);
            gustoInput.value = '';
        } else {
            alert('Por favor, ingresa un gusto antes de agregarlo.');
        }
    });

    acceptButton.addEventListener('click', function () {
        const nombre = document.getElementById('nombreInput').value;
        const email = document.getElementById('emailInput').value;
        const telefono = document.getElementById('telefonoInput').value;

        // Obtener los gustos ingresados por el usuario
        let gustos = [];
        const filas = document.querySelectorAll('#dataTable tbody tr');
        filas.forEach(fila => {
            const gusto = fila.querySelector('td:first-child').textContent;
            gustos.push(gusto);
        });

        // Guardar los gustos en el almacenamiento local del navegador
        localStorage.setItem('gustos', JSON.stringify(gustos));

        // Construir una URL con los parámetros de consulta
        const queryParams = new URLSearchParams();
        queryParams.set('nombre', nombre);
        queryParams.set('email', email);
        queryParams.set('telefono', telefono);

        // Agregar los gustos a los parámetros de la URL
        gustos.forEach(gusto => {
            queryParams.append('gusto', gusto);
        });

        // Redireccionar a la segunda página con los parámetros de consulta
        window.location.href = `resivido2.html?${queryParams.toString()}`;
    });

    // Función para agregar una nueva fila a la tabla de gustos
    function addRow(gusto) {
        const row = `
        <tr>
          <td>${gusto}</td>
          <td contenteditable="true">0%</td>
          <td>
            <button class="button is-primary editar-btn">Editar</button>
          </td>
        </tr>
      `;
        document.querySelector('#dataTable tbody').insertAdjacentHTML('beforeend', row);
        // No olvides adjuntar los listeners de edición después de agregar una nueva fila
        attachEditListeners();
    }

function attachEditListeners() {
        const editButtons = document.querySelectorAll('.editar-btn');
        editButtons.forEach(button => {
            button.addEventListener('click', function (event) {
                event.preventDefault();
                const editingRow = this.closest('tr');
                const editButtons = document.querySelectorAll('.editar-btn');

                if (editingRow.classList.contains('editando')) {
                    alert('Solo se puede editar una línea. Recargue la página para poder editar otra.');
                    return;
                }

                editingRow.classList.add('editando');

                const cells = editingRow.querySelectorAll('td:not(:last-child)');
                cells.forEach(cell => {
                    const text = cell.textContent;
                    cell.innerHTML = `<input type="text" value="${text}">`;
                });

                editButtons.forEach(button => {
                    if (button !== this) {
                        button.disabled = true;
                    }
                });

                const editSection = document.getElementById('editSection');
                editSection.style.display = 'block';

                const acceptButton = document.getElementById('acceptButton');
                acceptButton.addEventListener('click', function () {
                    editingRow.classList.remove('editando');
                    const editedCells = editingRow.querySelectorAll('td:not(:last-child) input');
                    editedCells.forEach(cell => {
                        const text = cell.value;
                        cell.parentNode.innerHTML = text;
                    });

                    editButtons.forEach(button => {
                        button.disabled = false;
                    });

                    editSection.style.display = 'none';
                });

                const cancelButton = document.getElementById('cancelButton');
                cancelButton.addEventListener('click', function () {
                    editingRow.classList.remove('editando');
                    const cells = editingRow.querySelectorAll('td:not(:last-child) input');
                    cells.forEach(cell => {
                        const text = cell.parentNode.textContent;
                        cell.parentNode.innerHTML = text;
                    });

                    editButtons.forEach(button => {
                        button.disabled = false;
                    });

                    editSection.style.display = 'none';
                });
            });
        });
    }
});
