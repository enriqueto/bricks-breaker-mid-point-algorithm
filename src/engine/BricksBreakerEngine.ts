export class BricksBreakerEngine {

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

    public line(p1: {x: number, y: number}, p2: {x: number, y: number}): {x: number, y: number} [] {

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

        // TODO: mirar si ha colisionado con algun bloque
        let i: number;
        let collision = false;

        for (i = 0; i < cells.length; i++) {
            const cell = cells[i];
            for (let j = 0; j < this.blocks.length; j ++) {
                const block = this.blocks[j];
                if (cell.x === block.x && cell.y === block.y) {
                    collision = true;
                    break;
                }
            }

            if (collision) {
                break;
            }
        }

        if (collision) {
            cells.splice(i, cells.length - 1 - i);
        }

        return cells;
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

        return ret;
    }
}
