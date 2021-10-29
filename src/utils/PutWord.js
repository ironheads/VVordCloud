
let _aspect = [1, 1]
let _pixels
let _minLeft
let _maxRight
let _minTop
let _maxBottom

const clear = () => {
  _pixels = {}
  _minLeft = 0
  _maxRight = 0
  _minTop = 0
  _maxBottom = 0
}

clear()

const getCenterX = () => { return Math.ceil((_minLeft + _maxRight) / 2) }
const getCenterY = () => { return Math.ceil((_minTop + _maxBottom) / 2) }
const getWidth = () => { return _maxRight - _minLeft }
const getHeight = () => { return _maxBottom - _minTop }
const getBounds = () => {
  return {
    left: getCenterX(),
    top: getCenterY(),
    width: getWidth(),
    height: getHeight()
  }
}

const setAspect = (aspect) => {
  _aspect = aspect
  return {}
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

const findPosition = ([pixelX, pixelY], testPut) => {
  const [aspectWidth, aspectHeight] = _aspect
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

const wordPosition = (pixels, WordCenterX, WordCenterY) => {
  return findPosition(
    [WordCenterX + getCenterX(), WordCenterY + getCenterY()],
    ([x, y]) => {
      return canPut(pixels, x, y)
    }
  )
}

self.addEventListener(
  'message',
  (event) => {
    self.postMessage(
      {
        getBounds,
        put,
        setAspect,
        wordPosition,
        clear
      }[event.data.name]
        .apply(null, event.data.args)
    )
  }
)
