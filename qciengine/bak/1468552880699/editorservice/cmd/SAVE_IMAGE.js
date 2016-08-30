/**
 * @author wudm
 * copyright 2016 Qcplay All Rights Reserved.
 *
 * 图片信息保存
 */
var fs = fsExtra;

COMMAND_D.registerCmd({
    name : 'SAVE_IMAGE',
    main : function(socket, cookie, param) {
        var imageName = param.imageName;
        var imageContent = param.imageContent;

        // 将 imageContent 换成 buffer 形态等待写入
        var data = imageContent.replace(/^data:image\/\w+;base64,/, "");
        var buf = new Buffer(data, 'base64');

        // 写入文件中
        var filePath = path.join(G.gameRoot, imageName);
        fs.ensureDirSync(path.dirname(filePath));

        fs.writeFile(filePath, buf);
        return { 'operRet' : true };
    }
});
