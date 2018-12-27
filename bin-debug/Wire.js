var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 导线
 */
var Wire = (function () {
    function Wire(container, wireStyle) {
        this._isMove = false;
        this._isFirstMove = true;
        this._dragPointList = [];
        this._wireStyle = wireStyle;
        this._selectColor = "0xcccccc";
        this._unselectColor = wireStyle.color;
        this._line = new egret.Shape();
        this._container = container;
        container.addChild(this._line);
        this._line.touchEnabled = true;
        this._line.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeginHandler, this);
    }
    Wire.prototype.onTouchBeginHandler = function (e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        this._tempTouchBeginPoint = { x: e.stageX, y: e.stageY };
        this._container.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoveHandler, this);
        this._container.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEndHandler, this);
        this._container.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEndHandler, this);
    };
    Wire.prototype.onTouchMoveHandler = function (e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        this._isMove = true;
        if (this._isFirstMove) {
            DrawCurveControl.getInstance().addBezierCurvePoint(this._tempTouchBeginPoint, this._drawInfo);
            this.update();
            this._isFirstMove = false;
            this._tempDragPoint = this.getWireDragPointByPoint(this._tempTouchBeginPoint);
        }
        if (this._tempDragPoint) {
            this._tempDragPoint.x = e.stageX;
            this._tempDragPoint.y = e.stageY;
            this.moveDragPoint(e.stageX, e.stageY, this._tempDragPoint.getIndex());
        }
    };
    Wire.prototype.onTouchEndHandler = function (e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (!this._isMove) {
            this.select();
        }
        this._isMove = false;
        this._isFirstMove = true;
        this._tempDragPoint = null;
        this._container.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoveHandler, this);
        this._container.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEndHandler, this);
        this._container.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEndHandler, this);
    };
    Wire.prototype.select = function () {
        this._wireStyle.color = this._selectColor;
        this.updateLine(this._drawInfo.drawPointsData);
    };
    Wire.prototype.unselect = function () {
        this._wireStyle.color = this._unselectColor;
        this.updateLine(this._drawInfo.drawPointsData);
    };
    Wire.prototype.draw = function (info) {
        this._drawInfo = info;
        this.update();
    };
    Wire.prototype.update = function () {
        this.updateLine(this._drawInfo.drawPointsData);
        this.updateDragPoint();
    };
    Wire.prototype.updateDragPoint = function () {
        //先删除所有的拖拽点
        for (var j = this._dragPointList.length - 1; j >= 0; j--) {
            var dragPoint_1 = this._dragPointList[j];
            if (dragPoint_1) {
                dragPoint_1.dispose();
                this._dragPointList.splice(j, 1);
            }
        }
        var len = this._drawInfo.bezierCurvePointsData.length;
        for (var i = 0; i < len; i += 2) {
            var x = this._drawInfo.bezierCurvePointsData[i];
            var y = this._drawInfo.bezierCurvePointsData[i + 1];
            var dragPoint = new WireDragPoint(i, this);
            this._container.addChild(dragPoint);
            dragPoint.x = x;
            dragPoint.y = y;
            this._dragPointList.push(dragPoint);
        }
    };
    Wire.prototype.updateLine = function (points) {
        var startPoint = { x: points[0], y: points[1] };
        var lineToList = points.slice(2);
        this._line.graphics.clear();
        this._line.graphics.lineStyle(this._wireStyle.thickness, this._wireStyle.color, this._wireStyle.alpha);
        this._line.graphics.moveTo(startPoint.x, startPoint.y);
        for (var i = 0; i < lineToList.length; i += 2) {
            this._line.graphics.lineTo(lineToList[i], lineToList[i + 1]);
        }
        this._line.graphics.endFill();
    };
    Wire.prototype.moveDragPoint = function (x, y, index) {
        this._drawInfo.bezierCurvePointsData[index] = x;
        this._drawInfo.bezierCurvePointsData[index + 1] = y;
        this._drawInfo.drawPointsData = DrawCurveControl.getInstance().createDrawPointsData(this._drawInfo.bezierCurvePointsData);
        this.updateLine(this._drawInfo.drawPointsData);
    };
    Wire.prototype.getWireDragPointByPoint = function (point) {
        var len = this._dragPointList.length;
        for (var i = 0; i < len; i++) {
            var dragPoint = this._dragPointList[i];
            if (dragPoint.x === point.x && dragPoint.y === point.y)
                return dragPoint;
        }
        return null;
    };
    Wire.prototype.updateStyle = function () {
        this._drawInfo.bezierCurvePointsData = DrawCurveControl.getInstance().createBezierCurvePointsData(this._drawInfo.originalPointsData);
        this._drawInfo.drawPointsData = DrawCurveControl.getInstance().createDrawPointsData(this._drawInfo.bezierCurvePointsData);
        this.update();
    };
    return Wire;
}());
__reflect(Wire.prototype, "Wire");
