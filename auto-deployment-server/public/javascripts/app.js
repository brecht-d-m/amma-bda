$(document).ready(function() {
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

		//urlExists();
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

		//urlExists();
	};
	
	$("#run-local-submit").bind("click", runLocalFunc);
	$("#run-gcloud-submit").bind("click", runGCloudFunc);
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
