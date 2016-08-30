/**
 * @author chenqx
 * 富文本编辑界面
 * copyright 2015 Qcplay All Rights Reserved.
 */
// 注册语言包
qc.editor.Language['GameObject/RichText'] = {
        zh: '游戏对象/富文本'
};
qc.editor.Language['RichText'] = {
        zh: '富文本'
};

// 注册com.qici.richText.RichText对应的查看面板
G.e.on(G.e.GAME_INIT_OK, function() {
    var win = G.game.getWindow();
    G.inspector._nodesMap.push([win.com.qici.richText.RichText, com.qici.richText.editor.RichTextPanel]);

    var func = function() {
        var node = new win.com.qici.richText.RichText(G.game, G.hierarchy.activeNode);
        G.hierarchy.activeNode = node;
        G.dataModel.addNodeForUndo(node);
    };

    // 扩展菜单项
    G.menu.addItem(G._('GameObject/RichText'), func);
    G.hierarchy.addMenuItem(G._('Create'), {
        'label': G._('RichText'),
        'func' : func
    });
});

var RichTextPanel = qc.widget.Default.define('com.qici.richText.editor.RichTextPanel', qc.editor.Panel,
    function RichTextPanel(target) {
        var self = this;
        RichTextPanel.super.constructor.call(self, target);

        self.title = 'RichText';
        self.icon = 'inspector_image';
        self.checkable = false;
        self.removable = false;
    }
);

/**
 * 绘制属性面板
 */
RichTextPanel.prototype.paint = function() {
    var self = this;
    var target = self.target;
    var gui = qc.editor.gui;
    var InspectorUtil = qc.editor.InspectorUtil;

    
    gui.columnWidths = ["60+0.1", "60+0.1"];
    // 是否更新边界
    gui.line([
        gui.text('Update Bounds'),
        gui.checkBox({ bind: 'updateBounds' })
    ]);
    gui.columnWidths = [70, "60+1"];
    // 字体颜色
    InspectorUtil.drawColorPicker(target, {'title': 'Color'}, 'color', null, false);

    // 染色颜色
    InspectorUtil.drawColorPicker(target, {'title': 'ColorTint'}, 'colorTint', null, false);

    // 文本
    gui.columnWidths = [self.indent, '60+1'];
    var title = gui.titleLine('Text');
    title.add(gui.line([
        gui.empty(),
        gui.textArea({ bind: 'text' })
    ], 50));

    gui.columnWidths = [self.indent, '70+0.1', '60+0.5'];
    title = gui.titleLine('Character', G.preference.query('collapse.text') === true);

    // 使用的字体
    title.add(gui.line([
        gui.empty(),
        gui.text('Font', {}),
        gui.stringInput({bind: 'font'})
    ]));

    // 字体大小
    title.add(gui.line([
        gui.empty(),
        gui.text('Font Size', { align: 'left' }),
        gui.intInput({ bind: 'fontSize' })
    ]));
    // 是否加粗
    title.add(gui.line([
        gui.empty(),
        gui.text('Bold', {}),
        gui.checkBox({ bind: 'bold' })
    ]));
    // 是否斜体
    title.add(gui.line([
        gui.empty(),
        gui.text('Italic', {}),
        gui.checkBox({ bind: 'italic' })
    ]));

    title = gui.titleLine('Paragraph', G.preference.query('collapse.text') === true);
    title.add(gui.line([
        gui.empty(),
        gui.text('Wrap', {}),
        gui.dropDownList({ bind: 'wrap', items: [
            { label: 'NONE', value: 2 },
            { label: 'BREAK ALL', value: 1 },
            { label: 'BREAK WORD', value: 0 }
        ]})
    ]));
    title.add(gui.line([
        gui.empty(),
        gui.text('Order', {}),
        gui.dropDownList({ bind: 'order', items: [
            { label: 'Left to Right, Top to Bottom', value: 0x00 },
            { label: 'Left to Right, Bottom to Top', value: 0x01 },
            { label: 'Right to Left, Top To Bottom', value: 0x10 },
            { label: 'Right to Left, Bottom to Top', value: 0x11 },
            { label: 'Top to Bottom, Left to Right', value: 0x20 },
            { label: 'Top to Bottom, Right to Left', value: 0x21 },
            { label: 'Bottom to Top, Left to Right', value: 0x30 },
            { label: 'Bottom to Top, Right to Left', value: 0x31 }
        ]})
    ]));

};

