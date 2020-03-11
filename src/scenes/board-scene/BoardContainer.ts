import { GameConstants } from "../../GameConstants";
import { Cell } from "./Cell";
import { BricksBreakerEngine } from "../../engine/BricksBreakerEngine";
import { GameVars } from "../../GameVars";
import { Block } from "./Block";

export class BoardContainer extends Phaser.GameObjects.Container {

    public static readonly BOARD_WIDTH = 9;
    public static readonly BOARD_HEIGHT = 11;

    private cells: Cell [][];
    private rayGraphics: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene) {
        
        super(scene);

        this.rayGraphics = new Phaser.GameObjects.Graphics(this.scene);
        
        this.add(this.rayGraphics);

        this.x = GameConstants.GAME_WIDTH / 2;
        this.y = GameConstants.GAME_HEIGHT / 2;

        const background = new Phaser.GameObjects.Graphics(this.scene);
        background.fillStyle(0xFFFFFF, .075);
        background.fillRect(-BoardContainer.BOARD_WIDTH / 2 * Cell.CELL_SIZE, -BoardContainer.BOARD_HEIGHT / 2 * Cell.CELL_SIZE, BoardContainer.BOARD_WIDTH * Cell.CELL_SIZE, BoardContainer.BOARD_HEIGHT * Cell.CELL_SIZE);
        this.add(background);

        this.cells = [];

        for (let y = 0; y < BoardContainer.BOARD_HEIGHT; y ++) {
            this.cells[y] = [];
            for (let x = 0; x < BoardContainer.BOARD_WIDTH; x ++) {

                const cell = new Cell(this.scene, {x: x, y: y});
                cell.x = -BoardContainer.BOARD_WIDTH / 2 * Cell.CELL_SIZE + Cell.CELL_SIZE * x;
                cell.y = -BoardContainer.BOARD_HEIGHT / 2 * Cell.CELL_SIZE + Cell.CELL_SIZE * y;
                this.add(cell);

                this.cells[y].push(cell);
            }
        }

        // AÑADIMOS LOS BLOQUES
        for (let i = 0; i < GameVars.blocks.length; i ++) {

            const x = GameVars.blocks[i].x;
            const y = GameVars.blocks[i].y;

            const block = new Block(this.scene, {x: x, y: y}, GameVars.blocks[i].hits);
            block.x = -BoardContainer.BOARD_WIDTH / 2 * Cell.CELL_SIZE + Cell.CELL_SIZE * x;
            block.y = -BoardContainer.BOARD_HEIGHT / 2 * Cell.CELL_SIZE + Cell.CELL_SIZE * y;
            this.add(block);
        }
    }

    public drawRay(p1: {x: number, y: number}, p2: {x: number, y: number}): void {

        let dx = p2.x - p1.x;
        let dy = p2.y - p1.y;

        const slope = dy / dx;

        // se trata de buscar un punto lejano que este en el centro de una celda
        let sign = dx > 0 ? 1 : -1;

        p2.x = p1.x + sign * Cell.CELL_SIZE * 100;
        p2.y = p1.y + sign * slope * Cell.CELL_SIZE * 100;

        p2.y = Math.round(p2.y / Cell.CELL_SIZE) * Cell.CELL_SIZE;

        // pasar a coordenadas de celda
        const start = {x: 4, y: 10};
        
        dx = (p2.x - p1.x) / Cell.CELL_SIZE;
        dy = (p2.y - p1.y) / Cell.CELL_SIZE;

        const end = {x: start.x + dx, y: start.y + dy};

        const trajectory = BricksBreakerEngine.currentInstance.getTrajectory(start, end); 

        let vertices: {x: number, y: number} [];

        if (trajectory !== null) {

            const correctedSlope = dy / dx;
            vertices = this.getTrajectoryVertices(p1, correctedSlope, trajectory);
            
        } else {
            vertices = [p1, p2];
        }

        this.drawLineSegments(vertices);
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
        
        // console.log(cellPositions.length);
        
        for (let i = 0; i < cellPositions.length; i++) {

            if (cellPositions[i].x < 9 && cellPositions[i].x >= 0 && cellPositions[i].y >= 0 && cellPositions[i].y < 11) {
                this.markCell(cellPositions[i]);
            }
        }
    }

    private drawLineSegments(vertices: {x: number, y: number}[]): void {

        if (vertices === null || vertices.length < 2) {
            return;
        }

        this.rayGraphics.clear();
        this.rayGraphics.lineStyle(1, 0x00FF00);

        this.rayGraphics.moveTo(vertices[0].x, vertices[0].y);

        for (let i = 1; i < vertices.length; i ++) {
            this.rayGraphics.lineTo(vertices[i].x, vertices[i].y);
        }

        this.rayGraphics.stroke();
    }

    private getTrajectoryVertices(p1: {x: number, y: number}, slope: number, trajectory: {blockIndex: number, side: string} []): {x: number, y: number} [] {

        // la ecuacion es y = slope * x + a
        let a = p1.y - slope * p1.x;

        let vertices: {x: number, y: number} [] = [p1];

        const block = GameVars.blocks[trajectory[0].blockIndex];
        const side = trajectory[0].side;

        let vx: number;
        let vy: number;

        if (side === BricksBreakerEngine.UP) {

            vy = -BoardContainer.BOARD_HEIGHT / 2 * Cell.CELL_SIZE + Cell.CELL_SIZE * block.y + 1;
            vx = (vy - a) / slope;

        } else if (side === BricksBreakerEngine.DOWN) {

            vy = -BoardContainer.BOARD_HEIGHT / 2 * Cell.CELL_SIZE + Cell.CELL_SIZE * (block.y + 1);
            vx = (vy - a) / slope;

        } else if ( side === BricksBreakerEngine.LEFT) {

            vx = -BoardContainer.BOARD_WIDTH / 2 * Cell.CELL_SIZE + Cell.CELL_SIZE * block.x;
            vy = slope * vx + a;

        } else {

            vx = -BoardContainer.BOARD_WIDTH / 2 * Cell.CELL_SIZE + Cell.CELL_SIZE * (block.x + 1);
            vy = slope * vx + a;
        }

        vertices.push({x: vx, y: vy});

        return vertices;
    }
}
