# cocos creator H5 游戏模板

> 仅供小游戏开发逻辑使用（JS & TS），并不适用于 C++ & C# 等编程式思维使用
>> 大概说一下我的跨文件编程思维：通过全局对象 Global 去定义实例化的对象，然后其他脚本调用某个文件的方法时候就 Global.XXX.fun();这样。因为小游戏不同于大型游戏，所以我这里就不做事件派发和脚本联动的处理机制了。
```js
// 常用到的脚本对象 Main.js
onload() {
    Global.Game = this;
}

// 假设我在游戏主函数 Main.js 定义了一个对象池 
this.bulletPool = new cc.NodePool();

// 然后在 Bullet.js 中进行回收当前节点到对象池中，那么就可以这样写
Global.Game.bulletPool.put(this.node);

```

### 结构目录
* client 游戏主程序
* sub 游戏子域

1. master JS 版本

2. 分支 TS TS 版本

***
使用：

1. 游戏加载页初始化微信工具（不在微信端可以忽略），我的游戏逻辑是先进游戏加载场景，然后再进游戏主逻辑场景，一共两个场景。这样的好处就是1、微信小程序打开速度会很快2、在加载场景中只做初始化的一些操作，游戏场景只做游戏相关的内容，两者更加清晰。
```js
// 示例中我是通过与后台接口设置游戏中的参数，具体看代码注释即可
// 在 onload 或者 start 方法中 始化微信控件 
WeChat.initShare();
WeChat.initBanner();
WeChat.checkVideo();

// 之后在其他地方使用主动拉起分享
WeChat.share();
// 需要分享回调这样写
WeChat.share(function() {
    // 注意这里微信已经取消了分享回调，而我这边是用wx.onhide和wx.onshow去模拟的分享回调
    // 分享的规则和文案提示自行看代码注释修改即可
    console.log('分享成功'); 
});

// 拉起广告视频 
WeChat.showVideo(function() {
    console.log('观看完15s视频'); 
});

// 显示 & 隐藏 banner
WeChat.showBanner();
WeChat.hideBanner();
```

2. 在游戏主场景中初始化预制体加载框
```js
// this.loadingBox => 加载框预制体，具体节点布局在编辑器可以查看
utils.setLoadingBox(cc.instantiate(this.loadingBox), this.node);

// 使用加载框加载预制体 ---- 预制体存放目录 static/prefab/
utils.loadPrefab('加载的预制体名字', res => {
    console.log('加载完成', res);
    
});

// 使用动态加载本地图片到指定节点下
utils.loadImg(node, 'xxx', res => {
    console.log('图片加载完成', res);
});

// 使用动态加载网络图片到指定节点下
utils.loadNetImg(node, 'xxx', '.jpg');

```
3. 微信子域代码（sub目录）使用这里我就不说了，代码注释有

4. 自定义的 cocos creator component 使用个人觉得非常好用，建议常用的组件都自行定义使用 Script/ui/目录下我定义了两个常用的

5. 小游戏的数据存储是优先存储在本地的，其次到服务端。然后在加载页的时候获取本地数据，如果本地数据没有，再从服务端拿取。这样用户换设备使用同一个小程序的时候就可以保证数据不丢失了。

### 有需要的老哥可以支持一下
![my-code.png](https://github.com/Hansen-hjs/Hansen-hjs.github.io/blob/master/images/wxcode.jpg "my-code")

wx => Hjs951222

