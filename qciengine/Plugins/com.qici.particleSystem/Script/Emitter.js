/**
 * @author lijh
 * copyright 2015 Qcplay All Rights Reserved.
 */

/**
 * 粒子发射器
 */
var Emitter = qc.ParticleSystem.Emitter = function(owner) {
    this.game  = owner.game.phaser;

    // 发射器所属的粒子系统
    this.owner = owner;

    // 粒子类型
    this.particleClass = qc.ParticleSystem.Particle;

    // 正在显示的粒子列表
    this.list = [];

    // 被回收的粒子列表
    this.pool = [];

    // 是否处于暂停状态
    this.paused = false;
};
Emitter.prototype.constructor = Emitter;

/**
 * 初始化粒子发射器
 */
Emitter.prototype.init = function() {
    // 创建粒子渲染器
    this.renderer = this.createRenderer(this.owner.rendererType);

    // 初始化粒子发射区域
    this.zone = this.createZone();

    // 创建发射定时器
    this.timer = this.game.time.create(false);
};

/**
 * 开始发射粒子
 */
Emitter.prototype.start = function() {
    this.paused = false;

    if (!this.timer.running) {
        var repeat = this.owner.repeat;

        var frequency = this.owner.frequency * 1000;
        if (repeat === -1) {
            this.timer.loop(frequency, this.emitImp, this);
        }
        else if (repeat > 0) {
            this.timer.repeat(frequency, repeat, this.emitImp, this);
        }
        this.timer.start(this.owner.delay * 1000);
    }
    else {
        this.timer.resume();
    }
};

/**
 * 暂停发射粒子
 */
Emitter.prototype.pause = function() {
    this.paused = true;

    this.timer.pause();
};

/**
 * 帧调度，更新所有粒子
 */
Emitter.prototype.update = function(elapsed) {
    // 反向遍历，以便在循环中删除元素
    for (var i = this.list.length - 1; i >= 0; i--) {
        var particle = this.list[i];

        particle.update(elapsed);

        // 粒子已死亡，从显示队列中移除，并放入回收队列
        if (!particle.alive) {
            this.pool.push(particle);
            this.list.splice(i, 1);
        }
    }
};

/**
 * 清除所的粒子
 */
Emitter.prototype.clear = function() {
    for (var i = 0; i < this.list.length; i++) {
        var particle = this.list[i];
        particle.terminate();
    }

    this.list = [];
    this.pool = [];
};

/**
 * 重置粒子发射器，通常用于编辑器调用
 */
Emitter.prototype.reset = function() {
    this.clear();

    this.renderer = null;
    this.zone = null;
    this.timer.destroy();

    this.init();
};

/**
 * 销毁发射器
 */
Emitter.prototype.destroy = function() {
    this.clear();

    this.renderer = null;
    this.zone = null;
    this.timer.destroy();
    this.timer = null;
};

/**
 * 生成一个粒子
 */
Emitter.prototype.emitParticle = function(x, y, emitter) {
    // 超过粒子数量上限，不再发射
    if (this.list.length >= this.owner.maxParticles)
        return;

    var particle = this.pool.pop();
    if (!particle)
        particle = new this.particleClass(this);

    // 初始化粒子
    particle.init(x, y);

    if (particle.alive) {
        this.list.push(particle);
    }
    else {
        this.pool.push(particle);
    }
};

Emitter.prototype.emitImp = function() {
    var quantity = this.owner.quantity;

    if (this.zone) {
        this.zone.emit(this, quantity);
    }
};

/**
 * 创建粒子渲染器
 * @private
 */
Emitter.prototype.createRenderer = function(rendererType) {
    rendererType = rendererType || qc.ParticleSystem.RENDER_TYPE_SPRITE;

    var renderer;
    switch (rendererType) {
        case qc.ParticleSystem.Renderer.SPRITE:
            renderer = new qc.ParticleSystem.Renderer.Sprite(this);
            break;

        default:
            console.error("Invalid renderer type " + rendererType);
    }

    return renderer;
};

/**
 * 创建粒子发射区域
 * @private
 */
Emitter.prototype.createZone = function() {
    var type = this.owner.zoneType;
    var edgeEmission = this.owner.edgeEmission;

    var zone;
    switch (type) {
        case qc.ParticleSystem.Zones.Zone.POINT:
            zone = new qc.ParticleSystem.Zones.Point();
            break;

        case qc.ParticleSystem.Zones.Zone.LINE:
            var length = this.owner.zoneLength;
            var rotation = this.owner.zoneRotation;
            zone = new qc.ParticleSystem.Zones.Line(length, rotation);
            break;

        case qc.ParticleSystem.Zones.Zone.CIRCLE:
            var radius = this.owner.zoneRadius;
            zone = new qc.ParticleSystem.Zones.Circle(radius, edgeEmission);
            break;

        case qc.ParticleSystem.Zones.Zone.RECTANGLE:
            var width = this.owner.zoneWidth;
            var height = this.owner.zoneHeight;
            zone = new qc.ParticleSystem.Zones.Rectangle(width, height, edgeEmission);
            break;

        default:
           console.error("Invalid zone type " + zoneType);
    }

    return zone;
};
