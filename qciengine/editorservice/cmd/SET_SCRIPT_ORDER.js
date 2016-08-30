/**
 * @author wudm
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 客户端向服务器请求设置脚本依赖关系
 */

COMMAND_D.registerCmd({
    name : 'SET_SCRIPT_ORDER',
    main : function(socket, cookie, args) {
        var basePath = args.basePath;
        var order = args.order;

        return USER_SCRIPTS_D.setScriptOrder(basePath, order);
    }
});

