const initialize = (event) => {
  const _aspect = event.data
  let _pixels
  let _minLeft
  let _maxRight
  let _minTop
  let _maxBottom

  const clear = () => {
    _pixels = {}
    _minLeft = Infinity
    _maxRight = 0
    _minTop = Infinity
    _maxBottom = 0
  }

  clear()

  const getLeft = () => { return Math.ceil((_minLeft + _maxRight) / 2) }
  const getTop = () => { return Math.ceil((_minTop + _maxBottom) / 2) }
  const getWidth = () => { return _maxRight - _minLeft }
  const getHeight = () => { return _maxBottom - _minTop }
  const getBounds = () => {
    return {
      left: getLeft(),
      top: getTop(),
      width: getWidth(),
      height: getHeight()
    }
  }

  const put = (pixels, x, y) => {
    pixels.forEach(
      ([pixelX, pixelY]) => {
        const posX = x + pixelX
        const posY = y + pixelY
        _pixels[`(${posX},${posY})`] = true
        _minLeft = Math.min(_minLeft, posX)
        _maxRight = Math.max(posX + 1, _maxRight)
        _minTop = Math.min(_minTop, posY)
        _maxBottom = Math.max(posY + 1, _maxBottom)
      }
    )
  }

  const canPut = (pixels, x, y) => {
    pixels.every(
      ([pixelX, pixelY]) => {
        const posX = x + pixelX
        const posY = y + pixelY
        return !_pixels[`(${posX},${posY})`]
      }
    )
  }

  let findPosition = ([aspectWidth, aspectHeight], [pixelX, pixelY], testPut) => {
    let stepX, stepY
    if (aspectWidth > aspectHeight) {
      stepX = 1
      stepY = aspectHeight / aspectWidth
    } else if (aspectWidth < aspectHeight) {
      stepX = aspectWidth / aspectHeight
      stepY = 1
    } else {
      stepX = 1
      stepY = 1
    }
    const testPosition = [pixelX, pixelY]
    if (testPut(testPosition)) {
      return testPosition
    }
    let minX = pixelX
    let maxX = pixelX
    let minY = pixelY
    let maxY = pixelY
    while (true) {
      minX -= stepX
      maxX += stepX
      minY -= stepY
      maxY += stepY
      for (let x = minX; x < maxX; ++x) {
        const testPosition = [x, minY]
        if (testPut(testPosition)) {
          return testPosition
        }
      }
      for (let y = minY; y < maxY; ++y) {
        const testPosition = [maxX, y]
        if (testPut(testPosition)) {
          return testPosition
        }
      }
      for (let x = maxX; x > minX; --x) {
        const testPosition = [x, maxY]
        if (testPut(testPosition)) {
          return testPosition
        }
      }
      for (let y = maxY; y > minY; --y) {
        const testPosition = [minX, y]
        if (testPut(testPosition)) {
          return testPosition
        }
      }
    }
  }
}

self.addEventListener('message', initialize)
