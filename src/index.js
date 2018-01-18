'use strict';

const express = require("express");
const bodyParser = require("body-parser");

const Promise = require("bluebird");
const fs = require("fs-extra");
const child_process = require("child_process");

const cLogger = require("./common-logger.js");
const logger = cLogger("mylog");


var site = "http://www.youtube.com";

var app = express();
var jsonParser = bodyParser.json();

var htmlform = fs.readFileSync("./src/form.html");

app.get("/", function (req, res) {
    res.end(htmlform);
});


// may need to be a full controller to send messages to omxplayer.

app.post("/youtubeurl", jsonParser, function (req, res) {
    logger.debug(req.body);
    res.end("ok");
    var params = "-g \"" + req.body + "\"";
    var cp = child_process.spawn("youtube-dl", params);
    cp.stdout.on("data", function(data) {
        logger.debug(data);
    });
    cp.on("close", function () {
        logger.debug("youtube-dl ended, start omxplayer");
    });
});


logger.info("app started on port 8080");
app.listen(8080);


function app_cleanup(signal) {
    logger.info("app shutting down: " + signal);
    process.exit();
}

process.on("SIGINT", app_cleanup);
process.on("SIGTERM", app_cleanup);
