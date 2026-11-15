namespace SpriteKind {
    export const Fire = SpriteKind.create()
    export const Cannon = SpriteKind.create()
    export const Heart = SpriteKind.create()
    export const Gate = SpriteKind.create()
}
// ===== CONTROLS =====
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    facing = -1
    animation.runImageAnimation(duck, assets.animation`duck walk left`, 100, true)
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    facing = 1
    animation.runImageAnimation(duck, assets.animation`duck walk right`, 100, true)
})
controller.left.onEvent(ControllerButtonEvent.Released, function () {
    animation.runImageAnimation(duck, assets.animation`duck idle left`, 300, true)
})
controller.right.onEvent(ControllerButtonEvent.Released, function () {
    animation.runImageAnimation(duck, assets.animation`duck idle right`, 300, true)
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (duck.isHittingTile(CollisionDirection.Bottom)) {
        duck.vy = -220
    }
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (level == 2 || level == 3) {
        shuriken = sprites.createProjectileFromSprite(img`
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
            shuriken.vy = -160
        }
        if (facing == 1) {
            animation.runImageAnimation(duck, assets.animation`duck throw right`, 50, false)
        } else {
            animation.runImageAnimation(duck, assets.animation`duck throw left`, 50, false)
        }
    }
})
// ===== GETTING HURT =====
sprites.onOverlap(SpriteKind.Player, SpriteKind.Fire, function (sprite, otherSprite) {
    otherSprite.destroy(effects.fire, 200)
    info.changeLifeBy(-1)
    scene.cameraShake(3, 300)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    info.changeLifeBy(-1)
    scene.cameraShake(3, 300)
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
// ===== PICKUPS =====
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
// ===== BOSS FIGHT =====
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprite.destroy()
    bossHealth += -1
    otherSprite.startEffect(effects.fire, 100)
    if (level == 2 && bossHealth == 10) {
        otherSprite.sayText("RAAAWR!", 1000, false)
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
            startLevel3()
        } else {
            game.splash("You saved the village!")
            game.over(true)
        }
    }
})
// ===== HELPERS =====
function clearLevel () {
    sprites.destroyAllSpritesOfKind(SpriteKind.Player)
    sprites.destroyAllSpritesOfKind(SpriteKind.Enemy)
    sprites.destroyAllSpritesOfKind(SpriteKind.Fire)
    sprites.destroyAllSpritesOfKind(SpriteKind.Projectile)
    sprites.destroyAllSpritesOfKind(SpriteKind.Food)
    sprites.destroyAllSpritesOfKind(SpriteKind.Heart)
    sprites.destroyAllSpritesOfKind(SpriteKind.Cannon)
    sprites.destroyAllSpritesOfKind(SpriteKind.Gate)
}
function makeDuck () {
    duck = sprites.create(assets.image`duck`, SpriteKind.Player)
    duck.ay = 400
    controller.moveSprite(duck, 80, 0)
    scene.cameraFollowSprite(duck)
    facing = 1
    for (let startTile of tiles.getTilesByType(assets.tile`start`)) {
        tiles.placeOnTile(duck, startTile)
        tiles.setTileAt(startTile, assets.tile`transparency16`)
        checkpoint = startTile
    }
}
function makeCoins () {
    for (let coinTile of tiles.getTilesByType(assets.tile`coin`)) {
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
        tiles.placeOnTile(coin, coinTile)
        tiles.setTileAt(coinTile, assets.tile`transparency16`)
    }
}
// ===== LEVEL 1: ROOFTOPS =====
function startLevel1 () {
    level = 1
    game.splash("Level 1: Rooftops", "Dodge the fireworks!")
    scene.setBackgroundImage(assets.image`rooftop sky`)
    scroller.setLayerImage(scroller.BackgroundLayer.Layer1, assets.image`city`)
    scroller.setLayerImage(scroller.BackgroundLayer.Layer2, assets.image`pagoda`)
    scroller.setLayerImage(scroller.BackgroundLayer.Layer3, assets.image`small torii`)
    scroller.setLayerImage(scroller.BackgroundLayer.Layer4, assets.image`houses`)
    scroller.scrollBackgroundWithCamera(scroller.CameraScrollMode.OnlyHorizontal, scroller.BackgroundLayer.Layer1)
    scroller.scrollBackgroundWithCamera(scroller.CameraScrollMode.OnlyHorizontal, scroller.BackgroundLayer.Layer2)
    scroller.scrollBackgroundWithCamera(scroller.CameraScrollMode.OnlyHorizontal, scroller.BackgroundLayer.Layer3)
    scroller.scrollBackgroundWithCamera(scroller.CameraScrollMode.OnlyHorizontal, scroller.BackgroundLayer.Layer4)
    scroller.setCameraScrollingMultipliers(0.1, 0, scroller.BackgroundLayer.Layer1)
    scroller.setCameraScrollingMultipliers(0.2, 0, scroller.BackgroundLayer.Layer2)
    scroller.setCameraScrollingMultipliers(0.35, 0, scroller.BackgroundLayer.Layer3)
    scroller.setCameraScrollingMultipliers(0.5, 0, scroller.BackgroundLayer.Layer4)
    tiles.setCurrentTilemap(tilemap`level 1 rooftops`)
    for (let cannonTile of tiles.getTilesByType(assets.tile`cannon spot`)) {
        cannon = sprites.create(assets.image`cannon`, SpriteKind.Cannon)
        tiles.placeOnTile(cannon, cannonTile)
        tiles.setTileAt(cannonTile, assets.tile`transparency16`)
    }
    for (let gateTile of tiles.getTilesByType(assets.tile`gate`)) {
        gate = sprites.create(assets.image`torii gate`, SpriteKind.Gate)
        tiles.placeOnTile(gate, gateTile)
        gate.y += -25
        gate.z = -1
    }
    makeCoins()
    makeDuck()
}
// ===== LEVEL 2: DRAGON =====
function startLevel2 () {
    clearLevel()
    level = 2
    game.splash("Level 2: Dragon Gate", "Press B to throw shurikens")
    scene.setBackgroundImage(assets.image`dragon sky`)
    scroller.setLayerImage(scroller.BackgroundLayer.Layer1, assets.image`big gate`)
    scroller.setLayerImage(scroller.BackgroundLayer.Layer2, image.create(16, 16))
    scroller.setLayerImage(scroller.BackgroundLayer.Layer3, image.create(16, 16))
    scroller.setLayerImage(scroller.BackgroundLayer.Layer4, image.create(16, 16))
    tiles.setCurrentTilemap(tilemap`level 2 dragon arena`)
    makeDuck()
    checkpoint = tiles.getTileLocation(3, 6)
    tiles.placeOnTile(duck, checkpoint)
    bossHealth = 20
    boss = sprites.create(assets.image`dragon`, SpriteKind.Enemy)
    boss.setFlag(SpriteFlag.GhostThroughWalls, true)
    boss.setPosition(560, 50)
    boss.follow(duck, 25)
}
// ===== LEVEL 3: CHICKEN =====
function startLevel3 () {
    clearLevel()
    level = 3
    game.splash("Level 3: Flooded Gate", "Beat the chicken! B throws up")
    scene.setBackgroundImage(assets.image`rooftop sky`)
    scroller.setLayerImage(scroller.BackgroundLayer.Layer1, assets.image`big gate`)
    tiles.setCurrentTilemap(tilemap`level 3 flooded gate`)
    makeCoins()
    makeDuck()
    bossHealth = 15
    boss = sprites.create(assets.image`chicken boss`, SpriteKind.Enemy)
    boss.setFlag(SpriteFlag.GhostThroughWalls, true)
    boss.setPosition(duck.x + 100, 28)
}
// ===== EVERY FRAME =====
game.onUpdate(function () {
    if (level == 3) {
        // the chicken flies above the duck and never touches the water
        boss.vx = (duck.x - boss.x) * 0.8
        boss.y = 28
    }
})
// ===== ENEMY ATTACKS =====
game.onUpdateInterval(1300, function () {
    if (level == 1) {
        for (let oneCannon of sprites.allOfKind(SpriteKind.Cannon)) {
            if (Math.abs(oneCannon.x - duck.x) < 150) {
                firework = sprites.createProjectileFromSprite(img`
                    . . e . e . .
                    . e 4 2 4 e .
                    e 4 2 1 2 4 e
                    . 2 1 1 1 2 .
                    e 4 2 1 2 4 e
                    . e 4 2 4 e .
                    . . e . e . .
                    `, oneCannon, (duck.x - oneCannon.x) * 0.8, -130)
                firework.ay = 220
                firework.setKind(SpriteKind.Fire)
            }
        }
    }
    if (level == 2) {
        fireball = sprites.createProjectileFromSprite(img`
            . . 2 4 2 . . .
            . 2 4 5 4 2 . .
            2 4 5 5 5 4 2 .
            . 2 4 5 4 2 . .
            . . 2 4 2 . . .
            `, boss, (duck.x - boss.x) * 0.5, randint(-10, 40))
        fireball.setKind(SpriteKind.Fire)
        if (bossHealth <= 10) {
            fireball2 = sprites.createProjectileFromSprite(img`
                . . 2 4 2 . . .
                . 2 4 5 4 2 . .
                2 4 5 5 5 4 2 .
                . 2 4 5 4 2 . .
                . . 2 4 2 . . .
                `, boss, (duck.x - boss.x) * 0.5, -30)
            fireball2.setKind(SpriteKind.Fire)
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
        fish.setPosition(duck.x + randint(-60, 60), 120)
        fish.ay = 300
        fish.setKind(SpriteKind.Fire)
        fish.setFlag(SpriteFlag.GhostThroughWalls, true)
    }
})
let fish: Sprite = null
let egg: Sprite = null
let fireball2: Sprite = null
let fireball: Sprite = null
let firework: Sprite = null
let boss: Sprite = null
let gate: Sprite = null
let cannon: Sprite = null
let coin: Sprite = null
let heart: Sprite = null
let bossHealth = 0
let checkpoint: tiles.Location = null
let shuriken: Sprite = null
let facing = 0
let duck: Sprite = null
let level = 0
// ===== START THE GAME =====
scene.setBackgroundImage(assets.image`title screen`)
game.splash("Duckjutsu", "The dragon took our seal!")
info.setLife(5)
startLevel1()
