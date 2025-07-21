import express from 'express';
import cors from 'cors';
import multer from 'multer';
import productService from './services/products.js'; // Importa el servicio de productos
import usersService from './services/usersService.js';   // Importa el servicio de usuarios
import promotionsService from './services/promotionsService.js'; // Importa el servicio de promociones
import bannersService from './services/bannersService.js'; // Importa el servicio de banners
import ordersService from './services/ordersService.js';   // Importa el servicio de pedidos
import settingsService from './services/settingsService.js'; // Importa el servicio de configuración
import authService from './services/authService.js';   // Importa el servicio de autenticación

const app = express();
const port = process.env.PORT || 3000; // El puerto en el que correrá tu servidor backend

// Middlewares
// Habilita CORS para permitir que tu frontend-admin (en otro puerto/dominio) se conecte
app.use(cors());
// Permite que Express lea el cuerpo de las solicitudes en formato JSON
app.use(express.json());
// Hacemos que la carpeta 'public' sea accesible desde el navegador
app.use(express.static('public'));

// Configuración de Multer para guardar archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/') // Directorio donde se guardarán las imágenes
    },
    filename: function (req, file, cb) {
        // Crear un nombre de archivo único para evitar sobreescrituras
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = file.originalname.split('.').pop();
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + extension);
    }
});
const upload = multer({ storage: storage });

// =====================================
// Rutas de la API para Productos
// =====================================

// Ruta GET para obtener todos los productos
// http://localhost:3000/api/products
app.get('/api/products', async (req, res) => {
    const { data, error } = await productService.getAllProducts();
    if (error) {
        console.error('Error en la API al obtener productos:', error);
        return res.status(500).json({ message: error.message || 'Error al obtener los productos.' });
    }
    res.json(data);
});

// Ruta GET para obtener un producto por su ID
// http://localhost:3000/api/products/:id
app.get('/api/products/:id', async (req, res) => {
    const { id } = req.params; // Captura el ID desde la URL
    const { data, error } = await productService.getProductById(id);
    if (error) {
        console.error(`Error en la API al obtener producto con ID ${id}:`, error);
        if (error.code === 'PGRST204') { // Código de Supabase para 'No Content' (no encontrado)
            return res.status(404).json({ message: `Producto con ID ${id} no encontrado.` });
        }
        return res.status(500).json({ message: error.message || 'Error al obtener el producto.' });
    }
    res.json(data);
});

// Ruta POST para crear un nuevo producto
// http://localhost:3000/api/products
app.post('/api/products', upload.single('image_file'), async (req, res) => {
    // 'image_file' debe coincidir con el 'name' del input en el formulario
    const productData = req.body; // Los datos de texto del formulario

    // Si se subió un archivo, multer lo pone en req.file
    if (req.file) {
        // Construimos la URL pública de la imagen
        // Ejemplo: http://localhost:3000/uploads/image_file-1678886400000.jpg
        productData.image_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    // Convertimos los valores numéricos
    productData.price = parseFloat(productData.price);
    productData.stock = parseInt(productData.stock, 10);

    const { data, error } = await productService.createProduct(productData);
    if (error) {
        console.error('Error en la API al crear producto:', error);
        return res.status(500).json({ message: error.message || 'No se pudo crear el producto.' });
    }
    res.status(201).json(data); // 201 Created: indica que el recurso fue creado exitosamente
});

// Ruta PUT para actualizar un producto existente por su ID
// http://localhost:3000/api/products/:id
app.put('/api/products/:id', upload.single('image_file'), async (req, res) => {
    const { id } = req.params; // ID del producto a actualizar
    const updatedData = req.body; // Nuevos datos de texto del producto

    // Si se sube un nuevo archivo, actualizamos la URL de la imagen
    if (req.file) {
        updatedData.image_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const { data, error } = await productService.updateProduct(id, updatedData);
    if (error) {
        console.error(`Error en la API al actualizar producto con ID ${id}:`, error);
        return res.status(500).json({ message: error.message || 'No se pudo actualizar el producto.' });
    }
    // El servicio ya devuelve un solo objeto gracias a .single(), no es necesario usar data[0]
    res.json(data); // Devuelve el producto actualizado
});

// Ruta DELETE para eliminar un producto por su ID
// http://localhost:3000/api/products/:id
app.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params; // ID del producto a eliminar
    const { data, error } = await productService.deleteProduct(id);
    if (error) {
        console.error(`Error en la API al eliminar producto con ID ${id}:`, error);
        return res.status(500).json({ message: error.message || 'No se pudo eliminar el producto.' });
    }
    // Devolvemos un mensaje de éxito y el producto que fue eliminado.
    res.status(200).json({ message: `Producto con ID ${id} eliminado correctamente.`, deletedProduct: data });
});

// =====================================
// Rutas de la API para Autenticación
// =====================================

// Ruta POST para iniciar sesión
// http://localhost:3000/api/auth/login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
    }

    const { data: user, error } = await authService.loginUser(email, password);

    if (error || !user) {
        return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    res.json({ message: 'Login exitoso', token: 'dummy-jwt-token-replace-with-real-one', user });
});

// =====================================
// Rutas de la API para Usuarios (Clientes)
// =====================================

// Ruta GET para obtener todos los usuarios
// http://localhost:3000/api/users
app.get('/api/users', async (req, res) => {
    const { data, error } = await usersService.getAllUsers();
    if (error) {
        return res.status(500).json({ message: 'Error al obtener los usuarios', error });
    }
    res.json(data);
});

// Ruta POST para crear un nuevo usuario (cliente)
// http://localhost:3000/api/users
app.post('/api/users', async (req, res) => {
    const userData = req.body;

    const { data, error } = await usersService.createUser(userData);
    if (error) {
        console.error('Error en la API al crear usuario:', error);
        if (error.code === '23505') { // Error de violación de unicidad (email duplicado)
            return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
        }
        return res.status(500).json({ message: error.message || 'No se pudo crear el usuario.' });
    }
    res.status(201).json(data);
});

// =====================================
// Rutas de la API para Promociones
// =====================================

// Ruta GET para obtener todas las promociones
// http://localhost:3000/api/promotions
app.get('/api/promotions', async (req, res) => {
    const { data, error } = await promotionsService.getAllPromotions();
    if (error) {
        return res.status(500).json({ message: 'Error al obtener las promociones', error });
    }
    res.json(data);
});

// Ruta POST para crear una nueva promoción
// http://localhost:3000/api/promotions
app.post('/api/promotions', async (req, res) => {
    const promoData = req.body;

    const { data, error } = await promotionsService.createPromotion(promoData);
    if (error) {
        console.error('Error en la API al crear promoción:', error);
        return res.status(500).json({ message: error.message || 'No se pudo crear la promoción.' });
    }
    res.status(201).json(data);
});

// =====================================
// Rutas de la API para Banners
// =====================================

// Ruta GET para obtener todos los banners
// http://localhost:3000/api/banners
app.get('/api/banners', async (req, res) => {
    const { data, error } = await bannersService.getAllBanners();
    if (error) {
        return res.status(500).json({ message: 'Error al obtener los banners', error });
    }
    res.json(data);
});

// Ruta POST para crear un nuevo banner
// http://localhost:3000/api/banners
app.post('/api/banners', upload.single('banner_image_file'), async (req, res) => {
    const bannerData = req.body;

    if (req.file) {
        bannerData.image_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    // Asegurarse de que los campos opcionales vacíos no se guarden como strings vacíos si la DB no lo permite
    if (!bannerData.link_url) {
        delete bannerData.link_url;
    }

    const { data, error } = await bannersService.createBanner(bannerData);
    if (error) {
        console.error('Error en la API al crear banner:', error);
        return res.status(500).json({ message: error.message || 'No se pudo crear el banner.' });
    }
    res.status(201).json(data);
});

// =====================================
// Rutas de la API para Pedidos
// =====================================

// Ruta GET para obtener todos los pedidos
// http://localhost:3000/api/orders
app.get('/api/orders', async (req, res) => {
    const { data, error } = await ordersService.getAllOrders();
    if (error) {
        return res.status(500).json({ message: 'Error al obtener los pedidos', error });
    }
    res.json(data);
});

// =====================================
// Rutas de la API para Configuración
// =====================================

// Ruta GET para obtener todas las configuraciones
// http://localhost:3000/api/settings
app.get('/api/settings', async (req, res) => {
    const { data, error } = await settingsService.getAllSettings();
    if (error) {
        return res.status(500).json({ message: 'Error al obtener la configuración', error });
    }
    res.json(data);
});

// Ruta PUT para actualizar las configuraciones
// http://localhost:3000/api/settings
app.put('/api/settings', async (req, res) => {
    const { data, error } = await settingsService.updateSettings(req.body);
    if (error) {
        return res.status(500).json({ message: 'Error al actualizar la configuración', error });
    }
    res.json({ message: 'Configuración actualizada correctamente', data });
});

// =====================================
// Inicio del servidor
// =====================================

app.listen(port, () => {
    console.log(`Servidor backend corriendo en http://localhost:${port}`);
    console.log('Rutas de API disponibles:');
    console.log(`- GET /api/products`);
    console.log(`- GET /api/products/:id`);
    console.log(`- POST /api/products`);
    console.log(`- PUT /api/products/:id`);
    console.log(`- DELETE /api/products/:id`);
    console.log(`- POST /api/auth/login`);
    console.log(`- GET /api/users`);
    console.log(`- GET /api/promotions`);
    console.log(`- GET /api/banners`);
    console.log(`- GET /api/orders`);
    console.log(`- GET /api/settings`);
    console.log(`- PUT /api/settings`);
});