/**
 * @author chenqx
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 插件的逻辑脚本维护
 * 数据来源：GAME_FILES_D
 */
var fsEx = FS_EXPAND_D;
var fs = fsExtra;
var jsZip = require('jszip');

var pluginsRoot = path.join(G.editorRoot,"../Plugins");
var plugins = [];
var effectivePlugins = {};
var externalDependencies = {};

/**
 * 格式化字符串
 * @param  {string} base - 文本原文
 * @param  {{}} args - 参数键值对
 * @return {string}
 */
function _formatString(base, args)
{
    var content = base;
    for (var key in args) {
        var reg = new RegExp('\\{' + key + '\\}','g');
        content = content.replace(reg, args[key]);
    }
    return content;
};

function _preSwitchProject()
{
    _reloadEffectivePlugins();
    WATCH_D.watchDir(pluginsRoot, 'Plugins');
}

function _fileChanged(file)
{
    if (file.indexOf('Plugins') >= 0) {
        var lowerCaseName = file.toLowerCase();
        if (lowerCaseName.slice(-8) === '.js.meta' ||
            lowerCaseName.slice(-3) === '.js') {
            USER_SCRIPTS_D.markJsExtDirty(fsEx.getVirtualPath(file));
            _collectPlugins();
            debug('plugin {0} changed, generate html.', file);
            PROJECT_D.prepareGenGameHTML();
            G.emitter.emit('refreshStartupFile');
        }
    }
}

/**
 * 像服务器查询插件下载地址
 * @param pluginId
 * @param session
 * @param callback
 */
function _queryPluginDownloadAddress(pluginId, session, callback)
{
    var delayQuery = function(e) {
        setTimeout(_queryPluginDownloadAddress, 20000, pluginId, session, callback);
    };
    var queryAddress = 'http://127.0.0.1/pluginAddress.php?pluginId=' + pluginId + '&session=' + session;
    http.get(queryAddress, function(res) {
        res.on('data', function(data) {
            try {
                var json = data.toString();
                var pluginInfo = JSON.parse(json);
                if (callback)
                    callback(pluginInfo);
            }
            catch (e) {
                delayQuery(e);
            }
        });
    }).on('error', function(e) {
        delayQuery(e);
    });
};

/**
 * 下载文件到指定路径
 * @param url
 * @param path
 * @param callback
 * @private
 */
function _download(url, path, callback)
{
    http.get(url, function(res) {
        var writeStream = fs.createWriteStream(path);
        writeStream.on('close', function() {
            callback && callback(res);
        });
        res.pipe(writeStream);
    });
};

/**
 * 保存当前版本
 * @private
 */
function _bakCurrVersion(pluginId)
{
    var baseDir = path.join(G.editorRoot, '../Plugins/', pluginId);
    var bakDir = path.join(G.editorRoot, '../Plugins/', 'bak', pluginId + "_" + uuid());
    fs.ensureDirSync(bakDir);
    fs.renameSync(path.join(baseDir, 'lib'), path.join(bakDir, 'lib'));
    fs.renameSync(path.join(baseDir, 'editorservice'), path.join(bakDir, 'editorservice'));
    fs.renameSync(path.join(baseDir, 'node_modules'), path.join(bakDir, 'node_modules'));
    fs.renameSync(path.join(baseDir, 'package.json'), path.join(bakDir, 'package.json'));
};

/**
 * 解压安装插件
 * @param pluginId
 * @param pluginFile
 * @param callback
 * @private
 */
function _unzipPlugin(pluginId, pluginFile, callback)
{
    fs.readFile(pluginFile, function(err, data) {
        if (err) {
            callback(false, err);
            return;
        }

        var zip = new jsZip();

        var unzipDir = path.join(G.editorRoot, '../Plugins', pluginId);
        fs.ensureDirSync(unzipDir);
        try {
            zip.load(data);
        }
        catch(e) {
            callback(false, e);
            return;
        }

        // 保存当前版本
        _bakCurrVersion();

        // 解压版本
        Object.keys(zip.files).forEach(function(filename) {
            var node = zip.files[filename];
            if (node.dir) {
                fs.ensureDirSync(path.join(unzipDir, filename));
            }
            else {
                var content = zip.files[filename].asNodeBuffer();
                if (content) {
                    var filePath = path.join(unzipDir, filename);
                    fs.ensureDirSync(path.dirname(filePath));
                    fs.writeFileSync(filePath, content);
                }
            }

        });
        // 更新完成，派发事件给编辑器
        COMMAND_D.broadcast('UPDATE_VERSION_RESULT', {
            result: 0
        });
    });
};

/**
 * 比较版本号
 * @param v1
 * @param v2
 * @returns {number}
 */
function _compareVersion(v1, v2) {
    var one = v1.split('.');
    var two = v2.split('.');
    var max = Math.max(one.length, two.length);
    for (var idx = 0; idx < max; ++idx) {
        var diff = (parseInt(one[idx]) || 0) - (parseInt(two[idx]) || 0);
        if (diff !== 0)
            return diff < 0 ? -1 : 1;
    }
    return 0;
};

/**
 * 搜集所有存在的插件
 * @param dir
 */
function _collectPlugins()
{
    // 读取整个插件目录的资源
    var collectJS = function(dir, except) {
        var files = [];
        if (!fs.existsSync(dir)) {
            return files;
        }
        var list = fs.readdirSync(dir);
        list.forEach(function(subPath) {
            var fullPath = path.join(dir, subPath);
            var stat;

            try { stat = fs.statSync(fullPath); } catch (e) { return; }
            if (!stat) return;
            // 隐藏文件不收集
            if (fsEx.isHidden(dir, subPath)) return;

            if (stat.isDirectory()) {
                var tmp = collectJS(fullPath, except);
                (tmp.length > 0) && Array.prototype.push.apply(files, tmp);
            }
            else if (fsEx.extname(fullPath) === '.js') {
                var len = except.length;
                var isException = false;
                while (len-- && !isException) {
                    isException = fullPath.indexOf(except) === 0;
                }
                if (!isException)
                    files.push(fullPath);
            }
        });
        return files;
    };

    var sortByDependece = function(col, rootPath, dependence) {
        // 排序
        var ret =  col.sort(function(a, b) {
            var shortA = fsEx.toUnixFileName(path.relative(rootPath, a));
            var shortB = fsEx.toUnixFileName(path.relative(rootPath, b));
            if (shortA === shortB && a !== b) {
                return a < b ? -1 : 1;
            }
            return dependence.indexOf(shortB) - dependence.indexOf(shortA);
        });
        return ret;
    };

    var searchPlugin = function(dir) {
        var tempPlugins = [];
        var list = fs.readdirSync(dir);
        list.forEach(function(subPath) {
            // 隐藏文件不收集
            if (fsEx.isHidden(dir, subPath)) return;

            var fullPath = path.join(dir, subPath);
            var stat;

            try { stat = fs.statSync(fullPath); } catch (e) { return; }
            if (!stat) return;

            if (stat.isDirectory()){
                var tmp = searchPlugin(fullPath);
                if (tmp.length > 0)
                    Array.prototype.push.apply(tempPlugins, tmp);
            }
            else if (fsEx.extname(fullPath) === '.plugin') {
                var plugin;
                // 创建插件
                try {
                    plugin = fs.readJSONFileSync(fullPath) || {};
                }
                catch (e) {
                    trace('Collect plugins error:' + e);
                    return;
                }

                plugin.root = path.dirname(fullPath);
                plugin.virtualRoot = path.join('Plugins', plugin.id);
                plugin.editorRoot = path.join(dir, plugin.editorRoot || "Editor" );
                plugin.scriptRoot = path.join(dir, plugin.scriptRoot || "Script");
                plugin.assetRoot = path.join(dir, plugin.assetRoot || "Assets");
                plugin.serviceRoot = path.join(dir, plugin.serviceRoot || "Editor/Service");

                plugin.editorFiles = plugin.editorFiles || [];
                plugin.scriptFiles = plugin.scriptFiles || [];
                plugin.editorFiles.forEach(function(value, idx){
                    plugin.editorFiles[idx] = path.join(dir, plugin.editorFiles[idx]);
                });
                plugin.scriptFiles.forEach(function(value, idx){
                    plugin.scriptFiles[idx] = path.join(dir, plugin.scriptFiles[idx]);
                });

                // 对当前脚本依赖整理个依赖排序
                if (plugin.scriptDependence) {
                    scriptDependence = toposort(plugin.scriptDependence);
                }
                else {
                    scriptDependence = plugin.scriptOrder || [];
                    scriptDependence.reverse();
                }

                var col = collectJS(plugin.editorRoot, plugin.editorFiles.concat(plugin.serviceRoot));
                col.length > 0 && Array.prototype.push.apply(plugin.editorFiles,
                    sortByDependece(col, plugin.editorRoot, scriptDependence));

                col = collectJS(plugin.scriptRoot, plugin.scriptFiles);
                col.length > 0 && Array.prototype.push.apply(plugin.scriptFiles,
                    sortByDependece(col, plugin.scriptRoot, scriptDependence));

                plugin.editorFiles.forEach(function(value, idx){
                    if (plugin.editorFiles[idx].indexOf("://") < 0) {
                        plugin.editorFiles[idx] = path.relative(path.dirname(pluginsRoot), plugin.editorFiles[idx]);
                    }
                });
                plugin.scriptFiles.forEach(function(value, idx){
                    if (plugin.scriptFiles[idx].indexOf("://") < 0) {
                        plugin.scriptFiles[idx] = path.relative(path.dirname(pluginsRoot), plugin.scriptFiles[idx]);
                    }
                });
                tempPlugins.push(plugin);
            }
        });
        return tempPlugins;
    };

    // 搜集所有插件
    var allPlugins = searchPlugin(pluginsRoot);
    var tempPlugins = {};
    var dependencies = {};
    for (var key in allPlugins) {
        var plugin = allPlugins[key];
        try {
            if (tempPlugins[plugin.id]) {
                // 取高版本使用
                if (_compareVersion(plugin, tempPlugins[plugin.id]) <= 0) {
                    continue;
                }
            }
            tempPlugins[plugin.id] = plugin;
        }
        catch (e) {
            trace('Collect plugins error:' + e);
            continue;
        }
    }
    plugins = tempPlugins;
    _reloadEffectivePlugins();

};

// 载入当前使用的插件
function _reloadEffectivePlugins()
{
    // 获取所有生效插件
    var tempEffectivePlugins;
    try {
        tempEffectivePlugins = fs.readJSONFileSync(G.gameRoot + 'ProjectSetting/plugin.setting', {throws : false} ) || {};
    }
    catch(e) {
        tempEffectivePlugins = {};
    }

    // 老版本数组结构的生效插件需要转化为结构类型
    if (Array.isArray(tempEffectivePlugins)) {
        var old = tempEffectivePlugins;
        tempEffectivePlugins = {};
        old.forEach(function(el) {
            tempEffectivePlugins[el] = {};
        });
    }
    var dependencies = {};
    var tempExternalDependencies = {};
    for (var el in tempEffectivePlugins) {
        var plugin = plugins[el];
        var dependence = [];
        if (plugin) {
            Array.prototype.push.apply(dependence, plugin.dependence);
            var variable = tempEffectivePlugins[el].variable || {};
            for (var key in plugin.variable) {
                if (!variable[key]) {
                    variable[key] = plugin.variable[key].default || '';
                }

            }
            var dependencieList = tempExternalDependencies[el] = [];
            plugin.external && plugin.external.forEach(function(el) {
                dependencieList.push(_formatString(el, variable));
            });
        }
        dependencies[el] = dependence;
    }
    // 生成依赖的拓扑图
    var topoList = toposort(dependencies);
    effectivePlugins = {};

    var len = topoList.length;
    while (len--) {
        var id = topoList[len];
        if (tempEffectivePlugins[id]) {
            effectivePlugins[id] = tempEffectivePlugins[id];
        }
    }
    externalDependencies = tempExternalDependencies;
    _refreshVirtualPath();
};

/**
 * 刷新虚拟目录
 */
function _refreshVirtualPath()
{
    fsEx.clearVirtualPath('plugins');
    var plugin;
    for (var pluginId in effectivePlugins) {
        if (!(plugin = plugins[pluginId])) continue;
        fsEx.mapVirtualPath('plugins', path.join(G.gameRoot, plugin.virtualRoot), plugin.root);
    }

    //派发事件给客户端
    COMMAND_D.broadcast('FILE_CHANGED', {
        event: null,
        fileName: '/Plugins',
        exist: null
    });
};

/**
 * 按插件组获取所有逻辑脚本
 * @return {[type]} [description]
 */
function _getPluginScriptGroup()
{
    var plugin = null,
        scripts = [];
    for (var pluginId in effectivePlugins) {
        if (!(plugin = plugins[pluginId])) continue;
        scripts[pluginId] = plugin.scriptFiles;
    }
    return scripts;
};

/**
 * 按插件分组获取编辑器扩展的脚本列表
 */
function _getEditorExtendsGroup()
{
    var plugin = null,
        scripts = [];
    // 取得用户自定义脚本，强制在Game/Scripts目录下
    for (var pluginId in effectivePlugins) {
        if (!(plugin = plugins[pluginId])) continue;
        scripts[pluginId] = plugin.editorFiles;
    }
    return scripts;
};

/**
 * 打印逻辑脚本
 */
function _printLogicScripts(publish)
{
    var scripts = _getPluginScriptGroup();
    var content = '';
    for (var i in scripts) {
        var pluginScripts = scripts[i];
        var len = pluginScripts.length;
        while (len-- > 0) {
            var s = pluginScripts[len];
            if (!publish) {
                // 后面挂载个随机字符串，确保浏览器不会加载缓存的代码
                s = USER_SCRIPTS_D.addJsExtToDenyCache(s);
            }
            content = "\t\t\t[" + "'../" + s.replace(/\\/g,'/') + "', '" + i + "'],\n" + content;
        }
    }
    return content;
};

/**
 * 打印外部引用脚本
 * @param publish
 * @returns {string}
 */
function _printExternalDependenceScripts(publish)
{
    var scripts = externalDependencies;
    var content = '';
    for (var i in scripts) {
        var pluginScripts = scripts[i];
        var len = pluginScripts.length;
        while (len-- > 0) {
            var s = pluginScripts[len];
            // 外部引用脚本不需要添加随机字符串
            if (s.indexOf("://") > 0) {
                content += "\t\t\t[" + "'" + s + "', '" + i + "'],\n";
            }
            else {
                if (!publish) {
                    s = USER_SCRIPTS_D.addJsExtToDenyCache(s);
                    content = "\t\t\t[" + "'../" + s.replace(/\\/g,'/') + "', '" + i + "'],\n" + content;
                }
                else {
                    content = "\t\t\t[" + s.replace(/\\/g,'/') + "', '" + i + "'],\n" + content;
                }
            }
        }
    }
    return content;
};

/**
 * 保存生效的插件信息
 */
function saveEffectivePlugins(effective)
{
    if (effective) {
        effectivePlugins = effective;
    }
    fs.writeJSONFileSync(G.gameRoot + 'ProjectSetting/plugin.setting', effectivePlugins);

    // 重新生成游戏启动文件
    debug('save plugins, generate html.');
    PROJECT_D.genGameHTML();

    G.emitter.emit('refreshStartupFile');
    G.emitter.emit('effectivePluginsChanged');
    _refreshVirtualPath();
    return true;
};

/**
 * 获取指定插件的脚本信息
 */
function getPluginScript(id)
{
    var plugin = plugins[id];
    if (plugin) {
        var editor = [];
        var script = [];
        plugin.editorFiles.forEach(function(el) {
            editor.push(USER_SCRIPTS_D.addJsExtToDenyCache(el));
        });
        plugin.scriptFiles.forEach(function(el){
            script.push(USER_SCRIPTS_D.addJsExtToDenyCache(el));
        });
        return {
            editor : editor,
            script : script,
            external : plugin.external,
            variable : plugin.variable,
        };
    }
    else {
        return {
            editor : [],
            script : [],
            external : [],
            variable : []
        };
    }
};

/**
 * 获取当前的插件信息
 */
function getPluginInfo()
{
    var allPlugin = {};
    _collectPlugins();
    for (var key in plugins) {
        allPlugin[key] = {
            name: plugins[key].name,
            version: plugins[key].version,
            variable : plugins[key].variable
        };
    }
    return {
        plugins : allPlugin,
        effective : effectivePlugins
    };
};

/**
 * 按照脚本依赖，获取所有的资源路径列表
 */
function getPluginAssets()
{
    var plugin = null,
        assets = [];
    for (var pluginId in effectivePlugins) {
        if (!(plugin = plugins[pluginId])) continue;
        assets.push(plugin.assetRoot);
    }
    return assets;
};

/**
 * 按照脚本依赖，获取所有的逻辑脚本列表
 */
function getPluginScripts()
{
    var plugin = null,
        scripts = [];
    for (var pluginId in effectivePlugins) {
        if (!(plugin = plugins[pluginId])) continue;
        Array.prototype.push.apply(scripts, plugin.scriptFiles);
    }
    return scripts;
};

/**
 * 获取生效中的插件
 */
function getEffectivePlugin()
{
    var plugin = null,
        tempPlugins = [];
    for (var pluginId in effectivePlugins) {
        if (!(plugin = plugins[pluginId])) continue;
        tempPlugins.push(plugin);
    }
    return tempPlugins;
};

/**
 * 获取编辑器扩展的脚本列表
 */
function getEditorExtends()
{
    var plugin = null,
        scripts = [];
    // 取得用户自定义脚本，强制在Game/Scripts目录下
    for (var pluginId in effectivePlugins) {
        if (!(plugin = plugins[pluginId])) continue;
        Array.prototype.push.apply(scripts, plugin.editorFiles);
    }
    return scripts;
};

/**
 * 打印缓存的外部引用脚本
 * @param publish
 * @returns {string}
 */
function printCacheExternalDependenceScripts(publish)
{
    var scripts = externalDependencies;
    var content = '';
    for (var i in scripts) {
        var pluginScripts = scripts[i];
        var len = pluginScripts.length;
        while (len-- > 0) {
            var s = pluginScripts[len];
            // 外部引用脚本不需要添加随机字符串
            if (s.indexOf("://") > 0) {
                content += s + "\n";
            }
            else {
                content = s.replace(/\\/g,'/') + "\n" + content;
            }
        }
    }
    return content;
};

/**
 * 打印编辑器扩展脚本
 */
function printEditorExtends()
{
    var template = '    <script src="__FILE__" plugin_id="__PLUGIN_ID__"></script>\n';
    var scripts = _getEditorExtendsGroup();
    var content = '';
    for (var i in scripts) {
        var pluginScripts = scripts[i];
        var len = pluginScripts.length;
        while (len-- > 0) {
            var s = pluginScripts[len];
            s = USER_SCRIPTS_D.addJsExtToDenyCache(s);
            temp = template.replace(/__FILE__/g, '' + s.replace(/\\/g,'/'));
            temp = temp.replace(/__PLUGIN_ID__/g, i);
            content = temp + content;

        }
    }
    return content;
};

/**
 * 加工 StartGame/StartScene 模板
 */
function genTemplateContent(content, publish)
{
    // 添加参数定义
    var variables = {};
    for (var key in effectivePlugins) {
        variables[key] = effectivePlugins[key].variable;
    }
    content = content.replace(/__PLUGIN_VARIABLES__/g, '\t\t_pluginVariables_=' + JSON.stringify(variables, null, '\t'));

    content = content.replace(/__EXTERNAL_PLUGINS_SCRIPTS__/g, _printExternalDependenceScripts(publish));
    content = content.replace(/__PLUGINS_SCRIPTS__/g, _printLogicScripts(publish));
    return content;
};

/**
 * 安装插件
 */
function installPlugin(pluginId, version, session, callback)
{
    var pluginDownloadPath = path.join(G.editorRoot, '../Plugins/Temp');
    fs.ensureDirSync(pluginDownloadPath);
    var downloadAndInstall = function(address) {
        _download(address, pluginDownloadPath, function() {
        });
    };

    // 根据 pluginId 和 session 请求下载地址
    var queryCallback = function(result) {
        if (result.result !== 0 || result.address) {
            callback(result.result || -1);
            return;
        }

    };
    _queryPluginDownloadAddress(pluginId, session, queryCallback);
};

// 模块析构函数
function destruct()
{
    G.emitter.removeListener('preSwitchProject', _preSwitchProject);
    G.emitter.removeListener('fileChanged', _fileChanged);
}

// 模块构造函数
function create()
{
    _collectPlugins();
    G.emitter.on('preSwitchProject', _preSwitchProject);
    G.emitter.on('fileChanged', _fileChanged);

    WATCH_D.watchDir(pluginsRoot, 'Plugins');
}

// 导出模块
global.PLUGIN_SCRIPTS_D = module.exports = {
    saveEffectivePlugins : saveEffectivePlugins,
    getPluginScript : getPluginScript,
    getPluginInfo : getPluginInfo,
    getPluginAssets : getPluginAssets,
    getPluginScripts : getPluginScripts,
    getEffectivePlugin : getEffectivePlugin,
    getEditorExtends : getEditorExtends,
    printCacheExternalDependenceScripts : printCacheExternalDependenceScripts,
    printEditorExtends : printEditorExtends,
    genTemplateContent : genTemplateContent,
    installPlugin : installPlugin,
    pluginsRoot : pluginsRoot,
    destruct : destruct,
    create : create,
}

// 执行模块构造函数
create();
