// Aplicación principal del panel de administración
// Importaciones relativas
import { showNotification } from './utils/helpers.js';
import { DashboardView } from './views/DashboardView.js';
import { ProductosView } from './views/ProductosView.js';
import { PromocionesView } from './views/PromocionesView.js';
import { BannersView } from './views/BannersView.js';
import { ClientesView } from './views/ClientesView.js';
import { NuevoProductoView } from './views/NuevoProductoView.js';
import { PedidosView } from './views/PedidosView.js';
import { NuevaPromocionView } from './views/NuevaPromocionView.js';
import { NuevoBannerView } from './views/NuevoBannerView.js';
import { NuevoClienteView } from './views/NuevoClienteView.js';
import { ConfiguracionView } from './views/ConfiguracionView.js';

class App {
    constructor() {
        this.views = {}; // Almacena las instancias de las vistas
        this.currentView = null; // La vista actualmente cargada
        this.contentArea = document.getElementById('content-area');
        this.init(); // Inicia la aplicación
    }

    /**
     * Inicializa la aplicación
     */
    async init() {
        // Registrar todas las vistas disponibles
        this.registerView('dashboard', new DashboardView());
        this.registerView('productos', new ProductosView());
        this.registerView('promociones', new PromocionesView());
        this.registerView('banners', new BannersView());
        this.registerView('clientes', new ClientesView());
        this.registerView('pedidos', new PedidosView());
        this.registerView('configuracion', new ConfiguracionView());

        // Vistas de submenús y formularios
        this.registerView('listar-productos', new ProductosView());
        this.registerView('nuevo-producto', new NuevoProductoView());
        this.registerView('listar-promociones', new PromocionesView());
        this.registerView('listar-banners', new BannersView());
        this.registerView('nueva-promocion', new NuevaPromocionView());
        this.registerView('nuevo-banner', new NuevoBannerView());
        this.registerView('nuevo-cliente', new NuevoClienteView());

        this.setupRouting();
    }

    /**
     * Configura el enrutamiento del navegador
     */
    setupRouting() {
        // Cargar la vista inicial basada en el hash de la URL
        const initialView = window.location.hash.substring(1) || 'dashboard';
        this.loadView(initialView);

        // Escuchar cambios en el hash para la navegación SPA
        window.addEventListener('hashchange', () => {
            const viewName = window.location.hash.substring(1) || 'dashboard';
            this.loadView(viewName);
        });
    }

    /**
     * Registra una nueva vista
     * @param {string} name - Nombre de la vista
     * @param {Object} viewInstance - Instancia de la clase de la vista
     */
    registerView(name, viewInstance) {
        this.views[name] = viewInstance;
    }

    /**
     * Carga una vista específica
     * @param {string} viewName - Nombre de la vista a cargar
     */
    async loadView(viewName) {
        try {
            const view = this.views[viewName];
            if (!view) {
                console.warn(`La vista '${viewName}' no está registrada. Redirigiendo al dashboard.`);
                window.location.hash = 'dashboard';
                return;
            }

            // 1. Renderizar la estructura HTML de la vista.
            // La propia vista (ej. ProductosView) es responsable de mostrar su estado de carga inicial.
            this.contentArea.innerHTML = view.render ? await view.render() : 'Vista no implementada.';

            // 2. Cargar los datos necesarios para la vista.
            // El método loadData de la vista se encargará de reemplazar su propio spinner por los datos.
            if (view.loadData) {
                await view.loadData();
            }

            // Inicializar los eventos de la vista
            if (view.initEvents) {
                view.initEvents();
            }

            // Caso especial para los gráficos del dashboard
            if (viewName === 'dashboard' && view.initCharts) {
                view.initCharts();
            }

            this.currentView = view;
            this.updateActiveMenu(viewName);
            document.title = `${viewName.charAt(0).toUpperCase() + viewName.slice(1)} | Panel de Administración`;

        } catch (error) {
            console.error('Error al cargar la vista:', error);
            this.contentArea.innerHTML = `
                <div class="alert alert-danger m-4">
                    <h4>Error al cargar la página</h4>
                    <p>${error.message || 'La página solicitada no existe o no está disponible.'}</p>
                    <a href="#dashboard" class="btn btn-primary mt-2">
                        <i class="fas fa-home me-2"></i>Volver al Inicio
                    </a>
                </div>`;
        }
    }

    /**
     * Actualiza el menú activo según la vista actual
     */
    updateActiveMenu(viewName) {
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.parentElement.classList.remove('active');
            if (link.getAttribute('href') === `#${viewName}`) {
                link.parentElement.classList.add('active');
                // Si es un submenú, también activa el padre
                const parentSubmenu = link.closest('.submenu');
                if (parentSubmenu) {
                    parentSubmenu.parentElement.classList.add('active');
                }
            }
        });
    }
}

// --- INICIO DE LA EJECUCIÓN DEL SCRIPT ---
// Como este script se carga al final del body, todos los elementos HTML ya existen.

// 1. Crear la instancia principal de la aplicación. Esto inicia todo.
window.app = new App();

// 2. Configurar los listeners de eventos globales

// Manejar clics en el menú para delegar a la app
document.querySelector('.sidebar').addEventListener('click', (e) => {
    const link = e.target.closest('a[data-view]');
    if (link) {
        e.preventDefault();
        const viewName = link.dataset.view;
        window.location.hash = viewName;
    }
});

// Manejar cierre de sesión
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            localStorage.clear();
            window.location.href = '../frontend/pages/tienda.html';
        }
    });
}

// Manejar el nombre de usuario en la barra lateral
const userName = localStorage.getItem('userName');
const userNameSpan = document.getElementById('userNameSpan');
if (userName && userNameSpan) {
    userNameSpan.textContent = userName;
}

// Manejar el toggle del sidebar
const toggleSidebar = document.getElementById('toggleSidebar');
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');
if (toggleSidebar && sidebar && mainContent) {
    toggleSidebar.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
        localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
    });
}

// Restaurar estado del sidebar colapsado
if (localStorage.getItem('sidebarCollapsed') === 'true' && sidebar) {
    sidebar.classList.add('collapsed');
    mainContent.classList.add('expanded');
}
