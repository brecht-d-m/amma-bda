var socket = io.connect('http://localhost:3000');

socket.on('notebook', function (data) {
	console.log(data)
	var li = document.createElement("li");
	var link = document.createElement("a");
	link.innerHTML = data.name;
	link.setAttribute("href", data.path);
	li.appendChild(link);
	document.getElementById("notebooklist").appendChild(li);
});

function getNotebooks() {
	socket.emit('getnotebooks');
}

$(document).ready(function() {
	$("#retrieve-notebooks").bind("click", getNotebooks);
});