const commands = require("./commands")
const git = require("./lib/git")

commands.login().then(async () => {
  // await git.init()
  const gitclient = git.getInstance()
  // await gitclient.pull('origin', 'master')
  // job()
  // gitclient.add('./*').commit('Initial Commit').push('origin', 'master')
  gitclient.init()
     .add('./*')
     .commit("first commit!")
     .addRemote('origin', 'https://github.com/aispeechfe/aispeechfe.github.io.git')
     .push('origin', 'master');
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
