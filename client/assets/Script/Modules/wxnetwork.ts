import wxutils from "./wxutils";

/** 微信网络接口类 */
export default class wxnetwork extends wxutils {
    constructor() {
        super();
    }
    /** 域名 */
    private readonly baseUrl = "https://xxx.com/name";
    /** 用户信息 */
    public userInfo = {
        openid: "",
        session_key: "",
        head_cookie: "",
        inviter_id: "",
        nickname: "",
        headimgurl: ""
    }
    /** 获取游戏设置信息 */
    public config = { box_info: [], is_share: 1, share_time: 1, share_info: [] }
    /** 登录次数计数 */
    private login_count = 0;
    /** 最大登录次数 */
    private max_count = 3;

    /**
     * 公用请求
     * @param method POST or GET
     * @param url 接口连接
     * @param data 数据
     * @param success 成功回调
     * @param fail 失败回调
     */
    private baseRequest(method: string, url: string, data: string | object, success: Function, fail: Function) {
        wx.request({
            url: this.baseUrl + url,
            method: method,
            header: {
                "content-type": "application/json",
                "cookie": this.userInfo.head_cookie,
                "version": "1.0.0"
            },
            data: data,
            success(res) {
                if (res.data.code == 200) {
                    if (success) success(res.data, res.header);
                } else {
                    if (fail) fail(res);
                }
            },
            fail() {
                if (fail) fail("登录失败");
            }
        });
    }

    /**
     * 用户登录 获取 openID 和 session_key
     * @param success 成功回调
     * @param fail 失败回调
     */
    public userLogin(success?: Function, fail?: Function) {
        const THAT = this;
        /** 启动参数 */
        let luach = wx.getLaunchOptionsSync();
        /** 失败再次请求 */
        function loginAgain() {
            setTimeout(function() {
                if (THAT.login_count >= THAT.max_count) {
                    if (fail) fail();
                } else {
                    THAT.userLogin(success, fail);
                    THAT.showToast("重新登录中，马上就好");
                    console.log("login_fail ===============> count: ", THAT.login_count);
                    THAT.login_count += 1;
                }
            }, 300);
        }
        wx.login({
            success(wxres) {
                let _data = {
                    code: wxres.code,
                    inviter_id: luach.query.inviter_id ? luach.query.inviter_id : ""
                }
                THAT.baseRequest("POST", "/user/login", _data, (res: any, header: any) => {
                    if (res.code == 200) {
                        THAT.userInfo.openid = res.data.openid;
                        THAT.userInfo.session_key = res.data.session_key;
                        THAT.userInfo.inviter_id = res.data.id;
                        THAT.userInfo.nickname = res.data.nickname;
                        THAT.userInfo.headimgurl = res.data.headimgurl;
                        THAT.userInfo.head_cookie = header["Set-Cookie"];
                        if (success) success(res);
                    } else {
                        loginAgain();
                    }
                }, err => {
                    loginAgain();
                });
            },
            fail() {
                loginAgain();
            }
        });
    }

    /**
     * 获取游戏设置
     * @param success 成功回调
     * @param fail 失败回调
     * @param complete 完成回调
     */
    public getSetting(success: Function, fail?: Function, complete?: Function) {
        this.baseRequest("GET", "/setting/config", {}, res => {
            this.config = res.data;
            // console.log("设置游戏数据成功", res.data);
            if (success) success(res);
            if (complete) complete();
        }, err => {
            // console.log("设置游戏数据失败!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            this.showToast("设置游戏数据失败");
            if (fail) fail(err);
            if (complete) complete();
        });
    }

    /**
     * 上传数据
     * @param data 上传数据
     * @param success 成功回调
     * @param fail 失败回调
     */
    public saveData(data: any, success: Function, fail?: Function) {
        this.baseRequest("POST", "/user/setData", data, res => {
            if (res.code == 200) {
                if (success) success(res);
            } else {
                if (fail) fail(res);
                console.log("上传数据失败!!!!!!!!!!!!!!!!!!!!!!!!!!!!", res);
            }
        }, err => {
            if (fail) fail(err);
            console.log("上传数据失败!!!!!!!!!!!!!!!!!!!!!!!!!!!!", err);
        });
    }

    /**
     * 获取用户数据
     * @param success 成功回调
     * @param fail 失败回调
     * @param complete 完成回调
     */
    public getData(success: Function, fail?: Function, complete?: Function) {
        this.baseRequest("GET", "/user/getData", {}, res => {
            if (res.code == 200) {
                if (success) success(res);
                if (complete) complete();
            } else {
                if (fail) fail(res);
                if (complete) complete();
                this.showToast("获取用户数据失败");
            }
        }, err => {
            if (fail) fail(err);
            if (complete) complete();
            this.showToast("获取用户数据失败");
        });
    }

    /**
     * 获取排行榜
     * @param success 成功回调
     * @param fail 失败回调
     */
    public getRank(success: Function, fail?: Function) {
        this.baseRequest("GET", "/rank/world", {}, res => {
            if (res.code == 200) {
                if (success) success(res);
            } else {
                if (fail) fail(res);
                this.showAlert("获取世界排行榜失败")
            }
        }, err => {
            if (fail) fail(err);
            this.showAlert("获取世界排行榜失败")
        });
    }
}