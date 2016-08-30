/**
 * @author weism
 * copyright 2016 Qcplay All Rights Reserved.
 *
 * 设置使用的语言
 */
COMMAND_D.registerCmd({
    name : 'SWITCH_LANGUAGE',
    main : function(socket, cookie, language) {
        G.setLanguage(language);
    }
});
