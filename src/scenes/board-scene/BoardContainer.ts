import { GameConstants } from "../../GameConstants";
import { Cell } from "./Cell";
import { BoardManager } from "./BoardManager";

export class BoardContainer extends Phaser.GameObjects.Container {

    public static readonly BOARD_WIDTH = 720;
    public static readonly BOARD_HEIGHT = 880;

    private cells: Cell [][];
    private lineGraphics: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene) {
        
        super(scene);

        this.lineGraphics = new Phaser.GameObjects.Graphics(this.scene);
        
        this.add(this.lineGraphics);

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
    }

    public drawLine(p1: {x: number, y: number}, p2: {x: number, y: number}): void {

        let dx = p2.x - p1.x;
        let dy = p2.y - p1.y;

        let s = dy / dx;

        // se trata de buscar un punto lejano que este en el centro de una celda
        let sign = dx > 0 ? 1 : -1;

        p2.x = p1.x + sign * Cell.CELL_SIZE * 100;
        p2.y = p1.y + sign * s * Cell.CELL_SIZE * 100;

        p2.y = Math.round(p2.y / Cell.CELL_SIZE) * Cell.CELL_SIZE;

        this.lineGraphics.clear();
        this.lineGraphics.lineStyle(1, 0x00FF00);
        this.lineGraphics.moveTo(p1.x, p1.y);
        this.lineGraphics.lineTo(p2.x, p2.y);
        this.lineGraphics.stroke();

        // pasar a coordenadas de celda
        const start = {x: 4, y: 10};
        
        dx = (p2.x - p1.x) / Cell.CELL_SIZE;
        dy = (p2.y - p1.y) / Cell.CELL_SIZE;

        const end = {x: start.x + dx, y: start.y + dy};

        const cells = BoardManager.line(start, end); 
        this.markCells(cells);   
    }

    private markCell(p: {x: number, y: number}): void {

        const cell = this.cells[p.y] [p.x];
        cell.mark();
        this.bringToTop(cell);
    }

    private markCells(cellPositions: {x: number, y: number}[]): void {

        if (!cellPositions) {
            return;
        }

        for (let y = 0; y < this.cells.length; y ++) {
            for (let x = 0;  x < this.cells[0].length; x ++) {
                this.cells[y][x].unmark();
            }
        }

        for (let i = 0; i < cellPositions.length; i++) {

            if (cellPositions[i].x < 9 && cellPositions[i].x >= 0 && cellPositions[i].y >= 0 && cellPositions[i].y < 11) {
                this.markCell(cellPositions[i]);
            }
        }
    }
}
