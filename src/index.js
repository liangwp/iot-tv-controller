'use strict';

const express = require("express");
const bodyParser = require("body-parser");

const fs = require("fs-extra");

const cLogger = require("./common-logger.js");
const logger = cLogger("server-api");

var app = express();
var jsonParser = bodyParser.json();

var htmlform = fs.readFileSync("./src/form.html");

var omx = null;

var playerState = require("./statemachine.js")

app.get("/", function (req, res) {
    logger.debug(playerState.state);
    // for testing purposes, re-read the form
    htmlform = fs.readFileSync("./src/form.html");
    res.end(htmlform);
});

app.post("/play-youtube", jsonParser, function (req, res) {
    //logger.debug(req.body);
    res.end("ok");
    playerState.getvideo(req.body.url);
});

function app_cleanup(signal) {
    logger.info("app shutting down: " + signal);
    process.exit();
}

process.on("SIGINT", app_cleanup);
process.on("SIGTERM", app_cleanup);


playerState.startServer(app);

/* notes

youtube-dl -F https://www.youtube.com/watch?v=k7u9WrQsN_k
youtube-dl -g -f 22 https://www.youtube.com/watch?v=k7u9WrQsN_k
// youtube-dl -g https://www.youtube.com/watch?v=k7u9WrQsN_k // gives more than 1 url.
omxplayer "https://r6---sn-nu5gi0c-npoee.googlevideo.com/videoplayback?ratebypass=yes&ipbits=0&mm=31&signature=43784AF49EF6F002B58D22B4CA51B0F574CD89E9.1CD0877BC4904C13F013E3FC817BC9850DED2898&mn=sn-nu5gi0c-npoee&mime=video%2Fmp4&requiressl=yes&key=yt6&ip=58.182.238.195&dur=89.861&ei=Gq9gWp_jH8S-owPx2qaQDw&expire=1516307322&source=youtube&lmt=1470917074940603&id=o-APunY9vJY3LsQ991Upn64M_j2XfwVozZLbvQZlRPrRRA&pl=23&sparams=dur%2Cei%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Cratebypass%2Crequiressl%2Csource%2Cexpire&ms=au&mt=1516285612&mv=m&initcwndbps=1605000&itag=22" -o local

*/
