// backend/supabaseClient.js

// Este script asume que el cliente de Supabase ha sido cargado globalmente
// desde el CDN en tu archivo HTML.

// También asume que las variables SUPABASE_URL y SUPABASE_ANON_KEY están disponibles
// desde el archivo config.js, que debe ser cargado antes que este.

// 1. Importa la función 'createClient' directamente desde la librería de Supabase

import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js'; 
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Exporta el cliente para que pueda ser utilizado en otros archivos
export default supabaseClient;