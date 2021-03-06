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
          ???word: word,
          ???weight: weight,
          ???color: color
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
                  ???fontFamily,
                  ???fontStyle,
                  ???fontWeight,
                  ???text
                }) => {
                  // console.log('new word')
                  return loadFont(
                    ???fontFamily,
                    ???fontStyle,
                    ???fontWeight,
                    ???text
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
            // console.log('finish word map')
            words = words.filter(({ ???textWidth }) => { return ???textWidth > 0 })
              .sort((a, b) => { return b.???weight - a.???weight })
            if (words.length > 0) {
              const biggestWord = words[0]
              const smallestWord = words[words.length - 1]
              const maxWeight = biggestWord.???weight
              const minWeight = smallestWord.???weight
              words.forEach(word => {
                word.???fontSize = Math.ceil((word.???weight - minWeight) / 3) * renderingFontSize + renderingFontBase
              })

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
                              currentWord.???padding = spacing
                              return workerCall(wordPositionWorker, { name: 'wordPosition', args: [currentWord.???imagePixels, currentWord.???imageLeft, currentWord.???imageTop] })
                            }
                          )
                          .then(
                            (data) => {
                              const posX = data[0]
                              const posY = data[1]
                              ++progress.completedWords
                              currentWord.???imageLeft = posX
                              currentWord.???imageTop = posY
                              currentWord.???padding = 0
                              return workerCall(wordPositionWorker, { name: 'put', args: [currentWord.???imagePixels, currentWord.???imageLeft, currentWord.???imageTop] })
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
                    if (width > 0 && height > 0) {
                      const scaleFactor = Math.min(elementWidth / width, elementHeight / height)
                      words.forEach(
                        (word) => {
                          word.???left -= left
                          word.???top -= top
                          word.???fontSize *= scaleFactor
                        }
                      )
                    }
                    return words.map(
                      (
                        {
                          ???word: word,
                          ???text: text,
                          ???weight: weight,
                          ???rotation: rotation,
                          ???fontFamily: fontFamily,
                          ???fontWeight: fontWeight,
                          ???fontVariant: fontVariant,
                          ???fontStyle: fontStyle,
                          ???font: font,
                          ???left: left,
                          ???top: top,
                          ???color: color
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
