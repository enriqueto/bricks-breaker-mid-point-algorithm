import { BoardContainer } from "./BoardContainer";

export class BoardBackground extends Phaser.GameObjects.Container {

    constructor(scene: Phaser.Scene) {
        
        super(scene);

        const background = new Phaser.GameObjects.Graphics(this.scene);
        background.fillStyle(0xFFFFFF, .075);
        background.fillRect(-BoardContainer.BOARD_WIDTH / 2 * BoardContainer.CELL_SIZE, -BoardContainer.BOARD_HEIGHT / 2 * BoardContainer.CELL_SIZE, BoardContainer.BOARD_WIDTH * BoardContainer.CELL_SIZE, BoardContainer.BOARD_HEIGHT * BoardContainer.CELL_SIZE);
        this.add(background);

        background.lineStyle(.5, 0xFFFFFF);

        for (let r = 0; r < BoardContainer.BOARD_HEIGHT + 1; r ++) {
            background.moveTo(-BoardContainer.BOARD_WIDTH / 2 * BoardContainer.CELL_SIZE, (r - BoardContainer.BOARD_HEIGHT / 2) * BoardContainer.CELL_SIZE);
            background.lineTo(BoardContainer.BOARD_WIDTH / 2 * BoardContainer.CELL_SIZE, (r - BoardContainer.BOARD_HEIGHT / 2) * BoardContainer.CELL_SIZE);
        }

        for (let c = 0; c < BoardContainer.BOARD_WIDTH + 1; c ++) {
            background.moveTo((-BoardContainer.BOARD_WIDTH / 2 + c) * BoardContainer.CELL_SIZE, -BoardContainer.BOARD_HEIGHT / 2 * BoardContainer.CELL_SIZE);
            background.lineTo((-BoardContainer.BOARD_WIDTH / 2 + c) * BoardContainer.CELL_SIZE,  BoardContainer.BOARD_HEIGHT / 2 * BoardContainer.CELL_SIZE);
        }

        background.stroke();
    }
}
