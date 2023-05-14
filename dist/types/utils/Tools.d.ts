import BN from 'bn.js';
import { IntArray } from "../interfaces/IntArray";
export default class Tools {
    static lengthToUintEncoder(length: number): number;
    static stringSplitter(myString: string, chunkSize: number): any[];
    static NewIntArray(max: number): IntArray;
    static AddToIntArray(outputBuffer: IntArray, val: BN): void;
}
