/**
 * Archivo: main.js
 * 
 * Descripción: 
 * Este archivo es el núcleo de la aplicación web de BYH, conteniendo la lógica principal
 * que se ejecuta en todas las páginas. Maneja la interactividad del sitio, incluyendo
 * navegación, autenticación y funcionalidades del carrito de compras.
 * 
 * Estructura del código:
 * 1. Inicialización al cargar el DOM
 * 2. Navegación en sección "Nosotros"
 * 3. Menú móvil responsive
 * 4. Scroll suave para navegación
 * 5. Funciones de autenticación
 * 6. Funciones del carrito de compras
 * 7. Utilidades varias
 * 
 * Notas importantes:
 * - Utiliza localStorage para persistencia del carrito
 * - Implementa patrones de diseño como IIFE y event delegation
 * - Sigue principios de accesibilidad web (a11y)
 */

// Inicialización principal que se ejecuta cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // =============================================
    // 1. Navegación en la sección "Nosotros"
    // =============================================
    // Controla la navegación por pestañas en la sección de "Nosotros"
    // Permite alternar entre diferentes secciones de contenido (Misión, Visión, etc.)
    const nosotrosLinks = document.querySelectorAll('.nosotros-nav .nav-link');
    const contentSections = document.querySelectorAll('.content-section');

    // Configura los eventos de clic para los enlaces de navegación
    nosotrosLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            // Actualiza los estados activos
            nosotrosLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Muestra/oculta las secciones correspondientes
            contentSections.forEach(section => {
                section.classList.toggle('active', section.id === targetId);
            });
        });
    });

        // =============================================
    // 2. Menú móvil
    // =============================================
    // Configuración del menú hamburguesa para dispositivos móviles
    // Incluye animación del ícono y manejo de eventos táctiles
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    menuToggle?.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const spans = menuToggle.querySelectorAll('span');
        
        // Anima el ícono de hamburguesa a X
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Cierra el menú móvil al hacer clic fuera de él
    document.addEventListener('click', (e) => {
        if (navMenu?.classList.contains('active') && 
            !e.target.closest('.nav-menu') && 
            !e.target.closest('#menu-toggle')) {
            navMenu.classList.remove('active');
            const spans = menuToggle?.querySelectorAll('span');
            spans?.[0].style.transform = 'none';
            spans?.[1].style.opacity = '1';
            spans?.[2].style.transform = 'none';
        }
    });

//** 

        // =============================================
    // 3. Scroll suave
    // =============================================
    // Implementa scroll suave para todos los enlaces internos (#)
    // Mejora la experiencia de usuario al navegar por secciones de la misma página
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Cierra el menú móvil después de hacer clic en un enlace
                if (navMenu?.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    const spans = menuToggle?.querySelectorAll('span');
                    spans?.[0].style.transform = 'none';
                    spans?.[1].style.opacity = '1';
                    spans?.[2].style.transform = 'none';
                }
            }
        });
    });
});

// =============================================
// 4. Funciones de autenticación
// =============================================

/**
 * Autentica un usuario en el sistema
 * 
 * @param {string} email - Correo electrónico del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<Object>} Objeto con la respuesta del servidor
 * @throws {Error} Cuando hay un error de conexión
 * 
 * Ejemplo de uso:
 * login('usuario@ejemplo.com', 'contraseña')
 *   .then(response => console.log('Autenticación exitosa'))
 *   .catch(error => console.error('Error de autenticación', error));
 */
async function login(email, password) {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        return await response.json();
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        return { status: 'error', message: 'Error en la conexión' };
    }
}

// =============================================
// 5. Funciones del carrito de compras
// =============================================

/**
 * Agrega un producto al carrito de compras
 * 
 * @param {string|number} productId - ID único del producto a agregar
 * 
 * Almacena los IDs de los productos en el localStorage del navegador
 * y actualiza la interfaz de usuario del carrito.
 * 
 * Nota: Los datos se guardan en formato JSON en localStorage
 * bajo la clave 'cart'.
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

/**
 * Actualiza la interfaz de usuario del carrito
 * 
 * Obtiene los productos del localStorage y actualiza el contador
 * de productos en el ícono del carrito en la barra de navegación.
 * 
 * Se ejecuta automáticamente al cargar la página y después de
 * cualquier modificación al carrito.
function updateCartUI() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

// =============================================
// 6. Utilidades
// =============================================

/**
 * Formatea una fecha en un formato legible para el blog
 * 
 * @param {string|Date} date - Fecha a formatear (puede ser string o objeto Date)
 * @returns {string} Fecha formateada en formato local español
 * 
 * Ejemplo: "15 de enero de 2023"
 */
function formatDate(date) {
    return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Inicialización
updateCartUI();
