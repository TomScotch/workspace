/**
 * @author wudm
 * @copyright 2016 Qcplay All Rights Reserved.
 */

/**
 * Raycast 处理对象，用于查询 raycast 的目标
 */
var Raycast = qc.Box2D.Raycast = function(world) {
    var self = this;
    self.world = world;

    // 初始化 hits 空
    self.hits = [];

    // 默认取最近的一个 cast 点
    self.closest = true;
};
Raycast.prototype = {};
Raycast.prototype.constructor = Raycast;

/**
 * 处理 raycast 结果，一次 raycast 会走入多次该函数
 */
Raycast.prototype.reportFixture = function(fixture, b2Point, b2Normal, fraction) {
    var gameObject = fixture.GetBody().gameObject;

    // 计算碰撞点
    var world = this.world;
    var point = new qc.Point(world.toWorldX(b2Point.x),
                             world.toWorldY(b2Point.y));

    // 计算碰撞法线向量
    var normal = new qc.Point(b2Normal.x, b2Normal.y);

    // 是否有过滤函数
    if (this.filter) {
        if (!this.filter.call(world, gameObject, point, normal, fixture)) {
            // 滤过这个目标
            return -1;
        }
    }

    // 需要查找最近的，由于回调中的 fixture 是不定序的。
    // 最近实际是通过 fraction 裁剪 raycast，最终多次裁剪后的仍然保存下来的一定是目标
    var thisFractionInfo = {
        fixture : fixture,
        point : point,
        normal : normal,
        fraction : fraction,
        gameObject : gameObject
    };

    if (this.closest) {
        // 裁剪 raycast
        this.hits = [ thisFractionInfo ];
        return fraction;
    }
    else {
        // 继续遍历
        this.hits.push(thisFractionInfo);
        return 1;
    }
};

/**
 * 进行一次 raycast
 */
Raycast.prototype.check = function(x1, y1, x2, y2, closest, filter) {
    var self = this;

    if (typeof closest === 'undefined') closest = true;
    self.closest = closest;
    self.filter = filter;

    // 重置结果
    self.hits = [];

    var world = self.world;

    // 坐标系转换
    x1 = world.toBox2DX(x1);
    y1 = world.toBox2DY(y1);
    x2 = world.toBox2DX(x2);
    y2 = world.toBox2DY(y2);

    var pointA = new Box2D.b2Vec2(x1, y1);
    var pointB = new Box2D.b2Vec2(x2, y2);

    // 进行查询
    world.b2World.RayCast(function(fixturePtr, pointPtr, normalPtr, fraction) {
        return self.reportFixture(fixturePtr, pointPtr, normalPtr, fraction);
    }, pointA, pointB);

    return self.hits;
};
