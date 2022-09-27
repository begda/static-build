import {defineConfig} from '@begda/static-build';
// import {title} from  './package.json'
defineConfig({
    // title:title,
    entry: '/*.html',//   "/*.html"  '/index.html'  //支持 glob的 目录写法  入口文件
    out: 'dist',  //导出文件目录
    src: 'src',  //源码
    assets: 'ba-assets',  //静态资源文件目录
    commonModules: 'ba-modules',  //静态资源文件目录
    bower_components: 'bower_components',  //公共静态资源文件目录
    node_modules: 'node_modules',  //npm安装包资源文件目录
    zip:true

})

