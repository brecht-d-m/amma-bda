var express = require('express');
var bodyParser = require("body-parser");
var sys = require('sys')
var fs = require('fs');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var child;
var workingPs = null;
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.redirect('/notebookList/');
});

router.get('/notebookList/', function(req, res, next) {
  res.render('index', { title: 'Datatonic', script: 'index' });
});

/* GET deployer page. */
router.get('/deployer/', function(req, res, next) {
	res.render('deployer', { title: 'Datatonic - Datalab Deployer', script: 'deployer' });
});

/* POST init gcloud page. */
router.post('/run-local', function(req, res) {
	console.log(req.body.googleCloudProject);
	projectId = req.body.googleCloudProject;
    loc = 'local';

	// executes "gcloud auth init"
	child = exec("gcloud auth login", function (error, stdout, stderr) {
		sys.print('stdout: ' + stdout);
		sys.print('stderr: ' + stderr);
		if (error == null) {
			execSetProject(projectId, res, loc);
		}
	});
});

router.get('/startAuth', function(req, res) {
	// End any existing processes
	if(workingPs != null) {
		console.log("NOT NULL?!?")
		workingPs.kill();
		workingPs = null;
	}
	// Create new process
	ps = spawn('gcloud', ['auth', 'login', '--no-launch-browser']);

	ps.stdout.on('data', function(output){
		console.log("STDOUT:" + output);
	});

	ps.on('error', function( err ){
		console.log("ERROR:" + err.message);
	});

	ps.on('close', function(){
		console.log('Finished');
	});

	//Error handling
	ps.stderr.on('data', function(err){
		strErr = err.toString();
		index = strErr.indexOf('https');
		if(index > -1) {
			// It's a URL!
			console.log(index);
			strUrl = strErr.substr(index).trim();
			console.log(strUrl);
			workingPs = ps;
			res.send(strUrl);
			//ps.stdin.write("Yep\n");
		} else {
			console.log("STDERR:" + err);
		}
	});
});

router.post('/authCode', function(req, res) {
	console.log(req.body.authCode);
	authCode = req.body.authCode;

	if(workingPs == null || authCode == null || authCode == '') {
		console.log("ERROR: Bad auth code: " + authCode);
		return;
	}
	workingPs.stdin.write(authCode + "\n");
	workingPs.disconnect();
	workingPs = null;
});

router.post('/run-gcloud', function(req, res) {
	console.log(req.body.googleCloudProject);
	projectId = req.body.googleCloudProject;
    loc = 'gcloud';

	// executes "gcloud auth init"
	child = exec("gcloud auth login", function (error, stdout, stderr) {
		sys.print('stdout: ' + stdout);
  		sys.print('stderr: ' + stderr);
  		if (error == null) {
    		execSetProject(projectId, res, loc);
  		} else {
			console.log("Error: authentication failed.");
		}
	});
});

var execSetProject = function(projectId, res, loc) {
	// executes "gcloud config set project"
	child = exec("gcloud config set project " + projectId, function (error, stdout, stderr) {
		sys.print('stdout: ' + stdout);
  		sys.print('stderr: ' + stderr);
  		if (error == null) {
			startProject(res, loc);
  		} else {
			console.log("Error: setting project failed.");
		}
	});
};

var startProject = function(res, loc) {
    if(loc == 'local') {
        child = exec("/usr/share/datalab/start-amma-bda.sh", function (error, stdout, stderr) {
            sys.print('stdout: ' + stdout);
            sys.print('stderr: ' + stderr);
            if (error == null) {
                res.send("POST request succeeded");
            } else {
                console.log("ERROR");
            }
        });
    } else if(loc == 'gcloud') {
        child = exec("/usr/share/datalab/start-amma-bda-gcloud.sh", function (error, stdout, stderr) {
            sys.print('stdout: ' + stdout);
            sys.print('stderr: ' + stderr);
            if (error == null) {
                res.send("POST request succeeded");
            } else {
                console.log("ERROR");
            }
        });
    }
};

module.exports = router;
