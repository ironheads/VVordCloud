export { getNormalizedAspect }

// 计算页面变化后画布（Figure）的大小
function getNormalizedAspect ([width, height]) {
  if (width > height) {
    return [1, height / width]
  }
  if (height > width) {
    return [width / height, 1]
  }
  return [1, 1]
}
