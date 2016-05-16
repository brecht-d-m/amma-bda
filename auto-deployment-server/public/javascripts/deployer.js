var canDeploy = true;
var authenticated = false;
var authMail = null;
var deployLink = 'http://localhost:8081/';

var runLocalFunc = function() {
	if (canDeploy && authenticated) {
		googleProjectId = $("#gcloud-id-input").val();
		// Create data post request
		googleProjectData = new Object();
		googleProjectData.googleCloudProject = googleProjectId;
		deployLink = 'http://localhost:8081/';
		$('#deploymentLink').html('Please wait. This could take a while.<br>Your deployment link will appear here when the process has completed.');
		canDeploy = false;
		updateDeployButtons();

		// Send post request
		$.post("/run-local", googleProjectData, function (data, status) {
			console.log("DATA: " + data);
			if (data == "START") {
				$('#deployCmd').html("&gt; ");
				setTimeout(function () {
					getCmd();
				}, 3000);
			}
		});
	}
};

var runGCloudFunc = function() {
	if (canDeploy && authenticated) {
		googleProjectId = $("#gcloud-id-input").val();
		// Create data post request
		googleProjectData = new Object();
		googleProjectData.googleCloudProject = googleProjectId;
		deployLink = 'https://datalab-dot-' + googleProjectId + '.appspot.com/';
		$('#deploymentLink').html('Please wait. This could take up to 10 minutes.<br>Your deployment link will appear here when the process has completed.');
		canDeploy = false;
		updateDeployButtons();

		// Send post request
		$.post("/run-gcloud", googleProjectData, function (data, status) {
			console.log("DATA: " + data);
			if (data == "START") {
				$('#deployCmd').html("&gt; ");
				setTimeout(function () {
					getCmd();
				}, 3000);
			}
		});
	}
};

var clickAuth = function() {
	if(!authenticated || authMail == null) {
		$("#authModal").modal();
	} else {
		sendAuthRevoke();
	}
}

var getAuthCode = function() {
	var link = document.getElementById("authLink");
	link.innerText = "Generating...";
	link.setAttribute("href", "#");
	$('#authButton').prop('disabled', true);
	$('#authCode').val('');

	$.get("/startAuth", null, function(data, status) {
		console.log("DATA: " + data);
		link.innerText = data.toString();
		link.setAttribute("href", data.toString());
	});
};

var getAuthName = function() {
	var authText = $('#authText');
	var authAlert = $('#authAlert');
	var authModalButton = $('#authModalButton');
	var notebookListNav = $('#notebookListNav');

	$.get("/getAuthName", null, function(data, status) {
		console.log("DATA: " + data)
		receivedData = data.toString();
		authModalButton.prop('disabled', false);
		if(receivedData == 'NONE') {
			authenticated = false;
			authMail = null;
			updateDeployButtons();
			if(authAlert.hasClass('alert-info')) authAlert.removeClass('alert-info');
			if(!authAlert.hasClass('alert-warning')) authAlert.addClass('alert-warning');
			authText.html("You are <strong>not authenticated.</strong>");
			authModalButton.html('Authenticate');
			if(authModalButton.hasClass('btn-primary')) authModalButton.removeClass('btn-primary');
			if(!authModalButton.hasClass('btn-warning')) authModalButton.addClass('btn-warning');
		} else {
			authenticated = true;
			authMail = receivedData;
			updateDeployButtons();
			if(authAlert.hasClass('alert-warning')) authAlert.removeClass('alert-warning');
			if(!authAlert.hasClass('alert-info')) authAlert.addClass('alert-info');
			authText.html("You are authenticated as <strong>" + receivedData + "</strong>");
			authModalButton.html('Sign out');
			if(authModalButton.hasClass('btn-warning')) authModalButton.removeClass('btn-warning');
			if(!authModalButton.hasClass('btn-primary')) authModalButton.addClass('btn-primary');
			notebookListNav.attr("href", "/notebookList?user=" + authMail);
		}
	});
};

var getCmd = function() {
	var deployCmd = $('#deployCmd');

	$.get("/deployCmd", null, function(data, status) {
		console.log("DATA: " + data)
		receivedData = data.toString();
		if(receivedData == 'NONE') {
			setTimeout(function(){
				getCmd();
			}, 3000);
		} else if(receivedData == 'DONE') {
			deployCmd.append('Process finished.');
			deployCmd.scrollTop(deployCmd[0].scrollHeight);
			canDeploy = true;
			deployText = "Your deployment is now accessible here:<br><a href=\"" + deployLink + "\" target=\"_blank\">" + deployLink + "</a>";
			$('#deploymentLink').html(deployText);
			updateDeployButtons();
		} else {
			deployCmd.append(receivedData);
			deployCmd.scrollTop(deployCmd[0].scrollHeight);
			setTimeout(function(){
				getCmd();
			}, 3000);
		}
	});
};


var sendAuthCode = function() {
	authCode = $('#authCode').val();
	$('#authButton').prop('disabled', true);
	$('#authCode').val('');
	$("#authModal").modal('hide');
	// Create data post request
	authData = new Object();
	authData.authCode = authCode;
	// Send post request
	$.post("/authCode", authData, function(data, status) {
		console.log("DATA: " + data);
		setTimeout(function(){
			getAuthName();
		}, 2000);
	});
};

var sendAuthRevoke = function() {
	authCode = $('#authCode').val();
	$('#authModalButton').prop('disabled', true);
	$('#authCode').val('');
	$("#authModal").modal('hide');
	// Create data post request
	authData = new Object();
	authData.authMail = authMail;
	// Send post request
	$.post("/authRevoke", authData, function(data, status) {
		console.log("DATA: " + data);
		setTimeout(function(){
			getAuthName();
		}, 2000);
	});
};

$(document).ready(function() {
		//urlExists();
	$("#run-local-submit").bind("click", runLocalFunc);
	$("#run-gcloud-submit").bind("click", runGCloudFunc);
	$("#authModalButton").bind("click", clickAuth);

	$('#authButton').prop('disabled', true);
	$('#authCode').keyup(function() {
		if($(this).val() != '') {
			$('#authButton').prop('disabled', false);
		} else {
			$('#authButton').prop('disabled', true);
		}
	});

	// AUTHENTICATION
	getAuthName();
	$('#authModal').on('show.bs.modal', function (e) { getAuthCode(); });
	$("#authButton").bind("click", sendAuthCode);
	//$('#authModal').on('hide.bs.modal', function (e) { });
});

function urlExists(){
	$.ajax({
		type: 'HEAD',
		url: 'http://localhost:8081',
		success: function(){
			window.open(
		  		'http://localhost:8081',
		  		'_blank' 
			);
		},
		error: function() {
			console.log("Checking");
			setTimeout(continueExecution, 2000)
		}
	  });
}

function continueExecution() {
   urlExists();
}

var updateDeployButtons = function() {
	console.log('updating deploy buttons');
	$("#run-local-submit").prop('disabled', !canDeploy || !authenticated);
	$("#run-gcloud-submit").prop('disabled', !canDeploy || !authenticated);
}
