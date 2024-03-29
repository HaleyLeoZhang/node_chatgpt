default: debug

# ------------------------------------  开发环境  ------------------------------------

# 如果有node 18的兼容问题 执行
#   $env:NODE_OPTIONS="--openssl-legacy-provider"
www:
	@clear
	@node ./node_modules/@vercel/ncc/dist/ncc/cli.js build ./es6/www.js -m -o ./dist/www
	@node ./dist/www --conf="./app.yaml"

# 新渠道测试 windows 环境安装 make 相关指令 https://note.youdao.com/s/Z1w74WkV
debug:
	@clear
# 	@rm -rf ./dist/app
# 	@./node_modules/.bin/babel-node.cmd ./es6/app.js  debug_task general_with_cache --conf="./app.yaml"
	@node ./node_modules/@vercel/ncc/dist/ncc/cli.js build ./es6/app.js -m -o ./dist/app
#	@node ./dist/app debug_task translate --conf="D:/own_files/codes/own/node_puppeteer_framework/app.yaml"
	@node ./dist/app debug_task general_with_cache --conf="./app.yaml"
#
# babel-node 说明文档 https://babeljs.io/docs/en/babel-node
#	@./node_modules/.bin/babel-node ./es6/app.js  debug_task general_with_cache --conf="./app.yaml"


# 调试www服务
debug_www:
	@clear
	@rm -rf ./dist/www
	@node ./node_modules/@vercel/ncc/dist/ncc/cli.js build ./es6/www.js -m -o ./dist/www
	#@node ./dist/www --conf="D:/own_files/codes/own/node_puppeteer_framework/app.yaml"
	@node ./dist/www --conf="./app.yaml"


install:
	@clear
	@echo "Package installing"
	@rm -rf package-lock.json
	@rm -rf node_modules
	@npm config set registry https://registry.npmmirror.com
	@npm install --ignore-scripts

# ------------------------------------  生产环境  ------------------------------------
install_prod:
	@clear
	@echo "Package installing"
	@rm -rf package-lock.json
	@rm -rf node_modules
	@npm config set registry https://registry.npmmirror.com
	@npm install --ignore-scripts
	@make -is build

# 编译成单个文件
#    https://github.com/vercel/ncc
build:
	@# 编译以 ./es6/task.js 入口的相关文件到一个文件里
	@clear
	@echo "----------- Compile File , please wait...."
	#@node ./node_modules/@vercel/ncc/dist/ncc/cli.js build ./es6/task.js -m -o ./dist/task
	@node ./node_modules/@vercel/ncc/dist/ncc/cli.js build ./es6/www.js -m -o ./dist/www
	@echo "----------- Compile success"

# 自动提交
push:
	@git add -A
	@git commit -m "update"
	@git push origin master

pull:
	@git fetch && git checkout origin/master