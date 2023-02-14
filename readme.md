## 起步

> 目录介绍

`es6` 源代码路径  
本地开发环境 通过 `babel-node` 调试  
生产环境通过 [ncc](https://github.com/vercel/ncc) 打包对应功能模块到 `dist/` 各自目录下  

想了解代码结构 你可以先从`入口文件`开始

| 入口文件类型 | 文件位置 | 备注 |
| ---- | ---- | ---- |
| 爬虫任务 | `./es6/task.js`   | - |
| `HTTP`服务 | `./es6/www.js`   | - |


> 运行项目

先创建并修改配置文件 `app.yaml`  

```
cp app.example.yaml app.yaml
```

然后进入目录 `docker/unix`  

运行服务，默认会对外暴露 `3995` 端口，作为对外通信接口  
具体可以自行修改 `docker/unix/docker-compose.yml`  

```
make ini
```

通过集成的命令  
```
make log
```

看到有输出  

```
Listening node HTTP server Port on  4040
```

则表明，服务已启动成功


> 接口说明

简略说明  
`GET参数` 中 `client_name` 是必填的入参，随便填点内容都行    

#### 翻译接口

`zh` 是想翻译的中文文本  
`option` 

```
curl --location --request POST '127.0.0.1:3995/translate/zh?client_name=mlf' \
--header 'Content-Type: application/json' \
--data-raw '{
    "zh":"沐临风是男主",
    "option": "arabic"
}'
```
