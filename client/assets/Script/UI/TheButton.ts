const { ccclass, property, menu, requireComponent } = cc._decorator;

/** UI 按钮 */
@ccclass()
@menu("自定义组件/按钮")
@requireComponent(cc.Button)
export default class TheButton extends cc.Component {

    @property({ displayName: "摁下去缩放值" })
    private touchScale: number = 0.85;

    @property({ displayName: "动画过渡时间" })
    private transDuration: number = 0.1;

    @property({ displayName: "摁下去的透明度" })
    private touchOpacity: number = 255;

    @property({ displayName: "是否需要点击动画" })
    private isClick: boolean = false;

    @property({ displayName: "按下时按钮变灰" })
    private isGray: boolean = false;

    /** 按钮初始透明值 */
    private initOpacity: number = null;

    /** 按钮初始化缩放值 */
    private initScale: number = null;

    /** 点击动画 */
    protected clickMove() {
        this.node.stopAllActions();
        let seq = cc.sequence(cc.scaleTo(0.1, 1.1, 1.1), cc.scaleTo(0.1, 0.8, 0.8), cc.scaleTo(0.1, 1.2, 1.2), cc.scaleTo(0.1, 1, 1));
        this.node.runAction(seq);
    }

    protected onTouchDown() {
        // cc.log("摁下");
        if (this.isGray) {
            this.node.color = cc.color(140, 140, 140);
        } else {
            this.node.stopAllActions();
            this.node.runAction(cc.scaleTo(this.transDuration, this.touchScale));
            this.node.opacity = this.touchOpacity;
        }
    }

    protected onTouchUp() {
        // cc.log("松开");
        if (this.isGray) {
            this.node.color = cc.color(255, 255, 255);
        } else {
            this.node.stopAllActions();
            this.node.runAction(cc.scaleTo(this.transDuration, this.initScale));
            this.node.opacity = this.initOpacity;
        }
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        if (!this.isClick) {
            this.initScale = this.node.scale;
            this.initOpacity = this.node.opacity;
            // console.log("透明度", this.initOpacity);
            this.node.on("touchstart", this.onTouchDown, this);
            this.node.on("touchend", this.onTouchUp, this);
            this.node.on("touchcancel", this.onTouchUp, this);
        }
    }

    // start() {}

    // update (dt) {}
}
