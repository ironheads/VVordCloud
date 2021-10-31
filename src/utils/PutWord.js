export default function () {
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
  // console.log('worker created')
  const getCenterX = () => {
    // console.log('get X')
    return Math.ceil((_minLeft + _maxRight) / 2)
  }
  const getCenterY = () => {
    return Math.ceil((_minTop + _maxBottom) / 2)
  }
  const getWidth = () => {
    return _maxRight - _minLeft
  }
  const getHeight = () => {
    return _maxBottom - _minTop
  }
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
    // console.log('in put word')
    // console.log(pixels.length)
    pixels.forEach(
      (data) => {
        const pixelX = data[0]
        const pixelY = data[1]
        // console.log(pixelX)
        const posX = x + pixelX
        const posY = y + pixelY
        _pixels[`(${posX},${posY})`] = true
        _minLeft = Math.min(_minLeft, posX)
        _maxRight = Math.max(posX + 1, _maxRight)
        _minTop = Math.min(_minTop, posY)
        _maxBottom = Math.max(posY + 1, _maxBottom)
      }
    )
    // console.log('out put word')
  }

  function canPut (pixels, x, y) {
    // console.log('in canput')
    const result = pixels.every(
      (data) => {
        const posX = x + data[0]
        const posY = y + data[1]
        return !_pixels[`(${posX},${posY})`]
      }
    )
    return result
    // console.log(result)
  }

  function findPosition (pixelX, pixelY, testPut) {
    // console.log('try to get position')
    // console.log(pixelX)
    // console.log(pixelY)
    // let [pixelX, pixelY] = _data
    const aspectWidth = _aspect[0]
    const aspectHeight = _aspect[1]

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
    // console.log(stepX)
    // console.log(stepY)
    const testPosition = [pixelX, pixelY]
    // console.log(testPosition)
    // console.log('OK')
    if (testPut(testPosition)) {
      // console.log('find position')
      return testPosition
    }
    // console.log('out testPut')
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
    // console.log('find position')
    // console.log(pixels[12])
    // console.log(WordCenterX)
    // console.log(WordCenterY)
    // console.log(findPosition)
    const X = WordCenterX + getCenterX()
    const Y = WordCenterY + getCenterY()
    // console.log(X)
    // console.log(Y)
    const result = findPosition(
      X, Y,
      (data) => {
        // console.log('in testPut')
        // console.log(data[1])
        return canPut(pixels, data[0], data[1])
      }

    )
    // console.log('get result')
    return result
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
}
