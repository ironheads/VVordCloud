import {getNormalizedFontSizeRatio } from '../../utils/FontCalculate';
import { getNormalizedAspect } from '../../utils/AspectCalculate';
import { Function_cast } from '../../utils/BaseOps';
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

        }

    }
}