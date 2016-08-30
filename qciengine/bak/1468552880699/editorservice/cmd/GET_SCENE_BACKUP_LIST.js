/**
 * @author wudm
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 获取一个场景的备份列表
 */

COMMAND_D.registerCmd({
    name : 'GET_SCENE_BACKUP_LIST',
    main : function(socket, cookie, args) {
        var scenePath = args.scenePath;

        if (!/\.state$/.test(scenePath))
            scenePath = scenePath + '.state';

        return {
            operRet: true,
            list: SCENE_MANAGER_D.getBackupList(scenePath)
        };
    }
});
