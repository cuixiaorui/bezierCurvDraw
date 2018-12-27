class WireDragPoint extends egret.DisplayObjectContainer{
    private _shape:egret.Shape;
    private _index;
    private _wire:Wire;
    constructor(index:number,wire:Wire){
        super();
        this._index = index;
        this._wire = wire;
        this.initShape();
        this._shape.touchEnabled = true;
        this._shape.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeginHandler, this);
    }

    private onTouchBeginHandler(e: egret.TouchEvent) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        this.parent.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoveHandler, this);
        this.parent.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEndHandler, this);
        this.parent.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEndHandler, this);
    }

    private onTouchMoveHandler(e: egret.TouchEvent){
        e.stopPropagation();
        e.stopImmediatePropagation();
        this.x = e.stageX;
        this.y = e.stageY;
        this._wire.moveDragPoint(e.stageX,e.stageY,this._index);
    }

    private onTouchEndHandler(e: egret.TouchEvent) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        this.parent.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoveHandler, this);
        this.parent.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEndHandler, this);
        this.parent.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEndHandler, this);
    }

    private initShape(){
        this._shape = new egret.Shape();
        this._shape.graphics.beginFill(0xff0000,1);
        this._shape.graphics.drawCircle(0,0,5);
        this._shape.graphics.endFill();
        this.addChild(this._shape);
    }

    public dispose(){
        this.parent.removeChild(this);
        this._shape.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeginHandler, this);
    }

    public getIndex(){
        return this._index;
    }

}