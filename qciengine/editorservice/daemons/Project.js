/**
 * @author wudm
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 工程管理相关
 */
var fs = fsExtra;
var fsEx = FS_EXPAND_D;
var iconv = require('iconv-lite');

var recentRecordNumber = 15;

function _serviceOn()
{
    var recentOpen = getRecentOpen();
    if (recentOpen && recentOpen.length) {
        try {
            // 简单的进行验证，确保路径存在
            var dir = recentOpen[0];
            if (fs.existsSync(dir) &&
                fs.statSync(dir).isDirectory() &&
                fs.existsSync(path.join(dir, 'ProjectSetting')) &&
                fs.existsSync(path.join(dir, 'ProjectSetting/project.setting')))
                openProject(dir);
        }
        catch (e) {
            error(e);
        }
    }
}

function _getKeyToolPath()
{
    var keytoolBase = process.platform === 'win32' ? 'keytool.exe' : 'keytool',
        editorConfig = SETTING_D.querySetting();
    var keytool = keytoolBase;
    if (editorConfig.androidEnvironment && editorConfig.androidEnvironment.jdkPath) {
        do {
            keytool = path.join(editorConfig.androidEnvironment.jdkPath, keytoolBase);
            if (fs.existsSync(keytool))
                break;

            keytool = path.join(editorConfig.androidEnvironment.jdkPath, 'bin', keytoolBase);
            if (fs.existsSync(keytool))
                break;

            keytool = path.join(editorConfig.androidEnvironment.jdkPath, 'Commands', keytoolBase);
            if (fs.existsSync(keytool))
                break;

            keytool = keytoolBase;
        } while(false);
    }
    return keytool;
};

// 记录最近打开的工程列表
function _recordRecentOpen(dir)
{
    // 获取 project 设置
    var conf;
    try {
        conf = fs.readJsonSync(path.join(G.editorRoot, 'project.setting'), { throws : false });
    }
    catch (e) {
        conf = null;
    }
    var recentOpen;
    if (!conf) {
        conf = {};
        recentOpen = [];
    }
    else {
        recentOpen = conf.recentOpen;
        if (!recentOpen) recentOpen = [];
    }

    // 将新的 path 放在 list 的头部
    var index = recentOpen.indexOf(dir);


    if (index >= 0) {
        recentOpen.splice(index, 1);
        recentOpen.splice(0, 0, dir);
    }
    else {
        recentOpen.splice(0, 0, dir);
        if (recentOpen.length > recentRecordNumber)
            recentOpen = recentOpen.slice(0, recentRecordNumber);
    }

    // 回写保存
    conf.recentOpen = recentOpen;
    FS_EXPAND_D.writeJsonSync(path.join(G.editorRoot, 'project.setting'), conf);
};

// 创建一个工程
function createProject(dir)
{
    var errorRoutine = function(errorMsg, e) {
        if (e === null) {
            trace(errorMsg);
            return errorMsg;
        }
        else {
            error(errorMsg, e);
            return errorMsg + e;
        }
    };

    // 必须是绝对路径
    if (!path.isAbsolute(dir))
        return errorRoutine('Project Directory must be a absolute path.');

    // 确保格式为目录方式
    dir = path.join(dir, '/');

    try {
        // 首先，如果存在目录，必须要空目录
        if (fs.existsSync(dir)) {
            // 确保是一个目录
            var stat = fs.statSync(dir);
            if (!stat || !stat.isDirectory())
                return errorRoutine('Not a directory.');

            // 确保是空目录
            var subFiles = fs.readdirSync(dir);
            for (var i = 0, len = subFiles.length; i < len; i++) {
                var fileName = subFiles[i];
                if (fsEx.isHidden(dir, fileName) ||
                    fsEx.skipWhenExplore(dir, fileName))
                    continue;

                // 非空目录
                return errorRoutine('Project Directory must be empty.');
            }
        }
        else {
            // 创建文件夹
            if (!fs.ensureDirSync(dir)) {
                return errorRoutine('Create directory failed.');
            }
        }

        // 尝试创建几个资源二级目录
        ['atlas', 'audio', 'excel', 'font', 'prefab', 'raw', 'sprite', 'scene', 'texture', 'action'].forEach(function(p) {
            var dirFullPath = path.join(dir, 'Assets', p);
            fs.ensureDirSync(dirFullPath);
        });

        // 扔出创建工程事件
        G.emitter.emit('createProject', dir);

        // 切换工程
        var openResult = openProject(dir, true);
        if (openResult !== true) return openResult;

        return true;
    }
    catch (e) {
        return errorRoutine('throw exception.', e);
    }
};

// 打开一个工程
function openProject(dir, createFlag)
{
    var errorRoutine = function(errorMsg, e) {
        if (e === null) {
            trace(errorMsg);
            return errorMsg;
        }
        else {
            error(errorMsg, e);
            return errorMsg + e;
        }
    };

    // 必须是绝对路径
    if (!path.isAbsolute(dir))
        return errorRoutine('请输入工程的全路径。');

    // 确保格式为目录形态
    dir = path.join(dir, '/');

    try {
        // 简单的进行验证，确保路径存在
        if (!fs.existsSync(dir) ||
            !fs.statSync(dir).isDirectory())
            return errorRoutine('目标' + dir + '不是一个有效目录。');

        // 检查是否有 ProjectSetting/project.setting
        if (createFlag !== true &&
            (!fs.existsSync(path.join(dir, 'ProjectSetting')) ||
             !fs.existsSync(path.join(dir, 'ProjectSetting/project.setting'))))
            return errorRoutine('不存在project.setting，认为不是有效工程。');

        // 生成新工程的配置

        // 取消对之前目录的监听
        G.fsWatcher.forEach(function(fsWatcher) {
            fsWatcher.close();
        });

        G.emitter.emit('beforeSwitchProject', G.gameRoot, dir, createFlag);

        G.gameRoot = dir;

        // 增加对新路径的监听
        WATCH_D.watchDir(G.gameRoot);

        // 监控 lib 目录
        WATCH_D.watchDir(G.editorRoot + '../lib');

        USER_SCRIPTS_D.clearAllJsExt();

        // 切换静态监听
        COMMUNICATE_D.switchStatic();

        _recordRecentOpen(dir);

        // 派发成功切换工程的事件
        G.emitter.emit('preSwitchProject', createFlag);
        G.emitter.emit('switchProject', createFlag);

        // 返回成功
        return true;
    }
    catch (e) {
        return errorRoutine('打开工程异常，异常原因：', e);
    }
};

// 生成安卓keystore
function createAndroidKeystore(data)
{
    var addAlias = data.addAlias,
        filePath = data.path,
        password = data.password,
        alias = data.alias,
        aliasPassword = data.aliasPassword,
        validity = data.validity,
        issuer = data.issuer,
        editorConfig = SETTING_D.querySetting();

    if (fs.existsSync(filePath)) {
        var stats = fs.statSync(filePath);
        if (stats.isDirectory()){
            COMMAND_D.broadcast('CREATE_ANDROID_KEY_RESULT', {
                errCode : -1,
                errMsg : 'The keystore path is error.'
            });
            return;
        }
        if (!addAlias) {
            fs.unlinkSync(filePath);
        }
    }

    var dstDir = path.dirname(filePath);

    // 调用生成
    var spawn = require('child_process').spawn;
    var keytool = _getKeyToolPath();
    var options = { cwd: dstDir };
    var bat;
    var dname = [];
    var errMsg = '';
    if (issuer.name)
        dname.push('CN=' + issuer.name);
    if (issuer.orgUnit)
        dname.push('OU=' + issuer.orgUnity);
    if (issuer.org)
        dname.push('O=' + issuer.org);
    if (issuer.city)
        dname.push('L=' + issuer.city);
    if (issuer.state)
        dname.push('ST=' + issuer.state);
    if (issuer.code)
        dname.push('C=' + issuer.code);
    var args = [
        '-genkey',
        '-keyalg', 'RSA',
        '-keystore', filePath,
        '-storepass', password,
        '-alias', alias,
        '-keypass', aliasPassword,
        '-validity', validity,
        '-dname', dname.join(',')
    ];
    if (process.platform === 'win32') {
        args.unshift('/c', keytool);
        bat = spawn('cmd.exe', args, options);
    }
    else {
        bat = spawn(keytool, args, options);
    }
    var bufferHelper = new BufferHelper();
    var decode = process.platform === 'win32' ? 'gbk' : 'utf8';
    bat.stdout.on('data', function(data) {
        trace(iconv.decode(new Buffer(data), decode));
        bufferHelper.concat(data);
    });
    bat.stderr.on('data', function (data) {
        trace(iconv.decode(new Buffer(data), decode));
        bufferHelper.concat(data);
    });
    bat.on('close', function (code) {
        if (code !== 0) {
            trace('keytool process exited with code:' + code);
        }
        // 通知编辑器创建完成
        COMMAND_D.broadcast('CREATE_ANDROID_KEY_RESULT', {
            errCode : code,
            errMsg : code === 0 ? '' : iconv.decode(bufferHelper.toBuffer(), decode)
        });
    });
};

// 查询安卓keystore中的alias
function listAndroidKeystore(data)
{
    var filePath = data.keystore,
        password = data.storePassword,
        editorConfig = SETTING_D.querySetting();

    if (fs.existsSync(filePath)) {
        var stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            COMMAND_D.broadcast('LIST_ANDROID_KEY_ALIAS_RESULT', {
                errCode : -1,
                errMsg : 'The keystore path is error.'
            });
            return;
        }
    }
    else {
        COMMAND_D.broadcast('LIST_ANDROID_KEY_ALIAS_RESULT', {
            errCode : -1,
            errMsg : 'The keystore path is error.'
        });
        return;
    }

    var dstDir = path.dirname(filePath);

    // 调用生成
    var spawn = require('child_process').spawn;
    var keytool = _getKeyToolPath();

    var options = { cwd: dstDir };
    var bat;
    var args = [
        '-list',
        '-keystore', filePath,
        '-storepass', password
    ];
    if (process.platform === 'win32') {
        args.unshift('/c', keytool);
        bat = spawn('cmd.exe', args, options);
    }
    else {
        bat = spawn(keytool, args, options);
    }
    var bufferHelper = new BufferHelper();
    var decode = process.platform === 'win32' ? 'gbk' : 'utf8';
    bat.stdout.on('data', function(data) {
        bufferHelper.concat(data);
    });
    bat.stderr.on('data', function(data) {
        trace(iconv.decode(new Buffer(data), decode));
        bufferHelper.concat(data);
    });
    bat.on('close', function(code) {
        if (code !== 0) {
            // 通知编辑器创建完成
            COMMAND_D.broadcast('LIST_ANDROID_KEY_ALIAS_RESULT', {
                errCode : code,
                errMsg : iconv.decode(bufferHelper.toBuffer(), decode)
            });
            trace('keytool process exited with code:' + code);
        }
        else {
            var msg = iconv.decode(bufferHelper.toBuffer(), decode);
            var aliasNameRegExp = /([^,\n]+),\s*[^,\n]+,\s*[^,\n]+,(?:\s*[^,\n]+)*/g;
            var result;
            var aliasNames = [];
            while (result = aliasNameRegExp.exec(msg)) {
                aliasNames.push(result[1]);
            }
            COMMAND_D.broadcast('LIST_ANDROID_KEY_ALIAS_RESULT', {
                errCode : 0,
                aliasName : aliasNames
            });
        }
    });
};

// 生成安卓工程文件
function buildAndroid(dstDir, iconList, splash)
{
    var editorConfig = SETTING_D.querySetting();
    fsEx.copySync(path.join(G.editorRoot, 'Template/android/application_with_crosswalk'), dstDir);

    var androidConfig = G.config.project.android;
    // 确定屏幕旋转设定
    var screenOrientation = 'sensor';
    var defOrientation = androidConfig.defaultOrientation;
    if (defOrientation === 0 && androidConfig.autoOrientation) {
        var sensorPortrait = androidConfig.autoOrientation.portrait ||
            androidConfig.autoOrientation.portraitUpsideDown;
        var sensorLandscape = androidConfig.autoOrientation.landscapeLeft ||
            androidConfig.autoOrientation.landscapeRight;
        if (sensorPortrait && sensorLandscape) {
            screenOrientation = 'sensor';
        }
        else if (sensorPortrait) {
            screenOrientation = 'sensorPortrait';
        }
        else if (sensorLandscape) {
            screenOrientation = 'sensorLandscape';
        }
    }
    else if (defOrientation === 1) {
        screenOrientation = 'portrait';
    }
    else if (defOrientation === 2) {
        screenOrientation = 'reversePortrait';
    }
    else if (defOrientation === 3) {
        screenOrientation = 'landscape';
    }
    else if (defOrientation === 4) {
        screenOrientation = 'reverseLandscape';
    }

    // 写入配置
    var config = {
        applicationName : G.config.project.gameName,
        applicationId : androidConfig.bundleId,
        minSdkVersion : androidConfig.minTarget,
        versionCode : androidConfig.buildCode,
        versionName : G.config.project.buildVersion,
        screenOrientation : screenOrientation,
        targetSdkVersion : androidConfig.target,
        releaseSigningProperties: {
            keyStore: androidConfig.keystoreFile,
            storePassword: androidConfig.keystorePassword,
            keyAlias: androidConfig.keyAlias,
            keyPassword: androidConfig.keyAliasPassword
        }
    };
    fsEx.writeJsonFileSync(path.join(dstDir, 'app/res/raw/config.json'), config);
    
    // 修改应用包名
    var stringsXmlPath = path.join(dstDir, 'app/res/values/strings.xml');
    var stringXml = fs.readFileSync(stringsXmlPath, 'utf8');
    stringXml = stringXml.replace('QICIApplication', G.config.project.gameName);
    fs.writeFileSync(stringsXmlPath, stringXml, 'utf8');
    
    // 写入环境配置
    var content = fs.readFileSync(path.join(dstDir, 'local.properties'), 'utf8');
    content = content.replace(/\$\{SDK_ROOT\}/g, editorConfig.androidEnvironment.sdkPath);
    content = content.replace(/\$\{NDK_ROOT\}/g, editorConfig.androidEnvironment.ndkPath);
    fs.writeFileSync(path.join(dstDir, 'local.properties'), content, 'utf8');

    // 生成图标
    if (iconList) {
        var imagePath = [
                'mipmap-xxxhdpi/ic_launcher.png',
                'mipmap-xxhdpi/ic_launcher.png',
                'mipmap-xhdpi/ic_launcher.png',
                'mipmap-hdpi/ic_launcher.png',
                'mipmap-mdpi/ic_launcher.png',
                'drawable/ic_launcher.png'
            ];

        var idx = -1;
        while (++idx < imagePath.length) {
            var imageContent = iconList[idx];
            if (!imageContent)
                continue;

            // 将 imageContent 换成 buffer 形态等待写入
            var data = imageContent.replace(/^data:image\/\w+;base64,/, "");
            var buf = new Buffer(data, 'base64');
            var filePath = path.join(dstDir, 'app/res', imagePath[idx]);
            fs.ensureDirSync(path.dirname(filePath));
            fs.writeFile(filePath, buf);
        }
    }
};

// 生成安卓Apk
function buildAndroidApk(dstDir)
{
    // 调用生成
    var spawn = require('child_process').spawn;
    var gradle = path.join(dstDir, process.platform === 'win32' ? 'gradlew.bat' : 'gradlew');
    var task = ':app:assembleRelease';
    var options = { cwd: dstDir };
    var bat;
    if (process.platform === 'win32') {
        bat = spawn('cmd.exe', ['/c', gradle, task], options);
    }
    else {
        bat = spawn(gradle, [ task ], options);
    }
    var bufferHelper = new BufferHelper();
    var decode = process.platform === 'win32' ? 'gbk' : 'utf8';
    bat.stdout.on('data', function(data) {
        bufferHelper.concat(data);
    });
    bat.stderr.on('data', function(data) {
        bufferHelper.concat(data);
    });
    bat.on('close', function(code) {
        G.log.trace(iconv.decode(bufferHelper.toBuffer(), decode));
        if (code !== 0) {
            G.log.trace('grade process exited with code:' + code);
        }
    });
};

// 生成IOS工程
function buildIOS(dstDir, iconList, splash)
{
    var editorConfig = SETTING_D.querySetting();
    fsEx.copySync(path.join(G.editorRoot, 'Template/ios/application_with_crosswalk'), dstDir);
    var appbuildDir = path.join(G.editorRoot, 'Template/ios/xcodeproj_appbuild');
    var appbuildPath = path.join(appbuildDir, 'appbuild.rb');
    var iosConfig = G.config.project.ios;

    // 确定屏幕旋转设定
    var screenOrientation = [];
    var defOrientation = iosConfig.defaultOrientation;
    if (defOrientation === 0 && iosConfig.autoOrientation) {
        if (iosConfig.autoOrientation.portrait)
            screenOrientation.push('UIInterfaceOrientationPortrait');
        if (iosConfig.autoOrientation.portraitUpsideDown)
            screenOrientation.push('UIInterfaceOrientationPortraitUpsideDown');
        if (iosConfig.autoOrientation.landscapeLeft)
            screenOrientation.push('UIInterfaceOrientationLandscapeLeft');
        if (iosConfig.autoOrientation.landscapeRight)
            screenOrientation.push('UIInterfaceOrientationLandscapeRight');
    }
    else if (defOrientation === 1) {
        screenOrientation.push('UIInterfaceOrientationPortrait');
    }
    else if (defOrientation === 2) {
        screenOrientation.push('UIInterfaceOrientationPortraitUpsideDown');
    }
    else if (defOrientation === 3) {
        screenOrientation.push('UIInterfaceOrientationLandscapeRight');
    }
    else if (defOrientation === 4) {
        screenOrientation.push('UIInterfaceOrientationLandscapeLeft');
    }

    // 写入配置
    var config = {
        applicationName : G.config.project.gameName,
        applicationId : iosConfig.bundleId,
        target : iosConfig.target,
        versionCode : iosConfig.buildCode,
        versionName : G.config.project.buildVersion,
        screenOrientation : screenOrientation
    };
    fsEx.writeJsonFileSync(path.join(dstDir, 'config.json'), config);

    // 生成图标
    if (iconList) {
        var imagePath = [
                '180.png',
                '152.png',
                '144.png',
                '120.png',
                '114.png',
                '76.png',
                '72.png',
                '57.png'
            ];

        var idx = -1;
        while (++idx < imagePath.length) {
            var imageContent = iconList[idx];
            if (!imageContent)
                continue;

            // 将 imageContent 换成 buffer 形态等待写入
            var data = imageContent.replace(/^data:image\/\w+;base64,/, "");
            var buf = new Buffer(data, 'base64');
            var filePath = path.join(dstDir, 'App/Assets.xcassets/AppIcon.appiconset', imagePath[idx]);
            fs.ensureDirSync(path.dirname(filePath));
            fs.writeFile(filePath, buf);
        }
    }

    // 生成闪屏
    if (splash) {
        var splashPath = [
            'Default.png',
            'Default@2x.png',
            'Default-568h@2x.png',
            'Default-667h@2x.png',
            'Default-Portrait.png',
            'Default-Portrait@2x.png',
            'Default-Portrait@3x.png',
            'Default-Landscape.png',
            'Default-Landscape@2x.png',
            'Default-Landscape@3x.png'
        ];

        var idx = -1;
        while (++idx < splashPath.length) {
            var imageContent = splash[idx];
            if (!imageContent)
                continue;

            // 将 imageContent 换成 buffer 形态等待写入
            var data = imageContent.replace(/^data:image\/\w+;base64,/, "");
            var buf = new Buffer(data, 'base64');
            var filePath = path.join(dstDir, 'App/Assets.xcassets/LaunchImage.launchimage', splashPath[idx]);
            fs.ensureDirSync(path.dirname(filePath));
            fs.writeFile(filePath, buf);
        }
    }

    // 调用生成
    var options = { cwd: dstDir };
    var spawn = require('child_process').spawn;
    var bat;
    if (process.platform === 'win32') {
        bat = spawn('cmd.exe', ['/c', 'ruby', '-I"' + appbuildDir + '"', appbuildPath, dstDir], options);
    }
    else {
        bat = spawn(path.join(appbuildDir, 'appbuild.command'), [ '-I"' + appbuildDir + '"', appbuildPath, dstDir ], options);
    }
    var bufferHelper = new BufferHelper();
    var decode = process.platform === 'win32' ? 'gbk' : 'utf8';
    bat.stdout.on('data', function(data) {
        bufferHelper.concat(data);
    });
    bat.stderr.on('data', function(data) {
        bufferHelper.concat(data);
    });
    bat.on('close', function(code) {
        trace(iconv.decode(bufferHelper.toBuffer(), decode));
        if (code !== 0) {
            trace('ruby appbuild process exited with code' + code);
        }
    });
};

// 发布工程到指定目录
function publishToPlatform(platform, dstDir, iconList, splash)
{
    var projectOutPath = dstDir;
    trace('publisToPlatform platform is ' + platform);
    platform = platform.toLowerCase();

    // 发布为android工程
    if (platform === 'android') {
        buildAndroid(dstDir, iconList, splash);
        projectOutPath = path.join(dstDir, 'app/assets');
    }
    else if (platform === 'ios') {
        buildIOS(dstDir, iconList, splash);
        projectOutPath = path.join(dstDir, 'www');
    }

    var ret = publishTo(projectOutPath, undefined, platform);

    if (platform === 'android') {
    }
    else if (platform === 'ios') {
    }

    if (platform === 'android') {
        if (G.config.project.android.makeApk) {
            buildAndroidApk(dstDir);
        }
    }

    return ret;
};

// 生成游戏主体
function publishTo(dstDir, libVersion, platform)
{
    var buildify = require('buildify');

    if (!G.gameRoot) return 'Invalid project';

    var publishContent = fs.readFileSync(G.editorRoot + 'Template/Publish.templet.html', 'utf8');
    var appCacheContent = fs.readFileSync(G.editorRoot + 'Template/ApplicationCache.templet.appcache', 'utf8');
    var publishParams = {
        gameRoot: G.gameRoot,
        outPath: dstDir,
        config: G.config.project,
        platform: platform,
        startGameTemplate: publishContent,
        appCacheTemplate: appCacheContent
    };
    G.emitter.emit('BeforePublish', publishParams);

    if (!G.config.scene.scene || G.config.scene.scene.length === 0)
        return 'Scene list is empty, please edit setting by menu Project/Settings';

    // G.log.trace('强行刷新下uuid2file。');
    GAME_FILES_D.refresh();

    // 收集插件列表
    var pluginScripts = PLUGIN_SCRIPTS_D.getPluginScripts();

    // 收集文件列表
    var userScripts = USER_SCRIPTS_D.getUserScripts();
    var ver = G.config.project.version;

    // 收集所有 lib 库
    var libScripts = [];
    var len;
    var scriptOutput = [];
    var targetLibPath, content;

    [ { scripts : pluginScripts, dir : path.dirname(PLUGIN_SCRIPTS_D.pluginsRoot) },
      { scripts : userScripts, dir : G.gameRoot } ]
      .forEach(function(scriptInfo) {
        var scripts = scriptInfo.scripts;
        var dir = scriptInfo.dir;

        len = scripts.length;
        while (len--) {
            if (/[\\/]lib[\\/]/.test(scripts[len])) {
                fs.ensureDirSync(path.join(dstDir, 'lib'));

                // 拷走文件，写路径，从目标中删除
                var scriptPath = scripts[len];
                targetLibPath = 'lib/' + path.basename(scriptPath);
                content = fs.readFileSync(path.join(dir, scriptPath));
                fs.writeFileSync(path.join(dstDir, targetLibPath), content);
                scriptOutput.push(targetLibPath);
                scripts.splice(len, 1);
            }
        }
    });

    // 校验 ver
    if (!ver || (!/^\d[\d\.]*\d$/.test(ver) && !/^\d$/.test(ver)))
        return 'Invalid script version, please edit setting by menu Project/Settings';

    // 1. 写入所有user scripts到一个文件中
    var debugJSPath = 'js/game-scripts-debug-' + ver + '-' + uuid() + '.js';
    var miniJSPath = 'js/game-scripts-mini-' + ver + '.js';

    // 确保 js 目录存在
    fs.ensureDirSync(path.join(dstDir, 'js'));

    var packTemplatePath = 'Template/ScriptPackTemplate.js';

    // 生成混淆后的内容，写入文件
    buildify(G.gameRoot)
        .setDir(path.dirname(PLUGIN_SCRIPTS_D.pluginsRoot))
        .concat(pluginScripts)
        .setDir(G.gameRoot)
        .concat(userScripts)
        .setDir(G.editorRoot)
        .wrap(packTemplatePath, { version : ver })
        .setDir(dstDir)
        .save(debugJSPath)
        .uglify()
        .save(miniJSPath);

    // 补充 lib 目录
    scriptOutput.push(miniJSPath);

    // 2. 根据 Publish.templet.html 生成 StartGame.html
    // 读取模板文件
    // var content = fs.readFileSync(G.editorRoot + 'Template/Publish.templet.html', 'utf8');
    content = publishParams.startGameTemplate;

    // 替换脚本文件
    content = content.replace(/__PUBLISH_USER_SCRIPTS__/g, scriptOutput.join("',\n'./"));

    // 替换插件文件
    content = PLUGIN_SCRIPTS_D.genTemplateContent(content, true);

    // 加入用户脚本
    content = USER_SCRIPTS_D.genTemplateContent(content, true, libVersion, platform);
    trace('Platform is ' + platform);
    // 不是浏览器的打包需要经lib库拷贝到发布目录
    if (platform !== 'browsers') {
        content = content.replace(/'.*phaser\.min\.js'/g, "'./lib/phaser.min.js'");
        content = content.replace(/'.*webfontloader\.js'/g, "'./lib/webfontloader.js'");
        content = content.replace(/'.*qc-core\.js'/g, "'./lib/qc-core.js'");
        content = content.replace(/'.*qc-webgl\.js'/g, "'./lib/qc-webgl.js'");
        content = content.replace(/'.*qc-loading\.js'/g, "'./lib/qc-loading.js'");

        fsEx.copySync(path.join(G.editorRoot, '../lib/phaser.min.js'),path.join(dstDir, 'lib/phaser.min.js'));
        fsEx.copySync(path.join(G.editorRoot, '../lib/webfontloader.js'),path.join(dstDir, 'lib/webfontloader.js'));
        fsEx.copySync(path.join(G.editorRoot, '../lib/qc-core.js'),path.join(dstDir, 'lib/qc-core.js'));
        fsEx.copySync(path.join(G.editorRoot, '../lib/qc-webgl.js'),path.join(dstDir, 'lib/qc-webgl.js'));
        fsEx.copySync(path.join(G.editorRoot, '../lib/qc-loading.js'),path.join(dstDir, 'lib/qc-loading.js'));
    }

    // 写入目标文件
    fs.writeFileSync(path.join(dstDir, 'StartGame.html'), content);

    // 写入忽略资源收集的标记
    fs.writeFileSync(path.join(dstDir, 'folder.ignore'), 'ignore assets collect');

    publishParams.startGameContent = content;

    // 3、判断是否生成 applicate cache 文件
    if (G.config.project.appCache)
    {
        // content = fs.readFileSync(G.editorRoot + 'Template/ApplicationCache.templet.appcache', 'utf8');
        content = publishParams.appCacheTemplate;
        content = content.replace(/__CACHE_VERSION__/g, formattedTime());
        content = content.replace(/{__ver__}/g, G.VERSION);
        content = content.replace(/__EXTERNAL_PLUGINS_SCRIPTS__/g,
                                  PLUGIN_SCRIPTS_D.printCacheExternalDependenceScripts(true));
        content = content.replace(/__PUBLISH_USER_SCRIPTS__/g, scriptOutput.join('\n'));
        content = USER_SCRIPTS_D.genCacheAssetsContent(content, true);
        fs.writeFileSync(path.join(dstDir, 'qici.appcache'), content);
        publishParams.appCacheContent = content;
    }

    // 4. 复制所有的 bin/ttf 到 Build 下

    // 遍历 Game/Assets 文件夹
    var explorePath = function(dir, targetDir) {
        if (!fs.existsSync(dir))
            return;
        var list = fs.readdirSync(dir);
        for (var i = 0, len = list.length; i < len; i++) {
            var subPath = list[i];
            var fullPath = path.join(dir, subPath);
            var stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                // 如果是 xx@atlas 无视该路径
                if (subPath.indexOf('@atlas') >= 0) continue;
                explorePath(path.join(dir, subPath), path.join(targetDir, subPath));
            }
            else {
                var ext = path.extname(subPath).toLowerCase();
                var needExploreRaw = fsEx.needExploreRawFile(dir);
                if (!needExploreRaw &&
                    ['.bin', '.eot', '.ttf', '.svg', '.woff', '.ttc', '.mp3', '.ogg', '.js', '.css'].indexOf(ext) < 0) continue;

                // 拷贝本文件
                fs.ensureDirSync(targetDir);
                content = fs.readFileSync(fullPath);
                fs.writeFileSync(path.join(targetDir, subPath), content);
            }
        }
    };
    explorePath(path.join(G.gameRoot,'Assets'), path.join(dstDir, 'Assets'));

    var pluginAssets = PLUGIN_SCRIPTS_D.getPluginAssets();
    var len = pluginAssets.length;
    while (len--) {
        var relativePath = path.relative(PLUGIN_SCRIPTS_D.pluginsRoot, pluginAssets[len]);
        explorePath(pluginAssets[len], path.join(dstDir, 'Plugins', relativePath));
    }

    G.emitter.emit('AfterPublish', publishParams);
    return true;
};

// 获取最近打开的工程列表
function getRecentOpen()
{
    // 获取配置信息
    var conf;
    try {
        conf = fs.readJsonSync(path.join(G.editorRoot, 'project.setting'), { throws : false });
    }
    catch(e) {
        conf = null;
    }
    if (!conf) return [];
    if (!conf.recentOpen) return [];

    // 有信息，需逐个验证是否有效工程
    var recentOpen = conf.recentOpen;
    var i, len, p, valid;
    var modified;

    len = recentOpen.length;

    for (i = 0; i < len; i++) {
        p = recentOpen[i];
        valid = false;

        do
        {
            if (!p) break;
            try {
                if (!fs.existsSync(p) ||
                    !fs.statSync(p).isDirectory())
                    break;

                // 检查是否有 ProjectSetting/project.setting
                if (!fs.existsSync(path.join(p, 'ProjectSetting')) ||
                    !fs.existsSync(path.join(p, 'ProjectSetting/project.setting')))
                    break;

                valid = true;
            }
            catch (e) {}
        } while (false);

        if (!valid) {
            // 发现一个非法路径
            modified = true;
            recentOpen[i] = false;
        }
    }

    if (!modified) return recentOpen;

    // 整理后写入保存
    var ret = [];
    for (i = 0; i < len; i++) if (recentOpen[i]) ret.push(recentOpen[i]);
    setRecentOpen(ret);
    return ret;
};

// 设置最近打开的工程列表
function setRecentOpen(recentOpen)
{
    // 获取配置信息
    var conf;
    try {
        conf = fs.readJsonSync(path.join(G.editorRoot, 'project.setting'), { throws : false });
    }
    catch (e) {
        conf = null;
    }

    if (!conf) conf = {};
    conf.recentOpen = recentOpen;
    FS_EXPAND_D.writeJsonSync(path.join(G.editorRoot, 'project.setting'), conf);
};

// 生成game html文件
function genGameHTML()
{
    // G.log.trace('强行刷新下uuid2file。');
    GAME_FILES_D.refresh();

    COMMAND_D.dispatch('START_GAME_HTML', -1);
    COMMAND_D.dispatch('START_SCENE_HTML', -1);
    COMMAND_D.dispatch('PREVIEW_GAME_HTML', -1);
};

// file change 的时候异步生成游戏 html，该函数会聚合同一时间的请求为一次
function prepareGenGameHTML()
{
    // 尝试去获取整个文件夹的信息
    var self = PROJECT_D;
    var tick = new Date().getTime();

    if (tick - self._fileChangeMutex < 100 &&
        self._timeoutID)
        // 已经处于加载中，删除之前的 timer 延后生成
        clearTimeout(self._timeoutID);

    self._fileChangeMutex = tick;
    self._timeoutID = setTimeout(function() {
        delete self._fileChangeMutex;
        delete self._timeoutID;
        genGameHTML();
    }, 100);
};

// 保存项目配置
function saveProjectSetting()
{
    AUTO_CONFIG_PROJECT_D.writeProjectSetting(G.config.project);
}

// 模块析构函数
function destruct()
{
    G.emitter.removeListener('serviceOn', _serviceOn);
}

// 模块构造函数
function create()
{
    G.emitter.on('serviceOn', _serviceOn);
}

// 导出模块
global.PROJECT_D = module.exports = {
    createProject : createProject,
    openProject : openProject,
    createAndroidKeystore : createAndroidKeystore,
    listAndroidKeystore : listAndroidKeystore,
    buildAndroid : buildAndroid,
    buildAndroidApk : buildAndroidApk,
    buildIOS : buildIOS,
    publishToPlatform : publishToPlatform,
    publishTo : publishTo,
    getRecentOpen : getRecentOpen,
    setRecentOpen : setRecentOpen,
    genGameHTML : genGameHTML,
    prepareGenGameHTML : prepareGenGameHTML,
    saveProjectSetting : saveProjectSetting,
    destruct : destruct,
    create : create,
}

// 执行模块构造函数
create();
