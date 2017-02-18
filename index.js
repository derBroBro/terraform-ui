var express = require('express');
var passport = require('passport');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');

var path = require('path');
var app_dir = path.dirname(require.main.filename);

var auth = require(app_dir+'/lib/auth/basic_local.js');
var logger = require(app_dir+'/lib/helper/logger.js');
var routes = require(app_dir+'/routes.js');
var config = require('./config.json');

logger.setup(config.system.log_level);
var app = express();

// Handlebars
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  helpers: {
    toJSON: function(obj) {
      return JSON.stringify(obj, null, 3);
    }
  }
}));
app.set('view engine', 'handlebars');
app.use(express.static('static'));

// body parser
app.use(bodyParser.urlencoded({ extended: false }));

// auth
auth.setup({users:config.system.users});
passport.use(auth.get());

// routes
routes.register(app);

app.listen(config.system.port, function() {
  logger.info('Server listening on port '+config.system.port);
});
