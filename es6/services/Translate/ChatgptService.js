import Base from './Base'
import Log from "../../tools/Log";
import {BingAIClient} from '@waylaidwanderer/chatgpt-api';
// import {ChatGPTAPI} from 'chatgpt' // 文档 https://github.com/transitive-bullshit/chatgpt-api
import {AI} from "../../conf";
import ConversationCache from "../../caches/ConversationCache";
import {ChatGPTAPI} from "../../libs/Chat";

export default class ChatgptService extends Base {
    // 初始化API对象
    static new_api_object() {
        if (this.open_ai === undefined) {
            this.open_ai = new ChatGPTAPI({
                apiKey: AI.open_ai_api_key,
                debug: AI.debug,
            })
        }
        return this.open_ai
    }

    // 初始bing API对象，可能有限流 ---
    static new_bin_api_object() {
        if (this.bing_ai === undefined) {
            // 申请权限 https://www.xiaoheiwoo.com/how-to-apply-new-bing-and-free-to-use-chatgpt/
            // 要加入后补名单并审核通过后  翻墙访问 https://www.bing.com/new
            // 要用户登录的cookie TODO cookie 可能要放到 redis 里， 方便修改 --- 目前 cookie 过期时间不确定
            const cookiesRaw = ""

            this.bing_ai = new BingAIClient({
                // Necessary for some people in different countries, e.g. China (https://cn.bing.com)
                host: 'https://cn.bing.com',
                // "_U" cookie from bing.com
                userToken: '',
                // If the above doesn't work, provide all your cookies as a string instead
                cookies: AI.bing_cookie,
                // A proxy string like "http://<ip>:<port>"
                // proxy: 'http://127.0.0.1:7890',
                // (Optional) Set to true to enable `console.debug()` logging
                debug: AI.debug,
            });
        }
        return this.bing_ai
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
     * @return JSON
     * */
    static async general_with_cache(ctx, text, uniq_id, engine) {
        let res = {
            "text": "", // 回复文本内容
            "conversation_id": "", // 会话ID
        }
        switch (engine) {
            case "bing":
                res = await ChatgptService.general_with_cache_bing(ctx, text, uniq_id)
                break
            default:
                res = await ChatgptService.general_with_cache_openai(ctx, text, uniq_id)
        }
        return res
    }

    /**
     * TODO 这个是使用 chatGPT 请求的，因为需要本地存储上下文，每次要发送全量前后文，所以暂时废弃
     * @return string
     */
    static async general_with_cache_openai(ctx, text, uniq_id) {
        // 获取会话
        let option = {
            timeoutMs: AI.timeout_second * 1000,
        }
        const chat_api = ChatgptService.new_api_object()

        // Case 1 不需要上下文信息
        if (uniq_id === "") {
            let res = await chat_api.sendMessage(text, option)
            return {
                "text": res.text,
                "conversation_id": res.conversationId,
            }
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
        return {
            "text": res.text,
            "conversation_id": res.conversationId,
        }
    }

    /**
     * @return string
     */
    static async general_with_cache_bing(ctx, text, uniq_id) {
        // 获取会话
        console.debug("------------doing")
        let option = {
            // timeoutMs: AI.timeout_second * 1000, // 国内不需要
            // onProgress: (token) => { // 打印机器人回复
            //     process.stdout.write(token);
            // },
        }
        const chat_api = ChatgptService.new_bin_api_object()

        // Case 1 不需要上下文信息
        if (uniq_id === "") {
            console.debug("------------uniq_id")
            let res = await chat_api.sendMessage(text, option)
            console.debug("------------不需要上下文信息")
            return {
                "text": res.response,
                "conversation_id": res.conversationId,
            }
        }
        // Case 2 需要上下文

        // - 读取上下文
        // --- 注入会话上下文信息
        let conversationInfo = await ConversationCache.get_data(uniq_id)
        if (conversationInfo !== null) {
            option.conversationSignature = conversationInfo.conversationSignature
            option.conversationId = conversationInfo.conversationId
            option.clientId = conversationInfo.clientId
            option.invocationId = conversationInfo.invocationId
            console.debug("conversationInfo")
            console.debug(conversationInfo)
        }
        let res = await chat_api.sendMessage(text, option)
        // - 存储上下文
        let cache_data = {
            conversationSignature: res.conversationSignature,
            conversationId: res.conversationId,
            clientId: res.clientId,
            invocationId: res.invocationId,
        }
        await ConversationCache.set_data(uniq_id, cache_data);
        return {
            "text": res.response,
            "conversation_id": res.conversationId,
        }
    }

    /**
     * @return Promise
     */
    static async general_option_test() {
        const chat_api = ChatgptService.new_bin_api_object()
        let response = await chat_api.sendMessage('我现在在上海，告诉我一下明天是几号，明天天气怎么样，是否适合出游', {
            onProgress: (token) => {
                process.stdout.write(token);
            },
        });
        console.log(response);

        response = await chat_api.sendMessage('Now write it in French', {
            conversationSignature: response.conversationSignature,
            conversationId: response.conversationId,
            clientId: response.clientId,
            invocationId: response.invocationId,
            onProgress: (token) => {
                process.stdout.write(token);
            },
        });
        console.log(response);
    }
}