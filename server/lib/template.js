const { TemplateEngine } = require('../util/templateengin')

module.exports = {
  layoutSubject: (list, addrs) => {
    let template = file.readFileSync('./layout/index.html')
    return TemplateEngine(template.toString(), {
      list: list,
      title: '111',
      addrs: addrs
    })
  },
  layoutDetail: (content, addrs) => {
    let template = file.readFileSync('./layout/detail.html')
    return TemplateEngine(template.toString(), {
      content: content,
      title: '111',
      addrs: addrs
    })
  }
}