var socket = io.connect('http://localhost:3000');

socket.on('notebook', function (data) {
	var li = document.createElement("li");
	var link = document.createElement("a");
	link.innerHTML = data.name;
	link.setAttribute("href", data.path);
	li.appendChild(link);
	document.getElementById("notebooklist").appendChild(li);
});

socket.on('status', function (data) {
	var label = document.getElementById("datalab-status");
	if (data.status == "ok"){
		label.innerText = "Running";
		label.textContent = "Running";
		label.className = "label label-success";
	} else {
		label.innerText = data.status;
		label.textContent = data.status;
		label.className = "label label-danger";
	}
});

function getNotebooks() {
	socket.emit('getnotebooks');
}

$(document).ready(function() {
	$("#retrieve-notebooks").bind("click", getNotebooks);
	socket.emit('getstatus');
	setInterval(function(){ socket.emit('getstatus') }, 5000);
});