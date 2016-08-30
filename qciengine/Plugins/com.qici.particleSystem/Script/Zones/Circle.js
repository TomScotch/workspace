/**
 * @author lijh
 * copyright 2015 Qcplay All Rights Reserved.
 */

/**
 * 圆形发射区域
 */
var Circle = qc.ParticleSystem.Zones.Circle = function(radius, edgeEmission) {
    qc.ParticleSystem.Zones.Zone.call(this, edgeEmission);

    this.geometry = new qc.Circle(0, 0, radius * 2);
};
Circle.prototype = Object.create(qc.ParticleSystem.Zones.Zone.prototype);
Circle.prototype.constructor = Circle;

/**
 * 生成一个随机发射位置
 */
Circle.prototype.getRandom = function() {
    var t = 2 * Math.PI * Math.random();

    var radius = this.geometry.radius * (this.edgeEmission ? 1 : Math.random());
    this._random.x = this.geometry.x + radius * Math.cos(t);
    this._random.y = this.geometry.y + radius * Math.sin(t);
};

