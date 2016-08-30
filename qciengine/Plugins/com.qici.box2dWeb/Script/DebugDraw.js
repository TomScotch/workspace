/**
 * @author wudm
 * @copyright 2016 Qcplay All Rights Reserved.
 */

/**
 * Box2D debug 绘制对象，用于绘制 Box2D 世界的物体的形状
 */
var DebugDraw = qc.Box2D.DebugDraw = function(world) {

    var self = this;
    self.b2Draw = new Box2D.b2DebugDraw();
    self.world = world;

    self.enabled = false;

    // 默认所有都绘制
    self.flags =
        DebugDraw.FlagShapeBit |
        DebugDraw.FlagJointBit |
        DebugDraw.FlagAabbBit |
        DebugDraw.FlagPairBit |
        DebugDraw.FlagCenterOfMassBit;

    // 注册作为 Box2D 世界的接听
    world.setDebugDraw(self.b2Draw);
};
DebugDraw.prototype = {};
DebugDraw.prototype.constructor = DebugDraw;

DebugDraw.FlagShapeBit = 0x0001;
DebugDraw.FlagJointBit = 0x0002;
DebugDraw.FlagAabbBit = 0x0004;
DebugDraw.FlagPairBit = 0x0008;
DebugDraw.FlagCenterOfMassBit = 0x0010;

Object.defineProperties(DebugDraw.prototype, {
    /**
     * 是否开启
     */
    enabled : {
        get : function() {
            return this._enabled;
        },
        set : function(v) {
            if (this._enabled === v) return;

            this._enabled = v;
            if (!v) {
                this._releaseCanvas();
            }
        }
    },

    /**
     * 绘制类型掩码
     */
    flags : {
        get : function() {
            return this.b2Draw.GetFlags();
        },
        set : function(v) {
            this.b2Draw.SetFlags(v);
        }
    }
});

/**
 * 绘制 debug 信息
 */
DebugDraw.prototype.render = function() {
    var self = this;
    if (!self._enabled) return;

    if (!self._initCanvas()) return;

    self._context.save();
    self._context.clearRect(0, 0, self._canvas.width, self._canvas.height);
    self._context.translate(self.world._shiftWorldX * self.world.game.resolution, self.world._shiftWorldY * self.world.game.resolution);

    self.b2Draw.SetSprite(self._context);
    self._context.fillStyle = 'rgb(255, 255, 0)';

    var PTM = this.world.PTM;
    var ratio = PTM * self.world.game.resolution;

    self.b2Draw.SetDrawScale(ratio);
    self.b2Draw.SetFillAlpha(0.5);
	self.b2Draw.SetLineThickness(1.0);

    // 驱动绘制
    self.world.drawDebugData();

    self._context.restore();
};

/**
 * 创建 debug 用的 canvas
 */
DebugDraw.prototype._initCanvas = function() {
    var self = this;

    // 找到游戏 canvas 对象
    var gameCanvas = self.world.game.canvas;
    if (!gameCanvas)
        return false;

    var canvas = self._canvas;
    if (!canvas) {
        // 尝试创建 canvas
        canvas = self._canvas = document.createElement('canvas');
        self._context = self._canvas.getContext('2d');
        gameCanvas.parentNode.insertBefore(self._canvas, gameCanvas);
        canvas.style.left = canvas.style.top = '0px';
        canvas.style.position = 'absolute';
    }

    // 调整为游戏画布大小
    if (canvas.style.width !== gameCanvas.style.width ||
        canvas.style.height !== gameCanvas.style.height ||
        canvas.width !== gameCanvas.width ||
        canvas.height !== gameCanvas.height) {
        canvas.width = gameCanvas.width;
        canvas.height = gameCanvas.height;
        canvas.style.width = gameCanvas.style.width;
        canvas.style.height = gameCanvas.style.height;
    }

    // 调整 margin
    [ 'marginLeft', 'marginLRight', 'marginTop', 'marginBottom' ].forEach(function(key) {
        if (canvas.style[key] !== gameCanvas.style[key])
            canvas.style[key] = gameCanvas.style[key];
    });
    return true;
};

/**
 * 释放掉 Canvas 资源
 */
DebugDraw.prototype._releaseCanvas = function() {
    var self = this;
    var canvas = self._canvas;

    if (!canvas)
        return;

    self._context = null;
    self._canvas = null;
    if (canvas.parentElement) {
        canvas.parentElement.removeChild(canvas);
    }
};
