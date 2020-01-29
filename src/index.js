import Phaser from "phaser";
import buttonImg from "./assets/button.png";
import blackSquareImg from "./assets/blacksquare.png";
import whiteSquareImg from "./assets/whitesquare.png";
import configuration from "./assets/configuration/configuration";

const serverUrl = configuration.apiUrl;

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 1400,
  height: 700,
  scene: {
    preload: preload,
    create: create
  }
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image("button", buttonImg);
  this.load.image("blacksquare", blackSquareImg);
  this.load.image("whitesquare", whiteSquareImg);
}

var squares = [];
var currentMode = '';
var actionLog = [];
var lastTimestamp = new Date().getTime();


var squareClick = function (object, mode, actionLog, lastTimeStamp) {
  if (object.texture.key == 'blacksquare' && mode == 'white') {
    object.setTexture('whitesquare');
    logAction(object, mode, actionLog, lastTimeStamp);
  }
  else if (object.texture.key == 'whitesquare' && mode == 'black') {
    object.setTexture('blacksquare');
    logAction(object, mode, actionLog, lastTimeStamp);
  }
}

var logAction = function (object, mode, log, stamp) {
  var newTime = new Date().getTime();
  var timeDiff = newTime - stamp;
  if (timeDiff > 1000) {
    timeDiff = 1000;
  }
  log.push({ x: object.tagX, y: object.tagY, action: mode == "black" ? 1 : 0, delay: timeDiff });
}

function create() {

  this.cameras.main.setBackgroundColor('#FFFFFF')

  const button = this.add.image(400, 50, "button");
  button.setInteractive();


  for (var i = 0; i < 12; i++) {
    squares.push([]);
    for (var u = 0; u < 17; u++) {
      const img = this.add.image(30 + u * 51, 100 + i * 51, "whitesquare");
      img.tagX = u;
      img.tagY = i;
      img.setInteractive();
      squares[i].push(img);

    }
  }

  this.input.on('gameobjectdown', (pointer, gameObject) => {
    if (gameObject === button) {
      console.log('alog', actionLog);
      fetch(serverUrl + 'event', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'img', actionLog })
      }).finally(() => {
        squares.forEach(row => {
          row.forEach(s => {
            s.setTexture('whitesquare');
          });
        });
        actionLog = [];
      });
    }
    else {
      currentMode = gameObject.texture.key == 'whitesquare' ? 'black' : 'white';
      squareClick(gameObject, currentMode, actionLog, lastTimestamp);
      lastTimestamp = new Date().getTime();
    }
  });
  this.input.on('gameobjectup', () => {
    currentMode = '';
  });

  this.input.on('gameobjectover', (pointer, gameObject) => {
    if (!currentMode) {
      return;
    }
    squareClick(gameObject, currentMode, actionLog, lastTimestamp);
    lastTimestamp = new Date().getTime();
  });
}
