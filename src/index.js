'use strict';

const express = require("express");
const Promise = require("bluebird");
const rp = require("request-promise");
const cLogger = require("./common-logger.js");
const logger = cLogger("mylog");

var site = "http://www.youtube.com";

var app = express();

app.get("/", function (req, res) {
    rp(site)
    .then(function (sitehtml) {
        res.end(sitehtml);
    })
    .catch(function (err) {
        logger.error(err);
        res.end("an error has occurred");
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
