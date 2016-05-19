var socket = io.connect('http://localhost:3000');

socket.on('status', function (data) {  // server sends status update --> update labels
    updateStatusLabel(document.getElementById("local-status"), data.local, $("#retrieve-local-notebooks"));
    updateStatusLabel(document.getElementById("cloud-status"), data.cloud, $("#retrieve-cloud-notebooks"));
});

function updateStatusLabel(label, data, button){
    if (data == "ok"){
        label.textContent = "Ok";
        label.className = "navbar-inner badge badge-success";
        button.prop('disabled', false);
    } else if (data =="?") {
        label.textContent = "?";
        label.className = "badge badge-warning";
        button.prop('disabled', true);
    } else {
        label.textContent = "Down";
        label.className = "badge badge-danger";
        button.prop('disabled', true);
    }
}

$(document).ready(function(){ // bind changing project id to function
    $("#gcloud-id-input").focusout(function(){
        googleProjectId = $("#gcloud-id-input").val();
        googleProjectData = new Object();
        googleProjectData.googleCloudProject = googleProjectId;
        $.post("/changePID", googleProjectData, function (data, status) {
            console.log("DATA: " + data);
        });
    });
});