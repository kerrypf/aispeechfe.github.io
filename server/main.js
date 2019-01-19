const commands = require("./commands")
const git = require("./lib/git")
// const git = require("simple-git")()

require('simple-git')()//.pull('origin', 'master')
     // .init()
     .add('./*')
     .commit('111')
    //  .addRemote('origin', 'git@github.com:ge.tang@aispeech.com/aispeechfe.github.io.git')
     .push('origin', 'master');

// commands.login().then(async () => {
//   // await git.init()
//   // const gitclient = git.getInstance()
//   // // await gitclient.pull('origin', 'master')
//   // // job()
//   // gitclient.add('./*').commit('Initial Commit').push('origin', 'master')
// })



// async function job() {
//   const check = await commands.checkbuild()
//   console.log(check)
//   if (check.build) {
//     const detail = await commands.getCommitDetail(check.sha)
//     // console.log(detail)
//     await gitclient.pull('origin', 'master')
//     commands.filebuild(detail.files)
//     git.add('./*').commit('Initial Commit').push('origin', 'master')
//   }
// }
