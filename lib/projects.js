var Promise = require('bluebird');
var file_provider = require('./file/fs.js');
var logger = require('./helper/logger.js');

var mod_exports = {
  delete_prop: function(id,param_name){
    logger.debug('del project '+id+'('+param_name+')');
    return file_provider.read('data\\'+id+'\\metadata.json').then(
      function(data){
        var param_name_parts = param_name.split('.');
        delete data[param_name_parts[0]][param_name_parts[1]];
        return file_provider.write('data\\'+id+'\\metadata.json',data).then(function(){
          return Promise.resolve(data);
        });
      });
  },
  update_prop: function(id,param_name,param_value){
    logger.debug('update project '+id+'('+param_name+')');
    return file_provider.read('data\\'+id+'\\metadata.json').then(
      function(data) {
        var param_name_parts = param_name.split('.');
        data[param_name_parts[0]][param_name_parts[1]] = param_value;
        return file_provider.write('data\\'+id+'\\metadata.json',data).then(function(){
          return Promise.resolve(data);
        });
      });
  },
  new: function(id){
    logger.debug('new project '+id);
    var new_metadata = file_provider.write('data\\'+id+'\\metadata.json',{
      description:'New Project',
      git: { },
      variables: {},
      permissions:{
        admins:'admins',
        users:'users'
      },
      latest: 0
    });
    var new_version = file_provider.write('data\\'+id+'\\versions.json',{});
    return Promise.all([new_metadata,new_version]);
  },
  // List all projects from projects.json
  list: function() {
    logger.debug('list projects');
    return file_provider.list('data').then(function(items){
      var prom_list = {};
      for(var i in items){
        var item = items[i];
        // if does not contain . load it
        if(item.indexOf('.') == -1){
          prom_list[item] = mod_exports.get(item,false);
        }
      }
      return Promise.props(prom_list);
    });
  },
  delete: function(id){
    logger.debug('Delete project '+id);
    return file_provider.rmdir('data\\' + id);
  },
    // get details from the metadata
  get: function(id,load_versions) {
    load_versions = typeof load_versions  !== 'undefined' ?  load_versions  : true;

    logger.debug('get project '+id);
    var prom_metadata = file_provider.read('data\\' + id + '\\metadata.json');

    // placeholder if not needed
    var prom_versions = Promise.resolve({});
    if(load_versions){
      prom_versions = file_provider.read('data\\' + id + '\\versions.json');
    }

    return Promise.props({
      metadata: prom_metadata,
      versions: prom_versions
    }).then(function(data){
      data.setup_complete = false;
      if( data.metadata.git &&
          data.metadata.git.url &&
          data.metadata.git.user &&
          data.metadata.git.pass &&
          data.metadata.git.branch
        ){
        data.setup_complete = true;
      }
      return Promise.resolve(data);
    });
    //ANONYMIZE
  },
  get_version: function(id,id_version) {
    logger.debug('get_version project '+id);
    return mod_exports.get(id)
    .then(function(data){
      return Promise.resolve(data.versions[id_version]);
    });
  },
  add_version: function(id, data){
    logger.debug('add_version project '+id);
    return mod_exports.get(id)
      .then(function(orginal_data){
        var orginal_versions = orginal_data.versions;
        var orginal_metadata = orginal_data.metadata;
        orginal_metadata.latest++;
        orginal_versions[orginal_metadata.latest] = data;
        var write_version = file_provider.write('data\\' + id + '\\versions.json',orginal_versions);
        var write_metadata = file_provider.write('data\\' + id + '\\metadata.json',orginal_metadata);
        return Promise.all([write_version,write_metadata]);
      });
  }
};

module.exports = mod_exports;
