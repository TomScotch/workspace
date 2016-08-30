/**
 * @author chenx
 * @date 2016.2.25
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * action manager 打包规则
 */
var fs = fsExtra;

PACK_D.PACK_RULE.actionManager = {
    type : G.ASSET_TYPE.ASSET_ACTIONMANAGER,
    require : [
        '.actionmanager'
    ],
    parser : parseActionManager,
    serialize : 'JSON'
};

// 读取 actionManager 用来打包 bin 的时候需要过滤掉空格
function parseActionManager(path) {
    var fileContent;
    try { fileContent = fs.readJSONFileSync(path);}
    catch (e) {
        fileContent = {};
    }

    return JSON.stringify(fileContent);
};
