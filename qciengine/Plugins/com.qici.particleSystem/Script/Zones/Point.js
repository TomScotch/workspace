/**
 * @author lijh
 * copyright 2015 Qcplay All Rights Reserved.
 */

/**
 * 点状发射区域
 */
var Point = qc.ParticleSystem.Zones.Point = function() {
    qc.ParticleSystem.Zones.Zone.call(this);

    this.geometry = new qc.Point();
};
Point.prototype = Object.create(qc.ParticleSystem.Zones.Zone.prototype);
Point.prototype.constructor = Point;

/**
 * 生成一个随机发射位置
 */
Point.prototype.getRandom = function() {
    this._random = this.geometry;
}

