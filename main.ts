namespace SpriteKind {
    export const Fire = SpriteKind.create()
    export const Water = SpriteKind.create()
}
// ===== CONTROLS =====
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    throwSpeed = -150
    animation.runImageAnimation(duck, walkLeft, 100, true)
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    throwSpeed = 150
    animation.runImageAnimation(duck, walkRight, 100, true)
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (duck.isHittingTile(CollisionDirection.Bottom) || duck.isHittingTile(CollisionDirection.Top)) {
        duck.vy = jumpSpeed
    }
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
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
})
// ===== GOOD AND BAD THINGS =====
scene.onOverlapTile(SpriteKind.Player, assets.tile`coin`, function (sprite, location) {
    info.changeScoreBy(1)
    tiles.setTileAt(location, assets.tile`transparency16`)
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`spikes`, function (sprite, location) {
    info.changeLifeBy(-1)
    tiles.placeOnTile(duck, tiles.getTileLocation(2, 6))
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Fire, function (sprite, otherSprite) {
    otherSprite.destroy()
    info.changeLifeBy(-1)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    info.changeLifeBy(-1)
    pause(1000)
})
// ===== LEVEL 2: walk into the gate =====
scene.onOverlapTile(SpriteKind.Player, assets.tile`gate`, function (sprite, location) {
    level = 2
    game.splash("Level 2", "Jump over the dragon. B throws!")
    scene.setBackgroundImage(assets.image`level 2 background`)
    tiles.setCurrentTilemap(tilemap`level 2 dragon arena`)
    tiles.placeOnTile(duck, tiles.getTileLocation(3, 6))
    boss = sprites.create(assets.image`dragon`, SpriteKind.Enemy)
    tiles.placeOnTile(boss, tiles.getTileLocation(28, 6))
    boss.y += -6
    boss.vx = -30
    boss.setBounceOnWall(true)
    bossHealth = 10
})
// ===== HIT THE BOSS =====
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprite.destroy()
    bossHealth += -1
    otherSprite.startEffect(effects.fire, 200)
    if (bossHealth == 0) {
        otherSprite.destroy()
        if (level == 3) {
            game.over(true)
        } else {
            // ===== LEVEL 3: upside down over the water =====
            level = 3
            game.splash("Level 3", "Upside down! Don't fall in the water")
            scene.setBackgroundImage(assets.image`level 3 background`)
            tiles.setCurrentTilemap(tilemap`level 3 flooded gate`)
            tiles.placeOnTile(duck, tiles.getTileLocation(2, 1))
            duck.ay = -600
            jumpSpeed = 250
            walkLeft = assets.animation`duck walk left upside down`
            walkRight = assets.animation`duck walk right upside down`
            animation.runImageAnimation(duck, walkRight, 100, true)
            water = sprites.create(assets.image`water waves`, SpriteKind.Water)
            water.setFlag(SpriteFlag.RelativeToCamera, true)
            water.y = 100
            boss = sprites.create(assets.image`chicken boss`, SpriteKind.Enemy)
            tiles.placeOnTile(boss, tiles.getTileLocation(24, 2))
            boss.ay = -600
            boss.vx = 40
            boss.setBounceOnWall(true)
            bossHealth = 10
        }
    }
})
// ===== FALLING IN THE WATER (level 3) =====
game.onUpdate(function () {
    if (level == 3 && duck.y > 95) {
        info.changeLifeBy(-1)
        tiles.placeOnTile(duck, tiles.getTileLocation(2, 1))
    }
})
// ===== ENEMIES ATTACK =====
game.onUpdateInterval(1500, function () {
    if (level == 1) {
        for (let cannonSpot of tiles.getTilesByType(assets.tile`cannon spot`)) {
            firework = sprites.create(assets.image`firework`, SpriteKind.Fire)
            tiles.placeOnTile(firework, cannonSpot)
            firework.setVelocity(-50, -150)
            firework.ay = 200
            firework.setFlag(SpriteFlag.GhostThroughWalls, true)
            firework.setFlag(SpriteFlag.AutoDestroy, true)
        }
    } else {
        fireball = sprites.create(assets.image`fireball`, SpriteKind.Fire)
        fireball.setPosition(boss.x, boss.y)
        fireball.vx = -80
        fireball.setFlag(SpriteFlag.GhostThroughWalls, true)
        fireball.setFlag(SpriteFlag.AutoDestroy, true)
    }
})
let fireball: Sprite = null
let firework: Sprite = null
let water: Sprite = null
let bossHealth = 0
let boss: Sprite = null
let shuriken: Sprite = null
let throwSpeed = 0
let jumpSpeed = 0
let walkRight: Image[] = []
let walkLeft: Image[] = []
let duck: Sprite = null
let level = 0
// ===== LEVEL 1: rooftops =====
scene.setBackgroundImage(assets.image`title screen`)
game.splash("Duckjutsu", "The dragon took our seal!")
level = 1
info.setLife(5)
throwSpeed = 150
jumpSpeed = -260
walkLeft = assets.animation`duck walk left`
walkRight = assets.animation`duck walk right`
scene.setBackgroundImage(assets.image`level 1 background`)
tiles.setCurrentTilemap(tilemap`level 1 rooftops`)
duck = sprites.create(assets.image`duck`, SpriteKind.Player)
controller.moveSprite(duck, 80, 0)
duck.ay = 600
scene.cameraFollowSprite(duck)
tiles.placeOnTile(duck, tiles.getTileLocation(2, 6))
game.splash("Level 1", "Jump on the rooftops!")
