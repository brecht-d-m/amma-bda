var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');

var app = express();
var io = require('socket.io')();
var request = require('request');
app.io = io;


io.on('connection', function (socket) {
  socket.emit("status", {local: local.status, cloud: cloud.status});
  socket.on('getnotebooks', function () {
    retriever.send_notebooks(local.url, socket);
  });
});

retriever = require('./bin/notebook_retriever.js');

var local = {url: "", status: "?"}, cloud = {url: "", status: "?"};
local.url = "http://localhost:8081/";
cloud.url = "https://datalab-dot-propane-bearing-124123.appspot.com/";

setInterval( function(){
  updateStatus(local);
  updateStatus(cloud);
  io.sockets.emit("status", {local: local.status, cloud: cloud.status});
}, 5000);

function updateStatus(instance){
  request(instance.url + "_ah/health", function(error, response, body) {
    if(error == null){
      if(response.body != "ok") { instance.status = "?"}
      else { instance.status = response.body; }
    } else {
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
