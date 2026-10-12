"""OCR facultative pour photos d'exercices (Tesseract local)."""
from io import BytesIO
from PIL import Image, ImageOps, UnidentifiedImageError
import pytesseract

MAX_IMAGE_BYTES = 8 * 1024 * 1024
MAX_PIXELS = 16_000_000
Image.MAX_IMAGE_PIXELS = MAX_PIXELS

def read_exercise_image(upload, language="fra+eng"):
    if upload.size > MAX_IMAGE_BYTES:
        raise ValueError("Image trop volumineuse : maximum 8 Mo.")
    try:
        img = Image.open(BytesIO(upload.getvalue()))
        if img.width * img.height > MAX_PIXELS:
            raise ValueError("Image trop grande : maximum 16 millions de pixels.")
        img = ImageOps.exif_transpose(img).convert("L")
        img = ImageOps.autocontrast(img)
        text = pytesseract.image_to_string(img, lang=language, config="--psm 6")
    except (UnidentifiedImageError, OSError) as exc:
        raise ValueError("Impossible de lire l'image.") from exc
    return text.strip()[:8000]
