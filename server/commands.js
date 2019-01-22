const chalk = require("chalk")
const moment = require("moment")
const MarkdownIt = require('markdown-it')
const github = require("./lib/github")
const file = require("./lib/files")
const repo = require("./lib/repo")
const datastore = require("./lib/datastore")
const template = require("./lib/template")
const { unique } = require("./util/lang")
const { githubconfig } = require('./config/account')

const md = new MarkdownIt()

module.exports = {
  login: async () => {
    const token = github.getStoredGithubToken()

    if (token) {
      console.log(chalk.green('Authentication already exists~'))
      // process.exit();
      return
    }

    await github.setGithubCredentials()
    await github.registerNewToken()

    console.log(chalk.green('Login succesfully!'));
  },
  // 如果 后面请求多了，可以改用 webhook+rbmq 
  checkcommit: async () => {
    // const listdocs = await repo.listCommits(githubconfig.owner, githubconfig.repo, '/docs', moment().subtract(1, 'days').format())
    // const listfiles = await repo.listCommits(githubconfig.owner, githubconfig.repo, '/files', moment().subtract(1, 'days').format())
    // const sha = datastore.checklastcommit()
    // const listsha = []
    // const listcommit = []
    let listbuild = []

    // console.log(listdocs)
    // for (var i = 0; i < listdocs.length; i++) {
    //   if (listdocs[i].sha == sha)  {
    //     break
    //   } else {
    //     listsha.push(listdocs[i].sha)
    //   }
    // }
    // // console.log("list", list)
    // for (var i = 0; i < listsha.length; i++) {
    //   // console.log(list[i])
    //   const detail = await repo.getCommit(githubconfig.owner, githubconfig.repo, listsha[i])
    //   listcommit.push(detail)
    // }
    // console.log(listcommit)
    // listcommit.map(m => {
    //   m.files.map(f => {
    //     // const info = f.filename.split('/')
    //     // const column = info[1]
    //     // const title = info[2].replace('.md', '')

    //     // if (f.status == 'added') {

    //     // }
    //     if (f.filename.startsWith('docs/')) {
    //       listbuild.push(f.filename)
    //     }
    //   })
    // })

    // listbuild = unique(listbuild)
    // listbuild.sort()
    listbuild = [ 
    'docs/前端/1122',
    'docs/前端/mmmd11.md',
    'docs/前端/mmmd.md',
    'docs/前端/mmm.md',
    'docs/前端/的等我.md' ]

    const addrs =  file.readdirSync('./docs')
    addrs.unshift('index')

    // console.log("listdocs", listbuild)
    let docsconfig = JSON.parse(file.readFileSync(`./server/config/docs.json`).toString())

    let column = ''
    let columnDir = []
    for (var i = 0; i < listbuild.length; i++) {
      console.log("listbuild[i]", listbuild[i])
      const info = listbuild[i].split('/')
      let name = info[2]
      if (column != info[1]) {
        column = info[1]
        columnDir = file.readdirSync(`./docs/${column}`)
      }
      console.log("columnDir", columnDir)
      const htmlpath = `./files/${column}/${name.replace('.md', '.html')}`
      file.removefile(htmlpath)

      if (!docsconfig[column]) {
        docsconfig[column] = []
      }
      const idx = docsconfig[column].findIndex(m => m.name == name)

      if (columnDir.indexOf(name) > -1) {
        let data = file.readFileSync(`./${listbuild[i]}`)
        let content = md.render(data.toString())

        // 生成详情页
        let html = template.layoutDetail(content, addrs, name.replace('.md', ''))
        file.writeFileSync(htmlpath, html)

        
        docsconfig[column][idx].content = content
      } else {
        docsconfig[column].splice(idx, 1)
      }
    }

    file.writeFileSync(`./server/config/docs.json`, JSON.stringify(info, null, 2))




    // const listdocsha = listdocs.map(m => m.sha)
    // const listfilessha = listfiles.map(m => m.sha)
    // if (listdocsha.length > 0) {
    //   const sha = listdocsha[0]
    //   const hasbuild = listfilessha.find(m => m == sha) 
    //   if (!hasbuild) {
    //     return {
    //       build: true,
    //       sha: sha
    //     }
    //   }
    // }
    // return {
    //   build: false
    // }
  },
  getCommitDetail: async (sha) => {
    const reslut = await repo.getCommit(githubconfig.owner, githubconfig.repo, sha)
    return reslut
  },
  filebuild: (files) => {
    // 1. 读取目录
    const addrs =  file.readdirSync('./docs')
    addrs.unshift('index')
    console.log(1)
    // 2. 生成详情页静态文件
    files.map(m => {
      const info = m.filename.split('/')
      const column = info[1]
      const title = info[2].replace('.md', '')
      
      m.htmlfilename = `./files/${column}/${title}.html`
      
      file.removefile(m.htmlfilename)
      if (m.status == 'removed') {
        datastore.check(m, column)
      } else if (m.status == 'renamed') {
        let data = file.readFileSync(`./${m.filename}`)
        let content = md.render(data.toString())

        datastore.check(m, column, info[2], content.substring(0, 100))
      } else {
        let data = file.readFileSync(`./${m.filename}`)
        let content = md.render(data.toString())

        datastore.check(m, column, info[2], content.substring(0, 100))

        let html = template.layoutDetail(content, addrs, title)
        
        file.writeFileSync(m.htmlfilename, html)
      }
    })
    
    console.log(2)
    // 3.生成主题页静态文件
    const subjects =  file.readdirSync('./files')
    // console.log(subjects)
    const docsdata = JSON.parse(file.readFileSync(`./server/config/docs.json`).toString()) 
    subjects.map(m => {
      if (m == '.DS_Store') { return }
      console.log(2, m)
      // let list = file.readdirSync(`./files/${m}`)
      let html = template.layoutSubject(m, docsdata[m], addrs)
      file.writeFileSync(`./subject/${m}.html`, html)
    })
    
    console.log(3)
    // 4.生成首页静态文件
    // let html = template.layoutSubject([], addrs)
    // file.writeFileSync(`./index.html`, html)
  }
}