export class GameVars {

    public static scaleY: number;
    public static gameData: GameData;
    public static currentScene: Phaser.Scene;
    public static paused: boolean;
    public static intitialised: boolean;
    public static blocks: {x: number, y: number, hits: number} [];
    
    public static formatNumber(value: number): string {

        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}
