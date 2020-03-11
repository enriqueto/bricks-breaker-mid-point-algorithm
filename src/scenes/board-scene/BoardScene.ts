import { GameConstants } from "../../GameConstants";
import { GameManager } from "../../GameManager";
import { HUD } from "./HUD";
import { GUI } from "./GUI";
import { BricksBreakerEngine } from "../../engine/BricksBreakerEngine";
import { BoardContainer } from "./BoardContainer";
import { Cell } from "./Cell";

export class BoardScene extends Phaser.Scene {

    public static currentInstance: BoardScene;

    private gui: GUI;
    private hud: HUD;
    private boardContainer: BoardContainer;
    
    constructor() {

        super("BoardScene");
        
        BoardScene.currentInstance = this;
    }

    public create(): void {

        GameManager.setCurrentScene(this);

        const bricksBreakerEngine = new BricksBreakerEngine();

        const background = this.add.graphics();
        background.fillGradientStyle(0x235e6e, 0x235e6e, 0x220e29, 0x220e29, 1);
        background.fillRect(0, 0, GameConstants.GAME_WIDTH, GameConstants.GAME_HEIGHT);

        this.boardContainer = new BoardContainer(this);
        this.add.existing(this.boardContainer);

        this.hud = new HUD(this);
        this.add.existing(this.hud);

        this.gui = new GUI(this);
        this.add.existing(this.gui);
    }

    public update(): void {

        let pointer = this.input.activePointer;

        if (pointer.isDown) {

            // pasamos a las coordenadas del board
            const p1 = {x: 0, y: 5 * Cell.CELL_SIZE};
            const p2 = {x: pointer.x - this.boardContainer.x, y: pointer.y - this.boardContainer.y};

            this.boardContainer.drawLine(p1, p2);
        }
    }
} 
