import Cookies from 'js-cookie'

const TokenKey = 'JSESSIONID'
const chineseName = 'eb-cbm-chineseName'
const userID = 'eb-cbm-userID'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}


//用户中文名
export function getCName() {
  return Cookies.get(chineseName)
}

export function setCName(chineseNameParam) {
  return Cookies.set(chineseName, chineseNameParam)
}

export function removeCName() {
  return Cookies.remove(chineseName)
}

//用户id
export function getUserID() {
  return Cookies.get(userID)
}

export function setUserID(userIDParam) {
  return Cookies.set(userID, userIDParam)
}

export function removeUserID() {
  return Cookies.remove(userID)
}

