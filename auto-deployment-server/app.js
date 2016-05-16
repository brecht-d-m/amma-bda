var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');

var app = express();
var io = require('socket.io')();
app.io = io;

var exec = require('child_process').exec;

io.on('connection', function (socket) {
  // Send status
  socket.emit("status", {local: local.status, cloud: cloud.status});
  // Send notebooks to client
  socket.on('getnotebooks', function (data) {
    if (data.instance == local.location) { retriever.send_notebooks(local, socket, data.user); }
    else { retriever.send_notebooks(cloud, socket, data.user); }
  });
  // Client requests notebook shutdown
  socket.on('shutdown', function (data) {
    var shutdownurl;
    if (data.location == local.location) { shutdownurl = local.url + "api/sessions/" + data.sessionid; }
    else { shutdownurl = cloud.url + "api/sessions/" + data.sessionid; }
    // TODO: reply to client if succesful/unsuccesful ?
    var cookie = "datalab_user=" + data.user + " ";
    exec('curl -X DELETE --cookie ' + cookie + shutdownurl,function (error, stdout, stderr) {
    });
  });
});

retriever = require('./bin/notebook_retriever.js');

var local = {location: "local", url: "", status: "?"}, cloud = {location: "cloud", url: "", status: "?"};
local.url = "http://localhost:8081/";
cloud.url = "https://datalab-dot-propane-bearing-124123.appspot.com/";


setInterval( function(){
  updateStatus(local);
  updateStatus(cloud);
  io.sockets.emit("status", {local: local.status, cloud: cloud.status});
}, 5000);

function updateStatus(instance){
  exec('wget -q -O - "$@" ' + instance.url + "_ah/health",function (error, stdout, stderr) {
        if (stdout == "ok") instance.status = "ok";
        else {
          instance.status = "down";
        }
      });
}
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/init-gcloud', routes);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,HEADER');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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
  console.log(err.message)
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
