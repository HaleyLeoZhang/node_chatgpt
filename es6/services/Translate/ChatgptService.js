import Base from './Base'
import Log from "../../tools/Log";
import {ChatGPTAPI} from 'chatgpt' // 文档 https://github.com/transitive-bullshit/chatgpt-api
import {AI} from "../../conf";

export default class ChatgptService extends Base {
    // 初始化API对象
    static new_api_object() {
        const api = new ChatGPTAPI({
            apiKey: AI.open_ai_api_key,
            debug: AI.debug,
        })
        return api
    }

    /**
     * @return Promise
     */
    static async chinese_to_en(ctx, chinese_text) {
        const chat_api = ChatgptService.new_api_object()

        let raw_text = `只翻译以下内容，要求中文转英文，且以美国人的叙事风格：   ${chinese_text}`
        // raw_text = 'Hello World!' // TODO 用于测试
        const res = await chat_api.sendMessage(raw_text, {
            timeoutMs: AI.timeout_second * 1000,
        })
        return res.text
    }

    /**
     * @return Promise
     */
    static async chinese_to_arabic(ctx, chinese_text) {
        const chat_api = ChatgptService.new_api_object()

        let raw_text = `只翻译以下内容，要求中文转阿拉伯语，且以沙特拉伯人的叙事风格：   ${chinese_text}`
        // raw_text = 'Hello World!' // TODO 用于测试
        const res = await chat_api.sendMessage(raw_text, {
            timeoutMs: AI.timeout_second * 1000,
        })
        return res.text
    }

    /**
     * @return Promise
     */
    static async general(ctx, text) {
        const chat_api = ChatgptService.new_api_object()
        const res = await chat_api.sendMessage(text, {
            timeoutMs: AI.timeout_second * 1000,
        })
        return res.text
    }
}