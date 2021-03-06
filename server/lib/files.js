const fs = require("fs")
const path = require("path")
const chalk = require("chalk")

module.exports = {
  removefile: path => {
    try {
      fs.unlinkSync(path)
    } catch(err) {
      console.log(chalk.yellow(`err:${path} 路径不存在`))
    }
  },
  readFileSync: path => {
    return fs.readFileSync(path)
  },
  writeFileSync: (path, content) => {
    const paths = path.split('/')
    const pathdir = path.replace(`/${paths[paths.length - 1]}`,'')
    const haspath = fs.existsSync(pathdir)
    if (!haspath) {
      fs.mkdirSync(pathdir)
    }
    return fs.writeFileSync(path, content)
  },
  readdirSync: (path) => {
    return fs.readdirSync(path)
  },
  existsSync: (path) => {
    return fs.existsSync(path)
  }
}