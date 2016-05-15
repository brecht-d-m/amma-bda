module.exports = {
    send_notebooks: function (instance, client) {
        recursiveParse(instance, "", client);
    }
}

var exec = require('child_process').exec;

function recursiveParse(instance, path, socket) {
    exec('wget --load-cookies cookies.txt -q -O - "$@" ' + instance.url + "api/contents/" + path,
        function (error, stdout, stderr) {
            if (error != null) return;
            parsed = JSON.parse(stdout).content;
            for (var i = 0; i < parsed.length; i++) {
                if (parsed[i].type == 'notebook') {
                    // TODO: can add more info about notebook here
                    socket.emit('notebook', {name: parsed[i].name, path: instance.url + "notebooks/" + parsed[i].path, location: instance.location});
                }
                if (parsed[i].type == 'directory') {
                    recursiveParse(instance, parsed[i].path, socket);
                }
            }
        });
}

