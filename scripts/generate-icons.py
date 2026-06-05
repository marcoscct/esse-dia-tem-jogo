import os
from PIL import Image

# Define paths
SOURCE_IMAGE = r"f:\Castro Brothers Dropbox\Pasta da equipe Castro Brothers\Apps\Vai ter Jogo\icones\favicon v2.png"
PUBLIC_DIR = r"f:\Castro Brothers Dropbox\Pasta da equipe Castro Brothers\Apps\Vai ter Jogo\esse-dia-tem-jogo\public"

def generate_icons():
    if not os.path.exists(SOURCE_IMAGE):
        print(f"Error: Source image not found at {SOURCE_IMAGE}")
        return

    print(f"Loading source image: {SOURCE_IMAGE}")
    img = Image.open(SOURCE_IMAGE)
    
    # Ensure it's RGBA to keep transparency
    if img.mode != 'RGBA':
        img = img.convert('RGBA')

    # 1. Generate favicon.ico (containing 16x16, 32x32, 48x48)
    ico_sizes = [16, 32, 48]
    ico_images = [img.resize((size, size), Image.Resampling.LANCZOS) for size in ico_sizes]
    ico_path = os.path.join(PUBLIC_DIR, "favicon.ico")
    ico_images[0].save(ico_path, format="ICO", sizes=[(size, size) for size in ico_sizes], append_images=ico_images[1:])
    print(f"Saved: {ico_path}")

    # 2. Generate favicon-96x96.png
    img_96 = img.resize((96, 96), Image.Resampling.LANCZOS)
    img_96_path = os.path.join(PUBLIC_DIR, "favicon-96x96.png")
    img_96.save(img_96_path, format="PNG")
    print(f"Saved: {img_96_path}")

    # 3. Generate apple-touch-icon.png (180x180)
    img_180 = img.resize((180, 180), Image.Resampling.LANCZOS)
    img_180_path = os.path.join(PUBLIC_DIR, "apple-touch-icon.png")
    img_180.save(img_180_path, format="PNG")
    print(f"Saved: {img_180_path}")

    # 4. Generate web-app-manifest-192x192.png
    img_192 = img.resize((192, 192), Image.Resampling.LANCZOS)
    img_192_path = os.path.join(PUBLIC_DIR, "web-app-manifest-192x192.png")
    img_192.save(img_192_path, format="PNG")
    print(f"Saved: {img_192_path}")

    # 5. Generate web-app-manifest-512x512.png
    img_512 = img.resize((512, 512), Image.Resampling.LANCZOS)
    img_512_path = os.path.join(PUBLIC_DIR, "web-app-manifest-512x512.png")
    img_512.save(img_512_path, format="PNG")
    print(f"Saved: {img_512_path}")

    print("Icon generation completed successfully!")

if __name__ == "__main__":
    generate_icons()
