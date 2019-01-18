const git = require("simple-git")()
const { githubconfig } = require('../config/account')
const inquirer = require("./inquirer")

module.exports = {
  init: async () => {
    const credentials = await inquirer.askGitPwd()
    git.addConfig('user.name', githubconfig.userName)
    .addConfig('user.email', githubconfig.userName)
    // .addRemote('origin', `https://${githubconfig.userName}:${credentials.password}@github.com/${githubconfig.userName}/${githubconfig.repo}`)
  },
  getInstance: () => {
    return git
  }
}
