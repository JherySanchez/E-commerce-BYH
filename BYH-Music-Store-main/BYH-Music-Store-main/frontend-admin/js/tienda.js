document.addEventListener('DOMContentLoaded', async () => {
    const productListContainer = document.getElementById('product-list');
    if (!productListContainer) {
        console.error('El contenedor de productos #product-list no fue encontrado.');
        return;
    }

    // Mostrar un indicador de carga mientras se obtienen los datos
    productListContainer.innerHTML = `
        <div class="loading-spinner">
            <p>Cargando productos...</p>
        </div>
    `;

    try {
        // Usamos el mismo productService para obtener los productos desde Supabase
        const { data: products, error } = await productService.getAllProducts();

        if (error) {
            throw new Error(`Error al obtener productos: ${error.message}`);
        }

        if (!products || products.length === 0) {
            productListContainer.innerHTML = '<p>No hay productos disponibles en este momento.</p>';
            return;
        }

        // Limpiar el indicador de carga
        productListContainer.innerHTML = '';

        // Renderizar cada tarjeta de producto
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card'; // Asegúrate de que esta clase coincida con tu CSS
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image_url || '../assets/product-placeholder.png'}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">S/. ${parseFloat(product.price).toFixed(2)}</p>
                    <a href="detalles-producto.html?id=${product.id}" class="btn-details">Ver detalle</a>
                </div>
            `;
            productListContainer.appendChild(productCard);
        });

    } catch (err) {
        console.error(err);
        productListContainer.innerHTML = `<p class="error-message">No se pudieron cargar los productos. Inténtalo de nuevo más tarde.</p>`;
    }
});
