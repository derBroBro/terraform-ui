var fs = require('fs-extra');
var Promise = require('bluebird');

module.exports = {
  list: function(key){
    return new Promise(function(resolve, reject) {
      fs.readdir(key,function(err,data){
        if(err){
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  },
  read: function(key){
    return new Promise(function(resolve, reject) {
      fs.readFile(key,function(err,data){
        if(err){
          reject(err);
        } else {
          resolve(JSON.parse(data.toString()));
        }
      });
    });
  },
  write: function(key,value){
    return new Promise(function(resolve, reject) {
      fs.outputFile(key,JSON.stringify(value),function(err,data){
        if(err){
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  },
  rmdir: function(key){
    return new Promise(function(resolve, reject) {
      fs.remove(key,function(err,data){
        if(err){
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  },
  mkdir: function(key){
    return new Promise(function(resolve, reject) {
      fs.mkdir(key,function(err,data){
        if(err){
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  },
  stat: function(key){
    return new Promise(function(resolve, reject) {
      fs.stat(key,function(err,data){
        if(err){
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
};
