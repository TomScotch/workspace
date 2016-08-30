/**
 * @author wudm
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 负责记录前端推送的声音 duration 数据，写入到 meta 文件中
 * android 机很容易发生 duration 错误的情况，此时使用 meta 中的时间
 */
var fs = require('fs-extra');
var path = require('path');

var soundDuration = {};
var saveToPath = 'Assets/meta/soundDuration.js';
var header = 'soundDurationMap = ';
var tail = ';\n';

function _switchProject()
{
    // 从配置中获取初始信息
    soundDuration = null;
    try {
        var fileContent = fs.readFileSync(path.join(G.gameRoot, saveToPath), 'utf-8');
        soundDuration = JSON.parse(fileContent.slice(header.length, -1 * tail.length));
    }
    catch(e) {
    }

    if (!soundDuration) soundDuration = {};
}

function _genTemplateContent(eventInfo)
{
    // 只记录存在的资源，清理下 soundDuration
    var uuid2file = GAME_FILES_D.uuid2file;
    var urlExists = {};
    var metaChanged = false;

    for (var uuid in uuid2file)
        urlExists[uuid2file[uuid]] = true;
    for (var url in soundDuration) {
        if (urlExists[url])
            continue;

        // 不存在的资源被记录，需要删除
        metaChanged = true;
        delete soundDuration[url];
    }

    if (metaChanged) {
        save();
    }

    var content = eventInfo.content;

    // 判定 soundDuration 数据长度
    if (!Object.keys(soundDuration).length) {
        // 没有任何数据配置
        eventInfo.content = content.replace(/__SOUND_DURATION__/g, '');
    }
    else {
        var publish = eventInfo.publish;

        var dstPath = './' + saveToPath;
        if (!publish) {
            // 增加唯一标记码确保不被缓存
            dstPath = USER_SCRIPTS_D.addJsExtToDenyCache(dstPath, true);
        }

        // 写入数据
        eventInfo.content = content.replace(/__SOUND_DURATION__/g, "'" + dstPath + "',");
    }
}

// 发生数据变更，写入到文件中
function save()
{
    fs.writeFileSync(path.join(G.gameRoot, saveToPath),
        header + JSON.stringify(soundDuration, null, 2) + tail);
};

// 前端推送过来声音时长数据
function recordSoundDuration(url, duration)
{
    if (!duration ||
        typeof duration !== 'number')
        return;

    // 确保所有斜杠的风格统一
    url = toUnixPath(url);

    if (soundDuration[url] === duration)
        return;

    // 记录并 mark 数据为脏，后续需要写入文件
    soundDuration[url] = duration;
    save();
};

// 模块析构函数
function destruct()
{
    G.emitter.removeListener('switchProject', _switchProject);
    G.emitter.removeListener('genTemplateContent', _genTemplateContent);
}

// 模块构造函数
function create()
{
    // 关注切换工程，清空 uuid 记录
    G.emitter.on('switchProject', _switchProject);

    // 关注生成游戏的模板，填入 duration 数据
    G.emitter.on('genTemplateContent', _genTemplateContent);
}

// 导出模块
global.SOUND_DURATION_D = module.exports = {
    recordSoundDuration : recordSoundDuration,
    destruct : destruct,
    create : create,
}

// 执行模块构造函数
create();
