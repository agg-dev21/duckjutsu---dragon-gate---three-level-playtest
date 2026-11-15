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
            case "level1":return tiles.createTilemap(hex`400008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000a0b0000000000000000000a0000000000000000000000000000000000000000000000000000000000000000000000000000010101000000000000000a00000001010100000000000000010101000000000000000a0c00000000000000000000000a000000000000000000000000000000000000000000000000000001000000000000000000000a000000000000000000000001010101000008000000000000000001010100000000000b000000000000000000000000000900000000000000000000000b000000000900000000000b000101020202020101010101010101010100020202010101010101010101000001010101010101010101010000000101010101010101000000010101010101010102020202020202020202020202020202070202020202020202020202020707020202020202020202020207070702020202020202020707070202020202020202020202020202`, img`
................................................................
................................................................
................................................................
...........................222...........222.......222..........
.....................................2......................2222
...........222............................................222222
2222222222.222222222222..22222222222...22222222...22222222222222
2222222222.222222222222..22222222222...22222222...22222222222222
`, [myTiles.transparency16,myTiles.roof,myTiles.wall,myTiles.plank,myTiles.stone,myTiles.water,myTiles.deepWater,myTiles.spikes,myTiles.start,myTiles.checkpoint,myTiles.coin,myTiles.cannonSpot,myTiles.gate], TileScale.Sixteen);
            case "level 2 dragon arena":
            case "level2":return tiles.createTilemap(hex`280008000400000000000000000000000000000000000000000000000000000000000000000000000000000404000000000000000000000000000000000000000000000000000000000000000000000000000004040000000000000000000000000000000004040404040400000000000000000000000000000000040400000000000000000004040404000000000000000000000000040404040000000000000000000404000000000000000000000000000000000000000000000000000000000000000000000000000004040000000404040400000000000000040000000000000000040000000000000004040404000000040400000000000000000000000000000400000000000000000400000000000000000000000000000404040404040404040404040404040404040404040404040404040404040404040404040404040404`, img`
2......................................2
2......................................2
2................222222................2
2.........2222............2222.........2
2......................................2
2...2222.......2........2.......2222...2
2..............2........2..............2
2222222222222222222222222222222222222222
`, [myTiles.transparency16,myTiles.roof,myTiles.wall,myTiles.plank,myTiles.stone,myTiles.water,myTiles.deepWater,myTiles.spikes,myTiles.start,myTiles.checkpoint,myTiles.coin,myTiles.cannonSpot,myTiles.gate], TileScale.Sixteen);
            case "level 3 flooded gate":
            case "level3":return tiles.createTilemap(hex`28000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000a000000000000000a00000000000000000a0000000000000000000000000003030000000000000303000000000000030300000000000000030300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008000000000000000000090000000000000000000000000000000000090000000000000000000303030303030300000003030303030303000000030303030303000000030303030303000000030306060606060606050505060606060606060505050606060606060505050606060606060505050606`, img`
........................................
........................................
........................................
.......22......22......22.......22......
........................................
........................................
2222222...2222222...222222...222222...22
........................................
`, [myTiles.transparency16,myTiles.roof,myTiles.wall,myTiles.plank,myTiles.stone,myTiles.water,myTiles.deepWater,myTiles.spikes,myTiles.start,myTiles.checkpoint,myTiles.coin,myTiles.cannonSpot,myTiles.gate], TileScale.Sixteen);
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
