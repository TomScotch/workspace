/**
 * @author chenqx
 * copyright 2015 Qcplay All Rights Reserved.
 */
/**
 * 富文本表情注册脚本
 */
var RichTextEmoji = qc.defineBehaviour('com.qici.richText.RichTextEmoji', qc.Behaviour, function() {
	var self = this;

	/**
	 * @property {string} packageName - 表情包名
	 */
	self.packageName = 'emoji';

	/**
	 * @property {qc.Atlas} packageAtlas - 表情包
	 */
	self.packageAtlas = null;
}, {
	richText : qc.Serializer.NODE,
	packageName: qc.Serializer.STRING,
	packageAtlas: qc.Serializer.TEXTURE
});

// 菜单上的显示
RichTextEmoji.__menu = 'UI/RichText/RichTextEmoji';

Object.defineProperties(RichTextEmoji.prototype,{
	/**
	 * @property {string} packageName - 表情包名
	 */
	'packageName' : {
		get : function() {
			return this._packageName;
		},
		set : function(v) {
			if (v === this._packageName)
				return;
			this.unregisterEmoji();
			this._packageName = v;
			this.registerEmoji();
		}
	},
	/**
	 * @property {qc.Atlas} packageAtlas - 表情包
	 */
	'packageAtlas' : {
		get : function() {
			return this._packageAtlas;
		},
		set : function(v) {
			if (v === this._packageAtlas)
				return;
			this.unregisterEmoji();
			this._packageAtlas = v;
			this.registerEmoji();
		}
	},
	/**
	 * @property {qc.Node} richText - 注册到的富文本对象
	 */
	'richText' : {
		get : function() {
			return this._richText;
		},
		set : function(v) {
			if (v === this._richText)
				return;
			this.unregisterEmoji();
			this._richText = v;
			this.registerEmoji();
		}
	}
});

/**
 * 启用
 */
RichTextEmoji.prototype.onEnable = function() {
    this.registerEmoji();
};

/**
 * 停用
 */
RichTextEmoji.prototype.onDisable = function() {
    this.unregisterEmoji();
};

/**
 * 注册表情
 */
RichTextEmoji.prototype.registerEmoji = function() {
	var self = this;
	if (!self._richText ||
		!self._packageAtlas)
		return;

	if (!self.enable) 
		return;
	var symbol = self._richText.symbol;
	symbol.registerEmoji(self._packageName, self._packageAtlas);
};

/**
 * 反注册表情
 */
RichTextEmoji.prototype.unregisterEmoji = function() {
	var self = this;
	if (!self._richText ||
		!self._packageAtlas)
		return;
	var symbol = self._richText.symbol;
	symbol.unregisterEmoji(self._packageName, self._packageAtlas);
};

