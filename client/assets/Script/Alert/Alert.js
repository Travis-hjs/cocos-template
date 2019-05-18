/** 弹出层 基类 */
const Alert = cc.Class({
    extends: cc.Component,

    properties: {
        popBox: {
            default: null,
            type: cc.Node,
            displayName: '中间弹出层'
        },
        ringNode: {
            default: null,
            type: cc.Node,
            displayName: '旋转光环'
        }
    },

    close() {
        this.node.active = false;
    },

    /**
     * 出现动画 弹框式
     * @param {cc.Node} node 默认是 this.popBox
     */
    showMove(node = null) {
        let content = node ? node : this.popBox;
        content.stopAllActions();
        content.setScale(0.5);
        content.opacity = 0;
        let action = cc.spawn(cc.fadeIn(0.15), cc.scaleTo(0.15, 1.1, 1.1));
        action.easing(cc.easeElasticInOut(3.0));
        content.runAction(cc.sequence(
            action,
            cc.scaleTo(0.1, 1, 1)
        ));
    },

    /**
     * 滑动 出现
     * @param {cc.Node} node 滑动的节点
     * @param {number} width 滑动的 X 距离
     */
    slideMove(node, width) {
        node.stopAllActions();
        node.x = width;
        let action = cc.moveTo(0.3, 0, -41);
        action.easing(cc.easeElasticInOut(3.0));
        node.runAction(action);
    },

    /**
     * 光环动画
     * @param {cc.Node} node 默认是 this.popBox
     */
    ringMove(node = null) {
        let ring = node ? node : this.ringNode;
        ring.runAction(cc.repeatForever(
            cc.sequence(
                cc.spawn(cc.scaleTo(0.5, 1.2), cc.rotateBy(0.5, 36)),
                cc.spawn(cc.scaleTo(0.5, 0.9), cc.rotateBy(0.5, 36)),
            )
        ))
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {},

    // update (dt) {},
});

export default Alert;