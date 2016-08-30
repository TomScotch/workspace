/**
 * @author chenqx
 * copyright 2015 Qcplay All Rights Reserved.
 */
/**
 * 富文本符号支持
 */
var RichTextSymbol = com.qici.richText.RichTextSymbol = function(game) {
    var self = this;

    self.game = game;
    /**
     * @property {Object} _symbols - 符号集合
     */
    self._symbols ={};

    /**
     * @property {Object} _drawStyle - 绘制方式集合
     */
    self._drawStyles = {};

    /**
     * @property {Object} _emoji - 表情集合
     */
    self._emoji = {},

    // 添加系统默认处理支持
    self.resetToSystemSymbol();
};

RichTextSymbol.prototype = {};
RichTextSymbol.prototype.constructor = RichTextSymbol;

/**
 * 注册一个符号处理
 */
RichTextSymbol.prototype.registerSymbol = function(key, attributeToStyleFunction) {
	var self = this;
	self.unregisterSymbol(key, attributeToStyleFunction);
	var symbol = self._symbols[key];
	if (!symbol) {
		symbol = {
			history : [],
			inEffect : attributeToStyleFunction
		};
		self._symbols[key] = symbol;
	}
	else {
		symbol.history.push(symbol.inEffect);
		symbol.inEffect = attributeToStyleFunction;
	}
};

/**
 * 反注册一个符号处理，将会恢复为被覆盖的处理
 */
RichTextSymbol.prototype.unregisterSymbol = function(key, attributeToStyleFunction) {
	var self = this;
	var symbol = self._symbols[key];
	if (!symbol) {
		return;
	}
	if (symbol.inEffect === attributeToStyleFunction) {
		symbol.inEffect = symbol.history.pop();
	}
	else {
		var idx = symbol.history.length;
		while (idx--) {
			if (symbol.history[idx] === attributeToStyleFunction) {
				symbol.splice(idx, 1);
			}
		}
	}
};

/**
 * 获取符号对应的效果
 */
RichTextSymbol.prototype.getSymbolStyle = function(key, attribute) {
	var self = this;
	var symbol = self._symbols[key];
	if (!symbol || !symbol.inEffect) {
		return null;
	}
	return symbol.inEffect(key, attribute);
};

/**
 * 注册一个符号处理
 */
RichTextSymbol.prototype.registerDrawStyle = function(key, drawFunction) {
	var self = this;
	self.unregisterDrawStyle(key, drawFunction);
	var drawStyle = self._drawStyles[key];
	if (!drawStyle) {
		drawStyle = {
			history : [],
			inEffect : drawFunction
		};
		self._drawStyles[key] = drawStyle;
	}
	else {
		drawStyle.history.push(drawStyle.inEffect);
		drawStyle.inEffect = drawFunction;
	}
};

/**
 * 反注册一个符号处理，将会恢复为被覆盖的处理
 */
RichTextSymbol.prototype.unregisterDrawStyle = function(key, drawFunction) {
	var self = this;
	var drawStyle = self._drawStyles[key];
	if (!drawStyle) {
		return;
	}
	if (drawStyle.inEffect === drawFunction) {
		drawStyle.inEffect = drawStyle.history.pop();
	}
	else {
		var idx = drawStyle.history.length;
		while (idx--) {
			if (drawStyle.history[idx] === drawFunction) {
				drawStyle.splice(idx, 1);
			}
		}
	}
};

/**
 * 注册一个表情包
 */
RichTextSymbol.prototype.registerEmoji = function(packageName, emoji) {
	var self = this;
	self.unregisterEmoji(packageName, emoji);
	var emojiList = self._emoji[packageName];
	if (!emojiList) {
		emojiList = [];
		self._emoji[packageName] = emojiList;
	}
	emojiList.push(emoji);
};

/**
 * 注销一个表情包
 */
RichTextSymbol.prototype.unregisterEmoji = function(packageName, emoji) {
	var self = this;
	var emojiList = self._emoji[packageName];
	if (!emojiList)
		return;
	var idx = emojiList.length;
	while (idx--) {
		if (emojiList[idx] === emoji) {
			emojiList.splice(idx, 1);
		}
	}
};

/**
 * 从表情包获取一个图片
 */
RichTextSymbol.prototype.findEmojiAtlas = function(packageName, frame) {
	var self = this;
	var emojiList = self._emoji[packageName];
	if (!emojiList)
		return null;
	var idx = -1,
		len = emojiList.length;
	if (!frame) {
		return emojiList[0];
	}
	while (++idx < len) {
		var frameIdx = -1,
			frameNames = emojiList[idx].atlas.frameNames,
			frameCount = frameNames.length;
		while (++frameIdx < frameCount) {
			if (frameNames[frameIdx] === frame) {
				return emojiList[idx].atlas;
			}
		}
	}
	return null;
};

/**
 * 获取符号对应的效果
 */
RichTextSymbol.prototype.getDrawStyle = function(key) {
	var self = this;
	var drawStyle = self._drawStyles[key];
	if (!drawStyle || !drawStyle.inEffect) {
		return null;
	}
	return drawStyle.inEffect;
};

/**
 * 文本绘制后，马上进行的绘制
 */
RichTextSymbol.doPostDrawText = function(context, block, elementIdx, x, y) {
	var backStyle = context.fillStyle;
	var style = block.style;
	var rect, extra;
	if (style.underline) {
		if (style.underlineColor) {
			context.fillStyle = style.underlineColor;
		}
		rect = block.elementRects[elementIdx].rect;
		extra = block.isFirstBlockInLine && elementIdx === 0 ? 0 : (style.charSpace + block.line.elementSpace);
		context.fillRect(x + rect.x - extra, Math.floor(y + rect.height - 1), rect.width + extra, 1);
		context.fillStyle = backStyle;
	}

	if (style.strikethrough) {
		if (style.strikethroughColor) {
			context.fillStyle = style.strikethroughColor;
		}
		rect = block.elementRects[elementIdx].rect;
		extra = block.isFirstBlockInLine && elementIdx === 0 ? 0 : (style.charSpace + block.line.elementSpace);
		context.fillRect(x + rect.x - extra, Math.floor(y + (rect.height - 1) / 2) , rect.width + extra, 1);
		context.fillStyle = backStyle;
	}
};

/**
 * 填充的文本绘制方式
 */
RichTextSymbol.fillText = function(context, block, elementIdx, x, y) {
	context.fillStyle = block.style.fontColor;
	context.textBaseline = 'middle';
	var rect = block.elementRects[elementIdx].rect;
	context.fillText(block.elements[elementIdx], x + rect.x, y + rect.y + rect.height / 2);
};

/**
 * 描边的文本绘制方式
 */
RichTextSymbol.strokeText = function(context, block, elementIdx, x, y) {
	context.strokeStyle = block.style.fontColor;
	context.textBaseline = 'middle';
	var rect = block.elementRects[elementIdx].rect;
	context.strokeText(block.elements[elementIdx], x + rect.x, y + rect.y + rect.height / 2);
};

/*
 * 注册一些默认支持的符号
 */
RichTextSymbol.prototype.resetToSystemSymbol = function() {
    // 清理已经存在的符号
    var self = this;
    self._symbols = {};
    self._drawStyle = {};

    // 注册绘制方式
	// 注册基本的绘制函数
	self.registerDrawStyle('fill', RichTextSymbol.fillText);

	self.registerDrawStyle('stroke', RichTextSymbol.strokeText);

	// 注册符号
	// 添加字体颜色
	self.registerSymbol('color', function(key, attribute, currStyle) {
		return {
			fontColor: attribute.value
		};
	});

	// 添加字体大小
	self.registerSymbol('size', function(key, attribute, currStyle) {
		return {
			fontSize: parseInt(attribute.value)
		};
	});

	// 添加水平对齐
	self.registerSymbol('text-align', function(key, attribute, currStyle) {
		return {
			textAlign: attribute.value
		};
	});

	// 添加竖直对齐
	self.registerSymbol('vertical-align', function(key, attribute, currStyle) {
		return {
			verticalAlign: attribute.value
		};
	});

	// 添加粗体
	self.registerSymbol('b', function(key, attribute, currStyle) {
		return {
			fontWeight: 'bold'
		};
	});

	// 添加斜体
	self.registerSymbol('i', function(key, attribute, currStyle) {
		return {
			fontStyle: 'italic'
		};
	});

	// 添加下划线
	self.registerSymbol('underline', function(key, attribute, currStyle) {
		var style = {
			underline: true,
			underlineColor: attribute.color,
			postDrawElementHandle: RichTextSymbol.doPostDrawText
		};
		return style;
	});

	// 添加删除线
	self.registerSymbol('strikethrough', function(key, attribute, currStyle) {
		var style = {
			strikethrough: true,
			strikethroughColor: attribute.color,
			postDrawElementHandle: RichTextSymbol.doPostDrawText
		};
		return style;
	});

	// 添加点击事件
	self.registerSymbol('click', function(key, attribute, currStyle) {
		var style = {
			onClickHandle: function(clickContext, block, x, y) {
				var command = attribute.value;
				if (clickContext && clickContext._sendMessage) {
					clickContext._sendMessage(command, true, block.elements.join(''), x, y);
				}
				else if (clickContext && (typeof clickContext[command] === 'function')) {
					clickContext[command].call(clickContext, block.elements.join(''), x, y);
				}
			}
		};
		return style;
	});

	// 添加绘制样式
	self.registerSymbol('stroke', function(key, attribute, currStyle) {
		return {
			drawStyle: 'stroke'
		};
	});

	// 添加行高控制
	self.registerSymbol('linespace', function(key, attribute, currStyle) {
		return {
			lineSpace: parseInt(attribute.value)
		};
	});

	// 字间距
	self.registerSymbol('charspace', function(key, attribute, currStyle) {
		return {
			charSpace: parseInt(attribute.value)
		};
	});

	// 固定行高
	self.registerSymbol('lineweight', function(key, attribute, currStyle) {
		return {
			lineWeight: parseInt(attribute.value)
		};
	});

	// 表情标签
	self.registerSymbol('image', function(key, attribute, currStyle) {
		var packageName = attribute.package;
		var frame = attribute.frame;
		var atlas = self.findEmojiAtlas(packageName, frame);
		if (!atlas) {
			return null;
		}
		else {
			var phaserImage = new Phaser.Sprite(self.game.phaser);
			phaserImage.loadTexture(atlas.key, frame);
			if (attribute.width) {
				phaserImage.texture.frame.width = parseInt(attribute.width);
			}
			if (attribute.height) {
				phaserImage.texture.frame.height = parseInt(attribute.height);
			}
			return {
				onEnable: function(section) {
					var currChunk = new RichTextChunk(frame);
					currChunk.type = RichTextChunk.BLOCK;
					currChunk.sprite = phaserImage;
					return [currChunk];
				},

				measureHandle: function(context, style, body) {
					var sprite = body.sprite;
					return {
						x : 0,
						y : 0,
						width : sprite ? sprite.width : 0,
						height : sprite ? sprite.height : 0
					};
				},

				drawElementHandle: function(context, block, elementIdx, x, y) {
					var sprite = block.elements[elementIdx].sprite;
					if (!sprite)
						return;
					var resolution = sprite.texture.baseTexture.resolution;
					context.drawImage(
                            sprite.texture.baseTexture.source,
                            sprite.texture.crop.x,
                            sprite.texture.crop.y,
                            sprite.texture.crop.width,
                            sprite.texture.crop.height,
                            x,
                            y,
                            sprite.texture.frame.width / resolution,
                            sprite.texture.frame.height / resolution);
				}
			};
		}
	});
};


