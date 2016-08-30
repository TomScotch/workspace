/**
 * @author chenqx
 * copyright 2015 Qcplay All Rights Reserved.
 */
/**
 * 富文本行结构
 */
var RichTextLine = com.qici.richText.RichTextLine = function(richTextSection) {
	var self = this;

    /**
     * @property {com.qici.richText.RichTextSection} section - 行所属的块
     */
    self.section = richTextSection;

    /**
     * @property {boolean} isClosed - 行是否已经结束
     */
	self.isClosed = false;

    /**
     * @property {Array} blocks - 行的块
     */
	self.blocks = [];

    /**
     * @property {{x, y, width, height}} rect - 行的主体显示范围
     */
	self.rect = {
        x : 0,
        y : 0,
        width : 0,
        height : 0
    };

    /**
     * @property {{left, right, top, bottom}} margin - 行显示外边距
     */
    self.margin = {
        left : 0,
        right : 0,
        top : 0,
        bottom : 0
    };

    /**
     * @property {number} offset - 对于section的附加偏移
     */
    self.offset = 0;

    /**
     * @property {Array} styles - 行内所有使用的显示风格
     */
	self.styles = [self.section.getCurrStyle()];

    /**
     * @property {number} elementCount - 行内所有显示元素的个数
     */
	self.elementCount = 0;

    /**
     * @property {number} elementSpace - 每个结构的间距
     */
    self.elementSpace = 0;
};

RichTextLine.prototype = {};
RichTextLine.prototype.constructor = RichTextLine;

/**
 * 结束行
 */
RichTextLine.prototype.close = function() {
    var self = this;
    if (self.isClosed)
        return;
    self.isClosed = true;
    // 关闭最后一个块
    self.closeLastBlock();

    // 在行结束后，需要根据当前行最后生效的style.textAlign类型进行重排
    var style = self.styles[self.styles.length - 1];
    var remainSpace = self.remainSpace();
    var textAlign = style.textAlign;
    self.rect.height += Math.max(0, style.getFontHeight() - self.rect.height - self.rect.y);

    if (textAlign === 'end') {
        self.offset = remainSpace;
        self.elementSpace = 0;
    }
    else if (textAlign === 'center') {
        self.offset = remainSpace / 2;
        self.elementSpace = 0;
    }
    else if (textAlign === 'justify') {
        self.offset = 0;
        if (self.elementCount < 2) {
            self.elementSpace = 0;
        }
        else {
            self.elementSpace = remainSpace / (self.elementCount - 1);
        }

        // 设置完间距后，重新进行布局
        self.rect.x = self.rect.y = self.rect.width = self.rect.height = 0;
        self.margin.left = self.margin.right = self.margin.top = self.margin.bottom = 0;
        var blockIdx = -1, blockLen = self.blocks.length;
        while (++blockIdx < blockLen) {
            var block = self.blocks[blockIdx];
            block.relayout();
            self._appendLayout(block);
        }
    }
    else {
        self.offset = 0;
        self.elementSpace = 0;
    }

    // 取最后生效的行间距
    self.lineSpace = style.lineSpace;

    if (style.lineWeight) {
        if (self.section.lineStep.height) {
            self.lineSpace += style.lineWeight - self.rect.height;
        }
        else if (self.section.lineStep.width) {
            self.lineSpace += style.lineWeight - self.rect.width;
        }   
    }

    // 合并最后一行的范围
    self.section._appendLayout(self.rect, self.margin, self.lineSpace);
};

/**
 * 关闭最后一个块
 */
RichTextLine.prototype.closeLastBlock = function() {
    var self = this,
        lastBlock = self.getLastBlock();

    if (!lastBlock || lastBlock.isClosed)
        return;

    lastBlock.close();
};

/**
 * 获取最后的块
 */
RichTextLine.prototype.getLastBlock = function() {
    var self = this,
        blockLen = self.blocks.length;
    return blockLen < 1 ? null : self.blocks[blockLen - 1];
};

/**
 * 获取当前可操作的块
 */
RichTextLine.prototype.getCurrBlock = function() {
    var self = this,
        lastBlock = self.getLastBlock();
    if (!lastBlock || lastBlock.isClosed) {
        lastBlock = new RichTextBlock(this, self.section.getCurrStyle());
        lastBlock.isFirstBlockInLine = self.blocks.length === 0;
        self.blocks.push(lastBlock);
    }
    return lastBlock;
};

/**
 * 添加显示区域
 */
RichTextLine.prototype._appendLayout = function(block) {
    var self = this;
    var rect = block.rect,
        margin = block.margin;
    var startX = self.rect.x,
        startY = self.rect.y,
        endX = startX + self.rect.width,
        endY = startY + self.rect.height;
    var mStartX = startX - self.margin.left,
        mStartY = startY - self.margin.top,
        mEndX = endX + self.margin.right,
        mEndY = endY + self.margin.left;

    var charStep = self.section.charStep;
    var extra = endX === startX && endY === startY ? 0 : (self.elementSpace + block.style.charSpace);
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
 * 获取当前可用来显示的宽度
 */
RichTextLine.prototype.remainSpace = function() {
    var self = this,
        lastBlock = self.getLastBlock();
    var remainSpace = self.section.limitLength - 
                        (self.rect.width + self.rect.x) * self.section.charStep.width -
                        (self.rect.height + self.rect.y) * self.section.charStep.height;
    if (lastBlock && !lastBlock.isClosed) {
        remainSpace -= (self.blocks.length > 1 ? lastBlock.style.charSpace : 0) +
                        (lastBlock.rect.width + lastBlock.rect.x) * self.section.charStep.width +
                        (lastBlock.rect.height + lastBlock.rect.y) * self.section.charStep.height;
    }
    return remainSpace;
};
