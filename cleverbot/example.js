var cleverbot = require("./app.js");
var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);

var bot = new cleverbot('3XDpGOiuqUw16LPZ','q9wVsQra8LPeDVfNasNIM1W3q447fsVh');

bot.setNick("lita");
bot.create(function (err, response) {
	rl.setPrompt('You> ');
	rl.prompt();
	rl.on('line', function(line) {
		bot.ask(line, function (err, response) {
			if (err) throw response;
			console.log("Cleverbot:", response);
			rl.prompt();
		});
	}).on('close',function(){
		process.exit(0);
	});
});

