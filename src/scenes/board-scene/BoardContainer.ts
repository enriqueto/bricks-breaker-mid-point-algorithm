import { GameConstants } from "../../GameConstants";
import { Cell } from "./Cell";
import { BoardManager } from "./BoardManager";

export class BoardContainer extends Phaser.GameObjects.Container {

    public static readonly BOARD_WIDTH = 720;
    public static readonly BOARD_HEIGHT = 880;

    private cells: Cell [][];

    constructor(scene: Phaser.Scene) {
        
        super(scene);

        this.x = GameConstants.GAME_WIDTH / 2;
        this.y = GameConstants.GAME_HEIGHT / 2;

        const background = new Phaser.GameObjects.Graphics(this.scene);
        background.fillStyle(0xFFFFFF, .075);
        background.fillRect(-BoardContainer.BOARD_WIDTH / 2, -BoardContainer.BOARD_HEIGHT / 2, BoardContainer.BOARD_WIDTH, BoardContainer.BOARD_HEIGHT);
        this.add(background);

        this.cells = [];

        for (let r = 0; r < 11; r ++) {
            this.cells[r] = [];
            for (let c = 0; c < 9; c ++) {

                const cell = new Cell(this.scene, {c: c, r: r});
                cell.x = -BoardContainer.BOARD_WIDTH / 2 + Cell.CELL_SIZE * c;
                cell.y = -BoardContainer.BOARD_HEIGHT / 2 + Cell.CELL_SIZE * r;
                this.add(cell);

                this.cells[r].push(cell);
            }
        }

        const start = {c: 0, r: 0};
        const end = {c: 8, r: 6};

        this.drawLine(start, end);

        const cells = BoardManager.getCells(start, end);

        console.log(cells);

        this.markCells(cells);
    }

    private markCells(cellPositions: {c: number, r: number}[]): void {

        for (let i = 0; i < cellPositions.length; i++) {

            const cell = this.cells[cellPositions[i].r] [cellPositions[i].c];
            
            cell.mark();

            this.bringToTop(cell);
        }
    }

    private drawLine(p1: {c: number, r: number}, p2: {c: number, r: number}): void {
        
        const lineGraphics = new Phaser.GameObjects.Graphics(this.scene);
        lineGraphics.x = -BoardContainer.BOARD_WIDTH / 2 + Cell.CELL_SIZE / 2;
        lineGraphics.y = -BoardContainer.BOARD_HEIGHT / 2  + Cell.CELL_SIZE / 2;

        this.add(lineGraphics);

        lineGraphics.lineStyle(1.5, 0xFFFF00);
        lineGraphics.moveTo(p1.c * Cell.CELL_SIZE, p1.r * Cell.CELL_SIZE);
        lineGraphics.lineTo(p2.c * Cell.CELL_SIZE, p2.r * Cell.CELL_SIZE);
        lineGraphics.stroke();
    }
}
