var app = require('http').createServer(handler)
//var io = require('socket.io')(app);
//var fs = require('fs');
//var url = require('url');

var sockets_array=[];


app.listen(process.env.PORT || 1337);


function handler (req, res) {


var query =url.parse(req.url, true).query;
/*
if((typeof (query.id) != 'undefined') &&  (typeof (query.message) != 'undefined') && (typeof(sockets_array[query.id]) != 'undefined')){
     sockets_array[query.id].emit(query.message, query);
 }
*/
  res.writeHead(200);
  res.end("OK app");

}

/*
io.on('connection', function (socket) {
  //socket.emit('news', { hello: 'world' });

   socket.on('register', function (data) {
    console.log(data.userid);
        sockets_array[data.userid] = socket;
  });
});
*/