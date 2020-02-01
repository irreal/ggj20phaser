import buttonImg from "./assets/button.png";
import blackSquareImg from "./assets/blacksquare.png";
import whiteSquareImg from "./assets/whitesquare.png";

import background from "./assets/bg.png";
import emptySquare from "./assets/empty.png";
import filledSquare from "./assets/full.png";
import messageBox from "./assets/msg.png";
import buttonUp from "./assets/btnup.png";
import buttonDown from "./assets/btndwn.png";
export default function () {
    this.load.image("button", buttonImg);
    this.load.image("blacksquare", blackSquareImg);
    this.load.image("whitesquare", whiteSquareImg);

    this.load.image('background', background);
    this.load.image('emptySquare', emptySquare);
    this.load.image('filledSquare', filledSquare)
    this.load.image('messageBox', messageBox)
    this.load.image('buttonUp', buttonUp)
    this.load.image('buttonDown',buttonDown)
};