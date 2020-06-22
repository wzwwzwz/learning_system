
var TestDate = function () {
  this.resData = []
}

TestDate.prototype.getId = function () {
  return new Date().getTime()
}

TestDate.prototype.add = function (data) {
  if (JSON.stringify(data) === '{}' || typeof data !== 'object') {
    return false
  }
  data.id = this.getId()
  this.resData.push(data)
  return data
}

TestDate.prototype.getData = function () {
  return this.resData
}

TestDate.prototype.update = function (obj) {
  if (typeof obj !== 'object') {
    return false
  }

  for (let [idx, item] of this.resData.entries()) {
    if (item) {
      if (item.id === obj.id) {
        this.resData.splice(idx, 1, obj)
        break
      }
    }
  }
}

TestDate.prototype.delete = function (id) {
  if (typeof id !== 'number') {
    return false
  }

  for (let [idx, item] of this.resData.entries()) {
    if (item) {
      if (item.id === id) {
        delete this.resData[idx]
        return true
      }
    }
  }

  return false
}

export default TestDate
