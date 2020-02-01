import Phaser from "phaser";
export default {
    apiUrl: "http://localhost:3000/",
    drawBoardWidth: 17,
    drawBoardHeight: 17,
    phaserConfig: {
        type: Phaser.AUTO,
        parent: "ggj20",
        width: window.innerWidth,
        height: window.innerHeight,
        pixelArt: true,
    }
};