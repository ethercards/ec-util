
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
            throw new Error("Invalid _howManyTokens value: (" + _howManyTokens + ")");
        }

        if( tokenJson[0]=== null) {
            tokenJson.shift();
        }
       
        const outputs: any = [];
        // for each side create a new int array
        for(let i = 0; i < tokenSpecs.SideCount; i++) {
            outputs[i] = Tools.NewIntArray(tokenSpecs.sides[i].bitlength);
        }

        // Each token in array
        for(let i = 0; i < tokensToProcess; i++) {
            
            const token = tokenJson[i];
            let value = new BN(0);
            let shift = 0;

            // Each side of the token
            for(let sidej = 0; sidej < token.sides.length; sidej++) {

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
                Tools.AddToIntArray(outputs[sidej], value);
            }
            // sides
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