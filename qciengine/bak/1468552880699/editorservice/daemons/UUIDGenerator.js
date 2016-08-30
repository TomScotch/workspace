/**
 * @author wudm
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 资源 uuid 管理，尽可能复用之前使用过的 uuid
 */
var fs = fsExtra;

var uuidRecord = {};
var saveToPath = 'ProjectSetting/uuidHistory.setting';

function _switchProject()
{
    // 从配置中获取初始信息
    try {
        uuidRecord = fs.readJsonSync(path.join(G.gameRoot, saveToPath), { throws : false });
    }
    catch(e) {}
    if (!uuidRecord) uuidRecord = {};
}

function _saveUrlMap(urlMap)
{
    var changed = false;

    for (var uuid in urlMap) {
        var url = urlMap[uuid];

        if (uuidRecord[url] === uuid)
            // 已经有这份记录了
            continue;

        // 记录下来，并且标记有变动
        changed = true;
        uuidRecord[url] = uuid;
    }

    if (!changed) return;

    // 发生变动，则写入文件中
    FS_EXPAND_D.writeJsonSync(path.join(G.gameRoot, saveToPath), uuidRecord);
}

// 申请新的 uuid
function resUUID(url)
{
    url = toUnixPath(path.relative(G.gameRoot, url));
    return uuidRecord[url] || uuid();
};

// 模块析构函数
function destruct()
{
    G.emitter.removeListener('switchProject', _switchProject);
    G.emitter.removeListener('saveUrlMap', _saveUrlMap);
}

// 模块构造函数
function create()
{
    // 关注切换工程，清空 uuid 记录
    G.emitter.on('switchProject', _switchProject);

    // 关注 url map 被保存
    G.emitter.on('saveUrlMap', _saveUrlMap);
}

// 导出模块
global.UUID_GENERATOR_D = module.exports = {
    resUUID : resUUID,
    destruct : destruct,
    create : create,
}

// 执行模块构造函数
create();
