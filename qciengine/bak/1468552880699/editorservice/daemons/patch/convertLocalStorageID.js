/**
 * Created by lijh on 03/11/2016
 * 将project.setting中的bundleIdentifier转换为localStorageID
 */

var MY_FLAG = 7;

var fs = fsExtra;

var convert = function(dir) {
    var settingPath = path.join(dir, 'ProjectSetting/project.setting');
    if (!fs.existsSync(settingPath))
        return;

    var projectConf = null;
    try {
        projectConf = fs.readJsonSync(settingPath, { throws : false });
    }
    catch(e) {
    }
    if (!projectConf) return;

    var toolFlag = projectConf.toolFlag || 0;
    if (toolFlag & (1 << MY_FLAG)) {
        // 处理过了
        return;
    }

    // 设置回写
    projectConf.toolFlag = (toolFlag | (1 << MY_FLAG));
    FS_EXPAND_D.writeJsonSync(settingPath, projectConf);

    // 转换 bundleIdentifier 为 localStorageID
    projectConf.localStorageID = projectConf.bundleIdentifier;
    delete projectConf.bundleIdentifier;
    FS_EXPAND_D.writeJsonSync(settingPath, projectConf);
};

PATCH_D.registerPatch(MY_FLAG, convert);
