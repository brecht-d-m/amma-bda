var express = require('express');
var bodyParser = require("body-parser");
var sys = require('sys')
var fs = require('fs');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var child;
var authPs = null;
var deployPs = null;
var router = express.Router();
var cmdOutput = "";

/* GET home page. */
router.get('/', function(req, res, next) {
	res.redirect('/deployer/');
});

router.get('/notebookList/', function(req, res, next) {
  res.render('index', { title: 'Datatonic', script: 'index', pgName: 'notebookList' });
});

/* GET deployer page. */
router.get('/deployer/', function(req, res, next) {
	res.render('deployer', { title: 'Datatonic - Datalab Deployer', script: 'deployer', pgName: 'deployer' });
});

/* ----------- AUTHENTICATION ----------- */
router.get('/getAuthName', function(req, res) {
	child = exec("gcloud auth list --format text", function (error, stdout, stderr) {
		output = stdout.toString();
		index = output.indexOf('active_account:');
		if(index > -1) {
			strName = output.substr(index+15).trim();
			index2 = output.indexOf('\n');
			if(index2 > -1) strName = strName.substr(0, index2).trim();
			console.log("Active account is: " + strName);
			res.send(strName);
		} else {
			res.send("NONE");
		}
	});
});

router.get('/startAuth', function(req, res) {
	// End any existing processes
	if(authPs != null) {
		console.log("NOT NULL?!?")
		authPs.kill();
		authPs = null;
	}
	// Create new process
	ps = spawn('gcloud', ['auth', 'login', '--no-launch-browser']);

	ps.stdout.on('data', function(output){ console.log("STDOUT:" + output); });
	ps.on('error', function( err ){ console.log("ERROR:" + err.message); });
	ps.on('close', function(){ console.log('Authentication finished'); });

	//Error handling
	ps.stderr.on('data', function(err){
		strErr = err.toString();
		index = strErr.indexOf('https');
		if(index > -1) {
			// It's a URL!
			console.log(index);
			strUrl = strErr.substr(index).trim();
			console.log(strUrl);
			authPs = ps;
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

	if(authPs == null || authCode == null || authCode == '') {
		console.log("ERROR: Bad auth code: " + authCode);
		res.end("ERROR");
		return;
	}
	authPs.stdin.write(authCode + "\n");
	res.end("Authenticated");
	authPs = null;
});

router.post('/authRevoke', function(req, res) {
	console.log(req.body.authMail);
	authMail = req.body.authMail;

	if(authMail == null || authMail == '') {
		console.log("ERROR: No mail specified.");
		res.end("ERROR");
		return;
	}
	child = exec("gcloud auth revoke " + authMail.trim(), function (error, stdout, stderr) {
		output = stdout.toString();
		console.log(output);
		res.end("Authentication revoked.");
	});
});


/* ----------- DEPLOYMENT ----------- */
router.post('/run-local', function(req, res) {
	console.log(req.body.googleCloudProject);
	projectId = req.body.googleCloudProject;

	child = exec("gcloud config set project " + projectId, function (error, stdout, stderr) {
		sys.print('stdout: ' + stdout);
		sys.print('stderr: ' + stderr);
		if (error == null) {
			// Create new process
			ps = spawn('/usr/share/datalab/deploy-local.sh');
			deployPs = ps;

			ps.stdout.on('data', function(output){
				strOut = output.toString();
				cmdOutput = cmdOutput + strOut + "<br>";
			});
			ps.on('error', function( err ){ console.log("ERROR:" + err.message); });
			ps.on('close', function(){ console.log('Local deployment finished'); ps = null; deployPs = null; });
			ps.stderr.on('data', function(err){
				strErr = err.toString();
				cmdOutput = cmdOutput + "<strong>" + strErr + "</strong><br>";
			});
			res.end("START");
		} else {
			console.log("Error: setting project failed.");
			res.end("ERROR");
		}
	});
});

router.post('/run-gcloud', function(req, res) {
	console.log(req.body.googleCloudProject);
	projectId = req.body.googleCloudProject;

	child = exec("gcloud config set project " + projectId, function (error, stdout, stderr) {
		sys.print('stdout: ' + stdout);
		sys.print('stderr: ' + stderr);
		if (error == null) {
			// Create new process
			ps = spawn('/usr/share/datalab/deploy-gcloud.sh', ['--repository', 'propane-bearing-124123']);
			deployPs = ps;

			ps.stdout.on('data', function(output){
				strOut = output.toString();
				cmdOutput = cmdOutput + strOut + "<br>";
			});
			ps.on('error', function( err ){ console.log("ERROR:" + err.message); });
			ps.on('close', function(){ console.log('Remote deployment finished'); ps = null; deployPs = null; });
			ps.stderr.on('data', function(err){
				strErr = err.toString();
				cmdOutput = cmdOutput + "<strong>" + strErr + "</strong><br>";
			});
			res.end("START");
		} else {
			console.log("Error: setting project failed.");
			res.end("ERROR");
		}
	});
});

router.get('/deployCmd', function(req, res) {
	if(cmdOutput != "") {
		strCmd = cmdOutput.toString();
		cmdOutput = "";
		res.send(strCmd);
	} else {
		if(deployPs == null) {
			res.send("DONE");
		} else {
			res.send("NONE");
		}
	}
});

module.exports = router;
