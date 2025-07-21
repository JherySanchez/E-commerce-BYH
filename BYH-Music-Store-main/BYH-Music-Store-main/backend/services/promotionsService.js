// backend/services/promotionsService.js
import supabaseClient from '../supabaseClient.js';

const promotionsService = {
    /**
     * Obtiene todas las promociones de la base de datos.
     * @returns {Promise<{data: any[], error: any}>}
     */
    getAllPromotions: async () => {
        const { data, error } = await supabaseClient
            .from('promotions')
            .select('*')
            .order('created_at', { ascending: false }); // Ordenar por más recientes

        return { data, error };
    },

    /**
     * Crea una nueva promoción en la base de datos.
     * @param {object} promoData - Un objeto con los datos de la nueva promoción.
     * @returns {Promise<{data: any, error: any}>} Un objeto con el dato creado o un error.
     */
    createPromotion: async (promoData) => {
        const { data, error } = await supabaseClient
            .from('promotions')
            .insert([promoData])
            .select()
            .single();

        return { data, error };
    },
};

export default promotionsService;