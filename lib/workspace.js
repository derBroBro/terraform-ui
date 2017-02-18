var Promise = require('bluebird');

var path = require('path');
var app_dir = path.dirname(require.main.filename);

var file_provider = require(app_dir+'/lib/file/fs.js');
var terraform = require(app_dir+'/lib/terraform.js');
var projects = require(app_dir+'/lib/projects.js');
var logger = require(app_dir+'/lib/helper/logger.js');
var git = require(app_dir+'/lib/helper/git.js');

var workspace_dir = path.resolve(process.cwd()) + '\\data\\';

var mod_exports = {
  // Removes the workspace
  clear: function(id){
    logger.debug('clear workspace '+id);
    return file_provider.rmdir(workspace_dir+id+'\\workspace');
  },
  // init dir and git (clone)
  update: function(id, git_data) {
    logger.debug('update workspace '+id);
    return mod_exports.init_dir(id).then(function() {
      return mod_exports.update_git(id, git_data);
    });
  },
  // check if dir is existing, if not create it
  init_dir: function(id) {
    logger.debug('init_dir workspace '+id);
    return file_provider.stat(workspace_dir + id+'\\workspace')
      .then(function(){
        return Promise.resolve(id);
      })
      .catch(function(){
        file_provider.mkdir(workspace_dir + id+'\\workspace', function() {
          return Promise.resolve(id);
        });
      });
  },
  // if empty clone it, elsewise checktout the right branch, fetch and merge
  update_git: function(id, git_data) {
    logger.debug('update_git workspace '+id);
    // try to poen repo
    git_data.path = workspace_dir + id + '\\workspace';
    return git.CloneOrPull(git_data);
  },
  setup: function(id, variables) {
    logger.debug('setup workspace '+id);
    return mod_exports.init_dir(id).then(function(){
      return git.getHeadCommit({path:workspace_dir + id + '\\workspace'})
        .then(function(commit) {
          var state = {
            commit: (commit.toString()),
            variables: variables,
            plan: {},
            apply: {},
            state: {}
          };
          return mod_exports.set_state(id, state);
        });
    });
  },
  // return the state and handle if it is missing
  get_state: function(id) {
    logger.debug('get_state workspace '+id);
    return file_provider.read(workspace_dir + id + '\\workspace\\state.json').catch(function(){
      return Promise.resolve({
        commit: 'empty!',
        variables: {},
        plan: {},
        apply: {},
        state: {}
      });
    });
  },
  set_state: function(id, state) {
    logger.debug('set_state workspace '+id);
    return file_provider.write(workspace_dir + id + '\\workspace\\state.json', state);
  },
  plan: function(id) {
    logger.debug('plan workspace '+id);
    return mod_exports.get_state(id)
      .then(function(state) {
        return terraform.get(id)
          .then(function() {
            return terraform.plan(id, state.variables)
              .then(function(val_state) {
                state.plan.state = val_state;
                state.plan.exec_user = 'malte';
                state.plan.datetime = new Date();
                return mod_exports.set_state(id, state)
                  .then(function() {
                    return Promise.resolve(val_state);
                  });
              });
          });
      });
  },
  apply: function(id) {
    logger.debug('plan workspace '+id);
    return mod_exports.get_state(id)
      .then(function(state) {
        if (state.plan.state && state.plan.state.valid === true) {
          return terraform.apply(id, state.variables)
            .then(function(val_state) {
              state.apply.state = val_state;
              state.apply.exec_user = 'malte';
              state.apply.datetime = new Date();
              return file_provider.read(workspace_dir + id + '\\terraform.tfstate')
                .then(function(tf_state) {
                  state.state = tf_state;
                  return projects.add_version(id, state)
                    .then(function() {
                      return mod_exports.setup(id, state.variables);
                    });
                });
            });
        } else {
          return Promise.reject('Please exec Plan before!');
        }
      });
  }
};

module.exports = mod_exports;
