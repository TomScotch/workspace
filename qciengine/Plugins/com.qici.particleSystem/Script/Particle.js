/**
 * @author lijh
 * copyright 2015 Qcplay All Rights Reserved.
 */

/**
 * 粒子对象
 */
var Particle = qc.ParticleSystem.Particle = function(emitter) {
    this.emitter        = emitter;
    this.particleSystem = emitter.owner;
    this.renderer       = emitter.renderer;
    this.game           = this.emitter.owner.game;

    // 是否需要手动调用 displayChanged
    this.manualDisplayChanged = this.game.phaser.renderType === Phaser.CANVAS && this.game.dirtyRectangle.enable;

    // 是否存活
    this.alive = true;

    this.life = 0;

    // 粒子对应的Phaser.Sprite对象
    this.sprite = null;

    // 粒子位置变化控制器
    this.transform = new qc.ParticleSystem.Transitions.Transform(this);

    // 粒子颜色变化控制器
    this.color = new qc.ParticleSystem.Transitions.Color(this);
};
Particle.prototype.constructor = Particle;

/**
 * 粒子初始化
 */
Particle.prototype.init = function(x, y) {
    this.life = 0;
    this.alive = true;
    this.lifespan = qc.ParticleSystem.Util.getRandom(this.particleSystem.lifespan);

    // 计算粒子帧动画的每帧间隔时间
    var frameRate = qc.ParticleSystem.Util.getRandom(this.particleSystem.frameRate);
    this.frameInterval = 1 / frameRate;
    this.frameTime = 0;

    this.create(x, y);

    // 缓存生成粒子时发射器的位置，并重载粒子的updateTransform方法，以使粒子位置不受父节点的影响
    if (this.particleSystem.emissionSpace === qc.ParticleSystem.EmissionSpace.WORLD) {
        this.cacheParentWorldTransform();
        this.sprite.updateTransform = Particle.updateTransform;
    }
};

/**
 * 根据粒子配置创建粒子
 */
Particle.prototype.create = function(x, y) {
    var texture = this.particleSystem.texture;

    this.transform.init(x, y);
    this.color.init();

    if (this.alive) {
        var frame;
        if (texture.atlas.meta.spriteSheet) {
            // 如果指定的 texture 是 spriteSheet，则设置粒子的 frame 为配置的初始帧
            this.frameIndex = qc.ParticleSystem.Util.getRandom(this.particleSystem.initialFrame);
            this.frameIndex = Phaser.Math.clamp(Math.round(this.frameIndex), 0, texture.atlas.frameNames.length - 1);
            frame = texture.atlas.frameNames[this.frameIndex];
        }
        else {
            if (texture.frame === 0) {
                // 指定的 texture 是 UIAtlas，则在图集中随机选择一张图片
                frame = this.game.phaser.rnd.pick(texture.atlas.frameNames);
            }
            else {
                // 指定的 texture 是 UIAtlas 中的某张图片，直接使用即可
                frame = texture.frame;
            }
        }
            
        var sprite = this.renderer.add(this, texture, frame);
        this.renderer.update(this);
    }

    // 马上更新一帧，让控制曲线做一次采样
    this.transform.update(0, 0);
    this.color.update(0, 0);

    // canvas模式且开启了脏矩形，需要手动调用displayChanged
    if (this.manualDisplayChanged)
        this.sprite.displayChanged(qc.DisplayChangeStatus.SHOW);
};

/**
 * 帧调度
 */
Particle.prototype.update = function(elapsed) {
    this.life += elapsed;

    if (this.life < this.delay)
        this.sprite.visible = false;
    else
        this.sprite.visible = true;

    this.renderer.update(this);

    var clampLife = Phaser.Math.clamp(this.life / this.lifespan, 0 , 1);
    this.transform.update(elapsed, clampLife);
    this.color.update(elapsed, clampLife);

    if (this.life >= this.lifespan) {
        this.terminate();
        return;
    }

    // 更新粒子帧动画
    if (this.emitter.owner.texture.atlas.meta.spriteSheet) {
        this.frameTime += elapsed;
        if (this.frameTime >= this.frameInterval) {
            this.frameIndex++;
            if (this.frameIndex >= this.emitter.owner.texture.atlas.frameNames.length)
                this.frameIndex = 0;

            this.sprite.frameName = this.particleSystem.texture.atlas.frameNames[this.frameIndex];

            // canvas模式且开启了脏矩形，需要手动调用displayChanged
            if (this.manualDisplayChanged)
                this.sprite.displayChanged(qc.DisplayChangeStatus.SHOW);

            this.frameTime -= this.frameInterval;
        }
    }
};

/**
 * 粒子消亡
 */
Particle.prototype.terminate = function() {
    this.alive = false;

    this.sprite.kill();

    // canvas模式且开启了脏矩形，需要手动调用displayChanged
    if (this.manualDisplayChanged)
        this.sprite.displayChanged(qc.DisplayChangeStatus.HIDE);
};

/**
 * 缓存生成粒子时发射器的位置
 */
Particle.prototype.cacheParentWorldTransform = function() {
    if (!this.sprite)
        return;

    var wt = this.emitter.owner.phaser.worldTransform;
    var wt2 = this.sprite._parentWorldTransform = new qc.Matrix();
    wt2.a = wt.a;
    wt2.b = wt.b;
    wt2.c = wt.c;
    wt2.d = wt.d;
    wt2.tx = wt.tx;
    wt2.ty = wt.ty;
};

/**
 * 重载粒子的updateTransform方法，保证粒子对象不收其父亲的移动影响
 */
Particle.updateTransform = function() {
    if (!this.parent || !this.visible) return;

    // create some matrix refs for easy access
    var pt = this._parentWorldTransform;
    if (!pt) return;
    var wt = this.worldTransform;

    // temporary matrix variables
    var a, b, c, d, tx, ty;

    // so if rotation is between 0 then we can simplify the multiplication process..
    if (this.rotation % PIXI.PI_2)
    {
        // check to see if the rotation is the same as the previous render. This means we only need to use sin and cos when rotation actually changes
        if (this.rotation !== this.rotationCache)
        {
            this.rotationCache = this.rotation;
            this._sr = Math.sin(this.rotation);
            this._cr = Math.cos(this.rotation);
        }

        // get the matrix values of the displayobject based on its transform properties..
        a  =  this._cr * this.scale.x;
        b  =  this._sr * this.scale.x;
        c  = -this._sr * this.scale.y;
        d  =  this._cr * this.scale.y;
        tx =  this.position.x;
        ty =  this.position.y;

        // check for pivot.. not often used so geared towards that fact!
        if (this.pivot.x || this.pivot.y)
        {
            tx -= this.pivot.x * a + this.pivot.y * c;
            ty -= this.pivot.x * b + this.pivot.y * d;
        }

        // concat the parent matrix with the objects transform.
        wt.a  = a  * pt.a + b  * pt.c;
        wt.b  = a  * pt.b + b  * pt.d;
        wt.c  = c  * pt.a + d  * pt.c;
        wt.d  = c  * pt.b + d  * pt.d;
        wt.tx = tx * pt.a + ty * pt.c + pt.tx;
        wt.ty = tx * pt.b + ty * pt.d + pt.ty;
    }
    else
    {
        // lets do the fast version as we know there is no rotation..
        a  = this.scale.x;
        d  = this.scale.y;

        tx = this.position.x - this.pivot.x * a;
        ty = this.position.y - this.pivot.y * d;

        wt.a  = a  * pt.a;
        wt.b  = a  * pt.b;
        wt.c  = d  * pt.c;
        wt.d  = d  * pt.d;
        wt.tx = tx * pt.a + ty * pt.c + pt.tx;
        wt.ty = tx * pt.b + ty * pt.d + pt.ty;
    }

    // multiply the alphas..
    this.worldAlpha = this.alpha;

    //  Custom callback?
    if (this.transformCallback)
    {
        this.transformCallback.call(this.transformCallbackContext, wt, pt);
    }
};

