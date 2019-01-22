const commands = require("./commands")
const git = require("simple-git")()
const datastore = require("./lib/datastore")
const file = require("./lib/files")
const template = require("./lib/template")
// commands.filebuild([{
//   filename: 'docs/前端/一个简易的github博客.md'
// }])

// let info = file.readFileSync(`./data/docs.json`)
// console.log(info.toString())

// datastore.check({status: 'added'}, '前端', '112255')

// let html = template.layoutSubject('前端', [ { name: '的等我.md', content: '21313', createtime: 1548083424576 },{ name: '的等我.md', createtime: 1548083424576 },{ name: '的等我.md', createtime: 1548083424576 } ], [])
// file.writeFileSync(`./subject/${'前端'}.html`, html)1
commands.login().then(async () => {
  await git.pull('origin', 'master')
  job()
  setInterval(() => {
    job()
  }, 300*1000);
})



async function job() {
  const check = await commands.checkbuild()
  console.log(check)
  if (check.build) {
    const detail = await commands.getCommitDetail(check.sha)
    console.log(detail)
    await git.pull('origin', 'master')
    commands.filebuild(detail.files)
    // git.add('./*').commit('Initial Commit').push('origin', 'master')
  }
}
