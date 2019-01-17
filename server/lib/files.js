const fs = require("fs")
const path = require("path")

module.exports = {
  getCurrentDirectoryBase: () => {
    return path.basename(process.cwd())
  },
  directoryExits: filePath => {
    try {
      return fs.statSync(filePath).isDirectory();
    } catch (err) {
      return false
    }
  },
  removefile: path => {
    fs.unlinkSync(path)
  },
  readFileSync: path => {
    return fs.readFileSync(path)
  },
  writeFileSync: (path, content) => {
    return fs.writeFileSync(path, content)
  }
}