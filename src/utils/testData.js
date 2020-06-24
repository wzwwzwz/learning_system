
var TestData = function () {
  this.resData = []
  this.lsetDate = 0
}

TestData.prototype.getId = function () {
  return new Date().getTime()
}

TestData.prototype.add = function (data) {
  if (JSON.stringify(data) === '{}' || typeof data !== 'object') {
    return false
  }
  let dateNow = this.getId()

  data.id = dateNow

  if (dateNow === this.lsetDate) {
    data.id = dateNow + 12
  }

  this.resData.push(data)
  this.lsetDate = dateNow

  return data
}

TestData.prototype.getData = function () {
  return this.resData
}

TestData.prototype.update = function (obj) {
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

TestData.prototype.delete = function (id) {
  if (typeof id !== 'number') {
    return false
  }

  for (let [idx, item] of this.resData.entries()) {
    if (item) {
      if (item.id === id) {
        // delete this.resData[idx]
        this.resData.splice(idx, 1)
        return true
      }
    }
  }

  return false
}

export default TestData
