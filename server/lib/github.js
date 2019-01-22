const octokit = require("@octokit/rest")()
const configstore = require("configstore")
const cli = require("clui")
const Spinner = cli.Spinner
const chalk = require("chalk")
const inquirer = require("./inquirer")

const conf = new configstore()

module.exports = {
  getInstance: () => {
    return octokit;
  },

  getStoredGithubToken: () => {
    return conf.get('github.token')
  },

  getStoredGithubId: () => {
    return conf.get('github.id');
  },

  setGithubCredentials: async () => {
    const credentials = await inquirer.askGithubCredentials()
    const authenticate = Object.assign(credentials, { type: 'basic' })

    octokit.authenticate(authenticate)
  },

  registerNewToken: async () => {
    const status = new Spinner('Authenticating you, please wait', ['⣾','⣽','⣻','⢿','⡿','⣟','⣯','⣷'])
    status.start()

    await octokit.authorization.createAuthorization({
      scopes: ['public_repo'],
      note: 'get token test'
    }).then(response => {
      status.message('Founding token, please wait')
      
      if (response.data.token) {
        conf.set('github.token', response.data.token)
        conf.set('github.id', response.data.id)

        console.log(chalk.yellow('Token and ID stored!'))
        status.stop()
      } else {
        throw new Error("Missing Token", "Github token was not found in the response")
      }
    }).catch(err => {
      console.log('Error with the authentication', err)
      status.stop()
    })
  }
}