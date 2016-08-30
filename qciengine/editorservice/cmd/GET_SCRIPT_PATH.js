/**
 * @author linyw
 * copyright 2016 Qcplay All Rights Reserved.
 *
 * 根据类全名查找脚本文件路径
 */

var fs = fsExtra;

COMMAND_D.registerCmd({
    name : 'GET_SCRIPT_PATH',
    main : function(socket, cookie, className) {

    	var findScript = function(dir) {
	        if (!fs.existsSync(dir)) {
	            return null;
	        }
	        var list = fs.readdirSync(dir);
	        for (var i = 0, len = list.length; i < len; i++) {
	            var subPath = list[i];
	            var fullPath = path.join(dir, subPath);
	            var stat = fs.statSync(fullPath);
	            if (stat.isDirectory()) {
	                var scriptPath = findScript(path.join(dir, subPath));
	                if (scriptPath) {
	                	return scriptPath;
	                }
	            }
	            else {
	                var ext = path.extname(subPath).toLowerCase();
	                if (ext === '.js') {
	                	var re = new RegExp('qc.defineBehaviour\\s*\\(\\s*[\'"]' + className + '[\'"]');
	                	var content = new Buffer(fs.readFileSync(fullPath)).toString();
	                	if (re.test(content)) {
	                		console.log('YES');
	                		return fullPath;
	                	}
	                }
	            }
	        }
	        return null;
    	};

		var scriptPath = findScript(G.gameRoot + '/Scripts');
		if (scriptPath) {
			scriptPath = scriptPath.substring(G.gameRoot.length);
			scriptPath = scriptPath.replace(/\\/g, '/');
		}

        return {
            operRet : true,
            path: scriptPath
        };
    }
});
