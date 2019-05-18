import Global from "./Global";
import WeChat from "./utils/wechat";

/** 加载页 初始化 */
cc.Class({
    extends: cc.Component,

    properties: {
        line: {
            default: null,
            type: cc.Node,
            displayName: '加载进度条'
        },
        text: {
            default: null,
            type: cc.Label,
            displayName: '加载文字'
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        /** 进度条总宽度 */
        const W = this.line.width;
        /** 跳转的场景 */
        const NAME = 'Game';
        // 设置进度条宽度
        this.line.width = 0;
        /** 是否拿取到数据 */
        let isFetch = false;
        /** 是否加载完成或者登录完成 */
        let loadCompleted = false;
        /** 是否请求完成 */
        let requestCompleted = false;
        // 从本地拿取数据
        if (Global.fetchData()) { 
            isFetch = true;
            Global.userData = Global.fetchData();
            console.log('从本地拿取数据 >>', Global.userData);
        }

        /**进入游戏 */
        function openGame() {
            requestCompleted = true;
            if (loadCompleted) {
                WeChat.hideLoading();
                cc.director.loadScene(NAME);
            }
        }
        
        if (window.wx) {
            WeChat.userLogin(() => {
                WeChat.getData(ret => {
                    // 这里判断，如果没有从本地拿取数据，那就从服务器上拿取数据
                    if (ret.data.dataKey && !isFetch) {
                        Global.userData = ret.data.dataKey;
                        console.log('本地没有数据，从服务端获取 >>', ret.data.dataKey);
                    }

                    // 判断是否授权
                    if (ret.data.__userInfo.nickname && ret.data.__userInfo.headimgurl) {
                        Global.gameInfo.authorization = true;
                        Global.uploadInfo.__userInfo = ret.data.__userInfo;
                    }
                    console.log('用户是否授权-gameInfo. >>', Global.gameInfo.authorization);

                }, function () {

                    console.log('获取用户数据失败!!!!');

                }, () => {
                    WeChat.getSetting(SET_RES => {
                        Global.config = SET_RES.data;
                        console.log('游戏设置 >>', Global.config);
                        window.setData = SET_RES.data;
                        openGame();
                    }, err => {
                        openGame();
                    });
                });
            }, () => {
                openGame();
            });
            
            // 这里初始化微信控件
            WeChat.initShare();
            WeChat.initBanner();
            WeChat.checkVideo();
        }

        cc.director.preloadScene(NAME, (count, total, item) => {
            // console.log(count, total);
            let val = count / total;
            // console.log(val);
            this.line.width = W * val;
            this.text.string = `加载中...（${Math.floor(val * 100)}%）`;
            if (val == 1) this.text.string = `完成（100%）`;
        }, () => {
            cc.log('预加载游戏场景成功');
            if (!window.wx) cc.director.loadScene(NAME);
            loadCompleted = true;
            if (requestCompleted) {
                cc.director.loadScene(NAME);
            } else {
                WeChat.showLoading('登录中');
            }
        }); 
    },

    // start () {},

    // update (dt) {},
});
