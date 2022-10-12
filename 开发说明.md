# 源码开发
### 目录说明
```shell
- lib
   - esm
      - index.js   #主要代码, 内部有注释
      - zip.js     #压缩打包代码
```
### 演示demo在 example文件夹
> demo目录运行效果在 demo里运行命令查看
> 
> [https://github.com/begda/static-build/tree/main/example](https://github.com/begda/static-build/tree/main/example) 
> 
> demo使用说明
> 
> [https://github.com/begda/static-build/blob/main/example/README.md](https://github.com/begda/static-build/blob/main/example/README.md)


### package.json 发包必须配置说明
```shell
{
  "name": "@begda/static-build",  #包名字
  "version": "0.0.2",
  "description": "@begda/静态编译",
  "title": "@begda/静态编译",
  "main": "lib/index.js",
  "type": "module",               #使用es6语法
  "scripts": {
    "pnpm-install": "pnpm install --shamefully-hoist"
  },
  "keywords": [                  #npm搜索关键字
    "static-build",
    "html-static-build",
    "begda"
  ],
  "repository": {               #包的 git地址
    "type": "git",
    "url": "github.com/begda/static-build.git"
  },
  "homepage": "https://blog.tianliaohui.com",
  "files": [                     #要发布的目录
    "lib"
  ],
  "exports": {                #使用包的时候 选择 esm 还是 cjs 的写法,目前只能使用esm
    ".": {
      "require": "./lib/index.js",
      "import": "./lib/esm/index.js"
    }
  },
  "dependencies": {
    "archiver": "^5.3.1",
    "browser-sync": "^2.27.10",
    "glob": "^8.0.3",
    "cheerio": "1.0.0-rc.12"
  },
  "devDependencies": {
    "fs-extra": "^10.1.0"
  },
  "publishConfig": {       #发布配置
    "tag": "0.0.1",        
    "registry": "https://registry.npmjs.org/",  #发布地址
    "access": "public"      # 发公开包
  }
}


```

### 发布到npm上
```shell
如果是第一次发布，运行 npm adduser，如果不是第一次发包，运行 npm login
进入项目文件夹下，运行 npm publish 发布
```
#### 第一次发布
```shell
npm adduser   #运行命令 输入账号密码登陆
npm publish   #运行发布命令
```

#### 第二次发布 / 发布完之后想修改一下如何操作呢（升级）
```shell
npm login     #运行登陆命令,如果已登陆不需要运行

npm view @begda/static-build versions  #查看远端已经发布的@begda/static-build包的版本

# 修改版本号：
# 使用 npm version <update_type> 进行修改，
# update_type 有三个参数
# patch：这个是补丁的意思，补丁最合适；
# minor：这个是小修小改；
# major：这个是大改咯；
# 版本号怎么增加：
# 比如我想来个1.0.1版本，注意，是最后一位修改了增1，那么命令：npm version patch
# 比如我想来个1.1.0版本，注意，是第二位修改了增1，那么命令： npm version minor
# 比如我想来个2.0.0版本，注意，是第一位修改了增1，那么命令： npm version major
npm version <update_type> 

npm publish    #运行发布包
```
