namespace SpriteKind {
    export const Fire = SpriteKind.create()
    export const Cannon = SpriteKind.create()
    export const Scenery = SpriteKind.create()
}
// ---------------- title menu ----------------
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (currentLevel == 0) {
        moveTitleSelection(-1)
    } else {
        jump()
    }
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    moveTitleSelection(1)
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (currentLevel == 0) {
        if (menuPage == 0) {
            selectTitleOption(titleSelection)
        } else if (menuPage == 1) {
            toggleSound()
        } else {
            showTitle()
        }
    } else {
        jump()
    }
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (currentLevel == 2 || currentLevel == 3) {
        shoot()
    } else if (currentLevel == 0 && menuPage != 0) {
        showTitle()
    }
})
browserEvents.MouseLeft.onEvent(browserEvents.MouseButtonEvent.Pressed, function (x, y) {
    if (currentLevel != 0) {
        return
    }
    if (menuPage == 0 && x >= 46 && x <= 115 && y >= 39 && y < 93) {
        selectTitleOption(Math.idiv(y - 39, 18))
    } else if (menuPage == 1 && x >= 27 && x <= 133 && y >= 43 && y < 59) {
        toggleSound()
    } else if (menuPage == 1 && x >= 50 && x <= 110 && y >= 85 && y < 102) {
        showTitle()
    } else if (menuPage == 2 && x >= 27 && x <= 133 && y >= 71 && y < 91) {
        showTitle()
    }
})
function moveTitleSelection (direction: number) {
    if (currentLevel == 0 && menuPage == 0) {
        titleSelection = (titleSelection + direction + 3) % 3
        drawTitle()
    }
}
function selectTitleOption (option: number) {
    if (option == 0) {
        startGame()
    } else {
        menuPage = option
        drawMenuPage()
    }
}
function showTitle () {
    menuPage = 0
    image.setPalette(hex`000000ffffffff2121ff93c4ff8135fff609249ca378dc52003fad87f2ff8e2ec4a4839f5c406ce5cdc491463d000000`)
    drawTitle()
}
function drawTitle () {
    title = assets.image`Duckjutsu title screen`.clone()
    title.drawRect(50, 39 + titleSelection * 18, 62, 17, 12)
    scene.setBackgroundImage(title)
}
function toggleSound () {
    soundOn = !(soundOn)
    setVolume()
    drawMenuPage()
}
function setVolume () {
    if (soundOn) {
        music.setVolume(40)
    } else {
        music.setVolume(0)
    }
}
function drawMenuPage () {
    panel = assets.image`Duckjutsu title screen`.clone()
    panel.fillRect(18, 25, 124, 78, 13)
    panel.drawRect(18, 25, 124, 78, 12)
    if (menuPage == 1) {
        panel.print("SETTINGS", 55, 31, 15)
        panel.drawRect(27, 43, 106, 16, 12)
        if (soundOn) {
            panel.print("Sound: On", 50, 48, 15)
        } else {
            panel.print("Sound: Off", 50, 48, 15)
        }
        panel.print("Arrows: move / jump", 24, 64, 15)
        panel.print("B: throw stars", 38, 74, 15)
        panel.print("BACK", 68, 89, 15)
    } else {
        panel.print("GAME CLOSED", 47, 43, 15)
        panel.drawRect(27, 71, 106, 20, 12)
        panel.print("RETURN TO TITLE", 34, 78, 15)
    }
    scene.setBackgroundImage(panel)
}
// ---------------- the duck ----------------
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    animateDuck()
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    animateDuck()
})
controller.left.onEvent(ControllerButtonEvent.Released, function () {
    animateDuck()
})
controller.right.onEvent(ControllerButtonEvent.Released, function () {
    animateDuck()
})
// Picks walk or idle animation, facing the way the duck is going
function animateDuck () {
    if (currentLevel <= 0) {
        return
    }
    if (controller.left.isPressed()) {
        facing = -1
        animation.runImageAnimation(duck, assets.animation`duck walk left`, 100, true)
    } else if (controller.right.isPressed()) {
        facing = 1
        animation.runImageAnimation(duck, assets.animation`duck walk`, 100, true)
    } else if (facing == 1) {
        animation.runImageAnimation(duck, assets.animation`duck idle`, 300, true)
    } else {
        animation.runImageAnimation(duck, assets.animation`duck idle left`, 300, true)
    }
}
function setupDuck () {
    duck = sprites.create(assets.image`duck stand`, SpriteKind.Player)
    duck.ay = 400
    controller.moveSprite(duck, 80, 0)
    scene.cameraFollowSprite(duck)
    facing = 1
    hurtUntil = 0
    animUntil = 0
    // the duck starts on the "start" flag tile
    for (let value of tiles.getTilesByType(assets.tile`start`)) {
        tiles.placeOnTile(duck, value)
        duck.y += -4
        tiles.setTileAt(value, assets.tile`transparency16`)
        checkpoint = value
    }
}
function jump () {
    if (duck.isHittingTile(CollisionDirection.Bottom)) {
        duck.vy = -220
    }
}
function shoot () {
    if (game.runtime() - lastShot >= 300) {
        lastShot = game.runtime()
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
        if (currentLevel == 3) {
            // the chicken is above, so throw upwards
            star.vx = facing * 40
            star.vy = -160
        }
        star.setFlag(SpriteFlag.AutoDestroy, false)
        star.setFlag(SpriteFlag.DestroyOnWall, true)
        star.lifespan = 2000
        if (facing == 1) {
            animation.runImageAnimation(duck, assets.animation`duck throw`, 50, false)
        } else {
            animation.runImageAnimation(duck, assets.animation`duck throw left`, 50, false)
        }
        animUntil = game.runtime() + 300
    }
}
function hurt () {
    if (game.runtime() >= hurtUntil) {
        hurtUntil = game.runtime() + 1200
        info.changeLifeBy(-1)
        scene.cameraShake(3, 300)
        if (facing == 1) {
            animation.runImageAnimation(duck, assets.animation`duck hurt`, 50, false)
        } else {
            animation.runImageAnimation(duck, assets.animation`duck hurt left`, 50, false)
        }
        animUntil = game.runtime() + 500
    }
}
// fell in a pit or in the water: lose a life, go back to the last checkpoint
function fallBack () {
    info.changeLifeBy(-1)
    scene.cameraShake(3, 300)
    tiles.placeOnTile(duck, checkpoint)
    duck.y += -4
    duck.vy = 0
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Fire, function (sprite, otherSprite) {
    otherSprite.destroy(effects.fire, 200)
    hurt()
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    hurt()
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`checkpoint`, function (sprite, location) {
    checkpoint = location
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`water`, function (sprite, location) {
    fallBack()
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`spikes`, function (sprite, location) {
    fallBack()
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`gate`, function (sprite, location) {
    if (currentLevel == 1) {
        clearLevel()
        startLevelTwo()
    }
})
// ---------------- levels ----------------
function startGame () {
    currentLevel = -1
    browserEvents.setCursorVisible(false)
    game.splash("Duckjutsu: Dragon Gate", "The dragon took our seal.")
    game.splash("Cross the cannon pass", "Beat the dragon. Get it back.")
    info.setLife(5)
    info.setScore(0)
    startLevelOne()
}
// Two picture layers behind the level that move slower than the camera
function setupParallax (far: Image, near: Image) {
    scroller.setLayerImage(scroller.BackgroundLayer.Layer1, far)
    scroller.setLayerImage(scroller.BackgroundLayer.Layer2, near)
    scroller.scrollBackgroundWithCamera(scroller.CameraScrollMode.OnlyHorizontal, scroller.BackgroundLayer.Layer1)
    scroller.scrollBackgroundWithCamera(scroller.CameraScrollMode.OnlyHorizontal, scroller.BackgroundLayer.Layer2)
    scroller.setCameraScrollingMultipliers(0.2, 0, scroller.BackgroundLayer.Layer1)
    scroller.setCameraScrollingMultipliers(0.5, 0, scroller.BackgroundLayer.Layer2)
}
function clearLevel () {
    currentLevel = -1
    sprites.destroyAllSpritesOfKind(SpriteKind.Cannon)
    sprites.destroyAllSpritesOfKind(SpriteKind.Fire)
    sprites.destroyAllSpritesOfKind(SpriteKind.Projectile)
    sprites.destroyAllSpritesOfKind(SpriteKind.Scenery)
    sprites.destroyAllSpritesOfKind(SpriteKind.Enemy)
    sprites.destroyAllSpritesOfKind(SpriteKind.Player)
}
function startLevelOne () {
    game.splash("Level 1: Cannon Pass", "Up/A jumps. Hide from fireworks!")
    image.setPalette(hex`000000FFFFFFFFF285FAA27DFF81354D2412249CA363507E9096BAD3602BD8682C024A62FFE69BEC5F4CC91F26000000`)
    setVolume()
    scene.setBackgroundImage(assets.image`cannon pass sky`)
    setupParallax(assets.image`japan house0`, assets.image`shrine1FR0`)
    tiles.setCurrentTilemap(tilemap`cannon pass`)
    // every "cannon spot" tile becomes a real cannon
    for (let value of tiles.getTilesByType(assets.tile`cannon spot`)) {
        cannon = sprites.create(assets.image`cannon`, SpriteKind.Cannon)
        tiles.placeOnTile(cannon, value)
        cannon.y += -3
        tiles.setTileAt(value, assets.tile`transparency16`)
    }
    // a big torii gate stands over the "gate" tile at the end
    for (let value of tiles.getTilesByType(assets.tile`gate`)) {
        gate = sprites.create(assets.image`torii gate`, SpriteKind.Scenery)
        tiles.placeOnTile(gate, value)
        gate.y += -25
        gate.z = -1
    }
    setupDuck()
    currentLevel = 1
    animateDuck()
}
function startLevelTwo () {
    game.splash("Level 2: Dragon Gate", "Press B to throw a shuriken")
    scene.setBackgroundImage(assets.image`dragon gate sky`)
    setupParallax(assets.image`shrine2FR0`, assets.image`shrine1FR0`)
    tiles.setCurrentTilemap(tilemap`Dragon arena`)
    setupDuck()
    checkpoint = tiles.getTileLocation(3, 6)
    tiles.placeOnTile(duck, checkpoint)
    duck.y += -4
    hp = 20
    dragon = sprites.create(assets.image`myImage2`, SpriteKind.Enemy)
    dragon.setFlag(SpriteFlag.GhostThroughWalls, true)
    dragon.setPosition(560, 50)
    dragon.follow(duck, 25)
    currentLevel = 2
    animateDuck()
}
function startLevelThree () {
    game.splash("Level 3: Flooded Gate", "The chicken boss! Throw up with B")
    scene.setBackgroundColor(2)
    scene.setBackgroundImage(assets.image`shrinesss bg0`)
    setupParallax(assets.image`back houses`, assets.image`japan house0`)
    tiles.setCurrentTilemap(tilemap`flooded gate`)
    setupDuck()
    hp = 15
    chicken = sprites.create(assets.image`Dragon Gate boss`, SpriteKind.Enemy)
    chicken.setFlag(SpriteFlag.GhostThroughWalls, true)
    chicken.setPosition(duck.x + 100, 22)
    currentLevel = 3
    animateDuck()
}
// shuriken hits a boss
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    if (hp <= 0) {
        return
    }
    sprite.destroy()
    hp += -1
    info.changeScoreBy(1)
    otherSprite.startEffect(effects.fire, 100)
    music.playTone(784, music.beat(BeatFraction.Sixteenth))
    if (currentLevel == 2 && hp == 10) {
        // second phase: the dragon gets angry and faster
        dragon.sayText("ROAR!", 1000, false)
        dragon.follow(duck, 45)
    }
    if (hp <= 0) {
        otherSprite.destroy(effects.disintegrate, 500)
        if (currentLevel == 2) {
            clearLevel()
            game.splash("Seal recovered!", "Now cross the flooded gate.")
            startLevelThree()
        } else {
            clearLevel()
            game.splash("Village seal returned", "The village is safe.")
            game.over(true)
        }
    }
})
game.onUpdate(function () {
    if (currentLevel <= 0) {
        return
    }
    // when a throw or hurt animation is done, go back to walking / idle
    if (animUntil > 0 && game.runtime() > animUntil) {
        animUntil = 0
        animateDuck()
    }
    if (currentLevel == 2) {
        dragon.y = 50 + Math.sin(game.runtime() / 700) * 16
        if (duck.x > dragon.x) {
            dragon.setImage(assets.image`dragon facing right`)
        } else {
            dragon.setImage(assets.image`myImage2`)
        }
    }
    if (currentLevel == 3) {
        // the chicken flies above the duck but never touches the water
        chicken.vx = (duck.x - chicken.x) * 0.8
        chicken.y = 22 + Math.sin(game.runtime() / 500) * 4
        if (duck.x > chicken.x) {
            chicken.setImage(assets.image`chicken facing right`)
        } else {
            chicken.setImage(assets.image`Dragon Gate boss`)
        }
    }
})
// level 1: cannons shoot fireworks that arc towards the duck
game.onUpdateInterval(1300, function () {
    if (currentLevel == 1) {
        for (let value of sprites.allOfKind(SpriteKind.Cannon)) {
            if (Math.abs(value.x - duck.x) < 150 && Math.percentChance(70)) {
                firework = sprites.createProjectileFromSprite(img`
                    . . e . e . .
                    . e 4 2 4 e .
                    e 4 2 1 2 4 e
                    . 2 1 1 1 2 .
                    e 4 2 1 2 4 e
                    . e 4 2 4 e .
                    . . e . e . .
                    `, value, (duck.x - value.x) * 0.8 + randint(-15, 15), -130)
                firework.ay = 220
                firework.setKind(SpriteKind.Fire)
                firework.setFlag(SpriteFlag.AutoDestroy, false)
                firework.setFlag(SpriteFlag.DestroyOnWall, true)
                firework.lifespan = 3000
            }
        }
    }
})
// level 2: dragon fire / level 3: chicken drops eggs
game.onUpdateInterval(1400, function () {
    if (currentLevel == 2 && hp > 0) {
        fireSpeed = -75
        if (duck.x > dragon.x) {
            fireSpeed = 75
        }
        fire = sprites.createProjectileFromSprite(img`
            . . 2 4 2 . . .
            . 2 4 5 4 2 . .
            2 4 5 5 5 4 2 .
            . 2 4 5 4 2 . .
            . . 2 4 2 . . .
            `, dragon, fireSpeed, 0)
        fire.setKind(SpriteKind.Fire)
        fire.setFlag(SpriteFlag.AutoDestroy, false)
        fire.setFlag(SpriteFlag.DestroyOnWall, true)
        fire.vy = (duck.y - dragon.y) / Math.max(0.5, Math.abs(duck.x - dragon.x) / 75)
        fire.lifespan = 9000
    }
    if (currentLevel == 3 && hp > 0) {
        egg = sprites.createProjectileFromSprite(img`
            . . 1 1 . .
            . 1 1 1 1 .
            1 1 1 1 1 1
            1 1 1 1 1 1
            1 c c 1 c 1
            . 1 c c 1 .
            . . 1 1 . .
            `, chicken, 0, 30)
        egg.ay = 150
        egg.setKind(SpriteKind.Fire)
        egg.setFlag(SpriteFlag.DestroyOnWall, true)
    }
})
let egg: Sprite = null
let fire: Sprite = null
let fireSpeed = 0
let firework: Sprite = null
let chicken: Sprite = null
let dragon: Sprite = null
let hp = 0
let gate: Sprite = null
let cannon: Sprite = null
let checkpoint: tiles.Location = null
let animUntil = 0
let hurtUntil = 0
let star: Sprite = null
let lastShot = 0
let facing = 0
let duck: Sprite = null
let panel: Image = null
let title: Image = null
let titleSelection = 0
let menuPage = 0
let currentLevel = 0
let soundOn = false
soundOn = true
browserEvents.setCursorVisible(true)
showTitle()
