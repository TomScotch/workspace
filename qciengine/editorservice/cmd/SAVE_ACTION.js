/**
 * @author chenx
 * @date 2015.12.23
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 保存 action 或 actionManager
 */
var fs = fsExtra;
var fsEx = FS_EXPAND_D;

COMMAND_D.registerCmd({
    name : 'SAVE_ACTION',
    main : function(socket, cookie, data) {
        var targetPath = data.path;
        var type = data.type;
        var json = data.data;
        var newAction = data.newAction;

        var num = 6;
        if (type === 'Action')
            targetPath = targetPath.replace(/.bin$/g, '.action');
        else if (type === 'ActionManager')
        {
            num = 13;
            targetPath = targetPath.replace(/.bin$/g, '.actionmanager');
        }

        if (newAction)
        {
            fs.ensureDirSync(G.gameRoot + 'Assets/action');
            if (fs.existsSync(G.gameRoot + targetPath))
            {
                // 已存在该 action
                return -1;
            }
        }

        // 写入目标文件
        fsEx.writeJSONFileSync(G.gameRoot + targetPath, json);

        // 重新打包下资源
        WATCH_D.exploreDaemon();

        if (newAction)
        {
            // 新建 action，返回 bin 数据
            var data = fs.readJSONFileSync(G.gameRoot + targetPath.substr(0, targetPath.length - num) + 'bin');
            return data;
        }

        // 返回资源的uuid
        return fs.readJSONFileSync(G.gameRoot + targetPath.substr(0, targetPath.length - num) + 'bin.meta').uuid;
    }
});
