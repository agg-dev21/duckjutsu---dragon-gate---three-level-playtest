// Auto-generated code. Do not edit.
namespace myTiles {
    //% fixedInstance jres blockIdentity=images._tile
    export const transparency16 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const roof = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const wall = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const plank = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const ceiling = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const stone = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const water = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const deepWater = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const spikes = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const start = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const checkpoint = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const coin = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const cannonSpot = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const gate = image.ofBuffer(hex``);

    helpers._registerFactory("tilemap", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "level 1 rooftops":
            case "level1":return tiles.createTilemap(hex`40000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b0000000000000000000000000b0c0000000000000000000b0000000000000000000000000000000000000000000000000000000000000000000000000000010101000000000000000b00000001010100000000000000010101000000000000000b0d00000000000000000000000b000000000000000000000000000000000000000000000000000001000000000000000000000b000000000000000000000001010101000009000000000000000001010100000000000c000000000000000000000000000a00000000000000000000000c000000000a00000000000c0001010101010101010101010101010101080101010101010101010101010808010101010101010101010108080801010101010101010808080101010101010101010101010101`, img`
................................................................
................................................................
................................................................
................................................................
...........................222...........222.......222..........
.....................................2......................2222
...........222............................................222222
2222222222.222222222222..22222222222...22222222...22222222222222
`, [myTiles.transparency16,myTiles.roof,myTiles.wall,myTiles.plank,myTiles.ceiling,myTiles.stone,myTiles.water,myTiles.deepWater,myTiles.spikes,myTiles.start,myTiles.checkpoint,myTiles.coin,myTiles.cannonSpot,myTiles.gate], TileScale.Sixteen);
            case "level 2 dragon arena":
            case "level2":return tiles.createTilemap(hex`280008000500000000000000000000000000000000000000000000000000000000000000000000000000000505000000000000000000000000000000000000000000000000000000000000000000000000000005050000000000000000000000000000000005050505050500000000000000000000000000000000050500000000000000000005050505000000000000000000000000050505050000000000000000000505000000000000000000000000000000000000000000000000000000000000000000000000000005050000000505050500000000000000050000000000000000050000000000000005050505000000050500000000000000000000000000000500000000000000000500000000000000000000000000000505050505050505050505050505050505050505050505050505050505050505050505050505050505`, img`
2......................................2
2......................................2
2................222222................2
2.........2222............2222.........2
2......................................2
2...2222.......2........2.......2222...2
2..............2........2..............2
2222222222222222222222222222222222222222
`, [myTiles.transparency16,myTiles.roof,myTiles.wall,myTiles.plank,myTiles.ceiling,myTiles.stone,myTiles.water,myTiles.deepWater,myTiles.spikes,myTiles.start,myTiles.checkpoint,myTiles.coin,myTiles.cannonSpot,myTiles.gate], TileScale.Sixteen);
            case "level 3 flooded gate":
            case "level3":return tiles.createTilemap(hex`2800080004040404040404040404040404040404040404040404040404040404040404040404040404040404000009000000000004040400000000000000040400000000000000000404040000000000000000000000000000000000000400000000000000000000000000000000000000040000000000000000000000000000000b00000000000000000b00000000000000000b000000000000000000000b000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000`, img`
2222222222222222222222222222222222222222
........222.......22........222.........
.........2...................2..........
........................................
........................................
........................................
........................................
........................................
`, [myTiles.transparency16,myTiles.roof,myTiles.wall,myTiles.plank,myTiles.ceiling,myTiles.stone,myTiles.water,myTiles.deepWater,myTiles.spikes,myTiles.start,myTiles.checkpoint,myTiles.coin,myTiles.cannonSpot,myTiles.gate], TileScale.Sixteen);
        }
        return null;
    })

    helpers._registerFactory("tile", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "transparency16":return transparency16;
            case "roof":
            case "roof":return roof;
            case "wall":
            case "wall":return wall;
            case "plank":
            case "plank":return plank;
            case "ceiling":
            case "ceiling":return ceiling;
            case "stone":
            case "stone":return stone;
            case "water":
            case "water":return water;
            case "deep water":
            case "deepWater":return deepWater;
            case "spikes":
            case "spikes":return spikes;
            case "start":
            case "start":return start;
            case "checkpoint":
            case "checkpoint":return checkpoint;
            case "coin":
            case "coin":return coin;
            case "cannon spot":
            case "cannonSpot":return cannonSpot;
            case "gate":
            case "gate":return gate;
        }
        return null;
    })

}
// Auto-generated code. Do not edit.
