/**
 * @description 表单验证
 * @author WZW
 * @date 2020-07-08 14:24:18
 * @version V1.0
*/
let formValidte = {
  isEmpty: (rule, value, callback) => {
    if (value.trim() === '') {
      callback(new Error('不能为空格'))
      return false
    }

    callback()
  },
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
  },
  email: (rule, value, callback) => {
    let reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
    if (!reg.test(value)) {
      callback(new Error('邮箱格式错误!'))
    } else {
      callback()
    }
  },
  phone: function (rule, value, callback) {
    var reg = /^1[3456789]\d{9}$/
    if (!reg.test(value)) {
      callback && callback(new Error('请输入正确的手机号码'))
    } else {
      callback && callback()
    }
  }

}

export default formValidte
