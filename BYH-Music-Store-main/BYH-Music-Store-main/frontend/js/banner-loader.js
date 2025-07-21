/**
 * banner-loader.js
 * 
 * Se encarga de cargar los banners activos desde la API
 * y mostrarlos en un carrusel de Bootstrap en la página de la tienda.
 */

document.addEventListener('DOMContentLoaded', () => {
    loadActiveBanners();
});

async function loadActiveBanners() {
    const API_URL = 'http://localhost:3000/api/banners';
    const container = document.getElementById('banner-carousel-container');

    if (!container) return;

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('No se pudieron cargar los banners.');
        }

        const allBanners = await response.json();
        // Filtramos para mostrar solo los banners activos y cuya fecha de fin no haya pasado
        const activeBanners = allBanners.filter(banner => {
            const endDate = new Date(banner.end_date);
            const today = new Date();
            // Ajustamos la hora de 'today' para que compare solo la fecha
            today.setHours(0, 0, 0, 0);
            return banner.status === 'active' && endDate >= today;
        });

        if (activeBanners.length > 0) {
            container.innerHTML = generateMarqueeHTML(activeBanners);
        }

    } catch (error) {
        console.error('Error al cargar banners:', error);
        // Opcional: mostrar un mensaje de error en el contenedor
        // No mostramos nada si falla, para no romper el layout.
    }
}

/**
 * Genera el HTML para un carrusel infinito (marquee).
 * @param {Array} banners - Un array de objetos de banner.
 * @returns {string} El HTML del marquee.
 */
function generateMarqueeHTML(banners) {
    // Duplicamos los banners para crear un bucle infinito y suave.
    const duplicatedBanners = [...banners, ...banners,...banners,...banners];

    const items = duplicatedBanners.map(banner => `
        <li class="marquee-item">
            <a href="${banner.link_url || '#'}" target="_blank" title="${banner.title}">
                <img src="${banner.image_url}" alt="${banner.title}">
            </a>
        </li>
    `).join('');

    return `
        <div class="marquee-container">
            <ul class="marquee-track">
                ${items}
            </ul>
        </div>
    `;
}