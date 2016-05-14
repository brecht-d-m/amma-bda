var runLocalFunc = function() {
	googleProjectId = $("#gcloud-id-input").val();
	// Create data post request
	googleProjectData = new Object();
	googleProjectData.googleCloudProject = googleProjectId;

	// Send post request
	$.post("/run-local", googleProjectData, function(data, status) {
		console.log("DATA: " + data);

		window.open(
			'http://localhost:8081',
			'_blank'
		);
	});
};

var runGCloudFunc = function() {
	googleProjectId = $("#gcloud-id-input").val();
	// Create data post request
	googleProjectData = new Object();
	googleProjectData.googleCloudProject = googleProjectId;

	// Send post request
	$.post("/run-gcloud", googleProjectData, function(data, status) {
		console.log("DATA: " + data);

		window.open(
			'https://cloud-datalab-deploy.appspot.com?container=gcr.io/cloud_datalab/datalab:amma',
			'_blank'
		);
	});
};

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

	$.get("/getAuthName", null, function(data, status) {
		console.log("DATA: " + data)
		receivedData = data.toString();
		if(receivedData == 'NONE') {
			if(authAlert.hasClass('alert-info')) authAlert.removeClass('alert-info');
			if(!authAlert.hasClass('alert-warning')) authAlert.addClass('alert-warning');
			authText.html("You are <strong>not authenticated.</strong>");
		} else {
			if(authAlert.hasClass('alert-warning')) authAlert.removeClass('alert-warning');
			if(!authAlert.hasClass('alert-info')) authAlert.addClass('alert-info');
			authText.html("You are authenticated as <strong>" + receivedData + "</strong>");
		}
	});
}

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

$(document).ready(function() {
		//urlExists();
	$("#run-local-submit").bind("click", runLocalFunc);
	$("#run-gcloud-submit").bind("click", runGCloudFunc);

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

function continueExecution()
{
   urlExists();
}
