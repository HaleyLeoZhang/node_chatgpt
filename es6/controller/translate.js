// ----------------------------------------------------------------------
// 通知爬虫相关控制
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------

import Base from "./base";
import SentryTool from "../libs/Sentry/tool";
import HTTP_CODE from "../constant/http_code";
import General from "../tools/General";
import TranslateLogic from "../logics/Open/TranslateLogic";
import Log from "../tools/Log";

export default class Translate extends Base {
    /**
     * 中文转各种语言
     * @param string zh 中文文本
     * @param string option 选项  枚举值  en 英文 arabic 阿拉伯语
     */
    static async handle(http_ctx) {
        let {response, ctx} = Base.response_default_with_ctx()
        try {
            Base.require_client_name(http_ctx)
            let zh = General.get_data_with_default(http_ctx.request.body.zh, "")
            if (zh.length === 0) {
                throw new Error("入参 zh 不能为空")
            }
            let option = General.get_data_with_default(http_ctx.request.body.option, "")
            if (option.length === 0) {
                throw new Error("入参 option 不能为空.  枚举值  en 英文 arabic 阿拉伯语")
            }
            let res_text = await TranslateLogic.chinese_to_any(ctx, option, zh)
            response.data = {
                "text": res_text,
            }
        } catch (error) {
            Log.ctxInfo(ctx, JSON.stringify(http_ctx.request.body))
            Log.ctxError(ctx, error.message)
            Log.ctxError(ctx, error.stack)
            SentryTool.captureException(error)
            response.data = null
            response.code = HTTP_CODE.BUSINESS_ERROR
            response.msg = error.message
        }
        http_ctx.body = response
    }

    /**
     * 常规问机器人
     * @param string text 发问内容
     */
    static async general(http_ctx) {
        let {response, ctx} = Base.response_default_with_ctx()
        try {
            Base.require_client_name(http_ctx)
            let text_input = General.get_data_with_default(http_ctx.request.body.text, "")
            if (text_input.length === 0) {
                throw new Error("入参 zh 不能为空")
            }
            let uniq_id = General.get_data_with_default(http_ctx.request.body.uniq_id, "")
            let engine = General.get_data_with_default(http_ctx.request.body.engine, "") // 可选 bing 或者不填【默认chatGPT】
            let res = await TranslateLogic.general(ctx, text_input, uniq_id, engine)
            response.data = {
                "text": res.text,
                "conversation_id": res.conversation_id,
            }
        } catch (error) {
            Log.ctxInfo(ctx, JSON.stringify(http_ctx.request.body))
            Log.ctxError(ctx, error.message)
            Log.ctxError(ctx, error.stack)
            SentryTool.captureException(error)
            response.data = null
            response.code = HTTP_CODE.BUSINESS_ERROR
            response.msg = error.message
        }
        http_ctx.body = response
    }
}