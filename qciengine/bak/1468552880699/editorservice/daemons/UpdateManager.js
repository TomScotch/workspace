/**
 * @author chenqx
 * copyright 2015 Qcplay All Rights Reserved.
 */
/*
 * 更新管理器
 * 1 检测最新版本号
 * 2 控制更新
 */
var fs = fsExtra;
var http = require('http');
var jsZip = require('jszip');
var crypto = require('crypto');

var versionCheckURL = 'http://engine.zuoyouxi.com/version/latest.php';
var _version = {};

/**
 * 获取最新的版本号
 * @returns {{}|*}
 */
function getLatestVersion(needQuery)
{
    needQuery && _queryLatestVersion();
    return UPDATE_MANAGER_D._version;
};

/**
 * 查询最新的版本
 */
function _queryLatestVersion()
{
    var body = '';
    var delayQuery = function(e) {
        setTimeout(_queryLatestVersion, 20000);
    };
    http.get(versionCheckURL, function(res) {
        res.on('data', function(data) {
            body += data;
        });

        res.on('end', function() {
            try {
                var json = body.toString();
                UPDATE_MANAGER_D._version = JSON.parse(json);

                // 通知编辑器可以检查版本信息了
                COMMAND_D.broadcast('NEW_VERSION_AVAILABLE', {
                });
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
 * 比较版本号
 * @param v1
 * @param v2
 * @returns {number}
 */
function compareVersion(one, two)
{
    if (typeof two !== 'string') {
        return 1;
    }
    var oneVersion = one.split('.'),
        twoVersion = two.split('.');
    var maxLen = Math.max(oneVersion.length, twoVersion.length);
    for (var i = 0; i < maxLen; ++i) {
        var partOne = oneVersion[i] || '';
        var partTwo = twoVersion[i] || '';
        if (partOne === partTwo) {
            continue;
        }
        return partOne > partTwo ? 1 : -1;
    }
    return 0;
};

/**
 * 更新版本
 */
function updateVersion()
{
    if (!UPDATE_MANAGER_D._version ||
        !UPDATE_MANAGER_D._version.download) {
        return { result: -1};
    }
    var url = UPDATE_MANAGER_D._version.download;

    // 通知开始更新
    G.emitter.emit('startUpdate');

    var updateDir = path.join(G.editorRoot, '../version/' + UPDATE_MANAGER_D._version.editor);
    fs.ensureDirSync(updateDir);
    var fileName = path.basename(url);
    var saveFilePath = path.join(updateDir, fileName);

    if (fs.existsSync(saveFilePath) &&
        UPDATE_MANAGER_D._version.md5sign.toLowerCase() === _md5(saveFilePath).toLowerCase())
    {
        // 解压文件到目录
        _unzipUpdate(saveFilePath);
    }
    else {
        _download(url, saveFilePath, function() {
            if (!fs.existsSync(saveFilePath) ||
                UPDATE_MANAGER_D._version.md5sign.toLowerCase() !== _md5(saveFilePath).toLowerCase()) {
                _progressUpdateVersion('smooth', -2);
                return;
            }
            // 解压文件到目录
            _unzipUpdate(saveFilePath);
        });
    }


    return {result: 0};
};

/**
 * 保存当前版本
 * @private
 */
function _bakCurrVersion()
{
    _progressUpdateVersion('smooth', 81);
    var baseDir = path.dirname(G.editorRoot);
    var bakDir = path.join(baseDir, 'bak/' + new Date().valueOf());
    fs.ensureDirSync(bakDir);
    var projectSetting = path.join(bakDir, 'editorservice', 'project.setting');

    // 取消对之前目录的监听，否则之后 rename 时会失败
    G.fsWatcher.forEach(function(fsWatcher) {
        fsWatcher.close();
    });

    // 优先移动editorservice，这样如果editorservice被锁定则抱错不进行执行更新
    try {
        fs.renameSync(path.join(baseDir, 'editorservice'), path.join(bakDir, 'editorservice'));
        _progressUpdateVersion('smooth', 84);
        fs.renameSync(path.join(baseDir, 'lib'), path.join(bakDir, 'lib'));
        _progressUpdateVersion('smooth', 85);
        fs.renameSync(path.join(baseDir, 'node_modules'), path.join(bakDir, 'node_modules'));
        _progressUpdateVersion('smooth', 87);
        fs.renameSync(path.join(baseDir, 'package.json'), path.join(bakDir, 'package.json'));
        _progressUpdateVersion('smooth', 88);

        // 还原项目配置文件
        if (fs.existsSync(projectSetting)) {
            fs.ensureDirSync(path.join(baseDir, 'editorservice'));
            fs.renameSync(projectSetting, path.join(baseDir, 'editorservice', 'project.setting'));
            _progressUpdateVersion('smooth', 89);
        }
    }
    catch(e) {
        trace('Bak current version failed, error: ' + e);
        // 如果已经移动出去的需要移动回来
        if (fs.existsSync(path.join(bakDir, 'editorservice'))) {
            fs.renameSync(path.join(bakDir, 'editorservice'), path.join(baseDir, 'editorservice'));
        }
        if (fs.existsSync(path.join(bakDir, 'lib'))) {
            fs.renameSync(path.join(bakDir, 'lib'), path.join(baseDir, 'lib'));
        }
        if (fs.existsSync(path.join(bakDir, 'node_modules'))) {
            fs.renameSync(path.join(bakDir, 'node_modules'), path.join(baseDir, 'node_modules'));
        }
        if (fs.existsSync(path.join(bakDir, 'package.json'))) {
            fs.renameSync(path.join(bakDir, 'package.json'), path.join(baseDir, 'package.json'));
        }
        _progressUpdateVersion('smooth', -1);
        return -1;
    }

    return 0;
};

/**
 * 解压结束
 * @param  {boolean} success - 解压是否成功
 */
function _unzipFinished(success)
{
    // 通知更新结束
    G.emitter.emit('endUpdate', success);
};

/**
 * 更新进度条值
 * @param  {string} type    步进类型，'none' 表示客户端直接显示，'smooth' 表示客户端插值显示
 * @param  {number} percent 进度值,0~80 下载，80~90 备份, 90~100安装
 */
function _progressUpdateVersion(type, percent)
{
    return COMMAND_D.broadcast('PROGRESS_UPDATE_VERSION', {
        type : type,
        percent : ((percent * 100) | 0) / 100
    });
};

/**
 * 计算文件的MD5值
 * @param filePath
 * @returns {*}
 * @private
 */
function _md5(filePath)
{
    var data = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(data, 'binary').digest('hex');
};

// 解压更新文件
function _unzipUpdate(updateFile)
{
    _progressUpdateVersion('smooth', 80);
    fs.readFile(updateFile, function(err, data) {
        if (err) {
            trace(err);
            // 更新失败，派发事件给编辑器
            COMMAND_D.broadcast('UPDATE_VERSION_RESULT', {
                result: -1
            });
            _unzipFinished(false);
            return;
        }

        var unzipDir = path.dirname(G.editorRoot);
        fs.ensureDirSync(unzipDir);
        try {
            var zip = new jsZip(data);
        }
        catch(e) {
            COMMAND_D.broadcast('UPDATE_VERSION_RESULT', {
                result: -2
            });
            _unzipFinished(false);
            return;
        }


        // 保存当前版本
        if (_bakCurrVersion() !== 0) {
            COMMAND_D.broadcast('UPDATE_VERSION_RESULT', {
                result: -3
            });
            _unzipFinished(false);
            return;
        }
        _progressUpdateVersion('smooth', 90);
        // 解压版本
        var filesNum = Object.keys(zip.files).length;
        var unzipFileNum = 0;
        var lastUpdatePrecent = 90;
        Object.keys(zip.files).forEach(function(filename) {
            var node = zip.files[filename];
            setTimeout(function() {
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
                unzipFileNum++;
                if (unzipFileNum === filesNum) {
                    _progressUpdateVersion('smooth', 100);
                    trace('The update is completed...');
                    _unzipFinished(true);
                }
                else {
                    var currPrecent = 90 + Math.min(10, unzipFileNum * 10 / filesNum);
                    if (currPrecent - lastUpdatePrecent > 0.5) {
                        lastUpdatePrecent = currPrecent;
                        _progressUpdateVersion('smooth', currPrecent);
                    }
                }
            }, 100);
        });
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
        var totalLength = res.headers['content-length'] || 1;
        var recvLength = 0;
        var writeStream = fs.createWriteStream(path);
        res.on('data', function(chunk) {
            recvLength += chunk.length;
            _progressUpdateVersion('none', Math.min(80, recvLength * 80 / totalLength));
        });
        writeStream.on('close', function() {
            _progressUpdateVersion('smooth', 80);
            callback && callback(res);
        });
        res.pipe(writeStream);
    }).on('error', function(e) {
        trace('Download error:' + e);
        _progressUpdateVersion('smooth', -2);
    });
};

/**
 * 打包当前环境为发布包
 * @param version
 */
function archiveVersion(version)
{
    var collectFile = function(dir) {
        var files = [];
        var list = fs.readdirSync(dir);
        list.forEach(function(subPath) {
            // 隐藏文件不收集
            if (FS_EXPAND_D.isHidden(dir, subPath)) return;

            var fullPath = path.join(dir, subPath);
            var stat;

            try { stat = fs.statSync(fullPath); } catch (e) { return; }
            if (!stat) return;

            if (stat.isDirectory()) {
                var tmp = collectFile(fullPath);
                tmp && (tmp.length > 0) && Array.prototype.push.apply(files, tmp);
            }
            else if (FS_EXPAND_D.extname(fullPath) !== '.setting'){
                files.push(fullPath);
            }
        });
        return files;
    };
    var zip = new jsZip();

    // 添加库
    var pathType = 'lib';
    var rootPath = path.join(G.editorRoot, '../' + pathType);
    var files = collectFile(rootPath);
    var chunk = zip.folder(pathType);
    files.forEach(function(file) {
        chunk.file(path.relative(rootPath, file), fs.readFileSync(file));
    });

    // 添加editor库
    var editorLib = path.join(G.editorRoot, '../lib/qc-editor.js');
    if (fs.existsSync(editorLib)) {
        chunk.file('qc-editor.js', fs.readFileSync(editorLib));
    }
    editorLib = path.join(G.editorRoot, '../lib/qc-editor-debug.js');
    if (fs.existsSync(editorLib)) {
        chunk.file('qc-editor-debug.js', fs.readFileSync(editorLib));
    }

    // 添加服务器
    pathType = 'editorservice';
    rootPath = path.join(G.editorRoot, '../' + pathType);
    files = collectFile(rootPath);
    chunk = zip.folder(pathType);
    files.forEach(function(file) {
        chunk.file(path.relative(rootPath, file), fs.readFileSync(file));
    });

    // 添加依赖
    zip.file('package.json', fs.readFileSync(path.join(G.editorRoot, '../package.json')));

    pathType = 'node_modules';
    rootPath = path.join(G.editorRoot, '../' + pathType);
    files = collectFile(rootPath);
    chunk = zip.folder(pathType);
    files.forEach(function(file) {
        chunk.file(path.relative(rootPath, file), fs.readFileSync(file));
    });
    var data = zip.generate({base64: false, compression: 'DEFLATE'});
    var publishDir = path.join(G.editorRoot, '../archive');
    var saveFile = path.join(publishDir, version + ".zip");
    fs.ensureDirSync(publishDir);
    fs.writeFile(saveFile, data, 'binary', function() {
        trace('Compress ok. File:'+ saveFile + ', MD5:' + _md5(saveFile));
    });
};

// 模块析构函数
function destruct()
{
}

// 模块构造函数
function create()
{
    _queryLatestVersion();
}

// 导出模块
global.UPDATE_MANAGER_D = module.exports = {
    getLatestVersion : getLatestVersion,
    compareVersion : compareVersion,
    archiveVersion : archiveVersion,
    updateVersion : updateVersion,
    destruct : destruct,
    create : create,
}

// 执行模块构造函数
create();
