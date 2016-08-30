/**
 * @author wudm
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 删除 bin 文件列表
 */
var fsEx = FS_EXPAND_D;
var fs = fsExtra;

COMMAND_D.registerCmd({
    name : 'REMOVE_BIN',
    main : function(socket, cookie, binList) {
        binList.forEach(function(dir) {
            var fullPath = path.join(G.gameRoot, dir);
            if (!fs.existsSync(fullPath)) {
                // 认为删除成功
                return;
            }

            // 删除 bin 资源
            fs.removeSync(fullPath);
        });
        return { 'operRet': true };
    }
});
