var http = require('http');
var server = new http.Server();
server.on('request',function(req,res){
    res.writeHead(200, {'Content-Type':'text/html'});
    res.end();
});
server.listen(9999);
