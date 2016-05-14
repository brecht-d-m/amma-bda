/**
 * Created by amma on 14.05.16.
 */
var socket = io.connect('http://localhost:3000');

socket.on('status', function (data) {
    updateStatusLabel(document.getElementById("local-status"), data.local);
    updateStatusLabel(document.getElementById("cloud-status"), data.cloud);

});

function updateStatusLabel(label, data){
    if (data == "ok"){
        label.textContent = "Ok";
        label.className = "navbar-inner badge badge-success";
    } else if (data =="?") {
        label.textContent = "?";
        label.className = "badge badge-warning";
    } else {
        label.textContent = "Down";
        label.className = "badge badge-danger";
    }
}