import fs from "fs";
import fse from "fs-extra";
import archiver from "archiver";


const Zip = (name,outPath) => {
    const dist = outPath
    const zipName = () => {
        return name.split('/').join('-') +'-'+ new Date().getTime() + '.zip'
    }

    const zipYasuo = (callback) => {


        //创建一个压缩文件的流存储文件,下面会把要压缩的文件都添加到这个文档里
        const output = fs.createWriteStream(zipName());
        //文件流关闭
        output.on('close', function () {
            // console.log(archive.pointer() + ' total bytes');
            console.log('archiver 打包zip完成,文件关闭');
            callback()
        });
        output.on('end', function () {
            console.log('压缩完成');
        });

        //创建压缩文档配置
        const archive = archiver('zip', {
            zlib: {level: 9} // Sets the compression level.
        });

        archive.on('warning', function (err) {
            if (err.code === 'ENOENT') {
                console.log('archive 警告')
            } else {
                // throw error
                throw err;
            }
        });

        archive.on('error', function (err) {
            console.log('archive 错误')
            throw err;
        });
        //关联压缩文档
        archive.pipe(output);
        //往压缩文档里添加文件夹
        archive.directory(dist,zipName());
        archive.finalize();
    }


    fse.pathExists(dist, (err, exists) => {
        if (exists) { //dist目录存在的时候才能删除
            zipYasuo(() => {
                fse.remove(dist)
            })
        } else {
            console.log('dist 文件夹不存在')
        }
    })

}


export const zip =Zip
