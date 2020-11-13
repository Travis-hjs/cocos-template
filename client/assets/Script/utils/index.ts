import ModuleCCutils from "./CCutils";
import { JavaScriptTypes, NumberSymbols } from "./interface";

class utilsModule extends ModuleCCutils {
    constructor() {
        super()
    }
    /**
     * 本地储存数据
     * @param key 对应的 key 值
     * @param data 对应的数据
     */
    public saveData(key: string, data: any) {
        window.localStorage.setItem(key, JSON.stringify(data));
    }

    /**
     * 获取本地数据
     * @param key 对应的 key 值
     */
    public fetchData(key: string) {
        let data = window.localStorage.getItem(key) ? JSON.parse(window.localStorage.getItem(key)) : null;
        return data;
    }

    /** 清除本地数据 */
    public removeData() {
        window.localStorage.clear();
    }

    /** 长震动 */
    public vibrateLong() {
        if ("vibrate" in window.navigator) {
            window.navigator.vibrate(400);
        } else if (window["wx"] && wx.vibrateLong) {
            wx.vibrateLong();
        }
    }

    /** 短震动 */
    public vibrateShort() {
        if ("vibrate" in window.navigator) {
            window.navigator.vibrate(15);
        } else if (window["wx"] && wx.vibrateShort) {
            wx.vibrateShort();
        }
    }

    /**
     * 带单位的数值转换
     * @param value 数字
     */
    public unitsNumber(value: number = 0): string | number {
        // 取整
        value = Math.floor(value);
        if (value == 0) return "";
        /** 单位 */
        let units = ["", "k", "m", "b", "f", "e", "ae", "be", "ce", "de", "ee", "fe", "ge", "he", "ie"];
        /** 索引 */
        let index = Math.floor(Math.log(value) / Math.log(1000));
        /** 结果 */
        let result: number | string = value / Math.pow(1000, index);
        if (index === 0) return result;
        result = result.toFixed(3);
        // 不进行四舍五入 取小数点后一位
        result = result.substring(0, result.lastIndexOf(".") + 2);
        return result + units[index];
    }

    /**
     * 数字运算（主要用于小数点精度问题）
     * [see](https://juejin.im/post/6844904066418491406#heading-12)
     * @param a 前面的值
     * @param type 计算方式
     * @param b 后面的值
     * @example 
     * ```js
     * // 可链式调用
     * const res = computeNumber(1.3, "-", 1.2).next("+", 1.5).next("*", 2.3).next("/", 0.2).result;
     * console.log(res);
     * ```
     */
    computeNumber(a: number, type: NumberSymbols, b: number) {
        const THAT = this;
        /**
         * 获取数字小数点的长度
         * @param n 数字
         */
        function getDecimalLength(n: number) {
            const decimal = n.toString().split(".")[1];
            return decimal ? decimal.length : 0;
        }
        /** 倍率 */
        const power = Math.pow(10, Math.max(getDecimalLength(a), getDecimalLength(b)));
        let result = 0;

        // 防止出现 `33.33333*100000 = 3333332.9999999995` && `33.33*10 = 333.29999999999995` 这类情况做的暴力处理
        a = Math.round(a * power);
        b = Math.round(b * power);

        switch (type) {
            case "+":
                result = (a + b) / power;
                break;
            case "-":
                result = (a - b) / power;
                break;
            case "*":
                result = (a * b) / (power * power);
                break;
            case "/":
                result = a / b;
                break;
        }

        return {
            /** 计算结果 */
            result,
            /**
             * 继续计算
             * @param nextType 继续计算方式
             * @param nextValue 继续计算的值
             */
            next(nextType: NumberSymbols, nextValue: number) {
                return THAT.computeNumber(result, nextType, nextValue);
            },
        };
    }

    /**
     * 范围随机数
     * @param min 最小数
     * @param max 最大数
     */
    public ranInt(min: number, max: number) {
        return Math.round(Math.random() * (max - min) + min);
    }

    /**
     * 检测类型
     * @param target 检测的目标
     */
    checkType(target: any) {
        const value: string = Object.prototype.toString.call(target);
        const result = (value.match(/\[object (\S*)\]/) as RegExpMatchArray)[1];
        return result.toLocaleLowerCase() as JavaScriptTypes;
    }

    /**
     * 格式化日期
     * @param value 指定日期
     * @param format 格式化的规则
     * @example
     * ```js
     * formatDate();
     * formatDate(1603264465956);
     * formatDate(1603264465956, "h:m:s");
     * formatDate(1603264465956, "Y年M月D日");
     * ```
     */
    public formatDate(value: string | number = Date.now(), format = "Y-M-D h:m:s") {
        const formatNumber = (n: number) => `0${n}`.slice(-2);
        const date = new Date(value);
        const formatList = ["Y", "M", "D", "h", "m", "s"];
        const resultList = [];
        resultList.push(date.getFullYear().toString());
        resultList.push(formatNumber(date.getMonth() + 1));
        resultList.push(formatNumber(date.getDate()));
        resultList.push(formatNumber(date.getHours()));
        resultList.push(formatNumber(date.getMinutes()));
        resultList.push(formatNumber(date.getSeconds()));
        for (let i = 0; i < resultList.length; i++) {
            format = format.replace(formatList[i], resultList[i]);
        }
        return format;
    }

    /**
     * 数组中随机取几个元素
     * @param {array} arr 数组
     * @param count 元素个数
     */
    public getRandomArrayElements<T>(array: Array<T>, count: number) {
        /** 数组长度 */
        let length = array.length;
        /** 最小长度 */
        let min = length - count, temp: T, range: number;
        while (length-- > min) {
            range = Math.floor((length + 1) * Math.random());
            temp = array[range];
            array[range] = array[length];
            array[length] = temp;
        }
        return array.slice(min);
    }

    /**
     * 随机打乱数组
     * @param array
     */
    public shuffleArray<T>(array: Array<T>) {
        // 洗牌随机法（性能最优）
        for (let i = array.length - 1; i >= 0; i--) {
            let randomIndex = Math.floor(Math.random() * (i + 1));
            let itemAtIndex = array[randomIndex];
            array[randomIndex] = array[i];
            array[i] = itemAtIndex;
        }
        return array;
    }

    /**
     * 将指定位置的元素置顶
     * @param array 改数组
     * @param index 元素索引
     */
    public zIndexToTop<T>(array: Array<T>, index: number) {
        if (index != 0) {
            let item = array[index];
            array.splice(index, 1);
            array.unshift(item);
        } else {
            console.log("已经处于置顶");
        }
    }

    /**
     * 将指定位置的元素置底
     * @param array 改数组
     * @param index 元素索引
     */
    public zIndexToBottom<T>(array: Array<T>, index: number) {
        if (index != array.length - 1) {
            let item = array[index];
            array.splice(index, 1);
            array.push(item);
        } else {
            console.log("已经处于置底");
        }
    }

}

/** 工具模块 */
const utils = new utilsModule();

export default utils;
