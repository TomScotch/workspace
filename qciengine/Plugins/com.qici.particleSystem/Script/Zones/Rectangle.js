/**
 * @author lijh
 * copyright 2015 Qcplay All Rights Reserved.
 */

/**
 * 矩形发射区域
 */
var Rectangle = qc.ParticleSystem.Zones.Rectangle = function(width, height, edgeEmission) {
    qc.ParticleSystem.Zones.Zone.call(this, edgeEmission);

    var x = -width / 2;
    var y = -height / 2;
    this.geometry = new qc.Rectangle(x, y, width, height);
};
Rectangle.prototype = Object.create(qc.ParticleSystem.Zones.Zone.prototype);
Rectangle.prototype.constructor = Rectangle;

/**
 * 生成一个随机发射位置
 */
Rectangle.prototype.getRandom = function() {
    if (! this.edgeEmission) {
        this._random.x = this.geometry.x + Math.random() * this.geometry.width;
        this._random.y = this.geometry.y + Math.random() * this.geometry.height;
    }
    else {
        var w, h;
        var t = Math.random() * this.geometry.perimeter;
        if (t <= this.geometry.width) {
            w = t;
            h = 0;
        }
        else if ( t <= this.geometry.width + this.geometry.height) {
            w = this.geometry.width;
            h = t - this.geometry.width;
        }
        else if ( t <= this.geometry.width * 2 + this.geometry.height) {
            w = this.geometry.width * 2 + this.geometry.height - t;
            h = this.geometry.height;
        }
        else {
            w = 0;
            h = this.geometry.perimeter - t;
        }

        this._random.x = this.geometry.x + w;
        this._random.y = this.geometry.y + h;
    }
};

