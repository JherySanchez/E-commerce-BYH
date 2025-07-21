/**
 * Vista de Productos
 */

import { showNotification } from '../utils/helpers.js'

export class ProductosView {
    constructor() {
        this.productos = [];
        this.container = document.getElementById('content-area');
        // Base URL de tu API de backend. Asegúrate de que el puerto coincida con tu index.js
        this.API_BASE_URL = 'http://localhost:3000/api'; 
    }

    render() {
        return `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1>Productos</h1>
                    <p class="mb-0">Administra los productos de la tienda</p>
                </div>
                <a href="#nuevo-producto" class="btn btn-primary" onclick="app.loadView('nuevo-producto'); return false;">
                    <i class="fas fa-plus"></i> Nuevo Producto
                </a>
            </div>
            
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Imagen</th>
                                    <th>Nombre</th>
                                    <th>Categoría</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="productosTableBody">
                                <tr>
                                    <td colspan="7" class="text-center">
                                        <div class="spinner-border text-primary" role="status">
                                            <span class="visually-hidden">Cargando...</span>
                                        </div>
                                        <p class="mt-2">Cargando productos...</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- Paginación -->
                    <nav aria-label="Page navigation" class="mt-4">
                        <ul class="pagination justify-content-center">
                            <li class="page-item disabled">
                                <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Anterior</a>
                            </li>
                            <li class="page-item active"><a class="page-link" href="#">1</a></li>
                            <li class="page-item"><a class="page-link" href="#">2</a></li>
                            <li class="page-item">
                                <a class="page-link" href="#">Siguiente</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        `;
    }

    async loadData() {
        try {
            // ¡CAMBIO CLAVE! Usamos fetch para llamar a tu API de backend
            const response = await fetch(`${this.API_BASE_URL}/products`);
            
            if (!response.ok) {
                // Si la respuesta no es OK (ej. 404, 500), lanzamos un error
                const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
                throw new Error(`Error al cargar productos: ${errorData.message || response.statusText}`);
            }

            this.productos = await response.json();
            this.renderProductos(this.productos);
        } catch (error) {
            this.productos = [];
            console.error('Error al cargar productos:', error);
            this.showError(`No se pudieron cargar los productos: ${error.message}`);
        }
    }

    renderProductos(productos) {
        const tableBody = this.container.querySelector('#productosTableBody');
        if (!tableBody) return;
        
        if (productos.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-4">
                        <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
                        <p class="mb-0">No se encontraron productos</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        tableBody.innerHTML = productos.map(producto => `
            <tr>
                <td>
                    <a href="${producto.image_url || './img/default-product.svg'}" target="_blank">
                        <img src="${producto.image_url || './img/default-product.svg'}" alt="${producto.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
                    </a>
                </td>
                <td>${producto.name}</td>
                <td>${producto.category}</td>
                <td>S/. ${producto.price.toFixed(2)}</td>
                <td>${producto.stock}</td>
                <td>
                    <span class="badge ${this.getBadgeClass(producto.stock)}">
                        ${this.getStatusFromStock(producto.stock)}
                    </span>
                </td>
                <td>
                    <a href="#editar-producto/${producto.id}" class="btn btn-sm btn-outline-primary me-1" title="Editar">
                        <i class="fas fa-edit"></i>
                    </a>
                    <button class="btn btn-sm btn-outline-danger" 
                            title="Eliminar" 
                            data-action="delete" 
                            data-id="${producto.id}" 
                            data-name="${producto.name}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
    }
    
    getBadgeClass(stock) {
        if (stock > 10) return 'bg-success';
        if (stock > 0) return 'bg-warning text-dark';
        return 'bg-danger';
    }

    getStatusFromStock(stock) {
        if (stock > 10) return 'Disponible';
        if (stock > 0) return 'Pocas unidades';
        return 'Agotado';
    }

    showError(message) {
        const tableBody = this.container.querySelector('#productosTableBody');
        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-danger py-4">
                        <i class="fas fa-exclamation-circle fa-2x mb-2"></i>
                        <p class="mb-0">${message}</p>
                        <button class="btn btn-sm btn-outline-primary mt-2" onclick="app.loadView('productos')">
                            <i class="fas fa-sync-alt me-1"></i> Reintentar
                        </button>
                    </td>
                </tr>
            `;
        }
    }

    initEvents() {
        // Delegación de eventos para los botones de acción
        this.container.addEventListener('click', (e) => {
            const deleteButton = e.target.closest('button[data-action="delete"]');
            if (deleteButton) {
                const productId = deleteButton.dataset.id;
                const productName = deleteButton.dataset.name || 'este producto';
                this.confirmDeleteProduct(productId, productName);
                return;
            }

            const editButton = e.target.closest('a[href*="#editar-producto"]');
            if (editButton) {
                e.preventDefault();
                showNotification('La función de editar aún no está implementada.', 'info');
            }
        });
    }
    
    // Función para confirmar eliminación de producto
    async confirmDeleteProduct(productId, productName) {
        if (confirm(`¿Estás seguro de que deseas eliminar el producto "${productName}"?`)) {
            try {
                const response = await fetch(`${this.API_BASE_URL}/products/${productId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'No se pudo eliminar el producto.');
                }

                // Mostrar notificación de éxito
                showNotification(`Producto "${productName}" eliminado correctamente`, 'success');
                
                // Recargar la lista de productos para reflejar el cambio
                this.loadData();
            } catch (error) {
                console.error('Error al eliminar producto:', error);
                showNotification(`Error al eliminar: ${error.message}`, 'danger');
            }
        }
    }
}

export default ProductosView;
