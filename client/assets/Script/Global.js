class GlobalModule{
    constructor() {}

    /** 游戏主程序 */
    Game = null;
    
    /** 游戏参数 */
    gameInfo = {
        /** 游戏分数 */
        score: 0,
        /** 用户授权状态 */
        authorization: false
    }

    /** 音效管理 */
    musicSystem = {
        /** 背景音效 */
        bg: true,
        /** 点击音效 */
        click: true
    }

    /** 用户数据 */
    userData = {

    }

    /** 游戏设置 */
    config = {

    }

    /** api上传数据 */ 
    uploadInfo = {
        __userInfo: {},
        __rankInfo: {},
        dataKey: null
    }

    /** 保存数据到本地 */
    saveData() {
        window.localStorage.setItem('name', JSON.stringify(this.userData));
    }

    /** 获取本地数据 */ 
    fetchData() {
        let data = window.localStorage.getItem('name') ? JSON.parse(window.localStorage.getItem('name')) : null;
        return data;
    }

    /** 清除本地数据 */
    removeData() {
        window.localStorage.clear();
    }
}

/** 全局模块 */
const Global = new GlobalModule();

export default Global;

/** 常用的一些方法 */
function commonlyUse() {
    // 加载 or 预加载
    cc.director.loadScene('name');
    cc.director.preloadScene('name', () => console.log('预加载游戏场景成功'));
    
    // 获取游戏暂停状态
    cc.director.isPaused();

    // 暂停 or 开始
    cc.director.pause();
    cc.director.resume();

    // 颜色更换
    cc.color(74, 172, 255);
    cc.color('#ffffff');

    // 图片加载
    cc.loader.loadRes(src, cc.SpriteFrame, (err, res) => {
        node.getComponent(cc.Sprite).spriteFrame = res;
    });
    
    // 加载网络图片（需要同源策略） src => { url: 'xxx', type: 'png' }
    cc.loader.load(src, (err, texture) => {
        node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
    });

    // 检查两个节点是否重合
    node.getBoundingBoxToWorld().intersects(node.getBoundingBoxToWorld());

    // 把一个节点转换成世界坐标 从左下角开始算起
    node.convertToWorldSpaceAR(cc.v2(Anchor.x, Anchor.y));
    // 将一个点转换到节点 (局部) 空间坐标系，这个坐标系以锚点为原点
    node.convertToNodeSpaceAR(cc.v2(Anchor.x, Anchor.y));

    // 克隆
    cc.instantiate(node);

    // 定时器
    this.scheduleOnce(() => {

    }, 1);

    // 龙骨播放动画
    node.getComponent(dragonBones.ArmatureDisplay).playAnimation('name', 1); // 0 是无限循环

    //碰撞系统
    const MC = cc.director.getCollisionManager();
    MC.enabled = true;
    // 开启碰撞系统的调试线框绘制
    MC.enabledDebugDraw = true;
    MC.enabledDrawBoundingBox = true;

    // 物理系统
    const MP = cc.director.getPhysicsManager();
    MP.enabled = true;
    // 未知作用
    MP.enabledAccumulator = true; 
    // 开启物理系统的调试线框绘制
    MP.debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit | cc.PhysicsManager.DrawBits.e_pairBit | cc.PhysicsManager.DrawBits.e_centerOfMassBit | cc.PhysicsManager.DrawBits.e_jointBit | cc.PhysicsManager.DrawBits.e_shapeBit;
}