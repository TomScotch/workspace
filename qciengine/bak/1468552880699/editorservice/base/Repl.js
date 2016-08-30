/**
 * @author chenx
 * @date 2015.10.18
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * repl 控制台，用于与脚本环境进行交互
 */

// 没有指定 --repl，不创建 repl 控制台
if (process.argv.indexOf('--repl') <= 0)
    return;

var repl = require("repl");
var chalk = require('chalk');

G.emitter.on('serviceOn', function() {
    repl.start({
        prompt: chalk.green('QCNode> '),
        input: process.stdin,
        output: process.stdout,
        eval : function(cmd, context, fileName, callback) {
            var match;
            if (cmd.trim() === 'o') {
                var opener = require('opener');
                opener('http://' + COMMUNICATE_D.host + ':' + COMMUNICATE_D.port + '/Project.html');
                callback(null, 'OK');
            }
            else if (match = cmd.match(/^use (.*)/)) {
                // 切换 client
                switchCurrClient(match[1].trim());
                callback(null, 'OK');
            }
            else {
                match = cmd.match(/^p(\d*) (.+)/);
                if (match)
                {
                    if (match[1] === '')
                        queueClientCmd(match[2]);
                    else
                        queueClientCmd(match[2], match[1].trim());
                }
                else
                    callback(null, eval(cmd));
            }
        },
    });
});
