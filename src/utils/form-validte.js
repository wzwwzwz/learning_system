/**
 * @description 表单验证
 * @author 巫昭雯
 * @date 2020-07-08 14:24:18
 * @version V1.0
*/
let formValidte = {
  /**
   * @description 表单验证，用户名校验
   * @param { String } str 用户名
   * @returns { Boolean } true || false
   **/
  userName: (rule, value, callback) => {
    let reg = /^[\u4e00-\u9fa5a-zA-Z0-9_-]{3,25}$/
    if (!reg.test(value)) {
      callback(new Error('用户名由3-25位数字/字母/下划线/短横杠组合'))
    } else {
      callback()
    }
  }
}

export default formValidte
