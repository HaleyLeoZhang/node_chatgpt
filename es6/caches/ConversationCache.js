import BaseCache from '../libs/Base/BaseCache'
import CONST_BUSINESS_COMIC from "../constant/business_comic";

export default class ConversationCache extends BaseCache {
    // 缓存名称
    static get_name() {
        return CONST_BUSINESS_COMIC.CHAT_CONVERSATION_CACHE_PREFIX
    }

    // 缓存秒数
    static get_ttl() {
        return CONST_BUSINESS_COMIC.CHAT_CONVERSATION_CACHE_TTL
    }

    // 缓存类型
    static get_type() {
        return 'object'
    }
}