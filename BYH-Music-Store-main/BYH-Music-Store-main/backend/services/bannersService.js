// backend/services/bannersService.js
import supabaseClient from '../supabaseClient.js';

const bannersService = {
    /**
     * Obtiene todos los banners de la base de datos.
     * @returns {Promise<{data: any[], error: any}>}
     */
    getAllBanners: async () => {
        const { data, error } = await supabaseClient
            .from('banners')
            .select('*')
            .order('created_at', { ascending: false });

        return { data, error };
    },

    /**
     * Crea un nuevo banner en la base de datos.
     * @param {object} bannerData - Un objeto con los datos del nuevo banner.
     * @returns {Promise<{data: any, error: any}>} Un objeto con el dato creado o un error.
     */
    createBanner: async (bannerData) => {
        const { data, error } = await supabaseClient
            .from('banners')
            .insert([bannerData])
            .select()
            .single();

        return { data, error };
    },
};

export default bannersService;