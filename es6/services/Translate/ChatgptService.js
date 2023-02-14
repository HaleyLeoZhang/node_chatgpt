import Base from './Base'
import Log from "../../tools/Log";
import {ChatGPTAPI} from 'chatgpt' // 文档 https://github.com/transitive-bullshit/chatgpt-api
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

        let raw_text = `只翻译以下内容，要求中文转英文：   ${chinese_text}`
        // raw_text = 'Hello World!' // TODO 用于测试
        const res = await api.sendMessage(raw_text, {
            timeoutMs: AI.timeout_second * 1000,
        })
        return res.text
    }

    /**
     * @return Promise
     */
    static async chinese_to_arabic(ctx, chinese_text) {
        const api = new ChatGPTAPI({
            apiKey: AI.open_ai_api_key,
            debug: AI.debug,
        })

        let raw_text = `只翻译以下内容，要求中文转阿拉伯语：   ${chinese_text}`
        // raw_text = 'Hello World!' // TODO 用于测试
        const res = await api.sendMessage(raw_text, {
            timeoutMs: AI.timeout_second * 1000,
        })
        return res.text
    }
}