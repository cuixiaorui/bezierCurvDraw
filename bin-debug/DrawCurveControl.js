var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var DrawCurveControl = (function () {
    function DrawCurveControl() {
    }
    DrawCurveControl.getInstance = function () {
        if (!DrawCurveControl._instance) {
            DrawCurveControl._instance = new DrawCurveControl();
            return DrawCurveControl._instance;
        }
        return DrawCurveControl._instance;
    };
    DrawCurveControl.prototype.init = function (container) {
        this._container = container;
        this._wireList = [];
        this._container.touchEnabled = true;
        this._container.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeginHandler, this);
        this._tempLine = new DrawTempLine(container);
    };
    DrawCurveControl.prototype.onTouchBeginHandler = function () {
        this._container.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoveHandler, this);
        this._container.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEndHandler, this);
        this._container.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEndHandler, this);
    };
    DrawCurveControl.prototype.onTouchMoveHandler = function (e) {
        var point = new egret.Point(e.stageX, e.stageY);
        this._tempLine.addPoint(point);
    };
    DrawCurveControl.prototype.onTouchEndHandler = function () {
        this._container.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoveHandler, this);
        this._container.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEndHandler, this);
        this._container.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEndHandler, this);
        this.unselectAllWire();
        if (this.isCanCreateWire()) {
            this.createWire();
        }
        this._tempLine.clear();
    };
    DrawCurveControl.prototype.unselectAllWire = function () {
        this._wireList.forEach(function (element) {
            element.unselect();
        });
    };
    DrawCurveControl.prototype.isCanCreateWire = function () {
        return this.createOriginalPointsData().length >= 2;
    };
    DrawCurveControl.prototype.createWire = function () {
        var originalPointsData = this.createOriginalPointsData();
        var bezierCurvePointsData = this.createBezierCurvePointsData(originalPointsData);
        var drawPointsData = this.createDrawPointsData(bezierCurvePointsData);
        var wire = new Wire(this._container, {
            thickness: 5,
            color: 0x00ff00,
            alpha: 1
        });
        wire.draw({
            originalPointsData: originalPointsData,
            bezierCurvePointsData: bezierCurvePointsData,
            drawPointsData: drawPointsData
        });
        this._wireList.push(wire);
    };
    /**
     * 创建原始数据
     * 包含的是 touchMove 收集的点
     */
    DrawCurveControl.prototype.createOriginalPointsData = function () {
        var pointList = this._tempLine.getPointList();
        //把 point 改为 [x,y] 格式
        return pointList.map(function (point) {
            return [point.x, point.y];
        });
    };
    /**
     * 创建贝塞尔曲线数据
     */
    DrawCurveControl.prototype.createBezierCurvePointsData = function (originalPointsData) {
        if (originalPointsData.length < 2)
            return [];
        var bezierCurvePointsData = fitCurve(originalPointsData, DrawConst.MaxError, null);
        //添加开始点到贝塞尔曲线数据内
        return bezierCurvePointsData.reduce(function (list, arr) {
            if (list.length === 0) {
                var p1 = arr[0];
                list.push.apply(list, p1);
            }
            var p2 = arr[3];
            list.push.apply(list, p2);
            return list;
        }, []);
    };
    /**
     * 创建绘制数据
     */
    DrawCurveControl.prototype.createDrawPointsData = function (bezierCurvePointsData) {
        return DrawCurveCore.curve(bezierCurvePointsData, DrawConst.Tension, DrawConst.NumOfSeg);
    };
    /**
     * 添加贝塞尔曲线点
     */
    DrawCurveControl.prototype.addBezierCurvePoint = function (curvePoint, wireInfo) {
        var drawDataSegment = this.slicePointsData(wireInfo);
        var index = this.getIndexOfLine(curvePoint, drawDataSegment);
        var point = [curvePoint.x, curvePoint.y];
        var bcIndex = (index + 1) * 2;
        (_a = wireInfo.bezierCurvePointsData).splice.apply(_a, [bcIndex, 0].concat(point));
        var _a;
    };
    //获取当前点所在线的索引
    DrawCurveControl.prototype.getIndexOfLine = function (curvePoint, drawPoints) {
        var RANGE = 5;
        //2. 基于每段内的数据 -》检测点是否在直线上
        for (var i = 0; i < drawPoints.length; i++) {
            var points = drawPoints[i];
            for (var j = 0; j < points.length; j++) {
                var pointA = points[j];
                var pointB = points[j + 1];
                if (pointB) {
                    var boo = this.getPointIsInLine(curvePoint, pointA, pointB, RANGE);
                    if (boo) {
                        return i;
                    }
                }
            }
        }
    };
    //通过原贝塞尔曲线点 把 绘制点 分片
    DrawCurveControl.prototype.slicePointsData = function (wireInfo) {
        var bezierCurvePointsData = wireInfo.bezierCurvePointsData.slice();
        var drawPointsData = wireInfo.drawPointsData.slice();
        var checkoutPoints = [];
        for (var i = 0, len = bezierCurvePointsData.length; i < len; i += 2) {
            var bcPoint = {
                x: bezierCurvePointsData[i],
                y: bezierCurvePointsData[i + 1],
            };
            var points = [];
            for (var j = 2, len_1 = drawPointsData.length; j < len_1; j += 2) {
                var dPoint = {
                    x: drawPointsData[j],
                    y: drawPointsData[j + 1]
                };
                if (bcPoint.x === dPoint.x && bcPoint.y === dPoint.y) {
                    checkoutPoints.push(points);
                    drawPointsData = drawPointsData.slice(j);
                    break;
                }
                else {
                    points.push(dPoint);
                }
            }
        }
        return checkoutPoints;
    };
    /**
     * 检测点是否在直线上
     * @param pf 检测点
     * @param p1 线的开始点
     * @param p2 线的结束点
     * @param range 误差值
     */
    DrawCurveControl.prototype.getPointIsInLine = function (pf, p1, p2, range) {
        var cross = (p2.x - p1.x) * (pf.x - p1.x) + (p2.y - p1.y) * (pf.y - p1.y);
        if (cross <= 0)
            return false;
        var d2 = (p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y);
        if (cross >= d2)
            return false;
        var r = cross / d2;
        var px = p1.x + (p2.x - p1.x) * r;
        var py = p1.y + (p2.y - p1.y) * r;
        return Math.sqrt((pf.x - px) * (pf.x - px) + (py - pf.y) * (py - pf.y)) <= range;
    };
    /**
     * 更新所有的导线
     * 主要变更样式
     */
    DrawCurveControl.prototype.updateAllWire = function () {
        this._wireList.forEach(function (wire) {
            wire.updateStyle();
        });
    };
    return DrawCurveControl;
}());
__reflect(DrawCurveControl.prototype, "DrawCurveControl");
