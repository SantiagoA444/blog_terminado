import os
import secrets
from flask import current_app

# Try to import PIL, but provide fallback if not available
try:
    from PIL import Image
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False
    print("Warning: PIL/Pillow not available. Images will be saved without resizing.")


def save_post_image(form_image):
    """
    Guarda una imagen de post, la redimensiona si PIL está disponible y devuelve el nombre del archivo.
    """
    if not form_image:
        return None

    # Generar nombre único para el archivo
    random_hex = secrets.token_hex(8)
    _, file_ext = os.path.splitext(form_image.filename)
    image_filename = random_hex + file_ext.lower()

    # Crear directorio si no existe
    upload_path = os.path.join(current_app.root_path, 'static', 'post_images')
    os.makedirs(upload_path, exist_ok=True)

    image_path = os.path.join(upload_path, image_filename)

    try:
        if PIL_AVAILABLE:
            # Usar PIL para optimizar y redimensionar
            img = Image.open(form_image)

            # Convertir a RGB si es RGBA (para PNG con transparencia)
            if img.mode == 'RGBA':
                img = img.convert('RGB')

            # Redimensionar manteniendo aspect ratio
            max_size = (800, 600)  # Máximo 800x600 px
            img.thumbnail(max_size, Image.Resampling.LANCZOS)

            # Guardar imagen optimizada
            img.save(image_path, quality=85, optimize=True)
        else:
            # Fallback: guardar imagen directamente sin procesamiento
            form_image.save(image_path)

        return image_filename

    except Exception as e:
        print(f"Error al procesar imagen: {e}")
        return None


def delete_post_image(image_filename):
    """
    Elimina una imagen de post del sistema de archivos.
    """
    if not image_filename:
        return

    try:
        image_path = os.path.join(
            current_app.root_path,
            'static',
            'post_images',
            image_filename
        )

        if os.path.exists(image_path):
            os.remove(image_path)

    except Exception as e:
        print(f"Error al eliminar imagen: {e}")


def get_image_url(image_filename):
    """
    Devuelve la URL pública de una imagen de post.
    """
    if not image_filename:
        return None

    return f"/static/post_images/{image_filename}"