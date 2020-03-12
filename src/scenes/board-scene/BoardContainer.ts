import { GameConstants } from "../../GameConstants";
import { BricksBreakerEngine } from "../../engine/BricksBreakerEngine";
import { GameVars } from "../../GameVars";
import { Block } from "./Block";
import { BoardBackground } from "./BoardBackground";

export class BoardContainer extends Phaser.GameObjects.Container {

    public static readonly BOARD_WIDTH = 9;
    public static readonly BOARD_HEIGHT = 11;
    public static readonly CELL_SIZE = 80;

    private rayGraphics: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene) {
        
        super(scene);

        this.rayGraphics = new Phaser.GameObjects.Graphics(this.scene);
        
        this.add(this.rayGraphics);

        this.x = GameConstants.GAME_WIDTH / 2;
        this.y = GameConstants.GAME_HEIGHT / 2;

        const boardBackground = new BoardBackground(this.scene);
        this.add(boardBackground);
        
        // AÑADIMOS LOS BLOQUES
        for (let i = 0; i < GameVars.blocks.length; i ++) {

            const x = GameVars.blocks[i].x;
            const y = GameVars.blocks[i].y;

            const block = new Block(this.scene, {x: x, y: y}, GameVars.blocks[i].hits);
            block.x = -BoardContainer.BOARD_WIDTH / 2 * BoardContainer.CELL_SIZE + BoardContainer.CELL_SIZE * x;
            block.y = -BoardContainer.BOARD_HEIGHT / 2 * BoardContainer.CELL_SIZE + BoardContainer.CELL_SIZE * y;
            this.add(block);
        }
    }

    public drawRay(p: {x: number, y: number}): void {

        const start = {x: 4, y: 10};
        const end = this.getGridEndPoint(p);

        const trajectory = BricksBreakerEngine.currentInstance.getTrajectory(start, end); 

        let vertices: {x: number, y: number} [];
        let p0 = {x: 0, y: 5 * BoardContainer.CELL_SIZE};

        if (trajectory !== null) {

            const correctedSlope = (end.y - start.y) / (end.x - start.x);
            vertices = this.getTrajectoryVertices(p0, correctedSlope, trajectory);
            
        } else {
            vertices = [p0, p];
        }

        this.drawLineSegments(vertices);
    }

    private getGridEndPoint(p: {x: number, y: number}): {x: number, y: number} {
        
        let p0 = {x: 0, y: 5 * BoardContainer.CELL_SIZE};

        let dx = p.x - p0.x;
        let dy = p.y - p0.y;

        const slope = dy / dx;

        // se trata de buscar un punto lejano que este en el centro de una celda
        let sign = dx > 0 ? 1 : -1;

        p.x = p0.x + sign * BoardContainer.CELL_SIZE * 100;
        p.y = p0.y + sign * slope * BoardContainer.CELL_SIZE * 100;

        p.y = Math.round(p.y / BoardContainer.CELL_SIZE) * BoardContainer.CELL_SIZE;

        // pasar a coordenadas de celda
        const start = {x: 4, y: 10};
        
        dx = (p.x - p0.x) / BoardContainer.CELL_SIZE;
        dy = (p.y - p0.y) / BoardContainer.CELL_SIZE;

        return {x: start.x + dx, y: start.y + dy};
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

    private getTrajectoryVertices(p0: {x: number, y: number}, slope: number, trajectory: {blockIndex: number, side: string} []): {x: number, y: number} [] {

        // la ecuacion es y = slope * x + a
        let a = p0.y - slope * p0.x;

        let vertices: {x: number, y: number} [] = [p0];

        const block = GameVars.blocks[trajectory[0].blockIndex];
        const side = trajectory[0].side;

        let vx: number;
        let vy: number;

        if (side === BricksBreakerEngine.UP) {

            vy = -BoardContainer.BOARD_HEIGHT / 2 * BoardContainer.CELL_SIZE + BoardContainer.CELL_SIZE * block.y + 1;
            vx = (vy - a) / slope;

        } else if (side === BricksBreakerEngine.DOWN) {

            vy = -BoardContainer.BOARD_HEIGHT / 2 * BoardContainer.CELL_SIZE + BoardContainer.CELL_SIZE * (block.y + 1);
            vx = (vy - a) / slope;

        } else if ( side === BricksBreakerEngine.LEFT) {

            vx = -BoardContainer.BOARD_WIDTH / 2 * BoardContainer.CELL_SIZE + BoardContainer.CELL_SIZE * block.x;
            vy = slope * vx + a;

        } else {

            vx = -BoardContainer.BOARD_WIDTH / 2 * BoardContainer.CELL_SIZE + BoardContainer.CELL_SIZE * (block.x + 1);
            vy = slope * vx + a;
        }

        vertices.push({x: vx, y: vy});

        // la linea reflejada

        return vertices;
    }
}
