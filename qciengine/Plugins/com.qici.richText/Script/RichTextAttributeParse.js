/**
 * @author chenqx
 * copyright 2015 Qcplay All Rights Reserved.
 */
/**
 * 用来解析富文本标记中的属性文本
 */
var RichTextAttributeParse = com.qici.richText.RichTextAttributeParse = function(text) {
	var self = this;

	/**
	 * @property {string} text - 需要解析的文本
	 */
	self.text = text;
	/**
	 * @property {string} idx - 当前解析到的位置
	 */
	self.idx = 0;
};

RichTextAttributeParse.prototype = {};
RichTextAttributeParse.prototype.constructor = RichTextAttributeParse;

/**
 * 重置解析进度
 */
RichTextAttributeParse.prototype.reset = function() {
	this.idx = 0;
};

/**
 * 返回下一个属性定义词
 * 1 特殊字符通过\进行转义
 * 2 被'', ""包含的文本块作为一个单元
 * 3 单元通过 =, ' ', '\t' 进行分隔
 * 4 忽略前后多余的空格
 */
RichTextAttributeParse.prototype.nextWord = function() {
	var text = this.text;
	var len = text.length;
	var char = text[this.idx];
	var isSeparate = char === ' ' || char === '\t';

	// 整合连续的分隔符
	if (isSeparate) {
		do {
			char = text[++this.idx];
		} while (char === ' ' || char === '\t');
	}
	if (this.idx >= len) {
		return null;
	}
	if (char === '=') {
		do {
			char = text[++this.idx];
		} while (char === ' ' || char === '\t');
		return '=';
	}
	else if (isSeparate) {
		// 空白作为分隔符时需要单独返回
		return ' ';
	}
	var buffer = [];
	do {
		if (char === '\\') {
			if (this.idx < len - 1) {
				buffer.push(text[++this.idx]);
			}
		}
		else if (char === "'" || char === '"') {
			// 进入文本段
			var endChar = text[++this.idx];
			do {
				if (endChar === '\\') {
					if (this.idx < len - 1) {
						buffer.push(text[++this.idx]);
					}
				}
				else if (endChar === char) {
					break;
				}
				else {
					buffer.push(endChar);
				}
				endChar = text[++this.idx];
			} while (this.idx < len);
		}
		else if (char === ' ' || char === '\t' || char === '=') {
			break;
		}
		else {
			buffer.push(char);
		}
		char = text[++this.idx];
	} while (this.idx < len);

	return buffer.join('');
};
