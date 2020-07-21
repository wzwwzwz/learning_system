/**
 * @description 此文件用于处理后台数据
 * @author 巫昭雯
 * @date 2020-07-15 17:34:39
 * @version V1.0
*/
import store from '@/store/index.js'
import * as check from './validate'
import { encrypt, decrypt } from '@/utils/encryption'

/********************************************************************
* @description 构造请求参数格式明
* @class RequestParams
* @author 巫昭雯
* @constructor
* @param { String } rqsName 请求名
*******************************************************************/
class RequestParams {
  // var FUNC = ""
  constructor (rqsName = '') {
    this._FUNC = rqsName
    this._USER = store.state.userInfo.userName
    this._PARAMS = []
    // 解密数据
    this._DECRYPTDATA = ''
  }

  /**
   * @description 设置方法名
   * @method setFunc
   * @for RequestParams
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
   * @for RequestParams
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
   * @for RequestParams
   * @return { Object } 参数字串
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
   * @for RequestParams
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
   * @description 设置加密数据
   * @method setDecryptData
   * @for RequestParams
   * @param { String }  str参数名 加密后的字符串
   * @return { Boolean } false === 设置不成功
  **/
  setDecryptData (str) {
    if (!check.isString(str)) {
      return false
    }

    this._DECRYPTDATA = str

    if (str !== '') {
      let arr = []
      try {
        arr = JSON.parse(decrypt(str))
      } catch (error) {
        return false
      }

      this._FUNC = arr.FUNC
      this._USER = arr.USER
      this._PARAMS = arr.PARAMS
    }
  }

  /**
   * @description 获取json字串的Params属性值
   * @method getParams
   * @for RequestParams
   * @return { Array } Params的数组(对象属性转化为小写)
  **/
  getParams () {
    let res = []
    let arr = this._PARAMS

    for (let [idx, obj] of arr.entries()) {
      let newObj = {}
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          console.log(idx, obj)
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
   * @for RequestParams
   * @return { String } 函数名
  **/
  getFunc () {
    return this._FUNC
  }

  /**
   * @description 获取用户key
   * @method getUser
   * @for RequestParams
   * @return { 返回值类型 } 用户key
  **/
  getUser () {
    return this._USER
  }
}

/********************************************************************
 * @description 格式化下拉框选项
 * @class FormatOption
 * @author 巫昭雯
 * @constructor
 * @param { String } nodes 初始化节点
*******************************************************************/
class FormatOption {
  constructor () {
    this.a = ''
  }

  toArr (str) {
    if (!check.isString(str)) {
      return false
    }

    let arr = []

    if (str.indexOf('<br/>') !== -1) {
      str.split('<br/>').forEach((item, idx) => {
        arr.push({
          key: String.fromCharCode(65 + idx),
          value: item
        })
        // console.log(item, idx)
      })
      return arr
    }
  }
  toStr (arr) {
    if (!check.isArray(arr)) {
      return false
    }
  }
}

export default { RequestParams, FormatOption }
