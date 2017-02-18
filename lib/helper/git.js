var Promise = require('bluebird');
var git = require('nodegit');

var path = require('path');
var app_dir = path.dirname(require.main.filename);

var logger = require(app_dir+'/lib/helper/logger.js');

var mod_exports = {
 /**
 * [GetHead Get the latest commit id]
 * @param {[type]} git_data [description]
 */
  getHeadCommit: function(git_data){
    return git.Repository.open(path.resolve(git_data.path+'\\.git'))
      .then(function(repo) {
        return Promise.resolve(repo.getHeadCommit());
      }).catch(function(){
        return Promise.resolve('NEW');
      });
  },
  /**
   * [InitOrPull clones or, if allready there, pulls the latest version]
   * @param {[type]} git_data [url,path,user,pass,branch]
   */
  CloneOrPull: function(git_data) {
    logger.debug('InitOrPull Git '+git_data.url);
    // try to poen repo
    return git.Repository.open(path.resolve(git_data.path+'\\.git'))
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
        logger.debug('Repo new, clone...');
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
        return git.Clone.clone(git_data.url, git_data.path, cloneOptions)
          .then(function(details) {
            logger.debug(details);
            return Promise.resolve();
          });
      });
  }
};

module.exports = mod_exports;
