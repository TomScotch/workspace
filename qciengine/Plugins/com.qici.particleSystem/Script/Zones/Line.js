/**
 * @author lijh
 * copyright 2015 Qcplay All Rights Reserved.
 */

/**
 * 直线发射区域
 */
var Line = qc.ParticleSystem.Zones.Line = function(length, rotation) {
    qc.ParticleSystem.Zones.Zone.call(this);

    var radian = rotation * Math.PI / 180;
    var x1 = length / 2 * Math.cos(radian);
    var y1 = length / 2 * Math.sin(radian);
    var x2 = -x1;
    var y2 = -y1;
    this.geometry = new qc.Line(x1, y1, x2, y2);
};
Line.prototype = Object.create(qc.ParticleSystem.Zones.Zone.prototype);
Line.prototype.constructor = Line;

/**
 * 生成一个随机发射位置
 */
Line.prototype.getRandom = function() {
    var t = Math.random();

    this._random.x = this.geometry.start.x + t * (this.geometry.end.x - this.geometry.start.x);
    this._random.y = this.geometry.start.y + t * (this.geometry.end.y - this.geometry.start.y);
}

