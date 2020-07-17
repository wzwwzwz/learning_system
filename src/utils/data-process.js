/**
 * @description 此文件用于处理后台数据
 * @author 巫昭雯
 * @date 2020-07-15 17:34:39
 * @version V1.0
*/
import store from '@/store/index.js'
import * as check from './validate'

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
   * @description 设置字串参数
   * @method setParams
   * @for RequestParams
   * @param { String } rqsName 请求名
   * @return { Boolean } false === 格式错误
  **/
  setParams (key, val) {
    this._PARAMS.push(val)
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
}

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
