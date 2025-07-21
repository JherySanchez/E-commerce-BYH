/**
 * promotion-loader.js
 * 
 * Se encarga de cargar las promociones activas desde la API
 * y mostrarlas en la barra lateral de la página de la tienda.
 */

document.addEventListener('DOMContentLoaded', () => {
    loadActivePromotions();
});

async function loadActivePromotions() {
    const API_URL = 'http://localhost:3000/api/promotions';
    const container = document.getElementById('promotions-sidebar');

    if (!container) return;

    // Estado de carga inicial
    container.innerHTML = '<h2>Promociones</h2><p>Cargando ofertas...</p>';

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('No se pudieron cargar las promociones.');
        }

        const allPromos = await response.json();
        // Filtramos para mostrar solo las promociones activas y vigentes
        const activePromos = allPromos.filter(promo => {
            const endDate = new Date(promo.end_date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return promo.status === 'active' && endDate >= today;
        });

        if (activePromos.length > 0) {
            container.innerHTML = '<h2>Promociones</h2>' + activePromos.map(generatePromoHTML).join('');
        } else {
            container.innerHTML = '<h2>Promociones</h2><p>No hay ofertas disponibles por el momento.</p>';
        }

    } catch (error) {
        console.error('Error al cargar promociones:', error);
        container.innerHTML = '<h2>Promociones</h2><p>No se pudieron cargar las ofertas.</p>';
    }
}

function generatePromoHTML(promo) {
    const discountText = promo.discount_type === 'percentage'
        ? `${parseFloat(promo.discount_value).toFixed(0)}% OFF`
        : `S/. ${parseFloat(promo.discount_value).toFixed(2)} de descuento`;

    return `
        <div class="promotion-card">
            <h3 class="promo-title">${promo.name}</h3>
            <p class="promo-description">${promo.description || discountText}</p>
        </div>
    `;
}