const file = require("./files")

module.exports = {
  check: (data, column, name, content) => {
    let info = JSON.parse(file.readFileSync(`./data/docs.json`).toString()) 
    if (data.status == 'removed') {
      const idx = info[column].findIndex(m => m.name == name)
      info[column].splice(idx, 1)
    } else if (data.status == 'added') {
      if (!info[column]) { info[column] = [] }
      console.log(name, column)
      info[column].push({
        name: name,
        createtime: (+new Date()),
        content: content
      })
    } else if (data.status == 'modified') {
      const idx = info[column].findIndex(m => m.name == name)
      info[column][idx].content = content
    } else if (data.status == 'renamed') {
      const prev_name = data.previous_filename.split('/')[2]
      const idx = info[column].findIndex(m => m.name == prev_name)
      console.log(info[column], idx, prev_name)
      info[column][idx].name = name
      info[column][idx].content = content
    }
    console.log(data.filename, info)
    file.writeFileSync(`./data/docs.json`, JSON.stringify(info))
    return info
  }
}