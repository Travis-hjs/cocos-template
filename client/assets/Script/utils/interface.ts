/** 运算符号 */
export type NumberSymbols = "+" | "-"| "*" | "/";

/** JavaScript类型 */
export type JavaScriptTypes = "string" | "number" | "array" | "object" | "function" | "null" | "undefined";

/** 拉起视频传参 */
export interface OptionsShowVideo {
    /** 视频`id`默认拿当前配置`id` */
    videoId?: string
    /** 成功看完视频回调 */
    success?: () => void
    /** 视频出错回调 */
    fail?: (error: any) => void
}