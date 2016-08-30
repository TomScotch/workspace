/**
 * @author wudm
 * @copyright 2016 Qcplay All Rights Reserved.
 */

/**
 * Box2D debug 绘制对象，用于绘制 Box2D 世界的物体的形状
 */
var DebugDraw = qc.Box2D.DebugDraw = function(world) {

    var self = this;
    self.b2Draw = new Box2D.JSDraw();
    self.world = world;

    self.enabled = false;

    // 默认所有都绘制
    self.flags =
        DebugDraw.FlagShapeBit |
        DebugDraw.FlagJointBit |
        DebugDraw.FlagAabbBit |
        DebugDraw.FlagPairBit |
        DebugDraw.FlagCenterOfMassBit;

    // 实现具体绑定逻辑
    self.implementDraw();

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

    var context = self._context;
    var canvas = self._canvas;

    // 清空之前的 debug draw 信息
    context.clearRect(0, 0, canvas.width, canvas.height);

    // 开始绘制工作
    context.save();

    context.translate(self.world._shiftWorldX * self.world.game.resolution,
                      self.world._shiftWorldY * self.world.game.resolution);

    var PTM = this.world.PTM;
    var ratio = PTM * self.world.game.resolution;
    context.scale(ratio, ratio);
    context.lineWidth /= ratio;
    context.fillStyle  = 'rgb(255, 255, 0)';

    // 驱动绘制
    self.world.drawDebugData();

    // 结束绘制工作
    context.restore();
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

/**
 * 设置 debug 画笔的颜色
 */
DebugDraw.prototype.setColorFromDebugDrawCallback = function(colorPtr) {
    var color = Box2D.wrapPointer(colorPtr, Box2D.b2Color);
    var red = (color.get_r() * 255) | 0;
    var green = (color.get_g() * 255) | 0;
    var blue = (color.get_b() * 255) | 0;

    var colorStr = red + "," + green + "," + blue;

    // 设置画布的绘制颜色
    var context = this._context;
    context.fillStyle = "rgba(" + colorStr + ",0.5)";
    context.strokeStyle = "rgb(" + colorStr + ")";
};

/**
 * 绘制线条
 */
DebugDraw.prototype.drawSegment = function(vect1Ptr, vect2Ptr) {
    var vert1 = Box2D.wrapPointer(vect1Ptr, Box2D.b2Vec2);
    var vert2 = Box2D.wrapPointer(vect2Ptr, Box2D.b2Vec2);

    var context = this._context;
    context.beginPath();
    context.moveTo(vert1.get_x(), vert1.get_y());
    context.lineTo(vert2.get_x(), vert2.get_y());
    context.stroke();
};

/**
 * 绘制多边形
 */
DebugDraw.prototype.drawPolygon = function(verticesPtr, vertexCount, fill) {
    var context = this._context;
    var i, vert;

    context.beginPath();
    for (i = 0; i < vertexCount; i++) {
        vert = Box2D.wrapPointer(verticesPtr + (i * 8), Box2D.b2Vec2);
        if (i === 0)
            context.moveTo(vert.get_x(), vert.get_y());
        else
            context.lineTo(vert.get_x(), vert.get_y());
    }
    context.closePath();

    if (fill)
        context.fill();

    // 结束绘制
    context.stroke();
};

/**
 * 绘制圆形
 */
DebugDraw.prototype.drawCircle = function(center, radius, axis, fill) {
    var centerV = Box2D.wrapPointer(center, Box2D.b2Vec2);
    var centerX = centerV.get_x();
    var centerY = centerV.get_y();
    var axisV = Box2D.wrapPointer(axis, Box2D.b2Vec2);

    var context = this._context;
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);

    if (fill)
        context.fill();
    context.stroke();

    if (fill) {
        //render axis marker
        var vert2V = Box2D.Vec2Proxy(centerX, centerY);
        axisV.set_x(axisV.get_x() * radius);
        axisV.set_y(axisV.get_y() * radius);
        vert2V.op_add(axisV);
        context.beginPath();
        context.moveTo(centerX, centerY);
        context.lineTo(vert2V.get_x(), vert2V.get_y());
        context.stroke();
    }
};

/**
 * 绘制 transform
 */
DebugDraw.prototype.drawTransform = function(transform) {
    var trans = Box2D.wrapPointer(transform, Box2D.b2Transform);
    var pos = trans.get_p();
    var rot = trans.get_q();
    var context = this._context;

    // 绘制两条垂直的线在锚点上
    context.save();
    context.translate(pos.get_x(), pos.get_y());
    context.scale(0.5, 0.5);
    context.rotate(rot.GetAngle());
    context.lineWidth *= 3;
    context.strokeStyle = 'rgb(192,0,0)';
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(2, 0);
    context.stroke();
    context.strokeStyle = 'rgb(0,192,0)';
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(0, 2);
    context.stroke();
    context.restore();
};

/**
 * 实现具体的绘制逻辑
 */
DebugDraw.prototype.implementDraw = function() {
    var self = this;
    var b2Draw = self.b2Draw;

    // 绘制线
    b2Draw.DrawSegment = function(vect1Ptr, vect2Ptr, colorPtr) {
        self.setColorFromDebugDrawCallback(colorPtr);
        self.drawSegment(vect1Ptr, vect2Ptr);
    };

    // 绘制多边形
    b2Draw.DrawPolygon = function(verticesPtr, vertexCount, colorPtr) {
        self.setColorFromDebugDrawCallback(colorPtr);
        self.drawPolygon(verticesPtr, vertexCount, false);
    };
    b2Draw.DrawSolidPolygon = function(verticesPtr, vertexCount, colorPtr) {
        self.setColorFromDebugDrawCallback(colorPtr);
        self.drawPolygon(verticesPtr, vertexCount, true);
    };

    // 绘制圆
    b2Draw.DrawCircle = function(center, radius, colorPtr) {
        self.setColorFromDebugDrawCallback(colorPtr);
        var dummyAxis = Box2D.Vec2Proxy(0,0);
        self.drawCircle(center, radius, dummyAxis, false);
    };
    b2Draw.DrawSolidCircle = function(center, radius, axis, colorPtr) {
        self.setColorFromDebugDrawCallback(colorPtr);
        self.drawCircle(center, radius, axis, true);
    };

    b2Draw.DrawTransform = function(transform) {
        self.drawTransform(transform);
    };
};
