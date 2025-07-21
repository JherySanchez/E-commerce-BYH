// backend/services/settingsService.js
import supabaseClient from '../supabaseClient.js';

const settingsService = {
    /**
     * Obtiene todas las configuraciones como un objeto clave-valor.
     * @returns {Promise<{data: object, error: any}>}
     */
    getAllSettings: async () => {
        const { data, error } = await supabaseClient
            .from('settings')
            .select('key, value');

        // Transforma el array de la DB en un objeto para fácil acceso en el frontend
        if (data) {
            const settingsObject = data.reduce((obj, item) => {
                obj[item.key] = item.value;
                return obj;
            }, {});
            return { data: settingsObject, error: null };
        }

        return { data, error };
    },

    /**
     * Actualiza múltiples configuraciones usando upsert.
     * @param {Object} settingsToUpdate - Un objeto con clave/valor de las configuraciones a actualizar.
     * @returns {Promise<{data: any, error: any}>}
     */
    updateSettings: async (settingsToUpdate) => {
        const updates = Object.entries(settingsToUpdate).map(([key, value]) => ({ key, value }));

        const { data, error } = await supabaseClient
            .from('settings')
            .upsert(updates, { onConflict: 'key' }); // Si la 'key' ya existe, la actualiza.

        return { data, error };
    }
};

export default settingsService;