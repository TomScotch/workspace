/**
 * @author wudm
 * @copyright 2016 Qcplay All Rights Reserved.
 */

/**
 * QueryAABB 处理对象
 */
var QueryAABB = qc.Box2D.QueryAABB = function(world) {
    var self = this;
    self.world = world;

    // 生成一份box2d需要的回调
    self.b2Callback = new Box2D.JSQueryCallback();

    // 初始化 hits 空
    self.hits = [];

    // 关注事件并进行处理
    self.b2Callback.ReportFixture = function(fixturePtr) {
        return self.reportFixture(fixturePtr);
    };
};
QueryAABB.prototype = {};
QueryAABB.prototype.constructor = QueryAABB;

/**
 * 处理 QueryAABB 结果
 */
QueryAABB.prototype.reportFixture = function(fixturePtr) {
    var fixture = Box2D.wrapPointer(fixturePtr, Box2D.b2Fixture);
    var gameObject = fixture.GetBody().gameObject;

    if (this.filter) {
        if (!this.filter.call(this.world, gameObject, fixture))
            // 不记录，继续向下查找
            return true;
    }

    // 需要查找最近的，由于回调中的 fixture 是不定序的。
    // 最近实际是通过 fraction 裁剪 raycast，最终多次裁剪后的仍然保存下来的一定是目标
    var thisFractionInfo = {
        fixture : fixture,
        gameObject : gameObject
    };

    if (this.findAll) {
        this.hits.push(thisFractionInfo);
        return true;
    }
    else {
        // 停止遍历
        this.hits = [ thisFractionInfo ];
        return false;
    }
};

/**
 * 进行一次查询
 */
QueryAABB.prototype.check = function(x, y, width, height, findAll, filter) {
    var self = this;

    if (typeof findAll === 'undefined') findAll = true;
    self.findAll = findAll;
    self.filter = filter;

    // 重置结果
    self.hits = [];

    var world = self.world;

    // 坐标系转换
    x = world.toBox2DX(x);
    y = world.toBox2DY(y);
    width = world.pixelToMeter(width);
    height = world.pixelToMeter(height);

    var aabb = new Box2D.b2AABB();
    var pLower = new Box2D.b2Vec2(x, y);
    var pUpper = new Box2D.b2Vec2(x + width, y + height);

    aabb.set_lowerBound(pLower);
    aabb.set_upperBound(pUpper);

    // 进行查询
    world.b2World.QueryAABB(self.b2Callback, aabb);

    // 查询完毕，释放内存
    Box2D.destroy(pUpper);
    Box2D.destroy(pLower);
    Box2D.destroy(aabb);

    return self.hits;
};
