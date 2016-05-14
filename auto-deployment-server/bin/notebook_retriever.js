module.exports = {
    send_notebooks: function (url, client) {
        recursiveParse(url, "", client);
    }
}

var exec = require('child_process').exec;

function recursiveParse(url, path, socket) {
    exec('wget --load-cookies cookies.txt -q -O - "$@" ' + url + "api/contents/" + path, function (error, stdout, stderr) {
        if (error != null) return;
        parsed = JSON.parse(stdout).content;
        for (var i = 0; i < parsed.length; i++) {
            if (parsed[i].type == 'notebook') {
                // TODO: can add more info about notebook here
                socket.emit('notebook', {name: parsed[i].name, path: url + "notebooks/" + parsed[i].path});
            }
            if (parsed[i].type == 'directory') {
                recursiveParse(url, parsed[i].path, socket);
            }
        }
    });
}

