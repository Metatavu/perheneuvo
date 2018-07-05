var SERVER_ROOT = '';

exports.index = function(req, res) {
  res.render('index', { root: SERVER_ROOT });
};

exports.adminindex = function(req, res) {
  res.render('adminindex', {
    user : req.user,
    root: SERVER_ROOT
  });
};

exports.login = function(req, res) {
  res.render('login', {
    message : req.flash('loginMessage'),
    root: SERVER_ROOT
  });
};

exports.statistics = function(req, res) {
  res.render('statistics', {
    user : req.user,
    root: SERVER_ROOT
  });
};

exports.adminform = function(req, res) {
  res.render('adminform', {
    user : req.user,
    root: SERVER_ROOT
  });
};

exports.forgotPassword = function(req, res) {
  res.render('forgotpassword', {root: SERVER_ROOT});
};

exports.changepassword = function(req, res) {
  res.render('setpassword', {root: SERVER_ROOT});
};