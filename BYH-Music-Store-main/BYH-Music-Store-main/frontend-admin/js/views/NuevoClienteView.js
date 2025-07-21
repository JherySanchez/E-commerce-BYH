import { showNotification } from '../utils/helpers.js';

export class NuevoClienteView {
    constructor() {
        this.API_BASE_URL = 'http://localhost:3000/api';
    }

    render() {
        return `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1>Nuevo Cliente</h1>
                    <p class="mb-0">Añade un nuevo cliente al sistema</p>
                </div>
                <a href="#clientes" class="btn btn-outline-secondary">
                    <i class="fas fa-arrow-left"></i> Volver al listado
                </a>
            </div>

            <div class="card">
                <div class="card-body">
                    <form id="clientForm" novalidate>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="clientName" class="form-label">Nombre Completo</label>
                                <input type="text" class="form-control" id="clientName" name="name" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="clientEmail" class="form-label">Correo Electrónico</label>
                                <input type="email" class="form-control" id="clientEmail" name="email" required>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="clientPassword" class="form-label">Contraseña</label>
                                <input type="password" class="form-control" id="clientPassword" name="password" required>
                                <div class="form-text">La contraseña debe tener al menos 6 caracteres.</div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="clientPhone" class="form-label">Teléfono (Opcional)</label>
                                <input type="tel" class="form-control" id="clientPhone" name="phone">
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="clientAddress" class="form-label">Dirección (Opcional)</label>
                            <textarea class="form-control" id="clientAddress" name="address" rows="3"></textarea>
                        </div>

                        <div class="d-flex justify-content-end">
                            <a href="#clientes" class="btn btn-outline-secondary me-2">Cancelar</a>
                            <button type="submit" class="btn btn-primary" id="saveClientBtn">
                                <i class="fas fa-save"></i> Guardar Cliente
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    initEvents() {
        const clientForm = document.getElementById('clientForm');
        if (clientForm) {
            clientForm.addEventListener('submit', this.handleFormSubmit.bind(this));
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;

        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            showNotification('Por favor, completa los campos requeridos.', 'warning');
            return;
        }

        const saveButton = document.getElementById('saveClientBtn');
        saveButton.disabled = true;
        saveButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Guardando...`;

        const formData = new FormData(form);
        const clientData = Object.fromEntries(formData.entries());

        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`${this.API_BASE_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(clientData)
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'No se pudo crear el cliente.');
            }

            showNotification('Cliente creado con éxito', 'success');
            window.location.hash = 'clientes';

        } catch (error) {
            showNotification(`Error al guardar: ${error.message}`, 'danger');
            saveButton.disabled = false;
            saveButton.innerHTML = `<i class="fas fa-save"></i> Guardar Cliente`;
        }
    }
}
