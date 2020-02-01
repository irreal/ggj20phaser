import Phaser from "phaser";
import configuration from "./assets/configuration/configuration";
import preload from "./preload";
import squareClick from "./squareClick";

const serverUrl = configuration.apiUrl;

const phaserConfig = {
  ...configuration.phaserConfig,
  scene: {
    preload,
    create: create
  }
};

const game = new Phaser.Game(phaserConfig);


//global state
var squares = [];
var currentMode = '';
var actionLog = [];
var lastTimestamp = new Date().getTime();
const blockSize = 20;
const borderSize = 0;
const offsetX = 30;
const offsetY = 100;

console.log('Running GGJ20 Phaser frontend version: ', VERSION);

function create() {
  createUI(this);
}

function sendDrawing() {
  if (actionLog.length == 0) {
    return;
  }

  var data = [...actionLog];
  actionLog = [];
  fetch(serverUrl + 'event', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ action: 'img', actionLog: data })
  });
}

function clearDrawing() {
  squares.forEach(row => { row.forEach(s => s.setTexture('whitesquare')) });
  actionLog = [];
}

sendDrawing();

var createUI = function (scene) {

  const text = scene.add.text(0, 0, `v: ${VERSION}`, { fontFamily: 'Verdana, "Times New Roman", Tahoma, serif' });
  text.setColor('black');
  scene.cameras.main.setBackgroundColor('#FFFFFF')

  const button = scene.add.image(400, 50, "button");
  button.setInteractive();


  for (var i = 0; i < configuration.drawBoardWidth; i++) {
    squares.push([]);
    for (var u = 0; u < configuration.drawBoardHeight; u++) {
      const img = scene.add.image(offsetX + i * (blockSize + borderSize), offsetY + u * (blockSize + borderSize), "whitesquare");
      img.tagX = i;
      img.tagY = u;
      img.setInteractive();
      squares[i].push(img);

    }
  }

  scene.input.on('gameobjectdown', (pointer, gameObject) => {
    if (gameObject === button) {
      sendDrawing();
      clearDrawing();
    }
    else {
      currentMode = gameObject.texture.key == 'whitesquare' ? 'black' : 'white';
      squareClick(gameObject, currentMode, actionLog, lastTimestamp);
      lastTimestamp = new Date().getTime();
    }
  });
  scene.input.on('gameobjectup', () => {
    currentMode = '';
  });

  scene.input.on('gameobjectover', (pointer, gameObject) => {
    if (!currentMode) {
      return;
    }
    squareClick(gameObject, currentMode, actionLog, lastTimestamp);
    lastTimestamp = new Date().getTime();
  });
}


