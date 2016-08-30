/**
 * @author wudm
 * @copyright 2016 Qcplay All Rights Reserved.
 */

// 复用对象，避免内存不停开辟
// 注意这里的对象我们都认为已经创建了，后续接口不再判定
B2ObjectProxy = {};

/**
 * 初始化环境
 */
B2ObjectProxy.init = function() {
    B2ObjectProxy.vec2 = new Box2D.b2Vec2(0, 0);
    B2ObjectProxy.fixtureDef = new Box2D.b2FixtureDef();
    B2ObjectProxy.circleShape = new Box2D.b2CircleShape();
    B2ObjectProxy.polygonShape = new Box2D.b2PolygonShape();
    B2ObjectProxy.chainShape = new Box2D.b2ChainShape();

    B2ObjectProxy.verticesBuffer = {
        4 : Box2D.allocate(4 * 8, 'float', Box2D.ALLOC_STACK)
    };
};

/**
 * Box2D Point 对象（复用，避免内存不停开辟）
 */
Box2D.Vec2Proxy = function(x, y) {
    var vec2 = B2ObjectProxy.vec2;
    vec2.set_x(x);
    vec2.set_y(y);
    return vec2;
};

/**
 * Fixture 定义
 */
Box2D.b2FixtureDefProxy = function() {
    return B2ObjectProxy.fixtureDef;
};

/**
 * 形状定义
 */
Box2D.b2CircleShapeProxy = function() {
    return B2ObjectProxy.circleShape;
};
Box2D.b2PolygonShapeProxy = function() {
    return B2ObjectProxy.polygonShape;
};
Box2D.b2ChainShapeProxy = function() {
    return B2ObjectProxy.chainShape;
};

/**
 * 点的定义
 */
Box2D.b2VerticesBufferProxy = function(num) {
    var buffer = B2ObjectProxy.verticesBuffer[num];
    if (buffer)
        return buffer;

    B2ObjectProxy.verticesBuffer[num] = buffer = Box2D.allocate(num * 8, 'float', Box2D.ALLOC_STACK);
    return buffer;
};

