
/** 微信工具类 */
export default class wxutils {
    constructor() { }
    /**
     * 显示 loading
     * @param {string} title 显示文字
     */
    showLoading(title = '加载中') {
        if (window.wx) {
            wx.showLoading({
                title: title,
                mask: true,
            });
        }
    }

    /** 隐藏 loading */
    hideLoading() {
        if (window.wx) wx.hideLoading();
    }

    /**
     * 显示 toast
     * @param {string} title 提示文字
     * @param {string} icon type: 'success', 'loading', 'none'
     * @param {number} time 时间
     */
    showToast(title = '提示', icon = 'none', time = 2000) {
        if (window.wx) {
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
     * @param {string} content 内容
     * @param {string} title 标题
     * @param {Function} callback 确认回调
     */
    showAlert(content, title = '提示', callback = null) {
        if (window.wx) {
            wx.showModal({
                title: title,
                content: content,
                showCancel: false,
                success(res) {
                    if (typeof callback === 'function') callback();
                }
            });
        }
    }

    /**
     * 确认弹窗
     * @param {string} content 内容
     * @param {string} title 标题
     * @param {Function} callback 确认回调
     * @param {Function} cancel 取消回调
     * @param {string} text 确认文字
     */
    showConfirm(content, title = '确认提醒', callback = null, cancel = null, text = '确认') {
        if (window.wx) {
            wx.showModal({
                title: title,
                content: content,
                showCancel: true,
                confirmText: text,
                success(res) {
                    if (res.confirm) {
                        if (typeof callback === 'function') callback();
                    } else if (res.cancel) {
                        if (typeof cancel === 'function') cancel();
                    }
                },
            });
        }
    }

    /**
     * 获取用户授权信息
     * @param {Function} successCB 授权成功
     * @param {Function} failCB 授权失败
     * @param {object} style 样式
     * loginInfo => 登录信息
     * res => 用户信息
     */
    checkLogin(successCB, failCB, style = {}) {
        const THAT = this;
        wx.login({
            success(loginInfo) {
                wx.getUserInfo({
                    success(res) {
                        res.code = loginInfo.code;
                        if (typeof successCB === 'function') successCB(res);
                    },
                    fail() {
                        console.log('创建获取用户信息按钮');
                        // 创建获取用户信息按钮 
                        let loginBtn = wx.createUserInfoButton({
                            type: 'text',
                            text: '',
                            style: style,
                        });
                        // 监听点击事件
                        loginBtn.onTap(res => {
                            console.log('用户授权数据：', res);
                            res.code = loginInfo.code;
                            if (res.errMsg != 'getUserInfo:ok') return THAT.showAlert('排行榜功能需要授权的哦！');
                            if (typeof successCB === 'function') successCB(res);
                            loginBtn.destroy();
                        });
                    }
                });
            },
            fail(loginErr) {
                console.log('登录失败=====>', loginErr);
                if (typeof successCB === 'function') failCB(loginErr);
            },
        });
    }
}