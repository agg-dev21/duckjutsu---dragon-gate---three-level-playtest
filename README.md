# Duckjutsu

A 3-level ninja duck platformer made in MakeCode Arcade (Blocks).

1. **Rooftops** - jump across the rooftops, dodge the cannon fireworks, grab coins, reach the gate.
2. **Dragon Gate** - climb the tower (ladders: hold up/down) while the flying dragon chases you; throw shurikens until it falls. Spikes on the floor hurt.
3. **Flooded Gate** - you are upside down under a ceiling; beat the chicken boss and don't fall in the water.

The game opens on a **start menu** (START / SETTINGS / QUIT). Up/down move the arrow, A picks. SETTINGS turns the sound on or off.

Controls: arrows move, **A / Space** jumps, **B / X** throws a shuriken. Running out of lives restarts the level you are on.

> Open this page at [https://agg-dev21.github.io/duckjutsu---dragon-gate---three-level-playtest/](https://agg-dev21.github.io/duckjutsu---dragon-gate---three-level-playtest/)

---

## How to add stuff

Everything below is done in the MakeCode editor, in **Blocks** and the **Assets** tab.

### Where things are
| Thing | Where to change it |
|---|---|
| Level layouts | Assets tab -> **Tile Maps**: `level 1 rooftops`, `level 2 dragon arena`, `level 3 flooded gate` |
| Floor and wall tiles | `lvl1tile0`, `lvl2 tile`, `lvl3 tile 3`, `lvl3 tile 4` (painted as walls you can stand on) |
| Special tiles | `coin0` (pick-up), `cannon spot` (a cannon that shoots fireworks), `gate0` (walk in to reach level 2), `spikes0` (standing on it hurts) |
| Characters and pictures | Assets tab -> **Images**: `duck0`, `dragon0`, `cannon` (+ `cannon fire` animation), `chicken boss`, `C1` (fireball), `C2` (firework), `C3` (egg), `Random` (shuriken), `heart`, `water waves`, the 3 backgrounds, `start menu` |
| Duck animations | Assets tab -> **Animations**: `duck walk right/left` (+ the `upside down` versions for level 3) |
| Code | Blocks: one group per job (controls, coins, getting hurt, level 2, hit the boss, enemies attack, level 1 start) |

### Change a level
Open its tile map and paint. No code needed:
* Paint **`coin0`** tiles where you want coins.
* Paint **`cannon spot`** tiles in level 1 for more cannons. Each one becomes a `cannon` sprite when the level starts.
* Leave holes in the floor for pits (falling in costs a life).
* **Keep gaps at least 2 tiles tall.** The duck is 22px tall and a tile is 16px, so it gets wedged in a 1-tile-high gap.
* The duck starts at column 1, row 11 (level 1), column 6, row 25 (level 2, bottom left of the tower) and column 2, row 2 (level 3).

### Add a new enemy (copy the boss pattern)
1. Make or import its picture (see below).
2. `set myEnemy to sprite [picture] of kind Enemy`
3. `place myEnemy on top of tilemap col _ row _`
4. Give it movement: `set myEnemy vx to 30` and `set myEnemy bounce on wall ON`.

Touching anything of kind **Enemy** already costs a life, and shurikens already hit it, so you do not need new events.

### Add a new hazard (like fireworks)
Create a sprite of kind **Fire**. The existing "Fire" event already takes a life and removes it when it touches the duck.

### Add a new level
1. Assets -> Tile Maps -> **+** and draw it (16×16 tiles, 8 rows tall works with the camera).
2. Copy the blocks under "LEVEL 2: walk into the gate": set `level`, set the background, set the tilemap, set `startSpot`, place the duck, create the boss.
3. Trigger it from the end of the previous level, like the gate tile does.

---

## Bringing in your own art

MakeCode only has **15 colours** for the whole game (they are in `pxt.json` -> `palette`). Your pictures get converted to the closest of those colours.

The tool `tools/art_to_makecode.py` does the conversion. It needs Python 3 and Pillow (`pip install pillow`). Run it from the `tools` folder:

```
python art_to_makecode.py background "my picture.png" --preview
python art_to_makecode.py sprite enemy.png 40 --preview
python art_to_makecode.py animation walk1.png walk2.png walk3.png --preview
```

It prints a line like `let mySprite = img\`...\``. Paste that into the **JavaScript** tab, switch back to **Blocks**, and the picture is there as an image block. `--preview` also saves a big PNG so you can check it first.

Rules the tool already follows for you (follow them if you draw in MakeCode too):
* **Backgrounds** are 160×120 (the screen size).
* **Sprites** should be about 16-50 px. Transparent PNG backgrounds stay transparent.
* **Animation frames must all be the same size, with the character filling the same box in every frame.** If a frame is 1px wider or taller, the hitbox changes each frame and the character gets stuck in walls or falls through floors. The tool trims all frames to the same box.
* **Animation width and height should be even numbers.** Odd sizes made the duck look scrambled before.

Original art is kept in the `art/` folder. `level3-only/main.ts` is a copy of the game that starts straight in level 3 for testing.

---

## Edit this project

* open [https://arcade.makecode.com/](https://arcade.makecode.com/)
* click on **Import** then click on **Import URL**
* paste **https://github.com/agg-dev21/duckjutsu---dragon-gate---three-level-playtest** and click import

#### Metadata (used for search, rendering)

* for PXT/arcade
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
