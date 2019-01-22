module.exports = {
  unique: (array) => {
    return array.filter(function(item, index, array){
      return array.indexOf(item) === index;
    })
  },
  sortByTime: (list) => {
    list.sort(function(a, b){
      var keyA = new Date(a.createtime),
          keyB = new Date(b.createtime);
      // Compare the 2 dates
      if(keyA < keyB) return -1;
      if(keyA > keyB) return 1;
      return 0;
   })
  }
}