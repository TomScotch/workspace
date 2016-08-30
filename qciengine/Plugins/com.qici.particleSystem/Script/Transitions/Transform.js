/**
 * @author lijh
 * copyright 2015 Qcplay All Rights Reserved.
 */

/**
 * 粒子Transform控制器
 */
var Transform = qc.ParticleSystem.Transitions.Transform = function(particle) {
    this.particle = particle;
    this.particleSystem = particle.emitter.owner;
    this.time = particle.emitter.game.time;
    this.gravity = new Phaser.Point();
    this.x = 0;
    this.y = 0;
    this.anchor = {
        x: 0.5,
        y: 0.5
    }

    this.velocity = {
        x: 0,
        y: 0
    };
    this.originVelocity = {
        x: 0,
        y: 0
    };

    this.scale = this.originScale = 1;
    this.rotation = 0;
    this.originAngularVelocity = 0;
};
Transform.prototype.constructor = Transform;

/**
 * 初始化方法
 */
Transform.prototype.init = function(x, y) {
    this.x = x;
    this.y = y;
    this.gravity = this.particleSystem.gravity;

    var angle = qc.ParticleSystem.Util.getRandom(this.particleSystem.angle);
    var magnitude = qc.ParticleSystem.Util.getRandom(this.particleSystem.startVelocity);
    var radian = angle * Math.PI / 180;
    this.velocity.x = this.originVelocity.x = magnitude * Math.cos(radian);
    this.velocity.y = this.originVelocity.y = magnitude * Math.sin(radian);

    this.scale = this.originScale = qc.ParticleSystem.Util.getRandom(this.particleSystem.startScale);
    this.rotation = qc.ParticleSystem.Util.getRandom(this.particleSystem.startRotation) * Math.PI / 180;
    this.originAngularVelocity = qc.ParticleSystem.Util.getRandom(this.particleSystem.angularVelocity) * Math.PI / 180;
}

/**
 * 帧调度
 */
Transform.prototype.update = function(elapsed, clampLife) {
    var t = clampLife;

    // 重力改变速度
    this.originVelocity.x += this.gravity.x * elapsed;
    this.originVelocity.y += this.gravity.y * elapsed;

    // 通过曲线控制粒子速度
    if (this.particleSystem.enableVelocityCurve) {
        var velocityFactor = this.particleSystem.velocityCurve.evaluate(t);
        this.velocity.x = this.originVelocity.x * velocityFactor;
        this.velocity.y = this.originVelocity.y * velocityFactor;
    }
    else {
        this.velocity.x = this.originVelocity.x;
        this.velocity.y = this.originVelocity.y;
    }

    this.x += this.velocity.x * elapsed;
    this.y += this.velocity.y * elapsed;

    // 通过曲线控制粒子的缩放
    if (this.particleSystem.enableScaleCurve) {
        var scaleFactor = this.particleSystem.scaleCurve.evaluate(t);
        this.scale = this.originScale * scaleFactor;
    }

    // 通过曲线控制粒子的旋转
    if (this.originAngularVelocity !== 0) {
        var angularVelocity = this.originAngularVelocity;
        if (this.particleSystem.enableAngularVelocityCurve) {
            angularVelocity *= this.particleSystem.angularVelocityCurve.evaluate(t);
        }

        this.rotation += angularVelocity * elapsed;
    }
}
