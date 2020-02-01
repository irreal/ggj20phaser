import logAction from "./logAction";
export default function (object, mode, actionLog, lastTimeStamp) {
    if (object.texture.key == 'filledSquare' && mode == 'white') {
        object.setTexture('emptySquare');
        logAction(object, mode, actionLog, lastTimeStamp);
    }
    else if (object.texture.key == 'emptySquare' && mode == 'black') {
        object.setTexture('filledSquare');
        logAction(object, mode, actionLog, lastTimeStamp);
    }
}