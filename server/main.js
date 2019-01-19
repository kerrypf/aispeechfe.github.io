const commands = require("./commands")
const git = require("simple-git")()


commands.filebuild([{
  filename: 'docs/前端/一个简易的github博客.md'
}])

// commands.login().then(async () => {
//   await git.pull('origin', 'master')
//   job()
//   setInterval(() => {
//     job()
//   }, 300*1000);
// })



async function job() {
  const check = await commands.checkbuild()
  console.log(check)
  if (check.build) {
    const detail = await commands.getCommitDetail(check.sha)
    // console.log(detail)
    await git.pull('origin', 'master')
    commands.filebuild(detail.files)
    git.add('./*').commit('Initial Commit').push('origin', 'master')
  }
}
