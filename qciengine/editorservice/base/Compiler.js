/**
 * @author weism
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 提供编译的支持
 */

module.exports = {
    /**
     * 载入一个代码文件
     * @param file - 相对于工程根目录的路径
     */
    update : function(file, notReload) {
        var fullPath;
        if (typeof(file) === 'string')
            fullPath = path.join(G.editorRoot, file);
        else
            fullPath = file.moduleID;
        //console.log("Load ", fullPath);

        if (!notReload)
        {
            // 先将缓存清掉，使其每次都重新加载
            var module = require('module');
            var mod = module._cache[fullPath];
            if (mod && mod.exports && mod.exports.destruct)
                mod.exports.destruct();
            module._cache[fullPath] = undefined;
        }

        var ret = require(fullPath);
        ret.moduleID = fullPath;

        if (G.isBooted)
        {
            G.emitter.emit('postInit');

            // 执行完 postInit，清除 postInit 事件列表
            G.emitter.removeAllListeners('postInit');
        }

        return ret;
    },

    /**
     * 载入一个目录下的所有js代码
     * @param path - 相对于工程根目录的路径
     */
    loadDir : function(dir, notReload) {
        var fullDir = path.join(G.editorRoot, dir);
        var list = fs.readdirSync(fullDir);
        for (var i in list) {
            if (path.extname(list[i]) !== '.js') continue;

            var p = path.join(fullDir, list[i]);
            var stat = fs.statSync(p);
            if (stat.isDirectory()) continue;

            //console.log("Load ", p);

            if (!notReload)
            {
                // 先将缓存清掉，使其每次都重新加载
                var module = require('module');
                var mod = module._cache[p];
                if (mod && mod.exports && mod.exports.destruct)
                    mod.exports.destruct();
                module._cache[p] = undefined;
            }

            var ret = require(p);
            ret.moduleID = p;

            if (G.isBooted)
            {
                G.emitter.emit('postInit');

                // 执行完 postInit，清除 postInit 事件列表
                G.emitter.removeAllListeners('postInit');
            }
        }
    },
}

global.update = module.exports.update;
global.loadDir = module.exports.loadDir;
