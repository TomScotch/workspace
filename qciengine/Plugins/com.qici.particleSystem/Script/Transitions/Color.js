/**
 * @author lijh
 * copyright 2015 Qcplay All Rights Reserved.
 */

/**
 * 粒子颜色控制器
 */
var Color = qc.ParticleSystem.Transitions.Color = function(particle) {
    this.particle = particle;
    this.particleSystem = particle.emitter.owner;
    this.time = particle.emitter.game.time;

    // 混合模式
    this.blendMode = Phaser.blendModes.NORMAL;

    // 粒子颜色
    this.tint = 0;

    // 粒子透明度
    this.alpha = this.originAlpha = 1;
};
Color.prototype.constructor = Color;

/**
 * 初始化方法
 */
Color.prototype.init = function() {
    var getRandom = qc.ParticleSystem.Util.getRandom;
    var getRandomByVariation = qc.ParticleSystem.Util.getRandomByVariation;

    this.alpha = this.originAlpha = getRandom(this.particleSystem.startAlpha);
    
    this.startColor = new qc.Color(0xFFFFFF);
    this.startColor.r = getRandomByVariation(this.particleSystem.startColor.r, this.particleSystem.startColorVariation);
    this.startColor.g = getRandomByVariation(this.particleSystem.startColor.g, this.particleSystem.startColorVariation);
    this.startColor.b = getRandomByVariation(this.particleSystem.startColor.b, this.particleSystem.startColorVariation);
    
    this.endColor = new qc.Color(0xFFFFFF);
    this.endColor.r = getRandomByVariation(this.particleSystem.endColor.r, this.particleSystem.endColorVariation);
    this.endColor.g = getRandomByVariation(this.particleSystem.endColor.g, this.particleSystem.endColorVariation);
    this.endColor.b = getRandomByVariation(this.particleSystem.endColor.b, this.particleSystem.endColorVariation);

    this.tint = this.startColor.toNumber();
    this.blendMode = this.particleSystem.blendMode;
};

/**
 * 帧调度
 */
Color.prototype.update = function(elapsed, clampLife) {
    // 通过曲线刷新粒子颜色和透明度
    var t = clampLife;

    var from = this.startColor.rgb;
    var to   = this.endColor.rgb;
    if (from[0] !== to[0] || from[1] !== to[1] || from[2] !== to[2]) {
        var factor;
        if (this.particleSystem.enableColorCurve) {
            factor = this.particleSystem.colorCurve.evaluate(t);
        }
        else {
            factor = t;
        }

        var r = 255, g = 255, b = 255;
        if (from[0] !== to[0])
            r = Phaser.Math.clamp(Math.round(from[0] + factor * (to[0] - from[0])), 0, 255);

        if (from[1] !== to[1])
            g = Phaser.Math.clamp(Math.round(from[1] + factor * (to[1] - from[1])), 0, 255);

        if (from[2] !== to[2])
            b = Phaser.Math.clamp(Math.round(from[2] + factor * (to[2] - from[2])), 0, 255);

        this.tint = r << 16 | g << 8 | b;
    }

    if (this.particleSystem.enableAlphaCurve) {
        var alphaFactor = this.particleSystem.alphaCurve.evaluate(t);
        this.alpha = this.originAlpha * alphaFactor;
    }
};
