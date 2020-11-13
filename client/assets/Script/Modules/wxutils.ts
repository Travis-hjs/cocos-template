/** 微信工具类 */
export default class wxutils {
    /**
     * 显示 loading
     * @param title 显示文字
     */
    public showLoading(title: string = "加载中") {
        if (window["wx"]) {
            wx.showLoading({
                title: title,
                mask: true,
            });
        }
    }

    /** 隐藏 loading */
    public hideLoading() {
        if (window["wx"]) wx.hideLoading();
    }

    /**
     * 显示 toast
     * @param title 提示文字
     * @param icon type: "success", "loading", "none"
     * @param time 时间
     */
    public showToast(title: string = "提示", icon: any = "none", time: number = 2000) {
        if (window["wx"]) {
            wx.showToast({
                title: title,
                icon: icon,
                duration: time
            });
        } else {
            alert(title);
        }
    }

    /**
     * 提示框
     * @param content 内容
     * @param title 标题
     * @param callback 确认回调
     */
    public showAlert(content: string, title: string = "提示", callback?: Function) {
        if (window["wx"]) {
            wx.showModal({
                title: title,
                content: content,
                showCancel: false,
                success(res) {
                    if (callback) callback(res);
                }
            });
        }
    }

    /**
     * 确认弹窗
     * @param content 内容
     * @param title 标题
     * @param callback 确认回调
     * @param cancel 取消回调
     * @param text 确认文字
     */
    public showConfirm(content: string, title: string = "确认提醒", callback?: Function, cancel?: Function, text: string = "确认") {
        if (window["wx"]) {
            wx.showModal({
                title: title,
                content: content,
                showCancel: true,
                confirmText: text,
                success(res) {
                    if (res.confirm) {
                        if (callback) callback();
                    } else if (res.cancel) {
                        if (cancel) cancel();
                    }
                },
            });
        }
    }

    /**
     * 获取用户授权信息
     * @param successCB 授权成功
     * @param failCB 授权失败
     * @param style 样式
     * loginInfo => 登录信息
     * res => 用户信息
     */
    checkLogin(successCB: Function, failCB: Function, style: any) {
        const THAT = this;
        wx.login({
            success(loginInfo) {
                wx.getUserInfo({
                    success(res: any) {
                        res.code = loginInfo.code;
                        if (successCB) successCB(res);
                    },
                    fail() {
                        console.log("创建获取用户信息按钮");
                        // 创建获取用户信息按钮 
                        let loginBtn = wx.createUserInfoButton({
                            type: "text",
                            text: "",
                            style: style,
                        });
                        // 监听点击事件
                        loginBtn.onTap(res => {
                            console.log("用户授权数据：", res);
                            res["code"] = loginInfo.code;
                            if (res.errMsg != "getUserInfo:ok") return THAT.showAlert("排行榜功能需要授权的哦！");
                            if (successCB) successCB(res);
                            loginBtn.destroy();
                        });
                    }
                });
            },
            fail() {
                console.log("登录失败=====>");
                if (failCB) failCB();
            },
        });
    }
}