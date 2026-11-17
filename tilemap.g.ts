// Auto-generated code. Do not edit.
namespace myTiles {
    //% fixedInstance jres blockIdentity=images._tile
    export const transparency16 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const stone = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const ceiling = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const coin = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const cannonSpot = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const gate = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const roof = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile1 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const spikes = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile2 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile3 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile4 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile5 = image.ofBuffer(hex``);

    helpers._registerFactory("tilemap", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "level 1 rooftops":
            case "level1":return tiles.createTilemap(hex`400008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000020300000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000005050500000000000000020000000505050000000000000005050500000000000000020400000000000000000000000200000000000000000000000000000000000000000000000000000500000000000000000000020000000000000000000000050505050000000000000000000000050505000000000003000000000000000000000000000000000000000000000000000300000000000000000000030005050505050505050505050505050505010505050505050505050505050101050505050505050505050501010105050505050505050101010505050505050505050505050505`, img`
................................................................
................................................................
................................................................
................................................................
...........................222...........222.......222..........
.....................................2......................2222
...........222............................................222222
2222222222222222222222222222222222222222222222222222222222222222
`, [myTiles.transparency16,myTiles.spikes,myTiles.coin,myTiles.cannonSpot,myTiles.gate,myTiles.tile1], TileScale.Sixteen);
            case "level 2 dragon arena":
            case "level2":return tiles.createTilemap(hex`280008000100000000000000000000000000000000000000000000000000000000000000000000000000000101000000000000000000000000000000000000000000000000000000000000000000000000000001010000010101010101000000000101010101010000010101010101000000000101010101010000010100000000000000000000000000000000000000000000000000000000000000000000000000000101000000000000000000000000000000000000000000000000000000000000000000000000000001010101000000000000000000000000000000000000000000000000000000000000000000000101010101010000000000000000000000000000000000000000000000000000000000000000000001010101010101010101010101010101010101010101010101010101010101010101010101010101010101`, img`
2......................................2
2......................................2
2..222222....222222..222222....222222..2
2......................................2
2......................................2
222..................................222
222..................................222
2222222222222222222222222222222222222222
`, [myTiles.transparency16,myTiles.tile5], TileScale.Sixteen);
            case "level 3 flooded gate":
            case "level3":return tiles.createTilemap(hex`280008000203020302030203020302030203020302030203020302030203020302030203020302030203020300000000000000000202030000000000000002030000000000000000020303000000000000000000000000000000000000020000000000000000000000000000000000000002000000000000000000000000000000010000000000000000010000000000000000010000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000`, img`
2222222222222222222222222222222222222222
........222.......22........222.........
.........2...................2..........
........................................
........................................
........................................
........................................
........................................
`, [myTiles.transparency16,myTiles.coin,myTiles.tile2,myTiles.tile4], TileScale.Sixteen);
        }
        return null;
    })

    helpers._registerFactory("tile", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "transparency16":return transparency16;
            case "stone0":
            case "stone":return stone;
            case "ceiling0":
            case "ceiling":return ceiling;
            case "coin0":
            case "coin":return coin;
            case "cannon spot":
            case "cannonSpot":return cannonSpot;
            case "gate0":
            case "gate":return gate;
            case "lvl1tile1":
            case "roof":return roof;
            case "lvl1tile0":
            case "tile1":return tile1;
            case "spikes0":
            case "spikes":return spikes;
            case "lvl3 tile 3":
            case "tile2":return tile2;
            case "lvl3 tile 0":
            case "tile3":return tile3;
            case "lvl3 tile 4":
            case "tile4":return tile4;
            case "lvl2 tile":
            case "tile5":return tile5;
        }
        return null;
    })

}
// Auto-generated code. Do not edit.
