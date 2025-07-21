// Navegación SPA para cargar vistas HTML en #content-area
(function() {
    // Mapeo entre data-view y archivo HTML correspondiente
    const viewToPage = {
        dashboard: 'dashboard.html',
        productos: 'productos.html',
        'nuevo-producto': 'nuevo-producto.html',
        'listar-productos': 'listar-productos.html',
        promociones: 'promociones.html',
        'nueva-promocion': 'promociones.html', // Cambia si tienes un archivo aparte
        'listar-promociones': 'promociones.html', // Cambia si tienes un archivo aparte
        banners: 'banners.html',
        'nuevo-banner': 'banners.html', // Cambia si tienes un archivo aparte
        'listar-banners': 'listar-banners.html',
        pedidos: 'pedidos.html',
        clientes: 'clientes.html',
        configuracion: 'configuración.html'
    };

    // Mapeo de inicializadores JS por vista
    const viewInitializers = {
        banners: () => window.BannersView && typeof window.BannersView.init === 'function' && window.BannersView.init(),
        'listar-banners': () => window.BannersView && typeof window.BannersView.init === 'function' && window.BannersView.init(),
        productos: () => window.ProductosView && typeof window.ProductosView.init === 'function' && window.ProductosView.init(),
        'listar-productos': () => window.ProductosView && typeof window.ProductosView.init === 'function' && window.ProductosView.init(),
        promociones: () => window.PromocionesView && typeof window.PromocionesView.init === 'function' && window.PromocionesView.init(),
        dashboard: () => window.DashboardView && typeof window.DashboardView.init === 'function' && window.DashboardView.init(),
        clientes: () => window.ClientesView && typeof window.ClientesView.init === 'function' && window.ClientesView.init(),
        pedidos: () => window.PedidosView && typeof window.PedidosView.init === 'function' && window.PedidosView.init(),
        configuracion: () => window.ConfiguracionView && typeof window.ConfiguracionView.init === 'function' && window.ConfiguracionView.init(),
        'nuevo-producto': () => window.ProductosView && typeof window.ProductosView.initForm === 'function' && window.ProductosView.initForm(),
        'nueva-promocion': () => window.PromocionesView && typeof window.PromocionesView.initForm === 'function' && window.PromocionesView.initForm(),
    };

    function loadHtmlView(view) {
        const page = viewToPage[view] || 'dashboard.html';
        fetch('pages/' + page + '?t=' + Date.now())
            .then(res => res.text())
            .then(html => {
                document.getElementById('content-area').innerHTML = html;
                // Inicializar JS específico si existe
                if (viewInitializers[view]) {
                    viewInitializers[view]();
                }
            })
            .catch(() => {
                document.getElementById('content-area').innerHTML = '<div class="alert alert-danger">No se pudo cargar la vista solicitada.</div>';
            });
    }

    // Manejar clicks en el menú lateral
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('.nav-menu [data-view]').forEach(item => {
            item.addEventListener('click', function(e) {
                const view = this.getAttribute('data-view');
                if (view) {
                    window.location.hash = view;
                }
            });
        });

        // Cargar vista al cambiar el hash
        window.addEventListener('hashchange', function() {
            const view = window.location.hash.replace('#', '') || 'dashboard';
            loadHtmlView(view);
        });

        // Cargar la vista inicial
        const initialView = window.location.hash.replace('#', '') || 'dashboard';
        loadHtmlView(initialView);
    });
})();
