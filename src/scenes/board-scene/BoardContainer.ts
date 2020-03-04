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

        this.drawBackground();

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
        const end = {c: 35, r: 17};

        this.drawLine(start, end);

        const cells = BoardManager.getCells(start.c, start.r, end.c, end.r);

        this.markCells(cells);
    }

    private markCells(cellPositions: {c: number, r: number}[]): void {

        for (let i = 0; i < cellPositions.length; i++) {

            let r = cellPositions[i].r;
            let c = cellPositions[i].c;

            const cell = this.cells[r][c];
            
            cell.mark();

            this.bringToTop(cell);
        }
    }

    private drawLine(p1: {c: number, r: number}, p2: {c: number, r: number}): void {

        const cellSize = Cell.CELL_SIZE / 4;
        
        const lineGraphics = new Phaser.GameObjects.Graphics(this.scene);
        lineGraphics.x = -BoardContainer.BOARD_WIDTH / 2 + cellSize / 2;
        lineGraphics.y = -BoardContainer.BOARD_HEIGHT / 2  + cellSize / 2;

        this.add(lineGraphics);

        lineGraphics.lineStyle(1.5, 0xFFFF00);
        lineGraphics.moveTo(p1.c * cellSize, p1.r * cellSize);
        lineGraphics.lineTo(p2.c * cellSize, p2.r * cellSize);
        lineGraphics.stroke();
    }

    private drawBackground(): void {

        const background = new Phaser.GameObjects.Graphics(this.scene);
        background.fillStyle(0xFFFFFF, .075);
        background.fillRect(-BoardContainer.BOARD_WIDTH / 2, -BoardContainer.BOARD_HEIGHT / 2, BoardContainer.BOARD_WIDTH, BoardContainer.BOARD_HEIGHT);
        this.add(background);

        // dibujamos una rejilla
        background.lineStyle(.25, 0xFFFFFF, .5);

        const dx = -BoardContainer.BOARD_WIDTH / 2;
        const dy = -BoardContainer.BOARD_HEIGHT / 2;

        const cellSize = Cell.CELL_SIZE / 4;

        for (let r = 0; r < 45; r ++) {
            background.moveTo(0 + dx, r * cellSize + dy);
            background.lineTo(36 * cellSize + dx, r * cellSize + dy);
            background.stroke();            
        }

        for (let c = 0; c < 37; c ++) {
            background.moveTo(c * cellSize + dx, dy);
            background.lineTo(c * cellSize + dx, 44 * cellSize + dy);
            background.stroke();            
        }
    }
}
