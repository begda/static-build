import path from 'path';
import glob from "glob";
import fs from "fs";
import cheerio from "cheerio";
import fse from "fs-extra";
import {zip} from "./zip.js";
import _ from 'lodash'

console.log('开始运行')
//对外入口文件
export const defineConfig = (obj = {}) => {
    const {projectName, entry, out, src, assets, bower_components, node_modules, commonModules, zip} = obj
    let newObj = {
        projectName: projectName || prName(),
        entry: entry || '/*.html',//   "/*.html"  '/index.html'  //支持 glob的 目录写法  入口文件
        out: out || 'dist',  //导出文件目录
        src: src || 'src',  //源码
        assets: assets || 'ba-assets',  //静态资源文件目录
        commonModules: commonModules || 'ba-modules',  //静态资源文件目录
        bower_components: bower_components || 'node_modules',  //公共静态资源文件目录,如果bower_components 目录没有的话,就用 node_modules目录,因为npm包是必须的
        node_modules: node_modules || 'node_modules',  //npm安装包资源文件目录
        zip: zip || false   //是否自动打压缩包, true为自动打包 false 为不打包
    }

    new Build(newObj)
}

//获取里面的项目名字
const prName = () => {
    let projectName = importPackageJson();
    if (projectName.projectName) {
        return projectName.projectName
    } else {
        if (!projectName.name) {
            return '未命名'
        } else {
            return projectName.name
        }
    }
}

//导入package.json 文件
const importPackageJson = () => {
    let packageJson = path.resolve('package.json') //获取当前文件目录地址
    return fse.readJsonSync(packageJson) //读取json文件
}


//根路径的 资源目录,会一直往上级目录查找
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
        throw new Error(`没有找到 ${moduleName} 请在项目根目录创建`)
        return false
    } else {
        return rootDir
    }

}

class Build {
    constructor(obj = {}) {
        const {projectName, entry, out, src, assets, bower_components, node_modules, commonModules, zip} = obj
        this.projectName = projectName      //   "/*.html"  '/index.html'  //支持 glob的 目录写法  入口文件
        this.zip = zip      //  是否压缩zip文件
        this.entry = entry      //   "/*.html"  '/index.html'  //支持 glob的 目录写法  入口文件
        this.outPath = out  //导出文件目录
        this.srcPath = src  //源码
        this.assetsPath = assets  //静态资源文件目录
        this.bower_components = bower_components  //公共静态资源文件目录
        this.node_modules = node_modules  //npm安装包资源文件目录
        this.commonModules = commonModules  //公用模块存储的文件夹

        //重新组合的路径
        this.entryPath = path.resolve(this.srcPath + this.entry)  //入口html文件
        this.outAssetsPath = path.resolve(this.outPath, this.assetsPath)   //导出文件assets资源目录
        this.modulesCommonPath = path.resolve(this.srcPath, 'ba-modules')   //根路径的 资源目录
        this.bowerComponentsPath = nodeModuleDir(this.bower_components)  //根路径的 资源目录,会一直往上级目录查找,知道找到bower_components目录
        this.nodeModulesPath = nodeModuleDir(this.node_modules)  //根路径的 npm下载的包 会一直往上级目录查找,知道找到node_modules目录
        this.projectPath = path.resolve()   //当前项目的路径

        this.linkCommon()
        this.html(() => {
            //如果zip=true 就打包zip文件
            if (this.zip) {
                console.log('创建zip文件')
                this.zipStart()
            }
        })
    }

    html(callback) {
        let self = this
        let htmlPath = glob.sync(this.entryPath, {matchBase: true}) //获取当前入口的所有html文件
        console.log('入口文件数量:', htmlPath.length)
        this.mkdirOutPath((err => {
            if (err) return console.error(err)
            let arr = [] //资源路径暂存目录
            //循环所有入口文件,并从中取出资源路径,然后在去重,就能的到精简的资源路径了
            htmlPath.map(item => {
                let fileName = path.basename(item) //返回 path 的最后一部分 文件名字
                let folderPath = path.dirname(item) //返回 path 的目录名
                const html = fs.readFileSync(path.resolve(folderPath, fileName)); //读取html文件
                const $ = cheerio.load(html); //获取html文件的 dom
                let js = self.loadScript($)
                let css = self.loadCss($)
                let img = self.loadImg($)
                arr.push(js)
                arr.push(css)
                arr.push(img)
            })
            let noModules = _.uniqWith(_.flatten(arr), _.isEqual); //合并数组,去除重复的路径
            console.log('------------------------------------', 'HTML的公共依赖资源复制到 dist 完毕,不包含 ba-assets目录的资源')
            //循环公共资源路径,然后复制到 dist目录
            noModules.map(item => {
                self.copyCommonModules(item)
            })
            //这里复制完成以后,所有文件操作都完成了,后续就可以打包压缩了
            self.copySrcPath(() => {
                typeof callback === "function" ? callback() : '';
            })
        }))
    }

    //过滤文件夹,如果不包含有要过滤的路径返回true, 如果包含有要过滤的文件夹返回false.   主要是为了不去复制 ba-asstes目录的文件,这个目录文件是用户自己写的
    filterFolder(folder, name) {
        let srcArr = folder.split(path.sep).indexOf(name) >= 0 ? true : false
        if (srcArr) {
            return false
        } else {
            return true
        }
    }


    //复制js到dist
    loadScript($, callback) {
        let arr = []
        $('script').map((i, el) => {
            const elPath = $(el).attr('src')
            if (elPath) {
                arr.push(elPath)
                typeof callback === "function" ? callback(elPath) : '';
            }

        })
        return arr
    }

    loadCss($, callback) {
        let arr = []
        $('link').map((i, el) => {
            const elPath = $(el).attr('href')
            if (elPath) {
                arr.push(elPath)
                typeof callback === "function" ? callback(elPath) : '';
            }
        })
        return arr
    }

    loadImg($, callback) {
        let arr = []
        $('img').map((i, el) => {
            const elPath = $(el).attr('src')
            if (elPath) {
                arr.push(elPath)
                typeof callback === "function" ? callback(elPath) : '';
            }
        })
        return arr
    }


    //组装路径
    pathJoin(filePath) {
        let elPath = filePath
        let destPath = path.resolve(this.outPath, filePath)  //导出目录的路径

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
        //每次编译都把 ba-modules 目录彻底清空
        fse.emptyDir(this.modulesCommonPath, err => {
            if (err) return console.error(err)
            //创建软连接
            try {
                fs.symlinkSync(borwerSrcPath, borwerDstPath)  //创建 node_module的软连接
                console.log('************************************ 软连接创建成功', borwerDstPath)
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
        const borwerSrcPath = this.bowerComponentsPath  //源文件
        const borwerDstPath = path.join(this.modulesCommonPath, this.bower_components)
        const nodeSrcPath = this.nodeModulesPath //源文件
        const nodeDstPath = path.join(this.modulesCommonPath, this.node_modules)
        this.linkFolder(borwerSrcPath, borwerDstPath)
        this.linkFolder(nodeSrcPath, nodeDstPath)
    }

    //创建dist文件
    mkdirOutPath(callback) {
        let self = this
        //每次编译都把dist目录彻底清空。如果目录不为空，则删除目录内容。如果目录不存在，则创建它。目录本身不会被删除。
        fse.emptyDir(path.resolve(this.outPath), err => {
            if (err) return console.error(err)
            console.log('************************************', self.outPath + ' 文件夹生成完毕', '')
            typeof callback === "function" ? callback() : '';
        })
    }

    //复制 src 所以内容(不包括ba-modules文件夹) 目录到 dist目录里面
    copySrcPath(callback) {
        console.log('------------------------------------', '复制 src 所以内容(不包括ba-modules文件夹) 目录到 dist目录里面完成', '')
        //过滤文件夹 ba-modules 不复制到dist目录里 ,因为这个是公共资源的软连接
        const filterFunc = (src, dest) => {
            if (this.filterFolder(src, this.commonModules)) {
                console.log(src, ' 复制成功!')
            }
            return this.filterFolder(src, this.commonModules)
        }

        //复制文件到dist目录里面,这里用回调方法,以确保全部复制完了在运行,后续的代码
        fse.copy(path.resolve(this.srcPath), path.resolve(this.outPath), {filter: filterFunc}, e => {
            typeof callback === "function" ? callback(e) : '';
        })
    }

    //复制 ba-modules(不包含 ba-assets目录) 目录到 dist目录里面
    copyCommonModules(item) {
        let self = this
        if (self.filterFolder(item, self.assetsPath)) {  //去除 ba-assets文件夹.
            let {destPath} = this.pathJoin(item) //获取 完整的 dist 资源路径
            try {
                let srcPath = path.join(this.srcPath, item)  //文件的源目录
                console.log(srcPath + ' 复制成功!')
                return fse.copySync(srcPath, destPath, {overwrite: true})
            } catch (err) {
                throw new Error(`"${err.path}" 路径不存在`)
            }
        }
    }

    //删除连接
    removeOut() {
        fs.unlinkSync(path.resolve(this.outPath));
    }

    //压缩文件 后续版本增加压缩功能
    zipStart() {
        zip(this.projectName, path.resolve(this.outPath))
    }

}



