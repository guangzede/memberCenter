const obj = {}

obj.putLocalStorage = function(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

obj.getLocalStorage = function(key) {
  // if (key !== 'state') {
  //   return JSON.parse(window.localStorage)
  // }
  var obj = window.localStorage.getItem(key)
  if (obj && obj !== undefined && obj !== null) {
    return JSON.parse(obj)
  }
  return false
}

obj.removeLocalStorage = function(key) {
  if (key) {
    window.localStorage.removeItem(key)
  } else {
    console.log(arguments)
    for (var i in arguments) {
      window.localStorage.removeItem(arguments[i])
    }
  }
}

export default obj
