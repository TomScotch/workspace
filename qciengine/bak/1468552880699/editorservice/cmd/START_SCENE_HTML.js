/**
 * @author weism
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 请求生成Temp/StartScene.html
 */
var fs = fsExtra;

COMMAND_D.registerCmd({
    name : 'START_SCENE_HTML',
    main : function(socket, cookie, paras) {
        // 读取模板文件
        var content = fs.readFileSync(path.join(G.editorRoot, 'Template/StartScene.templet.html'), 'utf8');
        // 替换插件文件
        content = PLUGIN_SCRIPTS_D.genTemplateContent(content);
        // 写入目标文件
        fs.writeFileSync(G.gameRoot + 'Temp/StartScene.html',
            USER_SCRIPTS_D.genTemplateContent(content));
        return 1;
    }
});

