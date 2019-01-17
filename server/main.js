// const inquirer = require("./lib/inquirer")
const commands = require("./lib/commands")
const octokit = require('@octokit/rest')()
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

commands.login()
job()

async function job() {
  const check = await commands.checkbuild()
  if (check.build) {
    const detail = await commands.getCommitDetail(check.sha)
    // detail.files
  }
}