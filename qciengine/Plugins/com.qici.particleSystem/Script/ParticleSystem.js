/**
 * @author lijh
 * copyright 2015 Qcplay All Rights Reserved.
 */

// 注册粒子系统节点的反序列化方法
qc.Serializer.registerCustomDeserializer('qc.ParticleSystem', function(game, parent, uuid) {
    return new qc.ParticleSystem(game, parent, uuid);
});

/**
 * 粒子系统，扩展自qc.Node
 */
var ParticleSystem = qc.ParticleSystem = function(game, parent, uuid) {
    qc.Node.call(this, new Phaser.Group(game.phaser, null), parent, uuid);

    // 默认名字
    this.name = 'Particle System';

    // 是否处于暂停状态
    this.paused = false;

    // 可视化状态变化事件
    this.onVisibleChanged = new qc.Signal();

    // 发射器对象
    this.emitter = null;

    /**
     * @property {qc.Texture} texture - 粒子使用的贴图
     */
    var builtinAtlas = game.assets.find('__builtin_resource__');
    this.texture = builtinAtlas.getTexture('empty.png');

    /**
     * @property {number} emissionSpace - 发射空间，自身坐标系还是世界坐标系
     */
    this.emissionSpace = qc.ParticleSystem.EmissionSpace.WORLD;

    /**
     * @property {number} rendererType - 渲染类型，暂时只支持一种类型
     */
    this.rendererType = qc.ParticleSystem.Renderer.SPRITE;

    /**
     * @property {number} zoneType - 发射区域，支持四种类型：Zone.POINT、Zone.LINE、Zone.CIRCLE、Zone.RECTANGLE
     */
    this.zoneType = qc.ParticleSystem.Zones.Zone.POINT;

    /**
     * @property {bool} edgeEmission - 是否从区域的边缘发射
     */
    this.edgeEmission = false;

    /**
     * @property {number} zoneLength - 发射区域长度，仅当zoneType为Zone.LINE时起效
     */
    this.zoneLength = 100;

    /**
     * @property {number} zoneRotation - 发射区域旋转角度，仅当zoneType为Zone.LINE时起效
     */
    this.zoneRotation = 0;

    /**
     * @property {number} zoneRadius - 发射区域半径，仅当zoneType为Zone.CIRCLE时起效
     */
    this.zoneRadius = 100;

    /**
     * @property {number} zoneWidth - 发射区域宽度，仅当zoneType为Zone.RECTANGLE时起效
     */
    this.zoneWidth = 100;

    /**
     * @property {number} zoneHeight - 发射区域高度，仅当zoneType为Zone.RECTANGEL时起效
     */
    this.zoneHeight = 100;

    /**
     * @property {number} frequency - 发射频率，即多久发射一次粒子，单位为秒
     */
    this.frequency = 0.1;

    /**
     * @property {number} quantity - 每次发射的粒子数量
     */
    this.quantity = 1;

    /**
     * @property {number} repeat - 重复发射次数，-1表示循环发射
     */
    this.repeat = -1;

    /**
     * @property {number} delay - 发射延迟
     */
    this.delay = 0;

    /**
     * @property {Array} lifespan - 粒子生命时长，在指定范围内随机取值
     */
    this.lifespan = [5, 5];

    /**
     * @property {Array} angle - 粒子发射角度，在指定范围内随机取值
     */
    this.angle = [-120, -60];

    /**
     * @property {Number} blendMode - 混合模式
     */
    this.blendMode = Phaser.blendModes.NORMAL;

    /**
     * @property {qc.Color} startColor - 粒子初始颜色
     */
    this.startColor = new qc.Color(0xFFFFFF);

    /**
     * @property {number} startColorVariation - 粒子初始颜色浮动
     */
    this.startColorVariation = 0;

    /**
     * @property {qc.Color} endColor - 粒子目标颜色
     */
    this.endColor = new qc.Color(0xFFFFFF);

    /**
     * @property {number} endColorVariation - 粒子目标颜色
     */
    this.endColorVariation = 0;

    /**
     * @property {Array} startAlpha - 粒子初始透明度，在指定范围内随机取值
     */
    this.startAlpha = [1, 1];

    /**
     * @property {Array} startScale - 粒子初始缩放，在指定范围内随机取值
     */
    this.startScale = [1, 1];

    /**
     * @property {Array} startRotation - 粒子初始旋转，在指定范围内随机取值
     */
    this.startRotation = [0, 0];

    /**
     * @property {Array} startVelocity - 粒子初始速度，在指定范围内随机取值
     */
    this.startVelocity = [100, 100];

    /**
     * @property {Number} angularVelocity - 粒子旋转角速度，在指定范围内随机取值
     */
    this.angularVelocity = [0, 0];

    /**
     * @property {qc.Point} gravity - 重力
     */
    this.gravity = new qc.Point(0, 0);

    /**
     * @property {number} maxParticles - 最大粒子数量，当粒子数量超过此值时将停止发射粒子
     */
    this.maxParticles = 200;

    /**
     * @property {boolean} playOnAwake - 粒子系统激活时是否自动开始发射
     */
    this.playOnAwake = true;

    /**
     * @property {Array} initialFrame - 粒子播放帧动画时的初始帧，在指定范围内随机取值
     */
    this.initialFrame = [0, 0];

    /**
     * @property {Array} frameRate - 粒子帧动画频率，在指定范围内随机取值
     */
    this.frameRate = [1, 1];

    /**
     * @property {boolean} enableColorCurve - 是否开启颜色控制曲线
     */
    this.enableColorCurve = false;

    /**
     * @property {qc.BezierCurve} colorCurve - 粒子颜色控制曲线，若将此项关闭则粒子颜色将在起始颜色和目标颜色之间线性变化
     */
    this.colorCurve = new qc.BezierCurve(new qc.Keyframe(0, 0, 1, 1), new qc.Keyframe(1, 1, 1, 1));

    /**
     * @property {boolean} enableAlphaCurve - 是否开启透明度控制曲线
     */
    this.enableAlphaCurve = false;

    /**
     * @property {qc.BezierCurve} alphaCurve - 粒子透明度控制曲线
     */
    this.alphaCurve = new qc.BezierCurve(new qc.Keyframe(0, 1, 0, 0), new qc.Keyframe(1, 1, 0, 0));
    
    /**
     * @property {boolean} enableScaleCurve - 是否开启缩放控制曲线
     */
    this.enableScaleCurve = false;

    /**
     * @property {qc.BezierCurve} scaleCurve - 粒子缩放控制曲线
     */
    this.scaleCurve = new qc.BezierCurve(new qc.Keyframe(0, 1, 0, 0), new qc.Keyframe(1, 1, 0, 0));

    /**
     * @property {boolean} enableVelocityCurve - 是否开启速度控制曲线
     */
    this.enableVelocityCurve = false;

    /**
     * @property {qc.BezierCurve} velocityCurve - 粒子速度控制曲线
     */
    this.velocityCurve = new qc.BezierCurve(new qc.Keyframe(0, 1, 0, 0), new qc.Keyframe(1, 1, 0, 0));

    /**
     * @property {boolean} enableAngularVelocityCurve - 是否开启角速度控制曲线
     */
    this.enableAngularVelocityCurve = false;

    /**
     * @property {qc.BezierCurve} angularVelocityCurve - 粒子角速度控制曲线
     */
    this.angularVelocityCurve = new qc.BezierCurve(new qc.Keyframe(0, 1, 0, 0), new qc.Keyframe(1, 1, 0, 0));

    var restore = uuid !== undefined;
    if (!restore) {
        this.initEmitter();
    }
};
ParticleSystem.prototype = Object.create(qc.Node.prototype);
ParticleSystem.prototype.constructor = ParticleSystem;

// 定义命名空间
qc.ParticleSystem.Transitions = {};
qc.ParticleSystem.Zones = {};
qc.ParticleSystem.Renderer = {};

qc.ParticleSystem.Renderer = {
    SPRITE: 1
};

qc.ParticleSystem.EmissionSpace = {
    WORLD: 0,
    LOCAL: 1
};

Object.defineProperties(ParticleSystem.prototype, {
    /**
     * @property {string} class - 类名字
     * @readonly
     * @internal
     */
    'class': {
        get: function() { return 'qc.ParticleSystem'; }
    }
});

/**
 * 帧调度，更新粒子发射器
 */
ParticleSystem.prototype.update = function() {
    if (this.paused)
        return;

    var elapsed = this.game.time.deltaTime * 0.001;
    this.emitter.update(elapsed);
};

/**
 * 初始化发射器
 */
ParticleSystem.prototype.initEmitter = function() {
    var emitter = new qc.ParticleSystem.Emitter(this);
    this.emitter = emitter;

    emitter.init();

    if (!this.isWorldVisible() || !this.playOnAwake)
        this.pause();
    else
        this.start();
};

/**
 * 开始发射粒子
 */
ParticleSystem.prototype.start = function() {
    if (!this.isWorldVisible())
        return;

    this.paused = false;
    this.emitter.start();
};

/**
 * 暂停发射粒子
 */
ParticleSystem.prototype.pause = function() {
    this.paused = true;

    this.emitter.pause();
};

/**
 * 清除所有已发射的粒子
 */
ParticleSystem.prototype.clear = function() {
    this.emitter.clear();
};

/**
 * 重置粒子发射
 */
ParticleSystem.prototype.reset = function() {
    this.emitter.reset();
};

/**
 * 反序列化完成，创建粒子发射器并尝试开始发射
 */
ParticleSystem.prototype.onDeserialized = function() {
    this.initEmitter();
};

/**
 * 销毁粒子系统
 */
ParticleSystem.prototype.onDestroy = function() {
    this.emitter.destroy();
    this.emitter = null;

    // 调用父类的析构
    qc.Node.prototype.onDestroy.call(this);
};

/**
 * 父亲或自身的可见属性发生变化了
 */
ParticleSystem.prototype.onVisibleChange = function() {
    if (this.emitter === null)
        return;

    // 派发事件
    this.onVisibleChanged.dispatch();

    if (this.isWorldVisible())
        this.start();
    else {
        this.clear();
        this.pause();
    }
};

/**
 * 获取需要被序列化的信息描述
 * @overide
 * @internal
 */
ParticleSystem.prototype.getMeta = function() {
    var self = this;

    var s = qc.Serializer;
    var json = qc.Node.prototype.getMeta.call(this);

    json.rendererType           = s.NUMBER;
    json.texture                = s.TEXTURE;
    json.initialFrame           = s.NUMBERS;
    json.frameRate              = s.NUMBERS;
    json.zoneType               = s.NUMBER;
    json.edgeEmission           = s.BOOLEAN;
    json.zoneLength             = s.NUMBER;
    json.zoneRotation           = s.NUMBER;
    json.zoneRadius             = s.NUMBER;
    json.zoneWidth              = s.NUMBER;
    json.zoneHeight             = s.NUMBER;
    json.emissionSpace          = s.NUMBER;
    json.frequency              = s.NUMBER;
    json.quantity               = s.NUMBER;
    json.repeat                 = s.NUMBER;
    json.delay                  = s.NUMBER;
    json.lifespan               = s.NUMBERS;
    json.angle                  = s.NUMBERS;
    json.blendMode              = s.NUMBER;
    json.startColor             = s.COLOR;
    json.endColor               = s.COLOR;
    json.startAlpha             = s.NUMBERS;
    json.startScale             = s.NUMBERS;
    json.startRotation          = s.NUMBERS;
    json.startVelocity          = s.NUMBERS;
    json.angularVelocity        = s.NUMBERS;
    json.gravity                = s.POINT;
    json.maxParticles           = s.NUMBER;
    json.playOnAwake            = s.BOOLEAN;
    json.enableColorCurve       = s.BOOLEAN;
    json.colorCurve             = s.GEOM;
    json.enableAlphaCurve       = s.BOOLEAN;
    json.alphaCurve             = s.GEOM;
    json.enableScaleCurve       = s.BOOLEAN;
    json.scaleCurve             = s.GEOM;
    json.enableVelocityCurve    = s.BOOLEAN;
    json.velocityCurve          = s.GEOM;
    json.enableAngularVelocityCurve = s.BOOLEAN;
    json.angularVelocityCurve   = s.GEOM;

    return json;
};

