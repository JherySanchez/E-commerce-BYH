// backend/services/authService.js

import supabaseClient from '../supabaseClient.js';

const authService = {
    /**
     * Verifica las credenciales de un usuario.
     * NOTA: En un proyecto real, las contraseñas deben estar hasheadas.
     * Por ahora, hacemos una comparación directa por simplicidad.
     * @param {string} email - El email del usuario.
     * @param {string} password - La contraseña del usuario.
     * @returns {Promise<{data: any, error: any}>}
     */
    loginUser: async (email, password) => {
        const { data, error } = await supabaseClient
            .from('users') // Asegúrate de tener una tabla 'users' en Supabase
            .select('id, email, name, role')
            .eq('email', email)
            .eq('password', password) // ¡CUIDADO! Esto no es seguro para producción.
            .single();

        return { data, error };
    }
};

export default authService;