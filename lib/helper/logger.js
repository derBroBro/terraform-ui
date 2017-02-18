var winston = require('winston');
// default settings
winston.level = 'warn';
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {colorize: true});

var mod_exports = {
  error: winston.error,
  warn: winston.warn,
  info: winston.info,
  verbose: winston.verbose,
  debug: winston.debug,
  silly: winston.silly,
  setup: function(level){
    winston.warn("Set log_level to "+level);
    winston.level = level;
  }
};

module.exports = mod_exports;
