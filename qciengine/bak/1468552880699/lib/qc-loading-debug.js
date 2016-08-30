/**
 * Created by linyiwei on 11/25/15.
 */

// make sure requestAnimationFrame work
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
            || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
/**
 * Created by linyiwei on 11/25/15.
 */

/*
 * How to create a custom loading handler?
 * 1. Create a class that impletement custom loading handler. The class must impletment the following three methods:
 *   a. void start(totalAssetCount) : When start loading, this method will be invoked with total asset's count parameter.
 *   b. void progress(curCount) : When one asset is loaded, this method will be invoked with current asset's count parameter.
 *   c. void finish(): When all assets are loaded, this method will be invoked.
 * 2. Instantiate the above class, then set to qici.loadingHandler variable. Such as: qici.loadingHandler = new testHandler();
 * 3. Set the name of custom loading handler to qici.config.loadingHandler in html file. Such as: qici.config.loadingHandler = 'testHandler';
 * 4. Add the custom script after qc-loading.js in html file. Such as:
 *  <body onload="qici.init();">
 *    <div style="overflow:hidden;padding:0;margin:0;width:100%;height:100%;">
 *       <div id="dragDiv" style="position:absolute"></div>
 *       <div id="gameDiv" style="position:absolute"></div>
 *    </div>
 *    <script src="../lib/qc-loading.js"></script>
 *    <script src="../testHandler.js"></script>
 *  </body>
 */

// index of loaded asset
qici.loadIndex = 0;

// check if assets load finish
qici.allAssetLoaded = false;

// the loading handler
qici.loadingHandler;

qici.init = function() {

    // get total count of assets.
    var totalCount = qici.scripts.length + qici.loadingAssetCount || 0;

    // hide game div
    document.getElementById('gameDiv').style.display = 'none';

    // notify loadingHandler to start
    if (qici.loadingHandler)
        qici.loadingHandler.start(totalCount);

    // load next script
    function loadScript() {

        // all the scripts are loaded
        if (qici.loadIndex === qici.scripts.length ) {
            // finish load js scripts
            // begin to load game
            qici.loadGame();

            return;
        }

        var src = qici.scripts[qici.loadIndex];
        var js = document.createElement('script');
        js.onerror = function() {
            console.log('Failed to load:', src);
            qici.loadIndex++;
            if (qici.loadingHandler)
                // notify loading progress
                qici.loadingHandler.progress(qici.loadIndex);
            loadScript();
        };
        js.onload = function () {
            qici.loadIndex++;
            if (qici.loadingHandler)
                // notify loading progress
                qici.loadingHandler.progress(qici.loadIndex);
            loadScript();
        };
        js.setAttribute('type', 'text/javascript');
        if (typeof src === 'string') {
            js.setAttribute('src', src);
        }
        else {
            js.setAttribute('src', src[0]);
            js.setAttribute('plugin_id', src[1]);
        }
        document.getElementsByTagName('head')[0].appendChild(js);
    }

    // start to load scripts
    loadScript();
};

// this method must be invoked by loading handler when loading handler finished.
qici.loadingHandlerFinished = function() {
    // adjust game size
    var game = window[qici.config.gameInstance];
    if (!game.state.pendLoadComplete)
    {
        requestAnimationFrame(qici.loadingHandlerFinished);
        return;
    }

    // show game div
    document.getElementById('gameDiv').style.display = 'block';

    // adjust game size
    var game = window[qici.config.gameInstance];

    delete game.state.pendLoadComplete;
    if (!game.phaser.world)
        return;

    game.updateGameLayout(true);
    game.updateScale(true);
}

// callback of loading process notify
qici.loadAssetsNotify = function(key) {
    if (qici.allAssetLoaded)
        // loading finish
        return;

    // one asset loaded
    qici.loadIndex++;

    var totalCount = qici.scripts.length + qici.loadingAssetCount || 0;

    /*
    var str = 'loadAssetsNotify ' + qici.loadIndex + '/' + totalCount + ' ' + key;
    var game = window[qici.config.gameInstance];
    if (game)
        game.log.trace(str);
    */
    if (qici.loadingHandler)
    {
        // notify loading progress
        qici.loadingHandler.progress(qici.loadIndex);

        if (qici.loadIndex >= totalCount)
        {
            // assets load finish
            qici.allAssetLoaded  = true;

            // notify loadingHandler to finish
            qici.loadingHandler.finish();

            // show gameDiv
            qici.loadingHandlerFinished();
        }
    }
};

/**
 * @author weism
 */
qici.loadGame = function() {

    var width = '100%';
    var height = '100%';
    var gameSize = qici.config.fixedGameSize;
    if (gameSize && gameSize.enabled && gameSize.width > 0 && gameSize.height > 0) {
        width = gameSize.width;
        height = gameSize.height;
    }
    var game = window[qici.config.gameInstance] = new qc.Game({
        width: width,
        height: height,
        parent: 'gameDiv',
        state: qici.splashState,
        editor: qici.config.editor === true,
        backgroundColor: new qc.Color(qici.config.backgroundColor),
        runInBackground: qici.config.runInBackground,
        antialias: qici.config.antialias,
        resolution : qici.config.resolution,
        resolutionRatio: qici.config.resolutionRatio,
        transparent: qici.config.transparent,
        debug: qici.config.developerMode === true,
        remoteLogUrl: qici.config.remoteLogUrl,
        customSettings : qici.config.customSettings,
        dirtyRectangles: qici.config.dirtyRectangles,
        dirtyRectanglesShow: qici.config.dirtyRectanglesShow,
        renderer: qici.config.renderer === 'Canvas' ? Phaser.CANVAS : Phaser.AUTO
    });

    /**
     * 定义快捷查找对象的方法
     * 根据唯一名字查找对象
     */
    qc.N = function(uniqueName) {
        return game.nodePool.findByName(uniqueName);
    };

    game.loadingProcessCallback = qici.loadAssetsNotify;
    game.localStorageID = qici.config.localStorageID;
    game.log.important('**** [QICI Engine]Starting game: {0}', qici.config.gameName);
};

qici.splashState = {
    init: function() {
        window[qici.config.gameInstance].fullScreen();
    },
    preload: function() {
        var game = window[qici.config.gameInstance];
        if (qici.config.loadingPrefab) {
            game.assets.load('__loading_prefab__', qici.config.loadingPrefab);
        }

        var text = game.add.text();
        text.text = 'Initializing, please wait ...';
        text.setAnchor(new qc.Point(0, 0), new qc.Point(1, 1));
        text.left = 0;
        text.right = 0;
        text.top = 0;
        text.bottom = 0;
        text.alignH = qc.UIText.CENTER;
        text.alignV = qc.UIText.MIDDLE;
        text.fontSize = 24;
        text.color = new qc.Color(0xffffff);
        text.strokeThickness = 2;
        text.stroke = new qc.Color(0x000000);
        game._initText_ = text;
        game.updateScale(true);
    },
    create: function() {
        var game = window[qici.config.gameInstance];
        game.scene.entry = qici.config.entryScene;
        game.scene.list = qici.config.scene;

        // 修改默认帧率
        if (qici.config.frameRate) game.time.applyFrameRate(qici.config.frameRate);

        var node;
        if (qici.config.loadingPrefab) {
            var prefab = game.assets.find('__loading_prefab__');
            if (prefab) {
                node = game.add.clone(prefab);
                node.ignoreDestroy = true;
                node.visible = false;
            }
        }
        if (game._initText_) {
            if (node) {
                game._initText_.destroyImmediately();
            }
            delete game._initText_;
        }
        game.scene.pendLoadComplete = true;
        game.timer.add(1, function() { game.scene.load(game.scene.entry); });
    }
};

/**
 * Created by linyiwei on 11/25/15.
 */

if (!qici.config.loadingHandler || qici.config.loadingHandler === 'svgHandler')
    document.write('\
<svg id="gameSVG" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve"\
x="0px" y="0px" width="610px" height="610px" viewBox="-200 -200 1010 1010"\
style="opacity:0;background:black;position:absolute;top:0;left:0;z-index:10000">\
<defs>\
    <filter id="shadow" filterUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">\
    <feGaussianBlur result="blurOut" in="SourceGraphic" stdDeviation="10"/>\
<feBlend in="SourceGraphic" in2="blurOut" mode = "normal"/>\
    </filter>\
    <path id="brightdot" filter="url(#shadow)" fill-rule="evenodd" clip-rule="evenodd" fill="#F7DA80" d="M16.26,11.26h10c2.761,0,5,2.238,5,5v10c0,2.761-2.239,5-5,5h-10\
c-2.762,0-5-2.239-5-5v-10C11.26,13.498,13.498,11.26,16.26,11.26z"/>\
<path id="darkdot" filter="url(#shadow)" fill-rule="evenodd" clip-rule="evenodd" fill="#7F8080" d="M16.26,11.26h10c2.761,0,5,2.238,5,5v10c0,2.761-2.239,5-5,5h-10\
c-2.762,0-5-2.239-5-5v-10C11.26,13.498,13.498,11.26,16.26,11.26z"/></defs>\
<g id="fadeOutGroup">\
    <path fill-rule="evenodd" clip-rule="evenodd" fill="none" stroke="#2A4D9F" stroke-miterlimit="10" d="M9.724,4.724h590\
c2.761,0,5,2.239,5,5v590c0,2.761-2.239,5-5,5h-590c-2.761,0-5-2.239-5-5v-590C4.724,6.963,6.963,4.724,9.724,4.724z"/>\
<path transform="translate(75 428)" fill-rule="evenodd" clip-rule="evenodd" fill="none" stroke="#2A4D9F" stroke-miterlimit="10" d="M6.771,1.929h440\
c2.761,0,5,2.239,5,5v40c0,2.761-2.239,5-5,5h-440c-2.762,0-5-2.239-5-5v-40C1.771,4.168,4.01,1.929,6.771,1.929z"/>\
<g id="dotGroup">\
    <use id="dt0" xlink:href="#darkdot" />\
    <use id="dt1" xlink:href="#darkdot" />\
    <use id="dt2" xlink:href="#darkdot" />\
    <use id="dt3" xlink:href="#darkdot" />\
    <use id="dt4" xlink:href="#darkdot" />\
    <use id="dt5" xlink:href="#darkdot" />\
    <use id="dt6" xlink:href="#darkdot" />\
    <use id="dt7" xlink:href="#darkdot" />\
    <use id="dt8" xlink:href="#darkdot" />\
    <use id="dt9" xlink:href="#darkdot" />\
\
    <use id="bt0" xlink:href="#brightdot" />\
    <use id="bt1" xlink:href="#brightdot" />\
    <use id="bt2" xlink:href="#brightdot" />\
    <use id="bt3" xlink:href="#brightdot" />\
    <use id="bt4" xlink:href="#brightdot" />\
    <use id="bt5" xlink:href="#brightdot" />\
    <use id="bt6" xlink:href="#brightdot" />\
    <use id="bt7" xlink:href="#brightdot" />\
    <use id="bt8" xlink:href="#brightdot" />\
    <use id="bt9" xlink:href="#brightdot" />\
\
    <use id="db0" xlink:href="#darkdot" transform="translate(88 432)" />\
    <use id="db1" xlink:href="#darkdot" transform="translate(131 432)" />\
    <use id="db2" xlink:href="#darkdot" transform="translate(174 432)" />\
    <use id="db3" xlink:href="#darkdot" transform="translate(217 432)" />\
    <use id="db4" xlink:href="#darkdot" transform="translate(260 432)" />\
    <use id="db5" xlink:href="#darkdot" transform="translate(303 432)" />\
    <use id="db6" xlink:href="#darkdot" transform="translate(346 432)" />\
    <use id="db7" xlink:href="#darkdot" transform="translate(389 432)" />\
    <use id="db8" xlink:href="#darkdot" transform="translate(432 432)" />\
    <use id="db9" xlink:href="#darkdot" transform="translate(475 432)" />\
\
    <use id="bb0" xlink:href="#brightdot" transform="translate(88 432)" />\
    <use id="bb1" xlink:href="#brightdot" transform="translate(131 432)" />\
    <use id="bb2" xlink:href="#brightdot" transform="translate(174 432)" />\
    <use id="bb3" xlink:href="#brightdot" transform="translate(217 432)" />\
    <use id="bb4" xlink:href="#brightdot" transform="translate(260 432)" />\
    <use id="bb5" xlink:href="#brightdot" transform="translate(303 432)" />\
    <use id="bb6" xlink:href="#brightdot" transform="translate(346 432)" />\
    <use id="bb7" xlink:href="#brightdot" transform="translate(389 432)" />\
    <use id="bb8" xlink:href="#brightdot" transform="translate(432 432)" />\
    <use id="bb9" xlink:href="#brightdot" transform="translate(475 432)" />\
\
<text id="loadingText" x="305" y="550" font-size="32px" fill="#F7DA80" style="text-anchor:middle;"></text>\
    </g>\
    </g>\
    <g id="qiciText" style="opacity:0;" transform="translate(105 415)" filter="url(#shadow)">\
    <path fill="#F7DA80" d="M20.225,65.547V13.094H64.1v52.453H51.584l1.969,6.398h-11.25l-2.109-6.398H20.225L20.225,65.547\
L20.225,65.547z M53.413,55.563V23.078h-22.5v32.484H53.413L53.413,55.563L53.413,55.563z"/>\
<path fill="#F7DA80" d="M158.291,65.547h-10.828V13.094h10.828V65.547L158.291,65.547L158.291,65.547z"/>\
    <path fill="#F7DA80" d="M282.435,65.547h-40.922V13.094h40.922v9.984h-30.094v32.484h30.094V65.547L282.435,65.547L282.435,65.547z"/>\
    <path fill="#F7DA80" d="M376.625,65.547h-10.828V13.094h10.828V65.547L376.625,65.547L376.625,65.547z"/>\
    </g>\
    <path id="collapse" style="opacity:0;" filter="url(#shadow)" fill-rule="evenodd" clip-rule="evenodd" fill="#F7DA80" d="M132.148,82.202L97.465,47.408\
c-1.298-1.302-3.406-1.306-4.708-0.008L50.325,89.697c-1.302,1.298-1.305,3.405-0.007,4.708l42.304,42.439\
c1.298,1.302,3.406,1.306,4.708,0.008l34.789-34.678l23.538,0.04l-53.647,53.477c-3.906,3.893-10.229,3.882-14.123-0.024\
L31.48,99.081c-3.894-3.906-3.884-10.229,0.021-14.123l56.577-56.396c3.906-3.894,10.229-3.883,14.123,0.023l53.485,53.656\
L132.148,82.202z"/>\
<path id="expand" style="opacity:0;" filter="url(#shadow)" fill-rule="evenodd" clip-rule="evenodd" fill="#F7DA80" d="M129.992,55.139L87.562,30.687\
c-1.588-0.915-3.623-0.374-4.546,1.21L50.434,89.732c-1.301,1.298-1.304,3.408-0.007,4.71l32.437,57.744\
c0.916,1.597,2.951,2.146,4.545,1.226l42.604-24.58l22.728,6.131L87.04,172.868c-4.784,2.759-10.889,1.112-13.637-3.679\
L33.601,99.787c-2.748-4.791-2.808-11.222-0.04-15.972l40.091-68.805c2.768-4.75,8.873-6.375,13.637-3.629l65.432,37.708\
L129.992,55.139z"/>\
</svg>');

// define a loadingHandler class
var svgHandler = function() {
    this.loadState = 'loading';
    this.loadingConfig = {};
    this.tickIndex = -1;
    this.targetRotate = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.totalCount = 0;
}
svgHandler.prototype = {};
svgHandler.prototype.constructor = svgHandler;

// start loading
svgHandler.prototype.start = function(totalAssetCount) {

    this.totalCount = totalAssetCount;

    var loadingConfig = this.loadingConfig = qici.config.loading;
    this.loadingInterval = loadingConfig.loadingInterval;
    this.brightingInterval = loadingConfig.brightingInterval;
    this.blinkingCount = loadingConfig.blinkingCount;
    this.blinkingInterval = loadingConfig.blinkingInterval;
    this.fadingInInterval = loadingConfig.fadingInInterval;
    this.fadingOutInterval = loadingConfig.fadingOutInterval;

    this.startFadingInTime = null;
    this.startFadingOutTime = null;

    // set loading text
    document.getElementById('loadingText').textContent = this.loadingConfig.loadingText || '';

    // adjust dots position
    this.positions = [
        { x: 133, y: 290, angle: 0 },
        { x: 233, y: 290, angle: 0 },
        { x: 333, y: 290, angle: 0 },
        { x: 433, y: 290, angle: 0 },
        { x: 433, y: 190, angle: 0 },
        { x: 433, y: 90, angle: 0 },
        { x: 333, y: 90, angle: 0 },
        { x: 233, y: 90, angle: 0 },
        { x: 133, y: 90, angle: 0 },
        { x: 133, y: 190, angle: 0 }
    ];
    for (var i = 0; i < 10; i++) {
        var translate = 'translate(' + this.positions[i].x + '  ' + this.positions[i].y + ')';
        document.getElementById('bt' + i).setAttribute('transform', translate);
        document.getElementById('dt' + i).setAttribute('transform', translate);
    }

    // show loading div
    this.gameSVG = document.getElementById("gameSVG");
    this.gameSVG.style.opacity = '1';

    // start to tick
    this._tick();
}

// notify the loading progress
svgHandler.prototype.progress = function(curCount) {
    var step = Math.floor(curCount / this.totalCount * 10);
    for (var i = 0; i < 10; i++) {
        if (i < step) {
            document.getElementById('bb' + i).style.opacity = '1';
            document.getElementById('db' + i).style.opacity = '0';
        }
        else {
            document.getElementById('bb' + i).style.opacity = '0';
            document.getElementById('db' + i).style.opacity = '1';
        }
    }
}

// All assets are loaded
svgHandler.prototype.finish = function() {
    // adjust tickIndex for brighting
    this.tickIndex = (this.tickIndex + 4) % 20;
    this.tickIndex = (this.tickIndex - this.tickIndex % 2) / 2;

    var expand = document.getElementById('expand');
    var collapse = document.getElementById('collapse');

    // switch to collaspe
    expand.style.opacity = '0';
    collapse.style.opacity = '1';
    collapse.setAttribute('transform', 'translate(92, 92) rotate (' + this.targetRotate +
        ') translate(-92, -92) translate(' + this.targetX + '  ' + this.targetY + ') ');

    // begin to brighting
    this.loadState = 'brighting';
}

svgHandler.prototype._tick = function() {

    var self = qici.loadingHandler;
    if (self.loadState === 'done')
        return;

    requestAnimationFrame(self._tick);

    var time = new Date().getTime();
    self.lastTime = self.lastTime || time;
    var deltaTime = time - self.lastTime;

    if (self.loadState === 'loading' && deltaTime > 0 && deltaTime < self.loadingInterval)
        return;
    if (self.loadState === 'brighting' && deltaTime < self.brightingInterval)
        return;
    if (self.loadState === 'blinking' && deltaTime < self.blinkingInterval)
        return;
    self.lastTime = time;

    var width = document.documentElement.clientWidth;
    if (window.innerWidth && window.innerWidth < width) {
        width = window.innerWidth;
    }
    var height = document.documentElement.clientHeight;
    if (window.innerHeight && window.innerHeight < height) {
        height = window.innerHeight;
    }

    self.gameSVG.setAttribute('width', width + "px");
    self.gameSVG.setAttribute('height', height + "px");

    var expand = document.getElementById('expand');
    var collapse = document.getElementById('collapse');

    // eating dot when loading
    function eatDot() {
        self.tickIndex = (self.tickIndex + 1) % 20;
        var mod = self.tickIndex % 2;
        var halfIndex = (self.tickIndex - mod) / 2;

        for (var i = 0; i < 10; i++) {
            var target;
            if (mod === 0) {
                expand.style.opacity = '1';
                collapse.style.opacity = '0';
                target = expand;
            }
            else {
                expand.style.opacity = '0';
                collapse.style.opacity = '1';
                target = collapse;
            }
            var x = self.positions[halfIndex].x - 70;
            var y = self.positions[halfIndex].y - 70;
            var transform;
            if (halfIndex <= 3) {
                self.targetRotate = 0;
                self.targetX = x;
                self.targetY = y;
            }
            else if (halfIndex <= 5) {
                self.targetRotate = -90;
                self.targetX = -y;
                self.targetY = x;
            }
            else if (halfIndex <= 8) {
                self.targetRotate = -180;
                self.targetX = -x;
                self.targetY = -y;
            }
            else {
                self.targetRotate = 90;
                self.targetX = y;
                self.targetY = -x;
            }
            target.setAttribute('transform', 'translate(92, 92) rotate (' + self.targetRotate +
                ') translate(-92, -92) translate(' + self.targetX + '  ' + self.targetY + ') ');

            if (i === halfIndex || i === (halfIndex + 1) % 10 || i === (halfIndex + 2) % 10) {
                document.getElementById('bt' + i).style.opacity = '1';
                document.getElementById('dt' + i).style.opacity = '0';
            }
            else {
                document.getElementById('bt' + i).style.opacity = '0';
                document.getElementById('dt' + i).style.opacity = '1';
            }
        }
    }

    // bright the next dots
    function brightDot() {
        self.tickIndex = (self.tickIndex + 1) % 10;
        // all the dots are bright
        if(document.getElementById('bt' + self.tickIndex).style.opacity === '1') {
            // begin to blink dots
            self.loadState = 'blinking';
        }
        // bright this dot
        document.getElementById('bt' + self.tickIndex).style.opacity = '1';
        document.getElementById('dt' + self.tickIndex).style.opacity = '0';
    }

    // blink all dots
    function blinkDot() {
        self.blinkingCount--;
        // finish blinking
        if (self.blinkingCount === 0) {
            document.getElementById('dotGroup').style.opacity = '1';

            // begin to show logo
            self.loadState = 'fadingIn';
            self.startFadingInTime = new Date().getTime();
        }
        else {
            document.getElementById('dotGroup').style.opacity = self.blinkingCount % 2 ? '1' : '0';
        }
    }

    // fade in QICI logo
    function fadingIn() {
        var time = new Date().getTime();
        var delta = time - self.startFadingInTime;

        var rate = delta / self.fadingInInterval;
        if (rate > 1.5) {
            self.loadState = 'fadingOut';
            self.startFadingOutTime = new Date().getTime();
        }
        else {
            if (rate > 1) rate = 1;
            document.getElementById('fadeOutGroup').style.opacity = 1 - rate;
            document.getElementById('qiciText').style.opacity = rate;
            var rotate = self.targetRotate + (45 - self.targetRotate) * rate;
            var x = self.targetX + (300 - self.targetX) * rate;
            var y = self.targetY + (0 - self.targetY) * rate;
            collapse.setAttribute('transform', 'translate(92, 92) rotate (' + rotate +
                ') translate(-92, -92) translate(' + x + '  ' + y + ') ');
        }
    }

    function fadingOut() {
        var time = new Date().getTime();
        var delta = time - self.startFadingOutTime;

        var rate = delta / self.fadingOutInterval;
        if (rate > 1) {
            // finish fade in
            self.loadState = 'done';
            self.gameSVG.parentNode.removeChild(gameSVG);
        }
        else {
            self.gameSVG.style.opacity = 1 - rate;
        }
    }

    if (self.loadState === 'loading') {
        eatDot();
    }
    else if (self.loadState === 'brighting') {
        brightDot();
    }
    else if (self.loadState === 'blinking') {
        blinkDot();
    }
    else if (self.loadState === 'fadingIn') {
        fadingIn();
    }
    else if (self.loadState === 'fadingOut') {
        fadingOut();
    }
}

// register the loadingHandler
if (!qici.config.loadingHandler || qici.config.loadingHandler === 'svgHandler')
    qici.loadingHandler = new svgHandler();

/**
 * Created by chenx on 3/27/16.
 */

// define a loadingHandler class
var backgroundHandler = function() {
}
backgroundHandler.prototype = {};
backgroundHandler.prototype.constructor = backgroundHandler;

// start loading
backgroundHandler.prototype.start = function(totalAssetCount) {

    this.totalCount = totalAssetCount;

    var loadingConfig = qici.config.loading;
    var backgroundStyle = loadingConfig.backgroundStyle;

    var style = document.getElementById('loading').getAttribute('style');
    style = style + backgroundStyle;
    document.getElementById('loading').setAttribute('style', style);
}

// notify the loading progress
backgroundHandler.prototype.progress = function(curCount) {
}

// All assets are loaded
backgroundHandler.prototype.finish = function() {
    var loadingDiv = document.getElementById('loading');
    loadingDiv.parentNode.removeChild(loadingDiv);
}

if (qici.config.loadingHandler === 'backgroundHandler')
    document.write('<div id="loading" style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:10000;"></div>');

// register the loadingHandler
if (qici.config.loadingHandler === 'backgroundHandler')
    qici.loadingHandler = new backgroundHandler();

/**
 * Created by chenx on 3/28/16.
 */

// define a loadingHandler class
var progressHandler = function() {
    this.tickState = 'normal';
}
progressHandler.prototype = {};
progressHandler.prototype.constructor = progressHandler;

// start loading
progressHandler.prototype.start = function(totalAssetCount) {

    this.totalCount = totalAssetCount;
}

// notify the loading progress
progressHandler.prototype.progress = function(curCount) {
    var percent = Math.floor(curCount / this.totalCount * 100);
    var progressBlock = document.getElementById('progressBlock');
    var progressPercent = document.getElementById('progressPercent');

    progressBlock.style.width = percent + "%";
    progressPercent.innerHTML = percent + "%";
}

// All assets are loaded
progressHandler.prototype.finish = function() {
    this.tickState = 'fadeout';
    this.startFadingOutTime = new Date().getTime();
}

progressHandler.prototype._tick = function() {

    var self = qici.loadingHandler;
    if (self.tickState === 'done')
        return;

    requestAnimationFrame(self._tick);

    // resize
    var width = document.documentElement.clientWidth;
    if (window.innerWidth && window.innerWidth < width) {
        width = window.innerWidth;
    }
    var progressWidth = width - 40 > 640 ? 640 : width - 40;
    var height = document.documentElement.clientHeight;
    if (window.innerHeight && window.innerHeight < height) {
        height = window.innerHeight;
    }

    var progress = document.getElementById('progress');
    progress.style.width = progressWidth + "px";

    progress.style.top =  height / 2 - 10 + "px";
    progress.style.left = (width - progressWidth) / 2 + "px";

    if (self.tickState === 'normal')
        return;

    // fadeout
    var time = new Date().getTime();
    var delta = time - self.startFadingOutTime;

    var rate = delta / 500;
    if (rate > 1) {
        // finish fadeout
        self.tickState = 'done';

        var loadingDiv = document.getElementById('loading');
        loadingDiv.parentNode.removeChild(loadingDiv);
    }
    else {
        document.getElementById('loading').style.opacity = 1 - rate;
    }
}

if (qici.config.loadingHandler === 'progressHandler')
    document.write('\
<div id="loading" style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:10000;background:gray;">\
    <div id="progress" style="position:absolute;width:320px;height:20px;background:#ebebeb;\
    border-left:1px solid transparent;border-right:1px solid transparent;border-radius:10px;">\
        <span id="progressBlock" style="width:0%;position: relative;float: left;margin: 0 -1px;min-width: 30px;\
        height: 20px;line-height: 16px;text-align: right;background: #cccccc;border: 1px solid;border-color: #bfbfbf #b3b3b3 #9e9e9e;\
        border-radius: 10px;background-image: -webkit-linear-gradient(top, #f0f0f0 0%, #dbdbdb 70%, #cccccc 100%);\
        background-image: -moz-linear-gradient(top, #f0f0f0 0%, #dbdbdb 70%, #cccccc 100%);\
        background-image: -o-linear-gradient(top, #f0f0f0 0%, #dbdbdb 70%, #cccccc 100%);\
        background-image: linear-gradient(to bottom, #f0f0f0 0%, #dbdbdb 70%, #cccccc 100%);\
        -webkit-box-shadow: inset 0 1px rgba(255, 255, 255, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2);\
        box-shadow: inset 0 1px rgba(255, 255, 255, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2);\
        right: 0;z-index: 1">\
            <span style="position: absolute;border-radius: 10px;background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAASUlEQVQ4je3RMQ7AIBADwTnK+/9bqVMmoUBAqCJcWZa1zQYS1Z189OE9vLMEaUHLENSYOff22AGBsgOCLDPn3n6sHWtfIf5t7QLBYTNAaHlxVQAAAABJRU5ErkJggg==) 0 0 repeat-x;top: 0;bottom: 0;left: 0;\
            right: 0;z-index: 1;height: 19px;"></span>\
            <span id="progressPercent" style="padding: 0 8px;font-size: 11px;font-weight: bold;color: #404040;color: rgba(0, 0, 0, 0.7);\
            text-shadow: 0 1px rgba(255, 255, 255, 0.4);">0%</span>\
        </span>\
    </div>\
</div>');

// register the loadingHandler
if (qici.config.loadingHandler === 'progressHandler')
{
    qici.loadingHandler = new progressHandler();
    qici.loadingHandler._tick();
}
