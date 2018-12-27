class DrawCurveControl {
    private _container: egret.DisplayObjectContainer;
    private _tempLine: DrawTempLine;
    private _wireList: Array<Wire>
    private static _instance: any;
    public static getInstance() {
        if (!DrawCurveControl._instance) {
            DrawCurveControl._instance = new DrawCurveControl();
            return DrawCurveControl._instance;
        }
        return DrawCurveControl._instance;
    }
    public init(container: egret.DisplayObjectContainer) {
        this._container = container;
        this._wireList = [];

        this._container.touchEnabled = true;
        this._container.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeginHandler, this);

        this._tempLine = new DrawTempLine(container);
    }

    private onTouchBeginHandler() {
        this._container.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoveHandler, this);
        this._container.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEndHandler, this);
        this._container.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEndHandler, this);
    }

    private onTouchMoveHandler(e: egret.TouchEvent) {
        let point: egret.Point = new egret.Point(e.stageX, e.stageY);
        this._tempLine.addPoint(point)
    }

    private onTouchEndHandler() {
        this._container.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoveHandler, this);
        this._container.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEndHandler, this);
        this._container.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEndHandler, this);

        this.unselectAllWire();
        if (this.isCanCreateWire()) {
            this.createWire();
        }

        
        this._tempLine.clear();
    }

    private unselectAllWire(){
        this._wireList.forEach(element => {
            element.unselect();
        });
    }

    private isCanCreateWire() {
        return this.createOriginalPointsData().length >= 2;
    }

    private createWire() {
        let originalPointsData = this.createOriginalPointsData();
        let bezierCurvePointsData = this.createBezierCurvePointsData(originalPointsData);
        let drawPointsData = this.createDrawPointsData(bezierCurvePointsData);
        var wire: Wire = new Wire(this._container,{
            thickness: 5,
            color: 0x00ff00,
            alpha: 1
        });
        wire.draw({
            originalPointsData,
            bezierCurvePointsData,
            drawPointsData
        });
        this._wireList.push(wire);
    }

    /**
     * 创建原始数据
     * 包含的是 touchMove 收集的点
     */
    public createOriginalPointsData() {
        var pointList = this._tempLine.getPointList();
         //把 point 改为 [x,y] 格式
        return pointList.map((point: egret.Point) => {
            return [point.x, point.y]
        })
    }

    /**
     * 创建贝塞尔曲线数据
     */
    public createBezierCurvePointsData(originalPointsData) {
        if (originalPointsData.length < 2) return [];
        var bezierCurvePointsData: any = fitCurve(originalPointsData, DrawConst.MaxError, null);
        //添加开始点到贝塞尔曲线数据内
        return bezierCurvePointsData.reduce((list, arr) => {
            if (list.length === 0) {
                let p1 = arr[0];
                list.push(...p1);
            }
            var p2 = arr[3];
            list.push(...p2);

            return list;
        }, []);
    }

    /**
     * 创建绘制数据
     */
    public createDrawPointsData(bezierCurvePointsData) {
        return DrawCurveCore.curve(bezierCurvePointsData, DrawConst.Tension, DrawConst.NumOfSeg);
    }

    /**
     * 添加贝塞尔曲线点
     */
    public addBezierCurvePoint(curvePoint, wireInfo:WireInfo){
        const drawDataSegment = this.slicePointsData(wireInfo);
        const index = this.getIndexOfLine(curvePoint,drawDataSegment);
        let point = [curvePoint.x,curvePoint.y];
        let bcIndex = (index + 1) * 2;
        wireInfo.bezierCurvePointsData.splice(bcIndex,0,...point);
    }

    //获取当前点所在线的索引
    private getIndexOfLine(curvePoint,drawPoints){
        const RANGE = 5;
        //2. 基于每段内的数据 -》检测点是否在直线上
        for(let i=0; i<drawPoints.length; i++){
            let points = drawPoints[i];
            for(let j=0; j<points.length; j++){
                let pointA = points[j];
                let pointB = points[j + 1];
                if(pointB){
                    let boo = this.getPointIsInLine(curvePoint,pointA,pointB,RANGE);
                    if(boo){
                        return i;
                    }
                }
            }
        }
    }

    //通过原贝塞尔曲线点 把 绘制点 分片
    private slicePointsData(wireInfo){
        let bezierCurvePointsData = wireInfo.bezierCurvePointsData.slice();
        let drawPointsData = wireInfo.drawPointsData.slice();
        var checkoutPoints = [];
        for(let i=0,len= bezierCurvePointsData.length;i<len;i+=2){
            let bcPoint = {
                x: bezierCurvePointsData[i],
                y: bezierCurvePointsData[i+1],
            }
            var points = [];
            for(let j=2,len = drawPointsData.length; j<len; j+=2){
                let dPoint = {
                    x:drawPointsData[j],
                    y:drawPointsData[j+1]
                }

                if(bcPoint.x === dPoint.x && bcPoint.y === dPoint.y){
                    checkoutPoints.push(points);
                    drawPointsData = drawPointsData.slice(j);
                    break;
                }else{
                    points.push(dPoint);
                }
            }
        }
        return checkoutPoints;
    }

    /**
     * 检测点是否在直线上
     * @param pf 检测点
     * @param p1 线的开始点
     * @param p2 线的结束点
     * @param range 误差值
     */
    public getPointIsInLine(pf,p1,p2,range){
        const cross = (p2.x - p1.x) * (pf.x - p1.x) + (p2.y - p1.y) * (pf.y - p1.y);
        if(cross <= 0) return false;
        const d2 = (p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y);
        if(cross >= d2) return false;

        let r = cross / d2;
        let px = p1.x + (p2.x - p1.x) * r;
        let py = p1.y + (p2.y - p1.y) * r;
        return Math.sqrt((pf.x - px) * (pf.x - px) + (py - pf.y) * (py - pf.y)) <= range;
    }

    /**
     * 更新所有的导线
     * 主要变更样式
     */
    public updateAllWire(){
        this._wireList.forEach(wire => {
                wire.updateStyle();
        });
    }


}