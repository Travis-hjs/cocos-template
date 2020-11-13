const {ccclass, property, menu} = cc._decorator;

@ccclass()
@menu("Game/旋涡式移动到指定目标")
export default class VortexFollw extends cc.Component {

    /** 指定目标 */
    @property({ type: cc.Node, displayName: "指定目标"})
    protected target: cc.Node = null;

    @property({ displayName: "速度值" })
    private speed: number = 0.02;

    /** 角度 */
    private angle = 0;

    /** 向量距离 */
    private distance = 0;
    
    private stop = false;

    private init() {
        this.stop = false;
        this.angle = 0;
        this.distance = (this.target.position.sub(this.node.position)).mag();
    }

    private move() {
        this.angle += 5;
        this.distance = cc.misc.lerp(this.distance, 0, this.speed);
        const x = (this.target.position.x + this.distance * Math.sin(this.angle * Math.PI / 180)) >> 0;
        const y = (this.target.position.y + this.distance * Math.cos(this.angle * Math.PI / 180)) >> 0;
        this.node.position = cc.v2(x, y);
        if (this.distance < 1) {
            this.stop = true;
        }
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.init();
    }

    update(dt: number) {
        if (this.stop) return;
        this.move();
    }
}
