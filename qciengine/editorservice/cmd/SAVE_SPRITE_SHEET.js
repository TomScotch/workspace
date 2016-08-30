/**
 * @author lijh
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 发送保存 spriteSheet 信息的请求
 */
var fsEx = FS_EXPAND_D;
var fs = fsExtra;

COMMAND_D.registerCmd({
    name : 'SAVE_SPRITE_SHEET',
    main : function(socket, cookie, args) {
        var texturePath = args.texturePath;
        var spriteSheetData = args.spriteSheetData;

        // 1. 目标必须是资源文件
        if (! fsEx.isBin(texturePath)) {
            return { 'operRet' : false, 'reason' : '目标文件不是资源(bin)文件。' };
        }

        // 2. 确定当前的 texturePath 是不是存在
        var fullPath = path.join(G.gameRoot, texturePath);
        var metaPath = fsEx.getMetaName(fullPath);
        if (!fs.existsSync(fullPath) || !fs.existsSync(metaPath)) {
            return { 'operRet' : false, 'reason' : '目标文件/meta信息不存在。' };
        }

        // 3. 确定当前的类型是图集
        var metaContent;
        try {
             metaContent = fs.readJsonSync(metaPath, {throws: false});
        }
        catch (e) {
            metaContent = null;
        }

        if (!metaContent || metaContent.type != G.ASSET_TYPE.ASSET_ATLAS) {
            return { 'operRet' : false, 'reason' : '目标不是图集/图片资源，无法保存 spriteSheet 数据。' };
        }

        // 4. spriteSheet 格式正确
        if (typeof(spriteSheetData) !== 'object') {
            return { 'operRet' : false, 'reason' : 'spriteSheet 数据格式错误。' };
        }

        metaContent.spriteSheet = spriteSheetData;

        // 写入文件
        fsEx.writeJsonSync(metaPath, metaContent);

        // 4. 重新打包 bin 资源
        WATCH_D.tryPackByOneFile(fullPath);

        // 返回操作成功的信息
        return { 'operRet' : true };
    }
});
