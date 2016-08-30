/**
 * @author weism
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 保存场景
 */

COMMAND_D.registerCmd({
    name : 'REVERT_SCENE_TO_REVISION',
    main : function(socket, cookie, data) {
        var scenePath = data.scenePath;
        var version = data.version;

        if (!/\.state$/.test(scenePath))
            scenePath = scenePath + '.state';

        return { operRet : SCENE_MANAGER_D.revertToRevision(scenePath, version) };
    }
});
