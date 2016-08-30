/**
 * @author chenqx
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 服务器与客户端通信通道的消息接收
 */

COMMAND_D.registerCmd({
    name : 'SERVICE_PIPE_COMMAND',
    main : function(socket, cookie, data) {
        return SERVICE_PIPE_D.emit(data.command, data.data);
    }
});

