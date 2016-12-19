var passport = require('passport');
var userDAO = require('../../DAO/userDAO');
var resetTokenDAO = require('../../DAO/resetTokenDAO');
var generatePassword = require('password-generator');
var mailer = require('../../services/mailer/mailer');
var SERVER_ROOT = '';

exports.login = passport.authenticate('local-login', {
  successRedirect : SERVER_ROOT+'/admin',
  failureRedirect : SERVER_ROOT+'/login',
  failureFlash : false
});

exports.create = function(req, res) {
  var email = req.body.email;
  var password = generatePassword(12, false);
  var role = req.body.role;
  userDAO.create(email, password, role, function(user){
    resetTokenDAO.create(user._id, function(resetToken){
      var resetUrl = 'https://'+req.headers.host+SERVER_ROOT+'/resetpassword/'+encodeURIComponent(resetToken.token);
      mailer.sendMail(email, 'Perheneuvo - käyttäjätili', 'Sinulle on luotu käyttäjätili perheneuvo sovellukseen käy aktivoimassa tilisi osoitteessa: ' +
          resetUrl + ' Tämä kutsu vanhenee 48 tunnin kuluttua.');
      res.redirect(SERVER_ROOT+'/user/manage');
    }, new Date().getTime()+ 172800000);
  });
};

exports.list = function(req, res) {
  userDAO.list(function(users) {
    res.send(users);
  });
};

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

exports.manage = function(req, res){
  res.render('usermanagement', {user : req.user, root: SERVER_ROOT});
};

exports.archieve = function(req, res){
  var id = req.body.id;
  userDAO.archieve(id, function(user){
    res.send(user);
  });
};

exports.get = function(req, res){
  var id = req.param('id');
  userDAO.findById(id, function(user){
    delete user.password; //Don't transfer password
    res.send(user);
  });
};

exports.forgotpassword = function(req, res) {
  var email = req.body.email;
  userDAO.findByEmail(email, function(user){
    if(typeof(user) !== 'undefined'){
      resetTokenDAO.create(user._id, function(resetToken){
        var resetUrl = 'https://'+req.headers.host+SERVER_ROOT+'/resetpassword/'+encodeURIComponent(resetToken.token);
        mailer.sendMail(email, 'Salasanan palautus', 'Olet pyytänyt salasanasi palautusta perheneuvo palvelussa, voit palauttaa salasanasi menemällä osoitteeseen: ' +
            resetUrl + ' Jos et ole pyytänyt salasanan palautusta, voit jättää tämän viestin huomiotta.');
        res.send('success');
      });
    }else{
      res.status(400).send('Sähköpostilla: '+email+' ei löytynyt käyttäjää');
    }
  });
};

exports.resetpassword = function(req, res){
  var token = req.param('token');
  resetTokenDAO.findByToken(token, function(resetToken){
    if(resetToken.isValid(token)){
      res.render('resetpassword', { token : resetToken.token, root: SERVER_ROOT });
    }else{
      res.status(403).send('Go away!');
    }
  });
};

exports.setpassToken = function(req, res) {
  var pass = req.body.pass;
  if (req.body.pass2 !== pass) {
    res.status(400).send('passwords dont match');
  } else {
    resetTokenDAO.findByToken(req.body.token, function(resetToken){
      userDAO.updatePassword(resetToken.user_id, pass, function(user) {
        res.redirect(SERVER_ROOT+'/login');
      });
    });
  }
};

exports.setpass = function(req, res) {
  var oldpass = req.body.old_pass;
  var pass = req.body.pass;
  if (req.body.pass2 !== pass) {
    res.status(400).send('passwords dont match');
  } else {
    userDAO.findById(req.user._id, function(user){
      if(user.validPassword(oldpass)){
        userDAO.updatePassword(user._id, pass, function(user) {
          res.redirect(SERVER_ROOT+'/admin');
        });
      }else{
        res.status(403).send('wrong password');
      }
    });
  }
};
