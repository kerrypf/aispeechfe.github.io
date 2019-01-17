const gh = require("./github")
const { checkResult } = require("../util/datafilter")

const github = gh.getInstance()

module.exports = {
  getCommit: async (owner, repo, sha) => {
    const result = await github.repos.getCommit({
      owner: owner, 
      repo: repo,
      sha: sha
    })
    return checkResult(result)
  },
  // Returns the last year of commit activity grouped by week 
  listCommits: async (owner, repo, path, since) => {
    const result = await github.repos.listCommits({
      owner: owner, 
      repo: repo,
      path: path,
      since: since
    })
    return checkResult(result)
  }
}