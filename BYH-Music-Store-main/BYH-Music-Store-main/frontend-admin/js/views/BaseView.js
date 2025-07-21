// Clase base para todas las vistas
export class BaseView {
    constructor() {
        this.title = 'Vista sin título';
        this.content = '';
        this.data = null;
    }

    /**
     * Método para cargar datos asíncronos
     * @returns {Promise<void>}
     */
    async loadData() {
        // Implementar en las clases hijas si es necesario
    }

    /**
     * Método para renderizar la vista
     * @returns {Promise<void>}
     */
    async render() {
        // Cargar datos primero si es necesario
        await this.loadData();
        
        // Renderizar la estructura HTML
        this.renderStructure();
        
        // Configurar eventos
        this.setupEventListeners();
    }

    /**
     * Método para renderizar la estructura HTML de la vista
     */
    renderStructure() {
        // Implementar en las clases hijas
        this.content = `
            <div class="view-header">
                <h1>${this.title}</h1>
                <div class="view-actions">
                    <!-- Acciones de la vista -->
                </div>
            </div>
            <div class="view-content">
                <p>Contenido de la vista</p>
            </div>
        `;
    }

    /**
     * Método para configurar los event listeners de la vista
     */
    setupEventListeners() {
        // Implementar en las clases hijas si es necesario
    }

    /**
     * Método para limpiar recursos cuando la vista se destruye
     */
    destroy() {
        // Implementar en las clases hijas si es necesario
    }

    /**
     * Obtiene el título de la vista
     * @returns {string} Título de la vista
     */
    getTitle() {
        return this.title;
    }

    /**
     * Obtiene el contenido HTML de la vista
     * @returns {string} Contenido HTML
     */
    getContent() {
        return this.content;
    }

    /**
     * Muestra un mensaje de carga
     * @param {string} message - Mensaje a mostrar
     * @returns {string} HTML del mensaje de carga
     */
    showLoading(message = 'Cargando...') {
        return `
            <div class="loading-container">
                <div class="spinner"></div>
                <p>${message}</p>
            </div>
        `;
    }

    /**
     * Muestra un mensaje de error
     * @param {string} message - Mensaje de error
     * @param {Error} [error] - Objeto de error opcional
     * @returns {string} HTML del mensaje de error
     */
    showError(message, error = null) {
        console.error(message, error);
        return `
            <div class="error-container">
                <div class="error-icon">
                    <i class="fas fa-exclamation-circle"></i>
                </div>
                <h3>¡Ha ocurrido un error!</h3>
                <p>${message}</p>
                ${error ? `<pre class="error-details">${error.message || 'Sin detalles'}</pre>` : ''}
                <button class="btn btn-primary" onclick="window.location.reload()">
                    <i class="fas fa-sync-alt"></i> Recargar
                </button>
            </div>
        `;
    }

    /**
     * Actualiza el contenido de un elemento
     * @param {string} selector - Selector del elemento
     * @param {string} content - Nuevo contenido
     */
    updateContent(selector, content) {
        const element = document.querySelector(selector);
        if (element) {
            element.innerHTML = content;
        }
    }

    /**
     * Formatea un número como moneda
     * @param {number} amount - Cantidad a formatear
     * @param {string} [currency='PEN'] - Código de moneda
     * @returns {string} Cantidad formateada
     */
    formatCurrency(amount, currency = 'PEN') {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2
        }).format(amount);
    }

    /**
     * Formatea una fecha
     * @param {string|Date} date - Fecha a formatear
     * @param {Object} [options] - Opciones de formato
     * @returns {string} Fecha formateada
     */
    formatDate(date, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        
        const mergedOptions = { ...defaultOptions, ...options };
        return new Date(date).toLocaleDateString('es-ES', mergedOptions);
    }
}

        // Inicialización del menú hamburguesa
        $(document).ready(function() {
          // Alternar menú lateral
          $('#toggleSidebar').on('click', function() {
              $('.sidebar').toggleClass('collapsed');
              $('.main-content').toggleClass('expanded');
              
              // Guardar preferencia
              localStorage.setItem('sidebarCollapsed', $('.sidebar').hasClass('collapsed'));
          });
          
          // Cerrar menú al hacer clic en un enlace en dispositivos móviles
          $('.nav-menu a').on('click', function() {
              if ($(window).width() < 992) {
                  $('.sidebar').addClass('collapsed');
                  $('.main-content').addClass('expanded');
              }
          });
          
          // Manejar el envío del formulario de búsqueda
          $('#searchForm').on('submit', function(e) {
              e.preventDefault();
              const searchTerm = $('#searchInput').val().trim();
              if (searchTerm) {
                  // Aquí iría la lógica de búsqueda
                  console.log('Buscando:', searchTerm);
                  // Por ahora, solo mostramos una alerta
                  alert('Búsqueda: ' + searchTerm);
              }
          });
          
          // Manejar el cierre de sesión
          $('#logoutBtn').on('click', function(e) {
              e.preventDefault();
              if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                  // Aquí iría la lógica de cierre de sesión
                  localStorage.removeItem('authToken');
                  window.location.href = 'login.html';
              }
          });
          
          // Cargar preferencia del menú
          if (localStorage.getItem('sidebarCollapsed') === 'true') {
              $('.sidebar').addClass('collapsed');
              $('.main-content').addClass('expanded');
          }
      });
      
      // Manejar clics en los enlaces del menú
      document.addEventListener('click', function(e) {
          // Si el clic fue en un enlace con data-view
          if (e.target.closest('[data-view]')) {
              const view = e.target.closest('[data-view]').getAttribute('data-view');
              // Aquí iría la lógica para cargar la vista correspondiente
              console.log('Cargando vista:', view);
              // Por ahora, solo actualizamos la clase activa
              document.querySelectorAll('.nav-menu li').forEach(li => {
                  li.classList.remove('active');
              });
              e.target.closest('li').classList.add('active');
          }
      });