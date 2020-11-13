import Main from "./Game/Main";

// class GlobalModule {
//     private constructor() { 
//         console.log('全局对象 >> 单例');
//     }
//     public static get instance() {
//         if (!this._instance) {
//             this._instance = new GlobalModule();
//         }
//         return this._instance;
//     }
//     private static _instance: GlobalModule = null;
//     /** 游戏主程序 */
//     public Game: Main;
//     /** 游戏数据 */
//     public gameInfo = {
//         /** 游戏分数 */
//         score: 0,
//         /** 用户授权状态 */
//         authorization: false
//     }
//     /** 用户数据 */
//     public userData = {

//     }
//     /** 游戏设置 */
//     public config = {

//     }
//     /** api上传数据 */ 
//     public uploadInfo = {
//         __userInfo: {},
//         __rankInfo: {},
//         dataKey: null
//     }
//     /** 保存数据 */
//     saveData() {
//         window.localStorage.setItem('name', JSON.stringify(this.userData));
//     }
//     /** 获取数据 */ 
//     fetchData() {
//         let data: any = window.localStorage.getItem('name') ? JSON.parse(window.localStorage.getItem('name')) : null;
//         return data;
//     }
//     /** 清除本地数据 */
//     removeData() {
//         window.localStorage.clear();
//     }
// }
// /** 全局模块 */
// const Global  = GlobalModule.instance;

class GlobalModule {
    constructor() {
        console.log('全局对象 >> 类');
    }

    /** 游戏主程序 */
    public Game: Main;

    /** 游戏数据 */
    public gameInfo = {
        /** 游戏分数 */
        score: 0,
        /** 用户授权状态 */
        authorization: false
    }

    /** 音效管理 */
    public musicSystem = {
        /** 背景音效 */
        bg: true,
        /** 点击音效 */
        click: true
    }

    /** 用户数据 */
    public userData = {

    }

    /** 游戏设置 */
    public config = {

    }

    /** api上传数据 */ 
    public uploadInfo = {
        __userInfo: {},
        __rankInfo: {},
        dataKey: null
    }

    /** 保存数据 */
    public saveData() {
        window.localStorage.setItem('name', JSON.stringify(this.userData));
    }

    /** 获取数据 */ 
    public fetchData() {
        let data: any = window.localStorage.getItem('name') ? JSON.parse(window.localStorage.getItem('name')) : null;
        return data;
    }
    
    /** 清除本地数据 */
    public removeData() {
        window.localStorage.clear();
    }
}

/** 全局模块 */
const Global = new GlobalModule();

export default Global;