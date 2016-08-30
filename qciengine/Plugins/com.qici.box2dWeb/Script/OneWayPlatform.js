/**
 * @author wudm
 * @copyright 2016 Qcplay All Rights Reserved.
 */

/**
 * Box2D 只允许单边穿越的对象
 */
var OneWayPlatform = qc.defineBehaviour('qc.Box2D.OneWayPlatform', qc.Behaviour, function() {
}, {
    direction : qc.Serializer.NUMBER
});

OneWayPlatform.NONE = 0;
OneWayPlatform.UP = 1;
OneWayPlatform.DOWN = 2;
OneWayPlatform.LEFT = 3;
OneWayPlatform.RIGHT = 4;

// 菜单归类
OneWayPlatform.__menu = 'Plugins/Box2DWeb/OneWayPlatform';

// Called when the script instance is being loaded.
OneWayPlatform.prototype.awake = function() {
    this.onEnable();
};

// 启用
OneWayPlatform.prototype.onEnable = function() {
    this._refresh();
};

// 禁用
OneWayPlatform.prototype.onDisable = function() {
    this._refresh();
};

// 初始化环境
OneWayPlatform.prototype._refresh = function() {
    var self = this;
    var enabled = this.enable;

    // 需要有 body 对象
    if (enabled) {
        if (!self.gameObject.body) {
            self.game.log.trace('one way platform behaviour only available on physics body');
            return;
        }

        self.passingBody = {};

        self.presolveListener = self.addListener(self.gameObject.body.onPreSolve, self.onPreSolve, self);
        self.contactListener = self.addListener(self.gameObject.body.onContact, self.onContact, self);
    }
    else {
        // 如果有监听删除
        if (self.presolveListener) self.removeListener(self.presolveListener);
        if (self.contactListener) self.removeListener(self.contactListener);
    }
};

// 开始接触
OneWayPlatform.prototype.onPreSolve = function(eventPara) {
    var self = this;

    var target = eventPara.gameObjectA;
    if (target === self.gameObject)
        target = eventPara.gameObjectB;

    // 已经在穿越中
    var passingBody = self.passingBody[target.uuid];
    if (passingBody) {
        eventPara.preventContact = true;
        return;
    }
};

// 关注接触
OneWayPlatform.prototype.onContact = function(eventPara) {
    var self = this;
    var target = eventPara.gameObjectA;
    if (target === self.gameObject)
        target = eventPara.gameObjectB;

    if (eventPara.isBeginning === false) {
        // 结束接触
        delete self.passingBody[target.uuid];
    }
    else {
        // 开始接触
        var linearVelocity = target.body.linearVelocity;
        var relativeVelocity = self.gameObject.b2Body.GetLocalVector(new Box2D.b2Vec2(linearVelocity.x, linearVelocity.y));

        var preventContact;

        switch (self.direction) {
        case qc.Box2D.OneWayPlatform.UP : preventContact = relativeVelocity.y < 0; break;
        case qc.Box2D.OneWayPlatform.DOWN : preventContact = relativeVelocity.y > 0; break;
        case qc.Box2D.OneWayPlatform.LEFT : preventContact = relativeVelocity.x < 0; break;
        case qc.Box2D.OneWayPlatform.RIGHT : preventContact = relativeVelocity.x > 0; break;
        default : preventContact = false; break;
        }

        if (preventContact) {
            // 允许穿越
            eventPara.preventContact = true;
            self.passingBody[target.uuid] = true;
        }
    }
};
