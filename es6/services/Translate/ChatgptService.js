import Base from './Base'
import Log from "../../tools/Log";
import UserAgentTool from "../../tools/UserAgentTool";
import CONST_BUSINESS_COMIC from "../../constant/business_comic";

const fetch = require('node-fetch'); // 文档 https://www.npmjs.com/package/node-fetch


export default class ChatgptService extends Base {

    /**
     * @return Promise
     */
    static async chinese_to_en(ctx, chinese_text) {

        // let options = {
        //     'headers': {
        //         'User-Agent': UserAgentTool.fake_one(),
        //         'Host': 'cn.baozimh.com',
        //         "Referer": "https://cn.baozimh.com/",
        //     },
        //     redirect: "follow",
        //     timeout: CONST_BUSINESS_COMIC.HTTP_FETCH_TIMEOUT,
        // }
        // options = this.getProxyOption(options) // 使用代理
        // return fetch(target_url, options)
        //     .then(res => res.text())
        //     .then(html => {
        //         const $ = cheerio.load(html);
        //         let name = $(".comics-detail__title").text()
        //         let pic = $("amp-addthis").attr("data-media")
        //         let intro = $(".comics-detail__desc").text()
        //         Log.ctxInfo(ctx, JSON.stringify({name, pic, intro}))
        //         Log.ctxInfo(ctx, `拉取结束 source_id ${source_id} 基本信息`)
        //         return {name, pic, intro}
        //     })
    }
}