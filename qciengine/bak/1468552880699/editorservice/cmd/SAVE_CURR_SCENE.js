/**
 * @author weism
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 保存当前场景
 */
var fs = fsExtra;
var fsEx = FS_EXPAND_D;

COMMAND_D.registerCmd({
    name : 'SAVE_CURR_SCENE',
    main : function(socket, cookie, data) {
        // 写入目标文件
        fsEx.writeJSONFileSync(G.gameRoot + 'Temp/scene_editor.state', data.data);

        // 重新打包下资源
        WATCH_D.exploreDaemon();
        return true;
    }
});
