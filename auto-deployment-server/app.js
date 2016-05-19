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
retriever = require('./bin/notebook_retriever.js');

// variables for the local and cloud deployment
var local = {location: "local", url: "", status: "?"}, cloud = {location: "cloud", url: "", status: "?"};
local.url = "http://localhost:8081/";
cloud.url = "https://datalab-dot-propane-bearing-124123.appspot.com/";

setInterval( function(){  // every 5 seconds, poll the servers for their status and broadcast it to all clients
  updateStatus(local);
  updateStatus(cloud);
  io.sockets.emit("status", {local: local.status, cloud: cloud.status});
}, 5000);

function updateStatus(instance){  // check if deployments are running
  exec('wget -q -O - "$@" ' + instance.url + "_ah/health",function (error, stdout, stderr) {
    if (stdout == "ok") instance.status = "ok";
    else {
      instance.status = "down";
    }
  });
}

io.on('connection', function (socket) {
  socket.emit("status", {local: local.status, cloud: cloud.status});    // Send status
  
  socket.on('getnotebooks', function (data) {    // Send notebooks to client on request
    if (data.instance == local.location) { retriever.send_notebooks(local, socket, data.user); }
    else { retriever.send_notebooks(cloud, socket, data.user); }
  });
  
  socket.on('shutdown', function (data) {  // Client requests notebook shutdown
    var shutdownurl;
    if (data.location == local.location) { shutdownurl = local.url + "api/sessions/" + data.sessionid; }
    else { shutdownurl = cloud.url + "api/sessions/" + data.sessionid; }
    // TODO: reply to client if succesful/unsuccesful ?
    var cookie = "datalab_user=" + data.user + " ";  // cookie needed to give user access to sessions
    exec('curl -X DELETE --cookie ' + cookie + shutdownurl,function (error, stdout, stderr) {
    });
  });
});

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

module.exports.setCloudURL = function(projectID) {
  var newCloudURL = "https://datalab-dot-" + projectID + ".appspot.com/";
  console.log("Setting cloud URL to: " + newCloudURL);
  if(newCloudURL != cloud.url) {
    cloud.url = newCloudURL;
    updateStatus(local);
    updateStatus(cloud);
    io.sockets.emit("status", {local: local.status, cloud: cloud.status});
  }
};