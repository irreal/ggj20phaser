import Phaser from "phaser";
import buttonImg from "./assets/button.png";
import configuration from "./assets/configuration/configuration";

const serverUrl = configuration.apiUrl;

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create
  }
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image("button", buttonImg);
}

function create() {
  const button = this.add.image(400, 150, "button");
  button.setInteractive();

  this.input.on('gameobjectdown', (pointer, gameObject) => {
    if (gameObject === button) {
      fetch(serverUrl + 'event', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'create' })
      })
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
