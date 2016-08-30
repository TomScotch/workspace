/**
 * @author weism
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 更新工程的配置信息
 */

var fsEx = FS_EXPAND_D;

COMMAND_D.registerCmd({
    name : 'UPDATE_SCENE_SETTINGS',
    main : function(socket, cookie, data) {
        var settings = {};
        settings.scene = data;
        if (data.length > 0)
            settings.entryScene = data['0'];

        G.config.scene = settings;
        AUTO_CONFIG_PROJECT_D.writeSceneSetting(settings);

        // 重新生成游戏启动文件
        debug('update scene settings.');
        PROJECT_D.genGameHTML();

        // 激发事件给客户端
        COMMAND_D.broadcast('SCENE_SETTING_UPDATED', {
            setting: G.config.scene
        });

        return G.config.scene;
    }
});
