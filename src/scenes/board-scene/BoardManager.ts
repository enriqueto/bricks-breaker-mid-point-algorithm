export class BoardManager {

    public static init(): void {
        //
    }

    public static undo(): void {
        //
    }

    public static getCells(x0: number, y0: number, x1: number, y1: number): {c: number, r: number} [] {

        const cells: {c: number, r: number} [] = [];

        const xDist = Math.abs(x1 - x0);
        let xStep = x0 < x1 ? 1 : -1;

        const yDist = -Math.abs(y1 - y0);
        let yStep = y0 < y1 ? 1 : -1;

        let error = xDist + yDist;
        
        cells.push({c: x0, r: y0});

        let xCounter = 0;
        let yCounter = 0;

        let c = 0;
        let r = 0;

        while (x0 !== x1 || y0 !== y1) {
            
            if (2 * error - yDist > xDist - 2 * error) {

                // horizontal step
                error += yDist;
                x0 += xStep;

                xCounter ++;

                if (xCounter === 4) {

                    xCounter = 0;
                    c ++;
                    cells.push({c: c , r: r});
                } 

            } else {
                
                // vertical step
                error += xDist;
                y0 += yStep;

                yCounter ++;

                if (yCounter === 4) {

                    yCounter = 0;
                    r ++;
                    cells.push({c: c , r: r});
                }
            }
        }

        return cells;
    }
}
