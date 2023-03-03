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
            const cookiesRaw = `_EDGE_V=1; MUID=133D590A73B7662A06334B3D72656787; MUIDB=133D590A73B7662A06334B3D72656787; USRLOC=HS=1; SRCHD=AF=ANAB01; SRCHUID=V=2&GUID=828024AF806B4FB290D4C62C41A7961F&dmnchg=1; MUIDV=NU=1; MMCASM=ID=710FEE1D631143DFBD7B4A402D524B04; ANIMIA=FRE=1; _tarLang=default=zh-Hans; _TTSS_IN=hist=WyJlbiIsImF1dG8tZGV0ZWN0Il0=; _TTSS_OUT=hist=WyJ6aC1IYW5zIl0=; ZHCHATSTRONGATTRACT=TRUE; ANON=A=7395C27F5C8C28B66130CA77FFFFFFFF&E=1c07&W=1; WLID=GVB06Wy9vB36aU99hqh07L96XgFtMTSMAGHMm/xMq3ifOsxMGxrwJgghz8LVXQtWEaHSGv3DoSmrSKyfqdSyX9EQhJg55MVGY6GtE9Q03RQ=; SUID=A; ZHCHATWEAKATTRACT=TRUE; ZHLASTACTIVECHAT=0; ABDEF=V=13&ABDV=11&MRNB=1677349143678&MRB=0; _UR=QS=0&TQS=0; _clck=qb7smp|1|f9f|0; _clsk=2rpfo6|1677349841222|18|0|f.clarity.ms/collect; _EDGE_S=SID=0C5D9420074069200FED86E3066D6884; WLS=C=78c517683574e1ac&N=%e4%b8%b4%e9%a3%8e; _U=1dmHoFKR219VuVh87qGxFBAd7R5peFCd3cPLr0zQD7AVpQ_aEzUyg_bbbJ25vSv56PevdP0dJeaVnzqVF0yOWTiitS105TOH19rdBWg2asYdIu5Y61bh1SeXeo_LJ0eyYHYnCfY_ae0HSWSxbe9qSRouXATpGUv9yPvPEkh1dooPa-eIvcPIalN1ZfcO8C5BTpE-E0Un8X5Aa6KGxF7-mdQBoYRebFJRzrQx1mXPe93U; SRCHS=PC=EE24; MicrosoftApplicationsTelemetryDeviceId=b8def018-2378-4334-a53d-417c876684ba; _HPVN=CS=eyJQbiI6eyJDbiI6MSwiU3QiOjAsIlFzIjowLCJQcm9kIjoiUCJ9LCJTYyI6eyJDbiI6MSwiU3QiOjAsIlFzIjowLCJQcm9kIjoiSCJ9LCJReiI6eyJDbiI6MSwiU3QiOjAsIlFzIjowLCJQcm9kIjoiVCJ9LCJBcCI6dHJ1ZSwiTXV0ZSI6dHJ1ZSwiTGFkIjoiMjAyMy0wMi0yNVQwMDowMDowMFoiLCJJb3RkIjowLCJHd2IiOjAsIkRmdCI6bnVsbCwiTXZzIjowLCJGbHQiOjAsIkltcCI6Nn0=; SRCHUSR=DOB=20221008&T=1677386044000&POEX=W; ipv6=hit=1677389646801&t=4; _RwBf=ilt=300&ihpd=2&ispd=15&rc=12&rb=12&gb=0&rg=0&pc=12&mtu=0&rbb=0.0&g=0&cid=&clo=0&v=46&l=2023-02-25T08:00:00.0000000Z&lft=0001-01-01T00:00:00.0000000&aof=0&o=0&p=bingcopilotwaitlist&c=MY00IA&t=7412&s=2023-02-25T18:22:06.6959696+00:00&ts=2023-02-26T04:34:24.0799609+00:00&rwred=0&wls=1&lka=0&lkt=0&TH=&W=1&mta=0&e=lR2sJ7NGKCX-9p0WmitHvrYqa4QUJ4Ngv5lG7YVUeDJFZ7veMFpMrDjFnrA4csu5yc6nngKsa9zJuZLraZsc9Q&A=; _SS=SID=0C5D9420074069200FED86E3066D6884&PC=EE24&R=12&RB=12&GB=0&RG=0&RP=12; SRCHHPGUSR=BRW=W&BRH=T&CW=1352&CH=1042&SCW=1402&SCH=1844&DPR=1.3&UTC=480&DM=0&SRCHLANG=zh-Hans&PV=10.0.0&PRVCW=1352&PRVCH=1042&EXLTT=31&HV=1677386064&WTS=63812941179&BZA=0&VCW=2031&VCH=1042&PR=1.25`

            this.bing_ai = new BingAIClient({
                // Necessary for some people in different countries, e.g. China (https://cn.bing.com)
                host: 'https://cn.bing.com',
                // "_U" cookie from bing.com
                userToken: '',
                // If the above doesn't work, provide all your cookies as a string instead
                cookies: cookiesRaw,
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
        let response = await chat_api.sendMessage('Write a short poem about cats', {
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