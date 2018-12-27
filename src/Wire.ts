interface WireInfo {
    /**
     * 原始点
     */
    originalPointsData: any,
    /**
     * 贝塞尔曲线点
     */
    bezierCurvePointsData: any,
    /**
     * 绘制点
     */
    drawPointsData: any
}
/**
 * 导线
 */
class Wire {
    private _line: egret.Shape;
    private _drawInfo: WireInfo;
    private _container: egret.DisplayObjectContainer;
    private _wireStyle: any;
    private _unselectColor: any;
    private _selectColor: any;
    constructor(container: egret.DisplayObjectContainer, wireStyle) {
        this._wireStyle = wireStyle;
        this._selectColor = "0xcccccc"
        this._unselectColor = wireStyle.color;
        this._line = new egret.Shape();
        this._container = container;
        container.addChild(this._line);

        this._line.touchEnabled = true;
        this._line.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeginHandler, this);
    }
    private _tempTouchBeginPoint
    private onTouchBeginHandler(e: egret.TouchEvent) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        this._tempTouchBeginPoint = { x: e.stageX, y: e.stageY };
        this._container.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoveHandler, this);
        this._container.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEndHandler, this);
        this._container.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEndHandler, this);
    }
    private _isMove: boolean = false;

    private _isFirstMove: boolean = true;
    private _tempDragPoint: WireDragPoint;
    private onTouchMoveHandler(e: egret.TouchEvent) {
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
    }

    private onTouchEndHandler(e: egret.TouchEvent) {
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
    }

    public select() {
        this._wireStyle.color = this._selectColor;
        this.updateLine(this._drawInfo.drawPointsData);
    }

    public unselect(){
        this._wireStyle.color = this._unselectColor;
        this.updateLine(this._drawInfo.drawPointsData);
    }

    public draw(info: WireInfo) {
        this._drawInfo = info;
        this.update();
    }

    private update() {
        this.updateLine(this._drawInfo.drawPointsData);
        this.updateDragPoint();
    }

    private _dragPointList: Array<WireDragPoint> = []
    private updateDragPoint() {
        //先删除所有的拖拽点
        for (let j = this._dragPointList.length - 1; j >= 0; j--) {
            let dragPoint = this._dragPointList[j];
            if (dragPoint) {
                dragPoint.dispose();
                this._dragPointList.splice(j, 1);
            }
        }

        let len = this._drawInfo.bezierCurvePointsData.length;
        for (let i = 0; i < len; i += 2) {
            const x = this._drawInfo.bezierCurvePointsData[i];
            const y = this._drawInfo.bezierCurvePointsData[i + 1];
            var dragPoint: WireDragPoint = new WireDragPoint(i, this);
            this._container.addChild(dragPoint);
            dragPoint.x = x;
            dragPoint.y = y;
            this._dragPointList.push(dragPoint);
        }
    }

    private updateLine(points: any) {
        let startPoint = { x: points[0], y: points[1] };
        let lineToList = points.slice(2);
        this._line.graphics.clear();
        this._line.graphics.lineStyle(this._wireStyle.thickness, this._wireStyle.color, this._wireStyle.alpha);
        this._line.graphics.moveTo(startPoint.x, startPoint.y);
        for (let i = 0; i < lineToList.length; i += 2) {
            this._line.graphics.lineTo(lineToList[i], lineToList[i + 1]);
        }
        this._line.graphics.endFill();
    }

    public moveDragPoint(x, y, index) {
        this._drawInfo.bezierCurvePointsData[index] = x;
        this._drawInfo.bezierCurvePointsData[index + 1] = y;
        this._drawInfo.drawPointsData = DrawCurveControl.getInstance().createDrawPointsData(this._drawInfo.bezierCurvePointsData);
        this.updateLine(this._drawInfo.drawPointsData);
    }

    public getWireDragPointByPoint(point) {
        let len = this._dragPointList.length;
        for (let i = 0; i < len; i++) {
            let dragPoint: WireDragPoint = this._dragPointList[i];
            if (dragPoint.x === point.x && dragPoint.y === point.y) return dragPoint;
        }
        return null;
    }

    public updateStyle(){

        this._drawInfo.bezierCurvePointsData =  DrawCurveControl.getInstance().createBezierCurvePointsData(this._drawInfo.originalPointsData);
        this._drawInfo.drawPointsData = DrawCurveControl.getInstance().createDrawPointsData( this._drawInfo.bezierCurvePointsData);
        this.update();
    }
}