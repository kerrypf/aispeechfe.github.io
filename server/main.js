// const inquirer = require("./lib/inquirer")
const commands = require("./lib/commands")
const git = require("simple-git")()
const file = require('./lib/files')
const MarkdownIt = require('markdown-it')

const md = new MarkdownIt()
// const chalk = require("chalk")



// Compare: https://developer.github.com/v3/repos/#list-organization-repositories
// octokit.repos.listForOrg({
//   org: 'ElemeFE',
//   type: 'public',
//   per_page: '1'
// }).then(({ data, headers, status }) => {
//   // handle data
//   console.log(data)
// })

// octokit.repos.listForUser({username: "aispeechfe"}).then(result => {
//   console.log(result)
// })

// octokit.repos.getCommit({owner: 'aispeechfe', repo: 'aispeechfe.github.io', sha: 'a16d40018a148bb9677d581f4b8bfdad49ba93be'}).then(result => {
//   console.log(result.data)
// })

// octokit.authenticate({
//   type: 'token',
//   token: 'afcfae64813f2fa244db8f8fe5b862b1ba02cad6'
// })

// octokit.repos.createFile({
//   owner: 'aispeechfe',
//   repo: 'aispeechfe.github.io',
//   path: 'test.txt',
//   message: 'test commit add .',
//   content: 'bXkgbmV3IGZpbGUgY29udGVudHM=',
//   committer: {
//     name: 'ge.tang@aispeech.com',
//     email: 'ge.tang@aispeech.com'
//   },
//   author: {
//     name: 'ge.tang@aispeech.com',
//     email: 'ge.tang@aispeech.com'
//   }
// }).then(result => {
//   console.log(result)
// })

// inquirer.askGithubCredentials()
// console.log(1)
// console.log(chalk.red('Authentication already exists!'))

// commands.login()
// job()


// const rootpath = file.getCurrentDirectoryBase()
// file.removefile('1.txt')

// console.log( file.readFileSync('./docs/other/test.2.md'))

// filemange([{
//   filename: 'docs/other/test.1.md',
//   status: 'removed'
// }, {
//   filename: 'docs/other/test.2.md',
//   status: 'added'
// }])

// setInterval(() => {
//   job()
// }, 60*5)

git.add('./*').commit('Initial Commit')//.addRemote('origin', url).push('origin', 'master')

async function job() {
  const check = await commands.checkbuild()
  if (check.build) {
    const detail = await commands.getCommitDetail(check.sha)
    await git.pull('origin', 'master')
    filemange(detail.files)
    git.commit('Initial Commit').addRemote('origin', url).push('origin', 'master')
  }
}

function filemange(files) {
  files.map(m => {
    m.htmlfilename = m.filename.replace('docs', './files').replace('.md', '.html')
    if (m.status == 'removed') {
      file.removefile(m.htmlfilename)
    } else {
      file.removefile(m.htmlfilename)
      let data = file.readFileSync(m.filename.replace('docs', './docs'))
      let content = md.render(data.toString())
      let html = layout(content)
      file.writeFileSync(m.htmlfilename, html)
    }
  })
}

function layout(content) {
  return content
}