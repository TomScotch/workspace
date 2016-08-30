/**
 * @author wudm
 * @copyright 2016 Qcplay All Rights Reserved.
 */

/**
 * 设置所有物理的根节点，不设置则默认是 game.world
 **/
var Root = qc.defineBehaviour('qc.Box2D.Root', qc.Behaviour, function() {
}, {
});

// 菜单归类
Root.__menu = 'Plugins/Box2DWeb/Root';

// 启用
Root.prototype.onEnable = function() {
    this.game.box2d.setRootNode(this.gameObject);
};

// 禁用
Root.prototype.onDisable = function() {
    this.game.box2d.removeRootNode(this.gameObject);
};
