/**
 * @author chenx
 * @date 2015.12.23
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * action 打包规则
 */
var fs = fsExtra;

PACK_D.PACK_RULE.action = {
    type : G.ASSET_TYPE.ASSET_ACTION,
    require : [
        '.action'
    ],
    parser : parseAction,
    serialize : 'JSON'
};

// 读取 action 用来打包 bin 的时候需要过滤掉空格
function parseAction(path) {
    var fileContent;
    try { fileContent = fs.readJSONFileSync(path);}
    catch (e) { fileContent = {};}

    return JSON.stringify(fileContent);
};
