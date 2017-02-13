var express = require('express');
var passport = require('passport');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var auth = require('./lib/auth/basic_local.js');
var logger = require('./lib/helper/logger.js');
var config = require('./config.json');
var routes = require('./routes.js');


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
