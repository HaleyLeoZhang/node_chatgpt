import Base from './Base'
import Log from '../../tools/Log'

export default class TranslateLogic extends Base {

    /**
     * 中文转英文
     * @return Promise text 英文内容
     */
    static async chineseToEn(ctx, chinese) {
        let list = await SupplierData.get_by_id_list(id_list)
        list = Base.handle_datetime(list, 'created_at,updated_at')
        list = SupplierLogic.list_add_parse_fields(list)
        return list
    }

}