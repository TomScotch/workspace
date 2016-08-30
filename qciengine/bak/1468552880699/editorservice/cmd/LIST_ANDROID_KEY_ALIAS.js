/**
 * @author chenqx
 * copyright 2015 Qcplay All Rights Reserved.
 */

/*
 * 获取安卓Keystore文件的alias列表
 */

COMMAND_D.registerCmd({
    name : 'LIST_ANDROID_KEY_ALIAS',
    main : function(socket, cookie, data) {
        return PROJECT_D.listAndroidKeystore(data);
    }
});


