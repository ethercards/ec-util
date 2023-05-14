export interface TokenCollectionSpecs {
    tokenStart: number;
    tokenEnd: number;
    tokenCount: number;
    SideCount: number;
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
    values: number[];
    minVal?: number;
    maxVal?: number;
}
