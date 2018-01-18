'use strict';

const log4js = require("log4js");
const fs = require("fs-extra");
// appenders source code:
// https://github.com/log4js-node/log4js-node/tree/master/lib/appenders

var logfile = './logs/general.log';
fs.ensureFileSync(logfile);

log4js.configure({
    appenders: {
        console: {
            type: 'console'
        },
        logfile: {
            type: 'fileSync',
            filename: logfile,
            maxLogSize: 1024 * 1024,
            backups: 10
        }
    },
    categories: {
        default: {
            appenders: ['console', 'logfile'],
            level: 'debug'
        }
    }
});

module.exports = function (logname) {
    return log4js.getLogger(logname);
};
