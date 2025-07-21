import { showNotification } from '../utils/helpers.js';

export class NuevoBannerView {
    constructor() {
        this.API_BASE_URL = 'http://localhost:3000/api';
    }

    render() {
        return `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1>Nuevo Banner</h1>
                    <p class="mb-0">Agrega un nuevo banner promocional a la tienda</p>
                </div>
                <a href="#banners" class="btn btn-outline-secondary">
                    <i class="fas fa-arrow-left"></i> Volver al listado
                </a>
            </div>

            <div class="card">
                <div class="card-body">
                    <form id="bannerForm" novalidate>
                        <div class="mb-3">
                            <label for="bannerTitle" class="form-label">Título del Banner</label>
                            <input type="text" class="form-control" id="bannerTitle" name="title" required>
                            <div class="form-text">Texto principal que aparecerá en el banner.</div>
                        </div>

                        <div class="mb-3">
                            <label for="bannerImage" class="form-label">Archivo de Imagen</label>
                            <input type="file" class="form-control" id="bannerImage" name="banner_image_file" accept="image/png, image/jpeg, image/webp" required>
                            <div class="form-text">Sube la imagen para el banner. Recomendado: 1200x400px.</div>
                        </div>

                        <div class="mb-3">
                            <label for="bannerLink" class="form-label">Enlace de Destino (URL)</label>
                            <input type="url" class="form-control" id="bannerLink" name="link_url" placeholder="https://ejemplo.com/oferta">
                            <div class="form-text">La página a la que se redirigirá al hacer clic. (Opcional)</div>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="startDate" class="form-label">Fecha de Inicio</label>
                                    <input type="date" class="form-control" id="startDate" name="start_date" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="endDate" class="form-label">Fecha de Fin</label>
                                    <input type="date" class="form-control" id="endDate" name="end_date" required>
                                </div>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="bannerStatus" class="form-label">Estado</label>
                            <select class="form-select" id="bannerStatus" name="status" required>
                                <option value="active" selected>Activo</option>
                                <option value="inactive">Inactivo</option>
                            </select>
                        </div>

                        <div class="d-flex justify-content-end">
                            <a href="#banners" class="btn btn-outline-secondary me-2">Cancelar</a>
                            <button type="submit" class="btn btn-primary" id="saveBannerBtn">
                                <i class="fas fa-save"></i> Guardar Banner
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    initEvents() {
        const bannerForm = document.getElementById('bannerForm');
        if (bannerForm) {
            bannerForm.addEventListener('submit', this.handleFormSubmit.bind(this));
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const saveButton = document.getElementById('saveBannerBtn');

        saveButton.disabled = true;
        saveButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Guardando...`;

        const formData = new FormData(form);

        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`${this.API_BASE_URL}/banners`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                body: formData
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'No se pudo crear el banner.');
            }

            showNotification('Banner creado con éxito', 'success');
            window.location.hash = 'banners';

        } catch (error) {
            showNotification(`Error al guardar: ${error.message}`, 'danger');
            saveButton.disabled = false;
            saveButton.innerHTML = `<i class="fas fa-save"></i> Guardar Banner`;
        }
    }
}
