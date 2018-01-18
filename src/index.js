'use strict';

const express = require("express");
const Promise = require("bluebird");
const cLogger = require("./common-logger.js");
const logger = cLogger("mylog");

var site = "http://www.youtube.com";

var app = express();

app.get("/", function (req, res) {
    res.end("hello world");
});

logger.info("app started on port 8080");
app.listen(8080);


function app_cleanup(signal) {
    logger.info("app shutting down: " + signal);
    process.exit();
}

process.on("SIGINT", app_cleanup);
process.on("SIGTERM", app_cleanup);
