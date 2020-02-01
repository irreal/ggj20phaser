import Phaser from "phaser";
export default {
    apiUrl: "http://localhost:3000/",
    drawBoardWidth: 90,
    drawBoardHeight: 45,
    phaserConfig: {
        type: Phaser.AUTO,
        parent: 'phaser-app',
        width:1920,
        height: 1080,
        pixelArt: true,
    }
};