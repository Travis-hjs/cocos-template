import { OptionsShowVideo } from "../utils/interface";
import wxnetwork from "./wxnetwork";

/** 微信控件 */
export default class wxcontrol extends wxnetwork {
    constructor() {
        super();
    }
    /** wx.getSystemInfoSync */
    public system = window["wx"] ? wx.getSystemInfoSync() : {};
    /** 分享次数 计数 */
    private shareCount = 1;
    /** 是否开始分享 防止用户切换后台再回来执行分享判断 */
    private startShare = false;
    /** 拉起分享的时间 */
    private before = new Date();
    /** banner控件 */
    private bannerAd = null;
    /** banner`id` */
    private readonly bannerID: string = null;
    /** 视频控件 */
    private videoAd = null;
    /** 视频`id` */
    private readonly videoID: string = null;
    /** 是否可以看视频 */
    private hasVideo = true;
    /** 视频加载状态 */
    private videoLoading = false;
    /** 看视频总共数 */
    public videoTotal = 0;

    /**
     * 对比版本
     * @param version 对比的版本 
     * result: -1 => 小于对比版本 0 => 等于对比版本 1 => 大于对比版本
     */
    public compareVersion(version: string): number {
        /** 当前版本号 */
        let v1 = this.system["SDKVersion"].split(".");
        let v2 = version.split(".");
        const len = Math.max(v1.length, v2.length);
        while (v1.length < len) {
            v1.push("0");
        }
        while (v2.length < len) {
            v2.push("0");
        }
        for (let i = 0; i < len; i++) {
            const num1 = Math.floor(Number(v1[i]));
            const num2 = Math.floor(Number(v2[i]));
            if (num1 > num2) {
                return 1;
            } else if (num1 < num2) {
                return -1;
            }
        }
        return 0;
    }

    /** 获取分享信息 */
    private getShareInfo(): object {
        let num: number = 0;
        if (this.config.share_info.length) {
            num = Math.floor(Math.random() * this.config.share_info.length);
        }
        return {
            title: this.config.share_info[num].title,
            imageUrl: this.config.share_info[num].images,
            query: "inviter_id=" + this.userInfo.inviter_id + "&share_img_id=" + this.config.share_info[num].id
        }
    }

    /** 获取两个时间段的秒数 分享回调用 */
    private getSecond(): number {
        let second = (new Date().getTime() - this.before.getTime()) / 1000;
        return Math.floor(second);
    }

    /**
    * 主动拉起分享
    * @param reward 分享奖励 不传则直接分享
    */
    public share(reward?: Function) {
        if (!window["wx"]) return;
        this.before = new Date();
        if (reward) {
            this.startShare = true;
            this.successReward = reward;
        } else {
            this.startShare = false;
            this.successReward = () => { }
        }
        wx.shareAppMessage(this.getShareInfo());
    }

    /** 初始化分享 只需要执行一次 */
    public initShare() {
        if (window["wx"]) {
            wx.showShareMenu();
            wx.onShareAppMessage(() => this.getShareInfo());
            wx.onShow(res => {
                this.onShow(res);
                if (this.startShare) {
                    this.shareCallback(() => {
                        this.startShare = false;
                        this.successReward();
                    }, () => {
                        this.startShare = false;
                    });
                }
            });
            wx.onHide(() => {
                this.onHide();
            });
        }
    }

    /**
     * 判断是否可以分享
     * @param key 对应功能规则 key
     */
    public isShare(key: string): boolean {
        // 这边规则自己定义=========================================================================
        /** 是否可以分享 */
        let is_share = !this.hasVideo;

        return is_share;
    }

    /**
     * 获取奖励 => 该函数判断分享还是看视频
     * @param success 分享奖励
     * @param key 对应功能规则 key
     */
    public getReward(success?: () => void, key?: string) {
        // 审核状态判断
        if (this.config.is_share == 0 || !this.hasVideo) {
            if (success) success();
            return;
        }
        // 这里执行分享还是看视频
        if (this.isShare(key)) {
            this.share(success);
        } else {
            this.showVideo({
                success
            });
        }
    }

    /** 成功领取奖励 */
    private successReward: Function = function () { };

    /** 微信 onshow 不定义就不监听 */
    public onShow: (res: any) => void = function(res) { }

    /** 微信 onhide 不定义就不监听 */
    public onHide: Function = function () { }

    /**
     * 微信分享回调
     * @param success 成功回调
     * @param fail 失败回调
     */
    private shareCallback(success: Function, fail: Function) {
        const THAT = this;
        let text = ["分享失败文案一", "分享失败文案二", "分享失败文案三"];
        let textIndex = Math.floor(3 * Math.random());
        let confirmText = "再次点击分享";

        // 判断分享时间 or 分享取消
        if (THAT.getSecond() < THAT.config.share_time) {
            THAT.showConfirm(text[textIndex], "系统提示：", function () {
                THAT.share(THAT.successReward);
            }, function () {
                if (fail) fail();
            }, confirmText);
            return;
        }

        /** 几率范围 */
        let range = Math.floor(100 * Math.random()) + 1;

        switch (THAT.shareCount) {
            case 1:
                if (range <= 1) {
                    if (success) success();
                } else {
                    THAT.showConfirm(text[textIndex], "系统提示：", function () {
                        THAT.share(THAT.successReward);
                    }, function () {
                        if (fail) fail();
                    }, confirmText);
                }
                break;
            case 2:
                if (range <= 70) {
                    if (success) success();
                } else {
                    THAT.showConfirm(text[textIndex], "系统提示：", function () {
                        THAT.share(THAT.successReward);
                    }, function () {
                        if (fail) fail();
                    }, confirmText);
                }
                break;
            case 3:
                if (range <= 60) {
                    if (success) success();
                } else {
                    THAT.showConfirm(text[textIndex], "系统提示：", function () {
                        THAT.share(THAT.successReward);
                    }, function () {
                        if (fail) fail();
                    }, confirmText);
                }
                break;
            case 4:
                if (success) success();
                break;
        }
        this.shareCount += 1;
        if (this.shareCount > 4) this.shareCount = 1;
    }

    /** 初始化banner */
    public initBanner() {
        if (window["wx"] && this.compareVersion("2.0.4") >= 0 && this.bannerID) {
            this.bannerAd = wx.createBannerAd({
                adUnitId: this.bannerID,
                style: {
                    left: 0,
                    top: 0,
                    width: this.system["windowWidth"]
                }
            });
            this.bannerAd.onResize(res => {
                // console.log("广告尺寸", res);
                this.bannerAd.style.top = this.system["windowHeight"] - Math.floor(res.height);
            });
            this.bannerAd.onError(err => {
                console.log("init Banner fail !!!", err);
            });
            this.bannerAd.hide();
        }
    }

    /** 显示banner */
    public showBanner() {
        if (this.bannerAd) {
            this.bannerAd.show();
        }
    }

    /** 隐藏banner */
    public hideBanner() {
        if (this.bannerAd) {
            this.bannerAd.hide();
        }
    }

    /** 检测有无视频播放 只需要初始化执行一次 */
    public checkVideo() {
        if (this.compareVersion("2.0.4") < 0 || !this.videoID) {
            this.hasVideo = false;
            return;
        }
        // 首次初始化视频
        this.videoAd = wx.createRewardedVideoAd({
            adUnitId: this.videoID,
        });
        // 检测有无视频
        this.videoAd.onError((error: any) => {
            console.log("检测有无视频 >>", error);
            this.hasVideo = false;
        });
    }

    /**
     * 拉起视频
     * @param reward 领取奖励 function()
     */
    public showVideo(options: OptionsShowVideo) {
        if (this.videoLoading) return this.showToast("视频载入中");
        this.videoLoading = true;
        const THAT = this;
        /** 视频组件 */
        let videoAd = wx.createRewardedVideoAd({ "adUnitId": (options.videoId || this.videoID) });
        /** 销毁视频组件 */
        function destroyVideoAd() {
            if (videoAd) {
                // 这里要取消监听
                videoAd.offClose(closeCallback);
                videoAd.destroy();
                videoAd = null;
            }
        }
        /** 
         * 关闭回调 
         * @param res
        */
        function closeCallback(res: { isEnded: boolean }) {
            destroyVideoAd();
            if (res && res.isEnded) {
                THAT.videoLoading = false;
                options.success && options.success();
            } else {
                THAT.videoLoading = false;
                THAT.showToast("你提前关闭了视频");
            }
        }
        // videoAd.onLoad(() => {});
        videoAd.load().then(() => {
            videoAd.show();
        }).catch(err => {
            console.log("视频错误 !!! catch >>", err);
            destroyVideoAd();
            options.fail && options.fail(err);
        });
        videoAd.onError(err => {
            console.log("视频错误 !!! onError >>", err);
            destroyVideoAd();
            options.fail && options.fail(err);
        });
        videoAd.onClose(closeCallback);
    }

    /** 打开客服会话 */
    public openService() {
        const THAT = this;
        if (window["wx"]) {
            if (this.compareVersion("2.0.3") < 0) return this.showAlert("当前微信版本过低，无法使用客服功能");
            wx.openCustomerServiceConversation({
                success() {
                    // showAlert("打开客服对话成功");
                },
                fail() {
                    // showAlert("打开客服对话失败");
                    THAT.showToast("打开客服对话失败");
                },
            });
        }
    }

    /**
     * 游戏跳转
     * @param data 跳转 icon 数据
     * @param success 成功回调
     * @param fail 失败回调
     */
    public openMiniGame(data: object, success?: Function, fail?: Function) {
        const THAT = this;
        // 直跳
        if (this.compareVersion("2.2.0") >= 0 && data["navigate_type"] == 1) {
            wx.navigateToMiniProgram({
                appId: data["appid"],
                path: data["path"],
                success() {
                    if (success) success();
                },
                fail() {
                    if (fail) fail();
                    THAT.showAlert("跳转失败");
                },
            });
        }
        // 扫码
        else {
            let src = data["poster"];
            wx.previewImage({
                current: src,
                urls: [src],
                success() {
                    if (success) success();
                },
                fail() {
                    if (fail) fail();
                    THAT.showAlert("跳转失败");
                }
            });
        }
    }

    /** 检测是否需要更新版本 */
    public checkVersionUpdate() {
        if (this.compareVersion("1.9.90") >= 0) {
            const updateManager = wx.getUpdateManager();
            updateManager.onCheckForUpdate(res => {
                // 请求完新版本信息的回调
                console.log("请求完新版本信息的回调  >>", res.hasUpdate);
            });
            updateManager.onUpdateReady(() => {
                this.showConfirm("新版本已经准备好，是否重启应用？", "更新提示", () => {
                    updateManager.applyUpdate();
                });
            });
            updateManager.onUpdateFailed(() => {
                this.showAlert("版本更新下载失败");
            });
        }
    }

    /** 设置屏幕常亮 */
    public setKeepLight() {
        if (this.compareVersion("1.4.0") >= 0) {
            wx.setKeepScreenOn({
                keepScreenOn: true
            });
        }
    }
}