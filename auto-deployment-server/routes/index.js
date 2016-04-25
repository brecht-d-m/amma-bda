var express = require('express');
var bodyParser = require("body-parser");
var sys = require('sys')
var fs = require('fs');
var exec = require('child_process').exec;
var child;
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'AMMA - Project Big Data' });
});

/*router.get('/getNotebooks', function (req, res) {
	fs.readFile( __dirname + "/../data/" + "notebooks.json", 'utf8', function (err, data) {
		console.log( data );
		res.end( data );
	});
});

router.get('/getNotebook/:notebook_name', function (req, res) {
	// First read existing users.
	fs.readFile( __dirname + "/../data/" + "notebooks.json", 'utf8', function (err, data) {
		notebooks = JSON.parse( data );
		var nb = notebooks[req.params.notebook_name]
		console.log( nb );
		res.end( JSON.stringify(nb));
	});
});*/

/* POST init gcloud page. */
router.post('/run-local', function(req, res) {
	console.log(req.body.googleCloudProject);
	projectId = req.body.googleCloudProject;
    loc = "local";

	// executes "gcloud auth init"
	child = exec("gcloud auth login", function (error, stdout, stderr) {
		sys.print('stdout: ' + stdout);
		sys.print('stderr: ' + stderr);
		if (error == null) {
			execSetProject(projectId, res, loc);
		}
	});
});

router.post('/run-gcloud', function(req, res) {
	console.log(req.body.googleCloudProject);
	projectId = req.body.googleCloudProject;
    loc = "gcloud";

	// executes "gcloud auth init"
	child = exec("gcloud auth login", function (error, stdout, stderr) {
		sys.print('stdout: ' + stdout);
  		sys.print('stderr: ' + stderr);
  		if (error == null) {
    		execSetProject(projectId, res, loc);
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
  		}
	});
};

var startProject = function(res, loc) {
    if(loc == 'local') {
        child = exec("source /usr/share/datalab/start-amma-bda.sh", function (error, stdout, stderr) {
            sys.print('stdout: ' + stdout);
            sys.print('stderr: ' + stderr);
            if (error == null) {
                res.send("POST request succeeded");
            } else {
                console.log("ERROR");
            }
        });
    } else if(loc == 'gcloud') {
        child = exec("source /usr/share/datalab/start-amma-bda-gcloud.sh", function (error, stdout, stderr) {
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
