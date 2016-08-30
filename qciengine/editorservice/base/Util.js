/**
 * @author weism
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 提供常用接口的封装
 */

module.exports = {};

// 捕获脚本异常处理
process.on('uncaughtException', function(er){

    // 连接断开的异常不处理
    if (er.code == 'ECONNRESET' || er.code == 'EPIPE')
        return;

    error('Caught exception: ', er);
});

// 若有 --publish 参数，表示发布版本
if (process.argv.indexOf('--publish') > 0)
    G.isPublishVersion = true;

/**
 * Fast UUID generator, RFC4122 version 4 compliant.
 * @author Jeff Ward (jcward.com).
 * @license MIT license
 * @link http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
 **/
var UUID = (function() {
    var self = {};
    var lut = [];
    for (var i=0; i < 256; i++) {
        lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
    }
    self.generate = function() {
        var d0 = Math.random() * 0xffffffff | 0;
        var d1 = Math.random() * 0xffffffff | 0;
        var d2 = Math.random() * 0xffffffff | 0;
        var d3 = Math.random() * 0xffffffff | 0;
        return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] +
            lut[d0 >> 24 & 0xff] + '-' + lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' +
            lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
            lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] +
            lut[d2 >> 24 & 0xff] + lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] +
            lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
    };
    return self;
})();
global.uuid = module.exports.uuid = UUID.generate;

/**
 * 计算字符串的 md5 值
 */
var crypto = require('crypto');
global.calcMD5 = module.exports.calcMD5 = function(str) {
    return crypto.createHash('md5').update(str).digest('hex');
};

/**
 * 生成当前时间串描述，形如 20151014112811
 */
global.formattedTime = module.exports.formattedTime = function() {
    var tsHms = new Date();
    return tsHms.getFullYear() +
        ("0" + (tsHms.getMonth() + 1)).slice(-2) +
        ("0" + (tsHms.getDate())).slice(-2) +
        ("0" + tsHms.getHours()).slice(-2) +
        ("0" + tsHms.getMinutes()).slice(-2) +
        ("0" + tsHms.getSeconds()).slice(-2);
};

/**
 * 混合两个对象的属性
 */
global.mixin = module.exports.mixin = function (from, to) {
    if (!from || typeof (from) !== "object") {
        return to;
    }

    for (var key in from) {
        var type = typeof (from[key]);
        var o = from[key];
        if (!from[key] || type !== "object") {
            to[key] = from[key];
        }
        else {
            if (typeof (to[key]) === type) {
                to[key] = module.exports.mixin(from[key], to[key]);
            }
            else {
                to[key] = module.exports.mixin(from[key], new o.constructor());
            }
        }
    }
    return to;
};

/**
 * 获取本地ip地址
 */
global.getLocalIP = module.exports.getLocalIP = function() {
    var ifaces = require('os').networkInterfaces();

    var localIP;
    for (var key in ifaces) {
        for (var i = 0; i < ifaces[key].length; i++) {
            var iface = ifaces[key][i];

            if (iface.family === 'IPv4' && iface.internal === false) {
                localIP = iface.address;
                break;
            }
        }

        if (localIP)
            break;
    }

    localIP = localIP || 'localhost';

    return localIP;
};

/**
 * 判断socket连接是否来自于本机
 */
global.isLocalSocket = module.exports.isLocalSocket = function(socket, localIP) {
    var targetAddress;
    if (socket && socket.handshake &&
        (targetAddress = socket.handshake.address)) {
        if (targetAddress.indexOf('::1') >= 0 ||
            targetAddress.indexOf('127.0.0.1') >= 0 ||
            targetAddress.indexOf(localIP) >= 0)
        {
            return true;
        }
    }

    return false;
};

/**
 * 跑补丁
 */
global.runPatch = module.exports.runPatch = function(gameRoot, flag, callback) {
    if (!gameRoot) return;
    var pathLib = require('path');
    var fs = require('fs-extra');
    var settingPath = pathLib.join(gameRoot, 'ProjectSetting/project.setting');
    if (!fs.existsSync(settingPath)) return;

    // 读取工程配置，如果已经转换过了，就不要再转换
    var projectConf = null;
    try {
        projectConf = fs.readJsonSync(settingPath, { throws : false });
    }
    catch(e) {
        return;
    }
    if (!projectConf) return;
    if ((projectConf.toolFlag || 0) & (1 << flag)) return;

    // 打上标记，表明工具已经跑过了
    projectConf.toolFlag = ((projectConf.toolFlag || 0) | (1 << flag));
    FS_EXPAND_D.writeJsonSync(settingPath, projectConf);

    // 补丁的逻辑
    callback();
};

/**
 * 遍历某个文件夹，并对文件应用func
 */
global.explorePathAndFunc = module.exports.explorePathAndFunc = function(root, func) {
    var path = require('path');
    var fs = require('fs-extra');

    var explore = function(dir) {
        var list = fs.readdirSync(dir);
        for (var i = 0, len = list.length; i < len; i++) {
            var subPath = list[i];
            var fullPath = path.join(dir, subPath);
            var stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                explore(fullPath);
            }
            else {
                var ext = path.extname(subPath).toLowerCase();
                func(fullPath, ext);
            }
        }
    };
    explore(root);
};

/**
 * 确保 unix 风格
 */
global.toUnixPath = module.exports.toUnixPath = function(key) {
    key = key.replace(/\\/g, '/');
    var double = /\/\//;
    while (key.match(double))
        key = key.replace(double, '/');
    return key;
};
