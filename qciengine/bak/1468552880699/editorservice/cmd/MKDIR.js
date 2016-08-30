/**
 * @author wudm
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 创建目录
 */
var fsEx = FS_EXPAND_D;
var fs = fsExtra;

COMMAND_D.registerCmd({
    name : 'MKDIR',
    main : function(socket, cookie, data) {
        var dir = path.join(G.gameRoot, data.dir);
        var ret = fs.ensureDirSync(dir)

        return { 'operRet' : typeof(ret) === 'string', 'detail' : ret }
    }
});
