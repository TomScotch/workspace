/**
 * @author wudm
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 查询服务器配置
 */

var fs = fsExtra;

COMMAND_D.registerCmd({
    name : 'QUERY_EDITORSERVICE_SETTING',
    main : function(socket, cookie, args) {
        var key = args.key;
        var ret = { operRet : true };

        if (key instanceof Array) {
            var conf = SETTING_D.querySetting();
            var len = key.length,
                idx = -1;
            while (++idx < len) {
                ret[key[idx]] = conf[key[idx]];
            }
            return ret;
        }
        else {
            // 获取配置信息
            if (key) {
                var value = SETTING_D.querySetting(key);
                ret[key] = value;
            }
            return ret;
        }
    }
});
