// ----------------------------------------------------------------------
// http - 程序入口
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------

import * as Koa from 'koa'
import * as KoaCors from 'koa2-cors'
import * as BodyParser from 'koa-bodyparser'
import * as RouterTool from 'koa-router'
import Translate from "./controller/translate";
import Supplier from "./controller/supplier";
import Conf, {HTTP_PORT} from "./conf";

const app_router = RouterTool.default()
const app_cors = KoaCors.default()
const app_body_parser = BodyParser.default()
const app = new Koa.default()

// 初始化配置文件
Conf.load_config(process.argv)

// 路由注册 ---- START
app_router.post('/translate/zh', Translate.handle) // 因为请求体可能是很大一章节文字，所以用 POST 请求比较合适

// 路由注册 ---- END

app.use(app_cors)
app.use(app_body_parser)
app.use(app_router.routes()).use(app_router.allowedMethods())

console.log("Listening node HTTP server Port on ", HTTP_PORT)
app.listen(HTTP_PORT)
