/**
 * @author chenqx
 * copyright 2015 Qcplay All Rights Reserved.
 */
/**
 * 富文本处理类型
 */
var RichTextStyle = com.qici.richText.RichTextStyle = function(symbol, cssFont) {
	var self = this;

	/**
	 * @property {com.qici.richText.RichTextSymbol} symbol - 当前富文本的解析环境
	 */
	self.symbol = symbol || new RichTextSymbol();

	/**
	 * @property {object} _fontComponents - 字体详细属性
	 */
	self._fontComponents = {};

	/**
	 * @property {string} cssFont - 当前使用的字体
	 */
	self.cssFont = cssFont;

	/**
	 * @property {string} fontColor - 文本颜色
	 */
	self.fontColor = 'rgb(0, 0, 0)';

	/**
	 * @property {string} drawStyle - 绘制文字的方式
	 *
	 * 可选值：fill | stroke
	 * 可以通过RichTextStyle.registerDrawStyle注册自己的绘制方式
	 */
	self.drawStyle = 'fill';

	/**
	 * @property {string} textAlign - 文本行的对齐方式
	 *
	 * 可选值：start | end | center | justify
	 */
	self.textAlign = 'left';

	/**
	 * @property {string} verticalAlgin - 文本竖直对齐方式
	 *
	 * 可选值：top | middle | bottom
	 */
	self.verticalAlign = 'bottom';

	/**
	 * @property {number} lineSpace - 行间距
	 */
	self.lineSpace = 0;

	/**
	 * @property {number} charSpace - 字间距，当前标记后的每个字符
	 */
	self.charSpace = 0;

	/**
	 * @property {function} preDrawHandle - 绘制之前的调用
	 */
	self.preDrawHandle = null;

	/**
	 * @property {function} preDrawElementHandle - 绘制块前调用
	 */
	self.preDrawElementHandle = null;

	/**
	 * @property {function} drawElementHandle - 绘制块
	 */
	self.drawElementHandle = null;

	/**
	 * @property {function} postDrawElementHandle - 绘制块完成后调用
	 */
	self.postDrawElementHandle = null;

	/**
	 * @property {function} postDrawHandle - 绘制之后的调用
	 */
	self.postDrawHandle = null;

	/**
	 * @property {function} onClickHandle - 点击事件处理
	 */
	self.onClickHandle = null;

	/**
	 * @property {function} measureHandle - 计算块的显示属性
	 */
	self.measureHandle = null;
};

RichTextStyle.prototype = {};
RichTextStyle.prototype.constuctor = RichTextStyle;

Object.defineProperties(RichTextStyle.prototype,{
	/**
	 * @property {string} cssFont - css字体描述
	 */
	cssFont : {
		get : function() {
			return this._cssFont;
		},
		set : function(v) {
			v = v || 'bold 20pt Arial';
			this._fontComponents = this._fontToComponents(v);
			this.refreshFont();
		}
	},

	/**
	 * @property {string} font -  字体描述
	 */
	font : {
		get : function() {
			return this._fontComponents.fontFamily;
		},
		set : function(value) {
			value = value || 'Arial';
			value = value.trim();
			// If it looks like the value should be quoted, but isn't, then quote it.
	        if (!/^(?:inherit|serif|sans-serif|cursive|fantasy|monospace)$/.exec(value) && !/['",]/.exec(value))
	        {
	            value = "'" + value + "'";
	        }

	        this._fontComponents.fontFamily = value;
	        this.refreshFont();
		}
	},

	/**
	 * @property {number} fontSize - 字体大小
	 */
	fontSize : {
		get : function() {
			var size = this._fontComponents.fontSize;
		    if (size && /(?:^0$|px$)/.exec(size))
		    {
		        return parseInt(size, 10);
		    }
		    else
		    {
		        return size;
		    }		
		},
		set : function(size) {
			size = size || '0';
			if (typeof size === 'number') {
				size = size + 'px';
			}
			this._fontComponents.fontSize = size;
			this.refreshFont();
		}
	},

	/**
	 * @property {string} fontWeight - 字体粗细
	 */
	fontWeight : {
	    get: function() {
	        return this._fontComponents.fontWeight || 'normal';
	    },

	    set: function(value) {

	        value = value || 'normal';
	        this._fontComponents.fontWeight = value;
	        this.refreshFont();

	    }
	},

	/**
	 * @property {string} fontStyle - 字体样式
	 */
	fontStyle : {
	    get: function() {
	        return this._fontComponents.fontStyle || 'normal';
	    },

	    set: function(value) {
	        value = value || 'normal';
	        this._fontComponents.fontStyle = value;
	        this.refreshFont();
	    }
	},

	/**
	 * @property {string} fontVariant - 字体变种
	 */
	fontVariant : {
	    get: function() {
	        return this._fontComponents.fontVariant || 'normal';
	    },

	    set: function(value) {

	        value = value || 'normal';
	        this._fontComponents.fontVariant = value;
	        this.refreshFont();
	    }
	}
});

/**
 * 获取字体
 */
RichTextStyle.prototype.getFont = function() {
	var self = this;
	return self._cssFont;
};

/**
 * 获取字体高度
 */
RichTextStyle.prototype.getFontHeight = function() {
	var self = this;
	return self._fontHeight;
};

/**
 * 测量Word尺寸
 */
RichTextStyle.prototype.measureWord = function(context, word, charStep) {
	var self = this;
	context.font = self.getFont();
	var x = 0,
		y = 0,
		endX = 0,
		endY = 0;
	var idx = -1,
		len = word.length;
	var rect, width;
	if (self.measureHandle) {
		while (++idx < len) {
			rect = self.measureHandle(context, self, word[idx]);
			x = Math.min(x, rect.x + endX * charStep.width);
			y = Math.min(y, rect.y + endY * charStep.height);
			endX = Math.max(endX, rect.x + endX * charStep.width + rect.width);
			endY = Math.max(endY, rect.y + endY * charStep.height + rect.height);
		}
	}
	else {
		while (++idx < len) {
			width = context.measureText(word[idx]).width;
			endX = Math.max(endX, endX * charStep.width + width);
			endY = Math.max(endY, endY * charStep.height + self._fontHeight);
		}
	}
	
	return {
		x : x,
		y : y,
		width : endX - x,
		height : endY - y
	};
};

/**
 * 测量文本宽度
 */
RichTextStyle.prototype.measure = function(context, body) {
	var self = this;
	var rect;
	context.font = self.getFont();
	
	if (self.measureHandle) {
		rect = self.measureHandle(context, self, body);
	}
	else {
		rect = {
			x : 0,
			y : 0,
			width : context.measureText(body).width,
			height : self._fontHeight
		};
	}
	return rect;
};

/**
 * 刷新样式参数
 */
RichTextStyle.prototype.refreshFont = function() {
	var self = this;

	self._cssFont = self._componentsToFont(self._fontComponents);
	self._fontHeight = self._determineFontProperties().fontSize;
};

/**
 * 混合一个样式
 */
RichTextStyle.prototype.mixin = function(style) {
	var self = this;
	var mixin = new RichTextStyle(self.symbol, self.cssFont);
	var idx = 0;
	var keys = Object.keys(self);
	for (idx = 0; idx < keys.length; ++idx) {
		if (keys[idx][0] === '_')
			continue;
		if (typeof self[keys[idx]] !== 'function' || 
			keys[idx].indexOf('Handle'))
			mixin[keys[idx]] = self[keys[idx]];
	}

	keys = Object.keys(style);
	for (idx = 0; idx < keys.length; ++idx) {
		mixin[keys[idx]] = style[keys[idx]];
	}
	return mixin;
};

/**
 * 正式绘制之前的准备工作
 */
RichTextStyle.prototype.preDraw = function(context, block, elementIdx, x, y) {
	var self = this;
	if (self.preDrawHandle) {
		self.preDrawHandle(context, block, elementIdx, x, y);
	}
};

/**
 * 绘制元素
 */
RichTextStyle.prototype.drawElement = function(context, block, elementIdx, x, y) {
	var self = this;
	if (self.verticalAlign === 'bottom') {
		x += (block.line.rect.width - block.rect.width) * block.line.section.lineStep.width;
		y += (block.line.rect.height - block.rect.height) * block.line.section.lineStep.height;
	}
	else if (self.verticalAlign === 'middle') {
		x += (block.line.rect.width - block.rect.width) / 2 * block.line.section.lineStep.width;
		y += (block.line.rect.height - block.rect.height) / 2 * block.line.section.lineStep.height;
	}

	if (self.preDrawElementHandle) {
		self.preDrawElementHandle(context, block, elementIdx, x, y);
	}

	context.font = self.getFont();
	var drawFunction = self.symbol.getDrawStyle(self.drawStyle);

	if (self.drawElementHandle) {
		self.drawElementHandle(context, block, elementIdx, x, y);
	}
	else if (drawFunction) {
		drawFunction(context, block, elementIdx, x, y);
	}

	if (self.postDrawElementHandle) {
		self.postDrawElementHandle(context, block, elementIdx, x, y);
	}
};

/**
 * 正式绘制之后的收尾工作
 */
RichTextStyle.prototype.postDraw = function(context, block, elementIdx, x, y) {
	var self = this;
	if (self.postDrawHandle) {
		self.postDrawHandle(context, block, elementIdx, x, y);
	}
};

/**
 * 添加点击
 */
RichTextStyle.prototype.onClick = function(clickContext, block, x, y) {
	var self = this;
	if (self.onClickHandle) {
		self.onClickHandle(clickContext, block, x, y);
	}
};

/**
 * 从字体获取描述
 */
RichTextStyle.prototype._fontToComponents = function (font) {
    // The format is specified in http://www.w3.org/TR/CSS2/fonts.html#font-shorthand:
    // style - normal | italic | oblique | inherit
    // variant - normal | small-caps | inherit
    // weight - normal | bold | bolder | lighter | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | inherit
    // size - xx-small | x-small | small | medium | large | x-large | xx-large,
    //        larger | smaller
    //        {number} (em | ex | ch | rem | vh | vw | vmin | vmax | px | mm | cm | in | pt | pc | %)
    // font-family - rest (but identifiers or quoted with comma separation)
    var m = font.match(/^\s*(?:\b(normal|italic|oblique|inherit)?\b)\s*(?:\b(normal|small-caps|inherit)?\b)\s*(?:\b(normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900|inherit)?\b)\s*(?:\b(xx-small|x-small|small|medium|large|x-large|xx-large|larger|smaller|0|\d*(?:[.]\d*)?(?:%|[a-z]{2,5}))?\b)\s*(.*)\s*$/);

    if (m)
    {
        return {
            font: font,
            fontStyle: m[1] || 'normal',
            fontVariant: m[2] || 'normal',
            fontWeight: m[3] || 'normal',
            fontSize: m[4] || 'medium',
            fontFamily: m[5]
        };
    }
    else
    {
        console.warn("RichTextStyle - unparsable CSS font: " + font);
        return {
            font: font
        };
    }
};

/**
 * 获取字体描述
 */
RichTextStyle.prototype._componentsToFont = function (components) {
    var parts = [];
    var v;

    v = components.fontStyle;
    if (v && v !== 'normal') { parts.push(v); }

    v = components.fontVariant;
    if (v && v !== 'normal') { parts.push(v); }

    v = components.fontWeight;
    if (v && v !== 'normal') { parts.push(v); }

    v = components.fontSize;
    if (v && v !== 'medium') { parts.push(v); }

    v = components.fontFamily;
    if (v) { parts.push(v); }

    if (!parts.length)
    {
        // Fallback to whatever value the 'font' was
        parts.push(components.font);
    }

    return parts.join(" ");
};

/**
 * 获取字体高度属性
 */
RichTextStyle.fontPropertiesCache = {};
RichTextStyle.prototype._determineFontProperties = function() {
	var cssFont = this._cssFont;
    var properties = RichTextStyle.fontPropertiesCache[cssFont];

    if (!properties)
    {
        properties = {};
        if (!RichTextStyle.fontPropertiesCanvas) {
            RichTextStyle.fontPropertiesCanvas = document.createElement('canvas');
            RichTextStyle.fontPropertiesContext = RichTextStyle.fontPropertiesCanvas.getContext('2d');
        }
        var canvas = RichTextStyle.fontPropertiesCanvas;
        var context = RichTextStyle.fontPropertiesContext;

        context.font = cssFont;

        var width = Math.ceil(context.measureText('|MÉq').width);
        if (width === 0) width = 1;
        var baseline = Math.ceil(context.measureText('M').width);

        var height = 2 * baseline;
        if (height === 0) height = 1;

        baseline = baseline * 1.4 | 0;

        canvas.width = width;
        canvas.height = height;

        context.fillStyle = '#f00';
        context.fillRect(0, 0, width, height);

        context.font = cssFont;

        context.textBaseline = 'alphabetic';
        context.fillStyle = '#000';
        context.fillText('|MÉq', 0, baseline);

        var imagedata = context.getImageData(0, 0, width, height).data;
        var pixels = imagedata.length;
        var line = width * 4;

        var i, j;

        var idx = 0;
        var stop = false;

        // ascent. scan from top to bottom until we find a non red pixel
        for (i = 0; i < baseline; i++)
        {
            for (j = 0; j < line; j += 4)
            {
                if (imagedata[idx + j] !== 255)
                {
                    stop = true;
                    break;
                }
            }
            if (!stop)
            {
                idx += line;
            }
            else
            {
                break;
            }
        }

        properties.ascent = baseline - i;

        idx = pixels - line;
        stop = false;

        // descent. scan from bottom to top until we find a non red pixel
        for (i = height; i > baseline; i--)
        {
            for (j = 0; j < line; j += 4)
            {
                if (imagedata[idx + j] !== 255)
                {
                    stop = true;
                    break;
                }
            }
            if (!stop)
            {
                idx -= line;
            }
            else
            {
                break;
            }
        }

        properties.descent = i - baseline;

        properties.fontSize = properties.ascent + properties.descent;

        RichTextStyle.fontPropertiesCache[cssFont] = properties;
    }

    return properties;
};