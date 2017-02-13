var AWS = require('aws-sdk');
var Promise = require('bluebird');


var s3 = {};
var defaultBucket = '';


module.exports = {
  setup: function(config){
    s3 = new AWS.S3({
      credentials: new AWS.Credentials(config.cred)
    });
    defaultBucket = config.bucket;
  },
  read: function(key){
    return new Promise(function(resolve, reject) {
      var params = {
        Bucket: defaultBucket,
        Key: key
      };
      s3.getObject(params,function(err,data){
        if(err){
          reject(err);
        } else {
          resolve(JSON.parse(data.Body.toString()));
        }
      });
    });
  },
  write: function(key,value){
    return new Promise(function(resolve, reject) {
      var params = {
        Bucket: defaultBucket,
        Key: key,
        Body: new Buffer(JSON.stringify(value))

      };
      s3.putObject(params,function(err,data){
        if(err){
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
};
