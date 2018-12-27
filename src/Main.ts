//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED By EGRET AND CONTRIBUTORS "AS IS" AND ANy ExPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITy AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANy DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, ExEMPLARy, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANy THEORy OF
//  LIABILITy, WHETHER IN CONTRACT, STRICT LIABILITy, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANy WAy OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITy OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {



    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin

            context.onUpdate = () => {

            }
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        this.runGame().catch(e => {
            console.log(e);
        })



    }

    private async runGame() {
        await this.loadResource()
        this.createGameScene();
        await platform.login();
        const userInfo = await platform.getUserInfo();
    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        this.createBg();
        this.initContorlBar();
        DrawCurveControl.getInstance().init(this);
    }

    private createBg(){
        var rect: egret.Shape = new egret.Shape();
        rect.graphics.beginFill(0x000000, 1);
        rect.graphics.drawRect(0, 0, 3000, 3000);
        rect.graphics.endFill();
        this.addChild(rect);

    }

    private initContorlBar(){
        //MaxError
        var errorInput:any = document.querySelector(`#errorInput`);
        var errorValue:any = document.querySelector(`#errorValue`);
        errorInput.addEventListener('input', function () {
            var error = parseInt(this.value);
            errorValue.innerText = error;
            DrawConst.MaxError = error;
            DrawCurveControl.getInstance().updateAllWire();
        });

        //Tension
        var tensionInput:any = document.querySelector(`#tensionInput`);
        var tensionValue:any = document.querySelector(`#tensionValue`);
        tensionInput.addEventListener('input', function () {
            var tension = parseInt(this.value);
            tensionValue.innerText = tension;
            DrawConst.Tension = tension / 100;
            DrawCurveControl.getInstance().updateAllWire();
        });

        //numSegments
        var numSegmentsInput:any = document.querySelector(`#numSegmentsInput`);
        var numSegmentsValue:any = document.querySelector(`#numSegmentsValue`);
        numSegmentsInput.addEventListener('input', function () {
            var numSegment = parseInt(this.value);
            numSegmentsValue.innerText = numSegment;
            DrawConst.NumOfSeg = numSegment;
            DrawCurveControl.getInstance().updateAllWire();
        });
    }
}