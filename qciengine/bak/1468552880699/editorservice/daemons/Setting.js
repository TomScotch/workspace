/**
 * @author wudm
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 配置
 */
var fs = fsExtra;

// 范围修正
function _getStateHistorySize(v)
{
    if (v === undefined)
        // 没有值，取默认
        return 20;
    return Math.max(0, Math.min(30, parseInt(v)));
};

// 保存配置
function saveSetting(pairs)
{
    // 获取配置信息
    var conf;
    try {
        conf = fs.readJsonSync(path.join(G.editorRoot, 'project.setting'), { throws : false });
    }
    catch(e) {
        conf = null;
    }

    if (!conf) conf = {};

    var keys = Object.keys(pairs);
    var idx = keys.length;
    while (idx--) {
        var key = keys[idx];
        switch (key) {
            case 'stateHistorySize':
                conf[key] = pairs[key] = _getStateHistorySize(pairs[key]);
                break;
            default:
                conf[key] = pairs[key];
                break;
        }
    }

    // 保存
    FS_EXPAND_D.writeJsonSync(path.join(G.editorRoot, 'project.setting'), conf);

    return pairs;

};

// 查询配置
function querySetting(key)
{
    var conf;

    try {
        conf = fs.readJsonSync(path.join(G.editorRoot, 'project.setting'), {throws: false});
    }
    catch (e) {
        conf = null;
    }

    if (!conf) conf = {};

    conf.stateHistorySize = _getStateHistorySize(conf.stateHistorySize);
    return key ? conf[key] : conf;
};

// 模块析构函数
function destruct()
{
}

// 模块构造函数
function create()
{
}

// 导出模块
global.SETTING_D = module.exports = {
    saveSetting : saveSetting,
    querySetting : querySetting,
    destruct : destruct,
    create : create,
}

// 执行模块构造函数
create();
