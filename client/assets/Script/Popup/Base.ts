
const {ccclass, property} = cc._decorator;

/** 弹出层（基类） */
@ccclass()
export default class Popup extends cc.Component {

    /** 中间弹出层 */
    @property({ type: cc.Node, displayName: "中间弹出层" })
    protected popBox: cc.Node = null;

    /** 旋转光环 */
    @property({ type: cc.Node, displayName: "旋转光环" })
    protected ringNode: cc.Node = null;

    /** 关闭当前组件节点 */
    public close() {
        this.node.active = false;
    }

    /**
     * 出现动画 弹框式
     * @param {cc.Node} node 默认是 this.popBox
     */
    public showMove(node: cc.Node = null) {
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
    }

    /**
     * 滑动 出现
     * @param {cc.Node} node 滑动的节点
     * @param {number} width 滑动的宽度
     */
    public slideMove(node: cc.Node, width: number) {
        node.stopAllActions();
        node.x = width;
        let action = cc.moveTo(0.3, 0, -41);
        action.easing(cc.easeElasticInOut(3.0));
        node.runAction(action);
    }

    /**
     * 光环动画
     * @param {cc.Node} node 默认是 this.popBox
     */
    public ringMove(node: cc.Node = null) {
        let ring = node ? node : this.ringNode;
        ring.runAction(cc.repeatForever(
            cc.sequence(
                cc.spawn(cc.scaleTo(0.5, 1.2), cc.rotateBy(0.5, 36)),
                cc.spawn(cc.scaleTo(0.5, 0.9), cc.rotateBy(0.5, 36)),
            )
        ))
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    // start () {}

    // update (dt) {}
}
