/**
 * @author wudm
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 计算一个图片的几何外围
 */
var GeomUtil = qc.Box2D.GeomUtil = function(game) {
    var self = this;

    self.game = game._qc;
};
GeomUtil.prototype = {};
GeomUtil.prototype.constructor = GeomUtil;

GeomUtil.NONE = 0;
GeomUtil.UP = 1;
GeomUtil.LEFT = 2;
GeomUtil.DOWN = 3;
GeomUtil.RIGHT = 4;

// 获取一个图形的边缘
GeomUtil.prototype.marchingSquares = function(sprite) {
    var self = this;
    var canvas = self._canvas;
    if (!canvas) {
        canvas = self._canvas = document.createElement('canvas');
        self._context = canvas.getContext('2d');
    }

    // 将图片绘制在单独的 canvas 之上
    var texture = sprite.phaser.texture;
    var uvx = texture.crop.x;
    var uvy = texture.crop.y;
    var uvw = texture.crop.width;
    var uvh = texture.crop.height;
    var width = sprite.width;
    var height = sprite.height;
    canvas.width = 2 + width;
    canvas.height = 2 + height;

    // 从左上角 1,1 开始绘制
    var context = self._context;
    context.drawImage(texture.baseTexture.source,
        uvx, uvy, uvw, uvh,
        1, 1, width, height);

    var startingPoint = self._getFirstNonTransparentPixel();
    if (!startingPoint) {
        console.log('cannot find none transparent pixel');
        return;
    }

    return self._walkPerimeter(startingPoint.x, startingPoint.y);
/*
    // 需要根据 pivot 偏移
    var shiftX = width * sprite.pivotX;
    var shiftY = height * sprite.pivotY;

    for (var i = 0, len = result.length; i < len; i++) {
        result[i].x -= shiftX;
        result[i].y -= shiftY;
    }
    return result; */
};

// 找到 canvas 中左上角的非透明点
GeomUtil.prototype._getFirstNonTransparentPixel = function() {
    var height = this._canvas.height;
    var width = this._canvas.width;
    var x, y, rowData;
    var context = this._context;

    for (y = 0; y < height; y++) {
        rowData = context.getImageData(0, y, width, 1).data;
        for (x = 0; x < rowData.length; x += 4) {
            if (rowData[x + 3] > 100)
                // 非透明元素找到
                return { x : x / 4, y :y };
        }
    }
    return null;
};

// Marching Squares 算法主体，找寻外围框
GeomUtil.prototype._walkPerimeter = function(startX, startY) {
    var pointList = [];
    var x = startX, y = startY;

    var width = this._canvas.width;
    var height = this._canvas.height;
    var imageData = this._context.getImageData(0, 0, width, height);
    var index, width4 = imageData.width * 4;
    var count = 0;

    do {
        if (count++ > 1000000) { console.log('max times'); break; }

        index = (y - 1) * width4 + (x - 1) * 4;
        this._step(index, imageData.data, width4);

        if (x >= 0 && x < width &&
            y >= 0 && y < height) {
            pointList.push(new qc.Point(x - 1, y - 1));
        }

        switch (this._nextStep) {
        case qc.Box2D.GeomUtil.UP: y--; break;
        case qc.Box2D.GeomUtil.LEFT: x--; break;
        case qc.Box2D.GeomUtil.DOWN: y++; break;
        case qc.Box2D.GeomUtil.RIGHT: x++; break;
        default : break;
        }
    } while (x !== startX || y !== startY);

    // pointList.push(new qc.Point(x - 1, y - 1));
    return pointList;
};

// 一次找寻工作
GeomUtil.prototype._step = function(index, data, width4) {
    var state = 0;
    if (data[index + 3] > 100) state |= 1;
    if (data[index + 7] > 100) state |= 2;
    if (data[index + width4 + 3] > 100) state |= 4;
    if (data[index + width4 + 7] > 100) state |= 8;

    var nextStep;
    switch (state) {
    case 1:
    case 5:
    case 13:
        nextStep = qc.Box2D.GeomUtil.UP;
        break;
    case 2:
    case 3:
    case 7:
        nextStep = qc.Box2D.GeomUtil.RIGHT;
        break;
    case 4:
    case 12:
    case 14:
        nextStep = qc.Box2D.GeomUtil.LEFT;
        break;
    case 6:
        nextStep = (this._nextStep == qc.Box2D.GeomUtil.UP ?
                    qc.Box2D.GeomUtil.LEFT :
                    qc.Box2D.GeomUtil.RIGHT);
        break;
    case 8:
    case 10:
    case 11:
        nextStep = qc.Box2D.GeomUtil.DOWN;
        break;
    case 9:
        nextStep = (this._nextStep == qc.Box2D.GeomUtil.RIGHT ?
                    qc.Box2D.GeomUtil.UP :
                    qc.Box2D.GeomUtil.DOWN);
        break;
    default:
        console.log("Illegal state at index (" + index + ").");
    }

    this._nextStep = nextStep;
};

// Ramer Douglas Peucker算法
GeomUtil.prototype.RDPsd = function(points, epsilon) {
    var firstPoint = points[0];
    var lastPoint = points[points.length-1];

    // 不需要简化
    if (points.length < 3) {
        return points;
    }

    var index = -1;
    var dist = 0;

    // 找到中间差值最大的点
    for (var i = 1; i < points.length - 1; i++) {
        var cDist = this._distanceFromPointToLine(points[i], firstPoint, lastPoint);
        if (cDist > dist) {
            dist = cDist;
            index = i;
        }
    }

    if (dist > epsilon) {
        // 这个差值已经超过阈值，则分段继续迭代
        var l1 = points.slice(0, index + 1);
        var l2 = points.slice(index);
        var r1 = this.RDPsd(l1, epsilon);
        var r2 = this.RDPsd(l2, epsilon);

        // 将 r1, r2 的结果合并，注意 r1 的最后一个元素跟 r2 第一个元素重叠，故略去
        var rs = r1.slice(0, r1.length - 1).concat(r2);
        return rs;
    }
    else {
        // 所有的差值足够小，则直接返回头尾两个点
        return [firstPoint, lastPoint];
    }
};

// 计算一个点到一条直线的距离
GeomUtil.prototype._distanceFromPointToLine = function(p, a, b){
    // 转换下格式便于后续代码阅读
    p = { x : p.x, y : p.y };
    a = { x : a.x, y : a.y };
    b = { x : b.x, y : b.y };

    // 线段的长度
    var lineLength = this._pointDistance(a, b);
	if (lineLength === 0) {
        // 线段是一个点，距离就是 p 跟这个点的距离
		return this._pointDistance(p,a);
	}

    // 比较 p 跟 a/b 点的距离关系
	var t = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / lineLength;
	if (t < 0) {
        // 点在 a 点的后面，更靠近 a
		return this._pointDistance(p, a);
	}
	if (t > 1) {
        // 点更靠近 b
		return this._pointDistance(p, b);
	}

    // 在 ab 线段之间
	return this._pointDistance(p, {
        x : a.x + t * (b.x - a.x),
        y : a.y + t * (b.y - a.y)
    });
};

// 计算两个点之间的距离
GeomUtil.prototype._pointDistance = function(i, j) {
    var l1 = i.x - j.x;
    var l2 = i.y - j.y;

    return l1 * l1 + l2 * l2;
};

// 是否是简单多边形（边之间没有交）
GeomUtil.prototype.isSimple = function(vertices) {
    var p1, p2, q1, q2;
    var i, len = vertices.length;

    for (i = 0; i < len - 2; i++) {
        p1 = vertices[i];
        p2 = vertices[i + 1];

        // 检测跟其他线段没有相交
        for (j = i + 2; j < len; j++) {
            q1 = vertices[j];
            q2 = vertices[j + 1];

            if (j === len - 1) {
                if (i === 0) continue;
                q2 = vertices[0];
            }

            if (this.segmentsIntersect(p1, p2, q1, q2))
                return false;
        }
    }

    return true;
};

// 线段是否相交测试
GeomUtil.prototype.segmentsIntersect =  function(p1, p2, q1, q2) {
    var dx = p2.x - p1.x;
    var dy = p2.y - p1.y;
    var da = q2.x - q1.x;
    var db = q2.y - q1.y;

    if (da * dy - db * dx === 0)
        // 平行
        return false;

    var s = (dx * (q1.y - p1.y) + dy * (p1.x - q1.x)) / (da * dy - db * dx);
    var t = (da * (p1.y - q1.y) + db * (q1.x - p1.x)) / (db * dx - da * dy);

    return (s >= 0 && s <= 1 && t >= 0 && t <= 1);
};

// 确保多边形的点是逆时针
GeomUtil.prototype.makeCCW = function(vertices) {
    var br = 0;
    var v = vertices;
    var len = v.length;
    var i;

    // 找到最右上角的点
    for (i = 1; i < len; ++i) {
        if (v[i].y < v[br].y || (v[i].y === v[br].y && v[i].x > v[br].x)) {
            br = i;
        }
    }

    // 如果是顺时针，反转点
    var a = v[br - 1 < 0 ? len - 1 : br - 1];
    var b = v[br];
    var c = v[br + 1 === len ? 0 : br + 1];
    var ret;

    if (this._area(a, b, c) > 0) {
        ret = [];
        for (i = 0; i < len; i++)
            ret.push(v[i]);
    }
    else {
        // 需要反转
        ret = [];
        for (i = 0; i < len; i++)
            ret.push(v[len - i - 1]);
    }
    return ret;
};

// 计算点积
GeomUtil.prototype._area = function(a, b, c) {
    return (((b.x - a.x) * (c.y - a.y)) - ((c.x - a.x) * (b.y - a.y)));
};

// 对多边形进行分解，期望所有都是凸多边形，并且边长数量小于指定值
GeomUtil.prototype.decomp = function(vertices, maxEdge) {
    // 默认每个 Body 最大边数设置为 6
    maxEdge = maxEdge || 6;

    vertices = this.makeCCW(vertices);

    var polygons = qc.GeometricTool.quickDecomp(vertices);

    // path 现在形如 [ Polygon, Polygon, Polygon ... ]
    // 整理下，整理成点普通的 [ x, y] 点组成的集合
    // 另外，需要确保最多边数在目标范围
    var path = [];
    for (var i = 0, len = polygons.length; i < len; i++) {
        var v = polygons[i];

        // 不需要再次打散
        if (v.length <= maxEdge) {
            path.push(v);
            continue;
        }

        while (v.length > maxEdge) {
            path.push(v.slice(0, maxEdge));
            v.splice(1, maxEdge - 2);
        }

        if (v.length >= 3)
            path.push(v);
    }

    return path;
};
