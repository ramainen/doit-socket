var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var url = require('url');
var bodyParser = require('body-parser')

server.listen(process.env.PORT || 1337);

var sockets_array=[];

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/emit', function (req, res) {
	var query = url.parse(req.url, true).query;
	res.writeHead(200);
	if((typeof (query.id) != 'undefined') && (typeof (query.message) != 'undefined') && (typeof(sockets_array[query.id]) != 'undefined')){
		
		res.end("OK");
		var query_message = query.message;
		var query_id = query.id;
		
		
		query.id = undefined;
		query.message = undefined;
		if ((typeof (query._type) != 'undefined') && (typeof (query._data) != 'undefined') && (query._type == 'string')){
			query = query._data;
		}
		sockets_array[query_id].emit(query_message, query);
		
	}else{
		res.end("ERROR");
	}
});


app.post('/emit', function (req, res) {
	res.writeHead(200);
	
	
	if((typeof (req.param('id')) != 'undefined') && (typeof (req.param('message')) != 'undefined') && (typeof(sockets_array[req.param('id')]) != 'undefined')){
		
		res.end("OK");
		var query_message = req.param('message');
		var query_id = req.param('id');
		if(typeof(req.param('data'))=='undefined'){
			query = {};
		}else{
			query = JSON.parse(req.param('data'));
		}
		sockets_array[query_id].emit(query_message, query);
		
	}else{
		res.end("ERROR");
	}
	
});


io.on('connection', function (socket) {
	socket.on('register', function (data) {
		sockets_array[data.userid] = socket;
		//socket._server_userid = data.userid;
	});
	socket.on('disconnect', function () {
		//disconnect
		delete sockets_array[socket._server_userid];
	})
});
