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

        // this.drawTestingGeometry();
    }

    public drawRay(p: {x: number, y: number}): void {

        const start = {x: 4, y: 10};
        const end = this.snapEndPointToGrid(p);

        const trajectoryData = BricksBreakerEngine.currentInstance.getTrajectoryData(start, end); 

        let p0 = {x: 0, y: 5 * BoardContainer.CELL_SIZE};

        const correctedSlope = (end.y - start.y) / (end.x - start.x);
        const vertices: {x: number, y: number} [] = this.getTrajectoryVertices(p0, correctedSlope, trajectoryData);
       
        this.drawLineSegments(vertices);
    }

    private snapEndPointToGrid(p: {x: number, y: number}): {x: number, y: number} {
        
        let p0 = {x: 0, y: 5 * BoardContainer.CELL_SIZE};

        let dx = p.x - p0.x;
        let dy = p.y - p0.y;

        const angle = Math.atan2(dy, dx);

        let x = 1000 * BoardContainer.CELL_SIZE * Math.cos(angle);
        let y = 1000 * BoardContainer.CELL_SIZE * Math.sin(angle);

        x = Math.round(x / BoardContainer.CELL_SIZE);
        y = Math.round(y / BoardContainer.CELL_SIZE);

        const start = {x: 4, y: 10};

        return {x: start.x + x, y: start.y + y};
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
        
        // el punto final
        this.rayGraphics.lineStyle(2, 0xFF0000);
        this.rayGraphics.strokeCircle(vertices[vertices.length - 1].x, vertices[vertices.length - 1].y, 5);  
    }

    private getTrajectoryVertices(p0: {x: number, y: number}, slope: number, trajectoryData: {p: {x: number, y: number}, side: string} []): {x: number, y: number} [] {

        let vertices: {x: number, y: number} [] = [p0];
        let v = p0;

        for (let i = 0; i < trajectoryData.length; i ++) {

            v = this.getVertexOnHitBlock(v, slope, trajectoryData[i]);

            vertices.push(v);
    
            slope *= -1;
        }

        return vertices;
    }

    private getVertexOnHitBlock(p: {x: number, y: number}, slope: number, hitBlockData: {p: {x: number, y: number}, side: string}): {x: number, y: number} {

        const hitBlock = hitBlockData.p;
        const side = hitBlockData.side;

        // la ecuacion es y = slope * x + a
        // let a = p0.y - slope * p0.x;

        let a = p.y - slope * p.x;

        let vx: number;
        let vy: number;

        if (side === BricksBreakerEngine.UP) {

            vy = -BoardContainer.BOARD_HEIGHT / 2 * BoardContainer.CELL_SIZE + BoardContainer.CELL_SIZE * hitBlock.y + 1;
            vx = (vy - a) / slope;

        } else if (side === BricksBreakerEngine.DOWN) {

            vy = -BoardContainer.BOARD_HEIGHT / 2 * BoardContainer.CELL_SIZE + BoardContainer.CELL_SIZE * (hitBlock.y + 1);
            vx = (vy - a) / slope;

        } else if ( side === BricksBreakerEngine.LEFT) {

            vx = -BoardContainer.BOARD_WIDTH / 2 * BoardContainer.CELL_SIZE + BoardContainer.CELL_SIZE * hitBlock.x;
            vy = slope * vx + a;

        } else {

            vx = -BoardContainer.BOARD_WIDTH / 2 * BoardContainer.CELL_SIZE + BoardContainer.CELL_SIZE * (hitBlock.x + 1);
            vy = slope * vx + a;
        }

        return {x: vx, y: vy};
    }

    private drawTestingGeometry(): void {

        const testGraphics = new Phaser.GameObjects.Graphics(this.scene);
        this.add(testGraphics);

        let p1 = {x: 8, y: 0};
        let p2 = {x: 3, y: 10};

        let bp1 = this.getBoardCoordinates(p1);
        let bp2 = this.getBoardCoordinates(p2);

        testGraphics.lineStyle(2, 0xFF0000);
        testGraphics.strokeCircle(bp1.x, bp1.y , 5);  
        testGraphics.strokeCircle(bp2.x, bp2.y , 5);
      
        // la celda de impacto
        let h = {p: {x: 4, y: 9}, side: BricksBreakerEngine.UP};

        // // LA LINEA HORIZONTAL
        testGraphics.lineStyle(4, 0x0000FF);
        let vl1 = this.getBoardCoordinates({x: -100, y: h.p.y - .5});
        let vl2 = this.getBoardCoordinates({x: 100, y: h.p.y - .5});

        testGraphics.moveTo(vl1.x, vl1.y);
        testGraphics.lineTo(vl2.x, vl2.y);
        testGraphics.stroke();

        // // //  la linea entre los 2 puntos
        testGraphics.lineStyle(2, 0x00FF00);
        testGraphics.moveTo(bp1.x, bp1.y);
        testGraphics.lineTo(bp2.x, bp2.y);
        testGraphics.stroke();

        let reflectedSegment = BricksBreakerEngine.currentInstance.getReflectedRay(p1, p2, h);

        testGraphics.lineStyle(2, 0xFF0000);

        bp1 = this.getBoardCoordinates(reflectedSegment.rp1);
        bp2 = this.getBoardCoordinates(reflectedSegment.rp2);

        testGraphics.lineStyle(2, 0xFF0000);
        testGraphics.strokeCircle(bp1.x, bp1.y , 5);  
        testGraphics.strokeCircle(bp2.x, bp2.y , 5);

        testGraphics.lineStyle(2, 0x00FF00);
        testGraphics.moveTo(bp1.x, bp1.y);
        testGraphics.lineTo(bp2.x, bp2.y);
        testGraphics.stroke();
    }

    private getBoardCoordinates(p: {x: number, y: number}): {x: number, y: number} {

        const x = (-BoardContainer.BOARD_WIDTH / 2  + .5 + p.x) * BoardContainer.CELL_SIZE;
        const y = (-BoardContainer.BOARD_HEIGHT / 2  + .5 + p.y) * BoardContainer.CELL_SIZE;

        return {x: x, y: y};
    }
}
