/**
 * @author weism
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 更新工程的配置信息
 */
COMMAND_D.registerCmd({
    name : 'UPDATE_PROJECT_SETTINGS',
    main : function(socket, cookie, data) {
        G.config.project = data;

        AUTO_CONFIG_PROJECT_D.writeProjectSetting(data);

        // 重新生成游戏启动文件
        debug('update project settings.');
        PROJECT_D.genGameHTML();

        return true;
    }
});
