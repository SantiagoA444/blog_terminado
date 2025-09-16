Blog con Flask - Proyecto Educativo
📝 Información del Proyecto

Proyecto creado por el Profe Henry
Este es un blog educativo desarrollado con Flask para que los alumnos aprendan desarrollo web backend.
🚀 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado en tu Windows:

    Python 3.8 o superior

    Git

📥 Instalación y Configuración
1. Clonar el Repositorio
cmd

git clone https://github.com/hortegon/blog_1.git
cd blog_1

2. Crear Entorno Virtual
cmd

# Crear el entorno virtual
python -m venv venv

# Activar el entorno virtual
venv\Scripts\activate

3. Instalar Dependencias
cmd

pip install -r requirements.txt

# Si no hay requirements.txt, instalar manualmente:
pip install flask flask-sqlalchemy flask-migrate flask-login flask-mail flask-wtf python-dotenv email-validator PyJWT flask-bootstrap Pillow

4. Configurar Base de Datos
cmd

# Inicializar migraciones
flask db init

# Crear migración inicial
flask db migrate -m "Initial migration"

# Aplicar migraciones
flask db upgrade

🏃‍♂️ Ejecutar la Aplicación
Opción 1: Usando Flask
cmd

flask run

Opción 2: Ejecutar directamente
cmd

python microblog.py

Opción 3: Modo Desarrollo (con auto-recarga)
cmd

set FLASK_ENV=development
flask run

🌐 Acceder a la Aplicación

Abre tu navegador y ve a:
http://localhost:5000
👤 Datos de Prueba

Después de ejecutar la aplicación, puedes crear un usuario:

    Haz clic en "Register"

    Completa el formulario con:

        Username: el que prefieras

        Email: tu_email@ejemplo.com

        Password: password

📁 Estructura del Proyecto
text

blog_1/
├── app/
│   ├── templates/     # Plantillas HTML (Jinja2)
│   ├── static/        # Archivos estáticos
│   │   ├── css/       # Estilos modernos con tema oscuro/claro
│   │   ├── js/        # JavaScript para interactividad
│   │   └── post_images/ # Imágenes subidas por usuarios
│   ├── __init__.py    # Inicialización de la app
│   ├── models.py      # Modelos de base de datos
│   ├── routes.py      # Rutas de la aplicación
│   ├── forms.py       # Formularios con validación
│   ├── image_utils.py # Utilidades para manejo de imágenes
│   └── email.py       # Configuración de email
├── migrations/        # Migraciones de base de datos
├── instance/          # Archivos de instancia
├── logs/             # Logs de la aplicación
├── venv/             # Entorno virtual
├── config.py         # Configuración
├── requirements.txt  # Dependencias del proyecto
├── tests.py          # Tests unitarios
└── microblog.py      # Punto de entrada

🛠️ Comandos Útiles
Para desarrollo:
cmd

# Abrir shell de Flask
flask shell

# Ver rutas disponibles
flask routes

# Crear nueva migración
flask db migrate -m "Descripción de cambios"

# Aplicar migraciones
flask db upgrade

# Ejecutar tests
python tests.py

Para troubleshooting:
cmd

# Verificar dependencias instaladas
pip list

# Reactivar entorno virtual
venv\Scripts\activate

# Instalar dependencias faltantes
pip install nombre_paquete

🎯 Funcionalidades Nuevas para Explorar

📸 **Subida de Imágenes**
- Los usuarios pueden agregar imágenes a sus posts
- Formatos soportados: JPG, JPEG, PNG, GIF
- Tamaño máximo: 5MB por imagen
- Preview en tiempo real antes de publicar
- Optimización automática de tamaño

🌓 **Tema Oscuro/Claro**
- Botón flotante en la derecha para cambiar tema
- Preferencia guardada en el navegador
- Animaciones suaves al cambiar tema
- Variables CSS para fácil personalización

✨ **Animaciones y Efectos**
- Likes/dislikes con animaciones flotantes
- Transiciones suaves en todas las interacciones
- Efectos hover en botones y tarjetas
- Contador de caracteres con colores dinámicos

📱 **Diseño Responsivo Mejorado**
- Optimizado para móviles y tablets
- Cards modernas para posts
- Navegación mejorada en pantallas pequeñas
- Botones táctiles de tamaño apropiado

❓ Solución de Problemas Comunes

Error: "No module named 'PIL'"
cmd

# Instalar Pillow para procesamiento de imágenes
pip install Pillow

Error: "ModuleNotFoundError"
cmd

# Instalar el módulo faltante
pip install nombre_modulo_faltante

Error: "Table already exists"
cmd

# Recrear base de datos
flask db drop_all
flask db create_all

Error: Puerto ocupado
cmd

# Usar otro puerto
flask run --port 5001

Error: Imágenes no se muestran
cmd

# Verificar que existe la carpeta de imágenes
mkdir app\static\post_images

# Verificar permisos de escritura en la carpeta

Características Implementadas

**Sistema de Autenticación**
    ✅ Registro y login de usuarios
    ✅ Recuperación de contraseñas por email
    ✅ Perfiles de usuario editables
    ✅ Avatares con Gravatar

**Gestión de Contenido**
    ✅ Posts con texto (140 caracteres)
    ✅ **NUEVO**: Subida de imágenes en posts (JPG, PNG, GIF)
    ✅ Timeline personalizado
    ✅ Página de exploración
    ✅ Contador de caracteres en tiempo real

**Funciones Sociales**
    ✅ Sistema de followers/following
    ✅ Sistema de likes y dislikes para posts
    ✅ Contadores de interacciones
    ✅ Posts de usuarios seguidos

**Interfaz Moderna**
    ✅ **NUEVO**: Tema oscuro/claro con botón flotante
    ✅ **NUEVO**: Animaciones suaves para likes/dislikes
    ✅ **NUEVO**: Diseño responsive mejorado
    ✅ **NUEVO**: Iconos Font Awesome
    ✅ **NUEVO**: Preview de imágenes antes de publicar
    ✅ **NUEVO**: Notificaciones toast elegantes
    ✅ Interfaz responsiva con Bootstrap 5

**Funcionalidades Técnicas**
    ✅ Base de datos SQLite con SQLAlchemy
    ✅ Migraciones con Flask-Migrate
    ✅ Formularios con validación avanzada
    ✅ **NUEVO**: Procesamiento de imágenes con Pillow
    ✅ **NUEVO**: Optimización automática de imágenes
    ✅ **NUEVO**: Validación de tipos y tamaños de archivo
    ✅ Tests unitarios
    ✅ Logging de errores

🎮 Cómo Probar las Nuevas Funcionalidades

Después de ejecutar la aplicación, puedes probar:

1. **Subir Imágenes en Posts**:
   - Ve a la página principal (tras hacer login)
   - Escribe un mensaje en el área de texto
   - Haz clic en "Agregar imagen" y selecciona una foto
   - Verás un preview de la imagen
   - Haz clic en "Publicar"

2. **Cambiar Tema Oscuro/Claro**:
   - Busca el botón flotante en la parte derecha (☀️/🌙)
   - Haz clic para alternar entre tema claro y oscuro
   - La preferencia se guarda automáticamente

3. **Interacciones con Animaciones**:
   - Haz clic en los botones de like/dislike
   - Observa las animaciones flotantes
   - Los números se actualizan con efectos suaves

4. **Probar en Móvil**:
   - Abre la aplicación en tu teléfono
   - Navega por las diferentes secciones
   - Prueba crear posts con imágenes

🎨 Tecnologías Aprendidas en este Proyecto

**Backend (Flask)**
- Flask framework y blueprints
- SQLAlchemy ORM y migraciones
- Flask-Login para autenticación
- Flask-Mail para emails
- Flask-WTF para formularios
- Manejo de archivos e imágenes
- Validación de datos

**Frontend**
- HTML5 semántico
- CSS3 moderno con variables
- JavaScript ES6+
- Bootstrap 5 responsive
- Font Awesome iconos
- Animaciones CSS
- Temas oscuro/claro
- LocalStorage para persistencia

**Base de Datos**
- Diseño de esquemas relacionales
- Relaciones many-to-many
- Migraciones automáticas
- Consultas SQL optimizadas

📞 Soporte

Si tienes problemas con la instalación:

    Revisa que Python y Git estén instalados correctamente

    Asegúrate de tener el entorno virtual activado

    Verifica que todas las dependencias estén instaladas

    Si tienes errores con Pillow, instálalo manualmente: pip install Pillow

¡Recuerda que este es un proyecto educativo!
Creado con ❤️ por el Profe Henry

**Para los alumnos**: Este proyecto les enseña desarrollo web full-stack con tecnologías modernas. Experimenten, modifiquen y aprendan explorando el código.

Nota: Este proyecto funciona en Windows, macOS y Linux. Los comandos mostrados son específicos para Windows.