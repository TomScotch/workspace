/**
 * @author chenqx
 * copyright 2015 Qcplay All Rights Reserved.
 */
/**
 * 富文本段
 */
var RichTextSection = com.qici.richText.RichTextSection = function(limit, breakStyle, defaultStyle, order) {
	var self = this;

	/**
     * @property {Array} lines - 解析后所有的行
     */
    self.lines = [];

	/**
	 * @property {number} limitLength - 每行限制的长度
	 */
	self.limitLength = limit;

    /**
     * @property {number} breakStyle - 行打断类型
     */
    self.breakStyle = breakStyle;

	/**
	 * @property {{x, y, width, height}} rect - 富文本块的主体显示范围
	 */
	self.rect = {
        x : 0,
        y : 0,
        width : 0,
        height : 0
    };

    /**
     * @property {{left, right, top, bottom}} margin - 富文本块的主体显示外边界
     */
    self.margin = {
        left : 0,
        right : 0,
        top : 0,
        bottom : 0
    };

	/**
	 * @property {Array} _styles - 当前生效的样式
	 */
	self._styles = [];

	/**
	 * @property {com.qici.richText.RichTextStyle} defualtStyle - 默认样式
	 */
	self.defaultStyle = defaultStyle;

    /**
     * @property {Array} lineSpaces - 所有行的行间距
     */
    self.lineSpaces = [];

    /**
     * @property {number} charOrder - 文本显示顺序
     */
    self.charOrder = order || 0;

    /**
     * 交互的上下文对象
     */
    self.clickHandleContext = null;

    self.calcStep();
};

RichTextSection.prototype = {};
RichTextSection.prototype.constructor = RichTextSection;

/**
 * 重置结构
 */
RichTextSection.prototype.reset = function() {
	var self = this;
    self.lines = [];
	self._styles = [];
	self.rect = {
        x : 0,
        y : 0,
        width : 0,
        height : 0
    };
    self.margin = {
        left : 0,
        right : 0,
        top : 0,
        bottom : 0
    };
};

/**
 * 结束最后一行
 */
RichTextSection.prototype.closeLastLine = function() {
    var self = this,
        lastLine = self.getLastLine();

    if (!lastLine || lastLine.isClosed)
        return;

    lastLine.close();
};

/**
 * 获取实际的最后一行
 */
RichTextSection.prototype.getLastLine = function() {
	var self = this,
        lineLen = self.lines.length;
	return lineLen < 1 ? null : self.lines[lineLen - 1];
};

/**
 *  获取最后一个块
 */
RichTextSection.prototype.getLastBlock = function() {
	var self = this,
		lastLine = self.getLastLine();
	if (!lastLine)
		return null;
	return lastLine.getLastBlock();
};

/**
 * 获取当前可操作的行
 */
RichTextSection.prototype.getCurrLine = function() {
	var self = this,
		lastLine = self.getLastLine();
	if (!lastLine || lastLine.isClosed) {
        // 行结构
        lastLine = new RichTextLine(this);
        self.lines.push(lastLine);
	}
	return lastLine;
};

/**
 * 获取当前的可操作的块
 */
RichTextSection.prototype.getCurrBlock = function() {
	var self = this,
		line = self.getCurrLine();
    return line.getCurrBlock();
};

/**
 * 获取当前生效的样式
 */
RichTextSection.prototype.getCurrStyle = function() {
	var self = this,
        styleLen = self._styles.length;
	return styleLen < 1 ? self.defaultStyle : self._styles[styleLen - 1];
};

/**
 * 设置当前使用的style
 */
RichTextSection.prototype.pushStyle = function(style) {
	var self = this,
		lastLine = self.getLastLine(),
		lastBlock = self.getLastBlock();
	if (lastBlock && !lastBlock.isClosed) {
		lastBlock.close();
	}
	if (lastLine && !lastLine.isClosed) {
		lastLine.styles.push(style);
	}
	self._styles.push(style);
};

/**
 * 返回上一个style
 */
RichTextSection.prototype.popStyle = function() {
	var self = this,
		lastBlock = self.getLastBlock();
	if (lastBlock && !lastBlock.isClosed) {
		lastBlock.close();
	}
	var pop = self._styles.pop();
	if (!pop) {
		pop = self.defaultStyle;
	}
	return pop;
};

/**
 * 获取布局的字步进参数
 */
RichTextSection.prototype.calcStep = function() {
    var self = this;
    var reverseLine = (self.charOrder & 0x0f) !== 0;
    switch((self.charOrder & 0xf0) >>> 4) {
        case 1:
            self.charStep = { x : -1, y : 0, width : 1, height : 0, xRatio : -1, yRatio : 0 };
            self.lineStep = { x : 0, y : reverseLine ? -1 : 1, width : 0, height : 1, xRatio : 0, yRatio : reverseLine ? -1 : 0 };
            break;
        case 2:
            self.charStep = { x : 0, y : 1, width : 0, height : 1, xRatio : 0, yRatio : 0 };
            self.lineStep = { x : reverseLine ? -1 : 1, y : 0, width : 1, height : 0, xRatio : reverseLine ? -1 : 0, yRatio : 0 };
            break;
        case 3:
            self.charStep = { x : 0, y : -1, width : 0, height : 1, xRatio : 0, yRatio : -1 };
            self.lineStep = { x : reverseLine ? -1 : 1, y : 0, width : 1, height : 0, xRatio : reverseLine ? -1 : 0, yRatio : 0 };
            break;
        default:
            self.charStep = { x : 1, y : 0, width : 1, height : 0, xRatio : 0, yRatio : 0 };
            self.lineStep = { x : 0, y : reverseLine ? -1 : 1, width : 0, height : 1, xRatio : 0, yRatio : reverseLine ? -1 : 0 };
            break;
    }
};

/**
 * 添加一个字符串
 */
RichTextSection.prototype.appendElement = function(type, element, count, x, y, width, height,
                                                   marginLeft, marginRight, marginTop, marginBottom){
    var self = this,
        lastBlock = self.getLastBlock();
    if (!lastBlock || lastBlock.type !== type || lastBlock.isClosed) {
        if (lastBlock)
            lastBlock.close();
        lastBlock = self.getCurrBlock();
        lastBlock.type = type;
    }

    lastBlock.appendElement(element, count, x, y, width, height,
                            marginLeft, marginRight, marginTop, marginBottom);
};

/**
 * 添加显示区域
 */
RichTextSection.prototype._appendLayout = function(rect, margin, lineSpace) {
    var self = this;
    var startX = self.rect.x,
        startY = self.rect.y,
        endX = startX + self.rect.width,
        endY = startY + self.rect.height;

    var mStartX = startX - self.margin.left,
        mStartY = startY - self.margin.top,
        mEndX = endX + self.margin.right,
        mEndY = endY + self.margin.left;
    var lineStep = self.lineStep;

    if (lineStep.height)
        endX = self.limitLength;
    else if (lineStep.width)
        endY = self.limitLength;

    var extra = self.lineSpaces[self.lineSpaces.length - 1] || 0;
    var addStartX = (endX + extra) * lineStep.width + rect.x,
        addStartY = (endY + extra) * lineStep.height + rect.y,
        addEndX = addStartX + rect.width,
        addEndY = addStartY + rect.height;

    self.rect.x = Math.min(startX, addStartX);
    self.rect.y = Math.min(startY, addStartY);
    self.rect.width = Math.max(endX, addEndX) - self.rect.x;
    self.rect.height = Math.max(endY, addEndY) - self.rect.y;

    mStartX = Math.min(mStartX, addStartX - margin.left);
    mStartY = Math.min(mStartY, addStartY - margin.top);
    mEndX = Math.max(mEndX, addEndX + margin.right);
    mEndY = Math.max(mEndY, addEndY + margin.bottom);

    // 外边距最小为0
    self.margin.left = Math.max(0, self.rect.x - mStartX);
    self.margin.right = Math.max(0, mEndX - self.rect.x - self.rect.width);
    self.margin.top = Math.max(0, self.rect.y - mStartY);
    self.margin.bottom = Math.max(0, mEndY - self.rect.y - self.rect.height);

    // 将行间距添加到列表中
    self.lineSpaces.push(lineSpace);
};

/**
 * 生成主体结构
 */
RichTextSection.prototype._buildLines = function(context, chunks, symbol) {
    if (!chunks || chunks.length === 0) {
		return;
	}
	var self = this,
        style = self.getCurrStyle();

	var idx = -1, len = chunks.length;
    var chunkStyle, result;
	while (++idx < len) {
		var chunk = chunks[idx];
		if (chunk.type === RichTextChunk.SYMBOL &&
            (chunkStyle = symbol.getSymbolStyle(chunk.tag, chunk.attributes, style))) {
            style = style.mixin(chunkStyle);
            self.pushStyle(style);
            if (chunkStyle.onEnable) {
                result = chunkStyle.onEnable(self);
                if (result) {
                    self._buildLines(context, result, symbol);
                }
            }

            self._buildLines(context, chunk.subs, symbol);

            if (chunkStyle.onDisable) {
                result = chunkStyle.onDisable(self);
                if (result) {
                    self._buildLines(context, result, symbol);
                }
            }
            self.popStyle();
            style = self.getCurrStyle();
		}
		else {
			RichTextWrap.wrapChunk(self, context, self.breakStyle, chunk);
		}
	}
};

/**
 * 将富文本结构构建显示段
 */
RichTextSection.prototype.build = function(context, chunks) {
    var self = this,
    	symbol = self.defaultStyle.symbol;
    self.reset();
    self._buildLines(context, chunks, symbol);
    self.closeLastLine();
};

/**
 * 添加富文本结构到显示段
 */
RichTextSection.prototype.append = function(context, chunks, closeLine) {
    var self = this,
        symbol = self.defaultStyle.symbol;
    self._buildLines(context, chunks, symbol);
    if (closeLine)
        self.closeLastLine();
};

RichTextSection.prototype.contains = function (a, x, y) {
    if (a.width <= 0 || a.height <= 0)
    {
        return false;
    }

    return (x >= a.x && x < a.x + a.width && y >= a.y && y < a.y + a.height);

};

/**
 * 点击富文本区域
 */
RichTextSection.prototype.onClick = function(clickX, clickY) {
    var self = this;
    var lines = self.lines;
    var lineStep = self.lineStep,
        charStep = self.charStep;
    
    var lineOffX = - lineStep.xRatio * (self.rect.width + self.rect.x),
        lineOffY = - lineStep.yRatio * (self.rect.height + self.rect.y);

    var offX = lineOffX, 
        offY = lineOffY;

    var lineIdx, line, lineSpace, blocks, blockIdx, block, layout, extra;
    var elementIdx, elementLength, elementRect;

    for (lineIdx = 0; lineIdx < lines.length; ++lineIdx) {
        line = lines[lineIdx];
        lineSpace = self.lineSpaces[lineIdx];
        extra = line.elementSpace;
        blocks = line.blocks;
        lineOffX += lineStep.xRatio * line.rect.width;
        lineOffY += lineStep.yRatio * line.rect.height;
        offX = lineOffX - charStep.xRatio * self.limitLength + charStep.x * line.offset;
        offY = lineOffY - charStep.yRatio * self.limitLength + charStep.y * line.offset;
        if ((lineStep.width && (clickX >= offX && clickX <= offX + line.rect.width)) ||
            (lineStep.height && (clickY >= offY && clickY <= offY + line.rect.height))) {
            for (blockIdx = 0; blockIdx < blocks.length; ++blockIdx) {
                block = blocks[blockIdx];
                offX += charStep.xRatio * block.rect.width + charStep.x * (blockIdx === 0 ? 0 :  block.style.charSpace);
                offY += charStep.yRatio * block.rect.height + charStep.y * (blockIdx === 0 ? 0 :  block.style.charSpace);
                
                if (self.contains(block.rect, clickX - offX, clickY - offY)) {
                    if (block.style) {
                        block.style.onClick(self.clickHandleContext, block, clickX, clickY);
                    }
                    return;
                }
                offX += charStep.x * ((1 + charStep.xRatio) * block.rect.width + extra * (block.elementCount - 1));
                offY += charStep.y * ((1 + charStep.yRatio) * block.rect.height + extra * (block.elementCount - 1));
            }    
        }
        lineOffX += lineStep.x * ((1 + lineStep.xRatio) * line.rect.width + line.lineSpace);
        lineOffY += lineStep.y * ((1 + lineStep.yRatio) * line.rect.height + line.lineSpace);
    }
};


RichTextSection.prototype._loopElement = function(context, x, y, func) {
    var self = this;
    var lines = self.lines;
    var lineStep = self.lineStep,
        charStep = self.charStep;
    
    var lineOffX = x - lineStep.xRatio * (self.rect.width + self.rect.x),
        lineOffY = y - lineStep.yRatio * (self.rect.height + self.rect.y);

    var offX = lineOffX, 
        offY = lineOffY;

    var lineIdx, line, lineSpace, blocks, blockIdx, block, layout, extra;
    var elementIdx, elementLength, elementRect;

    for (lineIdx = 0; lineIdx < lines.length; ++lineIdx) {
        line = lines[lineIdx];
        lineSpace = self.lineSpaces[lineIdx];
        extra = line.elementSpace;
        blocks = line.blocks;
        lineOffX += lineStep.xRatio * line.rect.width;
        lineOffY += lineStep.yRatio * line.rect.height;
        offX = lineOffX - charStep.xRatio * self.limitLength + charStep.x * line.offset;
        offY = lineOffY - charStep.yRatio * self.limitLength + charStep.y * line.offset;
        for (blockIdx = 0; blockIdx < blocks.length; ++blockIdx) {
            block = blocks[blockIdx];
            if (block && block.style) {
                elementIdx = -1;
                elementLength = block.elements.length;
                while (++elementIdx < elementLength) {
                    elementRect = block.elementRects[elementIdx];
                    offX += charStep.xRatio * elementRect.rect.width + charStep.x * (blockIdx === 0 && elementIdx === 0 ? 0 :  block.style.charSpace);
                    offY += charStep.yRatio * elementRect.rect.height + charStep.y * (blockIdx === 0 && elementIdx === 0 ? 0 :  block.style.charSpace);
                    func(context, block, elementIdx, offX, offY);
                    offX += charStep.x * ((1 + charStep.xRatio) * elementRect.rect.width + extra);
                    offY += charStep.y * ((1 + charStep.yRatio) * elementRect.rect.height + extra);
                }
            }
        }
        lineOffX += lineStep.x * ((1 + lineStep.xRatio) * line.rect.width + line.lineSpace);
        lineOffY += lineStep.y * ((1 + lineStep.yRatio) * line.rect.height + line.lineSpace);
    }
};

RichTextSection.prototype._doPreDrawElement = function(context, block, elementIdx, x, y) {
    if (block.style)
        block.style.preDraw(context, block, elementIdx, x, y);
};

RichTextSection.prototype._doDrawElement = function(context, block, elementIdx, x, y) {
    if (block.style)
        block.style.drawElement(context, block, elementIdx, x, y);
};

RichTextSection.prototype._doPostDrawElement = function(context, block, elementIdx, x, y) {
    if (block.style)
        block.style.postDraw(context, block, elementIdx, x, y);
};

/**
 * 绘制富文本块
 */
RichTextSection.prototype.render = function(context, x, y) {
    var self = this;
    self._loopElement(context, x, y, self._doPreDrawElement);
    self._loopElement(context, x, y, self._doDrawElement);
    self._loopElement(context, x, y, self._doPostDrawElement);
};

/**
 * 从左至右，从上至下显示
 * @constant
 * @type {Number}
 */
RichTextSection.LTR_TTB = 0x00;

/**
 * 从左至右，从下至上显示
 * @constant
 * @type {Number}
 */
RichTextSection.LTR_BTT = 0x01;

/**
 * 从右至左，从上至下显示
 * @constant
 * @type {Number}
 */
RichTextSection.RTL_TTB = 0x10;

/**
 * 从右至左，从下至上显示
 * @constant
 * @type {Number}
 */
RichTextSection.RTL_BTT = 0x11;

/**
 * 从上至下，从左至右显示
 * @constant
 * @type {Number}
 */
RichTextSection.TTB_LTR = 0x20;

/**
 * 从上至下，从右至左显示
 * @constant
 * @type {Number}
 */
RichTextSection.TTB_RTL = 0x21;

/**
 * 从下至上, 从左至右显示
 * @constant
 * @type {Number}
 */
RichTextSection.BTT_LTR = 0x30;

/**
 * 从下至上，从右至左显示
 * @constant
 * @type {Number}
 */
RichTextSection.BTT_RTL = 0x31;