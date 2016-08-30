/**
 * @author chenqx
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 拓展插件，用于管理项目和插件系统的服务拓展
 */
var fsEx = FS_EXPAND_D;
var fs = fsExtra;

// 保存当前所有载入的模块
var externalModules = [];

// 项目切换时
function onSwitchProject()
{
    _loadAllModule();
}

// 使用的插件产生变化时
function onEffectivePluginsChanged()
{
    _loadAllModule();
}

// 文件发生变化时
function onFileChanged(file)
{
    var moduleChanged = false;
    var len = externalModules.length;

    while (len--) {
        if (file.indexOf(externalModules[len]) === 0) {
            moduleChanged = true;
            break;
        }
    }

    if (moduleChanged) {
        _loadAllModule();
    }
}

// 清理当前依赖
function _unloadModule(moduleDir)
{
    var module = require('module');
    var allCacheModule = Object.keys(module._cache);
    var len = allCacheModule.length;
    while (len--) {
        var path = allCacheModule[len];
        if (path.indexOf(moduleDir) === 0) {
            var mod = module._cache[path];
            if (mod && mod.exports && mod.exports.destruct)
                mod.exports.destruct();
            delete module._cache[path];
        }
    }
}

// 载入项目中的配置
function _loadProjectModule()
{
    var externalModulesPath = path.join(G.gameRoot, 'Editor/Service');
    externalModules.push(externalModulesPath);
    var serviceExtend = USER_SCRIPTS_D.getServiceExtends();
    try {
        for (var idx = 0, len = serviceExtend.length;
            idx < len; ++idx) {
            var fullPath = path.join(G.gameRoot, serviceExtend[idx]);
            _load(fullPath);
        }
    }
    catch(ex) {
        trace('Load on module failed: ' + externalModulesPath);
        trace(ex);
    }
};

// 载入插件中的配置
function _loadPluginModule()
{
    var plugins = PLUGIN_SCRIPTS_D.getEffectivePlugin();
    var len = plugins.length;
    while (len--) {
        if (!fs.existsSync(plugins[len].serviceRoot))
            continue;
        externalModules.push(plugins[len].serviceRoot);
        try {
            _loadDir(plugins[len].serviceRoot);
        }
        catch(ex) {
            trace('Load on module failed: ' + plugins[len].serviceRoot);
            trace(ex);
        }
    }
};

// 载入所有模块
function _loadAllModule()
{
    // 清理之前载入的模块
    _clearAllModule();

    if (!G.gameRoot)
        return;
    try {
        _loadProjectModule();
        _loadPluginModule();
    }
    catch(e) {
        trace('Load on module failed');
        trace(e);
    }
};

// 清理当前项目所有引用的依赖
function _clearAllModule()
{
    var len = externalModules.length;

    while (len--) {
        _unloadModule(externalModules[len]);
    }

    externalModules = [];
};

// 载入一个代码文件
function _load(file)
{
    return require(file);
};

// 载入一个目录下的所有js代码
function _loadDir(dir) {
    var fullDir = path.join(G.editorRoot, dir);
    if (!fs.existsSync(dir)) {
        return;
    }
    var list = fs.readdirSync(dir);
    for (var i in list) {
        if (path.extname(list[i]).toLowerCase() !== '.js') continue;

        var p = path.join(dir, list[i]);
        var stat = fs.statSync(p);
        if (stat.isDirectory()) continue;

        // 载入
        require(p);
    }
};

// 载入编辑器已有的拓展模块
function loadExistModule(moduleName)
{
    return require(path.join(G.editorRoot, '../node_modules', moduleName));
};

// 模块析构函数
function destruct()
{
    G.emitter.removeListener('switchProject', onSwitchProject);
    G.emitter.removeListener('fileChanged', onFileChanged);
}

// 模块构造函数
function create()
{
    // 在项目切换时，需要切换环境中的服务器拓展
    G.emitter.on('switchProject', onSwitchProject);
    G.emitter.on('fileChanged', onFileChanged);
}

// 导出模块
global.EXTERNAL_MODULES_D = module.exports = {
    loadExistModule : loadExistModule,
    destruct : destruct,
    create : create,
}

// 执行模块构造函数
create();
