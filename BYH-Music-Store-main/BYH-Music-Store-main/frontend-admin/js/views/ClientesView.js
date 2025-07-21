// frontend-admin/js/views/ClientesView.js
import { showNotification, formatDate } from '../utils/helpers.js';

export class ClientesView {
    constructor() {
        this.clientes = [];
        this.container = document.getElementById('content-area');
        this.API_BASE_URL = 'http://localhost:3000/api';
    }

    render() {
        return `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h1>Clientes</h1>
                <a href="#nuevo-cliente" class="btn btn-primary">
                    <i class="fas fa-plus"></i> Nuevo Cliente
                </a>
            </div>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Rol</th>
                                    <th>Fecha de Registro</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="clientesTableBody">
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
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`${this.API_BASE_URL}/users`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'No se pudieron cargar los clientes.');
            }
            this.clientes = await response.json();
            this.renderClientes(this.clientes);
        } catch (error) {
            console.error('Error al cargar clientes:', error);
            this.showError(error.message);
        }
    }

    renderClientes(clientes) {
        const tableBody = this.container.querySelector('#clientesTableBody');
        if (!tableBody) return;

        if (clientes.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center">No se encontraron clientes.</td></tr>`;
            return;
        }

        tableBody.innerHTML = clientes.map(cliente => `
            <tr>
                <td>${cliente.id}</td>
                <td>${cliente.name}</td>
                <td>${cliente.email}</td>
                <td><span class="badge bg-secondary text-capitalize">${cliente.role}</span></td>
                <td>${formatDate(cliente.created_at)}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" title="Editar" disabled><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-outline-danger" title="Eliminar" disabled><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    }

    showError(message) {
        const tableBody = this.container.querySelector('#clientesTableBody');
        if (tableBody) {
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">${message}</td></tr>`;
        }
    }

    initEvents() {
        // Aquí se pueden agregar eventos para los botones de editar/eliminar en el futuro.
    }
}