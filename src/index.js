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
  resizeApp();
  window.addEventListener('resize', resizeApp);
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



function resizeApp() {
  console.log('resizing app');
  // Width-height-ratio of game resolution
  let game_ratio = 1024 / 768;
  const xReduce = 0;
  const yReduce = 0;

  // Make div full height of browser and keep the ratio of game resolution

  let div = document.getElementById('phaser-app');
  div.style.width = (window.innerWidth - xReduce) + 'px';
  div.style.height = (window.innerHeight - yReduce) + 'px';
  
  // let div = document.getElementById('phaser-app');
  // div.style.width = (window.innerHeight * game_ratio) + 'px';
  // div.style.height = window.innerHeight + 'px';

  // // Check if device DPI messes up the width-height-ratio
  // let canvas = document.getElementsByTagName('canvas')[0];

  // let dpi_w = (parseInt(div.style.width) / canvas.width);
  // let dpi_h = (parseInt(div.style.height) / canvas.height);

  // let height = window.innerHeight * (dpi_w / dpi_h);
  // let width = height * 0.6;

  // canvas.style.width = width + 'px';
  // canvas.style.height = height + 'px';
}

// Add to resize event

// Set correct size when page loads the first time
