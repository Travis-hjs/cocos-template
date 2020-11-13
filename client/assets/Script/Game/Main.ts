import Global from "../Global";
import WeChat from "../Modules/wechat";
import utils from "../utils";

const { ccclass, property, menu } = cc._decorator;

@ccclass()
@menu('Game/主程序')
export default class Main extends cc.Component {
    /** 移动的物体 */
    @property(cc.Node)
    public ball: cc.Node = null;

    /** 炮台 */
    @property(cc.Node)
    public batteryNode: cc.Node = null;

    @property(cc.Node)
    public targetNode: cc.Node = null;

    /** 子弹预制体 */
    @property(cc.Prefab)
    protected bulletPrefab: cc.Prefab = null;

    /** 加载框 */
    @property(cc.Prefab)
    public loadingBox: cc.Prefab = null;

    /** 子弹对象池 */
    private readonly bulletPool: Array<cc.Node> = [];

    /** 速度状态 */
    protected sppedState: boolean = false;

    /** 速度倍数 */
    protected speed: number = 1;

    /** 缓动系数 */
    protected value: number = 30;

    /** 排行榜 */
    public rankBox: cc.Node = null;

    /** 打开排行榜 */
    public openRank() {
        if (this.rankBox) {
            this.rankBox.active = true;
        } else {
            utils.loadPrefab('rank-box', res => {
                this.rankBox = cc.instantiate(res);
                this.rankBox.parent = this.node;
            });
        }
    }

    /** 分享或者看视频 */
    public testShare() {
        WeChat.getReward(function () {
            console.log('领取成功!!!!!');
        }, 'xxx');
    }

    /** 设置 ball 颜色 */
    public setBoxColor() {
        let color = {
            r: Math.floor(255 * Math.random()) + 1,  
            g: Math.floor(255 * Math.random()) + 1,
            b: Math.floor(255 * Math.random()) + 1
        }
        // this.ball.color = new cc.color(color);
        const image = cc.find('image', this.ball);
        image.color = cc.color(color.r, color.g, color.b);
    }

    /** 从对象池获取子弹 */
    public getBullet() {
        let bullet: cc.Node = null;
        if (this.bulletPool.length > 0) {
            bullet = this.bulletPool.shift();
        } else {
            bullet = cc.instantiate(this.bulletPrefab);
        }
        return bullet;
    }

    /**
     * 回收子弹节点到对象池中
     * @param bullet 子弹节点
     */
    public putBullet(bullet: cc.Node) {
        bullet.removeFromParent(true);
        this.bulletPool.push(bullet);
    }

    /** 创建子弹对象池 */
    private createBulletPool() {
        for (let i = 0; i < 10; i++) {
            let bullet = cc.instantiate(this.bulletPrefab);
            this.bulletPool.push(bullet);
        }
    }

    /** 发射 */
    private launch(event: any) {
        // console.log(event, event.touch, event.touch._point);
        /** 点击的坐标位置 */
        let clickPosition = this.node.convertToNodeSpaceAR(event.touch._point);
        /** 旋转目标节点位置 */
        let nodePosition = this.batteryNode.getPosition();
        /** 弧度 */
        let radian = 0;
        /** 角度 */
        let angle = 0;

        // 方法一：
        if (clickPosition.y < nodePosition.y) {
            // 炮台向下
            radian = Math.atan((clickPosition.x - nodePosition.x) / (nodePosition.y - clickPosition.y));
            angle = radian * 180 / Math.PI + 180;
        } else {
            // 炮台向上
            radian = Math.atan((nodePosition.x - clickPosition.x) / (clickPosition.y - nodePosition.y));
            angle = radian * 180 / Math.PI;
        }

        /** 
         * 方法二：
         * 只有旋转节点坐标为(0, 0)才生效 所以要做下坐标偏移
        */
        // clickPosition.x = clickPosition.x - nodePosition.x;
        // clickPosition.y = clickPosition.y - nodePosition.y;
        // angle = utils.rotateAngle(clickPosition.x, clickPosition.y);

        // 最后节点角度旋转
        this.batteryNode.angle = angle;
        // console.log(angle);

        const bullet = this.getBullet();
        bullet.parent = this.node;
    }

    /** 初始化子弹发射 */
    private initLaunch() {
        this.node.on('touchstart', this.launch, this);
        this.node.on('touchmove', this.launch, this);
    }

    /** 速度切换 */
    public speedSwitch() {
        if (this.sppedState) {
            this.sppedState = false;
            this.speed = 1;
        } else {
            this.sppedState = true;
            this.speed = 0.2;
        }
    }

    /** 加速 */
    public accelerate() {
        this.speed = 2;
    }

    /** 初始目标位置 */
    private initTargetNode() {
        const left = this.node.width / 2 - this.targetNode.width / 2 - 10;
        const top = this.node.height / 2 -  this.targetNode.height / 2 - 10;
        const positionList = [
            {
                x: left,
                y: top
            }, {
                x: left,
                y: -top
            }, {
                x: -left,
                y: top
            }, {
                x: -left,
                y: -top
            }
        ]

        this.targetNode.runAction(
            cc.repeatForever(
                cc.sequence(
                    cc.moveTo(2, cc.v2(positionList[0])),
                    cc.moveTo(2, cc.v2(positionList[2])),
                    cc.moveTo(2, cc.v2(positionList[3])),
                    cc.moveTo(2, cc.v2(positionList[1])),
                )
            )
        );
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Global.Game = this;
        this.createBulletPool();
        this.initLaunch();
        utils.setLoadingBox(cc.instantiate(this.loadingBox), this.node);
        // window['bulletPool'] = this.bulletPool;
        this.initTargetNode();
    }

    start() {
        
        // 设置 onshow 监听
        WeChat.onShow = res => {

        }

        // 设置 onhide 监听
        WeChat.onHide = () => {

        }
    }

    update(dt: number) {
        if (!this.ball) return;
        this.value -= 1 * this.speed;
        this.ball.y += this.value * this.speed;
        if (this.ball.y <= -500) {
            this.ball.y = -500;
            this.value = 30;
        }
        // 自定义的圆角遮罩，只在 onEnable 时更新视图，这里每一帧都变化，所以要重绘
        this.ball.getComponent('TheRectMask').drawRadius();
    }
}
