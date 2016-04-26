module.exports = {
    send_notebooks: function (url, client){
        recursiveParse(url, "", client);
    }
}
var request = require('request');

function recursiveParse(url, path, socket) {
    request(url + path, function(error, response, body) {
        parsed = JSON.parse(body).content;
        for (var i = 0; i < parsed.length; i++) {
            if (parsed[i].type == 'notebook') {
                // TODO: can add more info about notebook here
                socket.emit('notebook', { notebook: parsed[i].name });
            }
            if (parsed[i].type == 'directory') {
                recursiveParse(url, parsed[i].path, socket);
            }
        }
    });
}

// TODO: this is code that demonstrates google apis authentication 
/*	google.auth.getApplicationDefault(function(err, authClient) {
 if (err) {
 res.send('Failed to get the default credentials: ' + String(err));
 return;
 }

 if (authClient.createScopedRequired && authClient.createScopedRequired()) {
 // Scopes can be specified either as an array or as a single, space-delimited string.
 authClient = authClient.createScoped(['https://www.googleapis.com/auth/compute']);
 }

 var compute = google.compute({ version: 'v1', auth: authClient });
 var projectId = 'propane-bearing-124123';
 compute.routes.list({ project: projectId, auth: authClient}, function(error, result) {
 //console.log(error, result);
 });
 }); */