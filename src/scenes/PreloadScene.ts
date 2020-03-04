import { GameManager } from "../GameManager";
import { GameConstants } from "../GameConstants";
import { GameVars } from "../GameVars";

export class PreloadScene extends Phaser.Scene {

    public static currentInstance: PreloadScene;

    private progressBar: Phaser.GameObjects.Graphics;
    private scaledItemsContainer: Phaser.GameObjects.Container;

    constructor() {

        super("PreloadScene");

        PreloadScene.currentInstance = this;
    }

    public preload(): void {

        this.composeScene();

        this.loadAssets();
    }

    public create(): void {

        GameManager.onGameAssetsLoaded();
    }
    
    private composeScene(): void {

        const bck = this.add.graphics();
        bck.fillStyle(0xffffff);
        bck.fillRect(0, 0, GameConstants.GAME_WIDTH, GameConstants.GAME_HEIGHT);

        this.scaledItemsContainer = this.add.container(GameConstants.GAME_WIDTH / 2, 560);
        this.scaledItemsContainer.scaleY = GameVars.scaleY;

        const barWidth = 550;
        const barWHeight = 20;
        const borderWidth = 3;

        const preloadBarCapsuleBorder = new Phaser.GameObjects.Graphics(this);
        preloadBarCapsuleBorder.fillStyle(0x015e80);
        preloadBarCapsuleBorder.fillRect(0, 0, barWidth + borderWidth * 2, barWHeight + borderWidth * 2);
        preloadBarCapsuleBorder.x = - barWidth / 2 - borderWidth;
        preloadBarCapsuleBorder.y = -borderWidth;
        this.scaledItemsContainer.add(preloadBarCapsuleBorder); 

        const preloadBarCapsule = new Phaser.GameObjects.Graphics(this);
        preloadBarCapsule.fillStyle(0xc6d6dd);
        preloadBarCapsule.fillRect(0, 0, barWidth, barWHeight );
        preloadBarCapsule.x = - barWidth / 2;
        this.scaledItemsContainer.add(preloadBarCapsule); 

        this.progressBar = new Phaser.GameObjects.Graphics(this);
        this.progressBar.fillStyle(0xff7b56);
        this.progressBar.fillRect(0, 0, barWidth, barWHeight );
        this.progressBar.x = - barWidth / 2;
        this.progressBar.scaleX = 0;
        this.scaledItemsContainer.add(this.progressBar); 
    }

    private loadAssets(): void {

        this.load.atlas("texture_atlas_1", "assets/texture_atlas_1.png", "assets/texture_atlas_1.json");
    
        this.load.on("progress", this.updateLoadedPercentage, this);
    }

    private updateLoadedPercentage(percentageLoaded: number): void {

        if (this.progressBar.scaleX < percentageLoaded) {
            this.progressBar.scaleX = percentageLoaded;
        }
    }
}
