/**
 * @author wudm
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 定期检查工程目录，确保所有的资源被打包
 */

var pendingWatch;
var _timerID = -1;

function _postInit()
{
    // 定时遍历工程目录
    _timerId = setInterval(exploreDaemon, 30 * 1000);
    exploreDaemon();

    // 监控 lib 目录
    watchDir(G.editorRoot + '../lib');
}

/**
 * @param fileName 源文件名
 * 确保当前文件的 meta 存在，注意 assure 创建 meta 时候是同步的
 */
function assureMeta(fileName)
{
    var metaName = FS_EXPAND_D.getMetaName(fileName);
    if (!fsExtra.existsSync(fileName)) {
        if (!FS_EXPAND_D.isBin(fileName) && !FS_EXPAND_D.isJs(fileName) && !FS_EXPAND_D.isTs(fileName))
            return;
        // 不存在 bin/js 文件，如果存在 .meta 则尝试删除
        if (fsExtra.existsSync(metaName)) {
            // 对应的 bin/js 被删除，但是本文件夹中存在该 meta 的来源，先不删除 meta
            if (FS_EXPAND_D.isJs(fileName) || FS_EXPAND_D.isTs(fileName)) {
                // js/ts 文件，来源就是自己，前面已经确定了 fileName 对应文件不存在，删除 meta
                important('删除 JS/TS 的meta{0}', metaName);
                fsExtra.unlinkSync(metaName);
            }
            else {
                // bin 文件，meta 中的 source 只要有人还在，就先不要删除 meta
                var metaContent;
                try {
                    metaContent = fsExtra.readJsonSync(metaName, { throws : false });
                }
                catch (e) {
                    metaContent = null;
                }
                var needRemove = true;

                // 获取基本名字
                var baseName;
                if (ASSET_D.IsSound(fileName)) {
                    // 音乐文件特殊处理，a.mp3.bin 组合 name 为 a 而非 a.mp3
                    baseName = fileName.slice(0, -8);
                }
                else {
                    baseName = fileName.slice(0, -4);
                }

                if (metaContent && metaContent.source) {
                    var metaSource = metaContent.source;
                    for (var i = 0, len = metaSource.length; i < len; i++) {
                        if (fsExtra.existsSync(baseName + metaSource[i])) {
                            needRemove = false;
                            break;
                        }
                    }
                }

                // 还是坚持要删除，那就删除吧
                if (needRemove) {
                    fsExtra.unlinkSync(metaName);
                }
            }
        }
    }
    else {
        // 存在该文件
        if (!fsExtra.existsSync(metaName)) {
            if (FS_EXPAND_D.isJs(fileName)) {
                fsExtra.writeJSONFileSync(metaName, {
                    'type' : G.ASSET_TYPE.ASSET_JS,
                    'uuid' : uuid()
                });
            }
            else if (FS_EXPAND_D.isTs(fileName)) {
                fsExtra.writeJSONFileSync(metaName, {
                    'type' : G.ASSET_TYPE.ASSET_TS,
                    'uuid' : uuid()
                });
            }
            else if (FS_EXPAND_D.isBin(fileName)) {
                var metaExtra = PACK_D.extractMetaFromBin(fileName);
                if (metaExtra) fsExtra.writeJSONFileSync(metaName, metaExtra);
                else {
                    trace('cannot extra {0} meta, try next time.', fileName);
                }
            }
        }
        else {
            // 存在文件且存在 meta，删除无关的 meta
            if (!FS_EXPAND_D.isBin(fileName) && !FS_EXPAND_D.isJs(fileName) && !FS_EXPAND_D.isTs(fileName)) {
                fsExtra.unlinkSync(metaName);
            }
        }
    }
};

/**
 * 确保meta对应的主文件存在，如果不存在则需要干掉meta文件
 */
function _assureFileForMeta(file)
{
    var fileName = FS_EXPAND_D.getNormalNameByMeta(file);
    assureMeta(fileName);
};

/**
 * @param path
 * 定期遍历整个目录，确保 meta、bin 正确创建
 */
function exploreDaemon(dir)
{
    dir = dir || G.gameRoot;
    if (!dir) return;
    var files;
    try {
        files = fsExtra.readdirSync(dir);
    }
    catch (e) {}
    if (!files) {
        console.error('explore path ', dir, 'faild');
        return;
    }

    var nameGroup = {};
    files.forEach(function(subPath) {
        if (FS_EXPAND_D.isHidden(dir, subPath))
            return;
        if (FS_EXPAND_D.skipWhenPack(dir, subPath))
            return;

        var fullPath = path.join(dir, subPath);
        if (FS_EXPAND_D.isMeta(subPath)) {
            // meta 文件，需要确保主文件存在
            _assureFileForMeta(fullPath);
        }
        else {
            // 其他文件，确保 meta 存在
            assureMeta(fullPath);
        }
        if (!fsExtra.existsSync(fullPath)) return;

        // 处理完自己，如果是目录需要递归
        var stat = fsExtra.statSync(fullPath);
        if (stat.isDirectory()) {
            exploreDaemon(fullPath);
            return;
        }

        // 需要以名字编组，记录所有的文件列表 、修改时间、bin创建时间
        // 如果判定需要创建 bin，则尝试生成之
        var name = FS_EXPAND_D.getBaseName(subPath);
        if (!FS_EXPAND_D.isMeta(subPath)) {
            var group;
            var groupName;

            if (/(.ogg$|.mp3$)/.test(subPath))
                groupName = subPath;
            else
                groupName = name;

            if (!nameGroup[groupName])
                group = nameGroup[groupName] = {};
            else
                group = nameGroup[groupName];

            if (FS_EXPAND_D.isBin(subPath))
                // 记录上次 bin 文件创建时间
                group.binModify = stat.ctime;
            else {
                // 记录上次文件修改时间
                if (!group.lastModify || stat.ctime > group.lastModify)
                    group.lastModify = stat.ctime;

                if (!group.list)
                    group.list = [ FS_EXPAND_D.extname(subPath) ];
                else
                    group.list.push(FS_EXPAND_D.extname(subPath) );
            }
        }
    });

    if (Object.keys(nameGroup).length) {
        Object.keys(nameGroup).forEach(function(name) {
            var group = nameGroup[name];

            if (!group.list || !group.list.length)
                return;
            if (!group.binModify || group.lastModify > group.binModify) {
                if (/(.ogg$|.mp3$)/.test(name))
                    name = name.slice(0, -4);
                PACK_D.toBin(dir, name, group.list);
            }
        });
    }
};

// 这个文件变更了，尝试单独获取这个文件的信息
function tryPackByOneFile(fileName)
{
    // meta 在 pack 的时候自动写入（并非用户手动修改）的情况下，不要第一时间写入 bin，因为此时正在写 bin
    if (FS_EXPAND_D.isMeta(fileName)) {
        var md5sum = PACK_D.metaContentHash[fileName];
        if (md5sum) {
            var metaContent = fsExtra.readJsonSync(fileName);
            if (calcMD5(JSON.stringify(metaContent)) === md5sum) {
                return;
            }
        }
    }

    var fileInfo = path.parse(fileName);
    var shorterName, name;
    var maxTimes = 10;
    var p;

    // 获取基础名字，例如 a.mp3.bin -> a,   b.png -> b,  c.mp3.bin.meta -> c
    name = fileInfo.name.toLowerCase();
    do
    {
        p = path.parse(name);
        shorterName = p.name;
        if (shorterName === name ||
            !PACK_D.isValideExt(p.ext))
            break;
        name = shorterName;
    } while (maxTimes--);

    var dir  = fileInfo.dir;

    // 获取文件夹下的同名文件
    var list = [ ];
    if (!fsExtra.existsSync(dir)) {
        // 被删除的文件，不需要尝试打包（删除文件夹的时候会进入该逻辑）
        return;
    }
    var files = fsExtra.readdirSync(dir);
    if (!files) {
        console.error('explore path ', path, 'failed');
        return;
    }

    files.forEach(function(subPath) {
        var subFileInfo = path.parse(subPath);
        if (subFileInfo.name.toLowerCase() === name) {
            var ext = subFileInfo.ext.toLowerCase();
            if (ext != 'bin')
                list.push(ext);
        }
    });

    if (list.length) {
        PACK_D.toBin(dir, name, list);
    }
};

// 处理文件发生变化
var _dealWithFileEvent = function(event, rootPath, fileName, virtualDir) {
    //明确说明先不要派发 watch
    if (pendingWatch) {
        return;
    }

    var fullPath = path.join(rootPath, fileName);

    // 通知关注者
    G.emitter.emit('fileChanged', fullPath, event);

    //trace('fsExtra. event:' + event + ' filePath:' + fullPath);

    if (fileName && FS_EXPAND_D.isMeta(fileName)) {
        // meta 文件的话，如果是 modify 则尝试重新打包
        if (fsExtra.existsSync(fullPath)) tryPackByOneFile(fullPath);
    }
    else if (fileName && !FS_EXPAND_D.isHidden(rootPath, fileName)) {
        // 非 meta，非 hidden

        if (!FS_EXPAND_D.skipWhenPack(rootPath, fileName)) {
            // 尝试打包
            if (event === 'rename') {
                assureMeta(fullPath);
            }

            var exist = fsExtra.existsSync(fullPath);
            if (!FS_EXPAND_D.isBin(fullPath) || !exist)
                tryPackByOneFile(fullPath);
        }

        // 有效的变更，派发事件给客户端
        COMMAND_D.broadcast('FILE_CHANGED', {
            event: event,
            fileName: path.join(virtualDir, fileName),
            exist: exist
        });
    }
};

G.fsWatcher = [];

/**
 * @param path
 * @returns {object} node 监控文件发生任何变更，确保 meta，通知给所有连接中的对象
 */
function watchDir(rootPath, virtualDir)
{
    virtualDir = virtualDir || "./";
    if (process.platform === 'darwin') {
        // mac 系统，沿用 fsExtra.watch 递归即可
        G.fsWatcher.push(fsExtra.watch(rootPath, {persistent: true, recursive: true}, function(event, fileName) {
            // 处理中文 utf8 问题
            fileName = Buffer(fileName, 'binary').toString();
            _dealWithFileEvent(event, rootPath, fileName, virtualDir);
        }));
    }
    else {
        // 其他系统，使用 chokidar 来替代
        var chokidar = require('chokidar');
        G.fsWatcher.push(chokidar.watch(rootPath, {
            usePolling: false,
            ignoreInitial: true,
            ignored: /Build[\///]*/
        }).on('all', function(event, fileName) {
            // 尝试替换 windows 风格的分隔符
            var fullPath = fileName.replace(/\\/g, '/');
            fileName = path.relative(rootPath, fullPath);
            _dealWithFileEvent(event, rootPath, fileName, virtualDir);
        }));
    }
};

function _startUpdate()
{
    pendingWatch = true;
}

function _endUpdate(success)
{
    if (!success) {
        pendingWatch = false;
        try {
            exploreDaemon();
        }
        catch (e) {
        }
    }

     // success 需等待重启，需要持续 pending
}

// 模块析构函数
function destruct()
{
    G.emitter.removeListener('startUpdate', _startUpdate);
    G.emitter.removeListener('endUpdate', _endUpdate);
    G.emitter.removeListener('postInit', _postInit);

    if (_timerId != -1)
    {
        clearInterval(_timerId);
        _timerId = -1;
    }
}

// 模块构造函数
function create()
{
    // 更新开始的消息，暂停 file change 事件
    G.emitter.on('startUpdate', _startUpdate);

    // 检测到更新完毕的消息，explore 一把
    G.emitter.on('endUpdate',  _endUpdate);

    // 关注 postInit 回调
    G.emitter.on('postInit', _postInit);
}

// 导出模块
global.WATCH_D = module.exports = {
    assureMeta : assureMeta,
    exploreDaemon : exploreDaemon,
    tryPackByOneFile : tryPackByOneFile,
    watchDir : watchDir,
    destruct : destruct,
    create : create,
}

// 执行模块构造函数
create();
