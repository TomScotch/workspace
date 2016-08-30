/**
 * @author wudm
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 场景管理
 */
var fs = fsExtra;
var fsEx = FS_EXPAND_D;

// 场景重命名回调
function onSceneRenamed(oldName, newName)
{
    // 更新scene.setting中的场景列表和入口场景
    var sceneSetting = G.config.scene;
    var index = sceneSetting.scene.indexOf(oldName);
    if (index >= 0) {
        sceneSetting.scene[index] = newName;
    }

    if (sceneSetting.entryScene === oldName) {
        sceneSetting.entryScene = newName;
    }

    AUTO_CONFIG_PROJECT_D.writeSceneSetting(sceneSetting);

    // 更新editor.setting中的当前场景
    var editorSetting = G.config.editor;
    if (editorSetting.currScene === oldName)
        editorSetting.currScene = newName;

    AUTO_CONFIG_PROJECT_D.writeEditorSetting(editorSetting);

    // 更新场景资源依赖的资源数
    ASSET_COUNT_D.recordAssetCount(newName + '.bin');

    // 重新生成游戏启动文件
    PROJECT_D.genGameHTML();

    // 激发事件给客户端
    COMMAND_D.broadcast('SCENE_SETTING_UPDATED', {
        setting: G.config.scene
    });
};

// 保存一个场景
function saveScene(scenePath, data)
{
    var index = scenePath.lastIndexOf('/');
    var name = scenePath.substring(index + 1, scenePath.length);

    if (name == 'unsavedScene')
    {
        // 该名字保留给系统新建场景的临时名，不能被用户使用
        console.log('保存场景时，名字不能为 unsavedScene');
        return false;
    }

    var fullDir = G.gameRoot + scenePath.substring(0, index);
    var fullPath = G.gameRoot + scenePath + '.state';

    // 确保目录存在
    fs.ensureDirSync(fullDir);
    fsEx.writeJSONFileSync(fullPath, data);

    // 拷贝文件到临时场景
    fs.copySync(fullPath, G.gameRoot + 'Temp/scene_editor.state');

    // 进行备份
    try {
        backupScene(scenePath + '.state');
    }
    catch(e) {
    }

    // 重新打包下资源
    WATCH_D.exploreDaemon();

    // 更新场景资源依赖的资源数
    ASSET_COUNT_D.recordAssetCount(scenePath + '.bin');
    ASSET_COUNT_D.recordAssetCount('Temp/scene_editor.bin');

    // 保存源 state 的 md5
    var srcState = fs.readFileSync(fullPath, { encoding : 'utf8' });
    G.config.editor.stateMD5 = calcMD5(srcState);

    COMMAND_D.dispatch('UPDATE_EDITOR_SETTINGS', -1, G.config.editor);

    return true;
};

// 回退场景到某个节点
function revertToRevision(scenePath, version)
{
    var fullPath = G.gameRoot + scenePath;
    var backupDir = path.join(G.gameRoot, 'Temp', '.scene_backup');

    // 确定双方存在
    if (!fs.existsSync(fullPath) ||
        !fs.existsSync(path.join(backupDir, version))) {
        return false;
    }

    // 保存当前到备份
    var jsonData;

    try {
        jsonData = fs.readJSONFileSync(path.join(backupDir, version));
    } catch(e) {

    }
    if (!jsonData)
        return false;

    // 写入目标文件
    fsEx.writeJSONFileSync(fullPath, jsonData);

    // 重新打包下资源
    WATCH_D.exploreDaemon();

    // 更新场景资源依赖的资源数
    var index = scenePath.lastIndexOf('.state');
    var key = scenePath.substring(0, index) + '.bin';
    ASSET_COUNT_D.recordAssetCount(key);

    return true;
};

// 获取这个场景的备份列表
function getBackupList(scenePath)
{
    // 保证数量在配置的范围内
    var backupDir = path.join(G.gameRoot, 'Temp', '.scene_backup');
    if (!fs.existsSync(backupDir)) return [];
    var files = fs.readdirSync(backupDir);
    var list = [];
    var fixedScenePath = scenePath.replace(/\//g, '-');
    for (var i in files) {
        if (files[i].indexOf(fixedScenePath) !== 0) continue;
        list.push(files[i]);
    }
    return list;
};

// 备份一个场景
function backupScene(scenePath) {
    var fullPath = path.join(G.gameRoot, scenePath);
    if (!fs.existsSync(fullPath))
        // 不需要备份
        return;

    // 确保数量保持在期望的范围内
    var num = SETTING_D.querySetting('stateHistorySize');
    if (num <= 0)
        return;

    // 拷贝到目录中
    var backupDir = path.join(G.gameRoot, 'Temp', '.scene_backup');
    fs.ensureDir(backupDir);

    // 写入
    var ext = formattedTime();
    var fileName = path.join(backupDir, scenePath.replace(/\//g, '-') + '_' + ext);
    var content = fs.readJSONFileSync(fullPath);
    fsEx.writeJSONFileSync(fileName, content);

    // 获取备份列表
    list = getBackupList(name);
    if (list.length <= num)
        // 不需要删除
        return;

    // 排序
    list = list.sort().slice(0, list.length - num);
    for (var i in list) {
        // 删除文件
        fs.removeSync(path.join(backupDir, list[i]));
    }
};

// 模块析构函数
function destruct()
{
    G.emitter.removeListener('sceneRenamed', onSceneRenamed);
}

// 模块构造函数
function create()
{
    // 当场景重命名时更新scene.setting
    G.emitter.on('sceneRenamed', onSceneRenamed);
}

// 导出模块
global.SCENE_MANAGER_D = module.exports = {
    saveScene : saveScene,
    revertToRevision : revertToRevision,
    getBackupList : getBackupList,
    backupScene : backupScene,
    destruct : destruct,
    create : create,
}

// 执行模块构造函数
create();
