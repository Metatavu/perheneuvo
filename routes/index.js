var common = require('./components/common');
var user = require('./components/user');
var flag = require('./components/flag');

var SERVER_ROOT = '';

module.exports = function(app, passport) {

  function authenticate(allowedRoles) {
    return function(req, res, next) {
      if (req.isAuthenticated()) {
        var role = req.user.role;
        if(allowedRoles.indexOf(role) != -1){
          next();
        }else{
          res.status(403).send('Go away!');
        }
      } else {
        res.redirect('/login');
      }
    };
  }

  /** Common routes * */
  app.get(SERVER_ROOT, common.index);
  app.get(SERVER_ROOT+'/admin', authenticate(['manager', 'admin']), common.adminindex);
  app.get(SERVER_ROOT+'/statistics', authenticate(['manager', 'admin']), common.statistics);
  app.get(SERVER_ROOT+'/login', common.login);
  app.get(SERVER_ROOT+'/forgotpassword', common.forgotPassword);
  app.get(SERVER_ROOT+'/changepass', authenticate(['manager', 'admin']), common.changepassword);

  /** User routes **/
  app.post(SERVER_ROOT+'/login', user.login);
  app.post(SERVER_ROOT+'/signup', authenticate(['admin']), user.create);
  app.get(SERVER_ROOT+'/user/list',authenticate(['admin']), user.list);
  app.post(SERVER_ROOT+'/user/archieve', authenticate(['admin']), user.archieve);
  app.get(SERVER_ROOT+'/logout', user.logout);
  app.post(SERVER_ROOT+'/forgotpassword', user.forgotpassword);
  app.get(SERVER_ROOT+'/resetpassword/:token', user.resetpassword);
  app.post(SERVER_ROOT+'/setpasstoken', user.setpassToken);
  app.post(SERVER_ROOT+'/setpass',authenticate(['manager', 'admin']), user.setpass);
  app.get(SERVER_ROOT+'/user/manage', authenticate(['admin']), user.manage);
  app.get(SERVER_ROOT+'/user/get/:id', authenticate(['admin', 'manager']), user.get);

  /** Flag routes **/
  app.post(SERVER_ROOT+'/flag', flag.create);
  app.post(SERVER_ROOT+'/flag/process', authenticate(['admin', 'manager']), flag.process);
  app.get(SERVER_ROOT+'/flag/listbystate/:state',authenticate(['admin', 'manager']), flag.listByState);
  app.get(SERVER_ROOT+'/flag/list/all', authenticate(['admin', 'manager']), flag.list);
  app.get(SERVER_ROOT+'/flag/list/:start/:end', authenticate(['admin', 'manager']), flag.listByCreatedRange);

};
