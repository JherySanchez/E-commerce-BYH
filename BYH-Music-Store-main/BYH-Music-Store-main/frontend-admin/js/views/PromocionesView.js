// frontend-admin/js/views/PromocionesView.js
import { showNotification, formatDate } from '../utils/helpers.js';

export class PromocionesView {
    constructor() {
        this.promociones = [];
        this.container = document.getElementById('content-area');
        this.API_BASE_URL = 'http://localhost:3000/api';
    }

    render() {
        return `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h1>Promociones</h1>
                <a href="#nueva-promocion" class="btn btn-primary">
                    <i class="fas fa-plus"></i> Nueva Promoción
                </a>
            </div>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Tipo</th>
                                    <th>Valor</th>
                                    <th>Fechas de Vigencia</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="promocionesTableBody">
                                <tr><td colspan="6" class="text-center">Cargando...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    async loadData() {
        try {
            const response = await fetch(`${this.API_BASE_URL}/promotions`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'No se pudieron cargar las promociones.');
            }
            this.promociones = await response.json();
            this.renderPromociones(this.promociones);
        } catch (error) {
            console.error('Error al cargar promociones:', error);
            this.showError(error.message);
        }
    }

    renderPromociones(promociones) {
        const tableBody = this.container.querySelector('#promocionesTableBody');
        if (!tableBody) return;

        if (promociones.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center">No se encontraron promociones.</td></tr>`;
            return;
        }

        tableBody.innerHTML = promociones.map(promo => `
            <tr>
                <td>${promo.name}</td>
                <td><span class="badge bg-info text-capitalize">${promo.discount_type}</span></td>
                <td>${this.formatDiscount(promo.discount_type, promo.discount_value)}</td>
                <td>${formatDate(promo.start_date)} - ${formatDate(promo.end_date)}</td>
                <td><span class="badge ${this.getStatusBadge(promo.status)} text-capitalize">${promo.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" title="Editar" disabled><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-outline-danger" title="Eliminar" disabled><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    }

    formatDiscount(type, value) {
        if (type === 'percentage') {
            return `${parseFloat(value).toFixed(0)}%`;
        }
        return `S/. ${parseFloat(value).toFixed(2)}`;
    }

    getStatusBadge(status) {
        switch (status) {
            case 'active': return 'bg-success';
            case 'inactive': return 'bg-secondary';
            case 'expired': return 'bg-danger';
            default: return 'bg-light text-dark';
        }
    }

    showError(message) {
        const tableBody = this.container.querySelector('#promocionesTableBody');
        if (tableBody) {
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">${message}</td></tr>`;
        }
    }

    initEvents() {
        // Aquí se pueden agregar eventos para los botones de editar/eliminar en el futuro.
    }
}