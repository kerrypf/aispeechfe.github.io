var inquirer = require("inquirer")

module.exports = {
  askGithubCredentials: () => {
    const questions = [{
      name: 'username',
      type: 'input',
      message: 'Enter your Github username or e-mail address:',
      validate: value => {
        if (value.length) {
          return true;
        } else {
          return 'Please enter your username or e-maiil address:'
        }
      }
    }, {
      name: 'password',
      type: 'password',
      message: 'Enter your password:',
      validate: value => {
        if (value.length) {
          return true;
        } else {
          return 'Please enter your password'
        }
      }
    }]

    return inquirer.prompt(questions)
  },
  askGitPwd: () => {
    const questions = [{
      name: 'password',
      type: 'password',
      message: 'Enter your password:',
      validate: value => {
        if (value.length) {
          return true;
        } else {
          return 'Please enter your password'
        }
      }
    }]

    return inquirer.prompt(questions)
  }
}