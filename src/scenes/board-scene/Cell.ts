export class Cell extends Phaser.GameObjects.Container {

    public static readonly CELL_SIZE = 80;

    public p: {x: number, y: number};

    private cellOff: Phaser.GameObjects.Graphics;
    private cellOn: Phaser.GameObjects.Graphics;
    
    constructor(scene: Phaser.Scene, p: {x: number, y: number}) {
        
        super(scene);
        
        this.p = p;

        this.cellOff = new Phaser.GameObjects.Graphics(this.scene);
        this.cellOff.lineStyle(.5, 0xFFFFFF, .5);
        this.cellOff.strokeRect(0, 0, Cell.CELL_SIZE, Cell.CELL_SIZE);
        this.add(this.cellOff);

        this.cellOn = new Phaser.GameObjects.Graphics(this.scene);
        this.cellOn.lineStyle(3.5, 0xff4019);
        this.cellOn.strokeRect(0, 0, Cell.CELL_SIZE, Cell.CELL_SIZE);
        this.add(this.cellOn);

        this.cellOn.visible = false;
    }

    public mark(): void {
        
        this.cellOff.visible = false;
        this.cellOn.visible = true;
    }

    public unmark(): void {
        
        this.cellOff.visible = true;
        this.cellOn.visible = false;
    }
}
