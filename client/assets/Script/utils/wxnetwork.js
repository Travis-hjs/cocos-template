import wxutils from "./wxutils";

/** 微信网络接口类 */
export default class wxnetwork extends wxutils {
    constructor() {
        super();
    }
    /** 域名 */
    baseUrl = 'https://xxx.com/Tetris2';
    /** 用户信息 */
    userInfo = {
        openid: '',
        session_key: '',
        head_cookie: '',
        inviter_id: '',
        nickname: '',
        headimgurl: ''
    }
    /** 获取游戏设置信息 */
    config = { box_info: [], is_share: 1, share_time: 1, share_info: [] }
    /** 登录次数计数 */
    login_count = 0;
    /** 最大登录次数 */
    max_count = 3;

    /**
     * 公用请求
     * @param {string} method POST or GET
     * @param {string} url 接口连接
     * @param {object} data 数据
     * @param {Function} success 成功回调
     * @param {Function} fail 失败回调
     */
    baseRequest(method, url, data, success, fail) {
        wx.request({
            url: this.baseUrl + url,
            method: method,
            header: {
                'content-type': 'application/json',
                'cookie': this.userInfo.head_cookie,
                'version': '1.0.0'
            },
            data: data,
            success(res) {
                if (res.data.code == 200) {
                    if (typeof success === 'function') success(res.data, res.header);
                } else {
                    if (typeof fail === 'function') fail(res);
                }
            },
            fail(err) {
                if (typeof fail === 'function') fail(err);
            }
        });
    }

    /**
     * 用户登录 获取 openID 和 session_key
     * @param {Function} success 成功回调
     * @param {Function} fail 失败回调
     */
    userLogin(success = null, fail = null) {
        const THAT = this;
        /** 启动参数 */
        let luach = wx.getLaunchOptionsSync();
        /** 失败再次请求 */
        function loginAgain() {
            setTimeout(function() {
                if (THAT.login_count >= THAT.max_count) {
                    if (typeof fail === 'function') fail();
                } else {
                    THAT.userLogin(success, fail);
                    THAT.showToast('重新登录中，马上就好');
                    console.log('login_fail ===============> count: ', THAT.login_count);
                    THAT.login_count += 1;
                }
            }, 300);
        }
        wx.login({
            success(wxres) {
                let _data = {
                    code: wxres.code,
                    inviter_id: luach.query.inviter_id ? luach.query.inviter_id : ''
                }
                THAT.baseRequest('POST', '/user/login', _data, (res, header) => {
                    if (res.code == 200) {
                        THAT.userInfo.openid = res.data.openid;
                        THAT.userInfo.session_key = res.data.session_key;
                        THAT.userInfo.inviter_id = res.data.id;
                        THAT.userInfo.nickname = res.data.nickname;
                        THAT.userInfo.headimgurl = res.data.headimgurl;
                        THAT.userInfo.head_cookie = header['Set-Cookie'];
                        if (typeof success === 'function') success(res);
                    } else {
                        loginAgain();
                    }
                }, err => {
                    loginAgain();
                });
            },
            fail(err) {
                loginAgain();
            }
        });
    }

    /**
     * 获取游戏设置
     * @param {Function} success 成功回调
     * @param {Function} fail 失败回调
     * @param {Function} complete 完成回调
     */
    getSetting(success, fail, complete) {
        this.baseRequest('GET', '/setting/config', {}, res => {
            this.config = res.data;
            // console.log('设置游戏数据成功', res.data);
            if (typeof success === 'function') success(res);
            if (typeof complete === 'function') complete();
        }, err => {
            // console.log('设置游戏数据失败!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
            this.showToast('设置游戏数据失败');
            if (typeof fail === 'function') fail(err);
            if (typeof complete === 'function') complete();
        });
    }

    /**
     * 上传数据
     * @param {object} data 上传数据
     * @param {Function} success 成功回调
     * @param {Function} fail 失败回调
     */
    saveData(data, success, fail) {
        this.baseRequest('POST', '/user/setData', data, res => {
            if (res.code == 200) {
                if (typeof success === 'function') success(res);
            } else {
                if (typeof fail === 'function') fail(res);
                // console.log('上传数据失败!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                // showToast('上传数据失败');
            }
        }, err => {
            if (typeof fail === 'function') fail(err);
            // console.log('上传数据失败!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
            // showToast('上传数据失败');
        });
    }

    /**
     * 获取用户数据
     * @param {Function} success 成功回调
     * @param {Function} fail 失败回调
     * @param {Function} complete 完成回调
     */
    getData(success, fail, complete) {
        this.baseRequest('GET', '/user/getData', {}, res => {
            if (res.code == 200) {
                if (typeof success === 'function') success(res);
                if (typeof complete === 'function') complete();
            } else {
                if (typeof fail === 'function') fail(res);
                if (typeof complete === 'function') complete();
                this.showToast('获取用户数据失败');
            }
        }, err => {
            if (typeof fail === 'function') fail(err);
            if (typeof complete === 'function') complete();
            this.showToast('获取用户数据失败');
        });
    }

    /**
     * 获取排行榜
     * @param {Function} success 成功回调
     * @param {Function} fail 失败回调
     */
    getRank(success, fail) {
        this.baseRequest('GET', '/rank/world', {}, res => {
            if (res.code == 200) {
                if (typeof success === 'function') success(res);
            } else {
                if (typeof fail === 'function') fail(res);
                this.showAlert('获取世界排行榜失败')
            }
        }, err => {
            if (typeof fail === 'function') fail(err);
            this.showAlert('获取世界排行榜失败')
        });
    }
}