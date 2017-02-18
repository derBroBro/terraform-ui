//var path = require('path');
//var appDir = path.dirname(require.main.filename);

var chai = require('chai');
const projects = require('../lib/projects.js');

chai.should();
chai.use(require('chai-as-promised'));

describe('projects', function() {
  describe('get',function(){
    it('should be fullfilled',function(){
      return projects.get('test').should.be.fulfilled;
    });

    it('should have data',function(){
      var projects_promise = projects.get('test');
      return Promise.all([
        projects_promise.should.eventually.all.have.property('metadata'),
        projects_promise.should.eventually.all.have.property('versions')
      ]);
    });

  });
});
