/**
 * @description 此文件用于处理后台数据
 * @author WZW
 * @date 2020-07-15 17:34:39
 * @version V1.0
*/
import store from '@/store/index.js'
import * as check from './validate'
import { encrypt, decrypt } from '@/utils/encryption'

/********************************************************************
* @description 构造参数格式明
* @class Parameter
* @author WZW
* @constructor
* @param { String } rqsName 请求名
*******************************************************************/
class Parameter {
  constructor (rqsName = '') {
    this._FUNC = rqsName
    this._USER = store.state.userInfo.userName
    this._PARAMS = []
    this._CODE = null
    // 解密数据
    this._DECRYPTDATA = ''
  }

  /**
   * @description 设置方法名
   * @method setFunc
   * @for Parameter
   * @param { String } rqsName 请求名
   * @return { Boolean } false === 格式错误
  **/
  setFunc (rqsName) {
    if (!check.isString(rqsName)) {
      return false
    }
    this._FUNC = rqsName
  }

  /**
   * @description 设置字串参数(数组内的对象属性幻化为大写)
   * @method setParams
   * @for Parameter
   * @param { String } rqsName 请求名
   * @return { Boolean } false === 格式错误
  **/
  setParams (obj) {
    if (!check.isObject(obj)) {
      return false
    }

    let newObj = {}

    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key.toLocaleUpperCase()] = obj[key]
      }
    }

    this._PARAMS.push(newObj)
  }

  /**
   * @description 获取参数json串
   * @method getJson
   * @for Parameter
   * @return { Object } 参数字串(对象)
  **/
  getJson () {
    return {
      FUNC: this._FUNC,
      USER: this._USER,
      PARAMS: this._PARAMS
    }
  }

  /**
   * @description 获取加密后的json串
   * @method getEncryptData
   * @for Parameter
   * @return { Object } 加密后的json串
  **/
  getEncryptData () {
    let str = JSON.stringify({
      FUNC: this._FUNC,
      USER: this._USER,
      PARAMS: this._PARAMS
    })

    return encrypt(str)
  }

  /**
   * @description 设置Json字串
   * @method setJson
   * @for Parameter
   * @param { Object }  obj 设置json串的对象
   * @return { Boolean } 成功与否
  **/
  setJson (obj) {
    if (!check.isObject(obj)) {
      return false
    }

    this._FUNC = obj.FUNC
    this._USER = obj.USER
    this._PARAMS = obj.PARAMS
    this._CODE = obj.CODE

    return true
  }

  /**
   * @description 设置加密数据
   * @method setDecryptData
   * @for Parameter
   * @param { String }  str参数名 加密后的字符串
   * @return { Boolean } false === 设置不成功
  **/
  setDecryptData (str) {
    if (!check.isString(str)) {
      return false
    }

    this._DECRYPTDATA = str

    if (str.trim() === '') {
      return false
    }

    let arr = []
    try {
      arr = JSON.parse(decrypt(str))
    } catch (error) {
      return false
    }

    this._FUNC = arr.FUNC
    this._USER = arr.USER
    this._PARAMS = arr.PARAMS

    return true
  }

  /**
   * @description 获取json字串的Params属性值
   * @method getParams
   * @for Parameter
   * @return { Array } Params的数组(对象属性转化为小写)
  **/
  getParams () {
    let res = []
    let arr = this._PARAMS

    for (let [idx, obj] of arr.entries()) {
      let newObj = {}
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          // console.log(idx, obj)
          newObj[key.toLocaleLowerCase()] = obj[key]
        }
      }
      res[idx] = newObj
    }

    return res
  }

  /**
   * @description 获取函数名
   * @method getFunc
   * @for Parameter
   * @return { String } 函数名
  **/
  getFunc () {
    return this._FUNC
  }

  /**
   * @description 获取用户key
   * @method getUser
   * @for Parameter
   * @return { String } 用户key
  **/
  getUser () {
    return this._USER
  }

  /**
   * @description 获取返回码
   * @method getCode
   * @for Parameter
   * @return { Number } 返回值说明
  **/
  getCode () {
    return this._CODE
  }

  /**
   * @description 清空数据
   * @method clear
   * @for Parameter
  **/
  clear () {
    this._FUNC = ''
    this._USER = store.state.userInfo.userName
    this._PARAMS = []
    this._CODE = null
  }
}

/********************************************************************
 * @description 格式化下拉框选项
 * @class FormatOption
 * @author WZW
 * @constructor
 * @param { String } nodes constructor的参数
*******************************************************************/
class FormatOption {
  constructor () {
    this._keyName = 'key'
    this._valueName = 'value'
    this._defaultSeparator = '<br/>'
    this._mode = true
  }

  /**
   * @description 设置分隔符
   * @method setSeparator
   * @for FormatOption
   * @param { String } str 分隔符字符串
   * @return { Boolean } 格式错误
  **/
  setSeparator (str) {
    if (!check.isString(str)) {
      return false
    }

    this._defaultSeparator = str
  }

  /**
   * @description 设置数组内的项的模式（默认为键值对模式 === true）
   * @method setItemMode
   * @for FormatOption
   * @param { Boolean } type 键值对模式 === true || false === 单独的项模式
   * @return { 返回值类型 } 返回值说明
  **/
  setItemMode (type) {
    if (!check.isBoolean(type)) {
      return false
    }

    this._mode = type
  }

  /**
   * @description 设置转化的每一项的键值名称 (默认键值名称为:key value)
   * @method setItemKeyValue
   * @for FormatOption
   * @param { String } keyName 转化对象的key名称
   * @param { String } valueName 转化对象的value名称
   * @return { Boolean } 格式错误
  **/
  setItemKeyValue (keyName, valueName) {
    if (!check.isString(keyName) || !check.isString(valueName)) {
      return false
    }

    this._keyName = keyName
    this._valueName = valueName
  }

  /**
   * @description 将选项转化为数组
   * @method toStr
   * @for FormatOption
   * @param { 参数类型 } 参数名 参数说明
   * @return { 返回值类型 } 返回值说明
  **/
  toArr (str) {
    if (!check.isString(str)) {
      return false
    }

    let arr = []

    if (str.indexOf(this._defaultSeparator) !== -1) {
      str.split(this._defaultSeparator).forEach((item, idx) => {
        let data = item

        if (this._mode) {
          data = {
            [this._keyName]: String.fromCharCode(65 + idx),
            [this._valueName]: item
          }
        }

        arr.push(data)
        // console.log(item, idx)
      }, this)
      return arr
    }
  }

  /**
   * @description 将选项转化为字符串
   * @method toStr
   * @for FormatOption
   * @param { Array } arr 选项数组
   * @param { String } keyName 选项内单条数据的key名称
   * @param { String } delimiter 分割符 默认分割符为 '<br/>'
   * @return { String } 返回转化后的字符串 || false
  **/
  toStr (arr) {
    if (!check.isArray(arr)) {
      return false
    }

    let str = ''
    for (let item of arr.values()) {
      // console.log(item)
      if (this._mode) {
        str += `${this._defaultSeparator}${item[this._valueName]}`
      } else {
        str += `${this._defaultSeparator}${item}`
      }
    }

    let first = str.indexOf(this._defaultSeparator)
    if (first !== -1) {
      return str.substring(first + this._defaultSeparator.length)
    }

    return str
  }
}

export default { Parameter, FormatOption }
