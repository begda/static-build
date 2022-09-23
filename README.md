# 运行说明

必须依赖父文件夹的 assets_common 目录才能运行

```shell

    "build:dist": "node build.js",   #编译切图好的文件,是生成一个文件夹, 可以直接发给同事
    "build:all": " pnpm run build:dist && node zip.js",   #编译切图好的文件, 生成好一个zip压缩包,更方便发送
    "browser-sync:dist": "browser-sync start --server 'dist'   --files 'dist'",  #启动生产测试环境浏览器
    "browser-sync:src": "browser-sync start --server 'src'   --files 'src'",  #启动开发环境浏览器
    "说明": "这个可以设置这样的 --files '/**/*.css,/**/*.html,/**/*.js'",
    "pnpm-install": "pnpm install --shamefully-hoist"

```
