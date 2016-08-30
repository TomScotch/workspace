/**
 * @author chenqx
 * copyright 2015 Qcplay All Rights Reserved.
 */
/**
 * RichText结构模块
 */
var RichTextChunk = com.qici.richText.RichTextChunk = function(source) {
	var self = this;
	/**
	 * @property {number} type - 模块的类型
	 */
	self.type = RichTextChunk.TEXT;
	/**
	 * @property {string} tag - 模块的标签
	 */
	self.tag = 'text';
	/**
	 * @property {null | RichTextChunk} - 模块的父节点
	 */
	self.parent = null;
	/**
	 * @property {string} source - 原始文本
	 */
	self.source = source;
	/**
	 * @property {Object} attributes - 模块的属性值
	 */
	self.attributes = {};
	/**
	 * @property {Array} subs - 子节点
	 */
	self.subs = [];
	/**
	 * @property {string} inner - 模块包含的文本内容
	 */
	self.inner = {
		source: source,
		start: 0,
		end: source.length,
		toString : function() {
			return this.source.substring(this.start, this.end);
		}
	};
	/**
	 * @property {string} outer - 模块完整的描述的文本
	 */
	self.outer = {
		source: source,
		start : 0,
		end : source.length,
		toString : function() {
			return this.source.substring(this.start, this.end);
		}
	};
};

RichTextChunk.prototype = {};
RichTextChunk.prototype.constructor = RichTextChunk;

/**
 * 文本模块类型
 */
RichTextChunk.TEXT = 0;

/**
 * 固定块
 */
RichTextChunk.BLOCK = 1;

/**
 * 功能模块
 */
RichTextChunk.SYMBOL = 2;
