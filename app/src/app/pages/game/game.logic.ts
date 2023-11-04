import { Application, Texture, TilingSprite, Container, Sprite, FederatedPointerEvent} from 'pixi.js';

export class MainScene extends Container {
    
    private bottomWaterTiles: TilingSprite

    constructor(app: Application) {
        super()

        const waterTileTexture = Texture.from('assets/tile_water.png')
        this.bottomWaterTiles = new TilingSprite(waterTileTexture, 256*6*0.5, 256*6*0.5)
        this.bottomWaterTiles.tileScale.set(0.5, 0.5)
        this.bottomWaterTiles.eventMode = 'static'
    
        this.bottomWaterTiles.addEventListener('click', e => console.log(e))

        app.stage.addChild(this.bottomWaterTiles)

        let elapsed = 0.0;
        app.ticker.add((delta) => {
            elapsed += delta;
        })
    }

}
