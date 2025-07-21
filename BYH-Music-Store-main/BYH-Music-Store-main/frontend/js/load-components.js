/**
 * Archivo: load-components.js
 * 
 * Descripción:
 * Este módulo se encarga de cargar dinámicamente los componentes reutilizables
 * del sitio web, específicamente el header y el footer, en todas las páginas.
 * También gestiona la inicialización de componentes globales como el menú móvil.
 * 
 * Características principales:
 * - Carga asíncrona de componentes para mejorar el rendimiento
 * - Inyección de componentes en tiempo de ejecución
 * - Manejo de dependencias externas (Font Awesome)
 * - Inicialización del menú móvil responsive
 * 
 * Notas de implementación:
 * - Utiliza la Fetch API para cargar los componentes
 * - Los componentes se cargan en orden secuencial
 * - Incluye manejo de errores básico
 */

/**
 * Inicialización principal que se ejecuta cuando el DOM está completamente cargado
 * 
 * Este bloque de código se encarga de:
 * 1. Cargar la biblioteca Font Awesome para los íconos
 * 2. Cargar el header en la parte superior del body
 * 3. Cargar el footer en la parte inferior del body
 * 4. Inicializar componentes interactivos
 */
document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // 1. Carga de dependencias externas
    // ============================================
    // Carga la biblioteca Font Awesome para los íconos del sitio
    // Esto permite utilizar íconos en cualquier parte de la aplicación
    const fontAwesome = document.createElement('link');
    fontAwesome.rel = 'stylesheet';
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
    document.head.appendChild(fontAwesome);
    
    // ============================================
    // 2. Carga del Header
    // ============================================
    // Carga el componente de encabezado de forma asíncrona
    // y lo inserta al inicio del body
    fetch('../components/header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el header');
            }
            return response.text();
        })
        .then(html => {
            // Inserta el header al inicio del body
            document.querySelector('body').insertAdjacentHTML('afterbegin', html);
            // Inicializa el menú móvil después de cargar el header
            updateCartCounter();
            initMobileMenu();
        })
        .catch(error => {
            console.error('Error al cargar el header:', error);
        });

    // ============================================
    // 3. Carga del Footer
    // ============================================
    // Carga el componente de pie de página de forma asíncrona
    // y lo inserta al final del body
    fetch('../components/footer.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el footer');
            }
            return response.text();
        })
        .then(html => {
            // Inserta el footer al final del body
            document.querySelector('body').insertAdjacentHTML('beforeend', html);
        })
        .catch(error => {
            console.error('Error al cargar el footer:', error);
        });

    // ============================================
    // 4. Inicialización de Componentes
    // ============================================
    
    /**
     * Inicializa el menú móvil para dispositivos con pantallas pequeñas
     * 
     * Esta función:
     * 1. Obtiene referencias a los elementos del menú
     * 2. Configura los eventos de clic para mostrar/ocultar el menú
     * 3. Maneja la accesibilidad del menú
     * 
     * Nota: Se ejecuta después de cargar el header
     */
    function initMobileMenu() {
        const menuToggle = document.getElementById('menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (menuToggle && navMenu) {
            // Configura el evento de clic para el botón del menú
            menuToggle.addEventListener('click', function(event) {
                event.stopPropagation(); // Evita la propagación del evento
                
                // Alterna la visibilidad del menú
                const isExpanded = navMenu.classList.toggle('active');
                menuToggle.classList.toggle('active');
                
                // Actualiza atributos ARIA para accesibilidad
                menuToggle.setAttribute('aria-expanded', isExpanded);
                navMenu.setAttribute('aria-hidden', !isExpanded);
                
                // Enfoca el primer elemento del menú cuando se abre
                if (isExpanded) {
                    const firstNavItem = navMenu.querySelector('a, button');
                    firstNavItem?.focus();
                }
            });
            
            // Cierra el menú al hacer clic fuera de él
            document.addEventListener('click', (event) => {
                if (navMenu.classList.contains('active') && 
                    !event.target.closest('.nav-menu') && 
                    !event.target.closest('#menu-toggle')) {
                    navMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    navMenu.setAttribute('aria-hidden', 'true');
                }
            });
            
            // Mejora la accesibilidad del teclado
            navMenu.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') {
                    navMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                    menuToggle.focus();
                }
            });
        }
    }
});
