/**
 * 注册富文本类型
 */
qc.Serializer.registerCustomDeserializer('com.qici.richText.RichText', function(game, parent, uuid) {
	return new com.qici.richText.RichText(game, parent, uuid);
});
/**
 * 富文本绘制控制
 */
var RichText = com.qici.richText.RichText = function(game, parent, uuid) {
    var self = this;
    /**
     * @property {Canvas} canvas - 缓存
     */
    self.canvas = document.createElement('canvas');
    /**
     * @property {Context} context - 绘制上下文
     */
    self.context = self.canvas.getContext('2d');

    /**
     * @property {PIXI.Texture} texture - 贴图缓存
     */
    self.texture = PIXI.Texture.fromCanvas(self.canvas);
    self.texture.baseTexture.resolution = game.resolution;

    /**
     * @property {PIXI.Sprite} sprite - 绘制精灵
     */
    var sprite = self.sprite = new PIXI.Sprite(self.texture);

    /**
     * @property {string} text - 需要绘制的文本
     */
    self.text = '';

    /**
     * @property {com.qici.richText.RichTextSymbol} symbol - 富文本使用的符号环境
     */
    self.symbol = new com.qici.richText.RichTextSymbol(game);

    /**
     * @property {com.qici.richText.RichTextStyle} defaultStyle - 富文本默认的样式
     */
    self.defaultStyle =  new com.qici.richText.RichTextStyle(self.symbol, self.context.font);

    /**
     * @property {Array} richTextChunks - 富文本解析的出来的结构块
     * @type {Array}
     */
    self.richTextChunks = [];

    /**
     * @property {com.qici.richText.RichTextSection} richTextSection - 富文本显示块
     */
    self.richTextSection = new com.qici.richText.RichTextSection(this.width, RichTextWrap.BREAK_KEEPALL, self.defaultStyle, 0);
    self.richTextSection.clickHandleContext = self;

    // 调用基类的初始
    qc.Node.call(this, new Phaser.Group(game.phaser, null), parent, uuid);

    /**
     * @property {string} name - 节点名
     */
    self.name = 'RichText';

    self.phaser._renderSelfCanvas = self._renderSelfCanvas;
    self.phaser._renderSelfWebGL = self._renderSelfWebGL;

    self.phaser.transformCallback = self.onUpdateTransform;
    self.phaser.transformCallbackContext = self;

    self._currCanvasScale = 1;
    self._currCanvasScaleDown = 1;
    self._lastChangeTime = -Infinity;
    self.scaleDirtyInterval = 1000;

    self._updateBounds = true;

    self.addListener(self.onClick, self.doClick, self);

    // 设置绘制代理
    self.phaser.setDisplayProxy(self.sprite, false);
};

RichText.prototype = Object.create(qc.Node.prototype);
RichText.prototype.constructor = RichText;

Object.defineProperties(RichText.prototype,{
	/**
     * @property {string} class - 类的名字
     * @internal
     */
    class : {
        get : function() { return 'com.qici.richText.RichText'; }
    },
    /**
     * @property {string} text - 显示的文本
     */
    'text' : {
        get : function() {
            return this._text;
        },

        set : function(v) {
            if (v === this._text)
                return;
            this._text = v;
            this.rebuildChunks();

            this._needUpdateSection = true;
        }
    },

    /**
     * @property {number} order - 文本显示的顺序
     */
    'order' : {
        get : function() {
            return this.richTextSection.charOrder;
        },
        set : function(v) {
            if (v === this.richTextSection.charOrder)
                return;
            this.richTextSection.charOrder = v;
            this.richTextSection.calcStep();

            this._needUpdateSection = true;
        }
    },

    /**
     * @property {number} wrap - 文本的换行模式
     */
    'wrap' : {
        get : function() {
            return this.richTextSection.breakStyle;
        },
        set : function(v) {
            if (v === this.richTextSection.breakStyle)
                return;
            this.richTextSection.breakStyle = v;

            this._needUpdateSection = true;
        }
    },

    /**
     * @property {string} font - 使用的字体
     */
    'font' : {
    	get : function() {
            var fontName = this.defaultStyle.font.replace(/\'/g, "");
    		return fontName;
    	},
    	set : function(v) {
    		if (v === this.font)
    			return;
    		this.defaultStyle.font = v;

    		this._needUpdateSection = true;
    	}
    }, 

    /**
     * @property {number} fontSize - 默认文本大小
     */
    'fontSize' : {
    	get : function() {
    		return this.defaultStyle.fontSize;
    	},
    	set : function(v) {
    		if (v === this.defaultStyle.fontSize)
    			return;
    		this.defaultStyle.fontSize = v;

    		this._needUpdateSection = true;
    	}
    },

    /**
     * @property {boolean} bold - 是否是粗体
     */
    'bold' : {
        get : function() {
            return this.defaultStyle.fontWeight === 'bold';
        },
        set : function(v) {
            if (v === this.bold)
                return;
            this.defaultStyle.fontWeight = v ? 'bold' : 'normal';

            this._needUpdateSection = true;
        }
    },

    /**
     * @property {boolean} italic - 是否为斜体
     */
    'italic' : {
        get : function() {
            return this.defaultStyle.fontStyle === 'italic';
        },
        set : function(v) {
            if (v === this.italic)
                return;
            this.defaultStyle.fontStyle = v ? 'italic' : 'normal';

            this._needUpdateSection = true;
        }
    },

    /**
     * @property {string} color - 默认文本颜色
     */
    'color' : {
    	get : function() {
            return new qc.Color(this.defaultStyle.fontColor);
        },
        set : function(v) {
            if (!(v instanceof qc.Color))
                throw new Error('Expected qc.Color');

            var value = v.toString('rgb');
            if (value === this.defaultStyle.fontColor)
                return;

            this.defaultStyle.fontColor = value;

            this._needUpdateSection = true;
        }
    },

    /**
     * @property {boolean} updateBounds -  是否根据文本大小更新节点大小
     */
    'updateBounds' : {
        get : function() {
            return this._updateBounds;
        },
        set : function(v) {
            if (v === this._updateBounds)
                return;
            this._updateBounds = v;
            this._needUpdateSection = true;

            this._resizeNode();
        }
    }
});

RichText.prototype.getMeta = function() {
    var json = qc.Node.prototype.getMeta.call(this);
    var Serializer = qc.Serializer;

    // 增加UIText需要序列化的内容
    json.text = Serializer.STRING;
    json.wrap = Serializer.NUMBER;
    json.order = Serializer.NUMBER;

    // json.fontFamily = Serializer.NUMBER;
    // json.alignH = Serializer.NUMBER;
    // json.alignV = Serializer.NUMBER;
    json.font = Serializer.FONT;
    json.bold = Serializer.BOOLEAN;
    json.italic = Serializer.BOOLEAN;
    json.fontSize = Serializer.NUMBER;
    json.color = Serializer.COLOR;
    // json.lineSpace = Serializer.NUMBER;
    // json.charSpace = Serializer.NUMBER;
    json.updateBounds = Serializer.BOOLEAN;
    return json;
};

/**
 * @method onDestroy
 * @overide
 * @internal
 */
RichText.prototype.onDestroy = function() {
    var self = this;

    self.phaser.transformCallback = null;
    self.phaser.transformCallbackContext = null;
    self.richTextSection.clickHandleContext = null;

    // 调用父类的析构
    qc.Node.prototype.onDestroy.call(self);
};

/**
 * 设置节点的宽度
 * @protected
 * @override
 */
RichText.prototype.setWidth = function(w) {
    var self = this;
    qc.Node.prototype.setWidth.call(self, w);
    if (self.richTextSection.charStep.width &&
        self.richTextSection.limitLength !== w) {
        self.richTextSection.limitLength = w;
        self._needUpdateSection = true;
    }
};

/**
 * 设置节点的高度
 * @protected
 * @override
 */
RichText.prototype.setHeight = function(h) {
    var self = this;
    qc.Node.prototype.setHeight.call(self, h);
    if (self.richTextSection.charStep.height &&
        self.richTextSection.limitLength !== h) {
        self.richTextSection.limitLength = h;
        self._needUpdateSection = true;
    }
};

/**
 * 更新
 */
RichText.prototype.update = function() {
	var self = this;

	if (self._needUpdateSection) {
		self.rebuildSection();
		self._needUpdateSection = false;
	}
};

/**
 * 点击处理
 */
RichText.prototype.doClick = function(gameObject, event) {
    var self = this;
    var point = self.toLocal(event.source);

    self.richTextSection.onClick(point.x, point.y);
};

/**
 * 当UpdateTransform更新时
 */
RichText.prototype.onUpdateTransform = function() {
    var self = this,
        sprite = self.sprite,
        section = self.richTextSection;
    var wt = self.phaser.worldTransform;
    var worldScale = self.getWorldScale();
    var canvasScaleX = Math.max(0.2, Math.min(10, Math.abs(worldScale.x)));
    var canvasScaleY = Math.max(0.2, Math.min(10, Math.abs(worldScale.y)));
    var resolution = self.game.resolution;
    var isDesktop = self.game.device.desktop;
    var gameWorldWidth = isDesktop ?  1920 : Math.max(960, self.game.world.width);
    var gameWorldHeight = isDesktop ?  1920 : Math.max(960, self.game.world.height);

    if (canvasScaleX * resolution * section.rect.width > gameWorldWidth) {
        canvasScaleX = gameWorldWidth / (section.rect.width * resolution);
    }
    if (canvasScaleY * resolution * section.rect.height > gameWorldHeight) {
        canvasScaleY = gameWorldHeight / (section.rect.height * resolution);
    }
    var canvasScale = Math.min(canvasScaleX, canvasScaleY);
    var fixedTime = self.game.time.fixedTime;
    var lastChangeTime = self._lastChangeTime || 0;
    if (canvasScale !== self._currCanvasScale && 
        fixedTime - lastChangeTime > self.scaleDirtyInterval) {
        self._currCanvasScale = canvasScale;
        self._lastChangeTime = fixedTime;
        self._needUpdateSection = true;
    }
    if (sprite.tint !== self.phaser.tint) {
        sprite.tint = self.phaser.tint;
    }
    
    var st = sprite.worldTransform;
    st.a = wt.a * self._currCanvasScaleDown;
    st.b = wt.b * self._currCanvasScaleDown;
    st.c = wt.c * self._currCanvasScaleDown;
    st.d = wt.d * self._currCanvasScaleDown;
    st.tx = wt.tx | 0;
    st.ty = wt.ty | 0;
};

/**
 * 重建富文本结构
 */
RichText.prototype.rebuildChunks = function() {
    var self = this;
    self.richTextChunks = com.qici.richText.RichTextParse.parse(self._text);
};

/**
 * 重置缓存大小
 */
RichText.prototype._resizeCanvas = function(width, height) {
	var self = this;
    var resolution = self.texture.baseTexture.resolution = self.game.resolution;
    self.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
    width = width * resolution * self._currCanvasScale;
    height = height * resolution * self._currCanvasScale;
    width = Math.max(1, Math.ceil(width));
    height = Math.max(1, Math.ceil(height));

	self.canvas.width = self.texture.frame.width =
        self.texture.baseTexture.width = self.texture.width =
        self.texture.crop.width = width;

	self.canvas.height = self.texture.frame.height =
        self.texture.baseTexture.height = self.texture.height =
        self.texture.crop.height = height;

    self._currCanvasScaleDown = 1 / self._currCanvasScale;

	self.context.setTransform(1, 0, 0, 1, 0, 0);
	self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);

    self.context.scale(resolution * self._currCanvasScale, resolution * self._currCanvasScale);
};

/**
 * 更新外部范围
 */
RichText.prototype._resizeNode = function() {
    var self = this;
    if (!self._updateBounds)
        return;
    if (self.width !== self.richTextSection.rect.width)
        self.width = self.richTextSection.rect.width;
    if (self.height !== self.richTextSection.rect.height)
        self.height = self.richTextSection.rect.height;
};

/**
 * 重新刷新显示内容
 */
RichText.prototype.rebuildSection = function() {
    var self = this,
        section = self.richTextSection;
    section.build(self.context, self.richTextChunks);
    self._resizeNode();
    self.rebuildTexture();
};

/**
 * 重新绘制显示内容
 */
RichText.prototype.rebuildTexture = function() {
    var self = this,
        section = self.richTextSection;
    /**
     * 更新缓存大小
     */
    self._resizeCanvas(section.rect.width + section.margin.left + section.margin.right,
                      section.rect.height + section.margin.top + section.margin.bottom);

    /**
     * 绘制
     */
    section.render(self.context, section.margin.left | 0, section.margin.top | 0);
    self.texture.baseTexture.dirty();
    self.sprite.cachedTint = self.sprite.tint - 1; 
    self.sprite.displayChanged(qc.DisplayChangeStatus.TEXTURE | qc.DisplayChangeStatus.SIZE);
    self.phaser.displayChanged(qc.DisplayChangeStatus.TEXTURE | qc.DisplayChangeStatus.SIZE);
};

/**
 * 在Canvas环境下绘制
 */
RichText.prototype._renderSelfCanvas = function(renderSession) {
	var self = this,
        sprite = self._qc.sprite;
	sprite._renderCanvas(renderSession);
};

/**
 * 在WebGL环境下绘制
 */
RichText.prototype._renderSelfWebGL = function(renderSession) {
	var self = this,
        sprite = self._qc.sprite;
	sprite._renderWebGL(renderSession);
};