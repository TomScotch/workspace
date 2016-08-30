/**
 * @author wudm
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 在资源浏览器中打开
 */
var opener = require('opener');
var fsEx = FS_EXPAND_D;

COMMAND_D.registerCmd({
    name : 'REVEAL_IN_FINDER',
    main : function(socket, cookie, args) {
        var fullPath;

        fullPath = fsEx.expandPath(path.join(G.gameRoot, args.path));
        G.log.trace('open local dir : {0}', fullPath);

        var ret = isLocalSocket(socket, COMMUNICATE_D.host) ? true : false;
        if (ret)
            opener('file:' + fullPath);

        return { 'operRet' : ret };
    }
});
