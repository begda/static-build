const fs = require('fs');
const fse = require('fs-extra')
const cheerio = require('cheerio');
const path = require('path');
const glob = require('glob');
const _ = require('lodash');

class Build {
    entry = '/*.html'//   "/*.html"  '/index.html'  //支持 glob的 目录写法
    outPath = 'dist'  //导出文件目录
    srcPath = 'src'  //导出文件目录
    assetsPath = 'assets'  //资源文件目录
    entryPath = path.resolve('src', this.entry)  //入口html文件
    outAssetsPath = path.resolve(this.outPath, this.assetsPath)   //导出文件assets资源目录
    assetsCommonPath = path.resolve('../../../', 'assets_common')  //根路径的 资源目录
    nodeModulesCommonPath = path.resolve('../../../', 'node_modules')  //根路径的 npm下载的包
    outHtml = path.join(this.outPath, this.entry)
    rootPath = path.resolve()   //当前项目的
    constructor() {
        console.log(this.assetsCommonPath)
        this.linkCommon()
        this.html()
    }

    html() {
        let htmlPath = glob.sync(path.resolve(this.srcPath) + this.entry, {matchBase: true}) //获取当前入口的所有html文件
        let rootPathArr = this.rootPath.split(path.sep) //把当前路径转换为数组,用于下面的对比
        this.mkdirOutPath((err => {
            if (err) return console.error(err)
            htmlPath.map(item => {
                let srcPathArr = item.split(path.sep) //把glob扫描到的html路径转换为数组
                //去掉路径里重复的部分,剩下的就是要的html文件了,然后在重新合并成路径
                let newPathArr = _.difference(_.difference(srcPathArr, rootPathArr), [this.srcPath])
                let pathJoin = _.join(newPathArr, path.sep); //组合新路径

                const html = fs.readFileSync(path.resolve(this.srcPath, pathJoin)); //读取html文件
                const $ = cheerio.load(html); //获取html文件的 dom
                //复制资源文件到 dist文件夹
                this.loadScript($)
                this.loadCss($)
                this.loadImg($)
                //重新生成html,里面的 资源路径都改变了
                fse.outputFileSync(path.resolve(this.outPath, pathJoin), $.html())  //输出html
            })
        }))
    }

    //复制js到dist
    loadScript($) {
        $('script').map((i, el) => {
            const elPath = $(el).attr('src')
            if (elPath) {
                let {destPath, domPath} = this.pathJoin(elPath)
                $(el).attr('src', domPath) //替换页面的元素
                try {
                    let srcPath = path.join('src', elPath)  //文件的源目录
                    fse.copySync(srcPath, destPath, {overwrite: true})
                    // console.log(srcPath + 'copey js成功!')
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
                    let srcPath = path.join('src', elPath)  //文件的源目录
                    fse.copySync(srcPath, destPath, {overwrite: true})
                    // console.log(srcPath + 'copey css成功!')
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
                    let srcPath = path.join('src', elPath)  //文件的源目录
                    fse.copySync(srcPath, destPath, {overwrite: true})
                    // console.log(srcPath + 'copey img成功!')
                } catch (err) {
                    console.error(err)
                }
            }
        })
    }


    // //获取路径里面模块的名字. 就是 vue jquery 这些名字
    // moduleName(filePath) {
    //     let arr = filePath.split(path.sep)
    //     //判断路径里面有没有这些目录存在
    //     let assets = arr.indexOf('assets') >= 0 ? true : false
    //     let assets_common = arr.indexOf('assets_common') >= 0 ? true : false
    //     let node_modules = arr.indexOf('node_modules') >= 0 ? true : false
    //     let bower_components = arr.indexOf('bower_components') >= 0 ? true : false
    //
    //     //先判断是不是在 node_modules  bower_components目录下面,如果是的话,就可以返回模块名字,用于创建模块文件夹.
    //     if (assets_common) {
    //         if (node_modules || bower_components) {
    //             return filePath
    //             // return path.join(this.assetsPath, 'modules', arr[3], this.fileName(filePath))
    //         }
    //     } else {
    //         if (assets) {
    //             return filePath
    //         } else {
    //             return filePath
    //         }
    //     }
    // }

    //组装路径
    pathJoin(filePath) {
        let elPath = filePath
        let destPath = path.resolve(this.outPath, filePath)
        let domPath = elPath
        return {destPath, domPath}
    }

    //获取路径里的文件名字
    fileName(filePath) {
        return path.basename(filePath)
    }

    //把公共资源软连接到当前项目
    linkCommon() {
        const dstpath = path.resolve('src', this.fileName(this.assetsCommonPath))
        const nodeModulesPath = path.join(dstpath, 'modules', 'node_modules')
        fs.symlink(this.assetsCommonPath, dstpath, err => {
            if (err) {
                let s = err.message.split(',')
                if (s[0] === 'EEXIST: file already exists') {  //判断是否已经存在了
                    console.log('assets_common 的软连接已存在')
                }
            }
            try {
                fs.symlinkSync(this.nodeModulesCommonPath, nodeModulesPath)  //创建 node_module的软连接
                console.log('assets_common/modules/node_module 连接创建成功')
            } catch (err) {
                let s = err.message.split(',')
                if (s[0] === 'EEXIST: file already exists') {  //判断是否已经存在了
                    console.log('assets_common/modules/node_module 的软连接已存在')
                }
            }
        })

    }

    //创建dist文件
    mkdirOutPath(callback) {

        //每次编译都把dist目录彻底清空
        fse.emptyDir(path.resolve(this.outPath), err => {
            if (err) return console.error(err)

            //确保目录为空。如果目录不为空，则删除目录内容。如果目录不存在，则创建它。目录本身不会被删除。
            const filterFunc = (src, dest) => {
                console.log(src)
                //assets_common 不复制到dist目录里 ,因为这个是公共资源的软连接
                let srcArr = src.split(path.sep).indexOf('assets_common') >= 0 ? true : false
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

    removeOut() {
        fs.unlinkSync(path.resolve(this.outPath));
    }

}

class LinkFile {

}

new Build()
