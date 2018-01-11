'use strict';

const log4js = require("log4js");
// appenders source code:
// https://github.com/log4js-node/log4js-node/tree/master/lib/appenders

log4js.configure({
    appenders: {
        console: {
            type: 'console'
        },
        logfile: {
            type: 'fileSync',
            filename: './logs/general.log',
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
