enum TempLineStyleConst {
    thickness = 5,
    color = 0xff0000,
    alpha = 1
}
/**
 * 临时绘制的线
 */
class DrawTempLine {
    private _pointList: Array<any>;
    private _line: egret.Shape;
    constructor(container: egret.DisplayObjectContainer) {
        this._pointList = [];
        this._line = new egret.Shape();
        container.addChild(this._line);
    }

    public clear() {
        this._pointList = [];
        this.update();
    }

    public addPoint(point: egret.Point) {
        this._pointList.push(point);
        this.update();
    }

    public getPointList() {
        return this._pointList.slice();
    }

    private update() {

        let startPoint = this._pointList[0];
        let lineToList = this._pointList.slice(1);
        this._line.graphics.clear();
        if (this._pointList.length <= 1) return;
        this._line.graphics.lineStyle(TempLineStyleConst.thickness, TempLineStyleConst.color, TempLineStyleConst.alpha);
        this._line.graphics.moveTo(startPoint.x, startPoint.y);
        lineToList.forEach(point => {
            this._line.graphics.lineTo(point.x, point.y);
        });

        this._line.graphics.endFill();
    }
}