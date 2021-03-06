var socket = io.connect('http://localhost:3000');

socket.on('notebook', function (data) {  // server sends notebook --> add notebook to html table
    var row = document.createElement("tr");
	var linkitem = document.createElement("td");
    var statusitem = document.createElement("td");

    var link = document.createElement("a");
	link.innerHTML = data.name;
    // access special views for notebook by appending ?view=codeView ?view=textView ?view=textOutputView
    link.setAttribute("href", data.path);
    var status = createNotebookStatus(data);
    
    linkitem.appendChild(link);
    statusitem.appendChild(status);

    row.appendChild(linkitem);
    row.appendChild(statusitem);
    var listid = data.location + "-notebooklist";
	document.getElementById(listid).appendChild(row);
});

function createNotebookStatus(data){  // create html span that shows notebook activeness ( as a shutdown button)
    var status = document.createElement("span");
    if(data.sessionid != undefined){
        status.innerHTML = "Shutdown";
        status.className += " badge badge-warning sessionbadge";
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

function getNotebooks(location) {  // send request for notebooks to server
    document.getElementById(location + "-notebooklist").innerHTML = "";
	socket.emit('getnotebooks', {instance: location, user: getURLParameter("user")});
}

function getURLParameter(name) {  // determine user mail for cookie (used in finding active notebook sessions)
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}

$(document).ready(function() {
	$("#retrieve-local-notebooks").bind("click", getLocalNotebooks);
    $("#retrieve-cloud-notebooks").bind("click", getCloudNotebooks);
});