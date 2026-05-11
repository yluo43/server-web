/**
 * Created by PanJiaChen on 16/11/18.
 */

import request from "@/utils/request";
import Vue from 'vue'
import CryptoJS from '@/utils/crypto-js/crypto-js'
/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

export function validatelogin(username, password) {

  const key = CryptoJS.enc.Utf8.parse('2020081720200817') // 十六位十六进制数作为密钥
  const iv = CryptoJS.enc.Utf8.parse("2020081720200817"); //十六位十六进制数作为密钥偏移量
  let encrypted = CryptoJS.AES.encrypt(password, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  password = encrypted.toString();
  const data = {
    username,
    password
  }
  return request({
    url: '/login',
    method: 'post',
    params:data
  }).then(result => {
    if (result.data.code === 0) {
      this.$message.success("锁屏校验成功")
      this.$cookie.set('token', result.data.token,1)
      this.$parent.hide();
    }else{
      this.$message.error("密码或验证码校验失败")
    }
  })
}


// 解密方法
function Decrypt(word) {
  var encryptedHexStr = CryptoJS.enc.Hex.parse(word);
  var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  let decrypt = CryptoJS.AES.decrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
  return decryptedStr.toString()
}

// 加密方法
function Encrypt(word) {
  let encrypted = CryptoJS.AES.encrypt(word, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}
