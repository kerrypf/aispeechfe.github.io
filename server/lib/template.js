const { TemplateEngine } = require('../util/templateengin')
const file = require("./files")


module.exports = {
  layoutColumn: (list, addrs, title) => {
    let template = file.readFileSync('./layout/index.html')
    return TemplateEngine(template.toString(), {
      list: list,
      title: title,
      addrs: addrs
    })
  },
  layoutDetail: (content, addrs, title) => {
    let template = file.readFileSync('./layout/detail.html')
    return TemplateEngine(template.toString(), {
      content: content,
      title: title,
      addrs: addrs
    })
  }
}