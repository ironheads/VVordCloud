import { getNormalizedFontSizeRatio } from '@/utils/FontCalculate'
import { getNormalizedAspect } from '@/utils/AspectCalculate'
import { Function_cast, String_is, Array_is, Function_is, Object_is, Undefined_is } from '@/utils/BasicOps'
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
      ratationUnit,
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
      const getDefaultText = Function_cast(text)
      const getDefaultWeight = Function_cast(weight)
      const getDefaultRotation = Function_cast(rotation)
      const getDefaultRotationUnit = Function_cast(rotationUnit)
      const getDefaultFontFamily = Function_cast(fontFamily)
      const getDefaultFontWeight = Function_cast(fontWeight)
      const getDefaultFontVariant = Function_cast(fontVariant)
      const getDefaultFontStyle = Function_cast(fontStyle)
      const getDefaultColor = Function_cast(color)
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
          if (String_is(word)) {
            text = word
          } else if (Array_is(word)) {
            [text, weight] = word
          } else if (Object_is(word)) {
            ({ text, weight, rotation, rotationUnit, fontFamily, fontWeight, fontVariant, fontStyle, color } = word)
          }
        }
        if (Undefined_is(text)) {
          text = getDefaultText(word, index, words)
        }
        if (Undefined_is(weight)) {
          weight = getDefaultWeight(word, index, words)
        }
        if (Undefined_is(rotation)) {
          rotation = getDefaultRotation(word, index, words)
        }
        if (Undefined_is(rotationUnit)) {
          rotationUnit = getDefaultRotationUnit(word, index, words)
        }
        if (Undefined_is(fontFamily)) {
          fontFamily = getDefaultFontFamily(word, index, words)
        }
        if (Undefined_is(fontWeight)) {
          fontWeight = getDefaultFontWeight(word, index, words)
        }
        if (Undefined_is(fontVariant)) {
          fontVariant = getDefaultFontVariant(word, index, words)
        }
        if (Undefined_is(fontStyle)) {
          fontStyle = getDefaultFontStyle(word, index, words)
        }
        if (Undefined_is(color)) {
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
    }
  }
}
