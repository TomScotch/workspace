/**
 * @author chenx
 * copyright 2015 Qcplay All Rights Reserved.
 * @date 2016.3.30
 *
 * 负责记录 bin 资源所资源的资源个数，方便在加载 bin 资源时，能提前取得加载的资源总数
 */
var fs = fsExtra;
var fsEx = FS_EXPAND_D;

var assetCountMap = {};
var saveToPath = 'Assets/meta/assetCountMap.js';
var header = 'assetCountMap = ';
var tail = ';\n';

function _getAssetCount(assetPath)
{
    var fullPath = fsEx.expandPath(path.join(G.gameRoot, assetPath));
    var content = {};
    try{
        content = fs.readJSONFileSync(fullPath);
        content = JSON.parse(content[1]);
    }
    catch(e) {
        console.log(e.stack);
    }
    var assetCount = 1;
    for (var key in content.dependences)
    {
        if (key != "__builtin_resource__")
            assetCount += 1;
    }

    return assetCount;
}

function _save()
{
    fs.writeFileSync(path.join(G.gameRoot, saveToPath),
        header + JSON.stringify(assetCountMap, null, 2) + tail);
}

function _switchProject()
{
    try {
        if (!fs.existsSync(path.join(G.gameRoot, 'Assets/scene')))
            return;

        // 则遍历 Assets/scene 目录，生成所有场景所依赖的资源数
        var fileList = [];
        var searchSceneFile = function(assetPath, list) {
            var fullPath = path.join(G.gameRoot, assetPath);
            var dirList = fs.readdirSync(fullPath);

            for (var i = 0; i < dirList.length; i++)
            {
                // 若为子目录，则递归查找
                var tempPath = fullPath + '/' + dirList[i];
                var isDirectory = fs.statSync(tempPath).isDirectory();
                if (isDirectory)
                    searchSceneFile(assetPath + '/' + dirList[i], list);
                else
                {
                    // 判断是否为 .state 文件
                    var pos = dirList[i].indexOf('.state');
                    if (pos > 0 && !dirList[pos+6])
                        list.push(assetPath + '/' + dirList[i])
                }
            }
        }

        searchSceneFile('Assets/scene', fileList);

        // 遍历所有的场景
        for (var i = 0; i < fileList.length; i++)
        {
            var index = fileList[i].lastIndexOf('.state');
            var key = fileList[i].substring(0, index) + '.bin';
            assetCountMap[key] = _getAssetCount(key);
        }

        // 加入 Temp/scene_editor.state 的资源数
        assetCountMap['Temp/scene_editor.bin'] = _getAssetCount('Temp/scene_editor.bin');

        // 保存文件
        _save();
    }
    catch(e) {
        console.log(e.stack);
    }

    if (!assetCountMap) assetCountMap = {};
}

function _genTemplateContent(eventInfo)
{
    // 只记录存在的资源，清理下 assetCountMap

    var isChanged;
    for (var key in assetCountMap)
    {
        if (!fs.existsSync(path.join(G.gameRoot, key)))
        {
            // 不存在的资源，需要删除
            isChanged = true;
            delete assetCountMap[key];
        }
    }

    if (isChanged) {
        _save();
    }

    var content = eventInfo.content;

    // 判定 assetCountMap 数据长度
    if (!Object.keys(assetCountMap).length) {
        // 没有任何数据配置
        eventInfo.content = content.replace(/__ASSET_COUNT__/g, '');
    }
    else {
        var publish = eventInfo.publish;

        var dstPath = './' + saveToPath;
        if (!publish) {
            // 增加唯一标记码确保不被缓存
            dstPath = USER_SCRIPTS_D.addJsExtToDenyCache(dstPath, true);
        }

        // 写入数据
        eventInfo.content = content.replace(/__ASSET_COUNT__/g, "'" + dstPath + "',");
    }
}

// 更新某个资源所依赖的资源数
function recordAssetCount(assetPath)
{
    var count = _getAssetCount(assetPath);
    assetCountMap[assetPath] = count;

    // 保存文件
    _save();
}

function getAssetCountMap()
{
    return assetCountMap;
}

// 模块析构函数
function destruct()
{
    G.emitter.removeListener('switchProject', _switchProject);
    G.emitter.removeListener('genTemplateContent', _genTemplateContent);
}

// 模块构造函数
function create()
{
    // 关注切换工程，重新生成 assetCountMap
    G.emitter.on('switchProject', _switchProject);

    // 关注生成游戏的模板，填入 assetCountMap.js 数据
    G.emitter.on('genTemplateContent', _genTemplateContent);
}

// 导出模块
global.ASSET_COUNT_D = module.exports = {
    recordAssetCount : recordAssetCount,
    getAssetCountMap : getAssetCountMap,
    destruct : destruct,
    create : create,
}

// 执行模块构造函数
create();
