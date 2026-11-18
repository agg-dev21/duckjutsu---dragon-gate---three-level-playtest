namespace SpriteKind {
    export const Fire = SpriteKind.create()
    export const Heart = SpriteKind.create()
    export const Menu = SpriteKind.create()
    export const Cannon = SpriteKind.create()
    export const Platform = SpriteKind.create()
    export const Key = SpriteKind.create()
    export const NPC = SpriteKind.create()
}
// lose a life (but only once a second, so you don't lose them all at once)
function hurt () {
    if (game.runtime() > hurtTimer) {
        info.changeLifeBy(-1)
        hurtTimer = game.runtime() + 1000
        scene.cameraShake(2, 200)
    }
}
// is the duck on a ladder?
function onLadder () {
    for (let ladderTile of [assets.tile`myTile0`, assets.tile`myTile1`, assets.tile`myTile2`]) {
        if (duck.tileKindAt(TileDirection.Center, ladderTile) || duck.tileKindAt(TileDirection.Bottom, ladderTile)) {
            return true
        }
    }
    return false
}
// stand on a moving platform and move with it
function standOn (platform: Sprite, moved: number) {
    if (duck.overlapsWith(platform) && duck.bottom < platform.top + 8 && duck.vy >= platform.vy) {
        duck.bottom = platform.top + 1
        duck.vy = platform.vy
        duck.x += moved
        onPlatform = true
    }
}
// ===== START MENU =====
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
// A picks a menu option, or jumps
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (level == 0) {
        if (menuChoice == 0) {
            startLevel1()
        } else if (menuChoice == 1) {
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
            game.splash("Thanks for playing!")
            game.over(false)
        }
    } else if (level == 3) {
        // level 3: the duck stands on the ceiling, so it jumps down
        if (duck.isHittingTile(CollisionDirection.Top)) {
            duck.vy = 200
        }
    } else if (duck.isHittingTile(CollisionDirection.Bottom) || onPlatform) {
        duck.vy = 0 - jumpPower
    }
})
// ===== WALKING =====
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
// B throws a shuriken in the boss levels
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
sprites.onOverlap(SpriteKind.Player, SpriteKind.Key, function (sprite, otherSprite) {
    otherSprite.destroy()
    hasKey = true
    duck.sayText("Got the key!", 1000, false)
    music.powerUp.play()
})
// ===== GETTING HURT =====
sprites.onOverlap(SpriteKind.Player, SpriteKind.Fire, function (sprite, otherSprite) {
    otherSprite.destroy()
    hurt()
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    hurt()
    // the dragon gets pushed back a little
    if (level == 2) {
        if (otherSprite.x > sprite.x) {
            otherSprite.x += 32
        } else {
            otherSprite.x += -32
        }
    }
})
// out of lives: start the level again
info.onLifeZero(function () {
    game.splash("Try again!")
    info.setLife(5)
    sprites.destroyAllSpritesOfKind(SpriteKind.Fire)
    tiles.placeOnTile(duck, startSpot)
    duck.vy = 0
})
// ===== LEVEL 1 =====
function startLevel1 () {
    arrow.destroy()
    music.stopAllSounds()
    music.play(music.createSong(assets.song`drums 0`), music.PlaybackMode.LoopingInBackground)
    level = 1
    info.setLife(5)
    throwSpeed = 150
    walkLeft = assets.animation`duck walk left`
    walkRight = assets.animation`duck walk right`
    scene.setBackgroundImage(assets.image`level 1 background`)
    tiles.setCurrentTilemap(tilemap`level 1 rooftops`)
    // a cannon on every cannon spot
    for (let spot of tiles.getTilesByType(assets.tile`cannon spot`)) {
        cannon = sprites.create(assets.image`cannon`, SpriteKind.Cannon)
        tiles.placeOnTile(cannon, spot)
        cannon.ay = 300
        tiles.setTileAt(spot, assets.tile`transparency16`)
    }
    duck = sprites.create(walkRight[0], SpriteKind.Player)
    controller.moveSprite(duck, walkSpeed, 0)
    duck.ay = 600
    scene.cameraFollowSprite(duck)
    startSpot = tiles.getTileLocation(1, 11)
    tiles.placeOnTile(duck, startSpot)
    // the key opens the door
    hasKey = false
    key = sprites.create(img`
        . . 4 4 4 4 . . . . . .
        . 4 2 . . 2 4 . . . . .
        4 2 . . . . 2 4 4 4 4 4
        4 2 . . . . 2 4 4 4 4 4
        . 4 2 . . 2 4 . . 4 . 4
        . . 4 4 4 4 . . . 4 . 4
    `, SpriteKind.Key)
    key.setPosition(200, 40)
    // two platforms that go up and down
    platform1 = sprites.create(img`
        . . . . . a a e e e a . . . . . . . . .
        . . . . a a e e e e a . . . . . . . . .
        . . a a a e e e e e a a . . . . . . . .
        . . a 2 2 c 4 4 4 4 4 a . . . . . . . .
        . a a 2 2 c c c c 4 4 a . . . . . . . .
        . a 2 2 2 c 5 1 c 4 4 a . . a a a . . .
        . a 2 2 c c 5 5 c 4 4 a . . a 4 a a a .
        a 4 4 4 c c 5 5 c 4 4 a . . a 4 4 4 a a
        a 4 4 3 c c c c c c c a . . . a 4 4 4 a
        . a e e e c c c c c c a a a a 4 4 4 2 a
        . e e e c c c c c c 2 2 4 4 4 4 2 2 2 a
        . a c c c c c c c c c 2 a a 4 2 2 2 a a
        a c c c c c c c c c c c c a a a 2 a a a
        a c c 2 c 2 2 c a c c c c c c a 2 2 2 a
        a c 2 2 2 2 2 2 a a c c c c a a 2 2 a a
        a 2 c 2 2 2 2 2 2 a a a a a a 2 2 a a .
        a a 2 2 2 2 2 2 2 2 2 2 2 2 2 2 a a . .
        . a a 2 2 2 2 2 a a 2 a 2 2 a a a . . .
        . . . a a a a a 9 9 4 4 a a a . . . . .
        . . . . . a 9 9 a 4 4 4 a . . . . . . .
    `, SpriteKind.Platform)
    platform1.setPosition(776, 140)
    platform1.vy = 30
    platform2 = sprites.create(img`
        . . . . . a a e e e a . . . . . . . . .
        . . . . a a e e e e a . . . . . . . . .
        . . a a a e e e e e a a . . . . . . . .
        . . a 2 2 c 4 4 4 4 4 a . . . . . . . .
        . a a 2 2 c c c c 4 4 a . . . . . . . .
        . a 2 2 2 c 5 1 c 4 4 a . . a a a . . .
        . a 2 2 c c 5 5 c 4 4 a . . a 4 a a a .
        a 4 4 4 c c 5 5 c 4 4 a . . a 4 4 4 a a
        a 4 4 3 c c c c c c c a . . . a 4 4 4 a
        . a e e e c c c c c c a a a a 4 4 4 2 a
        . e e e c c c c c c 2 2 4 4 4 4 2 2 2 a
        . a c c c c c c c c c 2 a a 4 2 2 2 a a
        a c c c c c c c c c c c c a a a 2 a a a
        a c c 2 c 2 2 c a c c c c c c a 2 2 2 a
        a c 2 2 2 2 2 2 a a c c c c a a 2 2 a a
        a 2 c 2 2 2 2 2 2 a a a a a a 2 2 a a .
        a a 2 2 2 2 2 2 2 2 2 2 2 2 2 2 a a . .
        . a a 2 2 2 2 2 a a 2 a 2 2 a a a . . .
        . . . a a a a a 9 9 4 4 a a a . . . . .
        . . . . . a 9 9 a 4 4 4 a . . . . . . .
    `, SpriteKind.Platform)
    platform2.setPosition(536, 190)
    platform2.vy = -30
    game.splash("Level 1", "Jump on the rooftops!")
}
// ===== LEVEL 2 (walk into the door) =====
scene.onOverlapTile(SpriteKind.Player, assets.tile`door`, function (sprite, location) {
    if (level == 1 && !(hasKey)) {
        duck.sayText("I need the key!", 500, false)
    }
    if (level == 1 && hasKey) {
        level = 2
        sprites.destroyAllSpritesOfKind(SpriteKind.Fire)
        sprites.destroyAllSpritesOfKind(SpriteKind.Cannon)
        sprites.destroyAllSpritesOfKind(SpriteKind.Platform)
        scene.setBackgroundImage(assets.image`level 2 background`)
        tiles.setCurrentTilemap(tilemap`level 2 dragon arena`)
        startSpot = tiles.getTileLocation(2, 16)
        tiles.placeOnTile(duck, startSpot)
        // the dragon chases you
        boss = sprites.create(assets.image`dragon0`, SpriteKind.Enemy)
        boss.setPosition(560, 40)
        boss.setFlag(SpriteFlag.GhostThroughWalls, true)
        bossSpeed = 35
        boss.follow(duck, bossSpeed)
        bossHealth = 15
        // two platforms that go left and right
        platform1 = sprites.create(img`
            6 6 6 6 6 6 6 b b b 6 6 6 6 6 6 6 6 6 6 6 6 6 b b b 6 6 6 6 6 6
            8 8 8 8 8 8 8 6 b 8 8 8 8 8 6 b 8 8 8 8 8 8 8 6 b 8 8 8 8 8 6 b
            8 8 8 8 6 6 8 8 b 8 8 8 6 b 8 8 8 8 8 8 6 6 8 8 b 8 8 8 6 b 8 8
            8 6 b 8 8 8 8 b b b 8 8 6 b 8 8 8 6 b 8 8 8 8 b b b 8 8 6 b 8 8
            b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b
            b 6 6 6 6 6 6 6 6 6 6 6 6 6 b b b 6 6 6 6 6 6 6 6 6 6 6 6 6 b b
            8 8 8 8 8 6 8 8 8 8 8 8 8 8 6 b 8 8 8 8 8 6 8 8 8 8 8 8 8 8 6 b
            8 6 8 8 8 8 8 8 8 8 8 8 8 8 6 b 8 6 8 8 8 8 8 8 8 8 8 8 8 8 6 b
            8 8 6 8 8 8 8 8 6 b b b 8 8 6 b 8 8 6 8 8 8 8 8 6 b b b 8 8 6 b
            b 8 8 8 b b 8 8 8 8 8 8 8 8 b b b 8 8 8 b b 8 8 8 8 8 8 8 8 b b
        `, SpriteKind.Platform)
        platform1.setPosition(120, 275)
        platform1.vx = 60
        platform2 = sprites.create(img`
            6 6 6 6 6 6 6 b b b 6 6 6 6 6 6 6 6 6 6 6 6 6 b b b 6 6 6 6 6 6
            8 8 8 8 8 8 8 6 b 8 8 8 8 8 6 b 8 8 8 8 8 8 8 6 b 8 8 8 8 8 6 b
            8 8 8 8 6 6 8 8 b 8 8 8 6 b 8 8 8 8 8 8 6 6 8 8 b 8 8 8 6 b 8 8
            8 6 b 8 8 8 8 b b b 8 8 6 b 8 8 8 6 b 8 8 8 8 b b b 8 8 6 b 8 8
            b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b
            b 6 6 6 6 6 6 6 6 6 6 6 6 6 b b b 6 6 6 6 6 6 6 6 6 6 6 6 6 b b
            8 8 8 8 8 6 8 8 8 8 8 8 8 8 6 b 8 8 8 8 8 6 8 8 8 8 8 8 8 8 6 b
            8 6 8 8 8 8 8 8 8 8 8 8 8 8 6 b 8 6 8 8 8 8 8 8 8 8 8 8 8 8 6 b
            8 8 6 8 8 8 8 8 6 b b b 8 8 6 b 8 8 6 8 8 8 8 8 6 b b b 8 8 6 b
            b 8 8 8 b b 8 8 8 8 8 8 8 8 b b b 8 8 8 b b 8 8 8 8 8 8 8 8 b b
        `, SpriteKind.Platform)
        platform2.setPosition(420, 211)
        platform2.vx = 50
        game.splash("Level 2", "Climb the tower and beat the dragon!")
        // a chicken explains the buttons, then goes away
        npc = sprites.create(img`
            e e e e e e e e e e e e e e e e e e e e e e e e e e e e e e e e
            e e e e e e e e e e e e e e e e e e e e e e e e e e e e e e e e
            e e e e e e e e e e e e e e e e e e e e e e e e e e e e e e e e
            3 3 e e 3 3 e e 3 3 e e 3 3 e e 3 3 e e 3 3 e e 3 3 e e 3 3 e e
            e e 3 3 e e 3 3 e e 3 3 e e 3 3 e e 3 3 e e 3 3 e e 3 3 e e 3 3
            3 3 e e 3 3 e e 3 3 e e 3 3 e e 3 3 e e 3 3 e e 3 3 e e 3 3 e e
            e e 3 3 e e 3 3 e e 3 3 e e 3 3 e e 3 3 e e 3 3 e e 3 3 e e 3 3
            3 3 e 3 3 3 e 3 3 3 e 3 3 3 e 3 3 3 e 3 3 3 e 3 3 3 e 3 3 3 e 3
            3 3 3 5 3 3 3 5 3 3 3 5 3 3 3 5 3 3 3 5 3 3 3 5 3 3 3 5 3 3 3 5
            3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
        `, SpriteKind.NPC)
        npc.setPosition(58, 278)
        npc.sayText("Up/down climbs ladders. A jumps. B throws!", 4000, false)
        npc.lifespan = 5000
    }
})
// ===== LEVEL 3 =====
function startLevel3 () {
    level = 3
    sprites.destroyAllSpritesOfKind(SpriteKind.Fire)
    sprites.destroyAllSpritesOfKind(SpriteKind.Heart)
    sprites.destroyAllSpritesOfKind(SpriteKind.Platform)
    scene.setBackgroundImage(assets.image`level 3 background`)
    tiles.setCurrentTilemap(tilemap`level 3 flooded gate`)
    startSpot = tiles.getTileLocation(2, 2)
    tiles.placeOnTile(duck, startSpot)
    // upside down!
    duck.ay = -600
    walkLeft = assets.animation`duck walk left upside down`
    walkRight = assets.animation`duck walk right upside down`
    animation.stopAnimation(animation.AnimationTypes.All, duck)
    duck.setImage(walkRight[0])
    boss = sprites.create(assets.image`chicken boss`, SpriteKind.Enemy)
    tiles.placeOnTile(boss, tiles.getTileLocation(24, 2))
    boss.ay = -400
    bossSpeed = 55
    boss.vx = bossSpeed
    bossHealth = 15
    game.splash("Level 3", "Upside down! Don't fall in the water")
}
// ===== HIT THE BOSS =====
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprite.destroy()
    bossHealth += -1
    otherSprite.startEffect(effects.fire, 200)
    music.smallCrash.play()
    // half health: the boss gets faster
    if (bossHealth == 7) {
        bossSpeed += 20
        otherSprite.sayText("GRR!", 1000, false)
        if (level == 2) {
            boss.follow(duck, bossSpeed)
        }
    }
    // the boss drops a heart next to you
    if (bossHealth == 5) {
        heart = sprites.create(assets.image`heart`, SpriteKind.Heart)
        heart.setPosition(duck.x + 20, duck.y)
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
    if (level == 1 || level == 2) {
        // platforms turn around at the end of their path
        if (level == 1) {
            if (platform1.y > 200) {
                platform1.vy = -30
            }
            if (platform1.y < 140) {
                platform1.vy = 30
            }
            if (platform2.y > 190) {
                platform2.vy = -30
            }
            if (platform2.y < 130) {
                platform2.vy = 30
            }
        } else {
            if (platform1.x > 240) {
                platform1.vx = -60
            }
            if (platform1.x < 120) {
                platform1.vx = 60
            }
            if (platform2.x > 520) {
                platform2.vx = -50
            }
            if (platform2.x < 420) {
                platform2.vx = 50
            }
        }
        // standing on a platform
        onPlatform = false
        standOn(platform1, platform1.x - platform1LastX)
        standOn(platform2, platform2.x - platform2LastX)
        platform1LastX = platform1.x
        platform2LastX = platform2.x
        // ladders: no gravity, up and down climb
        if (onPlatform) {
            duck.ay = 0
        } else if (onLadder()) {
            duck.ay = 0
            if (controller.up.isPressed()) {
                duck.vy = 0 - climbSpeed
            } else if (controller.down.isPressed()) {
                duck.vy = climbSpeed
            } else {
                duck.vy = 0
            }
            // move to the middle of the ladder so the duck fits through the hole
            if (controller.up.isPressed() || controller.down.isPressed()) {
                duck.x = Math.floor(duck.x / 16) * 16 + 8
            }
        } else {
            duck.ay = 600
        }
        // spikes: every 2nd hit loses a heart (half a heart each)
        if (duck.isHittingTile(CollisionDirection.Bottom) && duck.tileKindAt(TileDirection.Bottom, assets.tile`spikes0`)) {
            if (game.runtime() > hurtTimer) {
                spikeHits += 1
                hurtTimer = game.runtime() + 1000
                duck.sayText("Ouch!", 500, false)
                if (spikeHits == 2) {
                    spikeHits = 0
                    info.changeLifeBy(-1)
                }
            }
            duck.vy = -200
        }
    }
    if (level == 3) {
        // the chicken turns around at walls
        if (boss.isHittingTile(CollisionDirection.Left)) {
            boss.vx = bossSpeed
        }
        if (boss.isHittingTile(CollisionDirection.Right)) {
            boss.vx = 0 - bossSpeed
        }
        // falling in the water
        if (duck.y > 90) {
            info.changeLifeBy(-1)
            tiles.placeOnTile(duck, startSpot)
            duck.vy = 0
        }
    }
})
// ===== ENEMIES ATTACK =====
game.onUpdateInterval(1500, function () {
    // cannons near you shoot fireworks
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
    // the dragon shoots a fireball when it is close
    if (level == 2 && Math.abs(boss.x - duck.x) < 150 && Math.abs(boss.y - duck.y) < 100) {
        fireball = sprites.createProjectileFromSprite(assets.image`C1`, boss, -80, 0)
        if (duck.x > boss.x) {
            fireball.vx = 80
        }
        fireball.vy = duck.y - boss.y
        fireball.setKind(SpriteKind.Fire)
        fireball.setFlag(SpriteFlag.GhostThroughWalls, true)
    }
    // the chicken throws an egg
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
// every 3 seconds the chicken dives at you
game.onUpdateInterval(3000, function () {
    if (level == 3 && boss.isHittingTile(CollisionDirection.Top)) {
        boss.vy = 200
    }
})
let egg: Sprite = null
let fireball: Sprite = null
let firework: Sprite = null
let heart: Sprite = null
let npc: Sprite = null
let bossHealth = 0
let bossSpeed = 0
let boss: Sprite = null
let platform2: Sprite = null
let platform1: Sprite = null
let platform1LastX = 0
let platform2LastX = 0
let key: Sprite = null
let hasKey = false
let startSpot: tiles.Location = null
let cannon: Sprite = null
let walkRight: Image[] = []
let walkLeft: Image[] = []
let shuriken: Sprite = null
let throwSpeed = 0
let onPlatform = false
let spikeHits = 0
let hurtTimer = 0
let duck: Sprite = null
let soundOn = false
let arrow: Sprite = null
let menuChoice = 0
let level = 0
let walkSpeed = 0
let jumpPower = 0
let climbSpeed = 0
// ===== GAME STARTS HERE =====
walkSpeed = 95
jumpPower = 290
climbSpeed = 85
level = 0
menuChoice = 0
soundOn = true
scene.setBackgroundImage(assets.image`start menu`)
music.play(music.createSong(assets.song`waiting lol`), music.PlaybackMode.LoopingInBackground)
arrow = sprites.create(img`
    4 4 . . . .
    4 4 4 4 . .
    4 4 4 4 4 4
    4 4 4 4 4 4
    4 4 4 4 . .
    4 4 . . . .
`, SpriteKind.Menu)
arrow.setPosition(46, 59)
