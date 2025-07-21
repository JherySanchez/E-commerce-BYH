// frontend-admin/js/views/PedidosView.js
import { showNotification, formatDate } from '../utils/helpers.js';

export class PedidosView {
    constructor() {
        this.pedidos = [];
        this.container = document.getElementById('content-area');
        this.API_BASE_URL = 'http://localhost:3000/api';
    }

    render() {
        return `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h1>Pedidos</h1>
            </div>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>ID Pedido</th>
                                    <th>Cliente</th>
                                    <th>Fecha</th>
                                    <th>Total</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="pedidosTableBody">
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
            const response = await fetch(`${this.API_BASE_URL}/orders`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'No se pudieron cargar los pedidos.');
            }
            this.pedidos = await response.json();
            this.renderPedidos(this.pedidos);
        } catch (error) {
            console.error('Error al cargar pedidos:', error);
            this.showError(error.message);
        }
    }

    renderPedidos(pedidos) {
        const tableBody = this.container.querySelector('#pedidosTableBody');
        if (!tableBody) return;

        if (pedidos.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center">No se encontraron pedidos.</td></tr>`;
            return;
        }

        tableBody.innerHTML = pedidos.map(pedido => `
            <tr>
                <td>#${pedido.id}</td>
                <td>${pedido.users ? pedido.users.name : 'Usuario eliminado'}</td>
                <td>${formatDate(pedido.created_at)}</td>
                <td>S/. ${parseFloat(pedido.total_amount).toFixed(2)}</td>
                <td><span class="badge ${this.getStatusBadge(pedido.status)} text-capitalize">${pedido.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-info" title="Ver Detalles" disabled><i class="fas fa-eye"></i></button>
                </td>
            </tr>
        `).join('');
    }

    getStatusBadge(status) {
        const statuses = {
            pending: 'bg-warning text-dark',
            processing: 'bg-info',
            shipped: 'bg-primary',
            delivered: 'bg-success',
            cancelled: 'bg-danger',
        };
        return statuses[status] || 'bg-secondary';
    }

    showError(message) {
        const tableBody = this.container.querySelector('#pedidosTableBody');
        if (tableBody) {
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">${message}</td></tr>`;
        }
    }

    initEvents() {
        // Eventos futuros para ver detalles del pedido
    }
}