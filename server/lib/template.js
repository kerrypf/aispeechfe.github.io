const TemplateEngine = require('art-template')
const file = require("./files")


module.exports = {
  layoutIndex: (list, addrs, title) => {
    let template = file.readFileSync('./layout/index.html')
    return TemplateEngine.render(template.toString(), {
      list: list,
      title: title,
      addrs: addrs
    })
  },
  layoutColumn: (list, addrs, title) => {
    let template = file.readFileSync('./layout/column.html')
    return TemplateEngine.render(template.toString(), {
      list: list,
      title: title,
      addrs: addrs
    })
  },
  layoutDetail: (content, addrs, fileinfo) => {
    let template = file.readFileSync('./layout/detail.html')
    return TemplateEngine.render(template.toString(), {
      content: content,
      addrs: addrs,
      file: fileinfo
    })
  }
}