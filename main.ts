namespace SpriteKind {
    export const Fire = SpriteKind.create()
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
// ===== COINS AND DANGER =====
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
// fell off the map (or into the water in level 3)
game.onUpdate(function () {
    if (duck.y > 105 || level == 3 && duck.y > 95) {
        info.changeLifeBy(-1)
        tiles.placeOnTile(duck, startSpot)
    }
})
// ===== LEVEL 2: walk into the gate =====
scene.onOverlapTile(SpriteKind.Player, assets.tile`gate`, function (sprite, location) {
    level = 2
    game.splash("Level 2", "Jump over the dragon. B throws!")
    scene.setBackgroundImage(assets.image`level 2 background`)
    tiles.setCurrentTilemap(tilemap`level 2 dragon arena`)
    startSpot = tiles.getTileLocation(3, 6)
    tiles.placeOnTile(duck, startSpot)
    boss = sprites.create(assets.image`dragon`, SpriteKind.Enemy)
    tiles.placeOnTile(boss, tiles.getTileLocation(28, 5))
    boss.vx = -30
    boss.setBounceOnWall(true)
    bossHealth = 10
})
// ===== HIT THE BOSS =====
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprite.destroy()
    bossHealth += -1
    if (bossHealth == 0) {
        otherSprite.destroy()
        if (level == 3) {
            game.over(true)
        }
        // ===== LEVEL 3: upside down over the water =====
        level = 3
        game.splash("Level 3", "Upside down! Don't fall in the water")
        scene.setBackgroundImage(assets.image`level 3 background`)
        tiles.setCurrentTilemap(tilemap`level 3 flooded gate`)
        startSpot = tiles.getTileLocation(2, 1)
        tiles.placeOnTile(duck, startSpot)
        duck.ay = -600
        jumpSpeed = 250
        walkLeft = assets.animation`duck walk left upside down`
        walkRight = assets.animation`duck walk right upside down`
        animation.runImageAnimation(duck, walkRight, 100, true)
        boss = sprites.create(assets.image`chicken boss`, SpriteKind.Enemy)
        tiles.placeOnTile(boss, tiles.getTileLocation(24, 2))
        boss.vx = 40
        boss.setBounceOnWall(true)
        bossHealth = 10
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
            firework.lifespan = 2000
        }
    } else {
        fireball = sprites.createProjectileFromSprite(assets.image`fireball`, boss, -80, 0)
        fireball.setKind(SpriteKind.Fire)
        fireball.setFlag(SpriteFlag.GhostThroughWalls, true)
    }
})
let fireball: Sprite = null
let firework: Sprite = null
let bossHealth = 0
let boss: Sprite = null
let shuriken: Sprite = null
let startSpot: tiles.Location = null
let throwSpeed = 0
let jumpSpeed = 0
let walkRight: Image[] = []
let walkLeft: Image[] = []
let duck: Sprite = null
let level = 0
// ===== LEVEL 1: rooftops =====
scene.setBackgroundImage(assets.image`title screen`)
game.splash("Duckjutsu", "Level 1: jump on the rooftops!")
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
startSpot = tiles.getTileLocation(2, 6)
tiles.placeOnTile(duck, startSpot)
