/**
 * @author wudm
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 创建 JS 文件
 */
var fs = fsExtra;
var fsEx = FS_EXPAND_D;

var defineBehaviourContent = fs.readFileSync(path.join(G.editorRoot, 'Template/jsDefineBehaviour.templet.js'), 'utf-8');
var extendInspectorContent = fs.readFileSync(path.join(G.editorRoot, 'Template/jsExtendInspector.templet.js'), 'utf-8');

COMMAND_D.registerCmd({
    name : 'CREATE_JS',
    main : function(socket, cookie, data) {
        var destDir = data.destDir;
        var name = data.name;
        var fullPath = destDir + '/' + name;
        var content;

        // 如果是虚拟目录禁止添加
        if (fullPath.indexOf('Plugins') === 0) {
            return false;
        }

        // 此时 name 一定是 .js
        if (fsEx.extname(name) !== '.js')
            return false;

        fullPath = fsEx.expandPath(path.join(G.gameRoot, fullPath));
        if (fs.existsSync(fullPath))
            return false;

        // 生成脚本模板
        content = destDir.indexOf('Editor') === 0 ? extendInspectorContent : defineBehaviourContent;
        content = content.replace(/__SCRIPT_NAME__/g, name.slice(0, -3));

        // 写入后端
        fs.writeFileSync(fullPath, content);

        return true;
    }
});
