# decrypted/*.png -> site/img/*.webp (모바일용 경량화 + 개인정보/워터마크 처리)
import os
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "decrypted")
OUT = os.path.join(ROOT, "site", "img")
os.makedirs(OUT, exist_ok=True)

# course-1: 차량 번호판 2곳 (x0, y0, x1, y1)
PLATES = [(385, 608, 452, 645), (650, 676, 750, 722)]


def save(im, name, quality=80):
    im.convert("RGB").save(os.path.join(OUT, name), "WEBP", quality=quality, method=6)


for i in range(1, 13):
    im = Image.open(os.path.join(SRC, f"course-{i}.png")).convert("RGB")
    if i == 1:
        for box in PLATES:
            im.paste(im.crop(box).filter(ImageFilter.GaussianBlur(10)), box[:2])
    if i == 11:
        im = im.crop((0, 0, im.width, im.height - 45))  # 좌하단 'AI로 생성한 콘텐츠' 워터마크 제거
    save(im, f"course-{i}.webp", 95)  # 원본이 1004x753 이라 해상도는 그대로, 압축만 약하게

save(Image.open(os.path.join(ROOT, "course-map-v2.png")), "map.webp")  # 고해상도 지도. 좌표 정합값은 index.html <image transform>

# 첫 화면 배경: 세로 화면에서 높이 기준으로 잘리므로 높이 1600px로 축소
hero = Image.open(os.path.join(ROOT, "hero-1.jpg"))
hero.thumbnail((10000, 1600))
save(hero, "hero.webp")

# 호암카페 입구: 폰용 1400px / 큰 화면·고해상도용 2400px (srcset)
cafe = Image.open(os.path.join(OUT, "restaurant_cafe.png"))
for w, q, n in [(1400, 82, "cafe.webp"), (2400, 85, "cafe-2x.webp")]:
    c = cafe.copy()
    c.thumbnail((w, w))
    save(c, n, q)

for f in sorted(os.listdir(OUT)):
    print(f, os.path.getsize(os.path.join(OUT, f)) // 1024, "KB")
