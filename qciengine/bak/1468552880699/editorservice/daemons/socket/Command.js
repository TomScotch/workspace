/**
 * @author weism
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 指令分发处理
 */

/**
 * @property {object} _cmds - 所有的消息处理指令
 * @private
 */
var _cmds = {};

/**
 * @property {object} _cmds - 消息是否启用、禁用的标记
 * @private
 */
var _disableTrace = {};

/**
 * 注册一个消息处理回调
 * @param cmd
 * @private
 */
function _registerCmdToIO(cmd, socket)
{
    socket.on(cmd, function(cookie, data) {
        dispatch(socket, cmd, cookie, data);
    });
};

/**
 * 注册一个消息处理器
 * @param cmd
 * @internal
 */
function registerCmd(cmd)
{
    if (typeof cmd.main !== 'function' || typeof cmd.name !== 'string')
        throw new Error('消息处理器未正确定义。');

    if (_cmds[cmd.name])
        error('消息处理器{0}已经存在了！', cmd.name);

    _cmds[cmd.name] = cmd;
};

/**
 * 反馈消息给客户端
 */
function sendMessage(socket, cmd, cookie, paras)
{
    if (!socket) {
        return;
    }
    socket.emit(cmd, cookie, paras);
};

/**
 * 发送消息给所有的客户端
 */
function broadcast(cmd, paras)
{
    COMMUNICATE_D.broadcast(cmd, paras);
};

// 注册所有的命令
function registerCmdToIO(socket)
{
    for (var cmd in _cmds) {
        _registerCmdToIO(cmd, socket);
    }
}

/**
 * 设置启用/禁用一个消息打印
 */
function enableTrace(cmd, enable)
{
    if (enable) {
        delete _disableTrace[cmd];
    }
    else {
        // 禁用
        _disableTrace[cmd] = true;
    }
};

/**
 * 执行一个指令
 */
function dispatch()
{
    var args = arguments;
    var argIndex = 0, socket, cmd, cookie, data;

    if (typeof(args[0]) !== 'string') {
        socket = args[argIndex++];
    }
    cmd    = args[argIndex++];
    cookie = args[argIndex++];
    data   = args[argIndex++];

    var agent = _cmds[cmd];

    // 处理之
    try {
        if (!_disableTrace[cmd]) trace('-----> {0}', cmd);
        var result = agent.main.call(agent, socket, cookie, data, function(result) {
            if (cookie >= 0 && socket && result !== undefined) {
                sendMessage(socket, 'OPERATION_DONE', cookie, result);
            }
        });
        if (cookie >= 0 && socket && result !== undefined) {
            sendMessage(socket, 'OPERATION_DONE', cookie, result);
        }
    }
    catch(ex) {
        error('cmd：{0}，exception：{1}', cmd, ex);
    }
};

// 模块析构函数
function destruct()
{
}

// 执行模块构造函数
function create()
{
    // 加载所有的通信消息处理函数
    loadDir('cmd');

    // 默认设置 RECORD_SOUND_DURATION 消息不打印
    enableTrace('RECORD_SOUND_DURATION', false);
}

// 需要导出的外部接口
global.COMMAND_D = module.exports = {
    sendMessage : sendMessage,
    registerCmd : registerCmd,
    registerCmdToIO : registerCmdToIO,
    broadcast : broadcast,
    enableTrace : enableTrace,
    dispatch: dispatch,
	destruct : destruct,
	create : create,
};

create();
