var socket = io.connect('http://localhost:3000');

socket.on('notebook', function (data) {
	var li = document.createElement("li");
	var link = document.createElement("a")
	link.innerHTML = data.name;
	link.setAttribute("href", data.path);
	li.appendChild(link)
	document.getElementById("notebooklist").appendChild(li);
})

socket.on('status', function (data) {
	var label = document.getElementById("datalab-status");
	if (data.status == "ok"){
		label.innerText = "Running"
		label.className = "label label-success"
	} else {
		label.innerText = data.status
		label.className = "label label-danger"
	}
})

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

function getNotebooks() {
	socket.emit('getnotebooks');
}

$(document).ready(function() {
		//urlExists();
	$("#google-cloud-project-id-submit").bind("click", bootFunc);
	$("#retrieve-notebooks").bind("click", getNotebooks);
	socket.emit('getstatus');
	setInterval(function(){ socket.emit('getstatus') }, 5000);
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
