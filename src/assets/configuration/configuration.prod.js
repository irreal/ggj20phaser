export default {
    apiUrl: "https://ggj20.azurewebsites.net/",
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