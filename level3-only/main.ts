namespace SpriteKind {
    export const Fire = SpriteKind.create()
    export const Heart = SpriteKind.create()
}
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    throwSpeed = -150
    animation.runImageAnimation(duck, assets.animation`duck walk left`, 100, true)
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    throwSpeed = 150
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
    if (level == 2) {
        shuriken = sprites.createProjectileFromSprite(img`
            . . b . . . . .
            . . b 1 . . b .
            b b 1 1 b b 1 .
            . 1 1 f 1 1 . .
            . . 1 1 1 b b b
            . b b 1 b . . .
            . 1 . b . . . .
            . . . b . . . .
            `, duck, throwSpeed, 0)
        shuriken.setFlag(SpriteFlag.GhostThroughWalls, true)
    }
    if (level == 3) {
        shuriken = sprites.createProjectileFromSprite(img`
            . . b . . . . .
            . . b 1 . . b .
            b b 1 1 b b 1 .
            . 1 1 f 1 1 . .
            . . 1 1 1 b b b
            . b b 1 b . . .
            . 1 . b . . . .
            . . . b . . . .
            `, duck, 0, -150)
        shuriken.setFlag(SpriteFlag.GhostThroughWalls, true)
    }
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`spikes`, function (sprite, location) {
    info.changeLifeBy(-1)
    tiles.placeOnRandomTile(duck, assets.tile`start`)
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`water`, function (sprite, location) {
    info.changeLifeBy(-1)
    tiles.placeOnRandomTile(duck, assets.tile`start`)
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`coin`, function (sprite, location) {
    info.changeScoreBy(1)
    tiles.setTileAt(location, assets.tile`transparency16`)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Fire, function (sprite, otherSprite) {
    otherSprite.destroy()
    info.changeLifeBy(-1)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    info.changeLifeBy(-1)
    pause(1000)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Heart, function (sprite, otherSprite) {
    otherSprite.destroy()
    info.changeLifeBy(1)
})
// LEVEL 2: walk into the gate
scene.onOverlapTile(SpriteKind.Player, assets.tile`gate`, function (sprite, location) {
    level = 2
    game.splash("Level 2", "Jump and press B to hit the dragon!")
    scene.setBackgroundImage(assets.image`dragon sky`)
    tiles.setCurrentTilemap(tilemap`level 2 dragon arena`)
    tiles.placeOnTile(duck, tiles.getTileLocation(3, 6))
    bossHealth = 10
    boss = sprites.create(assets.image`dragon`, SpriteKind.Enemy)
    boss.setPosition(140, 45)
    boss.vx = 30
    boss.setFlag(SpriteFlag.GhostThroughWalls, true)
    boss.setBounceOnWall(true)
    boss.setStayInScreen(true)
})
// hit the boss with a shuriken
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprite.destroy()
    bossHealth += -1
    otherSprite.startEffect(effects.fire, 200)
    if (bossHealth == 5) {
        heart = sprites.create(img`
            . e e . e e .
            e 1 e e e e e
            e e e e e e e
            . e e e e e .
            . . e e e . .
            . . . e . . .
            `, SpriteKind.Heart)
        heart.setPosition(duck.x, 0)
        heart.ay = 100
    }
    if (bossHealth == 0) {
        otherSprite.destroy()
        if (level == 3) {
            game.splash("You saved the village!")
            game.over(true)
        } else {
            // LEVEL 3: the dragon is beaten
            level = 3
            game.splash("Level 3", "Beat the chicken! B throws up")
            scene.setBackgroundImage(assets.image`level 3 background`)
            tiles.setCurrentTilemap(tilemap`level 3 flooded gate`)
            tiles.placeOnRandomTile(duck, assets.tile`start`)
            bossHealth = 10
            boss = sprites.create(assets.image`chicken boss`, SpriteKind.Enemy)
            boss.setPosition(80, 25)
            boss.vx = 40
            boss.setFlag(SpriteFlag.GhostThroughWalls, true)
            boss.setBounceOnWall(true)
            boss.setStayInScreen(true)
        }
    }
})
// enemies attack
game.onUpdateInterval(1500, function () {
    if (level == 1) {
        // every cannon near the duck shoots a firework up into the air
        for (let cannonSpot of tiles.getTilesByType(assets.tile`cannon spot`)) {
            firework = sprites.create(img`
                . . e . e . .
                . e 4 2 4 e .
                e 4 2 1 2 4 e
                . 2 1 1 1 2 .
                e 4 2 1 2 4 e
                . e 4 2 4 e .
                . . e . e . .
                `, SpriteKind.Fire)
            tiles.placeOnTile(firework, cannonSpot)
            if (Math.abs(firework.x - duck.x) < 150) {
                firework.vx = -50
                firework.vy = -150
                firework.ay = 200
                firework.setFlag(SpriteFlag.GhostThroughWalls, true)
                firework.setFlag(SpriteFlag.AutoDestroy, true)
            } else {
                firework.destroy()
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
            `, boss, randint(-40, 40), 60)
        fireball.setKind(SpriteKind.Fire)
        fireball.setFlag(SpriteFlag.GhostThroughWalls, true)
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
            `, boss, 0, 60)
        egg.setKind(SpriteKind.Fire)
        egg.setFlag(SpriteFlag.GhostThroughWalls, true)
    }
})
let egg: Sprite = null
let fireball: Sprite = null
let firework: Sprite = null
let heart: Sprite = null
let boss: Sprite = null
let bossHealth = 0
let shuriken: Sprite = null
let throwSpeed = 0
let duck: Sprite = null
let level = 0
// LEVEL 3 ONLY (test version): start straight in the flooded gate
level = 3
throwSpeed = 150
info.setLife(5)
scene.setBackgroundImage(assets.image`level 3 background`)
tiles.setCurrentTilemap(tilemap`level 3 flooded gate`)
duck = sprites.create(assets.image`duck`, SpriteKind.Player)
controller.moveSprite(duck, 80, 0)
duck.ay = 400
scene.cameraFollowSprite(duck)
tiles.placeOnRandomTile(duck, assets.tile`start`)
bossHealth = 10
boss = sprites.create(assets.image`chicken boss`, SpriteKind.Enemy)
boss.setPosition(80, 25)
boss.vx = 40
boss.setFlag(SpriteFlag.GhostThroughWalls, true)
boss.setBounceOnWall(true)
boss.setStayInScreen(true)
game.splash("Level 3", "Beat the chicken! B throws up")