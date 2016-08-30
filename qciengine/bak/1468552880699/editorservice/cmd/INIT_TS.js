/**
 * @author weism
 * copyright 2016 Qcplay All Rights Reserved.
 */

/*
 * 初始化TypeScript目录
 */

var fs = fsExtra;

COMMAND_D.registerCmd({
    name: 'INIT_TS',
    main: function(socket, cookie, data) {
        var path = G.gameRoot + 'TypeScripts/';
        fs.ensureDirSync(path);
        if (!fs.existsSync(path + 'qc.d.ts')) {
            // 将接口文件拷贝过来
            fs.copySync(G.editorRoot + '../lib/qc.d.ts', path + 'qc.d.ts');
        }

        if (!fs.existsSync(path + 'tsconfig.json')) {
            // 自动配置tsconfig.json，这样vscode能够自动识别和编译
            fs.writeJsonFileSync(path + 'tsconfig.json', {
                "compilerOptions": {
                    "target": "es5",
                    "sourceMap": true,
                    "outFile": "../Scripts/ts.js",
                    "removeComments": false
                }
            });
        }

        // 自动创建vscode需要的配置文件
        fs.ensureDirSync(path + '.vscode');
        if (!fs.existsSync(path + '.vscode/tasks.json')) {
            fs.writeJsonFileSync(path + '.vscode/tasks.json', {
                "version": "0.1.0",
                "command": "tsc",
                "isShellCommand": true,
                "showOutput": "always",
                "args": ["-p", "."],
                "problemMatcher": "$tsc"
            });
        }
        return true;
    }
});
