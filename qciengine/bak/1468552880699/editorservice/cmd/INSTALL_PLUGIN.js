/**
 * @author chenqx
 * copyright 2015 Qcplay All Rights Reserved.
 */

/*
 * 安装插件
 */

COMMAND_D.registerCmd({
    name : 'INSTALL_PLUGIN',
    main : function(socket, cookie, data, callback) {
        return PLUGIN_SCRIPTS_D.installPlugin(data.pluginId, data.version, data.session, callback);
    }
});
