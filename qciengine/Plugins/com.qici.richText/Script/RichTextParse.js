/**
 * @author chenqx
 * copyright 2015 Qcplay All Rights Reserved.
 */

/**
 * 富文本解析工具，将富文本解析成为RichTextChunk结构
 */
var RichTextParse = com.qici.richText.RichTextParse = function(string) {
	/**
	 * @property {string} source - 需要解析的文本
	 */
	this.source = string;
	
	this._reset();
};

RichTextParse.prototype = {};
RichTextParse.prototype.constructor = RichTextParse;

/**
 * 解析文本为RichTextChunk结构
 */
RichTextParse.parse = function(text) {
	var instance = RichTextParse._instance || (RichTextParse._instance = new RichTextParse(''));
	instance.source = text;
	return instance.parse();
};

/**
 * 重置环境
 */
RichTextParse.prototype._reset = function() {
	var self = this;
	self._idx = 0;
	self._len = self.source.length;
	self._lastChunk = null;
	self.chunks = [];
};

/**
 * 获取下一个块
 */
RichTextParse.prototype._next = function() {
	var self = this,
		source = self.source,
		start = self._idx,
		len = self._len;

	if (start >= len)
		return null;

	var isBreak = false,
		isSymbol = source[start] === '[',
		firstSplit = len;
	while(!isBreak && ++self._idx < len) {
		switch (source[self._idx]) {
			case ']':
				self._idx++;
				isBreak = true;
				break;
			case '[':
				isBreak = true;
				isSymbol = false;
				break;
			case ' ':
			case '=':
				firstSplit = Math.min(firstSplit, self._idx);
				break;
		}
	}

	var broken = {
		start: start,
		end: self._idx,
		isSymbol: isBreak && isSymbol,
		attributes: {}
	};
	if (broken.isSymbol) {
		broken.selfClose = source[broken.end - 2] === '/';
		broken.isClose = source[broken.start + 1] === '/';
		var define = source.substring(broken.start + (broken.isClose ? 2 : 1),
			broken.end - (broken.selfClose ? 2 : 1));
		var parseTool = new RichTextAttributeParse(define);
		var key, sep, value;
		key = parseTool.nextWord() || '';
		sep = key && parseTool.nextWord();
		value = sep === '=' ? parseTool.nextWord() : true;
		broken.key = key.toLowerCase();
		broken.attributes.value = value;
		do {
			key = parseTool.nextWord();
			if (key === ' ')
				key = parseTool.nextWord();
			sep = key && parseTool.nextWord();
			value = sep === '=' ? parseTool.nextWord() : true;
			if (key) {
				broken.attributes[key.toLowerCase()] = value;	
			}
		} while (key);
	}
	return broken;
};

/**
 * 解析下一个结构块
 */
RichTextParse.prototype._parseNextChunk = function() {
	var self = this,
		source = self.source,
		broken = self._next(),
		lastChunk = self._lastChunk;
	if (!broken)
		return false;

	var currChunk = new RichTextChunk(source);
	if (!broken.isSymbol) {
		currChunk.type = RichTextChunk.TEXT;
		currChunk.tag = 'text';
		currChunk.outer.start = currChunk.inner.start = broken.start;
		currChunk.outer.end = currChunk.inner.end = broken.end;
		currChunk.close = true;
	}
	else if (broken.isClose) {
		while (lastChunk && lastChunk.tag !== broken.key) {
			lastChunk = lastChunk.parent;
		}
		if (lastChunk) {
			lastChunk.close = true;
			lastChunk.outer.end = broken.end;
			lastChunk.inner.end = broken.start;
			currChunk = null;
		}
		else {
			lastChunk = self._lastChunk;
			currChunk.type = RichTextChunk.TEXT;
			currChunk.tag = 'text';
			currChunk.outer.start = currChunk.inner.start = broken.start;
			currChunk.outer.end = currChunk.inner.end = broken.end;
			currChunk.close = true;
		}
		
	}
	else if (broken.selfClose) {
		currChunk.type = RichTextChunk.SYMBOL;
		currChunk.tag = broken.key;
		currChunk.outer.start = broken.start;
		currChunk.outer.end = broken.end;
		currChunk.inner.start = currChunk.inner.end = broken.start;
		currChunk.close = true;
		currChunk.attributes = broken.attributes;
	}
	else {
		currChunk.type = RichTextChunk.SYMBOL;
		currChunk.tag = broken.key;
		currChunk.outer.start = broken.start;
		currChunk.inner.start = broken.end;
		currChunk.close = false;
		currChunk.attributes = broken.attributes;
	}

	while (lastChunk && lastChunk.close) {
		lastChunk = lastChunk.parent;
	}
	if (!currChunk) {
		self._lastChunk = lastChunk;
		return true;
	}
	if (lastChunk) {
		lastChunk.subs.push(currChunk);
		currChunk.parent = lastChunk;
	}
	else {
		self.chunks.push(currChunk);
	}
	self._lastChunk = currChunk;
	return true;
};

/**
 * 生成富文本结构
 */
RichTextParse.prototype.parse = function() {
	var self = this;
	self._reset();
	while (self._parseNextChunk()) {
	}
	return self.chunks;
};