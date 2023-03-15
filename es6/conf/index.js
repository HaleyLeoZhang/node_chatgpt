// ----------------------------------------------------------------------
// 公共基础配置
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------

import * as yaml from "js-yaml";

const APP_PATH = __dirname + '/../../'

import fs from "fs";
import Log from "../tools/Log";


// const DEFAULT_CONFIG_PATH = '/app/app.yaml' // 配置文件默认位置

// 初始化配置
let BROWSER = {}, // 浏览器配置
    AI = {}, // OepnAI 官方的一些配置
    LOG_CONFIG = {}, // 日志配置
    SENTRY_DSN = "", // Sentry 异常采集 - 更多请访问 https://sentry.io/
    HTTP_PORT = 4040, // HTTP 服务端口
    PROXY_DSN = "", // 代理服务器配置
    RABBIT_MQ = {}, // RabbitMQ 配置
    DB_COMIC = {}, // Mysql数据库配置
    AUTH = {}, // OpenAPI 权限校验
    REDIS_COMIC = { // 缓存配置
        // host: '192.168.56.110',
        // port: 6379,
        // password: '',
        // db: 0,
    }

export default class Conf {
    // 注入参数
    static ini_doc(doc) {
        SENTRY_DSN = doc.sentry_dsn
        LOG_CONFIG = {
            debug: doc.log.debug,
            path: doc.log.path,
        }
        AI = {
            open_ai_api_key: doc.ai.open_ai_api_key,
            timeout_second: doc.ai.timeout_second,
            debug: doc.ai.debug,
            bing_cookie: doc.ai.bing_cookie,
        }
        HTTP_PORT = doc.http_port
        PROXY_DSN = doc.proxy_dsn
        RABBIT_MQ = {
            host: doc.rabbit_mq.host,
            port: doc.rabbit_mq.port,
            user: doc.rabbit_mq.user,
            password: doc.rabbit_mq.password,
            vhost: doc.rabbit_mq.vhost,
        }
        DB_COMIC = {
            read: doc.db_comic.read,
            write: doc.db_comic.write,
        }
        REDIS_COMIC = {
            host: doc.redis.host,
            port: doc.redis.port,
            password: doc.redis.password,
            db: doc.redis.db,
        }
        // 权限
        for (let i = 0, len = doc.auth.length; i < len; i++) {
            let one = doc.auth[i]
            AUTH[one.client_name] = one.token
        }
    }

    // 读取配置
    static load_config(ars) {
        // let config_path = DEFAULT_CONFIG_PATH
        let config_path = ""
        for (let i = 0, len_ars = ars.length; i < len_ars; i++) {
            let one = ars[i]
            let res_config = one.match(/--conf=(.*)/i)
            if (res_config !== null) {
                config_path = res_config[1].trim(" ")
            }
        }
        const doc = yaml.load(fs.readFileSync(config_path, 'utf8'));
        // console.log(doc); // 配置文件日常这里
        Conf.ini_doc(doc)
        // ini log
        Log.IniConfig(LOG_CONFIG.debug, LOG_CONFIG.path)
    }
}


export {
    APP_PATH,
    AI,
    BROWSER,
    SENTRY_DSN,
    HTTP_PORT,
    PROXY_DSN,
    RABBIT_MQ,
    DB_COMIC,
    REDIS_COMIC,
    AUTH,
};
