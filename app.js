var express = require('express');
var https = require('https');
var fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var apis = require('./routes/apis');

var http_host = (process.env.VCAP_APP_HOST || '0.0.0.0');
var http_port = (process.env.VCAP_APP_PORT || 7000);



var hskey = fs.readFileSync('server-key.pem');
var hscert = fs.readFileSync('server-cert.pem');


//var file = fs.readFile('test.txt')

fs.readFile('test.txt', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  console.log(data);
});

var options = {
    hostname: http_host,
    port: http_port,
    key: hskey,
    cert: hscert,
    ca: [ fs.readFileSync('client-cert.pem') ],
    requestCert:        true,
    rejectUnauthorized: true 
};

var app = express();
app.set('port', http_port);
app.set('host',http_host);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');



// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/api/system', apis);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


var httpsserver = https.createServer(options, app).listen(http_port);
console.log("server started");
console.log(httpsserver.address().address);
console.log(httpsserver.address().port);
//var server = app.listen(app.get('port'), app.get('host'), function() {
// console.log('Express server listening on ' + server.address().address + ':' + server.address().port);
//});

module.exports = app;
