import logAction from "./logAction";
export default function (object, mode, actionLog, lastTimeStamp) {
    if (object.texture.key == 'blacksquare' && mode == 'white') {
        object.setTexture('whitesquare');
        logAction(object, mode, actionLog, lastTimeStamp);
    }
    else if (object.texture.key == 'whitesquare' && mode == 'black') {
        object.setTexture('blacksquare');
        logAction(object, mode, actionLog, lastTimeStamp);
    }
}