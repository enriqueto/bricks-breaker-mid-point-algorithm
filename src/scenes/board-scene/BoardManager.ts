export class BoardManager {

    public static init(): void {
        //
    }

    public static undo(): void {
        //
    }

    public static getCells(p1: {c: number, r: number}, p2: {c: number, r: number}): {c: number, r: number} [] {

        const ret: {c: number, r: number} [] = [p1];

        const dy = p2.r - p1.r;
        const dx = p2.c - p1.c;

        let d = dy - (dx / 2);

        let c = p1.c;
        let r = p1.r;

        while (c < p2.c) {

            c ++;

            if ( d < 0) {
                d += dy;
            } else {
                d += dy - dx;
                r ++;
            }

            ret.push({c: c, r: r});
        }

        return ret;
    }
}
