/**
 * @author weism
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 切换到新的场景
 */
var fs = fsExtra;

COMMAND_D.registerCmd({
    name : 'SWITCH_SCENE',
    main : function(socket, cookie, scenePath) {
        // 拷贝文件
        var src = G.gameRoot + scenePath + '.state';
        fs.copySync(src, G.gameRoot + 'Temp/scene_editor.state');

        // 保存源 state 的 md5
        var srcState = fs.readFileSync(src, { encoding : 'utf8' });
        G.config.editor.stateMD5 = calcMD5(srcState);

        // 修改配置信息
        G.config.editor.currScene = scenePath;
        COMMAND_D.dispatch('UPDATE_EDITOR_SETTINGS', -1, G.config.editor);

        // 重新打包下资源
        WATCH_D.exploreDaemon();

        // 更新场景资源依赖的资源数
        ASSET_COUNT_D.recordAssetCount('Temp/scene_editor.bin');
        return true;
    }
});
