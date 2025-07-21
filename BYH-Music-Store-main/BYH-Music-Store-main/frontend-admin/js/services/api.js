// Servicio para manejar peticiones HTTP

const API_BASE_URL = 'http://localhost:3000/api'; // URL base de la API

/**
 * Realiza una petición HTTP
 * @param {string} endpoint - Endpoint de la API
 * @param {string} method - Método HTTP (GET, POST, PUT, DELETE)
 * @param {Object} [data] - Datos a enviar en el cuerpo de la petición
 * @param {Object} [headers] - Cabeceras adicionales
 * @returns {Promise<Object>} Respuesta de la API
 */
export const fetchApi = async (endpoint, method = 'GET', data = null, headers = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    
    // Agregar token de autenticación si existe
    const token = localStorage.getItem('authToken');
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
    
    const config = {
        method,
        headers: { ...defaultHeaders, ...headers },
    };
    
    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        config.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(url, config);
        const responseData = await response.json();
        
        if (!response.ok) {
            throw new Error(responseData.message || 'Error en la petición');
        }
        
        return responseData;
    } catch (error) {
        console.error('Error en la petición:', error);
        throw error;
    }
};

/**
 * Servicio para manejar operaciones de productos
 */
export const productService = {
    /**
     * Obtiene todos los productos
     * @param {Object} filters - Filtros de búsqueda
     * @returns {Promise<Array>} Lista de productos
     */
    getAll: async (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        return fetchApi(`/products?${queryParams}`);
    },
    
    /**
     * Obtiene un producto por su ID
     * @param {string} id - ID del producto
     * @returns {Promise<Object>} Producto
     */
    getById: async (id) => {
        return fetchApi(`/products/${id}`);
    },
    
    /**
     * Crea un nuevo producto
     * @param {Object} productData - Datos del producto
     * @returns {Promise<Object>} Producto creado
     */
    create: async (productData) => {
        return fetchApi('/products', 'POST', productData);
    },
    
    /**
     * Actualiza un producto existente
     * @param {string} id - ID del producto
     * @param {Object} productData - Datos actualizados del producto
     * @returns {Promise<Object>} Producto actualizado
     */
    update: async (id, productData) => {
        return fetchApi(`/products/${id}`, 'PUT', productData);
    },
    
    /**
     * Elimina un producto
     * @param {string} id - ID del producto a eliminar
     * @returns {Promise<Object>} Resultado de la operación
     */
    delete: async (id) => {
        return fetchApi(`/products/${id}`, 'DELETE');
    }
};

/**
 * Servicio para manejar operaciones de autenticación
 */
export const authService = {
    /**
     * Inicia sesión
     * @param {string} email - Correo electrónico
     * @param {string} password - Contraseña
     * @returns {Promise<Object>} Datos del usuario y token
     */
    login: async (email, password) => {
        const response = await fetchApi('/auth/login', 'POST', { email, password });
        if (response.token) {
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
        }
        return response;
    },
    
    /**
     * Cierra la sesión del usuario
     */
    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    },
    
    /**
     * Obtiene el usuario autenticado
     * @returns {Object|null} Datos del usuario o null si no hay sesión
     */
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    
    /**
     * Verifica si el usuario está autenticado
     * @returns {boolean} true si el usuario está autenticado, false en caso contrario
     */
    isAuthenticated: () => {
        return !!localStorage.getItem('authToken');
    }
};
