import { GameConstants } from "./GameConstants";
import { GameVars } from "./GameVars";

export class GameManager {

    public static init(): void {

        GameVars.blocks = [
            {x: 1, y: 1, hits: 10},
            {x: 2, y: 1, hits: 10},
            {x: 6, y: 2, hits: 20},
            {x: 5, y: 3, hits: 10},
            {x: 6, y: 7, hits: 20},
            {x: 2, y: 5, hits: 15},
            {x: 4, y: 1, hits: 30},
            {x: 6, y: 3, hits: 15},
            {x: 4, y: 6, hits: 30}
        ];

        // GameVars.blocks = [];

        if (GameVars.currentScene.sys.game.device.os.desktop) {

            GameVars.scaleY = 1;

        } else {

            GameVars.currentScene.game.scale.displaySize = GameVars.currentScene.game.scale.parentSize;
            GameVars.currentScene.game.scale.refresh();

            const aspectRatio = window.innerHeight / window.innerWidth;
            GameVars.scaleY = (GameConstants.GAME_HEIGHT / GameConstants.GAME_WIDTH) / aspectRatio;
        }

        GameManager.readGameData();
    }

    public static readGameData(): void {

        GameManager.getGameStorageData(
            GameConstants.SAVED_GAME_DATA_KEY,
            function (gameData: string): void {

                if (gameData) {
                    GameVars.gameData = JSON.parse(gameData);
                } else {
                    GameVars.gameData = {
                        muted: false
                    };
                }

                GameManager.startGame();
            }
        );
    }

    public static setCurrentScene(scene: Phaser.Scene): void {

        GameVars.currentScene = scene;
    }

    public static onGameAssetsLoaded(): void {

        GameManager.enterBoardScene();
    }

    public static enterBoardScene(): void {

        GameVars.currentScene.scene.start("BoardScene");
    }

    public static writeGameData(): void {

        GameManager.setGameStorageData(
            GameConstants.SAVED_GAME_DATA_KEY,
            GameVars.gameData,
            function (): void {
                GameManager.log("game data successfully saved");
            }
        );
    }

    public static log(text: string, error?: Error): void {

        if (!GameConstants.VERBOSE) {
            return;
        }

        if (error) {
            console.error(text + ":", error);
        } else {
            console.log(text);
        }
    }

    private static startGame(): void {

        GameVars.currentScene.scene.start("PreloadScene");
    }

    private static getGameStorageData(key: string, successCb: Function): void {

        const gameDataStr = localStorage.getItem(key);
        successCb(gameDataStr);
    }

    private static setGameStorageData(key: string, value: any, successCb: Function): void {

        localStorage.setItem(key, JSON.stringify(value));
        successCb();
    }
}
