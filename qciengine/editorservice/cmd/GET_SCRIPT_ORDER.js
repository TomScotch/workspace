/**
 * @author wudm
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 客户端向服务器请求脚本加载顺序
 */

COMMAND_D.registerCmd({
    name : 'GET_SCRIPT_ORDER',
    main : function(socket, cookie, args) {
        return {
            operRet : true,
            order : USER_SCRIPTS_D.getScriptOrder(args.basePath)
        };
    }
});
