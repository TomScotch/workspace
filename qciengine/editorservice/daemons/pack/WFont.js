/**
 * @author wudm
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 动态字体打包规则
 */

PACK_D.PACK_RULE.wfont = {
    type : G.ASSET_TYPE.ASSET_WEBFONT,
    require : [
        '.wfont'
    ],
    uuidGenerator : function(url) {
        var uuid = UUID_GENERATOR_D.resUUID(url);
        return 'l' + uuid.slice(1);
    },
    serialize : 'JSON'
};
