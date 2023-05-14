
/*
 * source       https://github.com/ethercards/ec-util/
 * @name        EC
 * @package     ECUtil
 * @author      Micky Socaci <micky@galaxis.xyz>
 * @license     MIT
 */

import Tools from '../utils/Tools'
import {TokenCollectionSpecs, Side, Layer} from '../interfaces/TokenSpecs'

export default class TokenSpecs {

    public static generateTokenCollectionSpecs(tokenJson: any, dnaInHex: boolean = false, keepLayerValues = false): TokenCollectionSpecs {
        
        if( tokenJson[0]=== null) {
            tokenJson.shift();
        }

        const specs: TokenCollectionSpecs = {
            tokenStart: 0,
            tokenEnd: 0,
            tokenCount: 0,
            SideCount: tokenJson[0].sides.length,
            SideDNAEncodingIsHEX: dnaInHex,
            tokenBitlength: 0,
            totalBitlength: 0,
            sides: []
        }; 

        const LayerVariants: any = [];

        // Each token in array
        for(let i = 0; i < tokenJson.length; i++) {
            
            const token = tokenJson[i];
            // Each side of the token
            for(let sidej = 0; sidej < token.sides.length; sidej++) {

                // split string by 2 chars ( hex )
                const splitDNA = Tools.stringSplitter(token.sides[sidej].dna, 2);

                for(let layery = 0; layery < splitDNA.length; layery++) {
                    let DNAVariantValue = 0;
                    if(dnaInHex) {
                        // get DNA Variant value and add 0x so js can properly convert hex to number
                        DNAVariantValue = Number("0x"+splitDNA[layery]);
                    } else {
                        DNAVariantValue = parseInt( splitDNA[layery] ); 
                    }
                    
                    // index distinct value for side
                    if(typeof LayerVariants[sidej] === "undefined") {
                        LayerVariants[sidej] = <Side>{
                            id: sidej.toString(),
                            name: "Side "+sidej.toString(),
                            bitlength: 0,
                            layers: []
                        };
                    }

                    if(typeof LayerVariants[sidej].layers[layery] === "undefined") {
                        LayerVariants[sidej].layers[layery] = <Layer>{
                            id: layery.toString(),
                            name: "Side "+sidej+" / Layer "+layery.toString(),
                            bitlength: 0,
                            values: []
                        };

                    }

                    if (!LayerVariants[sidej].layers[layery].values.some((e: any) => e.id === DNAVariantValue)) {
                        LayerVariants[sidej].layers[layery].values.push({
                            "id": DNAVariantValue,
                            "label": ""
                        });
                    }

                    // if(!LayerVariants[sidej].layers[layery].values.includes(DNAVariantValue)) {

                    // }
                }
            }
            // sides
        }

        // sort our LayerVariants
        // each side
        let tokenBitlength = 0;
        for(let i = 0; i < LayerVariants.length; i++) {
            let SideBitLength = 0;
            // each layer
            for(let y = 0; y < LayerVariants[i].layers.length; y++) {
                // sort ASC
                LayerVariants[i].layers[y].values = LayerVariants[i].layers[y].values.sort(function (a: any, b: any): number {  return a.id - b.id;  });

                // take max value ( last in array )
                const minVal = LayerVariants[i].layers[y].values[0].id;
                const maxVal = LayerVariants[i].layers[y].values[LayerVariants[i].layers[y].values.length-1].id;

                // set min / max
                LayerVariants[i].layers[y].minVal = minVal;
                LayerVariants[i].layers[y].maxVal = maxVal;
                
                // set layer bitLength
                LayerVariants[i].layers[y].bitlength = Tools.lengthToUintEncoder(maxVal);

                // current layer bitlength add to side bitLength
                SideBitLength+= LayerVariants[i].layers[y].bitlength;

                if(!keepLayerValues) {
                    // unset values as we no longer need them
                    LayerVariants[i].layers[y].values = [];
                }
            }

            LayerVariants[i].bitlength = SideBitLength;
            tokenBitlength+= SideBitLength;
            
        }

        let sortedTokenJson = JSON.parse(JSON.stringify(tokenJson))
        sortedTokenJson.sort(function (a: any, b: any): number {  return a.tokenId - b.tokenId;  });

        // figure out lowest token id and highest token id
        specs.tokenStart = sortedTokenJson[0].tokenId;
        specs.tokenEnd = sortedTokenJson[sortedTokenJson.length-1].tokenId;
        specs.tokenCount = specs.tokenEnd - specs.tokenStart + 1;

        specs.tokenBitlength = tokenBitlength;
        specs.totalBitlength = tokenBitlength * specs.tokenCount;

        specs.sides = LayerVariants;

        return specs;
    }

}