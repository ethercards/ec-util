
/*
 * source       https://github.com/ethercards/ec-util/
 * @name        EC
 * @package     ECUtil
 * @author      Micky Socaci <micky@galaxis.xyz>
 * @license     MIT
 */

export interface TokenCollectionSpecs {
    tokenStart: number;
    tokenEnd: number;
    tokenCount: number;
    SideCount: number;              // number of sides the tokens have
    SideDNAEncodingIsHEX: boolean;
    tokenBitlength: number;
    totalBitlength: number;
    sides: Side[];
}

export interface Side {
    id: string;
    name: string;
    bitlength: number;
    layers: Layer[];
}

export interface Layer {
    id: string;
    name: string;
    bitlength: number;
    values: LayerValue[];
    minVal?: number;
    maxVal?: number;
}

export interface LayerValue {
    id: number;
    label: string;
    path: string;
}