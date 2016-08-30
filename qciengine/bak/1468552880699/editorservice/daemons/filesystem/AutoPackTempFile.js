/**
 * @author weism
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 将temp目录下的文件根据配置重新打包
 */

// 重新打包当前编辑器中编辑的场景
function _genHTML()
{
    if (!G.gameRoot) return;
    var currSceneFile = G.config.editor.currne + '.bin';
    var sceneData = {
        data : {}
    };
    if (fsExtra.existsSync(G.gameRoot + currSceneFile)) {
        sceneData = fsExtra.readJsonFileSync(G.gameRoot + currSceneFile);
    }

    COMMAND_D.dispatch('PACK_EDITOR_SCENE', -1, sceneData);

    // 重新生成游戏启动文件
    debug('switch project and generate game html.');
    USER_SCRIPTS_D.restore();
    PROJECT_D.genGameHTML();
};

function _fileChanged(file)
{
    if (file.indexOf(path.join(G.gameRoot, 'Scripts')) === 0) {
        var lowerCaseName = file.toLowerCase();
        if (lowerCaseName.slice(-8) === '.js.meta' ||
            lowerCaseName.slice(-3) === '.js') {
            // 重新生成游戏启动文件
            USER_SCRIPTS_D.markJsExtDirty(file);
            debug('file {0} changed, generate html.', file);
            PROJECT_D.prepareGenGameHTML();
        }
    }
    else if (file.indexOf('.state') != -1)
    {
        debug('scene {0} changed, generate html.', file);
        PROJECT_D.genGameHTML();
    }
};

// 模块析构函数
function destruct()
{
    G.emitter.removeListener('postInit', _genHTML);
    G.emitter.removeListener('switchProject', _genHTML);
    G.emitter.removeListener('fileChanged', _fileChanged);
}

// 模块构造函数
function create()
{
    G.emitter.on('postInit', _genHTML);
    G.emitter.on('switchProject', _genHTML);

    // 在 Scripts 目录下的 js 文件发生变更时，生成模板
    G.emitter.on('fileChanged', _fileChanged);
}

// 导出模块
global.AUTO_PACK_TEMP_FILE_D = module.exports = {
    destruct : destruct,
    create : create,
}

// 执行模块构造函数
create();
