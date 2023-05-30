import BN from 'bn.js';
import { IntArray } from "../interfaces/IntArray";
export default class Tools {
    static getReverseShiftedId: (id: number, event: any) => number;
    static reverseShift: (tokenId: number, offset: number, start: number, end: number) => number;
    static findRevealRangeForN(tokenId: number, reveals: any): number;
    static shiftAndFilterRevealedTokens(tokenJson: any, reveals: any): any;
    static lengthToUintEncoder(length: number): number;
    static stringSplitter(myString: string, chunkSize: number): any[];
    static NewIntArray(max: number): IntArray;
    static AddToIntArray(outputBuffer: IntArray, val: BN): void;
}
