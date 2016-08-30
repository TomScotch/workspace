/**
 * @author lijh
 * copyright 2015 Qcplay All Rights Reserved.
 */

/**
 * 发射区域
 */
var Zone = qc.ParticleSystem.Zones.Zone = function(edgeEmission) {
    // 发射的几何形状，可能是Point、Line、Rectangle、Circle等等
    this.geometry = null;

    // 缓存位置
    this._random = new qc.Point();

    // 是否从几何图形的边缘发射
    this.edgeEmission = edgeEmission;
};
Zone.prototype.constructor = Zone;

// 发射区域类型
Zone.POINT      = 1;    // 点
Zone.LINE       = 2;    // 线段
Zone.RECTANGLE  = 3;    // 矩形
Zone.CIRCLE     = 4;    // 圆

/**
 * 生成一个随机发射位置
 */
Zone.prototype.getRandom = function() {
    return this._random;
};

/**
 * 发射粒子
 */
Zone.prototype.emit = function(emitter, quantity) {
    for (var i = 0; i < quantity; i++) {
        this.getRandom();
        emitter.emitParticle(this._random.x, this._random.y, emitter);
    }
};
