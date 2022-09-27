import path from 'path';
import glob from "glob";
import _ from "lodash";
import fs from "fs";
import cheerio from "cheerio";
import fse from "fs-extra";
// import {zip} from "./zip.js";
// console.log(zip)

//对外入口文件
export const defineConfig = (obj = {}) => {
    new Build(obj)
}

const nodeModuleDir = (moduleName) => {
    //把递减的目录存到数组里组成新的路径
    const pathGrop = (pathArr, index) => {
        let path = []
        for (let i = 0; i <= index; i++) {
            path.push(pathArr[i])
        }
        return path.join("/")
    }
    //获取根目录的node_module目录
    const rootModule = (module) => {
        // 获取文件所在的当前目录
        const isPath = path.resolve('.')
        // 分割目录为数组 path.sep 是获取当前系统的路径分隔符,因为 windows \\ 和 mac / 的路径分隔符不一样
        const pathArr = isPath.split(path.sep)
        // 递减目录数组,直到找到begda.config.js,来确定目前项目的根目录
        for (let a = pathArr.length - 1; a >= 0; a--) {
            let pathModule = path.join(pathGrop(pathArr, a), module)//组合成路径地址
            let isFolder = glob.sync(pathModule, {matchBase: true}) //用glob判断文件夹是否存在
            if (isFolder.length > 0) {
                return pathModule
            }
        }
    }

    const rootDir = rootModule(moduleName)
    if (!rootDir) {
        throw new Error(`没有找到begda.config.js 请在项目根目录创建`)
        return false
    } else {
        return rootDir
    }

}

class Build {
    constructor(obj = {}) {
        const {projectName,entry, out, src, assets, bower_components, node_modules,commonModules,zip} = obj
        this.projectName = projectName      //   "/*.html"  '/index.html'  //支持 glob的 目录写法  入口文件
        this.zip = zip      //   "/*.html"  '/index.html'  //支持 glob的 目录写法  入口文件
        this.entry = entry      //   "/*.html"  '/index.html'  //支持 glob的 目录写法  入口文件
        this.outPath = out  //导出文件目录
        this.srcPath = src  //源码
        this.assetsPath = assets  //静态资源文件目录
        this.bower_components = bower_components  //公共静态资源文件目录
        this.node_modules = node_modules  //npm安装包资源文件目录
        this.commonModules=commonModules  //公用模块存储的文件夹

        //重新组合的
        this.entryPath = path.resolve(this.srcPath+this.entry)  //入口html文件
        this.outAssetsPath = path.resolve(this.outPath, this.assetsPath)   //导出文件assets资源目录
        this.modulesCommonPath = path.resolve(this.srcPath, 'ba-modules')   //根路径的 资源目录
        this.bowerComponentsPath = nodeModuleDir(this.bower_components)  //根路径的 资源目录,会一直往上级目录查找,知道找到bower_components目录
        this.nodeModulesPath = nodeModuleDir(this.node_modules)  //根路径的 npm下载的包 会一直往上级目录查找,知道找到node_modules目录
        this.projectPath = path.resolve()   //当前项目的路径

        this.linkCommon()
        this.html()
        this.zipStart()
    }

    html() {
        let self=this
        let htmlPath = glob.sync(this.entryPath, {matchBase: true}) //获取当前入口的所有html文件
        this.mkdirOutPath((err => {
            if (err) return console.error(err)
            htmlPath.map(item => {
                let fileName=path.basename(item, ) //返回 path 的最后一部分
                let folderPath=path.dirname(item) //返回 path 的目录名
                if(self.filterFolder(folderPath,self.assetsPath)){
                    const html = fs.readFileSync(path.resolve(folderPath, fileName)); //读取html文件
                    const $ = cheerio.load(html); //获取html文件的 dom
                    //复制资源文件到 dist文件夹
                    this.loadScript($)
                    this.loadCss($)
                    this.loadImg($)
                    //重新生成html,里面的 资源路径都改变了
                    fse.outputFileSync(path.resolve(folderPath, fileName), $.html())  //输出html
                }
            })
        }))
    }

    //过滤文件夹,如果包含有要过滤的路径返回false
    filterFolder (folder, name) {
        let srcArr = folder.split(path.sep).indexOf(name) >= 0 ? true : false
        if (srcArr) {
            return false
        } else {
            return true
        }
    }


    //复制js到dist
    loadScript($) {
        $('script').map((i, el) => {
            const elPath = $(el).attr('src')
            if (elPath) {
                let {destPath, domPath} = this.pathJoin(elPath)
                $(el).attr('src', domPath) //替换页面的元素
                try {
                    let srcPath = path.join(this.srcPath, elPath)  //文件的源目录
                    fse.copySync(srcPath, destPath, {overwrite: true})
                    console.log(srcPath + 'copey js成功!')
                } catch (err) {
                    console.error(err)
                }
            }

        })
    }

    loadCss($) {
        $('link').map((i, el) => {
            const elPath = $(el).attr('href')
            if (elPath) {
                let {destPath, domPath} = this.pathJoin(elPath)
                $(el).attr('href', domPath) //替换页面的元素
                try {
                    let srcPath = path.join(this.srcPath, elPath)  //文件的源目录
                    fse.copySync(srcPath, destPath, {overwrite: true})
                    console.log(srcPath + 'copey css成功!')
                } catch (err) {
                    console.error(err)
                }
            }
        })
    }

    loadImg($) {
        $('img').map((i, el) => {
            const elPath = $(el).attr('src')
            if (elPath) {
                let {destPath, domPath} = this.pathJoin(elPath)
                $(el).attr('src', domPath) //替换页面的元素
                try {
                    let srcPath = path.join(this.srcPath, elPath)  //文件的源目录
                    fse.copySync(srcPath, destPath, {overwrite: true})
                    console.log(srcPath + 'copey img成功!')
                } catch (err) {
                    console.error(err)
                }
            }
        })
    }




    //组装路径
    pathJoin(filePath) {
        let elPath = filePath
        let destPath = path.resolve(this.outPath, filePath)

        //在这里处理相对路径的 ../ 这个后续版本在加
        // console.log(filePath.split(path.sep))
        // // console.log(_.takeWhile(filePath.split(path.sep)))
        // _.takeWhile(filePath.split(path.sep), function(o) {
        //      console.log(o)
        //
        //
        //     return 1; });

        let domPath = elPath
        return {destPath, domPath}
    }

    //获取路径里的文件名字
    fileName(filePath) {
        return path.basename(filePath)
    }


    //连接文件夹
    linkFolder(target, path) {
        const borwerSrcPath = target  //源文件
        const borwerDstPath = path
        //每次编译都把dist目录彻底清空
        fse.emptyDir(this.modulesCommonPath, err => {
            if (err) return console.error(err)

            //创建软连接
            try {
                fs.symlinkSync(borwerSrcPath, borwerDstPath)  //创建 node_module的软连接
                console.log(borwerDstPath + ' 连接创建成功')
            } catch (err) {
                let s = err.message.split(',')
                if (s[0] === 'EEXIST: file already exists') {  //判断是否已经存在了
                    console.log(borwerDstPath + ' 连接已经存在了')
                }
            }
        })


    }

    //把公共资源软连接到当前项目
    linkCommon() {
        const borwerSrcPath =this.bowerComponentsPath  //源文件
        const borwerDstPath = path.join(this.modulesCommonPath, this.bower_components)
        const nodeSrcPath = this.nodeModulesPath //源文件
        const nodeDstPath = path.join(this.modulesCommonPath, this.node_modules)
        this.linkFolder(borwerSrcPath, borwerDstPath)
        this.linkFolder(nodeSrcPath, nodeDstPath)
    }

    //创建dist文件
    mkdirOutPath(callback) {

        //每次编译都把dist目录彻底清空
        fse.emptyDir(path.resolve(this.outPath), err => {
            if (err) return console.error(err)

            //确保目录为空。如果目录不为空，则删除目录内容。如果目录不存在，则创建它。目录本身不会被删除。
            const filterFunc = (src, dest) => {
                //ba-modules 不复制到dist目录里 ,因为这个是公共资源的软连接
                let srcArr = src.split(path.sep).indexOf(this.commonModules) >= 0 ? true : false
                if (srcArr) {
                    return false
                } else {
                    return true
                }
            }
            //复制文件到dist目录里面,这里用回调方法,以确保全部复制完了在运行,后续的代码
            fse.copy(path.resolve(this.srcPath), path.resolve(this.outPath), {filter: filterFunc}, callback)
        })
    }

    //删除连接
    removeOut() {
        fs.unlinkSync(path.resolve(this.outPath));
    }

    //压缩文件 后续版本增加压缩功能
    zipStart(){
        // zip(this.projectName,path.resolve(this.outPath))
    }

}



