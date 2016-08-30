/**
 * @author weism
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 保存场景
 */

COMMAND_D.registerCmd({
    name : 'SAVE_SCENE',
    main : function(socket, cookie, data) {
        var path = data.path;
        var json = data.data;

        var ret = SCENE_MANAGER_D.saveScene(path, json);
        if (ret) {
            // 重新生成游戏启动文件
            debug('update scene settings.');
            PROJECT_D.genGameHTML();
        }
        return ret;
    }
});
