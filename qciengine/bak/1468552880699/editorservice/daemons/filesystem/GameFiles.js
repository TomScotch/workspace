/**
 * @author weism
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 维护游戏工程的目录信息
 */

/**
 * 文件的目录树信息，组织了文件的类型、关联的文件信息等
 */
var files = {
    Game : {}
};

/**
 * uuid与文件的映射关系，目录排除在外
 */
var uuid2file = {};

/**
 * 临时目录，成功设置后，赋给 uuid2file
 */
var _tempUUID2file = {};

var logicalScriptOrder = [];
var editorScriptOrder = [];
var editorServiceScriptOrder = [];

/**
 * 保存一份 uuid -> url 的映射
 */
function _saveUrlMap()
{
    // 我们只需要  uuid -> url 信息
    var urlMap = {};

    for (var uuid in GAME_FILES_D.uuid2file) {
        var url = GAME_FILES_D.uuid2file[uuid];
        if (url.slice(-4).toLowerCase() !== '.bin')
            continue;

        urlMap[uuid] = url;
    }

    // 写入文件
    fsExtra.ensureDirSync(path.join(G.gameRoot, 'Assets/meta'));
    fsExtra.writeFileSync(path.join(G.gameRoot, 'Assets/meta/globalUrlMap.js'),
        'urlMapConfig = ' + JSON.stringify(urlMap, null, 2) + ';\n');

    // 尝试记录 uuid 映射
    G.emitter.emit('saveUrlMap', urlMap);
};

/**
 * 重新刷新整个目录树和所有的数据
 * 需要确保所有的资源都完整打包后才执行遍历刷新操作
 */
function refresh()
{
    // 读取整个目录的资源

    FS_EXPAND_D.clearProjectHiddenDir();

    var readDirDeep = function(dir) {
        var dict = {};
        var list = fsExtra.readdirSync(dir);
        list.forEach(function(subPath) {
            // 隐藏文件不收集
            if (FS_EXPAND_D.isHidden(dir, subPath)) return;

            var fullPath = path.join(dir, subPath);
            var stat;

            try { stat = fsExtra.statSync(fullPath); } catch (e) { return; }
            if (!stat) return;

            if (stat.isDirectory()) {
                // 是否存在忽略标记
                if (fsExtra.existsSync(path.join(fullPath, 'folder.ignore'))) {
                    FS_EXPAND_D.addProjectHiddenDir(fullPath);
                    return;
                }
                dict[subPath] = readDirDeep(fullPath);
            }
            else
                dict[subPath] = {
                    size : stat.size,
                    ext : FS_EXPAND_D.extname(fullPath)
                };
        });
        return dict;
    }

    // 将资源进行分类
    var list = readDirDeep(G.gameRoot);
    files.Game = {};
    var copyAndParse = function(source, dest, currPath) {
        for (var k in source) {
            var fileInfo = source[k];
            if (fileInfo.ext === undefined) {
                // 这是个目录，递归处理
                dest[k] = {};
                copyAndParse(fileInfo, dest[k], currPath + k + '/');
                continue;
            }

            // 我们只关心打包后的资源文件和脚本，即bin/js
            if (fileInfo.ext !== '.bin' &&
                fileInfo.ext !== '.js')
                continue;

            var filePath = path.join(G.gameRoot, currPath, k);
            var metaPath = filePath + ".meta";

            do
            {
                if (fsExtra.existsSync(metaPath)) {
                    // 确定存在
                    exists = true;
                    break;
                }

                if (fileInfo.ext !== '.js') {
                    // bin 文件，直接认为 meta 不存在
                    exists = false;
                    break;
                }

                // 尝试创建 JS 的 meta 文件
                WATCH_D.assureMeta(filePath);
                exists = fsExtra.existsSync(metaPath);
            } while (false);

            // 确定不存在 meta 文件
            if (!exists) continue;
            var metaContent = null;
            try {
                metaContent = fsExtra.readJSONFileSync(metaPath, { throws : false });
            }
            catch(e) {
                metaContent = null;
            }
            if (metaContent == null) {
                error('读取json文件' + metaPath + '失败。');
                continue;
            }

            // 读取对应的meta文件，在meta文件中指明了资源的类型和源资源列表
            dest[k] = {
                meta : metaContent,
                size : fileInfo.size
            };

            // 缓存uudi信息
            _tempUUID2file[dest[k].meta.uuid] = currPath + k;
        }
    };
    copyAndParse(list, files.Game, '');

    // 处理完毕后，覆盖原配置
    GAME_FILES_D.uuid2file = _tempUUID2file;
    _tempUUID2file = {};

    // 准备保存这一份 uuid2file
    _saveUrlMap();
};

/**
 * 取得某个文件的详细信息
 */
function getFileInfo(file)
{
    var arr = file.split('/');
    var curr = files.Game;
    for (var i = 0; i < arr.length - 1; i++) {
        curr = curr[arr[i]];
        if (!curr) return null;
    }

    return curr[arr[arr.length - 1]];
};

function _fileChanged(file)
{
    if (path.extname(file).toLowerCase() !== '.bin')
        // 不是关心的文件
        return;

    // build路径无视
    var relativePath = path.relative(G.gameRoot, file);
    if (relativePath.indexOf('Build/') === 0 ||
        relativePath.indexOf('Build\\') === 0)
        return;

    // 尝试获取其 meta
    var metaInfo = PACK_D.extractMetaFromBin(file);
    if (!metaInfo) return;

    // 判定路径是否变化
    var meta = metaInfo.uuid;
    var lastPath = GAME_FILES_D.uuid2file[meta];
    if (lastPath &&
        (lastPath === relativePath ||
         lastPath === relativePath.replace(/\\/g, '/')))
        // 路径没有发生变化
        return;

    // 路径变化了，新增资源 or 资源路径变化
    // trace('资源{0}的路径从{1}为设置为：{2}，刷新', meta, lastPath, relativePath);
    PROJECT_D.genGameHTML();
}

// 模块析构函数
function destruct()
{
    G.emitter.removeListener('fileChanged', _fileChanged);
}

// 模块构造函数
function create()
{
    // bin 文件变更的时候，处理更新 uuid2file
    G.emitter.on('fileChanged', _fileChanged);
}

// 导出模块
global.GAME_FILES_D = module.exports = {
    refresh : refresh,
    getFileInfo : getFileInfo,
    uuid2file : uuid2file,
    logicalScriptOrder : logicalScriptOrder,
    editorScriptOrder : editorScriptOrder,
    editorServiceScriptOrder : editorServiceScriptOrder,
    destruct : destruct,
    create : create,
}

// 执行模块构造函数
create();
