export class BricksBreakerEngine {

    public static currentInstance: BricksBreakerEngine;

    constructor() {
        
        BricksBreakerEngine.currentInstance = this;
    }

    public line(p1: {x: number, y: number}, p2: {x: number, y: number}): {x: number, y: number} [] {

        if (p2.y > p1.y) {
            if (p2.x > p1.x) {
                return this.lineNE(p1, p2);
            } else {
                return this.lineNW(p1, p2);
            }
        } else {
            if (p2.x > p1.x) {
                return this.lineSE(p1, p2);
            } else {
                return this.lineSW(p1, p2);
            }
        }
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
        while ( x !== p2.x && y !== p2.y && x >= 0 && x < 9 && y >= 0 && y < 11) {
            if (e <= 0) {
                y ++;
                e += dx;
            } else {
                x++;
                e -= dy;
            }
            ret.push({x: x, y: y});
        }

        while (x !== p2.x) {
            x++;
            ret.push({x: x, y: y});
        }
    
        while (y !== p2.y) {
            y++;
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
        while ( x !== p2.x && y !== p2.y && x >= 0 && x < 9 && y >= 0 && y < 11) {
            if (e <= 0) {
                x --;
                e += dy;
            } else {
                y ++;
                e += dx;
            }
            ret.push({x: x, y: y});
        }

        while (x !== p2.x) {
            x--;
            ret.push({x: x, y: y});
        }
    
        while (y !== p2.y) {
            y++;
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

        while (x !== p2.x && y !== p2.y && x >= 0 && x < 9 && y >= 0 && y < 11) {

            if (e <= 0) {
                y --;
                e += dx;
            } else {
                x++;
                e += dy;
            }
            ret.push({x: x, y: y});
        }

        while (x !== p2.x) {
            x++;
            ret.push({x: x, y: y});
        }
    
        while (y !== p2.y) {
            y--;
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
        while ( x !== p2.x && y !== p2.y && x >= 0 && x < 9 && y >= 0 && y < 11) {
            if (e <= 0) {
                x --;
                e -= dy;
            } else {
                y --;
                e += dx;
            }
            ret.push({x: x, y: y});
        }

        while (x !== p2.x) {
            x--;
            ret.push({x: x, y: y});
        }
    
        while (y !== p2.y) {
            y--;
            ret.push({x: x, y: y});
        }

        return ret;
    }
}
