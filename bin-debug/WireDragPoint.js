var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var WireDragPoint = (function (_super) {
    __extends(WireDragPoint, _super);
    function WireDragPoint(index, wire) {
        var _this = _super.call(this) || this;
        _this._index = index;
        _this._wire = wire;
        _this.initShape();
        _this._shape.touchEnabled = true;
        _this._shape.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _this.onTouchBeginHandler, _this);
        return _this;
    }
    WireDragPoint.prototype.onTouchBeginHandler = function (e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        this.parent.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoveHandler, this);
        this.parent.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEndHandler, this);
        this.parent.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEndHandler, this);
    };
    WireDragPoint.prototype.onTouchMoveHandler = function (e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        this.x = e.stageX;
        this.y = e.stageY;
        this._wire.moveDragPoint(e.stageX, e.stageY, this._index);
    };
    WireDragPoint.prototype.onTouchEndHandler = function (e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        this.parent.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoveHandler, this);
        this.parent.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEndHandler, this);
        this.parent.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEndHandler, this);
    };
    WireDragPoint.prototype.initShape = function () {
        this._shape = new egret.Shape();
        this._shape.graphics.beginFill(0xff0000, 1);
        this._shape.graphics.drawCircle(0, 0, 5);
        this._shape.graphics.endFill();
        this.addChild(this._shape);
    };
    WireDragPoint.prototype.dispose = function () {
        this.parent.removeChild(this);
        this._shape.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeginHandler, this);
    };
    WireDragPoint.prototype.getIndex = function () {
        return this._index;
    };
    return WireDragPoint;
}(egret.DisplayObjectContainer));
__reflect(WireDragPoint.prototype, "WireDragPoint");
