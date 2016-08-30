/**
 * Created by lijh on Mar/18/2016.
 */

var MY_FLAG = 8;

var fs = fsExtra;
var chalk = require('chalk');

/**
 * 修复scene.setting中场景列表和入口场景格式，改为全路径
 */
var convert = function(dir) {
    var projectSettingPath = path.join(dir, 'ProjectSetting/project.setting');
    var editorSettingPath  = path.join(dir, 'ProjectSetting/editor.setting');
    var sceneSettingPath   = path.join(dir, 'ProjectSetting/scene.setting');

    if (!fs.existsSync(projectSettingPath) ||
        !fs.existsSync(sceneSettingPath))
        return;

    var projectSetting = null;
    var sceneSetting = null;

    try {
        projectSetting = fs.readJsonSync(projectSettingPath, { throws : false });
        sceneSetting   = fs.readJsonSync(sceneSettingPath, { throws : false });
    }
    catch(e) {
    }
    if (!projectSetting|| !sceneSetting) {
        return;
    }

    var toolFlag = projectSetting.toolFlag || 0;
    if (toolFlag & (1 << MY_FLAG)) {
        // 处理过了
        return;
    }

    // 设置回写
    projectSetting.toolFlag = (toolFlag | (1 << MY_FLAG));
    FS_EXPAND_D.writeJsonSync(projectSettingPath, projectSetting);

    // 将 editor.setting 中当前场景修改为完整路径
    if (fs.existsSync(editorSettingPath)) {
        var editorSetting = fs.readJsonSync(editorSettingPath, { throws : false });
        if (editorSetting) {
            var currScene = editorSetting.currScene;
            if (currScene && sceneSetting.scene[currScene]) {
                editorSetting.currScene = sceneSetting.scene[currScene].replace('.bin', '');

                 FS_EXPAND_D.writeJsonFileSync(editorSettingPath, editorSetting);
            }
        }
    }

    // 修改 scene.setting 中场景列表格式
    var entryScene = sceneSetting.entryScene;

    var oldEntryScene = sceneSetting.scene[entryScene];
    var newEntryScene = oldEntryScene ? oldEntryScene.replace('.bin', '') : '';
    var scenePaths = [];

    if (newEntryScene.length > 0)
        scenePaths.push(newEntryScene);

    for (var key in sceneSetting.scene) {
        if (key === entryScene)
            continue;

        scenePaths.push(sceneSetting.scene[key].replace('.bin', ''));
    }
    sceneSetting.scene = scenePaths;
    sceneSetting.entryScene = newEntryScene;

    FS_EXPAND_D.writeJsonFileSync(sceneSettingPath, sceneSetting);
};

PATCH_D.registerPatch(MY_FLAG, convert);
