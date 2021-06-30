
/**
 * @description 此文件用于AES数据加密
 * @author WZW
 * @date 2020-07-21 16:41:00
 * @version V1.0
*/

import CryptoJS from 'crypto-js'
import pako from 'pako'

import * as check from '@/utils/validate'

/**
 * @functionName encrypt
 * @description  加密
 * @param { String } word 需要加密的字符串;因此对象需要先转化为字符串
 * @param { String } keyStr 用到的16位字符串的key
 * @return { String } 加密后的字符串
 * @author WZW
 * @date 2020-07-21 16:30:01
 * @version V1.0
*/
function encrypt (word, keyStr) {
  if (!check.isString(word)) {
    return word
  }
  keyStr = keyStr || 'abcdefgabcdefg12'
  let key = CryptoJS.enc.Utf8.parse(keyStr)// Latin1 w8m31+Yy/Nw6thPsMpO5fg==
  let srcs = CryptoJS.enc.Utf8.parse(word)
  let encrypted = CryptoJS.AES.encrypt(srcs, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7})
  return encrypted.toString()
}

/**
 * @functionName decrypt
 * @description 解密
 * @param { String } word 需要解密的字符串
 * @param { String } keyStr 用到的16位字符串的key
 * @return { String } 解密后的字符串
 * @author WZW
 * @date 2020-07-21 16:30:08
 * @version V1.0
*/
function decrypt (word, keyStr) {
  if (!check.isString(word)) {
    return word
  }
  keyStr = keyStr || 'abcdefgabcdefg12'
  var key = CryptoJS.enc.Utf8.parse(keyStr)// Latin1 w8m31+Yy/Nw6thPsMpO5fg==
  var decrypt = CryptoJS.AES.decrypt(word, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7})
  return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}

// 压缩
function gzip (str) {
  // escape(str)  --->压缩前编码，防止中文乱码
  var binaryString = pako.gzip(escape(str), { to: 'string' })
  return binaryString
}

function ungzip (key) {
  // 将二进制字符串转换为字符数组
  var charData = key.split('').map(function (x) { return x.charCodeAt(0) })
  // console.log('压缩后的文件大小:', charData.join(','))

  // 将数字数组转换成字节数组
  var binData = new Uint8Array(charData)

  // 解压
  var data = pako.inflate(binData)

  // 将GunZip ByTAREAR转换回ASCII字符串
  key = String.fromCharCode.apply(null, new Uint16Array(data))

  // unescape(str)  --->解压后解码，防止中文乱码
  return unescape(key)
}

export { encrypt, decrypt, ungzip, gzip }
