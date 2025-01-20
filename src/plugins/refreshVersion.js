import path from 'path'
import fs from 'fs'

const writeVersion = async (versionFile, content) => {
  fs.writeFile(versionFile, content, (err) => {
    if (err) throw err
  })
}

export default (options) => {
  // version.json 存储在public目录下
  let configPath
  return {
    name: 'refreshVersion',
    configResolved(resolvedConfig) {
      // version.json路径  ../xhh-mall-project/public
      // console.log('运行环境', resolvedConfig.mode)
      configPath = resolvedConfig.publicDir
    },
    async buildStart() {
      // path.sep \
      const file = configPath + path.sep + 'version.json'
      const content = JSON.stringify({ version: options.version })
      // version.json已存在，修改
      if (fs.existsSync(configPath)) {
        writeVersion(file, content)
      } else {
        // 创建
        fs.mkdir(configPath, (err) => {
          if (err) throw err
          writeVersion(file, content)
        })
      }
    }
  }
}
