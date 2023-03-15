import Base from './Base'
import Log from '../../tools/Log'
import ChatgptService from "../../services/Translate/ChatgptService";
import {error} from "winston";

export default class TranslateLogic extends Base {
    /**
     * 中文内容，核心转换
     * @return Promise text 英文内容
     */
    static async chinese_to_any(ctx, option, text_zh) {
        let text = ""
        switch (option) {
            case "en": // 转英文
                text = await ChatgptService.chinese_to_en(ctx, text_zh)
                break
            case "arabic": // 中文转阿拉伯
                text = await ChatgptService.chinese_to_arabic(ctx, text_zh)
                break
            default:
                throw new Error("未知的 option ")
        }
        return text
    }

    /**
     * 正常回应，可以记录上下文
     * @return string JSON 机器人回复
     */
    static async general(ctx, text, uniq_id, engine) {
        let res = await ChatgptService.general_with_cache(ctx, text, uniq_id, engine)
        Log.ctxInfo(ctx,`uniq_id ${uniq_id}  Question ${text}`)
        Log.ctxInfo(ctx,`uniq_id ${uniq_id}  Answer   ${res.text}`)
        return res
    }
}