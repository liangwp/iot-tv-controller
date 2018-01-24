'use strict';

const machina = require("machina");
const Promise = require("bluebird");
const child_process = require("child_process");

const cLogger = require("./common-logger.js");
const logger = cLogger("playerstate");

var omx = null;

module.exports = new machina.Fsm({
    initialState: "s_uninitialized",
    states: {
        s_uninitialized: {
            _onEnter: function() {
                logger.info("state: " + this.state);
            }
        },
        s_ready: {
            _onEnter: function() {
                logger.info("state: " + this.state);
            },
            get_youtube: function (url) {
                logger.debug("\"get_youtube\" handler in s_ready: " + url);
                
                /*
                this.deferUntilTransition();
                this.transition("s_gettingvideo");
                */
                this.deferAndTransition("s_gettingvideo");
            }
        },
        s_gettingvideo: {
            _onEnter: function() {
                logger.info("state: " + this.state);
            },
            get_youtube: function (url) {
                logger.debug("youtube page url: " + url);
                var p = new Promise(function(resolve, reject) {
                    var params = "-g -f best " + url;
                    var cp = child_process.spawn("youtube-dl", params.split(" "));
                    
                    var bestformat_url = "";
                    cp.stdout.on("data", function(data) {
                        bestformat_url += data.toString();
                    });
                    
                    // cp.stderr.on("data", function(data) {
                    //    logger.debug(data.toString());
                    //});
                    
                    cp.on("close", function () {
                        logger.debug(bestformat_url);
                        resolve(bestformat_url.slice(0, bestformat_url.length-1)); // cut away the extra linebreak
                    });
                })
                .then(youtube_url => {
                    this.handle("playVideo", youtube_url);
                });
            },
            playVideo: function (youtube_url) {
                this.deferAndTransition("s_playing");
            }
        },
        s_playing: {
            _onEnter: function() {
                logger.info("state: " + this.state);
            },
            playVideo: function(bestformat_url) {

                logger.debug("starting omx player...");
                var params = "-o local " +  bestformat_url;
                omx = child_process.spawn("omxplayer", params.split(" "));
                omx.stderr.on("data", function(data) {
                    logger.error(data.toString());
                });
                omx.stdout.on("data", function(data) {
                    logger.debug(data.toString());
                });
                omx.stdin.setEncoding("utf8");
                omx.on("close", () => {
                    logger.debug("omx closed");
                    this.transition("s_ended");
                });
                
                //logger.debug("omxplayer -o local '" + bestformat_url + "'");
            },
            playpause: function () {
                omx.stdin.write("p");
            },
            stop: function() {
                omx.stdin.write("q");
                // "close" event fires on omx process
            }
        },
        s_ended: {
            _onEnter: function() {
                logger.info("state: " + this.state);
                omx = null;
                this.transition("s_ready");
            },
        },
        s_error: {
            _onEnter: function() {
                logger.info("state: " + this.state);
            },
        }
    },
    // inputs
    startServer: function (app) {
        logger.info("app started on port 8080");
        app.listen(8080);
        this.transition("s_ready");
    },
    getvideo: function (url) {
        logger.debug(url);
        if (url.indexOf("youtube") >= 0) {
            this.handle("get_youtube", url);
        } else {
            logger.debug("dunno how to get this video: " + url);
        }
    },
    playpause: function() {
        logger.debug("playpause event");
        this.handle("playpause");
    },
    stop: function() {
        logger.debug("stop event");
        this.handle("stop");
    }
});
