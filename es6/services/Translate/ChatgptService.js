import Base from './Base'
import Log from "../../tools/Log";
import {ChatGPTAPI} from 'chatgpt' // 文档 https://github.com/transitive-bullshit/chatgpt-api
import {AI} from "../../conf";
import ConversationCache from "../../caches/ConversationCache";

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

        let raw_text = `只翻译以下内容，要求中文转阿拉伯语，且以沙特阿拉伯人的叙事风格：   ${chinese_text}`
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

    /**
     * @return Promise
     */
    static async general_with_cache(ctx, text, uniq_id) {
        // 获取会话
        let option = {
            timeoutMs: AI.timeout_second * 1000,
        }
        const chat_api = ChatgptService.new_api_object()

        // Case 1 不需要上下文信息
        if (uniq_id === "") {
            let res = await chat_api.sendMessage(text, option)
            return res.text
        }
        // Case 2 需要上下文

        // - 读取上下文
        // --- 注入会话上下文信息
        let conversationInfo = await ConversationCache.get_data(uniq_id)
        if (conversationInfo !== null) {
            option.conversationId = conversationInfo.conversationId
            option.parentMessageId = conversationInfo.id
            // console.debug("ddddddddd")
        }
        // Log.ctxInfo(ctx, `uniq_id  ${uniq_id}`)
        // console.debug("")
        // console.debug("uniq_id", uniq_id)
        // console.debug("option", option)
        let res = await chat_api.sendMessage(text, option)
        // - 存储上下文
        let cache_data = {
            conversationId: res.conversationId,
            id: res.id,
        }
        await ConversationCache.set_data(uniq_id, cache_data);
        return res.text
    }
}