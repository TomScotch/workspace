var host = '0.0.0.0',
    port = 6656,
    user = 'pi',
    password = 'raspberry';

var express = require('express'),
 app = express(),
 http = require('http').Server(app),
 io = require('socket.io')(http),
 Client = require('ssh2').Client;

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('shutdown', function(){
		var conn = new Client();
			conn.on('ready', function() {
			  conn.exec('sudo halt', function(err, stream) {
			  });
			}).connect({
			  host: host,
			  port: port,
			  username: user,
			  password: password
			});
  });
  
  socket.on('reboot', function(){
		var conn = new Client();
			conn.on('ready', function() {
			  conn.exec('sudo reboot', function(err, stream) {
			  });
			}).connect({
			  host: host,
			  port: port,
			  username: user,
			  password: password
			});
  });

  socket.on('hdmion', function(){
		var conn = new Client();
			conn.on('ready', function() {
			  conn.exec('/opt/vc/bin/tvservice -p', function(err, stream) {
			  });
			}).connect({
			  host: host,
			  port: port,
			  username: user,
			  password: password
			});
  });

  socket.on('hdmioff', function(){
		var conn = new Client();
			conn.on('ready', function() {
			  conn.exec('/opt/vc/bin/tvservice -o', function(err, stream) {
			  });
			}).connect({
			  host: host,
			  port: port,
			  username: user,
			  password: password
			});
  });
  
  socket.on('lightdm', function(){
		var conn = new Client();
			conn.on('ready', function() {
			  conn.exec('sudo service lightdm restart', function(err, stream) {
			  });
			}).connect({
			  host: host,
			  port: port,
			  username: user,
			  password: password
			});
  });
});


http.listen(2000, function(){
  console.log('listening on *:2000');
});
