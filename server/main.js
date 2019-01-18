const git = require("simple-git")()
const commands = require("./commands")

 

commands.login()
job()

 


async function job() {
  const check = await commands.checkbuild()
  // console.log(check)
  if (check.build) {
    const detail = await commands.getCommitDetail(check.sha)
    // console.log(detail)
    await git.pull('origin', 'master')
    commands.filebuild(detail.files)
    // git.add('./*').commit('Initial Commit').push('origin', 'master')
  }
}
