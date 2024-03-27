/**
 *********************************通用数组工具类*****************************************
 */

/**
 *******基本数组校验部分********
 */
/**
 * 判断一个数组是否为空
 * @param arr 判断的数据
 * @returns {boolean} 是否为空
 */
export const isNotEmpty = (arr) => {
  return Array.isArray(arr) && arr.length > 0
}

/**
 *******数组转换字符串部分*********
 */
/**
 * 将对象中指定数组成员（单个）转换为使用指定符号拼接的字符串
 * 注意：转换为对原对象原成员进行转换
 * @param data 欲转换的对象
 * @param arrName 指定成员名
 * @param delimiter 拼接分隔符，默认英文逗号
 */
export const changeDataArrToStr = (data, arrName, delimiter = ',') => {
  let arr = data[arrName]
  if (isNotEmpty(arr)) {
    data[arrName] = arr.join(delimiter)
  }
}

/**
 * 将一个对象中指定的数组成员（多个）转换为使用指定符号拼接的字符串
 * 注意：转换为对原对象原成员进行转换
 * @param data 欲转换的对象
 * @param arrNameList 指定成员名列表
 * @param delimiter 拼接分隔符，默认英文逗号
 */
export const changeDataArrListToStr = (data, arrNameList = [], delimiter = ',') => {
  arrNameList.forEach((item) => changeDataArrToStr(data, item, delimiter))
}

/**
 * 将一个对象中所有的数组成员转换为使用指定符号拼接的字符串
 * @param data 指定的对象
 * @param delimiter 拼接分隔符，默认英文逗号
 */
export const changeDataAllArrEntriesToStr = (data, delimiter = ',') => {
  Object.entries(data)
    .filter(([key, value]) => Array.isArray(value))
    .forEach(([key, value]) => changeDataArrToStr(data, key, delimiter))
}
