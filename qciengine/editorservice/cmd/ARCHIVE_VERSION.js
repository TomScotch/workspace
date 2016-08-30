/**
 * @author chenqx
 * copyright 2015 Qcplay All Rights Reserved.
 */

/*
 * 获取当前的最新版本信息
 */

COMMAND_D.registerCmd({
    name : 'ARCHIVE_VERSION',
    main : function(socket, cookie, data) {
        return UPDATE_MANAGER_D.archiveVersion(data.version);
    }
});
