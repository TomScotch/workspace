/**
 * @author chenqx
 * copyright 2015 Qcplay All Rights Reserved.
 */
/**
 * 富文本行的块结构
 */
var RichTextBlock = com.qici.richText.RichTextBlock = function(line, style) {
    var self = this;

    /**
     * @property {com.qici.richText.RichTextLine} line - 块所属的行
     */
    self.line = line;

    /**
     * @property {boolean} isClosed - 块是否结束
     */
    self.isClosed = false;

    /**
     * @property {com.qici.richText.RichTextStyle} style - 块使用的显示风格
     */
    self.style = style;

    /**
     * @property {Array} elements - 块包含的显示元素
     */
    self.elements = [];

    /**
     * @property {Array} elementRects - 块显示范围
     */
    self.elementRects = [];

    /**
     * @property {number} type - 块的类型，0 为文本结构
     */
    self.type = 0;

    /**
     * @property {boolean} isFirstBlockInLine - 是否为行首
     */
    self.isFirstBlockInLine = false;

    /**
     * @property {{x, y, width, height}} rect - 块的主体显示范围
     */
	self.rect = {
        x : 0,
        y : 0,
        width : 0,
        height : 0
    };

    /**
     * @property {{left, right, top, bottom}} margin - 块显示外边距
     */
    self.margin = {
        left : 0,
        right : 0,
        top : 0,
        bottom : 0
    };

    /**
     * @property {number} elementCount - 块内所有显示元素的个数
     */
	self.elementCount = 0;
};

RichTextBlock.prototype = {};
RichTextBlock.prototype.constructor = RichTextBlock;

/**
 * 结束块
 */
RichTextBlock.prototype.close = function() {
    var self = this;
    if (self.isClosed) {
        return;
    }

    self.isClosed = true;

    // 合并最后一个块的范围
    self.line._appendLayout(self);
};

/**
 * 添加显示元素
 */
RichTextBlock.prototype.appendElement = function(element, count, x, y, width, height,
                                                 marginLeft, marginRight, marginTop, marginBottom) {
    var self = this;

    self.elements.push(element);
    self.elementCount += count;
    self.line.elementCount += count;

    var layout = {
        rect : { x: x, y: y, width: width, height: height},
        margin : { left: marginLeft, right: marginRight, top: marginTop, bottom: marginBottom}
    };
    self.elementRects.push(layout);
    // 先按当期模式进行布局处理
    self._appendLayout(layout.rect, layout.margin);
};

/**
 * 添加显示区域
 */
RichTextBlock.prototype._appendLayout = function(rect, margin) {
    var self = this;
    var startX = self.rect.x,
        startY = self.rect.y,
        endX = startX + self.rect.width,
        endY = startY + self.rect.height;
    var mStartX = startX - self.margin.left,
        mStartY = startY - self.margin.top,
        mEndX = endX + self.margin.right,
        mEndY = endY + self.margin.left;

    var charStep = self.line.section.charStep;
    var extra = endX === startX && endY === startY ? 0 : (self.line.elementSpace + self.style.charSpace);
    var addStartX = (endX + extra) * charStep.width + rect.x,
        addStartY = (endY + extra) * charStep.height + rect.y,
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
};

/**
 * 重新计算范围信息
 */
RichTextBlock.prototype.relayout = function() {
    var self = this;
    self.rect.x = self.rect.y = self.rect.width = self.rect.height = 0;
    self.margin.left = self.margin.right = self.margin.top = self.margin.bottom = 0;

    var idx = -1,
        len = self.elementRects.length;
    while (++idx < len) {
        var layout = self.elementRects[idx];
        self._appendLayout(layout.rect, layout.margin);
    }
};

