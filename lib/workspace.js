var Promise = require('bluebird');
var git = require('nodegit');

var path = require('path');
var app_dir = path.dirname(require.main.filename);

var file_provider = require(app_dir+'/lib/file/fs.js');
var terraform = require(app_dir+'/lib/terraform.js');
var projects = require(app_dir+'/lib/projects.js');
var logger = require(app_dir+'/lib/helper/logger.js');

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
    return new Promise(function(resolve) {
      file_provider.stat(workspace_dir + id+'\\workspace', function(err, data) {
        if (data === undefined) {
          file_provider.mkdir(workspace_dir + id+'\\workspace', function() {
            resolve(id);
          });
        } else {
          resolve(id);
        }
      });
    });
  },
  // if empty clone it, elsewise checktout the right branch, fetch and merge
  update_git: function(id, git_data) {
    logger.debug('update_git workspace '+id);
    // try to poen repo
    return git.Repository.open(path.resolve(workspace_dir + id + '\\workspace\\.git'))
      .then(function(repo) {
        logger.debug('Repo already there...');
        logger.debug('Change to ' + git_data.branch);
        // checkout repo
        return repo.checkoutBranch(git_data.branch)
          .then(function() {
            logger.log('Fetch all');
            // fetch updates
            var fetchOptions = {
              callbacks: {
                credentials: function() {
                  return git.Cred.userpassPlaintextNew(git_data.user, git_data.pass);
                }
              }
            };
            return repo.fetchAll(fetchOptions)
              .then(function() {
                logger.log('Merge ' + git_data.branch + ' <= origin/' + git_data.branch);
                // merge these
                return repo.mergeBranches(git_data.branch, 'origin/' + git_data.branch);
              }).catch(logger.log);
          });
      })
      .catch(function() {
        logger.log('Repo new, clone...');
        // clone, as new
        var cloneOptions = {
          checkoutBranch: git_data.branch,
          fetchOpts: {
            callbacks: {
              credentials: function() {
                return git.Cred.userpassPlaintextNew(git_data.user, git_data.pass);
              }
            }
          }
        };
        return git.Clone.clone(git_data.url, workspace_dir + id+'\\workspace\\', cloneOptions)
          .then(function(details) {
            logger.log(details);
            return Promise.resolve();
          });
      });
  },
  setup: function(id, variables) {
    logger.debug('setup workspace '+id);
    return git.Repository.open(path.resolve(workspace_dir + id + '\\workspace\\.git'))
      .then(function(repo) {
        return repo.getHeadCommit()
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
    return file_provider.read(workspace_dir + id + '\\state.json').catch(function(){
      return Promise.resolve({
        commit: 'cloning...',
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
