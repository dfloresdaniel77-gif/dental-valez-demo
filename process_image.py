from PIL import Image, ImageEnhance, ImageFilter

img = Image.open('public/assets/after.jpg').convert('RGB')
r, g, b = img.split()

def stain_red(c): return min(255, int(c * 0.95))
def stain_green(c): return min(255, int(c * 0.92))
def stain_blue(c): return min(255, int(c * 0.65 if c > 120 else c * 0.8))

r = r.point(stain_red)
g = g.point(stain_green)
b = b.point(stain_blue)

out = Image.merge('RGB', (r, g, b))

out = ImageEnhance.Contrast(out).enhance(0.7)
out = ImageEnhance.Brightness(out).enhance(0.85)
out = out.filter(ImageFilter.GaussianBlur(radius=0.7))

out.save('public/assets/before.jpg')
print("Improved before.jpg generated")
