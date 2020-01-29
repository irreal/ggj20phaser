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

function create() {
  createUI(this);
}

var createUI = function (scene) {
  scene.cameras.main.setBackgroundColor('#FFFFFF')

  const button = scene.add.image(400, 50, "button");
  button.setInteractive();


  for (var i = 0; i < 12; i++) {
    squares.push([]);
    for (var u = 0; u < 17; u++) {
      const img = scene.add.image(30 + u * 51, 100 + i * 51, "whitesquare");
      img.tagX = u;
      img.tagY = i;
      img.setInteractive();
      squares[i].push(img);

    }
  }

  scene.input.on('gameobjectdown', (pointer, gameObject) => {
    if (gameObject === button) {
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


