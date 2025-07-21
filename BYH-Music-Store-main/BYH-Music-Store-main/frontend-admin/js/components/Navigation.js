// Componente de Navegación
import { authService } from '../services/authService.js';

export class Navigation {
    constructor() {
        this.navElement = document.createElement('aside');
        this.navElement.className = 'sidebar';
        this.currentUser = null;
        
        // Verificar autenticación
        if (!authService.isAuthenticated()) {
            authService.logout();
            return;
        }
        
        this.currentUser = authService.getCurrentUser();
        
        // Si no hay usuario pero hay token, redirigir al login
        if (!this.currentUser) {
            authService.logout();
        }
    }

    /**
     * Renderiza el menú de navegación
     * @returns {HTMLElement} Elemento del menú de navegación
     */
    render() {
        this.navElement.innerHTML = `
            <div class="logo">
                <h2>BYH Music</h2>
                <p>Panel de Administración</p>
            </div>
            <nav class="nav-menu">
                <ul>
                    <li data-view="dashboard">
                        <a href="#"><i class="fas fa-home"></i> Dashboard</a>
                    </li>
                    <li data-view="productos">
                        <a href="#"><i class="fas fa-guitar"></i> Productos</a>
                        <ul class="submenu">
                            <li data-view="nuevo-producto"><a href="#">Nuevo Producto</a></li>
                            <li data-view="listar-productos"><a href="#">Listar Productos</a></li>
                        </ul>
                    </li>
                    <li data-view="promociones">
                        <a href="#"><i class="fas fa-tags"></i> Promociones</a>
                        <ul class="submenu">
                            <li data-view="nueva-promocion"><a href="#">Nueva Promoción</a></li>
                            <li data-view="listar-promociones"><a href="#">Listar Promociones</a></li>
                        </ul>
                    </li>
                    <li data-view="banners">
                        <a href="#"><i class="fas fa-image"></i> Banners</a>
                        <ul class="submenu">
                            <li data-view="nuevo-banner"><a href="#">Nuevo Banner</a></li>
                            <li data-view="listar-banners"><a href="#">Listar Banners</a></li>
                        </ul>
                    </li>
                    <li data-view="pedidos">
                        <a href="#"><i class="fas fa-shopping-cart"></i> Pedidos</a>
                    </li>
                    <li data-view="clientes">
                        <a href="#"><i class="fas fa-users"></i> Clientes</a>
                    </li>
                    <li data-view="configuracion">
                        <a href="#"><i class="fas fa-cog"></i> Configuración</a>
                    </li>
                </ul>
            </nav>
            <div class="user-panel">
                <div class="user-info">
                    <img src="./img/default-avatar.svg" alt="Admin" class="user-avatar">
                    <div class="user-details">
                        <span class="user-name">${this.currentUser?.name || 'Admin'}</span>
                        <span class="user-role">Administrador</span>
                    </div>
                </div>
                <a href="#" class="logout-btn">
                    <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                </a>
            </div>
        `;

        // Configurar eventos
        this.setupEvents();
        
        return this.navElement;
    }

    /**
     * Configura los eventos del menú de navegación
     */
    setupEvents() {
        // Evento para los enlaces del menú principal
        this.navElement.querySelectorAll('.nav-menu > ul > li > a').forEach(menuItem => {
            menuItem.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Si el elemento tiene submenú, no cargar la vista
                const submenu = e.target.nextElementSibling;
                if (submenu && submenu.classList.contains('submenu')) {
                    return;
                }
                
                // Cargar la vista correspondiente
                const viewName = e.target.parentElement.getAttribute('data-view');
                if (viewName) {
                    this.loadView(viewName);
                }
            });
        });
        
        // Evento para los enlaces de submenú
        this.navElement.querySelectorAll('.submenu a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const viewName = e.target.parentElement.getAttribute('data-view');
                if (viewName) {
                    this.loadView(viewName);
                }
            });
        });
        
        // Evento para el botón de logout
        const logoutBtn = this.navElement.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                    authService.logout();
                    window.location.href = 'login.html';
                }
            });
        }
    }

    /**
     * Carga una vista específica
     * @param {string} viewName - Nombre de la vista a cargar
     */
    loadView(viewName) {
        // Actualizar el menú activo
        this.updateActiveMenu(viewName);
        
        // Disparar un evento personalizado para notificar el cambio de vista
        const event = new CustomEvent('viewChange', { detail: { view: viewName } });
        document.dispatchEvent(event);
    }

    /**
     * Actualiza el menú activo
     * @param {string} viewName - Nombre de la vista activa
     */
    updateActiveMenu(viewName) {
        // Remover la clase 'active' de todos los elementos del menú
        this.navElement.querySelectorAll('.nav-menu li').forEach(item => {
            item.classList.remove('active');
        });
        
        // Agregar la clase 'active' al elemento del menú actual
        const activeItem = this.navElement.querySelector(`.nav-menu li[data-view="${viewName}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
            
            // Si el elemento tiene un padre con submenú, también marcar el padre como activo
            const parentMenu = activeItem.closest('ul.submenu');
            if (parentMenu && parentMenu.previousElementSibling) {
                parentMenu.previousElementSibling.parentElement.classList.add('active');
            }
        }
    }

    /**
     * Alternar la visibilidad del menú lateral
     */
    toggle() {
        this.navElement.classList.toggle('collapsed');
        document.querySelector('.main-content').classList.toggle('expanded');
        
        // Guardar preferencia en localStorage
        localStorage.setItem('sidebarCollapsed', this.navElement.classList.contains('collapsed'));
    }
}
