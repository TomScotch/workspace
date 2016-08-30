/**
 * @author weism
 * copyright 2016 Qcplay All Rights Reserved.
 */

/*
 * 编译TypeScript代码
 */

var fs = fsExtra;
var iconv = require('iconv-lite');

COMMAND_D.registerCmd({
    name: 'BUILD_TS',
    main: function(socket, cookie, data) {
        // 如果是在内部开发环境中，可以直接编译。否则需要创建Gruntfile
        if (!fs.existsSync('qici.lock')) {
            var content = fs.readFileSync(path.join(G.editorRoot, 'Template/Gruntfile.js'), 'utf8');
            content = content.replace('__PROJECT_PATH__', G.gameRoot.replace(/\\/g, '/'));
            fs.writeFileSync(G.editorRoot + '../Gruntfile.js', content);
        }
        else {
            var content = fs.readFileSync(G.editorRoot + '../Gruntfile.js', 'utf8');
            content = content.replace(/var path = '.*';/, "var path = '" + G.gameRoot.replace(/\\/g, '/') + "';");
            fs.writeFileSync(G.editorRoot + '../Gruntfile.js', content);
        }

        var build = function() {
            // 开始执行
            trace('Start building typescript...');
            var spawn = require('child_process').spawn;
            var bat;
            if (process.platform !== 'win32')
                bat = spawn('./node_modules/grunt-cli/bin/grunt', ['ts']);
            else
                bat = spawn('node', ['node_modules/grunt-cli/bin/grunt', 'ts']);

            var message = '';
            var decode = process.platform === 'win32' ? 'gbk' : 'utf8';
            bat.stdout.on('data', function(data) {
                trace(iconv.decode(new Buffer(data), decode));
                message += iconv.decode(new Buffer(data), decode) + '\n';
            });
            bat.stderr.on('data', function (data) {
                trace(iconv.decode(new Buffer(data), decode));
                message += iconv.decode(new Buffer(data), decode) + '\n';
            });
            bat.on('close', function (code) {
                // 结果去掉颜色信息并返回给客户端
                trace('build end: code=' + code)
                message = message.replace(/\[[0-9]+m/g, '');
                COMMAND_D.sendMessage(socket, 'OPERATION_DONE', cookie,
                    {
                        result: code === 0,
                        message: message
                    });
            });
        }
        build();
    }
});
