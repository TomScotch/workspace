        var qici = {};
        qici.config = {
            // 游戏名字，默认为：未命名
            gameName: '__GAME_NAME__',

            // 本地存储标志符，默认为：com.DefaultCompany.Game
            localStorageID: '__LOCAL_STORAGE_ID__',

            // 游戏示例，将作为全局变量访问，默认为：game
            gameInstance: '__GAME_INSTANCE__',

            // 帧率
            frameRate: __FRAMERATE__,

            // 固定游戏大小
            fixedGameSize: __FIXEDGAMESIZE__,

            // 分辨率清晰度
            resolutionRatio: __RESOLUTIONRATIO__,

            // 游戏背景色
            backgroundColor: __BACKGROUNDCOLOR__,

            // 后台运行
            runInBackground: __RUNINBACKGROUND__,

            // 抗锯齿
            antialias: __ANTIALIAS__,

            // 渲染方式
            renderer: '__RENDERER__',

            // 背景透明
            transparent: __TRANSPARENT__,

            // 游戏切屏时的进度界面
            loadingPrefab: '__LOADINGPREFAB__',

            // 开发模式
            developerMode: true,

            // 是否启用脏矩形
            dirtyRectangles: __DIRTYRECTAGNLES__,

            // 是否显示脏矩形区域
            dirtyRectanglesShow: __DIRTYRECTAGNLESSHOW__,

            // 自定义配置
            customSettings: __CUSTOM_SETTINGS__,

            // 所有的游戏场景
            scene: [
                'Temp/scene_editor'__SCENE_LIST__
            ],

            // 入口场景
            entryScene : 'Temp/scene_editor',
            loadingHandler: 'progressHandler',
            loading: {
                loadingText: 'Loading, please wait...',
                loadingInterval: 200,
                brightingInterval: 10,
                blinkingCount: 5,
                blinkingInterval: 70,
                fadingInInterval: 50,
                fadingOutInterval: 100
            }
        };
