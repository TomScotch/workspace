/**
 * @author chenqx
 * copyright 2015 Qcplay All Rights Reserved.
 */

/*
 * 取得插件的脚本信息
 */
COMMAND_D.registerCmd({
    name : 'QUERY_PLUGIN_SCRIPT',
    main : function(socket, cookie, data) {
        return PLUGIN_SCRIPTS_D.getPluginScript(data.id);
    }
});
