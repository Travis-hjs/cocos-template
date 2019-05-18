import Global from "../Global";

/** 子弹控制脚本 */
cc.Class({
    extends: cc.Component,

    properties: {
        speed: {
            default: 800,
            displayName: '子弹速度'
        },
        angle: {
            default: 0,
            displayName: '子弹旋转角度'
        }
    },

    init() {
        /** 发射点 */
        let size = 80;
        /** 发射的炮台 */
        let node = Global.Game.batteryNode;
        this.node.angle = this.angle = node.angle;
        /** 转换成自己的坐标 */
        let pos = cc.v2(node.x - size * Math.sin(this.angle / 180 * 3.14), node.y + size * Math.cos(this.angle / 180 * 3.14));
        this.node.position = pos;
        this.launch = true;
    },

    // LIFE-CYCLE CALLBACKS:

    onEnable() {
        this.init();
    },

    onLoad() {
        let w = this.node.width / 2;
        // 节点回收范围 
        this.range = {
            w: cc.winSize.width / 2 + w,
            h: cc.winSize.height / 2 + w
        }
    },

    // start () {},

    update(dt) {
        if (!this.launch) return;

        this.node.x -= dt * this.speed * Math.sin(this.angle / 180 * 3.14);
        this.node.y += dt * this.speed * Math.cos(this.angle / 180 * 3.14);
        
        /** 检测是否相交 */
        let intersects = this.node.getBoundingBoxToWorld().intersects(Global.Game.ball.getBoundingBoxToWorld());
        
        if (intersects) {
            this.launch = false;
            Global.Game.bulletPool.put(this.node);
            return Global.Game.setBoxColor();
            // return cc.log('子弹击中白色盒子');
        }

        if (this.node.x > this.range.w || this.node.x < -this.range.w || this.node.y > this.range.h || this.node.y < -this.range.h) {
            this.launch = false;
            Global.Game.bulletPool.put(this.node);
        }
    },
});
