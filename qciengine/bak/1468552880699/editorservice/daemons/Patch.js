/**
 * @author lijh
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 工程升级模块
 * 注：所有 patch 脚本都在工程切换前执行，且无须修改内存中的数据
 */

var fs = fsExtra;

var patches = {};

// 升级工程
function _upgradeProject(oldGameRoot, newGameRoot, createFlag)
{
    var projectSettingPath = path.join(newGameRoot, 'ProjectSetting/project.setting');

    var projectSetting = null;
    try {
        projectSetting = fs.readJsonSync(projectSettingPath, { throws : false });
    }
    catch(e) {
    }

    if (!projectSetting)
        return;

    projectSetting.toolFlag = projectSetting.toolFlag || 0;

    // 获取所有 patch 脚本的 flag 并排序
    var flags = Object.keys(patches).sort();

    // 新创建的工程，初始化 projectSetting 中的 toolFlag，并跳过 patch 步骤
    if (createFlag) {
        for (var i in flags) {
            projectSetting.toolFlag |= 1 << flags[i];
        }

        FS_EXPAND_D.writeJsonSync(projectSettingPath, projectSetting);
        return;
    }

    var toolFlag = projectSetting.toolFlag;

    // 依次执行 flag 对应的 patch 脚本
    for (var i in flags) {
        var flag = flags[i];

        if (toolFlag & (1 << flag))
            continue;

        trace('Execute patch with flag {0}', flag);

        var patch = patches[flag];
        patch(newGameRoot);
    }
}

// 注册一个Patch脚本
function registerPatch(flag, patch)
{
    if (patches[flag]) {
        error('Duplicate patch tool flag ' + flag);
        return;
    }

    patches[flag] = patch;
};

// 模块析构函数
function destruct()
{
    G.emitter.removeListener('beforeSwitchProject', _upgradeProject);
}

// 模块构造函数
function create()
{
    loadDir('daemons/patch');

    // 关注切换工程事件，对旧工程进行升级
    G.emitter.on('beforeSwitchProject', _upgradeProject);
}

// 导出模块
global.PATCH_D = module.exports = {
    registerPatch : registerPatch,
    destruct : destruct,
    create : create,
}

// 执行模块构造函数
create();
