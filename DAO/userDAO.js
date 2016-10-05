var User = require('../model/user');

exports.create = function(email, password, role, callback){
  User.findOne({
    'email' : email
  }, function(err, user) {
    if(err)
      throw err;
    
    if(user)
      throw 'Email exists already';
    
    var newUser = new User();
    newUser.email = email;
    newUser.password = newUser.generateHash(password);
    newUser.role = role;
    
    newUser.save(function(err, user){
      if(err)
        throw err;
      
      callback(user);
    });
    
  });
};


exports.findById = function(id, callback) {
  User.findOne({
    _id : id
  }, function(err, user) {
    if (err)
      throw err;
    
    callback(user);
  });
};

exports.findByEmail = function(email, callback) {
  User.findOne({
    email : email
  }, function(err, user) {
    if (err)
      throw err;
      
    callback(user);
  });
};

exports.list = function(callback) {
  User.find({
    archieved: false
  }).select('email role').exec(function(err, users) {
    if (err)
      throw err;

    callback(users);
  });
};

exports.archieve = function(id, callback){
  exports.findById(id, function(user){
    user.archieved = true;
    user.save(function(err, user){
      callback(user);
    });
  });
};

exports.updatePassword = function(id, password, callback) {
  exports.findById(id, function(user){
    user.password = user.generateHash(password);
    user.newuser = false;
    user.save(function(err, user) {
      if (err)
        throw err;

      callback(user);
    });
  });
};