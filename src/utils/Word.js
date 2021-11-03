import { getNormalizedFontSizeRatio } from '@/utils/FontCalculate'
import { getNormalizedAspect } from '@/utils/AspectCalculate'
import { castFunction, isString, isArray, isFunction, isObject, isUndefined, workerCall } from '@/utils/BasicOps'
import BoundingWord from '@/utils/BoundingWord'
import PutWord from '@/utils/PutWord'

const renderingFontSize = 4
const renderingFontBase = 4
export default {
  get () {
    // console.log('try to get Word')
    let {
      elementWidth,
      elementHeight,
      words,
      text,
      weight,
      rotation,
      rotationUnit,
      fontFamily,
      fontWeight,
      fontVariant,
      fontStyle,
      color,
      spacing,
      fontSizeRatio,
      createCanvas,
      loadFont,
      createWorker
    } = this
    // console.log(words)

    fontSizeRatio = getNormalizedFontSizeRatio(fontSizeRatio)
    const elementAspect = getNormalizedAspect([elementWidth, elementHeight])
    // console.log(elementWidth)
    // console.log(elementHeight)
    // console.log(elementAspect)
    if (elementHeight > 0 && elementWidth > 0) {
      const getDefaultText = castFunction(text)
      const getDefaultWeight = castFunction(weight)
      const getDefaultRotation = castFunction(rotation)
      const getDefaultRotationUnit = castFunction(rotationUnit)
      const getDefaultFontFamily = castFunction(fontFamily)
      const getDefaultFontWeight = castFunction(fontWeight)
      const getDefaultFontVariant = castFunction(fontVariant)
      const getDefaultFontStyle = castFunction(fontStyle)
      const getDefaultColor = castFunction(color)
      words = words.map((word, index) => {
        let text
        let weight
        let rotation
        let rotationUnit
        let fontFamily

        let fontWeight
        let fontVariant
        let fontStyle
        let color
        if (word) {
          if (isString(word)) {
            text = word
          } else if (isArray(word)) {
            [text, weight] = word
          } else if (isObject(word)) {
            ({ text, weight, rotation, rotationUnit, fontFamily, fontWeight, fontVariant, fontStyle, color } = word)
          }
        }
        if (isUndefined(text)) {
          text = getDefaultText(word, index, words)
        }
        if (isUndefined(weight)) {
          weight = getDefaultWeight(word, index, words)
        }
        if (isUndefined(rotation)) {
          rotation = getDefaultRotation(word, index, words)
        }
        if (isUndefined(rotationUnit)) {
          rotationUnit = getDefaultRotationUnit(word, index, words)
        }
        if (isUndefined(fontFamily)) {
          fontFamily = getDefaultFontFamily(word, index, words)
        }
        if (isUndefined(fontWeight)) {
          fontWeight = getDefaultFontWeight(word, index, words)
        }
        if (isUndefined(fontVariant)) {
          fontVariant = getDefaultFontVariant(word, index, words)
        }
        if (isUndefined(fontStyle)) {
          fontStyle = getDefaultFontStyle(word, index, words)
        }
        if (isUndefined(color)) {
          color = getDefaultColor(word, index, words)
        }
        const boundingWord = new BoundingWord(
          text,
          (() => {
            switch (rotationUnit) {
              case 'turn':
                return rotation * 2 * Math.PI
              case 'deg':
                return rotation * 2 * Math.PI / 360
            }
            return rotation
          })(),
          fontFamily,
          fontWeight,
          fontVariant,
          fontStyle,
          createCanvas
        )
        Object.assign(boundingWord, {
          のword: word,
          のweight: weight,
          のcolor: color
        })
        return boundingWord
      })
      // console.log('finish Bounding Word')
      // console.log(words)
      return Promise
        .resolve()
        .then(() => {
          return Promise
            .all(
              words.map(
                ({
                  のfontFamily,
                  のfontStyle,
                  のfontWeight,
                  のtext
                }) => {
                  // console.log('new word')
                  return loadFont(
                    のfontFamily,
                    のfontStyle,
                    のfontWeight,
                    のtext
                  )
                }
              )
            )
        })
        .catch((err) => {
          console.log('load error: ', err)
          return []
        })
        .then(
          () => {
            console.log('finish word map')
            words = words.filter(({ のtextWidth }) => { return のtextWidth > 0 })
              .sort((a, b) => { return b.のweight - a.のweight })
            if (words.length > 0) {
              const biggestWord = words[0]
              const smallestWord = words[words.length - 1]
              const maxWeight = biggestWord.のweight
              const minWeight = smallestWord.のweight
              // TODO: different ways to change weights
              words.forEach(word => {
                word.のfontSize = Math.ceil((word.のweight - minWeight) / 3) * renderingFontSize + renderingFontBase
              })

              // (AsyncComputed also need to try)
              // console.log(PutWord.toString())
              const wordPositionWorker = createWorker(PutWord)
              // const wordPositionWorker = new Worker(PutWord)
              const progress = {
                completedWords: 0,
                totalWords: words.length
              }
              return Promise
                .resolve()
                .then(
                  () => {
                    this.progress = progress
                    return workerCall(wordPositionWorker, { name: 'setAspect', args: [elementAspect] })
                      .then(() => { return workerCall(wordPositionWorker, { name: 'clear' }) })
                      .then(() => { console.log('worker call success') })
                  }
                )
                .then(
                  () => {
                    // ++progress.completedWords
                    // console.log(progress.completedWords)
                    // console.log(words)
                    let promise = Promise.resolve()
                    words.forEach(
                      (currentWord, index) => {
                        // console.log(index)
                        promise = promise
                          .then(
                            () => {
                              currentWord.のpadding = spacing
                              // let result = workerCall(wordPositionWorker, { name: 'wordPosition', args: [currentWord.のimagePixels, currentWord.のimageLeft, currentWord.のimageTop] })
                              // console.log(currentWord.のimagePixels)
                              // console.log(currentWord.のimageTop)
                              // console.log(currentWord.のimageLeft)
                              // console.log('before')
                              // console.log(currentWord.のimagePixels.length)
                              return workerCall(wordPositionWorker, { name: 'wordPosition', args: [currentWord.のimagePixels, currentWord.のimageLeft, currentWord.のimageTop] })
                            }
                          )
                          .then(
                            (data) => {
                              // console.log('get data')
                              // console.log(data)
                              const posX = data[0]
                              const posY = data[1]
                              // const [posX, posY] = data
                              ++progress.completedWords
                              // console.log(progress.completedWords)
                              currentWord.のimageLeft = posX
                              currentWord.のimageTop = posY
                              currentWord.のpadding = 0
                              // console.log('after')
                              // console.log(currentWord.のimagePixels.length)
                              return workerCall(wordPositionWorker, { name: 'put', args: [currentWord.のimagePixels, currentWord.のimageLeft, currentWord.のimageTop] })
                            }
                          )
                      }
                    )
                    return promise
                  }
                )
                .then(
                  () => {
                    return workerCall(wordPositionWorker, { name: 'getBounds' })
                  }
                ).then(
                  ({ left, top, width, height }) => {
                    // console.log(left)
                    // console.log(top)
                    // console.log(width)
                    // console.log(height)
                    if (width > 0 && height > 0) {
                      const scaleFactor = Math.min(elementWidth / width, elementHeight / height)
                      words.forEach(
                        (word) => {
                          word.のleft -= left
                          word.のtop -= top
                          word.のfontSize *= scaleFactor
                        }
                      )
                    }
                    // const keys = new Set()
                    return words.map(
                      (
                        {
                          のword: word,
                          のtext: text,
                          のweight: weight,
                          のrotation: rotation,
                          のfontFamily: fontFamily,
                          のfontWeight: fontWeight,
                          のfontVariant: fontVariant,
                          のfontStyle: fontStyle,
                          のfont: font,
                          のleft: left,
                          のtop: top,
                          のcolor: color
                        }
                      ) => {
                        const key = JSON.stringify([
                          text,
                          fontFamily,
                          fontWeight,
                          fontVariant,
                          fontStyle
                        ])
                        // console.log(key)
                        // keys.add(key)
                        return {
                          key,
                          word,
                          text,
                          weight,
                          rotation,
                          font,
                          color,
                          left,
                          top
                        }
                      }
                    )
                  }
                )
                .catch((err) => {
                  console.log('cope word error: ', err)
                  return []
                })
                .finally(
                  () => {
                    wordPositionWorker.terminate()
                    // console.log(words)
                  }
                )
                .finally(
                  () => {
                    this.progress = null
                  }
                )
            }
          }
        )
    }
    return []
  },

  default: () => {
    return []
  }
}
