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

    public getTrajectoryData(p1: {x: number, y: number}, p2: {x: number, y: number}): {p: {x: number, y: number}, side: string} [] {
        
        const hitBlockData: {p: {x: number, y: number}, side: string} [] = [];

        let h = this.getHitBlock(p1, p2);
        hitBlockData.push(h);

        // TODO: hacer una reflexión
        const reflectedSegment = this.getReflectedRay(p1, p2, h);

        if (reflectedSegment.rp1.x) {

            h = this.getHitBlock(reflectedSegment.rp1, reflectedSegment.rp2, h.p);

            // console.log("x:", h.p.x, "y:", h.p.y);
        }

        return hitBlockData;
    }

    private getReflectedRay(p1: {x: number, y: number}, p2: {x: number, y: number}, h: {p: {x: number, y: number}, side: string}): {rp1: {x: number, y: number}, rp2: {x: number, y: number}} {
        
        let rp1x: number;
        let rp1y: number;
        let rp2x: number;
        let rp2y: number;

        switch (h.side) {

            case BricksBreakerEngine.LEFT:

                let d1x = h.p.x - p1.x;
                rp1x = h.p.x + d1x - 1; // TODO: REFACTORIZAR ESTA EXPRESION
                rp1y = p1.y;

                let d2x = p2.x - h.p.x;
                rp2x = h.p.x - d2x - 1; // TODO: REFACTORIZAR ESTA EXPRESION
                rp2y = p2.y;

                break;

            case BricksBreakerEngine.RIGHT:
                
                break;

            case BricksBreakerEngine.UP:
                
                break;
    
            case BricksBreakerEngine.DOWN:

                rp1x = p1.x;
                
                let d1y = p1.y - h.p.y;     
                rp1y = h.p.y - d1y + 1;
                
                rp2x = p2.x;
                let d2y = h.p.y - p2.y;
                rp2y = h.p.y + d2y - 1;
            
                break;
        
            default:
                break;
        }

        return {rp1: {x: rp1x, y: rp1y}, rp2: {x: rp2x, y: rp2y}};
    }

    private getHitBlock(p1: {x: number, y: number}, p2: {x: number, y: number}, lastBlockHit?: {x: number, y: number}): {p: {x: number, y: number}, side: string} {

        let cells: {x: number, y: number} [];

        if (p2.y > p1.y) {
            if (p2.x > p1.x) {
                // console.log("NE");
                cells = this.lineNE(p1, p2);
            } else {
                // console.log("NW");
                cells = this.lineNW(p1, p2);
            }
        } else {
            if (p2.x > p1.x) {
                // console.log("SE");
                cells = this.lineSE(p1, p2);
              
            } else {

                // console.log("SW");
                cells = this.lineSW(p1, p2);
            }
        }

        if (lastBlockHit) {

            // console.log(JSON.stringify(p1), JSON.stringify(p2));

            let i: number;

            for (i = 0; i < cells.length; i ++) {
                if (cells[i].x === lastBlockHit.x && cells[i].y === lastBlockHit.y) {
                    break;
                }
            }

            // console.log(JSON.stringify(lastBlockHit));
            // console.log(cells);

            cells.splice(0, i + 1);
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

        return {p: {x: blockHit.x, y: blockHit.y}, side: side};
    }

    private lineNE(p1: {x: number, y: number}, p2: {x: number, y: number}): {x: number, y: number} [] {

        const ret: {x: number, y: number} [] = [p1];
        let dx = p2.x - p1.x;
        let dy = p2.y - p1.y;
        let e = dx - dy;
        dx *= 2;
        dy *= 2;
        let x = p1.x;
        let y = p1.y;

        let borderHit = false;

        while (x !== p2.x && y !== p2.y && !borderHit) {
            if (e <= 0) {
                y ++;
                e += dx;
            } else {
                x++;
                e -= dy;
            }
            
            if (x <= this.width && y <= this.height) {
                ret.push({x: x, y: y});
            }

            if (x === this.width || y === this.height) {
                borderHit = true;
            }
        }

        return ret;
    }

    private lineNW(p1: {x: number, y: number}, p2: {x: number, y: number}): {x: number, y: number} [] {

        const ret: {x: number, y: number} [] = [p1];
        let dx = p2.x - p1.x;
        let dy = p2.y - p1.y;
        let e = dx + dy;
        dx *= 2;
        dy *= 2;
        let x = p1.x;
        let y = p1.y;

        let borderHit = false;

        while ( x !== p2.x && y !== p2.y && !borderHit) {
            if (e <= 0) {
                x --;
                e += dy;
            } else {
                y ++;
                e += dx;
            }

            if (x >= -1 && y <= this.height) {
                ret.push({x: x, y: y});
            }

            if (x === -1 || y === this.height) {
                borderHit = true;
            }
        }

        return ret;
    }

    private lineSE(p1: {x: number, y: number}, p2: {x: number, y: number}): {x: number, y: number} [] {

        const ret: {x: number, y: number} [] = [p1];
        let dx = p2.x - p1.x;
        let dy = p2.y - p1.y;
        let e = dx + dy;
        dx *= 2;
        dy *= 2;
        let x = p1.x;
        let y = p1.y;

        let borderHit = false;

        while (x !== p2.x && y !== p2.y && !borderHit) {

            if (e <= 0) {
                y --;
                e += dx;
            } else {
                x++;
                e += dy;
            }

            if (x <= this.width && y >= -1) {
                ret.push({x: x, y: y});
            }

            if (x === this.width || y === -1) {
                borderHit = true;
            }
        }

        return ret;
    }

    private lineSW(p1: {x: number, y: number}, p2: {x: number, y: number}): {x: number, y: number} [] {

        const ret: {x: number, y: number} [] = [p1];
        let dx = p2.x - p1.x;
        let dy = p2.y - p1.y;
        let e = dx - dy;
        dx *= 2;
        dy *= 2;
        let x = p1.x;
        let y = p1.y;

        let borderHit = false;

        while ( x !== p2.x && y !== p2.y && !borderHit) {

            if (e <= 0) {
                x --;
                e -= dy;
            } else {
                y --;
                e += dx;
            }

            if ( x >= -1 && y >= -1) {
                ret.push({x: x, y: y});
            }

            if (x === -1 || y === -1) {
                borderHit = true;
            }
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
