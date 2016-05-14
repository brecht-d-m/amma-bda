module.exports = {
    send_notebooks: function (url, client){
        recursiveParse(url, "", client);
    }
}
var request = require('request');

function recursiveParse(url, path, socket) {
    request(url + "api/contents/" + path, function(error, response, body) {
        if(body == undefined) return;
        parsed = JSON.parse(body).content;
        for (var i = 0; i < parsed.length; i++) {
            if (parsed[i].type == 'notebook') {
                // TODO: can add more info about notebook here
                socket.emit('notebook', { name: parsed[i].name, path: url + "notebooks/" + parsed[i].path });
            }
            if (parsed[i].type == 'directory') {
                recursiveParse(url, parsed[i].path, socket);
            }
        }
    });
}

