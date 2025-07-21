// backend/services/products.js

// Este objeto 'productService' agrupa todas las funciones relacionadas con la tabla 'products'.
// Utiliza la instancia 'supabaseClient' que fue creada en supabaseClient.js

import supabaseClient from '../supabaseClient.js';

const productService = {
    /**
     * Obtiene todos los productos de la base de datos.
     * @returns {Promise<{data: any[], error: any}>} Un objeto con los datos o un error.
     */
    getAllProducts: async () => {
        // Realiza una consulta a la tabla 'products' para seleccionar todos los registros (*).
        const { data, error } = await supabaseClient
            .from('products')
            .select('*');

        return { data, error };
    },

    /**
     * Obtiene un producto específico por su ID.
     * @param {string | number} id - El ID del producto a buscar.
     * @returns {Promise<{data: any, error: any}>} Un objeto con el dato o un error.
     */
    getProductById: async (id) => {
        // Realiza una consulta para seleccionar el producto donde el 'id' coincida.
        // .single() asegura que se devuelva un solo objeto en lugar de un array.
        const { data, error } = await supabaseClient
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        return { data, error };
    },

    /**
     * Crea un nuevo producto en la base de datos.
     * @param {object} productData - Un objeto con los datos del nuevo producto (ej: { name: '...', price: ... }).
     * @returns {Promise<{data: any, error: any}>} Un objeto con el dato creado o un error.
     */
    createProduct: async (productData) => {
        // Inserta un nuevo registro en la tabla 'products'.
        const { data, error } = await supabaseClient
            .from('products')
            .insert([productData])
            .select()
            .single();

        return { data, error };
    },

    /**
     * Actualiza un producto existente por su ID.
     * @param {string | number} id - El ID del producto a actualizar.
     * @param {object} updatedData - Un objeto con los datos a actualizar del producto.
     * @returns {Promise<{data: any, error: any}>} Un objeto con el dato actualizado o un error.
     */
    updateProduct: async (id, updatedData) => {
        const { data, error } = await supabaseClient
            .from('products')
            .update(updatedData)
            .eq('id', id)
            .select()
            .single(); // Devuelve el producto actualizado

        return { data, error };
    },

    /**
     * Elimina un producto por su ID.
     * @param {string | number} id - El ID del producto a eliminar.
     * @returns {Promise<{data: any, error: any}>} Un objeto con el dato eliminado (usualmente null en delete) o un error.
     */
    deleteProduct: async (id) => {
        const { data, error } = await supabaseClient
            .from('products')
            .delete()
            .eq('id', id)
            .select() // Aunque se elimina, puedes usar .select() para obtener el registro eliminado si es necesario
            .single(); // Asumiendo que eliminas un solo registro

        return { data, error };
    }


};

export default productService;
