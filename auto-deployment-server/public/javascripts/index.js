var socket = io.connect('http://localhost:3000');

socket.on('notebook', function (data) {
    var row = document.createElement("tr");
	var linkitem = document.createElement("td");
    var optionsitem = document.createElement("td");

    var link = document.createElement("a");
	link.innerHTML = data.name;
	link.setAttribute("href", data.path);
    optionsitem.innerHTML = "X";

    linkitem.appendChild(link);
    row.appendChild(linkitem);
    row.appendChild(optionsitem);
    var listid = data.location + "-notebooklist";
	document.getElementById(listid).appendChild(row);
});

function getLocalNotebooks() {
    getNotebooks("local");
}

function getCloudNotebooks() {
    getNotebooks("cloud");
}

function getNotebooks(location) {
	socket.emit('getnotebooks', {instance: location});
}

$(document).ready(function() {
	$("#retrieve-local-notebooks").bind("click", getLocalNotebooks);
    $("#retrieve-cloud-notebooks").bind("click", getCloudNotebooks);
});