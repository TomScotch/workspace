/**
 * @author weism
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 负责提供socket服务
 */
var express = require('express');
var app     = express();

var host;
var port;
var _io;
var handlerMap = {};

/**
 * 开始监听端口
 * @method qc.gs.Communicate#listen
 * @param {number} portNo - 监听的端口号
 */
function listen(portNo)
{
    // deflate 压缩中间件，目前只有音乐文件不进行压缩，其他文件全体压缩
    var compression = require('compression');
    app.use(compression({
        filter: function(req, res) {
            var url = req.url;

            if (url && /\.(mp3|ogg|mp3\.bin|ogg\.bin)$/.test(url.toLowerCase()))
            // 音乐文件
                return false;

            // 其他，全体默认压缩
            return true;
        }
    }));

    var http    = require('http').Server(app);
    var io      = require('socket.io')(http, {
        pingTimeout : 15000,
        pingInterval : 8000
    });

    // 增加 express 中间件 CORS，以允许跨域访问
    var cors = require('cors');
    app.use(cors());

    app.use('/lib', express.static(path.join(G.editorRoot, '../lib/')));
    app.use('/Plugins', express.static(path.join(G.editorRoot, '../Plugins/')));
    app.use('/Project.html', express.static(path.join(G.editorRoot, 'Project.html')));
    app.use('/editor.appcache', express.static(path.join(G.editorRoot, 'editor.appcache')));
    app.use('/welcome', express.static(path.join(G.editorRoot, '/welcome/')));

    if (G.gameRoot) {
        switchStatic();
    }

    // 监听 remoteLog 远程日志的 post 请求
    var router = express.Router();
    app.use('/remoteLog', router);

    // body parse 中间件
    var bodyParser = require('body-parser');
    router.use(bodyParser.urlencoded({ extended: false }));
    router.use(bodyParser.json());
    router.use(bodyParser.text({ type : function(){ return true; }}));

    // 客户端请求 post http://localhost:5002/remoteLog
    router.post('/', function(req, res) {
        var body = req.body;
        var ret = body.match(/:queryCmd:(.*)/);
        if (ret && ret.index === 0)
        {
            // 客户端请求获取脚本指令
            queryCmdFromClient(res, ret[1]);
        }
        else
        {
            console.log(body);
            res.send("200 OK");
            res.end();
        }
    });

    // 监听端口重复事件以进行重试
    http.on('error', function (e) {
        if (e.code == 'EADDRINUSE') {
            important('Port {0} is occupied, try another port {1}...', portNo, portNo + 1);
            COMMUNICATE_D.port = portNo + 1;
            portNo = portNo + 1;
            setTimeout(function () {
                http.close();
                http.listen(COMMUNICATE_D.port);
            }, 100);
        }
    });

    // 获取本地ip地址
    COMMUNICATE_D.host = getLocalIP();

    // 监听端口，启动服务
    http.listen(portNo, function() {
        var tempPort = COMMUNICATE_D.port;
        if (!tempPort)
            tempPort = portNo;
        important('Port = {0}', tempPort);

        // 设置监听的端口号
        COMMUNICATE_D.port = tempPort;

        // 派发成功监听的回调
        G.emitter.emit('serviceOn', {
            port : COMMUNICATE_D.port
        });
    });

    return io;
};

// 切换静态服务的根目录
function switchStatic()
{
    if (!G.gameRoot) return;

    var switchDir = function(dir, key) {
        var newHandle = express.static(dir);
        var stacks = app._router.stack;
        var changed = false;

        for (var i = 0, len = stacks.length; i < len; i++) {
            var stack = stacks[i];
            if (stack.name === 'serveStatic' &&
                stack.handle === handlerMap[key]) {
                stack.handle = newHandle;
                changed = true;
                break;
            }
        }

        if (!changed) {
            // 没有找到，直接 use
            app.use(newHandle);
        }
        handlerMap[key] = newHandle;
    }

    switchDir(G.gameRoot, 'gameHandler');
    switchDir(path.join(G.gameRoot, 'Temp'), 'tempGameHandler');

    return true;
};

/**
 * 发送消息给所有的客户端
 */
function broadcast(cmd, paras)
{
    _io.emit(cmd, paras);
}

// 模块析构函数
function destruct()
{
}

// 模块构造函数
function create()
{
    // 取得游戏的配置信息
    var config;
    try {
        config = fsExtra.readJsonSync(path.join(G.editorRoot, 'project.setting'), { throws : false }) || {};
    }
    catch (e) {
        config = {};
    }

    // 监听端口，开始提供服务
    _io = listen(config.nodePort || 5002);
    _io.on('connection', function(socket) {
        trace('New connection.');
        socket.on('disconnect', function() {
            trace('Disconnect.');
        });

        // 注册所有的命令
        COMMAND_D.registerCmdToIO(socket);

        // 通知有连接接入
        G.emitter.emit('newConnection', socket);
        G.beConnnected = true;
    });
}

// 需要导出的外部接口
global.COMMUNICATE_D = module.exports = {
    listen : listen,
    switchStatic : switchStatic,
    broadcast : broadcast,
    host : host,
    port : port,
    destruct : destruct,
	create : create,
};

// 执行模块构造函数
create();
