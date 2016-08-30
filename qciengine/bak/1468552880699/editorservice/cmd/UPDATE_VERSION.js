/**
 * @author chenqx
 * copyright 2015 Qcplay All Rights Reserved.
 */

COMMAND_D.registerCmd({
    name : 'UPDATE_VERSION',
    main : function(socket, cookie, data) {
        return UPDATE_MANAGER_D.updateVersion();
    }
});
