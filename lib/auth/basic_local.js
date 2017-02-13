var BasicStrategy = require('passport-http').BasicStrategy;

var users = [];

var mod_exports = {
  setup: function(config){
    users = config.users;
  },
  get: function(){
    return new BasicStrategy(
      function(username, password, done) {
        for(var i in users){
          var cur_user = users[i];
          if (cur_user.username == username && cur_user.password == password) {
            return done(null, cur_user);
          }
        }
        return done('local auth failed');
      });
  }
};

module.exports = mod_exports;
