var anonymize = require('../auth/anonymize.js');
var logger = require('./logger.js');

var mod_exports = {
  /*
  register: function(app, options, exec){
    // add the needed mtheode to the app, add auth
    app[options.methode](options.url,passport.authenticate('basic', {
      session: false
    }),
    // run the result function
    function(req, res){
      // pass the params
      exec(req.params).then(function(){
        // and render
        mod_exports.render(req,res,options);
      });
    });
  },
  */
  render: function(req,res,options){

    logger.debug('render ' + options.template);
    // anonymize, if needed
    if(options.anonymize){
      options.data = anonymize(options.data);
    }
    // Build object
    var render_data = {
      ctrl: {
        title: options.title,
        params: req.params,
        user: req.user.username
      },
      data: options.data
    };
    logger.silly(render_data);
    // If json is requested, elsewise html
    if(req.query.format == 'json'){
      res.json(render_data);
    } else {
      res.render(options.template, render_data);
    }

  }
};

module.exports = mod_exports;
