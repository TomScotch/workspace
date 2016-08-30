# 富文本
富文本使用一组固定的格式描述文本的显示情况。

## 格式说明
1. 标记使用 __[标记]内容[/标记]__ 或者 __[标记/]__ 表示标记的有效范围。
2. 如果标记不在支持的范围，则直接文本显示其包含的所有内容。
	例如：[aaaa][d]aa[/d][/aaaa] 最终显示文本为[d]aa[/d]

## 已经支持的标记
| 标记 | 描述 | 例子 |
|-----|-----|-----|
| color | 文本颜色 | [color=#ffff00]文本[/color][color=rgb(255,255,0)]文本[/color] |
| size | 文本大小 | [size=12]文本[/size] |
| text-align | 行文本的对齐方式，可选值有start，end，center，justify | [text-align=start]文本[/text-align] |
| vertical-align | 文本在行内的对齐方式，可选值top，middle，bottom |[vertical-align=top]文本[/vertical-align] |
| b | 粗体 | [b]文本[/b] |
| i | 斜体 | [i]文本[/i] |
| linespace | 文本的行间距 | [lineSpace=10]文本[/lineSpace] |
| charspace | 字间距 | [charspace=2]文本[/charspace] |
| lineweight | 行水平显示时为行高，竖直显示时为行宽 | [lineweight=33]文本[/lineweight] |
| underline | 下划线 | [underline]文本[/underline] |
| strikethrough | 删除线 | [strikethrough]文本[/strikethrough] |
| stroke | 中空绘制 | [stroke]文本[/stroke] |
| click | 点击处理，点击时调用RichText对象上挂载脚本的对应方法 | [click='onMyClick']文本[/click] |
| image | 图片显示，需要使用RichTextEmoji载入需要使用的图集 | [image package='emoji' frame='1.png'/] |