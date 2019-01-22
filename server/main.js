const commands = require("./commands")
const git = require("simple-git")()
const datastore = require("./lib/datastore")
const file = require("./lib/files")
const template = require("./lib/template")
const { githubconfig } = require('./config/account')
const moment = require("moment")
const repo = require("./lib/repo")
const temp = require("./config/temp.json")
const { sortByTime } = require("./util/lang")
const MarkdownIt = require('markdown-it')

const md = new MarkdownIt()
// commands.filebuild([{
//   filename: 'docs/前端/一个简易的github博客.md'
// }])

// let info = file.readFileSync(`./server/config/docs.json`)
// console.log(info.toString())

// datastore.check({status: 'added'}, '前端', '112255')

// let html = template.layoutSubject('前端', [ { name: '的等我.md', content: '21313', createtime: 1548083424576 },{ name: '的等我.md', createtime: 1548083424576 },{ name: '的等我.md', createtime: 1548083424576 } ], [])
// file.writeFileSync(`./subject/${'前端'}.html`, html)1111
// git.add('./*').commit('Initial Commit').push('origin', 'master')

// let info = JSON.parse(file.readFileSync(`./server/config/docs.json`).toString())
// file.writeFileSync(`./server/config/docs.json`, JSON.stringify(info, null, 2))






job()

// commands.login().then(async () => {
//   // await git.pull('origin', 'master')
//   job()
//   // setInterval(() => {
//   //   job()
//   // }, 300*1000);
// })



async function job() {
  // // 1.拉取最新代码
  // await git.pull('origin', 'master')
  // // 2.拉取一天内的 commit
  // const listdocs = await repo.listCommits(githubconfig.owner, githubconfig.repo, '/docs', moment().subtract(1, 'days').format())
  // // 3.检查最后一次处理的commit sha
  // const sha = file.readFileSync(`./server/config/commit.txt`).toString()
  // // 4.过滤需要处理的commit sha
  // const listsha = []
  // for (var i = 0; i < listdocs.length; i++) {
  //   if (listdocs[i].sha == sha)  {
  //     break
  //   } else {
  //     listsha.push(listdocs[i].sha)
  //   }
  // }
  // 5.拉取commit信息，检查其中变动的file
  const listcommit = temp // []
  const listfiles = []
  const samecheck = {}
  // for (var i = 0; i < listsha.length; i++) {
  //   const detail = await repo.getCommit(githubconfig.owner, githubconfig.repo, listsha[i])
  //   listcommit.push({
  //     sha: detail.sha,
  //     files: detail.files,
  //     commit: detail.commit.author
  //   })
  // }
  listcommit.map(_commit => {
    _commit.files.map(_file => {
      if (_file.filename.startsWith('docs/')) {
        if (_file.status == 'renamed') {
          if (samecheck[_file.previous_filename]) { return }
          listfiles.push(initfile(_commit, _file, _file.previous_filename))
          samecheck[_file.previous_filename] = true
        }
        if (samecheck[_file.filename]) { return }
        listfiles.push(initfile(_commit, _file, _file.filename))
        samecheck[_file.filename] = true
      }
    })
  })
  // console.log("listfiles", listfiles)
  // 6.渲染详情页并且更新结构数据
  const columns =  file.readdirSync('./docs')
  let docsjson = JSON.parse(file.readFileSync(`./server/config/docs.json`).toString())
  // columns.unshift('index')
  listfiles.map(_file => {
    // 读取文档结构数据
    let _column = docsjson.find(m => m.name == _file.column)
    if (!_column) {
      _column = {
        name: _file.column,
        mds: []
      }
    }
    const idx = _column.mds.findIndex(m => m.name == _file.name)
    // console.log(idx, _column)
    if (file.existsSync(_file.docspath)) {
      // 新增或者更新文档
      let mdbuff = file.readFileSync(_file.docspath)
      let content = md.render(mdbuff.toString())
      let html = template.layoutDetail(content, columns, _file.name)
      file.writeFileSync(_file.htmlpath, html)

      // 新增或者更新文档结构
      if (idx == -1) {
        _column.mds.push({
          name: _file.name,
          createtime: _file.date,
          content: content.substring(0, 200),
          operator: _file.operator
        })
      } else {
        _column.mds[idx].content = content.substring(0, 200)
      }
    } else {
      // 删除文档
      file.removefile(_file.htmlpath)

      // 删除结构
      if (idx != -1) {
        _column.mds.splice(idx, 1)
      }
    }
    // console.log("_column",  _column)
  })
  // console.log("docsjson", JSON.stringify( docsjson, null, 2))
  file.writeFileSync(`./server/config/docs.json`, JSON.stringify(docsjson, null, 2))
  // 7.渲染模块页
  columns.map(m => {
    const list = docsjson.find(d => d.name == m).mds
    let html = template.layoutColumn(list, columns, m)
    file.writeFileSync(`./subject/${m}.html`, html)
  })
  // 8.渲染首页
  const listall = []
  docsjson.map(m => {
    listall.concat(m.mds)
  })
  sortByTime(listall)
  let html = template.layoutIndex(listall, ['HOME'].concat(columns), 'HOME')
  file.writeFileSync(`./index.html`, html)
}


function initfile(commit, file, docspath) {
  const fileinfo = docspath.split('/')
  return {
    column: fileinfo[1],
    name: fileinfo[2].replace('.md', ''),
    docspath: docspath,
    htmlpath: `./files/${fileinfo[1]}/${fileinfo[2].replace('.md', '.html')}`,
    status: file.status,
    operator: commit.commit.name,
    date: commit.commit.date,
    email: commit.commit.email
  }
}