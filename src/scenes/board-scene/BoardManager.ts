export class BoardManager {

    public static init(): void {
        //
    }

    public static undo(): void {
        //
    }

    public static getCells(x0: number, y0: number, x1: number, y1: number): {c: number, r: number} [] {

        const cells: {c: number, r: number} [] = [];

        const dx = p2.c - p1.c;
        const dy = p2.r - p1.r;

        let e = .5 * (dx - dy);
        let x = p1.c;
        let y = p1.r;

        while ( x !== p2.c || y !== p2.r) {

            if (e <= 0) {
                 
                y ++;
                e += dx;

            } else {
                
                x++;
                e -= dy;
            }

            ret.push({c: x, r: y});
        }

        return cells;
    }
}
