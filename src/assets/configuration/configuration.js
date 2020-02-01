import Phaser from "phaser";
export default {
    apiUrl: "http://localhost:3000/",
    drawBoardWidth: 50,
    drawBoardHeight: 30,
    phaserConfig: {
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
        autoRound: false,
        type: Phaser.AUTO,
        parent: 'phaser-app',
        width:1920,
        height: 1080,
        pixelArt: true,
    }
};