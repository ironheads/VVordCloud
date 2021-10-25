import { CeilDivisible, Undefined_is } from './basicOps'

export default class boundingWord {
  constructor (
    text,
    rotation,
    fontFamily,
    fontWeight,
    fontVariant,
    fontStyle,
    createCanvas
  ) {
    this.のtext = text
    this.のrotation = rotation
    this.のfontFamily = fontFamily
    this.のfontVariant = fontVariant
    this.のfontStyle = fontStyle
    this.のcreateCanvas = createCanvas
    this.の_fontSize = 1
    this.の_padding = 0
    this.のrelativeLeft = 0
    this.のrelativeTop = 0
  }

  get のfontSize () {
    return this.の_fontSize
  }

  set のfontSize (value) {
    if (this.のfontSize !== value) {
      this.の_fontSize = value
      this.の_imageData = undefined
    }
  }

  get のfont () {
    return boundingWord.getFont(
      this.のfontStyle,
      this.のfontVariant,
      this.のfontWeight,
      this.のfontSize,
      this.のfontFamily
    )
  }

  get のrelativeTextWidth () {
    if (Undefined_is(this.の_relativeTextWidth)) {
      this.の_relativeTextWidth = boundingWord.getTextWidth(
        this.のtext,
        boundingWord.getFont(
          this.のfontStyle,
          this.のfontVariant,
          this.のfontWeight,
          1,
          this.のfontFamily
        ),
        this.のcreateCanvas
      )
    }
  }

  get のtextWidth () {
    return this.のrelativeTextWidth * this.のfontSize
  }

  get のleft () {
    return this.のrelativeLeft * this.のfontSize
  }

  set のleft (value) {
    this.のrelativeLeft = value / this.のfontSize
  }

  get のtop () {
    return this.のrelativeTop * this.のfontSize
  }

  set のtop (value) {
    this.のrelativeTop = value / this.のfontSize
  }

  get のboundingBoxWidth () {
    return boundingWord.getBoundingBoxWidth(
      this.のtextWidth,
      this.のfontSize,
      this.のrotation
    )
  }

  get のboundingBoxHeight () {
    return boundingWord.getBoundingBoxHeight(
      this.のtextWidth,
      this.のfontSize,
      this.のrotation
    )
  }

  get のboundingBoxLeft () {
    return this.のleft - this.のboundingBoxWidth / 2
  }

  get のboundingBoxTop () {
    return this.のtop - this.のboundingBoxHeight / 2
  }

  get のpadding () {
    return this.の_padding
  }

  set のpadding (value) {
    if (this.の_padding !== value) {
      this.の_padding = value
      this.の_imageData = undefined
    }
  }

  get のimageData () {
    if (this.の_imageData === undefined) {
      this.の_imageData = boundingWord.getImageData(
        this.のtext,
        this.のfontStyle,
        this.のfontVariant,
        this.のfontWeight,
        this.のfontSize,
        this.のfontFamily,
        this.のpadding,
        this.のrotation,
        this.のcreateCanvas
      )
    }
    return this.の_imageData
  }

  get のimagePixels () {
    return this.のimageData[0]
  }

  get のimageWidth () {
    return this.のimageData[1]
  }

  get のimageHeight () {
    return this.のimageData[2]
  }

  get のimageLeftShift () {
    return this.のimageData[3]
  }

  get のimageTopShift () {
    return this.のimageData[4]
  }

  get のimageLeft () {
    return Math.ceil(this.のleft) - this.のimageLeftShift
  }

  set のimageLeft (value) {
    this.のleft = value + this.のimageLeftShift
  }

  get のimageTop () {
    return Math.ceil(this.のtop) - this.のimageTopShift
  }

  set のimageTop (value) {
    this.のtop = value + this.のimageTopShift
  }

  static getFont (fontStyle, fontVariant, fontWeight, fontSize, fontFamily) {
    return [fontStyle, fontVariant, fontWeight, `${fontSize}px`, fontFamily].join(' ')
  }

  static getTextWidth (text, font, createCanvas) {
    const canvas = createCanvas()
    const ctx = canvas.getContext('2d')
    ctx.font = font
    return ctx.measureText(text).width
  }

  static getBoundingBoxWidth (width, height, rotation) {
    return Math.ceil((width * Math.abs(Math.cos(rotation)) + height * Math.abs(Math.sin(rotation))))
  }

  static getBoundingBoxHeight (width, height, rotation) {
    return Math.ceil((width * Math.abs(Math.sin(rotation)) + height * Math.abs(Math.cos(rotation))))
  }

  static getImageData (
    text,
    fontStyle,
    fontVariant,
    fontWeight,
    fontSize,
    fontFamily,
    padding,
    rotation,
    createCanvas
  ) {
    const pixelSize = 4
    fontSize *= pixelSize
    const font = boundingWord.getFont(
      fontStyle,
      fontVariant,
      fontWeight,
      fontSize,
      fontFamily
    )
    const textWidth = boundingWord.getBoundingBoxWidth(text, font, createCanvas)
    const textHeight = fontSize
    const lineWidth = padding * fontSize * 2
    const boxWidth = lineWidth + textWidth
    const boxHeight = lineWidth + textHeight
    const canvas = createCanvas()
    const ctx = canvas.getContext('2d')
    const canvasWidth = CeilDivisible(
      boundingWord.getBoundingBoxWidth(
        boxWidth,
        boxHeight,
        rotation
      ),
      pixelSize
    )
    const canvasHeight = CeilDivisible(
      boundingWord.getBoundingBoxHeight(
        boxWidth,
        boxHeight,
        rotation
      ),
      pixelSize
    )
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    ctx.translate(canvasWidth / 2, canvasHeight / 2)
    ctx.rotate(rotation)
    ctx.font = font
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, 0, 0)
    if (lineWidth > 0) {
      ctx.miterLimit = 1
      ctx.lineWidth = lineWidth
      ctx.strokeText(text, 0, 0)
    }
    const image = ctx.getImageData(0, 0, canvasWidth, canvasHeight).data
    const imagePixels = []
    let minPixelLeft = Infinity
    let maxPixelLeftWidth = 0
    let minPixelTop = Infinity
    let maxPixelTopHeight = 0
    const pixelLeftWidth = canvasWidth / pixelSize
    const pixelTopHeight = canvasHeight / pixelSize
    for (let pixelLeft = 0; pixelLeft < pixelLeftWidth; ++pixelLeft) {
      for (let pixelTop = 0; pixelTop < pixelTopHeight; ++pixelTop) {
        // eslint-disable-next-line no-labels
        offsetLoop:
        for (let offsetLeft = 0; offsetLeft < pixelSize; ++offsetLeft) {
          for (let offsetTop = 0; offsetTop < pixelSize; ++offsetTop) {
            const canvasLeft = pixelLeft * pixelSize + offsetLeft
            const canvasTop = pixelTop * pixelSize + offsetTop
            if (image[(canvasWidth * canvasTop + canvasLeft) * 4 + 3]) {
              imagePixels.push([pixelLeft, pixelTop])
              minPixelLeft = Math.min(pixelLeft, minPixelLeft)
              maxPixelLeftWidth = Math.max(pixelLeft + 1, maxPixelLeftWidth)
              minPixelTop = Math.min(pixelTop, minPixelTop)
              maxPixelTopHeight = Math.max(pixelTop + 1, maxPixelTopHeight)
              // eslint-disable-next-line no-labels
              break offsetLoop
            }
          }
        }
      }
    }
    if (imagePixels.length > 0) {
      return [
        imagePixels.map(([pixelLeft, pixelTop]) => [pixelLeft - minPixelLeft, pixelTop - minPixelTop]),
        maxPixelLeftWidth - minPixelLeft,
        maxPixelTopHeight - minPixelTop,
        Math.ceil(pixelLeftWidth / 2) - minPixelLeft,
        Math.ceil(pixelTopHeight / 2) - minPixelTop
      ]
    }
    return [imagePixels, 0, 0, 0, 0]
  }
}
