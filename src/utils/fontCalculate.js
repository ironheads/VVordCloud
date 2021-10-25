// 字体属性计算
export { getNormalizedFontSizeRatio }
// 计算变化后的字体属性
function getNormalizedFontSizeRatio (value) {
  value = Math.abs(value)
  return value > 1 ? 1 / value : value
}
