/**
 * @author weism
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 负责编辑器后台的启动
 */

// 加载内置或第三方库，以供全局访问
util = require('util');
os = require('os');
fs = require('fs');
fsExtra = require('fs-extra');
path = require('path');

// writeJson 的时候，不需要写入空格
fsExtra.jsonfile.spaces = 0;

// 全局数据
G = {};
G.isBooted = false;

// 记录项目路径
G.editorRoot = path.join(path.normalize(__dirname), '/');

// 建立事件派发器
var eventEmitter = require('events').EventEmitter;
G.emitter = new eventEmitter();
G.emitter.setMaxListeners(0);

// 定义全局的代码载入函数
require(path.join(G.editorRoot, 'base/Compiler.js'));

// 预先加载关键的全局代码
update('base/Log.js');

// 载入版本数据
require('./Version.js');

// 加载全局定义文件
loadDir('include');

// 加载全局函数
loadDir('base');

// 加载本地化模块
loadDir('localize');

// 加载类模块
loadDir('clone');

// 加载各模块
loadDir('daemons/filesystem');
loadDir('daemons/socket');
loadDir('daemons');


// 通知所有模块载入成功
G.emitter.emit('postInit');

// 执行完 postInit，清除 postInit 事件列表
G.emitter.removeAllListeners('postInit');

// 标识启动完毕
G.isBooted = true;
