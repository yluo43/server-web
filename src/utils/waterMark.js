let watermark = {}

let setWatermark = (str) => {
  let id = '1.23452384164.123412415'

  if (document.getElementById(id) !== null) {
    document.body.removeChild(document.getElementById(id))
  }

  let can = document.createElement('canvas')
  can.width = 250
  can.height = 250

  let cans = can.getContext('2d')
  cans.rotate(-20 * Math.PI / 180)
  cans.font = '15px Vedana'
  cans.fillStyle = '#dddddd'
  cans.textAlign = 'left'
  cans.textBaseline = 'Middle'
  cans.fillText(str, can.width / 20, can.height)

  let div = document.createElement('div')
  div.id = id
  div.style.pointerEvents = 'none'
  div.style.top = '0px'
  div.style.left = '0px'
  div.style.position = 'fixed'
  div.style.zIndex = '100000'
  div.style.width = document.documentElement.clientWidth  + 'px'
  div.style.height = document.documentElement.clientHeight + 'px'
  div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat'
  document.body.appendChild(div)
  return id
}

// 添加水印方法
export const setWaterMark = (str1, str2) => {
  let id = setWatermark(str1, str2)
  if (document.getElementById(id) === null) {
    id = setWatermark(str1, str2)
  }
}
// 该方法只允许调用一次
watermark.set = (str) => {
  let id = setWatermark(str)
  setInterval(() => {
    if (document.getElementById(id) === null) {
      id = setWatermark(str)
    }
  }, 2000)
  window.onresize = () => {
    setWatermark(str)
  }
}

// 移除水印方法
export const removeWatermark = () => {
  const id = '1.23452384164.123412415'
  if (document.getElementById(id) !== null) {
    document.body.removeChild(document.getElementById(id))
  }
}
