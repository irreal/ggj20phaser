import Phaser from "phaser";
export default {
    apiUrl: "http://localhost:3000/",
    drawBoardWidth: 50,
    drawBoardHeight: 50,
    phaserConfig: {
        type: Phaser.AUTO,
        parent: "ggj20",
        width: 1920,
        height: 1080,
        pixelArt: true,
    }
};