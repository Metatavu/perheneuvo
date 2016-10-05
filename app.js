var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var http = require('http');
var fs = require('fs');
var config = require('./config.js');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var db = require('./config/database');
var flash = require('connect-flash');

var app = express();

mongoose.connect(db.getDbUrl());
require('./config/passport')(passport);

app.set('port', config.port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser());
app.use(session({
  secret : config.sessionSecret
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./routes')(app, passport);

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
