/** 矩形圆角遮罩 */
const RectMask = cc.Class({
    extends: cc.Component,

    editor: {
        requireComponent: cc.Mask,
        menu: '自定义组件/矩形圆角遮罩',
        executeInEditMode: true,    // 在编辑器里执行
        disallowMultiple: true      // 防止节点添加重复组件
    },

    properties: {
        /** 圆角半径 */
        radius: {
            default: 20,
            type: cc.Integer,
            visible: false
        },
        boxRadius: {
            displayName: '圆角半径',
            set(value) {
                this.radius = value;
                this.drawRadius();
            },
            get() {
                return this.radius;
            }
        },
        /** 矩形大小 */
        size: {
            default: new cc.Vec2(),
            visible: false
        },
        boxSize: {
            displayName: '矩形大小',
            set(value) {
                this.size = value;
                this.node.setContentSize(value.x, value.y);
                this.image.setContentSize(value.x, value.y);
            },
            get() {
                return this.size;
            }
        },
        image: {
            default: null,
            type: cc.Node,
            visible: false
        },
    },

    // 绘制圆角
    drawRadius() {
        /** 当前节点尺寸 */
        let size = this.node.getContentSize();
        /** 矩形 */
        let rect = cc.rect(-size.width / 2, -size.height / 2, size.width, size.height);
        let graphics = this.getComponent(cc.Mask)['_graphics'];
        this.drawRoundRect(graphics, rect);
    },

    /**
     * 绘制圆角矩形
     * @param {cc.Graphics} graphics 
     * @param {cc.Rect} rect 
     */
    drawRoundRect(graphics, rect) {
        let { x, y, width, height } = rect;
        //清空所有路径
        graphics.clear();
        //线条宽度
        graphics.lineWidth = 1;
        //矩形
        graphics.roundRect(x, y, width, height, this.radius);
        //填充
        graphics.fill();
        //绘制
        graphics.stroke();
    },

    // 检测 img 没有就添加
    checkImage() {
        if (cc.find('image', this.node)) return;
        this.image = new cc.Node('image');
        this.image.parent = this.node;
        this.image.addComponent(cc.Sprite);
        /** 图片组件 */
        let image_sprite = this.image.getComponent(cc.Sprite);
        image_sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
    },

    // LIFE-CYCLE CALLBACKS:

    onEnable() {
        // 这里每次都要重新绘画
        this.drawRadius();
        console.log('执行 onEnable');
    },

    // onLoad() {},

    start() {
        // 这里写在onload里面不生效
        // console.log(this.size);
        this.checkImage();
    },

    // update (dt) {
    //     this.drawRadius();
    // },
});
export default RectMask;