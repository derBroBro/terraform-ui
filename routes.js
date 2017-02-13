var passport = require('passport');
var h_express = require('./lib/helper/express.js');
var projects = require('./lib/projects.js');
var workspace = require('./lib/workspace.js');

var mod_exports = {
  register: function(app){
    app.get('/', passport.authenticate('basic', {
      session: false
    }), function(req, res) {
      h_express.render(req,res,{
        title: 'Welcome',
        template: 'home',
        data: {}
      });
    });
    app.get('/project/', passport.authenticate('basic', {
      session: false
    }), function(req, res) {
      projects.list().then(function(data) {
        h_express.render(req,res,{
          title: 'Projects',
          template: 'projects',
          anonymize: true,
          data: data
        });
      });
    });
    app.get('/project/:id', passport.authenticate('basic', {
      session: false
    }), function(req, res) {
      projects.get(req.params.id).then(function(data) {
        h_express.render(req,res,{
          title: 'Project '+req.params.id,
          template: 'project_details',
          anonymize: true,
          data: data
        });
      });
    });
    app.post('/project/:id', passport.authenticate('basic', {
      session: false
    }), function(req, res) {
      projects.update_prop(req.params.id,req.body.name,req.body.value).then(function(data) {
        workspace.setup(req.params.id,data.variables).then(function(){
          res.json({status:'OK'});
        });
      });
    });
    app.delete('/project/:id', passport.authenticate('basic', {
      session: false
    }), function(req, res) {
      projects.delete_prop(req.params.id,req.query.name).then(function(data) {
        workspace.setup(req.params.id,data.variables).then(function(){
          res.json({status:'OK'});
        });
      });
    });
    app.get('/project/:id/version', passport.authenticate('basic', {
      session: false
    }), function(req, res) {
      projects.get(req.params.id).then(function(data) {
        h_express.render(req,res,{
          title: 'Project '+req.params.id,
          template: 'project_details',
          anonymize: true,
          data: data
        });
      });
    });
    app.get('/project/:id/version/:version', passport.authenticate('basic', {
      session: false
    }), function(req, res) {
      projects.get_version(req.params.id, req.params.version).then(function(data) {
        h_express.render(req,res,{
          title: 'Project '+req.params.id,
          template: 'project_version',
          anonymize: true,
          data: data
        });
      });
    });
    app.get('/project/:id/workspace/', passport.authenticate('basic', {
      session: false
    }), function(req, res) {
      workspace.get_state(req.params.id).then(function(data) {
        h_express.render(req,res,{
          title: 'Workspace '+req.params.id,
          template: 'project_workspace',
          anonymize: true,
          data: data
        });
      });
    });
    app.post('/project/:id/workspace/clear', passport.authenticate('basic', {
      session: false
    }), function(req, res) {
      // rem dir
      workspace.clear(req.params.id).then(function() {
        projects.get(req.params.id).then(function(data) {
          workspace.update(req.params.id, data.metadata.git).then(function() {
            workspace.setup(req.params.id, data.metadata.variables).then(function(){
              res.redirect('/project/' + req.params.id + '/workspace');
            });
          });
        });
      });
    });
    app.post('/project/:id/workspace/update', passport.authenticate('basic', {
      session: false
    }), function(req, res) {
      projects.get(req.params.id).then(function(data) {
        workspace.update(req.params.id, data.metadata.git).then(function() {
          workspace.setup(req.params.id, data.metadata.variables).then(function(){
            res.redirect('/project/' + req.params.id + '/workspace');
          });
        });
      });
    });
    app.post('/project/:id/workspace/plan', passport.authenticate('basic', {
      session: false
    }), function(req, res) {
      workspace.plan(req.params.id).then(function(){
        res.redirect('/project/' + req.params.id + '/workspace');
      });
    });
    app.post('/project/:id/workspace/apply', passport.authenticate('basic', {
      session: false
    }), function(req, res) {
      workspace.apply(req.params.id).then(function(){
        res.redirect('/project/' + req.params.id + '/workspace');
      });
    });
    // new project
    app.post('/project', passport.authenticate('basic', {
      session: false
    }), function(req, res) {
      projects.new(req.body.projectId).then(function(){
        res.redirect('/project');
      });
    });
  }
};

module.exports = mod_exports;
