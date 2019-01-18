const git = require("simple-git")()
const { githubconfig } = require('../config/account')
const inquirer = require("./inquirer")

module.exports = {
  init: async () => {
    const credentials = await inquirer.askGitPwd()
    git.addConfig('user.name', githubconfig.userName)
    .addConfig('user.email', githubconfig.userName)
    .removeRemote('origin')
    // .addRemote('origin', `https://${githubconfig.owner}:${credentials.password}@github.com/${githubconfig.userName}/${githubconfig.repo}`)
    .addRemote('origin', `https://github.com/aispeechfe/aispeechfe.github.io.git`)
  },
  getInstance: () => {
    return git
  }
}
