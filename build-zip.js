import fs from 'fs-extra'
import archiver from 'archiver'

// https://docs.npmjs.com/cli/v6/using-npm/scripts/

// 最新 node 核心包的导入写法
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
// 获取 __filename 的 ESM 写法
// const __filename = fileURLToPath(import.meta.url)
// 获取 __dirname 的 ESM 写法
const __dirname = dirname(fileURLToPath(import.meta.url))

// 设置源目录和目标.zip文件路径
const source = resolve(__dirname, 'dist')
const output = resolve(__dirname, 'dist.zip')

// 创建.zip文件
const archive = archiver('zip', {
  zlib: { level: 9 } // 压缩级别
})

// 监听输出流的'close'事件，当.zip文件创建完成时执行
archive.on('error', function (err) {
  throw err
})

archive.on('end', function () {
  console.log('.zip file has been created')
})

// 打开输出文件，并将文件流pipe到archiver中
let outputStream = fs.createWriteStream(output)
archive.pipe(outputStream)

// 添加文件到.zip中
archive.directory(source, false)

// 完成打包
archive.finalize()
