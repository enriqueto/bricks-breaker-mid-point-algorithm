import { BoardContainer } from "./BoardContainer";

export class Block extends Phaser.GameObjects.Container {

    public p: {x: number, y: number};
    public hits: number;

    constructor(scene: Phaser.Scene, p: {x: number, y: number}, hits: number) {
        
        super(scene);

        const block = new Phaser.GameObjects.Graphics(this.scene);
        block.lineStyle(3.5, 0xFFFF00);
        block.strokeRect(BoardContainer.CELL_SIZE * .075, BoardContainer.CELL_SIZE * .075, BoardContainer.CELL_SIZE * .85, BoardContainer.CELL_SIZE * .85);
        this.add(block);

        const hitsLabel = new Phaser.GameObjects.Text(this.scene, BoardContainer.CELL_SIZE / 2, BoardContainer.CELL_SIZE / 2, hits.toString(), {fontFamily: "Arial", fontSize: "30px", color: "#FFFF00"});
        hitsLabel.setOrigin(.5);
        this.add(hitsLabel);
    }
}
