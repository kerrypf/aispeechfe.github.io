const chalk = require("chalk")
const moment = require("moment")
const MarkdownIt = require('markdown-it')
const github = require("./lib/github")
const file = require("./lib/files")
const repo = require("./lib/repo")
const template = require("./lib/template")
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
  checkbuild: async () => {
    const listdocs = await repo.listCommits(githubconfig.owner, githubconfig.repo, '/docs', moment().subtract(1, 'days').format())
    const listfiles = await repo.listCommits(githubconfig.owner, githubconfig.repo, '/files', moment().subtract(1, 'days').format())
    
    const listdocsha = listdocs.map(m => m.sha)
    const listfilessha = listfiles.map(m => m.sha)
    console.log(listdocsha, listfilessha)
    if (listdocsha.length > 0) {
      const sha = listdocsha[0]
      const hasbuild = listfilessha.find(m => m == sha) 
      if (!hasbuild) {
        return {
          build: true,
          sha: sha
        }
      }
    }
    return {
      build: false
    }
  },
  getCommitDetail: async (sha) => {
    const reslut = await repo.getCommit(githubconfig.owner, githubconfig.repo, sha)
    return reslut
  },
  filebuild: (files) => {
    // 1. 读取目录
    const addrs =  file.readdirSync('./docs')
    addrs.unshift('index')

    // 2. 生成详情页静态文件
    files.map(m => {
      m.htmlfilename = m.filename.replace('docs', './files').replace('.md', '.html')
      if (m.status == 'removed') {
        file.removefile(m.htmlfilename)
      } else {
        file.removefile(m.htmlfilename)
        let data = file.readFileSync(m.filename.replace('docs', './docs'))
        let content = md.render(data.toString())
        let html = template.layoutDetail(content, addrs)
        file.writeFileSync(m.htmlfilename, html)
      }
    })

    // 3.生成主题页静态文件
    const subjects =  file.readdirSync('./files')
    subjects.map(m => {
      let list = file.readdirSync(`./files/${m}`)
      let html = template.layoutSubject(list, addrs)
      let path = (m == 'index' ? './':'./subject/')+`${m}.html`
      console.log(path)
      file.writeFileSync(path, html)
      console.log(1)
    })
  }
}