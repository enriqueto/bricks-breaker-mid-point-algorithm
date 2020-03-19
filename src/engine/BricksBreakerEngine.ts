export class BricksBreakerEngine {

    public static readonly RIGHT = "right";
    public static readonly LEFT = "left";
    public static readonly UP = "up";
    public static readonly DOWN = "down";

    public static currentInstance: BricksBreakerEngine;

    private height: number;
    private width: number;
    private blocks: {x: number, y: number, hits: number} [];

    constructor(widht: number, height: number, blocks: {x: number, y: number, hits: number} []) {
        
        BricksBreakerEngine.currentInstance = this;

        this.width = widht;
        this.height = height;
        this.blocks = blocks;
    }

    public getTrajectory(p1: {x: number, y: number}, p2: {x: number, y: number}): {p: {x: number, y: number}, side: string} [] {
        
        let cells: {x: number, y: number} [];

        if (p2.y > p1.y) {
            if (p2.x > p1.x) {
                cells = this.lineNE(p1, p2);
            } else {
                cells = this.lineNW(p1, p2);
            }
        } else {
            if (p2.x > p1.x) {
                cells = this.lineSE(p1, p2);
            } else {
                cells = this.lineSW(p1, p2);
            }
        }

        // ver si alguna de las celdas de la trayectoria corresponde a un bloque
        let i: number;

        let blockHit: {x: number, y: number, hits?: number} = null;

        for (i = 0; i < cells.length; i++) {
            const cell = cells[i];
            for (let j = 0; j < this.blocks.length; j ++) {
                
                if (cell.x === this.blocks[j].x && cell.y === this.blocks[j].y) {
                    blockHit = this.blocks[j];
                    break;
                }
            }

            if (blockHit) {
                break;
            }
        }

        let side: string;
        let lastCell: {x: number, y: number};

        if (blockHit) {
            lastCell = cells[i - 1];
        } else {
            lastCell = cells[cells.length - 2];
            blockHit = cells[cells.length - 1];
        }

        const dx = blockHit.x - lastCell.x;
        const dy = blockHit.y - lastCell.y;

        if (dx === 1) {
            side = BricksBreakerEngine.LEFT;
        } else if (dx === -1) {
            side = BricksBreakerEngine.RIGHT;
        } else if (dy === 1) {
            side = BricksBreakerEngine.UP;
        } else {
            side = BricksBreakerEngine.DOWN;
        }

        return [{p: {x: blockHit.x, y: blockHit.y}, side: side}];
    }

    public lineNE(p1: {x: number, y: number}, p2: {x: number, y: number}): {x: number, y: number} [] {

        const ret: {x: number, y: number} [] = [p1];
        let dx = p2.x - p1.x;
        let dy = p2.y - p1.y;
        let e = dx - dy;
        dx *= 2;
        dy *= 2;
        let x = p1.x;
        let y = p1.y;
        while ( x !== p2.x && y !== p2.y && x >= 0 && x < this.width && y >= 0 && y < this.height) {
            if (e <= 0) {
                y ++;
                e += dx;
            } else {
                x++;
                e -= dy;
            }
            ret.push({x: x, y: y});
        }

        return ret;
    }

    public lineNW(p1: {x: number, y: number}, p2: {x: number, y: number}): {x: number, y: number} [] {

        const ret: {x: number, y: number} [] = [p1];
        let dx = p2.x - p1.x;
        let dy = p2.y - p1.y;
        let e = dx + dy;
        dx *= 2;
        dy *= 2;
        let x = p1.x;
        let y = p1.y;
        while ( x !== p2.x && y !== p2.y && x >= 0 && x < this.width && y >= 0 && y < this.height) {
            if (e <= 0) {
                x --;
                e += dy;
            } else {
                y ++;
                e += dx;
            }
            ret.push({x: x, y: y});
        }

        return ret;
    }

    public lineSE(p1: {x: number, y: number}, p2: {x: number, y: number}): {x: number, y: number} [] {

        const ret: {x: number, y: number} [] = [p1];
        let dx = p2.x - p1.x;
        let dy = p2.y - p1.y;
        let e = dx + dy;
        dx *= 2;
        dy *= 2;
        let x = p1.x;
        let y = p1.y;

        while (x !== p2.x && y !== p2.y && x >= 0 && x < this.width && y >= 0 && y < this.height) {

            if (e <= 0) {
                y --;
                e += dx;
            } else {
                x++;
                e += dy;
            }
            ret.push({x: x, y: y});
        }

        return ret;
    }

    public lineSW(p1: {x: number, y: number}, p2: {x: number, y: number}): {x: number, y: number} [] {

        const ret: {x: number, y: number} [] = [p1];
        let dx = p2.x - p1.x;
        let dy = p2.y - p1.y;
        let e = dx - dy;
        dx *= 2;
        dy *= 2;
        let x = p1.x;
        let y = p1.y;
        while ( x !== p2.x && y !== p2.y && x >= 0 && x < this.width && y >= 0 && y < this.height) {
            if (e <= 0) {
                x --;
                e -= dy;
            } else {
                y --;
                e += dx;
            }
            ret.push({x: x, y: y});
        }

        // TODO: PONER ESTO EN EL RESTO DE LAS FUNCIONES
        // while (x !== p2.x) {
        //     x--;
        //     ret.push({x: x, y: y});
        // }
    
        // while (y !== p2.y) {
        //     y--;
        //     ret.push({x: x, y: y});
        // }

        return ret;
    }
}
