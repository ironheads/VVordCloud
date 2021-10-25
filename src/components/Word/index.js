import {getNormalizedFontSizeRatio } from '../../utils/FontCalculate';
import { getNormalizedAspect } from '../../utils/AspectCalculate';
import { Function_cast ,String_is, Array_is, Function_is, Object_is, Undefined_is} from '../../utils/BaseOps';

export default {
    get(context) {
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
			createWorker,
        } = this;
        
        fontSizeRatio=getNormalizedFontSizeRatio(fontSizeRatio);
        let elementAspect =  getNormalizedAspect([elementWidth,elementHeight]);
        if (elementHeight> 0 && elementWidth > 0){
            let getDefaultText = Function_cast(text);
			let getDefaultWeight = Function_cast(weight);
			let getDefaultRotation = Function_cast(rotation);
			let getDefaultRotationUnit = Function_cast(rotationUnit);
			let getDefaultFontFamily = Function_cast(fontFamily);
			let getDefaultFontWeight = Function_cast(fontWeight);
			let getDefaultFontVariant = Function_cast(fontVariant);
			let getDefaultFontStyle = Function_cast(fontStyle);
			let getDefaultColor = Function_cast(color);
            words = words.map((word, index) => {
                let text;
				let weight;
				let rotation;
				let rotationUnit;
				let fontFamily;
				let fontWeight;
				let fontVariant;
				let fontStyle;
                let color;
                if (word) {
                    if (String_is(word)) {
                        text = word;
                    } else if (Array_is(word)) {
                        [text, weight] = word;
                    } else if (Object_is(word)) {
                        ({text, weight, rotation, rotationUnit, fontFamily, fontWeight, fontVariant, fontStyle, color} = word);
                    }
                }
                if (Undefined_is(text)) {
                    text = getDefaultText(word, index, words);   
                }
                if (Undefined_is(weight)) {
                    weight = getDefaultWeight(word, index, words);
                }
                if (Undefined_is(rotation)) {
                    rotation = getDefaultRotation(word, index, words);
                }
                if (Undefined_is(rotationUnit)) {
                    rotationUnit = getDefaultRotationUnit(word, index, words);
                }
                if (Undefined_is(fontFamily)) {
                    fontFamily = getDefaultFontFamily(word, index, words);
                }
                if (Undefined_is(fontWeight)) {
                    fontWeight = getDefaultFontWeight(word, index, words);
                }
                if (Undefined_is(fontVariant)) {
                    fontVariant = getDefaultFontVariant(word, index, words);
                }
                if (Undefined_is(fontStyle)) {
                    fontStyle = getDefaultFontStyle(word, index, words);
                }
                if (Undefined_is(color)) {
                    color = getDefaultColor(word, index, words);
                }
            } )

        }

    }
}