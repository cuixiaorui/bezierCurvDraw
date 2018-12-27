var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var DrawConst = (function () {
    function DrawConst() {
    }
    //最大错误控制点 越小的话 生成的线条准确点越高
    DrawConst.MaxError = 10;
    //张力 可控制曲线的样式 
    DrawConst.Tension = 0.5;
    //精准度 越大 线条越平滑（生成的点也更多）
    DrawConst.NumOfSeg = 100;
    return DrawConst;
}());
__reflect(DrawConst.prototype, "DrawConst");
