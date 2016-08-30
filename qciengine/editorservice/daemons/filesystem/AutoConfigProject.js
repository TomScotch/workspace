/**
 * @author weism
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 确保工程目录的完整、所有配置文件存在并正确配置
 */

var editorAppCache = {};
var editorAppCacheTimer = -1;
var preIndexHtml = '';

function _genEditorHtmlTemplate() {
    GAME_FILES_D.refresh();
    _createEditorStarupFile();
    _createInstallPluginFile();
};

// 读取 editor.appcache 中的列表，在内存建立映射关系
function _readEditorAppCache() {
    var content;
    try {
        content = fsExtra.readFileSync(G.editorRoot + 'editor.appcache', 'utf8');
    }
    catch(e)
    {}

    if (!content)
        return;

    var match = content.match(/#VERSION \d+[\r\n]*([\w\n\W\r\d\D\s\S]*)NETWORK:.*/m);
    var cacheStr;
    if (match)
        cacheStr = match[1];
    var cacheList = cacheStr.split('\n');
    editorAppCache = {};
    for (var i = 0; i < cacheList.length; i++)
        editorAppCache[cacheList[i].trim()] = true;
}


function _serviceOn()
{
    _createProjectFile();

    // 读取 editor.appcache 中的列表，在内存建立映射关系
    _readEditorAppCache();

    if (global.process && global.process.versions['electron']) {
        // 在electron中运行，不要打开浏览器
    }
    else if (process.argv.indexOf('--notOpenProjectPage') >= 0) {

    }
    else {
        var opener = require('opener');
        var url = 'http://' + COMMUNICATE_D.host + ':' + COMMUNICATE_D.port + '/Project.html';
        opener(url);

        // 等待一段时间检查是否有连接进入
        // 在某些系统中通过opener无法打开页面，需要手动开启
        setTimeout(function() {
            if (G.beConnnected) return;
            var chalk = require('chalk');
            var alternativeUrl = 'http://localhost' + ':' + COMMUNICATE_D.port + '/Project.html';
            trace(chalk.red('Please enter this url in browser:\n{0}\nor\n{1}'), url, alternativeUrl);
        }, 6 * 1000);
    }
}

function _fileChanged(file)
{
    if (file.indexOf(path.join(G.gameRoot, 'Editor')) === 0) {
        var lowerCaseName = file.toLowerCase();
        if (lowerCaseName.slice(-8) === '.js.meta' ||
            lowerCaseName.slice(-3) === '.js') {
            // editor 目录的 js 文件发生变更
            USER_SCRIPTS_D.markJsExtDirty(file);
            _genEditorHtmlTemplate();
        }
    }
    else
    {
        var index = file.indexOf(path.join(G.editorRoot, '../lib'));
        if (index === 0)
        {
            // editor 缓存的文件有变化，则重新生成 editor.appcache
            var fileName = file.substring(path.join(G.editorRoot, '../').length);
            fileName = fileName.replace(/\\/g, '/');
            var imgIndex = file.indexOf(path.join(G.editorRoot, '../lib/imgs'));
            if ((editorAppCache[fileName] || imgIndex === 0) && editorAppCacheTimer === -1)
                editorAppCacheTimer = setTimeout(writeEditorAppCache, 1000);
        }
    }
}

var _createEditorStarupFile = function() {
    var port = COMMUNICATE_D.port;
    if (!port)
        // 无法获取 port 信息，服务还未启动
        return;

    // 尝试读取模板
    var fullPath = path.join(G.editorRoot, 'Template/index.templet.html');
    var content = fsExtra.readFileSync(fullPath, 'utf8');

    // 生成逻辑脚本
    content = content.replace(/__PORT__/g, port);
    content = content.replace(/__EDITOR_PLUGINS_SCRIPTS__/g, PLUGIN_SCRIPTS_D.printEditorExtends());
    content = content.replace(/__EDITOR_EXTEND_SCRIPTS__/g, USER_SCRIPTS_D.printEditorExtends());
    content = content.replace(/{__ver__}/g, G.VERSION);

    // 写入目标文件
    var targetPath = path.join(G.gameRoot, 'index.html');
    fsExtra.writeFileSync(targetPath, content);

    if (preIndexHtml !== content)
    {
        // index.html 文件内容有变，需要重新生成 appcache
        writeEditorAppCache();
        preIndexHtml = content;
    }
};

var _createInstallPluginFile = function() {
    var port = COMMUNICATE_D.port;
    if (!port)
    // 无法获取 port 信息，服务还未启动
        return;

    // 尝试读取模板
    var fullPath = path.join(G.editorRoot, 'Template/InstallPlugin.templet.html');
    var content = fsExtra.readFileSync(fullPath, 'utf8');

    // 生成逻辑脚本
    content = content.replace(/__PORT__/g, port);
    content = content.replace(/__EDITOR_PLUGINS_SCRIPTS__/g, PLUGIN_SCRIPTS_D.printEditorExtends());
    content = content.replace(/__EDITOR_EXTEND_SCRIPTS__/g, USER_SCRIPTS_D.printEditorExtends());
    content = content.replace(/{__ver__}/g, G.VERSION);

    // 写入目标文件
    fsExtra.ensureDirSync(path.join(G.gameRoot, 'Temp'));
    var targetPath = path.join(G.gameRoot, 'Temp', 'InstallPlugin.html');
    fsExtra.writeFileSync(targetPath, content);
};

var _createProjectFile = function() {
    var port = COMMUNICATE_D.port;

    var content = fsExtra.readFileSync(path.join(G.editorRoot, 'Template/Project.templet.html'), 'utf8');
    content = content.replace(/__PORT__/g, port);
    fsExtra.writeFileSync(path.join(G.editorRoot, 'Project.html'), content);
}

// 生成CodeEditor.html
var _createCodeEditorFile = function() {
    var port = COMMUNICATE_D.port;

    var content = fsExtra.readFileSync(path.join(G.editorRoot, 'Template/CodeEditor.templet.html'), 'utf8');
    content = content.replace(/{__ver__}/g, G.VERSION);
    content = content.replace(/__PORT__/g, port);
    var tempPath = G.gameRoot + 'Temp/';
    fsExtra.writeFileSync(tempPath + 'CodeEditor.html', content);
}


// 游戏工程的路径
function _initConfig(gameRoot) {
    G.config = {
        editor : {},
        project : {},
        editorVersion : G.VERSION
    };

    if (!gameRoot) return;
    var settingPath = gameRoot + 'ProjectSetting/';
    var tempPath = gameRoot + 'Temp/';

    // 游戏的配置

    G.config.systemPredefined = [
        FS_EXPAND_D.toUnixFileName(gameRoot),
        FS_EXPAND_D.toUnixFileName(gameRoot + 'Assets/'),
        FS_EXPAND_D.toUnixFileName(gameRoot + 'Assets/raw/'),
        FS_EXPAND_D.toUnixFileName(gameRoot + 'Assets/scene/'),
        FS_EXPAND_D.toUnixFileName(gameRoot + 'Assets/css/'),
        FS_EXPAND_D.toUnixFileName(settingPath),
        FS_EXPAND_D.toUnixFileName(gameRoot + 'Scripts/'),
        FS_EXPAND_D.toUnixFileName(gameRoot + 'TypeScripts/'),
        FS_EXPAND_D.toUnixFileName(tempPath),
        FS_EXPAND_D.toUnixFileName(gameRoot + 'Editor/'),
        FS_EXPAND_D.toUnixFileName(gameRoot + 'Editor/Service/'),
        FS_EXPAND_D.toUnixFileName(gameRoot + 'Build/'),
        FS_EXPAND_D.toUnixFileName(gameRoot + 'Plugins/')
    ];

    // 确保几个大的目录存在（除了scene目录）
    for (var i = 0, len = G.config.systemPredefined.length; i < len; i++) {
        var p = G.config.systemPredefined[i];
        if (p.indexOf('/scene/') === -1)
            fsExtra.ensureDirSync(p);
    }

    // 确保editor.setting文件存在，如果不存在则创建之
    var defaultEditorSetting = {
        layout: "landscape",
        currScene: ""
    };
    var editorFile = settingPath + 'editor.setting';
    if (!fsExtra.existsSync(editorFile)) {
        writeEditorSetting(defaultEditorSetting, gameRoot);
    }
    G.config.editor = fsExtra.readJsonFileSync(editorFile);

    // 确保project.setting文件存在，如果不存在则创建之
    var defaultProjectSetting = {
        gameName: "DefaultGame",
        version: "1.0",
        localStorageID: "com.DefaultCompany.Default",
        gameInstance: "qc_game",
        frameRate: {
            'mobile': 30,
            'desktop': 60
        },
        fixedGameSize: {
            enabled: false,
            width: 640,
            height: 960
        },
        resolutionRatio: 0.25,
        backgroundColor: 0xff474747,
        runInBackground: true,
        antialias: true,
        renderer: 'Canvas',
        transparent: false,
        developerMode: false,
        appCache: true,
        dirtyRectangles: true,
        dirtyRectanglesShow: false,
        customSettings: {},
        publish: {
            android: "build/android",
            ios: "build/ios",
            browsers: "build/browsers"
        },
        ios: {
            target: "8.1",
            buildCode: 1,
            frameRate: 30,
            renderer: "Auto",
            defaultOrientation: 0,
            splashScaling: 2,
            autoOrientation: {
            portrait: true,
            landscapeRight: true,
            portraitUpsideDown: true,
            landscapeLeft: true
            },
            bundleId: ""
        },
        android: {
            bundleId: "",
            target: 19,
            defaultOrientation: 0,
            autoOrientation: {
            portrait: true,
            portraitUpsideDown: true,
            landscapeRight: true,
            landscapeLeft: true
            },
            frameRate: 30,
            renderer: "Auto",
            keystoreFile: "",
            keystorePassword: "",
            keyAlias: "abcd",
            keyAliasPassword: "",
            splashImage: {
            asset: "de860ea8-12f2-4bc7-9e45-d6a504a1cf67",
            url: "Assets/sprites/loading.bin",
            frame: "other/zhu2"
            },
            minTarget: 16,
            buildCode: 1,
            makeApk: false
        }
    };
    var projectFile = settingPath + 'project.setting';
    if (!fsExtra.existsSync(projectFile)) {
        writeProjectSetting(defaultProjectSetting, gameRoot);
    }
    G.config.project = fsExtra.readJsonFileSync(projectFile);
    if (!G.config.project.version) {
        G.config.project.version = defaultProjectSetting.version;
    }
    if (!G.config.project.localStorageID) {
        G.config.project.localStorageID = defaultProjectSetting.localStorageID;
    }
    if (!G.config.project.frameRate) {
        G.config.project.frameRate = defaultProjectSetting.frameRate;
    }
    if (!G.config.project.fixedGameSize) {
        G.config.project.fixedGameSize = defaultProjectSetting.fixedGameSize;
    }
    if (!G.config.project.resolutionRatio) {
        G.config.project.resolutionRatio = defaultProjectSetting.resolutionRatio;
    }
    if (!G.config.project.backgroundColor) {
        G.config.project.backgroundColor = defaultProjectSetting.backgroundColor;
    }
    if (!G.config.project.runInBackground) {
        G.config.project.runInBackground = defaultProjectSetting.runInBackground;
    }
    if (!G.config.project.renderer) {
        G.config.project.renderer = defaultProjectSetting.renderer;
    }
    if (!G.config.project.antialias) {
        G.config.project.antialias = defaultProjectSetting.antialias;
    }
    if (!G.config.project.transparent) {
        G.config.project.transparent = defaultProjectSetting.transparent;
    }
    if (!G.config.project.customSettings) {
        G.config.project.customSettings = {};
    }

    // 确保scene.setting文件存在，不存在则创建之
    var defaultSceneSetting = {
        scene: [],
        entryScene: ''
    };
    var sceneFile = settingPath + 'scene.setting';
    if (!fsExtra.existsSync(sceneFile)) {
        writeSceneSetting(defaultSceneSetting, gameRoot);
    }
    G.config.scene = fsExtra.readJsonFileSync(sceneFile);

    // 确保script.setting文件存在，如果不存在则创建之
    var defaultScriptSetting = {};
    var scriptFile = settingPath + 'script.setting';

    if (!fsExtra.existsSync(scriptFile)) {
        writeScriptSetting(defaultScriptSetting, gameRoot);
    }

    // 如果StartHiddenScene.html不存在，则创建之
    var content = fsExtra.readFileSync(path.join(G.editorRoot, 'Template/StartHiddenScene.templet.html'), 'utf8');
    content = content.replace(/{__ver__}/g, G.VERSION);
    fsExtra.writeFileSync(tempPath + 'StartHiddenScene.html', content);

    // 创建css目录
    var cssPath = gameRoot + 'Assets/css/style.css';
    fsExtra.ensureDirSync(gameRoot + 'Assets/css');
    if (!fsExtra.existsSync(cssPath)) fsExtra.writeFileSync(cssPath,
        '/* css for dom */\n' +
        '* { box-sizing: border-box; -moz-box-sizing:border-box; -webkit-box-sizing:border-box; }\n');
}

// 初始化 scene_editor.state，在切换场景时执行，此时 G.gameRoot 已经被赋值
function _initSceneEditor()
{
    var settingPath = G.gameRoot + 'ProjectSetting/';
    var tempPath = G.gameRoot + 'Temp/';

    // 如果scene_editor.state不存在，创建之
    var sceneEditorPath = tempPath + 'scene_editor.state';
    if (!fsExtra.existsSync(sceneEditorPath)) {
        FS_EXPAND_D.writeJsonFileSync(sceneEditorPath, {
            dependences: {},
            data: {}
        });

        // 确保删除 editor.setting 中的 currScene
        if (fsExtra.existsSync(settingPath + 'editor.setting')) {
            delete G.config.editor['currScene'];
            writeEditorSetting(G.config.editor, G.gameRoot);
        }

        if (WATCH_D) WATCH_D.tryPackByOneFile(sceneEditorPath);
    }
}

function _beforeSwitchProject(oldGameRoot, newGameRoot, createFlag)
{
    if (!oldGameRoot)
        return;

    var targetPath = path.join(oldGameRoot, 'index.html');
    if (fsExtra.existsSync(targetPath))
        preIndexHtml = fsExtra.readFileSync(targetPath, 'utf8');
}

function _createProject(gameRoot)
{
    _initConfig(gameRoot);
}

function _switchProject()
{
    _initConfig(G.gameRoot);
    _initSceneEditor();
    USER_SCRIPTS_D.restore();

    _genEditorHtmlTemplate();
    _createCodeEditorFile();
}

function writeEditorSetting(setting, gameRoot)
{
    FS_EXPAND_D.writeJsonFileSync(path.join(gameRoot || G.gameRoot, 'ProjectSetting', 'editor.setting'), setting || G.config.editor);
};

function writeScriptSetting(setting, gameRoot)
{
    FS_EXPAND_D.writeJsonFileSync(path.join(gameRoot || G.gameRoot, 'ProjectSetting', 'script.setting'), setting || {});
};

function writeProjectSetting(setting, gameRoot)
{
    FS_EXPAND_D.writeJsonFileSync(path.join(gameRoot || G.gameRoot, 'ProjectSetting', 'project.setting'), setting || G.config.project);
};

function writeSceneSetting(setting, gameRoot)
{
    FS_EXPAND_D.writeJsonFileSync(path.join(gameRoot || G.gameRoot, 'ProjectSetting', 'scene.setting'), setting || G.config.scene);
};

function writeEditorAppCache() {

    editorAppCacheTimer = -1;
    var content = fsExtra.readFileSync(G.editorRoot + 'Template/editor.templet.appcache', 'utf8');
    content = content.replace(/__CACHE_VERSION__/g, formattedTime());

    // 则遍历 lib/imgs 目录，生成所有的图片名列表
    var fileList = [];
    var searchImages = function(assetPath, list) {
        var fullPath = path.join(G.editorRoot, '../' + assetPath);
        var dirList = fsExtra.readdirSync(fullPath);

        for (var i = 0; i < dirList.length; i++)
        {
            // 若为子目录，则递归查找
            var tempPath = fullPath + '/' + dirList[i];
            var isDirectory = fsExtra.statSync(tempPath).isDirectory();
            if (isDirectory)
                searchImages(assetPath + '/' + dirList[i], list);
            else if (dirList[i][0] != '.')
                list.push(assetPath + '/' + dirList[i])
        }
    }

    searchImages('lib/imgs', fileList);

    if (fileList.length > 0)
    {
        var str = fileList.join('\n');
        content = content.replace(/__EDITOR_IMGS__/g, str);
    }

    // 写入目标文件
    var targetPath = path.join(G.editorRoot, 'editor.appcache');
    fsExtra.writeFileSync(targetPath, content);
};

// 模块析构函数
function destruct()
{
    G.emitter.removeListener('refreshStartupFile', _genEditorHtmlTemplate);
    G.emitter.removeListener('serviceOn', _serviceOn);
    G.emitter.removeListener('fileChanged', _fileChanged);
    G.emitter.removeListener('beforeSwitchProject', _beforeSwitchProject);
    G.emitter.removeListener('createProject', _createProject);
    G.emitter.removeListener('switchProject', _switchProject);
}

// 模块构造函数
function create()
{
    _initConfig(G.gameRoot);

    // 监听通知，重新生成 editor 模板
    G.emitter.on('refreshStartupFile', _genEditorHtmlTemplate);

    // 成功启动 node 服务之后，需要复写 html 启动文件
    G.emitter.on('serviceOn', _serviceOn);

    // 在 editor 目录下的 js 文件发生变更时，生成模板
    G.emitter.on('fileChanged', _fileChanged);

    // 监听创建工程事件，初始化工程配置
    G.emitter.on('createProject', _createProject);
    G.emitter.on('switchProject', _switchProject);

    G.emitter.on('beforeSwitchProject', _beforeSwitchProject);
}

// 需要导出的外部接口
global.AUTO_CONFIG_PROJECT_D = module.exports = {
    writeEditorSetting : writeEditorSetting,
    writeProjectSetting : writeProjectSetting,
    writeSceneSetting : writeSceneSetting,
    writeEditorAppCache: writeEditorAppCache
};

// 执行模块构造函数
create();
