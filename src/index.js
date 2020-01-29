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
function create() {

  this.cameras.main.setBackgroundColor('#FFFFFF')

  const button = this.add.image(400, 50, "button");
  button.setInteractive();


  for (var i = 0; i < 12; i++) {
    squares.push([]);
    for (var u = 0; u < 17; u++) {
      const img = this.add.image(30 + u * 51, 100 + i * 51, "whitesquare");
      img.setInteractive();
      squares[i].push(img);

    }
  }

  this.input.on('gameobjectdown', (pointer, gameObject) => {
    if (gameObject === button) {
      var data = [...squares].map(arr => {
        return arr.map(i => i.texture.key == 'blacksquare' ? 1 : 0);
      }
      );
      console.log('here is the data', data);
      fetch(serverUrl + 'event', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'img', data })
      })
    }
    else {
      if (gameObject.texture.key == 'blacksquare') {
        currentMode = 'white';
        gameObject.setTexture('whitesquare');
      }
      else {
        gameObject.setTexture('blacksquare');
        currentMode = 'black';
      }
    }
  });
  this.input.on('gameobjectup', () => {
    currentMode = '';
  });

  this.input.on('gameobjectover', (pointer, gameObject) => {
    if (!currentMode) {
      return;
    }
    if (gameObject.texture.key == 'blacksquare' && currentMode == 'white') {
      gameObject.setTexture('whitesquare');
    }
    else if (gameObject.texture.key == 'whitesquare' && currentMode == 'black') {
      gameObject.setTexture('blacksquare');
    }
  });



  // this.tweens.add({
  //   targets: logo,
  //   y: 450,
  //   duration: 2000,
  //   ease: "Power2",
  //   yoyo: true,
  //   loop: -1
  // });

  window.fetch(serverUrl).then(response => response.json()).then(data => {
    console.log('Server kaže: ' + data.message, data);
  });
}
