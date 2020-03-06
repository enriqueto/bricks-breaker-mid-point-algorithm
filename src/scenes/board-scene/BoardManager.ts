export class BoardManager {

    public static init(): void {
        //
    }

    public static undo(): void {
        //
    }

    public static line(p1: {x: number, y: number}, p2: {x: number, y: number}): {x: number, y: number} [] {

        if (p2.y > p1.y) {
            if (p2.x > p1.x) {
                return BoardManager.lineNE(p1, p2);
            } else {
                return BoardManager.lineNW(p1, p2);
            }
        } else {
            if (p2.x > p1.x) {
                return BoardManager.lineSE(p1, p2);
            } else {
                return BoardManager.lineSW(p1, p2);
            }
        }
    }

    public static lineNE(p1: {x: number, y: number}, p2: {x: number, y: number}): {x: number, y: number} [] {

        const ret: {x: number, y: number} [] = [p1];
        let dx = p2.x - p1.x;
        let dy = p2.y - p1.y;
        let e = dx - dy;
        dx *= 2;
        dy *= 2;
        let x = p1.x;
        let y = p1.y;
        while ( x !== p2.x && y !== p2.y) {
            if (e <= 0) {
                y ++;
                e += dx;
            } else {
                x++;
                e -= dy;
            }
            ret.push({x: x, y: y});
        }

        if (y === p2.y) {
            while (x !== p2.x) {
                x++;
                ret.push({x: x, y: y});
            }
        } else if (x === p2.x) {
            while (y !== p2.y) {
                y++;
                ret.push({x: x, y: y});
            }
        }

        return ret;
    }

    public static lineNW(p1: {x: number, y: number}, p2: {x: number, y: number}): {x: number, y: number} [] {

        const ret: {x: number, y: number} [] = [p1];
        let dx = p2.x - p1.x;
        let dy = p2.y - p1.y;
        let e = dx + dy;
        dx *= 2;
        dy *= 2;
        let x = p1.x;
        let y = p1.y;
        while ( x !== p2.x || y !== p2.y) {
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

    public static lineSE(p1: {x: number, y: number}, p2: {x: number, y: number}): {x: number, y: number} [] {

        const ret: {x: number, y: number} [] = [p1];
        let dx = p2.x - p1.x;
        let dy = p2.y - p1.y;
        let e = dx + dy;
        dx *= 2;
        dy *= 2;
        let x = p1.x;
        let y = p1.y;
        while ( x !== p2.x || y !== p2.y) {
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

    public static lineSW(p1: {x: number, y: number}, p2: {x: number, y: number}): {x: number, y: number} [] {

        const ret: {x: number, y: number} [] = [p1];
        let dx = p2.x - p1.x;
        let dy = p2.y - p1.y;
        let e = dx - dy;
        dx *= 2;
        dy *= 2;
        let x = p1.x;
        let y = p1.y;
        while ( x !== p2.x || y !== p2.y) {
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
