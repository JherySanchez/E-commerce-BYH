// frontend-admin/js/views/BannersView.js
import { showNotification, formatDate } from '../utils/helpers.js';

export class BannersView {
    constructor() {
        this.banners = [];
        this.container = document.getElementById('content-area');
        this.API_BASE_URL = 'http://localhost:3000/api';
    }

    render() {
        return `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h1>Banners</h1>
                <a href="#nuevo-banner" class="btn btn-primary">
                    <i class="fas fa-plus"></i> Nuevo Banner
                </a>
            </div>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Imagen</th>
                                    <th>Título</th>
                                    <th>Enlace</th>
                                    <th>Vigencia</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="bannersTableBody">
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
            const response = await fetch(`${this.API_BASE_URL}/banners`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'No se pudieron cargar los banners.');
            }
            this.banners = await response.json();
            this.renderBanners(this.banners);
        } catch (error) {
            console.error('Error al cargar banners:', error);
            this.showError(error.message);
        }
    }

    renderBanners(banners) {
        const tableBody = this.container.querySelector('#bannersTableBody');
        if (!tableBody) return;

        if (banners.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center">No se encontraron banners.</td></tr>`;
            return;
        }

        tableBody.innerHTML = banners.map(banner => `
            <tr>
                <td><img src="${banner.image_url}" alt="${banner.title}" style="width: 120px; height: 60px; object-fit: cover; border-radius: 4px;"></td>
                <td>${banner.title}</td>
                <td><a href="${banner.link_url || '#'}" target="_blank">${banner.link_url ? banner.link_url : 'N/A'}</a></td>
                <td>${formatDate(banner.start_date)} - ${formatDate(banner.end_date)}</td>
                <td><span class="badge ${this.getStatusBadge(banner.status)} text-capitalize">${banner.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" title="Editar" disabled><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-outline-danger" title="Eliminar" disabled><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    }

    getStatusBadge(status) {
        switch (status) {
            case 'active': return 'bg-success';
            case 'inactive': return 'bg-secondary';
            default: return 'bg-light text-dark';
        }
    }

    showError(message) {
        const tableBody = this.container.querySelector('#bannersTableBody');
        if (tableBody) {
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">${message}</td></tr>`;
        }
    }

    initEvents() {
        // Eventos futuros para editar/eliminar
    }
}