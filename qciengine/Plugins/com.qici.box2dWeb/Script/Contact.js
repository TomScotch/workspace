/**
 * @author wudm
 * @copyright 2016 Qcplay All Rights Reserved.
 */

/**
 * Box2D contact 对象，响应碰撞事件，并分发给对应的 body 进行处理
 */
var ContactListener = qc.Box2D.ContactListener = function(world) {
    var self = this;
    self.b2Listener = new Box2D.b2ContactListener();

    // 为 b2Listener 赋事件
    this.b2Listener.BeginContact = function(contact) {
        self.handleContact(contact, true);
    };
    this.b2Listener.EndContact = function(contact) {
        self.handleContact(contact, false);
    };
    this.b2Listener.PreSolve = function(contact, oldManifold) {
        self.preSolve(contact, oldManifold);
    };
    this.b2Listener.PostSolve = function(contact, impulse) {
        self.postSolve(contact, impulse);
    };

    // 注册作为 Box2D 世界的接听
    world.setContactListener(this.b2Listener);
};
ContactListener.prototype = {};
ContactListener.prototype.constructor = ContactListener;

/**
 * 两个Fixture接触的接触事件，无论是否传感器都会触发这个回调
 * isBeginning 标记是开始事件还是结束事件
 */
ContactListener.prototype.handleContact = function(contact, isBeginning) {
    var fixtureA = contact.GetFixtureA();
    var fixtureB = contact.GetFixtureB();
    var bodyA = fixtureA.GetBody();
    var bodyB = fixtureB.GetBody();

    // 获取对应在世界中的对象
    var gameObjectA = bodyA.gameObject;
    var gameObjectB = bodyB.gameObject;
    if (!gameObjectA || !gameObjectB) return;

    // 分发事件
    var eventPara = {
        fixtureA : fixtureA,
        fixtureB : fixtureB,
        gameObjectA : gameObjectA,
        gameObjectB : gameObjectB,
        contact : contact,
        isBeginning : isBeginning
    };

    gameObjectA.body.onContact.dispatch(eventPara);
    gameObjectB.body.onContact.dispatch(eventPara);

    if (eventPara.preventContact)
        contact.SetEnabled(false);
};

/**
 * Pre-Solve事件
 * 这个事件发生在冲突检测到之后，但是冲突解决（被执行）之前
 * 它可以给你个机会取消contact，或者判定碰撞点的状态、速度
 */
ContactListener.prototype.preSolve = function(contact, oldManifold) {
    var fixtureA = contact.GetFixtureA();
    var fixtureB = contact.GetFixtureB();
    var bodyA = fixtureA.GetBody();
    var bodyB = fixtureB.GetBody();

    // 获取对应在世界中的对象
    var gameObjectA = bodyA.gameObject;
    var gameObjectB = bodyB.gameObject;
    if (!gameObjectA || !gameObjectB) return;

    // 分发事件
    var eventPara = {
        fixtureA : fixtureA,
        fixtureB : fixtureB,
        gameObjectA : gameObjectA,
        gameObjectB : gameObjectB,
        contact : contact,
        oldManifold : oldManifold
    };
    gameObjectA.body.onPreSolve.dispatch(eventPara);
    gameObjectB.body.onPreSolve.dispatch(eventPara);
    if (eventPara.preventContact)
        contact.SetEnabled(false);
};

/**
 * Post-Solve事件
 * 这个事件里两个形状已经发生碰撞被已处理，此时可以获取到碰撞冲力或动能
 */
ContactListener.prototype.postSolve = function(contact, impulse) {
    var fixtureA = contact.GetFixtureA();
    var fixtureB = contact.GetFixtureB();
    var bodyA = fixtureA.GetBody();
    var bodyB = fixtureB.GetBody();

    // 获取对应在世界中的对象
    var gameObjectA = bodyA.gameObject;
    var gameObjectB = bodyB.gameObject;
    if (!gameObjectA || !gameObjectB) return;

    // 分发事件
    var eventPara = {
        fixtureA : fixtureA,
        fixtureB : fixtureB,
        gameObjectA : gameObjectA,
        gameObjectB : gameObjectB,
        contact : contact,
        impulse : impulse
    };
    gameObjectA.body.onPostSolve.dispatch(eventPara);
    gameObjectB.body.onPostSolve.dispatch(eventPara);
};

