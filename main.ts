namespace SpriteKind {
    export const Fire = SpriteKind.create()
    export const Cannon = SpriteKind.create()
    export const Heart = SpriteKind.create()
    export const Gate = SpriteKind.create()
}
// ---------- moving and jumping ----------
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    facing = -1
    animation.runImageAnimation(duck, assets.animation`duck walk left`, 100, true)
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    facing = 1
    animation.runImageAnimation(duck, assets.animation`duck walk`, 100, true)
})
controller.left.onEvent(ControllerButtonEvent.Released, function () {
    animation.runImageAnimation(duck, assets.animation`duck idle left`, 300, true)
})
controller.right.onEvent(ControllerButtonEvent.Released, function () {
    animation.runImageAnimation(duck, assets.animation`duck idle`, 300, true)
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (duck.isHittingTile(CollisionDirection.Bottom)) {
        duck.vy = -220
    }
})
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (duck.isHittingTile(CollisionDirection.Bottom)) {
        duck.vy = -220
    }
})
// letting go of jump early makes a smaller jump
controller.A.onEvent(ControllerButtonEvent.Released, function () {
    if (duck.vy < -90) {
        duck.vy = -90
    }
})
controller.up.onEvent(ControllerButtonEvent.Released, function () {
    if (duck.vy < -90) {
        duck.vy = -90
    }
})
// ---------- throwing shurikens (level 2 and 3) ----------
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (level == 2 || level == 3) {
        star = sprites.createProjectileFromSprite(img`
            . . b . . . . .
            . . b 1 . . b .
            b b 1 1 b b 1 .
            . 1 1 f 1 1 . .
            . . 1 1 1 b b b
            . b b 1 b . . .
            . 1 . b . . . .
            . . . b . . . .
            `, duck, facing * 150, 0)
        if (level == 3) {
            star.vx = facing * 40
            star.vy = -160
        }
        if (facing == 1) {
            animation.runImageAnimation(duck, assets.animation`duck throw`, 50, false)
        } else {
            animation.runImageAnimation(duck, assets.animation`duck throw left`, 50, false)
        }
    }
})
// ---------- getting hurt ----------
sprites.onOverlap(SpriteKind.Player, SpriteKind.Fire, function (sprite, otherSprite) {
    otherSprite.destroy(effects.fire, 200)
    info.changeLifeBy(-1)
    scene.cameraShake(3, 300)
    duck.vy = -110
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    info.changeLifeBy(-1)
    scene.cameraShake(3, 300)
    duck.vy = -110
    pause(1000)
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`spikes`, function (sprite, location) {
    info.changeLifeBy(-1)
    tiles.placeOnTile(duck, checkpoint)
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`water`, function (sprite, location) {
    info.changeLifeBy(-1)
    tiles.placeOnTile(duck, checkpoint)
})
// ---------- good things ----------
sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (sprite, otherSprite) {
    otherSprite.destroy()
    info.changeScoreBy(1)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Heart, function (sprite, otherSprite) {
    otherSprite.destroy()
    info.changeLifeBy(1)
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`checkpoint`, function (sprite, location) {
    checkpoint = location
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`gate`, function (sprite, location) {
    if (level == 1) {
        startLevel2()
    }
})
// ---------- hitting the boss ----------
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprite.destroy()
    bossHealth += -1
    otherSprite.startEffect(effects.fire, 100)
    if (level == 2 && bossHealth == 10) {
        // the dragon gets angry and a heart falls down
        otherSprite.sayText("RAAAWR!", 1000, false)
        otherSprite.follow(duck, 40)
        heart = sprites.create(img`
            . e e . e e .
            e 1 e e e e e
            e e e e e e e
            . e e e e e .
            . . e e e . .
            . . . e . . .
            `, SpriteKind.Heart)
        heart.setPosition(duck.x, 0)
        heart.ay = 200
    }
    if (bossHealth == 0) {
        otherSprite.destroy(effects.disintegrate, 500)
        if (level == 2) {
            game.splash("Seal recovered!", "Now cross the flooded gate.")
            startLevel3()
        } else {
            game.splash("Village seal returned", "The village is safe.")
            game.over(true)
        }
    }
})
// ---------- setting up the levels ----------
function clearLevel () {
    sprites.destroyAllSpritesOfKind(SpriteKind.Cannon)
    sprites.destroyAllSpritesOfKind(SpriteKind.Gate)
    sprites.destroyAllSpritesOfKind(SpriteKind.Fire)
    sprites.destroyAllSpritesOfKind(SpriteKind.Projectile)
    sprites.destroyAllSpritesOfKind(SpriteKind.Enemy)
    sprites.destroyAllSpritesOfKind(SpriteKind.Food)
    sprites.destroyAllSpritesOfKind(SpriteKind.Heart)
    sprites.destroyAllSpritesOfKind(SpriteKind.Player)
}
function makeDuck () {
    duck = sprites.create(assets.image`duck stand`, SpriteKind.Player)
    duck.ay = 400
    controller.moveSprite(duck, 80, 0)
    scene.cameraFollowSprite(duck)
    facing = 1
    animation.runImageAnimation(duck, assets.animation`duck idle`, 300, true)
    for (let value of tiles.getTilesByType(assets.tile`start`)) {
        tiles.placeOnTile(duck, value)
        tiles.setTileAt(value, assets.tile`transparency16`)
        checkpoint = value
    }
}
function makeCoins () {
    for (let value of tiles.getTilesByType(assets.tile`coin spot`)) {
        coin = sprites.create(img`
            . . 4 4 4 4 . .
            . 4 2 2 2 2 4 .
            4 2 2 1 2 2 2 4
            4 2 1 2 2 2 2 4
            4 2 2 2 2 2 2 4
            4 2 2 2 2 2 2 4
            . 4 2 2 2 2 4 .
            . . 4 4 4 4 . .
            `, SpriteKind.Food)
        tiles.placeOnTile(coin, value)
        tiles.setTileAt(value, assets.tile`transparency16`)
    }
}
function startLevel1 () {
    level = 1
    game.splash("Level 1: Rooftops", "Jump the rooftops. Dodge the fireworks!")
    scene.setBackgroundImage(assets.image`cannon pass sky`)
    // picture layers behind the rooftops, the far ones move slower
    scroller.setLayerImage(scroller.BackgroundLayer.Layer1, assets.image`city layer`)
    scroller.setLayerImage(scroller.BackgroundLayer.Layer2, assets.image`japan house0`)
    scroller.setLayerImage(scroller.BackgroundLayer.Layer3, assets.image`shrine1FR0`)
    scroller.setLayerImage(scroller.BackgroundLayer.Layer4, assets.image`houses layer`)
    scroller.scrollBackgroundWithCamera(scroller.CameraScrollMode.OnlyHorizontal, scroller.BackgroundLayer.Layer1)
    scroller.scrollBackgroundWithCamera(scroller.CameraScrollMode.OnlyHorizontal, scroller.BackgroundLayer.Layer2)
    scroller.scrollBackgroundWithCamera(scroller.CameraScrollMode.OnlyHorizontal, scroller.BackgroundLayer.Layer3)
    scroller.scrollBackgroundWithCamera(scroller.CameraScrollMode.OnlyHorizontal, scroller.BackgroundLayer.Layer4)
    scroller.setCameraScrollingMultipliers(0.1, 0, scroller.BackgroundLayer.Layer1)
    scroller.setCameraScrollingMultipliers(0.2, 0, scroller.BackgroundLayer.Layer2)
    scroller.setCameraScrollingMultipliers(0.35, 0, scroller.BackgroundLayer.Layer3)
    scroller.setCameraScrollingMultipliers(0.5, 0, scroller.BackgroundLayer.Layer4)
    tiles.setCurrentTilemap(tilemap`cannon pass`)
    for (let value of tiles.getTilesByType(assets.tile`cannon spot`)) {
        cannon = sprites.create(assets.image`cannon`, SpriteKind.Cannon)
        tiles.placeOnTile(cannon, value)
        tiles.setTileAt(value, assets.tile`transparency16`)
    }
    for (let value of tiles.getTilesByType(assets.tile`gate`)) {
        gate = sprites.create(assets.image`torii gate`, SpriteKind.Gate)
        tiles.placeOnTile(gate, value)
        gate.y += -25
        gate.z = -1
    }
    makeCoins()
    makeDuck()
}
function startLevel2 () {
    clearLevel()
    level = 2
    game.splash("Level 2: Dragon Gate", "Press B to throw a shuriken")
    scene.setBackgroundImage(assets.image`dragon gate sky`)
    scroller.setLayerImage(scroller.BackgroundLayer.Layer1, image.create(16, 16))
    scroller.setLayerImage(scroller.BackgroundLayer.Layer2, image.create(16, 16))
    scroller.setLayerImage(scroller.BackgroundLayer.Layer3, image.create(16, 16))
    scroller.setLayerImage(scroller.BackgroundLayer.Layer4, image.create(16, 16))
    tiles.setCurrentTilemap(tilemap`Dragon arena`)
    makeDuck()
    checkpoint = tiles.getTileLocation(3, 6)
    tiles.placeOnTile(duck, checkpoint)
    bossHealth = 20
    boss = sprites.create(assets.image`Dragon Gate boss`, SpriteKind.Enemy)
    boss.setFlag(SpriteFlag.GhostThroughWalls, true)
    boss.setPosition(560, 50)
    boss.follow(duck, 25)
}
function startLevel3 () {
    clearLevel()
    level = 3
    game.splash("Level 3: Flooded Gate", "Beat the chicken! B throws up")
    scene.setBackgroundColor(2)
    scene.setBackgroundImage(image.create(160, 120))
    scroller.setLayerImage(scroller.BackgroundLayer.Layer1, assets.image`shrine2FR0`)
    tiles.setCurrentTilemap(tilemap`flooded gate`)
    makeCoins()
    makeDuck()
    bossHealth = 15
    boss = sprites.create(assets.image`chicken boss`, SpriteKind.Enemy)
    boss.setFlag(SpriteFlag.GhostThroughWalls, true)
    boss.setPosition(duck.x + 100, 28)
}
// ---------- every frame ----------
game.onUpdate(function () {
    if (level == 2) {
        // the dragon floats up and down
        boss.y = 50 + Math.sin(game.runtime() / 700) * 16
    }
    if (level == 3) {
        // the chicken flies above the duck but never touches the water
        boss.vx = (duck.x - boss.x) * 0.8
        boss.y = 28
    }
})
// ---------- enemy attacks ----------
// level 1: every cannon shoots a firework towards the duck
game.onUpdateInterval(1300, function () {
    if (level == 1) {
        for (let value of sprites.allOfKind(SpriteKind.Cannon)) {
            if (Math.abs(value.x - duck.x) < 150) {
                firework = sprites.createProjectileFromSprite(img`
                    . . e . e . .
                    . e 4 2 4 e .
                    e 4 2 1 2 4 e
                    . 2 1 1 1 2 .
                    e 4 2 1 2 4 e
                    . e 4 2 4 e .
                    . . e . e . .
                    `, value, (duck.x - value.x) * 0.8, -130)
                firework.ay = 220
                firework.setKind(SpriteKind.Fire)
                firework.setFlag(SpriteFlag.DestroyOnWall, true)
            }
        }
    }
})
// level 2: the dragon shoots fire, level 3: the chicken drops eggs and fish jump
game.onUpdateInterval(1400, function () {
    if (level == 2) {
        fire = sprites.createProjectileFromSprite(img`
            . . 2 4 2 . . .
            . 2 4 5 4 2 . .
            2 4 5 5 5 4 2 .
            . 2 4 5 4 2 . .
            . . 2 4 2 . . .
            `, boss, -75, randint(-10, 40))
        fire.setKind(SpriteKind.Fire)
        if (duck.x > boss.x) {
            fire.vx = 75
        }
        if (bossHealth <= 10) {
            // angry dragon: a second fireball going higher
            fire2 = sprites.createProjectileFromSprite(img`
                . . 2 4 2 . . .
                . 2 4 5 4 2 . .
                2 4 5 5 5 4 2 .
                . 2 4 5 4 2 . .
                . . 2 4 2 . . .
                `, boss, fire.vx, -30)
            fire2.setKind(SpriteKind.Fire)
        }
    }
    if (level == 3) {
        egg = sprites.createProjectileFromSprite(img`
            . . 1 1 . .
            . 1 1 1 1 .
            1 1 1 1 1 1
            1 1 1 1 1 1
            1 c c 1 c 1
            . 1 c c 1 .
            . . 1 1 . .
            `, boss, 0, 30)
        egg.ay = 150
        egg.setKind(SpriteKind.Fire)
        fish = sprites.createProjectileFromSprite(img`
            . . 4 4 . .
            . 4 4 4 4 .
            . 4 f 4 4 .
            . 4 4 4 4 .
            . 4 4 4 4 .
            . . 4 4 . .
            . 4 . . 4 .
            4 4 . . 4 4
            `, duck, 0, -210)
        fish.setKind(SpriteKind.Fire)
        fish.setPosition(duck.x + randint(-60, 60), 120)
        fish.ay = 300
        fish.setFlag(SpriteFlag.GhostThroughWalls, true)
    }
})
let fish: Sprite = null
let egg: Sprite = null
let fire2: Sprite = null
let fire: Sprite = null
let firework: Sprite = null
let boss: Sprite = null
let gate: Sprite = null
let cannon: Sprite = null
let coin: Sprite = null
let heart: Sprite = null
let bossHealth = 0
let checkpoint: tiles.Location = null
let star: Sprite = null
let facing = 0
let duck: Sprite = null
let level = 0
scene.setBackgroundImage(assets.image`Duckjutsu title screen`)
game.splash("Duckjutsu: Dragon Gate", "The dragon took our seal!")
info.setLife(5)
startLevel1()
