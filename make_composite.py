from PIL import Image

# Load both images
bg = Image.open('/home/claude/lvts-site/public/copy.jpeg').convert('RGBA')
joe = Image.open('/home/claude/lvts-site/public/joe.jpg').convert('RGBA')

W, H = bg.size  # 1280x854 approx

# Crop joe to portrait ratio and resize to fit right side of banner
joe_w = int(W * 0.42)
joe_h = int(H * 1.05)

# Joe's photo is portrait — resize keeping aspect, then crop
joe_aspect = joe.width / joe.height
new_joe_h = joe_h
new_joe_w = int(new_joe_h * joe_aspect)
joe_resized = joe.resize((new_joe_w, new_joe_h), Image.LANCZOS)

# Crop to needed width from centre
crop_x = max(0, (new_joe_w - joe_w) // 2)
joe_cropped = joe_resized.crop((crop_x, 0, crop_x + joe_w, new_joe_h))

# Position on right side of banner, aligned bottom
paste_x = W - joe_w - 10
paste_y = H - new_joe_h + 20

# Composite
result = bg.copy()
result.paste(joe_cropped, (paste_x, paste_y), joe_cropped)
result.convert('RGB').save('/home/claude/lvts-site/public/gig-banner.jpg', 'JPEG', quality=92)
print(f"Done — gig-banner.jpg ({W}x{H})")
