/**
 * @author lijh
 * 粒子系统查看面板
 * copyright 2015 Qcplay All Rights Reserved.
 */

 // 注册语言包
qc.editor.Language['GameObject/ParticleSystem'] = {
    zh: '游戏对象/粒子系统'
};
qc.editor.Language['ParticleSystem'] = {
    zh: '粒子系统'
};

// 注册qc.ParticleSystem对应的查看面板
G.e.on(G.e.GAME_INIT_OK, function() {
    G.inspector._nodesMap.push([qc.ParticleSystem, qc.editor.ParticleSystemPanel]);

    var func = function() {
        var node = new qc.ParticleSystem(G.game, G.hierarchy.activeNode);
        G.hierarchy.activeNode = node;
        G.dataModel.addNodeForUndo(node);
    };

    // 扩展菜单项
    G.menu.addItem(G._('GameObject/ParticleSystem'), func);
    G.hierarchy.addMenuItem(G._('Create'), {
        'label': G._('ParticleSystem'),
        'func' : func
    });
});

var ParticleSystemPanel = qc.widget.Default.define('qc.editor.ParticleSystemPanel', qc.editor.Panel,
    function ParticleSystemPanel(target) {
        var self = this;
        ParticleSystemPanel.super.constructor.call(self, target);

        self.title = 'ParticleSystem';
        self.icon = 'inspector_image';
        self.checkable = false;
        self.removable = false;

        // 关注节点可视状态变化并重绘面板
        self.target.onVisibleChanged.add(function() { self.repaint(); }, self);
    }
);

/**
 * 绘制属性面板
 */
ParticleSystemPanel.prototype.paint = function() {
    var self = this;
    var target = self.target;
    var gui = qc.editor.gui;

    gui.columnWidths = ["50+0.5", "50+0.5"];

    // 控制按钮
    if (target.isWorldVisible()) {
        // 分隔线
        gui.line([
            gui.divider(null, { colspan: 2 })
        ]);

        var btn1, btn2;
        gui.line([
            btn1 = gui.button(target.paused ? 'Start' : 'Pause'),
            btn2 = gui.button('Stop')
        ]);
        btn1.on('click', function() {
            if (target.paused) {
                target.start();
            }
            else {
                target.pause();
            }

            self.repaint();
        });
        btn2.on('click', function() {
            // 重置发射器并暂停
            target.reset();
            target.pause();

            self.repaint();
        });

        // 分隔线
        gui.line([
            gui.divider(null, { colspan: 2 })
        ]);
    }

    self.paintParticleSystem();
};

/*
 * 绘制粒子系统信息
 */
ParticleSystemPanel.prototype.paintParticleSystem = function() {
    var self = this;
    var target = self.target;
    var gui = qc.editor.gui;

    gui.columnWidths = ["120+0.1", "30+0.05", "25+0.4", "30+0.05", "25+0.4"];

    // 绘制基础信息
    self.paintBasic();

    // 绘制扩展信息
    self.paintExtend();
};

/**
 * 绘制基础信息
 */
ParticleSystemPanel.prototype.paintBasic = function() {
    var self = this;
    var target = self.target;
    var gui = qc.editor.gui;

    // 粒子使用的图片
    self.drawTexture();

    var oldColumnWidths = gui.columnWidths;
    gui.columnWidths = ["120+0.1", "40+0.05", "25+0.4", "40+0.05", "25+0.4"];

    // 发射区域
    var title = gui.titleLine('Zone');
    var zoneTypeInput;
    title.add(gui.line([
        gui.empty(),
        gui.text('Type', { toolTip: G._('CParticleSystem.zoneType')}),
        zoneTypeInput = gui.dropDownList({bind: 'zoneType', items: [
            { label: 'Point',       value: qc.ParticleSystem.Zones.Zone.POINT      },
            { label: 'Line',        value: qc.ParticleSystem.Zones.Zone.LINE       },
            { label: 'Circle',      value: qc.ParticleSystem.Zones.Zone.CIRCLE     },
            { label: 'Rectangle',   value: qc.ParticleSystem.Zones.Zone.RECTANGLE  }
        ]}, { colspan: 3 })
    ]));
    zoneTypeInput.onPropertyChanged = function() {
        target.reset();
        target.start();
        self.repaint();
    };

    // 发射区域数据
    var zoneType = target.zoneType;
    if (zoneType === qc.ParticleSystem.Zones.Zone.POINT) {
        // 点
    }
    else if (zoneType === qc.ParticleSystem.Zones.Zone.LINE) {
        // 线
        var inputLength, inputRotation;
        title.add(gui.line([
            gui.empty(),
            gui.text('Length', { toolTip: G._('CParticleSystem.zoneLength')}),
            inputLength = gui.intInput({ bind: 'zoneLength' }),
            gui.text('Rotation', { toolTip: G._('CParticleSystem.zoneRotation')}),
            inputRotation = gui.intInput({ bind: 'zoneRotation' })
        ]));

        inputLength.onPropertyChanged = inputRotation.onPropertyChanged = function() {
            target.reset();
            target.start();
        };
    }
    else if (zoneType === qc.ParticleSystem.Zones.Zone.CIRCLE) {
        // 圆
        var inputRadius;
        title.add(gui.line([
            gui.empty(),
            gui.text('Radius', { toolTip: G._('CParticleSystem.zoneRadius')}),
            inputRadius = gui.intInput({ bind: 'zoneRadius' }, { colspan: 3 })
        ]));

        inputRadius.onPropertyChanged = function() {
            target.reset();
            target.start();
        };
    }
    else if (zoneType === qc.ParticleSystem.Zones.Zone.RECTANGLE) {
        // 矩形
        var inputWidth, inputHeight;
        title.add(gui.line([
            gui.empty(),
            gui.text('Width', { toolTip: G._('CParticleSystem.zoneWidth')}),
            inputWidth = gui.intInput({ bind: 'zoneWidth' }),
            gui.text('Height', { toolTip: G._('CParticleSystem.zoneHeight')}),
            inputHeight = gui.intInput({ bind: 'zoneHeight' })
        ]));

        inputWidth.onPropertyChanged = inputHeight.onPropertyChanged = function() {
            target.reset();
            target.start();
        };
    }

    gui.columnWidths = oldColumnWidths;

    // 边缘发射
    if (zoneType === qc.ParticleSystem.Zones.Zone.RECTANGLE ||
        zoneType === qc.ParticleSystem.Zones.Zone.CIRCLE) {
        var inputEdgeEmission;
        title.add(gui.line([
            gui.empty(),
            gui.text('Edge Emissioin', { toolTip: G._('CParticleSystem.edgeEmission') }, { colspan: 2, align: 'right' }),
            inputEdgeEmission = gui.checkBox({ bind: 'edgeEmission'}, { colspan: 2 })
        ]));

        inputEdgeEmission.onPropertyChanged = function(v) {
            target.reset();
            target.start();
        };
    }

    var inputEmissionSpace;
    gui.line([
        gui.text('Emission Space', { toolTip: G._('CParticleSystem.emissionSpace')}),
        inputEmissionSpace = gui.dropDownList({bind: 'emissionSpace', items: [
            { label: 'World',       value: qc.ParticleSystem.EmissionSpace.WORLD      },
            { label: 'Local',       value: qc.ParticleSystem.EmissionSpace.LOCAL      }
        ]}, { colspan: 4 })
    ]);

    inputEmissionSpace.onPropertyChanged = function(v) {
        target.reset();
        target.start();
    };

    // 发射频率
    var inputFrequency;
    gui.line([
        gui.text('Frequency', { toolTip: G._('CParticleSystem.frequency')}),
        inputFrequency = gui.numberInput({ bind: 'frequency'}, { colspan: 4 })
    ]);
    inputFrequency.onPropertyChanged = function() {
        target.reset();
        target.start();
    };

    // 每次发射的粒子数
    gui.line([
        gui.text('Quantity', { toolTip: G._('CParticleSystem.quantity')}),
        gui.intInput({ bind: 'quantity'}, { colspan: 4 })
    ]);

    // 重复发射次数
    var inputRepeat;
    gui.line([
        gui.text('Repeat', { toolTip: G._('CParticleSystem.repeat')}),
        inputRepeat = gui.intInput({ bind: 'repeat'}, { colspan: 4 })
    ]);
    inputRepeat.onPropertyChanged = function() {
        target.reset();
        target.start();
    };

    // 发射延迟
    var intpuDelay;
    gui.line([
        gui.text('Delay', { toolTip: G._('CParticleSystem.delay')}),
        inputDelay = gui.numberInput({ bind: 'delay' }, { colspan: 4 }),
    ]);
    inputDelay.onPropertyChanged = function() {
        target.reset();
        target.start();
    };

    // 粒子生命时长
    gui.line([
        gui.text('Lifespan', { toolTip: G._('CParticleSystem.lifespan')}),
        gui.text('Min'),
        gui.numberInput({ bind: 'lifespan[0]'}),
        gui.text('Max', { align: 'center' }),
        gui.numberInput({ bind: 'lifespan[1]'})
    ]);

    // 粒子发射角度
    gui.line([
        gui.text('Angle', { toolTip: G._('CParticleSystem.angle')}),
        gui.text('Min'),
        gui.intInput({ bind: 'angle[0]' }),
        gui.text('Max', { align: 'center' }),
        gui.intInput({ bind: 'angle[1]' })
    ]);

    // 混合模式
    var inputBlendMode;
    gui.line([
        gui.text('Blend Mode', { toolTip: G._('CParticleSystem.blendMode')}),
        inputBlendMode = gui.dropDownList({bind: 'blendMode', items: [
            { label: 'Normal',      value: Phaser.blendModes.NORMAL     },
            { label: 'Add',         value: Phaser.blendModes.ADD        },
            { label: 'Multiply',    value: Phaser.blendModes.MULTIPLY   },
            { label: 'Screen',      value: Phaser.blendModes.SCREEN     }
        ]}, { colspan: 4 })
    ]);
    inputBlendMode.onPropertyChanged = function() {
        target.clear();
    };

    // 粒子颜色
    var colorPicker1, colorPicker2;
    gui.line([
        gui.text('Start Color', { toolTip: G._('CParticleSystem.startColor')}),
        colorPicker1 = gui.colorPicker({bind: 'startColor', 'dropDown.colorChooser.alphaEnabled': false}, { colspan: 2 }),
        gui.text('Δ', { toolTip: G._('CParticleSystem.startColorVariation'), align: 'center' }),
        gui.intInput({ bind: 'startColorVariation' })
    ]);
    gui.line([
        gui.text('End Color', { toolTip: G._('CParticleSystem.endColor')}),
        colorPicker2 = gui.colorPicker({bind: 'endColor', 'dropDown.colorChooser.alphaEnabled': false}, { colspan: 2 }),
        gui.text('Δ', { toolTip: G._('CParticleSystem.endColorVariation'), align: 'center' }),
        gui.intInput({ bind: 'endColorVariation' })
    ]);
    colorPicker1.value = target.startColor;
    colorPicker2.value = target.endColor;

    // 初始透明度
    gui.line([
        gui.text('Start Alpha', { toolTip: G._('CParticleSystem.startAlpha')}),
        gui.text('Min'),
        gui.numberInput({ bind: 'startAlpha[0]' }),
        gui.text('Max', { align: 'center' }),
        gui.numberInput({ bind: 'startAlpha[1]' })
    ]);

    // 初始缩放
    gui.line([
        gui.text('Start Scale', { toolTip: G._('CParticleSystem.startScale')}),
        gui.text('Min'),
        gui.numberInput({ bind: 'startScale[0]' }),
        gui.text('Max', { align: 'center' }),
        gui.numberInput({ bind: 'startScale[1]' })
    ]);

    // 初始速度
    gui.line([
        gui.text('Start Velocity', { toolTip: G._('CParticleSystem.startVelocity')}),
        gui.text('Min'),
        gui.intInput({ bind: 'startVelocity[0]' }),
        gui.text('Max', { align: 'center' }),
        gui.intInput({ bind: 'startVelocity[1]' })
    ]);

    // 初始旋转
    gui.line([
        gui.text('Start Rotation', { toolTip: G._('CParticleSystem.startRotation')}),
        gui.text('Min'),
        gui.intInput({ bind: 'startRotation[0]' }),
        gui.text('Max', { align: 'center' }),
        gui.intInput({ bind: 'startRotation[1]' })
    ]);

    // 初始角速度
    gui.line([
        gui.text('Angular Velocity', { toolTip: G._('CParticleSystem.angularVelocity')}),
        gui.text('Min'),
        gui.intInput({bind: 'angularVelocity[0]'}),
        gui.text('Max', { align: 'center' }),
        gui.intInput({bind: 'angularVelocity[1]'})
    ]);

    // 粒子系统重力
    gui.line([
        gui.text('Gravity', { toolTip: G._('CParticleSystem.gravity')}),
        gui.text('X'),
        gui.intInput({ bind: 'gravity.x' }),
        gui.text('Y', { align: 'center' }),
        gui.intInput({ bind: 'gravity.y' })
    ]);

    // 粒子数量上限
    gui.line([
        gui.text('Max Particles', { toolTip: G._('CParticleSystem.maxParticles')}),
        gui.intInput({ bind: 'maxParticles' }, {colspan:4})
    ]);

    // 是否自动播放
    gui.line([
        gui.text('PlayOnAwake', { toolTip: G._('CParticleSystem.playOnAwake') }),
        gui.checkBox({ bind: 'playOnAwake' })
    ]);
};

// 绘制扩展信息
ParticleSystemPanel.prototype.paintExtend = function() {
    var self = this;
    var target = self.target;
    var gui = qc.editor.gui;

    // 分隔线
    gui.line([
        gui.divider(null, { colspan: 5 })
    ]);

    // 绘制粒子帧动画信息
    if (self.drawImageSequence()) {
        // 分隔线
        gui.line([
            gui.divider(null, { colspan: 5 })
        ]);
    }

    // 绘制颜色曲线控制模块
    self.drawColorCurve();

    // 分隔线
    gui.line([
        gui.divider(null, { colspan: 5 })
    ]);

    // 透明度控制曲线
    self.drawAlphaCurve();

    // 分隔线
    gui.line([
        gui.divider(null, { colspan: 5 })
    ]);

    // 缩放控制曲线
    self.drawScaleCurve();

    // 分隔线
    gui.line([
        gui.divider(null, { colspan: 5 })
    ]);

    // 粒子发射速度控制曲线
    self.drawVelocityCurve();

    // 分隔线
    gui.line([
        gui.divider(null, { colspan: 5 })
    ]);

    // 角速度控制曲线
    self.drawAngularVelocityCurve();

    // 分隔线
    gui.line([
        gui.divider(null, { colspan: 5 })
    ]);
};

/**
 * 绘制颜色曲线控制模块
 */
ParticleSystemPanel.prototype.drawColorCurve = function() {
    var self = this;
    var target = self.target;
    var gui = qc.editor.gui;

    var inputEnableColorCurve;
    var btnColorCurve;
    if (self.target.enableColorCurve) {
        gui.line([
            gui.text('Color over Lifespan', { toolTip: G._('CParticleSystem.colorCurve') }, {colspan: 2, fill:'h', vAlign: 'middle'}),
            inputEnableColorCurve = gui.checkBox({ bind: 'enableColorCurve' }, {fill:'h', vAlign: 'middle'}),
            btnColorCurve = gui.curveButton({ }, { colspan: 2 })
        ], 60);

        btnColorCurve.bezierCurve = target.colorCurve;
        btnColorCurve.onEndEditCurve = function() {
            target.clear();
        };
    }
    else {
        gui.line([
            gui.text('Color over Lifespan', { toolTip: G._('CParticleSystem.colorCurve') }, {colspan: 2, fill:'h', vAlign: 'middle'}),
            inputEnableColorCurve = gui.checkBox({ bind: 'enableColorCurve' }, {fill:'h', vAlign: 'middle'})
        ]);
    }

    var oldValue = self.target.enableColorCurve;
    inputEnableColorCurve.onValueChanged = function(v) {
        if (v !== oldValue) {
            target.reset();
            target.start();

            self.repaint();
        }
    };
};

/**
 * 绘制透明度曲线控制模块
 */
ParticleSystemPanel.prototype.drawAlphaCurve = function() {
    var self = this;
    var target = self.target;
    var gui = qc.editor.gui;

    var inputEnableAlphaCurve;
    var btnAlphaCurve;
    if (self.target.enableAlphaCurve) {
        gui.line([
            gui.text('Alpha over Lifespan', { toolTip: G._('CParticleSystem.alphaCurve') }, {colspan: 2, fill:'h', vAlign: 'middle'}),
            inputEnableAlphaCurve = gui.checkBox({ bind: 'enableAlphaCurve' }, {fill:'h', vAlign: 'middle'}),
            btnAlphaCurve = gui.curveButton({ }, { colspan: 2 })
        ], 60);

        btnAlphaCurve.bezierCurve = target.alphaCurve;
        btnAlphaCurve.onEndEditCurve = function() {
            target.clear();
        };
    }
    else {
        gui.line([
            gui.text('Alpha over Lifespan', { toolTip: G._('CParticleSystem.alphaCurve') }, {colspan: 2, fill:'h', vAlign: 'middle'}),
            inputEnableAlphaCurve = gui.checkBox({ bind: 'enableAlphaCurve' }, {fill:'h', vAlign: 'middle'})
        ]);
    }

    var oldValue = self.target.enableAlphaCurve;
    inputEnableAlphaCurve.onValueChanged = function(v) {
        if (v !== oldValue) {
            target.reset();
            target.start();

            self.repaint();
        }
    };
};

/**
 * 绘制缩放曲线控制模块
 */
ParticleSystemPanel.prototype.drawScaleCurve = function() {
    var self = this;
    var target = self.target;
    var gui = qc.editor.gui;

    var inputEnableScaleCurve;
    var btnScaleCurve;
    if (self.target.enableScaleCurve) {
        gui.line([
            gui.text('Scale over Lifespan', { toolTip: G._('CParticleSystem.scaleCurve') }, {colspan: 2, fill:'h', vAlign: 'middle'}),
            inputEnableScaleCurve = gui.checkBox({ bind: 'enableScaleCurve' }, {fill:'h', vAlign: 'middle'}),
            btnScaleCurve = gui.curveButton({ }, { colspan: 2 })
        ], 60);

        btnScaleCurve.bezierCurve = target.scaleCurve;
        btnScaleCurve.onEndEditCurve = function() {
            target.clear();
        };
    }
    else {
        gui.line([
            gui.text('Scale over Lifespan', { toolTip: G._('CParticleSystem.scaleCurve') }, {colspan: 2, fill:'h', vAlign: 'middle'}),
            inputEnableScaleCurve = gui.checkBox({ bind: 'enableScaleCurve' }, {fill:'h', vAlign: 'middle'})
        ]);
    }

    var oldValue = self.target.enableScaleCurve;
    inputEnableScaleCurve.onValueChanged = function(v) {
        if (v !== oldValue) {
            target.reset();
            target.start();

            self.repaint();
        }
    };
};

/**
 * 绘制速度曲线控制模块
 */
ParticleSystemPanel.prototype.drawVelocityCurve = function() {
    var self = this;
    var target = self.target;
    var gui = qc.editor.gui;

    var inputEnableVelocityCurve;
    var btnVelocityCurve;
    if (self.target.enableVelocityCurve) {
        gui.line([
            gui.text('Velocity over Lifespan', { toolTip: G._('CParticleSystem.velocityCurve') }, {colspan: 2, fill:'h', vAlign: 'middle'}),
            inputEnableVelocityCurve = gui.checkBox({ bind: 'enableVelocityCurve' }, {fill:'h', vAlign: 'middle'}),
            btnVelocityCurve = gui.curveButton({ }, { colspan: 2 })
        ], 60);

        btnVelocityCurve.bezierCurve = target.velocityCurve;
        btnVelocityCurve.onEndEditCurve = function() {
            target.clear();
        };
    }
    else {
        gui.line([
            gui.text('Velocity over Lifespan', { toolTip: G._('CParticleSystem.velocityCurve') }, {colspan: 2, fill:'h', vAlign: 'middle'}),
            inputEnableVelocityCurve = gui.checkBox({ bind: 'enableVelocityCurve' }, {fill:'h', vAlign: 'middle'})
        ]);
    }

    var oldValue = self.target.enableVelocityCurve;
    inputEnableVelocityCurve.onValueChanged = function(v) {
        if (v !== oldValue) {
            target.reset();
            target.start();

            self.repaint();
        }
    };
};

/**
 * 绘制角速度曲线控制模块
 */
ParticleSystemPanel.prototype.drawAngularVelocityCurve = function() {
    var self = this;
    var target = self.target;
    var gui = qc.editor.gui;

    var inputEnableAngularVelocityCurve;
    var btnAngularVelocityCurve;
    if (self.target.enableAngularVelocityCurve) {
        gui.line([
            gui.text('AngularVelocity over Lifespan', { toolTip: G._('CParticleSystem.angularVelocityCurve') }, {colspan: 2, fill:'h', vAlign: 'middle'}),
            inputEnableAngularVelocityCurve = gui.checkBox({ bind: 'enableAngularVelocityCurve' }, {fill:'h', vAlign: 'middle'}),
            btnAngularVelocityCurve = gui.curveButton({ }, { colspan: 2 })
        ], 60);

        btnAngularVelocityCurve.bezierCurve = target.angularVelocityCurve;
        btnAngularVelocityCurve.onEndEditCurve = function() {
            target.clear();
        };
    }
    else {
        gui.line([
            gui.text('AngularVelocity over Lifespan', { toolTip: G._('CParticleSystem.angularVelocityCurve') }, {colspan: 2, fill:'h', vAlign: 'middle'}),
            inputEnableAngularVelocityCurve = gui.checkBox({ bind: 'enableAngularVelocityCurve' }, {fill:'h', vAlign: 'middle'})
        ]);
    }

    var oldValue = self.target.enableAngularVelocityCurve;
    inputEnableAngularVelocityCurve.onValueChanged = function(v) {
        if (v !== oldValue) {
            target.reset();
            target.start();

            self.repaint();
        }
    };
};

/**
 *
 */
ParticleSystemPanel.prototype.drawImageSequence = function() {
    var self = this;
    var target = self.target;
    var gui = qc.editor.gui;

    // 如果是 spriteSheet，绘制动画信息
    if (!target.texture.atlas.meta.spriteSheet)
        return false;

    var title = gui.titleLine('Sprite Sheet Animation');

    var inputInitialFrame, inputInitialFrameVariation;
    title.add(gui.line([
        gui.text('Initial Frame', { toolTip: G._('CParticleSystem.initialFrame') }),
        gui.text('Min'),
        inputInitialFrame = gui.intInput({ bind: 'initialFrame[0]'}),
        gui.text('Max', { align: 'center' }),
        inputInitialFrameVariation = gui.intInput({ bind: 'initialFrame[1]'})
    ]));

    inputInitialFrame.onPropertyChanged = inputInitialFrameVariation.onPropertyChanged = function() {
        target.reset();
        target.start();
    };

    var inputFrameRate, inputFrameRateVariation;
    title.add(gui.line([
        gui.text('Frame Rate', { toolTip: G._('CParticleSystem.frameRate') }),
        gui.text('Min'),
        inputFrameRate = gui.numberInput({ bind: 'frameRate[0]'}),
        gui.text('Max', { align: 'center' }),
        inputFrameRateVariation = gui.numberInput({ bind: 'frameRate[1]'})
    ]));

    inputFrameRate.onPropertyChanged = inputFrameRateVariation.onPropertyChanged = function() {
        target.reset();
        target.start();
    };

    return true;
};

/**
 * 绘制图片帧列表
 */
ParticleSystemPanel.prototype.drawTexture = function() {
    var self = this;
    var target = self.target;
    var gui = qc.editor.gui;
    var texture = target.texture;

    // 绘制图集引用
    var field = 'texture';
    gui.line([
        gui.text('Texture', { toolTip: G._('CParticleSystem.texture')}),
        gui.objectInput({ objectType: 'texture', target: target, targetField: field, bind: field, onValueChanged: function() {
            self.repaint();
        }, bindTarget: target}, { colspan: 4 })
    ]);
};
