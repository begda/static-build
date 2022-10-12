# 开发说明

### 安装使用
需要node开发环境
```shell
npm init  #创建package.json 文件
npm i @begda/static-build  #安装 静态html编译
npm i browser-sync  #安装 监听文件变化,自动刷新浏览器
```


### begda.config.js 配置说明
1. 极简配置
```js
// 所有配置都是选填的,可以为空,如果不需要改文件夹名字,推荐极简配置
import {defineConfig} from '@begda/static-build';
defineConfig()
```
2. 完整配置
```js
import {defineConfig} from '@begda/static-build';
defineConfig({
    projectName: projectName || prName(),  //项目名称,默认会取package.json的projectName
    entry: '/*.html',//   "/*.html"  '/index.html'  //支持 glob的 目录写法  入口文件
    out: 'dist',  //导出文件目录
    src: 'src',  //源码
    assets: 'ba-assets',  //静态资源文件目录
    commonModules: 'ba-modules',  //静态资源文件目录
    bower_components: 'bower_components',  //公共静态资源文件目录,如果bower_components 目录没有的话,就用 node_modules目录,因为npm包是必须的
    node_modules: 'node_modules',  //npm安装包资源文件目录
    zip: ture || false   //是否自动打压缩包, true为自动打包 false 为不打包
})

```

### 两个包管理目录的重要说明

1. node_modules
   > 通过npm 安装的包管理器目录,这个是必须有的,所有依赖都在这里面
2. bower_components
   > 通过bower安装的包管理目录,可以直接通过url地址下载包, 有些js css 包没有在npm里面,要用这个直接下载
   >
   > 如果不使用bower_components 可以不在 begda.config.js里面配置,默认会直接使用node_modules来代替
3. bower 使用说明

```shell
   1. npm i bower -g 全局安装包管理
   1. bower init   创建bower.json 文件
   2  打开bower.json ,把要下载的包 名字和地址 按下面格式 ,添加到 dependencies 属性里面
       "dependencies": {
        "tailwindcss": "https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css",
        "jquery.3.6.1": "https://code.jquery.com/jquery-3.6.1.min.js"
        }
   3. bower install  安装包
```

### 运行命令
```shell
"build": "node begda.config.js",   #编译切图好的文件,是生成一个文件夹, 可以直接发给同事
"browser-sync:dist": "browser-sync start --server 'dist' --files 'dist'",  #启动生产测试环境浏览器
"browser-sync:src": "browser-sync start --server 'src' --files 'src'",  #启动开发环境浏览器
"说明": "这个可以设置这样的 --files '/**/*.css,/**/*.html,/**/*.js'",
"pnpm-install": "pnpm install --shamefully-hoist"
```
