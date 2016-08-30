/**
 * @author wudm
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 创建新工程
 */
COMMAND_D.registerCmd({
    name : 'CREATE_PROJECT',
    main : function(socket, cookie, args) {
        var ret = PROJECT_D.createProject(args.path);
        if (ret === true)
            return { 'operRet' : true };
        else
            return { 'operRet' : false, 'reason' : ret };
    }
});
