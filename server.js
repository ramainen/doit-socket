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
	if((typeof (query.id) != 'undefined') && (typeof (query.message) != 'undefined') /*&& (typeof(sockets_array[query.id]) != 'undefined')*/){
		
		res.end("OK");
		var query_message = query.message;
		var query_id = query.id;

		query.id = undefined;
		query.message = undefined;
		if ((typeof (query._type) != 'undefined') && (typeof (query._data) != 'undefined') && (query._type == 'string')){
			query = query._data;
		}
		io.to(query_id).emit(query_message, query);
		/*for(key in sockets_array[query_id]){
			sockets_array[query_id][key].emit(query_message, query);
		}*/
		
		
	}else{
		res.end("ERROR");
	}
});

//console.log('start')
app.post('/emit', function (req, res) {
	res.writeHead(200);
//		console.log('emit')
	if((typeof (req.param('id')) != 'undefined') && (typeof (req.param('message')) != 'undefined')) {
		var clients = [];
		if(typeof(req.param('id'))=='object'){
			clients = req.param('id');
		}else{
			clients = [req.param('id')];
		}
		var all_ok = false;
//		console.log('emit')
		for (client_key in clients){
			//if(typeof(sockets_array[clients[client_key]]) != 'undefined'){
				all_ok=true;
				var query_message = req.param('message');
				var query_id = clients[client_key];
				if(typeof(req.param('data'))=='undefined'){
					query = {};
				}else{
					query = JSON.parse(req.param('data'));
				}
				/*
				for(key in sockets_array[query_id]){
					sockets_array[query_id][key].emit(query_message, query);
				}
				*/
//				console.log(clients[client_key])
				io.to(clients[client_key]).emit(query_message, query);
			//}
		}
		if(all_ok){
			res.end("OK");
		}else{
			res.end("ERROR");
		}
	}else{
		res.end("ERROR");
	}
	
});
/*
io.on('connection', function (socket) {
	socket.on('register', function (data) {
		//connect
		if(typeof(sockets_array[data.userid])=='undefined'){
			sockets_array[data.userid]={};
		}
		socket._server_userid = data.userid;
		sockets_array[data.userid][socket.id] = socket;
	});
	socket.on('disconnect', function () {
		//disconnect
		if(typeof(socket._server_userid)!='undefined'){ //На случай слишком быстрого дисконнекта
			delete sockets_array[socket._server_userid][socket.id];
			if(Object.keys(sockets_array[socket._server_userid]).length == 0){
				delete sockets_array[socket._server_userid];
			}
		}
	})
});
*/
io.on('connection', function (socket) {
	socket.on('register', function (data) {
		//connect
		if(typeof(data.userid)!='undefined'){
//			console.log('join' + data.userid);
			socket.join(data.userid);
		}
		/*if(typeof(sockets_array[data.userid])=='undefined'){
			sockets_array[data.userid]={};
		}
		socket._server_userid = data.userid;
		sockets_array[data.userid][socket.id] = socket;*/
	});
	/*socket.on('disconnect', function () {
		//disconnect
		if(typeof(socket._server_userid)!='undefined'){ //На случай слишком быстрого дисконнекта
			delete sockets_array[socket._server_userid][socket.id];
			if(Object.keys(sockets_array[socket._server_userid]).length == 0){
				delete sockets_array[socket._server_userid];
			}
		}
	})*/
});
