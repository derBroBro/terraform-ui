var winston = require('winston');
// default settings
winston.level = 'debug';
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {colorize: true});

var mod_exports = {
  error: winston.error,
  warn: winston.warn,
  info: winston.info,
  verbose: winston.verbose,
  debug: winston.debug,
  silly: winston.silly,
};

module.exports = mod_exports;
