function bootFunc() {
	googleProjectId = $("#google-cloud-project-id-input").val();
	// Create data post request
	googleProjectData = new Object();
	googleProjectData.googleCloudProject = googleProjectId;

	// Send post request
	$.post("/init-gcloud", googleProjectData, function (data, status) {
		console.log("DATA: " + data);

		window.open(
			'http://localhost:8081',
			'_blank'
		);
	});
}

function retrieveFunc(){
	$.get("/notebooks");
}

$(document).ready(function() {
		//urlExists();
	$("#google-cloud-project-id-submit").bind("click", bootFunc);
	$("#retrieve-notebooks").bind("click", retrieveFunc);
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
