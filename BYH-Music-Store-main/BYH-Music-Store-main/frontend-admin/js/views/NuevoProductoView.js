/**
 * Vista para el formulario de Nuevo Producto
 */
import { showNotification } from '../utils/helpers.js';

export class NuevoProductoView {
    constructor() {
        // URL base de tu API de backend
        this.API_BASE_URL = 'http://localhost:3000/api';
    }

    render() {
        // Este HTML está basado en tu 'pages/nuevo-producto.html' pero adaptado para la vista
        return `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1>Nuevo Producto</h1>
                    <p class="mb-0">Agrega un nuevo producto al catálogo</p>
                </div>
                <a href="#productos" class="btn btn-outline-secondary">
                    <i class="fas fa-arrow-left"></i> Volver al listado
                </a>
            </div>

            <div class="card">
                <div class="card-body">
                    <form id="productForm" novalidate>
                        <div class="mb-3">
                            <label for="productName" class="form-label">Nombre del Producto</label>
                            <input type="text" class="form-control" id="productName" name="name" required>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="productCategory" class="form-label">Categoría</label>
                                    <select class="form-select" id="productCategory" name="category" required>
                                        <option value="" selected disabled>Seleccione una categoría</option>
                                        <option value="Parches">Parches</option>
                                        <option value="CDs">CDs</option>
                                        <option value="Vinilos">Vinilos</option>
                                        <option value="Merch">Merch</option>
                                        <option value="Accesorios">Accesorios</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="productPrice" class="form-label">Precio</label>
                                    <div class="input-group">
                                        <span class="input-group-text">S/.</span>
                                        <input type="number" class="form-control" id="productPrice" name="price" step="0.01" min="0" required>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="productStock" class="form-label">Stock Disponible</label>
                                    <input type="number" class="form-control" id="productStock" name="stock" min="0" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="productImageUrl" class="form-label">URL de la Imagen</label>
                                    <input type="file" class="form-control" id="productImageFile" name="image_file" accept="image/png, image/jpeg, image/webp">
                                    <div class="form-text">Selecciona un archivo de imagen para el producto (JPG, PNG, WEBP).</div>
                                    <input type="hidden" id="productImageUrl" name="image_url">
                                </div>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label for="productDescription" class="form-label">Descripción</label>
                            <textarea class="form-control" id="productDescription" name="description" rows="4"></textarea>
                        </div>
                        
                        <div class="d-flex justify-content-end">
                            <a href="#productos" class="btn btn-outline-secondary me-2">Cancelar</a>
                            <button type="submit" class="btn btn-primary" id="saveProductBtn">
                                <i class="fas fa-save"></i> Guardar Producto
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    initEvents() {
        const productForm = document.getElementById('productForm');
        if (productForm) {
            productForm.addEventListener('submit', this.handleFormSubmit.bind(this));
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const saveButton = document.getElementById('saveProductBtn');
        
        saveButton.disabled = true;
        saveButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Guardando...`;

        // Usamos FormData para poder enviar el archivo
        const formData = new FormData(form);
        
        try {
            const authToken = localStorage.getItem('authToken');
            // ¡Importante! Cuando se envía FormData, no se debe establecer el 'Content-Type'.
            // El navegador lo hará automáticamente con el 'boundary' correcto.
            const response = await fetch(`${this.API_BASE_URL}/products`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${authToken}` 
                    // No 'Content-Type': 'application/json'
                },
                body: formData // Enviamos el objeto FormData directamente
            });

            // Verificamos si la respuesta no es JSON, lo que puede pasar en errores de servidor
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const textError = await response.text();
                throw new Error(`Error inesperado del servidor: ${textError}`);
            }

            const result = await response.json();            
            if (!response.ok) throw new Error(result.message || 'No se pudo crear el producto.');

            showNotification('Producto creado con éxito', 'success');
            window.location.hash = 'productos';

        } catch (error) {
            showNotification(`Error al guardar: ${error.message}`, 'danger');
            saveButton.disabled = false;
            saveButton.innerHTML = `<i class="fas fa-save"></i> Guardar Producto`;
        }
    }
}