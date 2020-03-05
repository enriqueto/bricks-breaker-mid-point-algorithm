export class BoardManager {

    public static init(): void {
        //
    }

    public static undo(): void {
        //
    }

    public static getCells(p1: {c: number, r: number}, p2: {c: number, r: number}): {c: number, r: number} [] {

        const ret: {c: number, r: number} [] = [p1];

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

        return ret;
    }
}
