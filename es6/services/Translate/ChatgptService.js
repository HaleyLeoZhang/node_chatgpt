import Base from './Base'
import Log from "../../tools/Log";
import {ChatGPTAPI} from 'chatgpt'
import {AI} from "../../conf";

export default class ChatgptService extends Base {

    /**
     * @return Promise
     */
    static async chinese_to_en(ctx, chinese_text) {
        const api = new ChatGPTAPI({
            apiKey: AI.open_ai_api_key,
            debug: AI.debug,
        })

        let raw_text = `中文转英文，翻译以下内容：   ${chinese_text}`
        // raw_text = 'Hello World!' // TODO 用于测试
        const res = await api.sendMessage(raw_text, {
            timeoutMs: AI.timeout_second * 1000,
        })
        console.log(res.text)
        Log.ctxInfo(ctx, "结束")
    }
}