const chalk = require("chalk")
const moment = require("moment")
const github = require("./github")
const repo = require("./repo")

module.exports = {
  login: async () => {
    const token = github.getStoredGithubToken()

    if (token) {
      console.log(chalk.green('Authentication already exists!'))
      // process.exit();
      return
    }

    await github.setGithubCredentials()
    await github.registerNewToken()

    console.log(chalk.green('Login succesfully!'));
  },
  checkbuild: async () => {
    const listdocs = await repo.listCommits('aispeechfe', 'aispeechfe.github.io', '/docs', moment().subtract(2, 'days').format())
    const listfiles = await repo.listCommits('aispeechfe', 'aispeechfe.github.io', '/files', moment().subtract(2, 'days').format())
    
    const listdocsha = listdocs.map(m => m.sha)
    const listfilessha = listfiles.map(m => m.sha)

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
    const reslut = await repo.getCommit('aispeechfe', 'aispeechfe.github.io', sha)
    return reslut
  }
}