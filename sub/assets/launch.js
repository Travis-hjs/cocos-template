/** 子域主程序脚本 这里我不用 ES6 因为如果在开发者工具中不勾选 ES6 转 ES5 的话会导致子域报错 */
cc.Class({
    extends: cc.Component,

    properties: {
        rankBox: {
            default: null,
            type: cc.Node,
            displayName: '整体界面'
        },
        itemNumber: {
            default: 5,
            displayName: 'item数量'
        },
        cupImg: {
            default: [],
            type: cc.SpriteFrame,
            displayName: '奖杯图片'
        },
    },

    /**
     * 加载图片
     * @param {cc.Node} node 节点
     * @param {string} src 路径
     */
    loadImg: function (node, src) {
        if (!src) return;
        var image = wx.createImage();
        image.onload = function () {
            var texture = new cc.Texture2D();
            texture.initWithElement(image);
            texture.handleLoadedTexture();
            var frame = new cc.SpriteFrame(texture); 
            node.getComponent(cc.Sprite).spriteFrame = frame;
        }
        image.src = src;
    },

    /**
     * 获取图片缓存
     * @param {number} index 索引
     * @param {string } src 路径
     */
    createImage: function(index, src) {
        if (!src) return null;
        var THAT = this;
        var image = wx.createImage();
        image.onload = function () {
            var texture = new cc.Texture2D();
            texture.initWithElement(image);
            texture.handleLoadedTexture();
            var frame = new cc.SpriteFrame(texture);
            THAT.rank_list[index].spriteFrame = frame;
        }
        image.src = src;
    },

    // 下一页
    nextPage: function () {
        if (this.page >= this.page_max - 1) return;
        this.page += 1;
        this.updateItem();
    },

    // 上一页
    previousPage: function () {
        if (this.page == 0) return;
        this.page -= 1;
        this.updateItem();
    },

    // 更新item
    updateItem: function () {
        var THAT = this;
        /** 排行榜列表 */
        var list = this.rank_list;
        // console.log('排行榜列表', list);
        // 遍历更新
        this.item_box.children.forEach(function (item, i) {
            /** 排名 */
            var index = THAT.page * THAT.itemNumber + i;
            if (list[index]) {
                item.active = true;
                /** 排名 */
                var rank = cc.find('rank', item).getComponent(cc.Label);
                /** 奖杯 */
                var cup = cc.find('cup', item).getComponent(cc.Sprite);
                /** 用户头像 */
                var head = cc.find('head', item).getComponent(cc.Sprite);
                /** 用户名 */
                var name = cc.find('name', item).getComponent(cc.Label);
                /** 分数 */
                var score = cc.find('score', item).getComponent(cc.Label);
                // 排名 
                if (index < 3) {
                    cup.node.active = true;
                    cup.spriteFrame = THAT.cupImg[index];
                    rank.node.active = false;
                } else {
                    cup.node.active = false;
                    rank.node.active = true;
                    rank.string = index + 1;
                }
                // 头像
                // if (list[index].avatarUrl) {
                //     THAT.loadImg(head.node, list[index].avatarUrl);
                // } else {
                //     head.spriteFrame = THAT.default_head;
                // }
                head.spriteFrame = list[index].spriteFrame;
                name.string = list[index].nickName;
                score.string = list[index].score;
            } else {
                item.active = false;
            }
        });
        // 判断有无数据
        if (this.rank_list.length == 0) {
            this.none_data.active = true;
            this.none_data.getComponent(cc.Label).string = '暂无数据...';
            this.page_label.string = '--/--';
        } else {
            this.none_data.active = false;
            this.page_label.string = this.page + 1 + '/' + this.page_max;
        }
    },

    // 初始化
    init: function () {
        /** item容器 */
        this.item_box = cc.find('content', this.rankBox);
        /** 页数label */
        this.page_label = cc.find('page-label', this.rankBox).getComponent(cc.Label);
        /** 暂无数据提示 */
        this.none_data = cc.find('tip', this.rankBox);
        /** 首个item */
        var item = cc.find('item', this.item_box);
        /** item预制体 */
        var prefab = cc.instantiate(item);
        /** 默认头像 */
        this.default_head = cc.find('head', item).getComponent(cc.Sprite).spriteFrame;
        for (var i = 1; i < this.itemNumber; i++) {
            const item = cc.instantiate(prefab);
            item.parent = this.item_box;
        }
    },

    /**
     * 格式化数据
     * @param {Array} data 数组
     * @param {object} slef 个人数据
     */
    formatList: function (data, slef) {
        var list = [], slefData = null;
        var THAT = this;
        // 整理数据（所有排行数据）
        list = data.map(function (item) {
            var KVD = null;

            if (item.KVDataList.length) {
                KVD = JSON.parse(item.KVDataList.filter(function (list) { return list.key === 'all' })[0].value);
            } else {
                KVD = {
                    wxgame: {
                        score: 0,
                        update_time: 0
                    }
                }
            }

            return {
                openid: item.openid,
                nickName: item.nickname, // 注意这里微信返回的是小写 n
                avatarUrl: item.avatarUrl,
                score: KVD.wxgame.score,
                update_time: KVD.wxgame.update_time,
                spriteFrame: THAT.default_head
            }
        });

        list.sort(function (a, b) {
            return b.score - a.score;
        });

        // list = data.map(item => {
        //     var KVD = JSON.parse(item.KVDataList.filter(list => list.key === 'all')[0].value);
        //     return {
        //         openid: item.openid,
        //         nickName: item.nickname, // 注意这里微信返回的是小写 n
        //         avatarUrl: item.avatarUrl,
        //         score: KVD.wxgame.score,
        //         update_time: KVD.wxgame.update_time,
        //     }
        // });

        // list.sort((a, b) => b - a);

        for (var i = 0; i < list.length; i++) {
            if (list[i].nickName == slef.nickName && list[i].avatarUrl == slef.avatarUrl) {
                slefData = list[i];
                slefData.index = i;
                break;
            }

        }

        // 更新排行榜数据
        this.rank_list = list;
        // 这里把所有图片加载出来并缓存
        for (var i = 0; i < list.length; i++) {
            this.createImage(i, list[i].avatarUrl);
        }
        // 页数重置为 0
        this.page = 0;
        // 最大页数
        this.page_max = Math.ceil(this.rank_list.length / this.itemNumber);
        // console.log('子域 排行榜列表 ==============>', THAT.rank_list);
    },

    /** 获取数据并生成内容 */
    getData: function () {
        if (this.compareVersion('1.9.92') < 0) return;
        var THAT = this;
        wx.getUserInfo({
            openIdList: ['selfOpenId'],
            success: function (res) {
                if (res.errMsg != 'getUserInfo:ok') return;
                var self = res.data[0];
                // 获取微信数据
                wx.getFriendCloudStorage({
                    keyList: ['all'],
                    success: function (res) {
                        /** 格式化后的数据 */
                        THAT.formatList(res.data, self);
                    },
                    fail: function (err) {
                        console.warn('子域 获取微信数据失败', err);
                    }
                });
            },
            fail: function (err) {
                console.warn('子域 获取用户信息失败', err);
            }
        });
    },

    /**
     * 上传分数 发送过来的数据
     * @param {string} score 
     */
    postScore: function (score) {
        if (this.compareVersion('1.9.92') < 0) return;

        /** 上传到微信服务器 */
        function postWeChat() {
            var kvDataValue = {
                wxgame: {
                    score: score,
                    update_time: parseInt(new Date().getTime() / 1000),
                }
            };
            var kvData = {
                key: 'all',
                value: JSON.stringify(kvDataValue)
            };
            wx.setUserCloudStorage({
                KVDataList: [kvData],
                success: function (res) {
                    console.log('设置子域数据成功 >>', res);
                }
            });
        };

        // 获取存储数据
        wx.getUserCloudStorage({
            keyList: ['all'],
            success: function (res) {
                // console.log('获得分数数据：', res)
                if (res.errMsg != 'getUserCloudStorage:ok') return;
                if (res.KVDataList.length == 0) return postWeChat();
                var rankData = JSON.parse(res.KVDataList[0].value);

                // 微信服务器数据
                var wx_score = rankData.wxgame.score ? rankData.wxgame.score : null;

                if (wx_score == null) {
                    postWeChat();
                } else if (score > wx_score) {
                    postWeChat();
                }
            }
        });
    },

    /**
     * 对比版本
     * @param {string} v2 对比的版本
     */
    compareVersion: function (v2) {
        /** 当前版本号 */
        var ver = wx.getSystemInfoSync().SDKVersion;
        var v1 = ver.split('.');
        v2 = v2.split('.');
        var len = Math.max(v1.length, v2.length);

        while (v1.length < len) {
            v1.push('0');
        }
        while (v2.length < len) {
            v2.push('0');
        }
        for (var i = 0; i < len; i++) {
            var num1 = parseInt(v1[i]);
            var num2 = parseInt(v2[i]);

            if (num1 > num2) {
                return 1;
            } else if (num1 < num2) {
                return -1;
            }
        }
        return 0;
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        this.page = 0;
        this.page_max = 0;
        this.rank_list = [];
        this.init();
        // this.updateItem();
    },

    start: function () {
        var THAT = this;
        // THAT.log('微信子域执行');
        // 监听显示
        if (window.wx) {
            wx.onMessage(function (data) {
                var text = data.action;
                // console.log('子域传参', text);
                switch (text) {
                    case 'uploadScore':
                        // 上传分数
                        THAT.postScore(data.score);
                        break;

                    case 'update':
                        THAT.getData();
                        break;

                    case 'show':
                        THAT.rankBox.active = true;
                        THAT.updateItem();
                        break;

                    case 'hide':
                        THAT.rankBox.active = false;
                        break;

                    case 'next':
                        THAT.nextPage();
                        break;

                    case 'previous':
                        THAT.previousPage();
                        break;
                }
            });
            this.getData();
        }
    },

    // update (dt) {},
});
