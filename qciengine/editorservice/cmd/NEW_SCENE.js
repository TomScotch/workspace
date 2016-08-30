/**
 * @author weism
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 创建新的场景
 */
var fs = fsExtra;
var fsEx = FS_EXPAND_D;

COMMAND_D.registerCmd({
    name : 'NEW_SCENE',
    main : function(socket, cookie, data) {
        // 写入目标文件
        fsEx.writeJSONFileSync(G.gameRoot + 'Temp/scene_editor.state', {
            class: "qc.Node",
            data: {
                children: []
            },
            dependences: {
            }
        });

        // 修改配置信息
        // 新场景未保存前的特殊名字
        G.config.editor.currScene = 'Assets/scene/unsavedScene';
        COMMAND_D.dispatch('UPDATE_EDITOR_SETTINGS', -1, G.config.editor);

        // 重新打包下资源
        WATCH_D.exploreDaemon();
        return true;
    }
});
