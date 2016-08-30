/**
 * Created by weism
 *
 * 修正defaultAnimation序列化不对的问题
 */

var MY_FLAG = 6;

var fs = fsExtra;

var processFile = function(content) {
    var r = false;
    var v = content.data;
    if (content.class === 'qc.Sprite') {
        if (v.defaultAnimation) {
            r = true;
            v.defaultAnimation[0] = 7;
        }
    }

    var children = v.children;
    if (children && children.length > 0) {
        for (var i = 0; i < children.length; i++) {
            var r2 = processFile(children[i]);
            if (r2) r = true;
        }
    }
    return r;
};

var convert = function(dir) {
    var result = false;
    runPatch(dir, MY_FLAG, function() {
        // 遍历Assets目录，找出所有的场景和预制，修改defaultAnimation字段的值
        explorePathAndFunc(path.join(dir, 'Assets'), function(file, ext) {
            if (ext !== '.state' && ext !== '.prefab') return;

            // 读取预制的文件内容，遍历找到Sprite节点并修改defaultAnimation字段
            var content = fs.readJsonSync(file, { throws : false });
            if (processFile(content)) {
                result = true;
                FS_EXPAND_D.writeJsonSync(file, content);
            }
        });
    });
    if (result) {
        // 重新打包下资源
        WATCH_D.exploreDaemon();
    }
};

PATCH_D.registerPatch(MY_FLAG, convert);
