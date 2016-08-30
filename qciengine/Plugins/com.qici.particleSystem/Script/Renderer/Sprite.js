/**
 * @author lijh
 * copyright 2015 Qcplay All Rights Reserved.
 */

var Sprite = qc.ParticleSystem.Renderer.Sprite = function(emitter) {
    this.emitter = emitter;
    this.game = this.emitter.game;
    this.display = emitter.owner.phaser;
};
Sprite.prototype.constructor = Sprite;

// 创建一个Phaser.Sprite用于呈现粒子
Sprite.prototype.add = function(particle, texture, frame) {
    var url   = texture.atlas.url;

    var sprite = particle.sprite;
    if (sprite) {
        sprite.reset(particle.transform.x, particle.transform.y);
        if (sprite.key !== url) {
            sprite.loadTexture(url, frame);
        }
        else {
            sprite.frameName = frame;
        }
    }
    else {
        sprite = this.display.create(particle.transform.x, particle.transform.y, url, frame);
    }

    // 初始化粒子属性
    sprite.anchor.set(particle.transform.anchor.x, particle.transform.anchor.y);
    sprite.blendMode = particle.color.blendMode;

    particle.sprite = sprite;

    return sprite;
};

/**
 * 帧调度，更新 Sprite 的位置、缩放、颜色等信息
 */
Sprite.prototype.update = function(particle) {
    var displayChangeStatus = 0x0;

    var sprite = particle.sprite;
    if (sprite.x !== particle.transform.x || sprite.y !== particle.transform.y) {
        displayChangeStatus |= qc.DisplayChangeStatus.OFFSET;

        sprite.x = particle.transform.x;
        sprite.y = particle.transform.y;
    }

    if (sprite.scale.x !== particle.transform.scale) {
        displayChangeStatus |= qc.DisplayChangeStatus.SCALE;

        sprite.scale.x = particle.transform.scale;
        sprite.scale.y = particle.transform.scale;
    }

    if (sprite.rotation !== particle.transform.rotation) {
        displayChangeStatus |= qc.DisplayChangeStatus.ROTATION;

        sprite.rotation = particle.transform.rotation;
    }

    if (sprite.tint !== particle.color.tint) {
        displayChangeStatus |= qc.DisplayChangeStatus.TINT;

        sprite.tint = particle.color.tint;
    }

    if (sprite.alpha !== particle.color.alpha) {
        displayChangeStatus |= qc.DisplayChangeStatus.ALPHA;

        sprite.alpha = particle.color.alpha;
    }

    // 由于我们 hack 了 PIXI.DisplayObject 的 updateTransform 方法，增加了通过检查 _isNotNeedCalcTransform
    // 来决定是否要更新 transform 的逻辑；同时，由于粒子系统中的粒子没有经过QICI封装(是Phaser.Sprite)，因此需要手动
    // 设置 _isNotNeedCalcTransform 标记以通知其 transform 更新。
    sprite._isNotNeedCalcTransform = false;

    // canvas模式且开启了脏矩形，需要手动调用displayChanged
    if (particle.manualDisplayChanged) {
        sprite.displayChanged(displayChangeStatus);
    }
};

