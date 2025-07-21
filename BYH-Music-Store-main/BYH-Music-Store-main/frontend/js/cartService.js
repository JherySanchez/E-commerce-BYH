/**
 * Servicio para gestionar el carrito de compras.
 * Utiliza localStorage para persistir los datos del carrito.
 */

const CART_KEY = 'byhMusicCart';

/**
 * Obtiene el carrito actual desde localStorage.
 * @returns {Array} El array de items en el carrito.
 */
function getCart() {
    try {
        const cart = localStorage.getItem(CART_KEY);
        return cart ? JSON.parse(cart) : [];
    } catch (e) {
        console.error("Error al leer el carrito de localStorage", e);
        return [];
    }
}

/**
 * Guarda el carrito en localStorage.
 * @param {Array} cart - El array de items del carrito a guardar.
 */
function saveCart(cart) {
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        // Dispara un evento global para que otras partes de la UI (como el header) puedan reaccionar.
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (e) {
        console.error("Error al guardar el carrito en localStorage", e);
    }
}

/**
 * Agrega un producto al carrito o actualiza su cantidad si ya existe.
 * @param {object} product - El objeto del producto a agregar.
 * @param {number} quantity - La cantidad a agregar.
 */
export function addToCart(product, quantity) {
    const cart = getCart();
    const existingItemIndex = cart.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
        // El producto ya está en el carrito, suma la cantidad
        cart[existingItemIndex].quantity += quantity;
    } else {
        // El producto es nuevo, lo agregamos
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image_url: product.image_url,
            quantity: quantity
        });
    }

    saveCart(cart);
}

/**
 * Actualiza la cantidad de un item específico en el carrito.
 * Si la cantidad es 0 o menor, elimina el item.
 * @param {number} productId - El ID del producto a actualizar.
 * @param {number} quantity - La nueva cantidad.
 */
export function updateItemQuantity(productId, quantity) {
    const cart = getCart();
    const itemIndex = cart.findIndex(item => item.id === productId);

    if (itemIndex > -1) {
        if (quantity > 0) {
            cart[itemIndex].quantity = quantity;
        } else {
            cart.splice(itemIndex, 1); // Elimina el item si la cantidad es 0 o menos
        }
        saveCart(cart);
    }
}

/**
 * Elimina un producto del carrito.
 * @param {number} productId - El ID del producto a eliminar.
 */
export function removeFromCart(productId) {
    let cart = getCart();
    // Filtra el array, manteniendo todos los items excepto el que se va a eliminar.
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
}