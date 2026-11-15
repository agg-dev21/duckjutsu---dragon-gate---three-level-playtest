namespace SpriteKind {
    export const Fire = SpriteKind.create()
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (currentLevel == 0) {
        moveTitleSelection(-1)
    } else {
        jump()
    }
})
function moveTitleSelection (direction: number) {
    if (currentLevel == 0 && menuPage == 0) {
        titleSelection = (titleSelection + direction + 3) % 3
        drawTitle()
    }
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (currentLevel == 2) {
        shoot()
    } else if (menuPage != 0) {
        showTitle()
    }
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
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!(duck)) {
        return
    }
    animation.runImageAnimation(
    duck,
    [img`
        . . . . . . . . . . . . . . . . 
        . . . . . b b b b b b . . d e . 
        . . . . d d d e e e e 5 d e . . 
        . . . b 6 1 1 1 1 6 6 5 5 . . . 
        . . . b 6 1 f b 1 6 6 6 e e . . 
        . 2 c b 6 1 f f 1 6 6 8 b e e . 
        . c c b 6 1 1 1 1 6 8 8 b . . . 
        . . . . b 6 6 6 6 8 8 b . . . . 
        . . . . . d d e 5 5 5 . . . . . 
        . . . . b d 9 9 e e e 5 . . . . 
        . . . . b 6 9 9 9 e e 5 . . . . 
        . . . . b 6 6 e 9 e e 5 . . . . 
        . . . . b b b 6 e e e e 5 . . . 
        . . . . b 6 8 b b e e e 5 . . . 
        . . . . b 6 6 b b b 6 b . . . . 
        . . . . . b b b . b b b . . . . 
        `,img`
        . . . . . . . . . . . . . . . . 
        . . . . . b b b b b b . . . e . 
        . . . . d d d e e e e 5 3 3 e . 
        . . . b 6 1 1 1 1 6 6 5 5 e . . 
        . . . b 6 1 f b 1 6 6 6 e e e . 
        . 2 c b 6 1 f f 1 6 6 8 b . e . 
        . c c b 6 1 1 1 1 6 8 8 b . . . 
        . . . . b 6 6 6 6 8 8 b . . . . 
        . . . . . d d e 5 5 5 . . . . . 
        . . . . b d 9 9 e e e 5 . . . . 
        . . . . b 6 9 9 9 e e 5 . . . . 
        . . . . b 6 6 e 9 e e e 5 . . . 
        . . . . b b b 6 6 6 e e e 5 . . 
        . . b b 6 8 8 b b 6 e e e 5 . . 
        . . b 6 6 6 b b b 6 6 6 b . . . 
        . . . b b b . . . b b b . . . . 
        `,img`
        . . . . . . . . . . . . . . . . 
        . . . . . b b b b b b . . d e . 
        . . . . d d d e e e e 5 d e . . 
        . . . b 6 1 1 1 1 6 6 5 5 . . . 
        . . . b 6 1 f b 1 6 6 6 e e . . 
        . 2 c b 6 1 f f 1 6 6 8 b e e . 
        . c c b 6 1 1 1 1 6 8 8 b . . . 
        . . . . b 6 6 6 6 8 8 b . . . . 
        . . . . . d d e 5 5 5 . . . . . 
        . . . . b d 9 9 e e e 5 . . . . 
        . . . . b 6 9 9 9 e e 5 . . . . 
        . . . . b 6 6 e 9 e e 5 . . . . 
        . . . . b b b 6 e e e e 5 . . . 
        . . . . b 6 8 b b e e e 5 . . . 
        . . . . b 6 6 b b b 6 b . . . . 
        . . . . . b b b . b b b . . . . 
        `,img`
        . . . . . . . . . . . . . . . . 
        . . . . . b b b b b b . . . e . 
        . . . . d d d e e e e 5 3 3 e . 
        . . . b 6 1 1 1 1 6 6 5 5 e . . 
        . . . b 6 1 f b 1 6 6 6 5 5 . . 
        . 2 c b 6 1 f f 1 6 6 8 b e e . 
        . c c b 6 1 1 1 1 6 8 8 b . . . 
        . . . . b 6 6 6 6 8 8 b . . . . 
        . . . . . d d e 5 5 5 . . . . . 
        . . . . b d 9 9 e e e 5 . . . . 
        . . . . b 6 9 9 9 e e 5 5 . . . 
        . . . . b 6 6 6 9 e e e 5 5 . . 
        . . . . b b b 6 6 e e e e 5 . . 
        . . . . b 8 b 6 6 6 b e e 5 . . 
        . . . . b 6 6 b b 6 6 b . . . . 
        . . . . . b b b b b b b . . . . 
        `],
    100,
    true
    )
})
function toggleSound () {
    soundOn = !(soundOn)
    music.setVolume(soundOn ? 40 : 0)
    drawMenuPage()
}
function selectTitleOption (option: number) {
    if (option == 0) {
        startFirstPlayableLevel()
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
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!(duck)) {
        return
    }
    animation.runImageAnimation(
    duck,
    [img`
        . . . . . . . . . . . . . . . . 
        . e d . . b b b b b b . . . . . 
        . . e d 5 e e e e d d d . . . . 
        . . . 5 5 6 6 1 1 1 1 6 b . . . 
        . . e e 6 6 6 1 b f 1 6 b . . . 
        . e e b 8 6 6 1 f f 1 6 b c 2 . 
        . . . b 8 8 6 1 1 1 1 6 b c c . 
        . . . . b 8 8 6 6 6 6 b . . . . 
        . . . . . 5 5 5 e d d . . . . . 
        . . . . 5 e e e 9 9 d b . . . . 
        . . . . 5 e e 9 9 9 6 b . . . . 
        . . . . 5 e e 9 e 6 6 b . . . . 
        . . . 5 e e e e 6 b b b . . . . 
        . . . 5 e e e b b 8 6 b . . . . 
        . . . . b 6 b b b 6 6 b . . . . 
        . . . . b b b . b b b . . . . . 
        `,img`
        . . . . . . . . . . . . . . . . 
        . e . . . b b b b b b . . . . . 
        . e 3 3 5 e e e e d d d . . . . 
        . . e 5 5 6 6 1 1 1 1 6 b . . . 
        . e e e 6 6 6 1 b f 1 6 b . . . 
        . e . b 8 6 6 1 f f 1 6 b c 2 . 
        . . . b 8 8 6 1 1 1 1 6 b c c . 
        . . . . b 8 8 6 6 6 6 b . . . . 
        . . . . . 5 5 5 e d d . . . . . 
        . . . . 5 e e e 9 9 d b . . . . 
        . . . . 5 e e 9 9 9 6 b . . . . 
        . . . 5 e e e 9 e 6 6 b . . . . 
        . . 5 e e e 6 6 6 b b b . . . . 
        . . 5 e e e 6 b b 8 8 6 b b . . 
        . . . b 6 6 6 b b b 6 6 6 b . . 
        . . . . b b b . . . b b b . . . 
        `,img`
        . . . . . . . . . . . . . . . . 
        . e d . . b b b b b b . . . . . 
        . . e d 5 e e e e d d d . . . . 
        . . . 5 5 6 6 1 1 1 1 6 b . . . 
        . . e e 6 6 6 1 b f 1 6 b . . . 
        . e e b 8 6 6 1 f f 1 6 b c 2 . 
        . . . b 8 8 6 1 1 1 1 6 b c c . 
        . . . . b 8 8 6 6 6 6 b . . . . 
        . . . . . 5 5 5 e d d . . . . . 
        . . . . 5 e e e 9 9 d b . . . . 
        . . . . 5 e e 9 9 9 6 b . . . . 
        . . . . 5 e e 9 e 6 6 b . . . . 
        . . . 5 e e e e 6 b b b . . . . 
        . . . 5 e e e b b 8 6 b . . . . 
        . . . . b 6 b b b 6 6 b . . . . 
        . . . . b b b . b b b . . . . . 
        `,img`
        . . . . . . . . . . . . . . . . 
        . e . . . b b b b b b . . . . . 
        . e 3 3 5 e e e e d d d . . . . 
        . . e 5 5 6 6 1 1 1 1 6 b . . . 
        . . 5 5 6 6 6 1 b f 1 6 b . . . 
        . e e b 8 6 6 1 f f 1 6 b c 2 . 
        . . . b 8 8 6 1 1 1 1 6 b c c . 
        . . . . b 8 8 6 6 6 6 b . . . . 
        . . . . . 5 5 5 e d d . . . . . 
        . . . . 5 e e e 9 9 d b . . . . 
        . . . 5 5 e e 9 9 9 6 b . . . . 
        . . 5 5 e e e 9 6 6 6 b . . . . 
        . . 5 e e e e 6 6 b b b . . . . 
        . . 5 e e b 6 6 6 b 8 b . . . . 
        . . . . b 6 6 b b 6 6 b . . . . 
        . . . . b b b b b b b . . . . . 
        `],
    100,
    true
    )
})
function shoot () {
    if (game.runtime() - lastShot >= 240) {
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
        star.setFlag(SpriteFlag.AutoDestroy, false)
        star.setFlag(SpriteFlag.DestroyOnWall, true)
        star.lifespan = 4500
    }
}
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    moveTitleSelection(1)
})
function jump () {
    if (duck && duck.isHittingTile(CollisionDirection.Bottom)) {
        duck.vy = -220
    }
}
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (star, boss) {
    if (currentLevel != 2 || hp <= 0) {
        return
    }
    star.destroy()
    hp += 0 - 1
    info.changeScoreBy(1)
    boss.startEffect(effects.fire, 100)
    if (hp <= 0) {
        boss.destroy(effects.disintegrate, 500)
        startFloodedGate()
    } else if (soundOn) {
        music.playTone(784, 60)
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
sprites.onOverlap(SpriteKind.Player, SpriteKind.Fire, function (p, f) {
    f.destroy()
    hurt()
})
function hurt () {
    if (game.runtime() >= hurtUntil) {
        hurtUntil = game.runtime() + 1200
        info.changeLifeBy(-1)
        duck.startEffect(effects.spray, 200)
    }
}
function drawMenuPage () {
    panel = assets.image`Duckjutsu title screen`.clone()
    panel.fillRect(18, 25, 124, 78, 13)
    panel.drawRect(18, 25, 124, 78, 12)
    if (menuPage == 1) {
        panel.print("SETTINGS", 55, 31, 15)
panel.drawRect(27, 43, 106, 16, 12)
        panel.print(soundOn ? "Sound: On" : "Sound: Off", 50, 48, 15)
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
function startLevelTwo () {
    game.splash("Level 2: Dragon Gate", "Press B to throw a shuriken")
    currentLevel = 2
    image.setPalette(hex`000000FFFFFFFFF285FAA27DFF81354D2412249CA363507E9096BAD3602BD8682C024A62FFE69BEC5F4CC91F26000000`)
scroller.setBackgroundScrollOffset(0, 0, scroller.BackgroundLayer.Layer4)
    hp = 20
    facing = 1
    scene.setBackgroundImage(img`
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333eeee33333333333333333333333333333333333333333333333333333
        33333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333eeeeeeeee33333333333333333333333333333333333333333333333333333
        333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333eeeeeeeeeeeeee33333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333eeeeee4444eeeeee33333333333333333333333333eee333333333333333333333
        333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333eeeee444444eeeeeee33333333333333333333333eeeeeee3333333333e33333333
        333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333eee4444444444eeeeee3333333333333333333333eeebbbe333333333eeee33333e
        33333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333eeee444444444444eeeee33333333333333333333eebbebbee3333333eeebeee3eee
        3333333333333333333333333333333333333333333333333333333333333ee33333333333333333333333333333eee44444444444444eeee3333333333333333333ebbbebebeeee333eebbbbbeeeebe
        333333333333333333333333333333333333333333333333333333333333eeee3333333333333333333333333333ee444444444444444eeeee33333333333333333eebbeebbbbeee33eebbbbbbbbbbbe
        333333333333333333333333333333333333333333333333333333333333eeeee33333333333333333333333333ee44444444444444444eeee3333333333333333eeebbebbbeeebee3ebbbebbbbbeeee
        33333333333333333333333333333333333333333333333333333333333eeeeee33333333333333333333333eeeee4ee44444444444444eeee333333333333333eeebeebbbbeeebbeeebbebbbeeeecee
        33333333333333333333333333333333333333333333333333333333333eeebee3333333333333333333333eeeeeee44444444444444444eee33333333333333eeebbbbebbbbeeebbeeebbbbeeeecccc
        333333333333333333333333333333333333e3333333333333333333333eebbeee3333333333333333333eeeeeee4444444444444444444eeee333333333333eeebbbbebbbbbebebbeeebbbeeccccccc
        33333333333333333333333333333333333eeee3333333333333333333eebbbbee333333333333333333eeeeeee44444444444444444444eee3333333333333eeebbbbebbbbbbbeebbbbeeeeccccccce
        333333333333333333333333333333333eeeeeee33333333333333333eeebbebeeee33333333333333eeeeeeee4444444444444444444444eee33333333333eeebbbbbebbbbbbbbebeeeeeccccccceee
        33333333333333333eee333333333333eeeeeeeee333333333333333eeebbeebbeee3333333333333eeeeeee4444444444444444444444444eee3333333333eebbbbbebbebbbbbbeeeeeeccccccceccc
        333333333333333eeeeee3333333333eeeeccceee33333333333333eeeebeebbbeeee333333333333eeee4444444444444444444444444444eee33333333eeeebbbbebbbbebbbbeeeeeccccccccccccc
        333333333333333eeeeeee333333333eeecccccee33333333333333eeebbeebbbbeeee33333333e3eee4444444444444444444444444444444eee3333333eebebbbbebbbbebbbeeecccccccccccccccc
        33333333333333eeeeebeeee3333333eecccceeee3333333333333eeebbbeebbbbbeeee333333eeeee44444444444444444444444444444444eee3333333ebbbbbbebbbbbebeeeccceccccccccccceec
        3333333333333eeeeeebbeee3333333ecccccccee33333333333eeeebbbeebbbbbebeee333333eee444444444444e444444444444444444444eee33333eebbbbbbebbbbbbbeeeccceeecccccccceeecc
        333333333333eeeeebbebbbee33333eecccccccee33333333333eeeebbbbebbbbbbbbee33333eee444444444444e444444444444444e4444444ee3333eeebbbbbbebbbbbbbeeccceccccccceeeeccccc
        3333333333eeeeeeeebebbbbee333eecccccccceee3333333333eeebbebebbbbbbbbbbee333eeee44444444444e4444444444444444e4444444ee3333eebbebbbebbbbbbbeecceecccccceeeeccccccc
        3333333333eeeeeeeebbebbbeee3eeeccccceeceee333333333eeebbebbebbbbbbbbbbee33eeee4444444444ee444444444444444ee444444444ee33eebbbebbbebbbbbbbecceccccccceececcccccce
        333333333eeeeeebbebbebbbbee3eecccccceeceeee33333333eeebbebebbbbbbebbbeeeeeeee44444e4444ee444444444444444e444444444444e33eebbbbbbbebbbbbbeecceeccccceeeecccccccce
        ee33333eeeeeeebbbebbebbbbbeeeecccccceecceee3333333eeebbbbebbbbbbbebbbbbbbeeee4444ee4eee4444444444444444e4444444444444eeeeebbbbbbebbbbbbbeccececccceeecccccccccec
        fee333eeeeeeebbbbebbebbbbbbeeccccccceeccceee333333eeebbbbbbbbbbbbeebbbbbbeee4444eefeee4444444444444444e44444444444444eeeeebebbbbebbbbbbecceecccccceecccccccccecc
        fffee3eeeeeeebbbebbbebbbbbeeccccccccecccccee333333eebbbbbbbbebbbbeebbbbbbbee44eeeee4444444444444444eee444444444444444eeeebbbbbbbebbbbbeeccecccccceeccccccccceccc
        2ffffeeeeeebbbbbebbbebbbbbeecccccccceccccccee33333eebbbbbbbbebbbbebbbbbbbbee4eee4e444444444444444eee44444444444444444eeeebebbbbbebbbbeecceeccccceeecccccceeecccc
        22fffffeeebbbbbebbbbeebbbeeccccecccceecccccceee333ebbbbbbbbbebbbbebbbbbbbbeeefe4444444444444444eee44444444444444444444eebbebbbbbebbbbeeceeccccceecccccccccccccee
        2222ffffebbbbeebbbbbbbbbbeecccceecccceeccccceeee3eebbbbbbbbbbebbbebbbbbbbeeeee444444444444444ee44444444444444444444444ebbbebbbbebbbbeeeecccccceccccccccccceeeeef
        22222ffffbbbbebbbbbbbbbbeeecccccecccccecccccceeeeeebbbbbbbbbbebbbebbbbbbbeee444444444444444444444444444444444444444444ebbbbbbbbebbbbeeeeccccceecccccccccceeffff2
        2222222fffbbbebbbbbbbbeeececcccceccccccecccccceeeeebbbbbbbbbbebbbbbbbbbbeeee444444444444444444444444444444444444444444eebbbbbbbebbbeeeccccccceccccccccceffff2222
        2222222fffbbbbbbbbbbbbeeececccccceccccceecccccceeeebbbbbbbbbbebbbbbbbbbeeee4444444444444444444444444444444444444444444eebbbbbbebbbeeeccccccccecccccccceff2222222
        2222222ffffbbbbebbbbbeeecceccccccecccccceecccccceeeebbbbbbbbbbebbbbbbebee44444444444444444444444444444444444444444444eeebbbbbbbbbeeecccccccceecccccccff222222222
        2222222ffffbbbbebebbeeecceccccccceccccccccecccccceeeebbbbbbbbbeebbbbbebee44444444444444444444444444444444444444444444eeebbbbbbbbeeeccccccccceeccccccffeff2222222
        22222222fffbbbebbbbeeecceeccccccceccccccccceeeccccceeeebbbbbbbbebbbbbbbee44444444444444444444444444444444444444444444eeebbbbbbbbeeeccccccccceecccccceff222222222
        22222222fffbbbebbbeeeeceeeccccccceecccccccccceeccccccceebbbbbbbbebbbebeee44444444444444444444444444444444444444444444eeebbbbbbbbeeccccccccccecccccccef2222222222
        222222222fffbebbbeeeecceeccccccccceccccccccccceeecccccccebbbbbbbebbbebeee444444444444444444444444444444444444444444444eebbbbbbbeecccccccccceecccccccf22222222222
        222222222fffebbbbeeeeceeccccccccccecccccccccccceeccccccceebbbbbebbbbbbeee444444444444444444444444444444444444444444444ebbbbbbbeeeccccccccceeccccccff222222222222
        222222222fffbbbbeecccceccccccccccceccccccccccccceeccccccceebbbbebbbbbeee444444444444444444444444444444444444444444444eebbbbbbeeecccccccccceccccccff2222222222222
        2222222222ffbbbbecccceeccccccccccecccccccccccccccecccccccceebbbbbbbbbee4444444444444444444444444444444444444444444444eebbbbbbeeccccccccceeeccccccff2222222222222
        2222222222ffbbbecccceeecccccccccecccccccccccccccceeccccccceeebbbbbbbbee4444444444444444444444444444444444444444444444eebbbbbeeeccccccccececccccceff222222222ff22
        22222222222febeecccececcccccccccecccccccccccccccccecccccccceeebbbbbebee4444444444444444444444444444444444444444444444eebbbbeeececcccccccecccccccff2222222222ff22
        22222222222fefeccceccccccccccccecccccccccccccccccceeccccccceeebbbbbbbee444444444444444444444444444444444ee44444444444eebeeeeececcccccccccccccccfff2222222222f222
        222222222222feeccccccccccccccccccccccccceccccccccceecccccccceeebbbbeeee4444444444444444444444444444444ee4444444444444eeeeeeeececcccccccccccccceff22222222222ff22
        2222222222ffffefffccccccccccccccccccccccecccccccccceecccccccccebbbbbeee44444444444444444444444444444eeee4444444444444eeeeeeceecccccccccceeeeccff222222222222fef2
        222222222ffffffffefffcfccccccccccccccccceccccccccccceccccccccceebbbbeee4444444444444444444444444444efee44444444444444eeeeeeceeccccccccceeecccfff22222222222feef2
        222222222222222fffffffffcccccccccccccccceccccccccccceccccccccceeebbeeee44444444444e444444444444444efe4444444444444444e4eeeeceeccccccceeecccccff222222222222ffef2
        22222222222222222222222fefcccccccccccccceeccccccccccecccccccccceebbeee4444444ee4444444444444444444ee4444444444444444ee4eeeececcccccceeccccccff2222222222222ffef2
        222222222222222222222222fffcccccccccccccceecccccccccecccccccccceeebeee4444eee44444444444444444444ee44444444444444444ee4eeeeecccccceeeccccccfff22222222222222fef2
        2222222222222222222222222fffcccccccccccccceccccccccceccccecccccceeeeee44eee444444444444444444444ee44444444444444444ee444eeeeccccccccccccccfff222222222222222ff22
        22222222222222222222222222fffccccccccccccccecccccccceccccecccccceeeeeeeeee4444444444444444444444e444444444444444444ee444eeeeeccccccccccccfff2222222222222222ff22
        222222222222222222222222222fffccccccccccccceeccccccceccceccccccceeeeeeee44444444444444444444444e4444444444444444444e44444eeeeeccccccccccffff2222222222222222f222
        222222222222222222222222222ffffccccccccccccceccccccccccecccccccceeeeee4444444444444444444444444e444444444444444444ee444444eeeeecccccccccfff2222222222222222f2222
        2222222222222222222222222222fffeecccccccccccecccccccccecccccccceeeee44444444444444444444444444ee44444444444444444eee444444eeeeeeeccccccfff2222222222222222f22222
        2222f222222222222222222222222fffeccccccccccceccccccccceccccccceeeeee44444444444444444444444444ee44444444444444444ee4444444eeeeeeecccccfff222222222222222ff222222
        22222f222222222222222222222222ffccccccccccccecccccccceecccccceeeeee444444444444444444444444444e44444444444444444ee444444444eeeeeeecceeff222222222222222ff2222222
        22222f2222222222222222222222222ffcccccccccccceccccccceccccccceeeee4444444444444444444444444444e444444444444444eee4444444444eeeeeeeeefff222222222222222222f222222
        222222ff222222222222222222222222fccccccccccccecccccccecccccceeeeeee444444444444444444444444444e444444444444444ee4444444444444ee4444eff22222222222222222ff2222222
        2222222fff2222222222222222222222ffcccccccccccccccccccecccccceeeeee4444444444444444444444444444e444444444444444e44444444444444ee4444eff2222222222222222f222222222
        222222222ffff22222222222222222222ffccccccccccccccccceccccccceeeeee4444444444444444444444444444e444444444444444444444444444444444444e22222222222222222f2222222222
        222222222222fffffff222222222222222fcccccccccccecccccccccccceeeee44444444444444444444444444444ee444444444444444444444444ee444efffffffffff222222222222f22222222222
        2222222222222222fff222222222222222ffcccccccccccccccccccccceeeee444444444444444444444444444444ee444444444444444444444eefffffffffffffffff222222222222f222222222222
        222222222222222222ff222222222222222ffccccccccccccccccccccceeee4444444444444444444444444444444ee4444444444444444444effffffffeeeeeffff22222222222222f2222222222222
        2222222222222222222ff22222222222222ffffcccccccccccccccccceeee44444444444444444444444444444444ee4444444444444444eefffffff22222222f2222222222222222f222f2222222222
        22222222222222222222ff22222222222222fffccccccccccccccccceeee44444444444444444444444444444444ee44444444444444444effff22222222222222222222f22222222222f22222222222
        222222222222222222222f222222222222222fffcccccccccccccceeee444444444444444444444444444444444ee44444444444444444ffff222222222222222222222ff22222222222222222222222
        222222222222222222222ff222222222222222fffcccccccccccceeee444444444444444444444444444444444e44444444444444444ffeff2222222222222222222222ff22222222222222222222222
        222222222222222222222fff222222222222222fffcccccccccceeeee4444444444444444444444444444444ee44444444444444444fffff2222222222222222222222ff222222222222222222222222
        2222222222222222222222ff2222222222222222fffccccccceeeeee4444444444444444444444444444444ee44444444444444444fffff2222222222222222222222ff2222222222222222222222222
        222222222222222222222222222222222fffffffffffecccceeeeee4444444444444444444444444444444ee44444444444444444fffff22222222222222222222222f22222222222222222222222222
        2222222222222222222222222222222222fffffffffffffeeeeeeee44444444444444444444444444444eee44444444444444444fffff2222222222222222222222fff22222222222222222222222222
        222222222222222222222222222222222222222222fffffffffeee4444444444444444444444444444ee4e4444444444444444efffff222222222222222222222222ff22222222222222222222222222
        222222222f22222222222222222222222222222222222fffffffeeee4444444444444444444444444e444e444444444444444effff22222222222222222222222fff2222222222222222222222222222
        222222222f22222222222222222222222222222222222222fffffffff44444444444444444444444e444e444444444444444efffef22222222222222222ff2fff2222222222222222222222222222222
        222222222ff22222222222222222222222222222222222222222fffffffe4444444444444444444e4444e444444444444444fffef2222222222222222fffff2222222222222222222222222222222222
        2222222222f22222222222222222222222222222222222222222222ffffff44e44444444444444e4444e44444444444444ffff2f2222222222222222ff22222222222222222222222222222222222222
        2222222222f2222222222222222222222222222222222222222222222ffffff444444444444444e444444444444444444ffff22222fff222222222ff2222222222222222222222222222222222222222
        2222222222f2222222222222222fffffffff222222222222222222222222ffff44444444444444e44444444444444444ffff2222ff22222222222f222222222222222222222222222222222222222222
        22222222222f222222222222fffeffffff2fff22222222222222222222222fffff444444444444444e444444444444fffff22ffff22222222222f2222222222222222222222222222222222222222222
        2222222222ffffffffffffffffff222222222ff222222222222222222222222ffff44444444444444444444444444ffffefffff222222222222f22222222222222222222222222222222222222222222
        2222222222222222fffff22222222222222222ff222222222222222222222222fef444444444444444444444444effffffffff2222222222222222222222222222222222222222222222222222222222
        222222222222222222222222222222222222222ff222222222222222222222222fff444444444444444444444eeffffffff2222222222222222222222222222222222222222222222222222222222222
        222222222222222222222222222222222222222f2222222222222222222222222fff4444444444444444444eeeffff222222222222222222222222222222222222222222222222222222222222222222
        2222222222222222222222222222222222222222222222222222222222222222222f4444444444444444444effff22222222222222222222222222222222222222222222222222222222222222222222
        2222222222222222222222222222222222222222222222222222222222222222222f444444444444444444efff2222222222222222222222222222222222222222222222222222222222222222222222
        2222222222222222222222222222222222222222222222222222222222222222222f44444444444444444eff2222222222222222222222222f2222222222222222222222222222222222222222222222
        2222222222222222222222222222222222222222222222222222222222222222222f4444444444444444efff222222222222222222222222222222222222222222222222222222222222222222222222
        2222222222222222222222222222222222222222222222222222222222222222222f444444444444444effe2222222222222222222222222222222222222222222222222222222222222222222222222
        222222222222222222222222222222222222222222222222222222222222222222fff4444444444444efff22222222222222222222222222222222222222222222222222222222222222222222222222
        222222222222222222222222222222222222222222222222222222222222222222fffeeeeeeeeeeeeeeff222222222222222222222222222222222222222222222222222222222222222222222222222
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd44444242444444ddddd444444444dddddddddddddddddddddddddddddddddddddd444dddddddddddddddddddddd
        ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd2444444222222222244422d224422444444442dd2444ddddddddddddddddddddd444ddd4444444ddddddddddddddddddd
        444ddddddddddddddddddddddddddddddddddddddddd4444444d4444222222222224422222ffff22222222222222422222222222444444444444444d4dddd4444444444444444422224dddddd44ddddd
        444444d4444444444444ddd4ddddd4d4444ddddddd444222222442222222222222222222ffffff22222222222222222222222222222222244444422444444444222222222422222222444444444444dd
        422222222222222222244444444444222442222224422222222222222ffffff22222222feeeefffffffffffffffffffffffffffffffff22222222224444444222222222222222ffff244422222244444
        222222222222222222222222222222222222222222222fffffffffffffeeefff222fffffeeeeffffeeeffffeefeeeeeeeefffeeeeeeeff222222222222222222222fffffffffffeff22222ffffffff22
        2222222222222ffffff22222222ffffffffffffffffffffeeeeeeffeeeeeefeefffffffeeeeefffeeeeffeeeefffffffeeffffeeeeeeefffffffffffff2222ffffffeeeeeeeeffeeef222ffffeeeef22
        2222222222222fffeeeffffffffffeefffeeefeeeeeeeffeeeeeeffeeeeeefeefeeeeefeeeeefeeeeeefeefeeffeeefeefefffeeeeeeeeffeeeeeeeeeff22fffffffeeeeeeefefefeffffffffefeefff
        ffffffff22ffffffeeefeeeeeeeefeeffeeeeffeeeeeeefeeeeeeffffffffffffeeeeefeeeeefeeeeeeffeeeefeeeeeeefeeffeeeeeeeeffeeeeeeeeeefffffeeffffeeffeeeefeeeeeeeefffefeeeef
        efffffff22feeeefeeefeeeeeeeefeeffeeeefffffffffffffffefeeeeeeeeffeefffffffffffffffeefeeeeefeeeeeeefeeefffffeeeeffefeeffeeefffffefeeffffeeeeeeefeeeeeeeeeffeeeeeef
        ffeeeeeffffeeeefeeffeeeeeeeefeeffeeeeeeeeefffeeeeeffefeeeeeeeeefeefeeefeefeeeeeefeefeeeeefeeeeeeffeeefffffffffffffffffefffffffeeeeeffeeeeefeefffffeffffffeeeeeef
        feeeeeeffefeeeeffffffffffffffeeffeeeeeeeeeeefeeeeeefefeeeeeeeeffeefeeefeefeeeeeefeefeeeeefeeefffeeeeffeeeffeeeeeefeeeeffeeeeffeeeeeffeeefefeeffeeefffeefffeeeeef
        ffeeeeeefefeeeeeffeefeeeefeeeeeffffffffffeeefeeeeeefeffffffffffffffeeefeefeeeeeeffffeeeeefeefffeeeeefeeeefeeeeeeeeeeeefeeeeefeffeeeffeeeeffeeffeeeffffffffffefef
        ffeeeeeefefeeeefffeefeeeefeeeeefeeeeeeeefeeeffffffffffeeefeeeefffffeeefffeeeefefffeeeeeeeffffffeeeeffeeeefeeeeeeefeeeeeeeeeefeeeeefffeeeeefeefeeeeeeefffeeffeeef
        ffeeeeeeffffffffffeefeeeefeeeeefeeeeeeeefeeeffeeeeeeefeeefeeeeeefffeeeffffeeefffefeeeeeeeffeeeffffffeeeeefeefffeefeeeeeeeeeefefeeefffeffffefffeeeeeeeffefeeffeef
        ffffffffffeffeeeefeeffffffffffffeeeeeeeefeeeffeeeeeeeeeeefeeeeeeeffeeefeeeffffeeefeeeeeeeffeeefeeeeeeeeeefffeeeffffffffffffffeeeeeffffffffffffeeeeeeeffeeeefffef
        ffffffffffeffeeeefeefeeeeeeeeeffeeeeeeeefeeeffeeeeeeefeeefeeeeeeffeeeefeeefeeeeeefffffffffeeeefeeeeeeeeeefffeeefffffffffffeeeeeefeffffeeefffffeeeeeeefeeeefeffef
        feeeeeeeefeefeeeefeefeeeeeeeeeffeeeeeeeefeeeffeeeeeeefeeeffffffffeeeeffeeefeeeeeeffeeeeeefeeeefeeeeeeeeeefffeeefeeeeeeeefeeeeeefeefffeeeffeeeefefeeeefeeeeeeffef
        feeeeeeeefeefeeeeffefeeeeeeeefffeeeeeeefffffffeeefffffeeeeeeeefffffffffeeefeeeeeefeeeeeeeffeeefeeeeeefffffeeeeffefefeeeeffeeeeeeffffeeeefeeffeeeeeffffeeeeeeffff
        feeeeeeeeffffffffffffffffffffeffffffffffeeeeefeeefeeefeeeeeeeefeeeffeeeeeeffeeeeefeeeeeeffeeeeffffffffffffeeeeffeeeeeeeeffeeeffffeeeeeeefeeeeeffffffffeefeefffff
        feeeeeeeefeeeeefeeeeeefeeeeffeefeeeeeeefeeeeefffffeeefeeeeeeeefeeeffeeeeeeffffffffeefffffeeeeeffeeeeeefeeeeeeeffeefeeeeefffffffeeeeeeeeffeeeefffffefeeeeeeefffef
        feeeeeeeefeeeeefeeeeeefeeeeffeffeeeeeeefeeeeefeeefeeefeeeeeeeefefeffeeeeeefeeeeeeeefffeeeeeeeefeeeeeeefeeeffffffeeeeeeeefeeeffefeeeeeefffffffffeeeeeeeefefeefeef
        ffffffffffffffffeeeeeefeeefffeffeeeeeeefeeeeefeeefefffeeeeeeeeffeeffeeeeeefeeeeeeeffffeeeeeeeefeeeeefffeefffffffeeeeeeeffeeeefeefffeefffeeeefffeeeeeeeeeeeffeeef
        fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffeeeffffffffffffffffffffffffffffffffffffffffffff
        `)
    scene.setBackgroundColor(5)
    tiles.setCurrentTilemap(tilemap`Dragon arena`)
    duck = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . e d . . b b b b b b . . . . . 
        . . e d 5 e e e e d d d . . . . 
        . . . 5 5 6 6 1 1 1 1 6 b . . . 
        . . e e 6 6 6 1 b f 1 6 b . . . 
        . e e b 8 6 6 1 f f 1 6 b c 2 . 
        . . . b 8 8 6 1 1 1 1 6 b c c . 
        . . . . b 8 8 6 6 6 6 b . . . . 
        . . . . . 5 5 5 e d d . . . . . 
        . . . . 5 e e e 9 9 d b . . . . 
        . . . . 5 e e 9 9 9 6 b . . . . 
        . . . . 5 e e 9 e 6 6 b . . . . 
        . . . 5 e e e e 6 b b b . . . . 
        . . . 5 e e e b b 8 6 b . . . . 
        . . . . b 6 b b b 6 6 b . . . . 
        . . . . b b b . b b b . . . . . 
        `, SpriteKind.Player)
    duck.setPosition(35, 104)
    duck.ay = 400
    controller.moveSprite(duck, 80, 0)
    scene.cameraFollowSprite(duck)
    dragon = sprites.create(assets.image`Dragon Gate boss`, SpriteKind.Enemy)
    dragon.setFlag(SpriteFlag.GhostThroughWalls, true)
    dragon.follow(duck, 25)
    dragon.setPosition(570, 72)
    scene.setBackgroundColor(5)
    scene.cameraFollowSprite(duck)
    scroller.scrollBackgroundWithCamera(scroller.CameraScrollMode.OnlyHorizontal, scroller.BackgroundLayer.Layer1)
    scroller.scrollBackgroundWithCamera(scroller.CameraScrollMode.OnlyHorizontal, scroller.BackgroundLayer.Layer2)
    scroller.scrollBackgroundWithCamera(scroller.CameraScrollMode.OnlyHorizontal, scroller.BackgroundLayer.Layer3)
    scroller.setCameraScrollingMultipliers(0.2, 1, scroller.BackgroundLayer.Layer1)
    scroller.setCameraScrollingMultipliers(0.3, 1, scroller.BackgroundLayer.Layer2)
    scroller.setCameraScrollingMultipliers(0.5, 1, scroller.BackgroundLayer.Layer3)
    scroller.setLayerZIndex(scroller.BackgroundLayer.Layer1, -1000)
    scroller.setLayerZIndex(scroller.BackgroundLayer.Layer2, -500)
    scroller.setLayerZIndex(scroller.BackgroundLayer.Layer3, -400)
    scroller.setLayerZIndex(scroller.BackgroundLayer.Layer4, -100)
    animation.runImageAnimation(
    duck,
    [img`
        . . . . . . . . . . . . . . . . 
        . e d . . b b b b b b . . . . . 
        . . e d 5 e e e e d d d . . . . 
        . . . 5 5 6 6 1 1 1 1 6 b . . . 
        . . e e 6 6 6 1 b f 1 6 b . . . 
        . e e b 8 6 6 1 f f 1 6 b c 2 . 
        . . . b 8 8 6 1 1 1 1 6 b c c . 
        . . . . b 8 8 6 6 6 6 b . . . . 
        . . . . . 5 5 5 e d d . . . . . 
        . . . . 5 e e e 9 9 d b . . . . 
        . . . . 5 e e 9 9 9 6 b . . . . 
        . . . . 5 e e 9 e 6 6 b . . . . 
        . . . 5 e e e e 6 b b b . . . . 
        . . . 5 e e e b b 8 6 b . . . . 
        . . . . b 6 b b b 6 6 b . . . . 
        . . . . b b b . b b b . . . . . 
        `,img`
        . . . . . . . . . . . . . . . . 
        . e . . . b b b b b b . . . . . 
        . e 3 3 5 e e e e d d d . . . . 
        . . e 5 5 6 6 1 1 1 1 6 b . . . 
        . e e e 6 6 6 1 b f 1 6 b . . . 
        . e . b 8 6 6 1 f f 1 6 b c 2 . 
        . . . b 8 8 6 1 1 1 1 6 b c c . 
        . . . . b 8 8 6 6 6 6 b . . . . 
        . . . . . 5 5 5 e d d . . . . . 
        . . . . 5 e e e 9 9 d b . . . . 
        . . . . 5 e e 9 9 9 6 b . . . . 
        . . . 5 e e e 9 e 6 6 b . . . . 
        . . 5 e e e 6 6 6 b b b . . . . 
        . . 5 e e e 6 b b 8 8 6 b b . . 
        . . . b 6 6 6 b b b 6 6 6 b . . 
        . . . . b b b . . . b b b . . . 
        `,img`
        . . . . . . . . . . . . . . . . 
        . e d . . b b b b b b . . . . . 
        . . e d 5 e e e e d d d . . . . 
        . . . 5 5 6 6 1 1 1 1 6 b . . . 
        . . e e 6 6 6 1 b f 1 6 b . . . 
        . e e b 8 6 6 1 f f 1 6 b c 2 . 
        . . . b 8 8 6 1 1 1 1 6 b c c . 
        . . . . b 8 8 6 6 6 6 b . . . . 
        . . . . . 5 5 5 e d d . . . . . 
        . . . . 5 e e e 9 9 d b . . . . 
        . . . . 5 e e 9 9 9 6 b . . . . 
        . . . . 5 e e 9 e 6 6 b . . . . 
        . . . 5 e e e e 6 b b b . . . . 
        . . . 5 e e e b b 8 6 b . . . . 
        . . . . b 6 b b b 6 6 b . . . . 
        . . . . b b b . b b b . . . . . 
        `,img`
        . . . . . . . . . . . . . . . . 
        . e . . . b b b b b b . . . . . 
        . e 3 3 5 e e e e d d d . . . . 
        . . e 5 5 6 6 1 1 1 1 6 b . . . 
        . . 5 5 6 6 6 1 b f 1 6 b . . . 
        . e e b 8 6 6 1 f f 1 6 b c 2 . 
        . . . b 8 8 6 1 1 1 1 6 b c c . 
        . . . . b 8 8 6 6 6 6 b . . . . 
        . . . . . 5 5 5 e d d . . . . . 
        . . . . 5 e e e 9 9 d b . . . . 
        . . . 5 5 e e 9 9 9 6 b . . . . 
        . . 5 5 e e e 9 6 6 6 b . . . . 
        . . 5 e e e e 6 6 b b b . . . . 
        . . 5 e e b 6 6 6 b 8 b . . . . 
        . . . . b 6 6 b b 6 6 b . . . . 
        . . . . b b b b b b b . . . . . 
        `],
    100,
    true
    )
    music.setVolume(soundOn ? 40 : 0)
}
function drawTitle () {
    title = assets.image`Duckjutsu title screen`.clone()
    title.drawRect(50, 39 + titleSelection * 18, 62, 17, 12)
    scene.setBackgroundImage(title)
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    hurt()
})
function startFirstPlayableLevel () {
    currentLevel = -1
    browserEvents.setCursorVisible(false)
    game.splash("Duckjutsu: Dragon Gate", "The dragon took our seal.")
    game.splash("Cross the cannon pass", "Beat the dragon. Get it back.")
    game.splash("Level 1: Cannon Pass", "Arrows move. A or Up jumps.")
    info.setLife(5)
    info.setScore(0)
    startCrossing(1)
}
let fire: Sprite = null
let fireSpeed = 0
let title: Image = null
let dragon: Sprite = null
let hurtUntil = 0
let hp = 0
let facing = 0
let star: Sprite = null
let lastShot = 0
let duck: Sprite = null
let titleSelection = 0
let menuPage = 0
let currentLevel = 0
let soundOn = false
let panel: Image = null
soundOn = true
browserEvents.setCursorVisible(true)
showTitle()
game.onUpdate(function () {
    if (currentLevel != 2) {
        return
    }
    if (controller.left.isPressed()) {
        facing = -1
    }
    if (controller.right.isPressed()) {
        facing = 1
    }
    if (hp > 0) {
        dragon.y = 72 + Math.sin(game.runtime() / 700) * 12
    }
})
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
})
