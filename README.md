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
pip install flask flask-sqlalchemy flask-migrate flask-login flask-mail flask-wtf python-dotenv email-validator PyJWT flask-bootstrap

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
│   ├── templates/     # Plantillas HTML
│   ├── static/        # Archivos estáticos (CSS, JS)
│   ├── __init__.py    # Inicialización de la app
│   ├── models.py      # Modelos de base de datos
│   ├── routes.py      # Rutas de la aplicación
│   ├── forms.py       # Formularios
│   └── email.py       # Configuración de email
├── migrations/        # Migraciones de base de datos
├── instance/          # Archivos de instancia
├── logs/             # Logs de la aplicación
└── config.py         # Configuración

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

❓ Solución de Problemas Comunes
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

📚 Características Implementadas

    ✅ Sistema de usuarios (registro, login, logout)

    ✅ Posts y timeline

    ✅ Sistema de followers

    ✅ Sistema de likes y dislikes para posts

    ✅ Perfiles de usuario

    ✅ Formularios con validación

    ✅ Base de datos SQLite

    ✅ Migraciones con Flask-Migrate

    ✅ Recuperación de contraseñas por email

    ✅ Interfaz responsiva con Bootstrap

Soporte

Si tienes problemas con la instalación:

    Revisa que Python y Git estén instalados correctamente

    Asegúrate de tener el entorno virtual activado

    Verifica que todas las dependencias estén instaladas

¡Recuerda que este es un proyecto educativo!
Creado con ❤️ por el Profe Henry

Nota: Este proyecto funciona en Windows, macOS y Linux. Los comandos mostrados son específicos para Windows.