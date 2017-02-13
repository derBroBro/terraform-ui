var mod_exports = function(vars){
  var tmp_text = JSON.stringify(vars);
  //tmp_text = tmp_text.replace(/AKI([A-Z0-9]{17})/g,"**********"); // access key
  tmp_text = tmp_text.replace(/ey":"([a-zA-Z0-9+\/]{40})"/g,'ey\":\"*********************************\"'); // secret key
  tmp_text = tmp_text.replace(/"pass":"(.[^"]*)"/g,'\"pass\":\"******\"'); // pass
  return JSON.parse(tmp_text);
};

module.exports = mod_exports;
