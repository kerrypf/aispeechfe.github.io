const chalk = require("chalk")
const moment = require("moment")
const git = require("simple-git")()
const MarkdownIt = require('markdown-it')

// const temp = require("../temp/temp.json")

const repo = require("./lib/repo")
const file = require("./lib/files")
const github = require("./lib/github")
const template = require("./lib/template")
const { sortByTime } = require("./util/lang")
const { githubconfig } = require('./config/account')

const md = new MarkdownIt()

// var ss = template.layoutDetail('123456', [1,2,3,4], { operator: 'operator', date: '1', name: '1' })
// file.writeFileSync('./11.html', ss)
login().then(async () => {
  console.log(chalk.green('\r\n\r\n\r\n\r\n ========== start =========='))
  job()
  setTimeout(() => {
    console.log(chalk.green('\r\n\r\n\r\n\r\n ========== start =========='))
    job()
  }, 180*1000)
})

async function login() {
  const token = github.getStoredGithubToken()

  if (token) {
    console.log(chalk.green('Authentication already exists~'))
  } else {
    await github.setGithubCredentials()
    await github.registerNewToken()
    console.log(chalk.green('Login succesfully!'));
  }
}

async function job() {
  // 1.拉取最新代码
  await git.pull('origin', 'master')
  // 2.拉取一天内的 commit
  const listdocs = await repo.listCommits(githubconfig.owner, githubconfig.repo, '/docs', moment().subtract(1, 'days').format())
  // 3.检查最后一次处理的commit sha
  const sha = file.readFileSync(`./server/config/commit.txt`).toString()
  // 4.过滤需要处理的commit sha
  const listsha = []
  for (var i = 0; i < listdocs.length; i++) {
    if (listdocs[i].sha == sha)  {
      break
    } else {
      listsha.push(listdocs[i].sha)
    }
  }
  if (listsha.length == 0) {
    console.log(chalk.green(`complete 没有commit更新~time:${new Date()};0 commits;`))
    return
  }
  // 5.拉取commit信息，检查其中变动的file
  const listcommit = [] // temp
  const listfiles = []
  const samecheck = {}
  for (var i = 0; i < listsha.length; i++) {
    const detail = await repo.getCommit(githubconfig.owner, githubconfig.repo, listsha[i])
    listcommit.push({
      sha: detail.sha,
      files: detail.files,
      commit: detail.commit.author
    })
  }
  listcommit.map(_commit => {
    _commit.files.map(_file => {
      if (_file.filename.startsWith('docs/') && _file.filename.endsWith('.md')) {
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
  if (listfiles.length == 0) {
    console.log(chalk.green(`complete 没有文件更新~time:${new Date()};${listcommit.length} commits;0 doc files;`))
    return
  }
  // 6.渲染详情页并且更新结构数据
  const columns =  file.readdirSync('./docs')
  let docsjson = JSON.parse(file.readFileSync(`./server/config/docs.json`).toString())
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
    if (file.existsSync(_file.docspath)) {
      // 新增或者更新文档
      let mdbuff = file.readFileSync(_file.docspath)
      let content = md.render(mdbuff.toString())
      let html = template.layoutDetail(content, columns, _file)
      file.writeFileSync(_file.htmlpath, html)

      // 新增或者更新文档结构
      if (idx == -1) {
        _column.mds.push({
          name: _file.name,
          column: _file.column,
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
  })
  file.writeFileSync(`./server/config/docs.json`, JSON.stringify(docsjson, null, 2))
  // 7.渲染模块页
  columns.map(m => {
    const list = docsjson.find(d => d.name == m).mds
    let html = template.layoutColumn(list, columns, m)
    file.writeFileSync(`./column/${m}.html`, html)
  })
  // 8.渲染首页
  let listall = []
  docsjson.map(m => {
    listall = listall.concat(m.mds)
  })
  sortByTime(listall)
  // console.log(listall)
  let html = template.layoutIndex(listall, columns, 'HOME')
  file.writeFileSync(`./index.html`, html)
  // 9.记录更新的最后一个commit sha
  file.writeFileSync(`./server/config/commit.txt`, listcommit[0].sha)
  // 10.提交
  git.add('./*').commit(`auto build html;time:${new Date()};`).push('origin', 'master')
  console.log(chalk.green(`complete 页面更新完成~time:${new Date()};${listcommit.length} commits;${listfiles.length} doc files;`))
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