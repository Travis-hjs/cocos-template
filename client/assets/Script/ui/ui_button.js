import Global from "../Global";

/** UI 按钮  */
const UiButton = cc.Class({
    extends: cc.Component,

    editor: {
        requireComponent: cc.Button,
        menu: '自定义组件/按钮',
    },

    properties: {
        touchScale: {
            default: 0.85,
            displayName: '摁下去缩放值'
        },
        transDuration: {
            default: 0.1,
            displayName: '动画过渡时间'
        },
        touchOpacity: {
            default: 255,
            displayName: '摁下去的透明度'
        },
        isClick: {
            default: false,
            displayName: '是否需要点击动画'
        },
        isGray: {
            default: false,
            displayName: '按下时按钮变灰'
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // 点击动画
    clickMove() {
        this.node.stopAllActions();
        let seq = cc.sequence(cc.scaleTo(0.1, 1.1, 1.1), cc.scaleTo(0.1, 0.8, 0.8), cc.scaleTo(0.1, 1.2, 1.2), cc.scaleTo(0.1, 1, 1));
        this.node.runAction(seq);
        if (Global.musicSystem.click && Global.Game.clickAudio) {
            cc.audioEngine.play(Global.Game.clickAudio);
        }
    },

    onTouchDown(e) {
        // cc.log('摁下');
        if (this.isGray) {
            this.node.color = new cc.color('#8c8c8c');
        } else {
            this.node.stopAllActions();
            this.node.runAction(cc.scaleTo(this.transDuration, this.touchScale));
            this.node.opacity = this.touchOpacity;
        }
        if (Global.musicSystem.click && Global.Game.clickAudio) {
            cc.audioEngine.play(Global.Game.clickAudio);
        }
    },

    onTouchUp(e) {
        // cc.log('松开');
        if (this.isGray) {
            this.node.color = new cc.color('#ffffff');
        } else {
            this.node.stopAllActions();
            this.node.runAction(cc.scaleTo(this.transDuration, this.initScale));
            this.node.opacity = this.initOpacity;
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        if (!this.isClick) {
            this.initScale = this.node.scale;
            this.initOpacity = this.node.opacity;
            // console.log('透明度', this.initOpacity);
            this.node.on('touchstart', this.onTouchDown, this);
            this.node.on('touchend', this.onTouchUp, this);
            this.node.on('touchcancel', this.onTouchUp, this);
        }
    }
});
export default UiButton;