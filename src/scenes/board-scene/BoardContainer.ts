import { GameConstants } from "../../GameConstants";

export class BoardContainer extends Phaser.GameObjects.Container {

    public static readonly BOARD_WIDTH = 720;
    public static readonly BOARD_HEIGHT = 900;

    constructor(scene: Phaser.Scene) {
        
        super(scene);

        this.x = GameConstants.GAME_WIDTH / 2;
        this.y = GameConstants.GAME_HEIGHT / 2;

        const background = new Phaser.GameObjects.Graphics(this.scene);
        background.fillStyle(0xFFFFFF, .075);
        background.fillRect(-BoardContainer.BOARD_WIDTH / 2, -BoardContainer.BOARD_HEIGHT / 2, BoardContainer.BOARD_WIDTH, BoardContainer.BOARD_HEIGHT);
        this.add(background);
    }
}
