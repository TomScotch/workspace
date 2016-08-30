/**
 * @author chenqx
 * copyright 2015 Qcplay All Rights Reserved.
 */

/*
 * 生成安卓Keystore文件
 */

COMMAND_D.registerCmd({
    name : 'CREATE_ANDROID_KEYSTORE',
    main : function(socket, cookie, data) {
        return PROJECT_D.createAndroidKeystore(data);
    }
});

