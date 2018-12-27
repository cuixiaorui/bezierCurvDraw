/*!	Curve function for canvas 2.3.1
 *	Epistemex (c) 2013-2014
 *	www.epistemex.com
 *	License: MIT
 */
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Draws a cardinal spline through given point array. Points must be arranged
 * as: [x1, y1, x2, y2, ..., xn, yn]. It adds the points to the current path.
 *
 * The method continues previous path of the context. If you don't want that
 * then you need to use moveTo() with the first point from the input array.
 *
 * The points for the cardinal spline are returned as a new array.
 *
 * @param {CanvasRenderingContext2D} ctx - context to use
 * @param {Array} points - point array
 * @param {Number} [tension=0.5] - tension. Typically between [0.0, 1.0] but can be exceeded
 * @param {Number} [numOfSeg=20] - number of segments between two points (line resolution)
 * @returns {Float32Array} New array with the calculated points that was added to the path
 */
var DrawCurveCore = (function () {
    function DrawCurveCore() {
    }
    DrawCurveCore.curve = function (points, tension, numOfSeg) {
        // options or defaults
        // tension = (typeof tension === 'number') ? tension : 0.5;
        // numOfSeg = numOfSeg ? numOfSeg : 25;
        if (tension === void 0) { tension = 0.5; }
        if (numOfSeg === void 0) { numOfSeg = 100; }
        var pts, // for cloning point array
        i = 1, l = points.length, rPos = 0, rLen = (l - 2) * numOfSeg + 2 + 0, res = new Float32Array(rLen), cache = new Float32Array((numOfSeg + 2) * 4), cachePtr = 4;
        pts = points.slice(0);
        pts.unshift(points[1]); // copy 1. point and insert at beginning
        pts.unshift(points[0]);
        pts.push(points[l - 2], points[l - 1]); // duplicate end-points
        // cache inner-loop calculations as they are based on t alone
        cache[0] = 1; // 1,0,0,0
        for (; i < numOfSeg; i++) {
            var st = i / numOfSeg, st2 = st * st, st3 = st2 * st, st23 = st3 * 2, st32 = st2 * 3;
            cache[cachePtr++] = st23 - st32 + 1; // c1
            cache[cachePtr++] = st32 - st23; // c2
            cache[cachePtr++] = st3 - 2 * st2 + st; // c3
            cache[cachePtr++] = st3 - st2; // c4
        }
        cache[++cachePtr] = 1; // 0,1,0,0
        // calc. points
        parse(pts, cache, l);
        function parse(pts, cache, l) {
            for (var i = 2, t; i < l; i += 2) {
                var pt1 = pts[i], pt2 = pts[i + 1], pt3 = pts[i + 2], pt4 = pts[i + 3], t1x = (pt3 - pts[i - 2]) * tension, t1y = (pt4 - pts[i - 1]) * tension, t2x = (pts[i + 4] - pt1) * tension, t2y = (pts[i + 5] - pt2) * tension;
                for (t = 0; t < numOfSeg; t++) {
                    var c = t << 2, //t * 4;
                    c1 = cache[c], c2 = cache[c + 1], c3 = cache[c + 2], c4 = cache[c + 3];
                    res[rPos++] = c1 * pt1 + c2 * pt3 + c3 * t1x + c4 * t2x;
                    res[rPos++] = c1 * pt2 + c2 * pt4 + c3 * t1y + c4 * t2y;
                }
            }
        }
        // add last point
        l = points.length - 2;
        res[rPos++] = points[l];
        res[rPos] = points[l + 1];
        return res;
    };
    return DrawCurveCore;
}());
__reflect(DrawCurveCore.prototype, "DrawCurveCore");
