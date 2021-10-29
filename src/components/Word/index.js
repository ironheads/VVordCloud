import { getNormalizedFontSizeRatio } from '@/utils/FontCalculate'
import { getNormalizedAspect } from '@/utils/AspectCalculate'
import { castFunction, isString, isArray, isFunction, isObject, isUndefined } from '@/utils/BasicOps'
import BoundingWord from '@/utils/BoundingWord'

export default {
  get (context) {
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

    fontSizeRatio = getNormalizedFontSizeRatio(fontSizeRatio)
    const elementAspect = getNormalizedAspect([elementWidth, elementHeight])
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
                  return loadFont(
                    のfontFamily,
                    のfontStyle,
                    のfontWeight,
                    のtext
                  )
                }
              )
            )
        }).then(
          () => {
            words = words.filter(({ のtextWidth }) => { return のtextWidth > 0 })
              .sort((a, b) => { return b.のweight - a.のweight })
            if (words.length > 0) {
              const biggestWord = words[0]
              const smallestWord = words[words.length - 1]
              const minWeight = biggestWord.のweight
              const maxWeight = smallestWord.のweight
              // TODO: different ways to change weights
              words.forEach(word => {
                word.のweight = (word.のweight - minWeight + 1)
              })

            }
          }

        )
    }
  }
}
