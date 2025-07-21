/**
 * Configuración de vistas de la aplicación
 * Maneja el registro y carga de vistas desde la carpeta /pages/
 */

// Configuración de rutas de vistas
const viewsConfig = {
    'dashboard': {
        title: 'Dashboard',
        path: 'pages/dashboard.html',  // Quitamos la barra inicial para usar rutas relativas
        icon: 'fa-home'
    },
    'productos': {  // Agregamos la vista principal de productos
        title: 'Productos',
        path: 'pages/productos.html',
        icon: 'fa-guitar'
    },
    'listar-productos': {
        title: 'Listar Productos',
        path: 'pages/listar-productos.html',
        icon: 'fa-list',
        parent: 'productos'
    },
    'nuevo-producto': {
        title: 'Nuevo Producto',
        path: 'pages/nuevo-producto.html',
        icon: 'fa-plus',
        parent: 'productos'
    },
    'banners': {  // Agregamos la vista principal de banners
        title: 'Banners',
        path: 'pages/banners.html',
        icon: 'fa-image'
    },
    'listar-banners': {
        title: 'Listar Banners',
        path: 'pages/listar-banners.html',
        icon: 'fa-list',
        parent: 'banners'
    },
    'nuevo-banner': {
        title: 'Nuevo Banner',
        path: 'pages/banners.html',  // Usamos banners.html temporalmente
        icon: 'fa-plus',
        parent: 'banners'
    },
    'promociones': {  // Agregamos la vista principal de promociones
        title: 'Promociones',
        path: 'pages/promociones.html',
        icon: 'fa-tags'
    },
    'listar-promociones': {
        title: 'Listar Promociones',
        path: 'pages/promociones.html',  // Usamos promociones.html temporalmente
        icon: 'fa-list',
        parent: 'promociones'
    },
    'nueva-promocion': {
        title: 'Nueva Promoción',
        path: 'pages/promociones.html',  // Usamos promociones.html temporalmente
        icon: 'fa-plus',
        parent: 'promociones'
    },
    'pedidos': {
        title: 'Pedidos',
        path: 'pages/pedidos.html',
        icon: 'fa-shopping-cart'
    },
    'clientes': {
        title: 'Clientes',
        path: 'pages/clientes.html',
        icon: 'fa-users'
    },
    'configuracion': {
        title: 'Configuración',
        path: 'pages/configuración.html',  // Aseguramos que coincida con el nombre del archivo
        icon: 'fa-cog'
    }
};

// Registrar las vistas en la aplicación
Object.entries(viewsConfig).forEach(([name, config]) => {
    if (window.app) {
        window.app.registerView(name, {
            title: config.title,
            load: async (params = {}) => {
                const content = document.querySelector('.content');
                try {
                    // Mostrar indicador de carga
                    content.innerHTML = `
                        <div class="text-center py-5">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Cargando...</span>
                            </div>
                            <p class="mt-2">Cargando ${config.title}...</p>
                        </div>
                    `;

                    // Cargar el contenido HTML
                    const response = await fetch(config.path);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    const html = await response.text();
                    content.innerHTML = html;
                    
                    // Actualizar la clase activa en el menú
                    updateActiveMenuItem(name);
                    
                    // Inicializar componentes específicos de la vista
                    initializeViewComponents(name);
                    
                    return true;
                } catch (error) {
                    console.error(`Error al cargar la vista ${name}:`, error);
                    content.innerHTML = `
                        <div class="alert alert-danger m-3">
                            <h4>Error al cargar la página</h4>
                            <p>No se pudo cargar ${config.title}. ${error.message}</p>
                            <button class="btn btn-primary" onclick="window.app.loadView('${name}')">
                                <i class="fas fa-sync-alt me-2"></i>Reintentar
                            </button>
                        </div>
                    `;
                    return false;
                }
            }
        });
    }
});

/**
 * Actualiza el elemento de menú activo
 * @param {string} viewName - Nombre de la vista activa
 */
function updateActiveMenuItem(viewName) {
    // Remover clase 'active' de todos los elementos del menú
    document.querySelectorAll('.nav-menu li').forEach(item => {
        item.classList.remove('active');
    });
    
    // Agregar clase 'active' al elemento de menú correspondiente
    const menuItem = document.querySelector(`.nav-menu li[data-view="${viewName}"]`);
    if (menuItem) {
        menuItem.classList.add('active');
        
        // Si tiene un padre (ej: submenú), marcar el padre como activo también
        const parentView = viewsConfig[viewName]?.parent;
        if (parentView) {
            const parentMenuItem = document.querySelector(`.nav-menu li[data-view="${parentView}"]`);
            if (parentMenuItem) {
                parentMenuItem.classList.add('active');
                parentMenuItem.classList.add('menu-open');
            }
        }
    }
}

/**
 * Inicializa componentes específicos de cada vista
 * @param {string} viewName - Nombre de la vista actual
 */
function initializeViewComponents(viewName) {
    // Aquí puedes agregar inicializaciones específicas para cada vista
    console.log(`Inicializando componentes para la vista: ${viewName}`);
    
    // Ejemplo: Inicializar DataTables si la vista es listar-productos
    if (viewName === 'listar-productos' && window.$.fn.DataTable) {
        $('#productsTable').DataTable({
            responsive: true,
            language: {
                url: '//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json'
            }
        });
    }
    
    // Puedes agregar más inicializaciones específicas aquí
}

// Manejar clics en los enlaces del menú
document.addEventListener('click', function(e) {
    let target = e.target;
    
    // Si se hizo clic en un ícono dentro del enlace, subimos al enlace padre
    if (target.tagName === 'I' && target.parentElement.tagName === 'A') {
        target = target.parentElement;
    }
    
    // Si se hizo clic en un enlace con data-view
    const link = target.closest('a[data-view]');
    if (link) {
        e.preventDefault();
        const viewName = link.getAttribute('data-view');
        
        // Cerrar el menú en dispositivos móviles
        if (window.innerWidth < 992) {
            document.querySelector('.sidebar').classList.add('collapsed');
            document.querySelector('.main-content').classList.add('expanded');
        }
        
        // Cargar la vista si existe
        if (viewName && window.app && typeof window.app.loadView === 'function') {
            console.log(`Cargando vista: ${viewName}`);
            window.app.loadView(viewName).catch(error => {
                console.error('Error al cargar la vista:', error);
                const content = document.querySelector('.content');
                if (content) {
                    content.innerHTML = `
                        <div class="alert alert-danger m-3">
                            <h4>Error al cargar la página</h4>
                            <p>No se pudo cargar la vista solicitada. Por favor, intente nuevamente.</p>
                            <button class="btn btn-primary" onclick="window.app.loadView('${viewName}')">
                                <i class="fas fa-sync-alt me-2"></i>Reintentar
                            </button>
                        </div>
                    `;
                }
            });
        }
    }
});

// Cargar la vista basada en el hash de la URL al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    const defaultView = 'dashboard';
    const viewName = window.location.hash.substring(1) || defaultView;
    if (window.app && typeof window.app.loadView === 'function') {
        window.app.loadView(viewName);
    }
});

// Manejar cambios en el hash de la URL
window.addEventListener('hashchange', () => {
    const viewName = window.location.hash.substring(1);
    if (viewName && window.app && typeof window.app.loadView === 'function') {
        window.app.loadView(viewName);
    }
});
