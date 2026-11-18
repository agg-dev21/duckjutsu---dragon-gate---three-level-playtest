namespace SpriteKind {
    export const Fire = SpriteKind.create()
    export const Heart = SpriteKind.create()
    export const Menu = SpriteKind.create()
    export const Cannon = SpriteKind.create()
}
// ===== HELPERS =====
// lose a life, then 1 second where you can't be hurt again
function hurt () {
    if (game.runtime() > safeTime) {
        info.changeLifeBy(-1)
        safeTime = game.runtime() + 1000
        scene.cameraShake(2, 200)
    }
}
// ===== START MENU =====
// up and down move the arrow
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (level == 0 && menuChoice > 0) {
        menuChoice += -1
        arrow.y = 59 + menuChoice * 13
    }
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (level == 0 && menuChoice < 2) {
        menuChoice += 1
        arrow.y = 59 + menuChoice * 13
    }
})
// A picks a menu option, or jumps during the game
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (level == 0) {
        if (menuChoice == 0) {
            startLevel1()
        } else if (menuChoice == 1) {
            // SETTINGS: turn the sound on or off
            if (soundOn) {
                soundOn = false
                music.setVolume(0)
                game.splash("Sound OFF")
            } else {
                soundOn = true
                music.setVolume(128)
                game.splash("Sound ON")
            }
        } else {
            // QUIT
            game.splash("Thanks for playing!")
            game.over(false)
        }
    } else if (level == 3) {
        // level 3: the duck stands on the ceiling, so it jumps down
        // (vy is 0 when standing still, which catches the times the tile check misses)
        if (duck.isHittingTile(CollisionDirection.Top) || duck.vy == 0) {
            duck.vy = 200
        }
    } else if (duck.isHittingTile(CollisionDirection.Bottom) || duck.vy == 0) {
        duck.vy = 0 - jumpPower
    }
})
// ===== CONTROLS =====
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (level > 0) {
        throwSpeed = -150
        animation.runImageAnimation(duck, walkLeft, 100, true)
    }
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (level > 0) {
        throwSpeed = 150
        animation.runImageAnimation(duck, walkRight, 100, true)
    }
})
// let go of an arrow: keep walking the other way, or stand still
controller.left.onEvent(ControllerButtonEvent.Released, function () {
    if (level > 0) {
        if (controller.right.isPressed()) {
            animation.runImageAnimation(duck, walkRight, 100, true)
        } else {
            animation.stopAnimation(animation.AnimationTypes.All, duck)
        }
    }
})
controller.right.onEvent(ControllerButtonEvent.Released, function () {
    if (level > 0) {
        if (controller.left.isPressed()) {
            animation.runImageAnimation(duck, walkLeft, 100, true)
        } else {
            animation.stopAnimation(animation.AnimationTypes.All, duck)
        }
    }
})
// B throws a shuriken (only in the boss levels)
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (level >= 2) {
        shuriken = sprites.createProjectileFromSprite(assets.image`Random`, duck, throwSpeed, 0)
        shuriken.setFlag(SpriteFlag.GhostThroughWalls, true)
        music.pewPew.play()
    }
})
// ===== PICK-UPS =====
sprites.onOverlap(SpriteKind.Player, SpriteKind.Heart, function (sprite, otherSprite) {
    otherSprite.destroy()
    info.changeLifeBy(1)
})
// ===== GETTING HURT =====
sprites.onOverlap(SpriteKind.Player, SpriteKind.Fire, function (sprite, otherSprite) {
    otherSprite.destroy()
    hurt()
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    hurt()
})
// out of lives: try the same level again
info.onLifeZero(function () {
    game.splash("Try again!")
    info.setLife(5)
    tiles.placeOnTile(duck, startSpot)
})
// ===== LEVEL 1: rooftops =====
function startLevel1 () {
    arrow.destroy()
    level = 1
    info.setLife(5)
    throwSpeed = 150
    walkLeft = assets.animation`duck walk left`
    walkRight = assets.animation`duck walk right`
    scene.setBackgroundImage(assets.image`level 1 background`)
    tiles.setCurrentTilemap(tilemap`level 1 rooftops`)
    // put a cannon on every cannon spot tile
    for (let spot of tiles.getTilesByType(assets.tile`cannon spot`)) {
        cannon = sprites.create(assets.image`cannon`, SpriteKind.Cannon)
        tiles.placeOnTile(cannon, spot)
        // gravity makes the cannon sit on the roof under it
        cannon.ay = 300
        tiles.setTileAt(spot, assets.tile`transparency16`)
    }
    duck = sprites.create(assets.image`duck0`, SpriteKind.Player)
    controller.moveSprite(duck, walkSpeed, 0)
    duck.ay = 600
    scene.cameraFollowSprite(duck)
    startSpot = tiles.getTileLocation(1, 11)
    tiles.placeOnTile(duck, startSpot)
    game.splash("Level 1", "Jump on the rooftops!")
}
// ===== LEVEL 2: walk into the door =====
scene.onOverlapTile(SpriteKind.Player, assets.tile`door`, function (sprite, location) {
    if (level == 1) {
        level = 2
        sprites.destroyAllSpritesOfKind(SpriteKind.Fire)
        sprites.destroyAllSpritesOfKind(SpriteKind.Cannon)
        scene.setBackgroundImage(assets.image`level 2 background`)
        tiles.setCurrentTilemap(tilemap`level 2 dragon arena`)
        startSpot = tiles.getTileLocation(6, 25)
        tiles.placeOnTile(duck, startSpot)
        // the dragon flies around the tower and chases the duck
        boss = sprites.create(assets.image`dragon0`, SpriteKind.Enemy)
        boss.setPosition(560, 40)
        boss.setFlag(SpriteFlag.GhostThroughWalls, true)
        bossSpeed = 30
        boss.follow(duck, bossSpeed)
        bossHealth = 15
        game.splash("Level 2", "Climb ladders with up/down. B throws!")
    }
})
// ===== LEVEL 3: upside down over the water =====
function startLevel3 () {
    level = 3
    sprites.destroyAllSpritesOfKind(SpriteKind.Fire)
    sprites.destroyAllSpritesOfKind(SpriteKind.Heart)
    scene.setBackgroundImage(assets.image`level 3 background`)
    tiles.setCurrentTilemap(tilemap`level 3 flooded gate`)
    startSpot = tiles.getTileLocation(2, 2)
    tiles.placeOnTile(duck, startSpot)
    duck.ay = -600
    walkLeft = assets.animation`duck walk left upside down`
    walkRight = assets.animation`duck walk right upside down`
    animation.stopAnimation(animation.AnimationTypes.All, duck)
    duck.setImage(walkRight[0])
    boss = sprites.create(assets.image`chicken boss`, SpriteKind.Enemy)
    tiles.placeOnTile(boss, tiles.getTileLocation(24, 2))
    boss.ay = -400
    bossSpeed = 55
    bossDirection = 1
    bossHealth = 15
    game.splash("Level 3", "Upside down! Don't fall in the water")
}
// ===== HIT THE BOSS =====
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprite.destroy()
    bossHealth += -1
    otherSprite.startEffect(effects.fire, 200)
    music.smallCrash.play()
    // under half health: the boss gets angry and faster
    if (bossHealth == 7) {
        bossSpeed = bossSpeed + 20
        otherSprite.sayText("GRR!", 1000, false)
        if (level == 2) {
            boss.follow(duck, bossSpeed)
        }
    }
    // the boss drops a heart
    if (bossHealth == 5) {
        heart = sprites.create(assets.image`heart`, SpriteKind.Heart)
        if (level == 2) {
            heart.setPosition(otherSprite.x, otherSprite.y - 40)
        } else {
            heart.setPosition(otherSprite.x, otherSprite.y + 30)
        }
    }
    if (bossHealth == 0) {
        otherSprite.destroy()
        if (level == 2) {
            startLevel3()
        } else {
            game.splash("You saved the village!")
            game.over(true)
        }
    }
})
// ===== EVERY FRAME =====
game.onUpdate(function () {
    // levels 1 and 2: standing on spikes hurts and bounces you up
    if (level == 1 || level == 2) {
        if (duck.isHittingTile(CollisionDirection.Bottom) && duck.tileKindAt(TileDirection.Bottom, assets.tile`spikes0`)) {
            hurt()
            duck.vy = -150
        }
    }
    // levels 1 and 2: ladders. On a ladder there is no gravity and up/down climb.
    if (level == 1 || level == 2) {
        if (duck.tileKindAt(TileDirection.Center, assets.tile`myTile0`) || (duck.tileKindAt(TileDirection.Center, assets.tile`myTile1`) || duck.tileKindAt(TileDirection.Center, assets.tile`myTile2`))) {
            duck.ay = 0
            duck.vy = 0
            if (controller.up.isPressed()) {
                duck.vy = 0 - climbSpeed
            }
            if (controller.down.isPressed()) {
                duck.vy = climbSpeed
            }
        } else {
            duck.ay = 600
        }
    }
    // level 3: the chicken turns around when it hits a wall
    if (level == 3) {
        if (boss.isHittingTile(CollisionDirection.Left)) {
            bossDirection = 1
        }
        if (boss.isHittingTile(CollisionDirection.Right)) {
            bossDirection = -1
        }
        boss.vx = bossSpeed * bossDirection
    }
    // level 3: falling into the water
    if (level == 3) {
        if (duck.y > 90) {
            info.changeLifeBy(-1)
            tiles.placeOnTile(duck, startSpot)
        }
    }
})
// ===== ENEMIES ATTACK =====
game.onUpdateInterval(1500, function () {
    // level 1: cannons near the duck shoot fireworks
    if (level == 1) {
        for (let oneCannon of sprites.allOfKind(SpriteKind.Cannon)) {
            if (Math.abs(oneCannon.x - duck.x) < 150) {
                animation.runImageAnimation(oneCannon, assets.animation`cannon fire`, 80, false)
                firework = sprites.create(assets.image`C2`, SpriteKind.Fire)
                firework.setPosition(oneCannon.x - 8, oneCannon.y)
                firework.vx = -50
                firework.vy = -150
                firework.ay = 200
                firework.setFlag(SpriteFlag.GhostThroughWalls, true)
                firework.lifespan = 2000
            }
        }
    }
    // level 2: the dragon throws a fireball at the duck
    if (level == 2) {
        fireball = sprites.createProjectileFromSprite(assets.image`C1`, boss, -80, 0)
        if (duck.x > boss.x) {
            fireball.vx = 80
        }
        // aim up or down at the duck
        fireball.vy = duck.y - boss.y
        fireball.setKind(SpriteKind.Fire)
        fireball.setFlag(SpriteFlag.GhostThroughWalls, true)
    }
    // level 3: the chicken throws an egg at the duck
    if (level == 3) {
        egg = sprites.createProjectileFromSprite(assets.image`C3`, boss, 80, 0)
        if (duck.x < boss.x) {
            egg.vx = -80
        }
        egg.vy = duck.y - boss.y
        egg.setKind(SpriteKind.Fire)
        egg.setFlag(SpriteFlag.GhostThroughWalls, true)
    }
})
// every 3 seconds: the chicken dives down at you
game.onUpdateInterval(3000, function () {
    if (level == 3) {
        if (boss.isHittingTile(CollisionDirection.Top)) {
            boss.vy = 200
        }
    }
})
let bossSpeed = 0
let bossDirection = 0
let egg: Sprite = null
let fireball: Sprite = null
let firework: Sprite = null
let heart: Sprite = null
let cannon: Sprite = null
let bossHealth = 0
let boss: Sprite = null
let shuriken: Sprite = null
let startSpot: tiles.Location = null
let walkRight: Image[] = []
let walkLeft: Image[] = []
let duck: Sprite = null
let throwSpeed = 0
let safeTime = 0
let soundOn = false
let arrow: Sprite = null
let menuChoice = 0
let level = 0
let walkSpeed = 0
let jumpPower = 0
let climbSpeed = 0
// ===== GAME STARTS HERE: show the start menu =====
// how the duck moves: change these to tune the controls
walkSpeed = 95
jumpPower = 290
climbSpeed = 85
level = 0
menuChoice = 0
soundOn = true
scene.setBackgroundImage(assets.image`start menu`)
arrow = sprites.create(img`
    4 4 . . . .
    4 4 4 4 . .
    4 4 4 4 4 4
    4 4 4 4 4 4
    4 4 4 4 . .
    4 4 . . . .
    `, SpriteKind.Menu)
arrow.setPosition(46, 59)
