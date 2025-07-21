# BYH Music Store

Sitio web institucional para BYH Music Store, incluyendo tienda virtual, blog y sistema de autenticación de usuarios.

## Requisitos Previos

- Python 3.8 o superior
- Navegador web moderno (Chrome, Firefox, Edge, etc.)

## Configuración del Entorno

1. Clona el repositorio:
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd Site
   ```

2. Configura el entorno virtual (recomendado):
   ```bash
   # En Windows
   python -m venv venv
   .\venv\Scripts\activate
   
   # En macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

## Ejecución del Proyecto

### Frontend

1. Navega al directorio del frontend:
   ```bash
   cd frontend
   ```

2. Inicia un servidor HTTP local. Puedes usar el servidor HTTP integrado de Python:
   ```bash
   # Python 3
   python -m http.server 8000
   ```

3. Abre tu navegador y visita:
   ```
   http://localhost:8000
   ```

### Backend

1. Asegúrate de estar en el directorio raíz del proyecto.

2. Instala las dependencias (si las hay):
   ```bash
   pip install -r requirements.txt
   ```

3. Inicia el servidor backend:
   ```bash
   python backend/main.py
   ```

4. El backend estará disponible en:
   ```
   http://localhost:5000
   ```

## Estructura del Proyecto

```
├── frontend/           # Archivos del lado del cliente
│   ├── css/           # Hojas de estilo
│   ├── js/            # Scripts JavaScript
│   ├── img/           # Imágenes
│   └── pages/         # Páginas HTML
├── backend/           # Código del servidor
│   ├── models/        # Modelos de datos
│   ├── controllers/   # Controladores
│   └── main.py       # Punto de entrada del servidor
└── README.md          # Este archivo
```

## Notas de Desarrollo

- Asegúrate de que el servidor backend esté en ejecución para que todas las funcionalidades estén disponibles.
- Para desarrollo, puedes usar las herramientas de desarrollo del navegador (F12) para depuración.

---

Desarrollado para el curso de Taller de Programación Web - UTP
