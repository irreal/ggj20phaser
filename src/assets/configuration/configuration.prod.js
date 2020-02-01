export default {
    apiUrl: "https://ggj20.azurewebsites.net/",
    drawBoardWidth: 50,
    drawBoardHeight: 50,
    phaserConfig: {
        type: Phaser.AUTO,
        parent: "ggj20",
        width: window.innerWidth,
        height: window.innerHeight,
        pixelArt: true,
    }
};