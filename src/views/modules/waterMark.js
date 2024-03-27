// 水印js
/**  水印添加方法  */
const setWatermark = (str1, str2) => {
  const id = '1.23452384164.123412415'

  if (document.getElementById(id) !== null) {
    // 如果该id的dom存在，则删除该dom
    document.getElementById('water-mark-show').removeChild(document.getElementById(id))
  }
  // 获取左侧树的宽度left-tree
  let width = document.getElementById('left-tree').clientWidth
  //  制作水印画布
  const can = makeWaterMark(str1, str2)
  // 创建一个div
  const div = document.createElement('div')
  div.id = id
  div.style.pointerEvents = 'none'
  div.style.top = '85px'
  div.style.left = width + 'px'
  div.style.opacity = '0.15'
  div.style.position = 'fixed'
  div.style.zIndex = '2100'
  div.style.width = document.documentElement.clientWidth + 'px'
  div.style.height = document.documentElement.clientHeight + 'px'
  //  设置div的宽和高
  // div.style.width = document.documentElement.clientWidth + 'px'
  // div.style.height = document.documentElement.clientHeight + 'px'
  // 将制作的水印画布设置为该dom的背景
  div.style.background = 'url(' + can.toDataURL('image/png') + ')'
  if (document.getElementById('water-mark-show')) {
    document.getElementById('water-mark-show').appendChild(div)
  }
  return id
}
// 制作水印
export const makeWaterMark = (str1,str2) => {
  const can = document.createElement('canvas')
  if (str1 === 'noPdf') {
    can.width = document.body.clientWidth
    can.height = document.body.clientHeight
  } else if (str1 === 'pdf') {
    can.width = 850
    can.height = 1200
  }
  // 重置位置translate()
  const cans = can.getContext('2d')
  cans.rotate((-20 * Math.PI) / 160) // 水印旋转角度
  cans.font = '13px Vedana' //  水印的字体大小
  cans.textAlign = 'center' //  水印的位置
  cans.textBaseline = 'middle'
  if (str1 === 'noPdf') {
    cans.fillStyle = '#A9B3BC' //  水印的字体颜色
  } else if (str1 === 'pdf') {
    cans.fillStyle = 'rgba(0, 0, 0, 0.10)' //  水印的字体颜色
  }
  for (let i = 1500; i > -can.width * 0.5; i -= 195) {
    for (let j = 0; j < can.height * 1.5; j += 195) {
      // cans.translate(0,0)
      // 填充文字，x 间距, y 间距
      if (i % 2 !== 0) {
        cans.fillText(str2, i, j + 80)
      } else {
        cans.fillText(str2, i, j)
      }
    }
  }
  return can
}
// 添加水印方法
export const setWaterMark = (str1, str2) => {
  let id = setWatermark(str1, str2)
  if (document.getElementById(id) === null) {
    id = setWatermark(str1, str2)
  }
}

// 移除水印方法
export const removeWatermark = () => {
  const id = '1.23452384164.123412415'
  if (document.getElementById(id) !== null) {
    document.getElementById('water-mark-show').removeChild(document.getElementById(id))
  }
}
