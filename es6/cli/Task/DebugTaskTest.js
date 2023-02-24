import BaseTask from "../../libs/Base/BaseTask";
import ContextTool from "../../tools/ContextTool";
import GoDaService from "../../services/Translate/GoDaService";
import ChatgptService from "../../services/Translate/ChatgptService";

export default class DebugTaskTest extends BaseTask {
    // 测试 chatGPT 翻译功能是否通畅
    static async translate() {
        try {
            let ctx = ContextTool.initial() // 每次拉取都是一个新的上下文
            let text_zh = "沐临风非常牛皮"
            let text_en = await ChatgptService.chinese_to_en(ctx, text_zh)
            console.warn("翻译前")
            console.log(text_zh)
            console.warn("翻译后")
            console.log(text_en)
        } catch (e) {
            console.error(e)
        }
    }

    // 测试 chatGPT 翻译功能是否通畅
    static async general_with_cache() {
        try {
            let ctx = ContextTool.initial() // 每次拉取都是一个新的上下文
            let text = "你叫什么名字"
            let uniq_id = "b95fe19e-d4fc-4b72-8867-90df620d7f4c"
            let res = await ChatgptService.general_with_cache(ctx, text, uniq_id)
            console.log(res)
        } catch (e) {
            console.error(e)
        }
    }

}