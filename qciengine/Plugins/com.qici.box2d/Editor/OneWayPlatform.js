/**
 * @author wudm
 * copyright 2016 Qcplay All Rights Reserved.
 */

// Box2d oneway platform 脚本扩展显示
G.extend.inspector('qc.Box2D.OneWayPlatform', function() {
    var self = this;
    var target = self.target;
    var gui = qc.editor.gui;

    gui.columnWidths = ['90+0.1', '60+0.3'];

    // 绘制形状
    var typeItems = [ 'NONE', 'UP', 'DOWN', 'LEFT', 'RIGHT' ];
    gui.line([
        gui.text('Direction'),
        typeDownList = gui.dropDownList({
            items : typeItems,
            bind : 'direction'
        })
    ]);

    typeDownList.value = typeItems[target.direction];
    typeDownList.syncToGame = function(v) {
        target.direction = typeItems.indexOf(v) || 0;
    };
    typeDownList.syncToComp = function(value) {
        this.value = typeItems[target.direction];
    };
});
