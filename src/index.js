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
var previousActionLogs = [];
var lastTimestamp = new Date().getTime();
const blockSize = 30;
const borderSize = 0;
const offsetX = 170;
const offsetY = 20;
var messageText;

console.log('Running GGJ20 Phaser frontend version: ', VERSION);

function create() {
  createUI(this);
  // resizeApp();
  // window.addEventListener('resize', resizeApp);
  getProgression();
}

function getProgression() {
  fetch(serverUrl + 'progression', {
    method: 'get',

  }).then(data=>{
    return data.json();
  }).then(jsonData=>{
    console.log('got some progression', jsonData);
    messageText.setText(jsonData.hint);
    previousActionLogs.push([...actionLog]);
    clearDrawing();
  }).catch(()=>{
    console.log('probably timing out, retrying get progression');
  }).finally(()=>{
    setTimeout(getProgression, 1000);
  });
}

function sendDrawing() {
  if (actionLog.length == 0) {
    return;
  }

  var data = [...actionLog];
  // actionLog = [];
  fetch(serverUrl + 'event', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ action: 'img', actionLog: data })
  });
}

function clearDrawing() {
  squares.forEach(row => { row.forEach(s => s.setTexture('emptySquare')) });
  actionLog = [];
}



var createUI = function (scene) {

  var canvas = scene.game.canvas;
  scene.cameras.main.setBackgroundColor('#FFFFFF')

  const background = scene.add.image((canvas.width / 2) + 10, canvas.height / 2, "background");
  background.setScale(1.0);





  for (var i = 0; i < configuration.drawBoardWidth; i++) {
    squares.push([]);
    for (var u = 0; u < configuration.drawBoardHeight; u++) {
      const img = scene.add.image(offsetX + i * (blockSize + borderSize), offsetY + u * (blockSize + borderSize), "emptySquare");
      img.tagX = i;
      img.tagY = u;
      img.setInteractive();
      squares[i].push(img);

    }
  }

  const message = scene.add.image(canvas.width / 2 - 100, canvas.height, "messageBox");
  message.setOrigin(0.5, 1);

  const buttonSend = scene.add.image(1600, 970, "buttonSend");
  buttonSend.setInteractive();
  buttonSend.setScale(0.7);

  const buttonReset = scene.add.image(1480, 970, "buttonReset");
  buttonReset.setInteractive();
  buttonReset.setScale(0.7);

  const buttonUndo = scene.add.image(200, 970, "buttonUndo");
  buttonUndo.setInteractive();
  buttonUndo.setScale(0.7);

  messageText = scene.add.text(400, 970, `v: ${VERSION}`, { fontFamily: 'Raleway' });
  messageText.setOrigin(0, 0.5);
  messageText.setColor('black');
  messageText.setFontSize(42);
  messageText.text = "";

  // const versionText = scene.add.text(0, 0, `v: ${VERSION}`, { fontFamily: 'Verdana, "Times New Roman", Tahoma, serif' });
  // versionText.setColor('black');

  scene.input.on('gameobjectdown', (pointer, gameObject) => {
    if (gameObject === buttonSend) {
      sendDrawing();
      // clearDrawing();
    }
    else if (gameObject === buttonReset) {
     if (actionLog.length) {
       previousActionLogs.push([...actionLog]);
      clearDrawing();
     } 
    }
    else if (gameObject === buttonUndo) {
      if (!previousActionLogs.length) {
        return;
      }
     actionLog = [...previousActionLogs.pop()]; 
     syncStates();
    }
    else {
      previousActionLogs.push([...actionLog]);
      currentMode = gameObject.texture.key == 'emptySquare' ? 'black' : 'white';
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

function syncStates() {
  var template = Array(configuration.drawBoardWidth);
  for (var i = 0; i < template.length; i++) {
    template[i] = Array(configuration.drawBoardHeight).fill(0);
  }

  actionLog.forEach(li=>{
    template[li.x][li.y] = li.action;
  });

  for (var x = 0; x < configuration.drawBoardWidth; x++) {
    for (var y = 0; y <configuration.drawBoardHeight; y++) {
      squares[x][y].setTexture(template[x][y] == 1 ? 'filledSquare' : 'emptySquare');
    }
  }
}

function resizeApp() {
  console.log('resizing app');
  // Width-height-ratio of game resolution
  let game_ratio = 1920 / 1080;
  const xReduce = 0;
  const yReduce = 0;

  let div = document.getElementById('phaser-app');
  var height;
  var width;
  // if (window.innerWidth > window.innerHeight) {
  height = window.innerHeight + "px";
  width = Math.round((window.innerHeight * game_ratio)) + "px";
  // }
  // else {
  //   width = window.innerWidth + "px";
  //   height = Math.round((window.innerWidth / game_ratio)) + "px";
  // }
  // if (width > 1920 ) {
  //   width = 1920;
  // }
  // if (height > 1080) {
  //   height = 1080;
  // }
  div.style.width = width;
  div.style.height = height;

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
