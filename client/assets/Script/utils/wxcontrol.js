import wxnetwork from "./wxnetwork";

/** 微信控件 */
export default class wxcontrol extends wxnetwork {
    constructor() {
        super();
    }

    /** wx.getSystemInfoSync */
    system = window['wx'] ? wx.getSystemInfoSync() : {};
    /** 分享次数 计数 */
    share_count = 1;
    /** 是否开始分享 防止用户切换后台再回来执行分享判断 */
    start_share = false;
    /** 拉起分享的时间 */
    before = new Date();
    /** banner id */
    bannerID = null;
    /** banner控件 */
    bannerAd = null;
    /** 视频控件 */
    videoAd = null;
    /** 视频 id */
    videoID = null;
    /** 看视频总共数 */
    video_total = 0;
    /** 是否可以看视频 */
    has_video = true;
    /** 视频正在播放 */
    video_playing = false;

    /**
     * 对比版本
     * @param {string} version 对比的版本 
     * result: -1 => 小于对比版本 0 => 等于对比版本 1 => 大于对比版本
     */
    compareVersion(version) {
        /** 当前版本号 */
        let v1 = this.system.SDKVersion.split('.');
        let v2 = version.split('.');
        const len = Math.max(v1.length, v2.length);

        while (v1.length < len) {
            v1.push('0');
        }
        while (v2.length < len) {
            v2.push('0');
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
    getShareInfo() {
        let num = 0;
        if (this.config.share_info.length) {
            num = Math.floor(Math.random() * this.config.share_info.length);
        }
        return {
            // title: '分享测试',
            // imageUrl: canvas.toTempFilePathSync({
            //     x: 375 / 2,
            //     y: 667 / 2,
            //     width: 500,
            //     height: 400,
            //     destWidth: 500,
            //     destHeight: 400
            // }),
            title: this.config.share_info[num].title,
            imageUrl: this.config.share_info[num].images,
            query: 'inviter_id=' + this.userInfo.inviter_id + '&share_img_id=' + this.config.share_info[num].id
        }
    }

    /** 获取两个时间段的秒数 分享回调用*/
    getSecond() {
        let second = (new Date().getTime() - this.before.getTime()) / 1000;
        return Math.floor(second);
    }

    /**
     * 主动拉起分享
     * @param {Function} reward 分享奖励 不传则直接分享
     */
    share(reward) {
        if (!window['wx']) return;
        this.before = new Date();
        if (reward) {
            this.start_share = true;
            this.successReward = reward;
        } else {
            this.start_share = false;
            this.successReward = () => { }
        }
        wx.shareAppMessage(this.getShareInfo());
    }

    /** 初始化分享 只需要执行一次 */
    initShare() {
        if (window['wx']) {
            wx.showShareMenu();
            wx.onShareAppMessage(res => this.getShareInfo());
            wx.onShow(res => {
                this.onShow(res);
                if (this.start_share) {
                    this.shareCallback(() => {
                        this.start_share = false;
                        this.successReward();
                    }, () => {
                        this.start_share = false;
                    });
                }
            });
            wx.onHide(res => {
                this.onHide(res);
            });
        }
    }

    /**
     * 判断是否可以分享
     * @param {string} key 对应功能规则 key
     */
    isShare(key) {
        /** 是否可以分享 */
        let is_share = !this.has_video;

        // 这边规则自己定义=======================================================


        return is_share;
    }

    /**
     * 获取奖励 => 该函数判断分享还是看视频
     * @param {Function} reward 分享奖励
     * @param {string} key 对应功能规则 key
     */
    getReward(reward, key) {
        // 审核状态判断
        if (this.config.is_share == 0 || !this.has_video) {
            if (typeof reward === 'function') reward();
            return;
        }
        // 这里执行分享还是看视频
        if (this.isShare(key)) {
            this.share(reward);
        } else {
            this.showVideo(reward);
        }
    }

    /** 成功领取奖励 */
    successReward = function () { }

    /** 微信 onshow 不定义就不监听 */
    onShow = function () { }

    /** 微信 onhide 不定义就不监听 */
    onHide = function () { }

    /**
     * 微信分享回调
     * @param {Function} success 成功回调
     * @param {Function} fail 失败回调
     */
    shareCallback(success, fail) {
        let text = ['分享失败文案一', '分享失败文案二', '分享失败文案三'];
        let textIndex = Math.floor(3 * Math.random());
        let confirmText = '再次分享';
        /** 分享时间 */
        let share_time = this.config['share_time'] ? this.config['share_time'] : 1;
        /** 分享概率列表 */
        let range_list = this.config['share_range'] ? this.config['share_range'] : [100, 0, 60, 80];
        
        // 判断分享时间
        if (this.getSecond() < share_time) {
            this.showConfirm(text[textIndex], '系统提示：', () => {
                this.share(this.successReward);
            }, () => {
                if (typeof fail === 'function') fail();
            }, confirmText);
            return;
        }

        /** 几率范围 */
        let range = Math.floor(100 * Math.random()) + 1;
        /** 当前几率对比 */
        let rate = range_list[this.share_count];
        // 判断概率成功
        if (range <= rate) {
            if (success) success();
        } else {
            this.showConfirm(text[textIndex], '系统提示：', () => {
                this.share(this.successReward);
            }, () => {
                if (typeof fail === 'function') fail();
            }, confirmText);
        }

        this.share_count += 1;
        if (this.share_count >= range_list.length) this.share_count = 0;
    }

    /** 初始化banner */
    initBanner() {
        if (window.wx && this.compareVersion('2.0.4') >= 0 && this.bannerID) {
            this.bannerAd = wx.createBannerAd({
                adUnitId: this.bannerID,
                style: {
                    left: 0,
                    top: 0,
                    width: this.system.windowWidth
                }
            });
            this.bannerAd.onResize(res => {
                // console.log('广告尺寸', res);
                this.bannerAd.style.top = this.system.windowHeight - Math.floor(res.height);
            });
            this.bannerAd.onError(err => {
                console.log('init Banner fail !!!', err);
            });
            this.bannerAd.hide();
        }
    }

    /** 显示banner */
    showBanner() {
        if (this.bannerAd) {
            this.bannerAd.show();
        }
    }

    /** 隐藏banner */
    hideBanner() {
        if (this.bannerAd) {
            this.bannerAd.hide();
        }
    }

    /** 检测有无视频播放 只需要初始化执行一次 */
    checkVideo() {
        if (this.compareVersion('2.0.4') < 0 || !this.videoID) {
            this.has_video = false;
            return;
        }
        // 首次初始化视频
        this.videoAd = wx.createRewardedVideoAd({
            adUnitId: this.videoID,
        });
        // 检测有无视频
        this.videoAd.onError(err => {
            this.has_video = false;
        });
    }

    /**
     * 拉起视频
     * @param {Function} reward 领取奖励 function()
     */
    showVideo(reward = null) {
        if (this.video_playing) return this.showToast('视频载入中');
        this.video_playing = true;

        /** 关闭回调 */
        let callback = res => {
            this.videoAd.offClose(callback); // 这里要取消监听
            if (res == undefined || res.isEnded == undefined || res.isEnded == true) {
                this.video_total += 1;
                this.video_playing = false;
                if (reward) reward();
            } else {
                this.video_playing = false;
                this.showToast('你提前关闭了视频');
            }
        }
        // 开启监听
        this.videoAd.onClose(callback);
        // 拉起视频
        this.videoAd.load().then(() => {
            this.videoAd.show();
        }).catch(err => {
            this.has_video = false;
            this.video_playing = false;
            this.showAlert(err.errMsg, '视频广告出错');
        });
    }

    /** 获取看视频次数 */
    getVideoTotal() {
        return this.video_total;
    }

    /** 打开客服会话 */
    openService() {
        const THAT = this;
        if (window.wx) {
            if (this.compareVersion('2.0.3') < 0) return this.showAlert('当前微信版本过低，无法使用客服功能');
            wx.openCustomerServiceConversation({
                success() {
                    // showAlert('打开客服对话成功');
                },
                fail() {
                    // showAlert('打开客服对话失败');
                    THAT.showToast('打开客服对话失败');
                },
            });
        }
    }

    /**
     * 游戏跳转
     * @param {object} data 跳转 icon 数据
     * @param {Function} success 成功回调
     * @param {Function} fail 失败回调
     */
    openMiniGame(data, success, fail) {
        const THAT = this;
        // 直跳
        if (this.compareVersion('2.2.0') >= 0 && data.navigate_type == 1) {
            wx.navigateToMiniProgram({
                appId: data.appid,
                path: data.path,
                success() {
                    if (typeof success === 'function') success();
                },
                fail() {
                    if (typeof fail === 'function') fail();
                    THAT.showAlert('跳转失败');
                },
            });
        }
        // 扫码
        else {
            /** 二维码路径 */
            let src = data.poster;
            wx.previewImage({
                current: src,
                urls: [src],
                success() {
                    if (typeof success === 'function') success();
                },
                fail() {
                    if (typeof fail === 'function') fail();
                    THAT.showAlert('跳转失败');
                }
            });
        }
    }

    /** 检测是否需要更新版本 */
    checkVersionUpdate() {
        if (this.compareVersion('1.9.90') >= 0) {
            const updateManager = wx.getUpdateManager();
            updateManager.onCheckForUpdate(res => {
                // 请求完新版本信息的回调
                console.log('请求完新版本信息的回调  >>', res.hasUpdate);
            });
            updateManager.onUpdateReady(() => {
                this.showConfirm('新版本已经准备好，是否重启应用？', '更新提示', () => {
                    updateManager.applyUpdate();
                });
            });
            updateManager.onUpdateFailed(() => {
                this.showAlert('版本更新下载失败');
            });
        }
    }

    /** 设置屏幕常亮 */
    setKeepLight() {
        if (this.compareVersion('1.4.0') >= 0) {
            wx.setKeepScreenOn({
                keepScreenOn: true
            });
        }
    }
}