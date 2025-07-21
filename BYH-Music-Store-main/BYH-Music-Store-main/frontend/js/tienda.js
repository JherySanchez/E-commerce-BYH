document.addEventListener('DOMContentLoaded', async () => {
    const productsGrid = document.querySelector('.products-grid');
    const API_URL = 'http://localhost:3000/api';

    if (!productsGrid) {
        console.error('El contenedor de productos (.products-grid) no fue encontrado.');
        return;
    }

    async function loadProducts() {
        // Mostrar un mensaje de carga
        productsGrid.innerHTML = '<p class="loading-message" style="text-align: center; width: 100%;">Cargando productos...</p>';

        try {
            const response = await fetch(`${API_URL}/products`);
            if (!response.ok) {
                throw new Error('No se pudieron cargar los productos.');
            }
            const products = await response.json();

            // Limpiar el mensaje de carga
            productsGrid.innerHTML = '';

            if (products.length === 0) {
                productsGrid.innerHTML = '<p style="text-align: center; width: 100%;">No hay productos disponibles en este momento.</p>';
                return;
            }

            // Renderizar cada producto
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product';
                productCard.innerHTML = `
                    <img src="${product.image_url || '../assets/product1.jpg'}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>S/. ${parseFloat(product.price).toFixed(2)}</p>
                    <a href="detalles-producto.html?id=${product.id}" class="details-button">Ver detalles</a>
                `;
                productsGrid.appendChild(productCard);
            });

        } catch (error) {
            console.error('Error:', error);
            productsGrid.innerHTML = `<p class="error-message" style="text-align: center; width: 100%;">Error al cargar los productos. Por favor, intenta de nuevo más tarde.</p>`;
        }
    }

    loadProducts();
});