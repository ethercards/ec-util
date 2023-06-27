
/*
 * source       https://github.com/ethercards/ec-util/
 * @name        EC
 * @package     ECUtil
 * @author      Micky Socaci <micky@galaxis.xyz>
 * @license     MIT
 */
import BN from 'bn.js';
import Tools from '../utils/Tools'
import {TokenCollectionSpecs, Side, Layer} from '../interfaces/TokenSpecs'
import {IntArray} from '../interfaces/IntArray'

export default class VisualTraits {

    public encodeVisualLayerData(tokenJson: any, tokenSpecs: TokenCollectionSpecs, _howManyTokens: number|string = "ALL"): IntArray[] {
        
        let tokensToProcess: number = 0;
        if(_howManyTokens === "ALL") {
            tokensToProcess = tokenJson.length;
        } else if(typeof _howManyTokens === "number") {
            tokensToProcess = _howManyTokens;
        } else {
            throw new Error("Invalid _howManyTokens value: (" + _howManyTokens + ") type = " + typeof _howManyTokens );
        }


       
        const outputs: any = [];
        // for each side create a new int array
        for(let i = 0; i < tokenSpecs.SideCount; i++) {
            outputs[i] = Tools.NewIntArray(tokenSpecs.sides[i].bitlength);
        }

        // Each token in array
        for(let i = 0; i < tokensToProcess; i++) {
            
            if( tokenJson[i] !== "undefined") {
                const token = tokenJson[i];

                // Each side of the token
                // for(let sidej = 0; sidej < token.sides.length; sidej++) {
                for(let sidej = 0; sidej < tokenSpecs.SideCount; sidej++) {

                    let value = new BN(0);
                    let shift = 0;

                    // split string by 2 chars ( hex )
                    const splitDNA = Tools.stringSplitter(token.sides[sidej].dna, 2);

                    // console.log("splitDNA", splitDNA);
                    for(let layery = 0; layery < splitDNA.length; layery++) {

                        let DNAVariantValue: BN;
                        if(tokenSpecs.SideDNAEncodingIsHEX) {
                            // get DNA Variant value and add 0x so js can properly convert hex to number
                            DNAVariantValue = new BN(Number("0x"+splitDNA[layery]));
                        } else {
                            DNAVariantValue = new BN(parseInt( splitDNA[layery] )); 
                        }
                        // encoder bitlength
                        const bitlength = tokenSpecs.sides[sidej].layers[layery].bitlength;
                        const shiftedValue = DNAVariantValue.shln(shift);
                        shift+= bitlength;
                        value = value.add(shiftedValue);
                    }

                    // console.log();
                    // console.log("Tools.AddToIntArray(outputs[sidej], value); -- START")
                    // for (let i = 0; i < outputs[sidej].Data.length; i++) {
                    //     console.log("[o:"+i+"]", outputs[sidej].Data[i].toString(2).padStart(256, '0'));
                    // }
                    // console.log("value", value.toString(2).padStart( tokenSpecs.sides[sidej].bitlength, '0'));

                    Tools.AddToIntArray(outputs[sidej], value);

                    // for (let i = 0; i < outputs[sidej].Data.length; i++) {
                    //     console.log("[o:"+i+"]", outputs[sidej].Data[i].toString(2).padStart(256, '0'));
                    // }
                    // console.log("Tools.AddToIntArray(outputs[sidej], value); -- END")
                }
                // sides
            }
        }

        const HEXoutputs: any = [];
        // convert everything to HEX
        for(let i = 0; i < tokenSpecs.SideCount; i++) {
            HEXoutputs[i] = {
                bitPos: outputs[i].bitPos,
                maxBits: outputs[i].maxBits,
                DataCount: outputs[i].DataCount,
                Data: []
            };
            for(let j = 0; j < outputs[i].Data.length; j++) {
                HEXoutputs[i].Data.push("0x"+outputs[i].Data[j].toString("hex"));
            }
        }
        return HEXoutputs;
    }
}