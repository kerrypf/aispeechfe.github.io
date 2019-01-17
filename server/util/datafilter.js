module.exports = {
  checkResult: (result) => {
    if (result.status == 200) {
      return result.data
    } else {
      return false
    }
  }
}