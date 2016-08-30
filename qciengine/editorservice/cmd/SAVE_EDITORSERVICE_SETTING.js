/**
 * @author wudm
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 设置服务器配置
 */

var fs = fsExtra;

COMMAND_D.registerCmd({
    name : 'SAVE_EDITORSERVICE_SETTING',
    main : function(socket, cookie, args) {

        // 获取配置信息
        var v = SETTING_D.saveSetting(args);

        var ret = { operRet : true };
        ret.valid = v;
        return ret;
    }
});
