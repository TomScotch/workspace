/**
 * @author wudm
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 用户发布游戏
 */
var fs = fsExtra;
var fsEx = FS_EXPAND_D;

var deleteFolderRecursive = function(path) {

    var files = [];

    if( fs.existsSync(path) ) {

        files = fs.readdirSync(path);

        files.forEach(function(file,index){

            var curPath = path + "/" + file;

            if(fs.statSync(curPath).isDirectory()) { // recurse

                deleteFolderRecursive(curPath);

            } else { // delete file

                fs.unlinkSync(curPath);

            }

        });

        fs.rmdirSync(path);

    }

};

COMMAND_D.registerCmd({
    name : 'PUBLISH',
    main : function(socket, cookie, param) {
        var platform = param.platform || 'browsers';

        var publishDir = G.config.project.publish[platform.toLowerCase()] || 'Build';
        if (!path.isAbsolute(publishDir)) {
            publishDir = path.join(G.gameRoot, publishDir);
        }

        var tsHms = new Date();
        var outName = 'PublishProject';
        var publishPath = path.join(publishDir, outName);
        if (G.config.project.publish[platform.toLowerCase() + '_timestamp']) {
            outName += '/ver' +  tsHms.getFullYear() +
                ("0" + (tsHms.getMonth() + 1)).slice(-2) +
                ("0" + (tsHms.getDate())).slice(-2) +
                ("0" + tsHms.getHours()).slice(-2) +
                ("0" + tsHms.getMinutes()).slice(-2) +
                ("0" + tsHms.getSeconds()).slice(-2);
            publishPath = path.join(publishDir, outName);
            var tryTimes = 0, checkDir = false;
            do {
                if (!fs.existsSync(publishPath)) {
                    checkDir = true;
                    break;
                }
                if (tryTimes++ > 30) break;
                publishPath = path.join(publishDir, outName + '_' + tryTimes);
            } while (true);

            if (!checkDir) {
                trace('发布文件名定位异常。');
                return;
            }
        }
        else {
            if (fs.existsSync(publishPath)) {
                deleteFolderRecursive(publishPath);
            }
        }

        // 开始发布
        var publishResult = PROJECT_D.publishToPlatform(platform, publishPath, param.iconList, param.splash);
        if (typeof publishResult === 'string') {
            return { 'operRet' : false, 'reason' : publishResult };
        }

        fsEx.addProjectHiddenDir(publishPath);

        // 打开这个文件夹
        var opener = require('opener');
        opener('file:' + publishPath);

        var ret = isLocalSocket(socket, COMMUNICATE_D.host) ? true : false;
        if ((!param || !param.platform || param.platform.toLowerCase() === 'browsers') && ret) {
            var relativePath = path.relative(G.gameRoot, publishPath);
            // 在游戏目录下才直接打开浏览器浏览
            if (relativePath.indexOf('../') !== 0) {
                // 确定是本机，打开浏览器
                var host = COMMUNICATE_D.host;
                opener('http://' + host + ':' + COMMUNICATE_D.port + '/' + path.relative(G.gameRoot, publishPath) + '/StartGame.html?v=' + tsHms.getFullYear() +
                    ("0" + (tsHms.getMonth() + 1)).slice(-2) +
                    ("0" + (tsHms.getDate())).slice(-2) +
                    ("0" + tsHms.getHours()).slice(-2) +
                    ("0" + tsHms.getMinutes()).slice(-2) +
                    ("0" + tsHms.getSeconds()).slice(-2));
            }
        }

        return { 'operRet' : true };
    }
});
