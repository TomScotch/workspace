/**
 * @author chenqx
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 管理与前端的自定义通讯
 */

var eventEmitter = require('events').EventEmitter;
var _emitter = new eventEmitter();

// 向前端发送消息
function sendData(cmd, data)
{
    // 更新完成，派发事件给编辑器
    COMMAND_D.broadcast('SERVICE_PIPE_MESSAGE', {
        command: cmd,
        data: data
    });
};

// 添加监听
function on(cmd, listener)
{
    _emitter.on(cmd, listener);
};

// 移除监听
function off(cmd, listener)
{
    _emitter.removeListener(cmd, listener);
};

// 触发监听
function emit(cmd, data)
{
    _emitter.emit(cmd, data);
};

// 模块析构函数
function destruct()
{
}

// 模块构造函数
function create()
{
}

// 导出模块
global.SERVICE_PIPE_D = module.exports = {
    emit: emit,
    on : on,
    off : off,
    sendData : sendData,
    destruct : destruct,
    create : create,
}

// 执行模块构造函数
create();
