// ----------------------------------------------------------------------
// OpenAPI 基类
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------

import TimeTool from "../../tools/TimeTool";
import General from "../../tools/General";
import ChatgptService from "../../services/Translate/ChatgptService";
import Log from "../../tools/Log";
import {AUTH} from "../../conf";

export default class Base {
    // 多个字段，中间以 , 隔开
    static handle_datetime(list, field_names) {
        let lenList = list.length
        if (lenList > 0) {
            let field_name_list = field_names.split(",")
            for (let i = 0; i < lenList; i++) {
                for (let j in field_name_list) {
                    let field_name = field_name_list[j]
                    let time_string = list[i][field_name]
                    let date_time = (new Date(time_string)).getTime() / 1000
                    list[i][field_name] = General.format_time("Y-m-d h:i:s", date_time)
                }
            }
        }
        return list
    }

    /**
     * 正常回应，可以记录上下文
     * @return string JSON 机器人回复
     */
    static check_auth(ctx, client_name, token) {
        if (AUTH[client_name] === token) {
            return true
        }
        return false
    }
}