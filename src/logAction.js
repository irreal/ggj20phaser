export default function (object, mode, log, stamp) {
    var newTime = new Date().getTime();
    var timeDiff = newTime - stamp;
    if (timeDiff > 1000) {
        timeDiff = 1000;
    }
    log.push({ x: object.tagX, y: object.tagY, action: mode == "black" ? 1 : 0, delay: timeDiff });
}