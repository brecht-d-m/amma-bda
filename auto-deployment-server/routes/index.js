var express = require('express');
var bodyParser = require("body-parser");
var sys = require('sys')
var exec = require('child_process').exec;
var child;
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'AMMA - Project Big Data' });
});

/* POST init gcloud page. */
router.post('/init-gcloud', function(req, res) {
	console.log(req.body.googleCloudProject);

	projectId = req.body.googleCloudProject

	// executes "gcloud auth init"
	child = exec("gcloud auth login", function (error, stdout, stderr) {
		sys.print('stdout: ' + stdout);
  		sys.print('stderr: ' + stderr);
  		if (error == null) {
    		execSetProject(projectId, res);
  		}
	});
});

var execSetProject = function(projectId, res) {
	// executes "gcloud config set project"
	child = exec("gcloud config set project " + projectId, function (error, stdout, stderr) {
		sys.print('stdout: ' + stdout);
  		sys.print('stderr: ' + stderr);
  		if (error == null) {
			startProject(res);
  		}
	});
};

var startProject = function(res) {
	child = exec("/usr/share/datalab/start-amma-bda.sh", function (error, stdout, stderr) {
		sys.print('stdout: ' + stdout);
  		sys.print('stderr: ' + stderr);
  		if (error == null) {
			res.send("POST request succeeded");
  		} else {
			console.log("ERROR");
		}
	});
};

module.exports = router;
