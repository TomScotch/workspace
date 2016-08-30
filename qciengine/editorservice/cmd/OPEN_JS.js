/**
 * @author chenx
 * @date 2015.11.24
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 请求打开 js 文件，使用系统默认程序
 */

var opener = require('opener');
var fsEx = FS_EXPAND_D;

COMMAND_D.registerCmd({
    name : 'OPEN_JS',
    main : function(socket, cookie, file) {
        var fullPath;

        fullPath = fsEx.expandPath(path.join(G.gameRoot, file));
        G.log.trace('open js : {0}', fullPath);

        var ret = isLocalSocket(socket, COMMUNICATE_D.host) ? true : false;
        if (ret)
            opener('file:' + fullPath);

        return { 'operRet' : ret };
    }
});
