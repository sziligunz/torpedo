import { Application, Texture, TilingSprite, Container, Sprite, FederatedPointerEvent } from 'pixi.js';

export class MainSceneConfig {
    public tilePngPath = 'assets/tile_water.png'
    public tilePngSize = 256
    public tileNumber = 6
    public tileScale  = 0.5
}

export class MainScene extends Container {

    private bottomWaterTiles: TilingSprite

    constructor(app: Application, config: MainSceneConfig) {
        super()

        const waterTileTexture = Texture.from(config.tilePngPath)
        const dimension = config.tilePngSize * config.tileNumber * config.tileScale
        this.bottomWaterTiles = new TilingSprite(waterTileTexture, dimension, dimension)
        this.bottomWaterTiles.tileScale.set(config.tileScale, config.tileScale)
        this.bottomWaterTiles.eventMode = 'static'

        this.bottomWaterTiles.addEventListener('click', e => console.log(e))

        app.stage.addChild(this.bottomWaterTiles)

        // let elapsed = 0.0;
        // app.ticker.add((delta) => {
        //     elapsed += delta;
        // })
    }

}
