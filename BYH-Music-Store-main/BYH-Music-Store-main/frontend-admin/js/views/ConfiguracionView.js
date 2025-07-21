// frontend-admin/js/views/ConfiguracionView.js
import { showNotification } from '../utils/helpers.js';

export class ConfiguracionView {
    constructor() {
        this.settings = {};
        this.container = document.getElementById('content-area');
        this.API_BASE_URL = 'http://localhost:3000/api';
    }

    render() {
        return `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h1>Configuración</h1>
            </div>
            <form id="settingsForm">
                <div class="card">
                    <div class="card-header">
                        Configuración General de la Tienda
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <label for="store_name" class="form-label">Nombre de la Tienda</label>
                            <input type="text" class="form-control" id="store_name" name="store_name" required>
                        </div>
                        <div class="mb-3">
                            <label for="contact_email" class="form-label">Email de Contacto</label>
                            <input type="email" class="form-control" id="contact_email" name="contact_email" required>
                        </div>
                    </div>
                </div>

                <div class="card mt-4">
                    <div class="card-header">
                        Configuración de Envíos
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <label for="shipping_cost" class="form-label">Costo de Envío Estándar (S/.)</label>
                            <input type="number" class="form-control" id="shipping_cost" name="shipping_cost" step="0.01" min="0" required>
                        </div>
                        <div class="mb-3">
                            <label for="free_shipping_threshold" class="form-label">Monto para Envío Gratuito (S/.)</label>
                            <input type="number" class="form-control" id="free_shipping_threshold" name="free_shipping_threshold" step="0.01" min="0" required>
                        </div>
                    </div>
                </div>

                <div class="mt-4 text-end">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save me-2"></i>Guardar Cambios
                    </button>
                </div>
            </form>
        `;
    }

    async loadData() {
        try {
            const response = await fetch(`${this.API_BASE_URL}/settings`);
            if (!response.ok) {
                throw new Error('No se pudo cargar la configuración.');
            }
            this.settings = await response.json();
            this.populateForm(this.settings);
        } catch (error) {
            console.error('Error al cargar configuración:', error);
            showNotification(error.message, 'danger');
        }
    }

    populateForm(settings) {
        for (const key in settings) {
            const input = this.container.querySelector(`#${key}`);
            if (input) {
                input.value = settings[key];
            }
        }
    }

    initEvents() {
        const form = this.container.querySelector('#settingsForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const submitButton = form.querySelector('button[type="submit"]');
                submitButton.disabled = true;
                submitButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Guardando...`;

                const formData = new FormData(form);
                const updatedSettings = Object.fromEntries(formData.entries());

                try {
                    const response = await fetch(`${this.API_BASE_URL}/settings`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(updatedSettings),
                    });

                    const result = await response.json();
                    if (!response.ok) {
                        throw new Error(result.message || 'Error al guardar la configuración.');
                    }

                    showNotification('Configuración guardada con éxito.', 'success');
                } catch (error) {
                    showNotification(error.message, 'danger');
                } finally {
                    submitButton.disabled = false;
                    submitButton.innerHTML = `<i class="fas fa-save me-2"></i>Guardar Cambios`;
                }
            });
        }
    }
}