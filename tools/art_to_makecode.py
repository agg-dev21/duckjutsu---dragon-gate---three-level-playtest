"""
Turn your own pictures into MakeCode Arcade art for Duckjutsu.

It converts PNG/JPG files into the game's 15 colours and prints MakeCode code
that you paste into the JavaScript tab. Switch back to Blocks and the picture
shows up as an image block (you can then name it in the Assets tab).

Needs Python 3 with Pillow:   pip install pillow

USAGE
  Background (fits the picture to the 160x120 screen):
      python art_to_makecode.py background "my picture.png"

  Sprite (one picture, e.g. a new enemy). Optional max size, default 48:
      python art_to_makecode.py sprite enemy.png 40

  Animation (several frame pictures, in order):
      python art_to_makecode.py animation walk1.png walk2.png walk3.png

  Add  --preview  to also save a big preview PNG next to the first input file.

TIPS
  * Draw sprites on a transparent background (PNG). Transparent stays transparent.
  * Animation frames are all cut to the SAME box. If frames had different sizes,
    the character's hitbox would change every frame and it would get stuck in
    walls or fall through floors.
"""
import json
import os
import sys

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))


def load_palette():
    # the game's colours come from pxt.json (index 0 is always "transparent")
    pxt = os.path.join(HERE, '..', 'pxt.json')
    hexes = json.load(open(pxt, encoding='utf8'))['palette']
    return [tuple(int(h[i:i + 2], 16) for i in (1, 3, 5)) for h in hexes]


def to_lab(rgb):
    # compare colours the way eyes see them, so the closest game colour looks right
    def lin(u):
        u /= 255
        return ((u + 0.055) / 1.055) ** 2.4 if u > 0.04045 else u / 12.92
    r, g, b = (lin(v) for v in rgb)
    x = (r * .4124 + g * .3576 + b * .1805) / .95047
    y = r * .2126 + g * .7152 + b * .0722
    z = (r * .0193 + g * .1192 + b * .9505) / 1.08883
    f = lambda t: t ** (1 / 3) if t > 0.008856 else 7.787 * t + 16 / 116
    return 116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))


PALETTE = load_palette()
PAL_LAB = [(i, to_lab(c)) for i, c in enumerate(PALETTE) if i > 0][:15]
_cache = {}


def nearest(rgba):
    if len(rgba) == 4 and rgba[3] < 128:
        return 0
    rgb = rgba[:3]
    if rgb not in _cache:
        L = to_lab(rgb)
        _cache[rgb] = min(PAL_LAB, key=lambda p: sum((p[1][k] - L[k]) ** 2 for k in range(3)))[0]
    return _cache[rgb]


def to_grid(im):
    im = im.convert('RGBA')
    return [[nearest(im.getpixel((x, y))) for x in range(im.width)] for y in range(im.height)]


def bbox(g):
    ys = [y for y, r in enumerate(g) if any(r)]
    xs = [x for x in range(len(g[0])) if any(r[x] for r in g)]
    return min(xs), min(ys), max(xs) + 1, max(ys) + 1


def crop(g, x0, y0, x1, y1):
    return [r[x0:x1] for r in g[y0:y1]]


def literal(g):
    rows = '\n'.join('    ' + ' '.join('.' if v == 0 else '%x' % v for v in r) for r in g)
    return 'img`\n' + rows + '\n    `'


def preview(grids, path):
    s = 6
    w = sum(len(g[0]) + 2 for g in grids) * s
    h = max(len(g) for g in grids) * s
    out = Image.new('RGBA', (w, h), (60, 60, 70, 255))
    x = 0
    for g in grids:
        for yy, r in enumerate(g):
            for xx, v in enumerate(r):
                if v:
                    out.paste(PALETTE[v] + (255,), (x + xx * s, yy * s, x + xx * s + s, yy * s + s))
        x += (len(g[0]) + 2) * s
    out.save(path)
    print('// preview saved to', path)


def fit(im, max_size):
    im = im.convert('RGBA')
    scale = min(max_size / im.width, max_size / im.height, 1)
    if scale < 1:
        im = im.resize((max(1, round(im.width * scale)), max(1, round(im.height * scale))), Image.NEAREST)
    return im


def main():
    args = [a for a in sys.argv[1:] if a != '--preview']
    want_preview = '--preview' in sys.argv
    if len(args) < 2:
        print(__doc__)
        return
    kind, files = args[0], args[1:]

    if kind == 'background':
        im = Image.open(files[0]).convert('RGB')
        # scale to 120 high, keep the middle 160 wide (or stretch if it is narrower)
        w = round(im.width * 120 / im.height)
        im = im.resize((max(w, 160), 120), Image.LANCZOS)
        x0 = (im.width - 160) // 2
        grid = to_grid(im.crop((x0, 0, x0 + 160, 120)))
        print('// paste into the JavaScript tab, then use it in "set background image"')
        print('let myBackground = ' + literal(grid))
        grids = [grid]

    elif kind == 'sprite':
        max_size = int(files[1]) if len(files) > 1 and files[1].isdigit() else 48
        grid = to_grid(fit(Image.open(files[0]), max_size))
        grid = crop(grid, *bbox(grid))
        print('// paste into the JavaScript tab, then use it in "sprite ... of kind"')
        print('let mySprite = ' + literal(grid))
        grids = [grid]

    elif kind == 'animation':
        frames = [to_grid(fit(Image.open(f), 48)) for f in files]
        h = max(len(f) for f in frames)
        w = max(len(f[0]) for f in frames)
        # put every frame on the same canvas, standing on the same bottom line
        frames = [[[0] * w for _ in range(h - len(f))] + [r + [0] * (w - len(r)) for r in f] for f in frames]
        boxes = [bbox(f) for f in frames]
        # keep only the area EVERY frame fills -> identical hitbox in every frame
        box = [max(b[0] for b in boxes), max(b[1] for b in boxes), min(b[2] for b in boxes), min(b[3] for b in boxes)]
        if (box[2] - box[0]) % 2:
            box[2] -= 1          # MakeCode animations need an even width
        if (box[3] - box[1]) % 2:
            box[1] += 1          # and an even height
        frames = [crop(f, *box) for f in frames]
        print('// paste into the JavaScript tab, then use it in "animate ... frames"')
        print('let myAnimation = [' + ', '.join(literal(f) for f in frames) + ']')
        grids = frames

    else:
        print('first word must be: background, sprite or animation')
        return

    if want_preview:
        preview(grids, os.path.splitext(files[0])[0] + '_preview.png')


if __name__ == '__main__':
    main()
