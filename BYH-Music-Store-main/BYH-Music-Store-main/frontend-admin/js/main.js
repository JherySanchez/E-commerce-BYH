// Punto de entrada principal de la aplicación
import { App } from './App.js';

// Crear instancia global de la aplicación
window.app = window.app || new App();

// Inicializar el menú colapsable
function initSidebar() {
    const toggleBtn = document.querySelector('.toggle-sidebar');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            document.querySelector('.sidebar').classList.toggle('collapsed');
            document.querySelector('.main-content').classList.toggle('expanded');
            
            // Guardar preferencia
            localStorage.setItem('sidebarCollapsed', 
                document.querySelector('.sidebar').classList.contains('collapsed')
            );
        });
    }
    
    // Aplicar preferencia guardada
    if (localStorage.getItem('sidebarCollapsed') === 'true') {
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        if (sidebar) sidebar.classList.add('collapsed');
        if (mainContent) mainContent.classList.add('expanded');
    }
}

// Manejar clics en el menú
document.addEventListener('click', (e) => {
    // Manejar clics en enlaces del menú
    const menuLink = e.target.closest('.nav-menu a');
    if (menuLink) {
        e.preventDefault();
        const viewName = menuLink.getAttribute('data-view');
        if (viewName && window.app && typeof window.app.loadView === 'function') {
            window.app.loadView(viewName);
        }
    }
});

// Manejar la carga inicial basada en el hash de la URL
function handleInitialLoad() {
    const hash = window.location.hash.substring(1);
    const defaultView = 'dashboard';
    
    if (hash) {
        window.app.loadView(hash).catch(() => {
            // Si falla la carga de la vista del hash, cargar la vista por defecto
            window.app.loadView(defaultView);
        });
    } else {
        window.app.loadView(defaultView);
    }
}

// Cargar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Inicializar el menú
        initSidebar();
        
        // Manejar la navegación inicial
        handleInitialLoad();
        
        console.log('Aplicación lista');
    } catch (error) {
        console.error('Error al cargar la aplicación:', error);
        
        // Mostrar mensaje de error al usuario
        const contentArea = document.getElementById('contentArea');
        if (contentArea) {
            contentArea.innerHTML = `
                <div class="alert alert-danger m-4">
                    <h4>Error al cargar la aplicación</h4>
                    <p>${error.message || 'Ha ocurrido un error inesperado.'}</p>
                    <button class="btn btn-primary" onclick="window.location.reload()">
                        <i class="fas fa-sync-alt me-2"></i>Reintentar
                    </button>
                </div>
            `;
        }
    }
});

// Aquí puedes agregar inicializaciones adicionales que necesites
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar tooltips de Bootstrap si los usas
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});
