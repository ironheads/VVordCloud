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

  let getLeft = () => { return Math.ceil((_minLeft + _maxRight) / 2) }
  let getTop = () => { return Math.ceil((_minTop + _maxBottom) / 2) }
  let getWidth = () => { return _maxRight - _minLeft }
  let getHeight = () => { return _maxBottom - _minTop }
  let getBounds = () => {
    return {
      left: getLeft(),
      top: getTop(),
      width: getWidth(),
      height: getHeight()
    }
  }

  let put = (pixels, x, y) => {
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

  let canPut = (pixels,x,y) => {
    pixels.every(
      ([pixelX,pixelY]) => {
        let posX = x+pixelX
        let posY= y+pixelY
        return !_pixels[`(${posX},${posY})`]
      }
    )
  }

  let findPosition = ()
}

self.addEventListener('message', initialize)
