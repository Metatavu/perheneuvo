var ResetToken = require('../model/resetToken');

var TOKEN_LIFETIME = 3600000;

exports.create = function(user_id, callback, expires){ //TODO: fix dirty and ugly hack
  var resetToken = new ResetToken();
  resetToken.user_id = user_id;
  resetToken.token = resetToken.generateToken();
  resetToken.expires = typeof(expires) === 'undefined' ? new Date().getTime() + TOKEN_LIFETIME : expires;
  resetToken.save(function(err, resetToken){
    if(err)
      throw err;
    
    callback(resetToken);
  });
};

exports.findByToken = function(token, callback){
  ResetToken.findOne({
    token: token
  }, function(err, resetToken){
    if(err)
      throw err;
    
    callback(resetToken);
  });
};