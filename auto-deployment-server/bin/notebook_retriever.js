module.exports = {
    send_notebooks: function (instance, client) {
        // TODO: issue 55 - sessions are bound to user space, requires cookie (option --load-cookies cookie.txt)
        exec('wget -q -O - "$@" ' + instance.url + "api/sessions",
            function (error, stdout, stderr) {
                sessions = JSON.parse(stdout)
                recursiveParse(instance, "", client, sessions)
            });
    }
}

var exec = require('child_process').exec;

function recursiveParse(instance, path, socket, sessions) {
    exec('wget -q -O - "$@" ' + instance.url + "api/contents/" + path,
        function (error, stdout, stderr) {
            if (error != null) return;
            parsed = JSON.parse(stdout).content;
            for (var i = 0; i < parsed.length; i++) {
                if (parsed[i].type == 'notebook') {
                    // TODO: can add more info about notebook here
                    var notebook = {name: parsed[i].name, path: instance.url + "notebooks/" + parsed[i].path, location: instance.location};
                    for (var j = 0; j< sessions.length; j++) {
                        if (sessions[j].notebook.path == parsed[i].path){
                            notebook.sessionid = sessions[j].id;
                        }
                    }
                    socket.emit('notebook', notebook);
                }
                if (parsed[i].type == 'directory') {
                    recursiveParse(instance, parsed[i].path, socket, sessions);
                }
            }
        });
}

