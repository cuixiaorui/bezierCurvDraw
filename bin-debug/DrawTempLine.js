var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var TempLineStyleConst;
(function (TempLineStyleConst) {
    TempLineStyleConst[TempLineStyleConst["thickness"] = 5] = "thickness";
    TempLineStyleConst[TempLineStyleConst["color"] = 16711680] = "color";
    TempLineStyleConst[TempLineStyleConst["alpha"] = 1] = "alpha";
})(TempLineStyleConst || (TempLineStyleConst = {}));
/**
 * 临时绘制的线
 */
var DrawTempLine = (function () {
    function DrawTempLine(container) {
        this._pointList = [];
        this._line = new egret.Shape();
        container.addChild(this._line);
    }
    DrawTempLine.prototype.clear = function () {
        this._pointList = [];
        this.update();
    };
    DrawTempLine.prototype.addPoint = function (point) {
        this._pointList.push(point);
        this.update();
    };
    DrawTempLine.prototype.getPointList = function () {
        return this._pointList.slice();
    };
    DrawTempLine.prototype.update = function () {
        var _this = this;
        var startPoint = this._pointList[0];
        var lineToList = this._pointList.slice(1);
        this._line.graphics.clear();
        if (this._pointList.length <= 1)
            return;
        this._line.graphics.lineStyle(TempLineStyleConst.thickness, TempLineStyleConst.color, TempLineStyleConst.alpha);
        this._line.graphics.moveTo(startPoint.x, startPoint.y);
        lineToList.forEach(function (point) {
            _this._line.graphics.lineTo(point.x, point.y);
        });
        this._line.graphics.endFill();
    };
    return DrawTempLine;
}());
__reflect(DrawTempLine.prototype, "DrawTempLine");
