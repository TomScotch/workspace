/**
 * @author wudm
 * copyright 2016 Qcplay All Rights Reserved.
 */

// Box2d body 脚本扩展显示
G.extend.inspector('qc.Box2D.Body', function() {
    var self = this;
    var target = self.target;
    var gui = qc.editor.gui;

    var bodyDef = { STATIC : 0, KINEMATIC : 1, DYNAMIC : 2 };
    var fixtureDef = { POLYGON : 0, CIRCLE : 1, CHAIN : 2 };

    gui.columnWidths = ['90+0.1', '60+0.3'];

    // 绘制形状
    var typeItems = [ 'Static', 'Kinematic', 'Dynamic' ];
    gui.line([
        gui.text('Type'),
        typeDownList = gui.dropDownList({ items : typeItems, bind : 'gameObject._body.type' })
    ]);

    var body = target.gameObject._body;
    typeDownList.value = typeItems[body.type];
    typeDownList.syncToGame = function(v) {
        body.type = typeItems.indexOf(v) || 0;
        self.repaint();
    };
    typeDownList.syncToComp = function(value) {
        this.value = typeItems[body.type];
    };

    // 是否子弹属性
    if (body.type === bodyDef.DYNAMIC) {
        gui.line([
            gui.text('Bullet'),
            gui.checkBox({ bind : 'gameObject._body.bullet' })
        ]);

        // 是否固定 rotation
        gui.line([
            gui.text('fixedRotation'),
            gui.checkBox({ bind : 'gameObject._body.fixedRotation' })
        ]);

        // 设置是否激活中
        gui.line([
            gui.text('awake'),
            gui.checkBox({ bind : 'gameObject.body.isAwake' })
        ]);

        // 当前线速度
        gui.columnWidths = ['70+0.1', 20, '30+0.1', 20, '30+0.1'];
        qc.editor.InspectorUtil.drawPoint(target, 'linearVelocity', 'gameObject.body.linearVelocity');

        // 线性阻尼
        gui.columnWidths = ['90+0.1', '60+0.3'];
        gui.line([
            gui.text('linearDamping'),
            gui.numberInput({ bind : 'gameObject._body.linearDamping' })
        ]);

        // 角速度
        gui.line([
            gui.text('angularVelocity'),
            gui.numberInput({ bind : 'gameObject.body.angularVelocity' })
        ]);

        // 线性阻尼
        gui.line([
            gui.text('angularDamping'),
            gui.numberInput({ bind : 'gameObject._body.angularDamping' })
        ]);
    }
    else if (body.type === bodyDef.KINEMATIC) {
        // 设置是否激活中
        gui.line([
            gui.text('awake'),
            gui.checkBox({ bind : 'gameObject.body.isAwake' })
        ]);

        // 当前线速度
        gui.columnWidths = ['70+0.1', 20, '30+0.1', 20, '30+0.1'];
        qc.editor.InspectorUtil.drawPoint(target, 'linearVelocity', 'gameObject.body.linearVelocity');

        // 角速度
        gui.columnWidths = ['90+0.1', '60+0.3'];
        gui.line([
            gui.text('angularVelocity'),
            gui.numberInput({ bind : 'gameObject.body.angularVelocity' })
        ]);
    }

    // Fixture 设置
    gui.columnWidths = [self.indent, '60+0.1', '60+0.3' ];
    var title = gui.titleLine('Fixture');
    var fixtureTypeItems = [ 'Polygon', 'Circle' ];
    var fixtureTypeDownList;

    var bindFixture = function(key) {
        return 'gameObject._body.fixture[0].' + key;
    };
    title.add(gui.line([
        gui.empty(),
        gui.text('Type'),
        fixtureTypeDownList = gui.dropDownList({ items : fixtureTypeItems, bind : bindFixture('type') })
    ]));
    var fixture = target.gameObject._body.fixture[0];
    fixtureTypeDownList.value = fixtureTypeItems[fixture.type === fixtureDef.CIRCLE ? 1 : 0];
    fixtureTypeDownList.syncToGame = function(v) {
        var type = fixtureTypeItems.indexOf(v) || 0;
        if (type === 1)
            fixture.type = fixtureDef.CIRCLE;
        else
            fixture.type = fixtureDef.POLYGON;

        self.repaint();
    };
    fixtureTypeDownList.syncToComp = function(value) {
        this.value = fixtureTypeItems[fixture.type === fixtureDef.CIRCLE ? 1 : 0];
    };

    // 密度
    if (body.type === bodyDef.DYNAMIC) {
        title.add(gui.line([
            gui.empty(),
            gui.text('density'),
            gui.numberInput({ bind : bindFixture('density') })
        ]));
    }

    // 摩擦力
    title.add(gui.line([
        gui.empty(),
        gui.text('friction'),
        gui.numberInput({ bind : bindFixture('friction') })
    ]));

    // 恢复属性
    title.add(gui.line([
        gui.empty(),
        gui.text('restitution'),
        gui.numberInput({ bind : bindFixture('restitution') })
    ]));

    // 是否是传感器
    title.add(gui.line([
        gui.empty(),
        gui.text('Is Sensor'),
        gui.checkBox({ bind : bindFixture('sensor') })
    ]));

    if (fixture.type !== fixtureDef.POLYGON) {
        G.scene.editBox2dVerticesEnabled = false;
        return;
    }

    // 绘制多边形可编辑区域
    gui.columnWidths = [self.indent, '60+0.1', '30+0', '45+0.3' ];
    var title = gui.titleLine('Shape');
    var shapeEditCheckBox;

    title.add(gui.line([
        gui.empty(),
        gui.text('Editable'),
        shapeEditCheckBox = self._shapeEditCheckBox = gui.checkBox({ selected : G.scene.editBox2dVerticesEnabled }, {colspan: 2})
    ]));
    shapeEditCheckBox.onValueChanged = function(checked) {
        if (!target.gameObject._body._rawVertices)
            target.gameObject.body.resetShapeFromBounds();

        G.scene.editBox2dVerticesEnabled = checked;
    };

    if (!self.oldUpdate) {
        self.oldUpdate = self.update;
        self.update = function() {
            self.oldUpdate.call(self);
            if (self._shapeEditCheckBox.selected !== G.scene.editBox2dVerticesEnabled)
                self._shapeEditCheckBox.selected = G.scene.editBox2dVerticesEnabled;
        };
    }

    var useBoundsBtn, useEdgeBtn;

    // 根据 bounds 决定
    title.add(gui.line([
        gui.empty(),
        gui.text('Reset From Bounds'),
        gui.empty(),
        useBoundsBtn = gui.button(G._('Reset'))
    ]));
    useBoundsBtn.on('click', function() {
        target.gameObject.body.resetShapeFromBounds();
        G.scene.updateEditorCanvas();
    });

    // 根据像素边界决定
    if (!target._epsilon) target._epsilon = 3;
    title.add(gui.line([
        gui.empty(),
        gui.text('Reset From Edge'),
        gui.numberInput({ bind : '_epsilon' }),
        useEdgeBtn = gui.button(G._('Reset'), {})
    ]));
    useEdgeBtn.on('click', function() {
        target.gameObject.body.resetShapeFromEdge(target._epsilon);
        G.scene.updateEditorCanvas();
    });
});
