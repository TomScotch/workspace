/**
 * @author chenqx
 * copyright 2015 Qcplay All Rights Reserved.
 */

 /*
 * 取得工程的插件信息
 */

COMMAND_D.registerCmd({
    name : 'QUERY_PLUGIN_INFO',
    main : function(socket, cookie, data) {
        return PLUGIN_SCRIPTS_D.getPluginInfo();
    }
});
