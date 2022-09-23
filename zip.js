// require modules
const {description} = require('./package.json');
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra')
const archiver = require('archiver');
const dist =path.resolve('dist')


const zipName=()=>{
    return description.split('/').join('-')+new Date().getTime()+'.zip'
}

console.log(zipName())
const zipYasuo=(callback)=>{
    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });
    const output = fs.createWriteStream(__dirname + '/'+zipName());
    output.on('close', function() {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver 打包zip完成,文件关闭');
        callback()
    });
    output.on('end', function() {
        console.log('Data has been drained');
    });


    archive.on('warning', function(err) {
        if (err.code === 'ENOENT') {
            // log warning
        } else {
            // throw error
            throw err;
        }
    });

    archive.on('error', function(err) {
        throw err;
    });
    archive.pipe(output);
    archive.directory(path.resolve('dist'), zipName);
    archive.finalize();
}



fse.pathExists(dist, (err, exists) => {
    if(exists){ //dist目录存在的时候才能删除
        zipYasuo(()=>{
            fse.remove(dist)
        })
    }else{
        console.log('dist 文件夹不存在')
    }
})
