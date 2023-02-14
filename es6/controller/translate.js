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
     * 通知开始对应漫画的爬虫
     * - 2021年1月30日 22:51:00 方便调用，直接 get 请求，本次不使用 post
     */
    static async handle(http_ctx) {
        let {response, ctx} = Base.response_default_with_ctx()
        try {
            Base.require_client_name(http_ctx)
            let comic_id = General.get_data_with_default(http_ctx.request.query.zh, 0)
            if (!comic_id) {
                comic_id = undefined
            }
            let zh = General.get_data_with_default(http_ctx.request.body.zh, "")
            if (zh.length === 0){
                throw new Error("请传入 zh 不能为空")
            }
            let en = await TranslateLogic.chineseToEn(ctx, comic_id)
            response.data = {
                "en_text": en,
            }
        } catch (error) {
            Log.ctxError(ctx, error.message)
            Log.ctxError(ctx, error.stack)
            SentryTool.captureException(error)
            response.data = null
            response.code = HTTP_CODE.BUSINESS_ERROR
            response.msg = 'failed!'
        }
        http_ctx.body = response
    }
}