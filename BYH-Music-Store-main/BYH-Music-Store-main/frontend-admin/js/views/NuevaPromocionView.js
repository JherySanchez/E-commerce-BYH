import { showNotification } from '../utils/helpers.js';

export class NuevaPromocionView {
    constructor() {
        this.API_BASE_URL = 'http://localhost:3000/api';
    }

    render() {
        return `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1>Nueva Promoción</h1>
                    <p class="mb-0">Crea una nueva oferta o descuento para la tienda</p>
                </div>
                <a href="#promociones" class="btn btn-outline-secondary">
                    <i class="fas fa-arrow-left"></i> Volver al listado
                </a>
            </div>

            <div class="card">
                <div class="card-body">
                    <form id="promoForm" novalidate>
                        <div class="mb-3">
                            <label for="promoName" class="form-label">Nombre de la Promoción</label>
                            <input type="text" class="form-control" id="promoName" name="name" required placeholder="Ej: 20% de descuento en CDs">
                        </div>

                        <div class="mb-3">
                            <label for="promoDescription" class="form-label">Descripción</label>
                            <textarea class="form-control" id="promoDescription" name="description" rows="3"></textarea>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="promoDiscountType" class="form-label">Tipo de Descuento</label>
                                    <select class="form-select" id="promoDiscountType" name="discount_type" required>
                                        <option value="percentage" selected>Porcentaje (%)</option>
                                        <option value="fixed_amount">Monto Fijo (S/.)</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="promoDiscountValue" class="form-label">Valor del Descuento</label>
                                    <input type="number" class="form-control" id="promoDiscountValue" name="discount_value" step="0.01" min="0" required>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="promoStartDate" class="form-label">Fecha de Inicio</label>
                                    <input type="date" class="form-control" id="promoStartDate" name="start_date" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="promoEndDate" class="form-label">Fecha de Fin</label>
                                    <input type="date" class="form-control" id="promoEndDate" name="end_date" required>
                                </div>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="promoStatus" class="form-label">Estado</label>
                            <select class="form-select" id="promoStatus" name="status" required>
                                <option value="active" selected>Activo</option>
                                <option value="inactive">Inactivo</option>
                            </select>
                        </div>

                        <div class="d-flex justify-content-end">
                            <a href="#promociones" class="btn btn-outline-secondary me-2">Cancelar</a>
                            <button type="submit" class="btn btn-primary" id="savePromoBtn">
                                <i class="fas fa-save"></i> Guardar Promoción
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    initEvents() {
        const promoForm = document.getElementById('promoForm');
        if (promoForm) {
            promoForm.addEventListener('submit', this.handleFormSubmit.bind(this));
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;

        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            showNotification('Por favor, completa todos los campos requeridos.', 'warning');
            return;
        }

        const saveButton = document.getElementById('savePromoBtn');
        saveButton.disabled = true;
        saveButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Guardando...`;

        const formData = new FormData(form);
        const promoData = Object.fromEntries(formData.entries());

        // Convertir a número
        promoData.discount_value = parseFloat(promoData.discount_value);

        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`${this.API_BASE_URL}/promotions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(promoData)
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'No se pudo crear la promoción.');
            }

            showNotification('Promoción creada con éxito', 'success');
            window.location.hash = 'promociones';

        } catch (error) {
            showNotification(`Error al guardar: ${error.message}`, 'danger');
            saveButton.disabled = false;
            saveButton.innerHTML = `<i class="fas fa-save"></i> Guardar Promoción`;
        }
    }
}
