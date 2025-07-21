// backend/services/usersService.js
import supabaseClient from '../supabaseClient.js';

const usersService = {
    /**
     * Obtiene todos los usuarios de la base de datos.
     * @returns {Promise<{data: any[], error: any}>}
     */
    getAllUsers: async () => {
        // Seleccionamos campos específicos para no exponer información sensible como la contraseña.
        const { data, error } = await supabaseClient
            .from('users')
            .select('id, name, email, role, created_at');

        return { data, error };
    },

    /**
     * Crea un nuevo usuario en la base de datos.
     * @param {object} userData - Datos del nuevo usuario.
     * @returns {Promise<{data: any, error: any}>}
     */
    createUser: async (userData) => {
        // En una aplicación real, aquí se debería hashear la contraseña antes de guardarla.
        // También es una buena práctica asegurarse de que solo los campos esperados se inserten.
        const { name, email, password, phone, address } = userData;

        const userToInsert = {
            name,
            email,
            password,
            role: 'cliente', // Asignar un rol por defecto para nuevos usuarios
        };

        if (phone) userToInsert.phone = phone;
        if (address) userToInsert.address = address;

        const { data, error } = await supabaseClient
            .from('users')
            .insert([userToInsert])
            .select()
            .single();
        return { data, error };
    },
};

export default usersService;