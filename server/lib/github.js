var octokit = require("@octokit/rest")()
var configstore = require("configstore")
// var pkg = require("./package.json");
// var _ = require("lodash");
var cli = require("clui")
var Spinner = cli.Spinner
var chalk = require("chalk")

var inquirer = require("./inquirer")

var conf = new configstore();

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
  },

  githubAuth: token => {
    octokit.authenticate({
      type: 'oauth',
      token: token
    });
  },

  logout: id => {
      const status = new Spinner('Logout you, please wait', ['⣾','⣽','⣻','⢿','⡿','⣟','⣯','⣷']);
      status.start();

      octokit.authorization.delete({id})
          .then(result => {
              conf.set('github.token', '');
              conf.set('github.id', '');

              console.log(chalk.green('Logout succesfully'));
              status.stop();
          })
          .catch(err => {
              console.log(chalk.red('Error with logout'), err);
              status.stop();
          });
  }
}