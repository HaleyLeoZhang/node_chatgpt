import Base from './Base'
import Log from "../../tools/Log";
import {BingAIClient} from '@waylaidwanderer/chatgpt-api';
import {ChatGPTAPI, ChatGPTUnofficialProxyAPI} from 'chatgpt' // 文档 https://github.com/transitive-bullshit/chatgpt-api
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

    // 初始bing API对象，可能有限流 ---
    static new_bin_api_object() {
        // 申请权限 https://www.xiaoheiwoo.com/how-to-apply-new-bing-and-free-to-use-chatgpt/
        // 要加入后补名单并审核通过后  翻墙访问 https://www.bing.com/new
        // 要用户登录的cookie TODO cookie 可能要放到 redis 里， 方便修改 --- 目前 cookie 过期时间不确定
        const cookiesRaw = `
 _EDGE_V=1; MUID=133D590A73B7662A06334B3D72656787; MUIDB=133D590A73B7662A06334B3D72656787; USRLOC=HS=1; SRCHD=AF=ANAB01; SRCHUID=V=2&GUID=828024AF806B4FB290D4C62C41A7961F&dmnchg=1; MUIDV=NU=1; MMCASM=ID=710FEE1D631143DFBD7B4A402D524B04; ANIMIA=FRE=1; _tarLang=default=zh-Hans; _TTSS_IN=hist=WyJlbiIsImF1dG8tZGV0ZWN0Il0=; _TTSS_OUT=hist=WyJ6aC1IYW5zIl0=; ZHCHATSTRONGATTRACT=TRUE; SRCHS=PC=EDGEDBB; _SS=PC=EDGEDBB&SID=3425F75B79E76E861264E59878C46FE6&R=200&RB=0&GB=0&RG=200&RP=200; CSRFCookie=07066984-bef2-4399-91c7-30780291ba31; ANON=A=7395C27F5C8C28B66130CA77FFFFFFFF&E=1c07&W=1; NAP=V=1.9&E=1bad&C=XzZM_KtVzQFMFZqfb982maVMRMezEVV39cGrhug7BhWwew4I70vE6g&W=1; PPLState=1; KievRPSSecAuth=FABqBBRaTOJILtFsMkpLVWSG6AN6C/svRwNmAAAEgAAACMRL8FXBP+hDKASZQzFAU15dIqf7tFRGNOd+atDrhvwaQ+67SKxKeXnulAz44G2pgtcVCDZ/1lBYuRKDZUYtJibH2ipNcI49fTNgXlmXXLXx7hUUW90RsVbEBuGdvPWTwqaesVqgHzdKLBVsV78MGh1/0d5syN7Q9p5Clnfs2K6YcgaLI7SPRdBfm5xtwtrceXbqzNcN4CM36FI4iodegDkPMNGk3Pd6E+4YO4VfOdPa0ev8K8bKNsil7bQffeRpZeCASNudbwWBtuihPqbYiWdPzKEhi6FSZRQVbiFVZx2o2LJhgRf7wR7j5WzEfVqGqPejwC2P0Dyr2jDU1ycqbQKjNWS5rJp2cydKvESfpUWH9krntHFNLH9wi/Ob2g6lZHBcnbubtwR7jwQcPBef2K2RvqC9I7qv0JctV0CdKTOtLe30WPtiJmbLI0nRKIVIEMI7m3BftNkrNghzwt7p2qNzAGhowB2pG/HT+9dZCGAI9BSQ73wYdBHMz6mzWXdn1viWY0/NzBxJgsOeyYdAEST9ISu1BylNRH2XOdbxpfnB5DinjEDtdEUtV3kXQKeCPedO8fsRPSk2SMCcnGAt8AMMm71GiUtUQ97AWPL2k8byluIo+nil8F/XDYub0r/UX5aQ6NXUh9BxtOtVEhbcOlKDSXw+559pAF7A/POYUveLrTT8YWQ5tGaTnGCGXeMK8BolJgagQ1P5L9MWlS2FfaABzYNo8Cl8zPo4WO8P4LgSxAnrj1G2+ospM10Yg9UUlSmGj+aQFyf0gXYZX0Q7qWuJ6hAv8aPZ90MelH6hO3SmDcKW+QXz3pe9SSldC2xB1ece/xSnXgaBePYIhZstQvU7M2h3H44S+CO4VGJLYHZn+rN+IxSctDDWWZVOPse4wzQGriv0qacwViK53zKBI/ikb74ix40GneN4DKK4M48OanFvK+IeQU/JHP1zMcKdpxWVHhvqnRJov4h5kuPssMDoaerSWXUC9tyCV9QdVZh6IwqGEy3IERjdZaofBpYNw859KKfEYBeD/5hbh0BhxUrLKAIBRBNMdmW5WdsgxQCouAkcpg1Mt1T/1a1i39ezA0ZCCx5hN+ChImmzeK2E3eSTwhU7Zmlw078MRCJ6wEiBJMOL2RHfWdIro+NNwceQlQfxvYTG8lk+g+8bKrBJUcTJt2uw/qrDfhLnUiGv9/pYgcYoKBliM/9mL7JFdfAqfcnFT2hqv1AdysJc0ABsEQM/krvnFzBzbjElm6hiSWCtIHh27pQMRCr/9dMY7ZiDR7KWRUmVwbkoaQ9Bh8Iggfrzr2E0VWQOfCcAVtAISRMUHS1AHyY9KNKgMCOVylTkzBPRWOnGoILz5HJydHLJpqCojp+T81kxIHqbF7FCMdNsW3Bt4lgclQwdXnP5tAaywVZWaEBfZTLlomROQS6XBuN65xQAV6u2RHqPjgeEvY6id+HmbEW8TX4=; WLS=C=78c517683574e1ac&N=%e4%b8%b4%e9%a3%8e; WLID=GVB06Wy9vB36aU99hqh07L96XgFtMTSMAGHMm/xMq3ifOsxMGxrwJgghz8LVXQtWEaHSGv3DoSmrSKyfqdSyX9EQhJg55MVGY6GtE9Q03RQ=; SUID=A; ZHCHATWEAKATTRACT=TRUE; ZHSEARCHCHATSTATUS=STATUS=1; ZHLASTACTIVECHAT=0; SRCHUSR=DOB=20221008&T=1677348102000&POEX=W; ipv6=hit=1677351704949&t=4; _EDGE_S=SID=3B5FF3C45E6D69EA3A2AE1075FB06873&mkt=zh-cn; SNRHOP=I=&TS=; _U=1q2cKcbq3sNksT2gZgCfVoaDcPe7SHW7HDB27KO-24OVIWmet0Rjl9p36R_Upuuz0HbDDLlEcWu-ggASsr5MRallth4TYjx_RbhtPqJsx8nO5DmiWJPsLyefDOaayUgA4xgDOILGj8287jf3_llS14Unn6NIpJ3JJdDK-oy1qHUa5FxGxZ6zcHohyxGjhjxYY3Sg6nJYx7QQtoPgyeME-Zt1Zys3AdXsQHQa5UuEAyAE; SRCHHPGUSR=BRW=W&BRH=T&CW=1352&CH=1042&SCW=1335&SCH=3664&DPR=1.3&UTC=480&DM=0&SRCHLANG=zh-Hans&PV=10.0.0&PRVCW=1352&PRVCH=1042&EXLTT=31&HV=1677349110&WTS=63812941179&BZA=0&VCW=2031&VCH=1042&PR=1.25; ABDEF=V=13&ABDV=11&MRNB=1677349111283&MRB=0; _RwBf=ilt=294&ihpd=0&ispd=12&rc=200&rb=0&gb=0&rg=200&pc=200&mtu=0&rbb=0&g=0&cid=&clo=0&v=12&l=2023-02-25T08:00:00.0000000Z&lft=2023-02-02T00:00:00.0000000-08:00&aof=0&o=2&p=&c=&t=0&s=0001-01-01T00:00:00.0000000+00:00&ts=2023-02-25T18:18:32.2706234+00:00&rwred=0&wls=&lka=0&lkt=0&TH=&W=1

        `
        const api = new BingAIClient({
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

    static async general_with_cache(ctx, text, uniq_id, engine) {
        let resText = ''
        switch (engine) {
            case "bing":
                resText = await ChatgptService.general_with_cache_bing(ctx, text, uniq_id)
                break
            default:
                resText = await ChatgptService.general_with_cache_openai(ctx, text, uniq_id)
        }
        return resText
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
            return res.response
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
        return res.response
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