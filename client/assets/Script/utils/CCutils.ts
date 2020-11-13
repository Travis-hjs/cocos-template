export default class ModuleCCutils {
    /** 加载框 */
    private loading_box: cc.Node;
    /** 加载进度文字 */
    private loading_text: cc.Label;
    
    /**
     * 返回旋转角度 旋转的节点坐标必须为(0, 0)才可以 所以要相对应的进行转换
     * @param x 目标坐标 x
     * @param y 目标坐标 y
     */
    public rotateAngle(x: number, y: number) {
        if (y === 0) {
            if (x > 0) {
                return 90;
            }
            else if (x < 0) {
                return 270;
            }
            return 0;
        }
        if (x === 0) {
            if (y > 0) {
                return 0;
            }
            else {
                return 180;
            }
        }

        let rate = Math.atan(Math.abs(x) / Math.abs(y));
        if (x > 0 && y > 0) {
            return 360 - 180 * rate / Math.PI;
        } else if (x > 0 && y < 0) {
            return 180 + 180 * rate / Math.PI;
        } else if (x < 0 && y < 0) {
            return 180 - 180 * rate / Math.PI;
        } else if (x < 0 && y > 0) {
            return 180 * rate / Math.PI;
        }
    }

    /**
     * 定义加载框 在当前场景初始化的时候执行一次
     * @param node 加载框节点
     * @param scene 加载框 输出的场景 or 节点
     */
    public setLoadingBox(node: cc.Node, scene: cc.Node) {
        this.loading_box = node;
        this.loading_box.zIndex = 99;
        this.loading_text = cc.find("text", this.loading_box).getComponent(cc.Label);
        this.loading_box.parent = scene;
        this.loading_box.active = false;
    }

    /**
     * 基础加载预制体
     * @param name 资源名字
     * @param callback 加载成功回调
     */
    public loadPrefab(name: string, callback?: (result: any) => void) {
        this.loading_box.active = true;
        this.loading_text.string = "0%";
        cc.loader.loadRes("prefab/" + name, cc.Prefab, (count, total, item) => {
            let val = count / total;
            this.loading_text.string = Math.floor(val * 100) + "%";
            // console.log(val);
        }, (err, res) => {
            this.loading_box.active = false;
            // if (err) return this.showToast("资源加载失败，请重试");
            if (callback) callback(res);
        });
    }

    /**
     * 图片加载 resources 文件下
     * @param node 节点
     * @param src 路径
     * @param callback 加载成功回调  
     */
    public loadImg(node: cc.Node = null, src: string, callback?: (result: any) => void) {
        let load_count = 0;
        /** 加载失败时，重复加载 直到次数为 3 */
        function load() {
            load_count += 1;
            cc.loader.loadRes(src, cc.SpriteFrame, (err, res) => {
                if (err) {
                    console.log(node.name + "加载次数", load_count);
                    if (load_count < 3) load();
                } else {
                    if (node) node.getComponent(cc.Sprite).spriteFrame = res;
                    if (callback) callback(res);
                }
            });
        }
        load();
    }

    /**
     * 加载网络图片
     * @param node 节点
     * @param src 资源路径
     * @param type 加载图片类型
     */
    public loadNetworkImg(node: cc.Node, src: string, type = "jpg") {
        cc.loader.load({ url: src, type: type }, (err: any, res: any) => {
            node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(res);
        });
    }
}