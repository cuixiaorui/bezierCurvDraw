# bezierCurvDraw
基于贝塞尔曲线拟合算法实现绘制平滑曲线

## 算法
 *  JavaScript implementation of
 *  Algorithm for Automatically Fitting Digitized Curves
 *  by Philip J. Schneider
 *  "Graphics Gems", Academic Press, 1990


## 实现

* 基于拟合算法生成对应的贝塞尔曲线点
* 基于生成的贝塞尔曲线点生成对应的绘制点
* 基于绘制点生成对应的线条

## 演示

### 功能
- 可动态编辑参数
    1. MaxError: 最大错误控制点(越小生成的线条准确点越高) 
    2. Tension: 张力(可控制曲线的样式)
    3. Segments: 精准度(越大线条越平滑,生成的点也更多）
- 可拖拽控制点
- 可在线条空白处生成控制点
- 双击线条可选中（改变颜色）

![](https://user-gold-cdn.xitu.io/2018/12/27/167ef1fbd9e3e251?w=1752&h=1136&f=jpeg&s=77339)

[演示地址](https://cuixiaorui.github.io/bezierCurvDraw/dist/index.html)


### 说明
demo 基于 egret 编写，在 canvas 的基础上实现的。
- 生成贝塞尔曲线点的库为 curve 
- 生成绘制点的逻辑在 DrawCurveCore.ts 内