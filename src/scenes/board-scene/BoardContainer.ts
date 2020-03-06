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

        for (let y = 0; y < 11; y ++) {
            this.cells[y] = [];
            for (let x = 0; x < 9; x ++) {

                const cell = new Cell(this.scene, {x: x, y: y});
                cell.x = -BoardContainer.BOARD_WIDTH / 2 + Cell.CELL_SIZE * x;
                cell.y = -BoardContainer.BOARD_HEIGHT / 2 + Cell.CELL_SIZE * y;
                this.add(cell);

                this.cells[y].push(cell);
            }
        }

        const start = {x: 4, y: 4};
        const end = {x: 8, y: 9};

        this.drawLine(start, end);

        const cells = BoardManager.line(start, end);
        
        this.markCells(cells);
    }

    private markCells(cellPositions: {x: number, y: number}[]): void {

        if (!cellPositions) {
            return;
        }

        for (let i = 0; i < cellPositions.length; i++) {

            const cell = this.cells[cellPositions[i].y] [cellPositions[i].x];
            
            cell.mark();

            this.bringToTop(cell);
        }
    }

    private drawLine(p1: {x: number, y: number}, p2: {x: number, y: number}): void {
        
        const lineGraphics = new Phaser.GameObjects.Graphics(this.scene);
        lineGraphics.x = -BoardContainer.BOARD_WIDTH / 2 + Cell.CELL_SIZE / 2;
        lineGraphics.y = -BoardContainer.BOARD_HEIGHT / 2  + Cell.CELL_SIZE / 2;

        this.add(lineGraphics);

        lineGraphics.lineStyle(1.5, 0xFFFF00);
        lineGraphics.moveTo(p1.x * Cell.CELL_SIZE, p1.y * Cell.CELL_SIZE);
        lineGraphics.lineTo(p2.x * Cell.CELL_SIZE, p2.y * Cell.CELL_SIZE);
        lineGraphics.stroke();
    }
}
