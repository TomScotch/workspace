/**
 * @author wudm
 * copyright 2016 Qcplay All Rights Reserved.
 */

// 注册语言包
qc.editor.Language['Physics/Box2DWeb Settings'] = {
        zh: '物理/Box2DWeb设置'
};

// 注册qc.ParticleSystem对应的查看面板
G.e.on(G.e.GAME_INIT_OK, function() {
    // 菜单扩展
    G.menu.addItem(G._('Physics/Box2DWeb Settings'), function() {
        var inspector = G.inspector;
        var propertyView = inspector.propertyView;
        propertyView.inspect(null, 'Panel:Box2DSettingPanel');
    });
});

/**
 * 设定面板
 */
var Box2DSettingPanel = qc.widget.Default.define('qc.editor.Box2DSettingPanel', qc.editor.Panel,
    function Box2DSettingPanel(properties) {
        var self = this;
        Box2DSettingPanel.super.constructor.call(self, properties);

        self.title = G._('Box2D Settings');
        self.checkable = false;
        self.removable = false;
        self.target = {};
    }
);

// debug设置定义
Box2DSettingPanel.FlagShapeBit = 0x0001;
Box2DSettingPanel.FlagJointBit = 0x0002;
Box2DSettingPanel.FlagAabbBit = 0x0004;
Box2DSettingPanel.FlagPairBit = 0x0008;
Box2DSettingPanel.FlagCenterOfMassBit = 0x0010;

/**
 * 面板绘制逻辑
 */
Box2DSettingPanel.prototype.paint = function() {
    var gui = qc.editor.gui;
    var settings = G.config.project.customSettings.Box2D || {};

    gui.columnWidths = ["100+0.08", "60+0.5"];

    var querySetting = function(key, defaultValue) {
        var v = settings[key];
        if (v === undefined)
            return defaultValue;
        return v;
    };

    // 重力
    gui.line([
        gui.text(G._('gravity')),
        gravity = gui.numberInput({ value : querySetting('gravity', 10) })
    ]);

    // PTM
    gui.line([
        gui.text('PTM'),
        PTM = gui.numberInput({ value : querySetting('PTM', 20) })
    ]);

    // 速度迭代次数
    gui.line([
        gui.text('velocityIterations'),
        velocityIterations = gui.numberInput({ value : querySetting('velocityIterations', 3) })
    ]);

    // 位置迭代次数
    gui.line([
        gui.text('positionIterations'),
        positionIterations = gui.numberInput({ value : querySetting('positionIterations', 2) })
    ]);

    // 帧率
    gui.line([
        gui.text(G._('stepRate')),
        frameRate = gui.numberInput({ value : querySetting('frameRate', 30) })
    ]);

    // 固定帧调度，还是帧流逝的时间调度
    gui.line([
        gui.text(G._('useElapsedTime')),
        useElapsedTime = gui.checkBox({ selected : querySetting('useElapsedTime', false) })
    ]);

    // 每帧最多调度次数
    gui.line([
        gui.text(G._('maxSimulatePerFrame')),
        maxSimulatePerFrame = gui.numberInput({ value : querySetting('maxSimulatePerFrame', 3) })
    ]);

    // 是否允许
    gui.line([
        gui.text(G._('allowSleeping')),
        allowSleeping = gui.checkBox({ selected : querySetting('allowSleeping', true) })
    ]);

    // 是否开启调试
    gui.line([
        gui.text(G._('debugDraw')),
        debugDraw = gui.checkBox({ selected : querySetting('debugDraw', false) })
    ]);

    // 调试选项
    gui.columnWidths = ['30+0', '70+0.08', '60+0.5'];
    var debugFlagTitle = gui.titleLine(G._('debugFlags'), false);
    var debugFlagValue = querySetting('debugFlags', 0xff);

    var flagShapeCB, flagJointCB, flagAabbCB, flagPairCB, flagCenterOfMassCB;

    // 绘制具体的调试选型
    debugFlagTitle.add(gui.line([
        gui.empty(),
        gui.text('Shape'),
        flagShapeCB = gui.checkBox({ selected : (debugFlagValue & Box2DSettingPanel.FlagShapeBit) > 0 })
    ]));
    debugFlagTitle.add(gui.line([
        gui.empty(),
        gui.text('Joint'),
        flagJointCB = gui.checkBox({ selected : (debugFlagValue & Box2DSettingPanel.FlagJointBit) > 0 })
    ]));
    debugFlagTitle.add(gui.line([
        gui.empty(),
        gui.text('AABB'),
        flagAabbCB = gui.checkBox({ selected : (debugFlagValue & Box2DSettingPanel.FlagAabbBit) > 0 })
    ]));
    debugFlagTitle.add(gui.line([
        gui.empty(),
        gui.text('Pair'),
        flagPairCB = gui.checkBox({ selected : (debugFlagValue & Box2DSettingPanel.FlagPairBit) > 0 })
    ]));
    debugFlagTitle.add(gui.line([
        gui.empty(),
        gui.text('CenterOfMass'),
        flagCenterOfMassCB = gui.checkBox({ selected : (debugFlagValue & Box2DSettingPanel.FlagCenterOfMassBit) > 0 })
    ]));

    // 应用按钮
    var saveButton;
    gui.line([
        saveButton = gui.button(G._('Apply'), {}, { colspan: 3 })
    ]);

    // 按钮被点击的响应
    saveButton.on('click', function() {
        // 检查数据的合法性
        var physicsSettings = G.config.project.customSettings.Box2D;
        if (!physicsSettings) {
            physicsSettings = G.config.project.customSettings.Box2D = {};
        }

        physicsSettings.gravity = gravity.value;
        physicsSettings.PTM = PTM.value;
        physicsSettings.velocityIterations = velocityIterations.value;
        physicsSettings.positionIterations = positionIterations.value;
        physicsSettings.frameRate = frameRate.value;
        physicsSettings.useElapsedTime = useElapsedTime.selected;
        physicsSettings.maxSimulatePerFrame = maxSimulatePerFrame.value;
        physicsSettings.allowSleeping = allowSleeping.selected;

        physicsSettings.debugDraw = debugDraw.selected;
        physicsSettings.debugFlags =
            (flagShapeCB.selected ? Box2DSettingPanel.FlagShapeBit : 0) |
            (flagJointCB.selected ? Box2DSettingPanel.FlagJointBit : 0) |
            (flagAabbCB.selected ? Box2DSettingPanel.FlagAabbBit : 0) |
            (flagPairCB.selected ? Box2DSettingPanel.FlagPairBit : 0) |
            (flagCenterOfMassCB.selected ? Box2DSettingPanel.FlagCenterOfMassBit : 0);

        // 上传服务器进行保存
        qc.editor.Operation.UPDATE_PROJECT_SETTINGS(G.config.project);
        G.notification.info(G._('Operation completed'));
    });

};
