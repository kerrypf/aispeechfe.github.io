const commands = require("./commands")
const git = require("simple-git")()

commands.login().then(async () => {
  await git.pull('origin', 'master')
  job()
  git.add('./*').commit('Initial Commit').push('origin', 'master')
})



async function job() {
  const check = await commands.checkbuild()
  console.log(check)
  if (check.build) {
    const detail = await commands.getCommitDetail(check.sha)
    // console.log(detail)
    await gitclient.pull('origin', 'master')
    commands.filebuild(detail.files)
    git.add('./*').commit('Initial Commit').push('origin', 'master')
  }
}
