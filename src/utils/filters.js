
/**
 * @description 全局过滤 || 格式化函数
 * @author WZW
 * @date 2020-07-03 15:46:38
 * @version V1.0
*/

/**
 * @functionName formatBooleanVal
 * @description  布尔值转换
 * @param { Boolean } 参数1
 * @return { String } true === "正确" | false === "错误"
 * @author WZW
 * @date 2020-07-03 15:47:02
 * @version V1.0
*/
exports.formatBooleanVal = function (val) {
  if (typeof val !== 'boolean') {
    return val
  }

  if (val) {
    return '正确'
  } else {
    return '错误'
  }
}

exports.trim = function (val) {
  return val.replace(/(^\s*)|(\s*$)/g, '')
}
