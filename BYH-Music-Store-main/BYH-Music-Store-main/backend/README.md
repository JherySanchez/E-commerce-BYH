# Backend Service (Supabase Connector)

Este directorio contiene los archivos JavaScript que actúan como una capa de servicio para conectar el frontend con la base de datos de Supabase.Es un conjunto de módulos que el frontend puede importar para realizar operaciones de base de datos de manera organizada y segura.

## Estructura

-   `config.js`: Contiene la configuración para conectarse a Supabase (URL y clave anónima). **Debes editar este archivo con tus propias credenciales.**
-   `supabaseClient.js`: Inicializa y exporta el cliente de Supabase, listo para ser usado por los demás servicios.
-   `/services`: Esta carpeta contendrá los archivos que definen las funciones para interactuar con tablas específicas de tu base de datos (por ejemplo, `products.js`, `orders.js`, etc.).

## Cómo Usarlo

1.  **Configuración**: Abre `backend/config.js` y reemplaza los valores de `SUPABASE_URL` y `SUPABASE_ANON_KEY` con las credenciales de tu proyecto de Supabase.
2.  **Incluir en el Frontend**: En tu archivo HTML principal (por ejemplo, `frontend/index.html`), debes incluir el cliente de Supabase desde su CDN y luego los módulos de tu backend. El orden es importante.

    ```html
    <!-- 1. Incluye el cliente de Supabase desde el CDN -->
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

    <!-- 2. Incluye tus módulos de backend -->
    <script src="../backend/config.js"></script>
    <script src="../backend/supabaseClient.js"></script>
    <script src="../backend/services/products.js"></script>

    <!-- 3. Incluye el script principal de tu app -->
    <script src="js/app.js"></script>
    ```

3.  **Usar en tu código**: Dentro de `app.js` (o cualquier otro script de tu frontend), ahora puedes usar las funciones definidas en tus servicios directamente.

    ```javascript
    // Ejemplo de cómo obtener todos los productos
    async function displayProducts() {
        const { data, error } = await productService.getAllProducts();
        if (error) {
            console.error('Error fetching products:', error);
            return;
        }
        console.log('Products:', data);
        // Aquí puedes agregar el código para mostrar los productos en tu página.
    }

    // Llama a la función cuando la página cargue
    document.addEventListener('DOMContentLoaded', displayProducts);
    ```

