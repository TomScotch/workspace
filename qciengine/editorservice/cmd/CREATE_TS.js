/**
 * @author weism
 * copyright 2016 Qcplay All Rights Reserved.
 *
 * 创建 TS 文件
 */
var fs = fsExtra;
var fsEx = FS_EXPAND_D;

var defineBehaviourContent = fs.readFileSync(path.join(G.editorRoot, 'Template/tsDefineBehaviour.templet.js'), 'utf-8');

COMMAND_D.registerCmd({
    name : 'CREATE_TS',
    main : function(socket, cookie, data) {
        var destDir = data.destDir;
        var name = data.name;
        var fullPath = destDir + '/' + name;
        var content;

        // 如果是虚拟目录禁止添加
        if (fullPath.indexOf('Plugins') === 0) {
            return false;
        }

        // 此时 name 一定是 .ts
        if (fsEx.extname(name) !== '.ts')
            return false;

        fullPath = fsEx.expandPath(path.join(G.gameRoot, fullPath));
        if (fs.existsSync(fullPath))
            return false;

        // 生成脚本模板
        content = defineBehaviourContent;
        content = content.replace(/__SCRIPT_NAME__/g, name.slice(0, -3));

        // 写入后端
        fs.writeFileSync(fullPath, content);
        return true;
    }
});
