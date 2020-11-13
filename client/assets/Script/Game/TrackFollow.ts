import Global from "../Global";

const { ccclass, property, menu } = cc._decorator;

@ccclass()
@menu("Game/轨道式追踪目标")
export default class TrackFollow extends cc.Component {

    /** 移动速度 */
    @property({ displayName: "移动速度" })
    protected speed: number = 2.5;

    /** 跟踪对象 */
    protected target: cc.Node = null;

    /** 终点距离 */
    private endDistance: number = 0;

    /** 初始化 */
    private init() {
        this.target = Global.Game.targetNode;
        const targetDistance = Math.min(this.target.width * this.target.anchorX, this.target.height * this.target.anchorY);
        const selfDistance = this.node.height * this.node.anchorY;
        // console.log(targetDistance, selfDistance);
        this.endDistance = targetDistance + selfDistance;
    }

    /** 跟踪导弹计算移动以及转向角度 */
    private followTarget() {
        const targetPosition = this.target.position; // 这里的目标坐标必须要和当前节点同一层父节点，否则要转换到相对坐标
        const point = cc.v2(this.node.x, this.node.y);
        const delta = targetPosition.sub(point);
        const distance = point.sub(targetPosition).mag();
        const x2 = point.x + this.speed * delta.x / distance;
        const y2 = point.y + this.speed * delta.y / distance;
        const newPosition = cc.v2(x2, y2);
        const x1 = point.x;
        const y1 = point.y;
        const deltaRotation = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI - 90;
        this.node.angle = deltaRotation;
        
        if (distance <= this.endDistance) {
            // console.log("到达目标");
            return;
        }
        this.node.setPosition(newPosition);
    }

    // LIFE-CYCLE CALLBACKS:

    start() {
        this.init();
    }

    update(dt: number) {
        this.followTarget();
    }
}
