/**
 * Created by wudm on 12/8/15.
 */

var MY_FLAG = 3;

var fs = fsExtra;
var chalk = require('chalk');

/**
 * 修复
 */
var convert = function(dir) {
    var settingPath = path.join(dir, 'ProjectSetting/project.setting');
    var scenePath = path.join(dir, 'ProjectSetting/scene.setting');

    if (!fs.existsSync(settingPath) ||
        !fs.existsSync(scenePath))
        return;

    var projectConf;
    var sceneConf;
    try {
        projectConf = fs.readJsonSync(settingPath, { throws : false });
        sceneConf = fs.readJsonSync(scenePath, { throws : false });
    }
    catch(e) {
        projectConf = null;
        sceneConf = null;
    }
    if (projectConf === null || sceneConf === null) {
        return;
    }

    var toolFlag = projectConf.toolFlag || 0;
    if (toolFlag & (1 << MY_FLAG)) {
        // 处理过了
        return;
    }

    // 设置回写
    projectConf.toolFlag = (toolFlag | (1 << MY_FLAG));
    FS_EXPAND_D.writeJsonSync(settingPath, projectConf);

    // 确保 scene.setting 中的 entryScene
    var entryScene = sceneConf['entityScene'];
    delete sceneConf['entityScene'];
    if (entryScene) sceneConf['entryScene'] = entryScene;
    G.config.scene = sceneConf;

    FS_EXPAND_D.writeJsonFileSync(scenePath, sceneConf);
};

PATCH_D.registerPatch(MY_FLAG, convert);
