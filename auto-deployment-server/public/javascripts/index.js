var socket = io.connect('http://localhost:3000');

socket.on('notebook', function (data) {
    // ?view=codeView ?view=textView ?view=textOutputView
    var row = document.createElement("tr");
	var linkitem = document.createElement("td");
    var statusitem = document.createElement("td");
    var optionsitem = document.createElement("td");

    var link = document.createElement("a");
	link.innerHTML = data.name;
	link.setAttribute("href", data.path);
    var status = createNotebookStatus(data);


    optionsitem.innerHTML = "X";

    linkitem.appendChild(link);
    statusitem.appendChild(status);

    row.appendChild(linkitem);
    row.appendChild(statusitem);
    row.appendChild(optionsitem);
    var listid = data.location + "-notebooklist";
	document.getElementById(listid).appendChild(row);
});

function createNotebookStatus(data){
    var status = document.createElement("span");
    if(data.sessionid != undefined){
        status.innerHTML = "Shutdown";
        status.className += " badge badge-warning sessionbadge"
        status.onclick = function() {
            socket.emit('shutdown', {location: data.location, sessionid: data.sessionid, user: getURLParameter("user")});
            status.innerHTML = "";
        }
    }
    return status;
}

function getLocalNotebooks() {
    getNotebooks("local");
}

function getCloudNotebooks() {
    getNotebooks("cloud");
}

function getNotebooks(location) {
    document.getElementById(location + "-notebooklist").innerHTML = "";
	socket.emit('getnotebooks', {instance: location, user: getURLParameter("user")});
}

function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}

$(document).ready(function() {
	$("#retrieve-local-notebooks").bind("click", getLocalNotebooks);
    $("#retrieve-cloud-notebooks").bind("click", getCloudNotebooks);
});