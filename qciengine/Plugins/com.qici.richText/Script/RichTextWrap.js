/**
 * @author chenqx
 * copyright 2015 Qcplay All Rights Reserved.
 */
/**
 * 富文本换行处理
 */
var RichTextWrap = com.qici.richText.RichTextWrap = {};

/**
 * 普通模式的换行。
 * 英文以空白字符进行词分割，以词为单位进行换行，当词的宽度度大于最大宽度时，以每个字母为单位换行。
 * 中文一单个字进行换行。
 * 部分后缀符号，如，。！等不会出现在行首。
 * 部分前缀符号，如《 “ ‘ 不会出现在行尾
 * @constant
 * @type {Number}
 */
RichTextWrap.BREAK_NORMAL = 0;

/**
 * 以单个字符为单位，只要超过限制宽度，就换行。
 * @constant
 * @type {Number}
 */
RichTextWrap.BREAK_BREAKALL = 1;

/**
 * 除了主动换行符外，不换行。
 * @constant
 * @type {Number}
 */
RichTextWrap.BREAK_KEEPALL = 2;

/**
 * 普通符号类型，可以位于行首也能位于行尾
 * @constant
 * @type {Number}
 */
RichTextWrap.SP_NORMAL = 0;

/**
 * 前缀符号类型，不能出现在行尾
 * @constant
 * @type {Number}
 */
RichTextWrap.SP_PREFIX = 1;

/**
 * 后缀符号类型，不能出现在行首
 * @constant
 * @type {Number}
 */
RichTextWrap.SP_SUFFIX = 2;

/**
 * 中日韩符号的符号类型表
 * 范围：0x3000~0x303f
 * @type {Array}
 */
RichTextWrap.CJK_SP = [
	RichTextWrap.SP_SUFFIX, // ID SP
	RichTextWrap.SP_SUFFIX, // 、
	RichTextWrap.SP_SUFFIX, // 。
	RichTextWrap.SP_SUFFIX, // 〃
	RichTextWrap.SP_NORMAL, // 〄
	RichTextWrap.SP_NORMAL, // 々
	RichTextWrap.SP_NORMAL, // 〆
	RichTextWrap.SP_NORMAL, // 〇
	RichTextWrap.SP_PREFIX, //〈
	RichTextWrap.SP_SUFFIX, // 〉
	RichTextWrap.SP_PREFIX, //《
	RichTextWrap.SP_SUFFIX, // 》
	RichTextWrap.SP_PREFIX, //「
	RichTextWrap.SP_SUFFIX, // 」
	RichTextWrap.SP_PREFIX, //『
	RichTextWrap.SP_SUFFIX, // 』
	RichTextWrap.SP_PREFIX, //【
	RichTextWrap.SP_SUFFIX, // 】
	RichTextWrap.SP_NORMAL, // 〒
	RichTextWrap.SP_NORMAL, // 〓
	RichTextWrap.SP_PREFIX, //〔
	RichTextWrap.SP_SUFFIX, // 〕
	RichTextWrap.SP_PREFIX, //〖
	RichTextWrap.SP_SUFFIX, // 〗
	RichTextWrap.SP_PREFIX, //〘
	RichTextWrap.SP_SUFFIX, // 〙
	RichTextWrap.SP_PREFIX, // 〚
	RichTextWrap.SP_SUFFIX, // 〛
	RichTextWrap.SP_SUFFIX, // 〜
	RichTextWrap.SP_PREFIX, //〝
	RichTextWrap.SP_SUFFIX, // 〞
	RichTextWrap.SP_SUFFIX, // 〟
	RichTextWrap.SP_NORMAL, // 〠
	RichTextWrap.SP_NORMAL, // 〡
	RichTextWrap.SP_NORMAL, // 〢
	RichTextWrap.SP_NORMAL, // 〣
	RichTextWrap.SP_NORMAL, // 〤
	RichTextWrap.SP_NORMAL, // 〥
	RichTextWrap.SP_NORMAL, // 〦
	RichTextWrap.SP_NORMAL, // 〧
	RichTextWrap.SP_NORMAL, // 〨
	RichTextWrap.SP_NORMAL, // 〩
	RichTextWrap.SP_SUFFIX, // 〪
	RichTextWrap.SP_SUFFIX, // 〫
	RichTextWrap.SP_SUFFIX, //〬	
	RichTextWrap.SP_SUFFIX, //〭	
	RichTextWrap.SP_PREFIX, // 〮
	RichTextWrap.SP_SUFFIX, // 〯
	RichTextWrap.SP_SUFFIX, // 〰
	RichTextWrap.SP_NORMAL, //〱
	RichTextWrap.SP_NORMAL, //〲
	RichTextWrap.SP_NORMAL, //〳
	RichTextWrap.SP_NORMAL, //〴
	RichTextWrap.SP_NORMAL, //〵
	RichTextWrap.SP_NORMAL, // 〶
	RichTextWrap.SP_NORMAL, // 〷
	RichTextWrap.SP_NORMAL, // 〸
	RichTextWrap.SP_NORMAL, // 〹
	RichTextWrap.SP_NORMAL, // 〺
	RichTextWrap.SP_NORMAL, // 〻
	RichTextWrap.SP_NORMAL, // 〼
	RichTextWrap.SP_NORMAL, // 〽
	RichTextWrap.SP_NORMAL, // 〾
	RichTextWrap.SP_NORMAL // 〿
];

/**
 * 中日韩全角半角符号的符号类型表
 * 范围：0xFF00..0xFFEF
 * @type {Array}
 */
RichTextWrap.HALF_FULL_FORMS = [
	RichTextWrap.SP_NORMAL, // null
	RichTextWrap.SP_SUFFIX, // ！
	RichTextWrap.SP_NORMAL, // ＂
	RichTextWrap.SP_NORMAL, // ＃
	RichTextWrap.SP_NORMAL, // ＄
	RichTextWrap.SP_NORMAL, // ％
	RichTextWrap.SP_NORMAL, // ＆
	RichTextWrap.SP_NORMAL, // ＇
	RichTextWrap.SP_PREFIX, // （
	RichTextWrap.SP_SUFFIX, // ）
	RichTextWrap.SP_NORMAL, // ＊
	RichTextWrap.SP_SUFFIX, // ＋
	RichTextWrap.SP_SUFFIX, // ，
	RichTextWrap.SP_SUFFIX, // －
	RichTextWrap.SP_SUFFIX, // ．
	RichTextWrap.SP_SUFFIX, // ／
	RichTextWrap.SP_NORMAL, // ０
	RichTextWrap.SP_NORMAL, // １
	RichTextWrap.SP_NORMAL, // ２
	RichTextWrap.SP_NORMAL, // ３
	RichTextWrap.SP_NORMAL, // ４
	RichTextWrap.SP_NORMAL, // ５
	RichTextWrap.SP_NORMAL, // ６
	RichTextWrap.SP_NORMAL, // ７
	RichTextWrap.SP_NORMAL, // ８
	RichTextWrap.SP_NORMAL, // ９
	RichTextWrap.SP_SUFFIX, // ：
	RichTextWrap.SP_SUFFIX, // ；
	RichTextWrap.SP_SUFFIX, // ＜
	RichTextWrap.SP_SUFFIX, // ＝
	RichTextWrap.SP_SUFFIX, // ＞
	RichTextWrap.SP_SUFFIX, // ？
	RichTextWrap.SP_SUFFIX, // ＠
	RichTextWrap.SP_NORMAL, // Ａ
	RichTextWrap.SP_NORMAL, // Ｂ
	RichTextWrap.SP_NORMAL, // Ｃ
	RichTextWrap.SP_NORMAL, // Ｄ
	RichTextWrap.SP_NORMAL, // Ｅ
	RichTextWrap.SP_NORMAL, // Ｆ
	RichTextWrap.SP_NORMAL, // Ｇ
	RichTextWrap.SP_NORMAL, // Ｈ
	RichTextWrap.SP_NORMAL, // Ｉ
	RichTextWrap.SP_NORMAL, // Ｊ
	RichTextWrap.SP_NORMAL, // Ｋ
	RichTextWrap.SP_NORMAL, // Ｌ
	RichTextWrap.SP_NORMAL, // Ｍ
	RichTextWrap.SP_NORMAL, // Ｎ
	RichTextWrap.SP_NORMAL, // Ｏ
	RichTextWrap.SP_NORMAL, // Ｐ
	RichTextWrap.SP_NORMAL, // Ｑ
	RichTextWrap.SP_NORMAL, // Ｒ
	RichTextWrap.SP_NORMAL, // Ｓ
	RichTextWrap.SP_NORMAL, // Ｔ
	RichTextWrap.SP_NORMAL, // Ｕ
	RichTextWrap.SP_NORMAL, // Ｖ
	RichTextWrap.SP_NORMAL, // Ｗ
	RichTextWrap.SP_NORMAL, // Ｘ
	RichTextWrap.SP_NORMAL, // Ｙ
	RichTextWrap.SP_NORMAL, // Ｚ
	RichTextWrap.SP_PREFIX, // ［
	RichTextWrap.SP_NORMAL, // ＼
	RichTextWrap.SP_SUFFIX, // ］
	RichTextWrap.SP_NORMAL, // ＾
	RichTextWrap.SP_NORMAL, // ＿
	RichTextWrap.SP_NORMAL, // ｀
	RichTextWrap.SP_NORMAL, // ａ
	RichTextWrap.SP_NORMAL, // ｂ
	RichTextWrap.SP_NORMAL, // ｃ
	RichTextWrap.SP_NORMAL, // ｄ
	RichTextWrap.SP_NORMAL, // ｅ
	RichTextWrap.SP_NORMAL, // ｆ
	RichTextWrap.SP_NORMAL, // ｇ
	RichTextWrap.SP_NORMAL, // ｈ
	RichTextWrap.SP_NORMAL, // ｉ
	RichTextWrap.SP_NORMAL, // ｊ
	RichTextWrap.SP_NORMAL, // ｋ
	RichTextWrap.SP_NORMAL, // ｌ
	RichTextWrap.SP_NORMAL, // ｍ
	RichTextWrap.SP_NORMAL, // ｎ
	RichTextWrap.SP_NORMAL, // ｏ
	RichTextWrap.SP_NORMAL, // ｐ
	RichTextWrap.SP_NORMAL, // ｑ
	RichTextWrap.SP_NORMAL, // ｒ
	RichTextWrap.SP_NORMAL, // ｓ
	RichTextWrap.SP_NORMAL, // ｔ
	RichTextWrap.SP_NORMAL, // ｕ
	RichTextWrap.SP_NORMAL, // ｖ
	RichTextWrap.SP_NORMAL, // ｗ
	RichTextWrap.SP_NORMAL, // ｘ
	RichTextWrap.SP_NORMAL, // ｙ
	RichTextWrap.SP_NORMAL, // ｚ
	RichTextWrap.SP_PREFIX, // ｛
	RichTextWrap.SP_NORMAL, // ｜
	RichTextWrap.SP_SUFFIX, // ｝
	RichTextWrap.SP_NORMAL, // ～
	RichTextWrap.SP_PREFIX, // ｟
	RichTextWrap.SP_SUFFIX, // ｠
	RichTextWrap.SP_SUFFIX, // ｡
	RichTextWrap.SP_PREFIX, // ｢
	RichTextWrap.SP_SUFFIX, // ｣
	RichTextWrap.SP_SUFFIX, // ､
	RichTextWrap.SP_SUFFIX, // ･
	RichTextWrap.SP_NORMAL, // ｦ
	RichTextWrap.SP_NORMAL, // ｧ
	RichTextWrap.SP_NORMAL, // ｨ
	RichTextWrap.SP_NORMAL, // ｩ
	RichTextWrap.SP_NORMAL, // ｪ
	RichTextWrap.SP_NORMAL, // ｫ
	RichTextWrap.SP_NORMAL, // ｬ
	RichTextWrap.SP_NORMAL, // ｭ
	RichTextWrap.SP_NORMAL, // ｮ
	RichTextWrap.SP_NORMAL, // ｯ
	RichTextWrap.SP_NORMAL, // ｰ
	RichTextWrap.SP_NORMAL, // ｱ
	RichTextWrap.SP_NORMAL, // ｲ
	RichTextWrap.SP_NORMAL, // ｳ
	RichTextWrap.SP_NORMAL, // ｴ
	RichTextWrap.SP_NORMAL, // ｵ
	RichTextWrap.SP_NORMAL, // ｶ
	RichTextWrap.SP_NORMAL, // ｷ
	RichTextWrap.SP_NORMAL, // ｸ
	RichTextWrap.SP_NORMAL, // ｹ
	RichTextWrap.SP_NORMAL, // ｺ
	RichTextWrap.SP_NORMAL, // ｻ
	RichTextWrap.SP_NORMAL, // ｼ
	RichTextWrap.SP_NORMAL, // ｽ
	RichTextWrap.SP_NORMAL, // ｾ
	RichTextWrap.SP_NORMAL, // ｿ
	RichTextWrap.SP_NORMAL, // ﾀ
	RichTextWrap.SP_NORMAL, // ﾁ
	RichTextWrap.SP_NORMAL, // ﾂ
	RichTextWrap.SP_NORMAL, // ﾃ
	RichTextWrap.SP_NORMAL, // ﾄ
	RichTextWrap.SP_NORMAL, // ﾅ
	RichTextWrap.SP_NORMAL, // ﾆ
	RichTextWrap.SP_NORMAL, // ﾇ
	RichTextWrap.SP_NORMAL, // ﾈ
	RichTextWrap.SP_NORMAL, // ﾉ
	RichTextWrap.SP_NORMAL, // ﾊ
	RichTextWrap.SP_NORMAL, // ﾋ
	RichTextWrap.SP_NORMAL, // ﾌ
	RichTextWrap.SP_NORMAL, // ﾍ
	RichTextWrap.SP_NORMAL, // ﾎ
	RichTextWrap.SP_NORMAL, // ﾏ
	RichTextWrap.SP_NORMAL, // ﾐ
	RichTextWrap.SP_NORMAL, // ﾑ
	RichTextWrap.SP_NORMAL, // ﾒ
	RichTextWrap.SP_NORMAL, // ﾓ
	RichTextWrap.SP_NORMAL, // ﾔ
	RichTextWrap.SP_NORMAL, // ﾕ
	RichTextWrap.SP_NORMAL, // ﾖ
	RichTextWrap.SP_NORMAL, // ﾗ
	RichTextWrap.SP_NORMAL, // ﾘ
	RichTextWrap.SP_NORMAL, // ﾙ
	RichTextWrap.SP_NORMAL, // ﾚ
	RichTextWrap.SP_NORMAL, // ﾛ
	RichTextWrap.SP_NORMAL, // ﾜ
	RichTextWrap.SP_NORMAL, // ﾝ
	RichTextWrap.SP_SUFFIX, // ﾞ
	RichTextWrap.SP_SUFFIX, // ﾟ
	RichTextWrap.SP_NORMAL, // HWHF
	RichTextWrap.SP_NORMAL, // ﾡ
	RichTextWrap.SP_NORMAL, // ﾢ
	RichTextWrap.SP_NORMAL, // ﾣ
	RichTextWrap.SP_NORMAL, // ﾤ
	RichTextWrap.SP_NORMAL, // ﾥ
	RichTextWrap.SP_NORMAL, // ﾦ
	RichTextWrap.SP_NORMAL, // ﾧ
	RichTextWrap.SP_NORMAL, // ﾨ
	RichTextWrap.SP_NORMAL, // ﾩ
	RichTextWrap.SP_NORMAL, // ﾪ
	RichTextWrap.SP_NORMAL, // ﾫ
	RichTextWrap.SP_NORMAL, // ﾬ
	RichTextWrap.SP_NORMAL, // ﾭ
	RichTextWrap.SP_NORMAL, // ﾮ
	RichTextWrap.SP_NORMAL, // ﾯ
	RichTextWrap.SP_NORMAL, // ﾰ
	RichTextWrap.SP_NORMAL, // ﾱ
	RichTextWrap.SP_NORMAL, // ﾲ
	RichTextWrap.SP_NORMAL, // ﾳ
	RichTextWrap.SP_NORMAL, // ﾴ
	RichTextWrap.SP_NORMAL, // ﾵ
	RichTextWrap.SP_NORMAL, // ﾶ
	RichTextWrap.SP_NORMAL, // ﾷ
	RichTextWrap.SP_NORMAL, // ﾸ
	RichTextWrap.SP_NORMAL, // ﾹ
	RichTextWrap.SP_NORMAL, // ﾺ
	RichTextWrap.SP_NORMAL, // ﾻ
	RichTextWrap.SP_NORMAL, // ﾼ
	RichTextWrap.SP_NORMAL, // ﾽ
	RichTextWrap.SP_NORMAL, // ﾾ
	RichTextWrap.SP_NORMAL, // null
	RichTextWrap.SP_NORMAL, // null
	RichTextWrap.SP_NORMAL, // null
	RichTextWrap.SP_NORMAL, // ￂ
	RichTextWrap.SP_NORMAL, // ￃ
	RichTextWrap.SP_NORMAL, // ￄ
	RichTextWrap.SP_NORMAL, // ￅ
	RichTextWrap.SP_NORMAL, // ￆ
	RichTextWrap.SP_NORMAL, // ￇ
	RichTextWrap.SP_NORMAL, // null
	RichTextWrap.SP_NORMAL, // null
	RichTextWrap.SP_NORMAL, // ￊ
	RichTextWrap.SP_NORMAL, // ￋ
	RichTextWrap.SP_NORMAL, // ￌ
	RichTextWrap.SP_NORMAL, // ￍ
	RichTextWrap.SP_NORMAL, // ￎ
	RichTextWrap.SP_NORMAL, // ￏ
	RichTextWrap.SP_NORMAL, // null
	RichTextWrap.SP_NORMAL, // null
	RichTextWrap.SP_NORMAL, // ￒ
	RichTextWrap.SP_NORMAL, // ￓ
	RichTextWrap.SP_NORMAL, // ￔ
	RichTextWrap.SP_NORMAL, // ￕ
	RichTextWrap.SP_NORMAL, // ￖ
	RichTextWrap.SP_NORMAL, // ￗ
	RichTextWrap.SP_NORMAL, // null
	RichTextWrap.SP_NORMAL, // null
	RichTextWrap.SP_NORMAL, // ￚ
	RichTextWrap.SP_NORMAL, // ￛ
	RichTextWrap.SP_NORMAL, // ￜ
	RichTextWrap.SP_NORMAL, // null
	RichTextWrap.SP_NORMAL, // null
	RichTextWrap.SP_NORMAL, // null
	RichTextWrap.SP_NORMAL, // ￠
	RichTextWrap.SP_NORMAL, // ￡
	RichTextWrap.SP_NORMAL, // ￢
	RichTextWrap.SP_NORMAL, // ￣
	RichTextWrap.SP_NORMAL, // ￤
	RichTextWrap.SP_NORMAL, // ￥
	RichTextWrap.SP_NORMAL, // ￦
	RichTextWrap.SP_NORMAL, // null
	RichTextWrap.SP_NORMAL, // ￨
	RichTextWrap.SP_NORMAL, // ￩
	RichTextWrap.SP_NORMAL, // ￪
	RichTextWrap.SP_NORMAL, // ￫
	RichTextWrap.SP_NORMAL, // ￬
	RichTextWrap.SP_NORMAL, // ￭
	RichTextWrap.SP_NORMAL, // ￮
	RichTextWrap.SP_NORMAL, // null
];

/**
 * 词的组成部分
 */
RichTextWrap.WORD_ELEMENT = 0;

/**
 * 单独可以作为词
 */
RichTextWrap.WORD_STAND = 1;

/**
 * 词的前缀
 */
RichTextWrap.WORD_PREFIX = 2;

/**
 * 词的后缀
 */
RichTextWrap.WORD_SUFFIX = 3;

/**
 * 词的分隔符
 */
RichTextWrap.WORD_SPLIT = 4;

/**
 * 强制结束
 */
RichTextWrap.WORD_FORCE = 5;

/**
 * 判定一个字符的词分割类型
 */
RichTextWrap._isWordEnd = function(text, startIdx) {
	if (startIdx >= text.length) {
		return RichTextWrap.WORD_FORCE;
	}
	var char = text[startIdx];
	if (char === '\r' || char === '\n') {
		return RichTextWrap.WORD_FORCE;
	}
	else if (char === ' ' || char === '\t') {
		return RichTextWrap.WORD_SPLIT;
	}
	var block = UnicodeBlock.of(char);
	if (block < UnicodeBlock.CJK_START || block > UnicodeBlock.CJK_END) {
		// 不是中日韩文，字符为词的组成
		return RichTextWrap.WORD_ELEMENT;
	}
	if (block === UnicodeBlock.CJK_SYMBOLS_AND_PUNCTUATION) {
		var spType = RichTextWrap.CJK_SP[char.charCodeAt(0) - 0x3000];
		switch (spType) {
			case RichTextWrap.SP_NORMAL: 	// 可以作为单词的符号
				return RichTextWrap.WORD_STAND;
			case RichTextWrap.SP_PREFIX: 	// 作为前缀的符号不能单独作为词
				return RichTextWrap.WORD_PREFIX;
			case RichTextWrap.SP_SUFFIX: 	// 作为后缀的符号强制标记结束
				return RichTextWrap.WORD_SUFFIX;
		}
	}
	else if (block === UnicodeBlock.HALFWIDTH_AND_FULLWIDTH_FORMS) {
		var hfType = RichTextWrap.HALF_FULL_FORMS[char.charCodeAt(0) - 0xff00];
		switch (hfType) {
			case RichTextWrap.SP_NORMAL: 	// 可以作为单词的符号
				return RichTextWrap.WORD_STAND;
			case RichTextWrap.SP_PREFIX: 	// 作为前缀的符号不能单独作为词
				return RichTextWrap.WORD_PREFIX;
			case RichTextWrap.SP_SUFFIX: 	// 作为后缀的符号强制标记结束
				return RichTextWrap.WORD_SUFFIX;
		}
	}
	return RichTextWrap.WORD_STAND;
};

/**
 * 下一个词处理单元
 */
RichTextWrap._nextWord = function(text, startIdx) {
	var len = text.length;
	if (len <= startIdx) {
		return false;
	}

	var char = text[startIdx];
	if (char === '\r') {
		return startIdx + (text[startIdx + 1] === '\n' ? 2 : 1);
	}
	else if (char === '\n') {
		return startIdx + 1;
	}
	else {
		var currCharEndType = RichTextWrap._isWordEnd(text, startIdx);
		var endIdx = startIdx + 1;
		var nextCharEndType = RichTextWrap._isWordEnd(text, endIdx);
		// 如果当前词为前缀，则查找到主体部分
		if (currCharEndType === RichTextWrap.WORD_PREFIX) {
			while (nextCharEndType === RichTextWrap.WORD_PREFIX) {
				currCharEndType = nextCharEndType;
				nextCharEndType = RichTextWrap._isWordEnd(text, ++endIdx);
			}
			if (nextCharEndType === RichTextWrap.WORD_ELEMENT ||
				nextCharEndType === RichTextWrap.WORD_STAND ||
				nextCharEndType === RichTextWrap.WORD_SUFFIX) {
				currCharEndType = nextCharEndType;
				nextCharEndType = RichTextWrap._isWordEnd(text, ++endIdx);
			}
		}
		// 如果当前类型为Element则继续查找所有连续的element
		if (currCharEndType === RichTextWrap.WORD_ELEMENT) {
			while (nextCharEndType === RichTextWrap.WORD_ELEMENT) {
				currCharEndType = nextCharEndType;
				nextCharEndType = RichTextWrap._isWordEnd(text, ++endIdx);
			}
			if (nextCharEndType === RichTextWrap.WORD_SUFFIX) {
				currCharEndType = nextCharEndType;
				nextCharEndType = RichTextWrap._isWordEnd(text, ++endIdx);
			}
		}
		// 如果当前类型为后缀或者词则获取所有的后缀
		if (currCharEndType === RichTextWrap.WORD_STAND ||
			currCharEndType === RichTextWrap.WORD_SUFFIX) {
			while (nextCharEndType === RichTextWrap.WORD_SUFFIX) {
				currCharEndType = nextCharEndType;
				nextCharEndType = RichTextWrap._isWordEnd(text, ++endIdx);
			}
		}

		// 现在的结束点就是一个单独的处理单元
		return endIdx;
	}
};

/**
 * 按词换行
 */
RichTextWrap._nextBlockInNormal = function(context, section, text, startIdx) {
	var len = text.length;
	if (len <= startIdx) {
		return false;
	}
	var style = section.getCurrStyle();
	var currLine = section.getCurrLine();
	var remainSpace = currLine.remainSpace();
	var space = style.charSpace;
	var appendStr, value;

	for (var idx = startIdx; idx < len; ) {
		var wordEnd = RichTextWrap._nextWord(text, idx);
		var word = text.substring(idx, wordEnd);
		if (word === '\n' || word === '\r' || word === '\r\n') {
			if (idx > startIdx) {
				RichTextWrap._appendText(context, section, style, text, startIdx, idx);
			}
			section.closeLastLine();
			return wordEnd;
		}
		else {
			value = style.measureWord(context, word, section.charStep);
			var wordWidth = (value.x + value.width) * section.charStep.width +
							(value.y + value.height) * section.charStep.height +
							+ word.length * space;
			if (startIdx === idx && currLine.elementCount === 0) {
				wordWidth -= space;
			}

			if (wordWidth < remainSpace) {
				remainSpace -= wordWidth;
				idx = wordEnd;
			}
			else if (wordWidth > section.limitLength) {
				// 换行都会越界，则打断显示
				if (idx > startIdx) {
					// 提交前面的文本
					RichTextWrap._appendText(context, section, style, text, startIdx, idx);
				}
				var charIdx = 0;
				do {
					charIdx = RichTextWrap._nextBlockInBreakAll(context, section, word, charIdx);
				} while (charIdx);
				return wordEnd;
			}
			else {
				if (idx > startIdx) {
					// 提交前面的文本
					RichTextWrap._appendText(context, section, style, text, startIdx, idx);
				}
				section.closeLastLine();
				if (word !== ' ' && word !== '\t') {
					RichTextWrap._appendText(context, section, style, word, 0, word.length);
				}
				return wordEnd;
			}
		}
	}

	RichTextWrap._appendText(context, section, style, text, startIdx, len);
	return false;
};

/**
 * 按字符换行
 */
RichTextWrap._nextBlockInBreakAll = function(context, section, text, startIdx) {
	var len = text.length;
	if (len <= startIdx) {
		return false;
	}
	var style = section.getCurrStyle();
	var currLine = section.getCurrLine();
	var remainSpace = currLine.remainSpace();
	var space = style.charSpace;
	var appendStr, value;

	for (var idx = startIdx; idx < len; ++idx) {
		var char = text[idx];
		if (char === '\r') {
			if(idx > startIdx) {
				RichTextWrap._appendText(context, section, style, text, startIdx, idx);
			}
			section.closeLastLine();
			return idx + (text[idx + 1] === '\n' ? 2 : 1);
		}
		else if (char === '\n') {
			if(idx > startIdx) {
				RichTextWrap._appendText(context, section, style, text, startIdx, idx);
			}
			section.closeLastLine();
			return idx + 1;
		}
		else {
			value = style.measure(context, char);

			var charWidth = (value.x + value.width) * section.charStep.width +
							(value.y + value.height) * section.charStep.height +
							+ space;
			if (startIdx === idx && currLine.elementCount === 0) {
				charWidth -= space;
			}
			if (charWidth < remainSpace) {
				remainSpace -= charWidth;
			}
			else {
				if(idx > startIdx) {
					RichTextWrap._appendText(context, section, style, text, startIdx, idx);
				}
				section.closeLastLine();
				if (char !== ' ' && char !== '\t') {
					RichTextWrap._appendText(context, section, style, char, 0, 1);
				}
				return idx + 1;
			}
		}
	}

	RichTextWrap._appendText(context, section, style, text, startIdx, len);
	return false;
};

/**
 * 按换行符换行
 */
RichTextWrap._nextBlockInKeepAll = function(context, section, text, startIdx) {
	var len = text.length;
	if (len <= startIdx) {
		return false;
	}
	var style = section.getCurrStyle();
	for (var idx = startIdx; idx < len; ++idx) {
		var char = text[idx];
		if (char === '\r') {
			if(idx > startIdx) {
				RichTextWrap._appendText(context, section, style, text, startIdx, idx);
			}
			section.closeLastLine();
			return idx + (text[idx + 1] === '\n' ? 2 : 1);
		}
		else if (char === '\n') {
			if(idx > startIdx) {
				RichTextWrap._appendText(context, section, style, text, startIdx, idx);
			}
			section.closeLastLine();
			return idx + 1;
		}
	}
	RichTextWrap._appendText(context, section, style, text, startIdx, len);
	return false;
};

/**
 * 添加块元素
 */
RichTextWrap._wrapBlockInKeepAll = function(context, section, chunk, startIdx) {
    var style = section.getCurrStyle();
    var value = style.measure(context, chunk);
    RichTextWrap._appendElement(section, chunk, value);
	return false;
};

/**
 * 添加块元素
 */
RichTextWrap._wrapBlockInNormal = function(context, section, chunk, startIdx) {
    var currLine = section.getCurrLine();
    var style = section.getCurrStyle();
    var value = style.measure(context, chunk);
    var space = currLine.elementCount > 0 ? style.charSpace : 0;
    var use = (value.x + value.width) * section.charStep.width +
			  (value.y + value.height) * section.charStep.height +
			  + space;
    if (currLine.remainSpace() < use) {
        currLine.close();
    }
    RichTextWrap._appendElement(section, chunk, value);
	return false;
};

/**
 * 添加一个文本绘制元素
 */
RichTextWrap._appendText = function(context, section, style, text, start, end) {
	var value = style.measure(context, text[start]);
	RichTextWrap._appendElement(section, text[start], value);
	for (var idx = start + 1; idx < end; ++idx) {
		value = style.measure(context, text[idx]);
		RichTextWrap._appendElement(section, text[idx], value);
	}
};

/**
 * 添加一个绘制元素
 */
RichTextWrap._appendElement = function(section, text, measureValue) {
    section.appendElement(measureValue.type || 0,
                          text,
                          1,
                          measureValue.x || 0,
                          measureValue.y || 0,
                          measureValue.width || 0,
                          measureValue.height || 0,
                          measureValue.marginLeft || 0,
                          measureValue.marginRight || 0,
                          measureValue.marginTop || 0,
                          measureValue.marginBottom || 0);
};

/**
 * 自动换行
 */
RichTextWrap.wrapChunk = function(section, context, blockStyle, chunk) {
	var func;
    if (chunk.type === RichTextChunk.BLOCK) {
        func = blockStyle === RichTextWrap.BREAK_KEEPALL ? 
        		RichTextWrap._wrapBlockInKeepAll : RichTextWrap._wrapBlockInNormal;
	    var startIdx = 0;
		do {
			startIdx = func(context, section, chunk, startIdx);
		} while (startIdx);	
    }
    else {
        if (blockStyle === RichTextWrap.BREAK_KEEPALL) {
			func = RichTextWrap._nextBlockInKeepAll;
		}
		else if (blockStyle === RichTextWrap.BREAK_BREAKALL) {
			func = RichTextWrap._nextBlockInBreakAll;
		}
		else {
			func = RichTextWrap._nextBlockInNormal;
		}

	    var text = chunk.inner.toString();
	    var startIdx = 0;
		do {
			startIdx = func(context, section, text, startIdx);
		} while (startIdx);	
    }
};
