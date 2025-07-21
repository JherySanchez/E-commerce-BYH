// backend/services/ordersService.js
import supabaseClient from '../supabaseClient.js';

const ordersService = {
    /**
     * Obtiene todos los pedidos, incluyendo información del cliente.
     * @returns {Promise<{data: any[], error: any}>}
     */
    getAllOrders: async () => {
        const { data, error } = await supabaseClient
            .from('orders')
            // Hacemos un "join" para traer el nombre y email del usuario relacionado
            .select(`
                *,
                users ( name, email )
            `)
            .order('created_at', { ascending: false });

        return { data, error };
    },
};

export default ordersService;