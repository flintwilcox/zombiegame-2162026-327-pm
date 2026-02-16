enum ActionKind {
    Walking,
    Idle,
    Jumping
}
namespace SpriteKind {
    export const hitBox = SpriteKind.create()
    export const trailing = SpriteKind.create()
    export const mouse = SpriteKind.create()
    export const light = SpriteKind.create()
}
function dayNightCycle () {
    color.Brighten.startScreenEffect(dayTime)
    color.pauseUntilFadeDone()
    color.Brighten.startScreenEffect(dayTime)
    color.pauseUntilFadeDone()
    color.Darken.startScreenEffect(dayTime)
    color.pauseUntilFadeDone()
    color.Darken.startScreenEffect(dayTime)
    color.pauseUntilFadeDone()
    dayNightCycle()
}
function interact (direction: string) {
    if (direction == "n") {
        if (mySprite.tileKindAt(TileDirection.Top, assets.tile`myTile2`)) {
            tiles.setTileAt(mySprite.tilemapLocation().getNeighboringLocation(CollisionDirection.Top), assets.tile`myTile3`)
            tiles.setWallAt(mySprite.tilemapLocation().getNeighboringLocation(CollisionDirection.Top), true)
        } else {
            if (mySprite.tileKindAt(TileDirection.Top, assets.tile`myTile3`)) {
                tiles.setTileAt(mySprite.tilemapLocation().getNeighboringLocation(CollisionDirection.Top), assets.tile`myTile2`)
                tiles.setWallAt(mySprite.tilemapLocation().getNeighboringLocation(CollisionDirection.Top), false)
            }
        }
    }
    if (direction == "s") {
        if (mySprite.tileKindAt(TileDirection.Bottom, assets.tile`myTile2`)) {
            tiles.setTileAt(mySprite.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom), assets.tile`myTile3`)
            tiles.setWallAt(mySprite.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom), true)
        } else {
            if (mySprite.tileKindAt(TileDirection.Bottom, assets.tile`myTile3`)) {
                tiles.setTileAt(mySprite.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom), assets.tile`myTile2`)
                tiles.setWallAt(mySprite.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom), false)
            }
        }
    }
    if (direction == "w") {
        if (mySprite.tileKindAt(TileDirection.Left, assets.tile`myTile2`)) {
            tiles.setTileAt(mySprite.tilemapLocation().getNeighboringLocation(CollisionDirection.Left), assets.tile`myTile3`)
            tiles.setWallAt(mySprite.tilemapLocation().getNeighboringLocation(CollisionDirection.Left), true)
        } else {
            if (mySprite.tileKindAt(TileDirection.Left, assets.tile`myTile3`)) {
                tiles.setTileAt(mySprite.tilemapLocation().getNeighboringLocation(CollisionDirection.Left), assets.tile`myTile2`)
                tiles.setWallAt(mySprite.tilemapLocation().getNeighboringLocation(CollisionDirection.Left), false)
            }
        }
    }
    if (direction == "e") {
        if (mySprite.tileKindAt(TileDirection.Right, assets.tile`myTile2`)) {
            tiles.setTileAt(mySprite.tilemapLocation().getNeighboringLocation(CollisionDirection.Right), assets.tile`myTile3`)
            tiles.setWallAt(mySprite.tilemapLocation().getNeighboringLocation(CollisionDirection.Right), true)
        } else {
            if (mySprite.tileKindAt(TileDirection.Right, assets.tile`myTile3`)) {
                tiles.setTileAt(mySprite.tilemapLocation().getNeighboringLocation(CollisionDirection.Right), assets.tile`myTile2`)
                tiles.setWallAt(mySprite.tilemapLocation().getNeighboringLocation(CollisionDirection.Right), false)
            }
        }
    }
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`myTile6`, function (sprite, location) {
    if (sprites.readDataString(sprite, "status") == "burning") {
        if (Math.percentChance(50)) {
            flame = sprites.create(img`
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . 2 . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                `, SpriteKind.light)
            multilights.addLightSource(
            flame,
            10,
            15,
            3
            )
            tiles.placeOnTile(flame, location)
            tiles.setTileAt(location, assets.tile`myTile`)
            timer.background(function () {
                flame.startEffect(effects.fire, 60000)
                timer.after(60100, function () {
                    multilights.removeLightSource(flame)
                    sprites.destroy(flame)
                })
            })
        }
    }
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`myTile7`, function (sprite, location) {
    sprites.setDataString(sprite, "status", "wet")
    effects.clearParticles(sprite)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.light, function (sprite, otherSprite) {
    if (Math.percentChance(10)) {
        sprite.startEffect(effects.fire, 10000)
        timer.background(function () {
            sprites.setDataString(sprite, "status", "burning")
            timer.after(10100, function () {
                sprites.setDataString(sprite, "status", "neutral")
            })
        })
    }
})
sprites.onOverlap(SpriteKind.light, SpriteKind.light, function (sprite, otherSprite) {
    effects.clearParticles(sprite)
    sprites.destroy(sprite)
    multilights.removeLightSource(sprite)
})
browserEvents.Any.onEvent(browserEvents.KeyEvent.Pressed, function () {
    playerRow = mySprite.tilemapLocation().row
    playerColumn = mySprite.tilemapLocation().column
    if (browserEvents.Eight.isPressed() || browserEvents.W.isPressed()) {
        if (interacting == 0) {
            move("n")
        } else {
            interact("n")
        }
    } else {
        if (browserEvents.Two.isPressed() || browserEvents.X.isPressed()) {
            if (interacting == 0) {
                move("s")
            } else {
                interact("s")
            }
        } else {
            if (browserEvents.Four.isPressed() || browserEvents.A.isPressed()) {
                if (interacting == 0) {
                    move("w")
                } else {
                    interact("w")
                }
            } else {
                if (browserEvents.Six.isPressed() || browserEvents.D.isPressed()) {
                    if (interacting == 0) {
                        move("e")
                    } else {
                        interact("e")
                    }
                } else {
                    if (browserEvents.Five.isPressed() || browserEvents.S.isPressed()) {
                    	
                    }
                }
            }
        }
    }
    if (browserEvents.E.isPressed() || browserEvents.Nine.isPressed()) {
        if (interacting == 1) {
            interacting = 0
        } else {
            interacting = 1
        }
    }
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`myTile8`, function (sprite, location) {
    sprites.setDataString(sprite, "status", "soaked")
    effects.clearParticles(sprite)
})
function floor () {
    tiles.setCurrentTilemap(tilemap`level1`)
    multilights.toggleLighting(true)
    for (let trailValue of tiles.getTilesByType(assets.tile`myTile1`)) {
        pHitBox = sprites.create(img`
            f f f f f f f f f f f f f f f f 
            f f f f f f f f f f f f f f f f 
            f f f f f f f f f f f f f f f f 
            f f f f f f f f f f f f f f f f 
            f f f f f f f f f f f f f f f f 
            f f f f f f f f f f f f f f f f 
            f f f f f f f f f f f f f f f f 
            f f f f f f f f f f f f f f f f 
            f f f f f f f f f f f f f f f f 
            f f f f f f f f f f f f f f f f 
            f f f f f f f f f f f f f f f f 
            f f f f f f f f f f f f f f f f 
            f f f f f f f f f f f f f f f f 
            f f f f f f f f f f f f f f f f 
            f f f f f f f f f f f f f f f f 
            f f f f f f f f f f f f f f f f 
            `, SpriteKind.hitBox)
        mySprite = sprites.create(img`
            . . . . . 5 5 5 . . . . . . . . 
            . . . . . 5 5 5 . . . . . . . . 
            . . . . . 5 5 5 . . . . . . . . 
            . . . . . . 5 5 . . . . . . . . 
            . . . . . 5 5 5 5 5 . . . . . . 
            . . . . 5 5 5 5 5 5 5 . . . . . 
            . . . . 5 5 5 5 5 . 5 5 . . . . 
            . . . 5 5 . 5 5 5 . . 5 5 . . . 
            . . 5 5 5 . 5 5 5 . . . 5 5 . . 
            . . 5 5 . 5 5 5 5 5 . . . . . . 
            . . . . . 5 5 5 5 5 . . . . . . 
            . . . . . 5 5 . 5 5 . . . . . . 
            . . . . . 5 5 . 5 5 . . . . . . 
            . . . . . 5 5 . 5 5 . . . . . . 
            . . . . . 5 5 . 5 5 . . . . . . 
            . . . . 5 5 5 . 5 5 5 . . . . . 
            `, SpriteKind.Player)
        tiles.placeOnRandomTile(pHitBox, assets.tile`myTile1`)
        multilights.addLightSource(
        mySprite,
        10,
        50,
        2.5
        )
        pHitBox.setFlag(SpriteFlag.Invisible, true)
        scene.cameraFollowSprite(mySprite)
        tiles.setTileAt(trailValue, assets.tile`myTile`)
        sprites.setDataString(mySprite, "status", "neutral")
    }
    for (let trailValue of tiles.getTilesByType(assets.tile`myTile10`)) {
        flame = sprites.create(img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . 2 . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, SpriteKind.light)
        multilights.addLightSource(
        flame,
        10,
        15,
        3
        )
        tiles.placeOnTile(flame, trailValue)
        flame.startEffect(effects.fire, 120000)
    }
    dayTime = 240000
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`myTile10`, function (sprite, location) {
    if (sprites.readDataString(sprite, "status") == "burning") {
        if (Math.percentChance(30)) {
            flame = sprites.create(img`
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . 2 . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                `, SpriteKind.light)
            multilights.addLightSource(
            flame,
            10,
            15,
            3
            )
            tiles.placeOnTile(flame, location)
            timer.background(function () {
                flame.startEffect(effects.fire, 120000)
                timer.after(60100, function () {
                    multilights.removeLightSource(flame)
                    sprites.destroy(flame)
                })
            })
        }
    }
})
function move (direction: string) {
    if (direction == "n") {
        for (let index = 0; index < 16; index++) {
            pHitBox.y += -1
        }
    }
    if (direction == "s") {
        for (let index = 0; index < 16; index++) {
            pHitBox.y += 1
        }
    }
    if (direction == "w") {
        for (let index = 0; index < 16; index++) {
            pHitBox.x += -1
        }
    }
    if (direction == "e") {
        for (let index = 0; index < 16; index++) {
            pHitBox.x += 1
        }
    }
    trail = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . 3 3 3 3 . . . . . . 
        . . . . . . 3 3 3 3 . . . . . . 
        . . . . . . 3 3 3 3 . . . . . . 
        . . . . . . 3 3 3 3 . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.trailing)
    trail.setPosition(mySprite.x, mySprite.y)
    timer.background(function () {
        for (let trailValue of sprites.allOfKind(SpriteKind.trailing)) {
            timer.throttle("animation", 100, function () {
                animation.runImageAnimation(
                trail,
                [img`
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . 5 5 5 5 . . . . . . 
                    . . . . . . 5 5 5 5 . . . . . . 
                    . . . . . . 5 5 5 5 . . . . . . 
                    . . . . . . 5 5 5 5 . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    `,img`
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . 9 9 9 9 . . . . . . 
                    . . . . . . 9 9 9 9 . . . . . . 
                    . . . . . . 9 9 9 9 . . . . . . 
                    . . . . . . 9 9 9 9 . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    `,img`
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . 3 3 3 3 . . . . . . 
                    . . . . . . 3 3 3 3 . . . . . . 
                    . . . . . . 3 3 3 3 . . . . . . 
                    . . . . . . 3 3 3 3 . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    `,img`
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . 7 7 7 7 . . . . . . 
                    . . . . . . 7 7 7 7 . . . . . . 
                    . . . . . . 7 7 7 7 . . . . . . 
                    . . . . . . 7 7 7 7 . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    `,img`
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    `],
                70,
                false
                )
            })
            timer.debounce("animation", 170, function () {
                sprites.destroy(trail)
            })
        }
    })
}
let trail: Sprite = null
let pHitBox: Sprite = null
let interacting = 0
let playerColumn = 0
let playerRow = 0
let flame: Sprite = null
let mySprite: Sprite = null
let dayTime = 0
floor()
timer.background(function () {
    dayNightCycle()
})
game.onUpdate(function () {
    mySprite.setPosition(pHitBox.x, pHitBox.y)
})
game.onUpdateInterval(500, function () {
    sprites.destroyAllSpritesOfKind(SpriteKind.trailing)
})
