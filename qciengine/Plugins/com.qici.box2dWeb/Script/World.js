/**
 * @author wudm
 * @copyright 2016 Qcplay All Rights Reserved.
 */

/**
 * Box2D 世界对象
 */
qc.Box2D = {};

// 类型定义
qc.Box2D.BODY_TYPE = {
    STATIC : 0,
    KINEMATIC : 1,
    DYNAMIC : 2
};

// 形状定义：多边形、圆、链条
qc.Box2D.FIXTURE_TYPE = {
    POLYGON : 0,
    CIRCLE : 1,
    CHAIN : 2
};

var Box2DWorld = Phaser.Physics.BOX2D = function(game) {
    this.game = game._qc;

    // 反向记录一个到 qc game 中
    game._qc.box2d = this;

    var gravity;

    // 尝试获取配置中关于 Box2D 的配置信息
    var config = this.game.config.customSettings.Box2D || {};
    var parseConfig = function(key, defaultValue) {
        var v = config[key];
        if (v === undefined)
            return defaultValue;
        else
            return v;
    };

    // 重力值，默认是 10
    this._gravity = parseConfig('gravity', 10.0);

    // 速度迭代次数
    this.velocityIterations = parseConfig('velocityIterations', 3);

    // 位置迭代次数
    this.positionIterations = parseConfig('positionIterations', 2);

    // Pixel 像素到 Meter 米之间的转换
    // 游戏使用的是 Pixel 单位，而 Box2D 接受的是米
    this.PTM = this._rawPTM = parseConfig('PTM', 20);

    // 期望帧率
    this.useElapsedTime = parseConfig('useElapsedTime', false);

    this._rawFrameRate = parseConfig('frameRate', 30);
    if (this._rawFrameRate)
        this.frameRate = this._rawFrameRate;
    else
        this.frameRate = game.desiredFps || 60;

    // 每帧最多模拟的次数
    this.maxSimulatePerFrame = parseConfig('maxSimulatePerFrame', 3);

    // 创建一个 box2d 的世界对象
    this._gravityVec2 = new Box2D.b2Vec2(0.0, 1.0 * this.gravity);
    this.b2World = new Box2D.b2World(this._gravityVec2);

    // 游戏世界到物理世界的位置统一偏移
    this._shiftWorldX = 0;
    this._shiftWorldY = 0;

    // 事件监听器
    this.contactListener = new qc.Box2D.ContactListener(this);

    // debug 窗口
    this._debugDrawHandler = new qc.Box2D.DebugDraw(this);
    this.debugDraw = parseConfig('debugDraw', false);
    this.debugFlags = parseConfig('debugFlags',
        DebugDraw.FlagShapeBit |
        DebugDraw.FlagJointBit |
        DebugDraw.FlagAabbBit |
        DebugDraw.FlagPairBit |
        DebugDraw.FlagCenterOfMassBit);

    // 是否允许世界进入睡眠
    this.allowSleeping = parseConfig('allowSleeping', true);

    // 当前是否暂停状态
    this.paused = false;

    // 是否所有物理部件都挂载同一个父亲之下
    // flatten 为 true 的时候，不在计算各种矩阵计算，直接认为 Box2D 世界的
    // 旋转、位置就是 game 世界的旋转位置。
    this.flatten = parseConfig('flatten', false);

    // body之间遍历的时候时候需要排序
    this.bodyStrictOrder = parseConfig('strictOrder', false);

    // 创建一个 Raycast 查询对象
    this.raycastHandler = new qc.Box2D.Raycast(this);

    // 创建一个 QueryAABB 查询对象
    this.queryAABBHandler = new qc.Box2D.QueryAABB(this);

    // 创建一个图元工具类，提供分解、简化路径等工具函数
    this.geomUtil = new qc.Box2D.GeomUtil(game);

    // 关注game启动完毕
    this.game.onStart.add(this.onGameStart, this);
};
Box2DWorld.prototype = {};
Box2DWorld.prototype.constructor = Box2DWorld;

Object.defineProperties(Box2DWorld.prototype, {
    /**
     * 世界的重力值设定
     */
    gravity : {
        get : function() {
            return this._gravity;
        },
        set : function(v) {
            this._gravity = v;

            // 尝试释放内存
            this._gravityVec2 = new Box2D.b2Vec2(0.0, 1.0 * this.gravity);
            this.b2World.SetGravity(this._gravityVec2);
        }
    },

    /**
     * 每次世界 step 的时候，速度的迭代次数
     */
    velocityIterations : {
        get : function() {
            return this._velocityIterations;
        },
        set : function(v) {
            this._velocityIterations = v;
        }
    },

    /**
     * 每次世界 step 的时候，位置的迭代次数
     */
    positionIterations : {
        get : function() {
            return this._positionIterations;
        },
        set : function(v) {
            this._positionIterations = v;
        }
    },

    /**
     * 是否允许对象进入 sleep 状态
     */
    allowSleeping : {
        get : function() {
            return this._allowSleeping;
        },
        set : function(v) {
            this._allowSleeping = v;
            this.b2World.m_allowSleep = v;
        }
    },

    /**
     * 像素到米的转换比率
     */
    PTM : {
        get : function() {
            return this._ptm;
        },
        set : function(v) {
            this._ptm = v;
            this._mtp = 1 / v;
        }
    },

    /**
     * 期望物理的调度帧率
     */
    frameRate : {
        get : function() {
            return this._frameRate;
        },
        set : function(v) {
            v = v || 1;
            this._stepFrameMS = 1 / v;
            this._frameRate = v;
        }
    },

    /**
     * 使用实际delta的时间调度，还是使用固定的帧时间
     */
    useElapsedTime : {
        get : function() {
            return this._useElapsedTime;
        },
        set : function(v) {
            this._useElapsedTime = v;
        }
    },

    /**
     * 是否开启 debug 绘制
     */
    debugDraw : {
        get : function() {
            return this._debugDrawHandler.enabled;
        },
        set : function(v) {
            this._debugDrawHandler.enabled = v;
        }
    },

    /**
     * debug draw 绘制掩码
     */
    debugFlags : {
        get : function() {
            return this._debugDrawHandler.flags;
        },
        set : function(v) {
            this._debugDrawHandler.flags = v;
        }
    }
});

/**
 * preUpdate 调度
 */
Box2DWorld.prototype.preUpdate = function() {
    // 物理世界是否暂停
    if (this.paused) {
        return;
    }
    if (!this.game.time) {
        return;
    }

    var b2World = this.b2World;
    var b2Body;
    var i, len;

    var useElapsedTime = this._useElapsedTime;

    if (useElapsedTime) {
        // 使用具体流逝时间进行调度
        var lastElapseRest = this._lastElapseRest || 0;
        var elapseTime = 0.001 * this.game.time.deltaTime + lastElapseRest;
        var stepMS = this._stepFrameMS;

        this._lastElapseRest = elapseTime % stepMS;

        var simulateTimes = Math.floor(elapseTime / stepMS);
        if (simulateTimes > this.maxSimulatePerFrame) {
            // this.game.log.trace('too many box2d world simulate times({0}) in this frame, downto {1}',
            //    simulateTimes, this.maxSimulatePerFrame);
            simulateTimes = this.maxSimulatePerFrame;
        }

        // 不需要进行任何调度
        if (simulateTimes < 1) {
            return;
        }
    }
    else {
        // 按帧固定调度，次数固定是 1
        simulateTimes = 1;
    }

    var t, n = Date.now();

    // 驱动 b2Body 进行 preUpdate
    var bodies = this.getBodyList();
    for (i = 0, len = bodies.length; i <  len; i++) {
        b2Body = bodies[i];
        if (b2Body.behaviour) b2Body.behaviour.bodyPreUpdate();
    }

    t = Date.now();
    this.game.debug.a += t - n;
    n = t;


    // 驱动 box2d 世界
    for (i = 0; i < simulateTimes; i++)
        this.step();

    t = Date.now();
    this.game.debug.b += t - n;
    n = t;

    // 驱动 body 进行 postUpdate
    bodies = this.getBodyList();
    for (i = 0, len = bodies.length; i <  len; i++) {
        b2Body = bodies[i];
        if (b2Body.behaviour) b2Body.behaviour.bodyPostUpdate();
    }

    t = Date.now();
    this.game.debug.c += t - n;

    // 尝试进行 debug draw
    this._debugDrawHandler.render();
};

/**
 * update 调度
 */
Box2DWorld.prototype.update = function() {
    // update 阶段不进行操作
};

/**
 * pixel 到 meter 的换算公式
 */
Box2DWorld.prototype.pixelToMeter = function(v, type) {
    // 需要保留 5 位小数，保证不受浮点误差影响
    return ((100000 * v * this._mtp + 0.01) | 0) / 100000;
};

/**
 * 游戏的 x 到 box2d 的 x
 */
Box2DWorld.prototype.toBox2DX = function(v) {
    return this.pixelToMeter(v - this._shiftWorldX);
};

/**
 * 游戏的 y 到 box2d 的 y
 */
Box2DWorld.prototype.toBox2DY = function(v) {
    return this.pixelToMeter(v - this._shiftWorldY);
};

/**
 * meter 到 pixel 的换算公式
 */
Box2DWorld.prototype.meterToPixel = function(v, type) {
    return v * this._ptm;
};

/**
 * box2d 的 x 到游戏的 x
 */
Box2DWorld.prototype.toWorldX = function(v) {
    return this.meterToPixel(v) + this._shiftWorldX;
};

/**
 * box2d 的 y 到游戏的 y
 */
Box2DWorld.prototype.toWorldY = function(v) {
    return this.meterToPixel(v) + this._shiftWorldY;
};

Box2DWorld.prototype.setBoundsToWorld = function() {

};

Box2DWorld.prototype.clear = function() {

};

Box2DWorld.prototype.reset = function() {

};

Box2DWorld.prototype.destroy = function() {

};

/**
 * 游戏 frameRate 发生变化的时候，重置物理的 frameRate
 */
Box2DWorld.prototype.onFrameRateChanged = function() {
    if (!this._rawFrameRate)
        this.frameRate = this.game.time.frameRate;
};

/**
 * qc game Started
 */
Box2DWorld.prototype.onGameStart = function() {
    if (!this._rawFrameRate)
        this.frameRate = this.game.time.frameRate;

    // 关注 frameRate 变化
    this.game.time.onFrameRateChanged.add(this.onFrameRateChanged, this);
};

/**
 * 驱动 box2d 世界向前进行 elapseTime 毫秒
 */
Box2DWorld.prototype.step = function() {
    // 直接使用固定的帧时间进行调度
    this.b2World.Step(this._stepFrameMS,
        this._velocityIterations,
        this._positionIterations);
};

/**
 * 驱动 box2d 世界开始绘制 debug 形状
 */
Box2DWorld.prototype.drawDebugData = function() {
    this.b2World.DrawDebugData();
};

/**
 * 注册contact 事件监听
 */
Box2DWorld.prototype.setContactListener = function(handler) {
    this.b2World.SetContactListener(handler);
};

/**
 * 注册为 Debug Draw 响应
 */
Box2DWorld.prototype.setDebugDraw = function(handler) {
    this.b2World.SetDebugDraw(handler);
};

/**
 * 设置暂停
 */
Box2DWorld.prototype.pause = function() {
    this.paused = true;
};

/**
 * 设置恢复 box2d 世界的运作
 */
Box2DWorld.prototype.resume = function() {
    this.paused = false;
};

/**
 * 创建一个 body 对象
 */
Box2DWorld.prototype.createBody = function(bodyDef) {
    // 清空缓存
    this.bodyList = null;

    return this.b2World.CreateBody(bodyDef);
};

/**
 * 干掉 node 身上附着的 body 对象
 */
Box2DWorld.prototype.destroyBody = function(node) {
    // 清空缓存
    this.bodyList = null;

    var b2Body = node.b2Body;
    if (!b2Body) return;

    return this.b2World.DestroyBody(b2Body);
};

/**
 * 从游戏世界的某个节点开始，获取旗下所有 Body 对象
 */
Box2DWorld.prototype.getBodyByGameWorld = function(node, ret) {
    var b2Body = node.b2Body;
    if (b2Body) ret.push(b2Body);

    // 递归遍历，子节点依次入队列
    var children = node.children;
    for (var i = 0, len = children.length; i < len; i++) {
        this.getBodyByGameWorld(children[i], ret);
    }
};

/**
 * 获取当前世界所有的 Body 对象
 */
Box2DWorld.prototype.getBodyList = function() {
    var ret;

    // 有明确的顺序依赖，需要根据树进行查找
    if (this.bodyStrictOrder) {
        ret = [];
        this.getBodyByGameWorld(this.game.world, ret);
        return ret;
    }

    // 有缓存，且没有变脏（现在只有 create destroy 会置脏）
    if (this.bodyList) {
        return this.bodyList;
    }

    var world = this.b2World;
    var count = world.GetBodyCount();
    if (!count) return count;

    ret = new Array(count);
    var i = 0;
    var body;

    for (body = world.GetBodyList(); body; body = body.GetNext()) {
        ret[i++] = body;
    }

    this.bodyList = ret;
    return ret;
};

/**
 * 获取一条射线上的目标
 */
Box2DWorld.prototype.raycast = function(x1, y1, x2, y2, closest, filter) {
    if (Math.abs(x1 - x2) + Math.abs(y1 - y2) < 0.01) return [];
    return this.raycastHandler.check(x1, y1, x2, y2, closest, filter);
};

/**
 * 查询区域内的所有目标
 */
Box2DWorld.prototype.queryAABB = function(x, y, width, height, findAll, filter) {
    return this.queryAABBHandler.check(x, y, width, height, findAll, filter);
};

/**
 * 查询一个点选中的所有 Fixtures
 */
Box2DWorld.prototype.queryFixtureAtPoint = function(x, y, findAll, filter) {
    var sensitivity = 0.1;
    var point = new Box2D.b2Vec2(this.toBox2DX(x), this.toBox2DY(y));

    var queryFilter = function(gameObject, fixture) {
        // 由于queryAABB 得到的是 AABB overlap，对于点还需要精确知道点是否在内部
        if (!fixture.TestPoint(point)) {
            return false;
        }

        // 回调判定失败
        if (filter) {
            if (!filter.call(this, gameObject, fixture))
                return false;
        }

        // 判定成功
        return true;
    };

    var result = this.queryAABBHandler.check(
        x - sensitivity, y - sensitivity,
        sensitivity * 2, sensitivity * 2,
        findAll,
        queryFilter);

    return result;
};

/**
 * 将 qc.Point 转为 Box2D 格式的 vector
 */
Box2DWorld.prototype._parseVector2 = function(p) {
    if (!p) return new Box2D.b2Vec2(0, 0);
    return new Box2D.b2Vec2(p.x || 0, p.y || 0);
};

/**
 * 初始化默认的 joint 长度
 */
Box2DWorld.prototype._initJoinLength = function(length, bodyA, bodyB, anchorA, anchorB) {
    if (typeof length === 'number')
        return this.pixelToMeter(length);

    var vec1 = bodyA.GetWorldPoint(anchorA);
    var x1 = vec1.x;
    var y1 = vec1.y;

    var vec2 = bodyB.GetWorldPoint(anchorB);
    var x2 = vec2.x;
    var y2 = vec2.y;

    var disX = x2 - x1;
    var disY = y2 - y1;

    return Math.sqrt(disX * disX + disY * disY);
};

/**
 * 创建个 distance joint（距离关节）
 */
Box2DWorld.prototype.createDistanceJoint = function(obA, obB, anchorA, anchorB, length, dampingRatio, frequency) {
    if (!obA.b2Body || !obB.b2Body) return null;

    // parse 数据
    anchorA = this._parseVector2(anchorA);
    anchorB = this._parseVector2(anchorB);

    if (typeof dampingRatio !== 'number') dampingRatio = 0;
    if (typeof frequency !== 'number') frequency = 0;

    length = this._initJoinLength(length, obA.b2Body, obB.b2Body, anchorA, anchorB);

    var jointDef = new Box2D.b2DistanceJointDef(obA.b2Body, obB.b2Body);
    jointDef.localAnchorA = anchorA;
    jointDef.localAnchorB = anchorB;
    jointDef.dampingRatio = dampingRatio;
    jointDef.frequencyHz = frequency;
    jointDef.length = length;

    return this.b2World.CreateJoint(jointDef);
};

/**
 * 创建个 Revolute joint（旋转关节）
 */
Box2DWorld.prototype.createRevoluteJoint = function(obA, obB, anchorA, anchorB, enableLimit, lowerAngle, upperAngle, enableMotor, maxMotorTorque, motorSpeed) {
    if (!obA.b2Body || !obB.b2Body) return null;

    // parse 数据
    anchorA = this._parseVector2(anchorA);
    anchorB = this._parseVector2(anchorB);

    if (typeof enableLimit !== 'boolean') enableLimit = false;
    if (typeof enableMotor !== 'boolean') enableMotor = false;

    var jointDef = new Box2D.b2RevoluteJointDef(obA.b2Body, obB.b2Body);
    jointDef.localAnchorA = anchorA;
    jointDef.localAnchorB = anchorB;
    jointDef.enableLimit = enableLimit;
    jointDef.enableMotor = enableMotor;
    jointDef.lowerAngle = lowerAngle || 0;
    jointDef.upperAngle = upperAngle || 0;
    jointDef.maxMotorTorque = maxMotorTorque || 0;
    jointDef.motorSpeed = motorSpeed || 0;

    return this.b2World.CreateJoint(jointDef);
};

/**
 * 创建一个Prismatic Joint（移动关节）
 */
Box2DWorld.prototype.createPrismaticJoint = function(obA, obB, anchorA, anchorB, enableLimit, localAxisA, lowerLimit, upperLimit, refAngle, enableMotor, motorSpeed, maxMotorTorque) {
    if (!obA.b2Body || !obB.b2Body) return null;

    // parse 数据
    anchorA = this._parseVector2(anchorA);
    anchorB = this._parseVector2(anchorB);
    localAxisA = this._parseVector2(localAxisA);

    var jointDef = new Box2D.b2PrismaticJointDef(obA.b2Body, obB.b2Body);
    jointDef.localAnchorA = anchorA;
    jointDef.localAnchorB = anchorB;
    jointDef.enableLimit = enableLimit;
    jointDef.enableMotor = enableMotor;
    jointDef.localAxisA = localAxisA;
    jointDef.lowerTranslation = lowerLimit || 0;
    jointDef.maxMotorForce = maxMotorForce || 0;
    jointDef.motorSpeed = motorSpeed || 0;
    jointDef.referenceAngle = refAngle || 0;
    jointDef.upperTranslation = upperLimit || 0;

    return this.b2World.CreateJoint(jointDef);
};

/**
 * 创建一个 Friction joint（摩擦关节）
 */
Box2DWorld.prototype.createFrictionJoint = function(obA, obB, anchorA, anchorB, maxForce, maxTorque) {
    if (!obA.b2Body || !obB.b2Body) return null;

    // parse 数据
    anchorA = this._parseVector2(anchorA);
    anchorB = this._parseVector2(anchorB);

    var jointDef = new Box2D.b2FrictionJointDef(obA.b2Body, obB.b2Body);

    jointDef.localAnchorA = anchorA;
    jointDef.localAnchorB = anchorB;

    jointDef.maxForce = maxForce || 0;
    jointDef.maxTorque = maxTorque || 0;

    return this.b2World.CreateJoint(jointDef);
};

/**
 * 创建一个 Weld joint（焊接关节）
 */
Box2DWorld.prototype.createWeldJoint = function(obA, obB, anchorA, anchorB, refAngle) {
    if (!obA.b2Body || !obB.b2Body) return null;

    // parse 数据
    anchorA = this._parseVector2(anchorA);
    anchorB = this._parseVector2(anchorB);

    var jointDef = new Box2D.b2WeldJointDef(obA.b2Body, obB.b2Body);
    jointDef.localAnchorA = anchorA;
    jointDef.localAnchorB = anchorB;
    jointDef.referenceAngle = refAngle || 0;

    return this.b2World.CreateJoint(jointDef);
};

// 设置这个节点成为 root 节点
Box2DWorld.prototype.setRootNode = function(node) {
    if (this._rootNode === node) return;

    // 不同，需要设置
    // 如果之前已经存在一个节点，先移除关注
    if (this._rootNode) {
        this._rootNode.onTransformChanged.remove(this._onRootTransformChanged, this);
    }

    // 设置，并关注
    if (!node) return;

    this._rootNode = node;
    node.onTransformChanged.add(this._onRootTransformChanged, this);
    this._onRootTransformChanged();
};

// 取消某个节点，不再作为 root 节点
Box2DWorld.prototype.removeRootNode = function(node) {
    if (this._rootNode && this._rootNode !== node) {
        this.game.log.error('root node is not match');
        return;
    }
    setRootNode(null);
};

// 收到 root transform 变化的消息
Box2DWorld.prototype._onRootTransformChanged = function() {
    var node = this._rootNode;
    var worldScale = node.getWorldScale();
    var worldPosition = node.getWorldPosition();

    if (worldScale.x !== worldScale.y) {
        this.game.log.important('the scaleX and scaleY not same in physics root node, use scaleX');
    }

    this.PTM = this._rawPTM * worldScale.x;
    this._shiftWorldX = worldPosition.x;
    this._shiftWorldY = worldPosition.y;
};

/**
 * 调试输出当前的世界信息
 */
Box2DWorld.prototype.debugInfo = function() {
    var b2World = this.b2World;
    var bodies = this.getBodyList();
    var output = [];

    // 先输出世界信息
    output.push('Box2D world Info:');
    output.push('    gravity : ' + this.gravity);
    output.push('    allowSleeping : ' + b2World.m_allowSleep);
    output.push('    bodyCount : ' + b2World.GetBodyCount());
    output.push('    contactCount : ' + b2World.GetContactCount());
    output.push('    jointCount : ' + b2World.GetJointCount());

    var gameWorld = this.game.world;
    var getFullName = function(node) {
        var name = node.name;
        var pNode;

        while ((pNode = node.parent) && pNode !== gameWorld) {
            node = pNode;
            name = node.name + '/' + name;
        }
        return name;
    };

    for (var i = 0, len = bodies.length; i < len; i++) {
        var b2Body = bodies[i];
        var body = b2Body.behaviour;
        if (!body) continue;
        output.push('  Body ' + (i + 1));
        output.push('    name : ' + getFullName(b2Body.gameObject));

        var typeDesc;
        switch (body.type) {
        case qc.Box2D.BODY_TYPE.DYNAMIC : typeDesc = 'dynamic'; break;
        case qc.Box2D.BODY_TYPE.KINEMATIC : typeDesc = 'kinematic'; break;
        default : typeDesc = 'static';
        }
        output.push('    type : ' + typeDesc);

        output.push('    awake : ' + body.isAwake);
        output.push('    bullet : ' + body.bullet);
        output.push('    fixedRotation : ' + body.fixedRotation);
        output.push('    gravityScale : ' + body.gravityScale);
        output.push('    linearVelocity : (' + body.linearVelocity.x + ',' + body.linearVelocity.y + ')');
        output.push('    linearDamping : ' + body.linearDamping);
        output.push('    angularVelocity : ' + body.angularVelocity);
        output.push('    angularDamping : ' + body.angularDamping);

        var fixtureTypeDesc;
        switch (body.fixtureType) {
        case qc.Box2D.FIXTURE_TYPE.CIRCLE : fixtureTypeDesc = 'circle'; break;
        case qc.Box2D.FIXTURE_TYPE.CHAIN  : fixtureTypeDesc = 'chain'; break;
        default : fixtureTypeDesc = 'polygon';
        }
        output.push('   *fixture Type : ' + fixtureTypeDesc);
        output.push('    density : ' + body.density);
        output.push('    friction : ' + body.friction);
        output.push('    restitution : ' + body.restitution);
        output.push('    sensor : ' + body.sensor);
    }

    console.log(output.join('\n'));
    /*
    var logM = this.game.log;
    output.forEach(function(msg) {
        logM.trace(msg);
    });*/
};
