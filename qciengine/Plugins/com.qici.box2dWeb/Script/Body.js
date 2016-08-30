/**
 * @author wudm
 * @copyright 2016 Qcplay All Rights Reserved.
 */

/**
 * Box2D body 对象
 */
var Body = qc.defineBehaviour('qc.Box2D.Body', qc.Behaviour, function() {
    // 记录自身对象
    this.gameObject.body = this;

    // 记录世界对象
    this.gameObject.world = this.game.phaser.physics.box2d;

    var body = this.gameObject._body;
    if (!body) body = this.gameObject._body = {};

    // 初始化 fixture 列表为默认
    body.fixture = [ {
        type : qc.Box2D.FIXTURE_TYPE.POLYGON,
        density : 1.0,
        friction : 0.1,
        restitution : 0.2,
        sensor : false,
    } ];

    // 初始化必要的属性
    body.type = qc.Box2D.BODY_TYPE.STATIC;

    // 是否进入 awake 状态
    body.isAwake = true;

    // 子弹模式（避免 tunneling）
    body.bullet = false;

    // 转向固定
    body.fixedRotation = false;

    // 角速度
    body.angularVelocity = 0;

    // 角阻抗
    body.angularDamping = 0;

    // 速度
    body.linearVelocity = new qc.Point(0, 0);

    // 线性阻抗
    body.linearDamping = 0;

    // 重力倍数
    body.gravityScale = 1;

    // 碰撞事件
    this.onContact = new qc.Signal();

    // Presolve 事件
    this.onPreSolve = new qc.Signal();

    // Postsolve 事件
    this.onPostSolve = new qc.Signal();

    // 初始化事件
    this.onBodyCreated = new qc.Signal();

    // 形状变化事件
    this.onFixtureChanged = new qc.Signal();
}, {
    // 需要序列化的属性情况
    type : qc.Serializer.INT,
    isAwake : qc.Serializer.BOOLEAN,
    bullet : qc.Serializer.BOOLEAN,
    angularVelocity : qc.Serializer.NUMBER,
    angularDamping : qc.Serializer.NUMBER,
    fixedRotation : qc.Serializer.BOOLEAN,
    linearDamping : qc.Serializer.BOOLEAN,
    linearVelocity : qc.Serializer.POINT,
    gravityScale : qc.Serializer.NUMBER,
    shapeData : {
        get : function(ob, context) {
            return this.serializeShape(ob);
        },
        set : function(context, v) {
            this.restoreShape(context, v);
        }
    },
    fixture : {
        get : function(ob, context) {
            // 将 fixture 信息序列化下来成数组
            var body = ob.gameObject._body;
            var len = body.fixture.length;
            var v = new Array(len);
            for (var i = 0; i < len; i++) {
                var fixture = body.fixture[i];
                v[i] = {
                    type : fixture.type,
                    density : fixture.density,
                    friction : fixture.friction,
                    restitution : fixture.restitution,
                    sensor : fixture.sensor,
                };
            }
            return v;
        },
        set : function(context, v) {
            // 将反序列化出来的数组，在内存中还原出 fixtures
            var body = context.gameObject._body;
            var len = v.length;
            var fixtures = body.fixture = new Array(len);
            for (var i = 0; i < len; i++) {
                var fixture = v[i];
                fixtures[i] = {
                    type : fixture.type,
                    density : fixture.density,
                    friction : fixture.friction,
                    restitution : fixture.restitution,
                    sensor : fixture.sensor,
                };
            }
        }
    }
});

// 菜单归类
Body.__menu = 'Plugins/Box2DWeb/Body';

// Called when the script instance is being loaded.
Body.prototype.awake = function() {

};

// Called every frame, if the behaviour is enabled.
Body.prototype.update = function() {
    if (!this.enable) return;

    // 只有可见物体才有 update 方法，确保可见物体存在 body
    if (!this.gameObject.b2Body)
        this.createBody();
};

/**
 * 对象激活的时候处理设置 box2d 世界 body
 */
Body.prototype.onEnable = function() {
    // 延迟到 update 中处理，enable 中经常没有挂好 parent，后续 scale 等
    // 信息会变化，会触发 reset fixture，所以新创建的目标会二次 create fixture
    // this.createBody();
};

/**
 * 对象取消激活的处理
 */
Body.prototype.onDisable = function() {
    this.removeBody();
};

/**
 * 对象析构第一时间干掉body
 */
Body.prototype.onDestroy = function() {
    this.removeBody();
};

/**
 * 序列化 shape 数据
 */
Body.prototype.serializeShape = function(ob) {
    var body = ob.gameObject._body;
    var ret = {};
    var i, len, j, lenJ, list;
    var rawVertices = body._rawVertices;
    if (rawVertices) {
        len = rawVertices.length;
        ret.raw = list = new Array(len * 2);
        for (i = 0; i < len; i++) {
            list[i * 2] = rawVertices[i].x;
            list[i * 2 + 1] = rawVertices[i].y;
        }
    }

    var decompedShape = body._decompedShape;
    if (decompedShape) {
        len = decompedShape.length;
        ret.decomp = new Array(len);
        for (i = 0; i < len; i++) {
            var oneShape = decompedShape[i];
            lenJ = oneShape.length;
            list = ret.decomp[i] = new Array(lenJ * 2);
            for (j = 0; j < lenJ; j++) {
                list[j * 2] = oneShape[j].x;
                list[j * 2 + 1] = oneShape[j].y;
            }
        }
    }
    return ret;
};

/**
 * 还原 shape 数据
 */
Body.prototype.restoreShape = function(ob, v) {
    if (!v) return;

    var i, len, j, lenJ, list;
    var body = ob.gameObject._body;

    var rawData = v.raw;
    if (rawData) {
        len = rawData.length / 2;
        body._rawVertices = list = new Array(len);
        for (i = 0; i < len; i++)
            list[i] = new qc.Point(rawData[i * 2], rawData[i * 2 + 1]);
    }

    var decompData = v.decomp;
    if (decompData) {
        len = decompData.length;
        body._decompedShape = new Array(len);
        for (i = 0; i < len; i++) {
            var oneShape = decompData[i];
            lenJ = oneShape.length / 2;
            body._decompedShape[i] = list = new Array(lenJ);
            for (j = 0; j < lenJ; j++)
                list[j] = new qc.Point(oneShape[j * 2], oneShape[j * 2 + 1]);
        }
    }
};

/**
 * 添加自己到物理世界中
 */
Body.prototype.createBody = function() {
    var b2BodyDef = new Box2D.b2BodyDef();

    // 属性逐一设置
    var self = this;
    var gameObject = self.gameObject;
    var body = gameObject._body;
    switch (body.type) {
    case qc.Box2D.BODY_TYPE.DYNAMIC : b2BodyDef.type = Box2D.b2Body.b2_dynamicBody; break;
    case qc.Box2D.BODY_TYPE.KINEMATIC : b2BodyDef.type = Box2D.b2Body.b2_kinematicBody; break;
    default : b2BodyDef.type = Box2D.b2Body.b2_staticBody; break;
    }
    b2BodyDef.awake = body.isAwake;
    b2BodyDef.bullet = body.bullet;
    b2BodyDef.angularVelocity = body.angularVelocity;
    b2BodyDef.angularDamping = body.angularDamping;
    b2BodyDef.fixedRotation = body.fixedRotation;
    b2BodyDef.linearDamping = body.linearDamping;

    b2BodyDef.linearVelocity = new Box2D.b2Vec2(body.linearVelocity.x, body.linearVelocity.y);
    b2BodyDef.gravityScale = body.gravityScale;

    // 设置世界物体的属性给目标对象
    var x, y, rotation;
    if (self.game.box2d.flatten) {
        x = gameObject.x;
        y = gameObject.y;
        rotation = gameObject.rotation;
    }
    else {
        var pos = gameObject.getWorldPosition();
        x = pos.x;
        y = pos.y;
        rotation = gameObject.getWorldRotation();
    }

    // 设置初始位置
    b2BodyDef.position = new Box2D.b2Vec2(
        self.game.box2d.toBox2DX(x),
        self.game.box2d.toBox2DY(y)
    );

    // 设置初始角度
    b2BodyDef.angle = rotation;

    // 记录缓存
    body.lastTransform = {
        rotation : rotation,
        x : x,
        y : y
    };

    // 创建出来并记录
    var b2Body = self.game.box2d.createBody(b2BodyDef);
    gameObject.b2Body = b2Body;
    b2Body.behaviour = self;
    b2Body.gameObject = gameObject;

    // 设置默认的 fixture
    self.resetFixtureShape();

    // 给出创建完毕 Body 的事件
    self.onBodyCreated.dispatch(gameObject);
};

/**
 * 删除自己
 */
Body.prototype.removeBody = function() {
    // 取消物理世界中的 body 对象
    this.gameObject.world.destroyBody(this.gameObject);
    this.gameObject.b2Body = null;
};

/**
 * 根据 body.fixture 数据，加载到 box2d 中
 */
Body.prototype.loadFixtures = function() {
    var ob = this.gameObject;
    var b2Body = ob.b2Body;
    if (!b2Body) return;

    var fixtures = ob._body.fixture;
    if (!fixtures || !fixtures.length) return;

    var len = ob._body.fixtureCount;
    for (var i = 0; i < len; i++) {
        this._loadFixture(ob.world, b2Body, fixtures[i]);
    }

    this.onFixtureChanged.dispatch(ob);
};

/**
 * 根据 Bounds 设置 Body 形状
 */
Body.prototype.resetShapeFromBounds = function() {
    var node = this.gameObject;
    var path = qc.Bounds.getCorners(node, 0, false, 0, node);

    var nodeWidth = node.width;
    var nodeHeight = node.height;
    var pivotX = node.pivotX;
    var pivotY = node.pivotY;

    for (var i = 0, len = path.length; i < len; i++) {
        path[i].x = path[i].x / nodeWidth + pivotX;
        path[i].y = path[i].y / nodeHeight + pivotY;
    }
    node.body.setPolygonVertices(path, true);
};

/**
 * 根据像素外围设置 Body 形状
 */
Body.prototype.resetShapeFromEdge = function(epsilon) {
    var geomUtil = this.game.box2d.geomUtil;
    var node =  this.gameObject;

    // 获取像素外围
    var path = geomUtil.marchingSquares(node);
    var path = geomUtil.RDPsd(path, epsilon || 3);

    var nodeWidth = node.width;
    var nodeHeight = node.height;
    for (var i = 0, len = path.length; i < len; i++) {
        path[i].x /= nodeWidth;
        path[i].y /= nodeHeight;
    }

    // 设置形状
    node.body.setPolygonVertices(path, true);
};

/**
 * 人为设置各个点
 */
Body.prototype.setPolygonVertices = function(rawVertices, isNormalize) {
    var verticesCount = rawVertices.length;
    if (!verticesCount) return false;

    var customPolygons = [];
    var vertices, shape;
    var i, p;
    var worldScale;

    if (!isNormalize) {
        worldScale = this.gameObject.getWorldScale();
        worldScale.x *= this.gameObject.width;
        worldScale.y *= this.gameObject.height;
    }

    // 整理成 qc.Point 形态，并且归一化
    p = rawVertices[0];
    if (typeof p.x === 'number' && typeof p.y === 'number') {
        shape = rawVertices;
    }
    else if (typeof p[0] == 'number' && typeof p[1] === 'number') {
        len = rawVertices.length;
        shape = new Array(len);
        for (i = 0; i < len; i++) {
            shape[i] = {
                x : rawVertices[i][0],
                y : rawVertices[i][1]
            };
        }
    }
    else {
        len = rawVertices.length;
        shape = new Array(len / 2);
        for (i = 0; i < len / 2; i++) {
            shape[i] = {
                x : rawVertices[i * 2],
                y : rawVertices[i * 2 + 1]
            };
        }
    }

    // 非归一化后的坐标，传入的是世界的坐标，转换之
    if (!isNormalize) {
        for (i = 0, len = shape.length; i < len; i++) {
            shape[i].x /= worldScale.x;
            shape[i].y /= worldScale.y;
        }
    }

    // 整理完点，保存起来
    this.gameObject._body._rawVertices = rawVertices = shape;

    // 尝试分割
    var geomUtil = this.gameObject.world.geomUtil;
    if (!geomUtil.isSimple(rawVertices) ||
        rawVertices.length < 3)
        // 并非一个简单的多边形（自相交）
        return false;

    // 开始分割
    var decompData = geomUtil.decomp(rawVertices);
    if (!decompData.length)
        // 无法分隔
        return false;

    this.gameObject._body._decompedShape = decompData;

    if (!this.game.device.editor)
        this.resetFixtureShape();
    return true;
};

/**
 * 初始化默认的 Fixture Shape
 */
Body.prototype.resetFixtureShape = function() {
    // 先清空之前所有的 fixture
    this.clearFixtures();

    var node = this.gameObject;
    var b2Body = node.b2Body;

    var worldScale = node.getWorldScale();
    var fixture;
    var corners, i, len, k;
    var polygonCount, polygonList = node._body._decompedShape;
    var shape;
    var fixture0 = node._body.fixture[0];
    var pivotShiftX = 0;
    var pivotShiftY = 0;
    var scaleX, scaleY;

    if (fixture0.type === qc.Box2D.FIXTURE_TYPE.CIRCLE || !polygonList) {
        // 默认方法，使用 corner 来做
        polygonList = [ qc.Bounds.getCorners(node, 0, false, 0, node) ];
        scaleX = worldScale.x;
        scaleY = worldScale.y;
    }
    else {
        pivotShiftX = node.pivotX;
        pivotShiftY = node.pivotY;
        scaleX = worldScale.x * node.width;
        scaleY = worldScale.y * node.height;
    }

    polygonCount = polygonList.length;
    for (k = 0; k < polygonCount; k++) {
        fixture = node._body.fixture[k];
        if (!fixture)
            node._body.fixture[k] = fixture = {
                type : fixture0.type,
                density : fixture0.density,
                friction : fixture0.friction,
                restitution : fixture0.restitution,
                sensor : fixture0.sensor
            };

        shape = polygonList[k];
        corners = new Array(shape.length);
        for (i = 0, len = shape.length; i < len; i++) {
            corners[i] = new qc.Point(
                (shape[i].x - pivotShiftX) * scaleX,
                (shape[i].y - pivotShiftY) * scaleY);
        }

        if (fixture.type === qc.Box2D.FIXTURE_TYPE.POLYGON) {
            fixture.vertices = corners;
        }
        else if (fixture.type === qc.Box2D.FIXTURE_TYPE.CIRCLE) {
            p1 = corners[0];
            p2 = corners[2];

            fixture.center = new qc.Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
            fixture.radius = Math.max(Math.abs(p1.x - p2.x) / 2, Math.abs(p1.y - p2.y) / 2);
        }
    }
    node._body.fixtureCount = polygonCount;

    // 加载新的 fixture 进来
    this.loadFixtures();

    // 记录系数
    node._body.pivotX = node.pivotX;
    node._body.pivotY = node.pivotY;
    node._body.width = node.width;
    node._body.height = node.height;

    if (!node.parent ||
        node.parent === node.game.world ||
        node.game.box2d.flatten) {
        node._body.scaleSqrX = node.scaleX * node.scaleX;
        node._body.scaleSqrY = node.scaleY * node.scaleY;
    }
    else {
        var wt = node.worldTransform;
        node._body.scaleSqrX = (wt.a * wt.a + wt.b * wt.b);
        node._body.scaleSqrY = (wt.c * wt.c + wt.d * wt.d);
    }
};

/**
 * pre update 阶段尝试更新
 */
Body.prototype.bodyPreUpdate = function() {
    var ob = this.gameObject;
    if (!ob.worldVisible) {
        if (this.gameObject.b2Body) {
            this.removeBody();
            return;
        }
    }

    var body = ob._body;
    var bwt = body.lastTransform;
    var x, y, rotation;
    var scaleSqrX, scaleSqrY;

    if (!ob.parent ||
        ob.parent === ob.game.world ||
        ob.game.box2d.flatten) {
        rotation = ob.rotation;
        x = ob.x;
        y = ob.y;
        scaleSqrX = ob.scaleX * ob.scaleX;
        scaleSqrY = ob.scaleY * ob.scaleY;
    }
    else {
        var wt = ob.worldTransform;
        rotation = Math.atan2(wt.b, wt.a);
        x = wt.tx;
        y = wt.ty;
        scaleSqrX = wt.a * wt.a + wt.b * wt.b;
        scaleSqrY = wt.c * wt.c + wt.d * wt.d;
    }

    // 位移是否发生变化
    var offsetChanged = (Math.abs(x - bwt.x) > 0.01 ||
                         Math.abs(y - bwt.y) > 0.01);

    // 旋转是否发生变化
    var rotationDelta = Math.abs(rotation - bwt.rotation);

    // 由于短路计算，大部分情况是走不到 % 2PI 的分支
    var rotationChanged = rotationDelta > 0.0001 && rotationDelta % (2 * Math.PI) > 0.0001;

    // 缩放是否发生变化
    var scaleChanged = Math.abs(scaleSqrX - body.scaleSqrX) > 0.001 ||
                       Math.abs(scaleSqrY - body.scaleSqrY) > 0.001;

    // pivot/width/height是否发生变化
    var anchor = ob.phaser.anchor || {};
    var pivotChanged = (anchor.x !== body.pivotX || anchor.y !== body.pivotY);
    var sizeChanged = (ob._width !== body.width || ob._height !== body.height);

    if (scaleChanged || pivotChanged || sizeChanged) {
        this.resetFixtureShape();
    }

    if (offsetChanged || rotationChanged) {
        // 设置世界物体的属性给目标对象

        // 设置初始位置
        ob._body.lastTransform = {
            rotation : rotation,
            x : x,
            y : y
        };
        ob.b2Body.SetPositionAndAngle(new Box2D.b2Vec2(
            ob.game.box2d.toBox2DX(x),
            ob.game.box2d.toBox2DY(y)
        ), rotation);
    }
};

/**
 * post update 阶段同步 box2d 世界的信息到普通世界
 */
Body.prototype.bodyPostUpdate = function() {
    // 同步角度，位置
    var b2Body = this.gameObject.b2Body;
    if (!b2Body) return;

    // static 物体不同步给世界
    if (this.gameObject._body.type === qc.Box2D.BODY_TYPE.STATIC)
        return;

    var b2Pos = b2Body.GetPosition();

    var b2x = b2Pos.x;
    var b2y = b2Pos.y;
    if (isNaN(b2x) || isNaN(b2y))
        return;

    // 设置属性到对象身上
    var ob = this.gameObject;
    var world = ob.world;

    var tx = world.toWorldX(b2x);
    var ty = world.toWorldY(b2y);
    var rotation = b2Body.GetAngle();

    ob._body.lastTransform = {
        rotation : rotation,
        x : tx,
        y : ty
    };

    // 如果没有父亲，或者是 flatten 世界，rotation/tx/ty 就是最终信息，直接设置
    var parent = ob.parent;
    if (!parent ||
        parent === ob.game.world ||
        world.flatten) {
        ob.x = tx;
        ob.y = ty;
        ob.rotation = rotation;
        return;
    }

    var wt = ob.phaser.worldTransform;
    var cosRot = Math.cos(rotation);
    var sinRot = Math.sin(rotation);
    var parentTrans = ob.parent.worldTransform;
    var parentMatrix, out;

    if (Math.abs(wt.b / wt.a - sinRot / cosRot) < 0.0001) {
        // 旋转没有发生变化
        parentMatrix = parentTrans.toArray(true);
        out = [];

        // 计算出相对父节点的偏移
        this.game.math.invert(out, parentMatrix);
        this.game.math.multiply(out, out,
            [wt.a, wt.b, 0, wt.c, wt.d, 0, tx, ty, 1]);

        // 设置给物体
        ob.x = out[6];
        ob.y = out[7];
    }
    else {
        // 旋转发生变化了
        var worldScale = ob.getWorldScale();
        var scaleX = worldScale.x;
        var scaleY = worldScale.y;

        parentMatrix = parentTrans.toArray(true);
        out = [];

        // 计算出相对父节点的偏移
        this.game.math.invert(out, parentMatrix);
        this.game.math.multiply(out, out,
            [ cosRot * scaleX,
              sinRot * scaleX,
              0,
              -sinRot * scaleY,
              cosRot * scaleY,
              0,
              tx,
              ty,
              1 ]);

        ob.rotation = Math.atan2(out[1], out[0]);
        ob.x = out[6];
        ob.y = out[7];
    }
};

/**
 * 加上一道外力作用在 body 上
 */
Body.prototype.applyForce = function(x, y) {
    var b2Body = this.gameObject.b2Body;
    b2Body.ApplyForce(new Box2D.b2Vec2(x, y),
        b2Body.GetWorldCenter(), true);
};

/**
 * 外加一道冲量在 body 上
 */
Body.prototype.applyImpulse = function(x, y) {
    var b2Body = this.gameObject.b2Body;
    b2Body.ApplyImpulse(new Box2D.b2Vec2(x, y),
        b2Body.GetWorldCenter(), true);
};

/**
 * 是否包含一个点
 */
Body.prototype.contains = function(x, y) {
    var point = new Box2D.b2Vec2(this.gameObject.world.toBox2DX(x),
                                 this.gameObject.world.toBox2DY(y));

    // 先收集所有的 Fixtures
    var b2Body = this.gameObject.b2Body;
    for (var fixture = b2Body.GetFixtureList(); fixture; fixture = fixture.GetNext()) {
        if (fixture.TestPoint(point))
            return true;
    }

    // 没有找到任何 Fixtuer 包含之
    return false;
};

/**
 * 加载单个 fixture 对象
 */
Body.prototype._loadFixture = function(world, body, fixtureDef) {
    var fixture = new Box2D.b2FixtureDef();

    fixture.density = (1.0 * fixtureDef.density || 0);
    fixture.friction = (fixtureDef.friction || 0);
    fixture.restitution = (fixtureDef.restitution || 0);
    fixture.isSensor = (fixtureDef.sensor || false);

    var shape;
    switch (fixtureDef.type) {
    case qc.Box2D.FIXTURE_TYPE.CIRCLE :
        shape = new Box2D.b2CircleShape();
        shape.SetRadius(world.pixelToMeter(fixtureDef.radius || 0));
        if (fixtureDef.center)
            shape.SetLocalPosition(new Box2D.b2Vec2(
                world.pixelToMeter(fixtureDef.center.x),
                world.pixelToMeter(fixtureDef.center.y)));
        else
            shape.SetLocalPosition(new Box2D.b2Vec2(0, 0));
        break;

    case qc.Box2D.FIXTURE_TYPE.POLYGON :
    case qc.Box2D.FIXTURE_TYPE.CHAIN :
        // 生成形状
        if (fixtureDef.type === qc.Box2D.FIXTURE_TYPE.POLYGON)
            shape = new Box2D.b2PolygonShape();

        var b2Vertices = [];
        var vertices = fixtureDef.vertices;
        for (var i = 0; i < vertices.length; i++) {
            b2Vertices.push(new Box2D.b2Vec2(
                world.pixelToMeter(vertices[i].x),
                world.pixelToMeter(vertices[i].y)
            ));
        }

        shape.SetAsArray(b2Vertices, b2Vertices.length);
        break;
    }

    fixture.shape = (shape);
    body.CreateFixture(fixture);
};

/**
 * 清除所有的 Fixture
 */
Body.prototype.clearFixtures = function() {
    var fixtures = [];
    var fixture;
    var b2Body = this.gameObject.b2Body;

    // 先收集所有的 Fixtures
    for (fixture = b2Body.GetFixtureList(); fixture; fixture = fixture.GetNext()) {
        fixtures.push(fixture);
    }

    // 逐一析构掉
    var i, len = fixtures.length;
    for (i = 0; i < len; i++) {
        b2Body.DestroyFixture(fixtures[i]);
    }
};

/**
 * 获取一个 filter 对象
 */
Body.prototype._getBox2DFilter = function() {
    var b2Body = this.gameObject.b2Body;
    if (!b2Body) return null;

    var fixture = b2Body.GetFixtureList();
    if (!fixture) return null;

    return fixture.GetFilterData();
};

/**
 * 获取所有的 filter 对象
 */
Body.prototype._getBox2DFilters = function() {
    var b2Body = this.gameObject.b2Body;
    if (!b2Body) return null;

    var filters = [];
    var fixture;

    for (fixture = b2Body.GetFixtureList(); fixture; fixture = fixture.GetNext()) {
        filters.push(fixture.GetFilterData());
    }
    return filters;
};

/**
 * 清除具体某个Fixture
 */
Body.prototype.removeFixture = function(fixture) {
    var b2Body = this.gameObject.b2Body;
    if (fixture.GetBody() !== b2Body)
        return false;

    b2Body.DestroyFixture(fixture);
    return true;
};

Object.defineProperties(Body.prototype, {
    /**
     * body的类型，目前包括动态类型、静态类型、运动学物体
     */
    type : {
        get : function() { return this.gameObject._body.type; },
        set : function(v) {
            this.gameObject._body.type = v;
            var b2Body = this.gameObject.b2Body;
            if (!b2Body) return;
            switch (v) {
            case qc.Box2D.BODY_TYPE.DYNAMIC : b2Body.SetType(Box2D.b2Body.b2_dynamicBody); break;
            case qc.Box2D.BODY_TYPE.KINEMATIC : b2Body.SetType(Box2D.b2Body.b2_kinematicBody); break;
            default : b2Body.SetType(Box2D.b2Body.b2_staticBody); break;
            }
        }
    },

    /**
     * 是否激活中（非激活中的物体会以很低的开销存活，直到被碰撞之后重新 awake）
     */
    isAwake : {
        get : function() {
            if (this.gameObject.b2Body)
                return !!this.gameObject.b2Body.IsAwake();
            return this.gameObject._body.isAwake;
        },
        set : function(v) {
            this.gameObject._body.isAwake = v;
            var b2Body = this.gameObject.b2Body;
            if (b2Body) b2Body.SetAwake(v);
        }
    },

    /**
     * 是否是子弹类型，子弹类型是用于高速运动的物体，设置该属性可以避免部分穿墙
     */
    bullet : {
        get : function() { return this.gameObject._body.bullet; },
        set : function(v) {
            this.gameObject._body.bullet = v;
            var b2Body = this.gameObject.b2Body;
            if (b2Body) b2Body.SetBullet(v);
        }
    },

    /**
     * 角速度
     */
    angularVelocity : {
        get : function() {
            if (this.gameObject.b2Body)
                return this.gameObject.b2Body.GetAngularVelocity();
            return this.gameObject._body.angularVelocity;
        },
        set : function(v) {
            this.gameObject._body.angularVelocity = v;
            var b2Body = this.gameObject.b2Body;
            if (b2Body) {
                b2Body.SetAngularVelocity(v);
                b2Body.SetAwake(true);
            }
        }
    },

    /**
     * 旋转阻尼
     */
    angularDamping : {
        get : function() { return this.gameObject._body.angularDamping; },
        set : function(v) {
            this.gameObject._body.angularDamping = v;
            var b2Body = this.gameObject.b2Body;
            if (b2Body) b2Body.SetAngularDamping(v);
        }
    },

    /**
     * 是否固定旋转
     */
    fixedRotation : {
        get : function() { return this.gameObject._body.fixedRotation; },
        set : function(v) {
            this.gameObject._body.fixedRotation = v;
            var b2Body = this.gameObject.b2Body;
            if (b2Body) b2Body.SetFixedRotation(v);
        }
    },

    /**
     * 线性阻尼
     */
    linearDamping : {
        get : function() { return this.gameObject._body.linearDamping; },
        set : function(v) {
            this.gameObject._body.linearDamping = v;
            var b2Body = this.gameObject.b2Body;
            if (b2Body) b2Body.SetLinearDamping(v);
        }
    },

    /**
     * 线速度
     */
    linearVelocity : {
        get : function() {
            var b2Body = this.gameObject.b2Body;
            if (b2Body) {
                var b2Pos = b2Body.GetLinearVelocity();
                return new qc.Point(b2Pos.x, b2Pos.y);
            }
            return this.gameObject._body.linearVelocity;
        },
        set : function(v) {
            this.gameObject._body.linearVelocity = v;
            var b2Body = this.gameObject.b2Body;
            if (b2Body) {
                b2Body.SetLinearVelocity(new Box2D.b2Vec2(v.x, v.y));
                b2Body.SetAwake(true);
            }
        }
    },

    /**
     * 响应重力的倍率
     */
    gravityScale : {
        get : function() { return this.gameObject._body.gravityScale; },
        set : function(v) {
            this.gameObject._body.gravityScale = v;
        }
    },

    /**
     * 质量系数
     */
    density : {
        get : function() {
            var fixtures = this.gameObject._body.fixture;
            if (!fixtures || !fixtures.length) return 0;
            return fixtures[0].density;
        },
        set : function(v) {
            var fixtures = this.gameObject._body.fixture;
            var i, len = fixtures.length;
            for (i = 0; i < len; i++)
                fixtures[i].density = v;

            // 设置到世界中
            var fixture, b2Body = this.gameObject.b2Body;
            for (fixture = b2Body.GetFixtureList(); fixture; fixture = fixture.GetNext())
                fixture.SetDensity(v);
            b2Body.ResetMassData();
        }
    },

    /**
     * 摩擦力
     */
    friction : {
        get : function() {
            var fixtures = this.gameObject._body.fixture;
            if (!fixtures || !fixtures.length) return 0;
            return fixtures[0].friction;
        },
        set : function(v) {
            var fixtures = this.gameObject._body.fixture;
            var i, len = fixtures.length;
            for (i = 0; i < len; i++)
                fixtures[i].friction = v;

            // 设置到世界中
            var fixture, b2Body = this.gameObject.b2Body;
            for (fixture = b2Body.GetFixtureList(); fixture; fixture = fixture.GetNext()) {
                fixture.SetFriction(v);
            }
        }
    },

    /**
     * 恢复系数
     */
    restitution : {
        get : function() {
            var fixtures = this.gameObject._body.fixture;
            if (!fixtures || !fixtures.length) return 0;
            return fixtures[0].restitution;
        },
        set : function(v) {
            var fixtures = this.gameObject._body.fixture;
            var i, len = fixtures.length;
            for (i = 0; i < len; i++)
                fixtures[i].restitution = v;

            // 设置到世界中
            var fixture, b2Body = this.gameObject.b2Body;
            for (fixture = b2Body.GetFixtureList(); fixture; fixture = fixture.GetNext()) {
                fixture.SetRestitution(v);
            }
        }
    },

    /**
     * 是否传感器
     */
    sensor : {
        get : function() {
            var fixtures = this.gameObject._body.fixture;
            if (!fixtures || !fixtures.length) return 0;
            return fixtures[0].sensor;
        },
        set : function(v) {
            var fixtures = this.gameObject._body.fixture;
            var i, len = fixtures.length;
            for (i = 0; i < len; i++)
                fixtures[i].sensor = v;

            // 设置到世界中
            var fixture, b2Body = this.gameObject.b2Body;
            for (fixture = b2Body.GetFixtureList(); fixture; fixture = fixture.GetNext()) {
                fixture.SetSensor(v);
            }
        }
    },

    /**
     * fixture类型
     */
    fixtureType : {
        get : function() {
            var fixtures = this.gameObject._body.fixture;
            if (!fixtures || !fixtures.length) return 0;
            return fixtures[0].type;
        },
        set : function(v) {
            var fixtures = this.gameObject._body.fixture;
            var i, len = fixtures.length;
            for (i = 0; i < len; i++)
                fixtures[i].type = v;

            // 重置所有 fixture
            this.resetFixtureShape();
        }
    },

    /**
     *  category bits
     */
    categoryBits : {
        get : function() {
            var filterData = this._getBox2DFilter();
            if (filterData)
                filterData.categoryBits;
            else
                return 0x0001;
        },
        set : function(v) {
            var filters = this._getBox2DFilters();
            for (var i = 0, len = filters.length; i < len; i++) {
                var filter = filters[i];
                filter.categoryBits = v;
            }
        }
    },

    /**
     * mask bits
     */
    maskBits : {
        get : function() {
            var filterData = this._getBox2DFilter();
            if (filterData)
                filterData.maskBits;
            else
                return -1;
        },
        set : function(v) {
            var filters = this._getBox2DFilters();
            for (var i = 0, len = filters.length; i < len; i++) {
                var filter = filters[i];
                filter.maskBits = v;
            }
        }
    },

    /**
     * group index
     */
    groupIndex : {
        get : function() {
            var filterData = this._getBox2DFilter();
            if (filterData)
                filterData.groupIndex;
            else
                return 0;
        },
        set : function(v) {
            var filters = this._getBox2DFilters();
            for (var i = 0, len = filters.length; i < len; i++) {
                var filter = filters[i];
                filter.groupIndex = v;
            }
        }
    }
});
